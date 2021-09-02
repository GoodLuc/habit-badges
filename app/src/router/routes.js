
const routes = [
  {
    path: '/',
    meta: { requiresAuth: true },
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
  },
  {
    path: '/monthly',
    meta: { requiresAuth: true },
    name: 'Monthly',
    component: () => import('../views/Monthly.vue'),
  },
  {
    path: '/habits',
    meta: { requiresAuth: true },
    name: 'Habits',
    component: () => import('../views/Habits.vue'),
  },
  {
    path: '/rewards',
    meta: { requiresAuth: true },
    name: 'Rewards',
    component: () => import('../views/Rewards.vue'),
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


export default routes