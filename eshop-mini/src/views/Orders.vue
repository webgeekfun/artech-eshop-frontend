<template>
  <div class="container">
    <table class="w860 orders-table" v-if="orders.length > 0">
      <thead>
        <th>订单编号</th>
        <th>下单时间</th>
        <th>订单状态</th>
        <th>操作</th>
      </thead>
      <tbody>
        <tr v-for="item in orders" :key="item.orderId">
          <td>{{item.orderId}}</td>
          <td>{{item.orderTime}}</td>
          <td>{{item.isPaid ? "已支付" : "待支付"}}</td>
          <!--<a href="#"></a> 这样写，页面可以正确访问，但是路由地址是错误的  -->
          <td><a href="javascript:void(0);" @click="goDetail(item.orderId)">查看详情</a></td>
        </tr>
      </tbody>
    </table>
    <div v-else>暂无订单，快去购买吧~</div>
  </div>
</template>

<script>
export default {
  name: 'Orders',
  data() {
    return {
      orders: this.$store.state.orderList.orders
    }
  },
  methods: {
    goDetail(orderId) {
      this.$router.push({
        name: 'OrderDetail',
        params: { orderId }
      })
    }
  }
}
</script>

<style scoped>
</style>