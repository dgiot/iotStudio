<!--
* @Author: h7ml
* @Date: 2021-10-21 09:52:32
* @LastEditors: h7ml
* @LastEditTime: 2021-10-21 09:52:32
* @Description: topo scale
* @FilePath: src\views\topo\components\TopoScale.vue
* @DocumentLink:
-->
<template>
  <div class="TopoScale-container">
    <div class="TopoScale-container-content">
      <i
        class="el-icon-zoom-out"
        @click="setSize('out')"
      ></i>
      <div class="scale">
        {{ scale }}
      </div>
      <i
        class="el-icon-zoom-in"
        @click="setSize('in')"
      ></i>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'TopoScale',
    components: {},
    data() {
      return {
        infoData: 'TopoScale',
      }
    },
    computed: {
      ...mapGetters({
        scale: 'topo/Sale',
      }),
    },
    mounted() {
    },
    beforeCreate() {
    }, //生命周期 - 创建之前
    beforeMount() {
    }, //生命周期 - 挂载之前
    beforeUpdate() {
    }, //生命周期 - 更新之前
    updated() {
    }, //生命周期 - 更新之后
    beforeDestroy() {
    }, //生命周期 - 销毁之前
    destroyed() {
    }, //生命周期 - 销毁完成
    activated() {
    },
    methods: {
      ...mapActions({
        setSale: 'topo/setSale',
      }),
      /**
       * @description 设置组态编辑器比例大小
       * @param type
       */
      setSize(type) {
        type === 'out' ? this.setSale(this.scale - 10 >= 40 ? this.scale - 10 : this.scale) : this.setSale(this.scale + 10)
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .TopoScale-container {
    position: relative;
    cursor: pointer;
    z-index: 2020;

    &-content {
      display: flex;
      align-items: center;

      .scale {
        margin: 0 2px;
      }
    }
  }
</style>
