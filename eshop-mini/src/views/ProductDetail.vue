<template>
  <div class="container">
    <div v-if="product" class="row gy-4">
      <div class="col-12 col-md-4">
        <img 
          :src="product.src"
          class="img-fluid img-thumbnail"
        >
      </div>
      <div class="col-12 col-md-4 d-flex flex-column">
        <h3 class="mb-3 fw-bold">{{product.name}}</h3>
        <p class="mb-3">价格：{{product.price}}元</p>
        <p class="info">{{product.description}}</p>
        <div class="d-grid mt-auto">
          <button 
            @click="addToCart" 
            class="btn btn-outline-secondary btn-lg"
          >
            加入购物车
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import shoppingApi from '../assets/js/shoppingApi'
import router from '../router/index'

export default {
  data() {
    return {
      product: null
    }
  },
  mounted(){
    this.$store.commit("loading/show", '正在载入数据，请稍候……');
    const productId = this.$route.params.productId;
    shoppingApi.getProduct(
      Number(productId),       
      // 成功操作
      (productFromServer) => {
        this.$store.commit("loading/hide");
        if(productFromServer)
          this.product = productFromServer;
        else{
          router.push("/404");
          //不改变URL为/404
          history.replaceState({}, "", '/products/'+productId);
        }
      },
      // 失败操作
      () => {
        this.$store.commit("loading/hide", '载入数据失败，请稍后再试');
      }
    )
  },
  methods: {
    addToCart() {
      this.$store.commit("cart/add", this.product);
    }
  }
}
</script>

