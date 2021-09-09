<template lang="pug">
  .page
    .tools
      el-collapse(v-model="activeNames")
        el-collapse-item(
          v-for='(item, index) in tools', :key='index'
          :title="item.group"  Consistency :name="item.group")
          .buttons
            a(
              v-for='(btn, i) in item.children',
              :key='i',
              :title='btn.name',
              :class="{'imgContent' : btn.data.name === 'image'}"
              :draggable='btn.data',
              @dragstart='onDrag($event, btn)')
              .content
                img(
                  v-if="btn.data.name === 'image'",
                  :src='btn.data.image')
                i(v-else-if='btn.data.iconClass', :class='`iconfont ${btn.data.iconClass}`')
                i(v-else='', :class='`iconfont ${btn.icon}`' style="font-size:26px")
                //- i(class="iconfont icon-shidu")
                .name {{ btn.name }}



    #topology-canvas.full(@contextmenu='onContextMenu($event)')

    .props
      CanvasProps(
        :canvas='canvas'
        :options="canvasOptions"
        :props.sync='props'
        @change='onUpdateProps'
        @animateChange='onAnimateChange'
        @align="onAlignNodes"
        @changeOptions="onChangeOptions"
        @changeBaseImg='onSetBaseImg')
    .context-menu(v-if='contextmenu.left', :style='this.contextmenu')
      CanvasContextMenu(:canvas='canvas', :props.sync='props')
</template>

