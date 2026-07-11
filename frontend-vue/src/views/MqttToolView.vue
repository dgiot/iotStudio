<template>
  <div class="mqtt-page">
    <h3>📡 MQTT 调试工具</h3>
    <el-row :gutter="16" style="margin-top:16px">
      <!-- 连接配置 -->
      <el-col :span="8">
        <el-card class="sec-card">
          <template #header><span>🔌 连接配置</span></template>
          <el-form label-width="70px" size="small">
            <el-form-item label="主机"><el-input v-model="conn.host" /></el-form-item>
            <el-form-item label="端口"><el-input-number v-model="conn.port" :min="1" :max="65535" /></el-form-item>
            <el-form-item label="ClientID"><el-input v-model="conn.clientId" /></el-form-item>
            <el-form-item label="用户名"><el-input v-model="conn.user" /></el-form-item>
            <el-form-item label="密码"><el-input v-model="conn.pass" type="password" show-password /></el-form-item>
            <el-form-item>
              <el-button :type="connected?'danger':'primary'" size="small" @click="toggleConnect">
                {{ connected ? '断开' : '连接' }}
              </el-button>
              <el-tag :type="connected?'success':'info'" size="small" style="margin-left:8px">
                {{ connected ? '已连接' : '未连接' }}
              </el-tag>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 发布 -->
      <el-col :span="8">
        <el-card class="sec-card">
          <template #header><span>📤 发布消息</span></template>
          <el-form label-width="60px" size="small">
            <el-form-item label="主题"><el-input v-model="pub.topic" placeholder="$dg/device/inv_01/data" /></el-form-item>
            <el-form-item label="QoS"><el-radio-group v-model="pub.qos"><el-radio :value="0">0</el-radio><el-radio :value="1">1</el-radio><el-radio :value="2">2</el-radio></el-radio-group></el-form-item>
            <el-form-item label="消息">
              <el-input v-model="pub.payload" type="textarea" :rows="4" placeholder='{"device_id":"inv_01","power":3480}' />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="doPublish" :disabled="!connected">🚀 发布</el-button>
              <el-button size="small" @click="pub.payload=''">清空</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 订阅 -->
      <el-col :span="8">
        <el-card class="sec-card">
          <template #header><span>📥 订阅主题</span></template>
          <el-form label-width="60px" size="small">
            <el-form-item label="主题"><el-input v-model="sub.topic" placeholder="$dg/device/+/data" /></el-form-item>
            <el-form-item label="QoS"><el-radio-group v-model="sub.qos"><el-radio :value="0">0</el-radio><el-radio :value="1">1</el-radio></el-radio-group></el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="doSubscribe" :disabled="!connected">📥 订阅</el-button>
              <el-button size="small" @click="doUnsubscribe" :disabled="!connected">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- 消息日志 -->
    <el-card class="sec-card" style="margin-top:16px">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>📋 消息日志 ({{ messages.length }})</span>
          <el-button size="small" @click="messages=[]">清空</el-button>
        </div>
      </template>
      <div class="msg-log" ref="msgLog">
        <div v-if="!messages.length" class="msg-empty">暂无消息，订阅主题后等待数据推送</div>
        <div v-for="(m,i) in messages" :key="i" class="msg-row" :class="m.dir">
          <span class="msg-time">{{ m.time }}</span>
          <span class="msg-dir">{{ m.dir === 'rx' ? '↓' : '↑' }}</span>
          <span class="msg-topic">{{ m.topic }}</span>
          <span class="msg-body">{{ m.payload }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import mqtt from 'mqtt/dist/mqtt.esm'

const conn = reactive({ host:'127.0.0.1', port:1883, clientId:'dgiot_mqtt_tool_'+Date.now()%10000, user:'', pass:'' })
const pub = reactive({ topic:'', qos:0, payload:'{}' })
const sub = reactive({ topic:'$dg/device/+/data', qos:0 })
const connected = ref(false)
const messages = ref([])
let client = null

function toggleConnect() {
  if (client) { client.end(); client=null; connected.value=false; return }
  const opts = { clientId: conn.clientId, clean: true, connectTimeout: 5000 }
  if (conn.user) { opts.username=conn.user; opts.password=conn.pass }
  try {
    client = mqtt.connect(`ws://${conn.host}:8083/mqtt`, opts)
  } catch {
    try { client = mqtt.connect(`mqtt://${conn.host}:${conn.port}`, opts) } catch (e) {
      ElMessage.error('连接失败: '+e.message); return
    }
  }
  client.on('connect', () => { connected.value = true; ElMessage.success('MQTT 已连接') })
  client.on('error', (e) => { ElMessage.error('MQTT 错误: '+e.message) })
  client.on('close', () => { connected.value = false })
  client.on('message', (topic, payload) => {
    messages.value.unshift({ time: new Date().toLocaleTimeString(), dir:'rx', topic, payload: payload.toString() })
    if (messages.value.length > 200) messages.value = messages.value.slice(0, 100)
  })
}

function doPublish() {
  if (!client) return
  client.publish(pub.topic, pub.payload, { qos: pub.qos })
  messages.value.unshift({ time: new Date().toLocaleTimeString(), dir:'tx', topic: pub.topic, payload: pub.payload })
  ElMessage.success('已发布')
}

function doSubscribe() {
  if (!client) return
  client.subscribe(sub.topic, { qos: sub.qos })
  ElMessage.success(`已订阅: ${sub.topic}`)
}

function doUnsubscribe() {
  if (!client) return
  client.unsubscribe(sub.topic)
  ElMessage.success(`已取消: ${sub.topic}`)
}

onUnmounted(() => { if (client) client.end() })
</script>

<style scoped>
.mqtt-page h3 { color: #e8f0f8; margin: 0; }
.sec-card { margin-bottom: 0; }
.msg-log { max-height: 300px; overflow-y: auto; font-family: monospace; font-size: 12px; }
.msg-empty { text-align: center; color: #c0d5e8; padding: 30px; }
.msg-row { display: flex; gap: 8px; padding: 4px 8px; border-bottom: 1px solid #234060; align-items: flex-start; }
.msg-row:hover { background: rgba(79,195,247,0.05); }
.msg-time { color: #8aa0b4; width: 70px; flex-shrink: 0; }
.msg-dir { width: 16px; flex-shrink: 0; font-weight: bold; }
.msg-row.tx .msg-dir { color: #ffa726; }
.msg-row.rx .msg-dir { color: #66bb6a; }
.msg-topic { color: #66d9ff; width: 180px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; }
.msg-body { color: #d0e0ee; word-break: break-all; }
</style>
