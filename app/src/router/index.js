import { createRouter, createWebHistory } from 'vue-router'

import routes from './routes'


const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('to is', from)

  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    let user = JSON.parse(localStorage.getItem('user'));
		console.log('user is', user)

    if (user === null && to.path !== '/intro') {
      router.push('/intro')
    } else {
      next()
    }
  } else {
    next()
  }

})

export default router

