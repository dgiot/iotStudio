<!--
* @Author: h7ml
* @Date: 2021-10-29 13:48:23
* @LastEditors: h7ml
* @LastEditTime: 2021-10-29 13:48:23
* @Description:
* @FilePath: src\views\topo\components\Thing.vue
* @DocumentLink:
-->
<template>
  <div class="thing">
    <el-dialog
      append-to-body
      :title="$translateTitle('topo.topo') + $translateTitle('topo.thing')"
      :visible.sync="thingDialog"
      width="50%"
    >
      {{ thingArgs }}
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="thingDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="thingDialog = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getProduct ,putProduct} from '@/api/Product'
  export default {
    name: 'Thing',
    components: {},
    data() {
      return {
        thingDialog: false,
        infoData: 'Thing',
        thingArgs: {},
        text:"text"
      }
    },
    computed: {},
    mounted() {
      this.$baseEventBus.$on('busUpdata', () => {
        this.updataTopo()
      })
      this.$dgiotBus.off(this.$dgiotBus.topicKey('dgiot_thing', 'dgiotThing'))
      this.$dgiotBus.on(
        this.$dgiotBus.topicKey('dgiot_thing', 'dgiotThing'),
        (args) => {
          console.log(args)
          if (args) {
            // 绑定物模型
            if (args.type == 'bind_topo') {
              this.bindTopo(args)
            }
          }
        }
      )
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      async updataTopo(){
        const loading = this.$baseLoading()
        try{
          const params = {
            thing: topo.Konvajson
          }
          this.$message.success(this.$translateTitle('user.update completed'))
          const res = await putProduct(this.$route.query.productid,params)
          loading.close()
        }catch (e) {
          loading.close()
          console.log(e)
        }
      },
    async  bindTopo(args) {
      const loading = this.$baseLoading()
      this.thingArgs = {
        args: args,
        id: args.id,
        productid: args.id.split('_')[0],
        text: args.text,
      }
      try {
        const { thing={} } = await getProduct(args.id.split('_')[0])
        // 显示物模型弹窗
        this.thingDialog = true
        console.log(thing)
        loading.close()
      }catch (e) {
        loading.close()
        console.log(e)
      }
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .Thing-container {
    width: 100%;
    height: 100%;
    &-container {
      width: 100%;
      height: 100%;
    }
  }
</style>
