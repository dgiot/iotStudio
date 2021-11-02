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
      top="5vh"
    >
      <wmxdetail
        ref="sizeForm"
        :size-form1="sizeForm"
        @addDomain="addDomain"
        @removeDomain="removeDomain"
        @submitForm="submitForm"
        @updataForm="updataForm"
        @wmxhandleClose="wmxhandleClose"
      />
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
  import wmxdetail from "@/views/equipment_management/component/wmxdetail";
  import { getProduct, putProduct, putThing } from '@/api/Product'
  import { edit_konva_thing } from '@/api/Topo'
  import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
  export default {
    name: 'Thing',
    components: {wmxdetail},
    data() {
      return {
        thingData:[],
        productconfig:{},
        thingDialog: false,
        infoData: 'Thing',
        thingArgs: {},
        text:"text"
      }
    },
    computed: {
      ...mapGetters({
        sizeForm: 'konva/sizeForm',
      }),
    },
    mounted() {
      this.$baseEventBus.$on('busUpdata', () => {
        this.updataTopo()
      })
      // this.$baseEventBus.$off(this.$dgiotBus.topicKey('dgiot_thing', 'dgiotThing'))
      this.$baseEventBus.$on(
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
      ...mapMutations({
        setSizeForm: 'konva/setSizeForm',
      }),
      wmxhandleClose() {
        this.wmxdialogVisible = false
        this.Shapeconfig = {}
        this.setSizeForm({})
        this.$dgiotBus.$emit('refresh',this.$route)
      },
      updataForm(from) {
        console.log('子组件改变的值')
        console.log(from)
        this.setSizeForm(from)
      },
      // 提交
      submitForm(sizeForm) {
        console.log('sizeForm', sizeForm)
        var obj = {
          name: sizeForm.name,
          devicetype: sizeForm.devicetype,
          dataForm: {
            round: sizeForm.round,
            data: sizeForm.dinumber,
            address: sizeForm.dis,
            rate: sizeForm.rate,
            offset: sizeForm.offset,
            order: sizeForm.order,
            protocol: sizeForm.protocol,
            operatetype: sizeForm.operatetype,
            originaltype: sizeForm.originaltype,
            slaveid: sizeForm.slaveid,
            collection: sizeForm.collection,
            control: sizeForm.control,
            strategy: sizeForm.strategy,
            iscount: sizeForm.iscount,
            countstrategy: sizeForm.countstrategy,
            countround: sizeForm.countround,
            countcollection: sizeForm.countcollection,
          },
          ico: sizeForm.ico,
          required: true,
          accessMode: sizeForm.isread,
          isshow: sizeForm.isshow,
          identifier: sizeForm.identifier,
        }
        // 提交之前需要先判断类型
        if (
          sizeForm.type == 'float' ||
          sizeForm.type == 'double' ||
          sizeForm.type == 'int' ||
          sizeForm.type == 'long'
        ) {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              specs: {
                max: sizeForm.endnumber,
                min: sizeForm.startnumber,
                step: sizeForm.step,
                unit: sizeForm.unit == '' ? '' : sizeForm.unit,
              },
            },
          }
          Object.assign(obj, obj1)
          // 去除多余的属性
          if (!this.showNewItem) {
            delete obj.dataForm.operatetype
            delete obj.dataForm.originaltype
            delete obj.dataForm.slaveid
          }
        }else if (sizeForm.type == 'image') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              imagevalue: sizeForm.imagevalue,
              specs: {},
            },
          }
          Object.assign(obj, obj1)
        }  else if (sizeForm.type == 'bool') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              specs: {
                0: sizeForm.false,
                1: sizeForm.true,
              },
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'enum') {
          var specs = {}
          sizeForm.struct.map((items) => {
            var newkey = items['attribute']
            specs[newkey] = items['attributevalue']
          })
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              specs: specs,
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'struct') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              specs: sizeForm.struct,
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'string') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              size: sizeForm.string,
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'text') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              size: sizeForm.string,
              specs: {},
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'date') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'geopoint') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              gpstype: sizeForm.gpstype,
              specs: {},
            },
          }
          Object.assign(obj, obj1)
        }
        let data = {
          item: obj,
          productid: this.$route.query.productid,
        }
        putThing(data).then((res) => {
          console.log('编辑', res)
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '编辑成功',
            })
            let params = {
              identifier: obj.identifier,
              name: obj.name,
              productid: this.$route.query.productid,
              shapeid: this.Shapeconfig.attrs.id,
            }
            edit_konva_thing(params).then((res) => {
              console.log(res)
              this.handleCloseSub()
            })
            this.wmxhandleClose()
          } else {
            this.$message({
              type: 'warning',
              message: '编辑失败' + res.msg,
            })
          }
        })
      },
      // 删除枚举型
      removeDomain(item) {
        var index = this.sizeForm.struct.indexOf(item)
        if (index !== -1) {
          this.sizeForm.struct.splice(index, 1)
        }
      },
      addDomain() {
        this.sizeForm.struct.push({
          attribute: '',
          attributevalue: '',
        })
      },
      async updataTopo(){
        const loading = this.$baseLoading()
        try{
          localStorage.setItem('konvaStale',canvas.stage.toJSON())
          const params = {
            config: _.merge(this.productconfig, {konva:JSON.parse(canvas.stage.toJSON()) })
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
        const { thing={},config } = await getProduct(args.id.split('_')[0])
        // 显示物模型弹窗
        this.thingDialog = true
        this.productconfig = config
        console.log(thing)
        this.thingData = thing
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
