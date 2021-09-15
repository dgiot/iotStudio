<template>
  <div class="topo-main">
    <vue-ruler-tool
      :parent="true"
      :is-scale-revise="true"
      style="width: 100%; height: calc(100% - 40px)"
    >
      <div
        id="surface-edit-layer"
        tabindex="0"
        class="topo-layer"
        :class="{ 'topo-layer-view-selected': selectedIsLayer }"
        :style="layerStyle"
        @click="onLayerClick($event)"
        @mouseup="onLayerMouseup($event)"
        @mousemove="onLayerMousemove($event)"
        @mousedown="onLayerMousedown($event)"
        @keyup.delete="removeItem()"
        @dragover.prevent
        @drop="onDrop"
        @keydown.ctrl.67.stop="copyItem"
        @keydown.ctrl.86.stop="pasteItem"
        @keydown.ctrl.90.stop="undo"
        @keydown.ctrl.89.stop="redo"
      >
        <template v-for="(component, index) in configData.components">
          <div
            :key="component.identifier"
            tabindex="0"
            class="topo-layer-view"
            :class="{
              'topo-layer-view-selected':
                selectedComponentMap[component.identifier] == undefined
                  ? false
                  : true,
            }"
            :style="{
              left: component.style.position.x + 'px',
              top: component.style.position.y + 'px',
              width: component.style.position.w + 'px',
              height: component.style.position.h + 'px',
              'background-color': component.style.backColor,
              zIndex: component.style.zIndex,
              borderWidth: component.style.borderWidth + 'px',
              borderStyle: component.style.borderStyle,
              borderColor: component.style.borderColor,
              transform: component.style.transform
                ? `rotate(${component.style.transform}deg)`
                : 'rotate(0deg)',
            }"
            @click.stop="clickComponent(index, component, $event)"
            @mousedown.stop="controlMousedown(component, $event, index)"
            @keyup.delete="removeItem()"
            @keydown.up.exact.prevent="moveItems('up')"
            @keydown.right.exact.prevent="moveItems('right')"
            @keydown.down.exact.prevent="moveItems('down')"
            @keydown.left.exact.prevent="moveItems('left')"
            @keydown.ctrl.67.stop="copyItem"
            @keydown.ctrl.86.stop="pasteItem"
            @keydown.ctrl.90.stop="undo"
            @keydown.ctrl.89.stop="redo"
          >
            <component
              :is="parseView(component)"
              :ref="'comp' + index"
              :detail="component"
              :edit-mode="true"
              :selected="
                selectedComponentMap[component.identifier] ? true : false
              "
            />
            <div
              v-show="selectedComponentMap[component.identifier]"
              class="resize-left-top"
              @mousedown.stop="
                resizeMousedown(component, $event, index, 'resize-lt')
              "
            ></div>
            <div
              v-show="selectedComponentMap[component.identifier]"
              class="resize-left-center"
              @mousedown.stop="
                resizeMousedown(component, $event, index, 'resize-lc')
              "
            ></div>
            <div
              v-show="selectedComponentMap[component.identifier]"
              class="resize-left-bottom"
              @mousedown.stop="
                resizeMousedown(component, $event, index, 'resize-lb')
              "
            ></div>
            <div
              v-show="selectedComponentMap[component.identifier]"
              class="resize-right-top"
              @mousedown.stop="
                resizeMousedown(component, $event, index, 'resize-rt')
              "
            ></div>
            <div
              v-show="selectedComponentMap[component.identifier]"
              class="resize-right-center"
              @mousedown.stop="
                resizeMousedown(component, $event, index, 'resize-rc')
              "
            ></div>
            <div
              v-show="selectedComponentMap[component.identifier]"
              class="resize-right-bottom"
              @mousedown.stop="
                resizeMousedown(component, $event, index, 'resize-rb')
              "
            ></div>
            <div
              v-show="selectedComponentMap[component.identifier]"
              class="resize-center-top"
              @mousedown.stop="
                resizeMousedown(component, $event, index, 'resize-ct')
              "
            ></div>
            <div
              v-show="selectedComponentMap[component.identifier]"
              class="resize-center-bottom"
              @mousedown.stop="
                resizeMousedown(component, $event, index, 'resize-cb')
              "
            ></div>
          </div>
        </template>
        <div
          class="topo-frame-selection"
          :style="{
            width: frameSelectionDiv.width + 'px',
            height: frameSelectionDiv.height + 'px',
            top: frameSelectionDiv.top + 'px',
            left: frameSelectionDiv.left + 'px',
          }"
        ></div>
      </div>
    </vue-ruler-tool>
    <div
      style="
        position: relative;
        height: 20px;
        line-height: 20px;
        background-color: white;
        border-top: #ccc solid 1px;
      "
    >
      <el-row :gutter="10">
        <el-col :xs="8" :push="1" :sm="8" :md="8" :lg="8" :xl="8">
          <el-button type="primary" disabled @click.native="fullScreen">
            预览
          </el-button>
          <el-button type="primary" @click.native="printData">
            当前数据
          </el-button>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <p style="height: 20px; font-size: 18px; line-height: 20px">
            已选组件个数：{{ selectedComponents.length }}
          </p>
        </el-col>
        <el-col :xs="8" :pull="1" :sm="8" :md="8" :lg="8" :xl="8">
          <el-slider
            v-model="selectedValue"
            :min="30"
            :max="200"
            :step="1"
            label
            :label-value="`${selectedValue}%`"
            snap
            style="float: right; width: 200px"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import VueRulerTool from './ruler'
  import TopoBase from './TopoBase'
  import topoUtil from './util/topo-util'
  import { deepCopy, uid } from '@/utils'

  import {
    checkInRange,
    checkByPointInRect,
    checkByRectCollisionDetection,
  } from '@/utils/topo'

  import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'

  export default {
    name: 'TopoMain',
    components: {
      VueRulerTool,
    },
    extends: TopoBase,
    props: [],

    data() {
      return {
        moveItem: {
          startX: 0,
          startY: 0,
        }, //移动组件 相关变量
        resizeItem: {
          startPx: 0,
          startPy: 0,
          x: 0,
          y: 0,
          w: 0,
          h: 0,
        }, //resize组件 相关变量
        frameSelectionDiv: {
          width: 0,
          height: 0,
          top: 10,
          left: 10,
          startX: 0,
          startY: 0,
          startPageX: 0,
          startPageY: 0,
        },
        flag: '', //当前操作标志位
        curControl: null,
        curIndex: -1,
        selectedValue: 100,
      }
    },
    computed: {
      ...mapState({
        selectedComponents: (state) => state.topoEditor.selectedComponents,
        selectedComponentMap: (state) => state.topoEditor.selectedComponentMap,
        configData: (state) => state.topoEditor.topoData,
        selectedIsLayer: (state) => state.topoEditor.selectedIsLayer,
        copySrcItems: (state) => state.topoEditor.copySrcItems,
        copyCount: (state) => state.topoEditor.copyCount,
      }),
      layerStyle: function () {
        var scale = this.selectedValue / 100
        var styles = [`transform:scale(${scale})`]
        if (this.configData.layer.backColor) {
          styles.push(`background-color: ${this.configData.layer.backColor}`)
        }
        if (this.configData.layer.backgroundImage) {
          styles.push(
            `background-image: url("${this.configData.layer.backgroundImage}")`
          )
        }
        if (this.configData.layer.width > 0) {
          styles.push(`width: ${this.configData.layer.width}px`)
        }
        if (this.configData.layer.height > 0) {
          styles.push(`height: ${this.configData.layer.height}px`)
        }
        var style = styles.join(';')
        return style
      },
    },
    mounted() {
      this.loadDefaultTopoData()
    },
    methods: {
      ...mapMutations('topoEditor', [
        'setSelectedComponent',
        'addSelectedComponent',
        'removeSelectedComponent',
        'clearSelectedComponent',
        'setLayerSelected',
        'setCopySrcItems',
        'increaseCopyCount',
        'execute',
        'undo',
        'redo',
      ]),
      ...mapActions('topoEditor', ['loadDefaultTopoData']),
      controlMousedown(component, event, index) {
        if (event.ctrlKey) {
          return
        }
        this.flag = 'move'
        this.curControl = component
        this.clickItem(component, index)
        this.moveItem.startX = event.pageX
        this.moveItem.startY = event.pageY
        //记录初始信息--move
        for (var key in this.selectedComponentMap) {
          var component = this.selectedComponentMap[key]
          component.style.temp = {}
          component.style.temp.position = {}
          component.style.temp.position.x = component.style.position.x
          component.style.temp.position.y = component.style.position.y
        }
      },
      resizeMousedown(component, $event, index, flag) {
        //resize-鼠标按下事件
        this.flag = flag
        this.curControl = component
        this.curIndex = index
        this.clickItem(component, index)
        var dom = event.currentTarget
        this.resizeItem.startPx = event.pageX
        this.resizeItem.startPy = event.pageY
        //记录初始信息-resize
        this.resizeItem.x = this.curControl.style.position.x
        this.resizeItem.y = this.curControl.style.position.y
        this.resizeItem.w = this.curControl.style.position.w
        this.resizeItem.h = this.curControl.style.position.h
      },
      onLayerMousemove(event) {
        if (event.which != 1) {
          this.flag = ''
          return
        }
        if (this.flag == '') return
        if (this.flag.startsWith('resize')) {
          var dx = event.pageX - this.resizeItem.startPx,
            dy = event.pageY - this.resizeItem.startPy
          switch (this.flag) {
            case 'resize-lt':
              this.curControl.style.position.x = this.resizeItem.x + dx
              this.curControl.style.position.y = this.resizeItem.y + dy
              dx = -dx
              dy = -dy
              break
            case 'resize-lc':
              this.curControl.style.position.x = this.resizeItem.x + dx
              dy = 0
              dx = -dx
              break
            case 'resize-lb':
              this.curControl.style.position.x = this.resizeItem.x + dx
              dx = -dx
              break
            case 'resize-rt':
              this.curControl.style.position.y = this.resizeItem.y + dy
              dy = -dy
              break
            case 'resize-rc':
              dy = 0
              break
            case 'resize-rb':
              break
            case 'resize-ct':
              this.curControl.style.position.y = this.resizeItem.y + dy
              dx = 0
              dy = -dy
              break
            case 'resize-cb':
              dx = 0
              break
          }
          if (this.resizeItem.w + dx > 20) {
            this.curControl.style.position.w = this.resizeItem.w + dx
          }
          if (this.resizeItem.h + dy > 20) {
            this.curControl.style.position.h = this.resizeItem.h + dy
          }
          //canvas组件需要重新渲染
          // DOM 还没有更新
          this.$nextTick(function () {
            // DOM 更新了
            var a = this.$refs['comp' + this.curIndex][0]
            a.onResize()
          })
        } else if (this.flag == 'move') {
          //移动组件
          var dx = event.pageX - this.moveItem.startX,
            dy = event.pageY - this.moveItem.startY
          for (var key in this.selectedComponentMap) {
            var component = this.selectedComponentMap[key]
            component.style.position.x = component.style.temp.position.x + dx
            component.style.position.y = component.style.temp.position.y + dy
          }
        } else if (this.flag == 'frame_selection') {
          this.onFrameSelection(event)
        }
      },
      onLayerMouseup(event) {
        if (this.flag.startsWith('resize')) {
          var a = this.$refs['comp' + this.curIndex][0]
          a.onResize()
        } else if (this.flag == 'frame_selection') {
          //由于和onLayerClick冲突，这里模拟下点击空白区域
          this.onFrameSelection(event)
          this.frameSelectionDiv.width = 0
          this.frameSelectionDiv.height = 0
          this.frameSelectionDiv.top = 0
          this.frameSelectionDiv.left = 0
        } else if (this.flag == 'move') {
          //鼠标move只是方便用户预览，真正执行应该用命令，所以要先恢复
          var dx = event.pageX - this.moveItem.startX
          var dy = event.pageY - this.moveItem.startY
          for (var key in this.selectedComponentMap) {
            var component = this.selectedComponentMap[key]
            component.style.position.x = component.style.position.x - dx
            component.style.position.y = component.style.position.y - dy
          }
          this.execute({
            op: 'move',
            dx: dx,
            dy: dy,
            items: this.selectedComponentMap,
          })
        }
        this.flag = ''
      },
      onLayerMousedown($event) {
        this.flag = 'frame_selection'
        this.frameSelectionDiv.startX = event.offsetX
        this.frameSelectionDiv.startY = event.offsetY
        this.frameSelectionDiv.startPageX = event.pageX
        this.frameSelectionDiv.startPageY = event.pageY
      },
      onLayerClick() {
        // this.clearSelectedComponent();
        // this.setLayerSelected(true);
      },
      onFrameSelection(event) {
        var dx = event.pageX - this.frameSelectionDiv.startPageX
        var dy = event.pageY - this.frameSelectionDiv.startPageY
        this.frameSelectionDiv.width = Math.abs(dx)
        this.frameSelectionDiv.height = Math.abs(dy)
        if (dx > 0 && dy > 0) {
          this.frameSelectionDiv.top = this.frameSelectionDiv.startY
          this.frameSelectionDiv.left = this.frameSelectionDiv.startX
        } else if (dx > 0 && dy < 0) {
          this.frameSelectionDiv.top = this.frameSelectionDiv.startY + dy
          this.frameSelectionDiv.left = this.frameSelectionDiv.startX
        } else if (dx < 0 && dy > 0) {
          this.frameSelectionDiv.top = this.frameSelectionDiv.startY
          this.frameSelectionDiv.left = this.frameSelectionDiv.startX + dx
        } else if (dx < 0 && dy < 0) {
          this.frameSelectionDiv.top = this.frameSelectionDiv.startY + dy
          this.frameSelectionDiv.left = this.frameSelectionDiv.startX + dx
        }
        //判断各个组件是否在方框内
        var _this = this
        var rect = {
          x: this.frameSelectionDiv.left,
          y: this.frameSelectionDiv.top,
          width: this.frameSelectionDiv.width,
          height: this.frameSelectionDiv.height,
        }
        var components = this.configData.components
        components.forEach((component) => {
          var itemRect = {
            x: component.style.position.x,
            y: component.style.position.y,
            width: component.style.position.w,
            height: component.style.position.h,
          }
          if (checkByRectCollisionDetection(rect, itemRect)) {
            _this.addSelectedComponent(component)
          } else {
            _this.removeSelectedComponent(component)
          }
        })
        if (this.selectedComponents.length > 0) {
          this.setLayerSelected(false)
        } else {
          this.setLayerSelected(true)
        }
      },
      onDrop(event) {
        event.preventDefault()
        var infoJson = event.dataTransfer.getData('my-info')
        var component = JSON.parse(infoJson)
        if (this.checkAddComponent(component) == false) {
          return
        }
        //判断当前着陆点是不是layer
        if (event.target.id == 'surface-edit-layer') {
          component.style.position.x = event.offsetX
          component.style.position.y = event.offsetY
        } else {
          //解决着陆灯不是layer的情形
          var layer = event.currentTarget
          var position = layer.getBoundingClientRect()
          var x = event.clientX - position.left
          var y = event.clientY - position.top
          component.style.position.x = x
          component.style.position.y = y
        }
        //处理默认值
        this.execute({
          op: 'add',
          component: component,
        })
        //默认选中，并点击
        this.clickItem(component, this.configData.components.length - 1)
      },
      moveItems(direction) {
        var dx = 0,
          dy = 0
        if (direction == 'up') {
          dy = -5
        } else if (direction == 'right') {
          dx = 5
        } else if (direction == 'down') {
          dy = 5
        } else if (direction == 'left') {
          dx = -5
        }
        this.execute({
          op: 'move',
          dx: dx,
          dy: dy,
          items: this.selectedComponentMap,
        })
      },
      checkAddComponent(info) {
        if (info == null) {
          this.$q.notify({
            type: 'negative',
            position: 'bottom-right',
            message: 'This component not surpport.',
          })
          return false
        }
        return true
      },
      parseView(component) {
        return topoUtil.parseViewName(component)
      },
      clickItem(component, index) {
        this.setLayerSelected(false)
        if (this.selectedComponentMap[component.identifier] == undefined) {
          this.setSelectedComponent(component)
        } else {
          //如果已经选中，则不做任何处理
        }
      },
      clickComponent(index, component, event) {
        //点击组件
        if (event.ctrlKey == true) {
          //点击了ctrl
          this.setLayerSelected(false)
          if (this.selectedComponentMap[component.identifier] == undefined) {
            this.addSelectedComponent(component)
          } else {
            this.removeSelectedComponent(component)
          }
        } else {
          //这里不再处理点击事件，改为鼠标左键
          //this.clickItem(component,index);
        }
      },
      copyItem() {
        // 设定复制源
        var items = []
        for (var key in this.selectedComponentMap) {
          var item = deepCopy(this.selectedComponentMap[key])
          items.push(item)
        }
        this.setCopySrcItems(items)
      },
      pasteItem() {
        if (this.copySrcItems && this.copySrcItems.length > 0) {
          this.execute({
            op: 'copy-add',
            items: this.copySrcItems,
          })
        }
      },
      removeItem(index, component) {
        //移除组件
        this.execute({
          op: 'del',
          index: index,
        })
        this.setLayerSelected(true)
      },
      fullScreen() {
        localStorage.setItem('topoData', JSON.stringify(this.configData))
        let { href } = this.$router.resolve({
          path: '/fullscreen',
          name: 'TopoFullscreen',
          query: {
            sceneId: this.sceneId,
            sceneName: this.sceneName,
          },
          params: {
            sceneId: this.sceneId,
            sceneName: this.sceneName,
          },
        })
        window.open(href, '_blank')
      },
      printData() {
        var json = JSON.stringify(this.configData)
        console.log(json)
        alert(json)
      },
    },
  }
