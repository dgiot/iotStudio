<template>
  <div class="role-page">
    <div class="toolbar">
      <h3 style="color:#c0d5e8;margin:0">🎭 角色管理</h3>
      <div>
        <el-button size="small" @click="load">↻ 刷新</el-button>
        <el-button size="small" type="primary" @click="openCreate">+ 新建角色</el-button>
      </div>
    </div>

    <el-alert type="info" :closable="false" style="margin-bottom:12px">
      <template #title>
        <span style="font-size:12px">
          <b>内置角色</b>（管理员 / 运维操作员 / 只读用户）由后端 <code>auth.py</code> 判定，
          改不了也删不了 —— 它们是权限判定的权威源。
          这里<b>新建的角色</b>是组织维度的标签，用于归人与分工；自定义角色暂不参与接口鉴权。
        </span>
      </template>
    </el-alert>

    <el-row :gutter="12" style="margin-bottom:12px">
      <el-col :span="6"><div class="sc primary"><div class="sn">{{ totalRoles }}</div><div class="sl">角色总数</div></div></el-col>
      <el-col :span="6"><div class="sc success"><div class="sn">{{ builtinCount }}</div><div class="sl">内置角色</div></div></el-col>
      <el-col :span="6"><div class="sc plain"><div class="sn">{{ customCount }}</div><div class="sl">自定义角色</div></div></el-col>
      <el-col :span="6"><div class="sc plain"><div class="sn">{{ totalMembers }}</div><div class="sl">已归人</div></div></el-col>
    </el-row>

    <div class="list-detail">
      <div class="ld-left">
        <div class="panel-title">角色树</div>
        <div class="role-list">
          <div v-for="n in flatRoles" :key="n.objectId" class="role-row"
               :class="{ active: sel?.objectId === n.objectId }"
               :style="{ paddingLeft: n._d * 16 + 12 + 'px' }"
               @click="sel = n">
            <span>{{ n.children?.length ? '📁' : '🎭' }}</span>
            <span class="rn">{{ n.name }}</span>
            <el-tag v-if="n.builtin" size="small" type="success" effect="dark">内置</el-tag>
            <el-tag v-else size="small" type="warning">自定义</el-tag>
            <span class="rc">{{ n.user_count }}人</span>
          </div>
          <div v-if="!flatRoles.length" class="empty">暂无角色</div>
        </div>
      </div>

      <div class="ld-right" v-if="sel">
        <div class="ldd-h">
          <span class="av">🎭</span>
          <div>
            <div style="font-size:16px;color:#e0e0e0;font-weight:bold">{{ sel.name }}</div>
            <div style="font-size:12px;color:#6a8aaa">ID: {{ sel.objectId }}</div>
          </div>
          <el-tag :type="sel.builtin ? 'success' : 'warning'" size="small">
            {{ sel.builtin ? '内置角色' : '自定义角色' }}
          </el-tag>
        </div>

        <el-descriptions :column="2" size="small" border style="margin:12px 0">
          <el-descriptions-item label="别名">{{ sel.alias || '-' }}</el-descriptions-item>
          <el-descriptions-item label="上级">{{ parentName(sel) }}</el-descriptions-item>
          <el-descriptions-item label="成员数">{{ sel.user_count }}</el-descriptions-item>
          <el-descriptions-item label="子角色">{{ sel.children?.length || 0 }}</el-descriptions-item>
        </el-descriptions>

        <div class="sec">说明</div>
        <div class="desc">{{ sel.desc || '（无说明）' }}</div>

        <div class="sec">成员</div>
        <div class="members">
          <el-tag v-for="u in membersOf(sel)" :key="u.objectId" size="small" style="margin:0 6px 6px 0">
            {{ u.name || u.username }}
          </el-tag>
          <span v-if="!membersOf(sel).length" class="dim">该角色下暂无成员</span>
        </div>

        <div v-if="sel.builtin" class="note">
          内置角色的成员由「用户管理」里分配，这里只读。
        </div>
        <div v-else class="note">
          自定义角色可在「用户管理」里分配给用户（角色下拉里的「自定义」项）。
        </div>
      </div>
      <div class="ld-right ld-empty" v-else><span>👈 点击角色查看详情</span></div>
    </div>

    <el-dialog title="新建角色" v-model="vis" width="420px">
      <el-form :model="fm" label-width="80px">
        <el-form-item label="角色名"><el-input v-model="fm.name" placeholder="如：夜班值守" /></el-form-item>
        <el-form-item label="上级角色">
          <el-select v-model="fm.parent" clearable placeholder="不选则为顶级" style="width:100%">
            <el-option v-for="n in flatRoles" :key="n.objectId" :label="n.name" :value="n.objectId" />
          </el-select>
        </el-form-item>
        <el-form-item label="说明"><el-input v-model="fm.desc" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="vis=false">取消</el-button>
        <el-button type="primary" @click="doCreate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getRoles, createRole, getUsers } from '../api/admin'

