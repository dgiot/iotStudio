<template>
  <embed
    :height="detail.style.position.h"
    pluginspage="http://www.adobe.com/svg/viewer/install/"
    :src="svgURL"
    style="pointer-events: none"
    type="image/svg+xml"
    :width="detail.style.position.w"
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
      onResize() {},
    },
  }
</script>
