<template lang="pug">
.canvas-props
  h3.tips 操作栏
  .group
    .title 快捷操作
    .container
      .item.full-item
       el-button(@click="onAddPipeLine") 绘制水管

  .group
    .title 基础配置
    .container
      .item.full-item
        .label 选择底图
        el-select(v-model='baseImg', placeholder='选择底图', @change='handleBaseImg')
          el-option(v-for='item in baseImgList', :key='item.value', :label='item.label', :value='item.value')
      .item
        .label 禁用滚轮缩放
        el-switch(v-model="canvasOptions.disableScale" @change='onChangeOptions')

      //- .item
      //-   .label 画布宽度（px）
      //-   el-input-number(v-model="canvasOptions.width" @change='onChangeOptions')
      //- .item
      //-   .label 画布高度（px）
      //-   el-input-number(v-model="canvasOptions.height" @change='onChangeOptions')
      //- .item
      //-   .label 选中颜色
      //-   el-color-picker(v-model="canvasOptions.bkColor" @change='onChangeOptions')
      //- .item
      //-   .label 线条/边框颜色
      //-   el-color-picker(v-model="canvasOptions.color" @change='onChangeOptions')
      //- .item
      //-   .label 活动层颜色
      //-   el-color-picker(v-model="canvasOptions.hoverColor" @change='onChangeOptions')

  div(v-if="!props.node && !props.line && !props.multi")
    .bottom
      .title 小提示
      ul.group
        li 方向键：控制节点移动5个像素
        li Ctrl + 方向键：控制节点移动1个像素
        li Ctrl + 鼠标移动：移动整个画布
        li Ctrl + 鼠标滚轮：缩放
        li 添加或选中节点，右侧属性支持上传各种图片

  // 多节点对齐
  .props-container(v-if="props.multi")
    .group
      .title 节点对齐
      .item.full-item
        span(
          v-for="item of nodesAlgin" :key="item"
          style="padding-left: 20px;cursor: pointer")
          i(:class="`iconfont icon-align-${ item }`"
            @click="onNodesAlign(item)")

  // 线条属性
  .props-container(v-if="props.line")
    .group
      .title 业务属性
      .item.full-item
        .label 关联业务（点位）
        el-select(
          v-model='props.line.tags'
          multiple
          allow-create
          default-first-option
          placeholder='关联设备'
          @change='onChange')
          el-option(
            v-for='item in deviceList',
            :key='item.value',
            :label='item.label',
            :value='item.value')
    .group
      .title 位置和大小
      .container
        .item
          .label 起点X（px)
          el-input-number(v-model='props.line.from.x', controls-position='right', @change='onChange')
        .item
          .label 起点Y （px）
          el-input-number(v-model='props.line.from.y', controls-position='right', @change='onChange')
        .item
          .label 终点X（px)
          el-input-number(v-model='props.line.to.x', controls-position='right', @change='onChange')
        .item
          .label 终点Y （px）
          el-input-number(v-model='props.line.to.y', controls-position='right', @change='onChange')

    .group
      .title 线条属性
      .container
        .item
          .label 连线类型
          el-select(v-model='props.line.name', placeholder='选择连线类型', @change='onChange')
            el-option(v-for='item in lineTypeOptions', :key='item.value', :label='item.label', :value='item.value')
              span {{ item.label }}
              svg(xmlns="http://www.w3.org/2000/svg" version="1.1" style="width: 100px")
                  g(fill="none" stroke="black" stroke-width="1")
                    path(d="M0 9 l100 0" v-if="item.value === 'line'")
                    path(d="M0 9 a100,50 0 0,1 85,0" v-if="item.value === 'curve'")
                    path(d="M0 4 l40 0 l0 12 l40 0" v-if="item.value === 'polyline'")
        .item
          .label 连线样式
          el-select(v-model='props.line.dash', placeholder='选择连线类型', @change='onChange')
            el-option(v-for='index in 4', :key='index', :label='index', :value='index -1')
              svg(xmlns="http://www.w3.org/2000/svg" version="1.1" style="width: 100px")
                  g(fill="none" stroke="black" stroke-width="1")
                    path(d="M0 9 l85 0" v-if="index ===  1")
                    path(stroke-dasharray="5,5" d="M0 9 l85 0" v-if="index === 2")
                    path(stroke-dasharray="10,10" d="M0 9 l85 0" v-if="index === 3")
                    path(stroke-dasharray="10,10,2,10" d="M0 9 l85 0" v-if="index === 4")
        .item
          .label 连线颜色
          el-color-picker(v-model="props.line.strokeStyle" show-alpha @change='onChange')
        .item
          .label 连线宽度（px）
          el-input-number(v-model="props.line.lineWidth" @change='onChange')
        .item
          .label 边框颜色
          el-color-picker(v-model="props.line.borderColor" show-alpha @change='onChange')
        .item
          .label 边框宽度（px）
          el-input-number(v-model="props.line.borderWidth" @change='onChange')
        .item.full-item
          .label 透明度（0-1）
          el-input-number(:min="0" :max="1" v-model="props.line.globalAlpha" @change='onChange')

    .group
      .title 预设动画
      .container
        .item.full-item
          .label 动画效果
          el-select(v-model="props.line.animateType" @change='onChangeLineAnimate')
            el-option(
              v-for="item in lineAnimateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value")
        .item
          .label 动画效果
          el-color-picker(v-model="props.line.animateColor" show-alpha @change='onChangeLineAnimate')
        .item
          .label 圆点大小（px）
          el-input-number(v-model="props.line.animateDotSize" @change='onChangeLineAnimate')
        .item
          .label 动画速度
          el-input-number(
            :min="1" :max="5"
            v-model="props.line.animateSpan"
            @change='onChangeLineAnimate')
        .item
          .label 循环次数
          el-input-number(
            v-model="props.line.animateCycle"
            placeholder="<1表示无限循环"
            @change='onChangeLineAnimate')

  // 节点属性
  .props-container(v-if="props.node")
    .group
      .title 业务属性
      .item.full-item
        .label 关联业务（点位）
        el-select(
          v-model='props.node.tags',
          multiple
          allow-create
          default-first-option
          placeholder='关联设备'
          @change='onChange')
          el-option(
            v-for='item in deviceList',
            :key='item.value',
            :label='item.label',
            :value='item.value')
      .item.full-item
        .label 允许点击（查看设备详情）
        el-switch(v-model="currNodeEnable")

    .group
      .title 位置和大小
      .container
        .item
          .label X（px)
          el-input-number(v-model='props.node.rect.x', controls-position='right', @change='onChange')
        .item
          .label Y （px）
          el-input-number(v-model='props.node.rect.y', controls-position='right', @change='onChange')

        .item
          .label 宽（px）
          el-input-number(v-model='props.node.rect.width', controls-position='right', @change='onChange')
        .item
          .label 高（px）
          el-input-number(v-model='props.node.rect.height', controls-position='right', @change='onChange')

    .group
      .title 边框属性
      .container
        .item
          .label 边框样式
          el-select(v-model='props.node.dash', placeholder='选择连线类型', @change='onChange')
            el-option(v-for='index in 4', :key='index', :label='index', :value='index -1')
              svg(xmlns="http://www.w3.org/2000/svg" version="1.1" style="width: 100px")
                  g(fill="none" stroke="black" stroke-width="1")
                    path(d="M0 9 l85 0" v-if="index ===  1")
                    path(stroke-dasharray="5,5" d="M0 9 l85 0" v-if="index === 2")
                    path(stroke-dasharray="10,10" d="M0 9 l85 0" v-if="index === 3")
                    path(stroke-dasharray="10,10,2,10" d="M0 9 l85 0" v-if="index === 4")
        .item
          .label 边框颜色
          el-color-picker(v-model="props.node.strokeStyle" show-alpha @change='onChange')
        .item
          .label 边框宽度（px）
          el-input-number(v-model="props.node.lineWidth" show-alpha @change='onChange')
        .item
          .label 背景颜色
          el-color-picker(v-model="props.node.fillStyle" show-alpha @change='onChange')
        .item
          .label 透明度（0-1）
          el-input-number(v-model="props.node.globalAlpha" @change='onChange')
    .group
      .title 图片属性
      .item.full-item
        .label 图片链接（px）
        el-input(v-model='props.node.image', @change='onChange')

    .group
      .title 字体图标属性
      .container
        .item
          .label 图标大小（px）
          el-input-number(:min="6" :max="100" v-model='props.node.iconSize', @change='onChange')
        .item
          .label 图标颜色
          el-color-picker(v-model="props.node.iconColor" show-alpha @change='onChange')

    .group
      .title 文字属性
      .container
        .item
          .label 颜色
          el-color-picker(v-model="props.node.font.color" show-alpha @change='onChange')
        .item
          .label 大小（px）
          el-input-number(v-model="props.node.font.fontSize" @change='onChange')
        .item
          .label 加粗
          el-select(v-model="props.node.font.fontWeight" @change='onChange')
            el-option(
              v-for="item in fontWeightOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value")
        .item
          .label 倾斜
          el-select(v-model="props.node.font.fontStyle" @change='onChange')
            el-option(
              v-for="item in fontStyleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value")
        .item
          .label 水平对齐
          el-select(v-model="props.node.font.textAlign" @change='onChange')
            el-option(
              v-for="item in textAlignOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value")
        .item
          .label 垂直对齐
          el-select(v-model="props.node.font.textBaseline" @change='onChange')
            el-option(
              v-for="item in textBaselineOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value")
        .item.full-item
          .label 文字内容
          el-input(type="textarea" v-model="props.node.text" @change='onChange')

    .group
      .title 预设动画
      .container
        .item.full-item
          .label 动画效果
          el-select(v-model="props.node.animateType" @change='onChangeAnimate')
            el-option(
              v-for="item in animateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value")
    .group
      .title 媒体资源
      .container
        .item.full-item
          .label 音频URL
          el-input(v-model="props.node.audio" @change='onChange')
        .item.full-item
          .label 视频URL
          el-input(v-model="props.node.video" @change='onChange')
        .item.full-item
          .label 联动视频地址
          el-select(v-model="props.node.video" @change='onChange')
            el-option(
              v-for="item in videoList"
              :key="item.value"
              :label="item.label"
              :value="item.value")
        .item.full-item
          .label 网页URL
          el-input(v-model="props.node.iframe" @change='onChange')



