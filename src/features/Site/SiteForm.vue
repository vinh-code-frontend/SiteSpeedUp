<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { add, get } from '@/firebase/services/firestore.service';
import { serverTimestamp } from 'firebase/firestore';
import { useStore } from '@/stores/global';
import { pingTenant } from '@/utils/sharepoint';
import { useWindowSize } from '@vueuse/core';

const emit = defineEmits<{
  refresh: [];
}>();
const store = useStore();
const loginUser = computed(() => store.loginUser);

const visible = ref(true);
const active = ref(0);
const { width, height } = useWindowSize();

const isMobile = computed(() => width.value < 768);
const formRef = ref<FormInstance>();
const form = ref({
  title: '',
  isPrivate: false
});
const loading = ref(false);

const rules: FormRules = {
  title: [
    { required: true, message: 'Title is required' },
    { min: 3, message: 'Title must be at least 3 characters' },
    {
      async asyncValidator(_rule: unknown, value: string, callback) {
        if (!value.trim()) {
          return callback();
        }
        const exist = await get('tenant', {
          wheres: [{ field: 'title', op: '==', value: value.trim().toLowerCase() }],
          limit: 1
        });
        if (exist.length > 0) {
          callback('Tenant name must be unique');
        } else {
          callback();
        }
      }
    }
  ]
};

const openForm = () => {
  form.value = {
    title: '',
    isPrivate: false
  };
  visible.value = true;
};

const handleClose = () => {
  visible.value = false;
};

const handleSubmit = async () => {
  try {
    if (!loginUser.value?.uid || !loginUser.value.displayName) {
      return;
    }
    const isValid = await formRef.value?.validate();

    if (!isValid) {
      return;
    }
    loading.value = true;

    const isTenantExisting = await pingTenant(form.value.title);
    if (!isTenantExisting) {
      return;
    }

    const data = {
      title: form.value.title.trim().toLowerCase(),
      userId: loginUser.value?.uid || '',
      userDisplayName: loginUser.value?.displayName || '',
      isPrivate: !!form.value.isPrivate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await add('tenant', data);
    ElMessage.success('Tenant created successfully');
    emit('refresh');
    handleClose();
    form.value.title = '';
    form.value.isPrivate = false;
  } catch {
    ElMessage.error('Failed to create tenant');
  } finally {
    loading.value = false;
  }
};

defineExpose({
  openForm
});
</script>

<template>
  <ElDialog v-model="visible" title="Add Site" class="site-form-dialog overflow-hidden flex flex-col" :align-center="isMobile" body-class="flex-1" @close="handleClose">
    <div class="flex-1">
      <ElSteps :active="active" finish-status="success" process-status="finish">
        <ElStep title="Step 1" />
        <ElStep title="Step 2" />
        <ElStep title="Step 3" />
      </ElSteps>
      <div style="height: 100%">s</div>
    </div>
    <template #footer>
      <div class="flex justify-center gap-2">
        <ElButton type="primary" :loading="loading" @click="handleSubmit">Save</ElButton>
        <ElButton class="!ml-0" @click="handleClose">Cancel</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="scss">
.site-form-dialog.el-dialog {
  width: 96%;
  height: 800px;
}

@media screen and (max-width: 640px) {
  .site-form-dialog.el-dialog {
    height: 96%;
  }
}
</style>
