<template>
  <section class="section-sm">
    <div class="container container-sm container-lg container-xs">
      <h4 :class="['mb10', textOffset]">{{ textInfo }}</h4>
      <div v-if="list.length > 0" class="row">
        <vue-product
          class="col-lg-3 col-6"
          v-for="_ in relatedProductsList"
          :key="_.skuId"
          :productEle="_"
        ></vue-product>
      </div>
    </div>
  </section>
</template>

<script>
  import VueProduct from './Product';
  export default {
    name: 'RelatedProducts',
    props: {
      textOffset: {
        //标题位置
        default: 'text-center',
        type: String
      },
      textInfo: {
        default: '为你推荐',
        type: String
      },
      productId: Number
    },
    components: {
      VueProduct
    },
    data() {
      return {
        relatedProductsList: []
      };
    },
    watch: {
      productId() {
        this.relatedProducts(this.productId);
      },
      $route(to, from) {
        if (to.params.productId != from.params.productId) {
          //监听路由变化
          this.relatedProductsList = [];
          // 相关产品
          this.relatedProducts(to.params.productId);
        }
      }
    },
    mounted() {
      // 相关产品列表
      if (this.productId) this.relatedProducts(this.productId);
    },
    computed: {
      list() {
        return this.relatedProductsList;
      }
    },
    methods: {
      // 初始化相关产品列表
      relatedProducts(id) {
        const _this = this;
        this.$ajax.get('/product/' + id + '/related?count=4', '', 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            const relatedProductsList = response.data.products;

            relatedProductsList.forEach(element => {
              // 为了product组件使用
              element.isGrid = true;
            });

            _this.relatedProductsList = relatedProductsList;
          } else {
            console.log(response.message);
          }
        });
      }
    }
  };
</script>
