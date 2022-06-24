<template>
  <div class="container">
    <div class="row">
      <div class="col-md-10">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>产品</th>
              <th>价格</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.products" :key="item.productId">
              <td>{{item.name}}</td>
              <td>{{item.price}} 元</td>
            </tr>
          </tbody>
        </table>
        <ul class="list-unstyled lh-lg">
          <li>订单编号：#{{order.orderId}}</li>
          <li>下单时间：{{order.orderTime}}</li>
          <li v-if="order.payTime">支付时间：{{order.payTime}}</li>
          <li>订单状态：
            <span 
              class="fw-bold fs-5"
              :class="order.isPaid?'text-success':'text-danger'"
            >
              {{order.isPaid ? "已支付" : "待支付"}}
            </span>
          </li>
        </ul>
        <p class="fs-4">
          <span class="fw-bold">
            合计：
          </span> 
          {{order.totalPrice.toFixed(2)}} 元
        </p>
        <button 
          v-if="!order.isPaid" 
          @click="pay" 
          class="btn btn-outline-success btn-lg px-4"
        >
          去支付
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../router/index'

export default {
  data() {
    return {
      orderId: this.$route.params.orderId
    }
  },
  computed: {
    order() {
      const order = this.$store.getters['orderList/getOrder'](this.orderId);
      if(!order){
        router.push("/404");
        //不改变URL为/404
        history.replaceState({}, "", '/orders/'+this.orderId);
        return {};
      }
      else
        return order;
    }
  },
  methods: {
    pay() {
      this.$store.dispatch('orderList/pay', this.order)
    }
  }
}
</script>
