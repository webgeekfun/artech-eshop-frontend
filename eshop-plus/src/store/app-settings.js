export default {
  route: {
    mug: {
      name: 'ProductList',
      params: {
        tagId: 0,
        categoryId: 1,
        page: 1,
        sort: 'dateDown'
        // breadCrumbPage: '马克杯'
      }
    },
    beer: {
      name: 'ProductList',
      params: {
        tagId: 0,
        categoryId: 3,
        page: 1,
        sort: 'dateDown'
        // breadCrumbPage: '啤酒杯'
      }
    },
    enamel: {
      name: 'ProductList',
      params: {
        tagId: 0,
        categoryId: 2,
        page: 1,
        sort: 'dateDown'
        // breadCrumbPage: '搪瓷杯'
      }
    }
  }
};
