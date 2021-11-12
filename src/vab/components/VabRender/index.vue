<!--eslint-disable-->
<template>
  <!-- 1.设计阶段 -->
  <multipane v-if="!pure" :style="{ height }" class="vab-render">
    <!-- 左侧 -->
    <slot :comps="sortedComps" :frender="this" name="left">
      <vab-render-left />
      <multipane-resizer></multipane-resizer>
      <vab-render-main
        :frender="this" :loading="loading"
        class="vab-render-main"
        name="main"
        @save="handleSave"
      />
      <multipane-resizer></multipane-resizer>
      <vab-render-right v-if="isShowRight && rightTabs.length" :frender="this" class="vab-render-right" name="right" />
    </slot>
    <multipane-resizer></multipane-resizer>
    <!--    &lt;!&ndash; 中间 &ndash;&gt;-->
    <!--    <slot name="main" :frender="this">-->
    <!--      <vab-render-main-->
    <!--        :loading="loading"-->
    <!--        @save="handleSave"-->
    <!--        class="vab-render-main"-->
    <!--      />-->
    <!--    </slot>-->
    <!--    <template v-if="isShowRight && rightTabs.length">-->
    <!--      <multipane-resizer></multipane-resizer>-->
    <!--      &lt;!&ndash; 右侧 &ndash;&gt;-->
    <!--      <slot name="right" :frender="this">-->
    <!--        <vab-render-right class="vab-render-right" />-->
    <!--      </slot>-->
    <!--    </template>-->
  </multipane>

  <!-- 2.使用 -->
  <ele-form
    v-else
    ref="form"
    :class="{ 'pure-form--loading': loading }"
    :formData="value"
    :formDesc="formDesc"
    v-bind="formBindProps"
    @input="$emit('input', value)"
    v-on="$listeners"
  >
    <form-skeleton v-if="loading" />
  </ele-form>
</template>

