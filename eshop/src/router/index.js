import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// push
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err);
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      require_login: false
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue'),
    meta: {
      require_login: false
    }
  },
  {
    path: '/order/:orderId',
    name: 'OrderDetail',
    component: () => import('../views/OrderDetail.vue'),
    meta: {
      require_login: true
    }
  },
  {
    path: '/search/:search/:page?',
    name: 'Search',
    component: () => import('../views/Search.vue'),
    meta: {
      require_login: false
    }
  },
  {
    // path: '/product/list/:tagId/:categoryId/:page/:sort/:breadCrumbPage',
    path: '/products/:tagId/:categoryId/:page/:sort',
    name: 'ProductList',
    component: () => import('../views/ProductList.vue'),
    meta: {
      require_login: false
    }
  },
  {
    path: '/product/:productId',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue'),
    meta: {
      require_login: false
    }
  },
  {
    path: '/addCartSuccess/:productId/:count',
    name: 'addCartSuccess',
    component: () => import('../views/addCartSuccess.vue'),
    meta: {
      require_login: false
    }
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: () => import('../views/OrderList.vue'),
    meta: {
      require_login: true
    }
  },
  {
    path: '/wishlist',
    name: 'WishList',
    component: () => import('../views/WishList.vue'),
    meta: {
      require_login: false
    }
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue'),
    meta: {
      require_login: true
    }
  },
  {
    path: '/articles/:tagId/:page',
    name: 'ArticleList',
    component: () => import('../views/ArticleList.vue'),
    meta: {
      require_login: false
    }
  },
  {
    path: '/article/:articleId',
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetail.vue'),
    meta: {
      require_login: false
    }
  },
  {
    path: '/article/create-update/:articleId',
    name: 'ArticleCreateUpdate',
    component: () => import('../views/ArticleCreateUpdate.vue'),
    meta: {
      require_login: false
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue'),
    meta: {
      require_login: false
    }
  },
  {
    path: '/api/url',
    name: 'ApiUrl',
    component: () => import('../views/ApiUrl.vue'),
    meta: {
      require_login: false
    }
  },
  {
    path: '*',
    name: 'Page404',
    component: () => import('../views/Page404.vue'),
    meta: {
      require_login: false
    }
  }
];

const router = new VueRouter({
  // mode: 'history',
  routes
});

export default router;
