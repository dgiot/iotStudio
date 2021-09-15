<template>
  <div>
    <template v-if="VabRender.formItemList[VabRender.currentIndex]">
      <attrs-header
        v-model="keyword"
        url="https://www.yuque.com/chaojie-vjiel/vbwzgu/iw5dzf"
        title="表单项配置"
      />
      <ele-form
        v-model="VabRender.formItemList[VabRender.currentIndex]"
        :form-desc="filteredFormDesc"
        :form-attrs="{ size: 'small' }"
        :is-show-back-btn="false"
        :is-show-submit-btn="false"
        :rules="rules"
        :options-fn="
          VabRender.formBindProps['options-fn'] ||
          VabRender.formBindProps['optionsFn']
        "
        :span="20"
        label-position="top"
      >
        <template #rules="{ desc, formData, field, type }">
          <div style="margin-bottom: 20px">
            <el-button type="danger" @click.native="isShowRuleDialog = true">
              新增校检规则
            </el-button>
          </div>
          <component
            :is="type"
            v-model="formData[field]"
            :desc="desc"
            :field="field"
          />
          <form-item-rules :visible.sync="isShowRuleDialog" />
        </template>
      </ele-form>
    </template>
    <div v-else class="form-item-placeholder">从左侧拖拽添加表单项并点选</div>
  </div>
</template>

<script>
  // import _ from 'lodash'
  import { changeFormDescLabel } from '../../utils'
  import searchMixin from './components/search-mixin'
  import AttrsHeader from './components/attrs-header.vue'
  import FormItemRules from './components/form-item-rules.vue'

  export default {
    components: {
      AttrsHeader,
      FormItemRules,
    },
    mixins: [searchMixin],
    inject: ['VabRender'],
    data() {
      return {
        formDesc: {},
        rules: {
          field: [
            {
              required: true,
              message: '字段必填',
            },
            {
              type: 'string',
              validator: (rule, value, callback) => {
                // 如果字段出现次数超过 1 次，则表示字段重复
                if (this.fieldCountObj[value] > 1) {
                  callback('字段名重复')
                } else {
                  callback()
                }
              },
            },
          ],
        },
        isShowRuleDialog: false,
      }
    },
    computed: {
      // 自定义的配置
      customConfig() {
        const currentCompConfig = this.VabRender.currentCompConfig
        return currentCompConfig?.config?.common?.config || {}
      },
      // 字段出现的次数
      fieldCountObj() {
        return _.countBy(this.VabRender.formItemList, (o) => o.field)
      },
    },
    watch: {
      // 检测当前表单项类型变化
      'VabRender.currentFormItemType': {
        handler(currentFormItemType) {
          // 如果并没有选择表单项类型，则为空
          if (!currentFormItemType) {
            this.formDesc = {}
            return
          }

          // 当前组件信息
          this.formDesc = changeFormDescLabel({
            ...this.VabRender.formItemCommon.config,
            ...this.customConfig,
          })
        },
        immediate: true,
      },
    },
  }
</script>
