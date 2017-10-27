const API = require('./api')

/**
 * 服务商API
 */
class ProviderAPI extends API {
  /**
   * 根据corpId和corpSecret创建API的构造函数
   * @param {String} corpId 企业ID
   * @param {String} providerSecret 企业ID对应的服务商密钥
   * @param {async} getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
   * @param {async} saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
   */
  constructor (corpId, providerSecret, getToken, saveToken) {
    super({
      corpId,
      providerSecret,
      accessTokenKey: 'provider_access_token'
    }, getToken, saveToken)
  }

  /**
   * 获取企业微信服务商access_token
   * @returns {Promise.<TResult>}
   */
  async resolveAccessToken () {
    const {corpId, providerSecret} = this.config

    return this.request({
      method: 'post',
      url: 'service/get_provider_token',
      data: {
        corpid: corpId,
        provider_secret: providerSecret
      },
      ignoreAccessToken: true
    }).then(({provider_access_token, expires_in}) => {
      return {
        access_token: provider_access_token,
        expires_in
      }
    })
  }

  /**
   * 获取企业微信服务商ticket
   * @param {String} type 类型
   * @returns {Promise.<TResult>}
   */
  async resolveTicket (type) {
    return Promise.resolve(null)
  }
}

module.exports = ProviderAPI
