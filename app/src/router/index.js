import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

const Router = new VueRouter({
  //scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,

  // Leave these as is and change from quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: 'history',
  base: process.env.VUE_ROUTER_BASE
})

Router.beforeEach((to, from, next) => {
  console.log('to is', from)

  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    let user = JSON.parse(localStorage.getItem('user'));
		console.log('user is', user)

    if (user === null && to.path !== '/login') {
      Router.push('/login')
    } else {
      next()
    }
  } else {
    next()
  }

})

export default Router

