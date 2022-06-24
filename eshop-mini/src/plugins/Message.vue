<template>
  <div :class="['messageBox', show ? 'showMessageBox' : '']">
    {{info}}
  </div>
</template>

<script>
import store from '../store'

export default {


  data() {
    return store.state.loading
  }
}
</script>

<style>
.messageBox {
  position: fixed;
  z-index: -1000;
  left: 45%;
  top: 50%;
  transition: all .5s;
  -webkit-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -ms-transform: translateX(-50%) translateY(-50%);
  -o-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  border-radius: 5px;
  color: #FFF;
  background: rgba(17, 17, 17, 0.6);
  height: 80px;
  line-height: 80px;
  padding: 0 60px;
  max-width: 500px;
  font-size: 18px;
  opacity: 0;
}

.messageBox.showMessageBox {
  opacity: 1;
  z-index: 2000;
}
</style>