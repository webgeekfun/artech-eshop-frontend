<template>
  <div>
    <!-- 面包屑导航 -->
    <vue-breadcrumb page-name="购物车" />

    <section>
      <div class="container container-sm container-lg container-xs">
        <!-- 加载中~ -->
        <vue-loading :isLoading="isLoading" />

        <div class="row" v-if="observerableCart.length > 0">
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
              v-for="item in observerableCart"
              :key="item.product.productId"
            >
              <div :class="[$store.state.device == 'phone' ? '' : 'col-6', 'ul-info']">
                <div
                  @click="deleteProduct(item.product.productId)"
                  class="remove-icon cursor"
                >
                  <span class="bi-x"></span>
                  <span class="text">移除</span>
                </div>
                <div class="cursor img-wrap">
                  <img
                    @click="goProductDetailHandler(item.product.productId)"
                    :src="item.product.picture"
                    alt=""
                  />
                </div>
                <div class="table-product-info">
                  <h6 @click="goProductDetailHandler(item.product.productId)">
                    {{ item.product.name }}
                  </h6>
                  <p>价格：{{ item.product.price | currency(2) }}</p>
                </div>
              </div>
              <div class="col-2 table-product-price">
                {{ item.product.price | currency(2) }}
              </div>
              <div :class="[$store.state.device == 'phone' ? 'col-3' : 'col-2']">
                <div class="step-wrap text-center">
                  <input
                    class="form-control"
                    type="number"
                    min="1"
                    value="1"
                    v-model="item.count"
                    @change="editCount(item.product.productId, item.count)"
                  />
                  <span
                    class="stepper-arrow up bi-chevron-up"
                    @click="addCount(item.product.productId)"
                  ></span>
                  <span
                    class="stepper-arrow down bi-chevron-down"
                    @click="reduceCount(item.product.productId)"
                  ></span>
                </div>
              </div>
              <div class="col-2 table-product-price">
                {{ (item.count * item.product.price) | currency(2) }}
              </div>
            </li>
          </ul>

          <ValidationObserver tag="div" ref="addressObs">
            <vue-address
              :isEdit="true"
              class="mt50"
              @user-info-handler="userInfoHandler"
            ></vue-address>
          </ValidationObserver>

          <div class="line mt50"></div>

          <div class="text-end section-md">
            <div class="total-price">总计：{{ totalPrice | currency(2) }}元</div>
            <div class="button button-primary" @click="checkOut">确认下单</div>
          </div>
        </div>
        <div v-if="observerableCart.length < 1 && !isLoading">
          购物车还没有产品，快去购买吧~
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  import VueAddress from '../components/Address';
  export default {
    name: 'Cart',
    components: {
      VueAddress
    },
    data() {
      return {
        cart1: [],
        sumPrice: 0,
        isLoading: true,
        userInfoObj: {}
      };
    },
    mounted() {
      window.scrollTo(0, 0);

      if (this.$store.state.nickNameInfo) {
        this.getRemoteCart();
      } else {
        this.getLocalCart();
      }
    },
    computed: {
      observerableCart() {
        const _this = this;
        return this.cart1.filter(function(item) {
          return (
            _this.$findElem(
              _this.$store.state.cart,
              'productId',
              item.product.productId
            ) > -1
          );
        });
      },
      totalPrice() {
        let sum = 0;
        if (this.observerableCart && this.observerableCart.length > 0) {
          this.observerableCart.forEach(element => {
            sum += element.product.price * element.count;
          });
        }
        return sum;
      }
    },
    methods: {
      userInfoHandler(obj) {
        this.userInfoObj = obj;
      },
      // 从购物车删除产品
      deleteProduct(productId) {
        // 调用修改数量接口，参数count传递0即可
        this.$store.commit('toggleCart', {
          productId: productId,
          count: 0
        });
      },
      async checkOut() {
        // 先判断是否登录，若没登录，弹出登录框
        if (!this.$store.state.nickNameInfo) {
          this.$showLogin();
          return false;
        }
        const isValid = await this.$refs.addressObs.validate();
        if (!isValid) {
          // 没有通过校验
          console.log('没有通过校验');
          return false;
        }

        const params = {
          address: {
            userName: this.userInfoObj.receiverUserName,
            phoneNumber: this.userInfoObj.receiverPhoneNumber,
            province: this.userInfoObj.receiverProvince,
            city: this.userInfoObj.receiverCity,
            street: this.userInfoObj.receiverStreet
          }
        };

        const _this = this;
        this.$ajax.post('/cart/checkout', params.address, 2, 'mustAuth', response => {
          if (response.status >= 200 && response.status < 300) {
            // console.log(response)
            _this.$store.commit('initCart', []);
            _this.$router.push({
              name: 'OrderDetail',
              params: {
                orderId: response.data.orderId
              }
            });
          } else {
            console.log(response.message);
          }
        });
      },
      goProductDetailHandler(productId) {
        this.$router.push({
          name: 'ProductDetail',
          params: {
            productId: productId
          }
        });
      },
      // 点击上箭头修改增加数量
      addCount(productId) {
        const _this = this;
        this.cart1.forEach(ele => {
          if (ele.product.productId == productId) {
            ele.count++;
            _this.editCount(productId, ele.count);
          }
        });
      },
      // 点击下箭头修改减少数量
      reduceCount(productId) {
        const _this = this;
        this.cart1.forEach(ele => {
          if (ele.product.productId == productId) {
            if (ele.count > 1) {
              ele.count--;
            }
            _this.editCount(productId, ele.count);
          }
        });
      },
      // 修改数量
      editCount(productId, count) {
        this.$store.commit('toggleCart', {
          productId: productId,
          count: Number(count)
        });
      },
      getLocalCart() {
        const _this = this;
        const tempCart = this.$store.state.cart;

        if (tempCart.length === 0) {
          this.isLoading = false;
          return;
        }

        const productIds = tempCart.map(item => {
          return item.productId;
        });

        // const url = '/product/sku?skuIds=' + skuIds.join(',');
        const url = '/product/listByIds?productIds=' + productIds.join(',');
        this.$ajax.get(url, '', 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            console.log(response);
            _this.cart1 = response.data.map(item => {
              const tempProductId = _this.$findElem(
                tempCart,
                'productId',
                item.productId
              );
              if (tempProductId > -1) {
                return {
                  product: item,
                  count: tempCart[tempProductId].count
                };
              }
            });

            var result = _this.cart1.map(item => {
              return {
                productId: item.product.productId,
                count: item.count
              };
            });
            // 例如，时间过去太久没动这个页面，在这个时间段中，如果某个商品下架了，给后端传递了三个参数，接口返回了两个数据，这时就需要将接口返回的数据和wishlist的数据（即当前localStorage里面存的数据）作比较，没有的数据，就从列表中移除掉
            const difference = tempCart.filter(x => result.includes(x) === -1);
            difference.forEach(item => {
              _this.remove(item);
            });
            _this.isLoading = false;

            _this.$nextTick(() => {
              if (_this.cart1) {
                _this.cart1.map(ele => {
                  ele.product.picture =
                    process.env.VUE_APP_PRODUCT_M_URL + ele.product.picture;
                });
              }
            });
          } else {
            console.log(response.message);
          }
        });
      },
      //
      getRemoteCart() {
        const _this = this;
        this.$ajax.get('/cart/list', '', 2, 'mustAuth', response => {
          if (response.status >= 200 && response.status < 300) {
            // console.log(response)
            _this.cart1 = response.data.items;
            _this.isLoading = false;
            _this.$nextTick(() => {
              if (_this.cart1) {
                _this.cart1.map(ele => {
                  ele.product.picture =
                    process.env.VUE_APP_PRODUCT_M_URL + ele.product.picture;
                });
              }
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
  .total-price {
    color: $fontActiveColor;
    font-size: 20px;
    font-weight: 400;
  }

  .phone .total-price {
    font-size: 16px;
  }

  .table-ul {
    li {
      &:not(:first-child) {
        > div {
          border-right: 1px solid $lineColor;

          &:last-child {
            border-right: 0;
            border-left: 1px solid $lineColor;
          }

          &:nth-last-child(2) {
            border-right: 0;
          }
        }
      }
    }
  }

  .phone {
    .table-ul {
      li {
        &:not(:first-child) {
          > div {
            border-right: 0;
          }
        }
      }

      .remove-icon {
        background: transparent;
        color: #000;
        font-size: 14px;
        bottom: 5px;
        right: 0;
      }

      .ul-info .img-wrap img {
        width: 125px;
      }

      .step-wrap {
        position: absolute;
        right: 10px;
        bottom: 30px;
        width: 80px;

        input {
          height: 30px;
          min-height: 30px;
        }

        .stepper-arrow.up,
        .stepper-arrow.down {
          top: 0px;
          margin-top: 0;
          line-height: 30px;
        }
      }
    }
  }
</style>
