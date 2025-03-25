import request from '@/utils/request'


export function getAccessRecord(params) {
  return request({
    url: '/access',
    method: 'get',
    params
  })
}
