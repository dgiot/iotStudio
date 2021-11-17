<!--
* @Author: vivi
* @Date: 2021-11-17 10:41:37
* @LastEditors: vivi
* @LastEditTime: 2021-11-17 10:41:37
* @Description:
* @FilePath: src\views\Lowcode\components\index.vue
* @DocumentLink:
-->
<template>
  <div class="index-container">
    <el-drawer
      ref="dgiotKonva"
      v-drawerDrag
      append-to-body
      size="80%"
      :title="lowcodeId"
      :visible.sync="konvaFlag"
      :with-header="false"
    >
      <dgiot-konva :object-id="lowcodeId" />
    </el-drawer>

    <el-drawer
      ref="dgiotAmis"
      v-drawerDrag
      append-to-body
      size="80%"
      :title="lowcodeId"
      :visible.sync="amisFlag"
      :with-header="false"
    >
      <dgiot-amis :code="code" :object-id="lowcodeId" />
    </el-drawer>
  </div>
</template>

<script>
  import dgiotAmis from '@/views/CloudFunction/lowcode/components/dgiotAmis'
  import dgiotKonva from '@/views/CloudFunction/lowcode/components/dgiotKonva'
  import { mapMutations } from 'vuex'
  export default {
    name: 'Index',
    components: {
      dgiotKonva,
      dgiotAmis,
    },
    data() {
      return {
        code: {},
        lowcodeId: '',
        infoData: 'index',
        amisFlag: false,
        konvaFlag: false,
      }
    },
    mounted() {
      this.$baseEventBus.$off('lowcodeDesign')
      this.$baseEventBus.$on('lowcodeDesign', (params) => {
        const typePayload = ['amis', 'konva']
        console.log(params)
        const { type, data, objectId } = params
        if (typePayload.includes(type)) this.designLowCode(type, objectId, data)
        else {
          this.$message.error('暂不支持该类型低代码设计')
        }
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
        set_amisJson: 'amis/set_amisJson',
      }),
      /**
       * @description 代码设计
       * @param type
       * @param objectId
       * @param data
       * @return {Promise<void>}
       */
      async designLowCode(type, objectId, data) {
        this.code = data
        this.lowcodeId = objectId
        switch (type) {
          case 'amis':
            this.set_amisJson(this.code)
            this.amisFlag = true
            this.konvaFlag = false
            break
          case 'konva':
            this.amisFlag = false
            this.konvaFlag = true
            break
        }
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .index-container {
    width: 100%;
    height: 100%;
    &-container {
      width: 100%;
      height: 100%;
    }
  }
</style>
