<template>
  <div class="product-detail-page">
    <!-- 面包屑导航 -->
    <vue-breadcrumb :page-name="categoryObj.name" :shop-name="productObj.name" />

    <section class="section-sm">
      <div class="container container-lg container-md ">
        <div class="row row-50">
          <div class="col-md-6 col-lg-5">
            <vue-images
              v-if="skuPicture.length > 0"
              :skuPicture="skuPicture"
              :pics_M="pics_M"
              :pics_S="pics_S"
            ></vue-images>
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
              <vue-star :score="productObj.score"></vue-star>

              <div class="product-select">
                <div
                  class="sku-items flex items-center"
                  v-for="(attr, index) in attrs"
                  :key="index"
                >
                  <label>选择{{ attr.name }}</label>
                  <div class="items-wrap">
                    <div
                      v-for="(value, ind) in attr.values"
                      :key="ind"
                      :class="[
                        selectedAttrs.find(_ => _.name == attr.name).value === value
                          ? 'selected'
                          : '',
                        'item'
                      ]"
                      :value="value"
                      @click="updateSku(attr.name, value)"
                    >
                      {{ value }}
                    </div>
                  </div>
                </div>
              </div>

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
                  $store.state.wishlist.indexOf(skuId) > -1 ? 'isFavorite' : ''
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
  import VueImages from '../components/Images';
  import VueComment from '../components/Comment';
  import VueStar from '../components/Star';
  export default {
    name: 'ProductDetail',
    components: {
      VueRelatedProducts,
      VueImages,
      VueComment,
      VueStar
    },
    data() {
      return {
        skuId: -1,
        productId: 0,
        //
        categoryObj: {}, //分类
        productObj: {}, //产品详情
        // 规格
        attrs: [], //[{name:'颜色', values:['黑','白']},{name:'大小', values:['大','小']}]
        selectedAttrs: [], //[{name:'颜色', value:'黑'},{name:'大小', value:'大'}]
        attrCombos: [], //[{combo:[{name:'颜色', value:'黑'},{name:'大小', value:'大'}], value: {productId: 1, skuId:1}},
        // {combo:[{name:'颜色', value:'白'},{name:'大小', value:'大'}], value: {productId: 1, skuId:2}}, .....]

        priceYuan: 0, //元
        priceCent: '00', //分

        productNum: 1, //加入购物车的产品个数

        skuPicture: '',
        pics_M: [],
        pics_S: []
      };
    },
    watch: {
      $route(to, from) {
        this.productId = Number(to.params.productId);
        this.skuId = Number(to.params.skuId);

        // 只有点击相关产品的产品时才会滚到顶部
        if (from.params.productId != to.params.productId) {
          this.productDeatil();
          window.scrollTo(0, 0);
        }
      }
    },
    mounted() {
      this.productId = Number(this.$route.params.productId);
      this.skuId = Number(this.$route.params.skuId);
      this.$store.commit('setAppName', 'product');

      // 首次进入页面，滑动到顶部
      window.scrollTo(0, 0);

      // 产品详情
      this.productDeatil();
    },
    methods: {
      toggleWishlistHandler() {
        this.$store.commit('toggleWishlist', this.skuId);
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
          skuId: this.skuId,
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
      // 切换规格
      updateSku(name, value) {
        this.selectedAttrs.sort((a, b) =>
          a.name > b.name ? 1 : a.name === b.name ? 0 : -1
        );
        this.selectedAttrs.find(_ => _.name === name).value = value;

        for (var c in this.attrCombos) {
          this.attrCombos[c].combo.sort((a, b) =>
            a.name > b.name ? 1 : a.name === b.name ? 0 : -1
          );
          var found = true;
          for (var i in this.attrCombos[c].combo) {
            if (
              this.attrCombos[c].combo[i].name != this.selectedAttrs[i].name ||
              this.attrCombos[c].combo[i].value != this.selectedAttrs[i].value
            ) {
              found = false;
              break;
            }
          }
          if (found) {
            this.productId = this.attrCombos[c].value.productId;
            this.skuId = this.attrCombos[c].value.skuId;
            break;
          }
        }
        // 规格对应的图片
        var sku = this.productObj.skus.find(_ => _.skuId === this.skuId);
        this.skuPicture = process.env.VUE_APP_PRODUCT_M_URL + sku.picture;
        // 价格
        const pri = sku.price.toFixed(2).split('.');
        this.priceYuan = pri[0];
        this.priceCent = pri[1];

        this.$router.push({
          name: 'ProductDetail',
          params: {
            id: this.productId,
            skuId: this.skuId
          }
        });
      },
      // 产品详情
      productDeatil() {
        const id = this.productId;
        const skuId = this.skuId;
        const _this = this;
        this.$ajax.get('/product/' + id, '', 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            _this.categoryObj = response.data.category;
            localStorage.setItem(
              'selectCategory',
              JSON.stringify(response.data.category)
            );
            _this.$store.commit('setCategoryId', response.data.category.categoryId);
            //获取所有attr
            const attrs = [];
            response.data.skus.forEach(_sku =>
              _sku.attributes.forEach(_attr => attrs.push(_attr))
            );

            //按照attr的name分组
            _this.attrs = _this
              .$groupBy(attrs, _ => [_.name])
              .map(_ => ({
                name: _[0].name,
                values: [...new Set(_.map(item => item.value))]
              }));

            //当前sku的attr组合
            _this.selectedAttrs = Array.from(
              JSON.parse(
                JSON.stringify(response.data.skus.find(_ => _.skuId === skuId).attributes)
              )
            );

            //所有可能的attr组合
            _this.attrCombos = response.data.skus.map(_ => ({
              combo: _.attributes,
              value: { productId: _.productId, skuId: _.skuId }
            }));

            _this.productObj = response.data;

            _this.pics_M = _this.productObj.pictures.map(
              _ => process.env.VUE_APP_PRODUCT_M_URL + _
            );
            _this.pics_S = _this.productObj.pictures.map(
              _ => process.env.VUE_APP_PRODUCT_M_URL + _
            );

            var sku = _this.productObj.skus.find(_ => _.skuId === skuId);
            _this.skuPicture = process.env.VUE_APP_PRODUCT_M_URL + sku.picture;

            const pri = sku.price.toFixed(2).split('.');
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
