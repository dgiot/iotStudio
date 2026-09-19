<template>
  <div class="onto-page">
    <div class="toolbar">
      <h3 style="color:#c0d5e8;margin:0">🧬 本体管理</h3>
      <div>
        <el-button size="small" @click="load">↻ 刷新</el-button>
        <el-button size="small" @click="visImport = true">⇪ 批量导入</el-button>
        <el-button size="small" type="primary" @click="openCreate">+ 新建对象</el-button>
      </div>
    </div>

    <el-alert type="info" :closable="false" style="margin-bottom:12px">
      <template #title>
        <span style="font-size:12px">
          本体是五层嵌套结构：<b>站点 → 网关 → 通道 → 设备 → 测点</b>。
          建下层对象时，父层必须已存在（后端会拦）。另有一类独立的<b>约束</b>。
          <br />对象用于给采集数据定语义骨架；「图谱分析 / 本体图谱 / 知识图谱问答」三页读的都是这份数据。
        </span>
      </template>
    </el-alert>

    <el-row :gutter="12" style="margin-bottom:12px">
      <el-col :span="6"><div class="sc primary"><div class="sn">{{ total }}</div><div class="sl">对象总数</div></div></el-col>
      <el-col :span="6"><div class="sc success"><div class="sn">{{ countOf('device') }}</div><div class="sl">设备</div></div></el-col>
      <el-col :span="6"><div class="sc plain"><div class="sn">{{ countOf('point') }}</div><div class="sl">测点</div></div></el-col>
      <el-col :span="6"><div class="sc plain"><div class="sn">{{ countOf('channel') }}</div><div class="sl">通道</div></div></el-col>
    </el-row>

    <div class="filter">
      <el-radio-group v-model="layer" size="small" @change="load">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button v-for="l in LAYERS" :key="l.key" :value="l.key">{{ l.label }}</el-radio-button>
      </el-radio-group>
      <el-input v-model="q" size="small" placeholder="搜索名称 / ID" clearable
                style="width:200px;margin-left:12px" @keyup.enter="load" @clear="load" />
      <el-button size="small" style="margin-left:8px" @click="load">搜索</el-button>
    </div>

    <div class="table-wrap">
      <el-table :data="objects" size="small" style="width:100%" height="100%">
        <el-table-column prop="layer" label="层级" width="110">
          <template #default="{ row }">
            <el-tag size="small" :type="layerTagType(row.layer)">{{ layerLabel(row.layer) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" min-width="160">
          <template #default="{ row }"><code class="p">{{ row.id }}</code></template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="160" />
        <el-table-column prop="type" label="类型/协议" width="130" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <span v-if="row.status" class="dim">{{ row.status }}</span>
            <span v-else class="dim">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" align="right">
          <template #default="{ row }">
            <el-button size="small" link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button size="small" link type="danger" @click="doDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty">
            还没有本体对象。<br />
            从「站点」开始建，再逐层往下挂网关 / 通道 / 设备 / 测点；或用「批量导入」贴 JSON。
          </div>
        </template>
      </el-table>
    </div>

    <!-- 新建 / 编辑 -->
    <el-dialog v-model="vis" :title="isEdit ? '编辑本体对象' : '新建本体对象'" width="520px">
      <el-form :model="fm" label-width="90px">
        <el-form-item label="层级">
          <el-select v-model="fm.layer" :disabled="isEdit" style="width:100%" @change="onLayerChange">
            <el-option v-for="l in LAYERS" :key="l.key" :label="l.label" :value="l.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="ID">
          <el-input v-model="fm.id" :disabled="isEdit" placeholder="唯一标识，如 dev_boiler_01" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="fm.name" placeholder="给人看的名字" />
        </el-form-item>

        <!-- 父层引用：下拉列出已有对象，省得手抄 ID 抄错 -->
        <el-form-item v-if="parentLayer" :label="parentLayer.label + '（上级）'">
          <el-select v-model="fm.props[parentLayer.field]" clearable filterable
                     :placeholder="`选择上级 ${parentLayer.label}`" style="width:100%">
            <el-option v-for="o in parentOptions" :key="o.id" :label="`${o.name} (${o.id})`" :value="o.id" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="fm.layer === 'gateway'" label="IP">
          <el-input v-model="fm.props.ip" placeholder="如 192.0.2.10" />
        </el-form-item>
        <el-form-item v-if="hasProtocol" label="协议">
          <el-select v-model="fm.props.protocol" style="width:100%">
            <el-option v-for="p in PROTOCOLS" :key="p" :label="p" :value="p" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="fm.layer === 'device'" label="设备类型">
          <el-input v-model="fm.props.type" placeholder="如 rtu / plc / sensor" />
        </el-form-item>

        <el-form-item label="其它属性">
          <el-input v-model="extraJson" type="textarea" :rows="3"
                    placeholder='JSON，如 {"unit":"℃","addr":40001}（留空即可）' />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="vis=false">取消</el-button>
        <el-button type="primary" @click="doSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 批量导入 -->
    <el-dialog v-model="visImport" title="批量导入本体对象" width="620px">
      <div class="hint">
        JSON 数组，每项 <code>{layer, id, name, props}</code>。按数组顺序创建，
        <b>父层要排在子层前面</b>（先 site 后 gateway）。
      </div>
      <el-input v-model="importText" type="textarea" :rows="12" placeholder='[
  {"layer":"site","id":"site_demo","name":"示范站点","props":{}},
  {"layer":"gateway","id":"gw_01","name":"网关01","props":{"site":"site_demo","ip":"192.0.2.10"}}
]' />
      <template #footer>
        <el-button @click="visImport=false">取消</el-button>
        <el-button @click="fillSample">填示例</el-button>
        <el-button type="primary" @click="doImport">导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../api/graphrag'

const LAYERS = [
  { key: 'site', label: '站点' },
  { key: 'gateway', label: '网关' },
  { key: 'channel', label: '通道' },
  { key: 'device', label: '设备' },
  { key: 'point', label: '测点' },
  { key: 'constraint', label: '约束' },
  { key: 'datasource', label: '数据源' },
]
// 各层的父层引用字段（后端 create 里按这个字段名校验存在性）
const PARENT_OF = {
  gateway: { layer: 'site', field: 'site', label: '站点' },
  channel: { layer: 'gateway', field: 'gateway', label: '网关' },
  device: { layer: 'channel', field: 'channel', label: '通道' },
  point: { layer: 'device', field: 'device', label: '设备' },
}
const PROTOCOLS = ['modbus_tcp', 'modbus_rtu', 'iec104', 'opcua', 'opcda', 'a11', 'http_rest', 'mqtt']

const objects = ref([])
const total = ref(0)
const layer = ref('')
const q = ref('')
const vis = ref(false)
const visImport = ref(false)
const isEdit = ref(false)
const fm = ref({ layer: 'site', id: '', name: '', props: {} })
const extraJson = ref('')
const importText = ref('')
const parentPool = ref({})

const parentLayer = computed(() => PARENT_OF[fm.value.layer] || null)
const parentOptions = computed(() => parentLayer.value ? (parentPool.value[parentLayer.value.layer] || []) : [])
const hasProtocol = computed(() => ['channel', 'device'].includes(fm.value.layer))

function layerLabel(k) { return LAYERS.find(l => l.key === k)?.label || k }
function layerTagType(k) {
  return { site: 'info', gateway: 'success', channel: 'warning', device: 'primary', point: 'danger' }[k] || 'info'
}
function countOf(k) { return objects.value.filter(o => o.layer === k).length }

async function load() {
  try {
    const params = { limit: 200 }
    if (layer.value) params.layer = layer.value
    if (q.value) params.q = q.value
    const r = await api.aipObjects(params)
    objects.value = r.objects || []
    total.value = r.total || objects.value.length
  } catch (e) {
    ElMessage.error('加载失败：' + (e?.message || e))
  }
}

// 拉一份全量父层候选（建对象时下拉用）
async function loadParentPool() {
  try {
    const r = await api.aipObjects({ limit: 200 })
    const pool = {}
    ;(r.objects || []).forEach(o => { (pool[o.layer] = pool[o.layer] || []).push(o) })
    parentPool.value = pool
  } catch { /* 下拉拿不到不算致命，手填 ID 仍可用 */ }
}

function openCreate() {
  isEdit.value = false
  fm.value = { layer: layer.value || 'site', id: '', name: '', props: {} }
  extraJson.value = ''
  loadParentPool()
  vis.value = true
}

function openEdit(row) {
  isEdit.value = true
  fm.value = { layer: row.layer, id: row.id, name: row.name || '', props: {} }
  extraJson.value = ''
  vis.value = true
}

function onLayerChange() { fm.value.props = {}; loadParentPool() }

async function doSave() {
  if (!fm.value.id.trim()) { ElMessage.warning('ID 不能为空'); return }
  let extra = {}
  if (extraJson.value.trim()) {
    try { extra = JSON.parse(extraJson.value) }
    catch { ElMessage.error('「其它属性」不是合法 JSON'); return }
  }
  const props = { ...fm.value.props, ...extra }
  Object.keys(props).forEach(k => { if (props[k] === '' || props[k] == null) delete props[k] })

  try {
    if (isEdit.value) {
      // PUT 直接收属性字典，层与 id 不可改（后端也拦 id）
      await api.aipUpdateObject(fm.value.id, { name: fm.value.name, ...props })
      ElMessage.success('已更新')
    } else {
      await api.aipCreateObject({ layer: fm.value.layer, id: fm.value.id.trim(),
                                  name: fm.value.name, props })
      ElMessage.success('已创建')
    }
    vis.value = false
    await load()
  } catch (e) {
    ElMessage.error((isEdit.value ? '更新' : '创建') + '失败：' + (e?.message || e))
  }
}

async function doDelete(row) {
  try {
    await ElMessageBox.confirm(
      `删除 ${layerLabel(row.layer)}「${row.name || row.id}」？下层对象可能受影响。`,
      '确认', { type: 'warning' })
  } catch { return }
  try {
    await api.aipDeleteObject(row.id)
    ElMessage.success('已删除')
    await load()
  } catch (e) { ElMessage.error('删除失败：' + (e?.message || e)) }
}

function fillSample() {
  importText.value = JSON.stringify([
    { layer: 'site', id: 'site_demo', name: '示范站点', props: {} },
    { layer: 'gateway', id: 'gw_demo_01', name: '示范网关01', props: { site: 'site_demo', ip: '192.0.2.10' } },
    { layer: 'channel', id: 'ch_demo_01', name: '锅炉通道', props: { gateway: 'gw_demo_01', protocol: 'modbus_tcp' } },
    { layer: 'device', id: 'dev_demo_01', name: '锅炉01', props: { channel: 'ch_demo_01', type: 'rtu', protocol: 'modbus' } },
    { layer: 'point', id: 'pt_demo_temp', name: '炉温', props: { device: 'dev_demo_01', unit: '℃' } },
  ], null, 2)
}

async function doImport() {
  let arr
  try { arr = JSON.parse(importText.value) }
  catch { ElMessage.error('不是合法 JSON'); return }
  if (!Array.isArray(arr) || !arr.length) { ElMessage.warning('需要非空数组'); return }
  try {
    const r = await api.aipImportObjects(arr)
    ElMessage.success(`导入完成：新建 ${r.created} · 更新 ${r.updated} · 失败 ${r.errors}`)
    visImport.value = false
    await load()
  } catch (e) { ElMessage.error('导入失败：' + (e?.message || e)) }
}

onMounted(async () => { await load(); await loadParentPool() })
</script>

<style scoped>
.onto-page { color:#c0d5e8; display:flex; flex-direction:column; height:calc(100vh - 100px); }
.toolbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.sc { padding:10px 12px; border-radius:6px; text-align:center; }
.sc.primary { background:linear-gradient(135deg,#152a40,#1a3550); border:1px solid #1e3a5f; }
.sc.success { background:linear-gradient(135deg,#103a10,#154a15); border:1px solid #205a20; }
.sc.plain { background:#152a40; border:1px solid #1e3a5f; }
.sn { font-size:22px; font-weight:bold; } .sl { font-size:11px; color:#6a8aaa; }
.filter { margin-bottom:8px; display:flex; align-items:center; flex-wrap:wrap; gap:6px; }
.table-wrap { flex:1; min-height:0; border:1px solid #1e3a5f; border-radius:6px; overflow:hidden; background:#0a1a2a; }
.p { font-size:11px; color:#66d9ff; font-family:Consolas,monospace; }
.dim { font-size:12px; color:#8aa0b4; }
.empty { padding:32px; text-align:center; color:#5a7a9a; font-size:12px; line-height:2; }
.hint { font-size:12px; color:#8aa0b4; line-height:1.8; margin-bottom:8px; }
.hint code { color:#66d9ff; }
</style>
