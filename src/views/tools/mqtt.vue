<template>
  <dgiot-mqtt-dashboard ref="mqtt-dashboard" />
</template>

<script>
  import dgiotMqttdashboard from '@dgiot/dgiot-mqtt-dashboard'
  console.error('mqtt', dgiotMqttdashboard)
  export default {
    name: 'Mqtt',
    components: {
      'dgiot-mqtt-dashboard': dgiotMqttdashboard,
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
