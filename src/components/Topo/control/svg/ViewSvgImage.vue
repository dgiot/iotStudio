<template>
  <embed
    :height="detail.style.position.h"
    :src="svgURL"
    :width="detail.style.position.w"
    pluginspage="http://www.adobe.com/svg/viewer/install/"
    style="pointer-events: none"
    type="image/svg+xml"
  />
  <!-- <iframe :src="svgURL" :width="detail.style.position.w" :height="detail.style.position.h" >
</iframe> -->
</template>

<script>
  import svgView from './ViewSvg'

  export default {
    name: 'ViewSvgImage',
    extends: svgView,
    mounted() {
      this.onResize()
    },
    methods: {
      onResize() {
      },
    },
  }
</script>
