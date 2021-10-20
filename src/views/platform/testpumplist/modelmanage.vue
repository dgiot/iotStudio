<template>
  <el-container>
    <el-main>
      <div class="modelmanamge">
        <div class="mdoeltop">
          <el-row :gutter="12">
            <el-col :span="12">
              <el-form
                class="demo-form-inline"
                :inline="true"
                :model="formInline"
                size="small"
              >
                <!-- <el-form-item label="质检项目"> -->
                <el-form-item
                  :label="$translateTitle('developer.qualityinspectionitems')"
                  label-width="100"
                >
                  <el-input
                    v-model="formInline.name"
                    clearable
                    :placeholder="
                      $translateTitle('product.enter1') +
                        $translateTitle('product.itemname')
                    "
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    :disabled="formInline.name.length == 0"
                    type="primary"
                    @click="searchProduct(formInline.name)"
                  >
                    <!-- 查询 -->
                    {{ $translateTitle('concentrator.search') }}
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="addStandard"
                  >
                    <!-- 新增质检项目 -->
                    {{ $translateTitle('product.newlyadded')
                    }}{{ $translateTitle('developer.qualityinspectionitems') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <div style="text-align: right">
                <el-button
                  plain
                  size="small"
                  type="primary"
                  @click="getIotHubProduct"
                >
                  <!-- 查看台体 -->
                  {{ $translateTitle('product.Viewtheplatform') }}
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <!--表格-->
        <div class="tableblock">
          <el-table
            ref="multipleTable"
            :data="tableDataReport"
            style="width: 100%"
            tooltip-effect="dark"
          >
            <!-- <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50"
            /> -->
            <el-table-column
              align="center"
              :label="$translateTitle('equipment.serialnumber')"
              type="index"
              width="120"
            />
            <el-table-column
              align="center"
              label="ID"
              width="200"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.objectId }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="项目名称" align="center"> -->
            <el-table-column
              align="center"
              :label="$translateTitle('product.itemname')"
            >
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>

            <!-- <el-table-column label="类型" align="center"> -->
            <el-table-column
              align="center"
              :label="$translateTitle('rule.Type')"
            >
              <template slot-scope="scope">
                <el-tag type="success">
                  {{ scope.row.devType }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- <el-table-column
              label="关联词典"
              align="center"
              show-overflow-tooltip
            > -->
            <el-table-column
              align="center"
              :label="$translateTitle('developer.Associationdictionary')"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-tag
                  type="warning"
                  @click.native="goDict(scope.row.config.dictid)"
                >
                  {{ scope.row.config.dictid }}
                </el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column label="检测标准管理" align="center" width="300"> -->
            <el-table-column
              align="center"
              :label="$translateTitle('developer.Inspectionstandardmanagement')"
              :width="400"
            >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="detailReportChildren(scope.row, 'delete')"
                >
                  <!-- 删除 -->
                  {{ $translateTitle('task.Delete') }}
                </el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="detailReportChildren(scope.row, 'template')"
                >
                  <!-- 模版管理 -->
                  {{ $translateTitle('developer.Templatemanagement') }}
                </el-button>
                <el-button
                  size="small"
                  type="info"
                  @click="productView(scope.row.objectId)"
                >
                  <!-- 绘图 -->
                  {{ $translateTitle('developer.mapping') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pageblock">
          <el-pagination
            layout="sizes, prev, pager, next, jumper"
            :page-size="pagesize"
            :page-sizes="[10, 20, 30, 50]"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
        <!-- <el-dialog
  :append-to-body="true"
          :visible.sync="dialogVisible"
          title="检验质检项目"
          width="60%"
        > -->
        <el-dialog
          :append-to-body="true"
          :title="
            $translateTitle('developer.Inspectionandqualityinspectionitems')
          "
          :visible.sync="dialogVisible"
          width="60%"
        >
          <div class="addContent">
            <el-form
              ref="reportForm"
              :model="reportForm"
              :rules="rules"
            >
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item
                    :label="$translateTitle('task.productname')"
                    :label-width="formLabelWidth"
                    prop="devTypeProduct"
                  >
                    <el-select
                      v-model="reportForm.devTypeProduct"
                      :placeholder="$translateTitle('task.Select')"
                      @change="changeProduct"
                    >
                      <el-option
                        v-for="item in fromOptions"
                        :key="item.name"
                        :label="item.name"
                        :value="item.objectId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!-- <el-form-item
                    prop="name"
                    :label-width="formLabelWidth"
                    label="报告模版字典"
                  > -->
                  <el-form-item
                    :label="
                      $translateTitle('developer.Reporttemplatedictionary')
                    "
                    :label-width="formLabelWidth"
                    prop="name"
                  >
                    <!-- <el-select
                      v-model="reportForm.value"
                      placeholder="请选择"
                      @change="changev"
                    > -->
                    <el-select
                      v-model="reportForm.value"
                      :placeholder="$translateTitle('task.Select')"
                      @change="changev"
                    >
                      <el-option
                        v-for="item in dictoptions"
                        :key="item.key"
                        :label="item.key"
                        :value="item.objectId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!-- <el-form-item
                    prop="name"
                    :label-width="formLabelWidth"
                    label="报告模板名称"
                  > -->
                  <el-form-item
                    :label="$translateTitle('developer.Reporttemplatename')"
                    :label-width="formLabelWidth"
                    prop="name"
                  >
                    <el-input
                      v-model="reportForm.name"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!-- <el-form-item
                    prop="devTypeText"
                    :label-width="formLabelWidth"
                    label="报告模版类型"
                  > -->
                  <el-form-item
                    :label="$translateTitle('developer.Reporttemplatetype')"
                    :label-width="formLabelWidth"
                    prop="devTypeText"
                  >
                    <el-input
                      v-model="reportForm.devTypeText"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$translateTitle('developer.ReporttemplateFrom')"
                    :label-width="formLabelWidth"
                    prop="devTypeFrom"
                  >
                    <el-select
                      v-model="reportForm.devTypeFrom"
                      :placeholder="$translateTitle('task.Select')"
                      @change="changeFrom"
                    >
                      <el-option
                        v-for="item in fromOptions"
                        :key="item.key"
                        :label="item.key"
                        :value="item.objectId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item
                    :label="$translateTitle('developer.datafile')"
                    :label-width="formLabelWidth"
                    prop="devTypeFile"
                  >
                    <el-col :span="4">
                      <p
                        v-if="selected_file && selected_file.src"
                        style="font-weight: bold; text-align: center"
                      >
                        {{ selected_file.name }}
                      </p>
                    </el-col>

                    <el-col :span="4">
                      <div>
                        <label
                          class="img-uploader-label"
                          for="inputId"
                        />
                        <input
                          id="inputId"
                          ref="input"
                          accept="*.pdf, *.doc"
                          style="display: none"
                          type="file"
                          @change="file_selected($event)"
                        />
                      </div>
                    </el-col>
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="12">
                  <el-form-item
                    :label-width="formLabelWidth"
                    prop="client"
                    label="适用产品"
                  >
                    <el-select
                      v-model="reportForm.client"
                      multiple
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
                </el-col> -->
                <!-- <el-col
                  v-for="(item, index) in arrlist"
                  :key="index"
                  :span="12"
                >
                  <el-form-item
                    :label-width="formLabelWidth"
                    :label="item.title.zh"
                    :prop="item.name"
                    :required="item.required"
                  >
                    <el-select
                      v-if="item.type == 'Boolean'"
                      v-model="reportForm[item.name]"
                      style="width: 100%"
                      class="notauto"
                      readonly
                    >
                      <el-option :value="true" label="是" />
                      <el-option :value="false" label="否" />
                    </el-select>
                    <el-input v-else v-model="reportForm[item.name]" />
                  </el-form-item>
                </el-col> -->
              </el-row>
            </el-form>
          </div>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <span
              v-if="dictoptions.length == 0"
              class="left"
              style="float: left"
            >
              <el-link
                type="primary"
                @click.native="createDict()"
              >
                暂无报告模板字典,点击前去新建报告模板字典
              </el-link>
            </span>
            <el-button @click="dialogVisible = false">
              <!-- 取消 -->
              {{ $translateTitle('developer.cancel') }}
            </el-button>
            <!-- <el-button type="primary" @click.native="addReport">确 定</el-button> -->
            <el-button
              type="primary"
              @click.native="addReporttemp('reportForm')"
            >
              <!-- 确定 -->
              {{ $translateTitle('developer.determine') }}
            </el-button>
          </span>
        </el-dialog>
        <!--标准模版添加-->
        <el-dialog
          :append-to-body="true"
          :title="$translateTitle('developer.Newstandardtemplate')"
          :visible.sync="dialogChildrenForm"
          width="30%"
        >
          <el-form
            ref="childrenFormRef"
            :model="childrenform"
          >
            <!-- <el-form-item :label-width="formLabelWidth" label="模版名称"> -->
            <el-form-item
              :label="$translateTitle('developer.Templatename')"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="childrenform.name"
                autocomplete="off"
              />
            </el-form-item>

            <!-- <el-form-item :label-width="formLabelWidth" label="模版模型"> -->
            <el-form-item
              :label="$translateTitle('developer.Templatemodel')"
              :label-width="formLabelWidth"
            >
              <img
                v-if="childrenform.imageSrc"
                class="avatar"
                :src="fileDomain + childrenform.imageSrc"
              />

              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              />
              <form
                ref="uploadform"
                enctype="multipart/form-data"
                method="POST"
                style="position: absolute"
              >
                <input
                  style="
                    position: relative;
                    top: -100px;
                    z-index: 5;
                    width: 100px;
                    height: 100px;
                    cursor: pointer;
                    opacity: 0;
                  "
                  type="file"
                  @change="upload($event)"
                />
              </form>
            </el-form-item>
            <!-- <el-form-item :label-width="formLabelWidth" label="排序"> -->
            <el-form-item
              :label="$translateTitle('menu.sort')"
              :label-width="formLabelWidth"
            >
              <el-input-number
                v-model="childrenform.index"
                autocomplete="off"
                :min="1"
              />
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogChildrenForm = false">
              <!-- 取消 -->
              {{ $translateTitle('developer.cancel') }}
            </el-button>
            <el-button
              type="primary"
              @click.native="addStandardChildren"
            >
              <!-- 确定 -->
              {{ $translateTitle('developer.determine') }}
            </el-button>
          </div>
        </el-dialog>
        <!--模版管理-->
        <!-- <el-dialog
  :append-to-body="true" :visible.sync="dialogTableVisible" title="模版" top="5vh"> -->
        <el-dialog
          :append-to-body="true"
          :title="$translateTitle('product.Template')"
          top="5vh"
          :visible.sync="dialogTableVisible"
        >
          <el-table
            :data="producttable"
            style="width: 100%; text-align: center"
          >
            <!-- <el-table-column
              label="序号"
              type="index"
              align="center"
              width="100"
            /> -->
            <el-table-column
              align="center"
              :label="$translateTitle('equipment.serialnumber')"
              type="index"
              width="130"
            />
            <!-- <el-table-column label="名称" align="center" width="100"> -->
            <el-table-column
              align="center"
              :label="$translateTitle('equipment.name')"
              width="130"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="内容" align="center"> -->
            <el-table-column
              align="center"
              :label="$translateTitle('concentrator.content')"
            >
              <template slot-scope="scope">
                <el-image
                  :preview-src-list="[
                    `${scope.row.config.konva.Stage.children[0].children[0].attrs.source}`,
                  ]"
                  :src="
                    scope.row.config.konva.Stage.children[0].children[0].attrs
                      .source
                  "
                  style="z-index: 9999; width: 100px; height: 100px"
                />
              </template>
            </el-table-column>
            <!-- <el-table-column label="模版管理" align="center"> -->
            <el-table-column
              align="center"
              :label="$translateTitle('developer.Templatemanagement1')"
            >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click="productView(scope.row.objectId)"
                >
                  <!-- 绘图 -->
                  {{ $translateTitle('developer.mapping') }}
                </el-button>
                <el-button
                  size="small"
                  type="删除"
                  @click="deleteProduct(scope.row)"
                >
                  <!-- 删除 -->
                  {{ $translateTitle('task.Delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pageblock">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :page-size="productpagesize"
              :page-sizes="[10, 20, 30, 50]"
              :total="producttotal"
              @current-change="handleProductChange"
              @size-change="handleProductSize"
            />
          </div>
        </el-dialog>

        <!--台体查看弹窗-->
        <!-- <el-dialog
  :append-to-body="true" :visible.sync="iotHubDialogShow" title="台体列表" top="5vh"> -->
        <el-dialog
          :append-to-body="true"
          :title="$translateTitle('product.platformlist')"
          top="5vh"
          :visible.sync="iotHubDialogShow"
        >
          <el-table
            :data="iotHubProductList"
            stripe
            style="width: 100%; text-align: center"
          >
            <!-- <el-table-column label="序号" type="index" />
            <el-table-column label="名称" prop="name" />
            <el-table-column label="描述" prop="desc" /> -->
            <el-table-column
              :label="$translateTitle('equipment.serialnumber')"
              type="index"
              :width="150"
            />
            <el-table-column
              :label="$translateTitle('equipment.name')"
              prop="name"
            />
            <el-table-column
              :label="$translateTitle('developer.describe')"
              prop="desc"
            />

            <!-- <el-table-column label="网络类型" align="center"> -->
            <el-table-column
              align="center"
              :label="$translateTitle('developer.Networktype')"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.netType == 'CELLULAR'">
                  {{ $translateTitle('product.honeycomb') }}(2G/3G/4G)
                </span>
                <span v-else-if="scope.row.netType == 'WIFI'">WiFi</span>
                <span v-else-if="scope.row.netType == 'ETHERNET'">
                  {{ $translateTitle('product.ethernet') }}
                </span>
                <span v-else-if="scope.row.netType == 'LORA'">LoRaWAN</span>
                <span v-else>{{ scope.row.netType }}</span>
              </template>
            </el-table-column>
          </el-table>
          <p><br /></p>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>
<script>
  import { batch } from '@/api/Batch/index'
  import { queryProduct, delProduct, postProduct } from '@/api/Product'
  import { fileUpload, deleteFile } from '@/api/Proxy'
  import { getDictCount } from '@/api/Dict'
  import { cereteReport, postReportFile, putReportFile } from '@/api/Platform'
  export default {
    name: 'ModelManamge',
    components: {},
    data() {
      return {
        rules: {
          value: [
            {
              type: 'string',
              required: true,
              message: '请选择报告模板',
              trigger: 'change',
            },
          ],
          client: [
            {
              type: 'array',
              required: true,
              message: '请选择适用产品',
              trigger: 'change',
            },
          ],
          name: [
            { required: true, message: '请填写报告模板名称', trigger: 'blur' },
          ],
          devTypeText: [
            { required: true, message: '请填写报告模版类型', trigger: 'blur' },
          ],
          devTypeFrom: [
            { required: true, message: '请选择报告模版表单', trigger: 'blur' },
          ],
          devTypeFile: [
            { required: true, message: '请上传报告模板文件', trigger: 'blur' },
          ],
        },
        arrlist: {},
        dictoptions: [],
        fromOptions: [],
        value: '',
        action: 'http://file.iotn2n.com/shapes/upload',
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
        ipaddr: '',
        formLabelWidth: '120px',
        dialogVisible: false,
        formInline: {
          name: '',
        },
        pagesize: 10,
        start: 0,
        total: 0,
        // 检验项目模板
        tableDataReport: [],
        reportForm: {
          name: '',
          product: '',
          model: '',
          file: '',
          nodeType: '',
          devTypeText: '',
          word: '',
          client: [],
        },
        childrenform: {
          name: '',
          imageSrc: '',
          index: 1,
        },
        dialogChildrenForm: false,
        // 模版管理
        dialogTableVisible: false,
        producttable: [],
        productpagesize: 10,
        producttotal: 0,
        productstart: 0,
        file: '',
        productListForReport: [],
        currentProduct: {},
        currentItemCount: 0,
        selected_file: {},
        iotHubProductList: [],
        iotHubDialogShow: false,
      }
    },
    computed: {
      fileDomain: function () {
        return 'http://file.iotn2n.com'
      },
    },
    mounted() {
      this.quertDict()
      this.getReport()
    },
    methods: {
      createDict() {
        this.$router.push({
          path: '/dashboard/dict',
          query: {
            dictid: '',
            type: 'report_type',
          },
        })
      },
      goDict(id) {
        this.$router.push({
          path: '/dashboard/dict',
          query: {
            dictid: id,
            type: 'device',
          },
        })
      },
      // 查询报告模板字典
      async quertDict() {
        let params = {
          order: '-createdAt',
          limit: 10,
          skip: 0,
          where: { 'data.cType': 'report_type' },
        }
        const { results = [] } = await getDictCount(params)
        this.dictoptions = results
        const { results: fromOptions = [] } = await queryProduct({})
        this.fromOptions = fromOptions
      },
      changev(v) {
        console.log(v)
        var result = this.dictoptions.filter((i) => {
          return i.objectId == v
        })
        this.arrlist = result[0]
        console.log(JSON.stringify(this.arrlist))
      },
      changeProduct(v) {
        let r = this.fromOptions.filter((i) => {
          return i.objectId == v
        })
        console.log(r, 'changeFrom')
        // var result = this.dictoptions.filter((i) => {
        //   return i.objectId == v
        // })
        // this.arrlist = result[0]
        // console.log(JSON.stringify(this.arrlist))
      },
      changeFrom(v) {
        console.log(v)
      },
      async getIotHubProduct() {
        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.5)',
        })
        let params = {
          where: {
            category: 'IotHub',
          },
          order: '-updatedAt', // -updatedAt  updatedAt
        }
        const { results = [] } = await queryProduct(params)
        loading.close()
        this.iotHubDialogShow = true
        this.iotHubProductList = results
      },
      async getReport() {
        let params = {
          skip: this.start,
          limit: this.pagesize,
          where: {
            'config.temp.identifier': 'inspectionReportTemp',
            // desc: '0',
            // category: 'Evidence',
            // nodeType: 1,
          },
          order: '-updatedAt', // -updatedAt  updatedAt
        }
        const { results = [] } = await queryProduct(params)
        this.tableDataReport = results
        this.productListForReport = results
      },
      handleSizeChange(val) {
        this.pagesize = val
        this.getReport()
      },
      handleCurrentChange(val) {
        this.start = (val - 1) * this.pagesize
        this.getReport()
      },
      handleProductSize(val) {
        this.productpagesize = val
        this.detailReportChildren(this.currentProduct)
      },
      handleProductChange(val) {
        this.start = (val - 1) * this.pagesize
        this.detailReportChildren(this.currentProduct)
      },
      file_selected(event) {
        var file = event.target.files[0]
        console.log(file)
        // 判断是否上传的是word文件
        const regx = /.*(.doc|.docx)$/ // 判断返回的文件是否为word文件
        console.log(regx.test(file.name))
        if (regx.test(file.name)) {
          this.fileRead(file)
          // this.uploadDocx(file)
          this.reportForm.file = file
        } else {
          this.$message({
            type: 'error',
            message: '只允许上传后缀为doc,docx的文件',
          })
        }
      },
      async uploadDocx(file) {
        var formdata = new FormData()
        formdata.append('file', file)
        const res = await fileUpload(formdata)
        console.log(res)
      },
      fileRead(file) {
        const reader = new FileReader()
        var vm = this
        reader.vue = this
        reader.readAsDataURL(file)
        reader.onload = function () {
          // 放到上个函数里,vue不会及时刷新视图
          vm.selected_file = file

          vm.selected_file.src = this.result
        }
      },
      // 增加设备弹窗
      addStandard() {
        this.dialogVisible = true
      },
      // 按照名称查询
      searchProduct(name) {
        console.log(name)
      },
      // 添加报告模板
      addReporttemp(type) {
        var config = JSON.stringify({
          konva: {
            Stage: {
              attrs: {
                x: 14,
                y: 29,
                id: 'container',
                width: 1868,
                height: 469,
                draggable: true,
              },
              children: [
                {
                  attrs: {
                    id: 'Layer_FiO[E',
                  },
                  children: [
                    {
                      attrs: {
                        id: 'Group_Pv]A6',
                        width: 2000,
                        height: 2000,
                      },
                      children: [],
                      className: 'Group',
                    },
                  ],
                  className: 'Layer',
                },
              ],
              className: 'Stage',
            },
          },
          temp: {
            identifier: 'inspectionReportTemp',
            dictid: this.arrlist.objectId,
          },
        })
        var formdata = new FormData()
        formdata.append('name', this.reportForm.name)
        formdata.append('devType', this.reportForm.devTypeText)
        formdata.append('config', config)
        formdata.append('file', this.reportForm.file)
        console.log(formdata, 'formdata')
        this.$refs[type].validate(async (valid) => {
          if (valid) {
            const { result, error } = await cereteReport(formdata)
            if (result) {
              this.$message({ type: 'success', message: '报告创建成功!' })
              this.$refs['reportForm'].resetFields()
              this.dialogVisible = false
              this.getReport()
            } else {
              this.$message({ type: 'error', message: `报告创建失败${error}` })
              console.log(error)
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      addReport(nodeTypeText) {
        // 添加质检项目

        var postData = {}
        // 如果用户上传了文件,就调用 post
        if (this.selected_file && this.selected_file.size) {
          /*         postData = {
            devType: this.reportForm.devTypeText,
            name: this.reportForm.name,
            config: {
              identifier: "inspectionReportTemp",
              client: this.reportForm.client
            },
            file: this.selected_file
          }; */

          const formData = new FormData()

          const configTemp = {
            identifier: 'inspectionReportTemp',
            client: this.reportForm.client,
          }

          formData.append('devType', this.reportForm.devTypeText)
          formData.append('name', this.reportForm.name)
          formData.append('config', JSON.stringify(configTemp))

          formData.append('file', this.selected_file)

          this.postReportTemp(formData)
        } else {
          postData = {
            config: {
              identifier: 'inspectionReportTemp',
              name: '组态',
              client: this.reportForm.client, // 适用产品
            },
            desc: String(0), // 页码,默认0
            devType: this.reportForm.devTypeText, // 产品分组类型 -> 质检项目模版名称  2020 08-10 hughwang
            name: this.reportForm.name, // 报告模版名称
            nodeType: 1, // 设备0 or 网关1
            category: 'Evidence',
          }

          this.putReportTemp('gatewayFlag', postData)
        }
      },
      async postReportTemp(formData) {
        console.log(formData, 'formData')
        return false
        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.6)',
        })
        const res = await postReportFile(formData)
        loading.close()
        if (res) {
          if (response) {
            this.$message({ type: 'success', message: `创建成功` })
            this.$refs['reportForm'].resetFields()
            this.dialogVisible = false
            this.getReport()
          } else {
            this.$message({ type: 'error', message: `创建失败}` })
          }
        }
      },
      putReportTemp(nodeTypeText, postData) {
        // 通过节点类型判断
        putReportFile(postData).then((response) => {
          if (response) {
            if (nodeTypeText == 'deviceFlag') {
              this.$message({ type: 'success', message: `新增成功` })
              this.$refs['childrenFormRef'].resetFields()
              this.dialogChildrenForm = false
            } else {
              this.$message({ type: 'success', message: `创建成功` })
              this.$refs['reportForm'].resetFields()
              this.dialogVisible = false
            }
            this.getReport()
          }
        })
      },
      // 增加子模版
      addStandardChildren() {
        if (this.childrenform.imageSrc == '') {
          this.$message('请上传模版图片')
          return
        }
        // 添加子项
        var topoData = {
          config: {
            name: '组态',
            client: this.reportForm.client,
            layer: {
              width: 600,
              height: 850,
              backColor: '#eee',
              backgroundImage: this.childrenform.imageSrc,
              widthHeightRatio: '',
            },
            deviceid: '',
            components: [],
            index: this.childrenform.index,
          },
          icon: this.childrenform.imageSrc,
          nodeType: 0, // 设备
          desc: String(this.currentItemCount + 1), // 页码,默认0
          devType: this.currentDevType, // 产品分组类型
          name: this.childrenform.name,
          category: 'Evidence',
        }

        this.putReportTemp('deviceFlag', topoData)
      },
      async detailReportChildren(row, type) {
        this.currentProduct = row
        var where = {
          'config.id': row.objectId,
        }
        let params = {
          limit: this.productpagesize,
          skip: this.productstart,
          keys: 'count(*)',
          where: JSON.stringify(where),
          order: 'createdAt', // -updatedAt  updatedAt
        }
        const { count = 0, results } = await queryProduct(params)

        this.producttable = results
        this.producttotal = count
        if (type == 'template') {
          this.dialogTableVisible = true
        } else {
          let batchParams = []
          results.forEach((i) => {
            batchParams.push({
              method: 'DELETE',
              path: `/classes/Product/${i.objectId}`,
              body: {},
            })
          })
          console.log(batchParams)
          batch(batchParams)
            .then((res) => {
              console.log(res)
            })
            .catch((e) => {
              console.log(e)
            })
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getReport()
        }
        // const loading = this.$loading({text: 'Loading',spinner: 'el-icon-loading'})
      },
      deleteImgsrc() {
        event.stopPropagation()
        this.childrenform.imageSrc = ''
      },
      productView(id) {
        // #topoUrl
        this.$router.push({
          path: '/Topo',
          query: {
            productid: id,
            type: 'product',
          },
        })
      },
      // 删除产品
      deleteProduct(row) {
        // this.$log(row)
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
        }).then(async () => {
          const res = await delProduct(row.objectId)
          this.$message({ type: 'success', message: `删除成功` })
          this.detailReportChildren(this.currentProduct)
        })
      },
      // 图片上传
      upload(event, type) {
        if (event) {
          var file = event.target.files[0]
          var name = file.name
          var filetype = event.target.files[0].type
          this.imgtype = type
          this.uploadFile(file, name) // 执行上传接口
        }
      },
      // 上传doc文件
      submitUpload(v) {
        console.log(v)
        console.log(this.$refs.input)
        const input = this.$refs.input
        console.log(input.target)
      },
      uploadFile(file, name) {
        var formdata = new FormData()
        formdata.append('file', file)
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
        this.$http.post(Cookies.get('fileserver'), formdata).then((res) => {
          if (res) {
            this.childrenform.imageSrc = res.body.src
          }
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .modelmanamge {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #ffffff;
    ::v-deep .el-select {
      width: 100%;
    }
    ::v-deep .el-date-editor {
      width: 100%;
    }
    ::v-deep .el-input-number {
      width: 100%;
    }
    .tableblock {
      margin-top: 20px;
    }
    .pageblock {
      margin-top: 20px;
    }

    .img-uploader-label {
      position: relative;
      display: inline-block;
      width: 76px;
      height: 76px;
      overflow: hidden;
      color: #ccc;
      border: 2px dashed;
      transition: all 0.25s;
      &::before,
      &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        content: '';
      }
      &::before {
        width: 20px;
        margin: -2px 0 0 -10px;
        border-top: 4px solid;
      }
      &::after {
        height: 20px;
        margin: -10px 0 0 -2px;
        border-left: 4px solid;
      }
      &:hover {
        color: skyblue;
      }
    }
  }
</style>
<style>
  .el-image-viewer__wrapper {
    z-index: 999999999 !important;
  }
  .avatar-uploader {
    display: inline-block;
  }
  .avatar-uploader .el-upload {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    width: 150px;
    height: 150px;
    font-size: 28px;
    line-height: 150px;
    color: #8c939d;
    text-align: center;
    border: 1px dashed #cccccc;
  }
  .avatar {
    display: block;
    width: 150px;
    height: 150px;
  }
  .el-upload-list__item-thumbnail {
    position: relative;
    z-index: 1;
    display: inline-block;
    width: 70px;
    height: 70px;
    margin-left: -80px;
    vertical-align: middle;
    background-color: #fff;
  }
  /* @media screen and (max-width: 1350px) {
  .modelmanamge .el-col {
    width: 100%;
  }
} */
</style>
