<template>
  <div class="cart" :class="status">
    <ul>
      <li v-for="item in $store.getters.products" :key="item.name">{{item}}</li>
    </ul>
    <button @click="checkOut">确定下单</button>
  </div>
</template>  

<script>
  export default{
      methods: {
          checkOut(){
            this.$store.dispatch("checkOut");
          }
      },
      computed: {
        status(){
           return this.$store.getters.status;
        }
    }
  };
</script>

<style scoped>
  ul,li{
    margin:0;
    padding:0;
  }
  li{
    line-height: 1.8;
    list-style-type: none;
  }
  .cart{
    width:180px;
    border: 2px dashed #999;
    position: absolute;
    padding:10px;
    top:70px;
    right:20px;
  }

  .ordinary{
    background-color: #ddd;
  }

  .success{
    background-color: #dfd;
  }

  .error{
    background-color: #fdd;
  }

  .waiting{
    background-color: #bbf;
  }
</style>


