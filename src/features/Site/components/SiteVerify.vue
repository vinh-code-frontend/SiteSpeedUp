<script setup lang="ts">
import { useValidator } from '@/hooks/useValidator';
import { useStore } from '@/stores/global';
import { isValidUrl, pingSite } from '@/utils/sharepoint';
import { Check, MagicStick } from '@element-plus/icons-vue';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import { computed, ref, watch } from 'vue';
import type { ISiteForm } from '../types';

const emits = defineEmits<{
  toggleStep: [value: boolean];
}>();

const store = useStore();
const tenants = computed(() => store.tenants);

const model = defineModel<ISiteForm>('modelValue', { required: true });
const isSiteValid = defineModel<boolean>('isSiteValid', { required: true });

const { required, trimRequired } = useValidator();
const formRef = ref<FormInstance>();
const isPingDisable = ref(true);
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
        value = value.trim();
        if (!value.startsWith('https://')) {
          isPingDisable.value = true;
          value = `https://${value}`;
        }
        const _isValidUrl = isValidUrl(value);
        if (!_isValidUrl) {
          isPingDisable.value = true;
          return callback('Invalid Url!');
        }
        if (!value.includes('/sites/')) {
          return callback('Please enter a site');
        }
        const tenant = tenants.value.find((item) => item.id === model.value?.tenantFBId);
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

const handleVerify = async () => {
  if (isPingDisable.value) {
    return;
  }
  loading.value = true;
  const ping = await pingSite(model.value!.site);
  isSiteValid.value = ping;
  if (!ping) {
    ElNotification({
      title: 'Error',
      message: "This site doesn'n exist!",
      type: 'error',
      duration: 3000
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
      <ElSelect v-model="model.tenantFBId" size="large" class="max-w-52" placeholder="Select your tenant" clearable>
        <ElOption v-for="item in tenants" :key="item.id" :label="item.title" :value="item.id!" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem v-if="model.tenantFBId" prop="site" label="Site">
      <div class="flex w-full gap-2">
        <ElInput v-model="model.site" size="large" class="flex-1" placeholder="Enter your site..." @input="isSiteValid = false"></ElInput>
        <ElButton :type="isSiteValid ? 'success' : 'danger'" size="large" :disabled="isPingDisable || loading || isSiteValid" :loading="loading" @click="handleVerify">
          <ElIcon class="font-bold !text-[20px]">
            <Check v-if="isSiteValid" />
            <MagicStick v-else />
          </ElIcon>
        </ElButton>
      </div>
      <div class="italic text-xs">Before go to next step, please verify your entered site to make sure your site exists.</div>
    </ElFormItem>
  </ElForm>
</template>

<style scoped lang="scss"></style>
