import request from '@/utils/request'


export function addVacation(params) {
  return request({
    url: '/vacation/addVacation',
    method: 'post',
    params
  })
}
export function searchPage(params) {
  return request({
    url: '/vacation/searchPage',
    method: 'get',
    params
  })
}
export function batchDelete(ids) {
  return request({
    url: '/vacation/batchDelete',
    method: 'post',
    params:{ids:ids}
  })
}
