<script lang="ts" setup>
import { ref } from 'vue';
import { Monitor, Brush, MapLocation } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';

const isCollapse = ref(false);

const route = useRoute();

const menu = [
  {
    path: '/tenant',
    title: 'Tenant Management',
    icon: MapLocation
  },
  {
    path: '/site',
    title: 'Site Management',
    icon: Monitor
  },
  {
    path: '/explorer',
    title: 'API Explorer',
    icon: Brush
  }
];
</script>

<template>
  <div class="relative border-r border-gray-300 w-52 flex-shrink-0">
    <div class="text-3xl font-bold px-[20px] py-1 italic h-14 flex">
      <img src="../../../assets/ssu.png" />
    </div>
    <div class="h-[calc(100dvh-3.5rem)]">
      <ElScrollbar>
        <ElMenu
          :default-active="route.path"
          class="w-[var(--sidebar-width)] !border-0"
          :collapse="isCollapse"
          router
        >
          <ElMenuItem v-for="item in menu" :key="item.path" :index="item.path">
            <ElIcon size="14" class="!mr-2"><Component :is="item.icon" /></ElIcon>
            <template #title>{{ item.title }}</template>
          </ElMenuItem>
        </ElMenu>
      </ElScrollbar>
    </div>
  </div>
</template>

<style></style>
