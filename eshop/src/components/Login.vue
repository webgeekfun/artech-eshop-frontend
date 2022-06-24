<template>
  <div :class="['login-register-modal', isShowLoginModal ? 'show' : '']">
    <div class="login-register-modal-dialog">
      <div class="modal-inner">
        <div class="text-end">
          <span class="bi-x cursor" @click="$closeLogin(true)"></span>
        </div>
        <ValidationObserver class="content" ref="loginObs" tag="div">
          <h3>登录</h3>
          <ValidationProvider
            class="mb-4 tip-wrapper"
            tag="div"
            name="手机号码"
            rules="required|telephone"
            v-slot="{ errors }"
          >
            <span class="bi-telephone"></span>
            <input
              type="text"
              v-model="phone"
              class="form-control"
              placeholder="请输入手机号码"
            />
            <span class="tip-info">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider
            class="mb-2 tip-wrapper"
            tag="div"
            name="密码"
            rules="required"
            v-slot="{ errors }"
          >
            <span class="bi-lock"></span>
            <input
              type="password"
              v-model="password"
              class="form-control"
              placeholder="请输入密码"
            />
            <span class="tip-info">{{ errors[0] }}</span>
          </ValidationProvider>
          <div class="toggle-login-register" @click="showRegisterModalHandler">
            去注册
          </div>
          <div class="btn-error-wrap">
            <div class="button button-primary" @click="loginHandler">登录</div>
            <div class="errorInfo">{{ errorInfo }}</div>
          </div>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        isShowLoginModal: false,
        phone: '',
        password: '',
        errorInfo: ''
      };
    },
    methods: {
      // 清空登录的输入框信息
      clearLoginInfoHandler() {
        this.phone = '';
        this.password = '';
        this.errorInfo = '';
        // 清空登录框的错误提示信息
        this.$refs.loginObs.reset();
      },
      // 登录
      async loginHandler() {
        const isValid = await this.$refs.loginObs.validate();
        if (!isValid) {
          // 没有通过校验
          return false;
        }
        // 通过校验

        const params = {
          phoneNumber: this.phone,
          password: this.password
        };

        const _this = this;

        this.$ajax.post('/user/login', params, 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem(
              'expireTime',
              new Date(response.data.expireTime).getTime()
            );
            _this.$store.commit('setIsLogin', true);
            _this.$store.dispatch('getLoginInfo'); // 获取用户本人信息
            _this.$store.dispatch('initCartFromBoth'); //登录后将本地购物车迁移至远程
            _this.$store.dispatch('initWishlistFromBoth'); //登录后迁移本地心愿单至远程
            _this.$closeLogin();
          } else {
            console.log(response.errorMessage);
            _this.errorInfo = response.errorMessage;
          }
        });
      },
      showRegisterModalHandler() {
        this.$closeLogin();
        this.$showRegister();
      }
    }
  };
</script>

<style lang="scss" scoped></style>
