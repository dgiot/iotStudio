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
  <draggable :list="list" v-bind="dragOptions">
    <div v-for="(item, index) in list" :key="item + index">
      <dgiot-icon icon="drag-drop-line" />
      <el-checkbox
        :disabled="item.disableCheck === true"
        :label="item.label ? item.label : item"
      >
        {{ item.label ? item.label : item }}
      </el-checkbox>
    </div>
  </draggable>
</template>

<script>
  const draggable = window.vuedraggable
  export default {
    name: 'DgiotDraggable',
    components: {
      draggable,
    },
    props: {
      list: {
        type: Array,
        required: false,
        default: function () {
          return []
        },
      },
    },
    data(e) {
      console.log(e, draggable)
      return {}
    },
    computed: {
      dragOptions() {
        return {
          animation: 0,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost',
        }
      },
    },
    created() {
      this.isShow = true
    },
  }
</script>
