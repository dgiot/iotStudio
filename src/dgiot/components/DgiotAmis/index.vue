<!--
* @Author: h7ml
* @Date: 2021-11-09 17:34:04
* @LastEditors: h7ml
* @LastEditTime: 2021-11-09 17:34:04
* @Description:
* @FilePath: src\dgiot\components\DgiotAmis\index.vue
* @DocumentLink:
-->
<template>
  <div :key="amisKey">
    <amis-render :schema="schema" />
    <draw-code v-show="showHelp" :code="schema" />
  </div>
</template>

<script>
  import AmisRender from './render'
  import DrawCode from '../DgiotDrawerCode'

  console.groupEnd()
  const amisdefault = {
    type: 'page',
    body: {
      type: 'tpl',
      tpl: 'Hello World!',
    },
  }
  export default {
    name: 'DgiotAmis',
    components: {
      DrawCode,
      AmisRender,
    },
    props: {
      schema: {
        type: Object,
        required: false,
        default: () => amisdefault,
      },
      showHelp: {
        type: Boolean,
        required: false,
        default: true,
      },
    },
    data() {
      return {
        amisKey: moment(new Date()).format('X'),
      }
    },
    watch: {
      schema: {
        handler(val) {
          this.amisKey = moment(new Date()).format('X')
        },
        immediate: true,
        deep: true,
      },
    },
  }
</script>
<style lang="scss"></style>
