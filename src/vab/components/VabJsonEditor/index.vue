<!--codemirror-json格式化-->
<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
  export default {
    name: 'VabJsonEditor',
    /* eslint-disable vue/require-prop-types */
    props: ['value'],
    data() {
      return {
        jsonEditor: false,
        readmeUrl: 'http://doc.iotn2n.com/web/#/66?page_id=779',
      }
    },
    watch: {
      value(value) {
        const editor_value = this.jsonEditor.getValue()
        if (value !== editor_value) {
          this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
        }
      },
    },
    mounted() {
      this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
        lineNumbers: true,
        mode: 'application/json',
        gutters: ['CodeMirror-lint-markers'],
        theme: 'rubyblue',
        lint: true,
      })

      this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      this.jsonEditor.on('change', (cm) => {
        this.$emit('changed', cm.getValue())
        this.$emit('input', cm.getValue())
      })
    },
    methods: {
      getValue() {
        return this.jsonEditor.getValue()
      },
    },
  }
</script>

<style scoped>
  .json-editor {
    position: relative;
    height: 100%;
  }
  .json-editor >>> .CodeMirror {
    height: auto;
    min-height: 180px;
  }
  .json-editor >>> .CodeMirror-scroll {
    min-height: 180px;
  }
  .json-editor >>> .cm-s-rubyblue span.cm-string {
    color: #f08047;
  }
</style>
