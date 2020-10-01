import Dashboard from '../views/Dashboard.vue'
import Habits from '../views/Habits.vue'

const routes = [
  {
    path: '/',
    meta: { requiresAuth: true },
    name: 'Dashboard',
    component: Dashboard
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