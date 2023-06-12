import request from '@/utils/request'

export default {
  // 查询小节信息
  getAllVideoById(chapterId) {
    return request({
      url: `/eduService/video/getAllVideo/${chapterId}`,
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
  addVideo(video) {
    return request({
      url: `/eduService/video/addVideo`,
      method: 'post',
      data: video
    })
  },
  // 修改小节信息
  updateVideo(video) {
    return request({
      url: `/eduService/video/updateVideo`,
      method: 'post',
      data: video
    })
  },
  // 删除小节信息
  deleteVideo(videoId) {
    return request({
      url: `/eduService/video/deleteVideo/${videoId}`,
      method: 'delete'
    })
  },
  // 删除阿里云视频信息
  deleteAliyunvod(videoId) {
    return request({
      url: `/eduVod/removeAlyVideo/${videoId}`,
      method: 'delete'
    })
  }
}
