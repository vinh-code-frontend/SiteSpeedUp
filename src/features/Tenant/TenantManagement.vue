<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { get } from '@/firebase/services/firestore.service';
import type { ITenant } from './model';
import TenantForm from './TenantForm.vue';
import { useStore } from '@/stores/global';

// Giả sử bạn có biến loginUser lấy từ store hoặc context
// Thay thế dòng dưới bằng logic thực tế lấy userId đăng nhập

const tenantFormRef = ref<InstanceType<typeof TenantForm>>();
const tenants = ref<ITenant[]>([]);
const loading = ref(true);
const store = useStore();

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

const handleCreated = () => {
  fetchTenants();
};
</script>

<template>
  <div v-loading="loading">
    <div class="flex justify-between gap-2 items-center">
      <span>Total tenants: {{ tenants.length }}</span>
      <ElButton type="primary" size="default" plain @click="tenantFormRef?.openForm()"
        >Add Tenant</ElButton
      >
    </div>
    <ElEmpty v-if="!tenants.length" description="There are no available tenants" />
    <ElCard v-for="item in tenants" :key="item.id">{{ item.title }}</ElCard>
  </div>
  <TenantForm ref="tenantFormRef" />
</template>

<style scoped lang="scss"></style>
