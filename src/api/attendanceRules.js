import request from '@/utils/request'


export function addRules(params) {
  return request({
    url: '/attendance/rules/addRules',
    method: 'post',
    params
  })
}
export function searchRulesPage(params) {
  return request({
    url: '/attendance/rules/searchPage',
    method: 'get',
    params
  })
}
export function searchRulesAll(params) {
  return request({
    url: '/attendance/rules/searchAll',
    method: 'get',
    params
  })
}

export function updateRules(params) {
  return request({
    url: '/attendance/rules/updateRules',
    method: 'post',
    params
  })
}
export function batchDelete(ids) {
  return request({
    url: '/attendance/rules/batchDelete',
    method: 'post',
    params:{ids:ids}
  })
}
