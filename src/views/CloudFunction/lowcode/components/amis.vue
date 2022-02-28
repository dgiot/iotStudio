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
  <dgiot-amis :key="objectId" :schema="code" :show-help="false" />
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
      code: {
        default: () => {},
        required: true,
        type: Object,
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
      this.$dgiotBus.$off('setViewData')
      this.$dgiotBus.$on('setViewData', (data) => {
        this.setData(data)
      })
      this.$dgiotBus.$off('submitCode')
      this.$dgiotBus.$on('submitCode', (code) => {
        this.$dgiotBus.$emit('saveLowCode', {
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
