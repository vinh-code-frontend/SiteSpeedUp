<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import type { ISiteForm } from '../types';
import { computed, ref } from 'vue';
import { SPGuideUrls } from '@/utils/sharepoint';
import { useValidator, guidRegex } from '@/hooks/useValidator';
import { Collection, CopyDocument } from '@element-plus/icons-vue';
import { APP_PERMISSION_XML, APP_REG_NEW_CONST, APP_PERMISSION_XML_DISPLAY } from '../constants';
import { useClipboard } from '@vueuse/core';

const formRef = ref<FormInstance>();
const model = defineModel<ISiteForm>({ required: true });

const { trimRequired, guid } = useValidator();
const { copy } = useClipboard();

const rules: FormRules<ISiteForm> = {
  clientId: [...trimRequired(), guid()],
  clientSecret: [...trimRequired()]
};

const appRegNewGuide = ref(APP_REG_NEW_CONST);
const disableCopyClientId = computed(() => {
  if (!model.value.clientId.trim() || !guidRegex.test(model.value.clientId?.trim())) {
    return true;
  }
  return false;
});

const urls = computed(() => new SPGuideUrls(model.value.site));

const handleCopy = async (content: string, message = content) => {
  await copy(content?.trim());
  ElMessage({
    message: `${message?.trim()} copied!`,
    type: 'success'
  });
};

const handleCopyClientId = (clientId: string) => {
  if (disableCopyClientId.value) {
    return;
  }
  handleCopy(clientId);
};

defineExpose({
  validate: () => formRef.value?.validate()
});
</script>

<template>
  <el-form id="step2" ref="formRef" class="pb-10" label-position="top" :model="model" require-asterisk-position="right" :rules="rules">
    <el-card class="mb-4">
      <el-alert
        class="leading-none p-2 text-xs"
        :closable="false"
        show-icon
        title="When processing the target URLs, please make sure to click the 'Create' or 'Trust it' button."
        type="warning"
      />
    </el-card>
    <el-card class="mb-4">
      <div class="pb-3 flex gap-2 items-center justify-between">
        <div class="text-xs truncate">
          <div class="pb-1 font-bold">Get Client ID, Client Secret at:</div>
          <a class="italic underline cursor-pointer text-primary" :href="urls.appRegNew()" target="_blank">{{ urls.appRegNew() }}</a>
        </div>
        <ElPopover placement="bottom-end" trigger="click" width="fit-content">
          <template #reference>
            <el-button :icon="Collection" plain size="small" type="success">Guide</el-button>
          </template>
          <el-table :data="appRegNewGuide" size="default" style="width: 300px">
            <el-table-column label="Field" prop="title" :width="60" />
            <el-table-column label="Sample" prop="sample" :width="120" />
            <el-table-column fixed="right" label="Copy" :width="50">
              <template #default="{ row }">
                <el-button :icon="CopyDocument" size="small" @click="handleCopy(row.sample)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </ElPopover>
      </div>
      <el-form-item label="Client ID" prop="clientId">
        <el-input v-model="model.clientId" />
      </el-form-item>
      <el-form-item label="Client Secret" prop="clientSecret">
        <el-input v-model="model.clientSecret" />
      </el-form-item>
    </el-card>

    <el-card>
      <div class="text-xs truncate">
        <div class="pb-1 font-bold">Lookup App id and grant permission at:</div>
        <a class="italic underline cursor-pointer text-primary" :href="urls.appInv()" target="_blank">{{ urls.appInv() }}</a>
      </div>

      <div class="flex items-center gap-1 mt-4 text-success">
        <el-icon><Collection /></el-icon>
        <span class="text-xs">Guide</span>
      </div>
      <div class="pt-2 leading-4">
        <span
          class="inline-block leading-4 pr-1"
          :class="!disableCopyClientId && 'text-primary cursor-pointer hover:opacity-50 underline'"
          :disabled="disableCopyClientId"
          @click="handleCopyClientId(model.clientId)"
          >Copy</span
        >
        <span>Client ID from input above to App Id field and click Lookup from appinv site</span>
      </div>

      <div class="mb-2 mt-3">Copy AppPermissionRequests XML to App's Permission Request XML field</div>

      <div class="bg-slate-50 px-3 relative">
        <el-button
          class="absolute z-[1] right-2 top-2 w-11"
          :icon="CopyDocument"
          @click="handleCopy(APP_PERMISSION_XML, 'AppPermissionRequests XML')"
        ></el-button>
        <el-scrollbar>
          <pre>
            <code >{{ APP_PERMISSION_XML_DISPLAY }}</code>
          </pre>
        </el-scrollbar>
      </div>
    </el-card>
  </el-form>
</template>

<style scoped lang="scss">
:deep(.el-alert__title) {
  font-size: 13px;
  line-height: 1.5;
  padding-left: 4px;
}
</style>
