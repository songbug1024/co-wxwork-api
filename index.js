const AccessToken = require('./lib/core/access-token')
const API = require('./lib/core/api')
const CorpAPI = require('./lib/core/corp-api')
const SuiteAPI = require('./lib/core/suite-api')

/*** 微信企业应用 ***/
// 授权
CorpAPI.mixin(require('./lib/corp_oauth'))

/*** 微信企业服务商 ***/
// 第三方
SuiteAPI.mixin(require('./lib/suite_3rd'))

module.exports.AccessToken = AccessToken
module.exports.API = API
module.exports.CorpAPI = CorpAPI
module.exports.SuiteAPI = SuiteAPI
