import Storage from '../assets/js/localStorage'
import shoppingApi from '../assets/js/shoppingApi'

export default {
  namespaced: true,

  state:{
    orders: Storage.orderList.fetch(),
  },
  getters: {
    getOrder: (state) => 
      (orderId) => state.orders.find(_ => _.orderId == orderId)
  },
  mutations: {
    add(state, {orderId, products, totalPrice}) {
      state.orders.push({ 
        orderId, 
        orderTime: new Date().toLocaleString(), 
        payTime:'',
        isPaid: false, 
        products,
        totalPrice
      });
    },

    pay(state, order) {
      order.isPaid = true;
      order.payTime = new Date().toLocaleString();
    }
  },
  actions: {
    pay(context, order) {
      context.commit("loading/show", '正在支付，请稍候……', {root: true});

      shoppingApi.pay(
        order.orderId,
        // 成功操作
        () => {
          context.commit("pay", order);
          context.commit("loading/hide", '支付成功', {root: true});
        },
        // 失败操作
        () => {
          context.commit("loading/hide", '支付失败，请稍后再试', {root: true});
        }
      );
    }
  }
};