const CorpAPI = require('./corp-api')

/**
 * 企业套件应用API
 */
class SuiteCorpAPI extends CorpAPI {
  /**
   * 根据suiteApi、authCorpId和permanentCode创建套件应用API的构造函数
   * @param {SuiteAPI} suiteApi 当前应用对应的企业套件API实例
   * @param {String} authCorpId 当前套件授权的企业ID
   * @param {String} permanentCode 当前套件在企业授权之后换取到的永久码
   * @param {async} getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
   * @param {async} saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
   */
  constructor (suiteApi, authCorpId, permanentCode, getToken, saveToken) {
    super(authCorpId, '', getToken, saveToken)

    this.suiteApi = suiteApi
    this.config.permanentCode = permanentCode
  }

  /**
   * 获取企业微信套件应用的access_token
   * @returns {Promise.<TResult>}
   */
  async resolveAccessToken () {
    const {corpId, permanentCode} = this.config
    return this.suiteApi.getCorpToken(corpId, permanentCode)
  }
}

module.exports = SuiteCorpAPI
