<template>
  <div :class="['page', $store.state.device]">
    <vue-header
      ref="headerEle"
      :cart-length="cartLength"
      :cart="cart"
      :cart-length-toggled="cartLengthToggled"
      :cart-length-in-transition="cartLengthInTransition"
      :wishlist="wishlist"
      :wishlist-length-toggled="wishlistLengthToggled"
      :wishlist-length-in-transition="wishlistLengthInTransition"
      @dropdown-menu-handler="operateMaskHandler"
    />

    <router-view
      ref="child"
      style="min-height: 400px;"
      @show-mask-handler="showMaskHandler"
    />

    <vue-footer />
    <vue-login />
    <vue-register />

    <!-- 遮罩 -->
    <div
      @click="closeMaskHandler"
      :class="['mask', isShowMask ? 'show' : '', isShowTagPanel ? 'isShowTagPanel' : '']"
    ></div>
  </div>
</template>

<script>
  import VueHeader from '@/components/Header';
  import VueFooter from '@/components/Footer';
  import VueLogin from '@/components/Login';
  import VueRegister from '@/components/Register';

  export default {
    name: 'App',
    components: {
      VueHeader,
      VueFooter,
      VueLogin,
      VueRegister
    },
    data() {
      return {
        isShowMask: false,
        // 产品列表的标签筛选面板是否显示
        isShowTagPanel: false,
        // 购物车
        cartLength: 0,
        cartInitFlag: true,
        cartLengthToggled: false,
        cartLengthInTransition: false,
        // 心愿单
        wishlistInitFlag: true,
        wishlistLengthToggled: false, // 心愿单数值变化之后，给数值元素添加过渡样式
        wishlistLengthInTransition: false
      };
    },
    computed: {
      wishlist() {
        // Array.from()方法就是将一个类数组对象或者可遍历对象转换成一个真正的数组。
        // 那么什么是类数组对象呢？所谓类数组对象，最基本的要求就是具有length属性的对象。
        return Array.from(this.$store.state.wishlist);
      },
      cart() {
        return Array.from(JSON.parse(JSON.stringify(this.$store.state.cart)));
      },
      loggedIn() {
        return false || this.$store.state.nickNameInfo;
      }
    },
    watch: {
      loggedIn() {
        if (this.$route.name == 'WishList' || this.$route.name == 'Cart') {
          this.$router.go(0);
        }
      },
      // 监听心愿单内容
      wishlist(newVal, oldVal) {
        // 初始化wishlist时（即刷新页面），不需要动画效果，直接return
        if (this.wishlistInitFlag) {
          this.wishlistInitFlag = false;
          return;
        }

        if (!this.$store.state.isLogin) {
          // 修改wishlist数组
          if (this.$store.state.nickNameInfo) {
            let diff = [];
            let api = '';
            const newSet = new Set(newVal);
            const oldSet = new Set(oldVal);
            if (newVal.length > oldVal.length) {
              diff = newVal.filter(item => !oldSet.has(item));
              api = '/wishlist/add?productId=';
            } else {
              diff = oldVal.filter(item => !newSet.has(item));
              api = '/wishlist/remove?productId=';
            }
            this.$ajax.post(api + diff[0], '', 2, 'mustAuth', response => {
              if (response.status < 200 || response.status >= 300) {
                console.log(response.message);
              }
            });
          } else {
            localStorage.setItem('wishlist', JSON.stringify(this.$store.state.wishlist));
          }
        }

        // 动画
        const wishlistTimer1 = setTimeout(() => {
          this.wishlistLengthToggled = true;
          clearTimeout(wishlistTimer1);
        }, 10);

        this.wishlistLengthInTransition = true;

        const wishlistTimer2 = setTimeout(() => {
          this.wishlistLengthToggled = false;
          clearTimeout(wishlistTimer2);
          const wishlistTimer3 = setTimeout(() => {
            this.wishlistLengthInTransition = false;
            clearTimeout(wishlistTimer3);
          }, 700);
        }, 700);
      },
      // 监听购物袋个数
      cart(newVal, oldVal) {
        console.log(newVal, oldVal);
        let cartLength = 0;
        this.cart.map(ele => {
          return (cartLength += Number(ele.count));
        });
        this.cartLength = cartLength;

        // 初始化cart时（即刷新页面），不需要动画效果，直接return
        if (this.cartInitFlag) {
          this.cartInitFlag = false;
          return;
        }

        // 未登录的时候，购物车新增加一个产品，然后登录，登录之后，账户本来有的产品会多增加数量，因为$store.state.cart已被未登录时提案加的产品占用，因此oldVal的值时未登录时的数组，而diff的值就成了账户本身里面的产品了
        if (!this.$store.state.isLogin) {
          // 增/删购物车的产品
          if (this.$store.state.nickNameInfo) {
            let diff = [];
            let api = '';

            // 修改产品数量
            if (newVal.length === oldVal.length) {
              newVal.forEach((element, index) => {
                if (element.count != oldVal[index].count) {
                  api = '/cart/update?productId=' + element.productId + '&count=' + element.count;
                }
              });
            } else if (newVal.length < oldVal.length) {
              // 删除产品
              diff = oldVal.filter(
                item => this.$findElem(newVal, 'productId', item.productId) == -1
              );
              api = '/cart/update?productId=' + diff[0].productId + '&count=0';
            } else {
              //新增产品
              diff = newVal.filter(
                item => this.$findElem(oldVal, 'productId', item.productId) == -1
              );
              api = '/cart/add?productId=' + diff[0].productId + '&count=' + diff[0].count;
            }

            this.$ajax.post(api, '', 2, 'mustAuth', response => {
              if (response.status < 200 || response.status >= 300) {
                console.log(response.message);
              }
            });
          } else {
            localStorage.setItem('cart', JSON.stringify(this.$store.state.cart));
          }

          // 两者（登录和未登录）跳转添加购车页面
          if (this.$route.name == 'ProductDetail') {
            if (newVal.length > oldVal.length) {
              const diffObj = newVal.filter(
                item => this.$findElem(oldVal, 'productId', item.productId) == -1
              );
              this.$router.push({
                name: 'addCartSuccess',
                params: {
                  productId: diffObj[0].productId,
                  count: diffObj[0].count
                }
              });
            } else if (newVal.length === oldVal.length) {
              newVal.forEach((element, index) => {
                if (element.count != oldVal[index].count) {
                  this.$router.push({
                    name: 'addCartSuccess',
                    params: {
                      productId: element.productId,
                      count: element.count - oldVal[index].count
                    }
                  });
                }
              });
            }
          }
        }

        // 动画
        const cartTimer1 = setTimeout(() => {
          this.cartLengthToggled = true;
          clearTimeout(cartTimer1);
        }, 10);

        this.cartLengthInTransition = true;

        const cartTimer2 = setTimeout(() => {
          this.cartLengthToggled = false;
          clearTimeout(cartTimer2);
          const cartTimer3 = setTimeout(() => {
            this.cartLengthInTransition = false;
            clearTimeout(cartTimer3);
          }, 700);
        }, 700);
      }
    },
    mounted() {
      // 屏宽
      this.AdaptToStyle();
      console.log(window.innerWidth); // 浏览器视口的宽
      window.onresize = () => {
        console.log(window.innerWidth); // 浏览器视口的宽
        this.AdaptToStyle();
      };

      if (!localStorage.getItem('userInfo')) {
        this.$store.dispatch('getLoginInfo');
      }

      // 已登录
      if (this.$store.state.nickNameInfo) {
        this.initWishlistFromRemote(); // 从远程初始化心愿单
        this.initCartFromRemote(); // 从远程初始化购物车
      } else {
        //未登录
        this.initWishlistFromLocal(); //从本地初始化心愿单
        this.initCartFromLocal(); //从本地初始化购物车
      }
    },
    methods: {
      // 使用localStorage初始化wishlist数组
      initWishlistFromLocal() {
        const localStorageWishlist = localStorage.getItem('wishlist');
        const localWishlist = localStorageWishlist
          ? JSON.parse(localStorageWishlist)
          : [];
        this.$store.commit('initWishlist', localWishlist);
      },
      // 使用API接口初始化wishlist数组
      initWishlistFromRemote() {
        const _this = this;
        this.$ajax.get('/wishlist/list', '', 2, 'mustAuth', response => {
          if (response.status >= 200 && response.status < 300) {
            const remoteWishlist = response.data.items.map(item => {
              return item.product.productId;
            });
            _this.$store.commit('initWishlist', remoteWishlist);
          } else console.log(response.errorMessage);
        });
      },
      // 使用localStorage初始化cart数组
      initCartFromLocal() {
        const localStorageCart = localStorage.getItem('cart');
        const localCart = localStorageCart ? JSON.parse(localStorageCart) : [];
        this.$store.commit('initCart', localCart);
      },
      // 使用API接口初始化cart数组
      initCartFromRemote() {
        const _this = this;
        this.$ajax.get('/cart/list', '', 2, 'mustAuth', response => {
          if (response.status >= 200 && response.status < 300) {
            const remoteCart = response.data.items.map(ele => {
              return {
                productId: ele.product.productId,
                count: ele.count
              };
            });
            _this.$store.commit('initCart', remoteCart);
          } else {
            console.log(response.message);
          }
        });
      },
      // 关闭遮罩
      closeMaskHandler() {
        if (this.isShowMask) {
          this.isShowMask = false;
          this.$refs.headerEle.dropdownMenu = 'none';
        }

        // 产品的tags面板
        if (this.isShowTagPanel) {
          this.isShowTagPanel = false;
        }

        if (this.$refs.child.isShowTagPanel) this.$refs.child.isShowTagPanel = false;
        if (this.$refs.child.isShowArticleTagPanel) {
          this.$refs.child.isShowArticleTagPanel = false;
        }
      },
      // 产品列表传递过来的变量控制mask显示与否
      showMaskHandler(value) {
        this.isShowTagPanel = value;
      },
      // 顶部菜单控制mask的显示与否
      operateMaskHandler(value) {
        if (value == 'none') this.isShowMask = false;
        else this.isShowMask = true;
      },
      // 屏幕的宽
      AdaptToStyle() {
        const device =
          window.innerWidth > 1024 ? 'pc' : window.innerWidth >= 768 ? 'pad' : 'phone';
        this.$store.commit('setDevice', device);

        // 屏宽为pad时，搜索框显示的情况下，从pad缩小到phone时，应将搜索框隐藏，菜单项显示
        const search = this.$refs.headerEle.isShowSearchInput;
        if (device == 'phone' && search) this.$refs.headerEle.isShowSearchInput = false;
      }
    }
  };
</script>
<style lang="scss">
  @import './assets/custom-bootstrap.scss';
  @import './assets/override.scss';
  @import './assets/reset.scss';
  @import './assets/common.scss';
</style>
