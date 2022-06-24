<template>
  <div class="container">
    <div class="w860">
      <table class="orders-table">
        <thead>
          <th>产品</th>
          <th>价格</th>
        </thead>
        <tbody>
          <tr v-for="item in order.products" :key="item.productId">
            <td>{{item.name}}</td>
            <td>{{item.price}}</td>
          </tr>
        </tbody>
      </table>
      <ul class="order-info">
        <li>订单编号：{{order.orderId}}</li>
        <li>下单时间：{{order.orderTime}}</li>
        <li v-if="order.payTime">支付时间：{{order.payTime}}</li>
        <li>订单状态：<span :class="order.isPaid?'is-paid':'not-paid'">{{order.isPaid ? "已支付" : "待支付"}}</span></li>
      </ul>
      <div class="info">
        <p><span>合计：</span> {{order.totalPrice}}元</p>
        <button v-if="!order.isPaid" @click="pay">去支付</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderId: this.$route.params.orderId
    }
  },
  computed: {
    order() {
      return this.$store.getters['orderList/getOrder'](this.orderId) || {}
    }
  },
  methods: {
    pay() {
      this.$store.dispatch('orderList/pay', this.order)
    }
  }
}
</script>

<style scoped>
.order-info {
  line-height: 30px;  
  margin: 20px 0;
}

.order-info span.not-paid {
  color: red;
  font-weight: bold;
}

.order-info span.is-paid {
  color: green;
  font-weight: bold;
}

.info {
  text-align: right;  
}

.info p {
  margin: 20px 0;    
  font-size: 22px;
}

.info p span {
  font-weight: bold;
}

.info button {
  padding: 10px 35px;
  font-size: 16px;
}
</style>