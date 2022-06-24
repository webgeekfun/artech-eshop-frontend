<template>
  <section class="section-md">
    <div class="container container-sm container-lg container-xs">
      <h4>请选择API域名：</h4>
      <div class="row">
        <!-- <div class="btn-group-toggle"> -->
        <label
          @click="toggleLanguage(key, value)"
          :class="['col-4 btn btn-light btn-lg', key == apiLanguageName ? 'active' : '']"
          v-for="(value, key, index) in apiUrlObj"
          :key="index"
        >
          <input type="radio" name="options" checked />{{ key }}
        </label>
        <!-- </div> -->
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    name: 'ApiUrl',
    data() {
      return {
        apiUrlObj: {},
        apiLanguageName: ''
      };
    },
    mounted() {
      const useApiUrl = localStorage.getItem('useApiUrl');

      const apiUrlObj = localStorage.getItem('apiUrlObj');
      if (apiUrlObj) {
        const obj = JSON.parse(apiUrlObj);
        this.apiUrlObj = obj;

        for (var key in obj) {
          if (obj[key] == useApiUrl) {
            this.apiLanguageName = key;
          }
        }
      }
    },
    methods: {
      toggleLanguage(key, value) {
        this.apiLanguageName = key;
        localStorage.setItem('useApiUrl', value);
        // 刷新，重新获取API地址请求接口
        this.$router.go(0);
        this.$logout();
      }
    }
  };
</script>
<style lang="scss">
  .btn input[type='radio'] {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    pointer-events: none;
  }

  .btn-light {
    color: #000;
    background-color: #f5f5f5;
    border-color: #f5f5f5;
  }

  .btn-light.active {
    color: #fff;
    background-color: #000;
    border-color: #000;
  }
</style>
