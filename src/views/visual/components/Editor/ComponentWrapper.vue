<template>
  <div @click="handleClick">
    <component
      :is="config.component"
      class="component"
      :element="config"
      :prop-value="config.propValue"
      :style="getStyle(config.style)"
    />
  </div>
</template>

<script>
  import { getStyle } from '@/views/visual/utils/style'
  import runAnimation from '@/views/visual/utils/runAnimation'
  import { mixins } from '@/views/visual/utils/events'

  export default {
    mixins: [mixins],
    props: {
      config: {
        type: Object,
        required: false,
        default: () => {},
      },
    },
    mounted() {
      runAnimation(this.$el, this.config.animations)
    },
    methods: {
      getStyle,

      handleClick() {
        const events = this.config.events
        Object.keys(events).forEach((event) => {
          this[event](events[event])
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .component {
    position: absolute;
  }
</style>
