import lowcodeDesign from '@/views/CloudFunction/lowcode/components/index'
import { queryDevice, delDevice, putDevice } from '@/api/Device'
import { postHead } from '@/api/Opc'
import { postreport } from '@/api/Report'
import VabDraggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import { queryProduct } from '@/api/Product'
import { queryView } from '@/api/View'
import { getCardDevice } from '@/api/Device/index.js'
import {
  generatereport,
  postDrawxnqx,
  queryEvidence,
  postEvidence,
  putEvidence,
} from '@/api/Evidence'
import { getDevice } from '../../../api/Device'
import moment from 'moment'
export default {
  name: 'TaskIndex',
  filters: {
    filterVal(val) {
      if (val || val == 0) {
        return val
      } else {
        return '--'
      }
    },
  },
  components: {
    VabDraggable,
    lowcodeDesign,
  },
  data() {
    return {
      machinelist: {},
      historyEvidenceid: '',
      nowTime: window.datetime,
      historyEvidence: [],
      historyInfo: {},
      thirdtbKey: moment(new Date()).valueOf(),
      original: {},
      collectionInfo: {},
      drawxnqxPath: '',
      thingdata: [],
      realtimedata: [],
      thingcolumns: [],
      historycolumns: [],
      visible: false,
      router: '',
      topicKey: '',
      activeName1: 'first',
      activeName: this?.$route?.query?.tabs
        ? this.$route.query.tabs == 'examination'
          ? 'examination'
          : 'forensics'
        : 'forensics',
      officeapps: '',
      dialogVisible: false,
      paginations: { layout: 'total, sizes, prev, pager, next, jumper' },
      queryPayload: {
        excludeKeys: 'data',
        include: '',
        order: '-createdAt',
        limit: 10,
        skip: 0,
        count: 'objectId',
      },
      lowcodeId: '',
      loading: false,
      options: [
        {
          value: 'Underreview',
          label: '审核中',
        },
        {
          value: 'finishreview',
          label: '审核完成',
        },
      ],
      rules: {
        testbed: [
          {
            required: true,
            message: '请选择测试台体',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: '请输入报告名称',
            trigger: 'blur',
          },
        ],
        templatename: [
          {
            required: true,
            message: '请选择报告模板',
            trigger: 'change',
          },
        ],
      },
      activePopShow: false,
      border: true,
      height: 1000 - 20,
      stripe: true,
      lineHeight: 'medium',
      checkList: [
        'mission name',
        'Inspection number',
        'Inspection template',
        'testbed',
        'Trade Names',
        'Creation time',
        'Starting time',
        'end time',
      ],
      columns: [
        {
          label: 'mission name',
          width: 'auto',
          prop: 'name',
          sortable: true,
        },
        // {
        //   label: 'Inspection number',
        //   width: 'auto',
        //   prop: 'devaddr',
        //   sortable: true,
        //   disableCheck: true,
        // },
        {
          label: 'Inspection template',
          width: 'auto',
          prop: 'profile.wordtemplatename',
          sortable: true,
        },
        {
          label: 'testbed',
          width: 'auto',
          prop: 'profile.testbed',
          sortable: true,
        },
        // {
        //   label: 'Creation Time',
        //   width: 'auto',
        //   prop: 'createdAt',
        //   sortable: true,
        // },
        {
          label: 'Starting time',
          width: 'auto',
          prop: 'starttime',
          sortable: true,
        },
        {
          label: 'end time',
          width: 'auto',
          prop: 'endtime',
          sortable: true,
        },
      ],
      list: { forensics: [], examination: [] },
      listLoading: true,
      queryForm: {
        pageSizes: [10, 20, 30, 50],
        limit: 10,
        order: '-createdAt',
        keys: 'count(*)',
        total: 0,
        skip: 0,
        pageNo: 1,
        pageSize: 10,
        name: '',
      },
      categorylist: [],
      wordtemplist: [],
      grouplist: [],
      ruleForm: {
        name: '',
        templatename: '',
        testbed: '',
        testbedid: '',
        templatenameid: '',
      },
    }
  },
  computed: {
    ...mapGetters({
      currentDepartment: 'user/currentDepartment',
    }),
    dragOptions() {
      return {
        animation: 600,
        group: 'description',
      }
    },
    finallyColumns() {
      return this.columns.filter((item) => this.checkList.includes(item.label))
    },
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.historyEvidence = []
    this.historyInfo = {}
    this.router = this.$dgiotBus.router(this.$route.fullPath)
    this.$dgiotBus.$off('lowcodeClose')
    this.$dgiotBus.$on('lowcodeClose', (_) => {
      this.fetchData()
    })
    this.timer = setInterval(() => {
      this.datetime()
    }, 1000)
  },
  methods: {
    tabHandleClick(tab) {
      switch (tab.name) {
        case 'first':
          break
        case 'second':
          break
      }
    },
    getCardDevice(deviceid) {
      var vm = this
      getCardDevice(deviceid)
        .then((response) => {
          vm.machinelist = {}
          if (response?.data) {
            vm.renderCard(response.data)
          }
        })
        .catch((error) => {
          dgiotlog.log('update error 清除timer', error)
        })
    },
    async subRealtimedata(params) {
      let subtopic = `thing/${params.parentId.objectId}/realtimedata/post` // 设备实时数据topic
      let router = this.$dgiotBus.router(location.href + this.$route.fullPath)
      let topicKey = this.$dgiotBus.topicKey(router, subtopic) // dgiot-mqtt topicKey 唯一标识
      try {
        // 订阅mqtt
        this.$dgiotBus.$emit('MqttSubscribe', {
          router: router,
          topic: subtopic,
          qos: 0,
          ttl: 1000 * 60 * 60 * 3,
        })
        // mqtt 消息回调
        console.groupCollapsed(
          `%c mqtt 订阅日志`,
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.log('topic:', subtopic)
        console.log('router:', router)
        console.groupEnd()

        this.$dgiotBus.$off(topicKey) // dgiotBus 关闭事件
        this.$dgiotBus.$on(topicKey, (mqttMsg) => {
          // mqtt 消息回调
          console.groupCollapsed(
            `%c mqttMsg消息回调`,
            'color:#009a61; font-size: 28px; font-weight: 300'
          )
          console.log(mqttMsg)
          console.log(Base64.decode(mqttMsg.payload))
          console.log(JSON.parse(Base64.decode(mqttMsg.payload)).data)
          console.log('Base64.decode(payload):', Base64.decode(mqttMsg.payload))
          console.groupEnd()
          const { data = [] } = JSON.parse(Base64.decode(mqttMsg.payload))
          if (data) {
            this.renderCard(data)
          } else {
            this.getCardDevice()
          }
        })
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    renderCard(resData) {
      var vm = this
      let array = []
      resData.forEach((item) => {
        if (item.devicetype) {
          array.push(item.devicetype)
        }
      })
      array = _.uniqBy(array)
      let machine = {}
      array.forEach((item) => {
        let arr = []
        resData.forEach((item1) => {
          if (item == item1.devicetype) {
            arr.push(item1)
          }
        })
        machine[item] = arr
      })
      vm.machinelist = machine
      vm.thirdtbKey = moment(new Date()).valueOf()
    },
    datetime() {
      this.nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    },
    async paginationQuery(queryPayload) {
      this.queryPayload = queryPayload
    },
    async categoryChange(val) {
      this.$set(this.ruleForm, 'templatenameid', val.objectId)
    },
    testbedChange(val) {
      this.$set(this.ruleForm, 'testbedid', val.objectId)
      console.log(
        'src/views/CloudTest/js/task.js',
        'this.ruleForm',
        this.ruleForm,
        val.objectId
      )
    },
    async getwordtemp() {
      const params = {
        skip: 0,
        where: {
          netType: 'Evidence',
          nodeType: 1,
        },
      }
      const { results = {} } = await queryProduct(params)
      this.categorylist = results
    },
    async getgroup() {
      const params = {
        where: {
          'detail.category': '84abda3154',
        },
      }
      const { results } = await queryDevice(params)
      this.grouplist = results
    },
    /**
     * @Author: dext7r
     * @Date: 2021-12-21 11:13:03
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async deleteHistory(row, index) {
      try {
        await this.historyEvidence.splice(index, 1)
        console.log(
          'deleteHistory',
          row,
          index,
          this.historyEvidence,
          this.historyEvidence.length
        )
        await this.saveHistorical(
          this.collectionInfo,
          this.thingdata,
          this.historyEvidence,
          false
        )
        await this.saveThingdata()
        // this.featHistoryEvidence(this.collectionInfo.objectId)
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
     * @Author: dext7r
     * @Date: 2021-1
     * 2-20 17:33:31
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async saveThingdata() {
      try {
        const Evidence = {
          original: this.historyInfo.original,
        }
        const res = await putEvidence(this.historyInfo.objectId, Evidence)
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    submitForm(formName) {
      const aclKey1 = 'role' + ':' + this.currentDepartment.name
      const aclObj = {}
      aclObj[aclKey1] = {
        read: true,
        write: true,
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const task = {
            profile: {
              testbedid: this.ruleForm.teestbedid,
              testbed: this.ruleForm.testbed.name,
              wordtemplatename: this.ruleForm.templatename.name,
              reportId: this.ruleForm.templatenameid,
              identifier: 'inspectionReportTemp',
              step: 0,
              // 0 1 2 3 4
              // 开始 取证 完成 生成报告
            },
            parentId: this.ruleForm.testbedid,
            name: this.ruleForm.name,
            product: this.ruleForm.templatenameid,
          }
          const loading = this.$baseColorfullLoading(1)
          this.activePopShow = false
          await postreport(task)
          this.fetchData()
          loading.close()
        } else {
          console.log('error submit!!')
          return false
        }
        this.ruleForm = {
          name: '',
          templatename: '',
          testbed: '',
          testbedid: '',
          templatenameid: '',
        }
      })
    },
    /**
     * @Author: dext7r
     * @Date: 2021-12-21 09:34:37
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description: 查询历史存证
     */
    async featHistoryEvidence(taskid) {
      this.historyEvidence = []
      try {
        const params = {
          order: '-createdAt',
          skip: 0,
          where: {
            'original.taskid': taskid,
            'original.type': 'avgs',
          },
        }
        const loading = this.$baseColorfullLoading()
        const { results = [] } = await queryEvidence(params)
        if (results?.length) {
          this.historyEvidence = results[0].original.avgs ?? []
          this.collectionInfo.profile.historicaldata = this.historyEvidence
          this.historyInfo = results[0]
          this.drawxnqxPath = results[0].original.path ?? ''
        }
        this.historycolumns = _.filter(this.thingcolumns, function (item) {
          return item.prop !== 'timestamp'
        })
        // await this.drawxnqx(this.collectionInfo.objectId, this.historyEvidence)
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'vab-hey-message-success'
        )
        loading.close()
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
     * @Date: 2021-12-15 18:58:04
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async forensics(row) {
      try {
        await this.$router.push({
          path: '/cloudTest/evidence',
          query: {
            taskid: row.objectId,
            suite: 0,
            state: 'preview',
            step: 1,
            back: row.profile.step,
            message: row.profile.message,
          },
        })
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
     * @Date: 2021-11-26 18:59:54
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    taskEnd(row) {
      this.$baseConfirm(
        this.$translateTitle(
          'Maintenance.Are you sure you want to end the current mission'
        ),
        null,
        async () => {
          try {
            const loading = this.$baseColorfullLoading()
            const params = {
              profile: _.merge(row.profile, {
                step: 4,
                endtime: moment(new Date()).format('x'),
              }),
            }
            const res = await putDevice(row.objectId, params)
            this.fetchData()
            loading.close()
          } catch (error) {
            console.log(error)
            this.$baseMessage(
              this.$translateTitle('alert.Data request error') + `${error}`,
              'error',
              'vab-hey-message-error'
            )
          }
        }
      )
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-26 18:38:00
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    taskStart(row) {
      let _this = this
      _this.$baseConfirm(
        _this.$translateTitle(
          'Maintenance.Are you sure you want to start the current mission'
        ),
        null,
        async () => {
          try {
            const loading = _this.$baseColorfullLoading()
            await _this.startOpc(row)
            await generatereport(row.objectId)
            const params = {
              profile: _.merge(row.profile, {
                step: 1,
                starttime: moment(new Date()).format('x'),
              }),
            }
            const res = await putDevice(row.objectId, params)
            _this.fetchData()
            loading.close()
          } catch (error) {
            console.log(error)
            _this.$baseMessage(
              this.$translateTitle('alert.Data request error') + `${error}`,
              'error',
              'vab-hey-message-error'
            )
          }
        }
      )
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-26 17:08:39
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async downDocx(url) {
      try {
        const ele = document.createElement('a')
        ele.setAttribute('href', this.$FileServe + url) //设置下载文件的url地址
        ele.setAttribute('download', 'download') //用于设置下载文件的文件名
        ele.click()
        // window.location.href = this.$FileServe + url
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
     * @Date: 2021-11-29 17:13:25
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async handleUnderreview(taskId) {
      try {
        this.$router.push({
          path: '/cloudTest/evidence',
          query: {
            taskid: taskId,
            suite: 0,
            state: 'preview',
            step: 3,
          },
        })
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
     * @Date: 2021-11-26 17:05:16
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async handleReport(row) {
      if (row.profile.step == 4 && row.profile.docx) {
        const fileUrl = this.$FileServe + row.profile.docx
        this.dialogVisible = true
        this.officeapps =
          'https://view.officeapps.live.com/op/view.aspx?src=' + fileUrl
        return false
      }
      try {
        const loading = this.$baseColorfullLoading()
        const { code, msg, path } = await generatereport(row.objectId)
        if (code == 200 && path) {
          this.$baseMessage(
            this.$translateTitle('alert.Data request successfully'),
            'success',
            'vab-hey-message-success'
          )
          setTimeout(() => {
            const params = {
              profile: _.merge(row.profile, {
                step: 4,
                docx: path,
              }),
            }
            const _res = putDevice(row.objectId, params)
            const fileUrl = this.$FileServe + path
            this.dialogVisible = true
            this.officeapps =
              'https://view.officeapps.live.com/op/view.aspx?src=' + fileUrl
          }, 1200)
        } else {
          this.$baseMessage(`${msg}`, 'error', 'vab-hey-message-error')
        }
        loading.close()
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    async handleManagement(row) {
      this.$refs['lowcodeDesign'].withHeader = true
      localStorage.setItem('parse_objectid', row.objectId)
      const params = {
        limit: 1,
        where: { type: 'amis', key: row.objectId },
      }
      const { results } = await queryView(params)
      console.log(results)
      this.lowcodeId = results[0].objectId
      this.$dgiotBus.$emit('lowcodePreview', results[0])
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-24 16:17:16
     * @LastEditors:
     * @param 删除任务
     * @return {Promise<void>}
     * @Description:
     */
    async handleDelete(taskid) {
      try {
        const loading = this.$baseColorfullLoading()
        const res = await delDevice(taskid)
        this.$baseMessage(
          this.$translateTitle('user.successfully deleted'),
          'success',
          'vab-hey-message-success'
        )
        loading.close()
        this.fetchData()
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('user.error deleted') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    async fetchData() {
      this.list = { forensics: [], examination: [] }
      this.getwordtemp()
      this.getgroup()
      // const params = {
      //   limit: args.limit,
      //   order: args.order,
      //   skip: this.queryForm.name.length ? 0 : args.skip,
      //   keys: args.keys,
      //   include: 'product,parentId',
      //   where: {
      //     'profile.identifier': 'inspectionReportTemp',
      //   },
      // }
      this.queryPayload.include = 'product,parentId'
      this.queryPayload.where = {
        'profile.identifier': 'inspectionReportTemp',
        name: this.queryForm.name.length
          ? { $regex: this.queryForm.name }
          : { $ne: null },
        // 'profile.step': { $lte: 3 },
        'profile.step': { $regex: '' + '^(-1|[0-9]\\d*)$' },
      }
      this.listLoading = true
      const { count = 0, results = [] } = await queryDevice(this.queryPayload)
      if (this.$refs['forensics']) this.$refs['forensics'].ination.total = count
      this.list.forensics = results
      results.forEach((item) => {
        if (!item.profile.step) item.profile.step = 0
        item.endtime = item.profile.endtime
          ? moment(Number(item.profile.endtime)).format('YYYY-MM-DD HH:mm:ss')
          : ''
        item.starttime = item.profile.starttime
          ? moment(Number(item.profile.starttime)).format('YYYY-MM-DD HH:mm:ss')
          : ''
        item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      })
      this.listLoading = false
    },
    /**
     * @Author:
     * @Date: 2021-12-22 17:26:30
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async visibleInfo(params) {
      let _this = this
      _this.collectionInfo = params
      _this.getCardDevice(params.parentId.objectId)
      _this.subRealtimedata(params)
      try {
        const thingcolumns = {}
        const items = []
        _this.thingdata = []
        _this.realtimedata = []
        _this.thingcolumns = []
        if (params.basedata) {
          /**
           * @description 判断下发组态topic的item
           * @description 必须以 标识符 dgiot_testing_equipment_ 开头
           */
          for (let key in params.basedata) {
            if (key.indexOf('dgiot_testing_equipment_') == 0) {
              const splitColumns = key.split('dgiot_testing_equipment_')[1]
              thingcolumns[`${splitColumns}`] = splitColumns
              items.push(params.basedata[key])
            }
          }
        }
        // mqtt 消息回调
        console.groupCollapsed(
          '%c send mqttMsg items',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.log(items)
        console.groupEnd()
        const { head = {} } = await postHead({
          items: items,
          productid: params.parentId.product.objectId,
        })
        const columns = !_.isEmpty(head) ? head : thingcolumns
        for (let key in columns) {
          _this.thingcolumns.push({
            prop: key,
            label: columns[key],
          }) // 设置el-table 对应的键值
        }

        console.log(' _this.thingcolumns', _this.thingcolumns)
        _this.thingcolumns.unshift({
          prop: 'timestamp',
          label: '时间',
        }) // 追加el-table 对应的键值
        _this.featHistoryEvidence(this.collectionInfo.objectId)
        _this.visible = true
      } catch (error) {
        console.log(error)
        _this.$baseMessage(
          _this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    /**
     * @Author: dext7r
     * @Date: 2021-12-23 16:53:51
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async startOpc(row) {
      try {
        var items = []
        const { basedata = [] } = await getDevice(row.objectId)
        if (!_.isEmpty(basedata)) {
          for (let key in basedata) {
            if (key.indexOf('dgiot_testing_equipment_') == 0)
              items.push(basedata[key])
          }
        }
        // mqtt 消息回调
        console.groupCollapsed(
          '%c send mqttMsg items',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.log(items)
        console.groupEnd()
        const pubTopic = `/${row.parentId.product.objectId}/${row.parentId.devaddr}/device/event` // 读取opc属性topic
        const message = {
          cmd: 'opc_items',
          groupid: row.parentId.objectId, //'设备ID',
          opcserver:
            basedata.dgiot_testing_opcserver ?? 'Kepware.KEPServerEX.V6',
          items: items, //要读取到属性列表
        } // 下发的消息内容
        // mqtt 消息回调
        console.groupCollapsed(
          '%c 下发消息',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.log(message)
        console.log(pubTopic)
        console.groupEnd()
        await this.$dgiotBus.$emit(
          `MqttPublish`,
          pubTopic,
          JSON.stringify(message),
          0,
          false
        ) // 开始任务
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
     * @Author: dext7r
     * @Date: 2021-12-16 14:46:53
     * @LastEditors: dext7r
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async collection(params) {
      let _this = this
      _this.collectionInfo = params
      _this.featHistoryEvidence(this.collectionInfo.objectId)
      try {
        const thingcolumns = {}
        const items = []
        _this.thingdata = []
        // _this.thingcolumns = []
        const { basedata = [] } = await getDevice(params.objectId)
        if (!_.isEmpty(basedata)) {
          /**
           * @description 判断下发组态topic的item
           * @description 必须以 标识符 dgiot_testing_equipment_ 开头
           */
          for (let key in basedata) {
            if (key.indexOf('dgiot_testing_equipment_') == 0)
              items.push(basedata[key])
          }
        }
        // mqtt 消息回调
        console.groupCollapsed(
          '%c send mqttMsg items',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.log(items)
        console.groupEnd()
        _this.subtopic = `topo/${params.parentId.product.objectId}/${params.parentId.devaddr}/post` // 组态上报topic
        const pubTopic = `/${params.parentId.product.objectId}/${params.parentId.devaddr}/device/event` // 读取opc属性topic
        const message = {
          cmd: 'opc_report', // 采集条数
          duration: Number(basedata.dgiot_sampling_parametric_frequency) ?? 5, //条数
          groupid: params.parentId.objectId,
        }
        console.groupCollapsed(
          `%c 发送采集消息`,
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.log('message', message)
        console.log('pubTopic', pubTopic)
        console.groupEnd()
        _this.$dgiotBus.$emit(
          `MqttPublish`,
          pubTopic,
          JSON.stringify(message),
          0,
          false
        ) // 开始采集
        _this.topicKey = _this.$dgiotBus.topicKey(_this.router, _this.subtopic) // dgiot-mqtt topicKey 唯一标识
        _this.$dgiotBus.$off(_this.topicKey) // dgiotBus 关闭事件
        _this.$dgiotBus.$on(_this.topicKey, (mqttMsg) => {
          // mqtt 消息回调
          console.groupCollapsed(
            `%c mqttMsg消息回调 \n${_this.topicKey}`,
            'color:#009a61; font-size: 28px; font-weight: 300'
          )
          console.log(mqttMsg)
          console.log('payload:', mqttMsg.payload)
          console.groupEnd()
          // _this.thingdata = []
          // this.realtimedata = []
          if (mqttMsg?.payload) {
            const { thingdata = {}, timestamp } = JSON.parse(mqttMsg.payload)
            thingdata.timestamp = moment(Number(timestamp)).format(
              'YYYY-MM-DD HH:mm:ss'
            )
            if (!_.isEmpty(thingdata) && thingdata?.dgiotcollectflag == 0) {
              console.log(thingdata)
              _this.thingdata[0] = thingdata // 只显示一条
              // _this.thingdata.unshift(thingdata) // 最新数据放在最前面
            } else {
              //实时数据
              // _this.realtimedata.push(thingdata) // 只显示一条
              _this.realtimedata.unshift(thingdata) // 最新数据放在最前面
            }
            // _this.getSummaries({ columns: [], data: _this.thingdata }) // 计算平均值
          }
        })
        console.log('_this.thingdata', _this.thingdata)
        _this.$dgiotBus.$emit('MqttSubscribe', {
          router: _this.router,
          topic: _this.subtopic,
          qos: 0,
          ttl: 1000 * 60 * 60 * 3,
        })
      } catch (error) {
        console.log(error)
        _this.$baseMessage(
          _this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
      _this.subRealtimedata(params)
    },
    /**
     * @Author: dext7r
     * @Date: 2021-12-23 10:11:02
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async saveHistorical(collectionInfo, thingdata, historyEvidence, type) {
      const _profile = {
        profile: _.merge(collectionInfo.profile, {
          historicaldatacolumns: _.filter(thingdata, function (item) {
            return item.prop !== 'timestamp'
          }),
          historicaldata: historyEvidence,
          drawxnqxPath: this.drawxnqxPath,
        }),
      }
      console.log(collectionInfo, _profile)
      if (type) this.visible = false
      try {
        const loading = this.$baseColorfullLoading()
        const results = await putDevice(collectionInfo.objectId, _profile)
        console.log(results)
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'vab-hey-message-success'
        )
        loading.close()
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
     * @Author: dext7r
     * @Date: 2021-12-20 10:51:49
     * @LastEditors: dext7r
     * @param
     * @return {Promise<void>}
     * @Description: 计算平均值
     */
    async drawxnqx(taskid, thingdata) {
      this.drawxnqxPath = ''
      try {
        const data = thingdata // 要處理下
        const params = {
          data: data,
          taskid: taskid,
        }
        const {
          code,
          error = '',
          original = {},
          evidenceid = '',
        } = await postDrawxnqx(params)
        if (Number(code) == 200) {
          this.historyEvidenceid = evidenceid ?? ''
          this.historyEvidence = original.avgs ?? []
          this.drawxnqxPath = `${original.path}?t=${moment(new Date()).format(
            'x'
          )}`
          this.original = original ?? {}
          // https://www.lodashjs.com/docs/lodash.filter
          this.historycolumns = _.filter(this.thingcolumns, function (item) {
            return item.prop !== 'timestamp'
          })
        } else {
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error'
          )
        }
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
     * @Author: dext7r
     * @Date: 2021-12-16 15:19:12
     * @LastEditors: dext7r
     * @param
     * @return {*[]}
     * @Description:
     */
    getSummaries(params) {
      console.log(params, 'params')
      const { columns, data } = params
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '平均值'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          let totalCount = 0
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              totalCount++
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index] / totalCount
        } else {
          sums[index] = 0
        }
      })
      console.log(sums)
      return sums
    },
  },
  beforeDestroy() {
    clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
  },
}
