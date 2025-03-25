import request from '@/utils/request'



export function getLocationListPage(params) {
  return request({
    url: '/location/page',
    method: 'get',
    params
  })
}
export function getLocationList() {
  return request({
    url: '/location',
    method: 'get',
  })
}

export function addOrUpdateLocation(data) {
  return request({
    url: '/location',
    method: 'post',
    data
  })
}



export function deleteLocation(id) {
  return request({
    url: '/location/delete',
    method: 'get',
    params:{id:id}
  })
}

