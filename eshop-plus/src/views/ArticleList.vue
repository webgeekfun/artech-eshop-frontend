<template>
  <div class="articleList-page">
    <!-- 面包屑导航 -->
    <vue-breadcrumb page-name="杯言杯语" />

    <section class="section-md">
      <div class="container container-sm container-lg container-xs">
        <div class="row article-wrap">
          <div class="col-lg-7">
            <!-- 加载中~ -->
            <vue-loading :isLoading="isLoading" />

            <ul v-if="articles.length > 0" class="article-ul">
              <li v-for="item in articles" :key="item.articleId">
                <div class="tags-wrap">
                  <span
                    v-for="_ in item.tags"
                    :key="_.tagId"
                    @click="toggleLeftTagHandler(_.tagId)"
                  >
                    {{ _.name }}
                  </span>
                </div>
                <div class="article-cont">
                  <h1 @click="goArticleDetailHandler(item.articleId)">
                    {{ item.subject }}
                  </h1>
                  <img v-if="item.cover" :src="item.cover" alt="" />
                  <p>{{ item.abstract }}</p>
                  <div class="flex justify-content-space-between items-center">
                    <div class="info">
                      <span>{{ $formatDate(false, item.updateTime) }}</span>
                      <span>来自 {{ item.author.username }}</span>
                    </div>
                    <span
                      class="read-more cursor"
                      @click="goArticleDetailHandler(item.articleId)"
                    >
                      更多<span class="bi-arrow-right"></span>
                    </span>
                  </div>
                </div>
              </li>
            </ul>
            <div v-if="articles.length < 1 && !isLoading">
              未找到符合条件的文章~
            </div>
            <!-- 分页 -->
            <vue-pagination
              v-if="articles.length > 0"
              :page="selector.page"
              :totalPage="totalPage"
              @page-handler="pageInit"
            ></vue-pagination>
          </div>
          <div class="col-lg-5">
            <div class="article-btn-wrap flex justify-content-space-between items-center">
              <span @click="showArticleTagPanelHandler">按标签筛选</span>
              <div
                v-if="$store.state.nickNameInfo"
                class="button button-primary"
                @click="goArticleCreateUpdateHandler"
              >
                创建文章
              </div>
            </div>
            <div
              class="mt50 article-product-list"
              v-if="isShowArticleTagPanel || $store.state.device == 'pc'"
            >
              <h4 class="flex justify-content-space-between">
                <span>按标签筛选</span>
                <span
                  class="bi-x cursor close-tag"
                  @click="showArticleTagPanelHandler"
                ></span>
              </h4>
              <ul class="tags-ul">
                <li
                  v-for="_ in articleTags"
                  :key="_.tagId"
                  :class="{ active: selector.tagId == _.tagId }"
                  @click="toggleRightTagHandler(_.tagId)"
                >
                  {{ _.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'ArticleList',
    data() {
      return {
        isShowArticleTagPanel: false,
        selector: {
          tagId: 0,
          page: 1
        },
        isLoading: true,
        articles: [],
        pageSize: 5,
        totalPage: 0, //总页数
        articleTags: []
      };
    },
    watch: {
      $route(to) {
        this.selector = to.params;
      },
      selector: {
        handler(value) {
          this.articles = [];
          this.isLoading = true;
          this.$router.push({
            name: 'ArticleList',
            params: value
          });
          this.initArticles(value);
          window.scrollTo(0, 0);
        },
        deep: true
      }
    },
    mounted() {
      window.scrollTo(0, 0);
      this.selector = this.$route.params;
      this.initArticles(this.selector);

      this.initArticleTags();
    },
    methods: {
      // 是否展示标签筛选项
      showArticleTagPanelHandler() {
        this.isShowArticleTagPanel = !this.isShowArticleTagPanel;
        if (this.$store.state.device != 'pc') {
          // 手机端或者Ipad才会切换是否显示遮罩
          this.$emit('show-mask-handler', this.isShowArticleTagPanel);
        }
      },
      // 创建和编辑文章
      goArticleCreateUpdateHandler() {
        this.$router.push({
          name: 'ArticleCreateUpdate',
          params: {
            articleId: 0
          }
        });
      },
      // 切换右侧文章列表
      toggleRightTagHandler(tagId) {
        if (this.selector.tagId == 0 && tagId == 0) {
          // 当前标签是"全部"时，再点击它，应直接return
          return;
        }
        if (this.selector.tagId == tagId && tagId != 0) {
          // 当前标签不是"全部"时，再点击它，切换至"全部"
          this.selector.tagId = 0;
        } else this.selector.tagId = tagId; //其他情况切换到被点击的标签

        this.selector.page = 1;

        if (this.$store.state.device != 'pc') {
          this.showArticleTagPanelHandler();
        }
      },
      // 初始化文章标签列表
      initArticleTags() {
        const _this = this;
        this.$ajax.get('/article-tag/list', '', 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            console.log(response);
            _this.articleTags = response.data.tags;
            _this.articleTags.unshift({ tagId: 0, name: '全部' });
          } else {
            console.log(response);
          }
        });
      },
      // 去订单详情页面
      goArticleDetailHandler(articleId) {
        this.$router.push({
          name: 'ArticleDetail',
          params: {
            articleId: articleId
          }
        });
      },
      // 点击分页
      pageInit(page) {
        this.selector.page = page;
      },
      toggleLeftTagHandler(tagId) {
        this.selector.tagId = tagId;
        this.selector.page = 1;
      },
      // 初始化文章列表（左侧）
      initArticles(params) {
        const _this = this;
        params.pageSize = this.pageSize;
        this.$ajax.get('/article/list', params, 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            _this.isLoading = false;
            const articles = response.data.articles;
            if (articles) {
              articles.map(ele => {
                if (ele.cover) {
                  ele.cover = process.env.VUE_APP_COVER_URL + ele.cover;
                }
              });
            }
            _this.articles = articles;

            _this.totalPage = response.data.pagination.pageCount;
            _this.selector.page = response.data.pagination.pageNumber;
          } else {
            console.log(response);
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .article-product-list {
    border-right: 0;
  }

  .article-ul li {
    &:not(:first-child) {
      margin-top: 50px;
      padding-top: 50px;
      border-top: 1px solid $lineColor;
    }

    &:last-child {
      padding-bottom: 50px;
      border-bottom: 1px solid $lineColor;
    }
  }

  .article-cont {
    .read-more {
      color: $fontActiveColor;
      font-size: 16px;

      span {
        margin-left: 5px;
      }
    }
  }

  // 右侧
  .article-btn-wrap {
    div {
      width: 100%;
      text-align: center;
      margin-top: 0;
    }
    span {
      display: none;
    }
  }

  .tags-ul {
    margin-top: 10px;
    li {
      display: inline-block;
      background: $bottomColor;
      border: 1px solid $bottomColor;
      border-radius: 3px;
      padding: 15px 18px;
      margin: 10px 5px 0;
      cursor: pointer;

      &:hover,
      &.active {
        background-color: transparent;
        border-color: $lineColor;
      }
    }
  }

  .pad,
  .phone {
    .article-wrap {
      display: flex;
      flex-direction: column-reverse;
    }

    .article-btn-wrap {
      margin-bottom: 20px;
      div {
        width: auto;
        text-align: center;
      }
      span {
        color: $fontActiveColor;
        cursor: pointer;
        display: block;
      }
    }

    // 标签
    .tags-ul li {
      display: block;
      margin: 0;
      background-color: transparent;
      border: none;
      border-bottom: 1px solid $lineColor;
      padding: 0;

      &:hover {
        border-color: $lineColor;
      }
    }

    .article-product-list {
      padding: 0 15px;
    }
  }
</style>
