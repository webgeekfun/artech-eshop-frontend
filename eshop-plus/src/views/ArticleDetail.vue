<template>
  <div class="article-detail-page">
    <!-- 面包屑导航 -->
    <vue-breadcrumb page-name="文章详情" />

    <section class="section-md">
      <div class="container container-sm container-lg container-xs">
        <div class="row">
          <div class="col-lg-7">
            <div class="flex justify-content-space-between">
              <div class="tags-wrap">
                <span
                  v-for="_ in articleObj.tags"
                  :key="_.tagId"
                  @click="toggleLeftTagHandler(_.tagId)"
                >
                  {{ _.name }}
                </span>
              </div>
              <div
                v-if="$store.state.nickNameInfo == username"
                class="edit-btn"
                @click="goArticleCreateUpdateHandler(articleId)"
              >
                编辑
              </div>
            </div>
            <div class="article-cont">
              <h1>{{ articleObj.subject }}</h1>
              <div class="info">
                <span>{{ $formatDate(false, articleObj.updateTime) }}</span>
                <span>来自 {{ username }}</span>
              </div>
              <p v-html="articleObj.content"></p>
            </div>
            <!-- 加载中~ -->
            <vue-loading :isLoading="isLoading" />

            <div class="prev_next_article section-sm">
              <div class="row">
                <div
                  :class="['col-6 text-start', preArticleId ? '' : 'end']"
                  @click="next(preArticleId)"
                >
                  <span class="bi-arrow-left"></span>
                  <div>{{ preArticleId ? preArticleSubject : '已经是第一篇了' }}</div>
                </div>
                <div
                  :class="['col-6 text-end', nextArticleId ? '' : 'end']"
                  @click="next(nextArticleId)"
                >
                  <div>{{ nextArticleId ? nextArticleSubject : '已经是最后一篇了' }}</div>
                  <span class="bi-arrow-right"></span>
                </div>
              </div>
            </div>
            <vue-comment :articleId="articleId"></vue-comment>
          </div>
          <div class="col-lg-5">
            <div
              v-if="$store.state.nickNameInfo"
              class="create-article-btn button button-primary"
              @click="goArticleCreateUpdateHandler(0)"
            >
              创建文章
            </div>
            <h4 class="mt50" v-if="relatedArticles.length > 0">相关文章</h4>
            <ul class="related-articles-ul">
              <li
                class="cursor"
                v-for="_ in relatedArticles"
                :key="_.articleId"
                @click="goArticleDetailHandler(_.articleId)"
              >
                <div>{{ _.subject }}</div>
                <p>
                  <span>{{ $formatDate(false, _.updateTime) }}</span>
                  <span>来自 {{ _.author.username }}</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import VueComment from '../components/Comment';
  export default {
    name: 'ArticleDetail',
    components: {
      VueComment
    },
    data() {
      return {
        isLoading: true,
        articleId: 0,
        articleDeatilObj: {},
        // 相关文章
        relatedArticles: [] //最新文章
      };
    },
    watch: {
      $route(to, from) {
        window.scrollTo(0, 0);
        this.articleId = to.params.articleId;
        this.initArticleDetailInfo(to.params.articleId);

        // 初始化相关文章
        if (to.params.articleId != from.params.articleId) {
          this.initrelatedArticles(to.params.articleId);
        }
      }
    },
    mounted() {
      window.scrollTo(0, 0);
      this.articleId = this.$route.params.articleId;
      this.$store.commit('setAppName', 'article');
      // 初始化文章详情信息
      this.initArticleDetailInfo(this.articleId);
      // 初始化相关文章
      this.initrelatedArticles(this.articleId);
    },
    computed: {
      articleObj() {
        return this.articleDeatilObj;
      },
      username() {
        return this.articleObj?.author?.username;
      },
      preArticleId() {
        return this.articleObj?.pre?.articleId;
      },
      nextArticleId() {
        return this.articleObj?.next?.articleId;
      },
      preArticleSubject() {
        return this.articleObj?.pre?.subject;
      },
      nextArticleSubject() {
        return this.articleObj?.next?.subject;
      }
    },
    methods: {
      // 初始化相关文章
      initrelatedArticles(articleId) {
        const _this = this;
        this.$ajax.get(
          '/article/' + articleId + '/related?count=3',
          '',
          2,
          '',
          response => {
            if (response.status >= 200 && response.status < 300) {
              console.log(response);
              _this.relatedArticles = response.data.articles;
            } else {
              console.log(response);
            }
          }
        );
      },
      // 去创建编辑文章页面
      goArticleCreateUpdateHandler(articleId) {
        this.$router.push({
          name: 'ArticleCreateUpdate',
          params: {
            articleId: articleId
          }
        });
      },
      next(articleId) {
        if (!articleId) {
          return;
        }
        this.$router.push({
          name: 'ArticleDetail',
          params: {
            articleId: articleId
          }
        });
      },
      // 切换tag
      toggleTagIdHandler(tagId) {
        this.$router.push({
          name: 'ArticleList',
          params: {
            tagId: tagId,
            page: 1
          }
        });
      },
      initArticleDetailInfo(articleId) {
        const _this = this;
        this.$ajax.get('/article/' + articleId, '', 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            _this.isLoading = false;
            _this.articleDeatilObj = response.data;
          } else {
            console.log(response);
            _this.isLoading = false;
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .edit-btn {
    border: 1px solid $btnColor;
    color: $btnColor;
    display: inline-block;
    padding: 2px 10px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 3px;

    &:hover {
      background: $btnColor;
      color: $whiteColor;
    }
  }

  .info {
    margin-bottom: 10px;
  }

  .prev_next_article {
    color: $fontActiveColor;
    margin-top: 60px;
    border-top: 1px solid $lineColor;
    border-bottom: 1px solid $lineColor;

    .col-6 {
      cursor: pointer;

      > div {
        display: inline-block;
      }

      &:first-child {
        > div {
          margin-left: 5px;
        }
      }

      &:last-child {
        > div {
          margin-right: 5px;
        }
      }
    }
  }

  // 相关文章
  .create-article-btn {
    margin-top: 0;
    width: 100%;
    text-align: center;
  }

  .related-articles-ul {
    li {
      margin-bottom: 12px;
      cursor: pointer;

      &:hover {
        color: $fontActiveColor;
      }

      div {
        font-size: 14px;
      }

      p {
        font-size: 12px;
        margin-top: 2px;

        span:last-child {
          margin-left: 10px;
        }
      }
    }
  }
</style>
