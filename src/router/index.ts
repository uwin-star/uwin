import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // GitHub Pages에는 SPA 경로 rewrite가 없으므로 해시 라우터를 사용한다.
  // 예: https://<user>.github.io/<repo>/#/about
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/notices',
      name: 'notices',
      component: () => import('../views/NoticesView.vue'),
    },
    {
      path: '/recruit',
      name: 'recruit',
      component: () => import('../views/RecruitView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0, left: 0 },
})

router.beforeEach((to) => {
  const { isAuthenticated, canManageMembers } = useAuth()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.requiresAdmin && !canManageMembers.value) {
    return { name: 'account' }
  }

  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'account' }
  }

  return true
})

export default router
