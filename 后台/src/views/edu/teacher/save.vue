<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          min="0"
        />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select
          v-model="teacher.level"
          clearable
          placeholder="请选择"
        >
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option
            :value="1"
            label="高级讲师"
          />
          <el-option
            :value="2"
            label="首席讲师"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input
          v-model="teacher.intro"
          :rows="10"
          type="textarea"
        />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
        >更换头像
        </el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API + '/eduOss/fileOss/uploadOssFile'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
        >保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacherApi from '@/api/teacher/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      imagecropperShow: false,
      imagecropperKey: 0, //  上传组件key的值
      BASE_API: process.env.BASE_API,
      saveBtnDisabled: false
    }
  },
  watch: {
    // 监听
    $route(to, form) {
      this.init()
    }
  },
  created() {
    //  页面渲染之前执行
    this.init()
  },
  methods: {
    close() {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    },
    cropSuccess(data) {
      this.imagecropperShow = false
      // 上传文件之后返回图像地址
      this.teacher.avatar = data.url
      this.imagecropperKey = this.imagecropperKey + 1
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        //  从路径获取id值
        const id = this.$route.params.id
        //  调用根据id查询的方法
        this.getInfo(id)
      } else {
        //  清空表单
        this.teacher = {}
      }
    },
    // 根据讲师id查询的方法
    getInfo(id) {
      teacherApi.getTeacherInfo(id).then((response) => {
        this.teacher = response.data.teacher
      })
    },
    // 添加或修改
    saveOrUpdate() {
      if (!this.teacher.id) {
        this.saveTeacher()
      } else {
        this.updateTeacher()
      }
    },
    //  修改讲师信息
    updateTeacher() {
      teacherApi.updateTeacherInfo(this.teacher).then((response) => {
        //  提示信息
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        // 回到列表页面 路由跳转
        this.$router.push({ path: '/teacher/table' })
      })
    },
    // 添加讲师的方法
    saveTeacher() {
      teacherApi.addTeacher(this.teacher).then((response) => {
        //  提示信息
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        // 回到列表页面 路由跳转
        this.$router.push({ path: '/teacher/table' })
      })
    },
    // 上传成功回调
    handleAvatarSuccess(res, file) {
      // console.log(res)
      if (res.code === 200) {
        // console.log(res)
        this.teacher.avatar = res.data
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败 （非0）')
      }
    },

    // 错误处理
    handleAvatarError() {
      console.log('error')
      this.$message.error('上传失败（http失败）')
    },

    // 上传校验
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
    }
  }
}
</script>

<style></style>
