import request from '@/utils/request'

export function getTeacherList(params) {
    return request({
        url: 'https://localhost:5001/api/Teacher/getList',
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
        url: 'https://localhost:5001/api/Teacher/del?teacherId=' + params,
        method: 'get'
    })
}

export function updateTeacher(params) {
    return request({
        url: 'https://localhost:5001/api/Teacher/update',
        method: 'post',
        data: params
    })
}