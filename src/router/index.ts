import { getCurrentUser } from '@/firebase/services/auth.service';
import { useStore } from '@/stores/global';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useNProgress } from '@/hooks/useNProgress';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

const { start, done } = useNProgress();

router.beforeEach(async (to, from, next) => {
  start();
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
  done();
  document.title = to.meta.title ? `${to.meta.title} | SSU` : 'SSU';
});

export default router;
