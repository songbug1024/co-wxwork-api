/**
 * 创建成员
 * http://work.weixin.qq.com/api/doc#10018
 * @param data 成员信息
 * @returns {Promise.<TResult>}
 */
exports.createUser = function (data) {
  return this.request({
    method: 'post',
    url: 'user/create',
    data
  })
}

/**
 * 读取成员
 * http://work.weixin.qq.com/api/doc#10019
 * @param userId 成员UserID。对应管理端的帐号，企业内必须唯一。不区分大小写，长度为1~64个字节
 * @returns {Promise.<TResult>}
 */
exports.getUser = function (userId) {
  return this.request({
    url: 'user/get',
    params: {
      userid: userId
    }
  })
}

/**
 * 更新成员
 * http://work.weixin.qq.com/api/doc#10020
 * @param userId 成员UserID。对应管理端的帐号，企业内必须唯一。不区分大小写，长度为1~64个字节
 * @param data 需要更新的成员信息
 * @returns {Promise.<TResult>}
 */
exports.updateUser = function (userId, data) {
  return this.request({
    method: 'post',
    url: 'user/update',
    data: Object.assign({userid: userId}, data)
  })
}

/**
 * 删除成员
 * http://work.weixin.qq.com/api/doc#10030
 * @param userId 成员UserID。对应管理端的帐号，企业内必须唯一。不区分大小写，长度为1~64个字节
 * @returns {Promise.<TResult>}
 */
exports.deleteUser = function (userId) {
  return this.request({
    url: 'user/delete',
    params: {
      userid: userId
    }
  })
}

/**
 * 批量删除成员
 * http://work.weixin.qq.com/api/doc#10030
 * @param userIds 成员UserID列表
 * @returns {Promise.<TResult>}
 */
exports.deleteUser = function (userIds) {
  return this.request({
    method: 'post',
    url: 'user/batchdelete',
    data: {
      useridlist: userIds
    }
  })
}

/**
 * 获取部门成员
 * http://work.weixin.qq.com/api/doc#10061
 * @param departmentId 获取的部门id
 * @param fetchChild 1/0：是否递归获取子部门下面的成员
 * @returns {Promise.<TResult>}
 */
exports.getDepartmentSimpleList = function (departmentId, fetchChild) {
  return this.request({
    url: 'user/simplelist',
    params: {
      department_id: departmentId,
      fetch_child: fetchChild
    }
  })
}

/**
 * 获取部门成员详情
 * http://work.weixin.qq.com/api/doc#10063
 * @param departmentId 获取的部门id
 * @param fetchChild 1/0：是否递归获取子部门下面的成员
 * @returns {Promise.<TResult>}
 */
exports.getDepartmentUserList = function (departmentId, fetchChild) {
  return this.request({
    url: 'user/list',
    params: {
      department_id: departmentId,
      fetch_child: fetchChild
    }
  })
}

/**
 * userid转openid
 * http://work.weixin.qq.com/api/doc#11279
 * @param userId 企业内的成员id
 * @param agentId 企业应用ID，仅用于发红包。其它场景该参数不要填，如微信支付、企业转账、电子发票
 * @returns {Promise.<TResult>}
 */
exports.convert2OpenId = function (userId, agentId) {
  return this.request({
    method: 'post',
    url: 'user/convert_to_openid',
    params: {
      userid: userId,
      agentid: agentId
    }
  })
}

/**
 * openid转userid
 * http://work.weixin.qq.com/api/doc#11279
 * @param openId 在使用微信支付、微信红包和企业转账之后，返回结果的openid
 * @returns {Promise.<TResult>}
 */
exports.convert2UserId = function (openId) {
  return this.request({
    method: 'post',
    url: 'user/convert_to_userid',
    params: {
      openid: openId
    }
  })
}

/**
 * 二次验证
 * http://work.weixin.qq.com/api/doc#11378
 * @param userId  企业内的成员id
 * @returns {Promise.<TResult>}
 */
exports.authSucc = function (userId) {
  return this.request({
    url: 'user/authsucc',
    params: {
      userid: userId
    }
  })
}
