<template>
  <div class="menu-page">
    <div class="toolbar">
      <h3 style="color:#c0d5e8;margin:0">🧭 菜单管理</h3>
      <div>
        <el-button size="small" @click="load">↻ 刷新</el-button>
        <el-button size="small" type="primary" @click="openCreate">+ 外链菜单</el-button>
        <el-button size="small" type="danger" plain @click="doReset">还原全部</el-button>
      </div>
    </div>

    <el-alert type="info" :closable="false" style="margin-bottom:12px">
      <template #title>
        <span style="font-size:12px">
          <b>页面由代码定义，这里管的是展示</b>：标题 / 图标 / 分组 / 排序 / 显隐。
          删掉覆写即还原默认，不会删页面。想让菜单指向外部系统，用「+ 外链菜单」——
          那种不需要对应组件。
        </span>
      </template>
    </el-alert>

    <el-row :gutter="12" style="margin-bottom:12px">
      <el-col :span="6"><div class="sc primary"><div class="sn">{{ rows.length }}</div><div class="sl">菜单项总数</div></div></el-col>
      <el-col :span="6"><div class="sc success"><div class="sn">{{ overriddenCount }}</div><div class="sl">已覆写</div></div></el-col>
      <el-col :span="6"><div class="sc plain"><div class="sn">{{ hiddenCount }}</div><div class="sl">菜单中隐藏</div></div></el-col>
      <el-col :span="6"><div class="sc plain"><div class="sn">{{ externalCount }}</div><div class="sl">外链菜单</div></div></el-col>
    </el-row>

    <div class="filter">
      <el-input v-model="q" size="small" placeholder="按路径或标题筛选" clearable style="width:240px" />
      <el-select v-model="gFilter" size="small" placeholder="全部分组" clearable style="width:160px;margin-left:8px">
        <el-option v-for="g in groupList" :key="g.key" :label="g.label" :value="g.key" />
      </el-select>
    </div>

    <div class="table-wrap">
      <el-table :data="filtered" size="small" style="width:100%" height="100%"
                :row-class-name="rowClass">
        <el-table-column prop="group" label="分组" width="130">
          <template #default="{ row }">
            <span class="dim">{{ groupLabel(row.group) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="170">
          <template #default="{ row }">
            <span :class="{ off: !row.visible }">{{ row.title }}</span>
            <el-tag v-if="row.external" size="small" :type="row.embed ? 'success' : 'warning'"
                    style="margin-left:6px">{{ row.embed ? '插件应用' : '外链' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路径" min-width="180">
          <template #default="{ row }">
            <code class="p">{{ row.path }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="排序" width="70" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag v-if="row._overridden" size="small" type="success">已覆写</el-tag>
            <el-tag v-else size="small" type="info">默认</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="right">
          <template #default="{ row }">
            <el-button size="small" link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button size="small" link type="danger" :disabled="!row._overridden"
                       @click="doRevert(row)">还原</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="vis" :title="fm._creating ? '新建外链菜单' : '编辑菜单'" width="480px">
      <el-form :model="fm" label-width="80px">
        <el-form-item label="路径">
          <el-input v-model="fm.path" :disabled="!fm._creating" placeholder="/iot/legacy 或 /external/xxx" />
        </el-form-item>
        <el-form-item label="标题"><el-input v-model="fm.title" /></el-form-item>
        <el-form-item label="图标">
          <el-input v-model="fm.icon" placeholder="Element Plus 图标名，如 Monitor" />
        </el-form-item>
        <el-form-item label="分组">
          <el-select v-model="fm.group" style="width:100%">
            <el-option v-for="g in groupList" :key="g.key" :label="g.label" :value="g.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序"><el-input-number v-model="fm.order" :min="0" :max="99" :step="0.5" /></el-form-item>
        <el-form-item label="外链地址">
          <el-input v-model="fm.external" placeholder="留空 = 普通页面；填了则按下面的方式打开" />
        </el-form-item>
        <el-form-item label="内嵌打开">
          <el-switch v-model="fm.embed" :disabled="!fm.external" />
          <span class="embed-hint">
            {{ fm.embed
              ? '在底座布局内打开（iframe，侧栏顶栏保留）—— 插件应用走这个'
              : '新窗口打开 —— 普通外链走这个' }}
          </span>
        </el-form-item>
        <el-form-item label="菜单可见"><el-switch v-model="fm.visible" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="vis=false">取消</el-button>
        <el-button type="primary" @click="doSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMenus, saveMenu, deleteMenu, resetMenus } from '../api/admin'
import { constantRoutes } from '../router'
import { MENU_GROUPS } from '../utils/constants'

// 通知 AppLayout 重新拉覆写 —— 否则侧边栏要刷新整页才认这里的改动
function notifyMenuChanged() {
  window.dispatchEvent(new CustomEvent('dgiot:menus-changed'))
}

const overrides = ref([])
const q = ref('')
const gFilter = ref('')
const vis = ref(false)
const fm = ref({})

// 静态路由 = 页面的真实来源
const staticItems = computed(() => {
  const kids = constantRoutes.find(r => r.path === '/')?.children || []
  return kids.map(r => ({
    path: r.path,
    title: r.meta?.title || r.path,
    icon: r.meta?.icon || '',
    group: r.meta?.group || 'base',
    order: 99,
    visible: !r.meta?.hidden,
    external: r.meta?.external || '',
    embed: !!r.meta?.embed,
    _static: true,
  }))
})

// 合并：静态为底，覆写盖上；覆写里有、静态里没有的（外链菜单）单独补上
const rows = computed(() => {
  const ovMap = Object.fromEntries(overrides.value.map(o => [o.path, o]))
  const out = staticItems.value.map(s => {
    const o = ovMap[s.path]
    delete ovMap[s.path]
    return o
      ? { ...s, title: o.title || s.title, icon: o.icon || s.icon, group: o.group || s.group,
          order: o.order ?? s.order, visible: o.visible !== false, external: o.external || s.external,
          embed: o.embed ?? s.embed,
          _overridden: true, _oid: o.objectId }
      : { ...s, _overridden: false }
  })
  Object.values(ovMap).forEach(o => out.push({
    path: o.path, title: o.title || o.path, icon: o.icon || '', group: o.group || 'base',
    order: o.order ?? 99, visible: o.visible !== false, external: o.external || '',
    embed: !!o.embed,
    _overridden: true, _oid: o.objectId, _custom: true,
  }))
  // 按**侧边栏的实际分组顺序**排（MENU_GROUPS.order），不是按分组键的字母序 ——
  // 字母序会把「底座」排到最前面，跟左侧菜单看到的顺序对不上，改起来容易看错行。
  const gOrder = Object.fromEntries(
    Object.entries(MENU_GROUPS).map(([k, v]) => [k, v.order])
  )
  return out.sort((a, b) =>
    (gOrder[a.group] ?? 99) - (gOrder[b.group] ?? 99) ||
    (a.group || '').localeCompare(b.group || '') ||
    a.order - b.order)
})

const filtered = computed(() => rows.value.filter(r => {
  if (gFilter.value && r.group !== gFilter.value) return false
  if (q.value) {
    const s = q.value.toLowerCase()
    return r.path.toLowerCase().includes(s) || (r.title || '').toLowerCase().includes(s)
  }
  return true
}))

const overriddenCount = computed(() => rows.value.filter(r => r._overridden).length)
const hiddenCount = computed(() => rows.value.filter(r => !r.visible).length)
const externalCount = computed(() => rows.value.filter(r => r.external).length)

const groupList = computed(() => Object.entries(MENU_GROUPS)
  .map(([key, v]) => ({ key, label: v.label, order: v.order }))
  .sort((a, b) => a.order - b.order))

function groupLabel(g) { return MENU_GROUPS[g]?.label || g || '-' }
function rowClass({ row }) { return row.visible ? '' : 'row-off' }

async function load() {
  try {
    const r = await getMenus()
    overrides.value = r.results || []
  } catch (e) { ElMessage.error('加载失败：' + (e?.message || e)) }
}

function openEdit(row) {
  fm.value = {
    _creating: false, path: row.path, title: row.title, icon: row.icon,
    group: row.group || 'base', order: row.order ?? 99,
    external: row.external || '', embed: !!row.embed, visible: row.visible !== false,
  }
  vis.value = true
}

function openCreate() {
  fm.value = { _creating: true, path: '', title: '', icon: 'Link', group: 'base',
               order: 50, external: 'https://', embed: false, visible: true }
  vis.value = true
}

async function doSave() {
  if (!fm.value.path?.trim()) { ElMessage.warning('路径不能为空'); return }
  try {
    await saveMenu({
      path: fm.value.path.trim(), title: fm.value.title || '', icon: fm.value.icon || '',
      group: fm.value.group || '', order: Number(fm.value.order) || 0,
      visible: fm.value.visible !== false, external: fm.value.external || '',
      embed: !!fm.value.embed,
    })
    ElMessage.success('已保存')
    vis.value = false
    notifyMenuChanged()
    await load()
  } catch (e) { ElMessage.error('保存失败：' + (e?.message || e)) }
}

async function doRevert(row) {
  try {
    await ElMessageBox.confirm(`还原「${row.title}」的默认展示？页面本身不受影响。`, '确认', { type: 'warning' })
  } catch { return }
  try {
    await deleteMenu(row.path)
    ElMessage.success('已还原')
    notifyMenuChanged()
    await load()
  } catch (e) { ElMessage.error('还原失败：' + (e?.message || e)) }
}

async function doReset() {
  try {
    await ElMessageBox.confirm('清空全部菜单覆写，所有菜单回到代码里的默认样子？', '确认', { type: 'warning' })
  } catch { return }
  try {
    const r = await resetMenus()
    ElMessage.success(`已还原 ${r.deleted || 0} 条`)
    notifyMenuChanged()
    await load()
  } catch (e) { ElMessage.error('操作失败：' + (e?.message || e)) }
}

onMounted(load)
</script>

<style scoped>
.menu-page { color:#c0d5e8; display:flex; flex-direction:column; height:calc(100vh - 100px); }
.toolbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.sc { padding:10px 12px; border-radius:6px; text-align:center; }
.sc.primary { background:linear-gradient(135deg,#152a40,#1a3550); border:1px solid #1e3a5f; }
.sc.success { background:linear-gradient(135deg,#103a10,#154a15); border:1px solid #205a20; }
.sc.plain { background:#152a40; border:1px solid #1e3a5f; }
.sn { font-size:22px; font-weight:bold; } .sl { font-size:11px; color:#6a8aaa; }
.filter { margin-bottom:8px; display:flex; }
.table-wrap { flex:1; min-height:0; border:1px solid #1e3a5f; border-radius:6px; overflow:hidden; background:#0a1a2a; }
.p { font-size:11px; color:#66d9ff; font-family:Consolas,monospace; }
.dim { font-size:12px; color:#8aa0b4; }
.off { color:#6a8aaa; text-decoration:line-through; }
.embed-hint { margin-left:10px; font-size:12px; color:#8aa0b4; }
:deep(.row-off) { opacity:.55; }
</style>
