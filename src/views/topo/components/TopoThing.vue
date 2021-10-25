<!--
* @Author: vivi
* @Date: 2021-10-25 18:47:44
* @LastEditors: vivi
* @LastEditTime: 2021-10-25 18:47:44
* @Description:
* @FilePath: src\views\topo\components\TopoThing.vue
* @DocumentLink:
-->
<template>
  <div class="TopoThing-container">
    <div class="TopoThing-content">
      {{ infoData }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TopoThing',
    components: {},
    data() {
      return {
        infoData: 'TopoThing',
      }
    },
    computed: {},
    mounted() {
    },
    beforeCreate() {
    }, //生命周期 - 创建之前
    beforeMount() {
    }, //生命周期 - 挂载之前
    beforeUpdate() {
    }, //生命周期 - 更新之前
    updated() {
    }, //生命周期 - 更新之后
    beforeDestroy() {
    }, //生命周期 - 销毁之前
    destroyed() {
    }, //生命周期 - 销毁完成
    activated() {
    },
    methods: {}, //如果页面有keep-alive缓存功能，这个函数会触发
  }

</script>
<style lang="scss" scoped>
  .TopoThing-container {
    width: 100%;
    height: 100%;

    &-container {
      width: 100%;
      height: 100%;
    }
  }
</style>
