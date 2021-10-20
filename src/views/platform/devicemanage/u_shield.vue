<template>
  <div class="u_shield">
    <!--     <Pumpdepartment
      style="width:360px;height:100vh;overflow:scroll;flex-shrink:0;padding:10px;"
      @pumpDetail="getPumpNode"
    /> -->
    <div style="width: 360px; height: 100vh"></div>

    <div
      class="u_shieldright"
      style="width: calc(100% - 360px); padding: 20px"
    >
      <el-form
        class="demo-form-inline"
        :inline="true"
        :model="formInline"
        size="small"
      >
        <el-form-item label="U盾状态分类">
          <el-select
            v-model="formInline.status"
            placeholder="U盾状态分类"
          >
            <el-option
              label="全部"
              value="all"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应用实验室">
          <el-select
            v-model="formInline.laboratory"
            placeholder="应用实验室"
          >
            <el-option
              label="全部"
              value="all"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="U盾编号">
          <el-input
            v-model="formInline.unumber"
            placeholder="U盾编号"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click.native="onSubmit"
          >
            查询
          </el-button>
          <el-button
            type="primary"
            @click.native="reseting"
          >
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button
          size="small"
          type="success"
          @click="uShield"
        >
          U盾扫描
        </el-button>
      </div>
      <div class="blocktable">
        <el-table
          :data="tableData"
          style="width: 100%; text-align: center"
        >
          <el-table-column
            label="序号"
            type="index"
            width="50"
          />
          <el-table-column
            align="center"
            label="U盾序列号"
            width="250"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.basedata.SerialNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="证书拥有者"
            width="300"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.basedata.Subject }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="颁发机构"
            width="300"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.basedata.Issuer }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="数据签名"
            show-overflow-tooltip
            width="300"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.basedata.bstrCertB64 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="发证时间"
            width="150"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.basedata.beforeDate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="到期时间"
            width="150"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attributes.basedata.afterDate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="分配状态"
            width="100"
          />
          <el-table-column
            align="center"
            label="授权单位"
            width="200"
          />
          <el-table-column
            align="center"
            label="授权个人"
            width="200"
          />
          <el-table-column
            align="center"
            label="U盾管理"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                size="small"
                type="primary"
                @click="editorUdun(scope.row)"
              />
              <el-button
                icon="el-icon-delete"
                size="small"
                type="danger"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="blocktable">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pagesize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <!--U盾弹窗-->
    <el-dialog
      :append-to-body="true"
      title="U盾设备赋权"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="ushieldform"
        :model="ushieldform"
        :rules="ushieldrule"
        size="small"
      >
        <p
          style="
            height: 40px;
            margin-top: 0;
            font-size: 14px;
            color: #409eff;
            border-bottom: 1px solid #cccccc;
          "
        >
          U盾详情信息
        </p>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="U盾序列号"
              :label-width="formLabelWidth"
              prop="unumber"
            >
              <el-input
                v-model="ushieldform.unumber"
                autocomplete="off"
                placeholder="U盾序列号，插入U盾自动填充"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="证书拥有者"
              :label-width="formLabelWidth"
              prop="name"
            >
              <el-input
                v-model="ushieldform.name"
                autocomplete="off"
                placeholder="U盾申办人姓名，U盾扫描后自动录入"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="发证日期"
              :label-width="formLabelWidth"
              prop="startdate"
            >
              <el-input
                v-model="ushieldform.startdate"
                autocomplete="off"
                placeholder="U盾正式适用日期，U盾扫描后自动录入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="颁发机构"
              :label-width="formLabelWidth"
              prop="bidunit"
            >
              <el-input
                v-model="ushieldform.bidunit"
                autocomplete="off"
                placeholder="取证设备颁发机构"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="到期日期"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="ushieldform.enddate"
                autocomplete="off"
                placeholder="U盾有效期到期日期，U盾扫描后自动录入"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="Ukey证书"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="ushieldform.ukey"
                autocomplete="off"
                placeholder="请输入Ukey证书信息"
                readonly
                :rows="4"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <p
          v-show="ushieldid != ''"
          style="
            height: 40px;
            font-size: 14px;
            color: #409eff;
            border-bottom: 1px solid #cccccc;
          "
        >
          U盾认证信息
        </p>
        <el-row v-show="ushieldid != ''">
          <el-col :span="12">
            <el-form-item
              label="授权单位"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="ushieldform.company"
                placeholder="请选择通过资质认证的企业"
              >
                <el-option
                  v-for="item in companylist"
                  :key="item.id"
                  :label="item.attributes.empower.abbrname"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="授权个人"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="ushieldform.username"
                autocomplete="off"
                placeholder="请选择通过资质认证的个人"
              >
                <el-option
                  v-for="item in personlist"
                  :key="item.id"
                  :label="item.attributes.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click.native="addUshield"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // import Pumpdepartment from '@/components/resource/pumpdepartment'
  import { returnLogin } from '@/utils/utilwen'
  // import Parse from 'parse'
  import { getCert } from '@/api/u_shield'
  import { isvalidUsername } from '@/utils/validate'
  export default {
    components: {
      // Pumpdepartment
    },
    data() {
      return {
        formInline: {
          unumber: '',
          status: 'all',
          laboratory: '',
        },
        tableData: [],
        dialogFormVisible: false,
        formLabelWidth: '120px',
        ushieldform: {
          name: '',
          unumber: '',
          bidunit: '',
          issueunit: '',
          phone: '',
          ukey: '',
          startdate: '',
          enddate: '',
          address: '',
          company: '',
          username: '',
        },
        ushieldrule: {
          name: [
            { required: true, message: '申办人姓名不能为空', trigger: 'blur' },
          ],
          unumber: [
            { required: true, message: 'U盾序列号不能为空', trigger: 'blur' },
          ],
          bidunit: [
            {
              required: true,
              message: '申办单位名称不能为空',
              trigger: 'blur',
            },
          ],
          startdate: [
            { required: true, message: '发证日期不能为空', trigger: 'blur' },
          ],
          address: [
            {
              required: true,
              message: '申办单位地址不能为空',
              trigger: 'blur',
            },
          ],
        },
        companylist: [],
        personlist: [],
        pagesize: 10,
        start: 0,
        total: 0,
        ushieldid: '',
      }
    },
    mounted() {
      this.getUshield()
    },
    methods: {
      getUshield(start) {
        if (start == 0) {
          this.start = 0
        }
        var Devices = Parse.Object.extend('Devices')
        var devices = new Parse.Query(Devices)
        devices.skip(this.start)
        devices.limit(this.pagesize)
        devices.equalTo('basedata.type', 'ukey')
        devices.count().then(
          (count) => {
            this.total = count
            devices.find().then((response) => {
              this.tableData = response
            })
          },
          (error) => {
            returnLogin(error)
          }
        )
      },
      editorUdun(row) {
        // this.getPerson();
        // this.getCompany();
        this.ushieldid = row.id
        this.dialogFormVisible = true
        var Devices = Parse.Object.extend('Devices')
        var devices = new Parse.Query(Devices)
        devices.get(this.ushieldid).then(
          (response) => {
            this.ushieldform.unumber = response.attributes.basedata.SerialNumber
            this.ushieldform.name = response.attributes.basedata.Subject
            this.ushieldform.startdate = response.attributes.basedata.beforeDate
            this.ushieldform.enddate = response.attributes.basedata.afterDate
            this.ushieldform.bidunit = response.attributes.basedata.Issuer
            this.ushieldform.ukey = response.attributes.basedata.bstrCertB64
          },
          (error) => {
            returnLogin(error)
          }
        )
      },
      // U盾赋权
      uShield() {
        this.dialogFormVisible = true
        this.ushieldid = ''
        getCert()
          .then((response) => {
            if (response) {
              this.ushieldform.unumber = response.SerialNumber
              this.ushieldform.name = response.Subject
              this.ushieldform.startdate = response.beforeDate
              this.ushieldform.enddate = response.afterDate
              this.ushieldform.bidunit = response.Issuer
              this.ushieldform.ukey = response.bstrCertB64
            }
          })
          .catch((error) => {
            this.$message.error(error.error)
          })
      },
      getCompany() {
        var Authentication = Parse.Object.extend('Authentication')
        var authentication = new Parse.Query(Authentication)
        authentication.equalTo('status', 'Pass')
        authentication.find().then(
          (responseauth) => {
            this.companylist = responseauth
          },
          (error) => {
            returnLogin(error)
          }
        )
      },
      getPerson() {
        var PersonAuthtication = Parse.Object.extend('PersonAuthtication')
        var personauthtication = new Parse.Query(PersonAuthtication)
        personauthtication.equalTo('status', 'Pass')
        personauthtication.find().then(
          (responseperson) => {
            this.personlist = responseperson
          },
          (error) => {
            returnLogin(error)
          }
        )
      },
      // 新增U盾做判断
      addUshield() {
        var Product = Parse.Object.extend('Product')
        var product = new Parse.Query(Product)
        product.equalTo('devType', 'ukey')
        product.find().then(
          (resproduct) => {
            var Devices = Parse.Object.extend('Devices')
            var devices = new Devices()
            var devices1 = new Parse.Query(Devices)
            devices1.equalTo('basedata.SerialNumber', this.ushieldform.unumber)
            devices1.find().then(
              (response) => {
                if (response.length == 0) {
                  if (this.ushieldid != '') {
                    devices.id = this.ushieldid
                  }
                  var Product1 = Parse.Object.extend('Product')
                  var product1 = new Product()
                  product1.id = resproduct[0].id
                  devices.set('product', product1)
                  devices.set('basedata', {
                    SerialNumber: this.ushieldform.unumber,
                    Subject: this.ushieldform.name,
                    beforeDate: this.ushieldform.startdate,
                    afterDate: this.ushieldform.enddate,
                    Issuer: this.ushieldform.bidunit,
                    bstrCertB64: this.ushieldform.ukey,
                    type: 'ukey',
                  })
                  devices.save().then(
                    (resultes) => {
                      if (resultes) {
                        this.$message.success('U盾创建成功')
                        this.ushieldid = ''
                        this.dialogFormVisible = false
                      }
                    },
                    (error) => {
                      returnLogin(error)
                    }
                  )
                } else {
                  this.$message.error('此U盾已存在')
                }
              },
              (error) => {
                returnLogin(error)
              }
            )
          },
          (error) => {
            returnLogin(error)
          }
        )
      },
    },
  }
</script>
<style lang="scss" scoped>
  .u_shield {
    /* padding: 20px; */
    box-sizing: border-box;
    /* background: url("../../imgages/echartbanner1.png") no-repeat; */
    /* background-size: cover; */
    display: flex;
    width: 100%;
    min-height: 100%;
    .u_shieldright {
      .blocktable {
        margin-top: 20px;
      }
    }
    ::v-deep .el-dialog__body {
      ::v-deep .el-select {
        width: 100%;
      }
    }
  }
</style>
