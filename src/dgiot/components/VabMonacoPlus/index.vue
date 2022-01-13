<template>
  <div>
    <div id="dgiot-monaco" ref="container" class="monaco-editor"></div>
  </div>
</template>

<script>
  // import * as monaco from 'monaco-editor'
  import { setLocaleData } from 'monaco-editor-nls'
  import zh_CN from 'monaco-editor-nls/locale/zh-hans'
  setLocaleData(zh_CN)
  const monaco = require('monaco-editor/esm/vs/editor/editor.api')
  export default {
    name: 'VabMonacoPlus',
    props: {
      // 编辑器中呈现的内容
      codes: {
        type: String,
        default: function () {
          return ''
        },
      },
      readOnly: {
        type: Boolean,
        default: function () {
          return false
        },
      },
      theme: {
        type: String,
        default: function () {
          return 'hc-dark'
        },
      },
      current: {
        type: String,
        default: function () {
          return 'vs-dark'
        },
      },
      language: {
        type: String,
        default: function () {
          return 'python'
        },
      },
      // 主要配置
      editorOptions: {
        type: Object,
        default: function () {
          return {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: this.readOnly, // 只读
            cursorStyle: 'line', // 光标样式
            automaticLayout: false, // 自动布局
            glyphMargin: true, // 字形边缘
            useTabStops: false,
            fontSize: 28, // 字体大小
            autoIndent: false, // 自动布局
          }
        },
      },
    },
    watch: {
      current() {
        this.monacoEditor.setValue(this.codes)
      },
    },
    mounted() {
      this.monacoEditor = monaco.editor.create(this.$refs.container, {
        value: this.codes, // 见props
        language: this.language,
        theme: this.theme, // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
        editorOptions: this.editorOptions, // 同codes
      })
      // 自动格式化代码
      this.monacoEditor.getAction('editor.action.formatDocument').run()
    },
  }
</script>
<style>
  .monaco-editor {
    width: 100%;
    height: 100%;
    border: 1px solid grey;
  }

  .monaco-editor {
    height: 93vh;
  }
</style>