</script>

<style lang="scss">
  .topo-main {
    position: relative;
    overflow-x: hidden;
    overflow-y: hidden;
    background-color: white;
    border: #ccc solid 1px;

    .topo-layer {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: auto;
      // background-color: white;
      // background-clip: padding-box;
      // background-origin: padding-box;
      // background-repeat: no-repeat;
      // background-size: 100% 100%;

      background-image: linear-gradient(
          45deg,
          #ccc 25%,
          transparent 25%,
          transparent 75%,
          #ccc 75%,
          #ccc
        ),
        linear-gradient(
          45deg,
          #ccc 25%,
          transparent 25%,
          transparent 75%,
          #ccc 75%,
          #ccc
        );
      background-position: 0 0, 10px 10px;
      background-size: 20px 20px;
      transform-origin: left top;

      .topo-frame-selection {
        position: absolute;
        z-index: 999;
        background-color: #8787e7;
        border: #0000ff solid 1px;
        opacity: 0.3;
      }

      .topo-layer-view {
        position: absolute;
        width: 100px;
        height: 100px;
        cursor: move;
        background-color: #999;
        border: #ccc solid 1px;

        .resize-left-top {
          position: absolute;
          top: -5px;
          left: -5px;
          width: 10px;
          height: 10px;
          cursor: nwse-resize;
          background-color: white;
          border: 1px solid #0cf;
        }

        .resize-left-center {
          position: absolute;
          top: 50%;
          left: -5px;
          width: 10px;
          height: 10px;
          margin-top: -5px;
          cursor: ew-resize;
          background-color: white;
          border: 1px solid #0cf;
        }

        .resize-left-bottom {
          position: absolute;
          bottom: -5px;
          left: -5px;
          width: 10px;
          height: 10px;
          cursor: nesw-resize;
          background-color: white;
          border: 1px solid #0cf;
        }

        .resize-right-top {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 10px;
          height: 10px;
          cursor: nesw-resize;
          background-color: white;
          border: 1px solid #0cf;
        }

        .resize-right-center {
          position: absolute;
          top: 50%;
          right: -5px;
          width: 10px;
          height: 10px;
          margin-top: -5px;
          cursor: ew-resize;
          background-color: white;
          border: 1px solid #0cf;
        }

        .resize-right-bottom {
          position: absolute;
          right: -5px;
          bottom: -5px;
          width: 10px;
          height: 10px;
          cursor: nwse-resize;
          background-color: white;
          border: 1px solid #0cf;
        }

        .resize-center-top {
          position: absolute;
          top: -5px;
          left: 50%;
          width: 10px;
          height: 10px;
          margin-left: -5px;
          cursor: ns-resize;
          background-color: white;
          border: 1px solid #0cf;
        }

        .resize-center-bottom {
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: 10px;
          height: 10px;
          margin-left: -5px;
          cursor: ns-resize;
          background-color: white;
          border: 1px solid #0cf;
        }
      }

      .topo-layer-view-selected {
        outline: 1px solid #0cf;
      }
    }
  }
</style>
