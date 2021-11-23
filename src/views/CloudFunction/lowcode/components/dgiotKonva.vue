<!--
* @Author: h7ml
* @Date: 2021-11-17 10:41:18
* @LastEditors: h7ml
* @LastEditTime: 2021-11-17 10:41:18
* @Description:
* @FilePath: src\views\Lowcode\components\dgiotRule.vue
* @DocumentLink:
-->
<template>
  <div id="topo"></div>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    name: 'DgiotKonva',
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
    mounted() {
      this.initKonva({
        data: this.code.Stage,
        id: 'topo',
      })
    },
    methods: {
      ...mapMutations({
        initKonva: 'topo/initKonva',
      }),
    }, //如果页面有keep-alive缓存功能，这个函数会触发
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
