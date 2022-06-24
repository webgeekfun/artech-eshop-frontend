<template>
  <div class="product-detail-page">
    <!-- 面包屑导航 -->
    <vue-breadcrumb :page-name="categoryObj.name" :shop-name="productObj.name" />

    <div class="mask" v-show="showPic" @click="hidePicHandler">
      <img :src="skuPicture" alt="" />
    </div>

    <section class="section-sm">
      <div class="container container-lg container-md ">
        <div class="row row-50">
          <div class="col-md-6 col-lg-5">
            
            <div class="pic-wrap">
              <div class="pic-img" ref="swiperTop">
                <img :src="skuPicture" alt="" />
              </div>
              <div class="caption" @click="showPicHandler">
                <span class="bs-icon bi-zoom-in"></span>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-7">
            <div class="product-single">
              <h2>{{ productObj.name }}</h2>
              <h6 class="single-en-title">{{ productObj.summary }}</h6>
              <div class="product-price big">
                <span class="money-wrap">
                  <span class="money-flag">¥ </span
                  ><span class="money-num">
                    {{ priceYuan }}<span class="price-decimals">.{{ priceCent }}</span>
                  </span>
                </span>
              </div>
              <!-- <div class="rating-list">
                <span
                  v-for="it in 5"
                  :key="it"
                  :class="[
                    'star-box',
                    it < productObj.score
                      ? 'bi-star-fill'
                      : Math.ceil(productObj.score) == it
                      ? 'bi-star-half'
                      : 'bi-star'
                  ]"
                ></span>
                <i>{{ productObj.score }}</i>
              </div> -->
              <vue-star :score="productObj.score"></vue-star>

              <div class="step-wrap text-center">
                <input
                  class="form-control"
                  type="number"
                  min="1"
                  value="1"
                  v-model="productNum"
                />
                <span class="stepper-arrow up bi-chevron-up" @click="addCartCount"></span>
                <span
                  class="stepper-arrow down bi-chevron-down"
                  @click="reduceCartCount"
                ></span>
              </div>

              <div class="button button-primary" @click="toggleCart">
                <span class="bi-cart2"><span>添加到购物车</span></span>
              </div>

              <div
                :class="[
                  'product-icon-wrap',
                  $store.state.wishlist.indexOf(Number(productId)) > -1
                    ? 'isFavorite'
                    : ''
                ]"
                @click="toggleWishlistHandler()"
              >
                <span class="bi-heart"></span>
              </div>
              <ul class="cate-tag-ul">
                <li>
                  <label>分类：</label>
                  <div class="cursor" @click="goProductListHandler('0')">
                    {{ shopCategoryName }}
                  </div>
                </li>
                <li>
                  <label>标签：</label>
                  <div class="product-categories">
                    <span
                      v-for="_ in productObj.tags"
                      :key="_.tagId"
                      @click="goProductListHandler(_.tagId)"
                    >
                      {{ _.name }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt50">
          <!-- 产品介绍 -->
          <h4 class="text-left">产品介绍</h4>
          <div
            class="information-introduction text-left"
            v-html="productObj.description"
          ></div>
        </div>
      </div>

      <vue-related-products
        textOffset="text-left"
        :productId="Number(productId)"
      ></vue-related-products>

      <div class="container container-lg container-md ">
        <vue-comment :articleId="productId"></vue-comment>
      </div>
    </section>
  </div>
</template>
<script>
  import VueRelatedProducts from '../components/RelatedProducts';
  import VueComment from '../components/Comment';
  import VueStar from '../components/Star';
  export default {
    name: 'ProductDetail',
    components: {
      VueRelatedProducts,
      VueComment,
      VueStar
    },
    data() {
      return {
        productId: 0,

        categoryObj: {}, //分类
        productObj: {}, //产品详情

        priceYuan: 0, //元
        priceCent: '00', //分

        productNum: 1, //加入购物车的产品个数

        skuPicture: '',
        showPic: false
      };
    },
    watch: {
      $route(to, from) {
        this.productId = Number(to.params.productId);

        // 只有点击相关产品的产品时才会滚到顶部
        if (from.params.productId != to.params.productId) {
          this.productDeatil();
          window.scrollTo(0, 0);
        }
      }
    },
    mounted() {
      this.productId = Number(this.$route.params.productId);
      this.$store.commit('setAppName', 'product');
      // 首次进入页面，滑动到顶部
      window.scrollTo(0, 0);
      // 产品详情
      this.productDeatil();
    },
    methods: {
      hidePicHandler() {
        this.showPic = false;
      },
      // 放大展示图
      showPicHandler() {
        this.showPic = true;
      },
      toggleWishlistHandler() {
        this.$store.commit('toggleWishlist', this.productId);
      },
      // 点击tag进入列表页和点击分类进入列表页
      goProductListHandler(tagId) {
        // tagId为0时，表示点击分类进入列表页
        this.$router.push({
          name: 'ProductList',
          params: {
            tagId: tagId,
            categoryId: this.productObj.category.categoryId,
            page: 1,
            sort: 'dateDown'
          }
        });
      },
      toggleCart() {
        this.$store.commit('toggleCart', {
          productId: this.productId,
          count: this.productNum
        });
      },
      // 点击上箭头，增加产品个数
      addCartCount() {
        this.productNum++;
      },

      // 点击下箭头，减少产品个数
      reduceCartCount() {
        if (this.productNum > 1) {
          this.productNum--;
        }
      },
      // 产品详情
      productDeatil() {
        const id = this.productId;
        const _this = this;
        this.$ajax.get('/product/' + id, '', 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            _this.categoryObj = response.data.category;
            localStorage.setItem(
              'selectCategory',
              JSON.stringify(response.data.category)
            );
            _this.$store.commit('setCategoryId', response.data.category.categoryId);

            _this.productObj = response.data;

            _this.skuPicture = process.env.VUE_APP_PRODUCT_M_URL + _this.productObj.picture;

            const pri = _this.productObj.price.toFixed(2).split('.');
            _this.priceYuan = pri[0];
            _this.priceCent = pri[1];
          } else {
            console.log(response.message);
          }
        });
      }
    },
    computed: {
      shopCategoryName() {
        return this.productObj.category
          ? this.productObj.category.name
            ? this.productObj.category.name
            : ''
          : '';
      }
    }
  };
