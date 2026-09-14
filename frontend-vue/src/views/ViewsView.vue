<template>
  <div class="view-page">
    <div class="toolbar">
      <h3 style="color:#c0d5e8;margin:0">🗂️ 视图管理</h3>
      <div>
        <el-button size="small" @click="load">↻ 刷新</el-button>
      </div>
    </div>

    <el-alert type="info" :closable="false" style="margin-bottom:12px">
      <template #title>
        <span style="font-size:12px">
          组态与拓扑画布的<b>后端存档</b>。原先画布只写 <code>localStorage</code>——
          换台机器就没了、别人也看不到。这里存的是可命名、可多份、可设默认的正式对象。
          <br />在 <b>2D 组态</b> / <b>设备拓扑</b> 页保存时，会落到这里；页面打开时加载该类型的默认视图。
        </span>
      </template>
    </el-alert>

    <el-row :gutter="12" style="margin-bottom:12px">
      <el-col :span="6"><div class="sc primary"><div class="sn">{{ views.length }}</div><div class="sl">视图总数</div></div></el-col>
      <el-col :span="6"><div class="sc success"><div class="sn">{{ byType.scada }}</div><div class="sl">2D 组态</div></div></el-col>
      <el-col :span="6"><div class="sc plain"><div class="sn">{{ byType.topology }}</div><div class="sl">设备拓扑</div></div></el-col>
      <el-col :span="6"><div class="sc plain"><div class="sn">{{ sizeText(totalSize) }}</div><div class="sl">画布总占用</div></div></el-col>
    </el-row>

    <div class="filter">
      <el-radio-group v-model="typeFilter" size="small" @change="load">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button value="scada">2D 组态</el-radio-button>
        <el-radio-button value="topology">设备拓扑</el-radio-button>
        <el-radio-button value="report">数据报表</el-radio-button>
      </el-radio-group>
    </div>

    <div class="table-wrap">
      <el-table :data="views" size="small" style="width:100%" height="100%">
        <el-table-column prop="name" label="名称" min-width="180">
          <template #default="{ row }">
            <span style="color:#e0e0e0">{{ row.name }}</span>
            <el-tag v-if="row.isDefault" size="small" type="success" effect="dark" style="margin-left:6px">默认</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type_name" label="类型" width="110" />
        <el-table-column prop="node_count" label="节点" width="70" />
        <el-table-column label="画布大小" width="100">
          <template #default="{ row }">{{ sizeText(row.canvas_size) }}</template>
        </el-table-column>
        <el-table-column prop="createdBy" label="创建人" width="110" />
        <el-table-column label="更新时间" width="160">
          <template #default="{ row }">{{ f(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="230" align="right">
          <template #default="{ row }">
            <el-button size="small" link type="primary" @click="openPreview(row)">查看</el-button>
            <el-button size="small" link type="primary" @click="openRename(row)">重命名</el-button>
            <el-button size="small" link type="success" :disabled="row.isDefault"
                       @click="doDefault(row)">设默认</el-button>
            <el-button size="small" link type="danger" @click="doDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty">
            还没有保存过视图。<br />
            到「2D 组态」或「设备拓扑」页画一张，点保存就会出现在这里。
          </div>
        </template>
      </el-table>
    </div>

    <el-dialog v-model="visRename" title="重命名视图" width="400px">
      <el-form label-width="70px">
        <el-form-item label="名称"><el-input v-model="editName" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="editDesc" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visRename=false">取消</el-button>
        <el-button type="primary" @click="doRename">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="visPreview" :title="'画布预览 — ' + (pv?.name || '')" width="640px">
      <div class="pv-meta">
        <el-tag size="small">{{ pv?.type_name }}</el-tag>
        <span class="dim">节点 {{ pv?.node_count }} · 大小 {{ sizeText(pv?.canvas_size) }}</span>
      </div>
      <pre class="pv-json">{{ pvText }}</pre>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getViews, getView, updateView, deleteView, setDefaultView } from '../api/admin'

