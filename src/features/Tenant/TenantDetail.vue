<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getByTitle } from '@/firebase/services/firestore.service';
import type { ITenant } from './model';
import { formatTenant } from '@/utils/format';

const route = useRoute();
const title = computed(() => route.params.title as string);

const loading = ref(false);
const expand = ref('1');
const tenant = ref<ITenant | null>(null);

onMounted(async () => {
  loading.value = true;
  try {
    const res = await getByTitle('tenant', title.value);

    tenant.value = formatTenant(res);
  } catch (err) {
    console.error(err);
    ElMessage.error('Failed to load tenant');
  } finally {
    loading.value = false;
  }
});
</script>
<template>
  <div v-loading="loading" class="tenant-detail p-4">
    <template v-if="tenant">
      <h2 class="text-xl font-bold mb-4 text-primary underline">{{ title }}</h2>
      <ElCollapse v-model="expand" expand-icon-position="left">
        <ElCollapseItem title="Tenant Info" name="1">
          <ElDescriptions v-if="tenant" :column="1" border size="default">
            <ElDescriptionsItem label="Title"> {{ tenant.title }} </ElDescriptionsItem>
            <ElDescriptionsItem label="Added by"> {{ tenant.userDisplayName }} </ElDescriptionsItem>
            <ElDescriptionsItem label="Created At"> {{ tenant.createdAt }} </ElDescriptionsItem>
            <ElDescriptionsItem label="Type">
              <ElTag :type="tenant.isPrivate ? 'warning' : 'success'"> {{ tenant.isPrivate ? 'Private' : 'Public' }} </ElTag>
            </ElDescriptionsItem>
          </ElDescriptions>
        </ElCollapseItem>
      </ElCollapse>
    </template>
    <ElEmpty v-else description="Tenant not found or may have been deleted" />
  </div>
</template>
<style lang="scss">
.tenant-detail {
  .el-descriptions__label {
    width: 210px;
  }
  .el-collapse-item {
    border-bottom: 0 !important;
  }
  .el-collapse-item__header {
    border-right: 1px solid var(--el-collapse-border-color);
    border-left: 1px solid var(--el-collapse-border-color);
    padding-inline: 0.75rem;
  }

  .el-collapse-item__content {
    border: 0;
    padding-bottom: 0;
  }
  @media screen and (max-width: 640px) {
    .el-descriptions__label {
      width: 180px;
    }
  }

  @media screen and (max-width: 480px) {
    .el-descriptions__label {
      width: 120px;
    }
  }
}
</style>
