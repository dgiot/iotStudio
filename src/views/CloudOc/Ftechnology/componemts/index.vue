<!--
* @Author: dgiot-fe
* @Date: 2022-04-21 17:52:41
* @LastEditors: h7ml
* @LastEditTime: 2022-04-21 17:52:41
* @Description:
* @FilePath: src\views\CloudOc\Ftechnology\componemts\index.vue
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
    name: 'Index',
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
