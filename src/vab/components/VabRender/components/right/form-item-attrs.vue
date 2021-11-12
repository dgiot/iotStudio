<template>
  <div>
    <template v-if="VabRender.formItemList[VabRender.currentIndex]">
      <attrs-header
        v-model="keyword"
        :title="VabRender.currentFormItemType + ' 组件'"
        :url="attrLink"
      />
      <ele-form
        v-model="VabRender.formItemList[VabRender.currentIndex].attrs"
        :form-attrs="{ size: 'small' }"
        :form-desc="filteredFormDesc"
        :is-show-back-btn="false"
        :is-show-submit-btn="false"
        label-position="top"
        :span="20"
      />
    </template>
    <div
      v-else
      class="form-item-placeholder"
    >
      从左侧拖拽添加表单项并点选
    </div>
  </div>
</template>

<script>
  import { changeFormDescLabel } from '../../utils'
  import searchMixin from './components/search-mixin'
  import AttrsHeader from './components/attrs-header.vue'

  export default {
    name: 'VabRenderRightFormItemAttrs',
    components: { AttrsHeader },
    mixins: [searchMixin],
    inject: ['VabRender'],
    computed: {
      formDesc() {
        return changeFormDescLabel(
          this.VabRender.currentCompConfig?.config?.attrs?.config || {}
        )
      },
      // 文档链接
      attrLink() {
        return this.VabRender.currentCompConfig?.url
      },
    },
    watch: {
      formDesc: {
        handler(e) {
          if (!e.type) return
          if (
            this.VabRender.formItemList[this.VabRender.currentIndex].source !==
            '手动输入'
          ) {
            var _sourceField = []
            const _source =
              this.VabRender.formItemList[this.VabRender.currentIndex].source
            var _sourceOption = []
            _source == '产品字典'
              ? (_sourceOption = localStorage.getItem('_sourceDict') || [])
              : (_sourceOption = localStorage.getItem('_sourceModule') || [])
            JSON.parse(_sourceOption).map((e) => {
              _sourceField.push(e.field)
            })
            console.log(_sourceField)
            this.setRender(JSON.parse(_sourceOption), _sourceField)

            // this.VabRender.formItemCommon.config.default
            // this.VabRender.formItemCommon.config.label
            console.log(
              this.VabRender.formItemList[this.VabRender.currentIndex]
            )
            console.log(this.VabRender.formItemCommon.config)
            console.log(this.VabRender)
          }
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      setRender(_sourceOption, _sourceField) {
        console.log(_sourceField, 'resOpt')
        this.$set(
          this.VabRender.formItemCommon.config.field,
          'options',
          _sourceField
        )
        _sourceOption.map((e) => {
          if (
            e.field ==
            this.VabRender.formItemList[this.VabRender.currentIndex].field
          ) {
            this.$set(
              this.VabRender.formItemList[this.VabRender.currentIndex],
              'label',
              e.label || ''
            )
            this.$set(
              this.VabRender.formItemList[this.VabRender.currentIndex],
              'default',
              e.default || ''
            )
          }
        })
      },
    },
  }
</script>
