<template>
  <el-dialog
    :append-to-body="true"
    title="预览"
    :visible="visible"
    width="90%"
    @closed="isShowContent = false"
    @open="isShowContent = true"
    @update:visible="$emit('change', $event)"
  >
    <ele-form
      v-if="isShowContent"
      v-model="formData"
      :form-desc="VabRender.formDesc"
      :request-fn="handleRequest"
      :visible="visible"
      v-bind="VabRender.formBindProps"
      @request-success="handleRequestSuccess"
      @update:visible="$emit('change', $event)"
    />
  </el-dialog>
</template>

<script>
  export default {
    name: 'VabRenderMainpreviewDialog',
    inject: ['VabRender'],
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isShowContent: false,
        formData: {},
      }
    },
    watch: {
      visible(val) {
        if (val) {
          // 重置数据
          this.formData = {}
        }
      },
    },
    methods: {
      handleRequest(data) {
        // eslint-disable-next-line
        console.log(data)
        return Promise.resolve(data)
      },
      handleRequestSuccess() {
        this.$message.success('发送成功')
      },
    },
  }
</script>
