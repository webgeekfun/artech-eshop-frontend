import Vue from 'vue'
import app from './app.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(app)
}).$mount('#app')
