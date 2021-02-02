import request from '@/utils/request'

// export function getList(params) {
//   return request({
//     url: '/vue-admin-template/table/list',
//     method: 'get',
//     params
//   })
// }

export function getTeacherList(params) {
  return request({
    url: 'https://localhost:5001/api/Teacher',
    method: 'get',
    data: params
  })
}

export function addTeacher(params) {
  return request({
    url: 'https://localhost:5001/api/Teacher/add',
    method: 'post',
    data: params
  })
}

export function delTeacher(params) {
  return request({
    url: 'https://localhost:5001/api/Teacher/del?id=' + params,
    method: 'get'
  })
}

export function updateTeacher(params) {
  return request({
    url: '',
    method: 'post',
    data: params
  })
}