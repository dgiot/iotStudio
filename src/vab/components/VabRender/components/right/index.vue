<template>
  <div class="f-render-right">
    <el-tabs v-model="activeTab" class="f-render-header" :stretch="true">
      <el-tab-pane
        v-for="tab of frender.rightTabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      />
    </el-tabs>
    <perfect-scrollbar ref="scroll" class="f-render-scrollarea">
      <component
        :is="tab.name"
        v-for="tab of frender.rightTabs"
        v-show="activeTab === tab.name"
        :key="tab.name"
        class="f-render-right-content"
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
    inject: ['frender'],
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
      this.activeTab = this.frender.rightTabs[0].name
    },
  }
</script>

<style lang="css">
  .f-render-right {
    width: 310px;
    height: 100%;
  }
  .f-render-right .form-item-placeholder {
    height: 300px;
    line-height: 300px;
    color: #909399;
    text-align: center;
  }
  .f-render-right .el-tabs__header {
    padding-top: 20px;
  }
  .f-render-right .el-tabs__nav-wrap {
    padding: 0 15px;
  }
  .f-render-right .el-tabs__item {
    padding: 0 10px;
  }
  .f-render-right .el-tabs__nav-wrap::after {
    height: 0;
  }
  .f-render-right .el-tabs__active-bar {
    height: 1px !important;
  }
  .f-render-right .f-render-right-content {
    padding: 20px 0;
  }
</style>
