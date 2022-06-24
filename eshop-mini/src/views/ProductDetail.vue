<template>
  <div class="container">
    <div class="detail">
      <img :src="product.src" alt="">
      <div>
        <h1>{{product.name}}</h1>
        <p>价格：{{product.price}}元</p>
        <p class="info">{{product.description}}</p>
        <button @click="addToCart">加入购物车</button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  data() {
    return {
      product: this.$store.getters['productCatalog/product'](this.$route.params.productId)
    }
  },
  methods: {
    addToCart() {
      this.$store.commit("cart/add", this.product);
    }
  }
}
</script>

<style scoped>
.detail {
  display: flex;
  position: relative;
  margin-bottom: 60px;
}

.detail img {
  width: 350px;
  border: 1px solid #ccc;
  padding: 15px;
  margin-right: 40px;
  border-radius: 5px;
}

.detail button {
  position: absolute;
  bottom: 0;
  padding: 15px 55px;
}

p.info {
  margin-top: 25px;
  width: 430px;
}
</style>