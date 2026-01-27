<script lang="ts" setup>
import { ref } from 'vue';
import { Monitor, Brush } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';

const isCollapse = ref(false);

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const route = useRoute();
</script>

<template>
  <div class="relative border-r border-gray-300 w-52 flex-shrink-0">
    <div class="text-3xl font-bold px-[20px] py-1 italic h-14 flex justify-center">
      <img src="../../../assets/ssu.png" />
    </div>
    <div class="h-[calc(100dvh-3.5rem)]">
      <ElScrollbar>
        <ElMenu
          :default-active="route.path"
          class="w-[var(--sidebar-width)] !border-0"
          :collapse="isCollapse"
          router
          @open="handleOpen"
          @close="handleClose"
        >
          <ElMenuItem index="/site">
            <ElIcon size="14" class="!mr-2"><Monitor /></ElIcon>
            <template #title>{{ 'Site Management' }}</template>
          </ElMenuItem>
          <ElMenuItem index="/explorer">
            <ElIcon size="14" class="!mr-2"><Brush /></ElIcon>
            <template #title>{{ 'API Explorer' }}</template>
          </ElMenuItem>
        </ElMenu>
      </ElScrollbar>
    </div>
  </div>
</template>

<style></style>
