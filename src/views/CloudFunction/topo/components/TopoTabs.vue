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
        <div
          style="
            text-align: left;
            margin: 10px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
          "
        >
          <div style="font-size: 18px">动图</div>
          <el-button type="primary" @click="handleUploadImg('gif')">
            动图上传
          </el-button>
        </div>
        <img
          v-for="(o, index) in gifList"
          :key="o.md5 + index"
          draggable="true"
          size="mini"
          :src="$FileServe + o.src"
          style="
            width: 50px;
            height: 50px;
            display: inline-block;
            margin-left: 20px;
            margin-top: 10px;
            background-color: #f1f3f4;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'knovaimage',
              image: o.src,
              data: {
                width: o.width,
                height: o.height,
              },
              hidden: false,
            })
          "
        />
        <el-divider />
        <div
          style="
            text-align: left;
            margin: 10px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
          "
        >
          <div style="font-size: 18px">静图</div>
          <el-button type="primary" @click="handleUploadImg('static')">
            静图上传
          </el-button>
        </div>
        <img
          v-for="(item, index) in staticList"
          :key="item.md5 + index"
          draggable="true"
          size="mini"
          :src="$FileServe + item.src"
          style="
            width: 40px;
            height: 40px;
            display: inline-block;
            margin-left: 20px;
            margin-top: 10px;
          "
          type="primary"
          @click="
            createBasicThing({
              productid: $route.query.productid,
              type: 'staticimage',
              data: {
                width: item.width,
                height: item.height,
              },
              image: item.src,
              hidden: false,
            })
          "
        />
        <el-divider />
        <el-divider />
        <div
          style="
            text-align: left;
            margin: 10px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
          "
        >
          <div style="font-size: 18px">时间</div>
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/realtime.png'"
          style="
            width: 70px;
            height: 20px;
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
                id: 'realtime',
                width: 170,
                height: 25,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '当前时间',
                source: 'api',
                src: '/dgiot_file/topo/png/realtime.png',
              },
              chart: 'realtime',
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
          v-if="$route.query.dashboard"
          draggable="true"
          size="mini"
          type="danger"
          @click.native="
            createRealData({
              type: 'realdata',
              hidden: false,
            })
          "
        >
          实时数据源
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
        <div style="text-align: left; margin: 10px; font-weight: 600">
          历史统计图表
        </div>
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/devicebar.png'"
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
                id: 'bar_historydata',
                width: 525,
                height: 380,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '设备历史数据柱状图',
                source: 'api',
                src: '/dgiot_file/topo/png/devicebar.png',
              },
              chart: 'devicebar',
              hidden: false,
            })
          "
        />
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/deviceline.png'"
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
                id: 'line_historydata',
                width: 400,
                height: 260,
                fill: 'rgba(30, 30, 30, 0.7)',
                text: '设备历史数据折线图',
                source: 'api',
                src: '/dgiot_file/topo/png/deviceline.png',
              },
              chart: 'line',
              hidden: false,
            })
          "
        />
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
        <div style="text-align: left; margin: 10px; font-weight: 600">
          告警模板
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
        <img
          draggable="true"
          size="mini"
          :src="$FileServe + '/dgiot_file/topo/png/warninglist1.png'"
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
                id: 'warning_list1',
                width: 290,
                height: 210,
                text: '告警列表',
                source: 'api',
                src: '/dgiot_file/topo/png/warninglist1.png',
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
                text: '',
                source: 'api',
                src: '/dgiot_file/topo/png/baidumap.png',
              },
              chart: 'map',
              hidden: false,
            })
          "
        />
        <el-divider />
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
                text: '',
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
    <input
      id="file"
      ref="file"
      accept="image/gif,image/jpeg,image/png,image/jpg"
      style="display: none"
      type="file"
      @change="getFileData($event)"
    />
  </div>
</template>

