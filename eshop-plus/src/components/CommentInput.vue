<template>
  <div class="comment-textarea">
    <ValidationObserver tag="div" ref="addCommentObs">
      <ValidationProvider
        class="tip-wrapper"
        name="评论内容"
        tag="div"
        rules="required"
        v-slot="{ errors }"
      >
        <textarea
          v-model="addCommentObj.content"
          class="form-control"
          rows="8"
          id="comment-message"
          placeholder="请输入评论内容"
        ></textarea>
        <span class="tip-info">{{ errors[0] }}</span>
      </ValidationProvider>
      <div class="rating-wrap flex" v-if="isFirstComment">
        <span>您对{{ $store.state.appName == 'product' ? '产品' : '文章' }}的评分：</span>
        <div class="rating-list">
          <span
            v-for="_ in 5"
            :key="_"
            @click="selectRatingHandler(_)"
            :class="[
              'cursor star-box',
              addCommentObj.score >= _ ? 'bi-star-fill' : 'bi-star'
            ]"
          ></span>
        </div>
      </div>
      <div class="btn-wrap">
        <div class="button button-primary" @click="addCommentHandler">
          提交
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>
<script>
  export default {
    name: 'CommentInput',
    inject: ['Comment'],
    props: {
      isFirstComment: {
        default: false,
        type: Boolean
      },
      commentId: {
        default: ''
      }
    },
    data() {
      return {
        addCommentObj: {
          objectId: 0,
          content: '',
          score: -1
        }
      };
    },
    methods: {
      // 选择评分
      selectRatingHandler(n) {
        if (this.addCommentObj.score == n) this.addCommentObj.score = 0;
        else this.addCommentObj.score = n;
      },
      // 添加文章
      async addCommentHandler() {
        const isValid = await this.$refs.addCommentObs.validate();
        if (!isValid) {
          console.log('没有通过校验');
          return false;
        }

        const _this = this;
        let url = '';
        let params = {};
        if (this.isFirstComment) {
          this.addCommentObj.objectId = Number(this.Comment.articleId);
          console.log(this.addCommentObj.objectId);
          url = '/comment/create';
          params = this.addCommentObj;
        } else {
          url = '/reply/create';
          params = {
            content: this.addCommentObj.content,
            commentId: this.commentId
          };
        }

        params.appName = this.$store.state.appName;

        this.$ajax.post(url, params, 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            // 清空重置数据
            _this.addCommentObj.content = '';
            // 清空错误提示
            _this.$refs.addCommentObs.reset();

            if (_this.isFirstComment) {
              // alert('添加成功！')
              _this.addCommentObj.score = -1;
            } else {
              //如果是二级评论，隐藏输入框
              // alert('回复成功！')
              _this.$emit('hide-comment-handler');
            }

            _this.Comment.getCommentsHandler();
          } else {
            console.log(response);
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .comment-textarea {
    margin-top: 20px;
  }

  .rating-wrap {
    font-size: 16px;
  }

  .btn-wrap {
    text-align: right;
  }

  .tip-wrapper span.tip-info {
    position: initial;
  }
</style>
