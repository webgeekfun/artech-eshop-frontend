<template>
  <div class="add-cart-success-page">
    <!-- 面包屑导航 -->
    <vue-breadcrumb page-name="添加到购物车" />

    <section class="section-md">
      <div class="container container-sm container-lg container-xs">
        <div class="success-wrap">
          <div class="success-top">
            <span class="bi-check2 h3"></span>
            产品已成功加入购物车！
          </div>
          <div class="success-cont">
            <div class="item flex">
              <img :src="productPic" alt="" />
              <div class="item-info">
                <div class="name">{{ productObj.name }}</div>
                <div class="skus">
                  <span>{{ productSku }}</span>
                  <span>
                    <span v-if="productSku"> / </span> 数量：{{ $route.params.count }}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <a class="button" @click="goProductDetailHandler">查看产品详情</a>
              <a class="button button-primary" @click="goCartHandler">去购物车结算</a>
            </div>
          </div>
        </div>

        <vue-related-products
          :productId="Number(productObj.productId)"
        ></vue-related-products>
      </div>
    </section>
  </div>
</template>

<script>
  import VueRelatedProducts from '../components/RelatedProducts';
  export default {
    name: 'AddCartSuccess',
    components: {
      VueRelatedProducts
    },
    data() {
      return {
        productObj: {},
        productPic: '',
        productSku: ''
      };
    },
    mounted() {
      this.getSkuIdInfo(this.$route.params.skuId);
    },
    methods: {
      getSkuIdInfo(skuId) {
        const _this = this;
        this.$ajax.get('/product/sku?skuIds=' + skuId, '', 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            console.log(response);
            _this.productObj = response.data.length > 0 ? response.data[0] : {};
            const attrsArr = _this.productObj.attributes;
            let str = '';
            if (attrsArr.length > 0) {
              for (var i in attrsArr) {
                str += attrsArr[i].name + '：' + attrsArr[i].value + '，';
              }
            }

            _this.productSku = str.slice(0, str.length - 1);

            _this.productPic =
              process.env.VUE_APP_PRODUCT_M_URL + _this.productObj.picture;
          } else {
            console.log(response.message);
          }
        });
      },
      goProductDetailHandler() {
        this.$router.push({
          name: 'ProductDetail',
          params: {
            productId: this.productObj.productId,
            skuId: this.$route.params.skuId
          }
        });
      },
      goCartHandler() {
        this.$router.push({
          name: 'Cart'
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .success-wrap {
    color: $fontActiveColor;

    .success-top {
      margin-bottom: 20px;
    }

    .success-cont {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .item {
      font-size: 16px;
      width: 55%;

      img {
        border: 1px solid $lineColor;
        margin-right: 10px;
        max-width: 70px;
        width: 25%;
      }

      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .item-info .skus {
      font-size: 14px;
      color: $fontDefaultColor;
    }

    .button + .button {
      margin-left: 20px;
    }

    .button {
      font-size: 14px;
      padding: 10px 20px;
      margin-top: 0;
    }
  }

  .pad {
    .success-wrap {
      .button + .button {
        margin-left: 10px;
      }

      .button {
        font-size: 12px;
        padding: 10px 15px;
      }
    }
  }

  .phone {
    .success-wrap {
      .success-cont {
        display: block;
      }

      .item {
        width: 100%;
      }

      .item-info {
        width: 100%;
      }

      .button {
        margin-top: 20px;
      }
    }
  }
</style>
