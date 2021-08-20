<template>
  <div class="VabRequire"></div>
</template>

<script>
  export default {
    name: 'VabRequire',
    components: {},
    props: {
      src: { type: String, required: true, default: '' },
    },
    data() {},
    render(createElement) {
      return createElement('script', {
        attrs: { type: 'text/javascript', src: this.src },
      })
    },
  }
</script>
