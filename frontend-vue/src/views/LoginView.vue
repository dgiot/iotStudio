<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>⚡ 光储充微电网物联网平台</h1>
        <p>轻量级边缘代理 V1.0</p>
      </div>
      <el-form :model="form" :rules="rules" ref="formRef" @keyup.enter="doLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" size="large" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" style="width:100%" :loading="loading" @click="doLogin">登 录</el-button>
        </el-form-item>
      </el-form>
      <div class="login-hint">
        <el-text size="small" type="info">默认账号: admin / admin123</el-text>
      </div>
     <div v-if="error" class="login-error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
const form = reactive({ username: 'admin', password: '' })
const loading = ref(false)
const error = ref('')
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function doLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true; error.value = ''
  try {
    const r = await axios.post('/api/auth/login', { username: form.username, password: form.password })
    const { token, role } = r.data
    localStorage.setItem('dgiot_token', token)
    localStorage.setItem('dgiot_user', JSON.stringify({ username: form.username, role }))
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.detail || '登录失败'
  }
  loading.value = false
}
</script>

<style scoped>
.login-page {
  display: flex; justify-content: center; align-items: center; min-height: 100vh;
  background: linear-gradient(135deg, #0c1c30 0%, #162844 50%, #1a3050 100%);
}
.login-card {
  width: 400px; padding: 40px; background: #162844; border: 1px solid #234060;
  border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}
.login-header { text-align: center; margin-bottom: 30px; }
.login-header h1 { color: #66d9ff; font-size: 28px; margin: 0; }
.login-header p { color: #c0d5e8; font-size: 14px; margin-top: 8px; }
.login-hint { text-align: center; margin-top: 12px; }
.login-error { color: #ef5350; text-align: center; margin-top: 12px; font-size: 13px; }
</style>
