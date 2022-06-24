<template>
  <header :class="['header', 'dropdown-' + dropdownMenu]">
    <div class="menu-wrap">
      <div v-show="isShowSearchInput" class="search-box">
        <div class="search-wrap">
          <input
            class="form-control"
            v-model="search"
            placeholder="Enter keyword"
            type="text"
            autocomplete="off"
            @keyup.enter="searchProductsHandler"
          />
          <span
            class="cursor search-wrap-icon bi-search"
            @click="searchProductsHandler"
          />
          <span class="cursor search-wrap-icon bi-x" @click="hideSearchHandler" />
        </div>
      </div>

      <div
        class="menu flex items-center justify-content-space-between"
        v-show="!isShowSearchInput"
      >
        <div class="menu-icon-left cursor" @click="toggleLeftMenuHanlder">
          <span class="bi-x" v-if="dropdownMenu == 'left'"></span>
          <span class="bi-list" v-else></span>
        </div>
        <div class="left-menu flex items-center">
          <div class="logo cursor" @click="goPageHandler('home')"></div>
          <div :class="['menu-list', dropdownMenu == 'left' ? 'show' : '']">
            <div class="indicator left"></div>
            <ul @click="dropdownMenu = 'none'">
              <li :class="['nav-home', selectMenuName == 'Home' ? 'active' : '']">
                <router-link to="/">首页</router-link>
              </li>
              <li :class="selectMenuCategoryId == 1 ? 'active' : ''">
                <router-link :to="$store.state.appSettings.route.mug">
                  马克杯
                </router-link>
              </li>
              <li :class="selectMenuCategoryId == 3 ? 'active' : ''">
                <router-link :to="$store.state.appSettings.route.beer">
                  啤酒杯
                </router-link>
              </li>
              <li :class="selectMenuCategoryId == 2 ? 'active' : ''">
                <router-link :to="$store.state.appSettings.route.enamel">
                  搪瓷杯
                </router-link>
              </li>
              <li :class="selectMenuName == 'ArticleList' ? 'active' : ''">
                <router-link to="/articles/0/1">杯言杯语</router-link>
              </li>
              <li :class="selectMenuName == 'Contact' ? 'active' : ''">
                <router-link to="/contact">极客范儿</router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="right-menu">
          <ul class="right-menu-horizontal">
            <li
              :class="['bi-search', selectMenuName == 'Search' ? 'active' : '']"
              @click="showSearchHandler"
            ></li>
            <li
              :class="['cart-icon', selectMenuName == 'Cart' ? 'active' : '']"
              @click="toggleRightMenuHanlder"
            >
              <span class="bi-x" v-if="dropdownMenu == 'right'"></span>
              <span class="bi-cart2" v-else>
                <i
                  v-if="cart.length > 0 || cartLengthInTransition"
                  :class="['cart-num', cartLengthToggled ? 'cartActive' : '']"
                >
                  {{ cartLength }}
                </i>
              </span>
            </li>
            <li
              :class="['bi-heart', selectMenuName == 'WishList' ? 'active' : '']"
              @click="goPageHandler('wishlist')"
            >
              <i
                v-if="wishlist.length > 0 || wishlistLengthInTransition"
                :class="['wish-num', wishlistLengthToggled ? 'wishActive' : '']"
              >
                {{ wishlist.length }}
              </i>
            </li>
            <li
              :class="[
                'bi-box-seam',
                selectMenuName == 'OrderList' || selectMenuName == 'OrderDetail'
                  ? 'active'
                  : ''
              ]"
              @click="goPageHandler('orderlist')"
            ></li>
            <li>
              <span
                :class="['bi-person', selectMenuName == 'UserProfile' ? 'active' : '']"
                @click="goPageHandler('userProfile')"
              ></span>
              <div class="user-logout-group">
                <span
                  :class="[
                    'cursor userName',
                    selectMenuName == 'UserProfile' ? 'active' : ''
                  ]"
                  @click="goPageHandler('userProfile')"
                >
                  {{ $store.state.nickNameInfo }}
                </span>
                <span
                  class="logOut"
                  v-if="$store.state.nickNameInfo"
                  @click="goPageHandler('logout')"
                >
                  [注销]
                </span>
              </div>
            </li>
          </ul>
          <div class="right-menu-vertical">
            <div :class="['menu-list', dropdownMenu == 'right' ? 'show' : '']">
              <div class="indicator right" />
              <ul>
                <li>
                  <input
                    v-model="search"
                    @keyup.enter="searchProductsHandler"
                    placeholder="Enter keyword"
                    class="form-control"
                    type="text"
                  />
                  <span
                    class="search-wrap-icon bi-search"
                    @click="searchProductsHandler"
                  />
                </li>
                <li
                  :class="selectMenuName == 'Cart' ? 'active' : ''"
                  @click="goPageHandler('cart')"
                >
                  <i class="bi-cart2" /> 购物车
                  <span>（{{ cartLength }}）</span>
                </li>
                <li
                  :class="selectMenuName == 'WishList' ? 'active' : ''"
                  @click="goPageHandler('wishlist')"
                >
                  <i class="bi-heart" /> 心愿单
                  <span v-if="wishlist.length > 0">（{{ wishlist.length }}）</span>
                </li>
                <li
                  :class="
                    selectMenuName == 'OrderList' || selectMenuName == 'OrderDetail'
                      ? 'active'
                      : ''
                  "
                  @click="goPageHandler('orderlist')"
                >
                  <i class="bi-box-seam" /> 订单
                </li>
                <li
                  :class="selectMenuName == 'UserProfile' ? 'active' : ''"
                  v-if="$store.state.nickNameInfo"
                  @click="goPageHandler('userProfile')"
                >
                  <i class="bi-person" /> 账户
                </li>
                <li v-if="$store.state.nickNameInfo" @click="goPageHandler('logout')">
                  <i class="bi-x" /> 注销 {{ $store.state.nickNameInfo || '' }}
                </li>
                <li v-else @click="goPageHandler('login')">
                  <i class="bi-person" /> 登录
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'Header',
    props: {
      // 购物车
      cartLength: {
        type: Number
      },
      cart: {
        type: Array,
        default: () => []
      },
      cartLengthToggled: {
        type: Boolean
      },
      cartLengthInTransition: {
        type: Boolean
      },
      // 心愿单
      wishlist: {
        type: Array,
        default: () => []
      },
      wishlistLengthToggled: {
        type: Boolean
      },
      wishlistLengthInTransition: {
        type: Boolean
      }
    },
    data() {
      return {
        isShowSearchInput: false,
        search: '',
        // 菜单项的选中标识
        selectMenuCategoryId: 0,
        selectMenuName: 'Home',
        // 手机端下拉菜单标识
        dropdownMenu: 'none'
      };
    },
    watch: {
      selectMenuIndex() {
        this.selectMenuCategoryId = this.selectMenuIndex;
      },
      // 手机端菜单列表
      dropdownMenu(value) {
        this.$emit('dropdown-menu-handler', value);
      },
      $route() {
        // 当前页面菜单项选中样式
        this.menuSelectedHandler();

        // 在搜索产品页面点击首页，没反应，加入下面最外层的if判断即修改问题
        const k = this.$route.params.search;
        if (k && k != this.search) {
          if (this.search) {
            this.searchProductsHandler();
          }
        }
      }
    },
    mounted() {
      // 菜单选中样式
      this.menuSelectedHandler();
    },
    computed: {
      selectMenuIndex() {
        return this.$store.state.selectMenuCategoryId;
      }
    },
    methods: {
      // 搜索产品
      searchProductsHandler() {
        this.dropdownMenu = 'none';

        // 搜索内容为空，return
        if (!this.search) return;

        this.$router.push({
          name: 'Search',
          params: {
            search: this.search
          }
        });
        this.search = ''; // 清空输入框中的搜索关键字
      },
      // 菜单选中样式
      menuSelectedHandler() {
        if (this.$route.name == 'ProductList') {
          this.selectMenuName = '';
          this.selectMenuCategoryId = this.$route.params.categoryId;
        } else {
          if (
            this.$route.name == 'addCartSuccess' ||
            this.$route.name == 'ProductDetail'
          ) {
            this.selectMenuName = '';
            if (localStorage.getItem('selectCategory')) {
              const selectObj = JSON.parse(localStorage.getItem('selectCategory'));
              this.selectMenuCategoryId = selectObj.categoryId;
            }
          } else {
            //其他
            this.selectMenuCategoryId = 0;
            this.selectMenuName = this.$route.name;
          }
        }
      },
      goPageHandler(page) {
        // 关闭遮罩
        this.dropdownMenu = 'none';

        if (page == 'cart') this.$router.push({ name: 'Cart' });
        if (page == 'userProfile') this.$router.push({ name: 'UserProfile' });
        if (page == 'orderlist') this.$router.push({ name: 'OrderList' });
        if (page == 'wishlist') this.$router.push({ name: 'WishList' });
        if (page == 'home') this.$router.push({ name: 'Home' });
        if (page == 'logout') this.$logout();
        if (page == 'login') this.$showLogin();
      },
      // 切换右侧菜单
      toggleRightMenuHanlder() {
        if (this.$store.state.device == 'phone') {
          if (this.dropdownMenu == 'right') this.dropdownMenu = 'none';
          else this.dropdownMenu = 'right';
        } else {
          this.$router.push({
            name: 'Cart'
          });
        }
      },
      // 切换左侧菜单
      toggleLeftMenuHanlder() {
        if (this.dropdownMenu == 'left') this.dropdownMenu = 'none';
        else this.dropdownMenu = 'left';
      },
      // 关闭search框
      hideSearchHandler() {
        this.isShowSearchInput = false;
      },
      // 点击查找按钮，显示隐藏input
      showSearchHandler() {
        this.isShowSearchInput = !this.isShowSearchInput;
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '../assets/header.scss';
</style>
