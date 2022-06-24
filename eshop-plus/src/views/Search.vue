<template>
  <div class="search-page">
    <!-- 面包屑导航 -->
    <vue-breadcrumb :page-name="'与<' + search + '>相关的产品'" />

    <section class="section-md">
      <div class="container container-sm container-lg container-xs">
        <div class="row" v-if="!isShowEmptyList">
          <!-- 加载中~ -->
          <vue-loading :isLoading="isLoading" />

          <vue-product
            class="col-lg-3 col-md-3 col-6"
            v-for="_ in productList"
            :key="_.productId"
            :productEle="_"
          />
        </div>
        <div v-if="isShowEmptyList && !isLoading" class="row">
          未搜索到符合条件的相关产品~
        </div>

        <vue-pagination
          class="mt50"
          v-if="!isShowEmptyList"
          :page="page"
          :totalPage="totalPage"
          @page-handler="pageInit"
        />
      </div>
    </section>
  </div>
</template>
<script>
  import VueProduct from '../components/Product';
  import VuePagination from '../components/Pagination';
  export default {
    name: 'Search',
    components: {
      VueProduct,
      VuePagination
    },
    data() {
      return {
        search: '',
        productList: [],
        pageSize: 12, //每页显示数量
        page: 1, //当前页码
        totalPage: 1, //总页数,
        isShowEmptyList: false,
        isLoading: true // 是否显示加载中
      };
    },
    mounted() {
      console.log(this.$route);
      this.init(this.$route);
    },
    watch: {
      $route(to) {
        this.init(to);
      }
    },
    methods: {
      // 点击分页
      pageInit(page) {
        this.page = page;
        this.$router.push({
          name: 'Search',
          params: {
            search: this.search,
            page: this.page
          }
        });
      },
      init(router) {
        this.search = router.params.search;
        this.page = Number(router.params.page || '1');

        const apiParams = {
          search: this.search,
          page: this.page,
          pageSize: this.pageSize
        };

        this.getProducts(apiParams);
      },
      getProducts(params) {
        const _this = this;

        this.productList = [];
        this.isLoading = true;

        this.$ajax.get('/product/list', params, 2, '', response => {
          if (response.status >= 200 && response.status < 300) {
            // 回到顶部
            window.scrollTo(0, 0);

            const productList = response.data.products;

            if (productList.length < 1) {
              _this.isShowEmptyList = true;
            } else {
              _this.isShowEmptyList = false;
            }

            // 为了product组件使用
            productList.forEach(ele => {
              ele.isGrid = true;
            });

            _this.productList = productList;
            _this.isLoading = false;

            _this.totalPage = response.data.pagination.pageCount;
            _this.page = response.data.pagination.pageNumber;
          } else {
            console.log(response.message);
          }
        });
      }
    }
  };
</script>
