import Vue from 'vue'
import Vuex from 'vuex'

import loadingModule from './loading'
import cartModule from './cart'
import orderListModule from './orderList'
import productCatalogModule from './productCatalog'

Vue.use(Vuex)
export default new Vuex.Store({
  modules:{
    cart: cartModule, 
    orderList: orderListModule,
    productCatalog: productCatalogModule,
    loading: loadingModule
  }
});
