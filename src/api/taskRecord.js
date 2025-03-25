import request from '@/utils/request'


export function addTask(params) {
  return request({
    url: '/task/record/add',
    method: 'post',
    params
  })
}

export function searchRecordPage(params) {
  return request({
    url: '/task/record/searchPage',
    method: 'post',
    params
  })
}
export function updateRecord(data) {
  return request({
    url: '/task/record/update',
    method: 'post',
    data
  })
}
export function batchDelete(ids) {
  return request({
    url: '/task/record/batchDelete',
    method: 'post',
    params:{ids:ids}
  })
}
