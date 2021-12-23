export default function (code) {
  return `<template>
  <ele-form
    v-bind='formConfig'
    v-model='formData'
    :request-fn='handleRequest'
    @request-success='handleRequestSuccess'
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
      dgiotlog.log(data);
                dgiotlog
      .getDgiotlog('src/dgiot/components/VabRender/components/main/components/tpl/vue-ele-form.js')
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
