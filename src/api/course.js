import request from '@/utils/request'

export function getCourseList(params) {
    return request({
        url: 'https://localhost:5001/api/Course/getList',
        method: 'get',
        data: params
    })
}