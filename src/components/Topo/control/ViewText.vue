<template>
  <div
    class="view-text"
    :style="{
      fontSize: detail.style.fontSize + 'px',
      fontFamily: detail.style.fontFamily,
      color: detail.style.foreColor,
      textAlign: textAlign,
      lineHeight: lineHeight + 'px',
    }"
  >
    {{ detail.style.text }}
  </div>
</template>

<script>
  import BaseView from './View'

  export default {
    name: 'ViewText',
    extends: BaseView,
    props: {},
    data() {
      return {}
    },
    methods: {},
  }
</script>

<style lang="scss">
  .view-text {
    height: 100%;
    width: 100%;
  }
</style>
