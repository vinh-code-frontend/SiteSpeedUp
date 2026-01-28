<script setup lang="ts">
import TopBar from './components/TopBar.vue';
import SideBar from './components/SideBar.vue';
</script>

<template>
  <div id="manage-layout" class="flex">
    <SideBar class="hidden sm:block" />
    <main id="manage-main" class="w-full transition-all h-dvh">
      <TopBar />
      <div class="h-[calc(100dvh-3.5rem)]">
        <ElScrollbar>
          <RouterView class="p-3 min-h-[calc(100dvh-3.5rem)]" />
        </ElScrollbar>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss"></style>
