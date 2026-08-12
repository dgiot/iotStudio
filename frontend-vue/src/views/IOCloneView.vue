<template>
  <div class="io-clone">
    <h2 style="color:#66d9ff;margin-bottom:16px">IO 服务器克隆</h2>

    <!-- 表单 -->
    <el-card class="card" shadow="never">
      <template #header><span>添加 IO 服务器</span></template>
      <el-form :inline="true" :model="form" @submit.prevent="addServer">
        <el-form-item label="IP"><el-input v-model="form.ip" placeholder="192.168.10.131" size="small"/></el-form-item>
        <el-form-item label="端口"><el-input v-model="form.port" placeholder="5985" size="small" style="width:80px"/></el-form-item>
        <el-form-item label="账号"><el-input v-model="form.user" placeholder="administrator" size="small"/></el-form-item>
        <el-form-item label="密码"><el-input v-model="form.pwd" type="password" placeholder="WinRM 密码" size="small"/></el-form-item>
        <el-form-item label="厂商"><el-input v-model="form.vendor" placeholder="force|opc|rockwell" size="small" style="width:200px"/></el-form-item>
        <el-form-item label="端口"><el-input v-model="form.ports" placeholder="8889 502 135" size="small" style="width:150px"/></el-form-item>
        <el-form-item><el-button type="primary" size="small" @click="addServer">添加</el-button></el-form-item>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card class="card" shadow="never" style="margin-top:16px">
      <template #header><span>IO 服务器列表 ({{ servers.length }})</span></template>
      <el-table :data="servers" size="small" style="width:100%">
        <el-table-column prop="name" label="名称" width="140"/>
        <el-table-column prop="ip" label="IP" width="130"/>
        <el-table-column label="状态" width="100">
          <template #default="{row}">
            <el-tag :type="statusType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="os" label="操作系统" min-width="200"/>
        <el-table-column label="操作" width="250">
          <template #default="{row}">
            <el-button size="small" type="primary" @click="doScan(row)" :loading="scanning===row.objectId">扫描</el-button>
            <el-button size="small" @click="showDetail(row)">详情</el-button>
            <el-button size="small" type="danger" @click="delServer(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 详情 -->
    <el-dialog v-model="detailVisible" title="IO 服务器详情" width="800px">
      <div v-if="detail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="名称">{{ detail.name }}</el-descriptions-item>
          <el-descriptions-item label="IP">{{ detail.ip }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ detail.status }}</el-descriptions-item>
          <el-descriptions-item label="OS">{{ detail.os || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Hostname">{{ scanData?.hostname || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Whoami">{{ scanData?.whoami || '-' }}</el-descriptions-item>
        </el-descriptions>

        <h4 style="margin-top:16px;color:#66d9ff">扫描结果</h4>
        <div v-if="scanData" style="max-height:400px;overflow:auto">
          <div v-for="(val, key) in scanData" :key="key" style="margin-bottom:8px">
            <strong style="color:#50b0d0">{{ key }}:</strong>
            <pre style="background:#0a1628;color:#8aa0b4;font-size:11px;padding:4px;margin:2px 0;max-height:100px;overflow:auto">{{ val || '(empty)' }}</pre>
          </div>
        </div>
        <p v-else style="color:#6a8aaa">尚未扫描 — 点击"扫描"获取 IO 服务器信息</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const servers = ref([])
const scanning = ref(null)
const detailVisible = ref(false)
const detail = ref(null)
const scanData = ref(null)

const form = reactive({ ip:'', port:'5985', user:'administrator', pwd:'', vendor:'force|opc|rockwell', ports:'8889 502 135' })

function statusType(s) {
  return s==='scanned'?'success':s==='scanning'?'warning':s==='error'?'danger':'info'
}

async function loadServers() {
  try {
    const r = await fetch('/api/io-clone/servers')
    if (r.ok) servers.value = (await r.json()).results || []
  } catch {}
}

async function addServer() {
  if (!form.ip || !form.user || !form.pwd) return ElMessage.warning('请填写 IP/账号/密码')
  try {
    const r = await fetch('/api/io-clone/servers', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        ip: form.ip,
        config: { ip:form.ip, port:parseInt(form.port), user:form.user,
                  password:form.pwd, transport:'ntlm',
                  vendor:form.vendor, ports:form.ports },
      }),
    })
    if (r.ok) { ElMessage.success('已添加'); loadServers(); form.ip=''; form.pwd='' }
    else ElMessage.error(await r.text())
  } catch(e) { ElMessage.error(e.message) }
}

async function doScan(row) {
  scanning.value = row.objectId
  try {
    const r = await fetch(`/api/io-clone/servers/${row.objectId}/scan`, { method:'POST' })
    if (r.ok) {
      ElMessage.success('扫描完成')
      loadServers()
    } else {
      ElMessage.error(await r.text())
    }
  } catch(e) { ElMessage.error(e.message) }
  scanning.value = null
}

async function showDetail(row) {
  try {
    const r = await fetch(`/api/io-clone/servers/${row.objectId}`)
    if (r.ok) {
      detail.value = await r.json()
      try { scanData.value = JSON.parse(detail.value.scan_result || '{}') } catch { scanData.value = null }
      detailVisible.value = true
    }
  } catch {}
}

async function delServer(row) {
  try {
    await ElMessageBox.confirm('确定删除?', '确认', {type:'warning'})
    await fetch(`/api/io-clone/servers/${row.objectId}`, {method:'DELETE'})
    loadServers()
  } catch {}
}

onMounted(loadServers)
</script>

<style scoped>
.io-clone { padding: 20px }
.card { background: #162844; border: 1px solid #234060; color: #c0d5e8 }
:deep(.el-card__header) { color: #66d9ff; border-bottom-color: #234060 }
:deep(.el-table) { background: transparent; --el-table-tr-bg-color: transparent }
:deep(.el-table th) { background: #0d1f33; color: #66d9ff }
:deep(.el-table td) { border-bottom-color: #1e3a5f }
pre { white-space: pre-wrap; word-break: break-all; border-radius: 4px }
</style>
