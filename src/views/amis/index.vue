<template>
  <div id="amis-wramiser" class="amis-wramiser amis-container">
    <AmisDemo />
    <Toast key="toast" position="top-right" theme="default" />
    <Alert key="alert" theme="default" />
  </div>
</template>
<script>
  import AmisDemo from './Amis'
  import { ReactInVue } from 'vuera'
  import { AlertComponent, ToastComponent } from 'amis'

  export default {
    name: 'App',
    components: {
      AmisDemo,
      Toast: ReactInVue(ToastComponent),
      Alert: ReactInVue(AlertComponent),
    },
  }
</script>
