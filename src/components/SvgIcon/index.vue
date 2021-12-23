<template>
  <div>
    <svg aria-hidden="true" :class="svgClass">
      <use :xlink:href="iconName" />
    </svg>
  </div>
</template>

<script>
  export default {
    name: 'SvgIcon',
    props: {
      iconClass: {
        type: String,
        required: true,
      },
      className: {
        type: String,
        default: '',
      },
    },
    computed: {
      iconName() {
        return `#icon-${this.iconClass}`
      },
      svgClass() {
        if (this.className) {
          return 'dgiot-icon ' + this.className
        } else {
          return 'dgiot-icon'
        }
      },
    },
  }
</script>

<style scoped>
  .dgiot-icon {
    width: 1em;
    height: 1em;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentColor;
  }
</style>
