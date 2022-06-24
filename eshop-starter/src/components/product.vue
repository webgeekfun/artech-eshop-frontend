<template>
      <p :name="name">
        {{name}} 
        <button @click="addToCart">加入购物车</button>
      </p>
</template>  

<script>
  export default {
      props:['name'],
      methods: {
          addToCart(){
            this.$store.commit("addToCart", this.name);
          }
      }
  }
</script>

<style>
</style>