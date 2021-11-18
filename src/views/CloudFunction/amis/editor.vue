<!--
* @Author: h7ml
* @Date: 2021-11-18 17:44:20
* @LastEditors: h7ml
* @LastEditTime: 2021-11-18 17:44:20
* @Description:
* @FilePath: src\views\CloudFunction\amis\editor.vue
* @DocumentLink:
-->
<template>
  <vab-amis-editor :schema="amisJson" />
</template>

<script>
  // this.$baseEventBus.$off('setViewData')
  // this.$baseEventBus.$on('setViewData', (data) => {
  //   this.setData(data)
  // })
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'Editor',
    computed: {
      ...mapGetters({
        amisJson: 'amis/amisJson',
      }),
    },
  }
</script>
