import Vue from 'vue';
import Vuex from 'vuex';
import appSettings from './app-settings';
import ajax from '../httpConfig';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appSettings,
    device: 'pc',
    nickNameInfo: '',
    selectMenuCategoryId: 0, //头部菜单项选中的标识
    avatar: '',
    cart: [],
    wishlist: [],
    isLogin: false,
    appName: 'product'
  },
  mutations: {
    setIsLogin(state, isLogin) {
      state.isLogin = isLogin;
    },
    // 初始化心愿单
    initWishlist(state, wishlist) {
      state.wishlist = wishlist;
    },
    // 加入/移出心愿单
    toggleWishlist(state, skuId) {
      const tempSkuId = Number(skuId);
      if (state.wishlist.indexOf(tempSkuId) === -1) {
        state.wishlist.push(tempSkuId);
      } else {
        if (location.href.indexOf('cart') == -1) {
          state.wishlist.splice(state.wishlist.indexOf(tempSkuId), 1);
        }
      }
    },
    setAvatar(state, avatar) {
      state.avatar = avatar;
    },
    // 用户昵称
    setUserInfo(state, nickNameInfo) {
      state.nickNameInfo = nickNameInfo;
    },
    // 初始化购物车
    initCart(state, cart) {
      state.cart = cart;
    },
    // 加入/移除购物车
    toggleCart(state, item) {
      const idx = Vue.prototype.$findElem(state.cart, 'skuId', item.skuId);
      if (idx === -1) {
        state.cart.push(item);
      } else {
        // 删除产品
        if (item.count === 0) {
          state.cart.splice(idx, 1);
          console.log(state.cart);
          state.cart = JSON.parse(JSON.stringify(state.cart));
          // 从购物车删除之后，需要添加到心愿单中
          this.commit('toggleWishlist', item.skuId);
        } else {
          // 修改产品数量
          if (location.href.indexOf('cart') != -1) {
            state.cart[idx].count = item.count;
            state.cart = JSON.parse(JSON.stringify(state.cart));
          } else {
            // 修改count的值
            state.cart[idx].count += item.count;

            // 但是watch检测不到数组的变化
            // JSON.parse(JSON.stringify(obj/arr))我们一般用来深拷贝，其过程说白了就是利用JSON.stringify将js对象(数组也是对象)序列化(变为JSON字符串)，再使用JSON.parse来反序列化(还原)js对象
            state.cart = JSON.parse(JSON.stringify(state.cart));
          }
        }
      }
    },
    setCategoryId(state, selectMenuCategoryId) {
      state.selectMenuCategoryId = selectMenuCategoryId;
    },
    setDevice(state, device) {
      state.device = device;
    },
    setAppName(state, appName) {
      state.appName = appName;
    }
  },
  actions: {
    getLoginInfo(context) {
      ajax.get('/user/profile', '', 2, 'mustAuth', response => {
        if (response.status >= 200 && response.status < 300) {
          // console.log(response);
          context.commit('setUserInfo', response.data.username);

          localStorage.setItem('userInfo', response.data.username);
        } else {
          console.log(response);
        }
      });
    },
    // 登录成功之后，获取购物车两者（本地和远程）的数据
    initCartFromBoth(context) {
      ajax.get('/cart/list', '', 2, 'mustAuth', response => {
        if (response.status >= 200 && response.status < 300) {
          const remoteCart = new Set(
            response.data.items.map(item => {
              return {
                skuId: item.sku.skuId,
                count: item.count
              };
            })
          );
          const localCart = new Set(JSON.parse(localStorage.getItem('cart')));
          // 并集
          const cart = Array.from(new Set([...remoteCart, ...localCart]));
          // 差集
          const diff = Array.from(
            new Set([...localCart].filter(x => !remoteCart.has(x)))
          );

          context.commit('initCart', cart);
          localStorage.setItem('cart', JSON.stringify([]));

          diff.forEach(item => {
            ajax.post(
              '/cart/add?skuId=' + item.skuId + '&count=' + item.count,
              '',
              2,
              'mustAuth',
              response => {
                if (response.status >= 200 && response.status < 300) {
                  console.log(response.message);
                } else {
                  console.log(response);
                }
              }
            );
          });
        } else console.log(response.errorMessage);
      });
    },
    // 登录成功之后，获取两者（本地和远程）的数据
    initWishlistFromBoth(context) {
      ajax.get('/wishlist/list', '', 2, 'mustAuth', response => {
        if (response.status >= 200 && response.status < 300) {
          const remoteWishlist = new Set(
            response.data.items.map(item => {
              return item.sku.skuId;
            })
          );
          const localWishlist = new Set(JSON.parse(localStorage.getItem('wishlist')));
          const wishlist = Array.from(new Set([...remoteWishlist, ...localWishlist]));
          const diff = Array.from(
            new Set([...localWishlist].filter(x => !remoteWishlist.has(x)))
          );

          context.commit('initWishlist', wishlist);

          localStorage.setItem('wishlist', JSON.stringify([]));

          diff.forEach(item => {
            ajax.post('/wishlist/add?skuId=' + item, '', 2, 'mustAuth', response => {
              if (response.status >= 200 && response.status < 300) {
                console.log(response.message);
              }
            });
          });
        } else console.log(response.errorMessage);
      });
    }
  },
  modules: {}
});
