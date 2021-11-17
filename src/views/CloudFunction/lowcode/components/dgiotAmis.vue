<!--
* @Author: vivi
* @Date: 2021-11-17 10:40:36
* @LastEditors: vivi
* @LastEditTime: 2021-11-17 10:40:36
* @Description:
* @FilePath: src\views\Lowcode\components\dgiotAmis.vue
* @DocumentLink:
-->
<template>
  <div class="dgiotAmis-container">
    <div class="dgiotAmis-content">
      {{ infoData }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DgiotAmis',
    components: {},
    data() {
      return {
        infoData: 'dgiotAmis',
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
  .dgiotAmis-container {
    width: 100%;
    height: 100%;
    &-container {
      width: 100%;
      height: 100%;
    }
  }
</style>
