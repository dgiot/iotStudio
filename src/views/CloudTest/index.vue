<!--
* @Author: vivi
* @Date: 2021-11-15 10:08:49
* @LastEditors: vivi
* @LastEditTime: 2021-11-15 10:08:49
* @Description:
* @FilePath: src\views\CloudTest\index.vue
* @DocumentLink:
-->
<template>
  <div class="index-container">
    <div class="index-content">
      {{ infoData }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CloudTest',
    components: {},
    data() {
      return {
        infoData: 'index',
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
  .index-container {
    width: 100%;
    height: 100%;
    &-container {
      width: 100%;
      height: 100%;
    }
  }
</style>
