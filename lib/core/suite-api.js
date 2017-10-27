const API = require('./api')
const Ticket = require('./ticket')

/**
 * 企业套件API
 */
class SuiteAPI extends API {
  /**
   * 根据suiteId和suiteSecret创建SuiteAPI的构造函数
   * @param {String} suiteId 企业的套件ID
   * @param {String} suiteSecret 企业的套件ID对应的密钥
   * @param {async} getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
   * @param {async} saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
   */
  constructor (suiteId, suiteSecret, getToken, saveToken) {
    super({
      suiteId,
      suiteSecret,
      accessTokenKey: 'suite_access_token'
    }, getToken, saveToken)
  }

  /**
   * 获取企业微信Suite的access_token的
   * @returns {Promise.<TResult>}
   */
  async resolveAccessToken () {
    const ticketToken = await this.getTicketToken('suite')
    if (!ticketToken || !new Ticket(ticketToken.ticket, ticketToken.expireTime).isValid()) {
      const err = new Error('Suite ticket is invalid.')
      err.name = 'WxWorkSuiteAPIError'
      throw err
    }

    const {suiteId, suiteSecret} = this.config
    return this.request({
      method: 'post',
      url: 'service/get_suite_token',
      data: {
        suite_id: suiteId,
        suite_secret: suiteSecret,
        suite_ticket: ticketToken.ticket
      },
      ignoreAccessToken: true
    }).then(({suite_access_token, expires_in}) => {
      return {
        access_token: suite_access_token,
        expires_in
      }
    })
  }

  /**
   *
   * @param type
   * @returns {Promise.<null>}
   */
  async resolveTicket (type) {
    if (type === 'suite') {
      // 套件的ticket是由微信服务器推送过来的
      throw new Error('Suite ticket could not resolve')
    }
    return Promise.resolve(null)
  }
}

module.exports = SuiteAPI
