<template>
  <div class="animation-list">
    <div class="div-animation">
      <el-button @click="isShowAnimation = true">添加动画</el-button>
      <el-button @click="previewAnimate">预览动画</el-button>
      <div>
        <el-tag
          v-for="(tag, index) in curComponent.animations"
          :key="index"
          closable
          @close="removeAnimation(index)"
        >
          {{ tag.label }}
        </el-tag>
      </div>
    </div>

    <!-- 选择动画 -->
    <Modal v-model="isShowAnimation">
      <el-tabs v-model="animationActiveName">
        <el-tab-pane
          v-for="item in animationClassData"
          :key="item.label"
          :label="item.label"
          :name="item.label"
        >
          <el-scrollbar class="animate-container">
            <div
              v-for="(animate, index) in item.children"
              :key="index"
              class="animate"
              @mouseover="hoverPreviewAnimate = animate.value"
              @click="addAnimation(animate)"
            >
              <div
                :class="[
                  hoverPreviewAnimate === animate.value &&
                    animate.value + ' animated',
                ]"
              >
                {{ animate.label }}
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </Modal>
  </div>
</template>

<script>
  import Modal from '@/views/visual/components/Modal'
  import eventBus from '@/views/visual/utils/eventBus'
  import animationClassData from '@/views/visual/utils/animationClassData'
  import { mapState } from 'vuex'

  export default {
    components: { Modal },
    data() {
      return {
        isShowAnimation: false,
        hoverPreviewAnimate: '',
        animationActiveName: '进入',
        animationClassData,
        showAnimatePanel: false,
      }
    },
    // computed: mapState(['curComponent']),
    computed: {
      ...mapState({
        curComponent: (state) => state.visual.curComponent,
      }),
    },
    methods: {
      addAnimation(animate) {
        this.$store.commit('visual/addAnimation', animate)
        this.isShowAnimation = false
      },

      previewAnimate() {
        eventBus.$emit('runAnimation')
      },

      removeAnimation(index) {
        this.$store.commit('visual/removeAnimation', index)
      },
    },
  }
</script>

<style lang="scss">
  .animation-list {
    .div-animation {
      text-align: center;

      & > div {
        margin-top: 20px;
      }

      .el-tag {
        display: block;
        width: 50%;
        margin: auto;
        margin-bottom: 10px;
      }
    }

    .el-scrollbar__view {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding-left: 10px;

      .animate > div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 60px;
        margin: 0 12px;
        margin-bottom: 10px;
        font-size: 12px;
        color: #333;
        cursor: pointer;
        user-select: none;
        background: #f5f8fb;
        border-radius: 3px;
      }
    }
  }
</style>
