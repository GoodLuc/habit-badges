module.exports = {
	css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/scss/_variables.scss"; @import "@/scss/_fonts.scss";
        `
      }
    }
  }
};