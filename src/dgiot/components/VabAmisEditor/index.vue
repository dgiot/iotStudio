<!--
* @Author: h7ml
* @Date: 2021-11-18 17:18:25
* @LastEditors: h7ml
* @LastEditTime: 2021-11-18 17:18:25
* @Description:
* @FilePath: src\dgiot\components\VabAmisEditor\index.vue
* @DocumentLink:
-->
<template>
  <div class="amis">
    <dgiot-amis-editor
      id="editorName"
      :key="refreshKey"
      class-name="is-fixed"
      :is-mobile="isMobile"
      :preview="isPreview"
      :theme="theme"
      :value="schema"
      @onChange="onChange"
    />
  </div>
</template>
<script>
  import { Editor } from 'amis-editor'
  import { ReactInVue } from 'vuera'
  export default {
    name: 'VabAmisEditor',
    components: {
      dgiotAmisEditor: ReactInVue(Editor),
    },
    props: {
      isPreview: {
        type: Boolean,
        default: false,
      },
      isMobile: {
        type: Boolean,
        default: false,
      },
      theme: {
        type: String,
        default: 'antd',
      },
      value: {
        type: Object,
        default: function () {
          return { message: 'hello' }
        },
      },
    },
    data() {
      return {
        refreshKey: moment().format('x'),
        schema: {},
      }
    },
    mounted() {
      this.schema = this.value
    },
    methods: {
      setSchema(obj) {
        this.schema = obj
      },
      getSchema() {
        return this.schema
      },
      onChange(e) {
        this.$emit('onChange', e)
      },
    },
  }
</script>

<style lang="scss">
  .amis {
    width: 100%;
    height: calc(100vh - 60px * 2.7) !important;
    #editor {
      width: 100%;
      height: calc(100vh - 60px * 2.7) !important;
    }
  }
  .ae-Editor .ae-Editor-inner {
    height: calc(100vh - 60px * 2.7) !important;
  }
</style>
