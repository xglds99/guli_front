<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- /课程详情 开始 -->
    <section class="container">
      <section class="path-wrap txtOf hLh30">
        <a href="#" title class="c-999 fsize14">首页</a>
        \
        <a href="#" title class="c-999 fsize14">{{ courseWebVo.subjectLevelOne }}</a>
        \
        <span class="c-333 fsize14">{{ courseWebVo.subjectLevelTwo }}</span>
      </section>
      <div>
        <article class="c-v-pic-wrap" style="height: 357px;">
          <section class="p-h-video-box" id="videoPlay">
            <img height="357px" :src="courseWebVo.cover" :alt="courseWebVo.title" class="dis c-v-pic">
          </section>
        </article>
        <aside class="c-attr-wrap">
          <section class="ml20 mr15">
            <h2 class="hLh30 txtOf mt15">
              <span class="c-fff fsize24">{{ courseWebVo.title }}</span>
            </h2>
            <section class="c-attr-jg">
              <span class="c-fff">价格：</span>
              <b class="c-yellow" style="font-size:24px;">￥{{ courseWebVo.price }}</b>
            </section>
            <section class="c-attr-mt c-attr-undis">
              <span class="c-fff fsize14">主讲： {{ courseWebVo.teacherName }}&nbsp;&nbsp;&nbsp;</span>
            </section>
            <section class="c-attr-mt of">
              <span class="ml10 vam">
                <em class="icon18 scIcon"></em>
                <a class="c-fff vam" title="收藏" href="#">收藏</a>
              </span>
            </section>
            <section v-if="isbuy || Number(courseWebVo.price) === 0" class="c-attr-mt">
              <a href="#" title="立即观看" class="comm-btn c-btn-3">立即观看</a>
            </section>
            <section v-else class="c-attr-mt">
              <a href="#" title="立即购买" class="comm-btn c-btn-3" @click="createOrders()">立即购买</a>
            </section>
          </section>s
        </aside>
        <aside class="thr-attr-box">
          <ol class="thr-attr-ol clearfix">
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">购买数</span>
                <br>
                <h6 class="c-fff f-fM mt10">{{ courseWebVo.buyCount }}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">课时数</span>
                <br>
                <h6 class="c-fff f-fM mt10">{{ courseWebVo.lessonNum }}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">浏览数</span>
                <br>
                <h6 class="c-fff f-fM mt10">{{ courseWebVo.viewCount }}</h6>
              </aside>
            </li>
          </ol>
        </aside>
        <div class="clear"></div>
      </div>
      <!-- /课程封面介绍 -->
      <div class="mt20 c-infor-box">
        <article class="fl col-7">
          <section class="mr30">
            <div class="i-box">
              <div>
                <section id="c-i-tabTitle" class="c-infor-tabTitle c-tab-title">
                  <a name="c-i" class="current" title="课程详情">课程详情</a>
                </section>
              </div>
              <article class="ml10 mr10 pt20">
                <div>
                  <h6 class="c-i-content c-infor-title">
                    <span>课程介绍</span>
                  </h6>
                  <div class="course-txt-body-wrap">
                    <section class="course-txt-body">
                      <p v-html="courseWebVo.description">
                      </p>
                    </section>
                  </div>
                </div>
                <!-- /课程介绍 -->
                <div class="mt50">
                  <h6 class="c-g-content c-infor-title">
                    <span>课程大纲</span>
                  </h6>
                  <section class="mt20">
                    <div class="lh-menu-wrap">
                      <menu id="lh-menu" class="lh-menu mt10 mr10">
                        <ul>
                          <!-- 文件目录 -->
                          <li class="lh-menu-stair" v-for="chapter in chapterVideoList" :key="chapter.id">
                            <a href="javascript: void(0)" :title="chapter.title" class="current-1">
                              <em class="lh-menu-i-1 icon18 mr10"></em>{{ chapter.title }}
                            </a>
                            <ol class="lh-menu-ol" style="display: block;">
                              <li class="lh-menu-second ml30" v-for="video in chapter.children" :key="video.id">
                                <a :href="'/player/' + video.videoSourceId" :title="video.title" target="_blank">
                                  <span class="fr">
                                    <i class="free-icon vam mr10">免费试听</i>
                                  </span>
                                  <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title }}
                                </a>
                              </li>
                            </ol>
                          </li>
                        </ul>
                      </menu>
                    </div>
                  </section>
                </div>
                <!-- /课程大纲 -->
              </article>
            </div>
          </section>
        </article>
        <aside class="fl col-3">
          <div class="i-box">
            <div>
              <section class="c-infor-tabTitle c-tab-title">
                <a title href="javascript:void(0)">主讲讲师</a>
              </section>
              <section class="stud-act-list">
                <ul style="height: auto;">
                  <li>
                    <div class="u-face">
                      <a href="#">
                        <img :src="courseWebVo.avatar" width="50" height="50" alt>
                      </a>
                    </div>
                    <section class="hLh30 txtOf">
                      <a class="c-333 fsize16 fl" href="#">{{ courseWebVo.teacherName }}</a>
                    </section>
                    <section class="hLh20 txtOf">
                      <span class="c-999">{{ courseWebVo.intro }}</span>
                    </section>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </aside>
        <div class="clear"></div>
      </div>
    </section>
    <div class="mt50 commentHtml">
      <div>
        <h6 class="c-c-content c-infor-title" id="i-art-comment">
          <span class="commentTitle">课程评论</span>
        </h6>
        <section class="lh-bj-list pr mt20 replyhtml">
          <ul>
            <li class="unBr">
              <aside class="noter-pic">
                <img width="50" height="50" class="picImg" src="~/assets/img/avatar-boy.gif">
              </aside>
              <div class="of">
                <section class="n-reply-wrap">
                  <fieldset>
                    <textarea name="" v-model="comment.content" placeholder="输入您要评论的文字" id="commentContent"></textarea>
                  </fieldset>
                  <p class="of mt5 tar pl10 pr10">
                    <span class="fl "><tt class="c-red commentContentmeg" style="display: none;"></tt></span>
                    <input type="button" @click="addComment()" value="回复" class="lh-reply-btn">
                  </p>
                </section>
              </div>
            </li>
          </ul>
        </section>
        <section class="">
          <section class="question-list lh-bj-list pr">
            <ul class="pr10">
              <li v-for="(comment, index) in data.items" v-bind:key="index">
                <aside class="noter-pic">
                  <img width="50" height="50" class="picImg" :src="comment.avatar">
                </aside>
                <div class="of">
                  <span class="fl">
                    <font class="fsize12 c-blue">
                      {{ comment.nickname }}</font>
                    <font class="fsize12 c-999 ml5">评论：</font>
                  </span>
                </div>
                <div class="noter-txt mt5">
                  <p>{{ comment.content }}</p>
                </div>
                <div class="of mt5">
                  <span class="fr">
                    <font class="fsize12 c-999 ml5">{{ comment.gmtCreate }}</font>
                  </span>
                </div>
              </li>

            </ul>
          </section>
        </section>

        <!-- 分页 使用element-ui疯转好的插件 -->
        <el-pagination :current-page="page" :page-size="limit" :total="total"
          style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper"
          @current-change="getComment" />
        <!-- 分页结束 -->
      </div>
    </div>
    <!-- /课程详情 结束 -->
  </div>
