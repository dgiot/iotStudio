<template>
  <div class="bi-embed">
    <div class="bi-toolbar">
      <span class="bi-title">BI 看板（中枢 Superset）</span>
      <el-input v-model="urlInput" size="small" class="bi-url" clearable
                placeholder="粘贴 Superset 看板 URL，如 http://<host>:8088/superset/dashboard/<id>/?standalone=3" />
      <el-button size="small" type="primary" :disabled="!urlInput" @click="saveUrl">加载</el-button>
      <el-button size="small" :disabled="!url" @click="openExternal">新窗口</el-button>
      <el-button size="small" :disabled="!url" @click="clearUrl">清除</el-button>
    </div>

    <div v-if="url" class="bi-frame-wrap">
      <iframe :src="frameSrc" class="bi-frame" frameborder="0" allowfullscreen />
      <div class="bi-note">若空白：Superset 需配置 frame-ancestors 允许本管理台来源（见 docs/HUB-EVAL）</div>
    </div>

    <el-empty v-else description="尚未配置看板地址" class="bi-empty">
      <div class="bi-guide">
        <p>1. 中枢侧部署 Superset（评估结论：P1 试点，见 docs/HUB-EVAL-2026-09.md）</p>
        <p>2. 数据源连 TDengine（taosws://root:***@&lt;host&gt;:6041/&lt;db&gt;）</p>
        <p>3. 建看板后复制 URL 粘贴到上方输入框</p>
      </div>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const LS_KEY = 'dgiot_bi_url'
const url = ref('')
const urlInput = ref('')

// standalone=3 隐藏 Superset 顶部导航, 只嵌看板主体
const frameSrc = computed(() => {
  if (!url.value) return ''
  return url.value.includes('?') ? `${url.value}&standalone=3` : `${url.value}?standalone=3`
})

onMounted(() => {
  url.value = localStorage.getItem(LS_KEY) || ''
  urlInput.value = url.value
})

function saveUrl() {
  const u = (urlInput.value || '').trim()
  if (!u) return
  if (!/^https?:\/\//i.test(u)) {
    ElMessage.warning('URL 需以 http(s):// 开头')
    return
  }
  localStorage.setItem(LS_KEY, u)
  url.value = u
  ElMessage.success('看板已加载')
}

function clearUrl() {
  localStorage.removeItem(LS_KEY)
  url.value = ''
  urlInput.value = ''
}

function openExternal() {
  if (url.value) window.open(url.value, '_blank')
}
</script>

<style scoped>
.bi-embed { display: flex; flex-direction: column; height: calc(100vh - 84px); }
.bi-toolbar { display: flex; gap: 8px; align-items: center; padding: 8px 4px; }
.bi-title { font-weight: 600; color: #dce8f5; white-space: nowrap; font-size: 13px; }
.bi-url { flex: 1; }
.bi-frame-wrap { flex: 1; display: flex; flex-direction: column; border: 1px solid #1f3350; border-radius: 8px; overflow: hidden; background: #0b1526; }
.bi-frame { flex: 1; width: 100%; border: 0; }
.bi-note { color: #5a708a; font-size: 11px; padding: 4px 8px; border-top: 1px solid #1f3350; }
.bi-empty { margin-top: 12vh; }
.bi-guide { text-align: left; color: #8aa0b4; font-size: 12px; line-height: 1.9; }
</style>
