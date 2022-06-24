import message from '../plugins/Message.vue'

export default {//Component组件  props传进来的参数
  install(Vue) {

    // 使用Vue.extend创建
    // 拓展方法，Message是独立组件，extend得作用是将Message与Vue项目关联起来
    const Com = Vue.extend(message);
    
    //创建组件实例并挂载，就可以获取Message组件得vm层
    const vm = new Com().$mount();

    //把Message组件的视图部分挂载到vue项目得body上（元素追加到body后面）
    document.body.appendChild(vm.$el);
  } 
}