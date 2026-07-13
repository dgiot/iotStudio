<template>
  <div class="user-page">
    <div class="toolbar">
      <h3 style="color:#c0d5e8;margin:0">👥 用户管理</h3>
      <el-button type="primary" size="small" @click="showAdd">+ 添加用户</el-button>
    </div>

    <el-row :gutter="12" style="margin-bottom:12px">
      <el-col :span="6"><div class="sc primary"><div class="sn">{{ users.length }}</div><div class="sl">用户总数</div></div></el-col>
      <el-col :span="6"><div class="sc success"><div class="sn">{{ roles.length }}</div><div class="sl">角色/部门</div></div></el-col>
      <el-col :span="12"><div class="sc plain" style="display:flex;gap:12px;align-items:center;font-size:12px;padding:8px 12px"><span v-for="r in roles" :key="r.objectId" style="white-space:nowrap"><span style="color:#8aa0b4">{{ r.name }}</span><span style="color:#e0e0e0;margin-left:4px">{{ uCount(r.objectId) }}人</span></span></div></el-col>
    </el-row>

    <div class="list-detail">
      <div class="ld-left">
        <el-tabs v-model="tab" style="padding:0 8px">
          <el-tab-pane label="用户" name="users">
            <div class="usr-list">
              <div v-for="u in users" :key="u.objectId" class="usr-row" :class="{active:sel?.objectId===u.objectId}" @click="sel = sel?.objectId===u.objectId ? null : u">
                <span class="av">{{ (u.username||'?')[0].toUpperCase() }}</span>
                <div class="ur-main"><div class="ur-name">{{ u.username }}</div><div class="ur-sub">{{ u.role||'未分配' }}</div></div>
                <el-tag size="small" type="success">用户</el-tag>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="部门" name="depts">
            <div class="dept-list">
              <div v-for="r in roleTree" :key="r.objectId" class="dept-row" :style="{paddingLeft:(r._d||0)*16+8+'px'}">
                <span>{{ r._c?'📁':'📄' }}</span><span style="margin-left:4px;font-size:13px;color:#e0e0e0">{{ r.name }}</span>
                <span style="margin-left:auto;font-size:11px;color:#6a8aaa">{{ r._u||0 }}人</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="ld-right" v-if="sel">
        <div class="ldd-h"><span class="av" style="width:40px;height:40px;font-size:18px">{{ (sel.username||'?')[0].toUpperCase() }}</span><div><div style="font-size:16px;color:#e0e0e0;font-weight:bold">{{ sel.username }}</div><div style="font-size:12px;color:#6a8aaa">ID: {{ sel.objectId }}</div></div><el-tag type="success" size="small">用户</el-tag></div>
        <el-descriptions :column="2" size="small" border style="margin:12px 0"><el-descriptions-item label="用户名">{{ sel.username }}</el-descriptions-item><el-descriptions-item label="角色">{{ sel.role||'未分配' }}</el-descriptions-item><el-descriptions-item label="创建">{{ f(sel.createdAt) }}</el-descriptions-item><el-descriptions-item label="更新">{{ f(sel.updatedAt) }}</el-descriptions-item></el-descriptions>
        <div class="sec">角色分配</div>
        <el-select v-model="ar" placeholder="选择角色" size="small" style="width:200px" @change="assignRole"><el-option v-for="r in roles" :key="r.objectId" :label="r.name" :value="r.objectId" /></el-select>
        <div class="sec" style="margin-top:8px">部门分配</div>
        <el-select v-model="ad" placeholder="选择部门" size="small" style="width:200px" @change="assignDept"><el-option v-for="r in roles" :key="r.objectId" :label="r.name" :value="r.objectId" /></el-select>
        <div class="acts"><el-button type="danger" size="small" @click="del">🗑 删除</el-button></div>
      </div>
      <div class="ld-right ld-empty" v-else><span>👈 点击用户查看详情</span></div>
    </div>

    <el-dialog title="添加用户" v-model="vis" width="400px"><el-form :model="fm" label-width="70px"><el-form-item label="用户名"><el-input v-model="fm.username" /></el-form-item><el-form-item label="密码"><el-input v-model="fm.password" type="password" /></el-form-item><el-form-item label="角色"><el-select v-model="fm.role" style="width:100%"><el-option v-for="r in roles" :key="r.objectId" :label="r.name" :value="r.objectId" /></el-select></el-form-item></el-form><template #footer><el-button @click="vis=false">取消</el-button><el-button type="primary" @click="add">确定</el-button></template></el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const users = ref([]); const roles = ref([]); const sel = ref(null)
