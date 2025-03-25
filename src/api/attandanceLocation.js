import request from '@/utils/request'
// 添加考勤位置
export function add(params) {
  return request({
    url: '/attendance_location/add',
    method: 'post',
    params
  })
}
export function searchLocation(params) {
  return request({
    url: '/attendance_location/search',
    method: 'post',
    params
  })
}
export function onDelete(id) {
  return request({
    url: '/attendance_location/delete',
    method: 'post',
    params:{id:id}
  })
}




