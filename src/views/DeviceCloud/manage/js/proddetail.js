/* eslint-disable */
import mqttLog from '@/views/CloudFunction/engine/components/mqttLog.vue'
import thingForm from '@/views/DeviceCloud/manage/component/Thing/form'
import { getDlinkJson } from '@/api/Dlink'
import { mapGetters, mapMutations } from 'vuex'
import { getDeviceCountByProduct } from '@/api/Device/index'
import {
  deleteThing,
  getProduct,
  postThing,
  putProduct,
  putThing,
} from '@/api/Product/index'
import {
  getChannelCountByProduct,
  putChannel,
  saveChanne,
} from '@/api/Channel/index'
import { downBinary } from '@/api/File/index'
import { getDictCount } from '@/api/Dict/index'
import { getRule } from '@/api/Rules'
import { postProductTemplet } from '@/api/ProductTemplet'
import { Compile, subupadte } from '@/api/System/index'
import { list_dir, file_info, delete_file } from '@/api/System/filemanagement'
import { setTimeout } from 'timers'
import wmxdetail from '@/views/DeviceCloud/manage/component/wmxdetail'
import profile from '@/views/DeviceCloud/manage/profile'
import { dgiotlog } from '../../../../utils/dgiotLog'
import { queryView } from '@/api/View'
import dgiotViews from '@/views/CloudFunction/lowcode'
import { getProtocol } from '@/api/Protocol'
import dgiotDict from '@/views/CloudFunction/dict'
import {
  BaiduMap,
  BmCityList,
  BmControl,
  BmGeolocation,
  BmInfoWindow,
  BmLabel,
  BmlMarkerClusterer,
  BmLocalSearch,
  BmMapType,
  BmMarker,
  BmNavigation,
  BmOverviewMap,
  BmPanorama,
  BmPointCollection,
  BmScale,
  BmView,
} from 'vue-baidu-map'
import { putDevice } from '../../../../api/Device'