</template>

<script>
/* eslint-disable */
import { Node } from 'topology-core/models/node'
  import { Line } from 'topology-core/models/line'
  import { Point } from 'topology-core/models/point'
  export default {
    props: {
      canvas: {
        type: Object,
        require: true,
        default: () => {},
      },
      options: {
        type: Object,
        require: true,
        default: () => {},
      },
      props: {
        type: Object,
        require: true,
        default: () => {},
      },
    },
    data() {
      return {
        baseImg: '',
        canvasOptions: {
          width: this.options.width,
          height: this.options.height,
          disableScale: this.options.disableScale,
        },

        // 属性枚举值
        fontWeightOptions: [
          {
            value: 'normal',
            label: '正常',
          },
          {
            value: 'bold',
            label: '加粗',
          },
        ],
        fontStyleOptions: [
          {
            value: 'normal',
            label: '正常',
          },
          {
            value: 'italic',
            label: '倾斜',
          },
        ],
        textAlignOptions: [
          {
            value: 'left',
            label: '左对齐',
          },
          {
            value: 'center',
            label: '居中',
          },
          {
            value: 'right',
            label: '右对齐',
          },
        ],
        textBaselineOptions: [
          {
            value: 'top',
            label: '顶部对齐',
          },
          {
            value: 'middle',
            label: '居中',
          },
          {
            value: 'bottom',
            label: '底部对齐',
          },
        ],
        lineAnimateOptions: [
          {
            value: 'beads',
            label: '水珠流动',
          },
          {
            value: 'dot',
            label: '圆点',
          },
          {
            value: 'comet',
            label: '彗星',
          },
        ],
        animateOptions: [
          {
            value: 'forwardRotate',
            label: '顺时针旋转',
          },
          {
            value: 'reverseRotate',
            label: '逆时针旋转',
          },
          {
            value: 'heart',
            label: '告警',
          },
          {
            value: 'show',
            label: '炫耀',
          },
        ],
        lineTypeOptions: [
          { label: '直线', value: 'line' },
          { label: '曲线', value: 'curve' },
          { label: '线段', value: 'polyline' },
        ],
        nodesAlgin: ['left', 'right', 'top', 'bottom', 'center', 'middle'],
        // ---------- 业务数据 ------------- //

        baseImgList: [
          {
            label: '酒店1层',
            value: require('@/assets/images/baseImg/floor.png'),
          },
          {
            label: '演示底图',
            value: require('@/assets/images/baseImg/yohuo.png'),
          },
        ],
        deviceList: [
          {
            label: '点位1',
            value: 'device001',
          },
          {
            label: '点位2',
            value: 'device002',
          },
          {
            label: '点位3',
            value: 'device003',
          },
          {
            label: '点位4',
            value: 'device004',
          },
          {
            label: '点位5',
            value: 'device005',
          },
        ],
        videoList: [
          {
            label: '火灾联动',
            value: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
          },
          {
            label: '动物世界',
            value: 'http://vjs.zencdn.net/v/oceans.mp4',
          },
        ],
      }
    },
    computed: {
      currNodeEnable: {
        get() {
          let enable = (this.props.node.data || {}).enable
          return enable || false
        },
        set(val) {
          if (this.props.node.data === '') {
            /* eslint-disable no-undef */
            this.props.node.data = {}
          }
          this.props.node.data.enable = val
        },
      },
    },
    methods: {
      handleBaseImg(val) {
        this.$emit('changeBaseImg', val)
      },
      onChangeLineAnimate() {
        // 线条动画
        this.props.line.animateStart = 0
        this.$emit('animateChange')
        setTimeout(() => {
          this.props.line.animateStart = Date.now()
          this.$emit('animateChange')
        }, 100)
      },

      onChangeAnimate() {
        // 节点动画效果
        if (this.props.node.animateType === 'custom') {
          // 自定义
          return
        }
        this.props.node.animateFrames = []
        const state = Node.cloneState(this.props.node)
        switch (this.props.node.animateType) {
          case 'forwardRotate': // 顺时针旋转
            state.rotate = 360
            this.props.node.animateFrames.push({
              duration: 1000,
              linear: true,
              state,
            })
            this.props.node.animateFrames.push({
              duration: 0,
              linear: true,
              state: Node.cloneState(this.props.node),
            })
            break
          case 'reverseRotate': // 逆时针旋转
            state.rotate = -360
            this.props.node.animateFrames.push({
              duration: 1000,
              linear: true,
              state,
            })
            this.props.node.animateFrames.push({
              duration: 0,
              linear: true,
              state: Node.cloneState(this.props.node),
            })
            break
          case 'heart':
            state.rect.x -= 5
            state.rect.ex += 5
            state.rect.y -= 5
            state.rect.ey += 5
            state.rect.width += 10
            state.rect.height += 10
            state.strokeStyle = 'rgba(255,74,74,0.6)'
            state.lineWidth = 10
            this.props.node.animateFrames.push({
              duration: 400,
              linear: true,
              state,
            })

            this.props.node.animateFrames.push({
              duration: 400,
              linear: true,
              state: Node.cloneState(this.props.node),
            })
            break
          case 'show':
            state.strokeStyle = '#fa541c'
            state.rotate = -10
            this.props.node.animateFrames.push({
              duration: 100,
              linear: true,
              state: Node.cloneState(state),
            })
            state.rotate = 10
            this.props.node.animateFrames.push({
              duration: 100,
              linear: true,
              state: Node.cloneState(state),
            })
            state.rotate = 0
            this.props.node.animateFrames.push({
              duration: 100,
              linear: true,
              state: Node.cloneState(state),
            })
            break
        }
        this.onAnimateDuration()
        this.props.node.animateStart = Date.now()
        this.$emit('animateChange')
      },
      onAnimateDuration() {
        this.props.node.animateDuration = 0
        for (const item of this.props.node.animateFrames) {
          this.props.node.animateDuration += item.duration
        }
      },
      onNodesAlign(align) {
        this.$emit('align', align)
      },
      onChange(value) {
        this.$emit('change', this.props.node)
      },
      onChangeOptions() {
        this.$emit('changeOptions', this.canvasOptions)
      },
      onAddPipeLine() {
        this.canvas.addLine(
          new Line({
            name: 'line',
            fromArrow: '',
            toArrow: '',
            from: new Point(100, 100),
            to: new Point(300, 100),
            controlPoints: [new Point(200, 100), new Point(200, 300)],
            strokeStyle: '#6cf',
            lineWidth: 15,
            borderWidth: 5,
            borderColor: '#dcdc',
          })
        )
        this.canvas.render()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .props-container {
    overflow-x: hidden;
    overflow-y: auto;
  }
  .bottom {
    position: absolute;
    bottom: 0.1rem;
    .title {
      padding: 0 10px;
      border-bottom: 1px solid #ccc;
    }
  }
  .tips {
    padding: 10px;
    margin: 0 0 10px 0;
    text-align: center;
    background: #ccc;
  }
  .group {
    .title {
      padding: 0 10px;
      margin-top: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #0d1a26;
      border-bottom: 1px solid #ccc;
    }
    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .item {
      width: 50%;
      padding: 5px 10px;
    }
    .full-item {
      width: 100%;
      padding: 5px 10px;
      .el-select,
      .el-input {
        width: 100%;
      }
    }
    .el-color-picker__trigger,
    .el-color-picker {
      width: 100%;
    }
  }
</style>
