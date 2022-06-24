<template>
  <div :class="['preloader', isLoading ? 'loaded' : '']">
    <div class="cssload-speeding-wheel"></div>
    <span>内容加载中，请稍候...</span>
  </div>
</template>

<script>
  export default {
    name: 'Loading',
    props: {
      isLoading: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="scss" scoped>
  /* 加载中...的样式 */
  .preloader {
    display: none;
    padding: 75px 10px;
    background: #fff;
    width: 100%;
    height: 36px;
    text-align: center;
    transition: 0.3s all ease;

    &.loaded {
      display: block;
    }

    .cssload-speeding-wheel {
      width: 36px;
      height: 36px;
      margin: 0 auto 15px auto;
      border: 3px solid $fontDefaultColor;
      border-radius: 50%;
      border-left-color: transparent;
      border-bottom-color: transparent;
      animation: cssload-spin 0.88s infinite linear;
    }
  }

  @keyframes cssload-spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
