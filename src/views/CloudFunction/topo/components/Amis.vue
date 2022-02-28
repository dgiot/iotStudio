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
  <div>
    <div v-if="nodeAttr.visible">
      <el-dialog
        append-to-body
        center
        :visible.sync="nodeAttr.visible"
        width="80%"
      >
        <dgiot-amis
          v-show="nodeAttr.visible"
          :key="nodeAttr.description.attrs.amis_id"
          :schema="nodeAttr.code"
          :show-help="false"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="nodeAttr.visible = false">取 消</el-button>
          <el-button type="primary" @click="nodeAttr.visible = false">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
    <div v-if="amisLoading">
      <el-dialog append-to-body center top="5vh" :visible.sync="amisLoading">
        <el-badge slot="title" class="item" type="primary" :value="amisCount">
          <el-button size="small">amis列表</el-button>
        </el-badge>
        <el-dialog append-to-body :visible.sync="innerVisible">
          <dgiot-amis
            v-show="innerVisible"
            :schema="nodeAttr.code"
            :show-help="false"
          />
        </el-dialog>
        <el-table :data="amisDict" style="width: 100%">
          <el-table-column
            align="center"
            label="名称"
            prop="title"
            show-overflow-tooltip
            sortable
            width="180"
          />
          <el-table-column
            align="center"
            label="类型"
            prop="type"
            show-overflow-tooltip
            sortable
          />
          <el-table-column align="center" label="操作" width="auto">
            <template #default="{ row }">
              <el-button
                :disabled="
                  amisNode.node.getAttr('amis_id') == row.objectId
                    ? true
                    : false
                "
                size="mini"
                :type="
                  amisNode.node.getAttr('amis_id') == row.objectId
                    ? 'success'
                    : 'primary'
                "
                @click="bind_amis(row)"
              >
                {{
                  amisNode.node.getAttr('amis_id') == row.objectId
                    ? '已绑'
                    : '绑定'
                }}
              </el-button>
              <el-button size="mini" type="info" @click="preview_amis(row)">
                预览
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty>
              <el-button type="primary" @click="goDesign()">前往添加</el-button>
            </el-empty>
          </template>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { postThing, putProduct, putThing } from '@/api/Product'
  import { edit_konva_thing, get_konva_thing } from '@/api/Topo'
  import { mapGetters, mapMutations } from 'vuex'
  import { queryView, putView, postView, delView, getView } from '@/api/View'
  export default {
    name: 'Amis',
    components: {},
    data() {
      return {
        innerVisible: false,
        nodeAttr: {
          description: {},
          visible: false,
        },
        amisCount: 0,
        amisLoading: false,
        thingType: 'post',
        productconfig: {},
        amisDict: [],
        amisNode: {},
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
        preview: false,
      }
    },
    computed: {
      ...mapGetters({
        sizeForm: 'konva/sizeForm',
      }),
    },
    mounted() {
      this.nodeAttr.visible = false
      this.$dgiotBus.$off('nodeInfo')
      this.$dgiotBus.$on('nodeInfo', (args) => {
        console.log(args.attrs.amis_id, 'nodeInfo')
        if (this.$route.query.deviceid) {
          localStorage.setItem('parse_objectid', this.$route.query.deviceid)
          this.quertAmis(args.attrs.amis_id)
          this.nodeAttr.description = args
        }
      })
      this.$baseEventBus.$off(
        this.$dgiotBus.topicKey('dgiot_amis', 'dgiotamis')
      )
      this.$baseEventBus.$on(
        this.$dgiotBus.topicKey('dgiot_amis', 'dgiotamis'),
        async (args) => {
          if (args?.type == 'bind_amis') await this.bindAmis(args)
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
      async bind_amis(args) {
        console.log(args.objectId, this.amisNode.node)
        this.amisNode.node.setAttrs({
          fill: 'red',
          bind_amis: true,
          amis_id: args.objectId,
        })
        this.amisNode.node.children[1].setAttrs({
          text: args.title,
          bind_amis: true,
          amis_id: args.objectId,
        })
        this.amisNode.node.children[0].setAttrs({
          fill: '#1e83d4',
          bind_amis: true,
          amis_id: args.objectId,
        })
        this.$message({
          showClose: true,
          message: '绑定成功',
          type: 'success',
        })
        this.amisLoading = false
        console.log(args, this.amisNode.node)
      },
      async bindAmis(args) {
        const loading = this.$baseLoading()
        this.amisNode = args
        const { results: amisDict = [], count = 0 } = await queryView({
          count: 'objectId',
          order: '-updatedAt',
          excludeKeys: 'data',
          // limit: 10,
          skip: 0,
          where: {
            key: this.$route.query.productid,
            type: 'amis',
          },
        })
        console.log(amisDict, args)
        this.amisDict = amisDict
        this.amisCount = count
        this.nodeAttr.visible = false
        this.amisLoading = true
        loading.close()
      },
      async preview_amis(args) {
        console.log(args)
        await this.quertAmis(args.objectId)
      },
      async goDesign() {
        this.$router.push({
          path: '/design',
          query: {
            key: this.$route.query.productid,
            _class: 'Product',
            type: 'amis',
            ischildren: 'false',
          },
        })
      },
      async quertAmis(amisid) {
        const { data = {} } = await getView(amisid)
        this.nodeAttr.code = data
        this.innerVisible = true
        // this.amisLoading = false
        this.viewInfo = data
        if (this.$route.query.deviceid) this.nodeAttr.visible = true
      },
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
      addDas() {
        console.log(this.sizeForm)
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
        console.log('sizeForm', obj)
        console.log('thingType', this.thingType)
        console.log('toponobound', this.toponobound)
        console.log('topokonvathing', this.topokonvathing)
        console.info('如果type是put 走put，否则post')
        // 判断 里是否有这个identifier
        if (_.isEmpty(this.topokonvathing) == true) this.thingType = 'post'
        else this.thingType = 'put'
        this.toponobound.forEach((item) => {
          console.log(obj.identifier, item.identifier, 'identifier')
          if (obj.identifier == item.identifier) {
            this.thingType = 'put'
          }
        })
        console.log('thingType', this.thingType)
        let data = {
          item: obj,
          productid: this.$route.query.productid,
        }
        if (this.thingType == 'post') {
          postThing(data).then((res) => {
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
              edit_konva_thing(params).then((res) => {
                console.log(res)
                // this.handleCloseSub()
              })
              this.wmxhandleClose()
            } else {
              this.$message({
                type: 'warning',
                message: '编辑失败' + res.msg,
              })
            }
          })
        } else {
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
                shapeid: this.shapeid,
              }
              edit_konva_thing(params).then((res) => {
                console.log(res)
                // this.handleCloseSub()
              })
              this.wmxhandleClose()
            } else {
              this.$message({
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
        try {
          localStorage.setItem('konvaStale', canvas.stage.toJSON())
          const params = {
            config: _.merge(this.productconfig, {
              konva: { Stage: JSON.parse(canvas.stage.toJSON()) },
            }),
          }
          this.$message({
            showClose: true,
            message: this.$translateTitle('user.update completed'),
            type: 'success',
          })
          const res =
            this.$route.query.type == 'Evidence'
              ? await putView(this.$route.query.viewid, {
                  data: _.merge(
                    {
                      konva: { Stage: JSON.parse(canvas.stage.toJSON()) },
                    },
                    this.viewInfo
                  ),
                })
              : await putProduct(this.$route.query.productid, params)
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
        console.log('args', args)
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
          console.log(konvathing, 'konvathing')
          console.log(nobound, 'nobound')
          this.toponobound = nobound
          this.topokonvathing = konvathing
          if (Object.values(konvathing).length > 0) {
            console.log(`物模型存在这个属性`, konvathing)
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
                identifier: konvathing.identifier,
                editdatatype: true,
              }
            }
            obj.nobound = []

            this.setSizeForm(obj)
          } else {
            this.reset(nobound)
            this.wmxData = []
            this.sizeForm.name = args.text
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
