class Ticket {
  constructor (ticket, expireTime) {
    this.ticket = ticket
    this.expireTime = expireTime
  }

  /*!
   * 检查Ticket是否有效，检查规则为当前时间和过期时间进行对比 * Examples:
   * ```
   * ticket.isValid();
   * ```
   */
  isValid () {
    return !!this.ticket && (new Date().getTime()) < this.expireTime
  }
}

module.exports = Ticket
