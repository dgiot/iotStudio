<template>
  <div class="amis-page">
    <el-row :gutter="12">
      <!-- 左: 编辑 Product.thing -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>📝 Product.thing 编辑</span>
            <el-select v-model="pid" @change="loadProduct" size="small" style="width:180px;margin-left:12px">
              <el-option v-for="p in products" :key="p" :label="p" :value="p" />
            </el-select>
            <el-button size="small" type="primary" @click="saveThing" style="margin-left:8px">保存</el-button>
          </template>
          <el-tabs v-model="editTab">
            <el-tab-pane label="测点" name="props">
              <div v-for="(p, i) in editThing.properties" :key="i" class="prop-row">
                <el-input v-model="p.identifier" size="small" placeholder="标识" style="width:100px" />
                <el-input v-model="p.name" size="small" placeholder="名称" style="width:100px" />
                <el-input v-model="p.dataType.specs.unit" size="small" placeholder="单位" style="width:60px" />
                <el-input-number v-model="p.dataType.specs.min" size="small" :min="0" style="width:80px" />
                <el-input-number v-model="p.dataType.specs.max" size="small" :min="0" style="width:80px" />
                <el-button size="small" type="danger" circle @click="editThing.properties.splice(i,1)">×</el-button>
              </div>
              <el-button size="small" @click="editThing.properties.push({identifier:'new',name:'新测点',dataType:{type:'FLOAT',specs:{min:0,max:1000,unit:''}}})">+ 添加测点</el-button>
            </el-tab-pane>
            <el-tab-pane label="告警" name="events">
              <div v-for="(e, i) in editThing.events" :key="i" class="prop-row">
                <el-input v-model="e.identifier" size="small" placeholder="标识" style="width:100px" />
                <el-input v-model="e.name" size="small" placeholder="名称" style="width:100px" />
                <el-input v-model="e.rule" size="small" placeholder="规则如 Ia>400" style="width:150px" />
                <el-button size="small" type="danger" circle @click="editThing.events.splice(i,1)">×</el-button>
              </div>
              <el-button size="small" @click="editThing.events.push({identifier:'new_alarm',name:'新告警',type:'alarm',rule:''})">+ 添加告警</el-button>
            </el-tab-pane>
            <el-tab-pane label="JSON" name="json">
              <el-input v-model="thingJson" type="textarea" rows="15" @blur="parseJson" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <!-- 右: AMIS 渲染预览 -->
      <el-col :span="12">
        <el-card>
          <template #header>👁 实时预览 (AMIS渲染)</template>
          <div v-if="previewSchema" class="preview-wrap">
            <h4 style="color:#e0e0e0;margin-bottom:8px">{{ pid }} — 自动生成页面</h4>
            <div class="preview-card" v-for="p in editThing.properties" :key="p.identifier">
              <label>{{ p.name }} ({{ p.identifier }})</label>
              <span class="pv-unit">{{ p.dataType?.specs?.unit || '' }}</span>
              <div style="color:#909399;font-size:11px">范围: {{ p.dataType?.specs?.min || 0 }} ~ {{ p.dataType?.specs?.max || '∞' }}</div>
            </div>
            <div style="margin-top:12px" v-if="editThing.events?.length">
              <h4 style="color:#e0e0e0">告警规则</h4>
              <el-alert v-for="e in editThing.events" :key="e.identifier"
                :title="e.name" :description="e.rule" type="warning" show-icon :closable="false" style="margin-bottom:4px" />
            </div>
          </div>
          <div v-else style="color:#909399;padding:20px">选择 Product 编辑 thing 后预览</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const pid = ref('oilwell')
const products = ref([])
const editTab = ref('props')
const editThing = ref({ properties: [], events: [], services: [], tags: [] })
const previewSchema = ref(null)

const thingJson = computed({
  get: () => JSON.stringify(editThing.value, null, 2),
  set: (v) => { try { editThing.value = JSON.parse(v) } catch {} }
})

function parseJson() { try { editThing.value = JSON.parse(thingJson.value) } catch {} }

onMounted(async () => {
  const r = await fetch('/api/classes/Product?limit=20')
  const d = await r.json()
  products.value = (d.results||[]).map(p => p.objectId)
  loadProduct()
})

async function loadProduct() {
  const r = await fetch(`/api/classes/Product/${pid.value}`)
  const prod = await r.json()
  editThing.value = prod.thing || { properties: [], events: [], services: [], tags: [] }
  previewSchema.value = editThing.value
}

async function saveThing() {
  await fetch(`/api/classes/Product/${pid.value}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ thing: editThing.value })
  })
  ElMessage.success('已保存 — 前端零代码, AMIS自动渲染')
}
</script>

<style scoped>
.amis-page { padding: 12px; color: #c0d5e8; }
.prop-row { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; }
.preview-wrap { }
.preview-card { background: #1a2d45; border: 1px solid #2a4a70; border-radius: 6px; padding: 10px 14px; margin-bottom: 6px; display:flex; align-items:center; justify-content:space-between; }
.pv-unit { color: #66d9ff; font-size: 11px; background: #0d1f33; padding: 2px 8px; border-radius: 4px; }
</style>