const views = ref([])
const typeFilter = ref('')
const visRename = ref(false)
const visPreview = ref(false)
const editName = ref('')
const editDesc = ref('')
const editId = ref('')
const pv = ref(null)
const pvText = ref('')

const byType = computed(() => ({
  scada: views.value.filter(v => v.type === 'scada').length,
  topology: views.value.filter(v => v.type === 'topology').length,
}))
const totalSize = computed(() => views.value.reduce((s, v) => s + (v.canvas_size || 0), 0))

function sizeText(n) {
  if (!n) return '0 B'
  if (n < 1024) return n + ' B'
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB'
  return (n / 1024 / 1024).toFixed(2) + ' MB'
}
function f(ts) { return ts ? new Date(ts).toLocaleString() : '-' }

async function load() {
  try {
    const r = await getViews(typeFilter.value)
    views.value = r.results || []
  } catch (e) { ElMessage.error('加载失败：' + (e?.message || e)) }
}

function openRename(row) {
  editId.value = row.objectId
  editName.value = row.name
  editDesc.value = row.desc || ''
  visRename.value = true
}

async function doRename() {
  if (!editName.value.trim()) { ElMessage.warning('名称不能为空'); return }
  try {
    // canvas 不传 = 本次不动画布，只改名（见后端 update_view 的约定）
    await updateView(editId.value, { name: editName.value.trim(), desc: editDesc.value })
    ElMessage.success('已保存')
    visRename.value = false
    await load()
  } catch (e) { ElMessage.error('保存失败：' + (e?.message || e)) }
}

async function doDefault(row) {
  try {
    await setDefaultView(row.objectId)
    ElMessage.success(`「${row.name}」已设为 ${row.type_name} 的默认视图`)
    await load()
  } catch (e) { ElMessage.error('设置失败：' + (e?.message || e)) }
}

async function doDelete(row) {
  try {
    await ElMessageBox.confirm(`删除视图「${row.name}」？画布存档会一并删除。`, '确认', { type: 'warning' })
  } catch { return }
  try {
    await deleteView(row.objectId)
    ElMessage.success('已删除')
    await load()
  } catch (e) { ElMessage.error('删除失败：' + (e?.message || e)) }
}

async function openPreview(row) {
  try {
    const full = await getView(row.objectId)
    pv.value = row
    const c = full.canvas
    let obj = c
    if (typeof c === 'string') { try { obj = JSON.parse(c) } catch { obj = c } }
    pvText.value = typeof obj === 'string' ? obj.slice(0, 4000) : JSON.stringify(obj, null, 2).slice(0, 4000)
    visPreview.value = true
  } catch (e) { ElMessage.error('读取失败：' + (e?.message || e)) }
}

onMounted(load)
</script>

<style scoped>
.view-page { color:#c0d5e8; display:flex; flex-direction:column; height:calc(100vh - 100px); }
.toolbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.sc { padding:10px 12px; border-radius:6px; text-align:center; }
.sc.primary { background:linear-gradient(135deg,#152a40,#1a3550); border:1px solid #1e3a5f; }
.sc.success { background:linear-gradient(135deg,#103a10,#154a15); border:1px solid #205a20; }
.sc.plain { background:#152a40; border:1px solid #1e3a5f; }
.sn { font-size:22px; font-weight:bold; } .sl { font-size:11px; color:#6a8aaa; }
.filter { margin-bottom:8px; }
.table-wrap { flex:1; min-height:0; border:1px solid #1e3a5f; border-radius:6px; overflow:hidden; background:#0a1a2a; }
.dim { font-size:12px; color:#8aa0b4; }
.empty { padding:32px; text-align:center; color:#5a7a9a; font-size:12px; line-height:2; }
.pv-meta { margin-bottom:8px; display:flex; align-items:center; gap:10px; }
.pv-json { max-height:420px; overflow:auto; background:#0a1a2a; color:#8aa0b4; font-size:11px;
           font-family:Consolas,monospace; padding:10px; border-radius:4px; border:1px solid #1e3a5f; }
</style>
