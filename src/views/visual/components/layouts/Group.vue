<template>
  <div class="group">
    <div>
      <template v-for="item in propValue">
        <component
          :is="item.component"
          :id="'component' + item.id"
          :key="item.id"
          class="component"
          :element="item"
          :prop-value="item.propValue"
          :style="item.groupStyle"
        />
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      propValue: {
        type: Array,
        required: false,
        default: () => [],
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
  .group {
    & > div {
      position: relative;
      width: 100%;
      height: 100%;

      .component {
        position: absolute;
      }
    }
  }
</style>
