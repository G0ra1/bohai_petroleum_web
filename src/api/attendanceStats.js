import request from '@/utils/request'


export function searchPage(params) {
  return request({
    url: '/statistics/searchPage',
    method: 'get',
    params
  })
}
