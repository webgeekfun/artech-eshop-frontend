<template>
  <div id="app">
    <header><p>购物车中商品数量：{{cartCount}}</p></header>
    <div class="product-list">
      <product name="科学主题马克杯"></product>  
      <product name="精彩啤酒杯"></product>
      <product name="颗星艺术搪瓷杯"></product>  
      <product name="时尚定制签名玻璃杯"></product>  
    </div>
    <cart></cart>
  </div>
</template>

<script>
  import product from './components/product.vue'
  import cart from './components/cart.vue'

  export default {
    components:{product, cart},
    computed: {
        cartCount(){
           return this.$store.getters.products.length;
        }
    }
  }
</script>

<style>
#app{
  width:500px;
  height:250px;
  border: 2px solid #999;
  border-radius: 10px;
  margin:40px auto;
  padding: 0 20px;
  position: relative;
}
header{
  text-align: right;
  border-bottom: 2px solid #999;
}
</style>
