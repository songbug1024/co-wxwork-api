const crypto = require('crypto')

/*!
 * 生成随机字符串
 */
exports.createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15)
}

/*!
 * 生成时间戳
 */
exports.createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + ''
}

/*!
 * 排序查询字符串
 */
const raw = exports.raw = function (args) {
  let keys = Object.keys(args)
  keys = keys.sort()

  const newArgs = {}
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key]
  })

  let string = ''
  for (let k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  return string.substr(1)
}

/*!
 * 签名算法
 *
 * @param {Object} ret 需要签名的对象，注：需要先排序好
 */
exports.sign = function (ret) {
  const string = raw(ret)
  const shasum = crypto.createHash('sha1')

  shasum.update(string)
  return shasum.digest('hex')
}
