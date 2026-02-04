<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SiteForm from './SiteForm.vue';
import { useStore } from '@/stores/global';
import { useLoading } from '@/hooks/useLoading';
import { Refresh } from '@element-plus/icons-vue';
// import api from '@/axios/api';

const siteFormRef = ref<InstanceType<typeof SiteForm>>();
const tableData: any[] = [];
const store = useStore();
const { loading, execute } = useLoading();

// api.post(`/get-site-tenant`, {
//   s: 'sss'
// });

onMounted(() => execute(store.getTenants()));
</script>

<template>
  <div v-loading="loading" class="p-3">
    <div class="flex justify-between gap-2 items-center">
      <span>Total Sites: {{ tableData.length }}</span>
      <div>
        <el-button class="w-9" :icon="Refresh" @click="execute(store.getTenants())"></el-button>
        <el-button plain size="default" type="primary" @click="siteFormRef?.openForm()">Add Site</el-button>
      </div>
    </div>
    <div class="max-w-full">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="Date" prop="date" width="180" />
        <el-table-column label="Name" prop="name" width="180" />
        <el-table-column label="Address" prop="address" />
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
