module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  publicPath: './',
  assetsDir: 'static',
  lintOnSave: true,
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/variables.scss";`
      }
    }
  }
};
