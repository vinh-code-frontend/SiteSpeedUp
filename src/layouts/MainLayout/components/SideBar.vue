<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { menu } from '@/router/routes';

const isCollapse = ref(false);

const route = useRoute();
</script>

<template>
  <div class="relative border-r border-gray-300 w-52 flex-shrink-0">
    <div class="text-3xl font-bold px-[20px] py-1 italic h-14 flex">
      <img src="../../../assets/ssu.png" />
    </div>
    <div class="h-[calc(100dvh-3.5rem)]">
      <ElScrollbar>
        <ElMenu :default-active="route.path" class="w-[var(--sidebar-width)] !border-0" :collapse="isCollapse" router>
          <ElMenuItem v-for="item in menu" :key="item.path" :index="item.path">
            <ElIcon size="14" class="!mr-2"><Component :is="item.icon" /></ElIcon>
            <template #title>{{ item.title }}</template>
          </ElMenuItem>
        </ElMenu>
      </ElScrollbar>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-menu-item.is-active) {
  background-color: var(--el-menu-hover-bg-color);
}

:deep(.el-menu-item:not(.is-active)):hover {
  background-color: unset;
  color: var(--el-color-primary);
}
</style>
