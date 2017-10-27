/**
 * 创建标签
 * http://work.weixin.qq.com/api/doc#10915
 * @param data 标签信息
 * @returns {Promise.<TResult>}
 */
exports.createTag = function (data) {
  return this.request({
    method: 'post',
    url: 'tag/create',
    data
  })
}

/**
 * 更新标签名字
 * http://work.weixin.qq.com/api/doc#10919
 * @param tagId 标签ID
 * @param data 需要更新的标签信息，如果传入了字符串，则代表标签名称
 * @returns {Promise.<TResult>}
 */
exports.updateTag = function (tagId, data) {
  if (typeof data === 'string') data = {tagname: data}

  return this.request({
    method: 'post',
    url: 'tag/update',
    data: Object.assign({tagid: tagId}, data)
  })
}

/**
 * 删除标签
 * http://work.weixin.qq.com/api/doc#10920
 * @param tagId 标签ID
 * @returns {Promise.<TResult>}
 */
exports.deleteTag = function (tagId) {
  return this.request({
    url: 'tag/delete',
    params: {
      tagid: tagId
    }
  })
}

/**
 * 获取标签成员
 * http://work.weixin.qq.com/api/doc#10921
 * @param tagId 标签ID
 * @returns {Promise.<TResult>}
 */
exports.getTagUserList = function (tagId) {
  return this.request({
    url: 'tag/get',
    params: {
      tagid: tagId
    }
  })
}

/**
 * 增加标签成员
 * http://work.weixin.qq.com/api/doc#10923
 * @param tagId 标签ID
 * @param userIds 企业成员ID列表，注意：userlist、partylist不能同时为空，单次请求长度不超过1000
 * @param departmentIds 企业部门ID列表，注意：userlist、partylist不能同时为空，单次请求长度不超过100
 * @returns {Promise.<TResult>}
 */
exports.addTagUserList = function (tagId, {userIds, departmentIds}) {
  return this.request({
    method: 'post',
    url: 'tag/addtagusers',
    data: {
      tagid: tagId,
      userlist: userIds,
      partylist: departmentIds
    }
  })
}

/**
 * 删除标签成员
 * http://work.weixin.qq.com/api/doc#10925
 * @param tagId 标签ID
 * @param userIds 企业成员ID列表，注意：userlist、partylist不能同时为空，单次请求长度不超过1000
 * @param departmentIds 企业部门ID列表，注意：userlist、partylist不能同时为空，单次请求长度不超过100
 * @returns {Promise.<TResult>}
 */
exports.deleteTagUserList = function (tagId, {userIds, departmentIds}) {
  return this.request({
    method: 'post',
    url: 'tag/deltagusers',
    data: {
      tagid: tagId,
      userlist: userIds,
      partylist: departmentIds
    }
  })
}

/**
 * 获取标签列表
 * http://work.weixin.qq.com/api/doc#10926
 * @returns {Promise.<TResult>}
 */
exports.deleteTagUserList = function () {
  return this.request('tag/list')
}
