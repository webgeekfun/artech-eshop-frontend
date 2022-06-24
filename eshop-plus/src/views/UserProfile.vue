<template>
  <div class="user-profile-page">
    <!-- 面包屑导航 -->
    <vue-breadcrumb page-name="个人资料" />

    <section class="section-md">
      <div class="container container-sm container-lg container-xs">
        <div class="logout-btn cursor" @click="$logout()">退出登录</div>
        <ValidationObserver class="row row-50" tag="div" ref="userProfileObs">
          <!-- 昵称 -->
          <ValidationProvider
            class="tip-wrapper"
            name="用户名"
            tag="div"
            rules="required"
            v-slot="{ errors }"
          >
            <label for="userName" class="form-label h3">用户名</label>
            <input
              type="text"
              v-model="userInfoObj.username"
              :disabled="!isEdit"
              class="form-control"
              id="userName"
              placeholder="用户名 *"
            />
            <span class="tip-info">{{ errors[0] }}</span>
          </ValidationProvider>
          <!-- 头像 -->
          <div class="mb-4 avatar-wrap">
            <label for="avatar" class="form-label h3">头像</label>
            <div class="avatar-wrap-top" v-if="userInfoObj.avatar">
              <img class="mb-2" :src="userInfoObj.avatar" alt="" />
              <span
                v-if="isEdit"
                @click="deleteAvatarHandler"
                title="删除头像"
                class="bi-x cursor delete-btn"
              ></span>
            </div>
            <input
              type="file"
              :disabled="!isEdit"
              class="form-control"
              id="avatar"
              accept="image/*"
              ref="fileEle"
              @change="uploadImg($event)"
            />
          </div>
          <!-- 收货地址和详细地址 -->
          <div class="mt50">
            <vue-address
              :isEdit="isEdit"
              @user-info-handler="userInfoHandler"
            ></vue-address>
          </div>
        </ValidationObserver>
        <div class="row">
          <!-- 操作按钮 -->
          <div>
            <div class="user-operate-btn" v-if="isEdit">
              <span class="button button-primary" @click="editUserProfile">确认</span>
              <span class="button" @click="toggleEditHandler">取消</span>
            </div>
            <span v-else class="button button-primary" @click="toggleEditHandler">
              编辑
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import VueAddress from '../components/Address';
  import axios from 'axios';
  export default {
    name: 'UserProfile',
    components: {
      VueAddress
    },
    data() {
      return {
        isEdit: false,
        userInfoObj: {}
      };
    },
    methods: {
      // 确认修改个人信息
      async editUserProfile() {
        const isValid = await this.$refs.userProfileObs.validate();
        if (!isValid) {
          // 没有通过校验
          console.log('没有通过校验');
          return false;
        }

        const params = {
          avatar: this.userInfoObj.avatar,
          username: this.userInfoObj.username,
          receiverUserName: this.userInfoObj.receiverUserName,
          receiverPhoneNumber: this.userInfoObj.receiverPhoneNumber,
          receiverProvince: this.userInfoObj.receiverProvince,
          receiverCity: this.userInfoObj.receiverCity,
          receiverStreet: this.userInfoObj.receiverStreet
        };

        const _this = this;

        this.$ajax.post('/user/update', params, 2, 'mustAuth', response => {
          if (response.status >= 200 && response.status < 300) {
            console.log(response);
            _this.isEdit = false;
            _this.$store.dispatch('getLoginInfo');
            alert('修改成功！');
          } else {
            console.log(response.errorMessage);
          }
        });
      },
      // 子组件传递过来的用户信息对象
      userInfoHandler(obj) {
        obj.avatar = obj.avatar
          ? obj.avatar.indexOf(process.env.VUE_APP_COVER_URL) == -1
            ? process.env.VUE_APP_COVER_URL + obj.avatar
            : obj.avatar
          : '';
        this.userInfoObj = obj;
      },
      // 删除头像
      deleteAvatarHandler() {
        if (this.isEdit) {
          this.userInfoObj.avatar = '';
          this.$refs.fileEle.value = '';
        }
      },
      // 开始编辑
      toggleEditHandler() {
        this.isEdit = !this.isEdit;
      },
      uploadImg(obj) {
        const _this = this;
        const file = obj.target.files[0];
        if (file) {
          // var reader = new FileReader(); //调用FileReader
          // reader.readAsDataURL(file); //将文件读取为 DataURL(base64)
          // reader.onload = function(evt) {
          //   //读取操作完成时触发。
          //   _this.avatar = evt.target.result; //将img标签的src绑定为DataURL
          // };
          const formData = new window.FormData();
          formData.append('file', file);
          axios({
            method: 'post',
            url: 'https://file.haiqiao.vip/upload',
            data: formData,
            headers: {
              'Content-Type':
                'multipart/form-data; boundary=----WebKitFormBoundaryn6qdFAbQis3EN5pA'
            }
          })
            .then(function(response) {
              console.log(response);
              _this.userInfoObj.avatar = response.data.key
                ? process.env.VUE_APP_COVER_URL + response.data.key
                : '';
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          alert('上传失败');
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .logout-btn {
    text-align: right;
    font-size: 16px;
  }

  .avatar-wrap {
    .avatar-wrap-top {
      display: flex;
    }

    .delete-btn {
      font-size: 26px;
      margin-left: 10px;

      &:hover {
        color: $fontActiveColor;
      }
    }

    img {
      max-width: 400px;
      max-height: 400px;
    }
  }

  label {
    margin-bottom: 15px;
  }

  .user-operate-btn {
    .button + .button {
      margin-left: 20px;
    }
  }

  .phone {
    .avatar-wrap img {
      max-width: 92%;
      max-height: 100%;
    }
  }
</style>
