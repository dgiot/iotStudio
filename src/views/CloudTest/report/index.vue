<!--
* @Author: h7ml
* @Date: 2021-11-08 17:17:08
* @LastEditors: h7ml
* @LastEditTime: 2021-11-08 17:17:08
* @Description: 报告模板
* @FilePath: src\views\CloudTest\report\index.vue
* @DocumentLink:
-->
<template>
  <div
    ref="custom-table"
    class="custom-table-container"
    :class="{ 'vab-fullscreen': isFullscreen }"
  >
    <div :key="height" class="components">
      <vab-dialog :show.sync="activePopShow">
        <h3 slot="title">
          {{ $translateTitle('cloudTest.add')
          }}{{ $translateTitle('cloudTest.report template') }}
        </h3>
        <div class="content">
          <el-form
            ref="ruleForm"
            class="demo-ruleForm"
            label-width="100px"
            :model="ruleForm"
            :rules="rules"
          >
            <el-form-item
              :label="$translateTitle('cloudTest.Template name')"
              prop="name"
            >
              <el-input v-model="ruleForm.name" />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('cloudTest.category')"
              prop="category"
            >
              <el-input v-model="ruleForm.category" />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('cloudTest.Trade Names')"
              prop="factory"
              required
            >
              <el-input v-model="ruleForm.factory" />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('cloudTest.Template file')"
              prop="file"
              required
            >
              <!--              <el-input v-model="ruleForm.name" />-->
              <el-upload
                :key="momentKey"
                ref="upload"
                v-model="ruleForm.file"
                accept=".doc,.docx"
                action="string"
                :before-upload="onBeforeUploadImage"
                class="upload-demo"
                :file-list="fileList"
                :http-request="UploadImage"
                :limit="1"
                list-type="text"
                :on-change="fileChange"
              >
                <el-button slot="trigger" size="small" type="primary">
                  {{ $translateTitle('application.selectfile') }}
                </el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <Vab-amis :schema="amisJson" />
        <div slot="footer">
          <el-button type="primary" @click="submitForm('ruleForm')">
            {{ $translateTitle('product.createnow') }}
          </el-button>
          <el-button @click="resetForm('ruleForm')">
            {{ $translateTitle('zetadevices.reset') }}
          </el-button>
        </div>
      </vab-dialog>
      <vab-dialog :show.sync="tempPopShow">
        <h3 slot="title">
          {{ $translateTitle('cloudTest.report template') }}
        </h3>
        <div class="content">
          <el-table
            ref="tableSort"
            v-loading="listLoading"
            :border="border"
            :data="tempList"
            :height="$baseTableHeight(3)"
            :size="lineHeight"
            :stripe="stripe"
          >
            <el-table-column
              align="center"
              :label="$translateTitle('cloudTest.number')"
              show-overflow-tooltip
              width="80"
            >
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$translateTitle('cloudTest.Template name')"
              prop="name"
              show-overflow-tooltip
              width="auto"
            />
            <el-table-column
              align="center"
              :label="$translateTitle('cloudTest.Template content')"
              width="auto"
            >
              <template #default="{ row }">
                <el-image
                  :preview-src-list="[$FileServe + row.icon]"
                  :src="$FileServe + row.icon"
                  style="width: 40px; height: 40px"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              flex="right"
              :label="$translateTitle(`product.Template management`)"
              show-overflow-tooltip
              width="auto"
            >
              <template #default="{ row }">
                <el-button type="success" @click="handlekonva(row)">
                  {{ $translateTitle(`developer.mapping`) }}
                </el-button>
                <el-button type="warning" @click="handleDelete(row, 1)">
                  {{ $translateTitle(`cloudTest.delete`) }}
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-image
                class="vab-data-empty"
                :src="
                  require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                "
              />
            </template>
          </el-table>
        </div>
      </vab-dialog>
    </div>
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="0"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              v-model="queryForm.name"
              :placeholder="
                $translateTitle('cloudTest.Please enter the query content')
              "
            />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="fetchData(queryForm)"
            >
              {{ $translateTitle('cloudTest.search') }}
            </el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
              {{ $translateTitle('cloudTest.add') }}
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <!--        <div class="stripe-panel">-->
        <!--          <el-checkbox v-model="stripe">-->
        <!--            {{ $translateTitle('cloudTest.Zebra pattern') }}-->
        <!--          </el-checkbox>-->
        <!--        </div>-->
        <!--        <div class="border-panel">-->
        <!--          <el-checkbox v-model="border">-->
        <!--            {{ $translateTitle('cloudTest.frame') }}-->
        <!--          </el-checkbox>-->
        <!--        </div>-->
        <el-button
          style="margin: 0 10px 10px 0 !important"
          type="primary"
          @click="clickFullScreen"
        >
          <vab-icon
            :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
          />
          {{ $translateTitle('cloudTest.full screen') }}
        </el-button>
        <el-popover
          ref="popover"
          popper-class="custom-table-checkbox"
          trigger="hover"
        >
          <el-radio-group v-model="lineHeight">
            <el-radio label="medium">
              {{ $translateTitle('cloudTest.medium') }}
            </el-radio>
            <el-radio label="small">
              {{ $translateTitle('cloudTest.small') }}
            </el-radio>
            <el-radio label="mini">
              {{ $translateTitle('cloudTest.mini') }}
            </el-radio>
          </el-radio-group>
          <template #reference>
            <el-button style="margin: 0 10px 10px 0 !important" type="primary">
              <vab-icon icon="line-height" />
              {{ $translateTitle('cloudTest.size') }}
            </el-button>
          </template>
        </el-popover>
        <el-popover popper-class="custom-table-checkbox" trigger="hover">
          <el-checkbox-group v-model="checkList">
            <vab-draggable :list="columns" v-bind="dragOptions">
              <div v-for="(item, index) in columns" :key="item + index">
                <vab-icon icon="drag-drop-line" />
                <el-checkbox
                  :disabled="item.disableCheck === true"
                  :label="item.label"
                >
                  {{ $translateTitle(`cloudTest.${item.label}`) }}
                </el-checkbox>
              </div>
            </vab-draggable>
          </el-checkbox-group>
          <template #reference>
            <el-button
              icon="el-icon-setting"
              style="margin: 0 0 10px 0 !important"
              type="primary"
            >
              {{ $translateTitle('cloudTest.Draggable column') }}
            </el-button>
          </template>
        </el-popover>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :border="border"
      :data="list"
      :height="height"
      :size="lineHeight"
      :stripe="stripe"
    >
      <el-table-column
        align="center"
        :label="$translateTitle('cloudTest.number')"
        show-overflow-tooltip
        width="95"
      >
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in finallyColumns"
        :key="index"
        align="center"
        :label="$translateTitle(`cloudTest.${item.label}`)"
        :prop="item.prop"
        show-overflow-tooltip
        :sortable="item.sortable"
        :width="item.width"
      />

      <el-table-column
        align="center"
        :label="$translateTitle(`cloudTest.operate`)"
        show-overflow-tooltip
        width="185"
      >
        <template #default="{ row }">
          <el-button type="success" @click="handleManagement(row)">
            {{ $translateTitle(`product.Template management`) }}
          </el-button>
          <el-button type="warning" @click="handleDelete(row, 0)">
            {{ $translateTitle(`cloudTest.delete`) }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-image
          class="vab-data-empty"
          :src="
            require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
          "
        />
      </template>
    </el-table>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page.sync="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :page-sizes="queryForm.pageSizes"
      :total="queryForm.total"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
  </div>
</template>

<script>
  import { delProduct, queryProduct } from '@/api/Product'
  import { postReportFile } from '@/api/Platform'
  import VabDraggable from 'vuedraggable'
  import { mapGetters } from 'vuex'
  import { post_tree } from '@/api/Data'

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
        categoryTreeData: [],
        amisJson: {},
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
              min: 3,
              max: 8,
              message: '长度在 3 到 8 个字符',
              trigger: 'blur',
            },
          ],
          category: [
            {
              required: true,
              message: '请输入所属品类',
              trigger: 'blur',
            },
            {
              min: 3,
              max: 8,
              message: '长度在 3 到 8 个字符',
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
        return this.columns.filter((item) =>
          this.checkList.includes(item.label)
        )
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
    created() {
      this.fetchData(this.queryForm)
    },
    mounted() {
      this.categorytree()
    },
    methods: {
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
            }
            formData.append('devType', this.ruleForm.category)
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
              this.fetchData(this.queryForm)
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
      sizeChange(val) {
        this.queryForm.limit = val
        this.fetchData(this.queryForm)
      },
      currentChange(val) {
        this.queryForm.skip = (val - 1) * this.queryForm.limit
        this.fetchData(this.queryForm)
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
            productid: row.objectId,
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
            $relatedTo: {
              object: {
                __type: 'Pointer',
                className: 'Product',
                objectId: this.temprow.objectId,
              },
              key: 'children',
            },
          },
          order: 'createdAt',
        }
        const loading = this.$baseColorfullLoading(1)
        try {
          const { count = 0, results } = await queryProduct(params)
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
              ? await this.fetchData(this.queryForm)
              : await this.handleManagement(this.temprow)
          }
        )
      },
      async fetchData(args) {
        const params = {
          limit: args.limit,
          order: args.order,
          skip: this.queryForm.name ? 0 : args.skip,
          keys: args.keys,
          include: 'category',
          where: {
            name: this.queryForm.name
              ? { $regex: this.queryForm.name }
              : { $ne: null },
            category: 'd6ad425529',
            nodeType: 1,
          },
        }
        this.listLoading = true
        const { count = 0, results = [] } = await queryProduct(params)
        results.forEach((item) => {
          item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        })
        this.list = results
        this.queryForm.total = count
        this.listLoading = false
      },
    },
  }
</script>
