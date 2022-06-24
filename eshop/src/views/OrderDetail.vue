<template>
  <div class="order-detail-page">
    <!-- 面包屑导航 -->
    <vue-breadcrumb page-name="订单详情" />

    <section class="section-md">
      <div class="container container-sm container-lg container-xs">
        <ul class="table-ul">
          <li class="row">
            <div class="col-6 ul-info">
              产品
            </div>
            <div class="col-2 table-product-price">价格</div>
            <div class="col-2 table-product-price">数量</div>
            <div class="col-2 table-product-price">总价</div>
          </li>
          <li
            class="row"
            v-for="_ in orderObj.orderItems"
            :key="_.product.productId"
            @click="goProductDetailHandler(_.product.productId, false)"
          >
            <div :class="[$store.state.device == 'phone' ? '' : 'col-6', 'ul-info']">
              <div class="cursor img-wrap">
                <img
                  @click="goProductDetailHandler(_.product.productId)"
                  :src="_.product.picture"
                  alt=""
                />
              </div>
              <div class="table-product-info">
                <h6
                  class="cursor"
                  @click="goProductDetailHandler(_.product.productId)"
                >
                  {{ _.product.name }}
                </h6>
                <p>单价：{{ _.product.price | currency(2) }}</p>
                <p>数量：{{ _.count }}</p>
              </div>
            </div>
            <div class="col-2 table-product-price">{{ _.product.price | currency(2) }}</div>
            <div class="col-2 text-center product-num">{{ _.count }}</div>
            <div class="col-2 total-price">
              <span>总价：</span>{{ (_.count * _.product.price) | currency(2) }}
            </div>
          </li>
        </ul>

        <!-- 收货信息和订单信息 -->
        <div class="row receving-info">
          <div class="col-md-6 col-lg-6 mt50">
            <h3>收货信息</h3>
            <ul>
              <li>
                <label>收货姓名：</label>
                <span>{{ receiverName }}</span>
              </li>
              <li>
                <label>收货电话：</label>
                <span>{{ receiverPhone }}</span>
              </li>
              <li>
                <label>收货地址：</label>
                <span>{{ receiverAddress }}</span>
              </li>
            </ul>
          </div>
          <div class="col-md-6 col-lg-6 mt50">
            <h3>订单信息</h3>
            <ul>
              <li>
                <label>订单编号：</label>
                <span>{{ $route.params.orderId }}（可根据订单号查询发货信息）</span>
              </li>
              <li>
                <label>下单时间：</label>
                <span>{{ orderTime }}</span>
              </li>
              <li v-if="cancelTime">
                <label>订单取消时间：</label>
                <span>{{ cancelTime }}</span>
              </li>
              <li v-if="payTime">
                <label>支付时间：</label>
                <span>{{ payTime }}</span>
                <span class="pay-status">支付成功</span>
              </li>
              <li>
                <label>订单状态：</label>
                <span>{{ orderStatus }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 实付款 -->
        <h4 class="text-end mt50">实付款：{{orderObj.totalPrice}}元</h4>
      </div>
    </section>
    <section v-if="orderStatus == '待支付'">
      <div class="container container-sm container-lg container-xs">
        <div class="line"></div>
      </div>
    </section>

    <section v-if="orderStatus == '待支付'" class="section-md text-center">
      <div class="container container-sm container-lg container-xs">
        <img class="mb12 qrcode-img" :src="qrcode" alt="" />
        <p>请使用微信扫描二维码进行付款</p>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'OrderDetail',
    data() {
      return {
        orderId: '',
        orderObj: {},
        qrcode: '',
        timer: null
      };
    },
    created() {
      const orderId = this.$route.params.orderId;
      this.initOrderDetailInfo(orderId);
      this.qrcodeHandler(orderId);
    },
    beforeDestroy() {
      if (this.timer) clearInterval(this.timer)
    },
    computed: {
      addressObj() {
        return this.orderObj?.address || '';
      },
      receiverName() {
        return this.addressObj?.userName || '';
      },
      receiverPhone() {
        return this.addressObj?.phoneNumber || '';
      },
      receiverAddress() {
        const province = this.addressObj?.province || '';
        const city = this.addressObj?.city || '';
        const address = this.addressObj?.street || '';
        return province + city + address;
      },
      orderTime() {
        return this.orderObj
          ? this.orderObj.orderTime
            ? this.$formatDate(true, this.orderObj.orderTime)
            : ''
          : '';
      },
      payTime() {
        return this.orderObj
          ? this.orderObj.payTime
            ? this.$formatDate(true, this.orderObj.payTime)
            : ''
          : '';
      },
      cancelTime() {
        return this.orderObj
          ? this.orderObj.cancelTime
            ? this.$formatDate(true, this.orderObj.cancelTime)
            : ''
          : '';
      },
      orderStatus() {
        return this.orderObj
          ? this.orderObj.orderStatus
            ? this.orderObj.orderStatus
            : ''
          : '';
      }
    },
    methods: {
      qrcodeHandler(orderId) {
        const _this = this;
        this.$ajax.post(
          '/order/' + orderId + '/pay/wechat-qrcode',
          '',
          2,
          'mustAuth',
          response => {
            if (response.status >= 200 && response.status < 300) {
              const slash = response.data.qrcodeImg.startsWith('/') ? '' : '/';
              _this.qrcode =
                localStorage.getItem('useApiUrl') + slash + response.data.qrcodeImg;
            } else {
              console.log(response.message);
            }
          }
        );
      },
      goProductDetailHandler(productId, isCan = true) {
        if (!isCan && this.$store.state.device != 'phone') {
          return;
        }

        this.$router.push({
          name: 'ProductDetail',
          params: {
            productId: productId
          }
        });
      },
      checkStatus() {
        const orderId = this.$route.params.orderId
        const _this = this;
        this.$ajax.get('/order/' + orderId, '', 2, 'mustAuth', response => {
          if (response.status >= 200 && response.status < 300) {
            _this.orderObj.orderStatus = response.data.orderStatus;
            _this.orderObj.payTime = response.data.payTime;
          } else {
            console.log(response.message);
          }
        });
      },
      initOrderDetailInfo(orderId) {
        const _this = this;
        this.$ajax.get('/order/' + orderId, '', 2, 'mustAuth', response => {
          if (response.status >= 200 && response.status < 300) {
            _this.orderObj = response.data;
            if (_this.orderObj.orderStatus === '待支付') {
              _this.timer = setInterval(_this.checkStatus, 1000);
            }

            _this.$nextTick(() => {
              _this.orderObj.orderItems.map(ele => {
                ele.product.picture = process.env.VUE_APP_PRODUCT_M_URL + ele.product.picture;
              });
            });
          } else {
            console.log(response.message);
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .pay-status {
    margin-left: 5px;
    color: green;
    font-weight: 700;
  }
  .table-ul {
    li {
      &:first-child {
        .col-2 {
          border-right: none;
        }
      }

      .col-2 {
        border-right: 1px solid $lineColor;
        color: $fontActiveColor;

        &:last-child {
          border-right: none;
        }
      }

      .total-price {
        text-align: center;

        span {
          display: none;
        }
      }
    }
  }

  .phone {
    .table-ul {
      .product-num {
        display: none;
      }

      .total-price {
        position: absolute;
        right: 0;
        bottom: 10px;
        width: 33.3333333333%;
        text-align: right;

        span {
          display: inline-block;
        }
      }
    }
  }

  .receving-info {
    > div:last-child {
      ul li:first-child {
        font-weight: 400;
      }
    }
  }

  .qrcode-img {
    max-width: 220px;
  }
</style>
