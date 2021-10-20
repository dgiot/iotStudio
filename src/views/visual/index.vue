<template>
  <div class="home">
    <Toolbar />

    <main>
      <!-- 左侧组件列表 -->
      <section class="left">
        <ComponentList />
      </section>
      <!-- 中间画布 -->
      <section class="center">
        <div
          class="content"
          @dragover="handleDragOver"
          @drop="handleDrop"
          @mousedown="handleMouseDown"
          @mouseup="deselectCurComponent"
        >
          <Editor />
        </div>
      </section>
      <!-- 右侧属性列表 -->
      <section class="right">
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="属性"
            name="attr"
          >
            <AttrList v-if="curComponent" />
            <p
              v-else
              class="placeholder"
            >
              请选择组件
            </p>
          </el-tab-pane>
          <el-tab-pane
            label="动画"
            name="animation"
          >
            <AnimationList v-if="curComponent" />
            <p
              v-else
              class="placeholder"
            >
              请选择组件
            </p>
          </el-tab-pane>
          <el-tab-pane
            label="事件"
            name="events"
          >
            <EventList v-if="curComponent" />
            <p
              v-else
              class="placeholder"
            >
              请选择组件
            </p>
          </el-tab-pane>
        </el-tabs>
      </section>
    </main>
  </div>
</template>

<script>
  import Editor from '@/views/visual/components/Editor/index'
  import ComponentList from '@/views/visual/components/ComponentList' // 左侧列表组件
  import AttrList from '@/views/visual/components/AttrList' // 右侧属性列表
  import AnimationList from '@/views/visual/components/AnimationList' // 右侧动画列表
  import EventList from '@/views/visual/components/EventList' // 右侧事件列表
  import componentList from '@/views/visual/components/component-list' // 左侧列表数据
  import Toolbar from '@/views/visual/components/Toolbar'
  import { deepCopy } from '@/views/visual/utils/utils'
  import { mapState } from 'vuex'
  import generateID from '@/views/visual/utils/generateID'
  import { listenGlobalKeyDown } from '@/views/visual/utils/shortcutKey'
  export default {
    components: {
      Editor,
      ComponentList,
      AttrList,
      AnimationList,
      EventList,
      Toolbar,
    },
    data() {
      return {
        activeName: 'attr',
        reSelectAnimateIndex: undefined,
      }
    },
    // computed: mapState([
    //   'visual/componentData',
    //   'visual/curComponent',
    //   'visual/isClickComponent',
    //   'visual/canvasStyleData',
    //   'visual/editor',
    // ]),
    computed: {
      ...mapState({
        componentData: (state) => state.visual.curComponent,
        curComponent: (state) => state.visual.curComponent,
        isClickComponent: (state) => state.visual.isClickComponent,
        canvasStyleData: (state) => state.visual.canvasStyleData,
        editor: (state) => state.visual.editor,
      }),
    },
    created() {
      this.restore()
      // 全局监听按键事件
      listenGlobalKeyDown()
    },
    methods: {
      restore() {
        // 用保存的数据恢复画布
        if (localStorage.getItem('canvasData')) {
          this.$store.commit(
            'setComponentData',
            this.resetID(JSON.parse(localStorage.getItem('canvasData')))
          )
        }
        if (localStorage.getItem('canvasStyle')) {
          this.$store.commit(
            'setCanvasStyle',
            JSON.parse(localStorage.getItem('canvasStyle'))
          )
        }
      },
      resetID(data) {
        data.forEach((item) => {
          item.id = generateID()
        })
        return data
      },
      handleDrop(e) {
        e.preventDefault()
        e.stopPropagation()
        const index = e.dataTransfer.getData('index')
        const rectInfo = this.editor.getBoundingClientRect()
        if (index) {
          const component = deepCopy(componentList[index])
          component.style.top = e.clientY - rectInfo.y
          component.style.left = e.clientX - rectInfo.x
          component.id = generateID()
          this.$store.commit('visual/addComponent', { component })
          this.$store.commit('visual/recordSnapshot')
        }
      },
      handleDragOver(e) {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      },
      handleMouseDown() {
        this.$store.commit('visual/setClickComponentStatus', false)
      },
      deselectCurComponent(e) {
        if (!this.isClickComponent) {
          this.$store.commit('visual/setCurComponent', {
            component: null,
            index: null,
          })
        }
        // 0 左击 1 滚轮 2 右击
        if (e.button != 2) {
          this.$store.commit('visual/hideContextMenu')
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .home {
    height: calc(100vh - #{$base-top-bar-height}* 3 - 50px);
    background: #fff;
    main {
      position: relative;
      height: calc(100vh - #{$base-top-bar-height}* 3 - 80px);
      .left {
        position: absolute;
        top: 0;
        left: 0;
        width: 200px;
        height: 100%;
        padding-top: 10px;
      }
      .right {
        position: absolute;
        top: 0;
        right: 0;
        width: 262px;
        height: 100%;
      }
      .center {
        height: 100%;
        padding: 20px;
        margin-right: 262px;
        margin-left: 200px;
        overflow: auto;
        background: #f5f5f5;
        .content {
          width: 100%;
          height: 100%;
          overflow: auto;
        }
      }
    }
    .placeholder {
      color: #333;
      text-align: center;
    }
  }
</style>
