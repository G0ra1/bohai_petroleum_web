import request from '@/utils/request'


export function addTask(params) {
  return request({
    url: '/task/addTask',
    method: 'post',
    params
  })
}
export function searchPage(params) {
  return request({
    url: '/task/searchPage',
    method: 'get',
    params
  })
}
export function searchAll(params) {
  return request({
    url: '/task/searchAll',
    method: 'get',
    params
  })
}
export function updateTask(params) {
  return request({
    url: '/task/update',
    method: 'post',
    params
  })
}

export function deleteTask(ids) {
  return request({
    url: '/task/delete',
    method: 'post',
    params:{ids:ids}
  })
}
