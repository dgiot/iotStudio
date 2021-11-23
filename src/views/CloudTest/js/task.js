import { queryDevice } from '@/api/Device'
import VabDraggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import { queryProduct } from '@/api/Product'
import { postreport } from '@/api/Report'
import { queryView } from '@/api/View'
export default {
  name: 'TaskIndex',
  components: {
    VabDraggable,
  },
  data() {
    return {
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
      ruleForm: {
        testbedid: '',
        testbed: '',
        wordtemplatename: '',
        endtime: '',
        starttime: '',
        wordtemplateid: '',
        name: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入任务名称',
            trigger: 'blur',
          },
        ],
        wordtemplatename: [
          {
            required: true,
            message: '请选择报告模板',
            trigger: 'change',
          },
        ],
        starttime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'change',
          },
        ],
        endtime: [
          {
            required: true,
            message: '请选择结束时间',
            trigger: 'change',
          },
        ],
        testbed: [
          {
            required: true,
            message: '请选择测试台体',
            trigger: 'change',
          },
        ],
        organization: [
          {
            required: true,
            message: '请选择所属组织',
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
          prop: 'basedata.wordtemplatename',
          sortable: true,
        },
        {
          label: 'testbed',
          width: 'auto',
          prop: 'basedata.testbed',
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
      wordtemplist: [],
      grouplist: [],
    }
  },
  computed: {
    ...mapGetters({}),
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
    async wordtemplateChange(val) {
      const params = {
        where: { key: val.objectId },
      }
      const res = await queryView(params)
      this.$set(this.ruleForm, 'wordtemplatename', val.name)
      this.$set(this.ruleForm, 'wordtemplateid', val.objectId)
      console.log(res, res)
    },
    testbedChange(val) {
      this.$set(this.ruleForm, 'testbed', val.name)
      this.$set(this.ruleForm, 'testbedid', val.objectId)
      console.log('this.ruleForm', this.ruleForm)
    },
    nextpage() {
      if (this.ruleForm.wordtemplate) {
        console.log(this.ruleForm.wordtemplate)
      } else {
        this.$message({
          type: 'error',
          message: '请选择报告模板',
        })
      }
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
      this.wordtemplist = results
    },
    async getgroup() {
      const params = {
        skip: 0,
        where: {
          nodeType: 2,
        },
      }
      const { results } = await queryProduct(params)
      this.grouplist = results
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const task = {
            basedata: {
              testbedid: this.ruleForm.testbedid,
              testbed: this.ruleForm.testbed,
              wordtemplatename: this.ruleForm.wordtemplatename,
              endtime: this.ruleForm.endtime,
              starttime: this.ruleForm.starttime,
              reportId: this.ruleForm.wordtemplateid,
              identifier: 'inspectionReportTemp',
            },
            name: this.ruleForm.name,
            product: this.ruleForm.wordtemplateid,
          }
          const loading = this.$baseColorfullLoading(1)
          postreport(task)
          this.fetchData(this.queryForm)
          loading.close()
        } else {
          console.log('error submit!!')
          return false
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
    async handleManagement(row) {},
    handleDelete(row, flag) {},
    async fetchData(args) {
      this.getwordtemp()
      this.getgroup()
      const params = {
        limit: args.limit,
        order: args.order,
        skip: this.queryForm.name.length ? 0 : args.skip,
        keys: args.keys,
        where: {
          'basedata.identifier': 'inspectionReportTemp',
        },
      }
      this.listLoading = true
      const { count = 0, results = [] } = await queryDevice(params)
      this.list = results
      results.forEach((item) => {
        item.basedata.endtime = moment(item.basedata.endtime).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        item.basedata.starttime = moment(item.basedata.starttime).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      })
      // this.list = results
      this.queryForm.total = count
      this.listLoading = false
    },
  },
}
