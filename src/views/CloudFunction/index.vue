<!--
* @Author: h7ml
* @Date: 2021-11-17 11:12:35
* @LastEditors: h7ml
* @LastEditTime: 2021-11-17 11:12:35
* @Description:
* @FilePath: src\views\CloudFunction\index.vue
* @DocumentLink:
-->
<template>
  <div class="CloudFunction-container">
    <div class="CloudFunction-content">
      {{ infoData }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CloudFunction',
    components: {},
    data() {
      return {
        infoData: 'CloudFunction',
      }
    },
    computed: {},
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {}, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .CloudFunction-container {
    width: 100%;
    height: 100%;
    &-container {
      width: 100%;
      height: 100%;
    }
  }
</style>
