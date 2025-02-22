module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/_variables.scss"; @import "@/scss/_fonts.scss";
        `,
      },
    },
  },
};
