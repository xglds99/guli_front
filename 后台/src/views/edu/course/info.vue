<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px;"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="请选择"
          @change="subjectTwoChanged"
        >
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 TODO -->
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>
      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduOss/fileOss/uploadOssFile'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" >
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>
      <el-form label-width="120px">
        <el-form-item>
          <el-button
            :disabled="saveBtnDisabled"
            type="primary"
            @click="saveOrUpdate"
          >保存并下一步</el-button
          >
        </el-form-item>
      </el-form>
    </el-form>
  </div>
</template>

<script>
import course from '@/api/course/course'
import teacherApi from '@/api/teacher/teacher'
import subject from '@/api/subject/subject'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: '',
        subjectId: '', //   二级分类ID
        subjectParentId: '', // 一级分类ID
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '/static/cover.png',
        price: 0
      },
      BASE_API: process.env.BASE_API,
      teacherList: [],
      subjectNestedList: [], // 一级分类列表
      subSubjectList: [] // 二级分类列表
    }
  },
  watch: {
    // 监听
    $route(to, form) {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        this.getCourseInfo()
      } else {
        this.courseInfo = {}
        this.courseInfo.cover = '/static/cover.png'
        this.initTeacherList()
        this.initSubjectList()
      }
    },
    // 根据课程id查询课程信息
    getCourseInfo() {
      course.getCourseInfoById(this.courseId).then(response => {
        this.courseInfo = response.data.courseInfo
        //  查询所有一级分类，一级分类包含二级分类
        subject.getSubjectList().then(response => {
          this.subjectNestedList = response.data.list
          for (let index = 0; index < this.subjectNestedList.length; index++) {
            // 获取每个一级分类，
            const oneSubject = this.subjectNestedList[index]
            // 比较当前courseInfo里面的一级分类id和所i有的一级分类id
            if (this.courseInfo.subjectParentId === oneSubject.id) {
              // 获取一级分类里面的二级分类
              this.subSubjectList = oneSubject.children
            }
          }
        })
        this.initTeacherList()
      })
    },
    handleAvatarSuccess(res, file) {
      console.log(res) // 上传响应
      console.log(URL.createObjectURL(file.raw)) // base64编码
      this.courseInfo.cover = res.data.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    saveOrUpdate() {
      // 判断是添加还是修改
      if (!this.courseInfo.id) {
        this.addCourse()
      } else {
        this.updateCourse()
      }
    },
    addCourse() {
      course.addCourseInfo(this.courseInfo).then(response => {
        //  提示
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        // 跳转到第二步
        this.$router.push({ path: '/course/chapter/' + response.data.courseId })
      })
    },
    updateCourse() {
      course.updateCourseInfo(this.courseInfo).then(response => {
        //  提示
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        // 跳转到第二步
        this.$router.push({ path: '/course/chapter/' + this.courseId })
      })
    },
    initTeacherList() {
      teacherApi.getTeacherList().then(response => {
        this.teacherList = response.data.items
      })
    },
    initSubjectList() {
      subject.getSubjectList().then(response => {
        this.subjectNestedList = response.data.list
      })
    },
    subjectLevelOneChanged(value) {
      console.log(value)
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        if (this.subjectNestedList[i].id === value) {
          this.subSubjectList = this.subjectNestedList[i].children
          //    在选择一个一级分类时，把上一次二级分类的值清空
          this.courseInfo.subjectId = ''
        }
      }
    },

    subjectTwoChanged() {
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
