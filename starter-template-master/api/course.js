import request from '@/utils/request'
export default {
    getFrontCourseList(page, limit, courseQuery) {
        return request({
            url: `/eduService/course/getFrontCourseList/${page}/${limit}`,
            method: 'post',
            data: courseQuery
        })
    },
    getAllSubject() {
        return request({
            url: `/eduService/subject/getAllSubject`,
            method: 'get'
        })
    },
    getCourseInfo(courseId) {
        return request({
            url: `/eduService/course/getFrontCourseInfo/${courseId}`,
            method: 'get'
        })
    },
    getCommentList(page, limit, courseId) {
        return request({
            url: '/eduService/comment/getCommentByCourseId/' + page + "/" + limit,
            method: 'get',
            params: { courseId }
        })
    },
    addComment(comment) {
        return request({
            url: `/eduService/comment/addComment`,
            method: 'post',
            data: comment
        })
    }
}