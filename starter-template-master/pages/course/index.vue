<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- /课程列表 开始 -->
    <section class="container">
      <header class="comm-title">
        <h2 class="fl tac">
          <span class="c-333">全部课程</span>
        </h2>
      </header>
      <section class="c-sort-box">
        <section class="c-s-dl">
          <dl>
            <dt>
              <span class="c-999 fsize14">课程类别</span>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li>
                  <a title="全部" href="#">全部</a>
                </li>
                <li v-for="(subject, index) in subjectNestedList" :key="index" :class="{ active: oneIndex == index }">
                  <a :title="subject.title" @click="searchOne(subject.id, index)"
                    href="javascript:void(0);">{{ subject.title }}</a>
                </li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt>
              <span class="c-999 fsize14"></span>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li v-for="(item, index) in subSubjectList" :key="index" :class="{ active: twoIndex == index }">
                  <a :title="item.title" href="#" @click="searchTwo(item.id, index)">{{ item.title }}</a>
                </li>
              </ul>
            </dd>
          </dl>
          <div class="clear"></div>
        </section>
        <div class="js-wrap">
          <section class="fr">
            <span class="c-ccc">
              <i class="c-master f-fM">1</i>/
              <i class="c-666 f-fM">1</i>
            </span>
          </section>
          <section class="fl">
            <ol class="js-tap clearfix">
              <li :class="{ 'current bg-orange': buyCountSort != '' }">
                <a title="销量" href="javascript:void(0);" @click="searchBuyCount()">销量
                  <span :class="{ hide: buyCountSort == '' }">↓</span>
                </a>
              </li>
              <li :class="{ 'current bg-orange': gmtCreateSort != '' }">
                <a title="最新" href="javascript:void(0);" @click="searchGmtCreate()">最新
                  <span :class="{ hide: gmtCreateSort == '' }">↓</span>
                </a>
              </li>
              <li :class="{ 'current bg-orange': priceSort != '' }">
                <a title="价格" href="javascript:void(0);" @click="searchPrice()">价格&nbsp;
                  <span :class="{ hide: priceSort == '' }">↓</span>
                </a>
              </li>
            </ol>
          </section>
        </div>
        <div class="mt40">
          <!-- /无数据提示 开始-->
          <section class="no-data-wrap" v-if="data.totol == 0">
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam">没有相关数据，小编正在努力整理中...</span>
          </section>
          <!-- /无数据提示 结束-->
          <article class="comm-course-list" v-if="data.total > 0">
            <ul class="of" id="bna">
              <li v-for="course in data.courseList" :key="course.id">
                <div class="cc-l-wrap">
                  <section class="course-img">
                    <img :src="course.cover" class="img-responsive" alt="听力口语">
                    <div class="cc-mask">
                      <a :href="'/course/' + course.id" title="开始学习" class="comm-btn c-btn-1">开始学习</a>
                    </div>
                  </section>
                  <h3 class="hLh30 txtOf mt10">
                    <a :href="'/course/' + course.id" :title="course.title"
                      class="course-title fsize18 c-333">{{ course.title }}</a>
                  </h3>
                  <section class="mt10 hLh20 of">
                    <span v-if="Number(course.price) == 0" class="fr jgTag bg-green">
                      <i class="c-fff fsize12 f-fA">免费</i>
                    </span>
                    <span class="fl jgAttr c-ccc f-fA">
                      <i class="c-999 f-fA">9634人学习</i>
                      |
                      <i class="c-999 f-fA">9634评论</i>
                    </span>
                  </section>
                </div>
              </li>
            </ul>
            <div class="clear"></div>
          </article>
        </div>
        <!-- 公共分页 开始 -->
        <div>
          <div class="paging">
            <!-- undisable这个class是否存在，取决于数据属性hasPrevious -->
            <a :class="{ undisable: !data.hasPrevious }" href="#" title="首页" @click.prevent="gotoPage(1)">首</a>
            <a :class="{ undisable: !data.hasPrevious }" href="#" title="前一页"
              @click.prevent="gotoPage(data.current - 1)">&lt;</a>
            <a v-for="page in data.pages" :key="page"
              :class="{ current: data.current == page, undisable: data.current == page }" :title="'第' + page + '页'" href="#"
              @click.prevent="gotoPage(page)">{{ page }}</a>
            <a :class="{ undisable: !data.hasNext }" href="#" title="后一页"
              @click.prevent="gotoPage(data.current + 1)">&gt;</a>
            <a :class="{ undisable: !data.hasNext }" href="#" title="末页" @click.prevent="gotoPage(data.pages)">末</a>
            <div class="clear" />
          </div>
        </div>
        <!-- 公共分页 结束 -->
      </section>
    </section>
    <!-- /课程列表 结束 -->
  </div>
