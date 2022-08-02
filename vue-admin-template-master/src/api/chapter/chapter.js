import request from '@/utils/request'

export default {
  // 查询所有章节及小节信息
  getChapterVideoById(courseId) {
    return request({
      url: `/eduService/chapter/getChapterVideo/${courseId}`,
      method: 'get'
    })
  },
  // 查询所有章节及小节信息
  getChapterById(chapterId) {
    return request({
      url: `/eduService/chapter/getChapterById/${chapterId}`,
      method: 'get'
    })
  },
  // 添加章节信息
  addChapter(chapter) {
    return request({
      url: `/eduService/chapter/addChapter`,
      method: 'post',
      data: chapter
    })
  },
  // 修改章节信息
  updateChapter(chapter) {
    return request({
      url: `/eduService/chapter/updateChapter`,
      method: 'post',
      data: chapter
    })
  },
  // 删除章节信息
  deleteChapter(chapterId) {
    return request({
      url: `/eduService/chapter/deleteChapter/${chapterId}`,
      method: 'delete'
    })
  }
}
