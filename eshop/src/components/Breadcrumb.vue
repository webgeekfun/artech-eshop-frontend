<template>
  <nav aria-label="breadcrumb" class="breadcrumbs-custom">
    <div class="container container-sm container-lg container-xs">
      <ol class="breadcrumb">
        <li
          :class="['breadcrumb-item', shopNameCom ? 'cursor' : '']"
          @click="goProductListHandler"
        >
          {{ pageName }}
        </li>
        <li v-if="shopNameCom" class="breadcrumb-item" aria-current="page">
          {{ shopNameCom }}
        </li>
      </ol>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'Breadcrumb',
    props: {
      pageName: {
        defalut: '',
        type: String
      },
      shopName: {
        default: '',
        type: String
      }
    },
    computed: {
      shopNameCom() {
        if (this.shopName) {
          document.title = 'Geek Fun | ' + this.pageName + '/' + this.shopName;
        } else if (this.pageName) {
          document.title = 'Geek Fun | ' + this.pageName;
        }

        return this.shopName;
      }
    },
    methods: {
      // 点击面包屑导航进入列表页
      goProductListHandler() {
        if (this.$route.name == 'ProductDetail') {
          this.$router.push({
            name: 'ProductList',
            params: {
              tagId: 0,
              categoryId: this.$store.state.selectMenuCategoryId,
              page: 1,
              sort: 'dateDown'
            }
          });
        }
      }
    }
  };
</script>
