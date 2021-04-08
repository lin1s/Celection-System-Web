import request from '@/utils/request'

export function getStudentList(params) {
    return request({
        url: 'https://localhost:5001/api/Student/getList',
        method: 'get',
        data: params
    })
}

export function addStudent(params) {
    return request({
        url: 'https://localhost:5001/api/Student/add',
        method: 'post',
        data: params
    })
}

export function delStudent(params) {
    return request({
        url: 'https://localhost:5001/api/Student/del?StudentId=' + params,
        method: 'get'
    })
}

export function updateStudent(params) {
    return request({
        url: 'https://localhost:5001/api/Student/update',
        method: 'post',
        data: params
    })
}