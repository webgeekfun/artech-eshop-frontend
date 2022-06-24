<template>
  <div class="box-comment">
    <div class="flex mb-3">
      <div class="img-wrap" :style="{ 'background-image': 'url(' + avatar + ')' }"></div>
      <div class="comment-wrap">
        <h6>{{ username }}</h6>
        <span class="time">{{ $formatDate(true, comment.createTime) }}</span>
        <p>{{ comment.content }}</p>
        <div class="rating-list">
          <span
            v-for="n in 5"
            :key="n"
            :class="['star-box', comment.score >= n ? 'bi-star-fill' : 'bi-star']"
          ></span>
        </div>
        <div class="comment-operate-btn mt12">
          <span @click="replyCommentHandler">回复</span>
          <span
            @click="deleteCommentHandler(comment.commentId)"
            v-if="$store.state.nickNameInfo == username"
          >
            删除
          </span>
        </div>
      </div>
    </div>
    <vue-comment-input
      class="mb-3"
      v-if="isShowInput"
      :commentId="comment.commentId"
      @hide-comment-handler="hideCommentHandler"
    />

    <div class="flex box-comment-reply mb-3" v-for="_ in showReplies" :key="_.replyId">
      <div
        class="img-wrap"
        :style="{ 'background-image': 'url(' + _.user.avatar + ')' }"
      ></div>
      <div class="comment-wrap">
        <h6>{{ _.user.username }}</h6>
        <span class="time">{{ $formatDate(true, _.createTime) }}</span>
        <p>{{ _.content }}</p>
        <div
          class="comment-operate-btn mt12"
          v-if="$store.state.nickNameInfo == _.user.username"
          @click="deleteReplyCommentHandler(_.replyId)"
        >
          <span>删除</span>
        </div>
      </div>
    </div>
    <!-- 超过2条显示展开更多，没点一次展开更多，多展示2条，全部展开之后，显示全部收回，点击全部收回，只剩余2条 -->
    <div class="unfold_retract">
      <span @click="unfoldReplyHandler" v-if="allReplies.length > showReplies.length">
        展开更多 <span class="bi-arrow-right"></span>
      </span>
      <span
        @click="retractReplyHandler"
        v-if="allReplies.length == showReplies.length && allReplies.length > 2"
      >
        全部收回 <span class="bi-arrow-right"></span>
      </span>
    </div>
  </div>
</template>
<script>
  import VueCommentInput from './CommentInput';
  export default {
    name: 'CommentItem',
    inject: ['Comment'],
    components: {
      VueCommentInput
    },
    props: {
      comment: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        isShowInput: false,
        appName: '',
        content: '',
        showReplies: [], //默认显示的数组数
        showCount: 2, //每次多展示2条
        index: 1 //展示第几个showCount
      };
    },
    mounted() {
      this.appName = this.$store.state.appName;
    },
    watch: {
      allReplies: {
        handler() {
          this.showReplies = this.allReplies.slice(0, this.showCount);
        },
        immediate: true //watch默认绑定，页面首次加载时，是不会执行的。只有值发生改变才会执行
      }
    },
    computed: {
      username() {
        return this.comment.user?.username;
      },
      avatar() {
        const avatar = this.comment.user?.avatar;
        let avatarUrl = '';
        if (avatar && avatar != 'None') {
          avatarUrl = process.env.VUE_APP_COVER_URL + avatar;
        } else avatarUrl = process.env.VUE_APP_COVER_URL;
        return avatarUrl;
      },
      allReplies() {
        const replies = this.comment.replies;
        if (replies.length > 0) {
          replies.map(ele => {
            if (ele.user.avatar && ele.user.avatar != 'None') {
              ele.user.avatar = process.env.VUE_APP_COVER_URL + ele.user.avatar;
            } else ele.user.avatar = process.env.VUE_APP_COVER_URL;
          });
        }
        return replies;
      }
    },
    methods: {
      // 删除回复
      deleteReplyCommentHandler(replyId) {
        const _this = this;
        this.$ajax.post(
          '/reply/' + replyId + '/delete?appName=' + this.appName,
          '',
          2,
          '',
          response => {
            if (response.status >= 200 && response.status < 300) {
              _this.Comment.getCommentsHandler();
            } else {
              console.log(response);
            }
          }
        );
      },
      // 删除评论
      deleteCommentHandler(commentId) {
        const _this = this;
        this.$ajax.post(
          '/comment/' + commentId + '/delete?appName=' + this.appName,
          '',
          2,
          '',
          response => {
            if (response.status >= 200 && response.status < 300) {
              _this.Comment.getCommentsHandler();
            } else {
              console.log(response);
            }
          }
        );
      },
      // 收回回复列表
      retractReplyHandler() {
        // 只展示2条数据
        this.showReplies = this.allReplies.slice(0, this.showCount);
        this.index = 1;
      },
      // 展开回复列表
      unfoldReplyHandler() {
        const arr = this.allReplies.slice(
          this.index * this.showCount,
          this.index * this.showCount + this.showCount
        );
        arr.map(item => this.showReplies.push(item));
        this.index++;
      },
      // 回复评论
      replyCommentHandler() {
        if (!this.$store.state.nickNameInfo) {
          this.$showLogin();
          return;
        }
        this.isShowInput = !this.isShowInput;
      },
      // 隐藏输入框
      hideCommentHandler() {
        this.isShowInput = false;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .img-wrap {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    margin-right: 10px;
  }

  .comment-wrap {
    position: relative;
    border-radius: 4px;
    background-color: #f8f8f8;
    flex: 1;
    padding: 30px 35px;

    &:before {
      right: 100%;
      top: 35px;
      bottom: auto;
      left: auto;
      border-right-color: #f8f8f8;
      border-bottom-color: transparent;
      margin-top: -11px;
      margin-left: 0;
    }

    .time {
      font-size: 12px;
    }

    p {
      font-size: 14px;
      margin-top: 10px;
      color: $fontActiveColor;
    }

    .rating-list {
      font-size: 12px;
    }

    .comment-operate-btn {
      font-size: 12px;
      margin-top: 10px;

      span {
        cursor: pointer;
      }

      span:first-child {
        margin-right: 10px;
      }
    }
  }
  // 回复评论
  .box-comment-reply {
    padding-left: 70px;
  }

  .unfold_retract {
    font-size: 14px;
    text-align: right;
    cursor: pointer;
  }
</style>
