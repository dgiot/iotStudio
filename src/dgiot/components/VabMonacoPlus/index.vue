<!-- 汉化版本 -->
<!--<template>-->
<!--  <div>-->
<!--    <div id="dgiot-monaco" ref="container" class="monaco-editor"></div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  import { setLocaleData } from 'monaco-editor-nls'-->
<!--  import zh_CN from 'monaco-editor-nls/locale/zh-hans'-->
<!--  setLocaleData(zh_CN)-->
<!--  const monaco = require('monaco-editor/esm/vs/editor/editor.api')-->
<!--  export default {-->
<!--    name: 'VabMonacoPlus',-->
<!--    props: {-->
<!--      // 编辑器中呈现的内容-->
<!--      codes: {-->
<!--        type: String,-->
<!--        default: function () {-->
<!--          return ''-->
<!--        },-->
<!--      },-->
<!--      readOnly: {-->
<!--        type: Boolean,-->
<!--        default: function () {-->
<!--          return false-->
<!--        },-->
<!--      },-->
<!--      theme: {-->
<!--        type: String,-->
<!--        default: function () {-->
<!--          return 'hc-dark'-->
<!--        },-->
<!--      },-->
<!--      current: {-->
<!--        type: String,-->
<!--        default: function () {-->
<!--          return 'vs-dark'-->
<!--        },-->
<!--      },-->
<!--      language: {-->
<!--        type: String,-->
<!--        default: function () {-->
<!--          return 'python'-->
<!--        },-->
<!--      },-->
<!--      // 主要配置-->
<!--      editorOptions: {-->
<!--        type: Object,-->
<!--        default: function () {-->
<!--          return {-->
<!--            selectOnLineNumbers: true,-->
<!--            roundedSelection: false,-->
<!--            readOnly: this.readOnly, // 只读-->
<!--            cursorStyle: 'line', // 光标样式-->
<!--            automaticLayout: false, // 自动布局-->
<!--            glyphMargin: true, // 字形边缘-->
<!--            useTabStops: false,-->
<!--            fontSize: 28, // 字体大小-->
<!--            autoIndent: false, // 自动布局-->
<!--          }-->
<!--        },-->
<!--      },-->
<!--    },-->
<!--    data() {-->
<!--      return {-->
<!--        monacoEditor: monaco,-->
<!--      }-->
<!--    },-->
<!--    watch: {-->
<!--      current() {-->
<!--        this.monacoEditor.setValue(this.codes)-->
<!--      },-->
<!--    },-->
<!--    mounted() {-->
<!--      this.$nextTick(() => {-->
<!--        this.monacoEditor = monaco.editor.create(this.$refs.container, {-->
<!--          value: this.codes, // 见props-->
<!--          language: this.language,-->
<!--          theme: this.theme, // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网-->
<!--          editorOptions: this.editorOptions, // 同codes-->
<!--        })-->
<!--        console.log(this.monacoEditor, 'monacoEditor')-->
<!--        // 自动格式化代码-->
<!--        this.monacoEditor.getAction('editor.action.formatDocument').run()-->
<!--      })-->
<!--    },-->
<!--  }-->
<!--</script>-->
<!--<style>-->
<!--  .monaco-editor {-->
<!--    width: 100%;-->
<!--    height: 100%;-->
<!--    border: 1px solid grey;-->
<!--  }-->

<!--  .monaco-editor {-->
<!--    height: 93vh;-->
<!--  }-->
<!--</style>-->
<template>
  <div class="content">
    <dgiot-monaco
      ref="monacoEditor"
      :content="codes"
      height="100%"
      :options="monacoOptions"
      width="100%"
    />
  </div>
</template>

<script>
  import dgiotMonaco from '@dgiot/dgiot-monaco'
  window.dgiotMonaco = dgiotMonaco
  export default {
    name: 'VabMonacoPlus',
    components: {
      dgiotMonaco,
    },
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
      // theme: {
      //   type: String,
      //   default: function () {
      //     return 'hc-dark'
      //   },
      // },
      current: {
        type: String,
        default: function () {
          return 'vs-dark'
        },
      },
      monacoOptions: {
        type: Object,
        default: function () {
          return {
            isToolbar: true, // 暂时设置toolbar不展示
            wordWrap: true, //on,off
            foldingStrategy: 'indentation', // 代码可分小段折叠
            automaticLayout: true, // 自适应布局
            overviewRulerBorder: false, // 不要滚动条的边框
            autoClosingBrackets: true,
            mouseWheelZoom: false,
            tabSize: 2, // tab 缩进长度
            fontSize: 14,
            minimap: {
              enabled: true, // 不要小地图
            },
            lineNumbers: true, //on,off
          }
        },
      },
      // lang: {
      //   type: String,
      //   default: function () {
      //     return 'python'
      //   },
      // },
    },
    data() {
      return {
        monacoEditor: null,
        // theme: 'vs-dark',
        lang: 'javascript',
      }
    },
    // created() {
    //   this.monacoEditor = this.$refs.monacoEditor
    // },
    // mounted() {
    //   this.monacoEditor = this.$refs.monacoEditor
    // },
    methods: {
      // getValue() {
      //   console.log('getValue', this.$refs.monacoEditor.$refs)
      //   return this.$refs.monacoEditor.$refs
      // },
    },
  }
</script>
<style lang="scss" scoped>
  .content {
    height: 100%;
    width: 100%;
  }
</style>
