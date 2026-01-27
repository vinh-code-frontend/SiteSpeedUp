<script setup lang="ts">
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const auth = getAuth()
const form = reactive({
  email: '',
  password: '',
})
const loading = ref(false)

const rules: FormRules = {
  email: [
    {
      required: true,
      message: 'Email is required',
    },
    {
      type: 'email',
      message: 'Invalid email',
    },
  ],
  password: [
    {
      required: true,
      message: 'Password is required',
    },
    {
      min: 6,
      message: 'Password must be at least 6 characters',
    },
  ],
}
const formRef = ref<FormInstance>()

const onRegister = async () => {
  if (!formRef.value) {
    return
  }
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
    loading.value = true
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password)
      ElMessage.success('Registration successful!')
      // Optionally, redirect or clear form here
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Registration failed'
      ElMessage.error(errMsg)
    } finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <div class="register-view">
    <h2 class="form-label">Register Form</h2>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="register-form"
      @submit.prevent="onRegister"
      label-position="top"
      asterisk-position="right"
    >
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" autocomplete="email" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="form.password" type="password" autocomplete="new-password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onRegister">Register</el-button>
        <el-button type="text" @click="$router.push({ name: 'Login' })">Go to Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.register-view {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.register-form {
  width: 100%;
}
.form-label {
  text-align: center;
  margin-bottom: 16px;
}
</style>
