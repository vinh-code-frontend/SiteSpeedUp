<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage, type FormRules } from 'element-plus';
import { add, get } from '@/firebase/services/firestore.service';
import type { ITenant } from './model';
import { serverTimestamp } from 'firebase/firestore';
import { useStore } from '@/stores/global';
import { pingTenant } from '@/utils/sharepoint';

const emit = defineEmits<{
  refresh: [];
}>();
const store = useStore();
const loginUser = computed(() => store.loginUser);

const visible = ref(false);
const formRef = ref();
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
        const exist = await get<ITenant>('tenant', {
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
    const isValid = await formRef.value.validate();

    if (!isValid) {
      return;
    }
    loading.value = true;

    const tenantConfig = await pingTenant(form.value.title);
    if (!tenantConfig) {
      return;
    }
    // console.log(tenantConfig);

    const data = {
      title: form.value.title.trim().toLowerCase(),
      userId: loginUser.value?.uid || '',
      tenantId: tenantConfig.tenantId,
      clientId: tenantConfig.clientId,
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
  } catch (error) {
    console.log(error);
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
  <ElDialog v-model="visible" title="Add Tenant" class="max-w-md !w-[96%]" destroy-on-close @close="handleClose">
    <ElForm ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right" label-width="100px">
      <ElFormItem label="Title" prop="title">
        <ElInput v-model="form.title" placeholder="Enter tenant title" />
      </ElFormItem>
      <ElFormItem label="Private" prop="isPrivate">
        <el-switch v-model="form.isPrivate" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="flex justify-center gap-2">
        <ElButton type="primary" :loading="loading" @click="handleSubmit">Save</ElButton>
        <ElButton class="!ml-0" @click="handleClose">Cancel</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped></style>
