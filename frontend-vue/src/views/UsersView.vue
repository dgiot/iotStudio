<template>
  <div class="user-page">
    <div class="toolbar">
      <h3 style="color:#c0d5e8;margin:0">👥 用户管理</h3>
      <div>
        <el-button size="small" @click="load">↻ 刷新</el-button>
      </div>
    </div>

    <el-row :gutter="12" style="margin-bottom:12px">
      <el-col :span="6"><div class="sc primary"><div class="sn">{{ users.length }}</div><div class="sl">可登录账号</div></div></el-col>
      <el-col :span="6"><div class="sc success"><div class="sn">{{ deptTree.length }}</div><div class="sl">顶级部门</div></div></el-col>
      <el-col :span="6"><div class="sc plain"><div class="sn">{{ roleOptions.length }}</div><div class="sl">可用角色</div></div></el-col>
      <el-col :span="6"><div class="sc plain"><div class="sn">{{ sourceCount.local }}</div><div class="sl">本地扩展账号</div></div></el-col>
    </el-row>

    <div class="list-detail">
      <div class="ld-left">
        <el-tabs v-model="tab" style="padding:0 8px">
          <el-tab-pane label="用户" name="users">
            <div class="usr-list">
              <div v-for="u in users" :key="u.objectId" class="usr-row"
                   :class="{active: sel?.objectId===u.objectId}"
                   @click="sel = sel?.objectId===u.objectId ? null : u">
                <span class="av">{{ (u.name || u.username || '?')[0] }}</span>
                <div class="ur-main">
                  <div class="ur-name">{{ u.name || u.username }}</div>
                  <div class="ur-sub">{{ u.username }} · {{ u.role_name }}</div>
                </div>
                <el-tag size="small" :type="u.source === 'local' ? 'warning' : (u.source === 'parse-only' ? 'info' : 'success')">
                  {{ srcLabel(u.source) }}
                </el-tag>
              </div>
              <div v-if="!users.length" class="empty">暂无用户</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="部门" name="depts">
            <div class="dept-list">
              <div v-for="d in flatDepts" :key="d.objectId" class="dept-row"
                   :style="{ paddingLeft: d._d * 16 + 8 + 'px' }">
                <span>{{ d.children?.length ? '📁' : '📄' }}</span>
                <span style="margin-left:4px;font-size:13px;color:#e0e0e0">{{ d.name }}</span>
                <span style="margin-left:auto;font-size:11px;color:#6a8aaa">{{ d.user_count }}人</span>
              </div>
              <div v-if="!deptTree.length" class="empty">暂无部门</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="ld-right" v-if="sel">
        <div class="ldd-h">
          <span class="av" style="width:40px;height:40px;font-size:18px">{{ (sel.name || sel.username || '?')[0] }}</span>
          <div>
            <div style="font-size:16px;color:#e0e0e0;font-weight:bold">{{ sel.name || sel.username }}</div>
            <div style="font-size:12px;color:#6a8aaa">{{ sel.username }} · ID: {{ sel.objectId }}</div>
          </div>
          <el-tag :type="sel.source === 'local' ? 'warning' : 'success'" size="small">{{ srcLabel(sel.source) }}</el-tag>
        </div>

        <el-descriptions :column="2" size="small" border style="margin:12px 0">
          <el-descriptions-item label="用户名">{{ sel.username }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ sel.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ sel.role_name }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ sel.department_name || '未分配' }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ sel.email || '-' }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ sel.phone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建">{{ f(sel.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="更新">{{ f(sel.updatedAt) }}</el-descriptions-item>
        </el-descriptions>

        <div v-if="sel.source === 'parse-only'" class="warn">
          ⚠️ 该账号只存在于 Parse 库、不在登录名单里 —— 分配了角色也登不进来。
        </div>

        <div class="sec">角色分配</div>
        <el-select v-model="pickRole" placeholder="选择角色" size="small" style="width:240px">
          <el-option v-for="r in roleOptions" :key="r.value" :label="r.label" :value="r.value" />
        </el-select>
        <el-button size="small" type="primary" style="margin-left:8px"
                   :disabled="!pickRole || pickRole === sel.role" @click="doAssignRole">应用</el-button>

        <div class="sec">部门分配</div>
        <el-select v-model="pickDept" placeholder="选择部门" size="small" style="width:240px">
          <el-option v-for="d in flatDepts" :key="d.objectId" :label="d.name" :value="d.objectId" />
        </el-select>
        <el-button size="small" type="primary" style="margin-left:8px"
                   :disabled="!pickDept || pickDept === sel.department" @click="doAssignDept">应用</el-button>

        <div class="note">
          角色改的是登录名单（auth）与 Parse 镜像两边；<b>已签发的 token 里带着旧角色</b>，
          要重新登录才换过来。
        </div>
      </div>
      <div class="ld-right ld-empty" v-else><span>👈 点击用户查看详情</span></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUsers, getRoles, getDepartments, setUserRole, setUserDepartment } from '../api/admin'