</script>

<style lang="scss" scoped>
  .pic-wrap {
    position: relative;

    .pic-img {
      border: 1px solid #ddd;

      img {
        width: 100%;
      }
    }

    .caption {
      position: absolute;
      right: 10px;
      top: 0;
      cursor: pointer;
      font-size: 24px;
    }
  }

  .mask {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;

    img {
      width: 450px;
    }
  }

  .product-single {
    h2 {
      font-weight: 400;
    }

    .single-en-title {
      text-transform: uppercase;
      color: $fontDefaultColor;
    }

    .product-select {
      margin-top: 20px;
      font-size: 14px;

      .sku-items {
        label {
          margin-right: 15px;
        }
      }

      .items-wrap {
        .item {
          background-color: $bottomColor;
          float: left;
          margin-right: 7px;
          margin-bottom: 4px;
          font-size: 14px;
          border-radius: 3px;
          border: 1px solid;
          border-color: $eleLineColor;
          white-space: nowrap;
          padding: 3px 12px;
          cursor: pointer;

          &.selected {
            border-color: $fontActiveColor;
            color: $fontActiveColor;
          }
        }
      }
    }

    .step-wrap {
      margin-top: 20px;
      width: 175px;
    }

    .button {
      span {
        &:before {
          font-size: 16px;
        }

        span {
          margin-left: 5px;
          vertical-align: middle;
        }
      }
    }

    .cate-tag-ul {
      margin-top: 15px;
      font-size: 12px;

      li > div,
      label {
        display: inline;
      }
    }
  }
</style>
