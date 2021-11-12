<template>
  <div class="VabRequire"></div>
</template>

<script>
  export default {
    name: 'VabRequire',
    components: {},
    props: {
      type: {
        default: 'css',
        required: false,
        type: String,
      },
      src: {
        type: String,
        required: true,
        default: '',
      },
    },
    data() {},
    watch: {
      src: {
        handler(newVal, oldVal) {
          console.clear()
          console.log(newVal, oldVal, 'src')
        },
        deep: true,
        immediate: true,
      },
    },
    render: function (createElement) {
      var self = this

      console.log(createElement, 'createElement~~~~~~~~~~~~~~~~~~')
      return createElement(this.type == 'js' ? 'script' : 'link', {
        attrs:
          this.type == 'js'
            ? {
                type: 'text/javascript',
                src: this.src,
              }
            : {
                rel: 'stylesheet',
                href: this.src,
              },
        on: {
          load: function (event) {
            self.$emit('load', event)
          },
          error: function (event) {
            self.$emit('error', event)
          },
          readystatechange: function (event) {
            if (this.readyState == 'complete') {
              self.$emit('load', event)
            }
          },
        },
      })
    },
  }
</script>
