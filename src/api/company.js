import request from '@/utils/request'

/**
 * 添加
 * @param data
 */
export function add(data) {
  return request({
    url: '/company/add',
    method: 'post',
    data
  })
}
/**
 * 查询 分页
 * @param data
 */
export function search(params) {
  return request({
    url: '/company/search',
    method: 'get',
    params
  })
}

/**
 * 查询全部
 * @param data
 */
export function selectAll() {
  return request({
    url: '/company/selectAll',
    method: 'get',
  })
}
/**
 * 修改
 * @param data
 */
export function update(data) {
  return request({
    url: '/company/update',
    method: 'post',
    data
  })
}

/**
 * 查询
 * @param data
 */
export function deleteById(id) {
  return request({
    url: '/company/delete',
    method: 'get',
    params:{id:id}
  })
}
