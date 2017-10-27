const Ticket = require('./lib/core/ticket')
const AccessToken = require('./lib/core/access-token')

const API = require('./lib/core/api')
const CorpAPI = require('./lib/core/corp-api')
const SuiteAPI = require('./lib/core/suite-api')
const SuiteCorpAPI = require('./lib/core/suite-corp-api')
const ProviderAPI = require('./lib/core/provider-api')

/**
 * 用于支持对象合并。将对象合并到API.prototype上，使得能够支持扩展
 * Examples:
 * ```
 * // 媒体管理（上传、下载）
 * API.mixin(require('./lib/api_media'));
 * ```
 * @param {Object} obj 要合并的对象
 */
function mixin (API, obj) {
  for (let key in obj) {
    if (API.prototype.hasOwnProperty(key)) {
      throw new Error('Don\'t allow override existed prototype method. method: ' + key)
    }
    API.prototype[key] = obj[key]
  }
}

// crypto
mixin(API, require('./lib/api_crypto'))

/*  微信企业应用 */
// 授权
mixin(CorpAPI, require('./lib/corp_oauth'))
// JS SDK
mixin(CorpAPI, require('./lib/corp_js'))
// 成员管理
mixin(CorpAPI, require('./lib/corp_user'))
// 部门管理
mixin(CorpAPI, require('./lib/corp_department'))
// 标签管理
mixin(CorpAPI, require('./lib/corp_tag'))
// 异步任务
mixin(CorpAPI, require('./lib/corp_batch'))

/* 微信企业套件 */
// 第三方应用
mixin(SuiteAPI, require('./lib/suite_3rd'))

/* 微信企业服务商 */
// 商户授权
mixin(ProviderAPI, require('./lib/provider_oauth'))

module.exports = {
  Ticket,
  AccessToken,
  API,
  CorpAPI,
  SuiteAPI,
  SuiteCorpAPI,
  ProviderAPI,
  mixin
}
