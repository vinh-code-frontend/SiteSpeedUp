import { getCurrentUser } from '@/firebase/services/auth.service';
import { useStore } from '@/stores/global';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      meta: { requiresAuth: true },
      component: () => import('@/layouts/MainLayout/MainLayout.vue'),
      redirect: '/tenant',
      children: [
        {
          path: 'tenant',
          name: 'tenant',
          meta: { title: 'Tenant Management' },
          component: () => import('@/features/Tenant/TenantManagement.vue')
        },
        {
          path: 'site',
          name: 'site',
          meta: { title: 'Site Management' },
          component: () => import('@/features/Site/SiteManagement.vue')
        }
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      meta: { guestOnly: true },
      component: () => import('@/layouts/AuthLayout/AuthLayout.vue'),
      redirect: '/auth/login',
      children: [
        {
          path: 'login',
          name: 'login',
          meta: { title: 'Login' },
          component: () => import('@/features/Auth/LoginView.vue')
        },
        {
          path: 'register',
          name: 'register',
          meta: { title: 'Register' },
          component: () => import('@/features/Auth/RegisterView.vue')
        }
      ]
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser();
  const store = useStore();

  store.setLoginUser(user);

  if (to.meta.requiresAuth && !user) {
    next('/auth/login');
    return;
  }

  if (to.meta.guestOnly && user) {
    next('/');
    return;
  }

  next();
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | SSU` : 'SSU';
});

export default router;
