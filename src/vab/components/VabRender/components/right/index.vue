<template>
  <div class="vab-render-right">
    <el-tabs v-model="activeTab" class="vab-render-header" :stretch="true">
      <el-tab-pane
        v-for="tab of VabRender.rightTabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      />
    </el-tabs>
    <perfect-scrollbar ref="scroll" class="vab-render-scrollarea">
      <component
        :is="tab.name"
        v-for="tab of VabRender.rightTabs"
        v-show="activeTab === tab.name"
        :key="tab.name"
        class="vab-render-right-content"
      />
    </perfect-scrollbar>
  </div>
</template>

<script>
  import FormProps from './form-props.vue'
  import FormItemAttrs from './form-item-attrs.vue'
  import FormItemCommon from './form-item-common.vue'

  export default {
    components: {
      FormProps,
      FormItemAttrs,
      FormItemCommon,
    },
    inject: ['VabRender'],
    data() {
      return {
        activeTab: '',
      }
    },
    watch: {
      // 切换Tab滚动到顶部
      activeTab() {
        this.$refs.scroll.$el.scrollTop = 0
      },
    },
    mounted() {
      this.activeTab = this.VabRender.rightTabs[0].name
    },
  }
</script>

<style lang="css">
  .vab-render-right {
    width: 310px;
    height: 100%;
  }
  .vab-render-right .form-item-placeholder {
    height: 300px;
    line-height: 300px;
    color: #909399;
    text-align: center;
  }
  .vab-render-right .el-tabs__header {
    padding-top: 20px;
  }
  .vab-render-right .el-tabs__nav-wrap {
    padding: 0 15px;
  }
  .vab-render-right .el-tabs__item {
    padding: 0 10px;
  }
  .vab-render-right .el-tabs__nav-wrap::after {
    height: 0;
  }
  .vab-render-right .el-tabs__active-bar {
    height: 1px !important;
  }
  .vab-render-right .vab-render-right-content {
    padding: 20px 0;
  }
</style>
