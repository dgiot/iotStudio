<!--
* @Author: vivi
* @Date: 2021-11-09 17:34:04
* @LastEditors: vivi
* @LastEditTime: 2021-11-09 17:34:04
* @Description:
* @FilePath: src\vab\components\VabAmis\index.vue
* @DocumentLink:
-->
<template>
  <div :key="amisKey">
    <amis-render :schema="schema" />
    <draw-code :code="schema" />
  </div>
</template>

<script>
  import AmisRender from './render'
  import DrawCode from '../VabDrawerCode'

  console.groupEnd()
  const amisdefault = {
    type: 'page',
    body: {
      type: 'tpl',
      tpl: 'Hello World!',
    },
  }
  export default {
    name: 'VabAmis',
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
