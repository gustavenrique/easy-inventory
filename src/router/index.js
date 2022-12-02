import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/ProductsView.vue'
import cookies from 'vue-cookies'

const routes = [
    {
      path: '/', alias: ['/home', '/products'], name: 'home', component: Home,
      meta: { requireAuth: true }
    },
    {
      path: '/login', name: 'login', component: () => import('../views/LoginView.vue'),
      meta: { requireNoAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'), 
      meta: { requireAuth: true }
    }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || new Promise(resolve => {
      setTimeout(() => resolve({top: 0, behavior: 'smooth'}), 600)
    })
  }
})

router.beforeEach((to, from) => {
  if (to.meta.requireAuth && !cookies.get('username')) {
    return { path: '/login', query: { redirect: to.fullPath } }
  } else if (to.meta.requireNoAuth && cookies.get('username')) {
    return { path: '/products' }
  }
})

export default router
