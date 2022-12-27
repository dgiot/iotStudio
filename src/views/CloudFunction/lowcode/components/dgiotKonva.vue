<!--
* @Author: h7ml
* @Date: 2021-11-17 10:41:18
* @LastEditors: h7ml
* @LastEditTime: 2021-11-17 10:41:18
* @Description:
* @FilePath: src\views\Lowcode\components\dgiotRule.vue
* @DocumentLink:
-->
<template>
  <div id="topo"></div>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    name: 'DgiotKonva',
    components: {},
    props: {
      objectId: {
        default: '',
        required: true,
        type: String,
      },
      code: {
        default: () => {},
        required: true,
        type: Object,
      },
    },
    data() {
      return {
        stage: {},
        layer: {},
        infoData: 'dgiotKonva',
      }
    },
    mounted() {
      // this.initKonva({
      //   data: this.code.Stage,
      //   id: 'topo',
      // })
      let width = this.code.Stage?.attrs?.width || 1200
      let height = this.code.Stage?.attrs?.height || 700
      if (this.code) {
      }
      this.layer = Konva.Node.create(this.code.Stage, 'topo').findOne('Layer')
      this.stage = new Konva.Stage({
        container: 'topo',
        width: width,
        height: height,
      })
      this.stage.add(this.layer)
      this.handleInitKonva()
      // this.$nextTick(() => {
      //   // 禁用调所有移动事件，如需禁用其他，在以下函数中添加
      //   konvaUtils.loadKonva(canvas.layer)
      // })
    },
    methods: {
      ...mapMutations({
        initKonva: 'topo/initKonva',
      }),
      async handleInitKonva() {
        this.stage.find('Label').forEach((node) => {
          console.log('label', node)
          // info["Label"] = stage.find("Label");
          node.setAttrs({
            draggable: false,
          })
          // node = this.initScale(node);
        })
        this.stage.find('Text').forEach((node) => {
          node.setAttrs({
            draggable: false,
          })
        })
        this.stage.find('Image').forEach((node) => {
          node.setAttrs({
            draggable: false,
          })
          let image = new Image()
          node.setAttrs({
            image: image,
          })
          image.src = node.attrs.src.includes('//')
            ? node.attrs.src
            : this.$FileServe + node.attrs.src
        })
        this.stage.find('Rect').forEach((node) => {
          node.setAttrs({
            draggable: false,
          })
        })
        // this.layer.draw();
        this.layer.batchDraw()
        setTimeout(() => {
          this.layer.batchDraw()
        }, 1500)
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .dgiotKonva-container {
    width: 100%;
    height: 100%;
    &-container {
      width: 100%;
      height: 100%;
    }
  }
</style>
