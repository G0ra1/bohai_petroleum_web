import request from '@/utils/request'
export function  addBlacklist(data){
  return request({
    url: '/user/addBlacklist',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}
//获取用户信息
export function deleteBlacklist(params) {
  return request({
    url: '/user/deleteBlacklist',
    method: 'post',
    params:{ids:params}
  })
}
export function  addVip(data){
  return request({
    url: '/user/addVip',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}
//获取用户信息
export function deleteVip(params) {
  return request({
    url: '/user/deleteVip',
    method: 'post',
    params:{ids:params}
  })
}
//获取用户信息
export function getUserInfo(userId) {
  return request({
    url: '/user/detail/'+userId,
    method: 'get'
  })
}
//获取用户信息
export function getUserList() {
  return request({
    url: '/user/searchList/',
    method: 'get'
  })
}

//获取用户信息
export function getUserInfoPage(params) {
  return request({
    url: '/user/getUserInfoPage',
    method: 'get',
    params
  })
}

//获取用户信息
export function getUserInfoAll(params) {
  return request({
    url: '/user/getUserInfoAll',
    method: 'get',
    params
  })
}
//获取用户照片信息
export function getUserImages(id) {
  return request({
    url: '/user/getImages',
    method: 'post',
    params:{userId:id}
  })
}
//获取用户信息
export function getAuthUserInfoList(params) {
  return request({
    url: '/auth/user',
    method: 'get',
    params
  })
}

//删除用户授权
export function deleteAuthUserInfo(params) {
  return request({
    url: '/auth/user',
    method: 'delete',
    params
  })
}

//删除用户授权
export function batchdeleteAuthUser(params) {
  return request({
    url: '/auth/batch',
    method: 'delete',
    params
  })
}
//获取用户信息
export function getUserInfoListByDepartments(data) {
  return request({
    url: '/auth/user/new',
    method: 'post',
    data
  })
}
export function getMyUserInfo(userId) {
  return request({
    url: '/user/me',
    method: 'get'
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}





export function  addUser(data){
  return request({
    url: '/user/addUser',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}

export function  addUserBatch(params){
  return request({
    url: '/user/importImage',
    method: 'post',
    params:params
  })
}
export function  updateUser(data){
  return request({
    url: '/user/update',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}


export function deleteUser(params){
  return request({
    url: '/user/delete',
    method: 'post',
    params
  })
}

export function modifyPassword(data) {
  return request({
    url: '/admin/modifyPassword',
    method: 'post',
    data
  })
}

export function batchDelete(ids){
  return request({
    url: '/user/batchDelete',
    method: 'post',
    params:{ids:ids},
  })
}
export function  addExcelAuth(data){
  return request({
    url: '/user/importExcel',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}
export function fileCheck(params) {
  return request({
    url: '/user/fileCheck',
    method: 'get',
    params:params
  })
}
export function getIp() {
  return request({
    url: '/user/getIp',
    method: 'get',

  })
}
export function  addImage(data){
  return request({
    url: '/user/addImage',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}

export function imageMerge(params) {
  return request({
    url: '/user/image_merge',
    method: 'post',
    params:params
  })
}
