<!--
* @Author: vivi
* @Date: 2021-11-17 10:41:18
* @LastEditors: vivi
* @LastEditTime: 2021-11-17 10:41:18
* @Description:
* @FilePath: src\views\Lowcode\components\dgiotRule.vue
* @DocumentLink:
-->
<template>
  <div class="dgiotKonva-container">
    <div class="dgiotKonva-content">
      {{ infoData }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DgiotRule',
    components: {},
    props: {
      objectId: {
        default: '',
        required: true,
        type: String,
      },
      code: {
        default: () => {},
        required: true,
        type: Object,
      },
    },
    data() {
      return {
        infoData: 'dgiotKonva',
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
  .dgiotKonva-container {
    width: 100%;
    height: 100%;
    &-container {
      width: 100%;
      height: 100%;
    }
  }
</style>
