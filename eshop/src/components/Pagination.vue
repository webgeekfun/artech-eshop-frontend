<template>
  <section class="section-sm">
    <nav>
      <ul class="pagination justify-content-center">
        <li
          class="page-item"
          @click="page != _ && pageClick(_)"
          v-for="_ in pages"
          :key="_"
        >
          <a :class="[{ active: page == _ }, 'page-link']">{{ _ }}</a>
        </li>
        <li
          class="page-item"
          v-if="totalPage > 5 && page < totalPage"
          @click="pageClick(page + 1)"
        >
          <a class="bi-arrow-right"></a>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script>
  export default {
    name: 'Pagination',
    props: {
      page: {
        default: 1
      },
      totalPage: {
        default: 1
      }
    },
    watch: {
      page() {
        return this.page;
      }
    },
    methods: {
      // 点击分页
      pageClick(page) {
        this.$emit('page-handler', page);
      }
    },
    computed: {
      pages() {
        return this.$paging(this.totalPage, 2, this.page);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .page-link {
    padding: 0;
    width: 50px;
    height: 50px;
    font-size: 12px;
    line-height: 50px;
    font-weight: 300;
    background-color: #f8f8f8;
    border: 1px solid #f8f8f8;
    color: #888;
    text-align: center;
    transition: 0.4s;
    border-radius: 4px;

    &.active {
      background: #fff;
      border-color: #ececee;
    }

    &:focus {
      box-shadow: none;
    }
  }

  .page-item {
    line-height: 50px;

    a {
      cursor: pointer;
    }

    &:last-child {
      margin-left: 7px;
    }

    &:not(:first-child) .page-link {
      margin-left: 7px;
    }
  }

  .page-item:last-child .page-link {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
