<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '@/stores/global';
import { useWindowSize } from '@vueuse/core';
import SiteVerify from './components/SiteVerify.vue';
import type { ISiteDTO, ISiteForm, ISite } from './types';
import SiteConfiguration from './components/SiteConfiguration.vue';
import { serverTimestamp } from 'firebase/firestore';
import SiteReview from './components/SiteReview.vue';

const emit = defineEmits<{
  refresh: [];
}>();
const store = useStore();

const visible = ref(false);
const currentStep = ref(0);
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 640);
const model = ref<ISiteForm>({
  tenantFBId: '',
  site: '',
  clientId: '',
  clientSecret: ''
});
const isSiteValid = ref(true);

const isDisableBtn = computed(() => {
  if (currentStep.value === 0 && !isSiteValid.value) {
    return true;
  }
  if (currentStep.value === 1 && (!model.value.clientId || !model.value.clientSecret)) {
    return true;
  }
  return false;
});

const step1Ref = ref<InstanceType<typeof SiteVerify>>();
const step2Ref = ref<InstanceType<typeof SiteConfiguration>>();

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

const handleCreateSite = async () => {
  console.log(model.value);
  const tenant = store.tenants.find((item) => item.id === model.value.tenantFBId);
  if (!tenant || !store.loginUser) {
    return;
  }
  const data: ISiteDTO = {
    ...model.value,
    tenantId: tenant.tenantId,
    tenantTitle: tenant.title,
    userId: store.loginUser.uid,
    userDisplayName: store.loginUser.displayName ?? '',
    clientIdResource: tenant.clientIdResource,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  console.log(data);
};

const handleNextStep = async () => {
  const validators = [step1Ref, step2Ref];
  const ref = validators[currentStep.value];

  if (!ref) {
    return;
  }

  const isValid = await ref.value?.validate();
  if (isValid) {
    currentStep.value++;
  }
};

defineExpose({
  openForm
});
</script>

<template>
  <el-config-provider size="large">
    <el-dialog
      v-model="visible"
      :align-center="isMobile || currentStep === 1"
      body-class="flex-1 overflow-hidden"
      class="site-form-dialog overflow-hidden flex flex-col"
      destroy-on-close
      title="Add Site"
      @close="handleClose"
    >
      <div class="flex-1">
        <ElSteps :active="currentStep" align-center class="mb-3" finish-status="success" process-status="finish">
          <ElStep title="Site checking" />
          <ElStep title="Site Config" />
          <ElStep title="Site Review" />
        </ElSteps>
      </div>
      <el-scrollbar>
        <SiteVerify v-show="currentStep === 0" ref="step1Ref" v-model="model" v-model:isSiteValid="isSiteValid" />
        <SiteConfiguration v-show="currentStep === 1" ref="step2Ref" v-model="model" />
        <SiteReview v-show="currentStep === 2" v-model="model" />
      </el-scrollbar>

      <template #footer>
        <div class="flex justify-center gap-2">
          <el-button v-if="currentStep" class="!ml-0" plain type="primary" @click="currentStep--">Last Step</el-button>
          <el-button v-if="currentStep < 2" class="!ml-0" :disabled="isDisableBtn" :loading="loading" type="primary" @click="handleNextStep"
            >Next Step</el-button
          >
          <el-button v-else class="!ml-0" type="primary" @click="handleCreateSite">Create Site</el-button>
          <el-button class="!ml-0" @click="handleClose">Cancel</el-button>
        </div>
      </template>
    </el-dialog>
  </el-config-provider>
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
