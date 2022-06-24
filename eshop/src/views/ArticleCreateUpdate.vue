<template>
  <div class="create-update-article-page">
    <!-- 面包屑导航 -->
    <vue-breadcrumb :page-name="articleId > 0 ? '编辑文章' : '创建文章'" />

    <section class="section-md">
      <div class="container container-sm container-lg container-xs">
        <ValidationObserver tag="div" ref="createUpdateObs" class="row row-50">
          <ValidationProvider
            class="mb-4 tip-wrapper"
            tag="div"
            name="文章标题"
            rules="required"
            v-slot="{ errors }"
          >
            <input
              type="text"
              v-model="articleObj.subject"
              class="form-control"
              placeholder="文章标题*"
            />
            <span class="tip-info">{{ errors[0] }}</span>
          </ValidationProvider>
          <div class="mb-4">
            <textarea
              class="form-control"
              v-model="articleObj.abstract"
              name="文章简介*"
              placeholder="文章简介"
              rows="8"
            ></textarea>
          </div>
          <ValidationProvider
            class="mb-4 tip-wrapper"
            tag="div"
            rules="required"
            name="文章内容"
            v-slot="{ errors }"
          >
            <quill-editor
              v-model="articleObj.content"
              :options="editorOption"
            ></quill-editor>
            <span class="tip-info">{{ errors[0] }}</span>
          </ValidationProvider>
          <div class="tagsWrap mb-4">
            <div class="form-control flex">
              <span class="tags">
                <span v-for="(item, index) in articleObj.tags" :key="index">
                  {{ item }} <i class="bi-x" @click="deleteTagHandler(index)"></i>
                </span>
              </span>
              <input
                v-model="tag"
                @keyup="keyupHandler"
                @input="inputTags"
                autocomplete="off"
                placeholder="文章标签*"
                type="text"
                name="文章标签"
              />
            </div>
          </div>
          <!-- 头像 -->
          <div class="mb-4 avatar-wrap">
            <div class="avatar-wrap-top" v-if="articleObj.cover">
              <img class="mb-2" :src="cover" alt="" />
              <p @click="deleteArticleCoverHandler" title="删除封面" class="bi-x cursor"></p>
            </div>
            <input
              type="file"
              class="form-control"
              id="cover"
              accept="image/*"
              ref="fileEle"
              @change="uploadImg($event)"
            />
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="isPublish"
              v-model="articleObj.isPublished"
            />
            <label class="form-check-label" for="isPublish">是否发布</label>
          </div>
          <div class="operate-btn">
            <div v-if="articleId > 0">
              <div class="button button-primary" @click="updateArticleHandler">修改</div>
              <div class="button" @click="deleteArticleHandler">删除</div>
            </div>
            <div v-else class="button button-primary" @click="createArticleHandler">
              创建
            </div>
          </div>
        </ValidationObserver>
      </div>
    </section>
  </div>
