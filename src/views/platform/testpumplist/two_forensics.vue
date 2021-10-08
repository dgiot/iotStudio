<template>
  <div class="forensics">
    <div class="fortop1">
      <p class="header">二次取证管理</p>
      <div class="top1content">
        <el-tabs>
          <el-tab-pane label="实时数据">
            <div class="sssj">
              <!--实时数据-->
              <el-form
                ref="ruleForm"
                class="demo-ruleForm"
                label-width="150px"
                :model="actualform"
              >
                <el-row>
                  <el-col :span="12">
                    <div>
                      <el-form-item class="inline" label="选择控制台:">
                        <el-select
                          v-model="actualform.region"
                          placeholder="选择实验室"
                        >
                          <el-option label="区域一" value="shanghai" />
                          <el-option label="区域二" value="beijing" />
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        class="inline"
                        label-width="20px"
                        style="width: 49%"
                      >
                        <el-select
                          v-model="actualform.region"
                          placeholder="选择控制台"
                        >
                          <el-option label="区域一" value="shanghai" />
                          <el-option label="区域二" value="beijing" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="取证页面:">
                        <el-input
                          v-model="actualform.name"
                          placeholder="请扫描后选择取证页面"
                        >
                          <el-button
                            slot="append"
                            style="color: white"
                            type="primary"
                          >
                            扫描
                          </el-button>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="指标管理:">
                        <el-table
                          :data="actualform.tableData"
                          height="250"
                          style="width: 100%; text-align: center"
                        >
                          <el-table-column
                            align="center"
                            label="序号"
                            type="index"
                            width="50"
                          />
                          <el-table-column
                            align="center"
                            label="指标名称"
                            prop="date"
                          />
                          <el-table-column
                            align="center"
                            label="指标值"
                            prop="name"
                          />
                          <el-table-column align="center" label="指标管理">
                            <template slot-scope="scope">
                              <el-button
                                size="mini"
                                type="primary"
                                @click="editor(scope.row)"
                              >
                                编辑
                              </el-button>
                              <el-button size="mini" type="danger">
                                删除
                              </el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div>
                      <el-form-item label="应用程序:">
                        <el-input
                          v-model="actualform.name"
                          placeholder="先扫描，然后选择需要监控的应用程序"
                        >
                          <el-button
                            slot="append"
                            style="color: white; background: #409eff"
                            type="primary"
                          >
                            扫描
                          </el-button>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="取证页面标题:">
                        <el-input
                          v-model="actualform.name"
                          placeholder="水泵实验室性能检测"
                        />
                      </el-form-item>
                      <el-form-item label="实时数据:" />
                    </div>
                  </el-col>
                </el-row>
                <div class="sssjbutton" style="text-align: center">
                  <el-button style="margin: 0 40px" type="primary">
                    启动
                  </el-button>
                  <el-button>停止</el-button>
                </div>
              </el-form>
            </div>
            <div class="fortop2">
              <p class="header">参数配置</p>
              <el-form
                ref="attributeform"
                class="demo-attributeform"
                label-width="150px"
                :model="attributeform"
              >
                <el-row>
                  <!--参数配置上-->
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <el-form-item label="采集频率:">
                        <el-input v-model.number="attributeform.rate">
                          <template slot="append">秒</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="保存格式:">
                        <el-radio-group v-model="attributeform.resource">
                          <el-radio label="JPG" />
                          <el-radio label="PNG" />
                          <el-radio label="RMP" />
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="存储位置:">
                        <el-input v-model="attributeform.seat">
                          <!-- <template slot="append" style="border:0"> -->
                          <el-button
                            slot="append"
                            style="color: white; background: #971fdc"
                            type="primary"
                            @click="openFile()"
                          >
                            更改
                          </el-button>
                          <el-button
                            slot="append"
                            style="
                              margin-left: 40px;
                              color: white;
                              background: #409eff;
                            "
                          >
                            查看
                          </el-button>
                          <!-- </template> -->
                        </el-input>
                      </el-form-item>
                      <input
                        id="open"
                        name="filename"
                        style="display: none"
                        type="file"
                      />
                    </div>
                  </el-col>
                  <!--参数配置下-->
                  <el-col :span="12">
                    <div class="grid-content bg-purple-light">
                      <el-form-item label="采集时长:">
                        <el-input v-model.number="attributeform.rate">
                          <template slot="append">分钟</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item
                        class="inline"
                        label="保存尺寸:"
                        style="width: 35%"
                      >
                        <el-input
                          v-model="attributeform.width"
                          placeholder="长"
                        >
                          <!-- <template slot="append">像素</template> -->
                        </el-input>
                      </el-form-item>
                      <span>像素 X</span>
                      <el-form-item
                        class="inline"
                        label-width="0"
                        style="width: 35%"
                      >
                        <el-input
                          v-model="attributeform.height"
                          placeholder="宽"
                        >
                          <!-- <template slot="append">像素</template> -->
                        </el-input>
                      </el-form-item>
                      <span>像素</span>
                      <span
                        style="position: absolute; font-size: 12px; color: red"
                      >
                        (默认为1280*736像素)
                      </span>
                    </div>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="历史数据">
            <el-form
              class="demo-form-inline"
              :inline="true"
              :model="formInline"
              size="small"
            >
              <el-form-item label="控制台编号">
                <el-input v-model="formInline.user" placeholder="控制台编号" />
              </el-form-item>
              <el-form-item label="数据为0显示">
                <el-select
                  v-model="formInline.region"
                  placeholder="数据为0显示"
                >
                  <el-option label="是" :value="true" />
                  <el-option label="否" :value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="采集开始时间">
                <el-date-picker
                  v-model="formInline.starttime"
                  :picker-options="pickerOptionsStart"
                  placeholder="选择开始日期时间"
                  type="datetime"
                  @change="testdata"
                />
              </el-form-item>
              <el-form-item label="采集结束时间">
                <el-date-picker
                  v-model="formInline.endtime"
                  :picker-options="pickerOptionsEnd"
                  placeholder="选择结束日期时间"
                  type="datetime"
                  @change="enddata"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary">查询</el-button>
                <el-button type="primary">重置</el-button>
              </el-form-item>
            </el-form>
            <el-table
              border
              :data="tableData"
              style="width: 100%; text-align: center"
            >
              <el-table-column label="序号" type="index" width="50" />
              <el-table-column label="控制台编号" prop="date" />
              <el-table-column align="center" label="转速" prop="name" />
              <el-table-column align="center" label="扭矩" prop="address" />
              <el-table-column align="center" label="流量" prop="name" />
              <el-table-column align="center" label="进口压力" prop="name" />
              <el-table-column align="center" label="电流" prop="name" />
              <el-table-column align="center" label="电机功率" prop="name" />
              <el-table-column align="center" label="实时水温" prop="name" />
              <el-table-column align="center" label="采集时间" prop="name" />
            </el-table>
            <div class="block" style="margin-top: 20px">
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="pagesize"
                :page-sizes="[10, 20, 30, 50]"
                :total="total"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--编辑弹窗-->
    <el-dialog
      :append-to-body="true"
      title="参数编辑"
      :visible.sync="dialogFormVisible"
      width="30%"
    >
      <el-form :model="form">
        <p
          style="
            margin-left: 50px;
            font-size: 14px;
            font-weight: 700;
            color: #606266;
          "
        >
          当前指标:转速
        </p>
        <el-form-item label="指标名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off">
            <el-button slot="append" icon="el-icon-lock" />
          </el-input>
        </el-form-item>
        <el-form-item label="指标数据选定" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off">
            <el-button
              slot="append"
              style="color: white; background: #971fdc"
              type="primary"
            >
              更改
            </el-button>
            <el-button
              slot="append"
              style="margin-left: 30px; color: white; background: #409eff"
            >
              查看
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="选择单位" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择单位">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="dialogFormVisible = false">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: '',
    data() {
      return {
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form: {
          name: '',
          region: '',
        },
        // 二次取证表
        actualform: {
          region: '',
          name: '',
          tableData: [
            {
              date: '转速',
              name: '33',
              address: '上海市普陀区金沙江路 1518 弄',
            },
            {
              date: '流量',
              name: '171',
              address: '上海市普陀区金沙江路 1517 弄',
            },
            {
              date: '流量',
              name: '166',
              address: '上海市普陀区金沙江路 1519 弄',
            },
            {
              date: '进口压力',
              name: '59',
              address: '上海市普陀区金沙江路 1516 弄',
            },
          ],
        },
        // 采集数据表
        attributeform: {
          rate: '',
          resource: '',
          seat: '',
          width: '',
          height: '',
        },
        // 历史数据表
        formInline: {
          user: '',
          region: '',
          starttime: '',
          endtime: '',
        },
        // 历史数据表格
        tableData: [
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
          },
          {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄',
          },
          {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
          },
          {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
          },
        ],
        pickerOptionsStart: {
          disabledDate: (time) => {
            const endDateVal = this.formInline.endtime
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
            //   else {
            //     return time.getTime() < Date.now() - 8.64e7;
            //   }
          },
        },
        pickerOptionsEnd: {
          disabledDate: (time) => {
            const beginDateVal = this.formInline.starttime
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime()
            }
            //   else {
            //     return time.getTime() < Date.now() - 8.64e7;
            //   }
          },
        },
        pagesize: 10,
        total: 0,
        start: 0,
      }
    },
    mounted() {},
    methods: {
      openFile() {
        document.getElementById('open').click()
      },
      enddata() {
        if (this.formInline.endtime <= this.formInline.starttime) {
          this.$message.warning('采集结束时间要大于开始时间')
          this.formInline.endtime = ''
        }
      },
      // 编辑
      editor(row) {
        this.dialogFormVisible = true
      },
      testdata() {
        if (
          this.formInline.endtime <= this.formInline.starttime &&
          this.formInline.endtime != '' &&
          this.formInline.endtime != null
        ) {
          this.$message.warning('采集结束时间要大于开始时间')
          this.formInline.starttime = ''
        }
      },
      handleSizeChange(val) {
        this.pagesize = val
      },
      handleCurrentChange(val) {
        this.start = (val - 1) * this.pagesize
      },
    },
  }
</script>

<style lang="scss" scoped>
  .forensics {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 60px 20px 60px;
    background: #ffffff;
    .fortop1 {
      width: 100%;
      height: auto;
      .header {
        width: 100%;
        height: 50px;
        padding-left: 20px;
        font-size: 20px;
        font-weight: bold;
        line-height: 50px;
        border: 1px solid #666666;
      }
      .top1content {
        box-sizing: border-box;
        width: 100%;
        padding: 0 30px;
        ::v-deep .el-form {
          .inline {
            display: inline-block;
            width: 50%;
            ::v-deep .el-select {
              width: 100%;
            }
            //::v-deep  .el-form-item__content{
            //     width:100%;
            // }
          }
        }
      }
    }
    ::v-deep .fortop2 {
      width: 100%;
      height: auto;
      .header {
        width: 100%;
        height: 50px;
        padding-left: 20px;
        font-size: 16px;
        font-weight: bold;
        line-height: 50px;
        border: 1px solid #666666;
      }
    }
    ::v-deep .el-dialog__wrapper {
      ::v-deep .el-form {
        .el-select {
          width: 100%;
        }
      }
    }
  }
</style>
