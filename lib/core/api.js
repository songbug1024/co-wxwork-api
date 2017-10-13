// 本文件用于wechat API，基础文件，主要用于Token的处理和mixin机制
const axios = require('axios')
const AccessToken = require('./access-token')
const Ticket = require('./ticket')

class API {
  /**
   * 构造函数
   * @param config api配置信息
   *         企业应用：corpId，corpSecret
   *         企业套件：suiteId，suiteSecret
   *         其他：baseURL、timeout
   * @param getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
   * @param saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
   */
  constructor (config, getToken, saveToken) {
    this.config = config
    this.store = null

    this.getToken = getToken || async function () {
      return this.store
    }
    this.saveToken = saveToken || async function (token) {
      this.store = token
      if (process.env.NODE_ENV === 'production') {
        console.warn('Don\'t save token in memory, when cluster or multi-computer!')
      }
    }

    this.instance = axios.create({
      baseURL: config.baseURL || 'https://qyapi.weixin.qq.com/cgi-bin/',
      timeout: config.timeout || 20000,
      headers: {
        'Content-Type': 'application/json'
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
      if (!opts.params) opts.params = {}
      const token = await this.ensureAccessToken()
      opts.params[this.config.accessTokenKey || 'access_token'] = token.accessToken
    } else {
      delete opts.ignoreAccessToken
    }

    console.log('API request: ', opts)

    return this.instance.request(opts).then(async (res) => {
      if (res.status < 200 || res.status > 204) {
        const err = new Error(`url: ${opts.url}, status code: ${res.status}`)
        err.name = 'WxWorkAPIError'
        return Promise.reject(err)
      }

      console.log('API request success: ', res.data)

      const {errcode, errmsg} = res.data
      if (!errcode) return Object.assign({}, res.data, {errcode: undefined, errmsg: undefined})

      if (errcode === 40001 && retry > 0) {
        // 销毁已过期的token
        await this.saveToken(null)
        return this.request(opts, retry - 1)
      } else {
        const err = new Error(errmsg)
        err.name = 'WxWorkAPIError'
        err.code = errcode
        return Promise.reject(err)
      }
    }, (error) => {
      console.log('API request error: ', error)

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
   * 获取access_token的方法，需要被重写
   */
  async resolveAccessToken () {
    throw new Error('Method must be overridden')
  }

  /*!
   * 根据创建API时传入的appid和corpsecret获取access token
   * 进行后续所有API调用时，需要先获取access token
   * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=获取access_token> * 应用开发者无需直接调用本API。 * Examples:
   * ```
   * var token = await api.getAccessToken();
   * ```
   * - `err`, 获取access token出现异常时的异常对象
   * - `result`, 成功时得到的响应结果 * Result:
   * ```
   * {"access_token": "ACCESS_TOKEN","expires_in": 7200}
   * ```
   */
  async getAccessToken () {
    const {expires_in, access_token} = await this.resolveAccessToken()

    // 过期时间，因网络延迟等，将实际过期时间提前10秒，以防止临界点
    const expireTime = (new Date().getTime()) + (expires_in - 10) * 1000
    const token = new AccessToken(access_token, expireTime)
    await this.saveToken(token)
    return token
  }

  /*!
   * 需要access token的接口调用如果采用preRequest进行封装后，就可以直接调用。
   * 无需依赖getAccessToken为前置调用。
   * 应用开发者无需直接调用此API。
   * Examples:
   * ```
   * await api.ensureAccessToken();
   * ```
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
   * 获取ticket的方法，需要被重写
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
   * 确认ticket
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

  /**
   * 用于支持对象合并。将对象合并到API.prototype上，使得能够支持扩展
   * Examples:
   * ```
   * // 媒体管理（上传、下载）
   * API.mixin(require('./lib/api_media'));
   * ```
   * @param {Object} obj 要合并的对象
   */
  static mixin (obj) {
    for (let key in obj) {
      if (API.prototype.hasOwnProperty(key)) {
        throw new Error('Don\'t allow override existed prototype method. method: ' + key)
      }
      API.prototype[key] = obj[key]
    }
  }
}

module.exports = API
