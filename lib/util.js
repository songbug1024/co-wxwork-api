const crypto = require('crypto')
const xml2js = require('xml2js')

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

/**
 * 解析xml成object
 * @param xml 待解析字符串
 * @param opts xml2js.parseString参数
 * @returns {Promise}
 */
exports.parseXml = function (xml, opts = {}) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, opts, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

/**
 * 根据object构建一个xml
 * @param obj 对象
 * @param opts xml2js.Builder的参数
 * @returns String
 */
exports.buildXml = function (obj, opts = {}) {
  const builder = new xml2js.Builder(opts)
  return builder.buildObject(obj)
}
