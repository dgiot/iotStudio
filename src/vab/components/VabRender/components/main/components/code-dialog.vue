<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    title="代码"
    @update:visible="$emit('change', $event)"
  >
    <el-radio-group v-model="showType">
      <el-radio label="vab-render">vab-render方式</el-radio>
      <el-radio label="vue-ele-form">vue-ele-form方式</el-radio>
    </el-radio-group>
    <prism-editor
      class="vab-render-code"
      :value="code"
      :highlight="highlighter"
      line-numbers
      readonly
    />
    <div style="margin-top: 20px; text-align: center">
      <el-button type="primary" @click.native="handleCopyCode">
        复制代码
      </el-button>
      <!-- 下载 TODO 检测移入事件 -->
      <el-button type="primary">
        <el-link
          :href="fileURL"
          style="color: white"
          :underline="false"
          :download="`${Date.now()}.vue`"
        >
          下载文件
        </el-link>
      </el-button>
      <el-button @click.native="$emit('change', false)">关闭弹窗</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import VabRenderTpl from './tpl/vab-render'
  import EleFormTpl from './tpl/vue-ele-form'

  const indentString = require('indent-string')
  import { reomveQuotes } from '../../../utils'

  export default {
    components: {
      PrismEditor,
    },
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
        showType: 'vab-render',
      }
    },
    watch: {
      // 当 showType 变化
      showType() {
        this.setCode()
      },
      // 当 visible 变化时
      visible(val) {
        if (val) {
          this.setCode()
        }
      },
      // 检测 code 当代码变化时，重新生成 URL
      code() {
        // 防抖，最后一次起作用
        if (!this.codeToURL) {
          this.codeToURL = _.debounce(() => {
            // 将代码转为 URL
            const blob = new Blob([this.code])
            this.fileURL = URL.createObjectURL(blob)
          }, 200)
        }

        this.codeToURL()
      },
    },
    methods: {
      // 设置代码
      setCode() {
        const tpl = this.showType === 'vab-render' ? VabRenderTpl : EleFormTpl
        this.code = tpl(
          indentString(
            reomveQuotes(this.VabRender.getFormConfigStr()),
            6
          ).trim()
        )
      },
      // 高亮代码
      highlighter(code) {
        return highlight(code, languages.js)
      },
      // 复制代码
      handleCopyCode() {
        clipboardCopy(this.code)
        this.$message.success('复制成功!')
      },
    },
  }
</script>
