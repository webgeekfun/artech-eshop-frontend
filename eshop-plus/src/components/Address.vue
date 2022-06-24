<template>
  <div class="address-page">
    <div class="row">
      <div class="col-md-6 col-lg-5">
        <ValidationProvider
          tag="div"
          class="mb-4 tip-wrapper"
          name="收货地址"
          rules="required"
          v-slot="{ errors }"
        >
          <label class="h3">收货地址</label>
          <input
            type="text"
            :disabled="!isEdit"
            class="form-control"
            placeholder="收货姓名*"
            v-model="userInfoObj.receiverUserName"
          />
          <span class="tip-info">{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider
          tag="div"
          class="mb-4 tip-wrapper"
          name="收货电话"
          rules="required|telephone"
          v-slot="{ errors }"
        >
          <input
            type="text"
            :disabled="!isEdit"
            class="form-control"
            placeholder="收货电话*"
            v-model="userInfoObj.receiverPhoneNumber"
          />
          <span class="tip-info">{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider
          tag="div"
          class="mb-4 tip-wrapper"
          name="省市"
          rules="required"
          v-slot="{ errors }"
        >
          <input v-model="userInfoObj.receiverProvince" hidden />
          <input v-model="userInfoObj.receiverCity" hidden />
          <v-distpicker
            :province="userInfoObj.receiverProvince"
            :city="userInfoObj.receiverCity"
            hide-area
            :disabled="!isEdit"
            @selected="onSelected"
          ></v-distpicker>
          <span class="tip-info">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
      <div class="col-md-6 col-lg-7">
        <ValidationProvider
          tag="div"
          class="mb-4 tip-wrapper"
          name="详细地址"
          rules="required"
          v-slot="{ errors }"
        >
          <label class="h3">详细地址</label>
          <textarea
            :disabled="!isEdit"
            type="text"
            class="form-control"
            rows="10"
            placeholder="详细地址*"
            v-model="userInfoObj.receiverStreet"
          ></textarea>
          <span class="tip-info">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Address',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        userInfoObj: {}
      };
    },
    mounted() {
      if (this.$store.state.nickNameInfo) this.getLoginInfo();
    },
    methods: {
      getLoginInfo() {
        const _this = this;
        this.$ajax.get('/user/profile', '', 2, 'mustAuth', response => {
          if (response.status >= 200 && response.status < 300) {
            console.log(response);
            _this.userInfoObj = response.data;
            _this.$emit('user-info-handler', _this.userInfoObj);
          } else {
            console.log(response);
          }
        });
      },
      // 选择省和市
      onSelected(data) {
        const province = data.province.value;
        const city = data.city.value;

        this.userInfoObj.receiverProvince = province == '省' ? '' : province;
        this.userInfoObj.receiverCity = city == '市' ? '' : city;
      }
    }
  };
</script>

<style lang="scss" scoped>
  label {
    margin-bottom: 15px;
  }

  .phone {
    .address-page {
      > div:last-child {
        margin-top: 50px;
      }
    }
  }
</style>
