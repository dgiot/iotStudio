<!--
* @Author: h7ml
* @Date: 2021-11-17 10:40:36
* @LastEditors: h7ml
* @LastEditTime: 2021-11-17 10:40:36
* @Description:
* @FilePath: src\views\Lowcode\components\dgiotDict.vue
* @DocumentLink:
-->
<template>
  <vab-amis :key="objectId" :schema="viewData" :show-help="false" />
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'DgiotAmis',
    components: {},
    props: {
      objectId: {
        default: '',
        required: true,
        type: String,
      },
    },
    data() {
      return {
        infoData: 'dgiotAmis',
      }
    },
    computed: {
      ...mapGetters({
        viewData: 'view/viewData',
      }),
    },
    mounted() {
      this.$baseEventBus.$off('setViewData')
      this.$baseEventBus.$on('setViewData', (data) => {
        this.setData(data)
      })
      this.$baseEventBus.$off('submitCode')
      this.$baseEventBus.$on('submitCode', (code) => {
        this.$baseEventBus.$emit('saveLowCode', {
          id: this.objectId,
          data: { data: code },
        })
      })
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      ...mapMutations({
        setData: 'view/setData',
      }),
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
