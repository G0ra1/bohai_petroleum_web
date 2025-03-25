import request from '@/utils/request'
/**
 * 添加
 * @param data
 */
export function addAdmin(data) {
  return request({
    url: '/admin/addAdmin',
    method: 'post',
    data
  })
}

/**
 * 添加
 * @param data
 */
export function addAccount(data) {
  return request({
    url: '/admin/addAccount',
    method: 'post',
    data
  })
}

/**
 * 删除
 * @param data
 */
export function deleteById(id) {
  return request({
    url: '/admin/deleteById',
    method: 'get',
    params:{id:id}
  })
}
/**
 * 查询管理员
 * @param data
 */
export function searchAdmin(data) {
  return request({
    url: '/admin/searchAdmin',
    method: 'post',
    data
  })
}

/**
 * 查询账号
 * @param data
 */
export function searchAccount(data) {
  return request({
    url: '/admin/searchAccount',
    method: 'post',
    data
  })
}
