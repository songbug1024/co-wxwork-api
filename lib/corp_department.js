/**
 * 创建部门
 * http://work.weixin.qq.com/api/doc#10076
 * @param data 部门信息
 * @returns {Promise.<TResult>}
 */
exports.createDepartment = function (data) {
  return this.request({
    method: 'post',
    url: 'department/create',
    data
  })
}

/**
 * 更新部门
 * http://work.weixin.qq.com/api/doc#10077
 * @param departmentId 部门ID
 * @param data 需要更新的部门信息
 * @returns {Promise.<TResult>}
 */
exports.updateDepartment = function (departmentId, data) {
  return this.request({
    method: 'post',
    url: 'department/update',
    data: Object.assign({id: departmentId}, data)
  })
}

/**
 * 删除部门
 * http://work.weixin.qq.com/api/doc#10079
 * @param departmentId 部门ID
 * @returns {Promise.<TResult>}
 */
exports.deleteDepartment = function (departmentId) {
  return this.request({
    url: 'department/delete',
    params: {
      id: departmentId
    }
  })
}

/**
 * 获取部门列表
 * http://work.weixin.qq.com/api/doc#10093
 * @param departmentId 部门id。获取指定部门及其下的子部门。 如果不填，默认获取全量组织架构
 * @returns {Promise.<TResult>}
 */
exports.getDepartmentList = function (departmentId) {
  return this.request({
    url: 'department/list',
    params: {
      id: departmentId
    }
  })
}