</template>
<script>
import courseApi from '@/api/course'
export default {
  data() {
    return {
      page: 1,
      data: {},
      subjectNestedList: [], // 一级分类列表
      subSubjectList: [], // 二级分类列表
      courseQuery: {}, // 查询表单对象
      oneIndex: -1,
      twoIndex: -1,
      buyCountSort: "",
      gmtCreateSort: "",
      priceSort: ""
    }
  },
  created() {
    //1、查询前台课程
    this.initCourseFirst()
    //查询课程分类
    this.initSubject()
  },
  methods: {
    //1、查询第一页数据
    initCourseFirst() {
      courseApi.getFrontCourseList(1, 8, this.courseQuery)
        .then(response => {
          this.data = response.data.data

        })
    },
    //2、查询所有分类，实现二级联动
    initSubject() {
      courseApi.getAllSubject().then(response => {
        this.subjectNestedList = response.data.data.list
      })
    },
    //3、分页切换的方法
    gotoPage(page) {
      courseApi.getFrontCourseList(page, 8, this.courseQuery)
        .then(response => {
          this.data = response.data.data
        })
    },
    //4、点击某个一级分类，查询对应的二级分类，实现二级联动
    searchOne(subjectParentId, index) {
      //把传递的index值赋值给oneIndex，为了使active生效
      this.oneIndex = index
      this.twoIndex = -1
      this.courseQuery.subjectId = ""
      this.subSubjectList = []
      //把一级分类的id值，赋值给subjectParentId
      this.courseQuery.subjectParentId = subjectParentId
      this.gotoPage(1)
      //1、拿着一级分类的id和所有一级分类id进行比较，
      //2、如果id相同，从一级分类的children里面取出对应的二级分类
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        //获取每一个一级分类的id值
        if (this.subjectNestedList[i].id === subjectParentId) {
          this.subSubjectList = this.subjectNestedList[i].children
        }
      }
    },
    //5、查询二级分类
    searchTwo(subjectId, index) {
      this.twoIndex = index
      //把二级分类的id值，赋值给subjectId
      this.courseQuery.subjectId = subjectId
      this.gotoPage(1)
    },
    //6、根据销量排序
    searchBuyCount() {
      this.buyCountSort = '1'
      this.gmtCreateSort = ''
      this.priceSort = ''
      //把值赋值到coursequery
      this.courseQuery.buyCountSort = this.buyCountSort
      this.courseQuery.gmtCreateSort = this.gmtCreateSort
      this.courseQuery.priceSort = this.priceSort

      //调用方法查询
      this.gotoPage(1)
    },
    //7、更新时间查询
    searchGmtCreate() {
      debugger
      this.buyCountSort = "";
      this.gmtCreateSort = "1";
      this.priceSort = "";
      this.courseQuery.buyCountSort = this.buyCountSort;
      this.courseQuery.gmtCreateSort = this.gmtCreateSort;
      this.courseQuery.priceSort = this.priceSort;
      this.gotoPage(this.page)
    },
    //8、价格查询
    searchPrice() {
      this.buyCountSort = "";
      this.gmtCreateSort = "";
      this.priceSort = "1";
      this.courseQuery.buyCountSort = this.buyCountSort;
      this.courseQuery.gmtCreateSort = this.gmtCreateSort;
      this.courseQuery.priceSort = this.priceSort;
      this.gotoPage(this.page)
    },
  }
};
</script>
<style scoped>
.active {
  background: #bdbdbd;
}

.hide {
  display: none;
}

.show {
  display: block;
}
</style>