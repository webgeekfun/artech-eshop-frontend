<template>
  <div id="app">
    <vue-header />
    <section>
      <router-view />
    </section>
    <vue-footer />
    <div class="cart-wrap">
      <vue-cart />
    </div>
  </div>
</template>

<script>
import VueHeader from './components/Header'
import VueFooter from './components/Footer'
import VueCart from './components/Cart'
import Storage from './assets/js/localStorage'

export default {
  components: {
    VueHeader,
    VueFooter,
    VueCart
  },
  watch: {
    cart: {
      handler: (value) => Storage.cart.save(value),
      deep: true
    },
    orders: {
      handler: (value) => Storage.orderList.save(newVal),
      deep: true
    },
  },
  computed: {
    cart() {
      // watch只检测的到数据变化，不能比较数据差异，因此可以通过这种方式检测到
      return JSON.parse(JSON.stringify(this.$store.state.cart.products))
    },
    orders() {
      return JSON.parse(JSON.stringify(this.$store.state.orderList.orders))
    }
  }
}
</script>

<style>

@import './assets/css/style.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.w860 {
  width: 860px;
}

.cart-wrap {
  position: fixed;
  right: 0;
  top: 100px;
}

button { 
  outline: none;
  background: transparent;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: all .5s;
  font-size: 14px;
  border-radius: 5px;
}

button:hover {
  background: #e7e7e7;
}

a {
  text-decoration: none;
  color: initial;
}

table {
  border: 1px solid #e7e7e7;
  width: 100%;
  min-height: 100px;
  text-align: center;
  border-spacing: 0;
}

th {
  height: 40px;
}

td {
  height: 35px;
}

th, td {
  border-bottom: 1px solid #e7e7e7;
  border-right: 1px solid #e7e7e7;
}

tr:last-child td {
  border-bottom: none;
}
</style>
