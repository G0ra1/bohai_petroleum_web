import request from '@/utils/request'

export function getDepartments(params) {
  return request({
    url: '/department/getDepartmentList',
    method: 'get',
    params
  })
}


/**
 * 添加组织机构
 * @param data
 */
export function addDepartment(data) {
  return request({
    url: '/department/add',
    method: 'post',
    data
  })
}

export function updateDepartment(data) {
  return request({
    url: '/department/update',
    method: 'post',
    data
  })
}


export function deleteDepartment(id) {
  return request({
    url: '/department/delete',
    method: 'get',
    params:{id:id}
  })
}
