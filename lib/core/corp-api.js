const API = require('./api')

class CorpAPI extends API {
  /**
   * 根据corpId和corpSecret创建API的构造函数
   * CorpID是企业号的标识，每个企业号拥有一个唯一的CorpID；Secret是管理组凭证密钥。
   * 系统管理员可通过管理端的权限管理功能创建管理组，分配管理组对应用、通讯录的访问权限。
   * 完成后，管理组即可获得唯一的secret。
   * 系统管理员可通过权限管理查看所有管理组的secret，其他管理员可通过设置中的开发者凭据查看。
   * 当企业应用调用企业号接口时，企业号后台为根据此次访问的AccessToken,校验访问的合法性以及所对应的管理组的管理权限以返回相应的结果。
   * 注：你应该审慎配置管理组的权限，够用即好，权限过大会增加误操作可能性及信息安全隐患。
   * 如需跨进程跨机器进行操作Wechat API（依赖access token），access token需要进行全局维护
   * 使用策略如下：
   * 1. 调用用户传入的获取token的异步方法，获得token之后使用
   * 2. 使用corpid/corpsecret获取token。并调用用户传入的保存token方法保存 * Tips: * - 如果跨机器运行wechat模块，需要注意同步机器之间的系统时间。 * Examples:
   * ```
   * var CorpAPI = require('co-wxwork-api').CorpAPI;
   * var api = new CorpAPI('corpId', 'corpSecret');
   * ```
   * 以上即可满足单进程使用。
   * 当多进程时，token需要全局维护，以下为保存token的接口。
   * 以下的例子使用了文本文件，实际使用中建议放到数据库中。
   * saveToken 方法接受的参数数据结构： { accessToken: 'aJvlZe6Q_vpYfdTFXWCSbJ7mVuMSXKvVGJU7BNy1wWBVE_41yOTM-ZE-axbsjNxWIWraYoOyJbcqIeyVpBHWtg' }
   * getToken 方法要保证返回的数据结构同上。
   *
   * ```
   * var api = new CorpAPI('corpId', 'corpSecret', async function () {
 *   // 传入一个获取全局token的方法
 *   var txt = await fs.readFile('access_token.txt', 'utf8');
 *   return JSON.parse(txt);
 * }, async function (token) {
 *   // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
 *   // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
 *   await fs.writeFile('access_token.txt', JSON.stringify(token));
 * });
   * ```
   * @param {String} corpId 企业号的 corpid
   * @param {String} corpSecret 在公众平台上申请得到的corpsecret
   * @param {async} getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
   * @param {async} saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
   */
  constructor (corpId, corpSecret, getToken, saveToken) {
    super({
      corpId,
      corpSecret
    }, getToken, saveToken)
  }

  /**
   * 获取企业微信access_token的
   * @returns {Promise.<TResult>}
   */
  async resolveAccessToken () {
    const {corpId, corpSecret} = this.config

    return this.request({
      url: 'gettoken',
      params: {
        corpid: corpId,
        corpsecret: corpSecret
      },
      ignoreAccessToken: true
    })
  }

  /**
   * 获取企业微信ticket
   * @param {String} type 类型
   * @returns {Promise.<TResult>}
   */
  async resolveTicket (type) {
    if (type === 'jsapi') {
      return this.getJsApiTicket()
    }
    return Promise.resolve(null)
  }
}

module.exports = CorpAPI
