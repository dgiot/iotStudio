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
    <div
      v-show="objectId"
      class="wrapper"
      :title="$translateTitle('konva.save')"
      @click="saveAmis(objectId)"
    >
      <dgiot-icon icon="save-2-fill" />
      {{ $translateTitle('konva.save') }}
    </div>
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
      viewId: {
        type: String,
        required: false,
        default: '',
      },
    },
    data() {
      return {
        objectId: this.viewId,
      }
    },
    computed: {},
    mounted() {
      this.objectId = this.$route.query.viewId
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
      async saveAmis(viewId) {
        console.log('viewId', viewId)
        console.log('schema', this.schema)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .wrapper {
    position: fixed;
    right: -11.5px;
    bottom: 145px;
    z-index: 9999;
    padding: 7px 15px;
    padding-right: 19px;
    font-size: 12px;
    font-weight: 700;
    line-height: 12px;
    color: #fff;
    cursor: pointer;
    user-select: none;
    background-color: rgba(0, 0, 0, 0.7);
    border: 1px solid #000;
    border-radius: 4px;
    opacity: 1;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;

    &:hover {
      right: -4px;
      background-color: rgba(0, 0, 0, 0.9);
    }

    i {
      margin-right: 3px;
      font-size: 12px;
    }
  }
</style>

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
