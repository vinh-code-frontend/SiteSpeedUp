<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import TenantForm from './TenantForm.vue';
import { useStore } from '@/stores/global';
import { Delete, Refresh } from '@element-plus/icons-vue';
import { remove } from '@/firebase/services/firestore.service';
import { useLoading } from '@/hooks/useLoading';

const tenantFormRef = ref<InstanceType<typeof TenantForm>>();
const store = useStore();
const loginUser = computed(() => store.loginUser);
const tenants = computed(() => store.tenants);
const router = useRouter();

const { loading, execute } = useLoading();

const goToTenantDetail = (title: string) => {
  router.push({ name: 'tenant-detail', params: { title } });
};

const deleteTenant = async (tenantId?: string) => {
  if (tenantId) {
    await remove('tenant', tenantId);
    await store.getTenants();
  }
};

onMounted(() => {
  execute(store.getTenants);
});
</script>

<template>
  <div v-loading="loading" class="p-3">
    <div class="flex justify-between gap-2 items-center">
      <span>Total tenants: {{ tenants.length }}</span>
      <div class="flex items-center">
        <el-button class="w-9" :icon="Refresh" @click="execute(store.getTenants)"></el-button>
        <el-button plain size="default" type="primary" @click="tenantFormRef?.openForm()">Add Tenant</el-button>
      </div>
    </div>
    <ElEmpty v-if="!tenants.length" description="There are no available tenants" />
    <div v-if="tenants.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
      <div v-for="item in tenants" :key="item.id" class="relative">
        <el-card class="cursor-pointer" @click="goToTenantDetail(item.title)">
          <div class="flex items-center gap-2 justify-between pb-4">
            <div class="font-bold text-base">{{ item.title }}</div>
            <el-tag :type="item.isPrivate ? 'warning' : 'success'">{{ item.isPrivate ? 'Private' : 'Public' }}</el-tag>
          </div>
          <div class="block text-xs pb-1">Added by: {{ item.userDisplayName }}</div>
          <div class="italic block text-xs">Created At: {{ item.createdAt }}</div>
        </el-card>
        <el-button
          v-if="item.userId === loginUser?.uid && !loading"
          circle
          class="absolute z-[1] right-[-0.25rem] top-[-0.25rem]"
          :icon="Delete"
          size="small"
          type="danger"
          @click="execute(() => deleteTenant(item.id))"
        ></el-button>
      </div>
    </div>
  </div>
  <TenantForm ref="tenantFormRef" @refresh="execute(store.getTenants)" />
</template>

<style scoped lang="scss"></style>
