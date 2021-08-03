<template>
  <div class="CompanyAuthentication">
    <h3>企业资质审核</h3>
    <div class="CompanyAuthentication_top">
      <!--       <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        size="small"
        label-width="100px"
      >
        <el-form-item label="审核状态">
          <el-select v-model="formInline.region" placeholder="审核状态">
            <el-option label="全部" value="all"/>
            <el-option label="待审核" value="Pending"/>
            <el-option label="审核中" value="Auditing"/>
            <el-option label="审核通过" value="Pass"/>
            <el-option label="审核未通过" value="Failed"/>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="formInline.starttime" type="datetime" placeholder="选择开始时间"/>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="formInline.endtime" type="datetime" placeholder="选择结束时间"/>
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input v-model="formInline.name" placeholder="请输入企业名称"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getEmpower">查询</el-button>
          <el-button type="primary">重置</el-button>
        </el-form-item>
      </el-form>-->

      <div class="pump_table">
        <el-table
          :data="tableData"
          :cell-style="rowClass"
          :header-cell-style="headClass"
          border
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column
            label="企业名称"
            prop="data.CompanyAuthentication.abbrname"
          />
          <el-table-column
            label="统一社会信用代码"
            prop="data.CompanyAuthentication.creditcode"
          />
          <el-table-column
            label="法定代表人姓名"
            width="150"
            prop="data.CompanyAuthentication.businessname"
          />

          <el-table-column
            label="法定代表人身份证号码"
            prop="data.CompanyAuthentication.identity"
          />
          <el-table-column
            label="注册地址"
            prop="data.CompanyAuthentication.addr"
          />

          <el-table-column label="申请时间">
            <template slot-scope="scope">
              <span>{{ $utc2beijing(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="data.Laboratory.laboratoryInfo.name"
            label="实验室名称"
          />

          <el-table-column label="审核日期">
            <template slot-scope="scope">
              <span>{{ scope.row.data.auditDate }}</span>
            </template>
          </el-table-column>

          <el-table-column label="审核状态" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.data.verifyStatus == 0" type="info">
                待审核
              </el-tag>
              <el-tag
                v-else-if="scope.row.data.verifyStatus == 1"
                type="success"
              >
                审核通过
              </el-tag>
              <el-tag
                v-else-if="scope.row.data.verifyStatus == 2"
                type="danger"
              >
                审核未通过
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审核意见" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.data.suggestion }}</span>
            </template>
          </el-table-column>

          <el-table-column width="150" label="审核管理">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="lookUp(scope.row)">
                查看
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="examine(scope.row)"
              >
                审核
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          :page-sizes="[10, 200, 30, 50]"
          :page-size="pagesize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!--审核弹窗-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogVisible"
      title="认证审核"
      width="40%"
    >
      <div>
        <el-form
          ref="verifyFormRef"
          :model="verifyForm"
          :rules="verifyFormRules"
          label-width="100px"
        >
          <el-form-item label="审核状态" prop="status">
            <el-radio-group v-model="verifyForm.status">
              <el-radio :label="0">待审核</el-radio>
              <el-radio :label="2">审核未通过</el-radio>
              <el-radio :label="1">审核通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="suggestion">
            <el-input
              v-model="verifyForm.suggestion"
              :rows="4"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('verifyFormRef')">
          提 交
        </el-button>
      </span>
    </el-dialog>
    <!--查看弹窗-->
    <el-dialog
      v-if="dialogFormVisible"
      :append-to-body="true"
      :visible.sync="dialogFormVisible"
      title="企业资质审核"
      width="80%"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="认证信息" name="first">
          <el-form label-width="160px" size="mini">
            <el-row>
              <!--左侧-->
              <el-col :span="12">
                <el-form-item label="企业名称">
                  <el-input
                    v-text="currentRow.data.CompanyAuthentication.abbrname"
                  />
                </el-form-item>
                <el-form-item label="企业简称">
                  <el-input
                    v-text="currentRow.data.CompanyAuthentication.businessname"
                  />
                </el-form-item>
                <el-form-item label="法人代表名称">
                  <el-input
                    v-text="currentRow.data.CompanyAuthentication.corporname"
                  />
                </el-form-item>
                <el-form-item label="法人代表身份证">
                  <img
                    :src="
                      fileDomain +
                      currentRow.data.CompanyAuthentication.contraryimageUrl
                    "
                    class="avatar"
                  />
                </el-form-item>
                <el-form-item label="注册地址">
                  <el-cascader
                    v-model="currentRow.data.CompanyAuthentication.addr"
                    :options="regionData"
                    style="width: 200px"
                  />
                </el-form-item>
                <el-form-item label="营业年限">
                  <el-input
                    v-text="
                      currentRow.data.CompanyAuthentication.businessduration +
                      '年'
                    "
                  />
                </el-form-item>
                <el-form-item label="注册资金">
                  <el-input
                    v-text="
                      currentRow.data.CompanyAuthentication.registeredcapital
                    "
                  />
                </el-form-item>
                <el-form-item label="企业描述">
                  <el-input
                    v-text="currentRow.data.CompanyAuthentication.businessdesc"
                  />
                </el-form-item>
              </el-col>
              <!--左侧-->
              <el-col :span="12">
                <el-form-item label="企业英文名称">
                  <el-input
                    v-text="currentRow.data.CompanyAuthentication.englishname"
                  />
                </el-form-item>
                <el-form-item label="统一社会信用代码">
                  <el-input
                    v-text="currentRow.data.CompanyAuthentication.creditcode"
                  />
                </el-form-item>
                <el-form-item label="法人代表身份证号">
                  <el-input
                    v-text="currentRow.data.CompanyAuthentication.identity"
                  />
                </el-form-item>
                <el-form-item label="企业营业执照">
                  <img
                    :src="
                      fileDomain +
                      currentRow.data.CompanyAuthentication.businesslicense
                    "
                    class="avatar"
                  />
                </el-form-item>
                <el-form-item label="街道地址">
                  <el-input
                    v-text="currentRow.data.CompanyAuthentication.roadress"
                  />
                </el-form-item>
                <el-form-item label="企业规模">
                  <el-input
                    v-text="currentRow.data.CompanyAuthentication.region"
                  />
                </el-form-item>
                <el-form-item label="经营范围">
                  <el-input
                    v-text="currentRow.data.CompanyAuthentication.businessscope"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="实验室信息" name="third">
          <el-form label-width="120px" size="mini">
            <el-row>
              <!--左侧-->
              <el-col :span="12">
                <el-form-item label="实验室名称">
                  <el-input
                    v-text="currentRow.data.Laboratory.laboratoryInfo.name"
                  />
                </el-form-item>
                <el-form-item label="实验室级别">
                  <el-select
                    v-model="currentRow.data.Laboratory.laboratoryInfo.level"
                    disabled
                    style="width: 100px"
                  >
                    <el-option label="国家级" value="1" />
                    <el-option label="省级" value="2" />
                    <el-option label="地市级" value="3" />
                    <el-option label="县(区)级" value="4" />
                    <el-option label="其他" value="5" />
                  </el-select>
                </el-form-item>
                <el-form-item label="实验室地址">
                  <el-input
                    v-text="currentRow.data.Laboratory.laboratoryInfo.addr"
                  />
                </el-form-item>
                <el-form-item label="建设起止日期">
                  {{
                    $timestampToTime(
                      currentRow.data.Laboratory.laboratoryInfo.buildstarttime
                    ).substring(0, 11)
                  }}
                </el-form-item>
                <el-form-item label="实验室负责人">
                  <el-input
                    v-text="
                      currentRow.data.Laboratory.laboratoryInfo.leadingname
                    "
                  />
                </el-form-item>
                <el-form-item label="实验室联系人">
                  <el-input
                    v-text="currentRow.data.Laboratory.laboratoryInfo.linkname"
                  />
                </el-form-item>
                <el-form-item label="实验室照片">
                  <img
                    :src="
                      fileDomain +
                      currentRow.data.Laboratory.laboratoryInfo.imgsrc
                    "
                    class="avatar"
                  />
                </el-form-item>
                <el-form-item label="主管单位">
                  <el-input
                    v-text="currentRow.data.Laboratory.laboratoryInfo.unit"
                  />
                </el-form-item>

                <el-form-item label="实验室类别">
                  <el-select
                    v-model="currentRow.data.Laboratory.laboratoryInfo.category"
                    style="width: 100px"
                    disabled
                    placeholder="请选择实验室类别"
                  >
                    <el-option label="主实验室" value="1" />
                    <el-option label="辅助实验室" value="2" />
                    <el-option label="其他" value="3" />
                  </el-select>
                </el-form-item>

                <el-form-item label="实验室面积">
                  <el-input
                    v-text="
                      currentRow.data.Laboratory.laboratoryInfo.area + '平方'
                    "
                  />
                </el-form-item>
                <el-form-item label="最新投运时间">
                  {{
                    $timestampToTime(
                      currentRow.data.Laboratory.laboratoryInfo.operationtime
                    ).substring(0, 11)
                  }}
                </el-form-item>
                <el-form-item label="负责人电话">
                  <el-input
                    v-text="
                      currentRow.data.Laboratory.laboratoryInfo.leadingphone
                    "
                  />
                </el-form-item>
                <el-form-item label="联系人电话">
                  <el-input
                    v-text="currentRow.data.Laboratory.laboratoryInfo.linkphone"
                  />
                </el-form-item>
              </el-col>
              <!--左侧-->
              <el-col :span="12">
                <el-form-item label="实验室认证类型">
                  <el-input
                    v-text="currentRow.data.Laboratory.laboratoryInfo.region"
                  />
                </el-form-item>
                <el-form-item label="发证机关">
                  <el-input
                    v-text="
                      currentRow.data.Laboratory.laboratoryInfo.licencsIssuing
                    "
                  />
                </el-form-item>
                <el-form-item label="初次认可">
                  {{
                    $timestampToTime(
                      currentRow.data.Laboratory.laboratoryInfo
                        .initialRecognition
                    ).substring(0, 11)
                  }}
                </el-form-item>
                <el-form-item label="资质内容">
                  <el-input
                    v-text="currentRow.data.Laboratory.laboratoryInfo.desc"
                  />
                </el-form-item>
                <el-form-item label="证书编号">
                  <el-input
                    v-text="
                      currentRow.data.Laboratory.laboratoryInfo.credentialsname
                    "
                  />
                </el-form-item>
                <el-form-item label="签发日期">
                  {{
                    $timestampToTime(
                      currentRow.data.Laboratory.laboratoryInfo.dateOfIssue
                    ).substring(0, 11)
                  }}
                </el-form-item>
                <el-form-item label="有效期至">
                  {{
                    $timestampToTime(
                      currentRow.data.Laboratory.laboratoryInfo.termOfValidity
                    ).substring(0, 11)
                  }}
                </el-form-item>
                <el-form-item label="更新时间">
                  {{
                    $timestampToTime(
                      currentRow.data.Laboratory.laboratoryInfo.updatedDate
                    ).substring(0, 11)
                  }}
                </el-form-item>
                <el-form-item label="证书电子文件">
                  <img
                    :src="
                      fileDomain +
                      currentRow.data.Laboratory.laboratoryInfo.imgsrc1
                    "
                    class="avatar"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { regionData, CodeToText } from 'element-china-area-data'
  // import Parse from 'parse'
  import { returnLogin } from '@/utils/utilwen'
  export default {
    name: '',
    data() {
      const idrules = function (rule, value, callback) {
        var rules =
          /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
        if (!rules.test(value)) {
          if (value.length != 18) {
            callback(new Error('请输入18位身份证号'))
          } else {
            callback(new Error('需要输入正确身份证号码'))
          }
        } else {
          callback()
        }
      }
      const Englishname = function (rule, value, callback) {
        var rules = /^[a-zA-Z&.,\'\/\-\s]+$/g
        if (!rules.test(value)) {
          callback(new Error('请输入英文名称'))
        } else {
          callback()
        }
      }
      const CreditCode = function (rule, value, callback) {
        var rules = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/
        if (!rules.test(value)) {
          callback(new Error('请输入正确统一社会编码'))
        } else {
          if (value.length > 18) {
            callback(new Error('请输入18位统一社会编码'))
          } else {
            callback()
          }
        }
      }
      const Registered = function (rule, value, callback) {
        var rules =
          /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/

        if (!rules.test(value)) {
          callback(new Error('请填写公司注册资金,精确2位小数'))
        } else {
          callback()
        }
      }
      return {
        dialogVisible: false,
        formInline: {
          user: '',
          region: 'all',
        },
        tableData: [],
        start: 0,
        pagesize: 10,
        total: 0,
        authenticationid: '',
        verifyForm: {
          status: 1,
          suggestion: '',
        },
        verifyFormRules: {
          status: [
            { required: true, message: '请选择审核状态', trigger: 'change' },
          ],
          suggestion: [
            { required: true, message: '请填写认证审核意见', trigger: 'blur' },
          ],
        },
        // 查看
        dialogFormVisible: false,
        form1: {
          name: '',
          region: '',
          desc: '',
          identity: '',
          frontimageUrl: '', // 身份证正面照
          contraryimageUrl: '', // 身份证反面照
          businesslicense: '', // 企业营业执照
          businessname: '', // 公司名称
          abbrname: '', // 企业简称
          corporname: '', // 法人代表名称
          englishname: '', // 英文名称
          creditcode: '', // 统一社会信用代码
          addr: [], // 设备地址
          roadress: '', // 街道地址
          businessduration: '', // 营业年限
          businessdesc: '', // 企业描述
          businessscope: '', // 经营范围
          registeredcapital: '', // 注册资金
        },
        regionData: regionData,
        verifyForm1: {
          cnasname: '',
          dateOfIssue: '',
          updatedDate: '',
          initialRecognition: '',
          termOfValidity: '',
          licencsIssuing: '',
          cnasimgsrc: '',
          cnasdesc: '',
        },
        verifyForm2: {
          cmaname: '',
          cmadateOfIssue: '',
          cmalicencsIssuing: '',
          cmatermOfValidity: '',
          cmaimgsrc: '',
          cmadesc: '',
        },
        previewother: {
          otherform: [],
        },
        currentRow: { data: {} },
        activeName: 'first',
      }
    },
    computed: {
      fileDomain: function () {
        return this.$getUrlPrefix(this.$Cookies.get('fileserver'))
      },
    },
    mounted() {
      this.getEmpower()
    },
    methods: {
      // https://www.jianshu.com/p/8c2849558786
      headClass() {
        // 表头居中显示
        return 'text-align:center'
      },
      rowClass() {
        // 表格数据居中显示
        return 'text-align:center'
      },
      // 地址
      getAddr(addr) {
        var addrlength = addr.length
        var text = ''
        for (var i = 0; i < addr.length; i++) {
          text += CodeToText[addr[i]] + '/'
        }
        return text
      },
      // 其他资质
      Others(other) {
        var othertext = []
        for (var i = 0; i < other.length; i++) {
          othertext.push(other[i].name)
        }
        return othertext.join(',')
      },
      // 得到初始化审核列表
      getEmpower() {
        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.5)',
        })

        this.$axiosWen
          .get('iotapi/classes/Dict', {
            params: {
              where: {
                type: 'CompanyAuthentication',
              },
              order: '-updatedAt',
            },
          })
          .then((response) => {
            loading.close()
            if (response && response.results) {
              this.tableData = response.results
              console.log(this.tableData)
            } else {
              this.tableData = []
            }
            // eslint-disable-next-line handle-callback-err
          })
          // eslint-disable-next-line handle-callback-err
          .catch((err) => {
            this.tableData = []
            loading.close()
          })
      },
      lookUp(row) {
        this.dialogFormVisible = true
        this.currentRow = row
        this.currentRow.data = row.data
        console.log(row)
      },
      examine(row) {
        this.currentRow = row
        this.dialogVisible = true
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
      },
      // 审核提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var nowtime = new Date().getTime()

            this.currentRow.data.verifyStatus = this.verifyForm.status

            this.currentRow.data.suggestion = this.verifyForm.suggestion
            this.currentRow.data.auditDate = nowtime

            this.$axiosWen
              .put('classes/Dict/' + this.currentRow.objectId, {
                data: this.currentRow.data,
              })
              .then((res) => {
                if (res) {
                  this.$message({
                    type: 'success',
                    message: '审核成功',
                  })
                  this.$refs[formName].resetFields()
                  this.dialogVisible = false
                  this.getEmpower()
                }
              })
              // eslint-disable-next-line handle-callback-err
              .catch((err) => {
                this.$message({
                  message: '审核失败',
                })
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .CompanyAuthentication {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    padding: 20px 20px 40px 20px;
    background: #ffffff;
    .CompanyAuthentication_top {
      box-sizing: border-box;
      width: 100%;
      height: auto;
      padding-left: 40px;
      .pump_table {
        margin-top: 10px;
      }
      .block {
        margin-top: 20px;
      }
    }
    ::v-deep .el-select {
      width: 100%;
    }
    ::v-deep .el-cascader {
      width: 100%;
    }
    ::v-deep .el-dialog {
      margin-bottom: 40px;
    }
  }
</style>
<style>
  .CompanyAuthentication .avatar-uploader .el-upload {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .CompanyAuthentication.avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .CompanyAuthentication .avatar-uploader-icon {
    width: 250px;
    height: 178px;
    font-size: 28px;
    line-height: 178px;
    color: #8c939d;
    text-align: center;
  }
  .CompanyAuthentication .avatar {
    display: block;
    width: 250px;
    height: 178px;
  }
  .image-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 250px;
    font-size: 30px;
    color: #909399;
    background: #f5f7fa;
  }
</style>
