import request from '@/utils/request'

export default {
  // 1、讲师列表，条件分页查询
  getTeacherListPage(current, limit, teacherQuery) {
    return request({
      url: `/eduService/teacher/pageTeacherCondition/${current}/${limit}`,
      method: 'post',
      // 后端使用RequestBody请求数据，data表示把对象转换json形式传递到接口中
      data: teacherQuery
    })
  },
  getTeacherList() {
    return request({
      url: `/eduService/teacher/findAll`,
      method: 'get'
    })
  },
  deleteTeacherById(id) {
    return request({
      url: `/eduService/teacher/${id}`,
      method: 'delete'
    })
  },
  // 添加讲师
  addTeacher(teacher) {
    return request({
      url: `/eduService/teacher/addTeacher`,
      method: 'post',
      data: teacher
    })
  },
  // 根据id查询
  getTeacherInfo(id) {
    return request({
      url: `/eduService/teacher/getTeacher/${id}`,
      method: 'get'
    })
  },
  // 修改讲师
  updateTeacherInfo(teacher) {
    return request({
      url: `/eduService/teacher/updateTeacher`,
      method: 'post',
      data: teacher
    })
  }
}
