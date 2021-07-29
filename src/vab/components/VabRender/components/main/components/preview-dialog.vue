<template>
  <el-dialog
    append-to-body
    :visible="visible"
    title="预览"
    width="90%"
    @update:visible="$emit('change', $event)"
    @open="isShowContent = true"
    @closed="isShowContent = false"
  >
    <ele-form
      v-if="isShowContent"
      v-model="formData"
      v-bind="VabRender.formBindProps"
      :form-desc="VabRender.formDesc"
      :visible="visible"
      :request-fn="handleRequest"
      @update:visible="$emit('change', $event)"
      @request-success="handleRequestSuccess"
    />
  </el-dialog>
</template>

<script>
  export default {
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
      console.log(data);
        return Promise.resolve(data)
      },
      handleRequestSuccess() {
        this.$message.success('发送成功')
      },
    },
  }
</script>
