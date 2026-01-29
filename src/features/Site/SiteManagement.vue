<script setup lang="ts">
import { ref } from 'vue';
import SiteForm from './SiteForm.vue';

const siteFormRef = ref<InstanceType<typeof SiteForm>>();
const tableData: any[] = [];
</script>

<template>
  <div>
    <div class="flex justify-between gap-2 items-center">
      <span>Total Sites: {{ tableData.length }}</span>
      <ElButton type="primary" size="default" plain @click="siteFormRef?.openForm()">Add Site</ElButton>
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
