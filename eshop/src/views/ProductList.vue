<template>
  <div class="product-list-page">
    <!-- 面包屑导航 -->
    <vue-breadcrumb :page-name="categoryName" />

    <section class="section-md">
      <div class="container container-sm container-lg container-xs">
        <div class="row row-50 flex ">
          <!-- 左侧 -->
          <div
            class="col-lg-3 section-aside article-product-list"
            v-if="isShowTagPanel || $store.state.device == 'pc'"
          >
            <h4 class="flex justify-content-space-between">
              <span>按标签筛选</span>
              <span class="bi-x cursor close-tag" @click="toggleTagHandler"></span>
            </h4>
            <ul class="list">
              <li
                :class="[{ active: selector.tagId == item.tagId }]"
                v-for="item in tagsArr"
                :key="item.tagId"
                @click="filterByTagsHandler(item.tagId)"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
          <!-- 右侧 -->
          <div class="col-lg-9 section-main">
            <div class="filter-wrap">
              <div class="flex items-center justify-content-space-between mb12">
                <p v-if="totalPage > 1">
                  第{{ selector.page }}页 / 共{{ totalPage }}页
                </p>
                <p v-else></p>
                <div
                  class="filter-tag cursor"
                  v-if="$store.state.device != 'pc'"
                  @click="toggleTagHandler"
                >
                  按标签筛选
                </div>
              </div>

              <select v-model="selector.sort" @change="changeSortHandler">
                <option value="dateDown">按上架时间降序</option>
                <option value="dateUp">按上架时间升序</option>
                <option value="priceDown">按价格降序</option>
                <option value="priceUp">按价格升序</option>
              </select>
            </div>

            <div class="row">
              <!-- 加载中~ -->
              <vue-loading :isLoading="isLoading" />

              <div class="row-50" v-if="products.length > 0">
                <vue-product
                  class="col-12"
                  v-for="item in products"
                  :key="item.productId"
                  :productEle="item"
                  @not-toggle-tag-handler="filterByTagsHandler"
                ></vue-product>
              </div>
              <div class="text-center" v-if="products.length < 1 && !isLoading">
                未搜索到符合条件的商品
              </div>
            </div>

            <section>
              <div class="line"></div>
            </section>

            <!-- 分页 -->
            <vue-pagination
              v-if="totalPage > 1"
              :page="selector.page"
              :totalPage="totalPage"
              @page-handler="pageToggleHandler"
            ></vue-pagination>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import VueProduct from '../components/Product';
  export default {
    name: 'ProductList',
    components: {
      VueProduct
    },
    data() {
      return {
        isShowTagPanel: false, // 是否展示标签筛选项面板
        tagsArr: [], // 标签列表
        selector: {
          tagId: 0,
          categoryId: 0,
          page: 1,
          sort: 'dateDown'
        },
        products: [], // 产品列表
        totalPage: 1, // 总页数
        totalProductCount: 0, // 总条数
        pageSize: 5,
        isLoading: true,
        // 类别
        categories: [],
        categoryName: ''
      };
    },
    watch: {
      $route(to) {
        this.selector = to.params;
        this.categoryName = this.categories
          ? this.categories.find(item => to.params.categoryId == item.categoryId).name
          : [];

        localStorage.setItem(
          'selectCategory',
          JSON.stringify(
            this.categories
              ? this.categories.find(item => this.selector.categoryId == item.categoryId)
              : []
          )
        );
      },
      selector: {
        handler(value) {
          console.log(value);
          this.products = [];
          this.isLoading = true;
          this.getProducts(value);
          this.$router.push({
            name: 'ProductList',
            params: value
          });
          window.scrollTo(0, 0);
        },
        deep: true
      }
    },
    created() {
      this.selector = this.$route.params;
      this.initTagList();
      this.getProducts(this.selector);
      // 分类列表，为了展示面包屑
      this.getCategoryList();
      window.scrollTo(0, 0);
    },
    methods: {
      // 获取产品类别
      getCategoryList() {
        const _this = this;
        this.$ajax.get('/category/list', '', 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            console.log(response);
            _this.categories = response.data.categories;
            _this.categoryName = _this.categories
              ? _this.categories.find(item => _this.selector.categoryId == item.categoryId)
                  .name
              : [];
            localStorage.setItem(
              'selectCategory',
              JSON.stringify(
                _this.categories
                  ? _this.categories.find(
                      item => _this.selector.categoryId == item.categoryId
                    )
                  : []
              )
            );
          } else {
            console.log(response.message);
          }
        });
      },
      // 点击分页
      pageToggleHandler(page) {
        this.selector.page = page;
      },
      // 修改排序方式
      changeSortHandler(val) {
        this.selector.sort = val.target.value;
      },
      // 按标签筛选
      filterByTagsHandler(tagId, isToggleAll = true) {
        if (isToggleAll) {
          // 用于左侧标签列表
          if (this.selector.tagId == 0 && tagId == 0) {
            // 当前标签是"All全部"时，再点击它，应直接return
            return;
          }
          if (this.selector.tagId == tagId && tagId != 0) {
            // 当前标签不是"All全部"时，再点击它，切换至"All全部"
            this.selector.tagId = 0;
          } else this.selector.tagId = tagId; //其他情况切换到被点击的标签
        } else {
          //用于产品列表中的水平标签行
          if (this.selector.tagId == tagId) {
            // 点击当前标签，应直接return
            return;
          }
          this.selector.tagId = tagId; //其他情况切换到被点击的标签
        }

        this.selector.page = 1;
      },
      // 获取产品列表
      getProducts(params) {
        params.pageSize = this.pageSize;
        const _this = this;
        this.$ajax.get('/product/list', params, 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            _this.isLoading = false;
            _this.products = response.data.products;
            _this.products.forEach(element => {
              element.isGrid = false;
            });

            _this.totalPage = response.data.pagination.pageCount;
            _this.totalProductCount = response.data.pagination.totalItemCount;
            _this.selector.page = response.data.pagination.pageNumber;
          } else {
            console.log(response.message);
          }
        });
      },
      // 初始化标签列表
      initTagList() {
        const _this = this;
        this.$ajax.get(
          '/tag/list?categoryId=' + this.selector.categoryId,
          '',
          2,
          '',
          response => {
            if (response.status >= 200 && response.status < 300) {
              _this.tagsArr = response.data.tags.filter(item => {
                return item.productCount > 1;
              });
              _this.tagsArr.unshift({ tagId: 0, name: 'All 全部' });
            } else {
              console.log(response.message);
            }
          }
        );
      },
      // 是否展示标签筛选项
      toggleTagHandler() {
        this.isShowTagPanel = !this.isShowTagPanel;
        if (this.$store.state.device != 'pc') {
          // 手机端或者Ipad才会切换是否显示遮罩
          this.$emit('show-mask-handler', this.isShowTagPanel);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .filter-wrap {
    display: flex;
    margin-bottom: 50px;
    justify-content: space-between;
    font-size: 16px;
  }

  .pad,
  .phone {
    .filter-wrap {
      display: block;

      select {
        width: 100%;
      }
    }
  }

  .filter-tag {
    color: $fontActiveColor;
  }

  // // 产品列表左右布局
  // .section-aside {
  //   border-right: 1px solid $lineColor;

  //   .close-tag {
  //     display: none;
  //   }

  //   ul {
  //     font-size: 14px;
  //     line-height: 1.2;
  //     margin-top: 25px;

  //     li {
  //       margin-bottom: 8px;
  //       cursor: pointer;

  //       &:hover,
  //       &.active {
  //         color: $fontActiveColor;
  //       }
  //     }
  //   }
  // }

  // .pad,
  // .phone {
  //   .section-aside {
  //     .close-tag {
  //       display: inline-block;
  //     }

  //     h4 {
  //       margin-top: 20px;
  //     }

  //     border-right: none;
  //     position: fixed;
  //     bottom: 0;
  //     background: #fff;
  //     left: 0;
  //     right: 0;
  //     height: 0;
  //     z-index: 1010;
  //     transition: all 0.8s;
  //     height: 370px;
  //     margin-bottom: 0;

  //     ul {
  //       overflow-y: auto;
  //       height: 300px;

  //       li {
  //         line-height: 40px;
  //         border-bottom: 1px solid $bottomColor;
  //         margin-bottom: 0;

  //         &:last-child {
  //           border-bottom: none;
  //         }
  //       }
  //     }
  //   }
  // }

  .section-main {
    > div > p {
      min-width: 190px;
      width: 100%;
      font-size: 14px;
    }
  }
</style>
