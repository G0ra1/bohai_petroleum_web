import request from '@/utils/request'
export function  add(data){
  return request({
    url: '/visitor/add',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}

export function  getOneselfVisitor(data){
  return request({
    url: '/visitor/getOneselfVisitor',
    method: 'get',
    data
  })
}
export function  getAllVisitor(data){
  return request({
    url: '/visitor/getAllVisitor',
    method: 'get',
    data
  })
}

export function  update(data){
  return request({
    url: '/visitor/update',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}
export function  deleteById(id){
  return request({
    url: '/visitor/delete',
    method: 'get',
    params:{id:id}
  })
}
