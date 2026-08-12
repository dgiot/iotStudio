<!--
  登录页 — 对齐 iotView src/views/login/index.vue
  dgiot-vue v5.0.1 标准
-->
<template>
  <div class="login-container">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">{{ title }}</h3>
        <p class="subtitle">轻量级边缘代理 V1.0</p>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <el-icon><UserFilled /></el-icon>
        </span>
        <el-input
          ref="usernameInput"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <el-icon><Lock /></el-icon>
          </span>
          <el-input
            :key="passwordType"
            ref="passwordInput"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <el-icon><component :is="passwordType === 'password' ? 'View' : 'Hide'" /></el-icon>
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
        登录
      </el-button>

      <div class="login-bottom-panel">
        <div class="tips">
          <span class="link-type">默认: {{ defUsername }} / {{ defPassword }}</span>
        </div>
      </div>

      <div v-if="errorMsg" class="login-error">{{ errorMsg }}</div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { title, defUsername, defPassword } from '../config'
import { validUsername, validPassword } from '../utils/validate'
import { setToken, setObjectId, setDepartmentId, setDepartmentName, setLocalUser, getToken } from '../utils/auth'
import { login as loginApi } from '../api'

const route = useRoute()
const router = useRouter()

// ── 表单状态 ──
const loginForm = reactive({
  username: defUsername,
  password: '',
})
const loading = ref(false)
const errorMsg = ref('')
const passwordType = ref('password')
const capsTooltip = ref(false)
const loginFormRef = ref(null)   // el-form ref
const usernameInput = ref(null)
const passwordInput = ref(null)

// ── 验证规则 (iotView 标准) ──
const validateUsername = (_rule, value, callback) => {
  if (!value || !value.trim()) {
    callback(new Error('请输入用户名'))
  } else {
    callback()
  }
}
const validatePassword = (_rule, value, callback) => {
  if (!value || value.length < 3) {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}
const loginRules = {
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
}

// ── 重定向参数 (对齐 iotView) ──
const redirect = ref(undefined)
const otherQuery = ref({})

function getOtherQuery(query) {
  const { redirect: _r, ...rest } = query
  return rest
}

// 监听 route query
import { watch } from 'vue'
watch(() => route.query, (query) => {
  if (query) {
    redirect.value = query.redirect
    otherQuery.value = getOtherQuery(query)
  }
}, { immediate: true })

// ── 生命周期 ──
onMounted(() => {
  // 已登录 → 跳首页 (对齐 iotView permission.js)
  if (getToken()) {
    router.push({ path: '/' })
    return
  }
  if (!loginForm.username) {
    usernameInput.value?.focus()
  } else if (!loginForm.password) {
    passwordInput.value?.focus()
  }
})

// ── 方法 ──
function checkCapslock(e) {
  const { key } = e
  capsTooltip.value = key && key.length === 1 && (key >= 'A' && key <= 'Z')
}

function showPwd() {
  passwordType.value = passwordType.value === 'password' ? '' : 'password'
  nextTick(() => {
    passwordInput.value?.focus()
  })
}

async function handleLogin() {
  const valid = await loginFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  errorMsg.value = ''

  try {
    // POST /api/auth/login → 后端返回 JWT
    const response = await loginApi({
      username: loginForm.username.trim(),
      password: loginForm.password,
    })

    const { token, user } = response

    if (!token) {
      throw new Error('登录失败：未获取到 token')
    }

    // ── iotView 兼容: 映射 JWT response → iotView state shape ──
    const objectId = user?.id || ''
    const username = user?.username || loginForm.username
    const nick = user?.nick || username
    const email = user?.email || ''
    const phone = user?.phone || ''
    const role = user?.role || 'user'
    const roles = user?.roles || [{ objectId: 'default', name: role, org_type: 'default' }]

    // Cookie 存储 (iotView 标准)
    setToken(token)
    setObjectId(objectId)
    setDepartmentId(roles[0]?.objectId || 'default')
    setDepartmentName(roles[0]?.name || role)

    // localStorage 存储 (iotView 兼容)
    localStorage.setItem('sessionToken', token)
    localStorage.setItem('dgiot_userid', objectId)
    localStorage.setItem('dgiot_username', username)
    localStorage.setItem('dgiot_nick', nick)
    if (phone) localStorage.setItem('dgiot_phone', phone)
    localStorage.setItem('dgiot_deptId', roles[0]?.objectId || 'default')
    localStorage.setItem('dgiot_deptName', roles[0]?.name || role)

    // iotStudio 兼容
    setLocalUser({ objectId, username, nick, email, phone, deptId: roles[0]?.objectId, deptName: roles[0]?.name })

    ElMessage.success('登录成功')

    // 跳转 (对齐 iotView: 有 redirect 则跳 redirect，否则去首页)
    router.push({ path: redirect.value || '/dashboard', query: otherQuery.value })

  } catch (e) {
    console.error(e)
    const msg = e.response?.data?.error || e.response?.data?.message || e.message || '登录失败'
    if (msg.indexOf('locked') >= 0) {
      errorMsg.value = '由于多次登录失败，您的帐户被锁定。请在10分钟后再试。'
    } else if (msg.indexOf('password') >= 0 || msg.indexOf('Invalid') >= 0) {
      errorMsg.value = '账号或密码错误，请检查后重试'
    } else {
      errorMsg.value = msg
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0c1c30 0%, #162844 50%, #1a3050 100%);
}
.login-form {
  width: 420px;
  padding: 40px;
  background: #162844;
  border: 1px solid #234060;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
}
.title-container {
  text-align: center;
  margin-bottom: 30px;
}
.title {
  color: #66d9ff;
  font-size: 26px;
  margin: 0 0 6px 0;
  font-weight: 600;
}
.subtitle {
  color: #8aa0b4;
  font-size: 13px;
  margin: 0;
}
.svg-container {
  display: inline-flex;
  align-items: center;
  padding: 0 8px 0 4px;
  color: #889aa4;
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #889aa4;
  font-size: 16px;
}
.show-pwd:hover { color: #66d9ff; }
.login-bottom-panel {
  text-align: center;
  margin-top: -10px;
}
.tips {
  font-size: 12px;
  color: #6a8aaa;
}
.link-type {
  cursor: pointer;
  color: #50b0d0;
}
.login-error {
  color: #ef5350;
  text-align: center;
  margin-top: 12px;
  font-size: 13px;
  word-break: break-all;
}
</style>
