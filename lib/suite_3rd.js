/**
 * 获取预授权码
 * 该API用于获取预授权码。预授权码用于企业授权时的第三方服务商安全验证。
 * https://work.weixin.qq.com/api/doc#10975/获取预授权码
 *
 */
exports.getPreAuthCode = function () {
  return this.request({
    method: 'post',
    url: 'service/get_pre_auth_code',
    data: {
      suite_id: this.config.suiteId
    }
  })
}

/**
 * 设置授权配置
 * 该接口可对某次授权进行配置。可支持测试模式（套件未发布时）；可设置哪些应用可以授权，不调用则默认允许所有应用进行授权。
 * https://work.weixin.qq.com/api/doc#10975/设置授权配置
 * @param preAuthCode 预授权码
 * @param appId 允许进行授权的应用id，如1、2、3， 不填或者填空数组都表示允许授权套件内所有应用
 * @param authType 授权类型：0 正式授权， 1 测试授权， 默认值为0
 */
exports.setSessionInfo = function (preAuthCode, appId, authType = 0) {
  return this.request({
    method: 'post',
    url: 'service/set_session_info',
    data: {
      pre_auth_code: preAuthCode,
      session_info: {
        appid: appId,
        auth_type: authType
      }
    }
  })
}

/**
 * 获取企业永久授权码
 * 该API用于使用临时授权码换取授权方的永久授权码，并换取授权信息、企业access_token，临时授权码一次有效。建议第三方优先以userid或手机号为主键、其次以email为主键来建立自己的管理员账号。
 * https://work.weixin.qq.com/api/doc#10975/获取企业永久授权码
 * @param authCode 临时授权码，会在授权成功时附加在redirect_uri中跳转回第三方服务商网站，或通过回调推送给服务商。长度为64至512个字节
 */
exports.getPermanentCode = function (authCode) {
  return this.request({
    method: 'post',
    url: 'service/get_permanent_code',
    data: {
      suite_id: this.config.suiteId,
      auth_code: authCode
    }
  })
}

/**
 * 获取企业授权信息
 * 该API用于通过永久授权码换取企业微信的授权信息。 永久code的获取，是通过临时授权码使用get_permanent_code 接口获取到的permanent_code。
 * https://work.weixin.qq.com/api/doc#10975/获取企业授权信息
 * @param authCorpid 授权方corpid
 * @param permanentCode 永久授权码，通过get_permanent_code获取
 */
exports.getAuthInfo = function (authCorpid, permanentCode) {
  return this.request({
    method: 'post',
    url: 'service/get_auth_info',
    data: {
      suite_id: this.config.suiteId,
      auth_corpid: authCorpid,
      permanent_code: permanentCode
    }
  })
}

/**
 * 获取企业access_token
 * 第三方服务商在取得企业的永久授权码并完成对企业应用的设置之后，便可以开始通过调用企业接口来运营这些应用。其中，调用企业接口所需的access_token获取方法如下。
 * https://work.weixin.qq.com/api/doc#10975/获取企业access_token
 * @param authCorpid 授权方corpid
 * @param permanentCode 永久授权码，通过get_permanent_code获取
 */
exports.getCorpToken = function (authCorpid, permanentCode) {
  return this.request({
    method: 'post',
    url: 'service/get_corp_token',
    data: {
      suite_id: this.config.suiteId,
      auth_corpid: authCorpid,
      permanent_code: permanentCode
    }
  })
}
