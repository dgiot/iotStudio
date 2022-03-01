<template>
  <div id="DgiotXterm" class="DgiotXterm" />
</template>
<script>
  // import { Terminal } from 'xterm'
  // import { FitAddon } from 'xterm-addon-fit'
  // import { AttachAddon } from 'xterm-addon-attach'

  export default {
    name: 'DgiotXterm',
    props: {
      socketURI: {
        type: String,
        default: 'ws://82.157.123.54:9010/ajaxchattest',
      },
    },
    mounted() {
      this.initSocket()
    },
    beforeDestroy() {
      this.socket.close()
      this.term.dispose()
    },
    methods: {
      initTerm() {
        const term = new Terminal({
          fontSize: 14,
          cursorBlink: true,
        })
        const attachAddon = new AttachAddon(this.socket)
        const fitAddon = new FitAddon()
        term.loadAddon(attachAddon)
        term.loadAddon(fitAddon)
        term.open(document.getElementById('xterm'))
        fitAddon.fit()
        term.focus()
        this.term = term
      },
      initSocket() {
        this.socket = new WebSocket(this.socketURI)
        this.socketOnClose()
        this.socketOnOpen()
        this.socketOnError()
      },
      socketOnOpen() {
        this.socket.onopen = () => {
          // 链接成功后
          this.initTerm()
        }
      },
      socketOnClose() {
        this.socket.onclose = () => {
          dgiotlog.log('close socket')
        }
      },
      socketOnError() {
        this.socket.onerror = () => {
          dgiotlog.log('socket 链接失败')
        }
      },
    },
  }
</script>
