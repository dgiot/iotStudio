/**
 * WebSocket 实时数据 — 对标 iotStudio webscroket
 */
import { ref, onMounted, onUnmounted } from 'vue'

export function useWebSocket() {
  const connected = ref(false)
  const lastMessage = ref(null)
  const listeners = new Map()
  let ws = null
  let timer = null

  function connect() {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
    ws = new WebSocket(`${proto}//${location.host}/ws`)

    ws.onopen = () => { connected.value = true; console.log('[ws] connected') }
    ws.onclose = () => { connected.value = false; setTimeout(connect, 3000) }
    ws.onerror = () => { connected.value = false }

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg === 'pong') return
        lastMessage.value = msg

        // 按事件类型分别通知监听器
        const type = msg.type || 'unknown'
        if (listeners.has(type)) {
          listeners.get(type).forEach(fn => fn(msg))
        }
        if (listeners.has('*')) {
          listeners.get('*').forEach(fn => fn(msg))
        }
      } catch {}
    }

    // 心跳
    timer = setInterval(() => {
      if (ws?.readyState === WebSocket.OPEN) ws.send('ping')
    }, 15000)
  }

  function on(type, fn) {
    if (!listeners.has(type)) listeners.set(type, [])
    listeners.get(type).push(fn)
  }

  function off(type, fn) {
    if (!listeners.has(type)) return
    const idx = listeners.get(type).indexOf(fn)
    if (idx >= 0) listeners.get(type).splice(idx, 1)
  }

  function disconnect() {
    clearInterval(timer)
    ws?.close()
  }

  onMounted(connect)
  onUnmounted(disconnect)

  return { connected, lastMessage, on, off }
}
