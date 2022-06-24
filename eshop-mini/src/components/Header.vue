<template>
  <header>
    <div class="container">
      <nav class="header-wrap">
        <div>
          <img src="../assets/images/logo.png" alt="logo">
          <ul>
            <li v-for="item in navList" 
              :key="item.enName"
              :class="{'active': active == item.enName}"
              @click="onClick(item.enName)"
            >
              {{item.name}}
            </li>
          </ul>
        </div>
        <p>购物车中商品数量：<strong>{{cartCount}}</strong></p>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      active: 'Home',
      navList: [
        {name: '首页', enName: 'Home'},
        {name: '产品', enName: 'Products'},
        {name: '订单', enName: 'Orders'},
        {name: '联系我们', enName: 'Contact'}
      ]
    }
  },
  created() {
    // 菜单标识
    const name = this.$route.name
    if (name.includes('Order'))
      this.active = 'Orders'
    else if (name.includes('Product'))
      this.active = 'Products'
    else 
      this.active = name
  },
  computed: {
    cartCount(){
      return this.$store.state.cart.products.length;
    }
  },
  methods: {
    onClick(enName) {
      this.active = enName;
      if (enName == 'Home') {
        this.$router.push({
          name: 'Home'
        })
        return
      } 

      // 除首页之外的
      this.$router.push({
        name: enName
      })
    }
  }
}
</script>

<style>
.header-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-wrap li.active {
  color: #000;
  border-bottom: 1px solid #888;
}

.router-link-exact-active.router-link-active {
  color: #000;
  border-bottom: 1px solid #888;
}
</style>