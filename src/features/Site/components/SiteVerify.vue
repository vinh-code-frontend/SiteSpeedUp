<script setup lang="ts">
import { useValidator } from '@/hooks/useValidator';
import { useStore } from '@/stores/global';
import { isValidUrl, normalizeSharePointSiteUrl, pingSite } from '@/utils/sharepoint';
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

const { trimRequired, required } = useValidator();
const formRef = ref<FormInstance>();
const isPingDisable = ref(true);
const loading = ref(false);

const rules: FormRules = {
  tenantId: required(),
  site: [
    ...trimRequired(),
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
  const isValid = await pingSite(model.value!.site);
  isSiteValid.value = isValid;
  if (isValid) {
    model.value.site = normalizeSharePointSiteUrl(model.value.site);
  } else {
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
  <el-form ref="formRef" label-position="top" :model="model" require-asterisk-position="right" :rules="rules">
    <el-form-item label="Select tenant" prop="tenant">
      <el-select v-model="model.tenantFBId" class="max-w-52" clearable placeholder="Select your tenant" size="large">
        <el-option v-for="item in tenants" :key="item.id" :label="item.title" :value="item.id!" />
      </el-select>
    </el-form-item>
    <el-form-item v-if="model.tenantFBId" label="Site" prop="site">
      <div class="flex w-full gap-2">
        <el-input v-model="model.site" class="flex-1" placeholder="Enter your site..." size="large" @input="isSiteValid = false"></el-input>
        <el-button
          :disabled="isPingDisable || loading || isSiteValid"
          :loading="loading"
          size="large"
          :type="isSiteValid ? 'success' : 'danger'"
          @click="handleVerify"
        >
          <el-icon class="font-bold !text-[20px]">
            <Check v-if="isSiteValid" />
            <MagicStick v-else />
          </el-icon>
        </el-button>
      </div>
      <div class="italic text-xs">Before go to next step, please verify your entered site to make sure your site exists.</div>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
