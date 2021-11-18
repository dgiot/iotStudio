<!--
* @Author: vivi
* @Date: 2021-11-17 10:41:37
* @LastEditors: vivi
* @LastEditTime: 2021-11-17 10:41:37
* @Description:
* @FilePath: src\views\dict\components\index.vue
* @DocumentLink:
-->
<template>
  <div class="index-container">
    <el-drawer
      ref="dgiotDict"
      v-drawerDrag
      append-to-body
      size="50%"
      title="字典"
      :visible.sync="dictFlag"
    >
      <dgiot-dict :object-id="dictId" />
    </el-drawer>
    <el-drawer
      ref="dgiotWord"
      v-drawerDrag
      append-to-body
      size="50%"
      title="字典"
      :visible.sync="wordFlag"
    >
      <dgiot-word :data="data" :object-id="dictId" />
    </el-drawer>
  </div>
</template>

<script>
  import dgiotDict from '@/views/CloudFunction/dict/components/dgiotDict'
  import dgiotRule from '@/views/CloudFunction/dict/components/dgiotRule'
  import dgiotWord from '@/views/CloudFunction/dict/components/dgiotWord'
  import { mapMutations } from 'vuex'
  export default {
    name: 'Index',
    components: {
      dgiotDict,
      dgiotRule,
      dgiotWord,
    },
    data() {
      return {
        data: {},
        dictId: '',
        infoData: 'index',
        dictFlag: false,
        wordFlag: false,
        ruleFlag: false,
      }
    },
    mounted() {
      this.$baseEventBus.$off('dictDesign')
      this.$baseEventBus.$on('dictDesign', (params) => {
        const typePayload = ['dict', 'word', 'rule']
        const { type, data, objectId } = params
        if (typePayload.includes(type)) this.designDict(type, objectId, data)
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
        set_dictJson: 'dict/set_dictJson',
      }),
      /**
       * @description 代码设计
       * @param type
       * @param objectId
       * @param data
       * @return {Promise<void>}
       */
      async designDict(type, objectId, data) {
        this.dictId = objectId
        this.data = data
        console.log('data', data)
        console.log('objectId', objectId)
        console.log('type', type)
        switch (type) {
          case 'word':
            this.wordFlag = true
            this.dictFlag = false
            this.ruleFlag = false
            break
          case 'dict':
            this.dictFlag = true
            this.wordFlag = false
            this.ruleFlag = false
            break
          case 'rule':
            this.ruleFlag = true
            this.dictFlag = false
            this.wordFlag = false
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
