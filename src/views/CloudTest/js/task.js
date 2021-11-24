import { queryDevice, delDevice, postDevice } from '@/api/Device'
import VabDraggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import { queryProduct } from '@/api/Product'
import { queryView } from '@/api/View'
export default {
  name: 'TaskIndex',
  components: {
    VabDraggable,
  },
  data() {
    return {
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
        {
          label: 'Inspection number',
          width: 'auto',
          prop: 'devaddr',
          sortable: true,
          disableCheck: true,
        },
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
        {
          label: 'Creation time',
          width: 'auto',
          prop: 'createdAt',
          sortable: true,
        },
        {
          label: 'Starting time',
          width: 'auto',
          prop: 'basedata.starttime',
          sortable: true,
        },
        {
          label: 'end time',
          width: 'auto',
          prop: 'basedata.endtime',
          sortable: true,
        },
      ],
      list: [],
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
        name: ['审核中', '审核完成'],
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
    this.fetchData(this.queryForm)
  },
  methods: {
    async categoryChange(val) {
      this.$set(this.ruleForm, 'templatenameid', val.objectId)
    },
    testbedChange(val) {
      this.$set(this.ruleForm, 'testbedid', val.objectId)
      console.log('this.ruleForm', this.ruleForm)
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
        if (!this.currentDepartment.name) {
          this.$message.error('请先选择部门后,再来新增报告')
          return
        }
        if (valid) {
          const task = {
            basedata: {},
            ACL: aclObj,
            profile: {
              testbedid: this.ruleForm.testbedid,
              testbed: this.ruleForm.testbed.name,
              wordtemplatename: this.ruleForm.templatename.name,
              reportId: this.ruleForm.templatenameid,
              identifier: 'inspectionReportTemp',
            },
            parentId: {
              objectId: this.ruleForm.testbedid,
              __type: 'Pointer',
              className: 'Device',
            },
            name: this.ruleForm.name,
            devaddr: md5(this.ruleForm.name).substr(0, 10),
            product: {
              objectId: this.ruleForm.templatenameid,
              __type: 'Pointer',
              className: 'Product',
            },
          }
          const loading = this.$baseColorfullLoading(1)
          this.activePopShow = false
          await postDevice(task)
          this.fetchData(this.queryForm)
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
    sizeChange(val) {
      this.queryForm.limit = val
      this.fetchData(this.queryForm)
    },
    currentChange(val) {
      this.queryForm.skip = (val - 1) * this.queryForm.limit
      this.fetchData(this.queryForm)
    },
    async handleManagement(taskid) {},
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
        this.fetchData(this.queryForm)
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('user.error deleted') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    async fetchData(args) {
      this.getwordtemp()
      this.getgroup()
      const params = {
        limit: args.limit,
        order: args.order,
        skip: this.queryForm.name.length ? 0 : args.skip,
        keys: args.keys,
        include: 'product,parentId',
        where: {
          'profile.identifier': 'inspectionReportTemp',
        },
      }
      this.listLoading = true
      const { count = 0, results = [] } = await queryDevice(params)
      this.list = results
      results.forEach((item) => {
        item.basedata.endtime = item.basedata.endtime
          ? moment(item.basedata.endtime).format('YYYY-MM-DD HH:mm:ss')
          : ''
        item.basedata.starttime = item.basedata.starttime
          ? moment(item.basedata.starttime).format('YYYY-MM-DD HH:mm:ss')
          : ''
        item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      })
      // this.list = results
      this.queryForm.total = count
      this.listLoading = false
    },
  },
}