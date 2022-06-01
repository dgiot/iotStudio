<!-- 组件说明 -->
<template>
  <div class="operation">
    <el-tabs v-if="Shapeconfig.attrs" v-model="activeName" stretch>
      <div class="unvisible">
        <el-upload
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-remove="beforeRemove"
          class="upload-demo"
          :file-list="fileList"
          :limit="1"
          multiple
          :on-exceed="handleExceed"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          style="display: none"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <el-tab-pane
        :label="$translateTitle('konva.Configuration')"
        name="setting"
      >
        <el-form
          v-for="(item, key, index) in Shapeconfig.attrs"
          :key="index"
          ref="numberValidateForm"
          class="demo-ruleForm"
          :disabled="disabledForm"
          label-width="80px"
        >
          <el-form-item :label="$translateTitle(`konva.${key}`)">
            <!--            判断不同的数据类型,显示不同的控件-->
            <el-input
              v-if="$lodash.isString(Shapeconfig.attrs[key])"
              v-model="Shapeconfig.attrs[key]"
              :disabled="disableKey.includes(key)"
            >
              <el-color-picker
                v-if="key == 'fill'"
                slot="append"
                v-model="Shapeconfig.attrs[key]"
                show-alpha
                size="mini"
              />
            </el-input>

            <el-input-number
              v-if="$lodash.isNumber(Shapeconfig.attrs[key])"
              v-model="Shapeconfig.attrs[key]"
              style="width: 100%"
            />
            <el-switch
              v-if="$lodash.isBoolean(Shapeconfig.attrs[key])"
              v-model="Shapeconfig.attrs[key]"
              :active-text="$translateTitle(`konva.draggable`)"
              :inactive-text="$translateTitle(`konva.undraggable`)"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
        <div class="footer-panel">
          <el-button
            type="success"
            @click.native="disabledForm = !disabledForm"
          >
            {{ $translateTitle('developer.edit') }}
          </el-button>
          <el-button type="info" @click.native="saveKonvaitem(Shapeconfig)">
            {{ $translateTitle('developer.determine') }}
          </el-button>
          <el-button
            type="primary"
            @click.native="handleModule(wmxdialogVisible)"
          >
            {{ $translateTitle('product.physicalmodel') }}
          </el-button>
        </div>
      </el-tab-pane>
      <!--      <el-tab-pane label="样式" name="styles">-->
      <!--        <el-input-number-->
      <!--          v-model="ShapeIndex"-->
      <!--          size="mini"-->
      <!--          :min="1"-->
      <!--          :max="1000000"-->
      <!--          label="描述文字"-->
      <!--          type="primary"-->
      <!--          ontrols-position="right"-->
      <!--        />-->
      <!--        <el-button-->
      <!--          v-if="Shapeconfig"-->
      <!--          type="primary"-->
      <!--          @click="-->
      <!--            setZIndex(Shapeconfig, { opacity: ShapeOpacity, index: ShapeIndex })-->
      <!--          "-->
      <!--        >-->
      <!--          设置层级-->
      <!--        </el-button>-->
      <!--        <el-input-number-->
      <!--          v-model="ShapeOpacity"-->
      <!--          size="mini"-->
      <!--          :min="0.01"-->
      <!--          :max="1"-->
      <!--          :precision="2"-->
      <!--          :step="0.1"-->
      <!--          label="描述文字"-->
      <!--          type="primary"-->
      <!--          ontrols-position="right"-->
      <!--        />-->
      <!--        <el-button-->
      <!--          v-if="Shapeconfig"-->
      <!--          type="primary"-->
      <!--          @click="-->
      <!--            setZIndex(Shapeconfig, { opacity: ShapeOpacity, index: ShapeIndex })-->
      <!--          "-->
      <!--        >-->
      <!--          设置透明度-->
      <!--        </el-button>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="行为" name="function">行为</el-tab-pane>-->
      <div class="TopoArom">
        <el-dialog
          :append-to-body="true"
          :before-close="wmxhandleClose"
          :close-on-click-modal="false"
          :title="wmxSituation + '自定义属性'"
          top="5vh"
          :visible.sync="wmxdialogVisible"
          width="60%"
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
    </el-tabs>
    <a-empty v-else />
  </div>
</template>

