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
        <ElButton :icon="Refresh" class="w-9" @click="execute(store.getTenants)"></ElButton>
        <ElButton type="primary" size="default" plain @click="tenantFormRef?.openForm()">Add Tenant</ElButton>
      </div>
    </div>
    <ElEmpty v-if="!tenants.length" description="There are no available tenants" />
    <div v-if="tenants.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
      <div v-for="item in tenants" :key="item.id" class="relative">
        <ElCard class="cursor-pointer" @click="goToTenantDetail(item.title)">
          <div class="flex items-center gap-2 justify-between pb-4">
            <div class="font-bold text-base">{{ item.title }}</div>
            <ElTag :type="item.isPrivate ? 'warning' : 'success'">{{ item.isPrivate ? 'Private' : 'Public' }}</ElTag>
          </div>
          <div class="block text-xs pb-1">Added by: {{ item.userDisplayName }}</div>
          <div class="italic block text-xs">Created At: {{ item.createdAt }}</div>
        </ElCard>
        <ElButton
          v-if="item.userId === loginUser?.uid && !loading"
          :icon="Delete"
          type="danger"
          circle
          size="small"
          class="absolute z-[1] right-[-0.25rem] top-[-0.25rem]"
          @click="execute(() => deleteTenant(item.id))"
        ></ElButton>
      </div>
    </div>
  </div>
  <TenantForm ref="tenantFormRef" @refresh="execute(store.getTenants)" />
</template>

<style scoped lang="scss"></style>
