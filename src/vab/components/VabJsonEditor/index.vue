<template>
  <div>
    <div class="jsoneditor-vue"></div>
    <div v-if="showBtns !== false" class="jsoneditor-btns">
      <button
        class="json-save-btn"
        type="button"
        :disabled="error"
        @click.native="onSave()"
      >
        {{ locale[lang].save }}
      </button>
    </div>
  </div>
</template>

<script>
  // import './assets/jsoneditor.css'
  // import JsonEditor from './assets/jsoneditor'
  export default {
    name: 'VabJsonEditor',
    // props: ['value', 'showBtns', 'mode', 'modes', 'lang'],
    /* eslint-disable */
    props: {
      value: [String, Number, Object, Array],
      showBtns: [Boolean],
      expandedOnStart: {
        type: Boolean,
        default: false,
      },
      mode: {
        type: String,
        default: 'tree',
      },
      modes: {
        type: Array,
        default: function () {
          return ['tree', 'code', 'form', 'text', 'view']
        },
      },
      lang: {
        type: String,
        default: 'en',
      },
    },
    data() {
      return {
        editor: null,
        error: false,
        json: this.value,
        internalChange: false,
        expandedModes: ['tree', 'view', 'form'],
        locale: {
          it: {
            save: 'SALVA',
          },
          en: {
            save: 'SAVE',
          },
          zh: {
            save: '保存',
          },
        },
      }
    },
    watch: {
      value: {
        immediate: true,
        async handler(val) {
          if (!this.internalChange) {
            await this.setEditor(val)

            this.error = false
            this.expandAll()
          }
        },
        deep: true,
      },
    },
    mounted() {
      let self = this

      let options = {
        mode: this.mode,
        modes: this.modes, // allowed modes
        onChange() {
          try {
            let json = self.editor.get()
            self.json = json
            self.error = false
            self.$emit('json-change', json)
            self.internalChange = true
            self.$emit('input', json)
            self.$nextTick(function () {
              self.internalChange = false
            })
          } catch (e) {
            self.error = true
            self.$emit('has-error', e)
          }
        },
        onModeChange() {
          self.expandAll()
        },
      }

      this.editor = new JSONEditor(
        this.$el.querySelector('.jsoneditor-vue'),
        options,
        this.json
      )
    },
    methods: {
      expandAll() {
        if (
          this.expandedOnStart &&
          this.expandedModes.includes(this.editor.getMode())
        ) {
          this.editor.expandAll()
        }
      },

      onSave() {
        this.$emit('json-save', this.json)
      },

      async setEditor(value) {
        if (this.editor) this.editor.set(value)
      },
    },
  }
</script>

<style scoped>
  .ace_line_group {
    text-align: left;
  }
  .json-editor-container {
    display: flex;
    width: 100%;
  }
  .json-editor-container .tree-mode {
    width: 50%;
  }
  .json-editor-container .code-mode {
    flex-grow: 1;
  }
  .jsoneditor-btns {
    margin-top: 10px;
    text-align: center;
  }
  .jsoneditor-vue .jsoneditor-outer {
    min-height: 150px;
  }
  .jsoneditor-vue div.jsoneditor-tree {
    min-height: 350px;
  }
  .json-save-btn {
    padding: 5px 10px;
    color: #fff;
    cursor: pointer;
    background-color: #20a0ff;
    border: none;
    border-radius: 5px;
  }
  .json-save-btn:focus {
    outline: none;
  }
  .json-save-btn[disabled] {
    cursor: not-allowed;
    background-color: #1d8ce0;
  }
  code {
    background-color: #f5f5f5;
  }
</style>
Build: a7ebffa
