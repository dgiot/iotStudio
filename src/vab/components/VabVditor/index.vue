<template>
  <div id="vditor" :key="setKey" name="description"></div>
</template>
<script>
  export default {
    name: 'VabVditor',
    props: {
      value: {
        type: String,
        required: false,
        default: '',
      },
    },
    data() {
      return {
        height: this.$baseTableHeight(0),
        setKey: moment(new Date()).valueOf(),
        contentEditor: {},
      }
    },
    watch: {
      value(v) {
        console.log(v)
        this.createVditor()
      },
    },
    mounted() {},
    methods: {
      createVditor() {
        this.contentEditor = new Vditor('vditor', {
          // height: this.height,
          placeholder: '此处为话题内容……',
          theme: 'classic',
          counter: {
            enable: true,
            type: 'markdown',
          },
          preview: {
            delay: 0,
            hljs: {
              style: 'monokai',
              lineNumber: true,
            },
          },
          tab: '\t',
          typewriterMode: true,
          toolbarConfig: {
            pin: true,
          },
          cache: {
            enable: false,
          },
          mode: 'sv',
          toolbar: [
            'emoji',
            'headings',
            'bold',
            'italic',
            'strike',
            'link',
            '|',
            'list',
            'ordered-list',
            'check',
            'outdent',
            'indent',
            '|',
            'quote',
            'line',
            'code',
            'inline-code',
            'insert-before',
            'insert-after',
            '|',
            // 'record',
            'table',
            '|',
            'undo',
            'redo',
            '|',
            'edit-mode',
            // 'content-theme',
            'code-theme',
            'export',
            {
              name: 'more',
              toolbar: ['fullscreen', 'both', 'preview', 'info', 'help'],
            },
          ],
          after: () => {
            this.contentEditor.setValue(this.value)
          },
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  //@import 'https://unpkg.com/vditor@3.8.6/src/assets/scss/index.scss';
  @import 'https://unpkg.com/vditor@3.8.6/dist/index.css';
  #vditor {
    height: calc(100vh - #{$base-top-bar-height}* 2.7);
  }
</style>
