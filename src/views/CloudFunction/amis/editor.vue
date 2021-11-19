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
  <vab-amis-editor ref="vabAmis" :schema="amisJson" :view-id="viewId" />
</template>

<script>
  // this.$dgiotBus.$off('setViewData')
  // this.$dgiotBus.$on('setViewData', (data) => {
  //   this.setData(data)
  // })
  import { mapGetters } from 'vuex'

  export default {
    name: 'Editor',
    data() {
      return {
        viewId: '',
      }
    },
    computed: {
      ...mapGetters({
        amisJson: 'amis/amisJson',
      }),
    },
    mounted() {
      this.viewId = this.$route.query.viewId
    },
  }
</script>
