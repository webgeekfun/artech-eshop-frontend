<template>
  <div class="cart">
    <div class="info">
        <ul v-if="products.length > 0">
          <li v-for="item in products" :key="item.productId">
            <span>{{item.name}}</span>
            <span>{{item.price}}</span>
          </li>
        </ul>  
        <div v-else>购物车中暂无商品……</div>
    </div>
    
    <div class="btn-info" v-if="products.length > 0">
      <button @click="checkOut">确认下单</button>
      <div>总价：{{totalPrice.toFixed(2)}}元</div> 
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    products() {
      return this.$store.state.cart.products;
    },
    totalPrice() {
      return this.$store.getters['cart/totalPrice'];
    }
  },
  methods: {
    checkOut() {
      this.$store.dispatch('cart/checkOut');
    }
  }
}
</script>

<style scoped>
.cart {
  width: 250px;
  min-height: 90px;
  border: 2px solid #666;
  border-right: 0;
  padding: 10px;
  border-radius: 5px 0 0 5px;
  background: #fff;
  font-size: 16px;
  box-sizing: border-box;
}

.cart .info {
  min-height: 70px;
  border: 2px dashed #666;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.cart .info > div {
  width: 100%;
}

.cart .info ul {
  padding: 5px;
}

.cart .info ul li {
  display: flex;
  justify-content: space-between;
  align-items:stretch;
  line-height:2;
}

.cart .btn-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}

.cart button {
  padding: 4px 10px;
  border: 2px solid #666;
}
</style>