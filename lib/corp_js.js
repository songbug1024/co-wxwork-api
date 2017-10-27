const Util = require('./util')

/**
 * 获取jsapi_ticket
 * https://work.weixin.qq.com/api/doc#10029/附录1-JS-SDK使用权限签名算法
 */
exports.getJsApiTicket = function () {
  return this.request('get_jsapi_ticket')
}

/**
 * 获取企业微信JS SDK Config的所需参数
 *
 * 注意事项
 *
 * 1. 签名用的noncestr和timestamp必须与wx.config中的nonceStr和timestamp相同。
 * 2. 签名用的url必须是调用JS接口页面的完整URL。
 * 3. 出于安全考虑，开发者必须在服务器端实现签名的逻辑。
 * Examples:
 * ```
 * var param = {
 *  debug:false,
 *  jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
 *  url: 'http://www.xxx.com'
 * };
 * var result = await api.getJsConfig(param);
 * ```
 *
 * @param {Object} param 参数
 */
exports.getJsConfig = async function ({debug, url, jsApiList}) {
  const ticketToken = await this.ensureTicket('jsapi')

  const nonceStr = Util.createNonceStr()
  const timestamp = Util.createTimestamp()
  const signature = Util.sign({
    jsapi_ticket: ticketToken.ticket,
    noncestr: nonceStr,
    timestamp,
    url
  })

  return {
    beta: true,
    debug,
    appId: this.config.corpId,
    timestamp,
    nonceStr,
    signature,
    jsApiList
  }
}
