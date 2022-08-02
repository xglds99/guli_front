import request from '@/utils/request'
export default {
  //  查询课程列表
  getSubjectList() {
    return request({
      url: `/eduService/subject/getAllSubject`,
      method: 'get'
    })
  }
}
