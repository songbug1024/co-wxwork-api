// 本文件用于wechat API，基础文件，主要用于Token的处理和mixin机制
const axios = require('axios')
const AccessToken = require('./access-token')
const Ticket = require('./ticket')

class API {
  /**
   * 构造函数
   * @param config Object api配置信息
   *         企业自建应用：corpId（企业ID），corpSecret（企业密钥）
   *         企业套件：suiteId（套件ID），suiteSecret（套件密钥）
   *         企业套件应用：suiteApi（企业套件API实例），authCorpId（授权企业ID）
   *         服务商：corpId（企业ID），providerSecret（服务商密钥）
   *         baseURL：企业微信url基础路径，默认为：https://qyapi.weixin.qq.com/cgi-bin/
   *         accessTokenKey：在url中的access_token的键名，默认为‘access_token’，套件为‘suite_access_token’，服务商为‘provider_access_token’
   * @param async getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
   * @param async saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
   */
  constructor (config, getToken, saveToken) {
    this.config = config

    this.getToken = getToken || async function () {
      return this.store
    }
    this.saveToken = saveToken || async function (token) {
      this.store = token
      if (process.env.NODE_ENV === 'production') {
        console.warn('Don\'t save token in memory, when cluster or multi-computer!')
      }
    }

    this.axiosInstance = axios.create({
      baseURL: config.baseURL || 'https://qyapi.weixin.qq.com/cgi-bin/',
      timeout: 12000,
      headers: {
        common: {
          'Content-Type': 'application/json'
        }
      }
    })

    // set default js ticket handle
    this.registerTicketHandle()
  }

  /**
   * 发送一个API请求
   * @param opts axios request options
   * @param retry 重新尝试请求次数 默认3
   * @returns {Promise.<TResult>}
   */
  async request (opts, retry = 3) {
    if (typeof opts === 'string') opts = {url: opts}
    opts = Object.assign({
      method: 'get'
    }, opts)

    if (!opts.ignoreAccessToken) {
      const token = await this.ensureAccessToken()

      if (!opts.params) opts.params = {}
      opts.params[this.config.accessTokenKey || 'access_token'] = token.accessToken
    } else {
      delete opts.ignoreAccessToken
    }

    return this.axiosInstance.request(opts).then(async (res) => {
      if (res.status < 200 || res.status > 204) {
        const err = new Error(`url: ${opts.url}, status code: ${res.status}`)
        err.name = 'WxWorkAPIError'
        return Promise.reject(err)
      }

      const {errcode, errmsg} = res.data
      if (!errcode) {
        delete res.data.errcode
        delete res.data.errmsg
        return res.data
      }

      if (errcode === 40001 && retry > 0) {
        // 销毁已过期的token
        await this.saveToken(null)

        // 重新尝试请求
        return this.request(opts, retry - 1)
      } else {
        const err = new Error(errmsg)
        err.name = 'WxWorkAPIError'
        err.code = errcode

        return Promise.reject(err)
      }
    }, (error) => {
      let errcode = 500
      let errmsg = '未知错误'

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errcode = error.response.status
        errmsg = error.response.data.errcode !== 'undefined' ? '服务器内部错误' : error.response.data
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        errcode = 408
        errmsg = '请求超时，请检查网络'
      } else if (typeof error.errcode === 'undefined') {
        // Something happened in setting up the request that triggered an Error
        errcode = 400
        errmsg = '请求失败，请稍后再试'
      }

      const err = new Error(errmsg)
      err.name = 'WxWorkAPIError'
      err.code = errcode

      return Promise.reject(err)
    })
  }

  /**
   * 生成access_token的方法，需要被重写，需要返回Promise({access_token, expires_in})格式数据
   * @returns {Promise.<{access_token, expires_in}>}
   */
  async resolveAccessToken () {
    throw new Error('Method must be overridden')
  }

  /*!
   * 获取API调用时需要使用到的access_token
   */
  async getAccessToken () {
    const {expires_in, access_token} = await this.resolveAccessToken()
    // 过期时间，因网络延迟等，将实际过期时间提前10秒，以防止临界点
    const expireTime = (new Date().getTime()) + (expires_in - 10) * 1000
    const token = new AccessToken(access_token, expireTime)

    await this.saveToken({accessToken: token.accessToken, expireTime: token.expireTime})
    return token
  }

  /**
   * 封装access_token存在、过期状态确认的逻辑
   */
  async ensureAccessToken () {
    // 调用用户传入的获取token的异步方法，获得token之后使用（并缓存它）。
    const token = await this.getToken()
    let accessToken

    if (token && (accessToken = new AccessToken(token.accessToken, token.expireTime)).isValid()) {
      return accessToken
    }
    return this.getAccessToken()
  }

  /**
   * 注册处理ticket的函数
   * @param getTicketToken 获取外部ticketToken的函数
   * @param saveTicketToken 存储外部ticketToken的函数
   */
  registerTicketHandle (getTicketToken, saveTicketToken) {
    if (!getTicketToken && !saveTicketToken) this.ticketStore = {} // 初始化

    this.getTicketToken = getTicketToken || async function (type) {
      return this.ticketStore[type]
    }
    this.saveTicketToken = saveTicketToken || async function (type, ticketToken) {
      this.ticketStore[type] = ticketToken

      if (process.env.NODE_ENV === 'production') {
        console.warn('Dont save ticket in memory, when cluster or multi-computer!')
      }
    }
  }

  /**
   * 生成ticket的方法，需要被重写，需要返回Promise({ticket, expires_in})格式数据
   * @returns {Promise.<{ticket, expires_in}>}
   */
  async resolveTicket (type) {
    throw new Error('Method must be overridden')
  }

  /**
   * 获取ticket
   * @param type ticket类型
   * @returns {Promise.<*>}
   */
  async getTicket (type) {
    const {expires_in, ticket} = await this.resolveTicket(type)

    // 过期时间，因网络延迟等，将实际过期时间提前10秒，以防止临界点
    const expireTime = (new Date().getTime()) + (expires_in - 10) * 1000
    const ticketToken = new Ticket(ticket, expireTime)
    await this.saveTicketToken(type, ticketToken)
    return ticketToken
  }

  /**
   * 封装ticket存在、过期状态确认的逻辑
   * @param type ticket类型
   * @returns {Promise.<*>}
   */
  async ensureTicket (type) {
    const ticketToken = await this.getTicketToken(type)

    if (ticketToken && new Ticket(ticketToken.ticket, ticketToken.expireTime).isValid()) {
      return ticketToken
    } else {
      return this.getTicket(type)
    }
  }
}

module.exports = API
