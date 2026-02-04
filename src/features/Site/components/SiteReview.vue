<script setup lang="ts">
import { computed } from 'vue';
import type { ISiteForm } from '../types';
import { useStore } from '@/stores/global';

const model = defineModel<ISiteForm>({ required: true });
const store = useStore();
const tenant = computed(() => store.tenants.find((item) => model.value.tenantFBId === item.id));
</script>

<template>
  <el-descriptions border class="mt-3" :column="1">
    <el-descriptions-item label="Tenant">
      {{ tenant?.title }}
    </el-descriptions-item>
    <el-descriptions-item label="Site">
      {{ model?.site }}
    </el-descriptions-item>
    <el-descriptions-item label="Client ID">
      {{ model.clientId }}
    </el-descriptions-item>
    <el-descriptions-item label="Client Secret">
      {{ model.clientSecret }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<style scoped lang="scss">
:deep(.el-descriptions__cell.el-descriptions__content) {
  word-break: break-word;
}
</style>
