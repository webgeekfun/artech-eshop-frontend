<template>
  <nav class="
    navbar 
    bg-white 
    fixed-top 
    navbar-expand-md 
    navbar-light 
    shadow"
  >
    <div class="container  align-items-center">
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarContent" 
        aria-controls="navbarContent" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <span class="navbar-brand" href="#">
        <img src="../assets/images/logo.png" alt="logo" style="width:70px;">
      </span>
      <span class="navbar-text d-flex align-items-center">
        购物车<strong class="badge rounded-pill bg-primary">
          {{cartCount}}
          </strong>
      </span>
      <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav ms-auto">
            <router-link 
              tag="li" 
              class="nav-link" 
              data-bs-toggle="collapse" 
              data-bs-target=".collapse.show" 
              to="/" 
              exact
            >
              首页
            </router-link>
            <router-link 
              tag="li" 
              class="nav-link" 
              data-bs-toggle="collapse" 
              data-bs-target=".collapse.show" 
              to="/products"
            >
              产品
            </router-link>
            <router-link 
              tag="li" 
              class="nav-link" 
              data-bs-toggle="collapse" 
              data-bs-target=".collapse.show" 
              to="/orders"
            >
              订单
            </router-link>
            <router-link 
              tag="li" 
              class="nav-link" 
              data-bs-toggle="collapse" 
              data-bs-target=".collapse.show" 
              to="/about"
            >
              关于我们
            </router-link>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    cartCount(){
      return this.$store.state.cart.products.length;
    }
  }
}
</script>

<style>
  nav li:hover,
  nav li.router-link-active,
  nav li.router-link-exact-active {
    color: black !important;
    cursor: pointer;
    text-decoration: overline;
  }
</style>