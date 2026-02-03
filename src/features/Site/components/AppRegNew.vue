<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import type { ISiteForm } from '../types';
import { ref } from 'vue';

const formRef = ref<FormInstance>();

const rules: FormRules = {};
const model = defineModel<ISiteForm>({ required: true });
</script>

<template>
  <ElForm ref="formRef" :model="model" :rules="rules" require-asterisk-position="right" label-position="top">
    <div>{{ `App Reg New: ${model.site}` }}</div>
  </ElForm>
</template>

<style scoped lang="scss"></style>
