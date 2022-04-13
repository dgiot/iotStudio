<template>
  <div class="monaco-monacoEditor" :style="style">
    <EditorToolbar
      v-if="options.isToolbar"
      ref="monacoEditor"
      :language="languageVal"
      :language-modal="languageModal"
      :options="options"
      :theme="theme"
      @on-click="handleToolClick"
    />
    <div
      ref="monacoEditor"
      class="editor-monacoEditor"
      @keyup.ctrl.83.prevent.stop="handleToolClick({ type: 'save' })"
    ></div>
  </div>
</template>

<script>
  const { monacoConfig } = require('../../../config')
  import { setLocaleData } from 'monaco-editor-nls'
  import zh_CN from 'monaco-editor-nls/locale/zh-hans'

  setLocaleData(zh_CN)
  const monaco = require('monaco-editor/esm/vs/editor/editor.api')
  import EditorToolbar from './components/toolbar'

  export default {
    name: 'DgiotMonaco',
    components: {
      EditorToolbar,
    },
    props: {
      diffEditor: { type: Boolean, default: false }, //是否使用diff模式
      width: { type: [String, Number], default: '100%' },
      height: { type: [String, Number], default: '100vh' },
      original: { type: String, default: 'html' }, //只有在diff模式下有效
      content: {
        type: String,
        default: `\<style lang="scss" scoped\>
  .content{
    height:100%;
    width: 100%;
  }
\<\/style\>
\<template\>
  \<div class="dgiot-monaco"\>
    \<dgiot-monaco ref="dgiotMonaco" :content="content" :language="language" :theme="theme" width="100%" height="100%" \/\>
  \<\/div\>
\<\/template\>

\<script\>
  import dgiotMonaco from "@dgiot/dgiot-monaco";
  export default {
    components: {
      dgiotMonaco
    },
    data() {
      return {
        content: "",
        theme: "vs-dark",
        language: "html"
      };
    }
  }
\<\/script\>`,
      },
      language: { type: String, default: 'html' },
      isToolbar: { type: Boolean, default: true },
      languageModal: {
        type: Array,
        default: () => monacoConfig.languages,
      },
      theme: { type: String, default: 'vs-dark' },
      options: {
        type: Object,
        default() {
          return {
            isToolbar: true,
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
    },
    data() {
      return {
        editor: null,
        languageVal: '',
      }
    },
    computed: {
      style() {
        return {
          width: !/^\d+$/.test(this.width) ? this.width : `${this.width}px`,
          height: !/^\d+$/.test(this.height) ? this.height : `${this.height}px`,
        }
      },
    },
    watch: {
      options: {
        deep: true,
        handler(options) {
          this.editor && this.editor.updateOptions(options)
        },
      },
      content(val) {
        this.handleValue(val)
      },
      language(val) {
        this.handlerLanguage(val)
      },

      theme(val) {
        this.handleTheme(val)
      },

      style() {
        this.editor &&
          this.$nextTick(() => {
            this.editor.layout()
          })
      },
    },
    mounted() {
      this.initMonaco()
    },
    beforeDestroy() {
      this.editor && this.editor.dispose()
    },
    methods: {
      handleValue(val) {
        this.editor && val !== this._getValue() && this._setValue(val)
      },
      handleTheme(val) {
        this.editor && monaco.editor.setTheme(val)
      },
      handlerLanguage(val) {
        this.languageVal = val
        if (!this.editor) return
        if (this.diffEditor) {
          //diff模式下更新language
          const { original, modified } = this.editor.getModel()
          monaco.editor.setModelLanguage(original, val)
          monaco.editor.setModelLanguage(modified, val)
        } else monaco.editor.setModelLanguage(this.editor.getModel(), val)
      },
      handleToolClick({ type, value }) {
        switch (type) {
          case 'undo':
            //上一步
            this.editor.trigger('anyString', 'undo')
            break
          case 'repeat':
            //下一步
            this.editor.trigger('anyString', 'redo')
            break
          case 'search':
            //检索
            this.editor.trigger('anyString', 'actions.find')
            break
          case 'formatDocument':
            //代码美化
            this.editor.trigger('anyString', 'editor.action.formatDocument')
            break
          case 'size':
            //编辑器字体
            // eslint-disable-next-line vue/no-mutating-props
            this.options.fontSize = value
            break
          case 'theme':
            //编辑器主题
            this.handleTheme(value)
            break
          case 'language':
            //语言
            this.handlerLanguage(value)
            break
          case 'trash':
            //清空
            this.handleValue('')
            break
          case 'save':
            // 保存
            this.$emit('on-save', this.editor.getValue())
            break
          case 'wrap':
            // eslint-disable-next-line vue/no-mutating-props
            this.options.wordWrap = !this.options.wordWrap
            break
          case 'number':
            // eslint-disable-next-line vue/no-mutating-props
            this.options.lineNumbers = !this.options.lineNumbers
            break
          case 'random':
            this.editor.trigger('anyString', 'editor.action.gotoLine')
            break
          case 'format':
            this.editor.trigger('anyString', 'editor.action.formatDocument')
            break
          default:
            console.log(type)
        }
        // if (type === "undo") {
        //   //上一步
        //   this.editor.trigger("anyString", "undo");
        // } else if (type === "repeat") {
        //   //下一步
        //   this.editor.trigger("anyString", "redo");
        // } else if (type === "search") {
        //   //检索
        //   // this.editor.trigger("anyString", "editor.action.selectAll");
        //   this.editor.trigger("anyString", "actions.find");
        // } else if (type === "formatDocument") {
        //   //代码美化
        //   this.editor.trigger("anyString", "editor.action.formatDocument");
        // } else if (type === "size") {
        //   //编辑器字体
        //   this.options.fontSize = value;
        // } else if (type === "theme") {
        //   //编辑器主题
        //   this.handleTheme(value);
        // } else if (type === "language") {
        //   //语言
        //   this.handlerLanguage(value);
        // } else if (type === "trash") {
        //   //清空
        //   // this.editor.setValue("");
        //   this.handleValue("");
        // } else if (type === "save") {
        //   //保存
        //   this.$emit("on-save", this.editor.getValue());
        //   console.log(this.editor.getValue());
        // } else if (type === "wrap") {
        //   //代码换行
        //   this.options.wordWrap = !this.options.wordWrap;
        // } else if (type === "number") {
        //   //行号显隐
        //   this.options.lineNumbers = !this.options.lineNumbers;
        // } else if (type === "random") {
        //   //跳转到行
        //   this.editor.trigger("anyString", "editor.action.gotoLine");
        // } else if (type === "format") {
        //   //代码美化
        //   this.editor.trigger("anyString", "editor.action.formatDocument");
        // }
      },

      initMonaco() {
        this.languageVal = this.language
        this.languageVal = this.language
        // console.log(this._editorBeforeMount());
        // Object.assign(options, this._editorBeforeMount()); //编辑器初始化前
        this.editor = monaco.editor[
          this.diffEditor ? 'createDiffEditor' : 'create'
        ](this.$refs.monacoEditor, {
          value: this.content,
          language: this.language,
          theme: this.theme,
          ...this.options,
        })
        this.diffEditor && this._setModel(this.content, this.original)
        this._editorMounted(this.editor) //编辑器初始化后
      },

      _getEditor() {
        if (!this.editor) return null
        return this.diffEditor ? this.editor.modifiedEditor : this.editor
      },

      _setModel(value, original) {
        //diff模式下设置model
        const { language } = this
        const originalModel = monaco.editor.createModel(original, language)
        const modifiedModel = monaco.editor.createModel(value, language)
        this.editor.setModel({
          original: originalModel,
          modified: modifiedModel,
        })
      },

      _setValue(value) {
        let editor = this._getEditor()
        if (editor) return editor.setValue(value)
      },

      _getValue() {
        let editor = this._getEditor()
        if (!editor) return ''
        return editor.getValue()
      },

      _editorBeforeMount() {
        const options = this.$emit('on-before-mount', monaco)
        return options || {}
      },

      _editorMounted(editor) {
        this.$emit('on-mounted', { editor, monaco })
        if (this.diffEditor) {
          editor.onDidUpdateDiff((event) => {
            const value = this._getValue()
            this._emitChange(value, event)
          })
        } else {
          editor.onDidChangeModelContent((event) => {
            const value = this._getValue()
            this._emitChange(value, event)
          })
        }
        // let jsonA = [];
        // editor.getActions().forEach((obj) => {
        //   jsonA.push({ id: obj.id });
        // });
        // console.log(JSON.stringify(jsonA));
      },

      _emitChange(value, event) {
        this.$emit('on-change', value, event)
        this.$emit('on-input', value)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .monaco-monacoEditor {
    height: 100%;
    min-height: 200px;

    .editor-monacoEditor {
      min-height: 200px;
      height: calc(100% - 37px);
    }
  }
</style>
