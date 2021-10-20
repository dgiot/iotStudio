<template>
  <div class="standard">
    <div
      class="devicesright"
      style="padding: 20px"
    >
      <el-form
        v-show="false"
        class="demo-form-inline"
        :inline="true"
        :model="formInline"
        size="small"
      >
        <el-form-item label="标准类型">
          <el-select
            v-model="formInline.model"
            placeholder="选择标准类型"
          >
            <el-option
              label="性能检测"
              value="性能检测"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标准类别">
          <el-select
            v-model="formInline.standard"
            placeholder="选择标准类别"
          >
            <el-option
              v-for="(item, index) in standard"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检测名称">
          <el-input
            v-model="formInline.name"
            placeholder="请输入检测名称"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click.native="getStandardFromDict(0)"
          >
            查询
          </el-button>
          <el-button
            type="primary"
            @click.native="reset"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <div class="adddevices">
        <el-button
          size="small"
          type="primary"
          @click="addStandard"
        >
          新增检测标准
        </el-button>
        <!-- <el-button type="danger" size="small">删除</el-button> -->
      </div>
      <div class="tableblock">
        <el-table
          ref="multipleTable"
          :data="standardList"
          style="width: 100%"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="序号"
            type="index"
            width="50"
          />
          <el-table-column
            label="检测标准名称"
            prop="data.name"
            width="200"
          />
          <el-table-column
            label="标准类型"
            prop="data.model"
          />
          <el-table-column
            label="适用产品"
            prop="data.product"
            width="200"
          />
          <el-table-column
            label="标准类别"
            prop="data.standard"
            width="200"
          />
          <el-table-column
            label="标准发行单位"
            prop="data.client"
            width="250"
          />

          <el-table-column
            label="标准发行时间"
            width="150"
          >
            <template slot-scope="scope">
              <span>{{ $timestampToTime(scope.row.data.start_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="data.desc"
            width="220"
          />
          <el-table-column
            label="创建时间"
            width="150"
          >
            <template slot-scope="scope">
              <span>{{ $timestampToTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="检测标准管理"
            width="200"
          >
            <template slot-scope="scope">
              <!--          <el-button @click="editorReport(scope.row)" size="small" icon="el-icon-edit">编辑</el-button>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-circle-plus"
                @click="addChildReport(scope.row)"
              >子项新增</el-button>
              <router-link target="_blank" to="/pdf/download">
                <el-button type="success" size="small" icon="el-icon-share">下载</el-button>
              </router-link>
              <el-button
                type="info"
                size="small"
                icon="el-icon-star-off"
                @click="childManage(scope.row)"
              >子项管理</el-button>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="deleteReport(scope.row.id)"
              >删除</el-button>-->

              <el-dropdown
                split-button
                type="primary"
                @click="editorReport(scope.row)"
              >
                编辑
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addChildReport(scope.row)">
                    子项新增
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link
                      target="_blank"
                      to="/pdf/download"
                    >
                      下载
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="childManage(scope.row)">
                    子项管理
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="deleteReport(scope.row.objectId)"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pageblock">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pagesize"
          :page-sizes="[10, 20, 30, 50]"
          :total="standardList.length"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <!--新增检验标准弹窗-->
    <el-dialog
      :append-to-body="true"
      :title="actionTypeTxt + '检验标准'"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <div class="addContent">
        <el-form
          ref="standardFormRef"
          :model="standardFormModel"
          :rules="formrule"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="检验标准名称"
                :label-width="formLabelWidth"
                prop="name"
              >
                <el-input
                  v-model="standardFormModel.name"
                  autocomplete="off"
                  placeholder="检验标准名称"
                />
              </el-form-item>
              <el-form-item
                label="适用产品"
                :label-width="formLabelWidth"
                prop="product"
              >
                <el-select
                  v-model="standardFormModel.product"
                  placeholder="选择适用产品"
                >
                  <el-option
                    v-for="(item, index) in pumpmodel"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="标准类型"
                :label-width="formLabelWidth"
                prop="model"
              >
                <el-select
                  v-model="standardFormModel.model"
                  placeholder="选择标准类型"
                >
                  <el-option
                    label="性能检测"
                    value="性能检测"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                label="备注信息"
                :label-width="formLabelWidth"
              >
                <el-input
                  v-model="standardFormModel.desc"
                  placeholder="请输入标准备注信息"
                  :rows="4"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="检测标准文号"
                :label-width="formLabelWidth"
                prop="inspection_number"
              >
                <el-input
                  v-model="standardFormModel.inspection_number"
                  autocomplete="off"
                  placeholder="请输入检测标准文号"
                />
              </el-form-item>
              <el-form-item
                label="标准类别"
                :label-width="formLabelWidth"
                prop="standard"
              >
                <el-select
                  v-model="standardFormModel.standard"
                  placeholder="选择标准类别"
                >
                  <el-option
                    v-for="(item, index) in standard"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="标准发行单位"
                :label-width="formLabelWidth"
                prop="client"
              >
                <el-input
                  v-model="standardFormModel.client"
                  autocomplete="off"
                  placeholder="请输入标准发行单位"
                />
              </el-form-item>
              <el-form-item
                label="标准发行时间"
                :label-width="formLabelWidth"
              >
                <el-date-picker
                  v-model="standardFormModel.start_time"
                  placeholder="选择日期"
                  type="date"
                  value-format="timestamp"
                />
              </el-form-item>
              <el-form-item
                label="标准源文件"
                :label-width="formLabelWidth"
                required
              >
                <el-input
                  v-model="standardFormModel.filesrc"
                  v-loading="loading"
                  placeholder="请输入内容"
                >
                  <template slot="append">
                    <el-button
                      size="small"
                      type="primary"
                    >
                      点击上传
                    </el-button>
                    <form
                      ref="uploadform"
                      enctype="multipart/form-data"
                      method="POST"
                      style="position: absolute"
                    >
                      <input
                        style="
                          position: relative;
                          top: -30px;
                          z-index: 5;
                          width: 100px;
                          height: 40px;
                          cursor: pointer;
                          opacity: 0;
                        "
                        type="file"
                        @change="upload($event)"
                      />
                    </form>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="postStandardToDict('standardFormRef')"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!--标准子项新增弹窗-->
    <el-dialog
      :append-to-body="true"
      title="标准子项新增"
      :visible.sync="dialogReport"
      width="50%"
    >
      <el-form
        ref="dynamicValidateForm"
        class="demo-dynamic"
        label-width="100px"
        :model="dynamicValidateForm"
        size="small"
      >
        <el-row
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="domain.key"
        >
          <el-col :span="10">
            <el-form-item
              :label="'子项名称' + (index + 1)"
              :prop="'domains.' + index + '.name'"
              :rules="{
                required: true,
                message: `子项目名称${index + 1}不能为空`,
                trigger: 'blur',
              }"
            >
              <el-input v-model="domain.name" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              :label="'保证值' + (index + 1)"
              :prop="'domains.' + index + '.title'"
              :rules="{
                required: true,
                message: `保证值${index + 1}不能为空`,
                trigger: 'blur',
              }"
            >
              <el-input v-model="domain.title" />
            </el-form-item>
          </el-col>
          <el-col
            :span="4"
            style="float: right"
          >
            <el-button
              size="small"
              style="margin-left: 5px"
              type="danger"
              @click.prevent="removeDomain(domain)"
            >
              删除
            </el-button>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button @click="addDomain">
            新增子项
          </el-button>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogReport = false">取 消</el-button>
        <el-button
          type="primary"
          @click="reportChildren('dynamicValidateForm')"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!--子项管理弹窗-->
    <el-dialog
      :append-to-body="true"
      title="标准子项管理"
      :visible.sync="dialogTableVisible"
      width="50%"
    >
      <el-table
        :data="
          childrenData.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )
        "
        style="width: 100%; text-align: center"
      >
        <el-table-column
          align="center"
          :index="
            (index) => {
              return index + 1 + (currentPage - 1) * pageSize
            }
          "
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column
          align="center"
          label="名称"
          prop="name"
        />
        <el-table-column
          align="center"
          label="保证值"
          prop="title"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="danger"
              @click="deleteChildren(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="block"
        style="margin-top: 15px"
      >
        <el-pagination
          align="center"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pageSize"
          :page-sizes="[1, 5, 10, 20]"
          :total="childrenData.length"
          @current-change="handleChildCurrentChange"
          @size-change="handleChildSizeChange"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click.native="ReportChildrenDelete"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  // import Parse from 'parse'
  import { returnLogin } from '@/utils/utilwen'
  import { queryDict } from '@/api/Dict'
  var reportChildrenList = []
  var formData = {}
  export default {
    data() {
      return {
        loading: false,
        // 子项表格弹窗
        dialogTableVisible: false,
        // 弹窗新增编辑
        dialogReport: false,
        pumpmodel: [
          '离心泵',
          '潜水泵',
          '混流泵',
          '螺杆泵',
          '轴流泵',
          '旋涡泵',
          '电动泵',
          '蒸汽泵',
          '齿轮泵',
          '罗茨泵',
          '滑片泵',
          '喷射泵',
          '升液泵',
          '电磁泵',
        ],
        standard: [
          { label: '国际标准', value: 'ITBZ' },
          { label: '国家标准', value: 'GJBZ' },
          { label: '行业标准', value: 'HYBZ' },
          { label: '企业标准', value: 'QYBZ' },
          { label: '地方标准', value: 'DFBZ' },
          { label: '其他标准', value: 'OTHER' },
        ],
        formLabelWidth: '120px',
        dialogVisible: false,
        departmentid: '',
        formInline: {
          name: '',
          standard: '',
          model: '',
        },
        // 取证设备表格
        standardList: [],
        multipleSelection: [],
        pagesize: 10,
        start: 0,
        total: 0,
        actionTypeTxt: '新增',
        standardFormModel: {
          name: '', // 检验标准名称
          product: '', // 适用产品
          inspection_number: '', // 检测标准文号
          standard: '', // 标准类别
          start_time: '', // 标准发行时间
          model: '', // 标准类型
          filesrc: '', // 标准源文件
          desc: '', // 备注信息
          client: '', // 标准发行单位
          reportchildren: [],
        },
        formrule: {
          name: [
            { required: true, message: '请输入检测标准名称', trigger: 'blur' },
          ],
          product: [
            {
              required: true,
              message: '请选择标准适用产品',
              trigger: 'change',
            },
          ],
          inspection_number: [
            { required: true, message: '请输入检测标准文号', trigger: 'blur' },
          ],
          standard: [
            { required: true, message: '请选择标准类别', trigger: 'change' },
          ],
          client: [
            {
              required: true,
              message: '请输入检测标准发行单位',
              trigger: 'blur',
            },
          ],
          model: [
            { required: true, message: '请选择标准类型', trigger: 'change' },
          ],
        },
        // 弹窗关联的三个列表
        departmentlaboratory: [],
        testbedlist: [],
        productlist: [],
        // 子项表单
        dynamicValidateForm: {
          domains: [
            {
              title: '',
              key: Date.now(),
              value: '',
              name: '',
              evidenceway: '',
              assess: '',
            },
          ],
        },
        childrenData: [],
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页的数据条数
      }
    },
    watch: {
      dialogVisible: {
        deep: true,
        handler(val) {
          console.log(val)
          if (!val) {
            this.$refs.standardFormRef.resetFields()

            this.standardFormModel.desc = ''
            this.standardFormModel.start_time = ''
            this.standardFormModel.filesrc = ''
            this.standardFormModel.name = ''
            this.standardFormModel.product = ''
            this.standardFormModel.inspection_number = ''
            this.standardFormModel.standard = ''
            this.standardFormModel.model = ''
            this.standardFormModel.client = ''
            this.standardFormModel.reportchildren = []
          }
        },
      },
    },
    mounted() {
      this.getStandardFromDict()
    },
    methods: {
      // 子项表格
      handleChildSizeChange(val) {
        this.currentPage = 1
        this.pageSize = val
      },
      handleChildCurrentChange(val) {
        this.currentPage = val
      },
      returnStandard(val) {
        var string = ''
        this.standard.map((item) => {
          if (item.value == val) {
            string = item.label
          }
        })
        return string
      },
      // 重置
      reset() {
        this.formInline.model = ''
        this.formInline.standard = ''
        this.formInline.name = ''
        this.getStandardFromDict()
      },
      async getStandardFromDict(start) {
        if (start == 0) {
          this.start = 0
        }

        /*       var InspectionStandard = Parse.Object.extend("InspectionStandard");
        var reportmodule = new Parse.Query(InspectionStandard);
        reportmodule.skip(this.start);
        reportmodule.limit(this.pagesize);
        reportmodule.equalTo("type", "pump_report");
        if(this.formInline.name!=''){
            reportmodule.equalTo('data.name',this.formInline.name)
        }
        if(this.formInline.standard!=''){
            reportmodule.equalTo('data.standard',this.formInline.standard)
        }
        if(this.formInline.model!=''){
            reportmodule.equalTo('data.model',this.formInline.model)
        }
        reportmodule.ascending("-updatedAt");
        reportmodule.count().then(
          count => {
            this.total = count;
            reportmodule.find().then(
              response => {
                this.standardList = response;
              },
              error => {
                returnLogin(error);
              }
            );
          },
          error => {
            returnLogin(error);
          }
        ); */

        const loading = this.$loading({
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        const params = {
          where: {
            type: 'inspectionStandard',
          },
          order: '-updatedAt',
        }
        const { results } = await queryDict(params)
        loading.close()
        this.standardList = results
      },
      // 表格多选
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 分页操作
      handleSizeChange(val) {
        this.pagesize = val
      },
      handleCurrentChange(val) {
        this.start = (val - 1) * this.pagesize
      },
      // 增加设备弹窗
      addStandard(istrue) {
        this.reportid = ''
        this.dialogVisible = true
      },
      upload(event) {
        if (event) {
          var file = event.target.files[0] // name: "dangqi1.png" || type: "image/png"
          var name = file.name
          var testmsg = event.target.files[0].type
          var type = file.type.split('/')[0]
          var extension = testmsg === 'application/pdf'
          if (!extension) {
            // 将图片img转化为base64
            this.$message({
              message: '只能上传PDF格式文件',
              type: 'error',
            })
            return false // 必须加上return false; 才能阻止
          } else {
            this.loading = true
            var reader = new FileReader()
            reader.readAsDataURL(file)
            var that = this
            reader.onloadend = function () {
              var dataURL = reader.result
              var blob = that.dataURItoBlob(dataURL)
              that.uploadFile(blob, name) // 执行上传接口
            }
          }
        }
      },
      dataURItoBlob(dataURI) {
        // base64 解码
        var byteString = atob(dataURI.split(',')[1])
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length)
        var ia = new Uint8Array(ab)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ab], { type: mimeString })
      },
      uploadFile(imgUrl, name) {
        var formdata = new FormData()
        formdata.append('file', imgUrl, name)
        formdata.append('output', 'json')
        formdata.append('path', Cookies.get('appids'))
        formdata.append('scene', Cookies.get('appids'))

        formdata.append('auth_token', Cookies.get('access_token_pump')) // 下面是要传递的参数
        // 此处必须设置为  multipart/form-data
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data', // 之前说的以表单传数据的格式来传递fromdata
          },
        }
        this.$http
          .post(Cookies.get('fileserver'), formdata)
          .then((res) => {
            if (res) {
              this.loading = false
              this.standardFormModel.filesrc = res.body.url
            }
          })
          .catch((error) => {
            this.loading = false
            this.$message.error(error)
          })
      },
      postStandardToDict(formName) {
        console.log('this.$store.state.user.', this.$store.state.user.roles)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.standardFormModel.filesrc == '') {
              this.$message.error('请上传检验标准PDF文件')
              return
            }

            const roleName = this.$store.state.user.roles[0]['name']

            if (!roleName) {
              this.$message({
                message: '未获取到角色名',
              })
              return
            }

            const aclKey = 'role' + ':' + roleName
            const aclObj = {}

            aclObj[aclKey] = { read: true, write: true }

            this.$axiosWen
              .post('classes/Dict', {
                ACL: aclObj,
                type: 'inspectionStandard',
                data: this.standardFormModel,
                key: '',
              })
              .then((res) => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: `${this.actionTypeTxt}成功`,
                  })

                  this.dialogVisible = false
                  this.getStandardFromDict()
                  this.$refs.standardFormRef.resetFields()
                  this.reportid = ''
                }
              })
              .catch((err) => {
                console.log('添加失败 ###', err)
                this.$message({
                  message: '添加失败',
                })
              })
          } else {
            this.$message.error('有必填项未填写')
            return false
          }
        })
      },
      // 编辑检测标准
      editorReport(row) {
        this.dialogVisible = true
        this.reportid = row.objectId
        this.standardFormModel.name = row.data.name
        this.standardFormModel.product = row.data.product
        this.standardFormModel.inspection_number = row.data.inspection_number
        this.standardFormModel.standard = row.data.standard
        this.standardFormModel.start_time = row.data.start_time
        this.standardFormModel.model = row.data.model
        this.standardFormModel.filesrc = row.data.filesrc
        this.standardFormModel.desc = row.data.desc
        this.standardFormModel.client = row.data.client
        this.standardFormModel.reportchildren = row.data.reportchildren
      },
      deleteReport(id) {
        this.$confirm('此操作将永久此检测标准, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$axiosWen.delete('classes/Dict/' + id).then((res) => {
            console.log(res)
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.getStandardFromDict()
            }
          })
        })
      },
      // 动态增加表单
      addDomain() {
        this.dynamicValidateForm.domains.push({
          title: '',
          key: Date.now(),
          value: '',
          name: '',
          evidenceway: '',
          assess: '',
        })
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      addChildReport(row) {
        this.dialogReport = true
        this.reportid = row.id
        this.standardFormModel.name = row.data.name
        this.standardFormModel.product = row.data.product
        this.standardFormModel.inspection_number = row.data.inspection_number
        this.standardFormModel.standard = row.data.standard
        this.standardFormModel.start_time = row.data.start_time
        this.standardFormModel.model = row.data.model
        this.standardFormModel.filesrc = row.data.filesrc
        this.standardFormModel.desc = row.data.desc
        this.standardFormModel.client = row.data.client
        this.standardFormModel.reportchildren = row.data.reportchildren
      },
      reportChildren(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var InspectionStandard = Parse.Object.extend('InspectionStandard')
            var reportmodule = new InspectionStandard()
            reportmodule.id = this.reportid
            this.form.reportchildren = this.form.reportchildren.concat(
              this.dynamicValidateForm.domains
            )
            reportmodule.set('data', this.form)

            reportmodule.save().then((resultes) => {
              this.$message.success('新增成功')
              this.dialogReport = false
              this.dynamicValidateForm.domains = [
                {
                  title: '',
                  key: Date.now(),
                  value: '',
                  name: '',
                  evidenceway: '',
                  assess: '',
                },
              ]
            })
          } else {
            this.$message.error('请填写完整')
            return false
          }
        })
      },
      // 子项管理
      childManage(row) {
        this.childrenData = row.data.reportchildren.concat([])
        // formData.name = row.data.name;
        // formData.product = row.data.product;
        // formData.inspection_number = row.data.inspection_number;
        // formData.standard = row.data.standard;
        // formData.start_time = row.data.start_time;
        // formData.model = row.data.model;
        // formData.filesrc = row.data.filesrc;
        // formData.desc = row.data.desc;
        // formData.client = row.data.client;
        // formData.reportchildren = row.data.reportchildren
        this.dialogTableVisible = true
        this.reportid = row.id
      },
      // 删除子项
      deleteChildren(index) {
        this.childrenData.splice(
          index + (this.currentPage - 1) * this.pageSize,
          1
        )
      },
      // 删除确认
      ReportChildrenDelete() {
        this.$confirm('是否删除标准子项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          var InspectionStandard = Parse.Object.extend('InspectionStandard')
          var reportmodule = new InspectionStandard()
          reportmodule.id = this.reportid
          formData.reportchildren = this.childrenData
          reportmodule.set('data', formData)
          reportmodule.save().then((resultes) => {
            if (resultes) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.dialogTableVisible = false
              this.getStandardFromDict()
              this.required = ''
            }
          })
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .standard {
    /* padding: 20px; */
    box-sizing: border-box;
    width: 100%;
    min-height: 875px;
    /* background: url("../../imgages/echartbanner1.png") no-repeat; */
    /* background-size: cover; */
    //   display: flex;
    /* overflow: scroll; */
    .devicesright {
      .tableblock {
        margin-top: 20px;
      }
    }
    .pageblock {
      margin-top: 20px;
    }
    ::v-deep .el-dialog__body {
      ::v-deep .el-select {
        width: 100%;
      }
      ::v-deep .el-date-editor {
        width: 100%;
      }
    }
    ::v-deep .el-upload-list {
      display: none;
    }

    ::v-deep .el-col {
      @media screen and (max-width: 1350px) {
        width: 100%;
      }
    }
  }
</style>
