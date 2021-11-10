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
    <amis-render
      :key="amisKey"
      :schema="schema"
    />
    <draw-code
      :key="amisKey"
      :code="schema"
    />
  </div>
</template>

<script>
  import AmisRender from './render'
  import DrawCode from '../VabDrawerCode'
  console.groupCollapsed(
    `%c amis Help`,
    'color:#009a61; font-size: 28px; font-weight: 300'
  )
  console.info('edit ： https://aisuda.github.io/amis-editor-demo/#/edit/0');
  console.info('demo ： https://baidu.gitee.io/amis/zh-CN/docs/concepts/schema?page=1');
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
    data(){
      return {
        amisKey:moment(new Date()).format('X')
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
