import request from '@/utils/request'
//登录
export function loginByUsername(data) {
  return request({
    url: '/authentication/form',
    method: 'post',
    params:data
  })
}

//登出
export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

//获取用户信息
export function getUserInfo() {
  return request({
    url: '/user/me',
    method: 'get'
  })
}



export function checkCode(params) {
  return request({
    url: '/user/checkCode',
    method: 'get',
    params
  })
}

export function checkPhone(params) {
  return request({
    url: '/user/checkPhone',
    method: 'get',
    params,
  })
}


export function register(params) {
  return request({
    url: '/user/register',
    method: 'post',
    params
  })
}
