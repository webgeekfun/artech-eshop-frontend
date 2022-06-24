import register from '../components/Register.vue';
import store from '../store/index.js';

export default {
  //Component组件  props传进来的参数
  install(Vue) {
    // 使用Vue.extend创建
    // 拓展方法，Login是独立组件，extend得作用是将Login与Vue项目关联起来
    const Com = Vue.extend(register);
    //创建组件实例并挂载，就可以获取Login组件得vm层
    const vm = new Com().$mount();
    vm.$store = store; // register.vue中登录成功之后用的

    document.body.appendChild(vm.$el); //把Login组件得视图部分挂载到vue项目得body上（元素追加到body后面）

    Vue.prototype.$showRegister = function() {
      vm.isShowRegisterModal = true;
    };
    // isClickBtn是为了区分关闭登录框的方式：
    // 1. 点击登录框的关闭的按钮：token过期之后，进入页面会弹出登录框，不登录就点击关闭登录框，就需要清空用户信息，不然就会总弹登录框
    // 2. 登录后自动关闭的登录框：不需要清token
    Vue.prototype.$closeRegister = function(isClickBtn = false) {
      vm.isShowRegisterModal = false;
      // 清空登录框的数据和错误信息
      vm.clearRegisterInfoHandler();
      if (isClickBtn && localStorage.getItem('accessToken')) {
        // token过期之后，进入页面会弹出登录框，不登录就点击关闭登录框，就需要清空用户信息，不然就会总弹登录框
        vm.$logout();
      }
    };
  }
};
