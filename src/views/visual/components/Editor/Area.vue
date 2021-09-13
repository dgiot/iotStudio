<template>
  <div
    :style="{
      left: start.x + 'px',
      top: start.y + 'px',
      width: width + 'px',
      height: height + 'px',
    }"
    class="area"
  ></div>
</template>

<script>
  export default {
    props: {
      start: {
        type: Object,
        required: false,
        default: () => {},
      },
      width: {
        type: Number,
        required: false,
        default: () => 0,
      },
      height: {
        type: Number,
        required: false,
        default: () => 0,
      },
    },
  }
</script>

<style lang="scss" scoped>
  .area {
    position: absolute;
    border: 1px solid #70c0ff;
  }
</style>
