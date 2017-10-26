const crypto = require('crypto')

/**
 * AES算法pkcs7 padding Decoder
 * @param buff 需要解码的Buffer
 * @returns {Blob|ArrayBuffer|Array.<T>|string|*}
 * @constructor
 */
function PKCS7Decoder (buff) {
  var pad = buff[buff.length - 1]
  if (pad < 1 || pad > 32) {
    pad = 0
  }
  return buff.slice(0, buff.length - pad)
}

/**
 * AES算法pkcs7 padding Encoder
 * @param buff 需要编码码的Buffer
 * @returns {Blob|ArrayBuffer|Array.<T>|string|*}
 * @constructor
 */
function PKCS7Encoder (buff) {
  var blockSize = 32
  var strSize = buff.length
  var amountToPad = blockSize - (strSize % blockSize)
  var pad = new Buffer(amountToPad - 1)
  pad.fill(String.fromCharCode(amountToPad))
  return Buffer.concat([buff, pad])
}

/**
 * 初始化AES解密的配置信息
 * @param corpId 企业微信的corpId，当为第三方套件回调事件时，corpId的内容为suiteId
 * @param token 企业微信的token，当为第三方套件回调事件时，token的内容为套件的token
 * @param encodingAESKey 企业微信的encodingAESKey，当为第三方套件回调事件时，encodingAESKey的内容为套件的encodingAESKey
 */
exports.initCrypto = function (corpId, token, encodingAESKey) {
  const aesKey = new Buffer(encodingAESKey + '=', 'base64')

  this.crypotConfig = {
    corpId,
    token,
    aesKey,
    iv: aesKey.slice(0, 16)
  }
}

/**
 * 生成签名
 * @param timestamp String|Number 时间戳
 * @param nonce String 随机串
 * @param encrypt String 加密的数据
 * @returns {*} String 排好序的签名
 */
exports.rawSignature = function (timestamp, nonce, encrypt) {
  const {token} = this.crypotConfig
  const rawList = [token, timestamp, nonce]
  if (encrypt) rawList.push(encrypt)

  const rawStr = rawList.sort().join('')
  const sha1 = crypto.createHash('sha1')
  sha1.update(rawStr)
  return sha1.digest('hex')
}

/**
 * 对给定的消息进行AES加密
 * @param msg String 需要加密的明文
 * @param corpId 可选 需要对比的corpId，如果第三方回调时默认是suiteId，也可自行传入作为匹配处理
 * @returns {string} 加密后的结果
 */
exports.encrypt = function (msg, corpId) {
  const {aesKey, iv} = this.crypotConfig
  corpId = corpId || this.crypotConfig.corpId

  msg = new Buffer(msg)
  const random16 = crypto.pseudoRandomBytes(16)
  const msgLen = new Buffer(4)
  msgLen.writeUInt32BE(msg.length, 0)

  const rawMsg = Buffer.concat([random16, msgLen, msg, new Buffer(corpId)])
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv)
  const cipheredMsg = Buffer.concat([cipher.update(rawMsg), cipher.final()])
  return cipheredMsg.toString('base64')
}

/**
 * 对给定的密文进行AES解密
 * @param str 需要解密的密文
 * @param corpId 可选 需要对比的corpId，如果第三方回调时默认是suiteId，也可自行传入作为匹配处理
 * @returns {string} 解密后的结果
 */
exports.decrypt = function (str, corpId) {
  const {aesKey, iv} = this.crypotConfig
  corpId = corpId || this.crypotConfig.corpId

  const aesCipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv)
  aesCipher.setAutoPadding(false)

  const decipheredBuff = PKCS7Decoder(Buffer.concat([aesCipher.update(str, 'base64'), aesCipher.final()]))
  const data = decipheredBuff.slice(16)
  const msgLen = data.slice(0, 4).readUInt32BE(0)

  const decryptCorpId = data.slice(msgLen + 4).toString()

  if (corpId !== decryptCorpId) {
    const err = new Error('corpId is invalid')
    err.name = 'WxWorkAPIError'
    err.code = 400
    throw err
  }
  return data.slice(4, msgLen + 4).toString()
}
