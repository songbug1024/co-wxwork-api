/**
 * 增量更新成员
 * http://work.weixin.qq.com/api/doc#10138/增量更新成员
 * @param data 请求包体
 * @returns {Promise.<TResult>}
 */
exports.batchSyncUser = function (data) {
  return this.request({
    method: 'post',
    url: 'batch/syncuser',
    data
  })
}

/**
 * 全量覆盖成员
 * http://work.weixin.qq.com/api/doc#10138/全量覆盖成员
 * @param data 请求包体
 * @returns {Promise.<TResult>}
 */
exports.batchReplaceUser = function (data) {
  return this.request({
    method: 'post',
    url: 'batch/replaceuser',
    data
  })
}

/**
 * 全量覆盖部门
 * http://work.weixin.qq.com/api/doc#10138/全量覆盖部门
 * @param data 请求包体
 * @returns {Promise.<TResult>}
 */
exports.batchReplaceParty = function (data) {
  return this.request({
    method: 'post',
    url: 'batch/replaceparty',
    data
  })
}

/**
 * 获取异步任务结果
 * http://work.weixin.qq.com/api/doc#10138/获取异步任务结果
 * @param jobId 异步任务id，最大长度为64字节
 * @returns {Promise.<TResult>}
 */
exports.getBatchResult = function (jobId) {
  return this.request({
    url: 'batch/getresult',
    params: {
      jobid: jobId
    }
  })
}
