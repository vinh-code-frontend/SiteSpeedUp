import { getCurrentUser } from '@/firebase/services/auth.service';
import { useGlobalStore } from '@/stores/global';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      meta: { requiresAuth: true },
      component: () => import('@/layouts/MainLayout/MainLayout.vue')
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
          component: () => import('@/features/auth/LoginView.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/features/auth/RegisterView.vue')
        }
      ]
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser();
  const store = useGlobalStore();

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

export default router;
