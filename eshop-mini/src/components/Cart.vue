<template>
  <div 
      id="cart" 
      class="
        border 
        border-2 
        border-secondary
        rounded-start 
        border-end-0 
        bg-white 
        position-fixed 
        end-0 
        p-3 
        pe-0"
      :style="{top: top+'px'}" 
      @mousedown="movingStart"    
      @touchstart="movingStart"
      @mousemove.prevent="moving" 
      @touchmove.prevent="moving"
      @mouseup="movingEnd"        
      @touchend="movingEnd"
    >
    <div class="shandow bg-light p-3 lh-lg">
      <div v-if="products.length > 0">
        <div v-for="item in products" :key="item.productId"
          class="d-flex justify-content-between">
          <span>{{item.name}}</span>
          <span>{{item.price}} 元</span>
        </div>
      </div>  
      <div v-else>购物车中暂无商品……</div>
    </div>
    
    <div 
      class="d-flex align-items-center mt-3 me-3" 
      v-if="products.length > 0"
    >
      <button 
        @click="checkOut" 
        class="btn border-2 btn-primary btn-sm"
      >
        确认下单
      </button>
      <div class="ms-auto">
        总价：{{totalPrice.toFixed(2)}} 元
      </div> 
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      isMoving : false,
      top:400
    }
  },
  computed: {
    products() {
      return this.$store.state.cart.products;
    },
    cartCount(){
      return this.$store.state.cart.products.length;
    },
    totalPrice() {
      return this.$store.getters['cart/totalPrice'];
    }
  },
  methods: {
    checkOut() {
      this.$store.dispatch('cart/checkOut');
    },
    movingStart(event){
      this.from = event.pageY || event.touches[0].pageY;
      this.isMoving = true;
    },
    moving(event){
      if(this.isMoving){
        const pageY = event.pageY || event.touches[0].pageY;
        this.top += pageY - this.from;
        this.from = pageY;
      }
    },
    movingEnd(){
      this.isMoving = false;
    }
  }
}
</script>

<style>
  #cart{
    z-index:2000; 
    width:300px;
    cursor:move;

  }
</style>
