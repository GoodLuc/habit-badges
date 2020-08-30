module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/scss/_variables.scss";',
        prependData: '@import "@/scss/_fonts.scss";',
      },
    }
  }
};