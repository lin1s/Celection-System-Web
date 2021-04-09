import request from '@/utils/request'

export function getStudentListByCourse(params) {
    return request({
        url: 'https://localhost:5001/api/Record/getStudentByCourse?courseID=' + params,
        method: "get",
    })
}

export function getCourse(params) {
    return request({
        url: 'https://localhost:5001/api/Record/getCourse',
        method:"get",
    })
}