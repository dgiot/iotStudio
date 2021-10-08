<template>
  <div>
    <attrs-header
      v-model="keyword"
      title="表单配置"
      url="https://www.yuque.com/chaojie-vjiel/vbwzgu/dyw8a7"
    />
    <ele-form
      v-model="VabRender.formPropsData"
      :form-attrs="{ size: 'small' }"
      :form-desc="filteredFormDesc"
      :is-show-back-btn="false"
      :is-show-submit-btn="false"
      label-position="top"
      :span="20"
    />
  </div>
</template>

<script>
  import searchMixin from './components/search-mixin'
  import AttrsHeader from './components/attrs-header.vue'
  import { changeFormDescLabel } from '../../utils'
  export default {
    components: { AttrsHeader },
    mixins: [searchMixin],
    inject: ['VabRender'],
    computed: {
      formDesc() {
        return changeFormDescLabel(this.VabRender.formProps.config)
      },
    },
  }
</script>
