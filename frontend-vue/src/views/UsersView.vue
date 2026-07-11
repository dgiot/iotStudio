<template>
  <div class="users-page">
    <h3>👥 用户管理</h3>
    <el-button type="primary" size="small" @click="showDialog()" style="float:right">+ 添加用户</el-button>

    <el-table :data="users" style="margin-top:12px" v-loading="loading">
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="role" label="角色" width="120">
        <template #default="{row}"><el-tag :type="row.role==='admin'?'danger':'info'" size="small" effect="dark">{{ roleMap[row.role] }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="desc" label="说明" min-width="200" />
      <el-table-column prop="created" label="创建时间" width="180" />
      <el-table-column label="状态" width="100">
        <template #default="{row}"><el-tag :type="row.enabled?'success':'info'" size="small">{{ row.enabled ? '启用' : '禁用' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{row}">
          <el-button link type="primary" size="small" @click="showDialog(row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="delUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="editId ? '编辑用户' : '添加用户'" v-model="dialogVis" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名"><el-input v-model="form.username" :disabled="!!editId" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="form.password" type="password" :placeholder="editId?'留空不修改':''" /></el-form-item>
        <el-form-item label="角色"><el-select v-model="form.role"><el-option v-for="r in roles" :key="r.v" :label="r.l" :value="r.v" /></el-select></el-form-item>
        <el-form-item label="说明"><el-input v-model="form.desc" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="form.enabled" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVis=false">取消</el-button><el-button type="primary" @click="saveUser">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../api'

const users = ref([])
const loading = ref(false)
const dialogVis = ref(false)
const editId = ref('')
const form = ref({ username:'', password:'', role:'operator', desc:'', enabled:true })
const roles = [{l:'管理员',v:'admin'},{l:'工程师',v:'engineer'},{l:'操作员',v:'operator'}]
const roleMap = { admin:'管理员', engineer:'工程师', operator:'操作员' }

async function loadUsers() {
  loading.value = true
  try {
    const r = await api.get('/auth/users')
    users.value = r.data.users || []
  } catch { users.value = [] }
  loading.value = false
}

function showDialog(row) {
  editId.value = row?.username || ''
  form.value = row ? {...row, password:''} : { username:'', password:'', role:'operator', desc:'', enabled:true }
  dialogVis.value = true
}

async function saveUser() {
  try {
    await api.post('/auth/users', form.value)
    ElMessage.success(editId.value ? '已更新' : '已创建')
    dialogVis.value = false; loadUsers()
  } catch { ElMessage.error('保存失败') }
}

async function delUser(row) {
  try {
    await ElMessageBox.confirm(`确认删除用户 ${row.username}？`, '警告', { type:'warning' })
    await api.delete(`/auth/users/${row.username}`)
    ElMessage.success('已删除'); loadUsers()
  } catch {}
}

onMounted(loadUsers)
</script>

<style scoped>
.users-page h3 { color: #e8f0f8; margin: 0; display: inline-block; }
</style>
