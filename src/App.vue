<script setup lang="ts">
import { reactive } from 'vue';

const cardConfig = reactive({
  shadow: 'hover'
});

const messageConfig = reactive({
  plain: true
});
</script>

<template>
  <ElConfigProvider :card="cardConfig" :message="messageConfig">
    <RouterView />
  </ElConfigProvider>
</template>

<style scoped lang="scss"></style>
