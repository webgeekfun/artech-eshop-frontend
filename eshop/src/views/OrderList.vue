<template>
  <div class="orderlist-page">
    <!-- 面包屑导航 -->
    <vue-breadcrumb page-name="订单列表" />

    <section class="section-md">
      <div class="container container-sm container-lg container-xs">
        <ul class="orderlist-ul" v-if="orderList.length > 0">
          <li class="row">
            <div class="col-3">订单编号</div>
            <div class="col-5">下单时间</div>
            <div class="col-2">订单状态</div>
            <div class="col-2">操作</div>
          </li>
          <li
            class="row"
            v-for="_ in orderList"
            :key="_.orderId"
            @click="goOrderDetailHandler(_.orderId, false)"
          >
            <div class="col-3"><span>订单编号：</span>{{ _.orderId }}</div>
            <div class="col-5"><span>订单时间：</span>{{ _.orderTime }}</div>
            <div class="col-2"><span>订单状态：</span>{{ _.orderStatus }}</div>
            <div class="col-2 cursor" @click="goOrderDetailHandler(_.orderId)">
              查看详情
            </div>
          </li>
        </ul>
        <div v-if="orderList.length < 1 && !isLoading">
          还没有订单，快去购买产品吧~
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'OrderList',
    data() {
      return {
        orderList: [],
        // 是否显示加载中
        isLoading: true
      };
    },
    mounted() {
      window.scrollTo(0, 0);
      this.initOrderListHandler();
    },
    methods: {
      goOrderDetailHandler(orderId, isCan = true) {
        if (!isCan && this.$store.state.device != 'phone') {
          return;
        }

        this.$router.push({
          name: 'OrderDetail',
          params: {
            orderId: orderId
          }
        });
      },
      initOrderListHandler() {
        const _this = this;
        this.$ajax.get('/order/list', '', 2, 'mustAuth', response => {
          if (response.status >= 200 && response.status < 300) {
            console.log(response);
            const list = response.data.orders;
            for (var i in list) {
              list[i].orderTime = _this.$formatDate(true, list[i].orderTime);
            }
            _this.orderList = list;
            _this.isLoading = false;
          } else {
            console.log(response.message);
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .orderlist-ul {
    border: 1px solid $lineColor;

    li {
      text-align: center;
      line-height: 40px;
      border-top: 1px solid $lineColor;
      font-size: 16px;

      &:first-child {
        border-top: 0;
        font-size: 18px;
        color: $fontActiveColor;
      }

      > div {
        border-right: 1px solid $lineColor;

        span {
          display: none;
        }

        &:last-child {
          border-right: 0;
        }
      }

      &.row {
        margin-left: 0;
        margin-right: 0;
      }
    }
  }

  .phone {
    .orderlist-ul {
      border: none;

      li {
        border-top: 0;
        border: 1px solid $lineColor;
        margin-bottom: 10px;
        text-align: left;
        font-size: 14px;

        &:first-child,
        > div:last-child {
          display: none;
        }

        > div {
          border-right: 0;

          span {
            display: inline-block;
          }

          &:first-child {
            width: 100%;
          }

          &:nth-child(2) {
            width: 66.6666666667%;
          }

          &:nth-child(3) {
            width: 33.3333333333%;
            padding-left: 0;
            text-align: right;
          }
        }

        &.row > * {
          padding-left: 10px;
          padding-right: 10px;
        }
      }
    }
  }
</style>
