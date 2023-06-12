<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px;"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-button
      type="text"
      @click="opendialogChapterVisible()"
    >添加章节</el-button
    >
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API + '/eduVod/uploadVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br >
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br >
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br >
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br >
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
        >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
            <el-button
              type="text"
              @click="openVideo(chapter.id)"
            >添加课时</el-button
            >
            <el-button
              style=""
              type="text"
              @click="openEditChapter(chapter.id)"
            >编辑</el-button
            >
            <el-button
              type="text"
              @click="removeChapter(chapter.id)"
            >删除</el-button
            >
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button
                  type="text"
                  @click="editVideo(video.id)"
                >编辑</el-button
                >
                <el-button
                  type="text"
                  @click="removeVideo(video.id)"
                >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="next"
        >下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import chapter from '@/api/chapter/chapter'
import video from '@/api/video/video'
export default {
  data() {
    return {
      dialogVideoFormVisible: false, // 控制小节弹框
      dialogChapterFormVisible: false, // 控制章节弹框
      chapter: {
        id: '',
        courseId: '',
        title: '',
        sort: 0
      },
      video: {
        // 课时对象
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: '',
        courseId: '',
        videoOriginalName: ''
      },
      courseId: '',
      chapterVideoList: [],
      saveBtnDisabled: false, // 保存按钮是否禁用
      fileList: [], // 上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },

  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getChapterVideo()
      this.chapter.courseId = this.courseId
    }
  },

  methods: {
    // ==================阿里云视频点播操作==================================
    // 上传视频成功调用的方法！
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName = file.name
    },
    //  点击确定调用的方法
    handleVodRemove() {
      video.deleteAliyunvod(this.video.videoSourceId).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 把文件列表置空
        this.fileList = []
        // 把video视频id和视频名称值清空
        this.video.videoOriginalName = ''
        this.video.videoSourceId = ''
      })
    },
    //  点击x调用的方法
    beforeVodRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // ============================小节操作=================================
    removeVideo(videoId) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return video.deleteVideo(videoId)
        })
        .then(() => {
          this.getChapterVideo() // 刷新列表
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(response => {
          // 失败
          if (response === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          }
        })
    },
    openVideo(chapterId) {
      // 弹框
      this.dialogVideoFormVisible = true
      // 设置章节ID
      this.video.chapterId = chapterId
      this.video.courseId = this.courseId
    },
    saveOrUpdateVideo() {
      if (!this.video.id) {
        console.log(this.video)
        this.addVideo()
      } else {
        this.updateVideo()
      }
    },
    addVideo() {
      video.addVideo(this.video).then(response => {
        this.video = {}
        this.fileList = []
        //  提示
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.dialogVideoFormVisible = false
        this.getChapterVideo()
      })
    },
    updateVideo() {
      video.updateVideo(this.video).then(response => {
        //  提示
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.dialogVideoFormVisible = false
        this.getChapterVideo()
      })
    },
    // ============================章节操作==================================
    // 删除章节信息
    removeChapter(chapterId) {
      this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter
          .deleteChapter(chapterId)
          .then(response => {
            // 删除成功
            // 提示新信息
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 回到列表页面
            this.getChapterVideo()
          })
          .catch(error => {
            alert(error)
          })
      })
    },

    // 修改章节数据，进行数据回显
    openEditChapter(chapterId) {
      console.log(chapter)
      this.dialogChapterFormVisible = true
      chapter.getChapterById(chapterId).then(response => {
        this.chapter = response.data.chapter
      })
    },
    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/info/' + this.courseId })
    },

    next() {
      console.log('next')
      this.$router.push({ path: '/course/publish/' + this.courseId })
    },

    getChapterVideo() {
      chapter.getChapterVideoById(this.courseId).then(response => {
        this.chapterVideoList = response.data.allChapterVideo
      })
    },
    // 添加章节
    addChapter() {
      chapter.addChapter(this.chapter).then(response => {
        //  提示
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.dialogChapterFormVisible = false
        this.getChapterVideo()
      })
    },
    // 修改章节信息
    updateChapter() {
      chapter.updateChapter(this.chapter).then(response => {
        //  提示
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.dialogChapterFormVisible = false
        this.getChapterVideo()
      })
    },
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.addChapter()
      } else {
        this.updateChapter()
      }
    },

    opendialogChapterVisible() {
      this.dialogChapterFormVisible = true
      this.chapter.title = ''
      this.chapter.sort = 0
    }
  }
}
</script>
<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList p {
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>