<script>
  // 全局组件
  import './global-components'

  // 组件
  import FormSkeleton from './form-skeleton'
  import VabRenderLeft from './components/left/index'
  import VabRenderMain from './components/main/index'
  import VabRenderRight from './components/right/index'
  import { arrToObject, objectToArr, removeEmptyProps } from './utils'

  // 默认配置
  import compsDefault from './fixtures/comps'
  import formPropsDefault from './fixtures/form-props'
  import formItemCommonDefault from './fixtures/form-item-common'

  // 工具函数

  const cloneDeep = require('clone')

  // 组件的数据，通过 provide / inject 的形式传递给子组件
  // 主要原因是因为组件嵌套过深，相当于一个状态管理
  // 在业务代码中不推荐使用，provide / inject，会使数据流混乱
  export default {
    name: 'VabRender',
    components: {
      FormSkeleton,
      VabRenderLeft,
      VabRenderRight,
      VabRenderMain,
    },
    provide() {
      return {
        VabRender: this,
      }
    },
    inheritAttrs: false,
    props: {
      // 表单内容
      config: {
        type: [Object, String],
        default: '',
      },
      // 设计器整体高度
      height: {
        type: [String, Number],
        default: '100vh',
      },
      // 保存格式
      saveFormat: {
        type: String,
        default: 'string',
        validator(val) {
          return ['object', 'string'].includes(val)
        },
      },
      // 默认为设计模式
      // 当为 true 时，表示用户模式
      pure: Boolean,
      // 表单配置
      formProps: {
        type: Object,
        default: () => formPropsDefault,
      },
      // 表单项通用配置
      formItemCommon: {
        type: Object,
        default: () => formItemCommonDefault,
      },
      // 组件列表
      comps: {
        type: Array,
        default: () => compsDefault,
      },
      // 操作配置
      operations: {
        type: Array,
        default: () => ['preview', 'data', 'code', 'batch', 'clear', 'save'],
      },
      // 是否显示右侧
      isShowRight: {
        type: Boolean,
        default: true,
      },
      // 右侧属性面板 Tabs
      rightTabs: {
        type: Array,
        default: () => [
          {
            label: '表单项属性配置',
            name: 'form-item-common',
          },
          {
            label: '组件属性配置',
            name: 'form-item-attrs',
          },
          {
            label: '表单配置',
            name: 'form-props',
          },
        ],
        validator(tabs) {
          return (tabs || []).every((item) => item.label && item.name)
        },
      },
      // 是否在加载
      loading: Boolean,

      // 表单相关（pure 为 true 时）, 同 vue-ele-form
      // https://www.yuque.com/chaojie-vjiel/vbwzgu/zbu9mn
      // eslint-disable-next-line
      value: Object,
    },
    data() {
      return {
        // 定义表单属性数据
        formPropsData: {},
        // 表单项数组形态
        formItemList: [],
        // 表单项对象形态
        formDesc: {},
        // 当前 formItem的 index 值
        currentIndex: null,
      }
    },
    computed: {
      // 结合 formPropsData 和 $attrs
      formBindProps() {
        return {
          ...this.formPropsData,
          ...this.$attrs,
        }
      },
      // 组件列表的 Map 形式
      compsMap() {
        return new Map(this.comps.map((comp) => [comp.type, comp]))
      },
      // 当前表单项的 type 值
      currentFormItemType() {
        return this.formItemList[this.currentIndex]?.type
      },
      // 当前表单项对应的组件的配置
      currentCompConfig() {
        if (!this.currentFormItemType) return null
        return this.getCompByType(this.currentFormItemType)
      },
      // 排序后的组件
      sortedComps() {
        return cloneDeep(this.comps)
          .map((item) => {
            item.sort = item.sort || 6
            return item
          })
          .sort((a, b) => a.sort - b.sort)
      },
    },
    watch: {
      config: {
        handler(config) {
          // 判断是否有值
          if (!config) return
          let formConfig = cloneDeep(config)
          // 如果是字符串，则转为对象
          if (typeof config === 'string') {
            try {
              // 有可能解析出错
              formConfig = formConfig ? eval(`(${formConfig})`) : {}
              if (!_.isPlainObject(formConfig)) {
                // 如果不是对象，则也抛出遗产
                throw new TypeError('config 不是对象')
              }
            } catch (err) {
              this.$message.error('数据解析失败')
              console.error(err)
              return
            }
          }

          if (!_.isPlainObject(formConfig)) {
            // 如果不是对象，则也抛出异常
            console.error('[vab-render]: config 不是对象', formConfig)
            return
          }

          const {
            formDesc = {},
            ...formPropsData
          } = cloneDeep(formConfig)

          this.formPropsData = Object.assign(this.formPropsData, formPropsData)
          this.formItemList = objectToArr(formDesc, 'field')
            .map((item) =>
              Object.assign({ attrs: {} }, item),
            )

          // 当有数据时，选中第一个
          if (this.formItemList.length) {
            this.currentIndex = 0
          }
        },
        immediate: true,
      },
      // 将表单项转为对象类型
      formItemList: {
        handler(list) {
          this.formDesc = arrToObject(list, 'field')
        },
        deep: true,
        immediate: true,
      },
    },
    created() {
      // 设置表单属性默认值
      this.initFormPropsData()

      // 防止火狐拖拽打开新标签
      this.ondrop = function (event) {
        event.preventDefault()
        event.stopPropagation()
      }

      document.body.addEventListener('drop', this.ondrop)
    },
    beforeDestroy() {
      document.body.removeEventListener('drop', this.ondrop)
    },
    methods: {
      // 保存数据
      handleSave() {
        // 根据用户传入的保存格式进行判断
        if (this.saveFormat === 'string') {
          this.$emit('save', this.getFormConfigStr())
        } else {
          this.$emit('save', this.getFormConfig())
        }
      },
      // 通过类型获取表单项
      getFormItemByType(type) {
        const comp = this.getCompByType(type)
        return cloneDeep({
          type,
          ...this.formItemCommon.data,
          ...(comp?.config?.common?.data || {}),
          attrs: comp?.config?.attrs?.data || {},
        })
      },
      // 通过类型获取组件
      getCompByType(type) {
        return this.compsMap.get(type) || {}
      },
      // 获取序列化后的表单配置
      getFormConfigStr() {
        return serialize(this.getFormConfig(), { space: 2 })
      },
      // 获取表单配置
      getFormConfig() {
        return {
          // 表单属性
          ...removeEmptyProps(this.formPropsData),

          // 表单项
          // _.mapValues 是遍历对象的值
          formDesc: _.mapValues(
            this.formDesc,
            // 组件属性 attrs 和表单项属性 commonAttrs
            ({
              type,
              attrs,
              ...commonAttrs
            }) => {
              const res = {
                type,
                ...removeEmptyProps(commonAttrs),
              }

              attrs = removeEmptyProps(attrs)
              if (Object.keys(attrs).length) {
                res.attrs = attrs
              }
              return res
            },
          ),
          order: Object.keys(this.formDesc),
        }
      },
      // 设置表单属性默认值
      initFormPropsData() {
        this.formPropsData = Object.assign(
          this.formPropsData,
          cloneDeep(this.formProps.data),
        )
      },
    },
  }
</script>

<style lang="css">
  /* vab-render 整体样式 */
  .vab-render {
    width: 100%;
    width: 100%;
    overflow: hidden;
    border: 1px solid #ebeef5;
  }

  /* 左侧 */
  .vab-render-left {
    width: 260px;
    min-width: 130px;
  }

  /* 中部 */
  .vab-render-main {
    flex-grow: 1;
    width: 750px;
  }

  /* 右侧 */
  .vab-render-right {
    width: 315px;
  }

  /* 头部区域 */
  .vab-render-header {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #eeeeee;
  }

  /* 滚动区域 */
  .vab-render-scrollarea {
    /* 减去头部的高度 */
    height: calc(100% - 60px);
  }

  /* 左右面板拖动的抓手 */
  .vab-render > .multipane-resizer {
    position: relative;
    left: 0;
    box-sizing: border-box;
    width: 7px;
    margin: 0;
    border-right: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
  }

  /* 左右面板拖动的抓手 */
  .vab-render > .pane {
    padding: 15px;
    overflow: hidden;
    text-align: left;
    background: #eee;
  }

  .vab-render > .pane ~ .pane {
    border-left: 1px solid #ccc;
  }

  .vab-render > .multipane-resizer::before {
    position: absolute;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    display: block;
    width: 1px;
    height: 40px;
    margin-top: -20px;
    margin-left: -1.5px;
    content: '';
    border-right: 1px solid #dcdfe6;
    border-left: 1px solid #dcdfe6;
  }

  .vab-render > .multipane-resizer::before::before {
    border-color: #999;
  }

  .pure-form--loading .ele-form-btns {
    margin-left: 62px;
  }
</style>
