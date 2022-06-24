

export default{
  namespaced: true,

  state:{
    products: []
  },
  mutations:{
     init(state, productCatalog){
       state.products = productCatalog;
     }
  },
  actions: {
    init(context) {

      context.commit("loading/show", '正在载入数据，请稍候……', {root:true});

      shoppingApi.getProductCatalog(
        // 成功操作
        (productCatalogFromServer) => {
          context.commit("init", productCatalogFromServer);
          context.commit("loading/hide", null, {root:true});
        },
        // 失败操作
        () => {
          context.commit("loading/hide", '载入数据失败，请稍后再试', {root:true});
        }
      );
    } 
  }
};