const roleTree = ref([])
const users = ref([])
const sel = ref(null)
const vis = ref(false)
const fm = ref({ name: '', parent: '', desc: '' })

// 摊平（带深度）便于单列展示
const flatRoles = computed(() => {
  const out = []
  const walk = (nodes, d) => (nodes || []).forEach(n => {
    out.push({ ...n, _d: d })
    if (n.children?.length) walk(n.children, d + 1)
  })
  walk(roleTree.value, 0)
  return out
})

const totalRoles = computed(() => flatRoles.value.length)
const builtinCount = computed(() => flatRoles.value.filter(r => r.builtin).length)
const customCount = computed(() => totalRoles.value - builtinCount.value)
// ⚠️ 不能在角色上直接求 user_count 之和：同一个人既是 operator 又挂在 maint-dept，
//    在 _Role 表里是两条独立行，各记一次 —— 9 个账号会显示成「已归人 18」。
//    按人去重才是有意义的数。
const totalMembers = computed(() => {
  const ids = new Set()
  users.value.forEach(u => {
    const key = u.objectId || u.username
    if (key && (u.role || u.department)) ids.add(key)
  })
  return ids.size
})

function parentName(role) {
  if (!role.parent) return '（顶级）'
  return flatRoles.value.find(r => r.objectId === role.parent)?.name || role.parent
}
function membersOf(role) {
  return users.value.filter(u => u.role === role.objectId)
}

async function load() {
  try {
    const [rr, ur] = await Promise.all([getRoles(), getUsers()])
    roleTree.value = rr.results || []
    users.value = ur.results || []
    if (sel.value) sel.value = flatRoles.value.find(r => r.objectId === sel.value.objectId) || null
  } catch (e) {
    ElMessage.error('加载失败：' + (e?.message || e))
  }
}

function openCreate() { fm.value = { name: '', parent: '', desc: '' }; vis.value = true }

async function doCreate() {
  if (!fm.value.name.trim()) { ElMessage.warning('角色名不能为空'); return }
  try {
    await createRole({ name: fm.value.name.trim(), parent: fm.value.parent || '', desc: fm.value.desc })
    ElMessage.success('已创建')
    vis.value = false
    await load()
  } catch (e) { ElMessage.error('创建失败：' + (e?.message || e)) }
}

onMounted(load)
</script>

<style scoped>
.role-page { color:#c0d5e8; display:flex; flex-direction:column; height:calc(100vh - 100px); }
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
.panel-title { font-size:12px; color:#6a8aaa; padding:8px 12px; border-bottom:1px solid #162d45; }
.role-row { display:flex; align-items:center; gap:6px; padding:8px 12px; cursor:pointer; border-bottom:1px solid #162d45; }
.role-row:hover { background:#112233; } .role-row.active { background:#152a40; border-left:3px solid #66d9ff; }
.rn { font-size:13px; color:#e0e0e0; }
.rc { margin-left:auto; font-size:11px; color:#6a8aaa; }
.av { width:40px;height:40px;border-radius:50%;background:#409EFF;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0; }
.ldd-h { display:flex; align-items:center; gap:12px; }
.sec { font-size:12px; color:#909399; font-weight:600; margin:14px 0 6px; }
.desc { font-size:13px; color:#c0d5e8; line-height:1.7; }
.members { min-height:28px; }
.dim { font-size:12px; color:#5a7a9a; }
.note { margin-top:18px; font-size:11px; color:#6a8aaa; line-height:1.7; border-left:2px solid #1e3a5f; padding-left:8px; }
.empty { padding:24px; text-align:center; color:#5a7a9a; font-size:12px; }
</style>
