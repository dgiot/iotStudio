<template>
  <div class="topoBase">
    <div id="kevCurrent" :key="konvaKey" class="konvaTest"></div>
    <div id="container" :key="konvaKey + '_t'"></div>
  </div>
</template>

<script>
  var width = window.innerWidth
  var height = window.innerHeight
  export default {
    name: 'KonvaTest',
    prop: {
      // json: {
      //   required: true,
      //   type: Object,
      //   default: () =>
      //     '{"attrs":{"width":2382,"height":1684,"draggable":true},"className":"Stage","children":[{"attrs":{"hitGraphEnabled":false},"className":"Layer","children":[{"attrs":{},"className":"Image"},{"attrs":{"source":"https://konvajs.org/assets/yoda.jpg"},"className":"Image"}]},{"attrs":{},"className":"Layer","children":[{"attrs":{"draggable":true,"x":306,"y":303,"transformsEnabled":"position"},"className":"Group","children":[{"attrs":{"radius":20,"stroke":"#231fff","strokeWidth":4,"fill":"#ffffff"},"className":"Circle"},{"attrs":{"text":"1","fontSize":14,"originX":"center","originY":"center","fill":"#231fff","x":-5,"y":-5},"className":"Text"},{"attrs":{"data":"M.91,0H29.09A.91.91,0,0,1,30,.91v243a.88.88,0,0,1-.26.63L15.65,258.86a.9.9,0,0,1-1.3,0L.26,244.52a.88.88,0,0,1-.26-.63V.91A.91.91,0,0,1,.91,0Z","originX":"center","originY":"bottom","x":10,"y":15,"angle":-30,"fill":"#231fff","scaleX":0.15,"scaleY":0.15,"rotation":-30},"className":"Path"}]},{"attrs":{"draggable":true,"x":490,"y":557,"transformsEnabled":"position"},"className":"Group","children":[{"attrs":{"radius":20,"stroke":"#231fff","strokeWidth":4,"fill":"#ffffff"},"className":"Circle"},{"attrs":{"text":"2","fontSize":14,"originX":"center","originY":"center","fill":"#231fff","x":-5,"y":-5},"className":"Text"},{"attrs":{"data":"M.91,0H29.09A.91.91,0,0,1,30,.91v243a.88.88,0,0,1-.26.63L15.65,258.86a.9.9,0,0,1-1.3,0L.26,244.52a.88.88,0,0,1-.26-.63V.91A.91.91,0,0,1,.91,0Z","originX":"center","originY":"bottom","x":10,"y":15,"angle":-30,"fill":"#231fff","scaleX":0.15,"scaleY":0.15,"rotation":-30},"className":"Path"}]}]}]}',
      // },
      // konvaKey: {
      //   required: false,
      //   type: String,
      //   default: moment(new Date()).valueOf(),
      // },
    },
    data() {
      return {
        konvaKey: moment(new Date()).valueOf(),
        konvajson: {},
        defaultJson:
          '{"attrs":{"width":2382,"height":1200,"draggable":true},"className":"Stage","children":[{"attrs":{"hitGraphEnabled":false},"className":"Layer","children":[{"attrs":{},"className":"Image"},{"attrs":{"source":"https://konvajs.org/assets/yoda.jpg"},"className":"Image"}]},{"attrs":{},"className":"Layer","children":[{"attrs":{"draggable":true,"x":306,"y":303,"transformsEnabled":"position"},"className":"Group","children":[{"attrs":{"radius":20,"stroke":"#231fff","strokeWidth":4,"fill":"#ffffff"},"className":"Circle"},{"attrs":{"text":"1","fontSize":14,"originX":"center","originY":"center","fill":"#231fff","x":-5,"y":-5},"className":"Text"},{"attrs":{"data":"M.91,0H29.09A.91.91,0,0,1,30,.91v243a.88.88,0,0,1-.26.63L15.65,258.86a.9.9,0,0,1-1.3,0L.26,244.52a.88.88,0,0,1-.26-.63V.91A.91.91,0,0,1,.91,0Z","originX":"center","originY":"bottom","x":10,"y":15,"angle":-30,"fill":"#231fff","scaleX":0.15,"scaleY":0.15,"rotation":-30},"className":"Path"}]},{"attrs":{"draggable":true,"x":490,"y":557,"transformsEnabled":"position"},"className":"Group","children":[{"attrs":{"radius":20,"stroke":"#231fff","strokeWidth":4,"fill":"#ffffff"},"className":"Circle"},{"attrs":{"text":"2","fontSize":14,"originX":"center","originY":"center","fill":"#231fff","x":-5,"y":-5},"className":"Text"},{"attrs":{"data":"M.91,0H29.09A.91.91,0,0,1,30,.91v243a.88.88,0,0,1-.26.63L15.65,258.86a.9.9,0,0,1-1.3,0L.26,244.52a.88.88,0,0,1-.26-.63V.91A.91.91,0,0,1,.91,0Z","originX":"center","originY":"bottom","x":10,"y":15,"angle":-30,"fill":"#231fff","scaleX":0.15,"scaleY":0.15,"rotation":-30},"className":"Path"}]}]}]}',
      }
    },
    mounted() {
      const json =
        '{"attrs":{"width":2382,"height":1200,"draggable":true},"className":"Stage","children":[{"attrs":{"hitGraphEnabled":false},"className":"Layer","children":[{"attrs":{},"className":"Image"},{"attrs":{"source":"https://konvajs.org/assets/yoda.jpg"},"className":"Image"}]},{"attrs":{},"className":"Layer","children":[{"attrs":{"draggable":true,"x":306,"y":303,"transformsEnabled":"position"},"className":"Group","children":[{"attrs":{"radius":20,"stroke":"#231fff","strokeWidth":4,"fill":"#ffffff"},"className":"Circle"},{"attrs":{"text":"1","fontSize":14,"originX":"center","originY":"center","fill":"#231fff","x":-5,"y":-5},"className":"Text"},{"attrs":{"data":"M.91,0H29.09A.91.91,0,0,1,30,.91v243a.88.88,0,0,1-.26.63L15.65,258.86a.9.9,0,0,1-1.3,0L.26,244.52a.88.88,0,0,1-.26-.63V.91A.91.91,0,0,1,.91,0Z","originX":"center","originY":"bottom","x":10,"y":15,"angle":-30,"fill":"#231fff","scaleX":0.15,"scaleY":0.15,"rotation":-30},"className":"Path"}]},{"attrs":{"draggable":true,"x":490,"y":557,"transformsEnabled":"position"},"className":"Group","children":[{"attrs":{"radius":20,"stroke":"#231fff","strokeWidth":4,"fill":"#ffffff"},"className":"Circle"},{"attrs":{"text":"2","fontSize":14,"originX":"center","originY":"center","fill":"#231fff","x":-5,"y":-5},"className":"Text"},{"attrs":{"data":"M.91,0H29.09A.91.91,0,0,1,30,.91v243a.88.88,0,0,1-.26.63L15.65,258.86a.9.9,0,0,1-1.3,0L.26,244.52a.88.88,0,0,1-.26-.63V.91A.91.91,0,0,1,.91,0Z","originX":"center","originY":"bottom","x":10,"y":15,"angle":-30,"fill":"#231fff","scaleX":0.15,"scaleY":0.15,"rotation":-30},"className":"Path"}]}]}]}'

      const stage = Konva.Node.create(json, 'container')

      stage.find('Image').forEach((node) => {
        const img = new Image()
        img.src = node.getAttr('source')
        img.onload = () => {
          node.image(img)
          stage.batchDraw()
        }
      })
    },
    methods: {
      createTopo(json, key) {
        this.konvaKey = key
        this.konvajson = json
        console.log(this.konvaKey, 'konvaKey')
        const stage = Konva.Node.create(json, 'kevCurrent')
        // stage.find('Image').forEach((node) => {
        //   const img = new Image()
        //   img.src = node.getAttr('source')
        //   img.onload = () => {
        //     node.image(img)
        //     stage.batchDraw()
        //   }
        // })
        console.log(stage.toJSON())
        this.$message.success('successfully')
        this.konvaKey = moment(new Date()).valueOf()
        console.log(this.konvaKey, 'this.konvaKey')
      },
    },
  }
</script>

<style scoped lang="scss">
  .topoBase {
    width: 100%;
    height: calc(100vh - #{$base-top-bar-height}* 2.7 - 90px) !important;
    padding: 0;
    margin: 0;
    ::v-deep {
      .konvajs-content {
        width: 100%;
        height: calc(100vh - #{$base-top-bar-height}* 2.7 - 100px) !important;
        overflow: auto !important;
      }
    }
  }
</style>
