<template>
  <div>
    <attrs-header
      v-model="keyword"
      url="https://www.yuque.com/chaojie-vjiel/vbwzgu/dyw8a7"
      title="表单配置"
    />
    <ele-form
      v-model="frender.formPropsData"
      :form-desc="filteredFormDesc"
      :form-attrs="{ size: 'small' }"
      :is-show-back-btn="false"
      :is-show-submit-btn="false"
      :span="20"
      label-position="top"
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
    inject: ['frender'],
    computed: {
      formDesc() {
        return changeFormDescLabel(this.frender.formProps.config)
      },
    },
  }
</script>
