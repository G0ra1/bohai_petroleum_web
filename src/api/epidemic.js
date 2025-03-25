import request from '@/utils/request'



//查询当日体温不正常的员工和陌生人
export function getDayStatistice(params) {
  return request({
    url: '/epidemic/getDayStatistice',
    method: 'get',
    params
  })
}
export function getDayStatisticeDetail(userIds,userType,date){
  return request({
    url: '/epidemic/getDayStatisticeDetail',
    method: 'get',
    params:{userIds:userIds,userType:userType,date:date},
  })
}
//根据日期范围查询出体温正常/异常的人员
export function getPresentStatistice(params) {
  return request({
    url: '/epidemic/getPresentStatistice',
    method: 'get',
    params
  })
}
//查询员工出入记录
export function getEmpRecord(params) {
  return request({
    url: '/epidemic/getEmpRecord',
    method: 'get',
    params
  })
}
//查询访客出入记录
export function getVisitRecord(params) {
  return request({
    url: '/epidemic/getVisitRecord',
    method: 'get',
    params
  })
}
//查询陌生人出入记录
export function getStrangerRecord(params) {
  return request({
    url: '/epidemic/getStrangerRecord',
    method: 'get',
    params
  })
}
//查询体温设置
export function getTemperature() {
  return request({
    url: '/epidemic/getTemperature',
    method: 'get'
  })
}

//查询体温设置
export function setTemperature(params) {
  return request({
    url: '/epidemic/setTemperature',
    method: 'post',
    params
  })
}
