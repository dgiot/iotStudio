<!--
* @Author: h7ml
* @Date: 2021-11-17 10:41:37
* @LastEditors: h7ml
* @LastEditTime: 2021-11-17 10:41:37
* @Description:
* @FilePath: src\views\Lowcode\components\index.vue
* @DocumentLink:
-->
<template>
  <div class="index-container">
    <el-drawer
      :key="type + objectId"
      v-drawerDrag
      append-to-body
      :before-close="handleClose"
      size="90%"
      :title="objectId"
      :visible.sync="flag"
      :with-header="withHeader"
    >
      <topo v-if="type === 'topo'" :code="code.konva" :object-id="objectId" />
      <amis v-if="type === 'amis'" :code="code" :object-id="objectId" />
      <amis v-if="type === 'amis_view'" :code="code" :object-id="objectId" />
    </el-drawer>
  </div>
</template>

<script>
  import amis from '@/views/CloudFunction/lowcode/components/amis'
  import topo from '@/views/CloudFunction/lowcode/components/dgiotKonva'
  import { mapMutations } from 'vuex'

  export default {
    name: 'Index',
    components: {
      topo,
      amis,
    },
    data() {
      return {
        withHeader: true,
        types: [
          'amis',
          'deviceInfo',
          'amis_view',
          'topo',
          'profile',
          'content',
          'notification',
          'reportFrom',
        ],
        code: {},
        objectId: '',
        flag: false,
        type: 'amis',
      }
    },
    mounted() {
      localStorage.removeItem('parse_objectid')
      this.$dgiotBus.$off('lowcodePreview')
      this.$dgiotBus.$on('lowcodePreview', (params) => {
        const amisEnv = {}
        const { type, data, objectId, class: _class } = params
        if (_class == 'Device') {
          console.log(data)
          // const { headers = { store: 'localStorage' } } = data.initApi
          // 设置amis中的变量参数。
          // 目前只设置了parse_objectid
          amisEnv['parse_objectid'] = parse_objectid
          localStorage.setItem('parse_objectid', parse_objectid)
          // headers.store == 'localStorage'
          //   ? localStorage.setItem('parse_objectid', parse_objectid)
          //   : store === 'sessionStorage'
          //   ? sessionStorage.setItem('parse_objectid', parse_objectid)
          //   : Cookies.set('parse_objectid', parse_objectid)

          console.groupCollapsed(
            `%c amis env`,
            'color:#009a61; font-size: 28px'
          )
          console.log('amisEnv', amisEnv)
          console.groupEnd()
        }
        this.designLowCode(type, objectId, data)
        // if (this.types.includes(type)) this.designLowCode(type, objectId, data)
        // else {
        //   this.$message.error('暂不支持该类型低代码设计')
        // }
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
      /**
       * @Author: dext7r
       * @Date: 2021-12-17 10:12:03
       * @LastEditors: dext7r
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async handleClose(done) {
        try {
          this.$confirm('确认关闭？')
            .then((_) => {
              done()
              this.$dgiotBus.$emit('lowcodeClose')
            })
            .catch((_) => {})
        } catch (error) {
          console.log(error)
        }
      },
      /**
       * @description 代码设计
       * @param type
       * @param objectId
       * @param data
       * @return {Promise<void>}
       */
      async designLowCode(type, objectId, data) {
        console.log(type)
        console.log(data)
        console.log(objectId)
        this.code = data
        this.type = type
        this.objectId = objectId
        this.flag = true
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
