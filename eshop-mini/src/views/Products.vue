<template>
  <div class="container">
    <div class="row g-2 g-md-3">
      <div 
        v-for="item in products" 
        class="col-6 col-md-4 col-lg-3 col-xxl-2"
        :key="item.productId" 
      >
        <div class="px-3">
          <img :src="item.src" alt="" class="img-fluid">
        </div>
        <div class="text-center py-3 px-md-3">
          <h6 class="mb-3">{{item.name}}</h6>
          <div class="d-flex justify-content-evenly">
            <router-link 
              :to="'/products/'+item.productId" 
              class="btn btn-outline-secondary btn-sm"
            >
              查看详情
            </router-link>
            <button 
              @click="addToCart(item)" 
              class="btn btn-outline-secondary btn-sm"
            >
              加入购物车
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import shoppingApi from '../assets/js/shoppingApi'

export default {
  data(){
    return {
      products: []
    };
  },
  mounted() {
    this.$store.commit("loading/show", '正在载入数据，请稍候……');
    shoppingApi.getProductCatalog(
      // 成功操作
      (productCatalogFromServer) => {
        this.products = productCatalogFromServer;
        this.$store.commit("loading/hide");
      },
      // 失败操作
      () => {
        this.$store.commit("loading/hide", '载入数据失败，请稍后再试');
      }
    );
  },
  methods: {
    addToCart(product) {
      this.$store.commit("cart/add", product);
    }
  }
}
</script>
