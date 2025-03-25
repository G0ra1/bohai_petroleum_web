import request from '@/utils/request'

/**
 * 角色管理的接口
 *
 */




export function  getRoleList(params){
  return request({
    url: '/role/selectAll',
    method: 'get',
    params
  })
}
export function  selectByCid(params){
  return request({
    url: '/role/selectByCid',
    method: 'get',
    params
  })
}
export function  getRoleListByAdmin(){
  return request({
    url: '/role/getRoleListByAdmin',
    method: 'get'
  })
}

export function  deleteById(id){
  return request({
    url: '/role/selectByCid',
    method: 'get',
    params:{id:id}
  })
}
export function  getPermissionList(){
  return request({
    url: '/permission/selectByHidden',
    method: 'get'
  })
}
export function  addRole(data){
  return request({
    url: '/role/addAndUpdate',
    method: 'post',
    data
  })
}
export function deleteRole(id){
  return request({
    url: '/role/delete',
    method: 'get',
    params:{id:id},
  })
}
