const querystring = require('querystring')

/**
 * 获取授权页面的URL地址
 * @param {String} redirect 授权后要跳转的地址
 * @param {String} state 开发者可提供的数据
 * @param {String} scope 作用范围，值为snsapi_userinfo和snsapi_base，前者用于弹出，后者用于跳转
 */
exports.getAuthorizeURL = function (redirect, state, scope) {
  const url = 'https://open.weixin.qq.com/connect/oauth2/authorize'
  const info = {
    appid: this.config.corpid,
    redirect_uri: redirect,
    response_type: 'code',
    scope: scope || 'snsapi_base',
    agentid: this.config.agentid,
    state: state || ''
  }

  return url + '?' + querystring.stringify(info) + '#wechat_redirect'
}

/**
 * 根据Code获取用户ID
 * @param {String} code OAuth授权获取的code
 */
exports.getUserIdByCode = async function (code) {
  return this.request({
    url: 'user/getuserinfo',
    params: {
      code
    }
  })
}

/**
 * 根据Ticket获取用户信息
 * @param {String} ticket getUserIdByCode获取的user_ticket
 */
exports.getUserInfoByTicket = async function (ticket) {
  return this.request({
    method: 'post',
    url: 'user/getuserdetail',
    data: {
      user_ticket: ticket
    }
  })
}