const tab = ref('users'); const vis = ref(false); const ar = ref(''); const ad = ref('')
const fm = ref({ username:'', password:'', role:'default', department:'' })

function uCount(rid) { return users.value.filter(u => u.role===rid).length }
function f(ts) { return ts ? new Date(ts).toLocaleString() : '-' }

async function load() {
  // 使用 admin API
  const [ur, rr] = await Promise.all([
    fetch('/api/admin/users').then(r=>r.json()),
    fetch('/api/admin/roles').then(r=>r.json()),
  ])
  users.value = ur.results || []
  roles.value = (rr.results || []).flatMap(r => [r, ...(r.children||[])])
  // 存session
  const token = localStorage.getItem('dgiot_session')
  if (!token) {
    // 自动登录获取 session
    const lr = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:'admin',password:'admin'}) }).then(r=>r.json())
    if (lr.sessionToken) localStorage.setItem('dgiot_session', lr.sessionToken)
  }
}

const roleTree = computed(() => {
  const m = {}; const roots = []
  roles.value.forEach(r => { m[r.objectId] = { ...r, _c:[],_d:0,_u:uCount(r.objectId) } })
  roles.value.forEach(r => { if (r.parent_id && m[r.parent_id]) { const c = m[r.objectId]; c._d=m[r.parent_id]._d+1; m[r.parent_id]._c.push(c) } else if (!r.parent_id) roots.push(m[r.objectId]) })
  return roots
})

async function assign(v) { if(!sel.value)return; await fetch(`/api/admin/users/${sel.value.objectId}/role`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({role:v}) }); ElMessage.success('已分配'); load() }
function showAdd() { fm.value={username:'',password:'',role:'default'}; vis.value=true }
async function add() { await fetch('/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:fm.value.username,password:fm.value.password,role:fm.value.role,email:''})}); ElMessage.success('已创建'); vis.value=false; load() }
async function del() { if(!sel.value)return; await fetch(`/api/classes/_User/${sel.value.objectId}`,{method:'DELETE'}); ElMessage.success('已删除'); sel.value=null; load() }
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
.ld-left { width:320px; border:1px solid #1e3a5f; border-radius:6px; background:#0a1a2a; overflow-y:auto; flex-shrink:0; }
.ld-right { flex:1; border:1px solid #1e3a5f; border-radius:6px; background:#0d1f33; padding:12px 16px; overflow-y:auto; }
.ld-empty { display:flex; align-items:center; justify-content:center; color:#5a7a9a; }
.usr-row { display:flex; align-items:center; gap:10px; padding:8px 12px; cursor:pointer; border-bottom:1px solid #162d45; }
.usr-row:hover { background:#112233; } .usr-row.active { background:#152a40; border-left:3px solid #66d9ff; }
.av { width:32px;height:32px;border-radius:50%;background:#409EFF;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;flex-shrink:0; }
.ur-main { flex:1; } .ur-name { font-size:13px;color:#e0e0e0; } .ur-sub { font-size:11px;color:#6a8aaa; }
.dept-list { } .dept-row { display:flex; align-items:center; gap:4px; padding:5px 8px; border-bottom:1px solid #0d1f33; }
.ldd-h { display:flex; align-items:center; gap:12px; }
.sec { font-size:12px; color:#909399; font-weight:600; margin:12px 0 6px; }
.acts { margin-top:16px; }
</style>