<script>
  import { Topology } from 'topology-core'
  import { Node } from 'topology-core/models/node'
  import { Line } from 'topology-core/models/line'
  import { Point } from 'topology-core/models/point'
  // import * as FileSaver from 'file-saver'
  import { alignNodes } from 'topology-layout'

  import { Tools, canvasRegister } from '../services/canvas'

  import CanvasProps from '../components/CanvasProps'
  import CanvasContextMenu from '../components/CanvasContextMenu'

  export default {
    components: {
      CanvasProps,
      CanvasContextMenu,
    },
    data() {
      return {
        activeNames: ['自定义图标'],
        tools: Tools,
        canvas: {},
        canvasOptions: {
          rotateCursor: '',
          disableScale: true,
        },
        props: {
          node: null,
          line: null,
          nodes: null,
          multi: false,
          locked: false,
        },
        contextmenu: {
          left: null,
          top: null,
          bottom: null,
        },
      }
    },
    computed: {
      event() {
        return this.$store.state.canvas.event
      },
      globalData() {
        return this.$store.state.canvas.data
      },
    },
    watch: {
      event(curVal) {
        if (this['handle_' + curVal.name]) {
          this['handle_' + curVal.name](curVal.data)
        }
      },
    },
    created() {
      canvasRegister()
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.canvasOptions.on = this.onMessage
        this.canvas = new Topology('topology-canvas', this.canvasOptions)
        this.canvas.data = {
          ...this.canvas.data,
          ...this.globalData,
        }
        this.canvas.render()
      },
      onDrag(event, node) {
        event.dataTransfer.setData('Text', JSON.stringify(node.data))
      },
      onSetBaseImg(val) {
        const node = new Node({
          name: 'image',
          rect: {
            width: 1000,
            height: 800,
            x: 0,
            y: 0,
          },
          data: {
            baseImg: true,
          },
          image: val,
        })
        let currBaseimgNode = this.canvas.data.pens.find((item) => {
          return item.data.baseImg
        })
        if (currBaseimgNode) {
          // 已存在底图，则替换地图
          currBaseimgNode.image = val
        } else {
          this.canvas.addNode(node, true) // 新建
          this.canvas.bottom(node) // 手动置底
        }
        this.canvas.render()
      },
      onChangeOptions(obj) {
        // 修改基础配置
        this.canvas.options = {
          ...this.canvas.options,
          ...obj,
        }
        this.canvas.render()
      },
      changeLine(id) {
        // 改变连线样式，绘制水管
        if (this.globalData.lineStyle === 'pipe') {
          let targetLine = this.canvas.data.pens.find((item) => {
            return item.id === id
          })
          if (targetLine) {
            targetLine.strokeStyle = '#6cf'
            targetLine.lineWidth = 15
            targetLine.borderWidth = 5
            targetLine.borderColor = '#dcdc'
          }
        }
      },
      onMessage(event, data) {
        // console.log('onMessage:', event, data)
        switch (event) {
          case 'dblclick':
            console.log('双击')
            break
          case 'node':
            this.props = {
              node: data,
              line: null,
              multi: false,
              nodes: null,
              locked: data.locked,
            }
            console.log('点击节点 --> node', data)
            break
          case 'addNode':
            this.props = {
              node: data,
              line: null,
              multi: false,
              nodes: null,
              locked: data.locked,
            }
            console.warn('添加节点-->addNode', this.props.node)
            break
          case 'line':
          case 'addLine':
            this.props = {
              node: null,
              line: data,
              multi: false,
              nodes: null,
              locked: data.locked,
            }
            this.changeLine(data.id)
            console.warn('添加或点击连线 -->addLine', data)
            break
          case 'multi':
            console.warn('多选节点 -->multi', data.length)
            this.props = {
              node: null,
              line: null,
              multi: true,
              nodes: data.length > 1 ? data : null,
              locked: this.getLocked(data),
            }
            break
          case 'space':
            this.contextmenu.left = null // 清除右键菜单
            break
          case 'moveOut':
            break
          case 'delete':
            console.warn('删除节点 -->delete')
            this.canvas.render()
            break
          case 'moveNodes':
          case 'resizeNodes':
            if (data.length > 1) {
              this.props = {
                node: null,
                line: null,
                multi: true,
                nodes: data,
                locked: this.getLocked({ nodes: data }),
              }
            } else {
              this.props = {
                node: data[0],
                line: null,
                multi: false,
                nodes: null,
                locked: false,
              }
            }
            break
          case 'resize':
          case 'scale':
          case 'locked':
            if (this.canvas && this.canvas.data) {
              this.$store.commit('canvas/setData', {
                scale: this.canvas.data.scale || 1,
                lineName: this.canvas.data.lineName,
                fromArrowType: this.canvas.data.fromArrowType,
                toArrowType: this.canvas.data.toArrowType,
                locked: this.canvas.data.locked,
                lineStyle: this.globalData.lineStyle || 'pipe',
              })
            }
            break
        }
      },

      getLocked(data) {
        let locked = true
        if (data.nodes && data.nodes.length) {
          for (const item of data.nodes) {
            if (!item.locked) {
              locked = false
              break
            }
          }
        }
        if (locked && data.lines) {
          for (const item of data.lines) {
            if (!item.locked) {
              locked = false
              break
            }
          }
        }

        return locked
      },
      onAlignNodes(align) {
        alignNodes(
          this.canvas.activeLayer.pens,
          this.canvas.activeLayer.rect,
          align
        )
        this.canvas.updateProps()
        this.canvas.cache()
      },
      onUpdateProps(node) {
        // 如果是node属性改变，需要传入node，重新计算node相关属性值
        // 如果是line属性改变，无需传参
        if (node) {
          this.canvas.updateProps(node)
        } else {
          this.canvas.render()
        }
      },
      onAnimateChange(line) {
        this.canvas.animate()
      },

      // 菜单事件
      handle_new(data) {
        this.canvas.open({ nodes: [], lines: [] })
      },

      handle_open(data) {
        this.handle_replace(data)
      },

      handle_replace(data) {
        const input = document.createElement('input')
        input.type = 'file'
        input.onchange = (event) => {
          const elem = event.srcElement || event.target
          if (elem.files && elem.files[0]) {
            const name = elem.files[0].name.replace('.json', '')
            const reader = new FileReader()
            reader.onload = (e) => {
              const text = e.target.result + ''
              try {
                const data = JSON.parse(text)
                console.log('数据读取完毕', data)

                if (data && Array.isArray(data.pens)) {
                  this.canvas.open(data)
                  this.canvas.render()
                }
              } catch (e) {
                return false
              }
            }
            reader.readAsText(elem.files[0])
          }
        }
        input.click()
      },

      handle_save(data) {
        // 保存到本地
        FileSaver.saveAs(
          new Blob([JSON.stringify(this.canvas.data)], {
            type: 'text/plain;charset=utf-8',
          }),
          `le5le.topology.json`
        )
      },

      handle_savePng(data) {
        this.canvas.saveAsImage('le5le.topology.png')
      },
      handle_undo(data) {
        this.canvas.undo()
      },

      handle_redo(data) {
        this.canvas.redo()
      },

      handle_copy(data) {
        this.canvas.copy()
      },

      handle_cut(data) {
        this.canvas.cut()
      },

      handle_paste(data) {
        this.canvas.parse()
      },

      handle_state(data) {
        if (data.key === 'scale') {
          this.canvas.scaleTo(1)
        } else {
          this.canvas.data[data.key] = data.value
        }
        this.$store.commit('canvas/setData', {
          scale: this.canvas.data.scale || 1,
          lineName: this.canvas.data.lineName,
          fromArrowType: this.canvas.data.fromArrowType,
          toArrowType: this.canvas.data.toArrowType,
          locked: this.canvas.data.locked,
          lineStyle: this.canvas.data.lineStyle || 'pipe',
        })
        this.canvas.render()
      },

      onContextMenu(event) {
        event.preventDefault()
        event.stopPropagation()

        if (event.clientY + 360 < document.body.clientHeight) {
          this.contextmenu = {
            left: event.clientX + 'px',
            top: event.clientY + 'px',
          }
        } else {
          this.contextmenu = {
            left: event.clientX + 'px',
            bottom: document.body.clientHeight - event.clientY + 'px',
          }
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .page {
    display: flex;
    width: 100%;
    height: calc(100% - 40px);

    .tools {
      flex-shrink: 0;
      width: 200px;
      overflow-y: auto;
      background-color: #f8f8f8;
      border-right: 1px solid #d9d9d9;

      .el-collapse-item__header {
        padding: 0.05rem 0.1rem;
        font-size: 0.12rem;
        font-weight: 600;
        line-height: 1;
        color: #0d1a26;
        border-bottom: 1px solid #ddd;

        &:first-child {
          border-top: none;
        }
      }

      .buttons {
        padding: 0.1rem 0;
        a {
          display: inline-block;
          width: 60px;
          height: 60px;
          text-align: center;
          text-decoration: none !important;
          cursor: pointer;
          .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            img {
              width: 50px;
              height: 50px;
              padding-top: 4px;
            }
            .name {
              margin-top: -5px;
              font-size: 10px;
            }
          }

          .iconfont {
            padding-bottom: 0;
            font-size: 30px;
            color: rgba(123, 126, 125, 0.8);
          }
        }
        .imgContent {
          width: 90px;
          height: 90px;
          .name {
            margin-top: 0 !important;
          }
        }
      }
    }

    .full {
      position: relative;
      flex: 1;
      width: initial;
      overflow: auto;
      background: #fff;
    }

    .props {
      position: relative;
      flex-shrink: 0;
      width: 300px;
      overflow-y: auto;
      background-color: #f8f8f8;
      border-left: 1px solid #d9d9d9;
    }

    .context-menu {
      position: fixed;
      z-index: 10;
    }
  }
</style>
