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
      :title="$translateTitle('topo.topo') + $translateTitle('topo.thing')"
      :visible.sync="thingDialog"
      append-to-body
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
    </el-dialog>
  </div>
</template>

<script>
  import wmxdetail from '@/views/equipment_management/component/wmxdetail'
  import { putProduct, putThing } from '@/api/Product'
  import { edit_konva_thing, get_konva_thing } from '@/api/Topo'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'Thing',
    components: { wmxdetail },
    data() {
      return {
        productconfig: {},
        thingDialog: false,
        infoData: 'Thing',
        thingArgs: {},
        text: 'text',
        shapeid: '',
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
        },
      )
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
      ...mapMutations({
        setSizeForm: 'konva/setSizeForm',
      }),
      wmxhandleClose() {
        this.wmxdialogVisible = false
        this.setSizeForm({})
        this.$dgiotBus.$emit('refresh', this.$route)
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
        } else if (sizeForm.type == 'image') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              imagevalue: sizeForm.imagevalue,
              specs: {},
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'bool') {
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
        putThing(data)
          .then((res) => {
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
                shapeid: this.shapeid,
              }
              edit_konva_thing(params)
                .then((res) => {
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
      async updataTopo() {
        const loading = this.$baseLoading()
        try {
          localStorage.setItem('konvaStale', canvas.stage.toJSON())
          const params = {
            config: _.merge(this.productconfig, {
              konva: { Stage: JSON.parse(canvas.stage.toJSON()) },
            }),
          }
          this.$message.success(this.$translateTitle('user.update completed'))
          const res = await putProduct(this.$route.query.productid, params)
          loading.close()
        } catch (e) {
          loading.close()
          console.log(e)
        }
      },
      async bindTopo(args) {
        const loading = this.$baseLoading()
        this.thingArgs = {
          args: args,
          id: args.id,
          productid: args.id.split('_')[0],
          text: args.text,
        }
        try {
          // const { thing={},config } = await getProduct(args.id.split('_')[0])
          let params = {
            productid: args.id.split('_')[0],
            shapeid: args.id.slice(11),
          }
          this.shapeid = args.id
          const { data } = await get_konva_thing(params)
          const {
            konvathing,
            nobound,
          } = data
          console.log(konvathing, 'konvathing')
          console.log(nobound, 'nobound')
          if (Object.values(konvathing).length > 0) {
            console.log(`物模型存在这个属性`, konvathing)
            this.reset(nobound)
            var obj = {}
            // 提交之前需要先判断类型
            if (
              ['float', 'double', 'int', 'long'].indexOf(konvathing.dataType.type) !=
              -1
            ) {
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                endnumber: this.$objGet(konvathing, 'dataType.specs.max'),
                startnumber: this.$objGet(konvathing, 'dataType.specs.min'),
                step: this.$objGet(konvathing, 'dataType.specs.step'),
                unit: this.$objGet(konvathing, 'dataType.specs.unit'),
                precision: this.$objGet(konvathing, 'dataType.specs.precision'),
                // : konvathing.dataForm.
                dis: this.$objGet(konvathing, 'dataForm.address'),
                round: this.$objGet(konvathing, 'dataForm.round'),
                dinumber: this.$objGet(konvathing, 'dataForm.data'),
                rate: this.$objGet(konvathing, 'dataForm.rate'),
                offset: this.$objGet(konvathing, 'dataForm.offset'),
                order: this.$objGet(konvathing, 'dataForm.order'),
                protocol: this.$objGet(konvathing, 'dataForm.protocol'),
                operatetype: this.$objGet(konvathing, 'dataForm.operatetype'),
                originaltype: this.$objGet(konvathing, 'dataForm.originaltype'),
                iscount: this.$objGet(konvathing, 'dataForm.iscount'),
                countstrategy: this.$objGet(konvathing, 'dataForm.countstrategy'),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(konvathing, 'dataForm.countcollection'),
                slaveid: this.$objGet(konvathing, 'dataForm.slaveid'),
                collection: '',
                control: '',
                strategy: '',
                required: true,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                identifier: konvathing.identifier,
                editdatatype: true,
              }
              if (konvathing.dataForm) {
                obj.collection = konvathing.dataForm.collection
                obj.control = konvathing.dataForm.control
                obj.strategy = konvathing.dataForm.strategy
              }
            } else if (konvathing.dataType.type == 'bool') {
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                true: konvathing.dataType.specs[1],
                false: konvathing.dataType.specs[0],
                // konvathing.dataForm.
                startnumber: this.$objGet(konvathing, 'dataType.specs.min'),
                step: this.$objGet(konvathing, 'dataType.specs.step'),
                unit: this.$objGet(konvathing, 'dataType.specs.unit'),
                round: this.$objGet(konvathing, 'dataForm.round'),
                dis: this.$objGet(konvathing, 'dataForm.address'),
                dinumber: this.$objGet(konvathing, 'dataForm.data'),
                rate: this.$objGet(konvathing, 'dataForm.rate'),
                offset: this.$objGet(konvathing, 'dataForm.offset'),
                order: this.$objGet(konvathing, 'dataForm.order'),
                protocol: this.$objGet(konvathing, 'dataForm.protocol'),
                operatetype: this.$objGet(konvathing, 'dataForm.operatetype'),
                originaltype: this.$objGet(konvathing, 'dataForm.originaltype'),
                slaveid: this.$objGet(konvathing, 'dataForm.slaveid'),
                iscount: this.$objGet(konvathing, 'dataForm.iscount'),
                countstrategy: this.$objGet(konvathing, 'dataForm.countstrategy'),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(konvathing, 'dataForm.countcollection'),
                required: false,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                identifier: konvathing.identifier,
                collection:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.control,
                strategy:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.strategy,
                editdatatype: true,
              }
            } else if (konvathing.dataType.type == 'image') {
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                imagevalue: konvathing.dataType.imagevalue,
                // konvathing.dataForm.
                startnumber: this.$objGet(konvathing, 'dataType.specs.min'),
                step: this.$objGet(konvathing, 'dataType.specs.step'),
                unit: this.$objGet(konvathing, 'dataType.specs.unit'),
                round: this.$objGet(konvathing, 'dataForm.round'),
                dis: this.$objGet(konvathing, 'dataForm.address'),
                dinumber: this.$objGet(konvathing, 'dataForm.data'),
                rate: this.$objGet(konvathing, 'dataForm.rate'),
                offset: this.$objGet(konvathing, 'dataForm.offset'),
                order: this.$objGet(konvathing, 'dataForm.order'),
                protocol: this.$objGet(konvathing, 'dataForm.protocol'),
                operatetype: this.$objGet(konvathing, 'dataForm.operatetype'),
                originaltype: this.$objGet(konvathing, 'dataForm.originaltype'),
                slaveid: this.$objGet(konvathing, 'dataForm.slaveid'),
                iscount: this.$objGet(konvathing, 'dataForm.iscount'),
                countstrategy: this.$objGet(konvathing, 'dataForm.countstrategy'),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(konvathing, 'dataForm.countcollection'),
                required: false,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                identifier: konvathing.identifier,
                collection:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.control,
                strategy:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.strategy,
                editdatatype: true,
              }
            } else if (konvathing.dataType.type == 'enum') {
              var structArray = []
              for (const key in konvathing.dataType.specs) {
                structArray.push({
                  attribute: key,
                  attributevalue: konvathing.dataType.specs[key],
                })
              }
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                specs: konvathing.dataType.specs,
                struct: structArray,
                startnumber: this.$objGet(konvathing, 'dataType.specs.min'),
                step: this.$objGet(konvathing, 'dataType.specs.step'),
                unit: this.$objGet(konvathing, 'dataType.specs.unit'),
                round: this.$objGet(konvathing, 'dataForm.round'),
                dis: this.$objGet(konvathing, 'dataForm.address'),
                dinumber: this.$objGet(konvathing, 'dataForm.data'),
                rate: this.$objGet(konvathing, 'dataForm.rate'),
                offset: this.$objGet(konvathing, 'dataForm.offset'),
                order: this.$objGet(konvathing, 'dataForm.order'),
                protocol: this.$objGet(konvathing, 'dataForm.protocol'),
                operatetype: this.$objGet(konvathing, 'dataForm.operatetype'),
                originaltype: this.$objGet(konvathing, 'dataForm.originaltype'),
                slaveid: this.$objGet(konvathing, 'dataForm.slaveid'),
                iscount: this.$objGet(konvathing, 'dataForm.iscount'),
                countstrategy: this.$objGet(konvathing, 'dataForm.countstrategy'),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(konvathing, 'dataForm.countcollection'),
                required: true,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                identifier: konvathing.identifier,
                collection:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.control,
                strategy:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.strategy,
                editdatatype: true,
              }
            } else if (konvathing.dataType.type == 'struct') {
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                struct: konvathing.dataType.specs,
                startnumber: this.$objGet(konvathing, 'dataType.specs.min'),
                step: this.$objGet(konvathing, 'dataType.specs.step'),
                unit: this.$objGet(konvathing, 'dataType.specs.unit'),
                round: this.$objGet(konvathing, 'dataForm.round'),
                dis: this.$objGet(konvathing, 'dataForm.address'),
                dinumber: this.$objGet(konvathing, 'dataForm.data'),
                rate: this.$objGet(konvathing, 'dataForm.rate'),
                offset: this.$objGet(konvathing, 'dataForm.offset'),
                order: this.$objGet(konvathing, 'dataForm.order'),
                protocol: this.$objGet(konvathing, 'dataForm.protocol'),
                operatetype: this.$objGet(konvathing, 'dataForm.operatetype'),
                originaltype: this.$objGet(konvathing, 'dataForm.originaltype'),
                slaveid: this.$objGet(konvathing, 'dataForm.slaveid'),
                iscount: this.$objGet(konvathing, 'dataForm.iscount'),
                countstrategy: this.$objGet(konvathing, 'dataForm.countstrategy'),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(konvathing, 'dataForm.countcollection'),
                required: true,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                collection:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.control,
                identifier: konvathing.dataForm == undefined ? '' : konvathing.identifier,
                strategy:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.strategy,
                editdatatype: true,
              }
            } else if (konvathing.dataType.type == 'text') {
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                collection:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.control,
                string: konvathing.dataType.size,
                startnumber: this.$objGet(konvathing, 'dataType.specs.min'),
                step: this.$objGet(konvathing, 'dataType.specs.step'),
                unit: this.$objGet(konvathing, 'dataType.specs.unit'),
                round: this.$objGet(konvathing, 'dataForm.round'),
                dis: this.$objGet(konvathing, 'dataForm.address'),
                dinumber: this.$objGet(konvathing, 'dataForm.data'),
                rate: this.$objGet(konvathing, 'dataForm.rate'),
                offset: this.$objGet(konvathing, 'dataForm.offset'),
                order: this.$objGet(konvathing, 'dataForm.order'),
                protocol: this.$objGet(konvathing, 'dataForm.protocol'),
                operatetype: this.$objGet(konvathing, 'dataForm.operatetype'),
                originaltype: this.$objGet(konvathing, 'dataForm.originaltype'),
                slaveid: this.$objGet(konvathing, 'dataForm.slaveid'),
                iscount: this.$objGet(konvathing, 'dataForm.iscount'),
                countstrategy: this.$objGet(konvathing, 'dataForm.countstrategy'),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(konvathing, 'dataForm.countcollection'),
                required: true,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                identifier: konvathing.identifier,
                strategy:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.strategy,
                editdatatype: true,
              }
            } else if (konvathing.dataType.type == 'date') {
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                collection:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.control,
                strategy:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.strategy,
                startnumber: this.$objGet(konvathing, 'dataType.specs.min'),
                step: this.$objGet(konvathing, 'dataType.specs.step'),
                unit: this.$objGet(konvathing, 'dataType.specs.unit'),
                round: this.$objGet(konvathing, 'dataForm.round'),
                dis: this.$objGet(konvathing, 'dataForm.address'),
                order: this.$objGet(konvathing, 'dataForm.order'),
                dinumber: this.$objGet(konvathing, 'dataForm.data'),
                rate: this.$objGet(konvathing, 'dataForm.rate'),
                offset: this.$objGet(konvathing, 'dataForm.offset'),
                protocol: this.$objGet(konvathing, 'dataForm.protocol'),
                operatetype: this.$objGet(konvathing, 'dataForm.operatetype'),
                originaltype: this.$objGet(konvathing, 'dataForm.originaltype'),
                slaveid: this.$objGet(konvathing, 'dataForm.slaveid'),
                iscount: this.$objGet(konvathing, 'dataForm.iscount'),
                countstrategy: this.$objGet(konvathing, 'dataForm.countstrategy'),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(konvathing, 'dataForm.countcollection'),
                required: true,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                identifier: konvathing.identifier,
                editdatatype: true,
              }
            } else if (konvathing.dataType.type == 'geopoint') {
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                gpstype: konvathing.dataType.gpstype,
                collection:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.control,
                strategy:
                  konvathing.dataForm == undefined ? '' : konvathing.dataForm.strategy,
                startnumber: this.$objGet(konvathing, 'dataType.specs.min'),
                step: this.$objGet(konvathing, 'dataType.specs.step'),
                unit: this.$objGet(konvathing, 'dataType.specs.unit'),
                round: this.$objGet(konvathing, 'dataForm.round'),
                dis: this.$objGet(konvathing, 'dataForm.address'),
                order: this.$objGet(konvathing, 'dataForm.order'),
                dinumber: this.$objGet(konvathing, 'dataForm.data'),
                rate: this.$objGet(konvathing, 'dataForm.rate'),
                offset: this.$objGet(konvathing, 'dataForm.offset'),
                protocol: this.$objGet(konvathing, 'dataForm.protocol'),
                operatetype: this.$objGet(konvathing, 'dataForm.operatetype'),
                originaltype: this.$objGet(konvathing, 'dataForm.originaltype'),
                slaveid: this.$objGet(konvathing, 'dataForm.slaveid'),
                iscount: this.$objGet(konvathing, 'dataForm.iscount'),
                countstrategy: this.$objGet(konvathing, 'dataForm.countstrategy'),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(konvathing, 'dataForm.countcollection'),
                required: true,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                identifier: konvathing.identifier,
                editdatatype: true,
              }
            }
            obj.nobound = []
            this.setSizeForm(obj)
          } else {
            this.reset(nobound)
            this.wmxData = []
            this.sizeForm.name = args.id.split('_')[1]
            // this.sizeForm.dis = this.Shapeconfig.attrs.id
            this.sizeForm.isdis = true
          }
          // 显示物模型弹窗
          this.thingDialog = true
          // this.productconfig = config
          // console.log(thing)
          // this.thingData = thing
          loading.close()
        } catch (e) {
          loading.close()
          console.log(e)
        }
      },
      reset(nobound) {
        const sizeForm = {
          name: '',
          identifier: '',
          strategy: '20',
          resource: 1,
          dis: '',
          dinumber: '528590',
          type: 'int',
          startnumber: '',
          endnumber: '',
          step: '',
          true: '',
          truevalue: 1,
          false: '',
          falsevalue: 0,
          isread: 'r',
          unit: '',
          string: '',
          date: 'String类型的UTC时间戳 (毫秒)',
          specs: {},
          round: 'all',
          struct: [
            {
              attribute: '',
              attributevalue: '',
            },
          ],
          rate: 1,
          offset: 0,
          byteorder: 'big',
          protocol: 'normal',
          operatetype: 'holdingRegister',
          originaltype: 'int16',
          slaveid: 256,
          collection: '%s',
          control: '%q',
          nobound: nobound,
        }
        this.setSizeForm(sizeForm)
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
