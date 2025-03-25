import request from '@/utils/request'


export function addSetting(params) {
  return request({
    url: '/attendance/setting/addSetting',
    method: 'post',
    params
  })
}
export function searchSettingPage(params) {
  return request({
    url: '/attendance/setting/searchPage',
    method: 'get',
    params
  })
}
export function batchDelete(ids) {
  return request({
    url: '/attendance/setting/batchDelete',
    method: 'post',
    params:{ids:ids}
  })
}
