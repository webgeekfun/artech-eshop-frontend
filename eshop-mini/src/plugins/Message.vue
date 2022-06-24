<template>
  <div 
    v-show ="show"
    :class="[
      'rounded', 
      'p-5',
      'bg-secondary', 
      'text-white', 
      'position-fixed', 
      'top-50', 
      'start-50', 
      'translate-middle', 
    ]"
  >
    <span 
      class="spinner-border spinner-border-sm me-2" 
      role="status" 
      aria-hidden="true"
    ></span>
    <span>{{info}}</span>
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