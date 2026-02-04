<script setup lang="ts">
import TopBar from './components/TopBar.vue';
import SideBar from './components/SideBar.vue';
</script>

<template>
  <div id="manage-layout" class="flex">
    <SideBar class="hidden sm:block" />
    <main id="manage-main" class="w-full transition-all h-dvh overflow-hidden">
      <TopBar />
      <div class="w-full h-[calc(100dvh-3.5rem)]">
        <el-scrollbar>
          <div class="min-h-[calc(100dvh-3.5rem)]">
            <router-view />
          </div>
        </el-scrollbar>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss"></style>
