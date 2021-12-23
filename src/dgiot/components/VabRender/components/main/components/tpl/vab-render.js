export default function (code) {
  return `<template>
  <vab-render
    v-model='formData'
    :request-fn='handleSubmit'
    @request-success='handleSuccess'
    :config='formConfig'
    pure
  />
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      formConfig: ${code}
    };
  },
  methods: {
    handleRequest(data) {
          dgiotlog
      .getDgiotlog('src/dgiot/components/VabRender/components/main/components/tpl/vab-render.js')
      .info(data)
      return Promise.resolve();
    },
    handleRequestSuccess() {
      this.$message.success("发送成功");
    }
  }
};
</script>
`
}
