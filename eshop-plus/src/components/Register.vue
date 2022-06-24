<template>
  <div :class="['login-register-modal', isShowRegisterModal ? 'show' : '']">
    <div class="login-register-modal-dialog">
      <div class="modal-inner">
        <div class="text-end">
          <span class="bi-x cursor" @click="$closeRegister(true)"></span>
        </div>
        <ValidationObserver class="content" tag="div" ref="registerObs">
          <h3>注册</h3>
          <ValidationProvider
            class="mb-4 tip-wrapper"
            name="手机号码"
            tag="div"
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
            class="mb-4 tip-wrapper"
            name="密码"
            tag="div"
            rules="required"
            v-slot="{ errors }"
            vid="password"
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
          <ValidationProvider
            class="mb-2 tip-wrapper"
            name="确认密码"
            tag="div"
            rules="required|confirmed:password"
            v-slot="{ errors }"
          >
            <span class="bi-lock"></span>
            <input
              type="password"
              v-model="confirmPassword"
              class="form-control"
              placeholder="请输入确认密码"
            />
            <span class="tip-info">{{ errors[0] }}</span>
          </ValidationProvider>
          <div class="toggle-login-register" @click="showLoginModalHandler">去登录</div>
          <div class="btn-error-wrap">
            <div class="button button-primary" @click="registerHandler">注册</div>
            <div class="errorInfo">{{ errorInfo }}</div>
          </div>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Register',
    data() {
      return {
        isShowRegisterModal: false,
        phone: '',
        password: '',
        confirmPassword: '',
        errorInfo: ''
      };
    },
    methods: {
      // 清空注册的输入框信息
      clearRegisterInfoHandler() {
        this.phone = '';
        this.password = '';
        this.confirmPassword = '';
        this.errorInfo = '';
        // // 清空注册框的错误提示信息
        this.$refs.registerObs.reset();
      },
      async registerHandler() {
        const isValid = await this.$refs.registerObs.validate();
        if (!isValid) {
          // 没有通过校验
          return false;
        }
        console.log('通过');

        const params = {
          phoneNumber: this.phone,
          password: this.password,
          confirmPassword: this.confirmPassword
        };

        const _this = this;

        this.$ajax.post('/user/register', params, 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            // console.log(response)
            window.localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            window.localStorage.setItem(
              'expireTime',
              new Date(response.data.expireTime).getTime()
            );

            _this.$store.dispatch('getLoginInfo'); // 获取用户本人信息
            _this.$store.dispatch('initWishlistFromBoth'); //登录后迁移本地心愿单至远程（也可不迁移，根据业务确定）
            _this.$store.dispatch('initCartFromBoth'); //登录后将本地购物车迁移至远程
            _this.$closeRegister();
          } else {
            console.log(response.errorMessage);
            if (response.errorMessage.nickname) {
              _this.errorInfo = response.errorMessage.nickname[0];
              return;
            }
            if (response.errorMessage.email) {
              _this.errorInfo = response.errorMessage.email[0];
              return;
            }
            if (response.errorMessage.phoneNumber) {
              _this.errorInfo = response.errorMessage.phoneNumber[0];
              return;
            }
            console.log('注册失败');
            _this.errorInfo = '注册失败，请稍候重试';
          }
        });
      },
      showLoginModalHandler() {
        this.$closeRegister();
        this.$showLogin();
      }
    }
  };
</script>

<style lang="scss" scoped></style>
