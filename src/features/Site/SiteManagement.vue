<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SiteForm from './SiteForm.vue';
import { useStore } from '@/stores/global';
import { useLoading } from '@/hooks/useLoading';
import { Refresh } from '@element-plus/icons-vue';

const siteFormRef = ref<InstanceType<typeof SiteForm>>();
const tableData: any[] = [];
const store = useStore();
const { loading, execute } = useLoading();

onMounted(() => execute(store.getTenants()));
</script>

<template>
  <div v-loading="loading" class="p-3">
    <div class="flex justify-between gap-2 items-center">
      <span>Total Sites: {{ tableData.length }}</span>
      <div>
        <ElButton :icon="Refresh" class="w-9" @click="execute(store.getTenants())"></ElButton>
        <ElButton type="primary" size="default" plain @click="siteFormRef?.openForm()">Add Site</ElButton>
      </div>
    </div>
    <div class="max-w-full">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </div>
  </div>
  <SiteForm ref="siteFormRef" />
</template>

<style lang="scss">
.el-table__header,
.el-table__body {
  width: 100% !important;
}
</style>
