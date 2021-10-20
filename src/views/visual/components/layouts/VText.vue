<template>
  <div
    v-if="editMode == 'edit'"
    class="v-text"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <!-- tabindex >= 0 使得双击时聚集该元素 -->
    <div
      ref="text"
      :class="{ canEdit }"
      :contenteditable="canEdit"
      :style="{ verticalAlign: element.style.verticalAlign }"
      :tabindex="element.id"
      @blur="handleBlur"
      @dblclick="setEdit"
      @input="handleInput"
      @mousedown="handleMousedown"
      @paste="clearStyle"
      v-html="element.propValue"
    ></div>
  </div>
  <div
    v-else
    class="v-text preview"
  >
    <div
      :style="{ verticalAlign: element.style.verticalAlign }"
      v-html="element.propValue"
    ></div>
  </div>
</template>

<script>
/* eslint-disable */
  import { mapState } from 'vuex'
  import { keycodes } from '@/views/visual/utils/shortcutKey.js'

  export default {
    props: {
      propValue: {
        type: String,
        require: true,
        default: '',
      },
      element: {
        type: Object,
        required: false,
        default: () => {},
      },
    },
    data() {
      return {
        canEdit: false,
        ctrlKey: 17,
        isCtrlDown: false,
      }
    },
    computed: {
      ...mapState(['editMode']),
    },
    methods: {
      handleInput(e) {
        this.$emit('input', this.element, e.target.innerHTML)
      },

      handleKeydown(e) {
        if (e.keyCode == this.ctrlKey) {
          this.isCtrlDown = true
        } else if (
          this.isCtrlDown &&
          this.canEdit &&
          keycodes.includes(e.keyCode)
        ) {
          e.stopPropagation()
        } else if (e.keyCode == 46) {
          // deleteKey
          e.stopPropagation()
        }
      },

      handleKeyup(e) {
        if (e.keyCode == this.ctrlKey) {
          this.isCtrlDown = false
        }
      },

      handleMousedown(e) {
        if (this.canEdit) {
          e.stopPropagation()
        }
      },

      clearStyle(e) {
        e.preventDefault()
        const clp = e.clipboardData
        const text = clp.getData('text/plain') || ''
        if (text !== '') {
          document.execCommand('insertText', false, text)
        }

        this.$emit('input', this.element, e.target.innerHTML)
      },

      handleBlur(e) {
        this.element.propValue = e.target.innerHTML || '&nbsp;'
        const html = e.target.innerHTML
        if (html !== '') {
          this.element.propValue = e.target.innerHTML
        } else {
          this.element.propValue = ''
          this.$nextTick(() => {
            this.element.propValue = '&nbsp;'
          })
        }
        this.canEdit = false
      },

      setEdit() {
        if (this.element.isLock) return

        this.canEdit = true
        // 全选
        this.selectText(this.$refs.text)
      },

      selectText(element) {
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(element)
        selection.removeAllRanges()
        selection.addRange(range)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .v-text {
    display: table;
    width: 100%;
    height: 100%;

    div {
      display: table-cell;
      width: 100%;
      height: 100%;
      outline: none;
    }

    .canEdit {
      height: 100%;
      cursor: text;
    }
  }

  .preview {
    user-select: none;
  }
</style>
