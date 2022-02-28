<!--
* @Author: h7ml
* @Date: 2021-11-02 19:55:00
* @LastEditors: h7ml
* @LastEditTime: 2021-11-02 19:55:00
* @Description: 物模型取证组件
* @FilePath: src\views\topo\components\TopoEvidence.vue
* @document https://fonts.google.com/icons?selected=Material+Icons
* @api https://github.com/material-components/material-web/tree/ae060177fac6ab2d7987a49ff9f34f0de2c335af/packages/icon-button
* @DocumentLink:
-->
<!--eslint-disable-->
<template>
  <div class="TopoEvidence">
    <el-dialog
      :title="$translateTitle('topo.topo') + $translateTitle('topo.thing')"
      :visible.sync="evidenceDialog"
      append-to-body
      top="5vh"
    >
      <el-card v-if="evidence.id" class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <i class="material-icons">
            {{ evidence.node.attrs.icon }}
          </i>
          <el-button style="float: right; padding: 3px 0" type="text">
            {{ evidence.id ? evidence.id.split('_')[0] : '' }}
          </el-button>
        </div>
        <div>
          类型的图元处理逻辑
          <br />
          对应数据 {{ evidence.evidenceList }}
          <div v-if="evidence.node.attrs.icon === 'timeline'">
            <dgiotChart
              ref="charts"
              :after-config="afterConfig"
              :data="chartData"
              :data-zoom="chartDataZoom"
              :extend="chartExtend"
              :loading="loading"
              :set-option-opts="false"
              :settings="chartSettings"
              :toolbox="toolbox"
              type="line"
            />
          </div>
          <div v-else-if="evidence.node.attrs.icon === 'live_tv'"></div>
          <div v-else-if="evidence.node.attrs.icon === 'videocam_black'"></div>
          <div v-else-if="evidence.node.attrs.icon === 'volume_mute'"></div>
          <div v-else-if="evidence.node.attrs.icon === 'image'">
            <el-image
              :preview-src-list="srcList"
              :src="url"
              style="width: 100px; height: 100px"
            ></el-image>
          </div>
          <div v-else-if="evidence.node.attrs.icon === 'folder_black'"></div>
          <div v-else>
            无该类型取证类型
            {{ evidence }}
          </div>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="evidenceDialog = false">取 消</el-button>
        <el-button type="primary" @click="evidenceDialog = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <div class="TopoEvidence-content">
      <div
        v-for="(item, index) in materialIcons"
        :key="index"
        class="TopoEvidence-content-icons"
      >
        <i
          v-dragBox
          class="material-icons"
          draggable
          @click="evidenceHandle(item, index)"
        >
          {{ item.icon }}
          <br />
          <el-link :underline="false">{{ item.text }}</el-link>
        </i>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    name: 'TopoEvidence',
    components: {},
    directives: {
      dragBox: function (el) {
        let dragBox = el //获取当前元素
        dragBox.onclick = (e) => {
          // console.log(e,'点击的节点')
        }
        dragBox.onmousedown = (e) => {
          //算出鼠标相对元素的位置
          let disX = e.clientX - dragBox.offsetLeft
          let disY = e.clientY - dragBox.offsetTop
          dragBox.onmousemove = (e) => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX
            let top = e.clientY - disY
            //移动当前元素
            dragBox.style.left = left + 'px'
            dragBox.style.top = top + 'px'
            // console.error(dragBox,'dragBox')
          }
          dragBox.onmouseup = (e) => {
            // //鼠标弹起来的时候不再移动
            // dragBox.onmousemove = null
            // dragBox.onmousedown = null
            // //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
            // dragBox.onmouseup = null
          }
        }
      },
    },
    data() {
      return {
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        srcList: [
          'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
          'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
        ],
        loading: false,
        evidence: {},
        chartSettings: {},
        chartExtend: {
          series: {
            barMaxWidth: 35,
          },
          dataZoom: [
            // 鼠标滚轮滚动
            // {
            //   type: 'inside',
            // },
            // 坐标轴滚动
            {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              left: '9%',
              bottom: -5,
              start: 10,
              end: 90, //初始化滚动条
            },
          ],
          grid: {
            right: 40,
          },
        },
        dataEmpty: true,
        chartDataZoom: [{ type: 'slider' }],
        chartData: {
          columns: ['日期', '销售额'],
          rows: [
            {
              日期: '1月1日',
              销售额: 123,
            },
            {
              日期: '1月2日',
              销售额: 1223,
            },
            {
              日期: '1月3日',
              销售额: 2123,
            },
            {
              日期: '1月4日',
              销售额: 4123,
            },
            {
              日期: '1月5日',
              销售额: 3123,
            },
            {
              日期: '1月6日',
              销售额: 7123,
            },
          ],
        },
        toolbox: {
          orient: 'vertical',
          right: -5,
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
            },
            magicType: {
              type: [
                'line',
                'bar',
                'histogram',
                'pie',
                'ring',
                'waterfall',
                'funnel',
                'radar',
                'heatmap',
                'scatter',
                'candle',
                'stack',
              ],
            },
            dataView: {
              show: true,
              readOnly: false,
            },
            saveAsImage: { show: true },
            restore: { show: true },
          },
        },
        thingData: [],
        evidenceDialog: false,
        coordinate: {
          client: {},
          elePosition: {},
        },
        materialIcons: [
          // {
          //   icon: 'timeline',
          //   type: '',
          //   path: 'M23,8c0,1.1-0.9,2-2,2c-0.18,0-0.35-0.02-0.51-0.07l-3.56,3.55C16.98,13.64,17,13.82,17,14c0,1.1-0.9,2-2,2s-2-0.9-2-2 c0-0.18,0.02-0.36,0.07-0.52l-2.55-2.55C10.36,10.98,10.18,11,10,11s-0.36-0.02-0.52-0.07l-4.55,4.56C4.98,15.65,5,15.82,5,16 c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2c0.18,0,0.35,0.02,0.51,0.07l4.56-4.55C8.02,9.36,8,9.18,8,9c0-1.1,0.9-2,2-2s2,0.9,2,2 c0,0.18-0.02,0.36-0.07,0.52l2.55,2.55C14.64,12.02,14.82,12,15,12s0.36,0.02,0.52,0.07l3.55-3.56C19.02,8.35,19,8.18,19,8 c0-1.1,0.9-2,2-2S23,6.9,23,8z',
          // },
          // {
          //   icon: 'live_tv',
          //   type: '',
          //   path: 'M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12zM9 10v8l7-4z',
          // },
          {
            icon: 'videocam_black',
            type: 'video',
            text: '视频',
            path: 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z',
          },
          {
            icon: 'volume_mute',
            type: 'audio',
            text: '音频',
            path: 'M7 9v6h4l5 5V4l-5 5H7z',
          },
          {
            icon: 'image',
            type: 'image',
            text: '图片',
            path: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
          },
          {
            icon: 'folder_black',
            type: 'file',
            text: '文件',
            path: 'M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z',
          },
        ],
      }
    },
    mounted() {
      this.$dgiotBus.$on(
        this.$dgiotBus.topicKey('dgiot_evidence', 'dgiotEvidence'),
        (msg) => {
          this.dgiotEvidence(msg)
        }
      )
    },
    methods: {
      ...mapMutations({
        createdEvidence: 'topo/createdEvidence',
      }),
      afterConfig(options) {
        options.tooltip.showDelay = 500
        return options
      },
      async dgiotEvidence(args) {
        this.evidenceDialog = true
        this.evidence = args
      },
      evidenceHandle(icon, index) {
        this.createdEvidence(
          _.merge(icon, {
            index: index,
            // blue表示取证阶段，黄色表示审核阶段，绿色标识审核通过，红色标识审核不过
            fill: 'orange',
            productid: this.$route.query.productid,
          })
        )
      },
    },
  }
</script>
<style>
  .material-icons {
    width: 48px;
    height: 48px;
    font-size: 48px !important;
    cursor: pointer;
  }
</style>
<style lang="scss" scoped>
  .TopoEvidence {
    width: 100%;
    height: 100%;

    &-content {
      width: 100%;
      height: 100%;
    }
  }
</style>