const users = ref([])
const roleOptions = ref([])
const deptTree = ref([])
const sel = ref(null)
const tab = ref('users')
const pickRole = ref('')
const pickDept = ref('')

const sourceCount = computed(() => ({
  local: users.value.filter(u => u.source === 'local').length,
}))

// 部门树摊平成一维（带缩进深度），够用且不用引 el-tree
const flatDepts = computed(() => {
  const out = []
  const walk = (nodes, d) => nodes.forEach(n => {
    out.push({ ...n, _d: d })
    if (n.children?.length) walk(n.children, d + 1)
  })
  walk(deptTree.value, 0)
  return out
})

function srcLabel(s) {
  return { local: '本地账号', 'auth+parse': '内置', auth: '内置', 'parse-only': '仅Parse' }[s] || s || '-'
}
function f(ts) { return ts ? new Date(ts).toLocaleString() : '-' }

async function load() {
  try {
    const [ur, rr, dr] = await Promise.all([getUsers(), getRoles(), getDepartments()])
    users.value = ur.results || []
    deptTree.value = dr.results || []

    // 角色候选项：内置三角色 + _Role 表里的自定义角色（扁平，不带 children）
    const builtin = [
      { value: 'admin', label: '管理员' },
      { value: 'operator', label: '运维操作员' },
      { value: 'viewer', label: '只读用户' },
    ]
    const custom = []
    const walk = (nodes) => (nodes || []).forEach(r => {
      if (!r.builtin) custom.push({ value: r.objectId, label: `${r.name}（自定义）` })
      walk(r.children)
    })
    walk(rr.results)
    roleOptions.value = [...builtin, ...custom]

    if (sel.value) {
      sel.value = users.value.find(u => u.objectId === sel.value.objectId) || null
    }
    syncPickers()
  } catch (e) {
    ElMessage.error('加载失败：' + (e?.message || e))
  }
}

function syncPickers() {
  pickRole.value = sel.value?.role || ''
  pickDept.value = sel.value?.department || ''
}

async function doAssignRole() {
  try {
    await setUserRole(sel.value.objectId, pickRole.value)
    ElMessage.success('角色已更新')
    await load()
  } catch (e) { ElMessage.error('分配失败：' + (e?.message || e)) }
}

async function doAssignDept() {
  try {
    await setUserDepartment(sel.value.objectId, pickDept.value)
    ElMessage.success('部门已更新')
    await load()
  } catch (e) { ElMessage.error('分配失败：' + (e?.message || e)) }
}

onMounted(load)
</script>

<style scoped>
.user-page { color:#c0d5e8; display:flex; flex-direction:column; height:calc(100vh - 100px); }
.toolbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.sc { padding:10px 12px; border-radius:6px; text-align:center; }
.sc.primary { background:linear-gradient(135deg,#152a40,#1a3550); border:1px solid #1e3a5f; }
.sc.success { background:linear-gradient(135deg,#103a10,#154a15); border:1px solid #205a20; }
.sc.plain { background:#152a40; border:1px solid #1e3a5f; }
.sn { font-size:22px; font-weight:bold; } .sl { font-size:11px; color:#6a8aaa; }
.list-detail { display:flex; gap:12px; flex:1; min-height:0; }
.ld-left { width:340px; border:1px solid #1e3a5f; border-radius:6px; background:#0a1a2a; overflow-y:auto; flex-shrink:0; }
.ld-right { flex:1; border:1px solid #1e3a5f; border-radius:6px; background:#0d1f33; padding:12px 16px; overflow-y:auto; }
.ld-empty { display:flex; align-items:center; justify-content:center; color:#5a7a9a; }
.usr-row { display:flex; align-items:center; gap:10px; padding:8px 12px; cursor:pointer; border-bottom:1px solid #162d45; }
.usr-row:hover { background:#112233; } .usr-row.active { background:#152a40; border-left:3px solid #66d9ff; }
.av { width:32px;height:32px;border-radius:50%;background:#409EFF;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;flex-shrink:0; }
.ur-main { flex:1; min-width:0; } .ur-name { font-size:13px;color:#e0e0e0; } .ur-sub { font-size:11px;color:#6a8aaa; }
.dept-row { display:flex; align-items:center; gap:4px; padding:5px 8px; border-bottom:1px solid #0d1f33; }
.ldd-h { display:flex; align-items:center; gap:12px; }
.sec { font-size:12px; color:#909399; font-weight:600; margin:12px 0 6px; }
.note { margin-top:18px; font-size:11px; color:#6a8aaa; line-height:1.7; border-left:2px solid #1e3a5f; padding-left:8px; }
.warn { margin:8px 0; padding:6px 10px; font-size:12px; color:#e6a23c; background:#2a2113; border:1px solid #4a3a1a; border-radius:4px; }
.empty { padding:24px; text-align:center; color:#5a7a9a; font-size:12px; }
</style>
