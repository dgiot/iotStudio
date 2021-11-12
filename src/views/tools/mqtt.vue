<template>
  <div class="websocket-view">
    <dgiot-mqtt-dashboard ref="mqtt-dashboard" />
  </div>
</template>

<script>
  import dgiotMqttDashboard from '@dgiot/dgiot-mqtt-dashboard/src/components/mqtt'

  export default {
    name: 'Mqtt',
    components: {
      dgiotMqttDashboard,
    },
    mounted() {
      this.hiddenClass([
        'websocket-container-header',
        'websocket-container-footer',
      ])
      this.$dgiotBus.$emit('MqttStatus', this.routerKey)
    },
    methods: {
      hiddenClass(_class) {
        const el = this.$refs['mqtt-dashboard'].$el
        if (el) {
          _class.forEach((e) => {
            el.getElementsByClassName(`${e}`)[0].style.display = 'none'
          })
        }
      },
    },
  }
</script>
