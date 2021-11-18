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
    <div id="editor"></div>
    <div ref="renderWrap"></div>
  </div>
</template>

<script>
  // @ is an alias to /src
  import { Editor } from 'amis-editor'
  import { setup } from 'amis-editor-sdk'

  export default {
    name: 'VabAmisEditor',
    components: {},
    props: {
      schema: {
        type: Object,
        required: false,
        default: () => {},
      },
    },
    data() {
      return {}
    },
    computed: {},
    mounted() {
      this.initEditor()
      this.render({})
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      initEditor() {
        setup({
          id: 'editor',
          Editor,
          onChange() {},
          initSchema: this.schema, // 可选
        })
      },
      // 渲染函数
      render(amisJSON) {
        if (this.schema) amisJSON = JSON.stringify(this.schema)
        if (!window.amisRequire) {
          return false
        }
        const amis = window.amisRequire('amis/embed')
        console.log(amis, this.$refs.renderWrap, amisJSON)
        amis.embed(this.$refs.renderBox, amisJSON)
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
