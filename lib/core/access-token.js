class AccessToken {
  constructor (accessToken, expireTime) {
    this.accessToken = accessToken
    this.expireTime = expireTime
  }

  /*!
   * 检查AccessToken是否有效，检查规则为当前时间和过期时间进行对比 * Examples:
   * ```
   * token.isValid();
   * ```
   */
  isValid () {
    return !!this.accessToken && (new Date().getTime()) < this.expireTime
  }
}

module.exports = AccessToken
