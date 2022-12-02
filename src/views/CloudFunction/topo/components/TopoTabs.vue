<!-- 组件说明 -->
<template>
  <div class="icon-selector-popper">
    <div class="dialog">
      <dgiot-input
        ref="uploadFinish"
        :params="inputParams"
        @fileInfo="fileInfo"
        @files="files"
      />
    </div>
    <Thing />
    <Amis />
    <div v-show="isDirver" style="margin: 0 auto; text-align: center">
      <Evidence />
    </div>
    <a-collapse v-show="!isDirver" accordion>
      <a-collapse-panel key="1" :header="$translateTitle('topo.background')">
        <el-button size="mini" type="primary" @click.native="uploadCkick('bg')">
          {{ $translateTitle('topo.Upload background') }}
        </el-button>
        <Background />
      </a-collapse-panel>
      <a-collapse-panel
        v-if="!$route.query.dashboard"
        key="2"
        :header="$translateTitle('product.button control')"
      >
        <!--          <div data-text="物模型" @dragstart="handleDragStart">-->
        <!--            <el-button draggable="true" size="mini">-->
        <!--              {{ $translateTitle('topo.text button') }}-->
        <!--            </el-button>-->
        <!--          </div>-->
        <el-button
          draggable="true"
          size="mini"
          type="primary"
          @click.native="
            createThing({
              productid: $route.query.productid,
              hidden: false,
            })
          "
        >
          实时数据
        </el-button>
        <el-divider />
        <el-button
          draggable="true"
          size="mini"
          type="primary"
          @click.native="
            createAmis({
              productid: $route.query.productid,
              hidden: false,
            })
          "
        >
          数据下发
        </el-button>
        <el-divider />
        <!--        <el-button-->
        <!--          draggable="true"-->
        <!--          size="mini"-->
        <!--          type="primary"-->
        <!--          @click.native="-->
        <!--            createHistory({-->
        <!--              productid: $route.query.productid,-->
        <!--              hidden: false,-->
        <!--            })-->
        <!--          "-->
        <!--        >-->
        <!--          历史数据-->
        <!--        </el-button>-->
      </a-collapse-panel>
      <a-collapse-panel
        v-if="!$route.query.dashboard"
        key="3"
        :header="$translateTitle('topo.evidence control')"
      >
        <!--        <el-button-->
        <!--          size="mini"-->
        <!--          type="primary"-->
        <!--        >-->
        <!--          {{ $translateTitle('topo.Add configuration tag') }}-->
        <!--        </el-button>-->
        <Evidence />
      </a-collapse-panel>
      <a-collapse-panel key="4" :header="$translateTitle('topo.basic element')">
        <el-button
          draggable="true"
          size="mini"
          type="primary"
          @click.native="
            createBasicThing({
              productid: $route.query.productid,
              type: 'static',
              hidden: false,
            })
          "
        >
          静态文本框
        </el-button>
        <el-divider />
        <div style="text-align: left; margin: 10px; font-weight: 600">动图</div>
        <!-- <img
          draggable="true"
          size="mini"
          src="https://prod.dgiotcloud.cn/dgiot_file/topo/png/pump.gif"
          style="width: 40px; height: 40px; display: inline-block"
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'knovaimage',
              image: 'https://prod.dgiotcloud.cn/dgiot_file/topo/png/pump.gif',
              hidden: false,
            })
          "
        /> -->
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/gif/pump.gif'"
          style="
            width: 40px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'knovaimage',
              image: '/dgiot_file/topo/gif/pump.gif',
              data: {
                width: 180,
                height: 200,
              },
              hidden: false,
            })
          "
        />
        <el-divider />
        <div style="text-align: left; margin: 10px; font-weight: 600">
          静态图
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/static/datawindow.png'"
          style="
            width: 40px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'staticimage',
              data: {
                width: 180,
                height: 200,
              },
              image: '/dgiot_file/topo/static/datawindow.png',
              hidden: false,
            })
          "
        />
        <img
          draggable="true"
          size="mini"
          src=" https://ucloud-web-sh.oss-cn-shanghai.aliyuncs.com/cloud/web/prod/screen/assets/1650512783877_0362.png"
          style="
            width: 60px;
            height: 20px;
            display: inline-block;
            margin-left: 20px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'staticimage',
              data: {
                width: 420,
                height: 35,
              },
              image:
                ' https://ucloud-web-sh.oss-cn-shanghai.aliyuncs.com/cloud/web/prod/screen/assets/1650512783877_0362.png',
              hidden: false,
            })
          "
        />
        <!-- -->
        <el-divider />
        <!-- <el-button
          draggable="true"
          size="mini"
          type="primary"
          @click.native="
            createBasicThing({
              productid: $route.query.productid,
              type: 'gifimage',
              image: 'http://konvajs-doc.bluehymn.com/assets/blob-sprite.png',
              animations: {
                idle: [
                  // x, y, width, height (4 frames)
                  2, 2, 70, 119, 71, 2, 74, 119, 146, 2, 81, 119, 226, 2, 76,
                  119,
                ],
              },
              hidden: false,
            })
          "
        >
          精灵图
        </el-button>
        <el-divider /> -->

        <!-- http://dev.iotn2n.com/dgiot_file/topo/png/pump.png -->
      </a-collapse-panel>
      <a-collapse-panel
        key="5"
        :header="$translateTitle('topo.screen element')"
      >
        <!-- <div style="text-align: left; margin: 10px; font-weight: 600">
          大屏组件
        </div> -->
        <el-button
          draggable="true"
          size="mini"
          type="primary"
          @click.native="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'line_historydata',
                width: 400,
                height: 260,
                fill: 'rgba(30, 30, 30,0.7)',
                text: '折线图',
                source: 'api',
              },
              chart: 'line',
              hidden: false,
            })
          "
        >
          折线图
        </el-button>
        <el-divider />
        <el-button
          draggable="true"
          size="mini"
          style="margin: 5px"
          type="primary"
          @click.native="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                width: 262,
                height: 72,
                fill: 'rgba(80, 190, 240, 0.2)',
                text: '产品数量',
                source: 'mqtt',
              },
              chart: 'counter',
              hidden: false,
            })
          "
        >
          数据卡片
        </el-button>
        <el-divider />
        <div style="text-align: left; margin: 10px; font-weight: 600">
          开关机饼图
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/turnonoffpie.png'"
          style="
            width: 70px;
            height: 60px;
            display: inline-block;
            margin-left: 20px;
            margin-top: 10px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'device_poweron_poweroff',
                width: 350,
                height: 300,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '开关机饼图',
                source: 'mqtt',
                src: '/dgiot_file/topo/png/turnonoffpie.png',
              },
              chart: 'pie',
              hidden: false,
            })
          "
        />
        <el-divider />
        <!-- <el-button
          draggable="true"
          size="mini"
          type="primary"
          @click.native="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'warning_list',
                width: 550,
                height: 350,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '告警列表',
                source: 'api',
              },
              chart: 'list',
              hidden: false,
            })
          "
        >
          告警列表
        </el-button> -->
        <div style="text-align: left; margin: 10px; font-weight: 600">
          告警列表
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/warninglist.png'"
          style="
            width: 70px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
            margin-top: 10px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'warning_list',
                width: 400,
                height: 350,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '告警列表',
                source: 'api',
                src: '/dgiot_file/topo/png/warninglist.png',
              },
              chart: 'list',
              hidden: false,
            })
          "
        />
        <!-- <el-button
          draggable="true"
          size="mini"
          type="primary"
          @click.native="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'device_list',
                width: 700,
                height: 350,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '设备列表',
                source: 'api',
              },
              chart: 'list',
              hidden: false,
            })
          "
        >
          设备列表
        </el-button> -->
        <div style="text-align: left; margin: 10px; font-weight: 600">
          设备列表
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/devicelist.png'"
          style="
            width: 70px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
            margin-top: 10px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'device_list',
                width: 700,
                height: 350,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '设备列表',
                source: 'api',
                src: '/dgiot_file/topo/png/devicelist.png',
              },
              chart: 'list',
              hidden: false,
            })
          "
        />
        <div style="text-align: left; margin: 10px; font-weight: 600">
          工单列表
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/workorderlist.png'"
          style="
            width: 70px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
            margin-top: 10px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'workorder_list',
                width: 400,
                height: 350,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '工单列表',
                source: 'api',
                src: '/dgiot_file/topo/png/workorderlist.png',
              },
              chart: 'list',
              hidden: false,
            })
          "
        />
        <!-- /dgiot_file/topo/png/devicelist.png -->
        <!-- <el-button
          draggable="true"
          size="mini"
          type="primary"
          @click.native="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'workorder_list',
                width: 500,
                height: 350,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '工单列表',
                source: 'api',
              },
              chart: 'list',
              hidden: false,
            })
          "
        >
          工单列表
        </el-button> -->
        <el-divider />
        <div style="text-align: left; margin: 10px; font-weight: 600">
          设备地图
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/baidumap.png'"
          style="
            width: 70px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
            margin-top: 10px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'baidumap',
                width: 1800,
                height: 630,
                x: 40,
                y: 230,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '设备地图',
                source: 'api',
                src: '/dgiot_file/topo/png/baidumap.png',
              },
              chart: 'map',
              hidden: false,
            })
          "
        />
        <el-divider />
        <!-- <div style="text-align: left; margin: 10px; font-weight: 600">
          数据统计卡片组
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/countvalue.png'"
          style="
            width: 70px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
            margin-top: 10px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'all_countvalue',
                width: 1800,
                height: 220,
                x: 40,
                y: 5,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '基本数据统计卡片组',
                source: 'api',
                src: '/dgiot_file/topo/png/countvalue.png',
              },
              chart: 'count',
              hidden: false,
            })
          "
        /> -->
        <div style="text-align: left; margin: 10px; font-weight: 600">
          产品数量
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/product_count.png'"
          style="
            width: 70px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
            margin-top: 10px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'product_count',
                width: 400,
                height: 215,
                x: 40,
                y: 5,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '',
                source: 'api',
                src: '/dgiot_file/topo/png/product_count.png',
              },
              chart: 'count',
              hidden: false,
            })
          "
        />
        <div style="text-align: left; margin: 10px; font-weight: 600">
          设备数量
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/device_count.png'"
          style="
            width: 70px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
            margin-top: 10px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'device_count',
                width: 400,
                height: 215,
                x: 490,
                y: 5,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '',
                source: 'api',
                src: '/dgiot_file/topo/png/device_count.png',
              },
              chart: 'count',
              hidden: false,
            })
          "
        />
        <div style="text-align: left; margin: 10px; font-weight: 600">
          告警数量
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/warning_count.png'"
          style="
            width: 70px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
            margin-top: 10px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'warning_count',
                width: 400,
                height: 215,
                x: 940,
                y: 5,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '',
                source: 'api',
                src: '/dgiot_file/topo/png/warning_count.png',
              },
              chart: 'count',
              hidden: false,
            })
          "
        />
        <div style="text-align: left; margin: 10px; font-weight: 600">
          工单数量
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/order_count.png'"
          style="
            width: 70px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
            margin-top: 10px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'order_count',
                width: 400,
                height: 215,
                x: 1390,
                y: 5,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '',
                source: 'api',
                src: '/dgiot_file/topo/png/order_count.png',
              },
              chart: 'count',
              hidden: false,
            })
          "
        />
        <el-divider />
        <div style="text-align: left; margin: 10px; font-weight: 600">
          视频监控
        </div>
        <!-- staticimage -->
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/videolive.png'"
          style="
            width: 70px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
            margin-top: 10px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'vuecomponent',
              data: {
                id: 'videolive',
                width: 500,
                height: 350,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '视频监控',
                source: 'api',
                src: '/dgiot_file/topo/png/videolive.png',
              },
              chart: 'liveboard',
              hidden: false,
            })
          "
        />
        <el-divider />
        <div style="text-align: left; margin: 10px; font-weight: 600">
          低代码视图组件
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/amiscomponent.png'"
          style="
            width: 70px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'amiscomponent',
              data: {
                id: `a8d787d0ec`, //amis_${new Date().getTime()}
                width: 500,
                height: 350,
                fill: 'rgba(23, 37, 76, 0.7)',
                text: '低代码视图组件',
                source: 'api',
                src: '/dgiot_file/topo/png/amiscomponent.png',
              },
              chart: 'amisview',
              hidden: false,
            })
          "
        />
        <el-divider />
      </a-collapse-panel>
      <a-collapse-panel
        v-if="!$route.query.dashboard"
        key="6"
        :header="$translateTitle('topo.print control')"
      >
        <el-button
          draggable="true"
          size="mini"
          type="primary"
          @click.native="
            createBasicPrint({
              productid: $route.query.productid,
              type: 'printer',
              hidden: false,
            })
          "
        >
          打印标签
        </el-button>
        <el-button
          draggable="true"
          size="mini"
          style="margin: 10px"
          type="primary"
          @click.native="
            createBasicRect({
              productid: $route.query.productid,
              type: 'printer',
              hidden: false,
            })
          "
        >
          打印矩形框
        </el-button>
        <el-divider />
        <!-- http://dev.iotn2n.com/dgiot_file/topo/png/pump.png -->
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
  import addNodeEvent from '@/utils/konva/common'
  import canvas from '@/utils/konva/core/canvas'
  import createThing from '@/utils/konva/createThing'
  import { mapMutations } from 'vuex'
  import getSvgPath from '@/utils/konva/getSvgPath'
  import Thing from '@/views/CloudFunction/topo/components/Thing'
  import Amis from '@/views/CloudFunction/topo/components/Amis'
  // import TopoThing from '@/views/topo/components/TopoThing'
  import Background from '@/views/CloudFunction/topo/components/Background'
  import Evidence from '@/views/CloudFunction/topo/components/TopoEvidence'

  const regUrl =
    /(\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
  // const { cdn } = require('../../../config')
  const cdn = process.env.CDN_URL
  const path = require('path')
  const imgHost = regUrl.test(cdn)
    ? `${cdn}/assets/images/dgiot_release/topo/`
    : path.join(
        __dirname,
        `${process.env.BASE_URL}/assets/images/dgiot_release/topo/`
      )
  // https://blog.csdn.net/u010007013/article/details/102674042
  // console.log(imgHost, process.env.BASE_URL, process.env)
  //   20210821112723
  //   https://at.alicdn.com/t/font_2759556_r8d9wroaw8.json
  // const iconfont = require('https://at.alicdn.com/t/font_2759556_r8d9wroaw8.json')
  const iconfont = require('./iconfont.json')
  export default {
    name: 'TopoTabs',
    components: {
      Thing,
      Amis,
      Background,
      Evidence,
    },
    props: {
      isDirver: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    data() {
      return {
        inputParams: {},
        upImgType: 'bg',
        tabPosition: 'left',
        iconfont,
        busData: {
          coordinate: {},
          paths: [],
        },
        accept: '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF',
        imgHost: imgHost,
        icon: '24-hours-fill',
        layout: 'total, prev, next',
        total: 0,
        background: true,
        height: 0,
        selectRows: '',
        queryIcon: [],
        queryForm: {
          pageNo: 1,
          pageSize: 30,
          title: '',
        },
        images: [],
        imgParams: {},
        activeNames: 'icon',
      }
    },
    computed: {},
    created() {
      // this.fetchData()
    },
    mounted() {
      this.$dgiotBus.$off('copyNode')
      this.$dgiotBus.$on('copyNode', (e) => {
        console.log('接收节点', e)
        if (
          e.attrs.type == 'thing' ||
          e.attrs.type == 'static' ||
          e.parent.attrs.name == 'amis'
        ) {
          //实时数据
          let data = e.parent.attrs
          data.x = data.x - 10
          data.y = data.y - 10
          var simpleLabel = new Konva.Label(data)
          simpleLabel.add(new Konva.Tag(e.parent.children[0].attrs))
          simpleLabel.add(new Konva.Text(e.parent.children[1].attrs))
          canvas.layer.add(simpleLabel)
        } else if (
          e.attrs.type == 'konvaimage' ||
          e.attrs.type == 'staticimage'
        ) {
          // 控制绑定
          let data = e.attrs
          data.x = data.x - 10
          data.y = data.y - 10
          // var imageObj = new Image()
          // imageObj.src = data.src
          // data.image = imageObj
          var simpleImage = new Konva.Image(data)
          canvas.layer.add(simpleImage)
        } else if (e.attrs.type == 'label') {
          // 控制绑定
          let data = e.attrs
          data.x = data.x - 10
          data.y = data.y - 10
          var simpleText = new Konva.Text(data)
          canvas.layer.add(simpleText)
        }
        addNodeEvent({
          type: 'handleChildren',
          stage: canvas.stage,
          layer: canvas.layer,
          args: canvas.handlerArgs,
        })
      })
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      handleDragStart(e) {
        e.dataTransfer.setData('index', e.target)
        this.$dgiotBus.$emit('dgiotDragStart', e)
      },
      coordinate(e) {
        const _coordinate = {
          x: e.pageX,
          y: e.pageY,
        }
        this.busData.coordinate = _coordinate
      },

      moveSvg(item) {
        let el = getSvgPath(item, 'path')
        const paths = JSON.stringify(el.topo)
        this.busData.paths = paths
        this.$dgiotBus.$emit('busTopo', 'path', this.busData)
      },
      /**
       *
       * @param type
       */
      createdText(type) {
        //  调用vuex的新增文本控件
        const res = createThing({
          productid: 'productid',
          thingid: 'thingid',
        })
      },
      uploadCkick(type) {
        this.upImgType = type
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
        this.inputParams = {
          file: '',
          scene: 'app',
          path: 'product/topo/',
          filename: this.$route.query.productid
            ? `${this.$route.query.productid}_bg`
            : `${new Date().getTime()}_bg`,
        }
      },
      files(file, type) {
        this.inputParams.filename = this.$route.query.productid
          ? `${this.$route.query.productid}_bg`
          : `${new Date().getTime()}_bg`
        this.inputParams.file = file
      },
      ...mapMutations({
        setFlag: 'konva/setFlag',
        setDrawParams: 'konva/setDrawParams',
        createThing: 'topo/createThing',
        createBasicThing: 'topo/createBasicThing',
        createBasicPrint: 'topo/createBasicPrint',
        createBasicRect: 'topo/createBasicRect',
        createAmis: 'topo/createAmis',
        createHistory: 'topo/createHistory',
        setKonvaBg: 'topo/setKonvaBg',
      }),
      // mousedown(item) {
      //   this.$emit('fatherMousedown', item)
      // },
      // mousemove(item) {
      //   this.$emit('fatherMousemove', item)
      //   // console.log(item)
      // },
      // mouseup(item) {
      //   this.$emit('fatherMouseup', item)
      // },
      async fileInfo(res) {
        if (this.upImgType === 'img') {
          await this.handleIcon(res.url)
        } else {
          //  直接设置背景图的地址
          localStorage.setItem('konvaBg', res.path)
          await this.setKonvaBg(res.path)
          //  然后重新绘制一下 使用vuex topo
        }
      },
      handleIcon(url) {
        var img = new Image()
        let _this = this
        img.src = url + '?' + new Date().getTime()
        img.onload = function () {
          _this.$set(_this.imgParams, 'width', img.width)
          _this.$set(_this.imgParams, 'height', img.height)
          _this.$set(_this.imgParams, 'src', img.src)
          _this.$baseMessage(
            _this.$translateTitle('图片加载完成,可双击画图区域填充'),
            'success',
            false,
            'dgiot-hey-message-success'
          )
        }
        _this.setFlag('image')
        _this.setDrawParams(_this.imgParams)
        // this.icon = item
        // this.queryForm.title = item
        // _this.$emit('handle-icon', item)
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style>
  .ant-collapse-content-box {
    text-align: center;
  }
</style>
<style lang="scss" scope>
  .icon-selector-popper {
    height: calc(100vh - #{$base-top-bar-height} * 3.5);
    margin-left: 0px;
    overflow-x: hidden;
    overflow-y: scroll;

    .el—card {
      height: 40px !important;
      padding: 10px;
    }

    .el-collapse-item__header {
      display: block;
      margin: 0 auto;
      text-align: center;
    }

    .el-card__body {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 20px;
      cursor: pointer;

      i {
        font-size: 28px;
        color: $base-color-gray;
        text-align: center;
        vertical-align: middle;
        pointer-events: none;
        cursor: pointer;
      }
    }

    .el-pagination {
      margin: 0;
    }
  }
</style>
