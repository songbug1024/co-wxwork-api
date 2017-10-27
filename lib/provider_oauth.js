/**
 * 使用auth_code获取登录用户信息
 * https://work.weixin.qq.com/api/doc#10991/获取登录用户信息
 * @param {String} authCode 授权时微信返回的auth_code
 */
exports.getLoginInfo = async function (authCode) {
  return this.request({
    method: 'post',
    url: 'service/get_login_info',
    data: {
      auth_code: authCode
    }
  })
}