</template>
<script>
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';

  import { quillEditor } from 'vue-quill-editor';
  import axios from 'axios';

  // 编辑器的toolbar配置项
  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], 
    ['blockquote', 'code-block'],
    [{'header': 1}, {'header': 2}],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'indent': '-1'}, {'indent': '+1'}],
    [{'size': ['small', false, 'large', 'huge']}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link', 'image']
  ];

  export default {
    name: 'ArticleCreateUpdate',
    components: {
      quillEditor
    },
    data() {
      return {
        editorOption: {
          placeholder: '请输入文章内容 *',
          modules: {
            toolbar: toolbarOptions
          }
        },
        articleObj: {
          subject: '',
          abstract: '',
          content: '',
          tags: [],
          cover: '',
          isPublished: false
        },
        tag: '',
        articleId: -1,
        // 弹框信息
        isSuccessAlert: true,
        alertInfo: '',
        isShowAlert: false
      };
    },
    computed: {
      cover() {
        return this.articleObj.cover
          ? process.env.VUE_APP_COVER_URL + this.articleObj.cover
          : '';
      }
    },
    created() {
      this.articleId = this.$route.params.articleId;
      this.feedbackArticleHandler(this.articleId);
    },
    methods: {
      // 删除文章
      deleteArticleHandler() {
        const _this = this;
        this.$ajax.post('/article/' + this.articleId + '/delete', '', 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            console.log(response);
            alert('删除成功！');
            // 刷新页面
            _this.$router.push({
              name: 'ArticleList',
              params: {
                tagId: 0,
                page: 1
              }
            });
          } else {
            console.log(response.message);
          }
        });
      },
      // 删除文章的封面
      deleteArticleCoverHandler() {
        this.articleObj.cover = ''
        this.$refs.fileEle.value = ''
      },
      // 回显文章信息
      feedbackArticleHandler(articleId) {
        const _this = this;
        if (articleId == 0) {
          return;
        }
        this.$ajax.get('/article/' + articleId, '', 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            console.log(response);
            const articleObj = response.data;
            _this.articleObj.subject = articleObj.subject;
            _this.articleObj.abstract = articleObj.abstract;
            _this.articleObj.content = articleObj.content;
            _this.articleObj.tags = articleObj.tags.map(ele => ele.name);
            _this.articleObj.cover = articleObj.cover;
            _this.articleObj.isPublished = true;
          } else {
            console.log(response.message);
          }
        });
      },
      // 修改文章
      async updateArticleHandler() {
        const isValid = await this.$refs.createUpdateObs.validate();
        if (!isValid) {
          console.log('没有通过校验');
          return false;
        }

        const _this = this;
        this.$ajax.post(
          '/article/' + this.articleId + '/update',
          this.articleObj,
          2,
          'mustAuth',
          response => {
            if (response.status >= 200 && response.status < 300) {
              console.log(response);
              alert('修改成功！');
              // 刷新页面
              _this.$router.go(0);
            } else {
              console.log(response.message);
            }
          }
        );
      },
      // 创建文章
      async createArticleHandler() {
        const isValid = await this.$refs.createUpdateObs.validate();
        if (!isValid) {
          console.log('没有通过校验');
          return false;
        }

        const _this = this;
        this.$ajax.post('/article/create', this.articleObj, 2, 'mustAuth', response => {
          if (response.status >= 200 && response.status < 300) {
            console.log(response);
            alert('创建成功！');
            // 刷新页面
            _this.$router.go(0);
          } else {
            console.log(response.message);
          }
        });
      },
      uploadImg(obj) {
        const _this = this;
        const file = obj.target.files[0];
        if (file) {
          // var reader = new FileReader(); //调用FileReader
          // reader.readAsDataURL(file); //将文件读取为 DataURL(base64)
          // reader.onload = function(evt) {
          //   //读取操作完成时触发。
          //   _this.cover = evt.target.result; //将img标签的src绑定为DataURL
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
              _this.articleObj.cover = response.data.key ? response.data.key : '';
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          alert('上传失败');
        }
      },
      keyupHandler(e) {
        console.log(e);
        // console.log(e.target.selectionStart)
        console.log(e.target.selectionEnd);
        if (e && e.keyCode == 37) {
          //左键
          // console.log(this.selectionCursor)
          if (e.target.selectionEnd == 0) {
            // if (this.selectionCursor > 0 && this.selectionCursor < 2) {
            //   console.log('左键到头了')
            //   this.selectionCursor++
            // } else {
            //   this.selectionCursor = 1
            // }
          }
        }
        if (e && e.keyCode == 39) {
          console.log('右键');
        }
      },
      deleteTagHandler(index) {
        this.articleObj.tags.splice(index, 1);
      },
      // 检测输入空格，表示一个tag
      inputTags(e) {
        if (e.data == ' ' && e.target.value.replace(/\s/g, '')) {
          this.articleObj.tags.push(e.target.value.trim());
          // 清空输入框的内容
          this.tag = '';
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  textarea.form-control {
    height: 80px;
  }
  
  .tags {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      display: inline-flex;
      margin: 0 0 0 20px;
      border: 1px solid;
      padding: 0 5px;
      border-radius: 3px;
      font-size: 14px;
      line-height: 30px;
    }

    i {
      font-size: 18px;
      margin-left: 0;
      cursor: pointer;
    }
  }

  .tagsWrap {
    > .form-control {
      padding: 0;
    }

    input {
      flex: 1;
      min-height: 60px;
      border: none;
      background-color: transparent;
      border-left: none;
      padding: 0 15px;

      &:focus {
        outline: none !important;
      }
    }
  }

  .avatar-wrap {
    .avatar-wrap-top {
      display: flex;
    }

    img {
      max-width: 400px;
      max-height: 400px;
    }

    p {
      margin-left: 10px;
      font-size: 26px;

      &:hover {
        color: $fontActiveColor;
      }
    }
  }

  .operate-btn {
    .button {
      margin-top: 0;
    }

    .button + .button {
      margin-left: 20px;
    }
  }

  .phone {
    .avatar-wrap {
      img {
        max-width: 92%;
        max-height: 100%;
      }
    }
  }
</style>
