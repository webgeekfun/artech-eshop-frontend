<template>
  <section class="section-sm" ref="commentWrapEle">
    <div class="comment-title flex justify-content-space-between items-center">
      <h3>{{ totalItemCount || 0 }}条评论</h3>
      <span class="cursor" @click="showCommentHandler">留言</span>
    </div>
    <vue-comment-input :isFirstComment="true" v-if="isShowComment" />
    <!-- 加载中~ -->
    <vue-loading :isLoading="isLoading" />

    <div class="mt50" v-if="comments">
      <vue-comment-item
        class="mb-4"
        v-for="_ in comments"
        :key="_.commentId"
        :comment="_"
      />
    </div>
    <div class="mt50" v-if="comments.length < 1 && !isLoading">
      还没有人评论，快来评论吧~
    </div>

    <div class="mt50" v-if="totalPage > 1">
      <vue-pagination
        :page="selector.page"
        :totalPage="totalPage"
        @page-handler="pageInit"
      ></vue-pagination>
    </div>
  </section>
</template>

<script>
  import VueCommentInput from './CommentInput';
  import VueCommentItem from './CommentItem';
  export default {
    name: 'Comment',
    components: {
      VueCommentInput,
      VueCommentItem
    },
    provide() {
      return {
        Comment: this
      };
    },
    props: {
      articleId: {
        default: 0
      }
    },
    data() {
      return {
        isShowComment: false,
        pageSize: 5,
        // appName: 'article',
        selector: {
          objectId: 0,
          page: 1
        },
        comments: [],
        isLoading: true,
        totalPage: 0, //总页数
        totalItemCount: 0 //总条数
      };
    },
    watch: {
      articleId(value) {
        this.selector.objectId = value;
        this.getCommentsHandler();
      },
      newSelector: {
        handler(newVal, oldVal) {
          // 检测到page变化，但是输出的新旧值的page一样，因此使用序列化和反序列化的方式：JSON.stringify和JSON.parse
          const newVal1 = JSON.parse(newVal);
          const oldVal1 = JSON.parse(oldVal);
          // 评论分页之后，需要滚动到评论的顶部
          // if (newVal1.page != oldVal1.page && newVal1.objectId == oldVal1.objectId) {
          if (newVal1.page != oldVal1.page) {
            const top = this.$refs.commentWrapEle.offsetTop;
            window.scrollTo(0, top);
          }
          this.getCommentsHandler();
        },
        deep: true
      }
    },
    computed: {
      newSelector() {
        return JSON.stringify(this.selector);
      }
    },
    methods: {
      // 点击分页
      pageInit(page) {
        this.selector.page = page;
      },
      // 获取评论列表
      getCommentsHandler() {
        // this.selector.appName = this.appName;
        this.selector.appName = this.$store.state.appName;
        this.selector.pageSize = this.pageSize;
        const _this = this;
        this.$ajax.get('/comment/list', this.selector, 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            _this.isLoading = false;
            _this.comments = response.data.comments;

            _this.totalPage = response.data.pagination?.pageCount || 0;
            _this.selector.page = response.data.pagination?.pageNumber || 1;
            // 总条数
            _this.totalItemCount = response.data.pagination?.totalItemCount || 0;
          } else {
            console.log(response);
            _this.isLoading = false;
          }
        });
      },
      // 展示留言输入框
      showCommentHandler() {
        if (!this.$store.state.nickNameInfo) {
          this.$showLogin();
          return;
        }
        this.isShowComment = !this.isShowComment;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .comment-title {
    h3 {
      margin-bottom: 0;
    }
  }
</style>
