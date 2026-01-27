<script setup lang="ts">
import TopBar from './components/TopBar.vue';
import SideBar from './components/SideBar.vue';
</script>

<template>
  <div id="manage-layout" class="flex">
    <SideBar />
    <main id="manage-main" class="w-full transition-all h-dvh">
      <TopBar />
      <div class="bg-slate-200 h-[calc(100dvh-3.5rem)]">
        <ElScrollbar>
          <div class="p-3"><RouterView /></div>
        </ElScrollbar>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss"></style>
