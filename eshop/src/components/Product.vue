<template>
  <div
    :class="[
      productItem.isGrid ? 'product-grid' : 'product-list flex',
      'product-item cursor img-width-wrap'
    ]"
    @click="goProductDetailHandler(productItem)"
  >
    <div :class="[$route.name == 'ProductList' ? 'col-4' : '', 'product-img-wrap']">
      <img :src="productCover" alt="" />
      <div class="product-label-wrap" v-if="featureArr">
        <span v-for="(_, index) in featureArr" :key="index" :class="['featured', _]">
          {{
            _ == 'New'
              ? '新品'
              : _ == 'Recommended'
              ? '推荐'
              : _ == 'Popular'
              ? '热销'
              : ''
          }}
        </span>
      </div>
    </div>
    <div :class="[$route.name == 'ProductList' ? 'col-8' : '']">
      <div class="product-title zh-related-title">
        {{ productItem.name }}
      </div>
      <div class="product-title en-related-title">{{ productItem.summary }}</div>
      <div class="product-price">
        <span class="money-wrap">
          <span class="money-flag1">¥ </span
          ><span class="money-num1" v-html="productPrice"></span>
        </span>
      </div>
      <vue-star v-if="!productItem.isGrid" :score="productItem.score"></vue-star>

      <ul class="product-categories" v-if="!productItem.isGrid">
        <li
          @click.stop="notToggleTagHandler(_.tagId)"
          v-for="_ in productItem.tags"
          :key="_.tagId"
        >
          {{ _.name }}
        </li>
      </ul>
      <div class="button">购买</div>

      <div
        :class="[
          'product-icon-wrap',
          $store.state.wishlist.indexOf(productItem.productId) > -1 ? 'isFavorite' : ''
        ]"
        @click.stop="toggleWishlistHandler(productItem.productId)"
      >
        <span class="bi-heart"></span>
      </div>
      <!-- productItem没有score字段 -->
      <vue-star
        v-if="productItem.isGrid && $store.state.device == 'pc'"
        :score="productItem.score"
      ></vue-star>
    </div>
  </div>
</template>
<script>
  import VueStar from './Star';
  export default {
    name: 'Product',
    components: {
      VueStar
    },
    props: {
      productEle: Object
    },
    data() {
      return {};
    },
    computed: {
      productItem() {
        return this.productEle;
      },
      featureArr() {
        return this.productItem.feature;
      },
      productPrice() {
        const priceArr = Number(this.productItem.price)
          .toFixed(2)
          .split('.');
        var str =
          priceArr[0] + '<span class="price-decimals1">' + '.' + priceArr[1] + '</span>';
        return str;
      },
      productCover() {
        return process.env.VUE_APP_PRODUCT_M_URL + this.productItem.picture;
      }
    },
    methods: {
      toggleWishlistHandler(productId) {
        this.$store.commit('toggleWishlist', productId);
      },
      notToggleTagHandler(tagId) {
        this.$emit('not-toggle-tag-handler', tagId, false);
      },
      goProductDetailHandler(productObj) {
        this.$router.push({
          name: 'ProductDetail',
          params: {
            productId: productObj.productId
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .product-list {
    .product-price {
      margin-top: 25px;
    }

    .rating-list {
      margin: 10px 0;
    }

    .product-title {
      width: 320px;
    }

    .product-img-wrap {
      margin: 0 50px 0 30px;

      img {
        width: 100%;
      }
    }

    .zh-related-title {
      font-size: 24px;
    }
  }

  .pad {
    .product-list {
      .zh-related-title {
        font-size: 20px;
      }
    }
  }

  .phone {
    .product-list {
      .product-icon-wrap {
        width: 46px;
        height: 46px;
        line-height: 46px;
      }

      .product-title {
        width: auto;
        white-space: normal;
      }

      .product-img-wrap {
        // width: 250px;
        margin: 0px 15px 45px 0px;
      }

      .zh-related-title {
        font-size: 16px;
        font-weight: 300;
      }
    }
  }
</style>
