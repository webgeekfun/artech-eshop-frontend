<template>
  <div>
    <!-- 面包屑导航 -->
    <vue-breadcrumb page-name="404页面" />

    <section
      class="text-center page404"
      :style="{ 'background-image': 'url(' + bgImg + ')' }"
    >
      <div class="container container-sm container-lg container-xs">
        <div class="row">
          <div>
            <h2>404</h2>
            <p>您访问的页面不存在，可以点击下面的按钮返回主页</p>
            <a class="button" @click="goHomeHandler">返回首页</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    name: 'Page404',
    data() {
      return {
        bgImg: require('../assets/images/bg-image-8.jpg')
      };
    },
    methods: {
      goHomeHandler() {
        this.$router.push({
          name: 'Home'
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .page404 {
    height: 500px;
    background-size: cover;
    color: $fontActiveColor;
    display: flex;
    align-items: center;

    padding-top: 0;

    h2 {
      color: $fontActiveColor;
    }
  }
</style>
