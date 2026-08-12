<template>
  <el-popover placement="bottom-end" :width="320" trigger="click">
    <template #reference>
      <el-badge :value="unreadCount" :hidden="!unreadCount" :max="99">
        <el-button link size="small" style="font-size:18px">🔔</el-button>
      </el-badge>
    </template>
    <div class="notify-list">
      <div class="notify-title">📬 通知中心</div>
      <div v-if="!notifications.length" class="notify-empty">暂无通知</div>
      <div v-for="n in notifications" :key="n.id" class="notify-item" :class="{unread: !n.read}" @click="markRead(n)">
        <div class="notify-icon">{{ iconMap[n.type] || '📌' }}</div>
        <div class="notify-body">
          <div class="notify-msg">{{ n.msg }}</div>
          <div class="notify-meta">
            <el-tag :type="levelTag[n.level]" size="small" effect="dark">{{ n.level }}</el-tag>
            <span class="notify-time">{{ n.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const notifications = ref([])
const iconMap = { alarm:'🚨', info:'ℹ️', system:'⚙️', device:'📟' }
const levelTag = { P0:'danger', P1:'warning', P2:'info' }

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

let timer = null

async function loadAlarms() {
  try {
    const r = await fetch('/api/alarms?status=active&limit=20')
    const d = await r.json()
    const alarms = (d.alarms || []).slice(0, 10).map(a => ({
      id: a.alarm_id,
      type: 'alarm',
      msg: `[${a.device_id}] ${a.alarm_msg}`,
      level: a.alarm_level || 'P2',
      time: (a.created_at || '').slice(0, 19) || '--',
      read: false,
    }))
    notifications.value = alarms
  } catch {}
}

function markRead(n) { n.read = true }

onMounted(() => { loadAlarms(); timer = setInterval(loadAlarms, 30000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.notify-list { max-height: 360px; overflow-y: auto; }
.notify-title { color: #e8f0f8; font-size: 14px; font-weight: bold; margin-bottom: 8px; }
.notify-empty { text-align: center; color: #c0d5e8; padding: 20px; font-size: 13px; }
.notify-item { display: flex; gap: 10px; padding: 8px; border-radius: 6px; cursor: pointer; margin-bottom: 4px; }
.notify-item:hover { background: #1e3a58; }
.notify-item.unread { background: rgba(79,195,247,0.06); }
.notify-icon { font-size: 20px; flex-shrink: 0; }
.notify-body { flex: 1; min-width: 0; }
.notify-msg { font-size: 13px; color: #d0e0ee; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; }
.notify-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.notify-time { font-size: 11px; color: #8aa0b4; }
</style>
