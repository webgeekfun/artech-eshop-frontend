<template>
  <div class="container">
    <ul class="w860 product-ul">
      <li v-for="item in products" :key="item.productId">
        <div class="img-wrap">
          <img :src="item.src" alt="">
        </div>
        <div class="info">
          <h3>{{item.name}}</h3>
          <div class="btn-wrap">
            <button @click="goProduct(item.productId)">查看详情</button>
            <button @click="addToCart(item)">加入购物车</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  //namespaced: true,

  mounted(){
    this.$store.dispatch("productCatalog/init");
  },
  computed: {
    products(){ 
      return this.$store.state.productCatalog.products;
    }
  },
  methods: {
    addToCart(product) {
      this.$store.commit("cart/add", product);
    },
    goProduct(productId) {
      this.$router.push({
        name: 'ProductDetail',
        params: {
          productId
        }
      })
    }
  }
}
</script>

<style scoped>
.product-ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.product-ul li {
  border: 1px solid #ccc;
  margin-bottom: 20px;
  transition: all .5s;
}

.product-ul li:hover {
  box-shadow: 2px 2px 5px #ccc;
}

.product-ul img {
  width: 250px;
}

.product-ul .img-wrap {
  padding: 0 10px;
}

.product-ul .info {
  border-top: 1px solid #ccc;
}

.product-ul .info h3 {
  margin: 15px 0;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
}

.product-ul .btn-wrap {
  display: flex;
  justify-content: space-around;
  margin: 12px 0;
}

.product-ul .btn-wrap button {
  border: 1px solid #999;
  padding: 6px 10px;
}


</style>