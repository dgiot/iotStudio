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
      fullscreen
      :title="$translateTitle('topo.topo') + $translateTitle('topo.thing')"
      :visible.sync="thingDialog"
    >
      <dgiot-wmx
        ref="sizeForm"
        :size-form1="sizeForm"
        @addDas="addDas"
        @addDomain="addDomain"
        @removeDas="removeDas"
        @removeDomain="removeDomain"
        @submitForm="submitForm"
        @updataForm="updataForm"
        @wmxhandleClose="wmxhandleClose"
      />
    </el-dialog>
  </div>
</template>

<script>
  import wmxdetail from '@/views/DeviceCloud/manage/component/wmxdetail'
  import { postThing, putThing } from '@/api/Product'
  import { edit_konva_thing, get_konva_thing } from '@/api/Topo'
  import { mapGetters, mapMutations } from 'vuex'
  import { putView, getView } from '@/api/View'

  export default {
    name: 'Thing',
    components: { 'dgiot-wmx': wmxdetail },
    data() {
      return {
        thingType: 'post',
        productconfig: {},
        thingDialog: false,
        infoData: 'Thing',
        thingArgs: {},
        text: 'text',
        shapeid: '',
        viewInfo: {},
        das: [],
        daslist: [],
        toponobound: [],
        topokonvathing: {},
      }
    },
    computed: {
      ...mapGetters({
        sizeForm: 'konva/sizeForm',
      }),
    },
    mounted() {
      if (this.$route.query.viewid) this.view(this.$route.query.viewid)
      this.$dgiotBus.$off('busUpdata')
      this.$dgiotBus.$on('busUpdata', () => {
        // this.updataTopo()
      })
      this.$dgiotBus.$off('thingType')
      this.$dgiotBus.$on('thingType', (type) => {
        this.thingType = type
      })
      this.$baseEventBus.$off(
        this.$dgiotBus.topicKey('dgiot_thing', 'dgiotThing')
      )
      this.$baseEventBus.$on(
        this.$dgiotBus.topicKey('dgiot_thing', 'dgiotThing'),
        (args) => {
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
      async view(viewId) {
        const { data = {} } = await getView(viewId)
        this.viewInfo = data
      },
      wmxhandleClose() {
        this.wmxdialogVisible = false
        this.setSizeForm({})
        this.$refs['sizeForm'].resource.disabled = false
        this.$dgiotBus.$emit('refresh', this.$route)
      },
      updataForm(from) {
        this.setSizeForm(from)
      },
      addDas() {
        this.sizeForm.daslist.push({
          addr: '',
        })
      },
      removeDas(item) {
        var index = this.sizeForm.daslist.indexOf(item)
        if (index !== -1) {
          this.sizeForm.daslist.splice(index, 1)
        }
      },
      // 提交
      submitForm(obj) {
        // 判断 里是否有这个identifier
        if (_.isEmpty(this.topokonvathing) == true) this.thingType = 'post'
        else this.thingType = 'put'
        this.toponobound.forEach((item) => {
          if (obj.identifier == item.identifier) {
            this.thingType = 'put'
          }
        })
        let data = {
          item: obj,
          productid: this.$route.query.productid,
        }
        if (this.thingType == 'post') {
          postThing(data).then((res) => {
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
              edit_konva_thing(params).then((res) => {
                // this.handleCloseSub()
              })
              this.wmxhandleClose()
            } else {
              this.$message({
                showClose: true,
                duration: 2000,
                type: 'warning',
                message: '编辑失败' + res.msg,
              })
            }
          })
        } else {
          putThing(data).then((res) => {
            if (res.code == 200) {
              this.$message({
                showClose: true,
                duration: 2000,
                type: 'success',
                message: '编辑成功',
              })
              let params = {
                identifier: obj.identifier,
                name: obj.name,
                productid: this.$route.query.productid,
                shapeid: this.shapeid,
              }
              edit_konva_thing(params).then((res) => {
                // this.handleCloseSub()
              })
              this.wmxhandleClose()
            } else {
              this.$message({
                showClose: true,
                duration: 2000,
                type: 'warning',
                message: '编辑失败' + res.msg,
              })
            }
          })
        }
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
        localStorage.setItem('konvaStale', canvas.stage.toJSON())
        const res = await putView(this.$route.query.viewid, {
          data: _.merge(
            {
              konva: { Stage: JSON.parse(canvas.stage.toJSON()) },
            },
            this.viewInfo
          ),
        })
        loading.close()
        this.$baseMessage(
          this.$translateTitle('user.update completed'),
          'success',
          'dgiot-hey-message-success'
        )
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
            shapeid: args.id.slice(11).replace('_text', ''),
          }
          this.shapeid = args.id
          const {
            data,
            code = 200,
            message = '',
            error = '',
          } = await get_konva_thing(params)
          if (code == 204 || error) {
            this.$baseMessage(
              message || error,
              'error',
              false,
              'dgiot-hey-message-error'
            )
            loading.close()
            return
          }
          const { konvathing = {}, nobound = [] } = data
          this.toponobound = nobound
          this.topokonvathing = konvathing
          if (Object.values(konvathing).length > 0) {
            this.reset(nobound)
            var obj = {}
            var daslist = []
            konvathing.dataType.das.forEach((val) => {
              daslist.push({
                addr: val,
              })
            })
            // 提交之前需要先判断类型
            if (
              ['float', 'double', 'int', 'long'].indexOf(
                konvathing.dataType.type
              ) != -1
            ) {
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                daslist: daslist,
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
                countstrategy: this.$objGet(
                  konvathing,
                  'dataForm.countstrategy'
                ),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(
                  konvathing,
                  'dataForm.countcollection'
                ),
                slaveid: this.$objGet(konvathing, 'dataForm.slaveid'),
                collection: '',
                control: '',
                strategy: '',
                required: true,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                isstorage: konvathing.isstorage,
                isaccumulate: konvathing.isaccumulate,
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
                daslist: daslist,
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
                countstrategy: this.$objGet(
                  konvathing,
                  'dataForm.countstrategy'
                ),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(
                  konvathing,
                  'dataForm.countcollection'
                ),
                required: false,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                isstorage: konvathing.isstorage,
                isaccumulate: konvathing.isaccumulate,
                identifier: konvathing.identifier,
                collection:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.control,
                strategy:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.strategy,
                editdatatype: true,
              }
            } else if (konvathing.dataType.type == 'image') {
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                daslist: daslist,
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
                countstrategy: this.$objGet(
                  konvathing,
                  'dataForm.countstrategy'
                ),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(
                  konvathing,
                  'dataForm.countcollection'
                ),
                required: false,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                isstorage: konvathing.isstorage,
                isaccumulate: konvathing.isaccumulate,
                identifier: konvathing.identifier,
                collection:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.control,
                strategy:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.strategy,
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
                daslist: daslist,
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
                countstrategy: this.$objGet(
                  konvathing,
                  'dataForm.countstrategy'
                ),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(
                  konvathing,
                  'dataForm.countcollection'
                ),
                required: true,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                isstorage: konvathing.isstorage,
                isaccumulate: konvathing.isaccumulate,
                identifier: konvathing.identifier,
                collection:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.control,
                strategy:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.strategy,
                editdatatype: true,
              }
            } else if (konvathing.dataType.type == 'struct') {
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                daslist: daslist,
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
                countstrategy: this.$objGet(
                  konvathing,
                  'dataForm.countstrategy'
                ),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(
                  konvathing,
                  'dataForm.countcollection'
                ),
                required: true,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                isstorage: konvathing.isstorage,
                isaccumulate: konvathing.isaccumulate,
                collection:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.control,
                identifier:
                  konvathing.dataForm == undefined ? '' : konvathing.identifier,
                strategy:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.strategy,
                editdatatype: true,
              }
            } else if (konvathing.dataType.type == 'text') {
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                daslist: daslist,
                collection:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.control,
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
                countstrategy: this.$objGet(
                  konvathing,
                  'dataForm.countstrategy'
                ),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(
                  konvathing,
                  'dataForm.countcollection'
                ),
                required: true,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                isstorage: konvathing.isstorage,
                isaccumulate: konvathing.isaccumulate,
                identifier: konvathing.identifier,
                strategy:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.strategy,
                editdatatype: true,
              }
            } else if (konvathing.dataType.type == 'date') {
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                daslist: daslist,
                collection:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.control,
                strategy:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.strategy,
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
                countstrategy: this.$objGet(
                  konvathing,
                  'dataForm.countstrategy'
                ),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(
                  konvathing,
                  'dataForm.countcollection'
                ),
                required: true,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                isaccumulate: konvathing.isaccumulate,
                isstorage: konvathing.isstorage,
                identifier: konvathing.identifier,
                editdatatype: true,
              }
            } else if (konvathing.dataType.type == 'geopoint') {
              obj = {
                name: konvathing.name,
                devicetype: konvathing.devicetype,
                type: konvathing.dataType.type,
                daslist: daslist,
                gpstype: konvathing.dataType.gpstype,
                collection:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.collection,
                control:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.control,
                strategy:
                  konvathing.dataForm == undefined
                    ? ''
                    : konvathing.dataForm.strategy,
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
                countstrategy: this.$objGet(
                  konvathing,
                  'dataForm.countstrategy'
                ),
                countround: this.$objGet(konvathing, 'dataForm.countround'),
                countcollection: this.$objGet(
                  konvathing,
                  'dataForm.countcollection'
                ),
                required: true,
                ico: konvathing.ico,
                isread: konvathing.accessMode,
                isshow: konvathing.isshow,
                isaccumulate: konvathing.isaccumulate,
                isstorage: konvathing.isstorage,
                identifier: konvathing.identifier,
                editdatatype: true,
              }
            }
            obj.nobound = []
            obj.protocol = konvathing.dataForm.protocol
            this.setSizeForm(obj)
            this.$nextTick(async () => {
              await this.$refs['sizeForm'].queryResource()
              await this.$refs['sizeForm'].queryProtocol()
              // 保证子组件已经挂载完成）
              // if (this.$refs['sizeForm'])
              this.$refs['sizeForm'].resource.value =
                konvathing.dataForm.protocol
              this.$refs['sizeForm'].resource.disabled = konvathing.dataForm
                .protocol.length
                ? true
                : false
              // this.$refs['sizeForm'].changeResource(this.$refs['sizeForm'].resource.value)

              this.$refs['sizeForm'].resource.arrlist = konvathing.dataSource
              this.$nextTick(() => {
                this.$refs['sizeForm'].resource.data.forEach(
                  (resource, index) => {
                    // resource[index].arr = []
                    // resource[index].obj = {}
                    if (
                      this.$refs['sizeForm'].resource.value === resource.cType
                    ) {
                      resource.arr.forEach((i) => {
                        if (i.allowCreate) {
                          this.$refs['sizeForm'].dynamicTable(
                            i,
                            '回显',
                            konvathing.dataSource[i.showname]
                          )
                        }
                      })
                      this.$refs['sizeForm'].resource.addchannel =
                        konvathing.dataSource
                      for (var o in konvathing.dataSource) {
                        for (var j in resource.obj) {
                          if (o === j) resource.obj[o] = rowData.dataSource[j]
                        }
                      }
                    }
                    this.$refs['sizeForm'].resource.changeData =
                      konvathing.dataSource
                  }
                )
              })
            })
          } else {
            this.reset(nobound)
            this.wmxData = []
            this.sizeForm.name = args.text
            // this.sizeForm.dis = this.Shapeconfig.attrs.id
            this.sizeForm.isdis = true
          }
          // 显示物模型弹窗
          this.thingDialog = true
          loading.close()
        } catch (e) {
          loading.close()
        }
      },
      reset(nobound) {
        const sizeForm = {
          name: '',
          identifier: '',
          strategy: '20',
          resource: 1,
          dis: '0X10',
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
          isshow: false,
          isstorage: true,
          isaccumulate: false,
          unit: '',
          string: '',
          date: 'String类型的UTC时间戳 (毫秒)',
          specs: {},
          precision: 3,
          das: [],
          daslist: [],
          round: 'all',
          struct: [
            {
              attribute: '',
              attributevalue: '',
            },
          ],
          rate: 1,
          offset: 0,
          order: 0,
          byteorder: 'big',
          protocol: 'normal',
          operatetype: 'holdingRegister',
          originaltype: 'int16',
          slaveid: 256,
          collection: '%s',
          control: '%q',
          nobound: nobound,
          editdatatype: false,
          iscount: '0',
          countstrategy: 20,
          countround: 'all',
          countcollection: '%s',
        }
        this.setSizeForm(sizeForm)
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
