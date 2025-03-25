import request from '@/utils/request'


export function searchPage(params) {
  return request({
    url: '/record/searchPage',
    method: 'get',
    params
  })
}
export function addLeave(params) {
  return request({
    url: '/record/addLeave',
    method: 'post',
    params
  })
}

export function addNight(params) {
  return request({
    url: '/record/addNight',
    method: 'post',
    params
  })
}
export function batchDelete(ids) {
  return request({
    url: '/record/batchDelete',
    method: 'post',
    params:{ids:ids}
  })
}
