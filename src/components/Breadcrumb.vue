<script setup lang="ts">
import { useRoute } from 'vue-router';
import { menu } from '@/router/routes';
import { computed } from 'vue';

const route = useRoute();

const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean);
  const result: { path?: string; title: string }[] = [];
  if (paths.length) {
    const menuMatched = menu.find((item) => item.name === paths[0]);
    if (menuMatched) {
      result.push({ path: menuMatched.path, title: menuMatched.title });
    }
    if (paths[1]) {
      result.push({ path: route.path, title: paths[1] });
    }
  }
  const _breadcrumb = result.map((item) => {
    if (item.path === route.path) {
      return { title: item.title };
    }
    return item;
  });
  return _breadcrumb;
});
</script>

<template>
  <ElBreadcrumb>
    <ElBreadcrumbItem v-for="(item, index) in breadcrumbs" :to="item.path ? { path: item.path } : {}" :key="index">{{ item.title }}</ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<style scoped lang="scss"></style>