var editor
var editor1
var editor2
var editormodel
var editorcreate
var editorinsert
var channelrow = {}
const Base64 = require('js-base64').Base64
var setdata = ''
var isallchannel = false
var isupdatetrue = ''
export default {
  components: {
    mqttLog,
    dgiotViews,
    dgiotDict,
    'dgiot-wmx': wmxdetail,
    'dgiot-profile': profile,
    'thing-form': thingForm,
    BmLocalSearch,
    BmPointCollection,
    BmInfoWindow,
    BmScale,
    BmMapType,
    BmView,
    BmOverviewMap,
    BmPanorama,
    BmControl,
    BmLabel,
    BaiduMap,
    BmNavigation,
    BmGeolocation,
    BmCityList,
    BmMarker,
    BmlMarkerClusterer,
  },
  data() {
    const validCode = (rule, value, callback) => {
      const reg = /[0-9a-zA-Z]/
      if (!reg.test(value)) {
        callback(new Error('协议名称由数字和字母组合'))
      } else {
        callback()
      }
    }
    const validminnumber = (rule, value, callback) => {
      // dgiotlog.log(value);
      if (value === '') {
        callback(new Error('最小值不能为空'))
      } else {
        //   if(value<0){
        //   callback(new Error('最小值不能小于0'))
        // }else{
        if (this.sizeForm.endnumber !== '') {
          if (value >= this.sizeForm.endnumber) {
            callback(new Error('最小值小于最大值'))
          } else {
            callback()
          }
        }
        // }
      }
    }
    const validmaxnumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('最大值不能为空'))
      } else {
        if (this.sizeForm.startnumber !== '') {
          if (value <= this.sizeForm.startnumber) {
            callback(new Error('最大值必须大于最小值'))
          } else {
            callback()
          }
        }
        // }
      }
    }
    const vailspecs = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error('步长大于0'))
      } else if (value >= this.sizeForm.endnumber - this.sizeForm.startnumber) {
        callback(new Error('步长必须小于最大值和最小值的差值'))
      } else {
        callback()
      }
    }
    const validstructminnumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('最小值不能为空'))
      } else {
        //   if(value<0){
        //   callback(new Error('最小值不能小于0'))
        // }else{
        if (this.structform.endnumber !== '') {
          if (value >= this.structform.endnumber) {
            callback(new Error('最小值小于最大值'))
          } else {
            callback()
          }
          // }
        }
      }
    }
    const validstructmaxnumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('最大值不能为空'))
      } else {
        // if(value<0){
        //   callback(new Error('最大值不能小于0'))
        // }else{
        if (this.structform.startnumber !== '') {
          if (value <= this.structform.startnumber) {
            callback(new Error('最大值必须大于最小值'))
          } else {
            callback()
          }
        }
        // }
      }
    }
    const vailstructspecs = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error('步长大于0'))
      } else if (
        value >=
        this.structform.endnumber - this.structform.startnumber
      ) {
        callback(new Error('步长必须小于最大值和最小值的差值'))
      } else {
        callback()
      }
    }
    return {
      ak: this.$dgiot.secret.baidu.map,
      viewForm: {
        showRow: true,
        class: 'Product',
        type: 'notification',
        key: this.$route.query.id,
        title: '',
        disabled: true,
        data: {
          type: 'page',
          initApi: {
            url: 'iotapi/classes/Device/parse_objectid',
            method: 'get',
            adaptor:
              'return {\r\n  "status":0,\r\n  "msg":"",\r\n  "data":response.data.basedata\r\n  }',
            headers: {
              store: 'localStorage',
              dgiotReplace: 'parse_objectid',
            },
            dataType: 'json',
          },
          body: [
            {
              type: 'form',
              api: {
                method: 'put',
                url: 'iotapi/classes/Device/parse_objectid',
                headers: {
                  store: 'localStorage',
                  dgiotReplace: 'parse_objectid',
                },
                dataType: 'json',
                requestAdaptor:
                  'return {\r\n    ...api,\r\n    data: {\r\n        basedata:{ ...api.data}\r\n    }\r\n}',
              },
              body: [
                {
                  type: 'input-text',
                  label: '设备名称',
                  name: 'name',
                },
              ],
            },
          ],
        },
        hiddenRow: ['class', 'key', 'createdAt'],
      },
      dlinkUnit: [],
      dlinkTopic: { basic: [], thing: [] },
      mergeObj: { basic: [], thing: [] },
      tabsChild: 'properties',
      // tabsChild: 'events',
      modules: {
        data: {
          properties: [],
          events: [],
          services: [],
          tags: [],
        },
        type: 'events',
        disabled: false,
        visible: false,
        events: {
          rules: {
            name: [
              { required: true, message: '请输入功能名称', trigger: 'blur' },
              {
                min: 1,
                max: 30,
                message: '长度在 1 到 30 个字符',
                trigger: 'blur',
              },
            ],
            identifier: [
              { required: true, message: '请输入标识符', trigger: 'blur' },
            ],
            types: [
              { required: true, message: '请选择调用方式', trigger: 'change' },
            ],
            output: [
              {
                type: 'array',
                required: true,
                message: '请至少选择一个输出参数',
                trigger: 'blur',
              },
            ],
          },
          visible: false,
          data: {
            outputParams: [],
            name: '',
            identifier: '',
            types: 'info',
            output: [],
            describe: '',
          },
        },
        services: {
          rules: {
            name: [
              { required: true, message: '请输入功能名称', trigger: 'blur' },
              {
                min: 1,
                max: 40,
                message: '长度在 1 到 40 个字符',
                trigger: 'blur',
              },
            ],
            identifier: [
              { required: true, message: '请输入标识符', trigger: 'blur' },
            ],
            transfer: [
              { required: true, message: '请选择调用方式', trigger: 'change' },
            ],
          },
          visible: false,
          data: {
            name: '',
            identifier: '',
            enter: [],
            transfer: 'sync',
            output: [],
            describe: '',
          },
        },
      },
      moduletype: 'properties',
      amisproductInfo: [],
      upKey: moment.now(),
      codeFlag: false,
      productInfo: {
        decoder: { code: '' },
        thing: { properties: [], events: [], services: [], tags: [] },
        config: {
          parser: [],
          profile: [],
          basedate: { params: [] },
        },
      },
      productObj: {
        thing: { properties: [], events: [], services: [], tags: [] },
      },
      FromMachine: [{ name: 'ALL' }],
      machineForm: {},
      machine: false,
      devicetype: '',
      machinestatus: 'add',
      machineindex: 0,
      options: [
        {
          value: 'first',
          label: '第一轮',
        },
        {
          value: 'last',
          label: '最后一轮',
        },
        {
          value: 'all',
          label: '全部',
        },
      ],
      activeIndex: '',
      editableTabsValue: '1',
      editableTabs: [],
      tabIndex: 1,
      sizeOption: [
        {
          label: '20',
          val: '20',
        },
        {
          label: '不采集(计算值)',
          val: '计算值',
        },
        {
          label: '不采集(主动上报)',
          val: '主动上报',
        },
      ],
      // topic数据
      showList: false,
      collapseName: ['1', '2', '3', '4'],
      multipleSelection: [],
      protolchannel: [],
      protoldialog: false,
      productimg: '',
      topicdialogVisible: false,
      topicform: {
        profile: '',
        topic: '',
        type: '',
        desc: '',
        value: '',
        info: 'basic',
        isupdated: -1,
      },
      exportDialogShow: false,
      exportUrl: '',
      exportName: '',
      decodertotal: 0,
      decoderstart: 0,
      leftItemPos: 0,
      ed3isShow: false,
      rightCollection: '',
      decoderlength: 10,
      topicrule: {
        info: [
          { required: true, message: '请选择topic所属类型', trigger: 'change' },
        ],
        topic: [
          {
            required: true,
            message: '请输入Topic类',
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择Topic权限',
            trigger: 'change',
          },
        ],
      },
      topicstart: 1,
      topiclength: 10,
      topictotal: 0,
      // 服务通道数据
      channelData: [],
      allchannelData: [],
      innerVisible: false,
      allChannelstart: 0,
      allChannellength: 20,
      allChanneltotal: 0,
      // 物模型数据
      category: [],
      current: 0,
      schemadialogVisible: false,
      collectionDialogVisible: false,
      PropData: [],
      originwmx: false,
      wmxdialogVisible: false,
      wmxSituation: '新增',
      // 自定义物模型
      allunit: [],
      sizerule: {
        step: [
          {
            required: true,
            trigger: 'blur',
            validator: vailspecs,
          },
        ],
        string: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入数据长度',
          },
          {
            type: 'number',
            message: '数据长度必须为数字',
          },
        ],
        startnumber: [
          {
            validator: validminnumber,
            required: true,
            trigger: 'blur',
          },
        ],
        endnumber: [
          {
            validator: validmaxnumber,
            required: true,
            trigger: 'blur',
          },
        ],
        resource: [
          {
            required: true,
            message: '请选择功能类型',
            trigger: 'change',
          },
        ],
        true: [
          {
            required: true,
            message: '请输入属性值',
            trigger: 'blur',
          },
        ],
        false: [
          {
            required: true,
            message: '请输入属性值',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: '请输入属性名称',
            trigger: 'blur',
          },
        ],
        identifier: [
          {
            required: true,
            message: '请输入标识符',
            trigger: 'blur',
          },
        ],
        dis: [
          {
            required: true,
            message: '请输入数据标识',
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择数据类型',
            trigger: 'change',
          },
        ],
        attribute: [
          {
            required: true,
            message: '请输入属性',
            trigger: 'blur',
          },
        ],
        attributevalue: [
          {
            required: true,
            message: '请输入属性值',
            trigger: 'blur',
          },
        ],
        isread: [
          {
            required: true,
            message: '请选择读写类型',
            trigger: 'change',
          },
        ],
      },
      // 结构体判断规则
      structrule: {
        string: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入数据长度',
          },
          {
            type: 'number',
            message: '数据长度必须为数字',
          },
        ],
        step: [
          {
            required: true,
            trigger: 'blur',
            validator: vailstructspecs,
          },
        ],
        startnumber: [
          {
            validator: validstructminnumber,
            required: true,
            trigger: 'blur',
          },
        ],
        endnumber: [
          {
            validator: validstructmaxnumber,
            required: true,
            trigger: 'blur',
          },
        ],
        resource: [
          {
            required: true,
            message: '请选择功能类型',
            trigger: 'change',
          },
        ],
        true: [
          {
            required: true,
            message: '请输入属性值',
            trigger: 'blur',
          },
        ],
        false: [
          {
            required: true,
            message: '请输入属性值',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: '请输入属性名称',
            trigger: 'blur',
          },
        ],
        identifier: [
          {
            required: true,
            message: '请输入标识符',
            trigger: 'blur',
          },
        ],
        dis: [
          {
            required: true,
            message: '请输入数据标识',
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择数据类型',
            trigger: 'change',
          },
        ],
        attribute: [
          {
            required: true,
            message: '请输入属性',
            trigger: 'blur',
          },
        ],
        attributevalue: [
          {
            required: true,
            message: '请输入属性值',
            trigger: 'blur',
          },
        ],
        isread: [
          {
            required: true,
            message: '请选择读写类型',
            trigger: 'change',
          },
        ],
      },
      structdialog: false,
      structform: {
        resource: 1,
        identifier: '',
        type: 'INT',
        startnumber: '',
        endnumber: '',
        step: '',
        true: '',
        truevalue: 1,
        false: '',
        falsevalue: 0,
        isread: 'r',
        unit: '',
        date: 'String类型的UTC时间戳 (毫秒)',
        string: '',
        specs: [],
        dis: '0X10',
        dinumber: 'null',
        das: [],
      },
      tableData: [],
      activeName: 'first',
      // activeName: 'third', //'customize',
      form: {
        Productname: '',
        ProductKey: '',
        ProductAll: 0,
        data: {},
      },
      ProductSecret: '',
      dynamicReg: false,
      dialog_address: false,
      productId: '',
      productName: '',
      productdetail: {
        config: {
          address: '余杭区良渚平高创业城c1座',
          location: {
            longitude: '120.161324',
            latitude: '30.262441',
          },
        },
        thing: { properties: [], events: [], services: [], tags: [] },
      },
      topicData: [],
      topicDefault: {},
      topic: [
        {
          topic: '$dg/user/${deviceid}/post',
          type: 'sub',
          desc: '设备属性上报',
          isdef: true,
        },
        {
          topic: '$dg/thing/${deviceid}/',
          type: 'pub',
          desc: '消息下发',
          isdef: true,
        },
      ],
      isshow: true,
      isstorage: true,
      isaccumulate: false,
      addRules: {
        name: [
          {
            required: true,
            message: '请输入协议名称',
            trigger: 'blur',
          },
          {
            validator: validCode,
            trigger: 'blur',
          },
        ],
      },
      dialogTableVisible: false,
      gridData: [],
      formInline: {
        name: '',
        version: '',
        desc: '',
        resource: false,
      },
      // objectId: '',
      option: [],
      CategoryKey: '',
      productstart: 0,
      productlength: 10,
      producttotal: 0,
      wmxstart: 1,
      wmxPageSize: 10,
      eventsStart: 1,
      eventsPageSize: 10,
      servicesStart: 1,
      servicesPageSize: 10,
      tagsStart: 1,
      tagsPageSize: 10,
      wmxtotal: 20,
      wmxData: [],
      wmxDataBk: [],
      editorList: [],
      topicKey: '',
      refreshFlag: '99',
      msgList: [],
      submessage: '',
      mqtt: {
        router: '',
        subtopic: '',
        pubtopic: '',
      },
      warningeditror: [],
      channellength: 20,
      channelstart: 0,
      channeltotal: 0,
      isupdatedstruct: -1,
      issub: false,
      subtimer: null,
      subdialog: false,
      channelid: '',
      channelInfo: [],
      textarea: '',
      subdialogtimer: null,
      subdialogid: '',
      subaction: 'stop',
      channelname: '',
      value4: true,
      // 规则配置
      rulepagesize: 10,
      rulestart: 0,
      ruletotal: 0,
      engineData: [],
      // 物存储型式
      channeltype: 0,
      resourcechannelData: [],
      resourcestart: 0,
      resourcelength: 10,
      resourcetotal: 0,
      // 自定义模型模板
      resourcedialogFormVisible: false,
      resourceform: {},
      resourcechannelid: '',
      isreload: 1,
      modifyIndex: -1,
      ace_editor: '',
      iframeShow: false,
      atbas: {
        visible: false,
        childrenDrawer: false,
      },
      editIndex: -1,
      eventType: 'add',
      formType: 'output',
      thingType: 'events',
      eventForm: {},
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      amisShow: true,
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' },
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change',
          },
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change',
          },
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' },
        ],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
      },
      filelist: [],
      listLoading: false,
      detailView: false,
      ViewLoading: false,
      detailinfo: {},
      inputParams: {},
      fileParams: { scene: 'app' },
    }
  },
  computed: {
    treeData() {
      const cloneData = JSON.parse(JSON.stringify(this.option)) // 对源数据深度克隆
      // dgiotlog.log("cloneData", cloneData)
      return cloneData.filter((father) => {
        const branchArr = cloneData.filter(
          (child) => father.id == child.parentid
        ) // 返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
        return father.parentid == 0 // 返回第一层
      })
    },
    showNewItem() {
      if (this.sizeForm && this.sizeForm.protocol == 'modbus') {
        return true
      } else {
        return false
      }
    },
    ...mapGetters({
      sizeForm: 'konva/sizeForm',
    }),
  },
  watch: {
    issub: {
      deep: true,
      handler(val) {
        this.subtimer = window.setInterval(() => {
          this.subAce('formInline', false)
        }, 5000)
      },
    },
  },
  mounted() {
    this.query_notification()
    this.getAllunit()
    this.getDefaultTopic()
    this.$nextTick(() => {
      this.$refs._tabs.$children[0].$refs.tabs[3].style.display = 'none'
      this.mqtt.router = this.$dgiotBus.router(this.$route.fullPath)
    })
    this.Industry()
    this.getAllunit()
    // editor编辑器使用
    editor2 = ace.edit('editor2')
    editor2.session.setMode('ace/mode/text') // 设置语言
    editor2.setTheme('ace/theme/monokai') // 设置主题
    editor2.setReadOnly(true)
    editor2.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true, // 设置自动提示
    })
    if (this.$route.query.id) {
      let id = this.$route.query.id
      this.fileParams.path = `product/${id}`
      this.get_filelist(`dgiot_file/product/${id}`) //dgiot_file/file  ///`product/${id}`
    }
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
    if (this.$route.query.id) this.queryProductInfo(this.$route.query.id) // 获取产品信息
  },
  beforeDestroy() {
    window.clearInterval(this.subtimer)
    this.subtimer = null
    window.clearInterval(this.subdialogtimer)
    this.subdialogtimer = null
  },
  methods: {
    uploadCkick() {
      this.loading = true
      // 触发子组件的点击事件
      this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
        new MouseEvent('click')
      )
      let id = this.$route.query.id
      this.inputParams = {
        file: '',
        scene: this.fileParams.scene ? this.fileParams.scene : 'default',
        path: this.fileParams.path ? this.fileParams.path : 'default',
        filename: moment(new Date()).valueOf().toString(),
      }
    },
    fileInfo(info) {
      this.listLoading = true
      let id = this.$route.query.id
      if (info.url) {
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'success',
          message: '上传成功',
        })
        this.get_filelist(`dgiot_file/product/${id}`)
      } else {
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'error',
          message: '上传失败',
        })
      }
      this.listLoading = false
    },
    get_fileinfo(row) {
      this.detailView = true
      this.ViewLoading = true
      file_info('files/' + row.path + '/' + row.name).then((res) => {
        this.detailinfo = {}
        if (res.data) {
          this.detailinfo = res.data
          this.detailinfo.url =
            this.$FileServe + '/' + row.path + '/' + row.name
        }
        this.ViewLoading = false
      })
    },
    delete_file(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delete_file('files/' + row.path + '/' + row.name)
            .then((res) => {
              if (res.status == 'ok') {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: 'success',
                  message: '删除成功',
                })
                this.get_filelist(row.path)
              } else {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: 'error',
                  message: res.message,
                })
              }
            })
            .catch(() => {
              this.$message({
                showClose: true,
                duration: 2000,
                type: 'error',
                message: '删除失败',
              })
            })
        })
        .catch(() => {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    download_file(row) {
      window.open(this.$FileServe + '/' + row.path + '/' + row.name)
    },
    files(file) {
      this.inputParams.filename = file.name
      this.inputParams.file = file
    },
    //获取文件列表
    get_filelist(path) {
      this.listLoading = true
      list_dir(path).then((res) => {
        if (res.status == 'ok') {
          this.filelist = res.data
        } else {
          this.filelist = []
        }
        this.listLoading = false
      })
    },
    async blurinterval(productdetail) {
      await putProduct(productdetail.objectId, {
        config: productdetail.config,
      })
      this.$message({
        message: '物模型缓存延时修改成功',
        type: 'success',
        showClose: true,
        duration: 1500,
      })
    },
    async handleAddressClose() {
      this.dialog_address = !this.dialog_address
      await putProduct(this.productObj.objectId, {
        config: this.productdetail.config,
      })
      this.$message({
        type: 'success',
        message: '安装位置更新成功',
        showClose: true,
        duration: 2000,
      })
    },
    inputAddress() {
      const address = this.productdetail.config.address
      // https://lbsyun.baidu.com/jsdemo.htm#wAddressParseSingle  根据位置解析
      var map = new BMapGL.Map('container')
      map.centerAndZoom(new BMapGL.Point(116.331398, 39.897445), 12)
      //创建地址解析器实例
      var myGeo = new BMapGL.Geocoder()
      // 将地址解析结果显示在地图上，并调整地图视野
      myGeo.getPoint(
        address,
        function (point) {
          if (point) {
            map.centerAndZoom(point, 16)
            map.addOverlay(new BMapGL.Marker(point, { title: address }))
          } else {
            alert('您选择的地址没有解析到结果！')
          }
        },
        '北京市'
      )
    },
    mapClick(e) {
      this.productdetail.config.location = {
        latitude: e.point.lat,
        longitude: e.point.lng,
      }
      const geocoder = new BMap.Geocoder() // 创建地址解析器的实例
      geocoder.getLocation(e.point, (rs) => {
        this.productdetail.config.address = rs.address
      })
    },
    toggleSwitch(row) {
      row.isshow = !row.isshow
      this.preserve('isshow')
    },
    toggleStore(row) {
      row.isstorage = !row.isstorage
      this.preserve('isstorage')
    },
    thingParameters(form, index, type) {
      this.editIndex = index
      // 向events 的 outputData 添加 输出参数
      this.modules.data[type].data.output.push(form)
      this.atbas.childrenDrawer = false

      // outputParams
      // this.onChildrenDrawerClose()
    },
    editParameters(form, type) {
      // 向events 的 outputData 添加 输出参数
      this.modules[type].data.output[this.editIndex] = form
      this.atbas.childrenDrawer = false

      // outputParams
      // this.onChildrenDrawerClose()
    },
    showDrawer() {
      this.atbas.visible = true
    },
    onClose() {
      this.atbas.visible = false
    },
    showChildrenDrawer() {
      this.eventForm = {
        name: '',
        unit: '/',
        isread: 'rw',
        dataType: 'int32',
        identifier: '',
        min: '',
        max: '',
        step: '',
      }
      this.eventType = 'add'
      this.atbas.childrenDrawer = true
    },
    onChildrenDrawerClose() {
      this.atbas.childrenDrawer = false
      //  清空子组件的规则校验和表单数据
      // this.$refs.thingForm.resetForm('ruleForm')
      console.log('清空子组件的规则校验和表单数据')
    },
    basicMethod({ column, rowIndex }) {
      return this.mergeObj.basic[column.property][rowIndex]
        ? {
            rowspan: this.mergeObj.basic[column.property][rowIndex],
            colspan: 1,
          }
        : {
            rowspan: 0,
            colspan: 0,
          }
    },
    thingMethod({ column, rowIndex }) {
      return this.mergeObj.basic[column.property][rowIndex]
        ? {
            rowspan: this.mergeObj.basic[column.property][rowIndex],
            colspan: 1,
          }
        : {
            rowspan: 0,
            colspan: 0,
          }
    },
    async editEvent(item, index, type) {
      this.editIndex = index
      this.atbas.childrenDrawer = true
      this.eventForm = item
      this.eventType = 'edit'
      this.formType = type
    },
    async getDefaultTopic() {
      const res = await getDlinkJson('Topic')
      const { UnifyUnitSpecsDTO = [] } = await getDlinkJson('Unit')
      this.dlinkUnit = UnifyUnitSpecsDTO
      this.dlinkUnit.unshift({ Symbol: '/', Name: '无' })
      this.dlinkTopic = res
      for (var k in this.dlinkTopic) {
        await this.mergeTable(k, this.dlinkTopic[k])
      }
      // dgiotlogger.error('mergeObj', this.mergeObj)
    },
    async topicChange(e) {
      if (e == 'user') await this.getTopic()
    },
    async mergeTable(lable, table) {
      let numerical = 0
      for (let key in table[0]) {
        this.mergeObj[lable][key] = []
        table.forEach((item, index) => {
          if (index === 0) {
            this.mergeObj[lable][key].push(1)
          } else {
            if (item[key] === table[index - 1][key]) {
              this.mergeObj[lable][key][numerical] += 1
              this.mergeObj[lable][key].push(0)
            } else {
              numerical = index
              this.mergeObj[lable][key].push(1)
            }
          }
        })
      }
    },
    clearfix(type) {
      this.$refs[type].clearValidate()
      type == 'services'
        ? this.$refs.services.resetFields()
        : this.$refs.events.resetFields()
      this.modules.events.data.types = 'info'
      this.modules.services.data.transfer = 'sync'
    },
    editModus(row) {
      this.modules[`${row.type}`].data = row
      this.modules.type = row.type
      this.modules.visible = true
      this.modules.disabled = true
      dgiotlogger.info('editModus', row, this.modules[`${row.type}`])
    },
    deleteModus(index, expand, row) {
      this.$baseConfirm(
        this.$translateTitle(
          'Maintenance.Are you sure you want to delete the current item'
        ),
        null,
        async () => {
          expand.splice(index, 1)
          await this.saveExpand(this.productObj.thing)
          // this.$baseMessage(
          //   this.$translateTitle('Maintenance.successfully deleted'),
          //   'success',
          //   'dgiot-hey-message-success'
          // )
        }
      )
    },
    handleClose() {
      this.modules.type == 'events'
        ? this.$refs.events.clearValidate() && this.$refs.events.resetFields()
        : ''
      this.modules.type == 'services'
        ? this.$refs.services.clearValidate() &&
          this.$refs.services.resetFields()
        : ''
      this.modules.events.data.types = 'info'
      this.modules.services.data.transfer = 'sync'
      this.modules.visible = false
      if (this.modules.disabled) this.saveExpand(this.productObj.thing)
    },
    async saveExpand(_thing) {
      const res = await putProduct(this.productObj.objectId, {
        thing: _thing,
      })
      if (res.updatedAt) {
        this.$message({
          type: 'success',
          message: '更新成功',
          showClose: true,
          duration: 2000,
        })
      } else {
        this.$message({
          type: 'warning',
          message: '更新失败' + res.msg,
          showClose: true,
          duration: 2000,
        })
      }
    },
    async queryProductInfo(productId) {
      const res = await getProduct(productId)
      localStorage.setItem('parse_productid', productId)
      let { thing = { properties: [], events: [], services: [], tags: [] } } =
        res
      _.merge({ properties: [], events: [], services: [], tags: [] }, thing)
      let setThing = _.merge(
        { properties: [], events: [], services: [], tags: [] },
        thing
      )
      this.productObj = res
      let config = { ...this.productdetail.config, ...res.config }
      this.$set(this.productdetail, 'thing', this.productObj.thing)
      this.$set(this.productdetail, 'config', this.productObj.config)
      // this.productdetail.config = config
      this.modules.data = setThing //setThing
      // this.productdetail.thing = setThing //setThing
      // this.productdetail.config = res.config
    },
    async submitModules(type, form) {
      form.data.outputParams = []
      // 计算输出参数
      form.data.output.forEach((o, index) => {
        form.data.outputParams.push({
          identifier: o.identifier,
          index: index,
        })
      })
      const _item = {
        ...form.data,
        devicetype: form.data.name,
        required: false,
        isshow: true,
        isstorage: true,
        isaccumulate: false,
        dataForm: { order: moment(new Date()).format('x') },
        dataType: {
          type: type,
        },
        moduleType: type,
        updateAt: moment(new Date()).format('x'),
      }
      window._item = _item
      await this.submitForm(_item)
      this.atbas.visible = false
      await this.queryProductInfo(this.$route.query.id)
      return false
      const { thing } = this.productObj
      dgiotlogger.log(this.productObj, thing, this.modules.data)
      dgiotlogger.info('this.modules.data')
      this.$refs[type].validate(async (valid) => {
        if (valid) {
          this.modules.data.events.push(_item)
          const res = await putProduct(this.productObj.objectId, {
            thing: this.modules.data,
          })
          if (res.updatedAt) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'success',
              message: '新增成功',
            })
          } else {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'warning',
              message: '新增失败' + res.msg,
            })
          }
          this.$refs[type].clearValidate()
          this.$refs[type].resetFields()
          this.atbas.visible = false
          this.modules.visible = false
          // await this.queryProductInfo(this.productObj.objectId) // 更新产品信息
          this.handleClose()
        } else {
          return false
        }
      })
    },
    feateditorParser1(config, type, flag) {
      let productInfo = this.productInfo
      this.parserType = type
      this.$baseEventBus.$emit('profileDialog', {
        config,
        type,
        flag,
        productInfo,
      })
      // this.codeFlag = false
    },
    ...mapMutations({
      setSizeForm: 'konva/setSizeForm',
    }),
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    selectStruct(v) {
      // dgiotlog.log(v);
    },
    toggleList() {
      this.showList = !this.showList
    },
    getFormOrginalData() {
      return {
        devicetype: this.devicetype,
        strategy: '20',
        resource: 1,
        identifier: '',
        dis: '0X10',
        dinumber: 'null',
        type: 'int',
        startnumber: '',
        endnumber: '',
        step: '',
        true: '',
        truevalue: 1,
        false: '',
        falsevalue: 0,
        isread: 'r',
        isshow: true,
        isstorage: true,
        isaccumulate: false,
        unit: '',
        string: '',
        date: 'String类型的UTC时间戳 (毫秒)',
        specs: {},
        precision: 3,
        round: 'all',
        struct: [
          {
            attribute: '',
            attributevalue: '',
          },
        ],
        das: [],
        daslist: [],
        rate: 1,
        offset: 0,
        order: 0,
        protocol: 'normal',
        operatetype: 'readCoils',
        originaltype: 'short16_AB',
        slaveid: '0X10',
        collection: '%s',
        control: '%d',
        nobound: [],
        editdatatype: false,
        iscount: '0',
        countstrategy: 20,
        countround: 'all',
        countcollection: '%s',
      }
    },
    changeValue(formName) {
      this.$refs[formName].validateField('startnumber', (errMsg) => {
        if (errMsg) {
          return false
        } else {
        }
      })
    },
    changeStructValue(formName) {
      this.$refs[formName].validateField('startnumber', (errMsg) => {
        if (errMsg) {
          return false
        } else {
        }
      })
    },
    // 判断是否为结构体，可展开
    getRowClass(row, rowIndex) {
      if (row.row.dataType.type != 'struct') {
        // 判断当前行是否有子数据
        return 'row-expand-cover'
      }
    },
    getChannelEnable(row, rowIndex) {
      if (row.row.isEnable == true) {
        return 'green_active'
      } else {
        return 'red_active'
      }
    },
    async handleChildClick(e) {
      await this.queryProductInfo(this.$route.query.id)
      const {
        properties = [],
        events = [],
        services = [],
        tags = [],
      } = this.productObj.thing
      switch (e.name) {
        case 'properties':
          this.modules.data.properties = properties || []
          break
        case 'events':
          this.modules.data.events = events || []
          break
        case 'services':
          this.modules.data.services = services || []
          break
        case 'tags':
          this.modules.data.tags = tags || []
          break
        default:
          break
      }
      dgiotlogger.info(this.modules.data)
    },
    handleClick(val) {
      switch (val.name) {
        case 'view':
          this.viewForm = {
            class: 'Product',
            // type: 'amis',
            key: this.$route.query.id || '',
            title: '',
            disabled: true,
            data: {
              type: 'page',
              initApi: {
                url: 'iotapi/classes/Device/parse_objectid',
                method: 'get',
                adaptor:
                  'return {\r\n  "status":0,\r\n  "msg":"",\r\n  "data":response.data.basedata\r\n  }',
                headers: {
                  store: 'localStorage',
                  dgiotReplace: 'parse_objectid',
                },
                dataType: 'json',
              },
              body: [
                {
                  type: 'form',
                  api: {
                    method: 'put',
                    url: 'iotapi/classes/Device/parse_objectid',
                    headers: {
                      store: 'localStorage',
                      dgiotReplace: 'parse_objectid',
                    },
                    dataType: 'json',
                    requestAdaptor:
                      'return {\r\n    ...api,\r\n    data: {\r\n        basedata:{ ...api.data}\r\n    }\r\n}',
                  },
                  body: [
                    {
                      type: 'input-text',
                      label: '设备名称',
                      name: 'name',
                    },
                  ],
                },
              ],
            },
            hiddenRow: [],
          }
          break
        case 'notification':
          this.viewForm = {
            showRow: true,
            class: 'Product',
            type: 'notification',
            key: this.$route.query.id,
            title: '',
            notification: true,
            disabled: true,
            data: {
              type: 'page',
              initApi: {
                url: 'iotapi/classes/Device/parse_objectid',
                method: 'get',
                adaptor:
                  'return {\r\n  "status":0,\r\n  "msg":"",\r\n  "data":response.data.basedata\r\n  }',
                headers: {
                  store: 'localStorage',
                  dgiotReplace: 'parse_objectid',
                },
                dataType: 'json',
              },
              body: [
                {
                  type: 'form',
                  api: {
                    method: 'put',
                    url: 'iotapi/classes/Device/parse_objectid',
                    headers: {
                      store: 'localStorage',
                      dgiotReplace: 'parse_objectid',
                    },
                    dataType: 'json',
                    requestAdaptor:
                      'return {\r\n    ...api,\r\n    data: {\r\n        basedata:{ ...api.data}\r\n    }\r\n}',
                  },
                  body: [
                    {
                      type: 'input-text',
                      label: '设备名称',
                      name: 'name',
                    },
                  ],
                },
              ],
            },
            hiddenRow: ['class', 'key', 'createdAt'],
          }
          break
        case 'fiveth':
          this.getProductChannel()
          break
        case 'second':
          this.getTopic()
          break
        case 'seven':
          this.getResourceChannel()
          break
        case 'sixeth':
          this.orginRule()
          break
        case 'eighth':
          this.isreload++
          break
        default:
          window.clearInterval(this.subtimer)
          this.subtimer = null
          break
      }
    },
    async getAllunit() {
      this.allunit = []
      const { UnifyUnitSpecsDTO = [] } = await getDlinkJson('Unit')
      this.allunit = UnifyUnitSpecsDTO
    },
    async getTopic() {
      this.topicData = []
      this.topicDefault = {}
      const { topics = {} } = await getProduct(this.productId)
      this.topicDefault = topics
      for (let i in topics) {
        let obj = {}
        for (let j in this.dlinkTopic.basic) {
          this.dlinkTopic.basic[j].info = 'basic'
          if (this.dlinkTopic.basic[j].id === i) {
            obj = this.dlinkTopic.basic[j]
          }
        }
        for (let j in this.dlinkTopic.thing) {
          this.dlinkTopic.thing[j].info = 'thing'
          if (this.dlinkTopic.thing[j].id === i) {
            obj = this.dlinkTopic.thing[j]
          }
        }
        obj.name = i
        obj.value = topics[i]
        this.topicData.push(obj)
      }
    },
    /**
     * @description 导出产品
     * @param
     * @returns
     */
    async exportProduct(productName) {
      try {
        const params = {
          name: productName,
        }
        const loading = this.$baseColorfullLoading()
        const res = await downBinary('iotapi/product', params)
        dgiotlog.log(res)
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'dgiot-hey-message-success'
        )
        loading.close()
        this.$downBinary(res)
      } catch (error) {
        dgiotlog.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'dgiot-hey-message-error'
        )
      }
    },
    /**
     * @Author: h7ml
     * @Date: 2021-10-08 19:24:33
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async seeDecoder(decoder) {
      try {
        this.ace_editor = Base64.decode(decoder.code)
      } catch (error) {
        dgiotlog.log(error)
      }
    },
    /**
     * @Author: h7ml
     * @Date: 2021-10-08 15:41:23
     * @Description: 设为产品模板
     * @param productInfo
     * @return {Promise<void>}
     * @document http://prod.iotn2n.com/swagger/#/ProductTemplet/post_classes_producttemplet
     */
    async setTemplate(productInfo) {
      const loading = this.$baseColorfullLoading()
      const {
        category = 'IotHub',
        config = {
          konva: {
            Stage: {
              attrs: {
                x: 14,
                y: 29,
                id: 'container',
                width: 1635,
                height: 767,
                container: 'container',
                draggable: true,
              },
              children: [
                {
                  attrs: {
                    id: 'Layer_5SKeJT',
                  },
                  children: [
                    {
                      attrs: {
                        id: 'Group_RoT',
                        width: 2000,
                        height: 2000,
                      },
                      children: [],
                      className: 'Group',
                    },
                    {
                      attrs: {
                        id: 'Group_QtGicp',
                        draggable: true,
                      },
                      children: [
                        {
                          attrs: {
                            x: 10,
                            y: 15,
                            id: '#dgiot-quanyizhongxinbeifen-0-1630891418339',
                            data: 'M73.142857 0h877.714286v877.714286H73.142857z',
                            fill: '#FFFFFF',
                            angle: -30,
                            scaleX: 0.15,
                            scaleY: 0.15,
                            originX: 'center',
                            originY: 'bottom',
                            className: 'Path',
                          },
                          className: 'Path',
                        },
                        {
                          attrs: {
                            x: 10,
                            y: 15,
                            id: '#dgiot-quanyizhongxinbeifen-1-1630891418339',
                            data: 'M877.714286 137.142857A27.428571 27.428571 0 0 1 905.142857 164.571429v201.142857a27.428571 27.428571 0 0 1-27.428571 27.428571l-3.017143 0.091429A45.714286 45.714286 0 0 0 877.714286 484.571429l2.633143 0.128A27.428571 27.428571 0 0 1 905.142857 512v201.142857a27.428571 27.428571 0 0 1-27.428571 27.428572H146.285714A27.428571 27.428571 0 0 1 118.857143 713.142857V512A27.428571 27.428571 0 0 1 146.285714 484.571429l2.998857-0.091429A45.714286 45.714286 0 0 0 146.285714 393.142857l-2.651428-0.128A27.428571 27.428571 0 0 1 118.857143 365.714286V164.571429A27.428571 27.428571 0 0 1 146.285714 137.142857z m-296.100572 138.185143l-69.266285 69.284571-69.266286-69.284571-38.784 38.802286 58.258286 58.258285H402.285714v54.857143h82.285715v39.186286H402.285714v54.857143h82.285715v66.614857h54.857142v-66.614857H621.714286v-54.857143h-82.285715v-39.186286H621.714286v-54.857143h-59.574857l58.276571-58.258285-38.802286-38.802286z',
                            fill: '#111111',
                            angle: -30,
                            scaleX: 0.15,
                            scaleY: 0.15,
                            originX: 'center',
                            originY: 'bottom',
                            className: 'Path',
                          },
                          className: 'Path',
                        },
                      ],
                      className: 'Group',
                    },
                  ],
                  className: 'Layer',
                },
              ],
              className: 'Stage',
            },
          },
          parser: [],
          profile: [],
          basedate: {},
        },
        decoder = {
          code: '',
        },
        desc = '',
        icon = '',
        name = '',
        netType = 'Modbus',
        nodeType = 0,
        thing = {
          properties: [],
        },
      } = productInfo
      try {
        const ACL = {}
        ACL['*'] = {
          read: true,
          write: true,
        }
        const params = {
          ACL,
          category,
          config,
          decoder,
          desc,
          icon,
          name,
          netType,
          nodeType,
          thing,
        }
        const res = await postProductTemplet(params)
        dgiotlog.log(res)
        if (res) {
          this.$baseMessage(
            this.$translateTitle('user.Save the template successfully'),
            'success',
            'dgiot-hey-message-success'
          )
        } else {
          this.$baseMessage(
            this.$translateTitle('user.Save the template error'),
            'error',
            'dgiot-hey-message-error'
          )
        }
        loading.close()
      } catch (error) {
        dgiotlog.log(error)
        loading.close()
        this.$baseMessage(
          this.$translateTitle('user.Save the template error'),
          'error',
          'dgiot-hey-message-error'
        )
      }
    },
    // 热加载弹窗
    async updatesubdialog() {
      this.protoldialog = true
      const type = '1'
      const product = {
        __type: 'Pointer',
        className: 'Product',
        objectId: this.productId,
      }
      getChannelCountByProduct(
        this.channellength,
        this.channelstart,
        product,
        type
      )
        .then((res) => {
          this.protolchannel = res.results
          this.$refs.multipleTable.toggleAllSelection()
        })
        .catch((err) => {
          dgiotlog.log(err)
          this.$baseMessage('请求出错', err.error, 3000)
        })
    },
    // 通道全选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    updateAllChannel() {
      if (this.multipleSelection.length == 0) {
        this.protoldialog = false
      } else {
        var arr = []
        this.multipleSelection.map((item) => {
          arr.push(
            new Promise((reslove, reject) => {
              return subupadte(item.objectId, 'update')
                .then((resultes) => {
                  if (resultes) {
                    reslove(resultes)
                  }
                })
                .catch((error) => {
                  reject(error)
                })
            })
          )
        })
        Promise.all(arr)
          .then((data) => {
            this.$message({
              showClose: true,
              duration: 2000,
              message: '热加载成功',
              type: 'success',
            })
            if (data.length == this.multipleSelection.length) {
              this.protoldialog = false
            }
          })
          .catch((error) => {
            this.$message({
              showClose: true,
              duration: 2000,
              message: error,
              type: 'error',
            })
          })
      }
    },

    // 物接入选择通道
    showAllChannel(label = '') {
      dgiotlog.log(this.allChannelstart, this.allChannellength)
      this.allChanneltotal = 0
      this.allchannelData = []
      this.channeltype = 1
      this.innerVisible = true
      const type = { $in: ['1', '3'] }
      const product = {
        $ne: {
          __type: 'Pointer',
          className: 'Product',
          objectId: this.productId,
        },
      }
      getChannelCountByProduct(
        label != '' ? this.allChannellength : this.channellength,
        label != '' ? this.allChannelstart : this.channelstart,
        product,
        type
      )
        .then((res) => {
          this.allChanneltotal = res.count
          this.allchannelData = res.results
        })
        .catch((e) => {
          dgiotlog.log(e)
        })
    },
    // 物接入
    getProductChannel() {
      const type = { $in: ['1', '3'] }
      const product = {
        __type: 'Pointer',
        className: 'Product',
        objectId: this.productId,
      }
      getChannelCountByProduct(
        this.channellength,
        this.channelstart,
        product,
        type
      )
        .then((res) => {
          this.channeltotal = res.count
          this.channelData = res.results
          if (res.results.length == 0) {
            isallchannel = true
          } else {
            isallchannel = false
          }
        })
        .catch((e) => {
          dgiotlog.log(e)
        })
    },

    // 物存储选择通道
    resourceShowAllChannel() {
      this.allChanneltotal = 0
      this.allchannelData = []
      this.channeltype = 0
      this.innerVisible = true
      const type = { $in: ['2'] }
      const product = {
        $ne: {
          __type: 'Pointer',
          className: 'Product',
          objectId: this.productId,
        },
      }
      getChannelCountByProduct(
        this.channellength,
        this.channelstart,
        product,
        type
      )
        .then((res) => {
          this.allChanneltotal = res.count
          this.allchannelData = res.results
        })
        .catch((e) => {
          dgiotlog.log(e)
        })
    },

    // 物存储
    getResourceChannel() {
      const type = { $in: ['2'] }
      const product = {
        __type: 'Pointer',
        className: 'Product',
        objectId: this.productId,
      }
      getChannelCountByProduct(
        this.channellength,
        this.channelstart,
        product,
        type
      )
        .then((res) => {
          this.resourcetotal = res.count
          this.resourcechannelData = res.results
        })
        .catch((e) => {
          dgiotlog.log(e)
        })
    },

    // 添加关联
    async addProductChannel(id) {
      const params = {
        product: {
          __op: 'AddRelation',
          objects: [
            {
              __type: 'Pointer',
              className: 'Product',
              objectId: this.productId,
            },
          ],
        },
      }
      const res = await saveChanne(id, params)
      if (res) {
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'success',
          message: '添加成功',
        })
        if (this.channeltype == 1) {
          this.showAllChannel()
          this.getProductChannel()
        } else {
          this.resourceShowAllChannel()
          this.getResourceChannel()
        }
      }
    },
    // 移除通道
    deleteRelation(row) {
      const params = {
        product: {
          __op: 'RemoveRelation',
          objects: [
            {
              __type: 'Pointer',
              className: 'Product',
              objectId: this.productId,
            },
          ],
        },
      }
      saveChanne(row.objectId, params).then((res) => {
        if (res) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'success',
            message: '移除成功',
          })
        }
        this.getProductChannel()
        this.getResourceChannel()
      })
    },
    // 关联服务通道分页
    channelSizeChange(val) {
      this.channellength = val
      this.getProductChannel()
    },
    channelCurrentChange(val) {
      this.channelstart = (val - 1) * this.channellength
      this.getProductChannel()
    },
    // 资源通道关联
    resourcechannelSizeChange(val) {
      this.resourcelength = val
      this.getResourceChannel()
    },
    resourcechannelCurrentChange(val) {
      this.resourcestart = (val - 1) * this.resourcelength
      this.getResourceChannel()
    },

    allChannelSizeChange(val) {
      this.allChannellength = val
      this.showAllChannel('Channel')
    },
    allChannelCurrentChange(val) {
      this.allChannelstart = (val - 1) * this.allChannellength
      this.showAllChannel('Channel')
    },

    // 自定义模型弹窗
    customize(row) {
      this.resourcedialogFormVisible = true
      this.resourcechannelid = row.objectId
      // for (var key in row.config) {
      //   channelrow[key] = row.config[key];
      // }
      channelrow = JSON.parse(JSON.stringify(row.config))
      // dgiotlog.log(row,channelrow)
      setTimeout(() => {
        editormodel = ace.edit('editormodel')
        editormodel.session.setMode('ace/mode/json') // 设置语言
        editormodel.setTheme('ace/theme/twilight') // 设置主题
        editormodel.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true, // 设置自动提示
        })
        editormodel.setReadOnly(true)
        editormodel.setValue(JSON.stringify(this.productdetail.thing, null, 4))
        // 物建表
        editorcreate = ace.edit('editorcreate')
        editorcreate.session.setMode('ace/mode/mysql') // 设置语言
        editorcreate.setTheme('ace/theme/twilight') // 设置主题
        editorcreate.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true, // 设置自动提示
        })
        if (row.config.datamodel && row.config.datamodel != '') {
          editorcreate.setValue(row.config.datamodel)
        } else {
          editorcreate.setValue(`{
            "vars":{
              "database":"aosong",
              "stable":"meter",
              "value":[
                {
                  "timestamp":"TIMESTAMP",
                  "bytes":8
                },
                {
                  "temperature":"FLOAT",
                  "bytes":4
                },
                {
                  "humidity":"FLOAT",
                  "bytes":4
                }
              ],
              "tags":[
                {
                  "devaddr":"BINARY",
                  "bytes":12
                }
              ],
              "table":"devaddr",
              "keep":3650
            },
            "sql":{
              "create_database":"CREATE DATABASE IF NOT EXISTS \${database} KEEP \${keep}",
              "drop_database":"DROP DATABASE IF EXISTS \${database}",
              "creat_stable":"CREATE TABLE IF NOT EXISTS \${database}.\${stable} (\${timestamp} TIMESTAMP, temperature FLOAT, humidity FLOAT) TAGS(devaddr BINARY[12]);",
              "drop_stable":"DROP TABLE \${database}.\${stable}",
              "insert_stable":"INSERT INTO \${database}.\${table} USING \${database}.\${stable} TAGS (\${devaddr}) VALUES (\${temperature}, \${humidity})",
              "insert_table":"INSERT INTO \${database}.\${table} VALUES (\${temperature}, \${humidity})",
              "create_table":"CREATE TABLE \${databas}.\${table} USING \${database}.\${stable} TAGS (\${devaddr});"
            }
          }`)
        }
        // 物存储

        // 子表
        //   editorsubtable = ace.edit("editorsubtable");
        //   editorsubtable.session.setMode("ace/mode/mysql"); // 设置语言
        //   editorsubtable.setTheme("ace/theme/gob"); // 设置主题
        //   editorsubtable.setOptions({
        //     enableBasicAutocompletion: true,
        //     enableSnippets: true,
        //     enableLiveAutocompletion: true // 设置自动提示
        //   });
        //   if(row.config.subtable){
        //     editorsubtable.setValue(row.config.subtable)
        //   }else{
        //     editorsubtable.setValue('')
        //   }
      })
    },
    questionModel() {
      setTimeout(() => {
        editorinsert = ace.edit('editorinsert')
        editorinsert.session.setMode('ace/mode/mysql') // 设置语言
        editorinsert.setTheme('ace/theme/gob') // 设置主题
        editorinsert.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true, // 设置自动提示
        })
        editorinsert.setValue(`{
          "vars":{
            "database":"database",
            "table":"stable",
            "value":[
              {
                "timestamp":"TIMESTAMP",
                "bytes":8
              },
              {
                "int":"INT",
                "bytes":4
              },
              {
                "bigint":"BIGINT",
                "bytes":8
              },
              {
                "float":"FLOAT",
                "bytes":4
              },
              {
                "double":"DOUBLE",
                "bytes":8
              },
              {
                "binary":"BINARY",
                "bytes":"自定义"
              },
              {
                "smallint":"SMALLINT",
                "bytes":2
              },
              {
                "tinyint":"TINYINT",
                "bytes":1
              },
              {
                "bool":"BOOL",
                "bytes":1
              },
              {
                "nchar":"NCHAR",
                "bytes":"自定义"
              }
            ],
            "tags":[
              {
                "int":"INT",
                "bytes":4
              },
              {
                "bigint":"BIGINT",
                "bytes":8
              },
              {
                "float":"FLOAT",
                "bytes":4
              },
              {
                "double":"DOUBLE",
                "bytes":8
              },
              {
                "binary":"BINARY",
                "bytes":"自定义"
              },
              {
                "smallint":"SMALLINT",
                "bytes":2
              },
              {
                "tinyint":"TINYINT",
                "bytes":1
              },
              {
                "bool":"BOOL",
                "bytes":1
              },
              {
                "nchar":"NCHAR",
                "bytes":"自定义"
              }
            ]
          },
          "sql":{
            "create_database":"CREATE DATABASE IF NOT EXISTS {{database}} KEEP {{keep}}",
            "drop_database":"DROP DATABASE IF EXISTS {{database}}",
            "creat_stable":"CREATE TABLE IF NOT EXISTS {{database}}.{{stable}} ({{timestamp}} TIMESTAMP, temperature FLOAT, humidity FLOAT) TAGS(devaddr BINARY[12]);",
            "drop_stable":"DROP TABLE {{database}}.{{stable}}",
            "insert_stable":"INSERT INTO {{database}}.{{table}} USING {{database}}.{{stable}} TAGS ({{devaddr}}) VALUES ({{temperature}}, {{humidity}})",
            "insert_table":"INSERT INTO {{database}}.{{table}} VALUES ({{temperature}}, {{humidity}})",
            "create_table":"CREATE TABLE {{database}}.{{table}} USING {{database}}.{{stable}} TAGS ({{devaddr}});"
          }
        }`)
      })
    },
    // 添加自定义模型
    async addData() {
      // dgiotlog.log(channelrow)
      channelrow.datamodel = editorcreate.getValue()
      const params = {
        config: channelrow,
      }
      await putChannel(this.rproductdetailesourcechannelid, params)
      this.$message('添加成功')
    },
    closeWuDialog() {
      this.resourcedialogFormVisible = false

      this.resourcechannelid = ''
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
    removeDomain1(item) {
      var index = this.structform.specs.indexOf(item)
      if (index !== -1) {
        this.structform.specs.splice(index, 1)
      }
    },
    addDomain1() {
      this.structform.specs.push({
        value: '',
        name: '',
      })
    },
    // 物模型提交
    submitForm(obj) {
      dgiotlog.log('obj', obj)
      let data = {
        item: obj,
        productid: this.productId,
      }
      // 检测到
      if (this.wmxSituation == '新增') {
        // dgiotlog.log("新增");
        // this.productdetail.thing.properties.unshift(obj)
        postThing(data).then((res) => {
          dgiotlog.log('新增', res)
          if (res.code == 200) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'success',
              message: '新增成功',
            })
            this.getProDetail()
          } else {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'warning',
              message:
                res.msg == 'new already existed' ? '该物模型已存在' : res.msg,
            })
          }
        })
      } else if (this.wmxSituation == '编辑') {
        putThing(data).then((res) => {
          dgiotlog.log('编辑', res)
          if (res.code == 200) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'success',
              message: '编辑成功',
            })
            this.getProDetail()
          } else {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'warning',
              message:
                res.msg == 'new already existed' ? '该物模型已存在' : res.msg,
            })
          }
        })
      }
      this.wmxdialogVisible = false
      this.queryProductInfo(this.$route.query.id)
    },
    createThing(type) {
      this.modules.disabled = false
      this.moduletype = type
      this.wmxSituation = '新增'
      this.setSizeForm(this.getFormOrginalData())
      switch (type) {
        case 'properties':
          this.wmxdialogVisible = true
          break
        case 'services':
          this.atbas.visible = true
          this.modules.type = 'services'
          break
        case 'events':
          this.atbas.visible = true
          this.modules.type = 'events'
          break
        case 'tags':
          this.wmxdialogVisible = true
          // this.modules.visible = true
          // this.modules.type = type
          break
      }
      this.$nextTick(() => {
        if (this.$refs[type]) this.$refs[type].clearValidate()
        if (this.$refs[type]) this.$refs[type].resetFields()
      })
    },
    // 物模型修改submitForm
    async wmxDataFill(rowData, index, moduletype) {
      this.$nextTick(() => {
        this.$refs['sizeForm'].queryResource()
        this.$refs['sizeForm'].queryProtocol()
        this.upKey = moment.now()
      })
      this.moduletype = moduletype
      this.modules.type = moduletype
      this.wmxSituation = '编辑'
      this.thingType = moduletype
      this.eventType = 'edit'
      if (this.modules[moduletype]) this.modules[moduletype].data = rowData
      if (moduletype === 'events' || moduletype === 'services') {
        this.atbas.visible = true
        dgiotlogger.log(this.modules.type, this.modules[moduletype].data)
        return false
      }
      this.modifyIndex = index
      // this.tgingtype = 'property' 得到物模型的type类型
      this.wmxdialogVisible = true
      var obj = {}
      var daslist = []
      rowData.dataType.das.forEach((val) => {
        daslist.push({
          addr: val,
        })
      })
      // 提交之前需要先判断类型
      if (
        ['float', 'double', 'int', 'long'].indexOf(rowData.dataType.type) != -1
      ) {
        obj = {
          name: rowData.name,
          devicetype: rowData.devicetype,
          type: rowData.dataType.type,
          daslist: daslist,
          endnumber: this.$objGet(rowData, 'dataType.specs.max'),
          startnumber: this.$objGet(rowData, 'dataType.specs.min'),
          step: this.$objGet(rowData, 'dataType.specs.step'),
          unit: this.$objGet(rowData, 'dataType.specs.unit'),
          precision: this.$objGet(rowData, 'dataType.specs.precision'),
          // : rowData.dataForm.
          dis: this.$objGet(rowData, 'dataForm.address'),
          round: this.$objGet(rowData, 'dataForm.round'),
          dinumber: this.$objGet(rowData, 'dataForm.data'),
          rate: this.$objGet(rowData, 'dataForm.rate'),
          offset: this.$objGet(rowData, 'dataForm.offset'),
          order: this.$objGet(rowData, 'dataForm.order'),
          protocol: this.$objGet(rowData, 'dataForm.protocol'),
          operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
          originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
          afn: this.$objGet(rowData, 'dataForm.afn'),
          da: this.$objGet(rowData, 'dataForm.da'),
          dt: this.$objGet(rowData, 'dataForm.dt'),
          bytelen: this.$objGet(rowData, 'dataForm.bytelen'),
          byteType: this.$objGet(rowData, 'dataForm.byteType'),
          collection: '',
          control: '',
          strategy: '',
          required: true,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
          isstorage: rowData.isstorage,
          isaccumulate: rowData.isaccumulate,
          identifier: rowData.identifier,
          editdatatype: true,
        }
        if (rowData.dataForm) {
          obj.collection = rowData.dataForm.collection
          obj.control = rowData.dataForm.control
          obj.strategy = rowData.dataForm.strategy
        }
      } else if (rowData.dataType.type == 'bool') {
        obj = {
          name: rowData.name,
          devicetype: rowData.devicetype,
          type: rowData.dataType.type,
          true: rowData.dataType.specs[1],
          false: rowData.dataType.specs[0],
          daslist: daslist,
          startnumber: this.$objGet(rowData, 'dataType.specs.min'),
          step: this.$objGet(rowData, 'dataType.specs.step'),
          unit: this.$objGet(rowData, 'dataType.specs.unit'),
          round: this.$objGet(rowData, 'dataForm.round'),
          dis: this.$objGet(rowData, 'dataForm.address'),
          dinumber: this.$objGet(rowData, 'dataForm.data'),
          rate: this.$objGet(rowData, 'dataForm.rate'),
          offset: this.$objGet(rowData, 'dataForm.offset'),
          order: this.$objGet(rowData, 'dataForm.order'),
          protocol: this.$objGet(rowData, 'dataForm.protocol'),
          operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
          originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
          slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
          afn: this.$objGet(rowData, 'dataForm.afn'),
          da: this.$objGet(rowData, 'dataForm.da'),
          dt: this.$objGet(rowData, 'dataForm.dt'),
          bytelen: this.$objGet(rowData, 'dataForm.bytelen'),
          byteType: this.$objGet(rowData, 'dataForm.byteType'),
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: false,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
          isstorage: rowData.isstorage,
          isaccumulate: rowData.isaccumulate,
          identifier: rowData.identifier,
          collection:
            rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
          control:
            rowData.dataForm == undefined ? '' : rowData.dataForm.control,
          strategy:
            rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
          editdatatype: true,
        }
      } else if (rowData.dataType.type == 'image') {
        obj = {
          name: rowData.name,
          devicetype: rowData.devicetype,
          type: rowData.dataType.type,
          imagevalue: rowData.dataType.imagevalue,
          daslist: daslist,
          startnumber: this.$objGet(rowData, 'dataType.specs.min'),
          step: this.$objGet(rowData, 'dataType.specs.step'),
          unit: this.$objGet(rowData, 'dataType.specs.unit'),
          round: this.$objGet(rowData, 'dataForm.round'),
          dis: this.$objGet(rowData, 'dataForm.address'),
          dinumber: this.$objGet(rowData, 'dataForm.data'),
          rate: this.$objGet(rowData, 'dataForm.rate'),
          offset: this.$objGet(rowData, 'dataForm.offset'),
          order: this.$objGet(rowData, 'dataForm.order'),
          protocol: this.$objGet(rowData, 'dataForm.protocol'),
          operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
          originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
          slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
          afn: this.$objGet(rowData, 'dataForm.afn'),
          da: this.$objGet(rowData, 'dataForm.da'),
          dt: this.$objGet(rowData, 'dataForm.dt'),
          bytelen: this.$objGet(rowData, 'dataForm.bytelen'),
          byteType: this.$objGet(rowData, 'dataForm.byteType'),
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: false,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
          isstorage: rowData.isstorage,
          isaccumulate: rowData.isaccumulate,
          identifier: rowData.identifier,
          collection:
            rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
          control:
            rowData.dataForm == undefined ? '' : rowData.dataForm.control,
          strategy:
            rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
          editdatatype: true,
        }
      } else if (rowData.dataType.type == 'enum') {
        var structArray = []
        for (const key in rowData.dataType.specs) {
          structArray.push({
            attribute: key,
            attributevalue: rowData.dataType.specs[key],
          })
        }
        obj = {
          name: rowData.name,
          devicetype: rowData.devicetype,
          type: rowData.dataType.type,
          specs: rowData.dataType.specs,
          struct: structArray,
          daslist: daslist,
          startnumber: this.$objGet(rowData, 'dataType.specs.min'),
          step: this.$objGet(rowData, 'dataType.specs.step'),
          unit: this.$objGet(rowData, 'dataType.specs.unit'),
          round: this.$objGet(rowData, 'dataForm.round'),
          dis: this.$objGet(rowData, 'dataForm.address'),
          dinumber: this.$objGet(rowData, 'dataForm.data'),
          rate: this.$objGet(rowData, 'dataForm.rate'),
          offset: this.$objGet(rowData, 'dataForm.offset'),
          order: this.$objGet(rowData, 'dataForm.order'),
          protocol: this.$objGet(rowData, 'dataForm.protocol'),
          operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
          originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
          slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
          afn: this.$objGet(rowData, 'dataForm.afn'),
          da: this.$objGet(rowData, 'dataForm.da'),
          dt: this.$objGet(rowData, 'dataForm.dt'),
          bytelen: this.$objGet(rowData, 'dataForm.bytelen'),
          byteType: this.$objGet(rowData, 'dataForm.byteType'),
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: true,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
          isstorage: rowData.isstorage,
          isaccumulate: rowData.isaccumulate,
          identifier: rowData.identifier,
          collection:
            rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
          control:
            rowData.dataForm == undefined ? '' : rowData.dataForm.control,
          strategy:
            rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
          editdatatype: true,
        }
      } else if (rowData.dataType.type == 'struct') {
        obj = {
          name: rowData.name,
          devicetype: rowData.devicetype,
          type: rowData.dataType.type,
          struct: rowData.dataType.specs,
          daslist: daslist,
          startnumber: this.$objGet(rowData, 'dataType.specs.min'),
          step: this.$objGet(rowData, 'dataType.specs.step'),
          unit: this.$objGet(rowData, 'dataType.specs.unit'),
          round: this.$objGet(rowData, 'dataForm.round'),
          dis: this.$objGet(rowData, 'dataForm.address'),
          dinumber: this.$objGet(rowData, 'dataForm.data'),
          rate: this.$objGet(rowData, 'dataForm.rate'),
          offset: this.$objGet(rowData, 'dataForm.offset'),
          order: this.$objGet(rowData, 'dataForm.order'),
          protocol: this.$objGet(rowData, 'dataForm.protocol'),
          operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
          originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
          slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
          afn: this.$objGet(rowData, 'dataForm.afn'),
          da: this.$objGet(rowData, 'dataForm.da'),
          dt: this.$objGet(rowData, 'dataForm.dt'),
          bytelen: this.$objGet(rowData, 'dataForm.bytelen'),
          byteType: this.$objGet(rowData, 'dataForm.byteType'),
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: true,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
          isstorage: rowData.isstorage,
          isaccumulate: rowData.isaccumulate,
          collection:
            rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
          control:
            rowData.dataForm == undefined ? '' : rowData.dataForm.control,
          identifier: rowData.dataForm == undefined ? '' : rowData.identifier,
          strategy:
            rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
          editdatatype: true,
        }
      } else if (rowData.dataType.type == 'text') {
        obj = {
          name: rowData.name,
          devicetype: rowData.devicetype,
          type: rowData.dataType.type,
          collection:
            rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
          control:
            rowData.dataForm == undefined ? '' : rowData.dataForm.control,
          string: rowData.dataType.size,
          daslist: daslist,
          startnumber: this.$objGet(rowData, 'dataType.specs.min'),
          step: this.$objGet(rowData, 'dataType.specs.step'),
          unit: this.$objGet(rowData, 'dataType.specs.unit'),
          round: this.$objGet(rowData, 'dataForm.round'),
          dis: this.$objGet(rowData, 'dataForm.address'),
          dinumber: this.$objGet(rowData, 'dataForm.data'),
          rate: this.$objGet(rowData, 'dataForm.rate'),
          offset: this.$objGet(rowData, 'dataForm.offset'),
          order: this.$objGet(rowData, 'dataForm.order'),
          protocol: this.$objGet(rowData, 'dataForm.protocol'),
          operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
          originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
          slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
          afn: this.$objGet(rowData, 'dataForm.afn'),
          da: this.$objGet(rowData, 'dataForm.da'),
          dt: this.$objGet(rowData, 'dataForm.dt'),
          bytelen: this.$objGet(rowData, 'dataForm.bytelen'),
          byteType: this.$objGet(rowData, 'dataForm.byteType'),
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: true,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
          isstorage: rowData.isstorage,
          isaccumulate: rowData.isaccumulate,
          identifier: rowData.identifier,
          strategy:
            rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
          editdatatype: true,
        }
      } else if (rowData.dataType.type == 'date') {
        obj = {
          name: rowData.name,
          devicetype: rowData.devicetype,
          type: rowData.dataType.type,
          collection:
            rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
          control:
            rowData.dataForm == undefined ? '' : rowData.dataForm.control,
          strategy:
            rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
          daslist: daslist,
          startnumber: this.$objGet(rowData, 'dataType.specs.min'),
          step: this.$objGet(rowData, 'dataType.specs.step'),
          unit: this.$objGet(rowData, 'dataType.specs.unit'),
          round: this.$objGet(rowData, 'dataForm.round'),
          dis: this.$objGet(rowData, 'dataForm.address'),
          order: this.$objGet(rowData, 'dataForm.order'),
          dinumber: this.$objGet(rowData, 'dataForm.data'),
          rate: this.$objGet(rowData, 'dataForm.rate'),
          offset: this.$objGet(rowData, 'dataForm.offset'),
          protocol: this.$objGet(rowData, 'dataForm.protocol'),
          operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
          originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
          slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
          afn: this.$objGet(rowData, 'dataForm.afn'),
          da: this.$objGet(rowData, 'dataForm.da'),
          dt: this.$objGet(rowData, 'dataForm.dt'),
          bytelen: this.$objGet(rowData, 'dataForm.bytelen'),
          byteType: this.$objGet(rowData, 'dataForm.byteType'),
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: true,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
          isstorage: rowData.isstorage,
          isaccumulate: rowData.isaccumulate,
          identifier: rowData.identifier,
          editdatatype: true,
        }
      } else if (rowData.dataType.type == 'geopoint') {
        obj = {
          name: rowData.name,
          devicetype: rowData.devicetype,
          type: rowData.dataType.type,
          gpstype: rowData.dataType.gpstype,
          collection:
            rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
          control:
            rowData.dataForm == undefined ? '' : rowData.dataForm.control,
          strategy:
            rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
          daslist: daslist,
          startnumber: this.$objGet(rowData, 'dataType.specs.min'),
          step: this.$objGet(rowData, 'dataType.specs.step'),
          unit: this.$objGet(rowData, 'dataType.specs.unit'),
          round: this.$objGet(rowData, 'dataForm.round'),
          dis: this.$objGet(rowData, 'dataForm.address'),
          order: this.$objGet(rowData, 'dataForm.order'),
          dinumber: this.$objGet(rowData, 'dataForm.data'),
          rate: this.$objGet(rowData, 'dataForm.rate'),
          offset: this.$objGet(rowData, 'dataForm.offset'),
          protocol: this.$objGet(rowData, 'dataForm.protocol'),
          operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
          originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
          slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
          afn: this.$objGet(rowData, 'dataForm.afn'),
          da: this.$objGet(rowData, 'dataForm.da'),
          dt: this.$objGet(rowData, 'dataForm.dt'),
          bytelen: this.$objGet(rowData, 'dataForm.bytelen'),
          byteType: this.$objGet(rowData, 'dataForm.byteType'),
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: true,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
          isstorage: rowData.isstorage,
          isaccumulate: rowData.isaccumulate,
          identifier: rowData.identifier,
          editdatatype: true,
        }
      }
      dgiotlog.log('editrowData', rowData)
      // 处理动态协议类型的数据展示
      obj.protocol = rowData.dataForm.protocol
      obj.profile = rowData.profile
      this.setSizeForm(obj)
      this.upKey = moment.now()
      //调用子组件的下拉事件
      this.$nextTick(async () => {
        await this.$refs['sizeForm'].queryResource()
        await this.$refs['sizeForm'].queryProtocol()
        // 保证子组件已经挂载完成）
        // if (this.$refs['sizeForm'])
        this.$refs['sizeForm'].resource.value = rowData.dataForm.protocol
        this.$refs['sizeForm'].resource.disabled = rowData.dataForm.protocol
          .length
          ? true
          : false
        // this.$refs['sizeForm'].changeResource(this.$refs['sizeForm'].resource.value)

        this.$refs['sizeForm'].resource.arrlist = rowData.dataSource
        const protocol = await getProtocol()
        this.$nextTick(() => {
          this.$refs['sizeForm'].resource.data.forEach((resource, index) => {
            // resource[index].arr = []
            // resource[index].obj = {}
            if (this.$refs['sizeForm'].resource.value === resource.cType) {
              console.info(resource, '物模型回显事件')
              resource.arr.forEach((i) => {
                if (i.allowCreate) {
                  this.$refs['sizeForm'].dynamicTable(
                    i,
                    '回显',
                    rowData.dataSource[i.showname]
                  )
                }
              })
              console.info(rowData.dataSource, 'rowData.dataSource')
              for (var o in rowData.dataSource) {
                for (var j in resource.obj) {
                  if (o === j) resource.obj[o] = rowData.dataSource[j]
                }
              }
              console.info(resource.obj, 'set resource.obj')
              this.$refs['sizeForm'].resource.addchannel = resource.obj
            }
            this.$refs['sizeForm'].resource.changeData = rowData.dataSource
            if (resource.cType == rowData.dataForm.protocol) {
            }
          })
        })
      })
      // this.changeResource(obj.protocolType)
      // dgiotlog.log('this.sizeForm', this.sizeForm)
    },
    // 物模型结构体
    submitStruct(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var obj = {}
          if (
            this.structform.type == 'float' ||
            this.structform.type == 'double' ||
            this.structform.type == 'int'
          ) {
            obj = {
              name: this.structform.name,
              dataType: {
                type: this.structform.type.toLowerCase(),
                specs: {
                  max: this.structform.endnumber,
                  min: this.structform.startnumber,
                  step: this.structform.step,
                  unit: this.structform.unit == '' ? '' : this.structform.unit,
                },
              },
              dataForm: {
                address: this.structform.dis,
                data: this.structform.dinumber,
              },
              required: true,
              accessMode: this.structform.isread,
              identifier: this.structform.identifier,
            }
          } else if (this.structform.type == 'bool') {
            obj = {
              name: this.structform.name,
              dataType: {
                type: this.structform.type.toLowerCase(),
                specs: {
                  0: this.structform.false,
                  1: this.structform.true,
                },
              },
              dataForm: {
                address: this.structform.dis,
                data: this.structform.dinumber,
              },
              required: false,
              accessMode: this.structform.isread,
              identifier: this.structform.identifier,
            }
          } else if (this.structform.type == 'enum') {
            var specs = {}
            this.structform.struct.map((items) => {
              var newkey = items['attribute']
              specs[newkey] = items['attributevalue']
            })
            obj = {
              name: this.structform.name,
              dataType: {
                type: this.structform.type.toLowerCase(),
                struct: this.structform.struct,
                specs: specs,
              },
              dataForm: {
                address: this.structform.dis,
                data: this.structform.dinumber,
              },
              required: true,
              accessMode: this.structform.isread,
              identifier: this.structform.identifier,
            }
          } else if (this.structform.type == 'text') {
            obj = {
              name: this.structform.name,
              dataType: {
                type: this.structform.type.toLowerCase(),
                size: this.structform.string,
              },
              dataForm: {
                address: this.structform.dis,
                data: this.structform.dinumber,
              },
              required: true,
              accessMode: this.structform.isread,
              identifier: this.structform.identifier,
            }
          } else if (this.structform.type == 'date') {
            obj = {
              name: this.structform.name,
              dataType: {
                type: this.structform.type.toLowerCase(),
              },
              dataForm: {
                address: this.structform.dis,
                data: this.structform.dinumber,
              },
              required: true,
              accessMode: this.structform.isread,
              identifier: this.structform.identifier,
            }
          }
          if (this.isupdatedstruct == -1) {
            this.sizeForm.struct.push(obj)
          } else {
            this.sizeForm.struct.splice(this.isupdatedstruct, 1, obj)
            this.isupdatedstruct = -1
          }
          this.$refs[formName].resetFields()
          this.structdialog = false
        } else {
        }
      })
    },
    // 新增结构体
    addStruct(formName) {
      this.structdialog = true
      this.structform = {
        resource: 1,
        identifier: '',
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
        specs: [],
        date: 'String类型的UTC时间戳 (毫秒)',
        string: '',
      }
    },
    editStruct(item, index) {
      dgiotlog.log(item, index)
      this.isupdatedstruct = index
      this.structdialog = true
      this.structform.type = item.dataType.type.toUpperCase()
      this.structform.name = item.name
      this.structform.identifier = item.identifier
      this.structform.isread = item.accessMode
      if (
        item.dataType.type == 'float' ||
        item.dataType.type == 'double' ||
        item.dataType.type == 'int'
      ) {
        this.structform.startnumber = item.dataType.specs.min
        this.structform.endnumber = item.dataType.specs.max
        this.structform.step = item.dataType.specs.step
        this.structform.unit = item.dataType.specs.unit
      } else if (item.dataType.type == 'bool') {
        this.structform.true = item.dataType.specs['1']
        this.structform.false = item.dataType.specs['0']
      } else if (item.dataType.type == 'enum') {
        this.structform.specs = []
        var obj = {}
        Object.keys(item.dataType.specs).forEach((value, index) => {
          obj.attribute = value
          obj.attributevalue = item.dataType.specs[value]
          this.structform.specs.push(obj)
        })
      } else if (item.dataType.type == 'text') {
        this.structform.string = item.dataType.size
      }
    },
    // 删除结构体
    deleteStruct(index) {
      this.sizeForm.struct.splice(index, 1)
    },
    async preserve(type) {
      const message = type === 'json' ? '物模型修改成功' : '物模型状态更新成功'
      const params =
        type === 'json'
          ? {
              thing: JSON.parse(editor1.getValue()),
            }
          : { thing: this.productdetail.thing }
      await putProduct(this.productId, params)
      setTimeout(() => {
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'success',
          message: message,
        })
        if (type === 'json') {
          this.schemadialogVisible = false
          this.handleChildClick(this.tabsChild)
          // 手动更新完物模型后，再去查询一下当前页面的物模型
          this.getProDetail()
        }
      }, 1000)
    },
    async Industry() {
      this.option = []
      const { results } = await this.$getIndustry('category', 100)
      results.map((items) => {
        var obj = {}
        obj.value = items.type
        obj.label = items.data.CategoryName
        obj.id = items.data.Id
        obj.parentid = items.data.SuperId
        this.option.push(obj)
      })
      this.getProDetail()
    },
    utc2beijing(utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
      return date // 2017-03-31 16:02:06
    },
    getPropData(start) {
      if (start == 0) {
        this.productstart = 0
      }
      this.CategoryKey = this.$route.query.CategoryKey
      const params = {
        count: 'objectId',
        limit: this.productlength,
        skip: this.productstart,
        where: {
          'data.key': 'category',
        },
      }
      if (this.category.length != 0) {
        params.where.type = this.category[this.category.length - 1]
      }
      getDictCount(params)
        .then((res) => {
          this.producttotal = res.count
          this.PropData = res.results
        })
        .catch((e) => {
          dgiotlog.log(e)
        })
    },
    productSizeChange(val) {
      this.productlength = val
      this.getPropData()
    },
    productCurrentChange(val) {
      this.productstart = (val - 1) * this.productlength
      this.getPropData()
    },
    // 李宏杰新增  查看采集公式
    checkAddTest() {
      this.collectionDialogVisible = true
      // let newTabName = ++this.tabIndex + '';
      this.editableTabsValue = this.wmxData[0].identifier
      this.activeIndex = this.wmxData[0].identifier
      this.editableTabs = []
      this.editorList = []
      this.tabIndex = 1
      this.ed3isShow = false
      this.editableTabs.push({
        title: this.wmxData[0].identifier,
        name: this.wmxData[0].identifier,
        leftItemPos: 0,
        content:
          this.wmxData[0].dataForm == undefined
            ? ''
            : this.wmxData[0].dataForm.collection,
      })

      // 进入先添加一个默认显示的
      if (this.ed3isShow == false) {
        setTimeout(() => {
          // editor3 = ace.edit(this.wmxData[0].identifier);
          this.editorList.push(ace.edit(this.wmxData[0].identifier))
          this.editorList[0].session.setMode('ace/mode/erlang') // 设置语言
          this.editorList[0].setTheme('ace/theme/monokai') // 设置主题
          this.editorList[0].setHighlightActiveLine(true)
          this.editorList[0].setFontSize(20) // 设置字号
          this.editorList[0].setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true, // 设置自动提示
          })
          this.ed3isShow = true
          //  this.editorList.push(editor3);
          // dgiotlog.log(this.wmxData);
          this.editorList[0].setValue(
            this.wmxData[0].dataForm == undefined
              ? ''
              : this.wmxData[0].dataForm.collection
          )
        }, 1)
      }
      // this.menuTabClick(this.wmxData)
    },
    //
    handleRightTopTabClick(tab, event) {
      this.activeIndex = tab.label
      // dgiotlog.log(tab.label);
    },
    // 左边切换,先判断是否添加过
    menuTabClick(item, itemPos) {
      // dgiotlog.log(item)
      // 先判断是否添加过
      this.activeIndex = item.identifier
      const tabs = this.editableTabs
      let isAdd = false
      let mIndex = 0
      tabs.forEach((tab, index) => {
        if (tab.name === item.identifier) {
          // dgiotlog.log("tab.name   " + tab.name, "   item.identifier   " + item.identifier, "   index  " + index);
          isAdd = true
          mIndex = index
        }
      })
      if (isAdd == false) {
        this.editableTabs.push({
          title: item.identifier,
          name: item.identifier,
          leftItemPos: itemPos,
          content: item.dataForm == undefined ? '' : item.dataForm.collection,
        })
        setTimeout(() => {
          this.editorList.push(ace.edit(item.identifier))
          this.editorList[this.editorList.length - 1].session.setMode(
            'ace/mode/erlang'
          ) // 设置语言
          this.editorList[this.editorList.length - 1].setTheme(
            'ace/theme/monokai'
          ) // 设置主题
          this.editorList[this.editorList.length - 1].setHighlightActiveLine(
            true
          )
          this.editorList[this.editorList.length - 1].setFontSize(20) // 设置字号
          this.editorList[this.editorList.length - 1].setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true, // 设置自动提示
          })
          this.editorList[this.editorList.length - 1].setValue(
            item.dataForm == undefined ? '' : item.dataForm.collection
          )
        }, 1)

        this.editableTabsValue = item.identifier
        this.rightCollection =
          item.dataForm == undefined ? '' : item.dataForm.collection
      } else {
        this.editableTabsValue = item.identifier
        // dgiotlog.log("this.editorList ==  " + this.editorList.length)
        this.editorList[mIndex].setValue(
          item.dataForm == undefined ? '' : item.dataForm.collection
        )
      }
    },
    // 关闭上面的单个tab
    removeTab(targetName) {
      const tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.activeIndex = activeName
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
    },

    // 保存
    async onSaveTap(index) {
      const leftPos = this.editableTabs[index].leftItemPos
      this.productdetail.thing.properties[leftPos].dataForm.collection =
        this.editorList[index].getValue()
      const params = {
        thing: this.productdetail.thing,
      }
      await putProduct(this.productId, params)
      this.$message({
        showClose: true,
        duration: 2000,
        type: 'success',
        message: '添加成功',
      })
      this.getProDetail()
    },

    handleCloseCollecttion(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },

    // 还原
    onReductionTap(index) {
      const leftPos = this.editableTabs[index].leftItemPos
      // dgiotlog.log(this.wmxData[leftPos].dataForm.collection)

      this.editorList[index].setValue(this.wmxData[leftPos].dataForm.collection)
    },

    // 李宏杰添加结束

    // 查看物模型模板
    checkschema() {
      this.schemadialogVisible = true
      setTimeout(() => {
        editor1 = ace.edit('editor1')
        editor1.session.setMode('ace/mode/json') // 设置语言
        editor1.setTheme('ace/theme/eclipse') // 设置主题
        editor1.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true, // 设置自动提示
        })
        editor1.setValue(JSON.stringify(this.productdetail.thing, null, 4))
      }, 1)
    },
    async query_notification() {
      let info = {
        count: 'objectId',
        where: {
          key: { $regex: this.$route.query.id },
          type: { $regex: 'notification' },
        },
      }
      this.$route.query.id
        ? (info.where.key = { $regex: this.$route.query.id })
        : ''
      const { results, count = 0 } = await queryView(info)
      this.amisShow = count > 0 ? true : false
      this.amisproductInfo = results
    },
    // 得到产品详情
    getProDetail() {
      // 查询表单数据
      this.query_notification()
      editor = ace.edit('editor')
      editor.session.setMode('ace/mode/erlang') // 设置语言
      editor.setTheme('ace/theme/monokai') // 设置主题
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true, // 设置自动提示
      })
      // 需要找到 this.productId 并传入
      this.productId = this.$route.query.id
      this.queryDeviceCount(this.productId)
      this.FromMachine = [{ name: 'ALL' }]
      this.$get_object('Product', this.productId)
        .then((response) => {
          console.log('response', response)
          if (response) {
            this.productInfo = _.merge(response, {
              decoder: { code: '' },
              thing: { properties: [] },
              config: {
                address: response.config?.address || '余杭区良渚平高创业城c1座',
                location: {
                  longitude:
                    response.config?.location?.longitude || '120.161324',
                  latitude: response.config?.location?.latitude || '30.262441',
                },
              },
            })
            this.productName = response.name
            for (var key in response) {
              this.productdetail[key] = response[key]
            }
            this.option.map((items) => {
              if (this.productdetail.category == items.value) {
                this.productdetail.category = items.label
              }
            })
            this.productdetail.createdAt = this.utc2beijing(response.createdAt)
            this.productdetail.id = response.id
            this.dynamicReg = response.dynamicReg
            this.productdetail.isshow = 0

            if (this.productdetail.category) {
              this.$get_object(
                'Category',
                this.productdetail.category.objectId
              ).then((cat) => {
                dgiotlog.log('catcat', cat)
                this.$set(this.productdetail, 'categoryname', cat.name)
              })
            }

            this.form.Productname = response.name
            this.ProductSecret = response.productSecret
            this.form.Productkey = this.productId
            // window.location.origin
            this.productimg = response.icon
            if (response.decoder) {
              setdata = response.decoder.code
              this.formInline.name = response.decoder.name
              this.formInline.version = response.decoder.version
              this.formInline.desc = response.decoder.desc
            } else {
              setdata =
                'JSUlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQolJSUgQGNvcHlyaWdodCAoQykgMjAxOCwgPHNodXdhPgolJSUgQGRvYwolJSUg5Y2P6K6u6Kej5p6QRGVtbwolJSUgQGVuZAolJSUgQ3JlYXRlZCA6IDA4LiDljYHkuIDmnIggMjAxOCAxNDo0OQolJSUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCi1tb2R1bGUoc2h1d2FfZGVtb19kZWNvZGVyKS4KLWF1dGhvcigic2h1d2EiKS4KLWRlZmluZShNU0dfVFlQRSwgPDwiREVNTyI+PikuCi1wcm90b2NvbChbPDwiREVNTyI+Pl0pLgoKLWV4cG9ydChbcGFyc2VfZnJhbWUvMiwgdG9fZnJhbWUvMV0pLgoKCnBhcnNlX2ZyYW1lKEJ1ZmYsIE9wdHMpIC0+CiAgICBwYXJzZV9mcmFtZShCdWZmLCBbXSwgT3B0cykuCgoKcGFyc2VfZnJhbWUoPDw+PiwgQWNjLCBfT3B0cykgLT4KICAgIHs8PD4+LCBBY2N9OwpwYXJzZV9mcmFtZSg8PDE2IzY4LCBSZXN0L2JpbmFyeT4+ID0gQmluLCBBY2MsIF9PcHRzKSB3aGVuIGJ5dGVfc2l6ZShSZXN0KSA9PCA2IC0+CiAgICB7QmluLCBBY2N9OwpwYXJzZV9mcmFtZSg8PDE2IzY4LCBMZW46MTYvbGl0dGxlLWludGVnZXIsIExlbjoxNi9saXR0bGUtaW50ZWdlciwgMTYjNjgsIFJlc3QvYmluYXJ5Pj4gPSBCaW4sIEFjYywgT3B0cykgLT4KICAgIGNhc2UgYnl0ZV9zaXplKFJlc3QpIC0gMiA+PSBMZW4gb2YKICAgICAgICB0cnVlIC0+CiAgICAgICAgICAgIGNhc2UgUmVzdCBvZgogICAgICAgICAgICAgICAgPDxVc2VyWm9uZTpMZW4vYnl0ZXMsIENyYzo4LCAxNiMxNiwgUmVzdDEvYmluYXJ5Pj4gLT4KICAgICAgICAgICAgICAgICAgICBBY2MxID0KICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBzaHV3YV91dGlsczpnZXRfcGFyaXR5KFVzZXJab25lKSA9Oj0gQ3JjIG9mCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIC0+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRnJhbWUgPSAjewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8PCJtc2d0eXBlIj4+ID0+ID9NU0dfVFlQRSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPDwiZGF0YSI+PiA9PiBVc2VyWm9uZQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWNjICsrIFtGcmFtZV07CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSAtPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjYwogICAgICAgICAgICAgICAgICAgICAgICBlbmQsCiAgICAgICAgICAgICAgICAgICAgcGFyc2VfZnJhbWUoUmVzdDEsIEFjYzEsIE9wdHMpOwogICAgICAgICAgICAgICAgXyAtPgogICAgICAgICAgICAgICAgICAgIHBhcnNlX2ZyYW1lKFJlc3QsIEFjYywgT3B0cykKICAgICAgICAgICAgZW5kOwogICAgICAgIGZhbHNlIC0+CiAgICAgICAgICAgIHtCaW4sIEFjY30KICAgIGVuZDsKcGFyc2VfZnJhbWUoPDxfOjgsIFJlc3QvYmluYXJ5Pj4sIEFjYywgT3B0cykgLT4KICAgIHBhcnNlX2ZyYW1lKFJlc3QsIEFjYywgT3B0cykuCgoKJSUg57uE6KOF5oiQ5bCB5YyFLCDlj4LmlbDkuLpNYXDlvaLlvI8KdG9fZnJhbWUoI3s8PCJtc2d0eXBlIj4+IDo9ID9NU0dfVFlQRX0gPSBGcmFtZSkgLT4KICAgIFBheWxvYWQgPSB0ZXJtX3RvX2JpbmFyeShGcmFtZSksCiAgICA8PDE2IzAzLCBQYXlsb2FkL2JpbmFyeSwgMTYjMjM+Pi4='
            }
            if (
              this.productdetail.thing == undefined ||
              JSON.stringify(this.productdetail.thing) == '{}'
            ) {
              this.productdetail.thing = {
                properties: [],
              }
            }
            this.wmxData = []
            this.wmxDataBk = []
            this.wmxData = this.productdetail.thing.properties.filter(
              (item, index) => {
                item.index = index
                return item.name && item.dataType
              }
            )
            this.wmxDataBk = this.productdetail.thing.properties
            this.wmxDataBk.forEach((item) => {
              if (item.devicetype) {
                let arr = {
                  name: item.devicetype,
                }
                this.FromMachine.push(arr)
              }
            })
            this.FromMachine = _.uniqBy(this.FromMachine, 'name')
            // Object.assign(this.FromMachine, _.uniqBy(array, 'name'))
            editor.setValue(Base64.decode(setdata))
            editor.gotoLine(editor.session.getLength())
          }
        })
        .catch((err) => {
          this.$baseMessage('请求出错', err.error, 3000)
        })
    },

    // 查询设备总数
    async queryDeviceCount(productId) {
      this.form.ProductAll = await getDeviceCountByProduct(productId)
    },
    // 产品修改
    async handelUpdate(event, row) {
      var isopen
      if (event == true) {
        isopen = false
      } else {
        isopen = true
      }
      this.dynamicReg = isopen
      const params = {
        dynamicReg: !isopen,
      }
      await putProduct(this.productId, params)
      this.$message({
        showClose: true,
        duration: 2000,
        type: 'success',
        message: '修改成功',
      })
      this.dynamicReg = !isopen
    },
    async wmxhandleClose(type) {
      this.wmxSituation = '新增'
      if (type) {
        this.wmxdialogVisible = false
        await this.$refs['sizeForm'].$refs['sizeForm'].resetFields()
        await this.$refs['sizeForm'].$refs['sizeForm'].clearValidate()
        await this.setSizeForm(this.getFormOrginalData())
        this.$refs['sizeForm'].resource.disabled = false
        await this.handleChildClick(this.tabsChild)
        if (this.$refs['sizeForm']) await this.$refs['sizeForm'].queryResource()
        this.upKey = moment.now()
      } else {
        this.wmxdialogVisible = false
        this.upKey = moment.now()
      }
    },
    // 协议编辑
    protol() {
      var log = ''
      Compile(Base64.encode(editor.getValue()))
        .then((res) => {
          if (res) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'success',
              message: '编译成功',
            })
            log = '编译成功' + res.mod + '\r\n'
            this.warningeditror = res.warnings
            this.warningeditror.map((items) => {
              log += items + '\r\n'
            })
            isupdatetrue += log
            editor2.setValue(isupdatetrue)
          }
        })
        .catch((error) => {
          this.warningeditror = error.error
          this.warningeditror.map((items) => {
            log += items + '\r\n'
          })
          isupdatetrue += log
          editor2.setValue(isupdatetrue)
        })
    },
    decoderSizeChange(val) {
      this.decoder.length = val
      this.chaxun()
    },
    devicerCurrentChange(val) {
      this.decoderstart = (val - 1) * this.decoderlength
      this.chaxun()
    },
    deletedata(objectId) {
      this.$del_object('Dict', objectId)
        .then((resultes) => {
          if (resultes) {
            this.$message('成功删除')
            this.chaxun()
          }
        })
        .catch((e) => {
          dgiotlog.log(e)
        })
    },
    subAce(formName, istrue) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          var obj = {
            name: this.formInline.name,
            version: this.formInline.version,
            code: Base64.encode(editor.getValue()),
            desc: this.formInline.desc,
          }
          const params = {
            decoder: obj,
          }
          await putProduct(this.productId, params)
          if (this.issub == false) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'success',
              message: '保存成功',
            })
            if (istrue == true) {
              isupdatetrue += '保存成功'
              editor2.setValue(isupdatetrue)
            }
          }
          this.issub = true
        } else {
          this.$message({
            type: 'warning',
            message: '输入格式有误',
          })
        }
      })
    },
    subAce1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            where: {
              'data.name': this.formInline.name,
              'data.version': this.formInline.version,
            },
          }
          this.$query_object('Dict', params)
            .then((response) => {
              if (response.results && response.results.length >= 1) {
                this.$message('此协议版本已存在')
              } else {
                this.$get_object('Product', this.productId).then((response) => {
                  if (response) {
                    var obj = {
                      name: this.formInline.name,
                      version: this.formInline.version,
                      code: Base64.encode(editor.getValue()),
                      desc: this.formInline.desc,
                    }
                    const params = {
                      key: this.formInline.name + ':' + this.formInline.version,
                      type: 'decoder',
                      data: obj,
                      ACL: response.ACL,
                    }
                    this.$create_object('Dict', params)
                      .then((resultes) => {
                        if (resultes.error) {
                          this.$message({
                            type: 'error',
                            message: resultes.error,
                          })
                        } else {
                          this.$message({
                            showClose: true,
                            duration: 2000,
                            type: 'success',
                            message: '保存到公共协议库成功',
                          })
                        }
                      })
                      .catch((e) => {
                        dgiotlog.log(e)
                      })
                  }
                })
              }
            })
            .catch((e) => {
              dgiotlog.log(e)
            })
        } else {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: '输入格式有误',
          })
        }
      })
    },
    // 通道更新协议状态
    updatesub(row) {
      subupadte(row.objectId, 'update')
        .then((resultes) => {
          if (resultes) {
            this.$message('重载成功')
          }
        })
        .catch((error) => {
          this.$message(error.error)
        })
    },

    chaxun() {
      const params = {
        count: 'objectId',
        skip: this.decoderstart,
        limit: this.decoderlength,
        where: {
          type: 'decoder',
        },
      }
      this.dialogTableVisible = true
      this.$query_object('Dict', params)
        .then((res) => {
          if (res) {
            this.decodertotal = res.count
            this.gridData = res.results
          }
        })
        .catch((e) => {
          dgiotlog.log(e)
        })
    },
    editordata(row) {
      this.formInline.name = row.data.name
      this.formInline.version = row.data.version
      this.formInline.desc = row.data.desc
      this.formInline.resource = row.data.enable
      editor.setValue(Base64.decode(row.data.code))
      this.dialogTableVisible = false
    },
    goToDevices() {
      this.$router.push({
        path: '/roles/thing',
        query: {
          productid: this.productId,
        },
      })
    },
    addcategory() {
      this.originwmx = true
      this.getPropData()
    },
    addMachine() {
      this.machineForm = {}
      this.machine = true
      this.machinestatus = 'add'
      // this.getPropData()
    },
    savemachine(form) {
      if (this.machinestatus == 'edit') {
        this.FromMachine[this.machineindex] = form
      } else {
        this.FromMachine.push(form)
      }
      this.machine = false
    },
    clickmachine(row, _event, _column) {
      if (row.name == 'ALL') {
        this.wmxDataBk.forEach((item) => {
          if (!item.dataType)
            item.dataType = {
              das: [],
              specs: {},
              type: 'float',
              identification: 'function',
            }
        })
        this.wmxData = this.wmxDataBk
      } else {
        this.devicetype = row.name
        this.wmxData = this.wmxDataBk.filter(
          (item) => item.devicetype == row.name && !item.dataType.identification
        )
        this.wmxstart = 1
      }
      this.upKey = moment.now()
    },
    handleChange(value, direction, movedKeys) {
      // dgiotlog.log(value, direction, movedKeys);
    },
    // 用于处理定义好的物模型模板
    TypeInstall(origin, arr) {
      arr.map((items, index) => {
        if (items.DataType == 'enum' || items.DataType == 'bool') {
          var obj = {
            dataType: {
              specs: {},
            },
          }
          obj.name = items.Name
          obj.dataType.type = items.DataType
          obj.required = items.Required
          obj.identifier = items.Identifier
          obj.accessMode = items.RwFlag == 1 ? 'r' : 'rw'
          JSON.parse(items.DataSpecsList).map((child) => {
            for (var key in child) {
              var attribute = child['value']
              var value = child['name']
              obj.dataType.specs[attribute] = value
            }
          })
          origin.push(obj)
        } else if (
          items.DataType == 'double' ||
          items.DataType == 'int' ||
          items.DataType == 'float'
        ) {
          var obj = {
            dataType: {
              specs: {},
            },
          }
          obj.name = items.Name
          obj.dataType.type = items.DataType
          obj.required = items.Required
          obj.identifier = items.Identifier
          obj.accessMode = items.RwFlag == 1 ? 'r' : 'rw'
          for (var key in JSON.parse(items.DataSpecs)) {
            obj.dataType.specs.min = JSON.parse(items.DataSpecs)['min']
            obj.dataType.specs.max = JSON.parse(items.DataSpecs)['max']
            obj.dataType.specs.step = JSON.parse(items.DataSpecs)['step']
            obj.dataType.specs.unit = JSON.parse(items.DataSpecs)['unit']
          }
          origin.push(obj)
          // 分开结构体单独遍历
        } else if (items.DataType == 'struct') {
          var structobj = {
            dataType: {
              specs: [],
            },
          }
          structobj.name = items.Name
          structobj.dataType.type = items.DataType
          structobj.required = !items.Required
          structobj.identifier = items.Identifier
          structobj.accessMode = items.RwFlag == 1 ? 'r' : 'rw'
          JSON.parse(items.DataSpecsList).map((children) => {
            if (
              children.childDataType == 'enum' ||
              children.childDataType == 'bool'
            ) {
              var obj = {
                dataType: {
                  specs: {},
                },
              }
              obj.name = children.childName
              obj.dataType.type = children.childDataType.toLowerCase()
              obj.required = children.Required
              obj.identifier = children.identifier
              obj.accessMode = children.RwFlag == 1 ? 'r' : 'rw'
              children.childEnumSpecsDTO.map((child) => {
                for (var key in child) {
                  var attribute = child['value']
                  var value = child['name']
                  obj.dataType.specs[attribute] = value
                }
              })
              structobj.dataType.specs.push(obj)
            } else if (
              children.childDataType == 'double' ||
              children.childDataType == 'int' ||
              children.childDataType == 'float'
            ) {
              var obj = {
                dataType: {
                  specs: {},
                },
              }
              obj.name = children.childName
              obj.dataType.type = children.childDataType.toLowerCase()
              obj.required = children.Required
              obj.identifier = children.identifier
              obj.accessMode = children.RwFlag == 1 ? 'r' : 'rw'
              for (var key in children.childSpecsDTO) {
                obj.dataType.specs.min = children.childSpecsDTO['min']
                obj.dataType.specs.max = children.childSpecsDTO['max']
                obj.dataType.specs.step = children.childSpecsDTO['precise']
                obj.dataType.specs.unit = children.childSpecsDTO['unit']
              }
              structobj.dataType.specs.push(obj)
            }
          })
          origin.push(structobj)
        }
      })
      var update = {}
      origin = origin.reduce((cur, next) => {
        update[next.identifier]
          ? ''
          : (update[next.identifier] = true && cur.push(next))
        return cur
      }, [])
    },
    // 添加物模型模板
    addProCategory(row) {
      const params = {
        where: {
          type: row.type,
          'data.key': 'detail',
        },
      }
      this.$query_object('Dict', params).then(async (res) => {
        const results = res.results
        if (results && results[0].data.Ability) {
          this.TypeInstall(
            this.productdetail.thing.properties,
            results[0].data.Ability
          )
          const params = {
            thing: this.productdetail.thing,
          }
          await putProduct(this.productId, params)
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'success',
            message: '添加成功',
          })
          this.getProDetail()
        } else {
          dgiotlog.log('此选项没有属性功能')
        }
      })
    },
    /* 删除物模型*/
    deletewmx(row) {
      this.$baseConfirm(
        this.$translateTitle(
          'Maintenance.Are you sure you want to delete the current item'
        ),
        this.$translateTitle('Maintenance.Delete reminder'),
        async () => {
          const params = {
            productid: this.productId,
            item: row,
          }
          const res = await deleteThing(params)
          if (res.code == 200) {
            this.$baseMessage(
              this.$translateTitle('user.successfully deleted'),
              'success',
              'dgiot-hey-message-success'
            )
            await this.getProDetail()
            // await this.queryProductInfo(this.$route.query.id)
          } else
            this.$baseMessage(
              this.$translateTitle('user.error deleted') + res?.msg
                ? res.msg
                : res,
              'error',
              'dgiot-hey-message-error'
            )
        }
      )
    },
    wmxSizeChange(val) {
      this.wmxstart = 1
      this.wmxPageSize = val
    },
    wmxCurrentChange(val) {
      this.wmxstart = val
    },
    eventsChange(val) {
      this.eventsStart = 1
      this.eventsPageSize = val
    },
    eventsCurrentChange(val) {
      this.eventsStart = val
    },
    serverSizeChange(val) {
      this.servicesStart = 1
      this.servicesPageSize = val
    },
    serverCurrentChange(val) {
      this.servicesStart = val
    },
    tagsSizeChange(val) {
      this.tagsStart = 1
      this.tagsPageSize = val
    },
    tagsCurrentChange(val) {
      this.eventsStart = val
    },
    // 订阅日志按钮
    nowtime() {
      var timestamp3 = Date.parse(new Date())
      var date = new Date(timestamp3)
      var Y = date.getFullYear() + '年'
      var M =
        (date.getMonth() + 1 <= 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '月'
      var D =
        (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) +
        '日  '
      var h =
        (date.getHours() + 1 <= 10 ? '0' + date.getHours() : date.getHours()) +
        ':'
      var m =
        (date.getMinutes() + 1 <= 10
          ? '0' + date.getMinutes()
          : date.getMinutes()) + ':'
      var s =
        date.getSeconds() + 1 <= 10
          ? '0' + date.getSeconds()
          : date.getSeconds()
      return h + m + s + ' '
    },
    // 订阅日志
    async subProTopic(row) {
      this.channelid = row.objectId
      this.subdialog = true
      this.subdialogid = row.objectId
      this.channelname = row.objectId
      this.mqtt.subtopic = '$dg/user/channel/' + row.objectId + '/#'
      let subInfo = {
        router: this.mqtt.router,
        topic: this.mqtt.subtopic,
        qos: 2,
        ttl: 1000 * 60 * 60 * 3,
      }
      this.$dgiotBus.$off(this.$mqttInfo.topicKey)
      await this.$subscribe(this.subtopic)
      subupadte(row.objectId, 'start_logger')
      // this.topicKey = this.$dgiotBus.topicKey(
      //   this.mqtt.router,
      //   this.mqtt.subtopic
      // )

      this.submessage = ''
      this.msgList = []
      this.$dgiotBus.$on(this.$mqttInfo.topicKey, (res) => {
        this.mqttMsg(res.payloadString)
      })
    },
    mqttMsg(Msg) {
      // console.error(Msg)
      this.msgList.push({
        timestamp: moment().format('x'),
        msg: Msg,
      })
      this.refreshFlag = moment().format('x')
      this.submessage += Msg + `\n`
    },
    // 关闭弹窗操作
    handleCloseSubdialog() {
      subupadte(this.channelid, 'stop_logger')
      this.msgList = []
      this.submessage = []
      this.subdialog = false
    },
    // 停止topic刷新
    stopsub(value) {}, // topic增加
    subTopic(formName, isupdated) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let message = ''
          if (isupdated != -1) {
            //  修改
            this.topicDefault[this.topicform.id] = this.topicform.value
            message = '修改topic成功'
          } else {
            this.topicDefault[this.topicform.topic] = this.topicform.value
            message = '添加自定义topic成功'
          }
          await putProduct(this.productId, {
            topics: this.topicDefault,
          })
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'success',
            message: message,
          })
          this.topicform = {
            isupdated: -1,
            value: '',
            info: 'basic',
          }
          this.handleClick({
            name: 'second',
          })
          this.topicdialogVisible = false
          this.$refs[formName].resetFields()
        } else {
          dgiotlog.log('error submit!!')
          return false
        }
      })
    },
    topicSizeChange(val) {
      this.topicstart = 1
      this.topiclength = val
    },
    topicCurrentChange(val) {
      this.topicstart = val
    },
    updatetopic(row, index) {
      this.topicform = row
      // this.topicform.profile = row.topic;
      // this.topicform.type = row.type;
      // this.topicform.desc = row.desc;
      // this.topicform.value = row.value;
      this.topicdialogVisible = true
      this.topicform.isupdated = index
    },
    deletetopic(topicData, scope, index) {
      this.$baseConfirm('你确定要删除当前项topic吗', null, async () => {
        const topic = {}
        topicData.splice(index, 1)
        topicData.forEach((i) => {
          topic[i.id] = i.value
        })
        await putProduct(this.productId, {
          topics: topic,
        })
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'success',
          message: '删除成功',
        })
      })

      // this.getTopic();
      // this.queryProductInfo(this.$route.query.id);
    },
    // 规则tab显示
    orginRule() {
      getRule()
        .then((response) => {
          if (response) {
            this.engineData = response
          }
        })
        .catch((error) => {
          this.$message(error.error)
        })
    },
    // 分页
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    addEngine() {
      this.$router.push({
        path: '/rules_engine/addengine',
        query: {
          title: '新增',
          productid: this.productId,
        },
      })
    },
    actions(row) {
      var string = []
      row.map((items) => {
        string.push(items.name)
      })
      return string.join(',')
    },
    // 表格单个单元格class添加
    getRowindex(row, rowIndex, columnIndex) {
      if (row.columnIndex == 0) {
        return 'firstcolumn'
      }
    },
    detailRules(id) {
      this.$router.push({
        path: '/rules_engine/checkengine',
        query: {
          id: id,
        },
      })
    },
  },
}
