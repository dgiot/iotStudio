/* eslint-disable */
import { mapGetters, mapMutations } from "vuex";
import { getDeviceCountByProduct } from "@/api/Device/index";
import { deleteThing, postThing, putThing } from "@/api/Product/index";
import { downBinary } from "@/api/File/index";
import { getAllunit, getDictCount } from "@/api/Dict/index";
import { getChannelCountByProduct, saveChanne } from "@/api/Channel/index";
import { getRule } from "@/api/Rules";
import { postProductTemplet } from "@/api/ProductTemplet";
import { Compile, subupadte } from "@/api/System/index";
import { setTimeout } from "timers";
import { Websocket } from "@/utils/wxscoket.js";
import wmxdetail from "@/views/equipment_management/component/wmxdetail";
import { returnLogin } from "@/utils/utilwen";

var editor
var editor1
var editor2
var subdialog
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
    'dgiot-wmx': wmxdetail,
  },
  data() {
    var validCode = (rule, value, callback) => {
      const reg = /[0-9a-zA-Z]/
      if (!reg.test(value)) {
        callback(new Error('协议名称由数字和字母组合'))
      } else {
        callback()
      }
    }
    var validminnumber = (rule, value, callback) => {
      // console.log(value);
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
    var validmaxnumber = (rule, value, callback) => {
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
    var vailspecs = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error('步长大于0'))
      } else if (value >= this.sizeForm.endnumber - this.sizeForm.startnumber) {
        callback(new Error('步长必须小于最大值和最小值的差值'))
      } else {
        callback()
      }
    }
    var validstructminnumber = (rule, value, callback) => {
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
    var validstructmaxnumber = (rule, value, callback) => {
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
    var vailstructspecs = (rule, value, callback) => {
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
      productInfo: {
        decoder: { code: '' },
        thing: { properties: [] },
        config: { parser: [], profile: [], basedate: { params: [] } },
      },
      FromMachine: [{ name: 'ALL' }],
      machineForm: {},
      machine: false,
      devicetype: '',
      machinestatus: 'add',
      machineindex: 0,
      options: [
        { value: 'first', label: '第一轮' },
        { value: 'last', label: '最后一轮' },
        { value: 'all', label: '全部' },
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
        topic: '',
        type: '',
        desc: '',
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
      },
      tableData: [],
      activeName: 'first',
      form: {
        Productname: '',
        ProductKey: '',
        ProductAll: 0,
      },
      ProductSecret: '',
      dynamicReg: false,
      productId: '',
      productName: '',
      productdetail: {},
      topicData: [],
      topic: [
        {
          topic: 'thing/${ProductId}/${DevAddr}/post',
          type: 'pub',
          desc: '设备上报',
          isdef: true,
        },
        {
          topic: 'thing/${ProductId}/${DevAddr}',
          type: 'sub',
          desc: '消息下发',
          isdef: true,
        },
      ],
      isshow: false,
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
      wmxtotal: 20,
      wmxData: [],
      wmxDataBk: [],
      editorList: [],

      warningeditror: [],
      channellength: 20,
      channelstart: 0,
      channeltotal: 0,
      isupdatedstruct: -1,
      issub: false,
      subtimer: null,
      subdialog: false,
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
    }
  },
  computed: {
    treeData() {
      const cloneData = JSON.parse(JSON.stringify(this.option)) // 对源数据深度克隆
      // console.log("cloneData", cloneData)
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
    this.$nextTick(() => {
      this.$refs._tabs.$children[0].$refs.tabs[3].style.display = 'none'
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

    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  beforeDestroy() {
    window.clearInterval(this.subtimer)
    this.subtimer = null
    window.clearInterval(this.subdialogtimer)
    this.subdialogtimer = null
  },
  methods: {
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
      // console.log(v);
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
        rate: 1,
        offset: 0,
        order: 0,
        protocol: 'normal',
        operatetype: 'readCoils',
        originaltype: 'int',
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
    handleClick(val) {
      if (val.name == 'fourth') {
        // this.$router.push({
        //   path: '/roles/thingsParse',
        //   query: {
        //     id: this.$route.query.id
        //   }
        // })
      } else if (val.name == 'fiveth') {
        this.getProductChannel()
      } else if (val.name == 'second') {
        this.getTopic()
      } else if (val.name == 'seven') {
        this.getResourceChannel()
      } else if (val.name == 'sixeth') {
        this.orginRule()
      } else if (val.name == 'eighth') {
        this.isreload++
      } else if (val.name != 'fourth') {
        window.clearInterval(this.subtimer)
        this.subtimer = null
      }
    },
    async getAllunit() {
      this.allunit = []
      const { results } = await getAllunit('unit', 200)
      this.allunit = results.concat([])
      this.allunit.unshift({
        data: {
          Name: '无',
          Symbol: '',
        },
      })
    },
    getTopic() {
      this.$get_object('Product', this.productId)
        .then((resultes) => {
          if (resultes) {
            this.topicData = resultes.topics.concat(this.topic)
          }
        })
        .catch((err) => {
          this.$baseMessage('请求出错', err.error, 3000)
        })
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
        console.log(res)
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'vab-hey-message-success'
        )
        loading.close()
        this.$downBinary(res)
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
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
        console.log(error)
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
        console.log(res)
        if (res)
          this.$baseMessage(
            this.$translateTitle('user.Save the template successfully'),
            'success',
            'vab-hey-message-success'
          )
        else
          this.$baseMessage(
            this.$translateTitle('user.Save the template error'),
            'error',
            'vab-hey-message-error'
          )
        loading.close()
      } catch (error) {
        console.log(error)
        loading.close()
        this.$baseMessage(
          this.$translateTitle('user.Save the template error'),
          'error',
          'vab-hey-message-error'
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
          console.log(err)
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
              message: '热加载成功',
              type: 'success',
            })
            if (data.length == this.multipleSelection.length) {
              this.protoldialog = false
            }
          })
          .catch((error) => {
            this.$message({
              message: error,
              type: 'error',
            })
          })
      }
    },

    // 物接入选择通道
    showAllChannel(label = '') {
      console.log(this.allChannelstart, this.allChannellength)
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
          console.log(e)
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
          console.log(e)
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
          console.log(e)
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
          console.log(e)
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
      // console.log(row,channelrow)
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
    addData() {
      // console.log(channelrow)
      channelrow.datamodel = editorcreate.getValue()
      const params = {
        config: channelrow,
      }
      this.$update_object(
        'Channel',
        this.rproductdetailesourcechannelid,
        params
      ).then(
        (response) => {
          if (response) {
            this.$message('添加成功')
          }
        },
        (error) => {
          returnLogin(error)
        }
      )
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
    submitForm(sizeForm) {
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
        let obj1 = {
          dataType: {
            type: sizeForm.type.toLowerCase(),
            specs: {
              max: sizeForm.endnumber,
              min: sizeForm.startnumber,
              step: sizeForm.step,
              precision: Number(sizeForm.precision),
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
            specs: {},
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
      delete obj.index

      console.log('obj', obj)
      let data = {
        item: obj,
        productid: this.productId,
      }

      // 检测到
      if (this.wmxSituation == '新增') {
        // console.log("新增");
        // this.productdetail.thing.properties.unshift(obj)
        postThing(data).then((res) => {
          console.log('新增', res)
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '新增成功',
            })
            this.getProDetail()
          } else {
            this.$message({
              type: 'warning',
              message: '新增失败' + res.msg,
            })
          }
        })
      } else if (this.wmxSituation == '编辑') {
        // console.log("编辑" + obj);
        // this.productdetail.thing.properties[this.modifyIndex] = obj
        putThing(data).then((res) => {
          console.log('编辑', res)
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '编辑成功',
            })
            this.getProDetail()
          } else {
            this.$message({
              type: 'warning',
              message: '编辑失败' + res.msg,
            })
          }
        })
      }
      this.wmxdialogVisible = false
      // const params = {
      //   thing: this.productdetail.thing,
      // }
      // this.$update_object('Product', this.productId, params)
      //   .then((resultes) => {
      //     if (resultes) {
      //       this.$message({
      //         type: 'success',
      //         message: '添加成功',
      //       })
      //       this.getProDetail()
      //       this.wmxdialogVisible = false
      //     }
      //   })
      //   .catch((e) => {
      //     console.log(e)
      //   })
    },
    createProperty() {
      this.setSizeForm(this.getFormOrginalData())
      this.wmxdialogVisible = true
      this.wmxSituation = '新增'
    },
    // 物模型修改submitForm
    wmxDataFill(rowData, index) {
      this.modifyIndex = index
      // console.log("rowData ", rowData);
      this.wmxdialogVisible = true
      this.wmxSituation = '编辑'
      var obj = {}
      // 提交之前需要先判断类型
      if (
        ['float', 'double', 'int', 'long'].indexOf(rowData.dataType.type) != -1
      ) {
        obj = {
          name: rowData.name,
          devicetype: rowData.devicetype,
          type: rowData.dataType.type,
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
          collection: '',
          control: '',
          strategy: '',
          required: true,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
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
          // rowData.dataForm.
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
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: false,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
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
          // rowData.dataForm.
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
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: false,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
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
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: true,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
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
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: true,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
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
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: true,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
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
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: true,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
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
          iscount: this.$objGet(rowData, 'dataForm.iscount'),
          countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
          countround: this.$objGet(rowData, 'dataForm.countround'),
          countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
          required: true,
          ico: rowData.ico,
          isread: rowData.accessMode,
          isshow: rowData.isshow,
          identifier: rowData.identifier,
          editdatatype: true,
        }
      }
      this.setSizeForm(obj)
      // console.log('this.sizeForm', this.sizeForm)
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
      console.log(item, index)
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
    preserve() {
      const params = {
        thing: JSON.parse(editor1.getValue()),
      }
      this.$update_object('Product', this.productId, params)
        .then((resultes) => {
          if (resultes) {
            this.$message({
              type: 'success',
              message: '添加成功',
            })
            this.schemadialogVisible = false
          }
        })
        .catch((e) => {
          console.log(e)
        })
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
          console.log(e)
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
      ;(this.editableTabsValue = this.wmxData[0].identifier),
        (this.activeIndex = this.wmxData[0].identifier),
        (this.editableTabs = []),
        (this.editorList = []),
        (this.tabIndex = 1),
        (this.ed3isShow = false)
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
          // console.log(this.wmxData);
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
      // console.log(tab.label);
    },
    // 左边切换,先判断是否添加过
    menuTabClick(item, itemPos) {
      // console.log(item)
      // 先判断是否添加过
      this.activeIndex = item.identifier
      const tabs = this.editableTabs
      let isAdd = false
      let mIndex = 0
      tabs.forEach((tab, index) => {
        if (tab.name === item.identifier) {
          // console.log("tab.name   " + tab.name, "   item.identifier   " + item.identifier, "   index  " + index);
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
        // console.log("this.editorList ==  " + this.editorList.length)
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
    onSaveTap(index) {
      const leftPos = this.editableTabs[index].leftItemPos
      this.productdetail.thing.properties[leftPos].dataForm.collection =
        this.editorList[index].getValue()
      const params = {
        thing: this.productdetail.thing,
      }
      this.$update_object('Product', this.productId, params)
        .then((resultes) => {
          if (resultes) {
            this.$message({
              type: 'success',
              message: '添加成功',
            })
            this.getProDetail()
            // this.$refs[formName].resetFields();
            //  this.wmxdialogVisible = false;
          }
        })
        .catch((e) => {
          console.log(e)
        })
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
      // console.log(this.wmxData[leftPos].dataForm.collection)

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
    // 得到产品详情
    getProDetail() {
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
      this.$get_object('Product', this.productId)
        .then((response) => {
          // console.log("response", response)
          if (response) {
            this.productInfo = _.merge(response, {
              decoder: { code: '' },
              thing: { properties: [] },
              config: { parser: [], profile: [], basedate: { params: [] } },
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
            // console.log('=====', this.wmxData)
            this.wmxData = []
            this.wmxDataBk = []
            this.wmxData = this.productdetail.thing.properties.filter(
              (item, index) => {
                item.index = index
                return item.name && item.dataType
              }
            )
            this.wmxDataBk = this.wmxData
            console.log('=====', this.wmxData)
            // let array = []
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
          console.log('err', err)
          this.$baseMessage('请求出错', err.error, 3000)
        })
    },

    // 查询设备总数
    async queryDeviceCount(productId) {
      this.form.ProductAll = await getDeviceCountByProduct(productId)
    },
    // 产品修改
    handelUpdate(event, row) {
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
      this.$update_object('Product', this.productId, params)
        .then((resultes) => {
          if (resultes) {
            this.$message({
              type: 'success',
              message: '修改成功',
            })
            this.dynamicReg = !isopen
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    wmxhandleClose() {
      this.wmxdialogVisible = false
      this.setSizeForm(this.getFormOrginalData())
    },
    // 协议编辑
    protol() {
      var log = ''
      Compile(Base64.encode(editor.getValue()))
        .then((res) => {
          if (res) {
            this.$message({
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
          console.log(e)
        })
    },
    subAce(formName, istrue) {
      this.$refs[formName].validate((valid) => {
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
          this.$update_object('Product', this.productId, params)
            .then((res) => {
              if (this.issub == false) {
                this.$message({
                  type: 'success',
                  message: '保存成功',
                })
                if (istrue == true) {
                  isupdatetrue += '保存成功'
                  editor2.setValue(isupdatetrue)
                }
              }
              this.issub = true
            })
            .catch((e) => {
              console.log(e)
            })
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
                            type: 'success',
                            message: '保存到公共协议库成功',
                          })
                        }
                      })
                      .catch((e) => {
                        console.log(e)
                      })
                  }
                })
              }
            })
            .catch((e) => {
              console.log(e)
            })
        } else {
          this.$message({
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
          console.log(e)
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
        this.wmxData = this.wmxDataBk
      } else {
        this.devicetype = row.name
        this.wmxData = this.wmxDataBk.filter(
          (item) => item.devicetype == row.name
        )
        this.wmxstart = 1
      }
    },
    handleChange(value, direction, movedKeys) {
      // console.log(value, direction, movedKeys);
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
      this.$query_object('Dict', params).then((res) => {
        const results = res.results
        if (results && results[0].data.Ability) {
          this.TypeInstall(
            this.productdetail.thing.properties,
            results[0].data.Ability
          )
          const params = {
            thing: this.productdetail.thing,
          }
          this.$update_object('Product', this.productId, params)
            .then((resultes) => {
              if (resultes) {
                this.$message({
                  type: 'success',
                  message: '添加成功',
                })
                this.getProDetail()
              }
            })
            .catch((e) => {
              console.log(e)
            })
        } else {
          console.log('此选项没有属性功能')
        }
      })
    },
    /* 删除物模型*/
    deletewmx(row) {
      // this.productdetail.thing.properties.splice(
      //   (this.wmxstart - 1) * this.wmxPageSize + index,
      //   1
      // )
      const params = {
        productid: this.productId,
        item: row,
      }
      deleteThing(params).then((res) => {
        console.log('删除', res)
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功',
          })
          this.getProDetail()
        } else {
          this.$message({
            type: 'warning',
            message: '删除失败 ' + res.msg,
          })
        }
      })
    },
    wmxSizeChange(val) {
      this.wmxstart = 1
      this.wmxPageSize = val
    },
    wmxCurrentChange(val) {
      this.wmxstart = val
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
    subProTopic(row) {
      this.subdialog = true
      this.subdialogid = row.id
      this.channelname = row.id
      setTimeout(() => {
        subdialog = ace.edit('subdialog')
        subdialog.session.setMode('ace/mode/text') // 设置语言
        subdialog.setTheme('ace/theme/gob') // 设置主题
        subdialog.setReadOnly(true)
        subdialog.setOptions({
          enableBasicAutocompletion: false,
          enableSnippets: true,
          enableLiveAutocompletion: true, // 设置自动提示
        })
      })
      var info = {
        topic: 'log/channel/' + row.id + '/' + this.productId,
        qos: 2,
      }
      var channeltopic = new RegExp(
        'log/channel/' + row.id + '/' + this.productId
      )
      var submessage = ''
      var _this = this
      Websocket.add_hook(channeltopic, function (Msg) {
        // 判断长度
        if (subdialog.session.getLength() >= 1000) {
          submessage = ''
        } else {
          submessage += _this.nowtime() + Msg + `\n`
        }
        subdialog.setValue(submessage)
        subdialog.gotoLine(subdialog.session.getLength())
      })
      // 订阅
      var text0 = JSON.stringify({
        action: 'start_logger',
      })
      Websocket.subscribe(info, function (res) {
        if (res.result) {
          // console.log(info);
          // console.log("订阅成功");
          var sendInfo = {
            topic: 'channel/' + row.id + '/' + _this.productId,
            text: text0,
            retained: true,
            qos: 2,
          }
          Websocket.sendMessage(sendInfo)
          _this.subdialogtimer = window.setInterval(() => {
            Websocket.sendMessage(sendInfo)
          }, 600000)
        }
      })
    },
    // 关闭弹窗操作
    handleCloseSubdialog() {
      var text0 = JSON.stringify({
        action: 'stop_logger',
      })
      var sendInfo = {
        topic: 'channel/' + this.subdialogid + '/' + this.productId,
        text: text0,
        retained: true,
        qos: 2,
      }
      Websocket.sendMessage(sendInfo)
      this.subdialog = false
      window.clearInterval(this.subdialogtimer)
      this.subdialogtimer = null
    },
    // 停止topic刷新
    stopsub(value) {
      var text0
      if (value == false) {
        // this.subaction = 'start'
        text0 = JSON.stringify({
          action: 'stop_logger',
        })
      } else {
        // this.subaction = 'stop'
        text0 = JSON.stringify({
          action: 'start_logger',
        })
      }
      var sendInfo = {
        topic: 'channel/' + this.subdialogid + '/' + this.productId,
        text: text0,
        retained: true,
        qos: 2,
      }
      Websocket.sendMessage(sendInfo)
    }, // topic增加
    subTopic(formName, isupdated) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var Topic =
            'thing/' + this.productId + '/${DevAddr}/' + this.topicform.topic

          this.$get_object('Product', this.productId).then((resultes) => {
            var addTopic = {
              topic: Topic,
              type: this.topicform.type,
              desc: this.topicform.desc,
            }
            var arr = []
            arr.push(addTopic)
            const params = {}
            if (isupdated == -1) {
              arr = arr.concat(resultes.topics)
              params.topics = arr
            } else {
              var topicupdated = resultes.topics.concat([])
              topicupdated[isupdated] = addTopic
              params.topics = topicupdated
            }
            this.$update_object('Product', this.productId, params)
              .then((response) => {
                if (response) {
                  this.$message({
                    type: 'success',
                    message: '成功',
                  })
                  this.topicdialogVisible = false
                  this.$refs[formName].resetFields()
                  ;(this.topicform.isupdated = -1), (this.topicform.topic = '')
                  this.topicform.desc = ''
                  this.handleClick({
                    name: 'second',
                  })
                }
              })
              .catch((e) => {
                console.log(e)
              })
          })
        } else {
          console.log('error submit!!')
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
      this.topicform.topic = row.topic.substr(row.topic.lastIndexOf('/') + 1)
      this.topicform.type = row.type
      this.topicform.desc = row.desc
      this.topicdialogVisible = true
      this.topicform.isupdated = index
    },
    async deletetopic(scope, index) {
      const { topics } = await this.$get_object('Product', this.productId)
      if (topics) {
        // scope._self.$refs[`popover-${scope.$index}`].doClose();
        var topic = topics.concat([])
        topic.splice(index, 1)
        const params = {
          topics: topic,
        }
        const $update_object = this.$update_object(
          'Product',
          this.productId,
          params
        )
        // console.log($update_object)
        this.$message({
          type: 'success',
          message: '删除成功',
        })
      }
      this.getTopic()
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
