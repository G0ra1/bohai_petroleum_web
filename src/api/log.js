import request from '@/utils/request'



export function searchPage(params) {
  return request({
    url: '/log/searchPage',
    method: 'get',
    params
  })
}

