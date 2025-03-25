import request from '@/utils/request'

export function search(params) {
  return request({
    url: '/attendance/shiftsSetting/search',
    method: 'post',
    params
  })
}

export function update(params) {
  return request({
    url: '/attendance/shiftsSetting/update',
    method: 'post',
    params
  })
}
export function deleteById(id) {
  return request({
    url: '/attendance/shiftsSetting/deleteById',
    method: 'post',
    params : {id :id}
  })
}



