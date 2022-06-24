<template>
  <div id="app" class="h-100 d-flex flex-column">
    <header class="mb-4 mb-md-5">
      <vue-header />
    </header>
    <main class="mt-5 flex-grow-1">
      <router-view />
    </main>
    <footer class="flex-shrink-0 bg-light py-5 text-muted mt-5">
      <vue-footer />
    </footer>
    <vue-cart />
  </div>
</template>

<script>
import VueHeader from './components/Header'
import VueFooter from './components/Footer'
import VueCart from './components/Cart'


export default {
  components: {
    VueHeader,
    VueFooter,
    VueCart
  }
  //另一种监视Vuex的方法
  //watch: {
  //  cart: {
  //    handler: (value) => {
  //      storage.cart.save(value)
  //    },
  //    deep: true
  //  },
  //  orders: {
  //    handler: (value) => storage.orderList.save(value),
  //    deep: true
  //  },
  //},
  //computed: {
  //  cart() {
  //    // watch只检测的到数据变化，不能比较数据差异，因此可以通过这种方式检测到
  //    return JSON.parse(JSON.stringify(this.$store.state.cart.products))
  //  },
  //  orders() {
  //    return JSON.parse(JSON.stringify(this.$store.state.orderList.orders))
  //  }
  //}
}
</script>
