import Dashboard from '../views/Dashboard.vue'
import Habits from '../views/Habits.vue'
import Monthly from '../views/Monthly.vue'

const routes = [
  {
    path: '/',
    meta: { requiresAuth: true },
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/monthly',
    meta: { requiresAuth: true },
    name: 'Monthly',
    component: Monthly
  },
  {
    path: '/habits',
    meta: { requiresAuth: true },
    name: 'Habits',
    component: Habits
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/intro',
    name: 'Intro',
    component: () => import('../views/Intro')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('../pages/Error404.vue')
  })
}

export default routes