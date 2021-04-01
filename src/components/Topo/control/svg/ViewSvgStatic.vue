<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :width="detail.style.position.w"
    :height="detail.style.position.h"
    style="pointer-events: none"
    v-html="svgContent"
  />
</template>

<script>
  import svgView from './ViewSvg'

  export default {
    name: 'ViewSvgStatic',
    extends: svgView,
    data() {
      return {
        svgContent: '',
      }
    },
    mounted() {
      this.loadData()
    },
    methods: {
      loadData() {
        var that = this
        this.$axios
          .get(this.svgURL)
          .then(function (response) {
            console.log(response)
            that.svgContent = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      onResize() {},
    },
  }
</script>
