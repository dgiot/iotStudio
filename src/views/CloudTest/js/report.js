import { delProduct, queryProduct } from '@/api/Product'
import { queryView } from '@/api/View'
import { postReportFile } from '@/api/Platform'
import VabDraggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import { post_tree } from '@/api/Data'
import { queryCategory } from '@/api/Category'
import { queryProductTemplet } from '@/api/ProductTemplet'

export default {
  name: 'ReportIndex',
  components: {
    VabDraggable,
  },
  data() {
    const validateFile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请上传文件'))
      } else {
        callback()
      }
    }
    return {
      queryForm: { name: '', category: '' },
      paginations: {},
      queryPayload: {
        include: 'category',
        order: '-updatedAt',
        limit: 10,
        skip: 0,
        keys: 'count(*)',
      },
      tableData: [],
      categoryTreeData: [],
      fileList: [],
      momentKey: moment(new Date()).valueOf(),
      ruleForm: {
        file: null,
        name: '',
        category: '',
        factory: '',
        date2: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入模板名称',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur',
          },
        ],
        categoryname: [
          {
            required: true,
            message: '请选择所属品类',
            trigger: 'blur',
          },
        ],
        factory: [
          {
            required: true,
            message: '请输入厂商名称',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 8,
            message: '长度在 3 到 8 个字符',
            trigger: 'blur',
          },
        ],
        file: [
          {
            validator: validateFile,
            trigger: 'blur',
          },
        ],
      },
      activePopShow: false,
      tempPopShow: false,
      isFullscreen: false,
      border: true,
      height: this.$baseTableHeight(0) - 20,
      stripe: true,
      lineHeight: 'medium',
      checkList: [
        'objectId',
        'Template name',
        'category',
        'Trade Names',
        'Creation time',
      ],
      columns: [
        {
          label: 'objectId',
          width: 'auto',
          prop: 'objectId',
          sortable: true,
          disableCheck: true,
        },
        {
          label: 'Template name',
          width: 'auto',
          prop: 'name',
          sortable: true,
        },
        {
          label: 'category',
          width: 'auto',
          prop: 'category.name',
          sortable: true,
        },
        {
          label: 'Trade Names',
          width: 'auto',
          prop: 'devType',
          sortable: true,
        },
        {
          label: 'Creation time',
          width: 'auto',
          prop: 'createdAt',
          sortable: true,
        },
      ],
      list: [],
      tempList: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      temprow: {},
      cascaderDrawer: false,
    }
  },
  computed: {
    ...mapGetters({
      language: 'settings/language',
      collapse: 'settings/collapse',
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
  watch: {
    language: {
      deep: true,
      limit: true,
      handler(val) {
        console.error(val)
      },
    },
  },
  created() {},
  mounted() {
    this.categorytree()
    this.fetchData()
  },
  methods: {
    async paginationQuery(queryPayload) {
      this.queryPayload = queryPayload
    },
    handlecateClick() {
      this.categorytree()
      this.cascaderDrawer = true
    },
    async queryProdut(args) {
      const categorys = args.categorys
      const loading = this.$baseColorfullLoading()
      if (!args.limit) {
        args = this.queryForm
      }
      let params = {
        limit: args.limit,
        order: args.order,
        skip: args.skip,
        keys: args.keys,
        include: 'category',
        where: {
          category: categorys ? { $in: categorys } : { $ne: null },
          name: args.name
            ? {
                $regex: args.name,
                $options: 'i',
              }
            : { $ne: null },
        },
      }
      try {
        const { results = [], count = 0 } = await queryProductTemplet(params)
        loading.close()
        this.tableData = results
        this.queryForm.total = count
      } catch (error) {
        loading.close()
        console.log(error)
        this.$message.error(`${error}`)
      }
    },
    handleCateSearch(objectId) {
      this.queryForm.category = objectId
      this.showcateTree = !this.showcateTree
      if (objectId == 'a60a85475a') {
        this.queryProdut({})
      } else {
        let params = {
          keys: 'objectId',
          where: {
            parent: {
              className: 'Category',
              objectId: objectId,
              __type: 'Pointer',
            },
          },
        }
        queryCategory(params).then((res) => {
          const ids = []
          ids.push(objectId)
          res.results.forEach((result) => {
            ids.push(result.objectId)
          })
          this.queryProdut({ categorys: ids })
        })
      }
    },
    referenceHandle(row) {
      console.log('prodtemp', row)
    },
    // 选择产品模板
    async chooseTemplate(row) {
      this.$set(this.ruleForm, 'categoryname', row.category.name)
      this.$set(this.ruleForm, 'categoryid', row.category.objectId)
      this.$set(this.ruleForm, 'producttempid', row.objectId)
      this.cascaderDrawer = !this.cascaderDrawer
    },
    async categorytree() {
      let params = {
        class: 'Category',
        filter:
          '{"order": "createdAt","keys":["parent","name","level"],"where":{"parent": "d6ad425529"}}',
        parent: 'parent',
      }
      console.log(params)
      try {
        const { results = [] } = await post_tree(params)
        this.categoryTreeData = results
      } catch (e) {
        console.log('categorytree error', e)
      }
    },
    onBeforeUploadImage(file) {
      const docxType = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ]
      console.error(
        file,
        file.size,
        file.size / 1024 / 1024 < 30,
        docxType.includes(file.type),
        file.type
      )
      const isIMAGE = docxType.includes(file.type)
      const isLt30M = file.size / 1024 / 1024 < 30
      if (!isIMAGE) {
        this.$message.error('上传文件只能是doc/docx格式!')
      }
      if (!isLt30M) {
        this.$message.error('上传文件大小不能超过 30MB!')
      }
      this.momentKey = moment(new Date()).valueOf()
      return isIMAGE && isLt30M
    },
    UploadImage(param) {
      console.error(param, 'param')
      this.ruleForm.file = param.file
    },
    fileChange(file) {
      this.$refs.upload.clearFiles() //清除文件对象
      this.logo = file.raw // 取出上传文件的对象，在其它地方也可以使用
      this.fileList = [
        {
          name: file.name,
          url: file.url,
        },
      ] // 重新手动赋值filstList， 免得自定义上传成功了, 而fileList并没有动态改变， 这样每次都是上传一个对象
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handlePreview(file) {
      console.log(file)
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = new FormData()
          const configTemp = {
            identifier: 'inspectionReportTemp',
            client: this.ruleForm.factory,
            category: this.ruleForm.categoryid,
            producttemplet: this.ruleForm.producttempid,
          }
          formData.append('devType', this.ruleForm.factory)
          formData.append('name', this.ruleForm.name)
          formData.append('config', JSON.stringify(configTemp))
          formData.append('file', this.ruleForm.file)
          const loading = this.$baseColorfullLoading(1)
          try {
            const { result } = await postReportFile(formData)
            console.log(result)
            this.$message.success(
              this.$translateTitle('cloudTest.Template created successfully')
            )
            this.activePopShow = false
            this.fetchData()
          } catch (e) {
            this.$message.error(
              this.$translateTitle('cloudTest.Template creation failed')
            )
          }
          loading.close()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.ruleForm.file = null
      this.fileList = []
      this.$refs[formName].resetFields()
    },
    clickFullScreen() {
      this.isFullscreen = !this.isFullscreen
      this.handleHeight()
    },
    handleHeight() {
      if (this.isFullscreen) {
        this.height = this.$baseTableHeight(1) + 210
      } else {
        this.height = this.$baseTableHeight(1)
      }
    },
    handleAdd() {
      // this.$refs['edit'].showEdit()
      this.activePopShow = true
    },
    handlekonva(row) {
      // 取证类型模板跳转到组态
      this.$router.push({
        path: '/Topo',
        query: {
          productid: row.key,
          viewid: row.objectId,
          icon: row.icon,
          type: 'Evidence',
        },
      })
    },
    async handleManagement(row) {
      this.temprow = row
      const params = {
        limit: 50,
        skip: 0,
        keys: 'count(*)',
        where: {
          type: 'topo',
          class: 'Product',
          key: row.objectId,
        },
        order: 'title',
      }
      const loading = this.$baseColorfullLoading(1)
      try {
        const { count = 0, results } = await queryView(params)
        this.tempList = results
      } catch (e) {}
      this.tempPopShow = true
      loading.close()
    },
    handleDelete(row, flag) {
      this.$baseConfirm(
        this.$translateTitle(
          'Maintenance.Are you sure you want to delete the current item'
        ),
        null,
        async () => {
          const res = await delProduct(row.objectId)
          this.$baseMessage(
            this.$translateTitle('successfully deleted'),
            'success',
            'vab-hey-message-success'
          )
          flag == 0
            ? await this.fetchData()
            : await this.handleManagement(this.temprow)
        }
      )
    },
    async fetchData() {
      this.queryPayload.where = {
        name: this.queryForm.name
          ? { $regex: this.queryForm.name }
          : { $ne: null },
        netType: 'Evidence',
        nodeType: 1,
      }
      console.log(this.queryPayload)
      this.listLoading = true
      const { count = 0, results = [] } = await queryProduct(this.queryPayload)
      this.$refs['paginations'].ination.total = count
      results.forEach((item) => {
        item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      })
      this.list = results
      this.listLoading = false
    },
  },
}
