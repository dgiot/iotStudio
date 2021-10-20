<template>
  <div
    v-show="menuShow"
    class="contextmenu"
    :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
  >
    <ul @mouseup="handleMouseUp">
      <template v-if="curComponent">
        <template v-if="!curComponent.isLock">
          <li @click="copy">
            复制
          </li>
          <li @click="paste">
            粘贴
          </li>
          <li @click="cut">
            剪切
          </li>
          <li @click="deleteComponent">
            删除
          </li>
          <li @click="lock">
            锁定
          </li>
          <li @click="topComponent">
            置顶
          </li>
          <li @click="bottomComponent">
            置底
          </li>
          <li @click="upComponent">
            上移
          </li>
          <li @click="downComponent">
            下移
          </li>
        </template>
        <li
          v-else
          @click="unlock"
        >
          解锁
        </li>
      </template>
      <li
        v-else
        @click="paste"
      >
        粘贴
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        copyData: null,
      }
    },
    // computed: mapState(['menuTop', 'menuLeft', 'menuShow', 'curComponent']),
    computed: {
      ...mapState({
        menuTop: (state) => state.visual.menuTop,
        menuLeft: (state) => state.visual.menuLeft,
        menuShow: (state) => state.visual.menuShow,
        curComponent: (state) => state.visual.curComponent,
      }),
    },
    methods: {
      lock() {
        this.$store.commit('visual/lock')
      },

      unlock() {
        this.$store.commit('visual/unlock')
      },

      // 点击菜单时不取消当前组件的选中状态
      handleMouseUp() {
        this.$store.commit('visual/setClickComponentStatus', true)
      },

      cut() {
        this.$store.commit('visual/cut')
      },

      copy() {
        this.$store.commit('visual/copy')
      },

      paste() {
        this.$store.commit('visual/paste', true)
        this.$store.commit('visual/recordSnapshot')
      },

      deleteComponent() {
        this.$store.commit('visual/deleteComponent')
        this.$store.commit('visual/recordSnapshot')
      },

      upComponent() {
        this.$store.commit('visual/upComponent')
        this.$store.commit('visual/recordSnapshot')
      },

      downComponent() {
        this.$store.commit('visual/downComponent')
        this.$store.commit('visual/recordSnapshot')
      },

      topComponent() {
        this.$store.commit('visual/topComponent')
        this.$store.commit('visual/recordSnapshot')
      },

      bottomComponent() {
        this.$store.commit('visual/bottomComponent')
        this.$store.commit('visual/recordSnapshot')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .contextmenu {
    position: absolute;
    z-index: 1000;

    ul {
      box-sizing: border-box;
      padding: 6px 0;
      margin: 5px 0;
      background-color: #fff;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

      li {
        position: relative;
        box-sizing: border-box;
        height: 34px;
        padding: 0 20px;
        overflow: hidden;
        font-size: 14px;
        line-height: 34px;
        color: #606266;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;

        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }
</style>
