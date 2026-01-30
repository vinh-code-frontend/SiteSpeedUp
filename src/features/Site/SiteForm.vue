<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '@/stores/global';
import { useWindowSize } from '@vueuse/core';
import Step1 from './components/Step1.vue';
import type { ISiteForm } from './types';

const emit = defineEmits<{
  refresh: [];
}>();
const store = useStore();

const visible = ref(true);
const currentStep = ref(0);
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 640);
const isDisableBtn = ref(true);
const model = ref<ISiteForm>({
  tenantId: '',
  site: ''
});

const step1Ref = ref<InstanceType<typeof Step1>>();
const form = ref({
  title: '',
  isPrivate: false
});
const loading = ref(false);

const openForm = () => {
  form.value = {
    title: '',
    isPrivate: false
  };
  currentStep.value = 0;
  visible.value = true;
};

const handleClose = () => {
  visible.value = false;
};

const handleNextStep = async () => {
  if (currentStep.value === 0) {
    const isValid = await step1Ref.value?.validate();
    if (isValid) {
      currentStep.value++;
    }
  }
};

defineExpose({
  openForm
});
</script>

<template>
  <ElDialog
    v-model="visible"
    title="Add Site"
    destroy-on-close
    class="site-form-dialog overflow-hidden flex flex-col"
    :align-center="isMobile"
    body-class="flex-1 overflow-hidden"
    @close="handleClose"
  >
    <div class="flex-1">
      <ElSteps :active="currentStep" class="mb-3" align-center finish-status="success" process-status="finish">
        <ElStep title="Site checking" />
        <ElStep title="Step 2" />
        <ElStep title="Step 3" />
      </ElSteps>
    </div>
    <ElScrollbar>
      <Step1 ref="step1Ref" v-model="model" v-show="currentStep === 0" @toggle-step="(val) => (isDisableBtn = !val)" />
    </ElScrollbar>
    <template #footer>
      <div class="flex justify-center gap-2">
        <ElButton type="primary" :loading="loading" :size="isMobile ? 'large' : 'default'" :disabled="isDisableBtn" @click="handleNextStep">Next Step</ElButton>
        <ElButton class="!ml-0" :size="isMobile ? 'large' : 'default'" @click="handleClose">Cancel</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="scss">
.site-form-dialog.el-dialog {
  max-width: 800px;
  width: 96%;
  max-height: 96%;

  .el-step__title {
    font-size: 14px;
  }
}

@media screen and (max-width: 640px) {
  .site-form-dialog.el-dialog {
    height: 80%;
  }
}
</style>
