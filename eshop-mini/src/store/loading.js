export default{
  namespaced: true,
  state:{
    info: '',
    show: false
  },
  mutations:{
    show: (state, info) => {
      state.info = info;
      state.show = true; 
    },
    hide: (state, info) => {
      if(!info)
        state.show = false;
      else {
        state.info = info;
        setTimeout(()=>{
          state.show = false;
        }, 1500);
      }
    },
  }
};
