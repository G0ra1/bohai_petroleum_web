import request from '@/utils/request'
/**
 *
 * @param data
 */

export function search(params) {
  return request({
    url: '/home/search',
    method: 'get',
    params
  })
}
export function sumUserStatistics() {
  return request({
    url: '/home/sumUserStatistics',
    method: 'get'
  })
}

/**
 *
 * @param data
 */
export function userAccessStatistics(params) {
  return request({
    url: '/home/userAccessStatistics',
    method: 'post',
    params
  })
}

/**
 *
 * @param data
 */
export function AccessTypeStatistics(params) {
  return request({
    url: '/home/AccessTypeStatistics',
    method: 'post',
    params
  })
}
