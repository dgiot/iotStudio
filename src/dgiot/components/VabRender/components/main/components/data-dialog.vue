<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    title="数据编辑"
    :visible="visible"
    @update:visible="$emit('change', $event)"
  >
    <el-alert
      show-icon
      style="margin-bottom: 20px"
      title="数据必须为对象"
      type="warning"
    />
    <prism-editor
      v-model="code"
      class="vab-render-code"
      :highlight="highlighter"
      line-numbers
    />
    <div style="margin-top: 20px; text-align: center">
      <el-button type="primary" @click.native="handleChangeCode">
        更改数据
      </el-button>
      <el-button type="primary" @click.native="handleCopyData">
        复制数据
      </el-button>
      <el-button type="primary">
        <el-link
          :download="`${Date.now()}.js`"
          :href="fileURL"
          style="color: white"
          :underline="false"
        >
          下载数据
        </el-link>
      </el-button>
      <el-button @click.native="$emit('change', false)">关闭弹窗</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { objectToArr, reomveQuotes } from '../../../utils'

  export default {
    name: 'VabRenderMainDataDialog',
    inject: ['VabRender'],
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        code: '',
        fileURL: '',
      }
    },
    watch: {
      visible(val) {
        if (val) {
          this.code = reomveQuotes(this.VabRender.getFormConfigStr())
        }
      },
      code: {
        handler() {
          // 防抖，最后一次起作用
          if (!this.codeToURL) {
            this.codeToURL = _.debounce(() => {
              // 将代码转为 URL
              const blob = new Blob([this.code])
              this.fileURL = URL.createObjectURL(blob)
            }, 300)
          }
          this.codeToURL()
        },
        immediate: true,
      },
    },
    methods: {
      // 高亮配置
      highlighter(code) {
        return highlight(code, languages.js)
      },
      // 保存数据
      handleChangeCode() {
        try {
          // 将字符串转为对象
          const res = eval('(' + this.code + ')')
          // 判断是否为对象
          if (_.isPlainObject(res)) {
            // 1. 通过解构符合的方式分离出 formDesc 和 formPropsData
            const { formDesc = {}, order = [], ...formPropsData } = res
            // 2. 赋值 VabRender.formPropsData
            this.VabRender.formPropsData = Object.assign(formPropsData, {
              order: order || Object.keys(formDesc),
            })
            // 3. 将 formDesc 转为数组，并赋值给 VabRender.formItemList
            this.VabRender.formItemList = objectToArr(formDesc, 'field').map(
              (item) => Object.assign({ attrs: {} }, item)
            )

            // 关闭弹窗
            this.$emit('change')
          } else {
            // 抛出解析异常
            throw new TypeError(res + ', 类型错误，非对象')
          }
        } catch (err) {
          // 错误提示
          this.$message.error('解析失败，非 JS 对象，请检查')
          console.error(err)
        }
      },
      // 复制数据
      handleCopyData() {
        clipboardCopy(this.code)
        this.$message.success('复制成功!')
      },
    },
  }
</script>
