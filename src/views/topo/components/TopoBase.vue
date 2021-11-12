<template>
  <div>
    <el-dialog
      :title="$translateTitle('topo.topo') + $translateTitle('topo.tag')"
      :visible.sync="tagDialog"
      append-to-body
      width="50%"
    >
      <span>这是一段信息</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="tagDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="tagDialog = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$translateTitle('topo.topo') + $translateTitle('topo.thing')"
      :visible.sync="thingDialog"
      append-to-body
      width="50%"
    >
      <span>这是一段信息</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="thingDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="thingDialog = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <div
      :class=" {'topoBase-fullscreen': isDevice }"
      class="topoBase"
      @contextmenu="showMenu"
    >
      <vue-context-menu
        :context-menu-data="contextMenuData"
        @copy="contextMenu('copy')"
        @deleteSahpe="contextMenu('remove')"
        @getPicture="contextMenu('getPicture')"
        @moveDown="contextMenu('moveDown')"
        @moveToBottom="contextMenu('moveToBottom')"
        @moveToTop="contextMenu('moveToTop')"
        @moveUp="contextMenu('moveUp')"
      />
      <topo-scale style="position:fixed;display: inline-block;" />
      <div
        id="kevCurrent"
        :key="Sale"
        class="konvaTest"
      ></div>
    </div>
  </div>
</template>

<script>
  // eslint-disable
  import TopoScale from './TopoScale'
  import { mapActions, mapGetters, mapMutations } from 'vuex'

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
    components: { TopoScale },
    data() {
      return {
        contextMenuData: {
          menuName: 'demo',
          //菜单显示的位置
          axis: {
            x: null,
            y: null,
          },
          //菜单选项
          menulists: [
            {
              fnHandler: 'getPicture', //绑定事件
              btnName: '导出', //菜单名称
            },
            // {
            //   fnHandler: 'tag', //绑定事件
            //   icoName: 'fa fa-home fa-fw', //icon图标
            //   btnName: '标记', //菜单名称
            // },
            // {
            //   fnHandler: 'thing', //绑定事件
            //   icoName: 'fa fa-home fa-fw', //icon图标
            //   btnName: '物模型', //菜单名称
            // },
            {
              fnHandler: 'moveUp', //绑定事件
              btnName: '上移', //菜单名称
            }, {
              fnHandler: 'moveDown',
              btnName: '下移',
            }, {
              fnHandler: 'moveToTop',
              btnName: '置顶',
            }, {
              fnHandler: 'moveToBottom',
              btnName: '置底',
            },
            //   {
            //   fnHandler: 'copy',
            //   icoName: 'fa fa-minus-square-o  fa-fw',
            //   btnName: '复制',
            // },
            {
              fnHandler: 'deleteSahpe',
              btnName: '删除',
            }],
        },
        stage: {},
        konvajson: {},
        tagDialog: false,
        thingDialog: false,
        defaultJson:
          '{"attrs":{"width":2382,"height":1200,"draggable":false},"className":"Stage","children":[{"attrs":{"hitGraphEnabled":false},"className":"Layer","children":[{"attrs":{},"className":"Image"},{"attrs":{"source":"https://konvajs.org/assets/yoda.jpg"},"className":"Image"}]},{"attrs":{},"className":"Layer","children":[{"attrs":{"draggable":true,"x":306,"y":303,"transformsEnabled":"position"},"className":"Group","children":[{"attrs":{"radius":20,"stroke":"#231fff","strokeWidth":4,"fill":"#ffffff"},"className":"Circle"},{"attrs":{"text":"1","fontSize":14,"originX":"center","originY":"center","fill":"#231fff","x":-5,"y":-5},"className":"Text"},{"attrs":{"data":"M.91,0H29.09A.91.91,0,0,1,30,.91v243a.88.88,0,0,1-.26.63L15.65,258.86a.9.9,0,0,1-1.3,0L.26,244.52a.88.88,0,0,1-.26-.63V.91A.91.91,0,0,1,.91,0Z","originX":"center","originY":"bottom","x":10,"y":15,"angle":-30,"fill":"#231fff","scaleX":0.15,"scaleY":0.15,"rotation":-30},"className":"Path"}]},{"attrs":{"draggable":true,"x":490,"y":557,"transformsEnabled":"position"},"className":"Group","children":[{"attrs":{"radius":20,"stroke":"#231fff","strokeWidth":4,"fill":"#ffffff"},"className":"Circle"},{"attrs":{"text":"2","fontSize":14,"originX":"center","originY":"center","fill":"#231fff","x":-5,"y":-5},"className":"Text"},{"attrs":{"data":"M.91,0H29.09A.91.91,0,0,1,30,.91v243a.88.88,0,0,1-.26.63L15.65,258.86a.9.9,0,0,1-1.3,0L.26,244.52a.88.88,0,0,1-.26-.63V.91A.91.91,0,0,1,.91,0Z","originX":"center","originY":"bottom","x":10,"y":15,"angle":-30,"fill":"#231fff","scaleX":0.15,"scaleY":0.15,"rotation":-30},"className":"Path"}]}]}]}',
      }
    },
    computed: {
      ...mapGetters({
        Sale: 'topo/konvaSale',
      }),
      isDevice: function () {
        return this.$route.query.type == 'device' || this.$route.query.deviceid
          ? true
          : false
      },
    },
    watch: {},
    mounted() {
    },
    methods: {
      ...mapMutations({
        contextMenu: 'topo/contextMenu',
      }),
      ...mapActions({
        setKonva: 'topo/Sale',
        initKonva: 'topo/initKonva',
      }),
      showMenu() {
        event.preventDefault()
        var x = event.clientX
        var y = event.clientY
        // Get the current location
        this.contextMenuData.axis = {
          x,
          y,
        }
      },
      getPicture() {
        const link = document.createElement('a')
        link.href = topo.toDataURL
        link.download = 'stage.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .topoBase {
    width: 100%;
    height: calc(100vh - #{$base-top-bar-height} * 3.7) !important;
    padding: 0;
    margin: 0;
    overflow: auto;

    ::v-deep {
      .konvajs-content {
        width: 100%;
        height: calc(
          100vh - #{$base-top-bar-height} * 2.7 - #{$base-padding} * 2 - 100px
        ) !important;
        //overflow: auto !important;
      }
    }
  }

  .topoBase-fullscreen {
    height: calc(100vh - #{$base-top-bar-height} * 3) !important;
    overflow: auto;

    ::v-deep {
      .konvajs-content {
        width: 100%;
        height: calc(
          100vh - #{$base-top-bar-height} * 3 - #{$base-padding} * 2
        ) !important;
        //overflow: auto !important;
      }
    }
  }
</style>
