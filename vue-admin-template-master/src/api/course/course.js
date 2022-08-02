import request from '@/utils/request'
export default {
  //  添加课程信息
  addCourseInfo(courseInfo) {
    return request({
      url: `/eduService/course/addCourse`,
      method: 'post',
      data: courseInfo
    })
  },
  // 根据课程ID查询课程信息
  getCourseInfoById(courseId) {
    return request({
      url: `/eduService/course/getCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  // 修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: `/eduService/course/updateCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  // 获取课程确认信息
  getPublishInfo(courseId) {
    return request({
      url: `/eduService/course/getPublishCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  // 获取课程确认信息
  publishCourse(courseId) {
    return request({
      url: `/eduService/course/publishCourse/${courseId}`,
      method: 'put'
    })
  },
  // 课程列表，条件分页查询
  getPageList(current, limit, searchObj) {
    return request({
      url: `/eduService/course/pageCourseCondition/${current}/${limit}`,
      method: 'post',
      // 后端使用RequestBody请求数据，data表示把对象转换json形式传递到接口中
      data: searchObj
    })
  },
  // 删除课程信息
  removeCourseById(id) {
    return request({
      url: `/eduService/course/${id}`,
      method: 'delete'
    })
  }
}