<script>
  import wmxdetail from '@/views/DeviceCloud/manage/component/wmxdetail'
  import { putThing } from '@/api/Product/index'
  import { edit_konva_thing, get_konva_thing } from '@/api/Topo'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'Operation',
    components: { wmxdetail },
    /* eslint-disable */
    props: {
      stopMqtt: {
        type: Boolean,
        default: false,
      },
      drawerflag: {
        type: Boolean,
        default: false,
      },
      value: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        disabledForm: true,
        disableKey: ['id', 'container', 'type'],
        ShapeIndex: 0,
        ShapeOpacity: 1,
        properties: [],
        wmxSituation: '',
        wmxdialogVisible: false,
        disableLable: ['id'],
        hideLable: ['draggable'],
        ShowItem: ['container'],
        collapseName: ['1'],
        allunit: {},
        wmxData: [],
        showNewItem: true,
        disabledModule: false,
        options: [],
        sizeOption: [],
        wmxstart: 1,
        wmxPageSize: 2,
        isVisible: true,
        showJson: true,
        sizerule: {
          type: 'int',
        },
        fileList: [
          {
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
          {
            name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
        ],
        Shapeconfig: {},
        productconfig: {},
        bachgroundurl: '',
        activeName: 'setting',
      }
    },
    computed: {
      ...mapGetters({
        sizeForm: 'konva/sizeForm',
      }),
    }, //生命周期 - 销毁完成
    watch: {
      Shapeconfig: {
        deep: true,
        handler(val) {
          this.disabledModule = val.className == 'Stage' ? true : false
        },
      },
    },
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {},
    activated() {},
    methods: {
      ...mapMutations({
        setSizeForm: 'konva/setSizeForm',
      }),
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
      // 重置
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
      async setZIndex(config, ShapeConfig) {
        this.$emit('upconfig', config, ShapeConfig)
      },
      async handleModule(e) {
        const { thing = { properties: [] } } = this.productconfig
        let properties = thing.properties
        this.properties = properties
        console.log('properties', properties)
        console.log('Shapeconfig', this.Shapeconfig)
        let params = {
          productid: this.$route.query.productid,
          shapeid: this.Shapeconfig.attrs.id,
        }
        const { data } = await get_konva_thing(params)
        const { konvathing, nobound } = data
        console.log(konvathing, 'konvathing')
        console.log(nobound, 'nobound')
        if (Object.values(konvathing).length > 0) {
          this.wmxSituation = '修改'
          console.log(`物模型存在这个属性`, konvathing)
          console.log(`this.wmxSituation`, this.wmxSituation)
          this.reset(nobound)
          var obj = {}
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
              countstrategy: this.$objGet(konvathing, 'dataForm.countstrategy'),
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
              countstrategy: this.$objGet(konvathing, 'dataForm.countstrategy'),
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
              countstrategy: this.$objGet(konvathing, 'dataForm.countstrategy'),
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
          this.wmxSituation = '新增'
          console.log(`this.wmxSituation`, this.wmxSituation)
          console.log('物模型不为空，但不存在这个属性', this.Shapeconfig)
          this.reset(nobound)
          this.wmxData = []
          this.sizeForm.name = this.Shapeconfig.attrs.text
          // this.sizeForm.dis = this.Shapeconfig.attrs.id
          this.sizeForm.isdis = true
        }
        this.wmxdialogVisible = !e
      },
      wmxhandleClose() {
        this.wmxdialogVisible = false
        this.Shapeconfig = {}
        this.setSizeForm({})
        this.$refs['sizeForm'].resource.disabled = false
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
          // 去除多余的属性
          if (!this.showNewItem) {
            delete obj.dataForm.operatetype
            delete obj.dataForm.originaltype
            delete obj.dataForm.slaveid
          }
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
        putThing(data).then((res) => {
          console.log('编辑', res)
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
              shapeid: this.Shapeconfig.attrs.id,
            }
            edit_konva_thing(params).then((res) => {
              console.log(res)
              this.handleCloseSub()
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
      },
      selectStruct() {},
      wmxCurrentChange() {},
      wmxSizeChange() {},
      isShowItem(lable) {
        return !this.ShowItem.includes(lable)
      },
      isdisabled(lable) {
        return this.disableLable.includes(lable)
      },
      isShowLable(disabled) {
        return !this.hideLable.includes(disabled)
      },
      updataImg(img) {
        // 触发父组件更新事件
        this.$emit('upImg', img)
      },
      saveKonvaitem(config) {
        // 触发父组件更新事件
        console.log(config)
        this.$emit('upconfig', config)
      },
      handleCloseSub() {
        this.$emit('handleCloseSub')
      },
      clearImg() {
        this.isVisible = !this.isVisible
        this.$emit('clearImg', this.isVisible)
      },
      upload() {
        this.$refs['upload'].$children[0].$refs.input.click()
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
            files.length + fileList.length
          } 个文件`
        )
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .operation {
    height: calc(100vh - #{$base-top-bar-height} * 3.5) !important;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: scroll;
    color: wheat;
  }

  ::v-deep .jsoneditor-vue {
    height: calc(100vh - #{$base-top-bar-height} * 3.5) !important;
    overflow: auto;
  }

  ::v-deep .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }

  ::v-deep .json-save-btn {
    cursor: pointer;
  }

  ::v-deep .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 !important;
    margin: 0 !important;
  }

  .footer-panel {
    text-align: center;
  }
</style>
