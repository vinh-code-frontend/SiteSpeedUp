<script setup lang="ts">
import { useValidator } from '@/hooks/useValidator';
import { useStore } from '@/stores/global';
import { isValidUrl, pingSite } from '@/utils/sharepoint';
import { Check } from '@element-plus/icons-vue';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import { computed, ref, watch } from 'vue';
import type { ISiteForm } from '../types';

const emits = defineEmits<{
  toggleStep: [value: boolean];
}>();

const store = useStore();
const tenants = computed(() => store.tenants);

const model = defineModel<ISiteForm>({ required: true });

const { required, trimRequired } = useValidator();
const formRef = ref<FormInstance>();
const isPingDisable = ref(true);
const isSiteValid = ref(false);
const loading = ref(false);

const rules: FormRules = {
  tenantId: required(),
  site: [
    required(),
    trimRequired(),
    {
      validator(_, value: string, callback) {
        if (typeof value !== 'string') {
          isPingDisable.value = true;
          return callback('Invalid Url!');
        }

        if (!value.startsWith('https://')) {
          isPingDisable.value = true;
          value = `https://${value}`;
        }
        const _isValidUrl = isValidUrl(value);
        if (!_isValidUrl) {
          isPingDisable.value = true;
          return callback('Invalid Url!');
        }
        const tenant = tenants.value.find((item) => item.id === model.value?.tenantId);
        if (!value.includes(`${tenant?.title}.sharepoint.com`)) {
          isPingDisable.value = true;
          return callback("Site doesn't belong to selected tenant!");
        }
        isPingDisable.value = false;
        callback();
      }
    }
  ]
};

const validate = () => formRef.value?.validate();

const handlePing = async () => {
  if (isPingDisable.value) {
    return;
  }
  loading.value = true;
  isSiteValid.value = await pingSite(model.value!.site);
  if (!isSiteValid.value) {
    ElNotification({
      title: 'Error',
      message: "This site doesn'n exist!",
      type: 'error'
    });
  }
  loading.value = false;
};

watch(
  () => isSiteValid.value,
  () => {
    emits('toggleStep', isSiteValid.value);
  }
);

defineExpose({
  validate
});
</script>

<template>
  <ElForm ref="formRef" :model="model" :rules="rules" require-asterisk-position="right" label-position="top">
    <ElFormItem prop="tenant" label="Select tenant">
      <ElSelect v-model="model.tenantId" size="large" class="max-w-52" placeholder="Select your tenant" clearable>
        <ElOption v-for="item in tenants" :key="item.id" :label="item.title" :value="item.id!" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem v-if="model.tenantId" prop="site" label="Site">
      <div class="flex w-full gap-2">
        <ElInput v-model="model.site" size="large" class="flex-1" placeholder="Enter your site..." @input="isSiteValid = false"></ElInput>
        <ElButton :type="isSiteValid ? 'success' : 'danger'" size="large" :disabled="isPingDisable || loading || isSiteValid" :loading="loading" @click="handlePing">
          <ElIcon v-if="isSiteValid"><Check /></ElIcon>
          <span v-else>Ping</span>
        </ElButton>
      </div>
      <div class="italic text-xs">Before go to next step, please ping your entered site to make sure your site exists.</div>
    </ElFormItem>
  </ElForm>
</template>

<style scoped lang="scss"></style>
