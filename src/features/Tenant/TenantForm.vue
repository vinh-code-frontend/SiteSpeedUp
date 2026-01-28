<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage, type FormRules } from 'element-plus';
import { add, get } from '@/firebase/services/firestore.service';
import type { ITenant } from './model';
import { serverTimestamp } from 'firebase/firestore';
import { useStore } from '@/stores/global';
import { pingTenant } from '@/utils/sharepoint';

const emit = defineEmits(['update:modelValue', 'created']);
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
        if (!value) {
          return callback();
        }
        const exist = await get<ITenant>('tenant', {
          wheres: [{ field: 'title', op: '==', value }],
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

const openForm = (item?: ITenant) => {
  visible.value = true;
};

const handleClose = () => {
  emit('update:modelValue', false);
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

    const isTenantExisting = await pingTenant(form.value.title);
    if (!isTenantExisting) {
      return;
    }

    const data = {
      title: form.value.title!,
      userId: loginUser.value?.uid || '',
      userDisplayName: loginUser.value?.displayName || '',
      isPrivate: !!form.value.isPrivate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await add('tenant', data);
    ElMessage.success('Tenant created successfully');
    emit('created');
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
  <ElDialog v-model="visible" title="Add Tenant" class="max-w-md !w-[96%]" @close="handleClose">
    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
      label-width="100px"
    >
      <ElFormItem label="Title" prop="title">
        <ElInput v-model="form.title" placeholder="Enter tenant title" />
      </ElFormItem>
      <ElFormItem label="Private" prop="isPrivate">
        <el-switch v-model="form.isPrivate" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="flex justify-center gap-2">
        <ElButton type="primary" :loading="loading" @click="handleSubmit">Add Tenant</ElButton>
        <ElButton class="!ml-0" @click="handleClose">Cancel</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped></style>
