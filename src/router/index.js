import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'

const routes = [
    {
      path: '/', name: 'home', component: Home, 
      meta: { requireAuth: true }
    },
    {
      path: '/about', name: 'about', component: () => import('../views/AboutView.vue'), 
      meta: { requireAuth: true }
    },
    {
      path: '/login', name: 'login', component: () => import('../views/LoginView.vue')
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
  if (to.meta.requireAuth && !window.user) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