</template>

<script>
import cookie from 'js-cookie'
import courseApi from '@/api/course'
import orderApi from '@/api/order'
export default {
  data() {
    return {
      data: {},
      comment: {
        content: '',
        courseId: ''
      },
      courseId: '',
      page: 1,
      limit: 4,
      total: 0,
      courseWebVo: {},
      chapterVideoList: [],
      isbuy: false,
    }
  },
  created() {
    this.courseId = this.$route.params.id
    this.getComment()
    this.initCourseInfo()
  },
  //params.id获取路径的id值
  // asyncData({ params, error }) {
  //   return courseApi.getCourseInfo(params.id)
  //     .then(response => {
  //       return {
  //         courseWebVo: response.data.data.courseWebVo,
  //         chapterVideoList: response.data.data.chapterVideoList
  //       }
  //     })
  // },
  methods: {
    //***********初始化课程信息************
    initCourseInfo() {
      courseApi.getCourseInfo(this.courseId)
        .then(response => {
          this.courseWebVo = response.data.data.courseWebVo
          this.chapterVideoList = response.data.data.chapterVideoList
          this.isBuy = response.data.data.isBuy

        })
    },
    // *******************评论相关***********************
    getComment(page = 1) {
      this.page = page
      courseApi.getCommentList(this.page, this.limit, this.courseId).then(response => {
        this.data = response.data.data
        this.total = response.data.data.total
      })
    },
    addComment() {
      //1.先判断是否登录
      var isLogin = cookie.get("guli_token")
      if (!isLogin) {
        this.$message({
          type: "info",
          message: "请先登录"
        })
        this.$router.push({ path: "/login" })
      }
      this.comment.courseId = this.$route.params.id
      this.comment.teacherId = this.courseWebVo.teacherId
      courseApi.addComment(this.comment)
        .then(responce => {
          if (responce.data.success) {
            this.$message({
              message: "评论成功",
              type: "success",
            })
            //清空
            this.comment = {}
            //查询评论
            this.getComment()
          }
        })
    },
    createOrders() {
      orderApi.createOrder(this.courseId).then(response => {
        if (response.data.success) {
          this.$router.push({ path: '/order/' + response.data.data.orderNo })
        }

      })
    }
  }


};
</script>
