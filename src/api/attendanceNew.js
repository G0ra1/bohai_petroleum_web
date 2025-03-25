import request from '@/utils/request'
// 获取出勤日数据
export function add(params) {
  return request({
    url: '/attendance/spuadPeriodSetting/add',
    method: 'post',
    params
  })
}
export function search(params) {
  return request({
    url: '/attendance/spuadPeriodSetting/search',
    method: 'post',
    params
  })
}
export function searchAll() {
  return request({
    url: '/attendance/spuadPeriodSetting/searchAll',
    method: 'post',
  })
}
export function deleteById(id) {
  return request({
    url: '/attendance/spuadPeriodSetting/deleteById',
    method: 'post',
    params : {id :id}
  })
}
export function update(params) {
  return request({
    url: '/attendance/spuadPeriodSetting/update',
    method: 'post',
    params
  })
}

export function searchRecord(params) {
  return request({
    url: '/attendance/record/search',
    method: 'post',
    params
  })
}
// 取消请假记录
export function leaveCancel(id){
  return request({
    url: '/attendance/record/leaveCancel',
    method: 'post',
    params : {id :id}
  })
}

// 重新计算考勤
export function refreshAttendance(params){
  return request({
    url: '/attendance/record/refreshAttendance',
    method: 'post',
    params
  })
}

