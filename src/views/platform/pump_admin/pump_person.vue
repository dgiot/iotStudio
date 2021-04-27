<template>
  <div class="personpump">
    <h3>个人资质审核</h3>
    <div class="empower_top">
      <!--       <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        size="small"
        label-width="100px"
      >
        <el-form-item label="审核状态">
          <el-select v-model="formInline.status" placeholder="审核状态">
            <el-option label="全部" value="all"/>
            <el-option label="待审核" value="Pending"/>
            <el-option label="审核中" value="Auditing"/>
            <el-option label="审核通过" value="Pass"/>
            <el-option label="审核未通过" value="Failed"/>
          </el-select>
        </el-form-item>
        <el-form-item label="申请开始时间">
          <el-date-picker v-model="formInline.starttime" type="datetime" placeholder="选择开始时间"/>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="formInline.endtime" type="datetime" placeholder="选择结束时间"/>
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input v-model="formInline.name" placeholder="请输入企业名称"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="personEmpower">查询</el-button>
          <el-button type="primary">重置</el-button>
        </el-form-item>
      </el-form> -->

      <div class="block_table">
        <el-table
          :data="tableData"
          :cell-style="rowClass"
          :header-cell-style="headClass"
          size="mini"
          stripe
          style="width: 100%; text-align: center"
          border
        >
          <el-table-column label="序号" width="50" type="index" />
          <el-table-column label="企业名称" prop="data.name" />
          <el-table-column label="姓名" prop="data.name" />
          <el-table-column label="企业职务" prop="data.job" />
          <el-table-column label="出生日期">
            <template slot-scope="scope">
              <span>
                {{ $timestampToTime(scope.row.data.birthday).substring(0, 11) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="最高学历">
            <template slot-scope="scope">
              <span>{{ scope.row.data.education }}</span>
            </template>
          </el-table-column>
          <el-table-column label="主修专业">
            <template slot-scope="scope">
              <span>{{ scope.row.data.professional }}</span>
            </template>
          </el-table-column>
          <el-table-column label="个人职称">
            <template slot-scope="scope">
              <span>{{ scope.row.data.positional_titles }}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系方式">
            <template slot-scope="scope">
              <span>{{ scope.row.data.userphone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="从业时间">
            <template slot-scope="scope">
              <span>
                {{
                  $timestampToTime(scope.row.data.start_time).substring(0, 11)
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间">
            <template slot-scope="scope">
              <span>
                {{ $utc2beijing(scope.row.createdAt).substring(0, 13) }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="审核状态">
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

          <el-table-column label="审核日期">
            <template slot-scope="scope">
              <span>{{ $timestampToTime(scope.row.data.auditDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核意见">
            <template slot-scope="scope">
              <span v-if="scope.row.data.suggestion">
                {{ scope.row.data.suggestion }}
              </span>
              <span v-else />
            </template>
          </el-table-column>
          <el-table-column label="审核管理" width="180px">
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
      <div class="block_page">
        <el-pagination
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagesize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogFormVisible"
      title="个人资质审核"
      width="80%"
    >
      <el-form label-width="120px" size="mini">
        <el-row>
          <!--左侧-->
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-text="currentRow.data.name" />
            </el-form-item>
            <el-form-item label="出生日期">
              {{ $timestampToTime(currentRow.data.birthday).substring(0, 11) }}
            </el-form-item>
            <el-form-item label="毕业院校">
              <el-input v-text="currentRow.data.graduate_institutions" />
            </el-form-item>
            <el-form-item
              label="身份证编号
"
            >
              <el-input v-text="currentRow.data.identity" />
            </el-form-item>

            <el-form-item label="身份证正反面">
              <img
                :src="fileDomain + currentRow.data.frontimageUrl"
                class="avatar"
              />
            </el-form-item>
            <!--  <el-form-item label="身份证反面">
              <el-input v-text="currentRow.data.frontimageUrl" />
            </el-form-item> -->
            <el-form-item label="家庭地址">
              <el-cascader
                v-model="currentRow.data.addr"
                :options="regionData"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="相关工作年限">
              <el-input v-text="currentRow.data.working_seniority + '年'" />
            </el-form-item>
            <el-form-item label="培训经历">
              <el-input v-text="currentRow.data.training_experience" />
            </el-form-item>
          </el-col>
          <!--左侧-->
          <el-col :span="12">
            <el-form-item label="企业职务">
              <el-input v-text="currentRow.data.job" />
            </el-form-item>
            <el-form-item label="最高学历">
              <el-input v-text="currentRow.data.education" />
            </el-form-item>
            <el-form-item label="主修专业">
              <el-input v-text="currentRow.data.professional" />
            </el-form-item>
            <el-form-item label="个人职称">
              <el-input v-text="currentRow.data.positional_titles" />
            </el-form-item>
            <el-form-item label="职业资质">
              <img
                :src="fileDomain + currentRow.data.joblicenseUrl"
                class="avatar"
              />
            </el-form-item>
            <el-form-item label="开始时间">
              {{
                $timestampToTime(currentRow.data.start_time).substring(0, 11)
              }}
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input v-text="currentRow.data.userphone" />
            </el-form-item>
            <el-form-item label="相关从业经历">
              <el-input v-text="currentRow.data.practitioners_experience" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <!--审核弹窗-->
    <el-dialog :visible.sync="dialogVisible" title="认证审核" width="40%">
      <div>
        <el-form
          ref="verifyFormRef"
          :model="verifyForm"
          :rules="verifyFormRules"
          label-width="100px"
        >
          <el-form-item label="审核状态" prop="status">
            <el-radio-group v-model="verifyForm.status">
              <el-radio :label="0">审核中</el-radio>
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
          <h3
            style="
              height: 40px;
              padding-left: 20px;
              line-height: 40px;
              border: 1px solid #cccccc;
            "
          >
            U盾认证信息
          </h3>
          <el-row>
            <el-col :span="12">
              <el-form-item label="U盾序列号" prop="unumber">
                <el-input
                  v-model="verifyForm.unumber"
                  placeholder="请输入U盾序列号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="U盾KEY值" prop="ukey">
                <el-input
                  v-model="verifyForm.ukey"
                  placeholder="请输入U盾KEY值"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('verifyFormRef')">
          提 交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { regionData, CodeToText } from 'element-china-area-data'
  // import Parse from 'parse'
  import { returnLogin } from '@/utils/return'
  export default {
    data() {
      return {
        dialogVisible: false,
        formInline: {
          name: '',
          status: 'all',
          starttime: '',
          endtime: '',
        },
        tableData: [],
        pagesize: 10,
        start: 0,
        total: 0,
        regionData: regionData,
        verifyForm: {
          status: 1,
          unumber: '',
          ukey: '',
          suggestion: '',
        },
        verifyFormRules: {
          status: [
            { required: true, message: '请选择审核状态', trigger: 'change' },
          ],
          suggestion: [
            { required: true, message: '请填写认证审核意见', trigger: 'blur' },
          ],
          unumber: [
            { required: true, message: '请填写U盾序列号', trigger: 'blur' },
          ],
          ukey: [{ required: true, message: '请填写U盾KEY', trigger: 'blur' }],
        },
        currentRow: { data: {} },
        dialogFormVisible: false,
      }
    },
    computed: {
      fileDomain: function () {
        return this.$getUrlPrefix(this.$Cookies.get('fileserver'))
      },
    },
    mounted() {
      this.personEmpower()
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
      personEmpower(start) {
        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.5)',
        })

        this.$axiosWen
          .get('/classes/Dict', {
            params: {
              where: {
                type: 'PersonAuthtication',
              },
              order: '-updatedAt',
            },
          })
          .then((response) => {
            loading.close()
            if (response && response.results) {
              var list = response.results

              this.tableData = list
            } else {
              this.tableData = list
            }
          })
          .catch((err) => {
            loading.close()
          })
      },
      handleSizeChange(val) {
        this.pagesize = val
        this.personEmpower()
      },
      handleCurrentChange(val) {
        this.start = (val - 1) * this.pagesize
        this.personEmpower()
      },
      lookUp(row) {
        this.dialogFormVisible = true

        this.currentRow = row

        console.log(row)
      },
      // 审核
      examine(row) {
        this.currentRow = row
        this.dialogVisible = true
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var nowtime = new Date().getTime()

            // status unumber ukey suggestion auditDate

            this.currentRow.data.verifyStatus = this.verifyForm.status
            this.currentRow.data.unumber = this.verifyForm.unumber
            this.currentRow.data.ukey = this.verifyForm.ukey
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
                  this.personEmpower()
                }
              })
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
  .personpump {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px 20px 40px 20px;
    background: #ffffff;
    .empower_top {
      .block_table {
        margin-top: 20px;
      }
      .button_group {
        box-sizing: border-box;
        padding-left: 100px;
      }
      .block_page {
        margin-top: 20px;
      }
    }
  }

  table.verify-info {
    width: 100%;
    text-align: center;
    border-collapse: collapse;

    tr {
      line-height: 28px;
    }
  }
</style>
<style>
  .personpump .avatar-uploader .el-upload {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .personpump.avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .personpump .avatar-uploader-icon {
    width: 250px;
    height: 178px;
    font-size: 28px;
    line-height: 178px;
    color: #8c939d;
    text-align: center;
  }
  .personpump .avatar {
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
  .personpump .el-tabs__header {
    margin-top: 20px;
  }
  .personpump .el-select {
    width: 100%;
  }
  .personpump .el-cascader {
    width: 100%;
  }

  .personpump .el-select {
    width: 100%;
  }
  .personpump .el-date-editor {
    width: 100%;
  }
</style>