<script>
  import { UploadTopoImg } from '@/api/File'
  import addNodeEvent from '@/utils/konva/common'
  import canvas from '@/utils/konva/core/canvas'
  import createThing from '@/utils/konva/createThing'
  import { mapMutations, mapGetters } from 'vuex'
  import getSvgPath from '@/utils/konva/getSvgPath'
  import Thing from '@/views/CloudFunction/topo/components/Thing'
  import Amis from '@/views/CloudFunction/topo/components/Amis'
  // import TopoThing from '@/views/topo/components/TopoThing'
  import Background from '@/views/CloudFunction/topo/components/Background'
  import Evidence from '@/views/CloudFunction/topo/components/TopoEvidence'
  import {
    delete_file,
    file_info,
    list_dir,
    getproductTree,
  } from '@/api/System/filemanagement'
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
        staticList: [],
        gifList: [],
        uploadType: '', //上传类型
      }
    },
    computed: {
      ...mapGetters({
        token: 'user/token',
      }),
    },
    async created() {
      this.initImage('static')
      this.initImage('gif')
    },
    mounted() {
      this.$dgiotBus.$off('copyNode')
      this.$dgiotBus.$on('copyNode', (e) => {
        console.log('接收节点', e)
        if (
          e.attrs.type == 'thing' ||
          e.attrs.type == 'realdata' ||
          e.attrs.type == 'static' ||
          e.parent.attrs.name == 'amis'
        ) {
          //实时数据
          let data = JSON.parse(JSON.stringify(e.parent.attrs))
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
          let data = JSON.parse(JSON.stringify(e.attrs)) //e.attrs
          data.x = data.x - 10
          data.y = data.y - 10
          // var imageObj = new Image()
          // imageObj.src = data.src
          // data.image = imageObj
          var simpleImage = new Konva.Image(data)
          canvas.layer.add(simpleImage)
        } else if (e.attrs.type == 'label') {
          // 控制绑定
          let data = JSON.parse(JSON.stringify(e.attrs))
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
      // 创建实时数据源节点
      createRealData(data) {
        var simpleLabel = new Konva.Label({
          name: 'realdata',
          x: 100,
          y: 100,
          draggable: true,
          id: 'dgiot_text' + new Date().getTime(),
        })
        simpleLabel.add(
          new Konva.Tag({
            fill: 'rgba(255,0,0,1)',
            attrs: {
              name: 'dblclick',
              width: 170,
              height: 45,
            },
          })
        )
        simpleLabel.add(
          new Konva.Text({
            id: 'realdata_text_' + new Date().getTime(),
            text: 'dgiot_text_123',
            screen_wmxid: '',
            screen_deviceid: '',
            screen_productid: '',
            fontSize: 20,
            type: 'realdata',
            lineHeight: 1.2,
            width: 170,
            height: 45,
            padding: 10,
            fontFamily: 'Calibri',
            fill: 'rgba(255,255,255,1)',
            x: 0,
            y: 0,
          })
        )
        this.addinitKonva(simpleLabel)
      },
      addinitKonva(node) {
        canvas.layer.add(node)
        addNodeEvent({
          type: 'handleChildren',
          stage: canvas.stage,
          layer: canvas.layer,
          args: canvas.handlerArgs,
        })
      },
      createStaticText(data) {
        let attrs = {
          id: data.productid || `text_${new Date().getTime()}`,
          type: data.type,
          x: 20,
          y: 60,
          text: '静态文本内容',
          fontSize: 18,
          fontFamily: 'Calibri',
          fill: '#fff',
          width: 200,
          draggable: true,
        }
        let simpleLabel = new Konva.Text(attrs)
        canvas.layer.add(simpleLabel)
        addNodeEvent({
          type: 'handleChildren',
          stage: canvas.stage,
          layer: canvas.layer,
          args: canvas.handlerArgs,
        })
      },
      async initImage(type) {
        let res = await list_dir(`dgiot_file/topo/${type}`) //this.get_filelist()
        // console.log('动态图片列表', resgif.data)
        let List = []
        res.data.forEach((element) => {
          var img = new Image()
          // $FileServe + '/dgiot_file/topo/png/amiscomponent.png
          img.src = `${this.$FileServe}/${element.path}/${element.name}`
          // console.log('图片宽高', img.width, img.height)
          let item = {
            mtime: element.mtime,
            src: `/${element.path}/${element.name}`,
            width: img.width == 0 ? 200 : img.width + 10,
            height: img.height == 0 ? 200 : img.height + 10,
          }
          List.push(item)
          // img.src = this.$
        })
        if (type == 'gif') {
          this.gifList = List
        } else if (type == 'static') {
          this.staticList = List
        }
      },
      handleUploadImg(type) {
        // console.log(this.$refs.file)
        this.uploadType = type
        this.$refs.file.click()
      },
      getFileData(e) {
        // console.log(e.target.files[0])
        // return
        let file = e.target.files[0]
        var data = new FormData()
        let time = new Date().getTime()
        data.append('file', file)
        data.append('scene', 'app')
        data.append('filename', file.name)
        // data.append("timestamp", time);
        data.append('output', 'json')
        data.append('path', `dgiot_file/topo/${this.uploadType}`)
        console.log('token', this.token)
        // store.getters['user/token'],
        data.append('auth_token', this.token)
        data.append('code', '')
        data.append('submit', 'upload')
        UploadTopoImg(data)
          .then(async (res) => {
            var img = new Image()
            // $FileServe + '/dgiot_file/topo/png/amiscomponent.png
            img.src = res.data.url
            console.log(res)
            let item = {
              mtime: res.data.mtime,
              src: res.data.path,
              width: img.width == 0 ? 200 : img.width + 10,
              height: img.height == 0 ? 150 : img.height + 10,
            }
            if (this.uploadType == 'static') {
              this.createBasicThing({
                productid: this.$route.query.productid,
                type: 'staticimage',
                data: {
                  width: item.width,
                  height: item.height,
                },
                image: item.src,
                hidden: false,
              })
              this.initImage('static')
            } else if (this.uploadType == 'gif') {
              this.createBasicThing({
                productid: this.$route.query.productid,
                type: 'knovaimage',
                image: item.src,
                data: {
                  width: item.width,
                  height: item.height,
                },
                hidden: false,
              })
              this.initImage('gif')
            }
          })
          .catch((err) => {})
      },
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
      // async get_filelist(path) {
      //   // this.listLoading = true
      //   let res = await list_dir(path)
      //   return res
      // },
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
