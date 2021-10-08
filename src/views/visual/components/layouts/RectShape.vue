<template>
  <div class="rect-shape">
    <v-text :element="element" :prop-value="element.propValue" />
  </div>
</template>

<script>
  export default {
    props: {
      propValue: {
        type: String,
        require: true,
        default: '',
      },
      element: {
        type: Object,
        required: false,
        default: () => {},
      },
    },
  }
</script>

<style lang="scss" scoped>
  .rect-shape {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
