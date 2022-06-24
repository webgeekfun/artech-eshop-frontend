import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// 引入bootstrap-icons的字体图标库
import 'bootstrap-icons/font/bootstrap-icons.css';

// 注册全局组件-面包屑导航
import VueBreadcrumb from './components/Breadcrumb.vue';
Vue.component('vue-breadcrumb', VueBreadcrumb);

// 注册全局组件分页
import VuePagination from './components/Pagination.vue';
Vue.component('vue-pagination', VuePagination);

// 注册全局组件loading
import VueLoading from './components/Loading.vue';
Vue.component('vue-loading', VueLoading);

// 公共方法
import util from './util/util';
Vue.use(util);

// 价格保留几位小数的过滤器
Vue.filter('currency', function(v, n) {
  if (!v) {
    return Number('0').toFixed(n || 2);
  }
  return Number(v).toFixed(n || 2);
});

// 放大预览图片
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
Vue.use(Viewer);
// 默认配置项
Viewer.setDefaults({
  Options: {
    inline: true, //启用inline模式
    button: true, //显示右上角关闭按钮
    navbar: true, //显示缩略图导航
    title: true, //显示当前图片的标题
    toolbar: true, //显示工具栏
    tooltip: true, //显示缩放百分比
    movable: true, //图片是否可移动
    zoomable: true, //图片是否可缩放
    rotatable: true, //图片是都可旋转
    scalable: true, //图片是否可翻转
    transition: true, //使用CSS3过渡
    fullscreen: true, //播放时是否全屏
    keyboard: true, //是否支持键盘
    url: 'data-source' //设置大图片的url
  }
});

// 省市区联动
import Distpicker from 'v-distpicker';
Vue.component('v-distpicker', Distpicker);

// https://www.jianshu.com/p/f592b59e9ee9
// 引入VeeValidate表单验证的规则配置文件
import './util/veevalidate';

// 注册VeeValidate全局组件
import { ValidationProvider, ValidationObserver, setInteractionMode } from 'vee-validate';
// 全局设置交互模式（触发验证的方式）------也可以在ValidationProvider组件中添加mode="Eager"单独设置组件
setInteractionMode('eager');
// 全局注册组件
Vue.component('ValidationProvider', ValidationProvider);
// 在提交表单的时候需要对整个表单进行验证，这个时候需要用到ValidationObserver组件
Vue.component('ValidationObserver', ValidationObserver);

// 请求接口
import axios from './httpConfig/index.js';
Vue.prototype.$ajax = axios;

// 退出登录
Vue.prototype.$logout = function() {
  window.localStorage.setItem('accessToken', '');
  window.localStorage.setItem('refreshToken', '');
  window.localStorage.setItem('userInfo', '');
  window.localStorage.setItem('expireTime', '');

  store.commit('initWishlist', []);
  store.commit('initCart', []);

  store.commit('setUserInfo', '');

  router.push({
    name: 'Home'
  });
};

import Login from './util/login';
Vue.use(Login);

import Register from './util/register';
Vue.use(Register);

// 路由拦截
router.beforeEach(function(to, from, next) {
  // 取.env文件中的API
  if (process.env.VUE_APP_BASE_URL) {
    const apiUrlObj = JSON.parse(process.env.VUE_APP_BASE_URL);

    localStorage.setItem('apiUrlObj', process.env.VUE_APP_BASE_URL);

    // 默认取对象的第一个值
    if (!localStorage.getItem('useApiUrl')) {
      localStorage.setItem('useApiUrl', Object.values(apiUrlObj)[0]);
    }
  }

  if (localStorage.getItem('userInfo')) {
    const userInfo = localStorage.getItem('userInfo');
    store.commit('setUserInfo', userInfo);
  } else {
    store.commit('setUserInfo', '');
  }

  // 登录
  if (
    to.matched.some(item => {
      return item.meta.require_login;
    })
  ) {
    // 需要登录
    if (!store.state.nickNameInfo) {
      Vue.prototype.$showLogin();
    } else {
      next();
    }
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
