<template>
  <div class="instruct">
    <div>
      <el-form
        class="demo-form-inline"
        :inline="true"
        :model="formInline"
        size="small"
      >
        <el-form-item>
          <el-input
            v-model="formInline.name"
            placeholder="请输入指令名称"
            style="width: 500px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="Instruct(0)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="instruct_button">
      <div>
        <el-button
          size="small"
          type="primary"
          @click="dialogBtn_em('form', '3', form)"
        >
          新增指令
        </el-button>
        <el-button size="small" type="danger" @click="deleteAll">
          删 除
        </el-button>
      </div>
      <div>
        <el-button size="small" type="success">启 用</el-button>
        <el-button size="small" type="warning">禁 用</el-button>
      </div>
    </div>
    <div class="instruct_table">
      <el-table
        ref="multipleTable"
        :data="instructData"
        style="width: 100%"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column align="center" label="指令名称" sortable width="200">
          <template #default="{ row }">
            {{ row.name }}
          </template>
        </el-table-column>
        <!-- <el-table-column  label="指令编号" align="center" width="120">
          <template #default="{ row }">{{ row.name }}</template>
      </el-table-column>-->
        <el-table-column align="center" label="指令类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.op == 'Read'" type="primary">读</el-tag>
            <el-tag v-else type="success">写</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="指令标识">
          <template #default="{ row }">
            {{ row.di }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="指令序号" prop="order" />
        <el-table-column align="center" label="超时时长">
          <template #default="{ row }">
            {{ row.duration + '秒' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="子网编号" width="200">
          <template #default="{ row }">
            {{ row.pn }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="生效轮次">
          <template #default="{ row }">
            {{ row.rotation }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="是否启用" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.enable" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              @click="dialogBtn_em('', '2', row)"
            >
              编 辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteInstruct(row.objectId)"
            >
              删 除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="pagesize"
        :page-sizes="[10, 20, 30, 40]"
        style="margin-top: 20px"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <!--指令弹窗-->
    <el-dialog
      :append-to-body="true"
      :title="dialogTitle + '指令'"
      :visible.sync="dialogFormVisible"
      @open="openDialog"
    >
      <el-form ref="form" :model="form" :rules="formrule" size="small">
        <h4>&nbsp;&nbsp;指令信息</h4>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="指令名称"
              :label-width="formLabelWidth"
              prop="name"
            >
              <el-input
                v-model="form.name"
                autocomplete="off"
                placeholder="请输入指令名称"
              />
            </el-form-item>
            <el-form-item
              label="操作类型"
              :label-width="formLabelWidth"
              prop="type"
            >
              <el-select v-model="form.type" placeholder="请选择操作类型">
                <el-option label="读" value="r" />
                <el-option label="写" value="w" />
              </el-select>
            </el-form-item>
            <el-form-item
              label="是否启用"
              :label-width="formLabelWidth"
              prop="enable"
            >
              <el-radio-group v-model="form.enable">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="指令指标"
              :label-width="formLabelWidth"
              prop="pointer"
            >
              <el-input
                v-model="form.pointer"
                autocomplete="off"
                placeholder="请输入指令指标"
              />
            </el-form-item>
            <el-form-item
              label="指令序号"
              :label-width="formLabelWidth"
              prop="order"
            >
              <el-input
                v-model="form.order"
                autocomplete="off"
                placeholder="请输入指令序号"
              />
            </el-form-item>

            <p style="padding-left: 125px; font-size: 12px; line-height: 20px">
              1. 指令序号相同,会作为同一组消息发送
              <br />
              2. 消息的发送顺序按照指令序号排序
            </p>
          </el-col>
        </el-row>
        <h4>&nbsp;&nbsp;指令下发策略</h4>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="超时时长"
              :label-width="formLabelWidth"
              prop="duration"
            >
              <el-input
                v-model.number="form.duration"
                autocomplete="off"
                placeholder="请输入超时时长"
              >
                <template slot="append">秒</template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="生效轮次"
              :label-width="formLabelWidth"
              prop="rotation"
            >
              <el-select
                v-model="form.rotation"
                allow-create
                clearable
                default-first-option
                filterable
                placeholder="请选择生效轮次"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <p
                style="
                  position: absolute;
                  top: 40px;
                  margin: 0;
                  font-size: 12px;
                  color: black;
                "
              >
                例如:1,3,5,8;(可选可自主填写)(注意:逗号为英文逗号)
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="子网编号"
              :label-width="formLabelWidth"
              prop="subnet"
            >
              <el-input
                v-model="form.subnet"
                autocomplete="off"
                placeholder="请输入子网编号"
              />
            </el-form-item>
            <el-form-item
              label="发送间隔"
              :label-width="formLabelWidth"
              prop="interval"
            >
              <el-input
                v-model.number="form.interval"
                autocomplete="off"
                placeholder="请输入发送间隔"
              >
                <template slot="append">秒</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="check('form')">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    delIndustry,
    postIndustry,
    queryIndustry,
    updateIndustry,
  } from '@/api/Dict'

  export default {
    name: 'Instruct',
    props: {
      productId: {
        type: String,
        default: '',
      },
      devicesId: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        formInline: {
          name: '',
        },
        options: [
          {
            value: 'first',
            label: '第一轮',
          },
          {
            value: 'last',
            label: '最后一轮',
          },
          {
            value: 'all',
            label: '全部',
          },
        ],
        instructData: [],
        multipleTable: [],
        pagesize: 10,
        start: 0,
        total: 0,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form: {
          name: '',
          pointer: '',
          type: '',
          enable: '',
          duration: '',
          order: '',
          interval: '',
          rotation: '',
          subnet: '',
        },
        formrule: {
          duration: [
            {
              required: true,
              message: '请输入',
              trigger: 'blur',
            },
          ],
          interval: [
            {
              required: true,
              message: '请输入',
              trigger: 'blur',
            },
          ],
          name: [
            {
              required: true,
              message: '指标名称不能为空',
              trigger: 'blur',
            },
          ],
          type: [
            {
              required: true,
              message: '请选择操作类型',
              trigger: 'blur',
            },
          ],
          enable: [
            {
              required: true,
              message: '指标是否启用不能为空',
              trigger: 'change',
            },
          ],
          order: [
            {
              required: true,
              message: '指标序号不能为空',
              trigger: 'blur',
            }, // 指令序号
          ],
          rotation: [
            {
              required: true,
              message: '生效轮次不能为空',
              trigger: 'change',
            },
          ],
          subnet: [
            {
              required: true,
              message: '子网编号不能为空',
              trigger: 'blur',
            },
          ],
          pointer: [
            {
              required: true,
              message: '指令指标不能为空',
              trigger: 'blur',
            },
          ],
        },
        instructid: '',
        dialogTitle: '新增',
      }
    },
    watch: {
      dialogFormVisible: {
        handler(val) {
          if (!val) {
            this.$refs.form.resetFields()
            dgiotlog.log(val)
          }
        },
        deep: true,
      },
      devicesId: {
        handler(val) {
          dgiotlog.log(val)
        },
        deep: true,
      },
    },
    mounted() {
      this.Instruct()
    },
    updated() {},
    methods: {
      dialogClosed() {
        this.dialogFormVisible = false
      },
      openDialog(formName, type, data) {
        this.$nextTick(() => {
          if (this.$refs[formName]) {
            this.$refs[formName].resetFields()
          }
          switch (
            type // 1：查看，2：编辑，3：新增
          ) {
            case '2':
              this.dialogTitle = '编辑'
              this.form = data
              break
            case '3':
              this.dialogTitle = '添加'
              break
            default:
              break
          }
        })
      },
      async Instruct(start = 9) {
        if (start == 0) {
          this.start = 0
        }
        // var Instruct = Parse.Object.extend('Instruct')
        // var instruct = new Parse.Query(Instruct)
        // instruct.equalTo('device', this.devicesId)
        // instruct.skip(this.start)
        // instruct.limit(this.pagesize)
        // if (this.formInline.name) {
        //   instruct.matches('name', this.formInline.name, 'i')
        // }
        // instruct.ascending('order')
        // instruct.count().then(count => {
        //   this.total = count
        //   instruct.find().then(resultes => {
        //     if (resultes) {
        //       this.instructData = resultes
        //     }
        //   })
        // })
        let params = {
          where: {
            device: this.devicesId,
          },
          skip: this.start,
          limit: this.pagesize,
          order: '-createdAt',
          count: 'objectId',
        }
        if (this.formInline.name) {
          params.where.name = this.formInline.name
        }
        const { count = 0, results = [] } = await queryIndustry(params)
        this.total = count
        this.instructData = results
      },
      addInstruct() {
        this.dialogFormVisible = true
        this.$refs.form.resetFields()
      },
      check(formName) {
        this.$refs[formName].validate(async (valid) => {
          let products = {
            className: 'Product',
            objectId: this.productId,
            __type: 'Pointer',
          }
          let devices = {
            className: 'Device',
            objectId: this.devicesId,
            __type: 'Pointer',
          }
          if (valid) {
            let params = {
              device: devices,
              product: products,
              name: this.form.name,
              enable: this.form.enable,
              op: this.form.type,
              rotation: this.form.rotation,
              duration: this.form.duration,
              order: this.form.order,
              interval: this.form.interval,
              di: this.form.pointer,
              pn: this.form.subnet,
              devaddr: this.form.lowerhair,
            }
            let res
            if (this.instructid != '') {
              res = await updateIndustry(this.instructid, params)
            } else {
              params.ACL = this.$aclObj
              res = await postIndustry(params)
            }
            if (res.objectId) {
              this.$message({
                showClose: true,
                duration: 2000,
                type: 'success',
                message: `${this.dialogTitle}成功`,
              })
              this.$refs.form.resetFields()
              this.dialogClosed()
              this.instructid = ''
              this.Instruct()
            }
          } else {
            this.$message('有必填项未填写')
            return false
          }
        })
      },
      handleSizeChange(val) {
        this.pagesize = val
        this.Instruct()
      },
      handleCurrentChange(val) {
        this.start = (val - 1) * this.pagesize
        this.Instruct()
      },
      // 编辑
      dialogBtn_em(formName, type, data) {
        this.dialogFormVisible = true
        // 此处最好声明一个新的变量来接收数据去赋值弹框，避免影响源数据
        let opt = {}
        let opt1
        if (type == 2) {
          opt1 = {
            name: data.name,
            pointer: data.di,
            type: data.op,
            enable: data.enable,
            duration: data.duration,
            order: data.order,
            interval: data.interval,
            lowerhair: data.devaddr,
            rotation: data.rotation,
            subnet: data.pn,
          }
          opt = Object.assign({}, opt1)
          this.instructid = data.objectId
        } else {
          dgiotlog.log(data)
          opt = Object.assign({}, data)
        }
        this.openDialog(formName, type, opt)
      },
      // 单个删除指令
      deleteInstruct(id) {
        this.$confirm('此操作将永久删除该指令, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            const res = await delIndustry(id)
            if (res) {
              this.$message({
                showClose: true,
                duration: 2000,
                type: 'success',
                message: '删除成功!',
              })
              this.Instruct()
            }
          })
          .catch(() => {
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除',
            // })
          })
      },
      handleSelectionChange(val) {
        this.multipleTable = val
      },
      // 批量删除
      async deleteAll(val) {
        if (this.multipleTable.length == 0) {
          this.$message({
            showClose: true,
            duration: 2000,
            message: '请挑选要删除的指令',
            type: 'warning',
          })
          return
        } else {
          let requests = []
          this.multipleTable.map(async (item) => {
            requests.push({
              body: {},
              method: 'DELETE',
              path: `/classes/Instruct/${item.objectId}`,
            })
          })
          const params = {
            requests: requests,
          }
          const result = await this.$shuwa_batch(params)
          if (!result.error) {
            this.$message({
              showClose: true,
              duration: 2000,
              message: '删除成功',
              type: 'success',
            })
            this.Instruct()
          } else {
            this.$message({
              showClose: true,
              duration: 2000,
              message: `删除失败${result.error}`,
              type: 'error',
            })
          }
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .instruct {
    box-sizing: border-box;
    min-height: 100%;
    padding: 20px;
    background: #ffffff;

    .instruct_button {
      display: flex;
      flex-direction: row-reverse;
      flex-direction: unset;
      justify-content: space-between;
    }

    .instruct_table {
      margin-top: 20px;
    }

    ::v-deep .el-select--small {
      width: 100%;
    }
  }
</style>
