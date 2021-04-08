import request from '@/utils/request'

export function getCourseList(params) {
    return request({
        url: 'https://localhost:5001/api/Course/getList',
        method: 'get',
        data: params
    })
}

export function addCourse(params) {
    return request({
        url: 'https://localhost:5001/api/Course/add',
        method: 'post',
        data: params
    })
}

export function delCourse(params) {
    return request({
        url: 'https://localhost:5001/api/Course/del?courseID=' + params,
        method: 'get',
    })
}

export function updateCourse(params) {
    return request({
        url: 'https://localhost:5001/api/Course/update',
        method: 'post',
        data: params
    })
}

export function getStudentListByCourse(params) {
    return request({
        url: 'https://localhost:5001/api/Record/getStudentByCourse?courseID='+params,
        method: "get",
    })
}