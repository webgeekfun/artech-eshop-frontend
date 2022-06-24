<template>

  <div class="container">
    <div v-if="orders.length > 0" class="row g-2 g-md-3">
      <div 
        class="col-6 col-md-4 col-lg-3 col-xxl-2"
        v-for="item in orders" 
        :key="item.orderId"
      >
        <div class="border rounded border-secondary text-center p-3">
          <p>#{{item.orderId}}</p>
          <p >{{item.orderTime}}</p>
          <p :class="[
            'fw-bold', 
            item.isPaid?'text-success':'text-danger'
          ]">
            {{item.isPaid ? "已支付" : "待支付"}}
          </p>
          <div class="d-flex justify-content-evenly">
            <router-link 
              :to="'/orders/'+item.orderId" 
              class="btn btn-outline-secondary btn-sm"
            > 
              查看详情
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-else>暂无订单，快去购买吧~</div>
  </div>
</template>

<script>
export default {
  computed:{
      orders(){ 
        return this.$store.state.orderList.orders;
      }
  }
}
</script>
