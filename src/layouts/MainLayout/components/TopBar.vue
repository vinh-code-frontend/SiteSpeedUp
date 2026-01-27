<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { UserFilled, SwitchButton } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { getAuth, signOut } from 'firebase/auth';

const store = useGlobalStore();
const loginUser = computed(() => store.loginUser);
console.log(loginUser.value);

const onLogout = async () => {
  try {
    await signOut(getAuth());
    ElMessage.success('Logged out successfully');
    // Optionally, update store or redirect
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
