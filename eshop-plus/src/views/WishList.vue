<template>
  <div class="wishlist-page">
    <!-- 面包屑导航 -->
    <vue-breadcrumb page-name="心愿单" />

    <section class="section-md">
      <div class="container container-sm container-lg container-xs">
        <ul class="table-ul" v-if="observerableWishlist.length > 0">
          <li class="row">
            <div class="col-9 ul-info">
              产品
            </div>
            <div class="col-3 table-product-price">价格</div>
          </li>
          <li class="row" v-for="item in observerableWishlist" :key="item.sku.skuId">
            <div class="col-9 ul-info">
              <div class="remove-icon cursor" @click="remove(item.sku.skuId)">
                <span class="bi-x"></span>
                <span class="text">移除</span>
              </div>
              <div class="cursor img-wrap">
                <img
                  @click="goProductDetailHandler(item.sku.productId, item.sku.skuId)"
                  :src="item.sku.picture"
                  alt=""
                />
              </div>
              <div class="table-product-info">
                <h6 @click="goProductDetailHandler(item.sku.productId, item.sku.skuId)">
                  {{ item.sku.name }}
                </h6>
                <p>价格：{{ item.sku.price | currency(2) }}</p>
              </div>
            </div>
            <div class="col-3 table-product-price">
              {{ item.sku.price | currency(2) }}
            </div>
          </li>
        </ul>
        <div v-if="observerableWishlist.length === 0 && !isLoading">
          心愿单还没有产品，快去添加吧~
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    name: 'WishList',
    data() {
      return {
        wishlist: [],
        // 是否显示加载中
        isLoading: true
      };
    },
    mounted() {
      window.scrollTo(0, 0);
      // 判断是否登录，已登录
      if (this.$store.state.nickNameInfo) {
        this.getRemoteWishlist();
      } else {
        this.getLocalWishlist();
      }
    },
    computed: {
      // 只显示skuId存在的wishlist数组
      observerableWishlist() {
        const _this = this;
        return this.wishlist.filter(function(item) {
          return _this.$store.state.wishlist.indexOf(item.sku.skuId) > -1;
        });
      }
    },
    methods: {
      goProductDetailHandler(productId, skuId) {
        this.$router.push({
          name: 'ProductDetail',
          params: {
            productId: productId,
            skuId: skuId
          }
        });
      },
      // 从心愿单中移除sku
      remove(skuId) {
        this.$store.commit('toggleWishlist', skuId);
      },
      // 获取远程的心愿单数据列表
      getRemoteWishlist() {
        const _this = this;
        this.$ajax.get('/wishlist/list', '', 2, 'mustAuth', response => {
          if (response.status >= 200 && response.status < 300) {
            _this.wishlist = response.data.items;
            _this.isLoading = false;

            _this.$nextTick(() => {
              if (_this.wishlist) {
                _this.wishlist.map(ele => {
                  ele.sku.picture = process.env.VUE_APP_PRODUCT_M_URL + ele.sku.picture;
                });
              }
            });
          } else {
            console.log(response.message);
          }
        });
      },
      // 获取本地的心愿单列表
      getLocalWishlist() {
        const _this = this;
        if (this.$store.state.wishlist.length === 0) {
          this.isLoading = false;
          return;
        }

        const url = '/product/sku?skuIds=' + this.$store.state.wishlist.join(',');
        this.$ajax.get(url, '', 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            _this.wishlist = response.data.map(item => {
              return { sku: item, isSkuFound: true };
            });
            var result = _this.wishlist.map(item => {
              return item.sku.skuId;
            });
            // 例如，时间过去太久没动这个页面，在这个时间段中，如果某个商品下架了，给后端
            // 传递了三个参数，接口返回了两个数据，这时就需要将接口返回的数据和wishlist的
            // 数据（即当前localStorage里面存的数据）作比较，没有的数据，就从列表中移除掉。
            const difference = _this.$store.state.wishlist.filter(
              x => result.indexOf(x) === -1
            );
            difference.forEach(item => {
              _this.remove(item);
            });
            _this.isLoading = false;

            _this.$nextTick(() => {
              if (_this.wishlist) {
                _this.wishlist.map(ele => {
                  ele.sku.picture = process.env.VUE_APP_PRODUCT_M_URL + ele.sku.picture;
                });
              }
            });
          } else {
            console.log(response.message);
          }
        });
      }
    }
  };
</script>
