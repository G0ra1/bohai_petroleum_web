import request from '@/utils/request'


export function  addExcelAuth(data){
  return request({
    url: '/auth/importExcel',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}
export function getDeviceList(params) {
  return request({
    url: '/device/getListPage',
    method: 'get',
    params
  })
}

export function addDevice(data) {
  return request({
    url: '/device/add',
    method: 'post',
    data
  })
}
export function getStatus(data) {
  return request({
    url: '/device/getStatus',
    method: 'post',
    data
  })
}
export function updateDevice(data) {
  return request({
    url: '/device/update',
    method: 'post',
    data
  })
}

export function deleteDevice(id) {
  return request({
    url: '/device/delete',
    method: 'get',
    params:{id:id}
  })
}

export function openDoor(id) {
  return request({
    url: '/device/open',
    method: 'post',
    params:{deviceId:id}
  })
}
/**
 * 设备授权
 * @param data
 */
export function auth(data) {
  return request({
    url: '/auth/add',
    method: 'post',
    data
  })
}


export function getAuthVisitor() {
  return request({
    url: '/auth/visitor',
    method: 'get',
  })
}

/**
 * 访客授权
 * @param data
 */
export function authVisitor(data) {
  return request({
    url: '/auth/visitor',
    method: 'post',
    data
  })
}

export function getAuthSetting() {
  return request({
    url: '/auth/setting',
    method: 'get',
  })
}

/**
 * 紧急设置
 * @param data
 */
export function authSetting(data) {
  return request({
    url: '/auth/setting',
    method: 'post',
    data
  })
}


export function refresh(id) {
  return request({
    url: '/device/refresh',
    method: 'get',
    params:{deviceId:id}
  })
}

// 更改设备密码
export function updatePwd(params) {
  return request({
    url: '/device/updatePwd',
    method: 'post',
    params
  })
}

// 设置回调地址
export function callbackURL(params) {
  return request({
    url: '/device/callbackURL',
    method: 'post',
    params
  })
}

// 广告设置
export function setAdv(data) {
  return request({
    url: '/device/setAdv',
    method: 'post',
    data
  })
}

// 清空广告
export function cleanAdv(params) {
  return request({
    url: '/device/cleanAdv',
    method: 'post',
    params
  })
}

// 获取未同步数据
export function unsyncData(params) {
  return request({
    url: '/device/unsyncData',
    method: 'post',
    params
  })
}

// 数据同步
export function dataSync(data) {
  return request({
    url: '/device/dataSync',
    method: 'post',
    data
  })
}

// 紧急设置
export function emergency(params) {
  return request({
    url: '/device/emergency',
    method: 'post',
    params
  })
}

// 设置摄像头每日开关
export function cameraSet(params) {
  return request({
    url: '/device/cameraSet',
    method: 'post',
    params
  })
}


export function getBatchinfo() {
  return request({
    url: '/auth/batchinfo',
    method: 'get',
  })
}


export function clearData(id) {
  return request({
    url: '/device/clearData',
    method: 'post',
    params:{deviceId:id}
  })
}
