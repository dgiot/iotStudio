<template>
  <div @click="handleClick">
    <component
      :is="config.component"
      class="component"
      :style="getStyle(config.style)"
      :prop-value="config.propValue"
      :element="config"
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
