<!--
 * @Author: h7ml
 * @Date: 2021-6-28 14:49:32
 * @LastEditTime: 2021-6-28 14:49:40
 * @LastEditors: h7ml
 * @Description: https://www.yuque.com/chaojie-vjiel/vbwzgu/twp49o https://github.com/dream2023/f-render/blob/7bc377cf1b88f6c01aad96844d63f7bc832a9415/README.md#%E7%AC%AC-3-%E6%AD%A5%E4%BD%BF%E7%94%A8
 * @FilePath: src/vab/components/VabParser/index.vue
-->

<template>
  <f-render
    :loading="loading"
    :height="parseheight"
    :config="formConfig"
    :productid="productid"
    @save="handleSave"
  />
</template>

<script>
  export default {
    name: 'VabParser',
    props: {
      parseheight: {
        type: String,
        default: 'calc(100vh - 70px)',
      },
      formConfig: {
        type: Object,
        default: () => {},
      },
      productid: {
        type: String,
        default: '',
        require: true,
      },
    },
    data() {
      return {
        loading: false,
      }
    },
    mounted() {
      // 模拟异步加载
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    methods: {
      handleSave(res) {
        this.$emit('ParserSave', res, this.productid)
      },
    },
  }
</script>
