<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { UserFilled, SwitchButton } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { logOut } from '@/firebase/services/auth.service';

const store = useGlobalStore();
const loginUser = computed(() => store.loginUser);
const router = useRouter();
const auth = getAuth();

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
    <div>topbar</div>
    <div class="flex items-center gap-2">
      <el-button type="default" circle @click="onLogout" :title="'Logout'">
        <el-icon><SwitchButton /></el-icon>
      </el-button>
      <ElAvatar :size="40">
        <ElIcon><UserFilled /></ElIcon>
      </ElAvatar>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
