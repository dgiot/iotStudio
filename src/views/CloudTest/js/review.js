import lowcodeDesign from '@/views/CloudFunction/lowcode/components/index'
import { queryDevice, delDevice, putDevice } from '@/api/Device'
import { postreport } from '@/api/Report'
import VabDraggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import { queryProduct } from '@/api/Product'
import { queryView } from '@/api/View'
import { generatereport, queryEvidence } from '@/api/Evidence'
// const docx = require('docx-preview')
// import mammoth from 'mammoth'
const VueAliplayerV2 = window['vue-aliplayer-v2'].default
export default {
  name: 'ReviewIndex',
  components: {
    VabDraggable,
    lowcodeDesign,
    'vue-aliplayer-v2': VueAliplayerV2,
  },
  data() {
    return {
      types: {
        video: ['video', 'personal_video'],
        audio: ['audio', 'volume_up'],
        image: ['image', 'image'],
        file: ['file', 'archive'],
      },
      evidences: [],
      evidenceDialog: false,
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
        //   label: 'Creation time',
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
  methods: {
    async paginationQuery(queryPayload) {
      this.queryPayload = queryPayload
    },
    async categoryChange(val) {
      this.$set(this.ruleForm, 'templatenameid', val.objectId)
    },
    testbedChange(val) {
      this.$set(this.ruleForm, 'testbedid', val.objectId)
      dgiotlog.log(
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
          'detail.devModel': 'DGIOT_GROUP',
        },
      }
      const { results } = await queryDevice(params)
      this.grouplist = results
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
              testbedid: this.ruleForm.testbedid,
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
          dgiotlog.log('error submit!!')
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
    forensics(row) {
      dgiotlog.warn(row)
      this.$router.push({
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
            dgiotlog.log(error)
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
      this.$baseConfirm(
        this.$translateTitle(
          'Maintenance.Are you sure you want to start the current mission'
        ),
        null,
        async () => {
          try {
            const loading = this.$baseColorfullLoading()
            const params = {
              profile: _.merge(row.profile, {
                step: 1,
                starttime: moment(new Date()).format('x'),
              }),
            }
            const res = await putDevice(row.objectId, params)
            this.fetchData()
            loading.close()
          } catch (error) {
            dgiotlog.log(error)
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
        dgiotlog.log(error)
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
        dgiotlog.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    /**
     * @Author: h7ml
     * @Date: 2021-12-09 10:57:46
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async handleRouter(row) {
      try {
        this.$router.push({
          path: '/cloudTest/evidence',
          query: {
            taskid: row.objectId,
            suite: 0,
            state: 'preview',
            step: row.profile.step,
            back: row.profile.step,
            message: row.profile.message,
            disable: true,
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
     * @Date: 2021-12-07 12:32:34
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async handleEvidence(objectId) {
      this.evidences = []
      try {
        const params = {
          order: '-createdAt',
          skip: 0,
          where: {
            'original.taskid': objectId,
          },
        }
        const loading = this.$baseColorfullLoading()
        const { results } = await queryEvidence(params)
        if (results?.length)
          results.forEach((item) => {
            item.original.path =
              '/dgiot_file' + item.original.path.split('/dgiot_file')[1]
          })
        this.evidenceDialog = true
        this.evidences = results

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
            this.fetchData()
          }, 1200)
        } else {
          this.$baseMessage(`${msg}`, 'error', 'vab-hey-message-error')
        }
        loading.close()
      } catch (error) {
        dgiotlog.log(error)
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
      dgiotlog.log(results)
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
        dgiotlog.log(error)
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
          ? { $in: this.queryForm.name }
          : { $ne: null },
        'profile.step': { $gt: 1 },
      }
      this.listLoading = true
      const { count = 0, results = [] } = await queryDevice(this.queryPayload)
      this.$refs['examination'].ination.total = count
      results.forEach((item) => {
        if (!item.profile.step) item.profile.step = 0
        item.endtime = item.profile.endtime
          ? moment(Number(item.profile.endtime)).format('YYYY-MM-DD HH:mm:ss')
          : ''
        item.starttime = item.profile.starttime
          ? moment(Number(item.profile.starttime)).format('YYYY-MM-DD HH:mm:ss')
          : ''
        item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        if (item.profile.step <= 1) {
          this.list.forensics.push(item)
        } else {
          this.list.examination.push(item)
        }
      })
      this.listLoading = false
    },
  },
}
