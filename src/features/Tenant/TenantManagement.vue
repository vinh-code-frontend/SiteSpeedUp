<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import TenantForm from './TenantForm.vue';
import { useStore } from '@/stores/global';

// Giả sử bạn có biến loginUser lấy từ store hoặc context
// Thay thế dòng dưới bằng logic thực tế lấy userId đăng nhập

const tenantFormRef = ref<InstanceType<typeof TenantForm>>();
const loading = ref(true);
const store = useStore();
const tenants = computed(() => store.tenants);
const router = useRouter();
const goToTenantDetail = (title: string) => {
  router.push({ name: 'tenant-detail', params: { title } });
};

const fetchTenants = async () => {
  loading.value = true;
  try {
    await store.getTenants();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchTenants);
</script>

<template>
  <div v-loading="loading">
    <div class="flex justify-between gap-2 items-center">
      <span>Total tenants: {{ tenants.length }}</span>
      <ElButton type="primary" size="default" plain @click="tenantFormRef?.openForm()">Add Tenant</ElButton>
    </div>
    <ElEmpty v-if="!tenants.length" description="There are no available tenants" />
    <div v-if="tenants.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
      <ElCard v-for="item in tenants" :key="item.id" class="cursor-pointer" @click="goToTenantDetail(item.title)">
        <div class="flex items-center gap-2 justify-between pb-4">
          <div class="font-bold text-base">{{ item.title }}</div>
          <ElTag :type="item.isPrivate ? 'warning' : 'success'">{{ item.isPrivate ? 'Private' : 'Public' }}</ElTag>
        </div>
        <div class="block text-xs pb-1">Added by: {{ item.userDisplayName }}</div>
        <div class="italic block text-xs">Created At: {{ item.createdAt }}</div>
      </ElCard>
    </div>
  </div>
  <TenantForm ref="tenantFormRef" @refresh="fetchTenants" />
</template>

<style scoped lang="scss"></style>
