<template>
  <div class="topoBase">
    <div id="kevCurrent" :key="konvaKey" class="konvaTest"></div>
    <div id="current1"></div>
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
      // const json = {
      //   attrs: {
      //     width: 2382,
      //     height: 1200,
      //     draggable: true,
      //   },
      //   className: 'Stage',
      //   children: [
      //     {
      //       attrs: {
      //         hitGraphEnabled: false,
      //       },
      //       className: 'Layer',
      //       children: [
      //         {
      //           attrs: {},
      //           className: 'Image',
      //         },
      //         {
      //           attrs: {
      //             source: 'https://konvajs.org/assets/yoda.jpg',
      //           },
      //           className: 'Image',
      //         },
      //       ],
      //     },
      //     {
      //       attrs: {},
      //       className: 'Layer',
      //       children: [
      //         {
      //           attrs: {
      //             data: 'M358.4 307.2h307.2v61.44H358.4z',
      //             originX: 'center',
      //             originY: 'bottom',
      //             id: '#icon-biaoqian-0',
      //             x: 10,
      //             y: 15,
      //             angle: -30,
      //             fill: '#FFDA00',
      //             scaleX: 0.15,
      //             scaleY: 0.15,
      //             rotation: 0,
      //           },
      //           className: 'Path',
      //         },
      //         {
      //           attrs: {
      //             data: 'M798.72 153.6H184.32v716.8l61.44-35.47136 266.24-153.71264 266.24 153.71264L839.68 870.4V153.6h-40.96zM573.44 645.74464l-61.44-35.47136-61.44 35.47136-204.8 118.24128V215.04h532.48v548.94592L573.44 645.74464z',
      //             originX: 'center',
      //             originY: 'bottom',
      //             id: '#icon-biaoqian-1',
      //             x: 10,
      //             y: 15,
      //             angle: -30,
      //             fill: '#4DC400',
      //             scaleX: 0.15,
      //             scaleY: 0.15,
      //             rotation: 0,
      //           },
      //           className: 'Path',
      //         },
      //         {
      //           attrs: {
      //             draggable: true,
      //             x: 306,
      //             y: 303,
      //             transformsEnabled: 'position',
      //           },
      //           className: 'Group',
      //           children: [
      //             {
      //               attrs: {
      //                 data: 'M317.44 291.84h389.12v61.44H317.44zM317.44 404.48h389.12v61.44H317.44zM317.44 517.12h245.76v61.44H317.44z',
      //                 originX: 'center',
      //                 originY: 'bottom',
      //                 id: '#icon-bianjixiugai-0',
      //                 x: 10,
      //                 y: 15,
      //                 angle: -30,
      //                 fill: '#FFDA00',
      //                 scaleX: 0.15,
      //                 scaleY: 0.15,
      //                 rotation: 0,
      //               },
      //               className: 'Path',
      //             },
      //             {
      //               attrs: {
      //                 data: 'M184.32 153.6v716.8h307.2v-61.44H245.76V215.04h532.48v179.2h61.44V153.6z',
      //                 originX: 'center',
      //                 originY: 'bottom',
      //                 id: '#icon-bianjixiugai-1',
      //                 x: 10,
      //                 y: 15,
      //                 angle: -30,
      //                 fill: '#4DC400',
      //                 scaleX: 0.15,
      //                 scaleY: 0.15,
      //                 rotation: 0,
      //               },
      //               className: 'Path',
      //             },
      //             {
      //               attrs: {
      //                 data: 'M591.90272 787.4048l194.56-336.97792 53.20704 30.72-194.56 336.97792zM637.06112 832.55296l-53.20704-30.72L559.2576 870.4h40.96z',
      //                 originX: 'center',
      //                 originY: 'bottom',
      //                 id: '#icon-bianjixiugai-2',
      //                 x: 10,
      //                 y: 15,
      //                 angle: -30,
      //                 fill: '#FFDA00',
      //                 scaleX: 0.15,
      //                 scaleY: 0.15,
      //                 rotation: 0,
      //               },
      //               className: 'Path',
      //             },
      //           ],
      //         },
      //         {
      //           attrs: {
      //             draggable: true,
      //             x: 490,
      //             y: 557,
      //             transformsEnabled: 'position',
      //           },
      //           className: 'Group',
      //           children: [
      //             {
      //               attrs: {
      //                 radius: 20,
      //                 stroke: '#231fff',
      //                 strokeWidth: 4,
      //                 fill: '#ffffff',
      //               },
      //               className: 'Circle',
      //             },
      //             {
      //               attrs: {
      //                 text: '2',
      //                 fontSize: 14,
      //                 originX: 'center',
      //                 originY: 'center',
      //                 fill: '#231fff',
      //                 x: -5,
      //                 y: -5,
      //               },
      //               className: 'Text',
      //             },
      //             {
      //               attrs: {
      //                 data: '',
      //                 originX: 'center',
      //                 originY: 'bottom',
      //                 x: 10,
      //                 y: 15,
      //                 angle: -30,
      //                 fill: '#231fff',
      //                 scaleX: 0.15,
      //                 scaleY: 0.15,
      //                 rotation: -30,
      //               },
      //               className: 'Path',
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ],
      // }
      // const stage = Konva.Node.create(json, 'container')
      //
      // stage.find('Image').forEach((node) => {
      //   const img = new Image()
      //   img.src = node.getAttr('source')
      //   img.onload = () => {
      //     node.image(img)
      //     stage.batchDraw()
      //   }
      // })
    },
    methods: {
      createTopo(json, key) {
        console.clear()
        this.konvaKey = key
        this.konvajson = json
        const stage = Konva.Node.create(json, 'kevCurrent')
        stage.find('Image').forEach((node) => {
          const img = new Image()
          img.src = node.getAttr('source')
          img.onload = () => {
            node.image(img)
            stage.batchDraw()
          }
        })
        this.$message.success('successfully')
        this.konvaKey = moment(new Date()).valueOf()
        const tabInfo = {
          json: json,
          konvaKey: this.konvaKey,
          konvajson: this.konvajson,
          stage: stage.toJSON(),
        }
        console.groupCollapsed(
          '%cTopobase info',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.table(tabInfo)
        console.groupEnd()
      },
    },
  }
</script>

<style scoped lang="scss">
  .topoBase {
    width: 100%;
    height: calc(
      100vh - #{$base-top-bar-height}* 2.7 - #{$base-padding} * 2 - 90px
    ) !important;
    padding: 0;
    margin: 0;
    ::v-deep {
      .konvajs-content {
        width: 100%;
        height: calc(
          100vh - #{$base-top-bar-height}* 2.7 - #{$base-padding} * 2 - 100px
        ) !important;
        overflow: auto !important;
      }
    }
  }
</style>
