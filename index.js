// 微信企业号主动调用接口API
const API = require('./lib/api_common')

// 授权
API.mixin(require('./lib/api_oauth'))

module.exports.API = API
