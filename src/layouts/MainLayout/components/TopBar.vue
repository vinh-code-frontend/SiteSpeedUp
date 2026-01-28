<script setup lang="ts">
import { useStore } from '@/stores/global';
import { UserFilled, SwitchButton } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { logOut } from '@/firebase/services/auth.service';

const store = useStore();
const loginUser = computed(() => store.loginUser);
const router = useRouter();
const route = useRoute();

const onLogout = async () => {
  try {
    await logOut();
    ElMessage.success('Logged out successfully');
    // Optionally, update store or redirect
    router.push('/auth/login');
  } catch {
    ElMessage.error('Logout failed');
  }
};
</script>

<template>
  <div id="topbar" class="flex gap-2 justify-between items-center h-14 shadow-md px-2">
    <div class="text-xs font-bold">
      <ElBreadcrumb>
        <ElBreadcrumbItem>{{ route?.meta?.title }}</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="flex items-center gap-2">
      <el-button type="default" circle @click="onLogout" :title="'Logout'">
        <el-icon><SwitchButton /></el-icon>
      </el-button>
      {{ loginUser?.displayName ?? loginUser?.email }}
      <ElAvatar :size="40">
        <ElIcon><UserFilled /></ElIcon>
      </ElAvatar>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
