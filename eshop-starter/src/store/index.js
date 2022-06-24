import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let shoppingApi = {
  buy(products, successCallback, errorCallback){
    let timeout = Math.random()*4000;
    let successOrError= Math.random();
    setTimeout(() => {
      //模拟成功和失败的概率各占一半
      if(successOrError > 0.5) 
        successCallback();
      else
        errorCallback();
    }, timeout);
  }
};

export default new Vuex.Store({
  state:{
    products: [],
    status: 'ordinary'  
  },
  getters:{
      products(state){
        return state.products;
      },
      status(state){
        return state.status;
      }
  },
  actions:{
    checkOut (context) {
      // 先把当前购物车的物品备份起来
      const savedProducts = context.getters.products;
      // 然后乐观地清空购物车
      context.commit("clear");
      context.commit("setStatus", "waiting");
      // 模拟通过Ajax调用服务器端的购物API，提供两个
      // 回调函数，分别处理操作成功和操作失败的情况。
      shoppingApi.buy(
        savedProducts,
        // 成功操作
        () => {
          context.commit("setStatus", "success");
          setTimeout(() => {
            context.commit("setStatus", "ordinary");
          }, 3000);
        },
        // 失败操作
        () => {
          context.commit("recover", savedProducts);
          context.commit("setStatus", "error");
          setTimeout(() => {
            context.commit("setStatus", "ordinary");
          }, 3000);
        }
      )
    }
  },
  mutations: {
    addToCart(state, name){
      if(!state.products.includes(name))
        state.products.push(name);
    },
    clear(state){
      state.products=[];
    },
    recover(state, products){
      state.products = products
    },
    setStatus(state, status){
      state.status = status;
    }
  }
})
