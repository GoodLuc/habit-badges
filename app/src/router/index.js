import Vue from 'vue'
import VueRouter from 'vue-router'
//import PostService from '../PostService'
import authHeader from '../_helpers/auth-header'

import routes from './routes'

Vue.use(VueRouter)

/*let newUser
async function makeUser() {
  newUser = await PostService.makeUser({email: 'luc@e.com', name: 'Luke', password: 'asd123'})
  if (newUser) {
    return true
  } else {
    return false
  }
}*/

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
  
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    let user = authHeader()
    console.log(to)
    console.log('requires auth')

    if (user) {
      console.log('user logged:')
      console.log(user)
      next()
    } else {
      next('login')
      /*if (makeUser()) {
        console.log('user created')
        console.log (user)
      }*/
    }
  } else {
    next()
  }

})

export default Router

