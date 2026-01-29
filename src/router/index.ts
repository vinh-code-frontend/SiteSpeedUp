import { getCurrentUser } from '@/firebase/services/auth.service';
import { useStore } from '@/stores/global';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
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
