<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { get } from '@/firebase/services/firestore.service';
import type { ITenant } from './model';
import TenantForm from './TenantForm.vue';
import { useStore } from '@/stores/global';

// Giả sử bạn có biến loginUser lấy từ store hoặc context
// Thay thế dòng dưới bằng logic thực tế lấy userId đăng nhập
const loginUser = { id: 'userId' };

const tenants = ref<ITenant[]>([]);
const loading = ref(true);
const showDrawer = ref(false);
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
  <div>
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      "
    >
      <span>Tenant</span>
      <ElButton type="primary" size="default" plain @click="showDrawer = true">Add Tenant</ElButton>
    </div>
    <template v-if="loading">
      <div>Loading...</div>
    </template>
    <template v-else-if="!tenants.length">
      <ElEmpty description="There are no available tenants" />
    </template>
    <template v-else>
      <ul>
        <li v-for="tenant in tenants" :key="tenant.id">
          <strong>{{ tenant.title }}</strong> ({{ tenant.createdAt }})
        </li>
      </ul>
    </template>
    <TenantForm v-model="showDrawer" :user-id="loginUser.id" @created="handleCreated" />
  </div>
</template>

<style scoped lang="scss"></style>
