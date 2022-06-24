import Storage from '../assets/js/localStorage'
import shoppingApi from '../assets/js/shoppingApi'
import router from '../router/index'

export default {
    namespaced: true,
    state: {
      products: Storage.cart.fetch(),  
    },
    getters:{
      totalPrice: (state) => state.products.reduce((a, b) => (a + Number(b.price)), 0) 
    },
    mutations: {
      add(state, product) {
        if(!state.products.find(_=>_.productId == product.productId))
          state.products.push(product);
      },
      recover(state, products) {
        state.products = products;
      },
      clear(state) {
        state.products = [];
      }
    },
    actions: {
      checkOut(context) {
        const savedProducts = context.state.products;
        const totalPrice = context.getters.totalPrice; 
  
        context.commit("clear");
        context.commit("loading/show", '正在生成订单……', {root: true});
  
        shoppingApi.makeOrder(
          savedProducts,
          (orderIdFromServer) => {
            context.commit('orderList/add', 
              {orderId: orderIdFromServer, products: savedProducts, totalPrice}, 
              {root: true});
            context.commit('loading/hide', null, {root: true});
            router.push({
              name: 'OrderDetail',
              params: { orderId: orderIdFromServer }
            });
          },
          () => {
            context.commit("recover", savedProducts);
            context.commit("loading/hide", '生成订单失败，请稍后再试', {root: true});
          }
        );
      }
    }
  };
