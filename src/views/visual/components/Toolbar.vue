<template>
  <div>
    <div class="toolbar">
      <el-button @click="undo">撤消</el-button>
      <el-button @click="redo">重做</el-button>
      <label for="input" class="insert">插入图片</label>
      <input id="input" type="file" hidden @change="handleFileChange" />
      <el-button style="margin-left: 10px" @click="preview">预览</el-button>
      <el-button @click="save">保存</el-button>
      <el-button @click="clearCanvas">清空画布</el-button>
      <el-button :disabled="!areaData.components.length" @click="compose">
        组合
      </el-button>
      <el-button
        :disabled="
          !curComponent ||
          curComponent.isLock ||
          curComponent.component != 'Group'
        "
        @click="decompose"
      >
        拆分
      </el-button>

      <el-button :disabled="!curComponent || curComponent.isLock" @click="lock">
        锁定
      </el-button>
      <el-button
        :disabled="!curComponent || !curComponent.isLock"
        @click="unlock"
      >
        解锁
      </el-button>
      <div class="canvas-config">
        <span>画布大小</span>
        <input v-model="canvasStyleData.width" />
        <span>*</span>
        <input v-model="canvasStyleData.height" />
      </div>
      <div class="canvas-config">
        <span>画布比例</span>
        <input v-model="scale" @input="handleScaleChange" />
        %
      </div>
    </div>

    <!-- 预览 -->
    <Preview v-model="isShowPreview" @change="handlePreviewChange" />
  </div>
</template>

<script>
  import generateID from '@/views/visual/utils/generateID'
  import toast from '@/views/visual/utils/toast'
  import { mapState } from 'vuex'
  import Preview from '@/views/visual/components/Editor/Preview'
  import {
    commonStyle,
    commonAttr,
  } from '@/views/visual/components/component-list'
  import eventBus from '@/views/visual/utils/eventBus'
  import { deepCopy } from '@/views/visual/utils/utils'

  export default {
    components: { Preview },
    data() {
      return {
        isShowPreview: false,
        needToChange: [
          'top',
          'left',
          'width',
          'height',
          'fontSize',
          'borderWidth',
        ],
        scale: '100%',
        timer: null,
      }
    },
    // computed: mapState([
    //   'componentData',
    //   'canvasStyleData',
    //   'areaData',
    //   'curComponent',
    // ]),
    computed: {
      ...mapState({
        componentData: (state) => state.visual.curComponent,
        areaData: (state) => state.visual.areaData,
        curComponent: (state) => state.visual.curComponent,
        canvasStyleData: (state) => state.visual.canvasStyleData,
      }),
    },
    created() {
      eventBus.$on('preview', this.preview)
      eventBus.$on('save', this.save)
      eventBus.$on('clearCanvas', this.clearCanvas)

      this.scale = this.canvasStyleData.scale
    },
    methods: {
      format(value) {
        const scale = this.scale
        return (value * parseInt(scale)) / 100
      },

      getOriginStyle(value) {
        const scale = this.canvasStyleData.scale
        const result = value / (parseInt(scale) / 100)
        return result
      },

      handleScaleChange() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          // 画布比例设一个最小值，不能为 0
          // eslint-disable-next-line no-bitwise
          this.scale = ~~this.scale || 1
          const componentData = deepCopy(this.componentData)
          componentData.forEach((component) => {
            Object.keys(component.style).forEach((key) => {
              if (this.needToChange.includes(key)) {
                // 根据原来的比例获取样式原来的尺寸
                // 再用原来的尺寸 * 现在的比例得出新的尺寸
                // 不能用 Math.round 防止 1 px 的边框变 0
                component.style[key] = Math.ceil(
                  this.format(this.getOriginStyle(component.style[key]))
                )
              }
            })
          })

          this.$store.commit('visual/visual/setComponentData', componentData)
          this.$store.commit('visual/visual/setCanvasStyle', {
            ...this.canvasStyleData,
            scale: this.scale,
          })
        }, 1000)
      },

      lock() {
        this.$store.commit('visual/visual/lock')
      },

      unlock() {
        this.$store.commit('visual/visual/unlock')
      },

      compose() {
        this.$store.commit('visual/visual/compose')
        this.$store.commit('visual/visual/recordSnapshot')
      },

      decompose() {
        this.$store.commit('visual/visual/decompose')
        this.$store.commit('visual/visual/recordSnapshot')
      },

      undo() {
        this.$store.commit('visual/visual/undo')
      },

      redo() {
        this.$store.commit('visual/visual/redo')
      },

      handleFileChange(e) {
        const file = e.target.files[0]
        if (!file.type.includes('image')) {
          toast('只能插入图片')
          return
        }

        const reader = new FileReader()
        reader.onload = (res) => {
          const fileResult = res.target.result
          const img = new Image()
          img.onload = () => {
            this.$store.commit('visual/visual/addComponent', {
              component: {
                ...commonAttr,
                id: generateID(),
                component: 'Picture',
                label: '图片',
                icon: '',
                propValue: fileResult,
                style: {
                  ...commonStyle,
                  top: 0,
                  left: 0,
                  width: img.width,
                  height: img.height,
                },
              },
            })

            this.$store.commit('visual/visual/recordSnapshot')

            // 修复重复上传同一文件，@change 不触发的问题
            document.querySelector('#input').setAttribute('type', 'text')
            document.querySelector('#input').setAttribute('type', 'file')
          }

          img.src = fileResult
        }

        reader.readAsDataURL(file)
      },

      preview() {
        this.isShowPreview = true
        this.$store.commit('visual/visual/setEditMode', 'preview')
      },

      save() {
        localStorage.setItem('canvasData', JSON.stringify(this.componentData))
        localStorage.setItem(
          'canvasStyle',
          JSON.stringify(this.canvasStyleData)
        )
        this.$message.success('保存成功')
      },

      clearCanvas() {
        this.$store.commit('visual/visual/setCurComponent', {
          component: null,
          index: null,
        })
        this.$store.commit('visual/visual/setComponentData', [])
        this.$store.commit('visual/visual/recordSnapshot')
      },

      handlePreviewChange() {
        this.$store.commit('visual/visual/setEditMode', 'edit')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .toolbar {
    height: 64px;
    line-height: 64px;
    background: #fff;
    border-bottom: 1px solid #ddd;

    .canvas-config {
      display: inline-block;
      margin-left: 10px;
      font-size: 14px;
      color: #606266;

      input {
        width: 50px;
        padding: 0 5px;
        margin-left: 10px;
        color: #606266;
        border: 1px solid #ddd;
        outline: none;
      }

      span {
        margin-left: 10px;
      }
    }

    .insert {
      box-sizing: border-box;
      display: inline-block;
      padding: 9px 15px;
      margin: 0;
      margin-left: 10px;
      font-size: 12px;
      font-weight: 500;
      line-height: 1;
      color: #606266;
      text-align: center;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
      outline: 0;
      transition: 0.1s;
      -webkit-appearance: none;

      &:active {
        color: #3a8ee6;
        border-color: #3a8ee6;
        outline: 0;
      }

      &:hover {
        color: #3a8ee6;
        background-color: #ecf5ff;
      }
    }
  }
</style>
