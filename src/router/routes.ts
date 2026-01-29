import { Brush, MapLocation, Monitor } from '@element-plus/icons-vue';
import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
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
        path: 'tenant/:title',
        name: 'tenant-detail',
        meta: { title: 'Tenant Detail' },
        component: () => import('@/features/Tenant/TenantDetail.vue')
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
];

export const menu = [
  {
    path: '/tenant',
    name: 'tenant',
    title: 'Tenant Management',
    icon: MapLocation
  },
  {
    path: '/site',
    name: 'site',
    title: 'Site Management',
    icon: Monitor
  },
  {
    path: '/explorer',
    name: 'explorer',
    title: 'API Explorer',
    icon: Brush
  }
];
