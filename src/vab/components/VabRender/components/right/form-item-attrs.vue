<template>
  <div>
    <template v-if="frender.formItemList[frender.currentIndex]">
      <attrs-header
        v-model="keyword"
        :url="attrLink"
        :title="frender.currentFormItemType + ' 组件'"
      />
      <ele-form
        v-model="frender.formItemList[frender.currentIndex].attrs"
        :form-desc="filteredFormDesc"
        :form-attrs="{ size: 'small' }"
        :is-show-back-btn="false"
        :is-show-submit-btn="false"
        :span="20"
        label-position="top"
      />
    </template>
    <div v-else class="form-item-placeholder">从左侧拖拽添加表单项并点选</div>
  </div>
</template>

<script>
  import { changeFormDescLabel } from '../../utils'
  import searchMixin from './components/search-mixin'
  import AttrsHeader from './components/attrs-header.vue'

  export default {
    components: { AttrsHeader },
    mixins: [searchMixin],
    inject: ['frender'],
    computed: {
      formDesc() {
        return changeFormDescLabel(
          this.frender.currentCompConfig?.config?.attrs?.config || {}
        )
      },
      // 文档链接
      attrLink() {
        return this.frender.currentCompConfig?.url
      },
    },
  }
</script>
