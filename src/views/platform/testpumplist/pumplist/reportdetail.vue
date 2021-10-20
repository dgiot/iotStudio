<template>
  <div class="reportdetail">
    <div class="block">
      <el-row :gutter="20">
        <!--第一个tree树-->
        <el-col
          :lg="12"
          :md="12"
          :sm="24"
          :xl="12"
          :xs="24"
        >
          <el-table
            ref="refTable"
            accordion
            :data="datafortable"
            stripe
            style="width: 100%"
            @expand-change="rowExpand"
          >
            <el-table-column
              label="取证"
              type="expand"
              width="200"
            >
              <template slot-scope="props">
                <el-form
                  class="demo-table-expand"
                  inline
                  label-position="bottom"
                  style="margin-bottom: 10px"
                >
                  <!-- <div>
                  <div id="Getdata" style="width:100%;height:300px;"></div>
                    <el-table class="tableforfile" :data="Datafile" style="width:100%;text-align:center">
                      <el-table-column label="数据来源" align="center">
                        <template slot-scope="scope">
                          <span>{{scope.row.attributes.data.source}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="最近更新时间">
                        <template slot-scope="scope">
                          <span>{{utc2beijing(scope.row.attributes.createdAt)}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="内容">
                        <template slot-scope="scope">
                          <el-button type="success" @click.native="detail(scope.row.attributes.data.data)">查 看</el-button>
                          <el-button type="danger" @click.native="deleteimg(scope.row.id)">删 除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>-->
                  <el-button @click="flatEvidence(props.row.id)">
                    平板取证
                  </el-button>
                  <el-button @click="consoleEvidenvce(props.row.id, reportid)">
                    控制台取证
                  </el-button>
                  <el-button
                    @click="controllerEvidence(props.row.id, reportid)"
                  >
                    控制器取证
                  </el-button>
                  <el-button @click="liveEvidence(props.row.id, reportid)">
                    摄像头取证
                  </el-button>
                </el-form>
                <el-table
                  :data="tableData1"
                  style="width: 100%; text-align: center"
                >
                  <el-table-column
                    align="center"
                    label="设备名称"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.product.name.indexOf('控制台') != -1"
                      >
                        控制台
                      </span>
                      <span
                        v-else-if="
                          scope.row.product.name.indexOf('控制器') != -1
                        "
                      >
                        控制器
                      </span>
                      <span v-else>摄像头</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="设备编号"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.row.devaddr }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="运行状态"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.status == 'OFFLINE'"
                        style="color: red"
                      >
                        离线
                      </span>
                      <span
                        v-else-if="scope.row.status == 'runing'"
                        style="color: green"
                      >
                        忙碌
                      </span>
                      <span
                        v-else
                        style="color: green"
                      >在线</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="操作"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="Gotodetail(scope.row.type, scope.row.id)"
                      >
                        详情
                      </el-button>
                      <el-button
                        v-if="scope.row.status == 'ready'"
                        size="mini"
                        type="success"
                        @click="startPump(scope.row.devaddr)"
                      >
                        启动
                      </el-button>
                      <el-button
                        v-if="scope.row.status == 'running'"
                        size="mini"
                        type="danger"
                        @click="stopPump(scope.row.devaddr)"
                      >
                        停止
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="ID"
              type="index"
            />
            <el-table-column
              align="center"
              label="检验项目"
              prop="name"
            />
            <el-table-column
              align="center"
              label="保证值"
              prop="title"
            />
            <el-table-column
              align="center"
              label="测试值"
              prop="value"
            />
            <el-table-column
              align="center"
              label="评定"
              prop
            />
          </el-table>
          <!-- <div class="block" style="margin-top:10px;">
            <el-pagination
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pagesize1"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total1"
            ></el-pagination>
          </div>-->
        </el-col>
        <el-col
          :lg="12"
          :md="12"
          :sm="24"
          style="min-height: 875px; border-left: 1px solid blue"
          :xl="12"
          :xs="24"
        >
          <div
            id="Getdata"
            style="width: 100%; height: 300px"
          />
          <el-table
            class="tableforfile"
            :data="Datafile"
            style="width: 100%; text-align: center"
          >
            <el-table-column
              align="center"
              label="数据来源"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.attributes.data.source }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="最近更新时间"
            >
              <template slot-scope="scope">
                <span>{{ utc2beijing(scope.row.attributes.createdAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="内容"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="detail(scope.row.attributes.data.data)"
                >
                  查 看
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteimg(scope.row.id)"
                >
                  删 除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :append-to-body="true"
      title="提示"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <div style="margin-top: 10px">
        <el-upload
          ref="upload"
          :action="action"
          :auto-upload="false"
          :before-upload="getFilename"
          class="upload-demo"
          :data="data"
          :limit="1"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="responsesuccess"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
          >
            选取文件
          </el-button>
          <el-button
            size="small"
            style="margin-left: 10px"
            type="success"
            @click="submitUpload"
          >
            上传到服务器
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click.native="importdata"
          >
            提 交
          </el-button>
        </el-upload>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="deleteFile">取 消</el-button>
        <el-button
          type="primary"
          @click.native="deleteFile"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  // import Parse from 'parse'
  import { Filedata, updateFile } from '@/api/pumpdata/pumpdata'
  import { Pumpcontrol, CloundFile } from '@/api/devicescontrol/index'
  import Cookies from 'js-cookie'
  var arr1 = []
  var arr2 = []
  var arr3 = []
  var arr4 = []
  var arr5 = []
  var arr6 = []
  var arr7 = []
  export default {
    inject: ['reload'],
    data() {
      return {
        reportid: '',
        myChart: null,
        datafortable: [],
        dialogVisible: false,
        action: '',
        data: {},
        show: false,
        tasknameid: '',
        tetbedid: '',
        tableData1: [],
        Datafile: [],
        row: 0,
        start1: 1,
        pagesize1: 10,
        total1: 0,
        // extends:[],
        // getRowKeys(row) {
        //       return row.id;
        //   },
        expands: [],
        isreload: 0,
        taskdetailid: '',
        taskid: '',
        isexpeand: false,
        expandedRows: '',
      }
    },
    mounted() {
      this.getReportdetail()
      this.Getchart()
      this.init()
    },
    methods: {
      // 检验项目分页
      handleSizeChange1(val) {
        this.start1 = 1
        this.pagesize1 = val
      },
      handleCurrentChange1(val) {
        this.start1 = val
      },
      utc2beijing(utc_datetime) {
        // 转为正常的时间格式 年-月-日 时:分:秒
        var date = new Date(utc_datetime)
        var Y = date.getFullYear() + '-'
        var M =
          (date.getMonth() + 1 <= 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-'
        var D =
          (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) +
          ' '
        var h =
          (date.getHours() + 1 <= 10
            ? '0' + date.getHours()
            : date.getHours()) + ':'
        var m =
          (date.getMinutes() + 1 <= 10
            ? '0' + date.getMinutes()
            : date.getMinutes()) + ':'
        var s =
          date.getSeconds() + 1 <= 10
            ? '0' + date.getSeconds()
            : date.getSeconds()
        return Y + M + D + h + m + s
      },
      init() {
        // 关键三
        setTimeout(() => {
          window.addEventListener('resize', () => {
            this.myChart.resize()
          })
        }, 20)
      },
      // 初始化数据
      getReportdetail() {
        this.reportid = this.$route.query.id
        this.testbedid = this.$route.query.testbedid
        this.Datafile = []
        var PumpClient = Parse.Object.extend('PumpClient')
        var report = new Parse.Query(PumpClient)
        report.get(this.reportid).then(
          (resultes) => {
            var reporttask = resultes.attributes.datas
            var tabledata = reporttask.reportchildren
            this.datafortable = []
            tabledata.map((item, index) => {
              item.id = index + 1
              this.datafortable.push(item)
              // item.guarantee_value.map(child => {
              //   child.inspecting_item = item.inspecting_item;
              //   child.type = "imgage";
              //   this.datafortable.push(child);
              // });
              // 分页总条数
              this.total1 = this.datafortable.length
            })
          },
          (error) => {
            if (error.code == '209') {
              this.$message({
                type: 'warning',
                message: '登陆权限过期，请重新登录',
              })
              this.$router.push({
                path: '/login',
              })
            } else if (error.code == 119) {
              this.$message({
                type: 'error',
                message: '没有操作权限',
              })
            } else {
              this.$message.error(error.message)
            }
          }
        )
      },
      // toggleRowExpansion(row){
      //         this.expands = [];
      //         this.expands.push(row.id);
      //   },
      Getchart(head, power, effect) {
        // setTimeout(() => {
        const Echarts = document.getElementById('Getdata')
        this.myChart = this.$echarts.init(Echarts)
        var colors = ['#5793f3', '#d14a61', '#675bba']
        this.myChart.setOption({
          color: colors,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              show: true,
              type: 'cross',
              lineStyle: {
                type: 'dashed',
                width: 1,
              },
            },
          },
          toolbox: {
            show: true,
          },

          grid: {
            left: '10%',
          },
          xAxis: [
            {
              type: 'value',
              axisTick: {
                alignWithLabel: true,
                show: true,
                interval: 10,
              },
              splitLine: {
                show: true,
              },
              boundaryGap: false,
              // min: 0,
              // max: 0.51,
              // splitNumber: '51',
              // axisLabel: {
              //     textStyle: {
              //         color: function (value, index) {
              //             return index % 10 == 0 ? 'black' : 'none';
              //         }
              //     }
              // },
              name: 'Q(m³/h)',
              nameTextStyle: {
                color: 'red',
                padding: [10, -5, 0, 0],
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: 'H(m)',
              position: 'left',
              axisLine: {
                lineStyle: {
                  color: colors[0],
                },
              },
              axisLabel: {
                formatter: '{value}',
              },
              splitNumber: 5,
              axisTick: { show: false },
            },
            {
              type: 'value',
              name: 'P(kW)',
              position: 'left',
              offset: 50,
              splitLine: {
                show: false,
              },
              axisLine: {
                lineStyle: {
                  color: colors[1],
                },
              },
              axisLabel: {
                formatter: '{value}',
              },
              splitNumber: 5,
            },
            {
              type: 'value',
              name: 'η(%)',
              splitNumber: 5,
              splitLine: {
                show: false,
              },
              position: 'right',
              axisLine: {
                lineStyle: {
                  color: colors[2],
                },
              },
              axisLabel: {
                formatter: '{value}',
              },
              smooth: true,
            },
          ],
          series: [
            {
              name: '扬程',
              type: 'line',
              smooth: true,
              yAxisIndex: 0,
              data: head,
            },

            {
              name: '功率',
              type: 'line',
              smooth: true,
              yAxisIndex: 1,
              data: power,
            },
            {
              name: '效率',
              type: 'line',
              smooth: true,
              yAxisIndex: 2,
              data: effect,
            },
          ],
        })
        // },0)
      },

      startPump(devaddr) {
        var self = this
        Pumpcontrol(devaddr, 'start', this.reportid)
          .then((resultes) => {
            this.$message({
              type: 'success',
              message: '成功启动',
            })
            if (this.isreload == 1) {
              this.consoleEvidenvce(this.taskdetailid, this.taskid)
            } else if (this.isreload == 2) {
              this.controllerEvidence(this.taskdetailid, this.taskid)
            } else if (this.isreload == 3) {
              this.liveEvidence(this.taskdetailid, this.taskid)
            }
          })
          .catch((error) => {
            // this.$message.error(error.error);
          })
      },
      stopPump(devaddr) {
        var self = this
        Pumpcontrol(devaddr, 'stop', this.reportid)
          .then((resultes) => {
            this.$message({
              type: 'success',
              message: '成功停止',
            })
            if (this.isreload == 1) {
              this.consoleEvidenvce(this.taskdetailid, this.taskid)
            } else if (this.isreload == 2) {
              this.controllerEvidence(this.taskdetailid, this.taskid)
            } else if (this.isreload == 3) {
              this.liveEvidence(this.taskdetailid, this.taskid)
            }
          })
          .catch((error) => {
            // this.$message.error(error.error);
          })
      },
      rowExpand(row, expandedRows) {
        this.row = row
        this.expandedRows = expandedRows
        var that = this
        if (expandedRows.length > 1) {
          that.expands = []
          if (row) {
            that.expands.push(row)
          }
          this.$refs.refTable.toggleRowExpansion(expandedRows[0])
        } else {
          that.expands = []
        }
        // if (this.isexpeand == false) {

        this.tasknameid = row.id
        this.Datafile = []
        var PumpData = Parse.Object.extend('PumpData')
        var pumpdata = new Parse.Query(PumpData)
        pumpdata.equalTo('itemId', this.tasknameid.toString())
        pumpdata.equalTo('reportId', this.reportid)
        pumpdata.find().then(
          (result) => {
            result.map((item) => {
              if (item.attributes.data.type == 'file') {
                this.Datafile.push(item)
              } else {
                for (var i = 0; i < item.attributes.data.data.length; i++) {
                  arr1 = []
                  arr2 = []
                  arr3 = []
                  arr1.push(
                    item.attributes.data.data[i].flow,
                    item.attributes.data.data[i].head
                  )
                  arr5.push(arr1)
                  arr2.push(
                    item.attributes.data.data[i].flow,
                    item.attributes.data.data[i].power
                  )
                  arr6.push(arr2)
                  arr3.push(
                    item.attributes.data.data[i].flow,
                    item.attributes.data.data[i].effect
                  )
                  arr7.push(arr3)
                }
                arr5.sort(function (a, b) {
                  if (a[0] < b[0]) {
                    return -1
                  }
                  if (a[0] > b[0]) {
                    return 1
                  }
                })
                arr6.sort(function (a, b) {
                  if (a[0] < b[0]) {
                    return -1
                  }
                  if (a[0] > b[0]) {
                    return 1
                  }
                })
                arr7.sort(function (a, b) {
                  if (a[0] < b[0]) {
                    return -1
                  }
                  if (a[0] > b[0]) {
                    return 1
                  }
                })
                setTimeout(() => {
                  this.Getchart(arr5, arr6, arr7)
                }, 500)
              }
            })
          },
          (error) => {
            if (error.code == '209') {
              this.$message({
                type: 'warning',
                message: '登陆权限过期，请重新登录',
              })
              this.$router.push({
                path: '/login',
              })
            } else if (error.code == 119) {
              this.$message({
                type: 'error',
                message: '没有操作权限',
              })
            } else {
              this.$message.error(error.message)
            }
          }
        )
        // this.isexpeand = true
        // }else{
        //   this.isexpeand=false
        // }
        setTimeout(() => {
          this.Getchart()
        })
        //   rowExpand(row) {
        //   this.row = row;
        //   this.tasknameid = row.id;
        //   this.Datafile = [];
        //   var PumpData = Parse.Object.extend("PumpData");
        //   var pumpdata = new Parse.Query(PumpData);
        //   pumpdata.equalTo("itemId", this.tasknameid.toString());
        //   pumpdata.equalTo("reportId", this.reportid);
        //   pumpdata.find().then(result => {
        //     result.map(item => {
        //       if (item.attributes.data.type == "file") {
        //         this.Datafile.push(item);
        //       }
        //     });
        //   },error => {
        //       if (error.code == "209") {
        //         this.$message({
        //           type: "warning",
        //           message: "登陆权限过期，请重新登录"
        //         });
        //         this.$router.push({
        //           path: "/login"
        //         });
        //       } else if (error.code == 119) {
        //         this.$message({
        //           type: "error",
        //           message: "没有操作权限"
        //         });
        //       } else {
        //         this.$message.error(error.message);
        //       }
        //     });
        // },
      },
      // 查看文件
      detail(data) {
        CloundFile(data).then((resultes) => {
          window.open(resultes.url)
        })
      },
      // 删除文件
      deleteimg(id) {
        var PumpData = Parse.Object.extend('PumpData')
        var pumpdata = new Parse.Query(PumpData)
        pumpdata.get(id).then((object) => {
          object.destroy().then(
            (response) => {
              this.$message({
                type: 'success',
                message: '删除成功',
              })
              this.rowExpand(this.row, this.expandedRows)
            },
            (error) => {
              if (error.code == '209') {
                this.$message({
                  type: 'warning',
                  message: '登陆权限过期，请重新登录',
                })
                this.$router.push({
                  path: '/login',
                })
              } else if (error.code == 119) {
                this.$message({
                  type: 'error',
                  message: '没有操作权限',
                })
              } else {
                this.$message.error(error.message)
              }
            }
          )
        })
      },
      flatEvidence(id) {
        this.dialogVisible = true
        this.tasknameid = id
      },
      consoleEvidenvce(taskdetailid, taskid) {
        this.isreload = 1
        this.taskdetailid = taskdetailid
        this.taskid = taskid
        this.tableData1 = []
        var Testbed = Parse.Object.extend('Testbed')
        var testbed = new Parse.Query(Testbed)
        testbed.get(this.testbedid).then((resultes) => {
          console.log(resultes)
          var decviceaddr = resultes.attributes.deviceaddr
          var where = {
            key: {},
          }
          for (var key in where) {
            key = `"route.${decviceaddr}"`
          }
          where[`route.${decviceaddr}`] = {
            $regex: '.+',
          }
          delete where.key
          $.ajax({
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            headers: {
              sessionToken: Cookies.get('access_token_pump'),
            },
            data: {
              include: 'product',
              where: JSON.stringify(where),
            },
            url: Cookies.get('apiserver') + 'iotapi/classes/Device',
            success: (response) => {
              if (response) {
                response.results.map((item) => {
                  if (item.product.name.indexOf('控制台') != -1) {
                    this.tableData1.push(item)
                  }
                })
              }
            },
            fail: (error) => {
              if (error.code == '209') {
                this.$message({
                  type: 'warning',
                  message: '登陆权限过期，请重新登录',
                })
                this.$router.push({
                  path: '/login',
                })
              } else if (error.code == 119) {
                this.$message({
                  type: 'error',
                  message: '没有操作权限',
                })
              } else {
                this.$message.error(error.message)
              }
            },
          })
        })

        // var Testbed = Parse.Object.extend("Testbed");
        // var testbed = new Parse.Query(Testbed);

        // testbed.get(this.testbedid).then(
        //   resultes => {
        //     var relation = resultes.relation("devices");
        //     var query = relation.query();
        //     query.ascending('-updatedAt')
        //     query.equalTo("basedata.type", "PC");
        //     query.find().then(res => {
        //       this.tableData1 = res;
        //     });
        //   },
        //   error => {
        //     if (error.code == "209") {
        //       this.$message({
        //         type: "warning",
        //         message: "登陆权限过期，请重新登录"
        //       });
        //       this.$router.push({
        //         path: "/login"
        //       });
        //     } else if (error.code == 119) {
        //       this.$message({
        //         type: "error",
        //         message: "没有操作权限"
        //       });
        //     } else {
        //       this.$message.error(error.message);
        //     }
        //   }
        // );
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      getFilename(file) {
        this.data.name = file.name
      },
      deleteFile() {
        this.$refs.upload.clearFiles()
        this.dialogVisible = false
      },
      submitUpload() {
        // var local = "http://prod.iotn2n.com:8081";
        // this.$http
        // .get("http://prod.iotn2n.com:8081")
        updateFile()
          .then(
            (response) => {
              const data = response
              this.action = data.host
              this.$nextTick(() => {
                this.data.callback = data.callback
                this.data.key = `${data.dir}$\{filename}`
                this.data.policy = data.policy
                this.data.OSSAccessKeyId = data.accessid
                this.data.signature = data.signature
                this.$refs.upload.submit()
              })
            },
            (response) => {
              this.$message({})
            }
          )
          .catch((err) => {
            console.log(err)
          })
      },
      responsesuccess() {
        this.$message({
          type: 'success',
          message: '上传成功',
        })
      },
      // 上传文件保存到库
      importdata() {
        var Flate = Parse.Object.extend('CloudFile')
        var flate = new Flate()
        flate.set('type', 'file')
        flate.set('source', 'aliyun')
        flate.set('action', 'web'),
          flate.set('filepath', {
            bucket: 'shuwapump',
            end_point: 'oss-cn-shanghai.aliyuncs.com',
            object_name: this.data.name,
          })
        flate.save().then(
          (result) => {
            var PumpData = Parse.Object.extend('PumpData')
            var pumpdata = new PumpData()
            pumpdata.set('data', {
              type: 'file',
              data: result.id,
              source: 'web',
            })
            pumpdata.set('type', 'web')
            var PumpClient = Parse.Object.extend('PumpClient')
            var report = new PumpClient()
            // report.set("objectId", this.reportid);
            report.id = this.reportid
            pumpdata.set('reportId', report)
            pumpdata.set('itemId', this.tasknameid.toString())
            pumpdata.save().then(
              (result) => {
                this.$message({
                  type: 'success',
                  message: '上传成功!',
                })
                this.dialogVisible = false
                this.rowExpand(this.row, this.expandedRows)
              },
              (error) => {
                if (error.code == '209') {
                  this.$message({
                    type: 'warning',
                    message: '登陆权限过期，请重新登录',
                  })
                  this.$router.push({
                    path: '/login',
                  })
                } else if (error.code == 119) {
                  this.$message({
                    type: 'error',
                    message: '没有操作权限',
                  })
                } else {
                  this.$message.error(error.message)
                }
              }
            )
          },
          (error) => {
            if (error.code == '209') {
              this.$message({
                type: 'warning',
                message: '登陆权限过期，请重新登录',
              })
              this.$router.push({
                path: '/login',
              })
            } else if (error.code == 119) {
              this.$message({
                type: 'error',
                message: '没有操作权限',
              })
            } else {
              this.$message.error(error.message)
            }
          }
        )
      },
      // dtu取证
      controllerEvidence(taskdetailid, taskid) {
        this.isreload = 2
        this.taskdetailid = taskdetailid
        this.taskid = taskid
        this.tableData1 = []
        var Testbed = Parse.Object.extend('Testbed')
        var testbed = new Parse.Query(Testbed)
        testbed.get(this.testbedid).then((resultes) => {
          var decviceaddr = resultes.attributes.deviceaddr
          var where = {
            key: {},
          }
          for (var key in where) {
            key = `"route.${decviceaddr}"`
          }
          where[`route.${decviceaddr}`] = {
            $regex: '.+',
          }
          delete where.key
          $.ajax({
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            headers: {
              sessionToken: Cookies.get('access_token_pump'),
            },
            data: {
              include: 'product',
              where: JSON.stringify(where),
            },
            url: Cookies.get('apiserver') + 'iotapi/classes/Device',
            success: (response) => {
              if (response) {
                response.results.map((item) => {
                  if (item.product.name.indexOf('控制器') != -1) {
                    this.tableData1.push(item)
                  }
                })
              }
              console.log(this.tableData1)
            },
            fail: (error) => {
              if (error.code == '209') {
                this.$message({
                  type: 'warning',
                  message: '登陆权限过期，请重新登录',
                })
                this.$router.push({
                  path: '/login',
                })
              } else if (error.code == 119) {
                this.$message({
                  type: 'error',
                  message: '没有操作权限',
                })
              } else {
                this.$message.error(error.message)
              }
            },
          })
        })
      },
      // 视频取证
      liveEvidence(taskdetailid, taskid) {
        this.isreload = 3
        this.taskdetailid = taskdetailid
        this.taskid = taskid
        this.tableData1 = []
        // var Testbed = Parse.Object.extend("Testbed");
        // var testbed = new Parse.Query(Testbed);
        // //  testbed.equalTo('name',this.testbedid)
        // testbed.get(this.testbedid).then(
        //   resultes => {
        //     var relation = resultes.relation("devices");
        //     var query = relation.query();
        //     query.ascending('-updatedAt')
        //     query.equalTo("basedata.type", "CAMERA");
        //     query.find().then(res => {
        //       this.tableData1 = res;
        //     });
        //   },
        //   error => {
        //     if (error.code == "209") {
        //       this.$message({
        //         type: "warning",
        //         message: "登陆权限过期，请重新登录"
        //       });
        //       this.$router.push({
        //         path: "/login"
        //       });
        //     } else if (error.code == 119) {
        //       this.$message({
        //         type: "error",
        //         message: "没有操作权限"
        //       });
        //     } else {
        //       this.$message.error(error.message);
        //     }
        //   }
        // );
        var Testbed = Parse.Object.extend('Testbed')
        var testbed = new Parse.Query(Testbed)
        testbed.get(this.testbedid).then((resultes) => {
          console.log(resultes)
          var decviceaddr = resultes.attributes.deviceaddr
          var where = {
            key: {},
          }
          for (var key in where) {
            key = `"route.${decviceaddr}"`
          }
          where[`route.${decviceaddr}`] = {
            $regex: '.+',
          }
          delete where.key
          $.ajax({
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            headers: {
              sessionToken: Cookies.get('access_token_pump'),
            },
            data: {
              include: 'product',
              where: JSON.stringify(where),
            },
            url: Cookies.get('apiserver') + 'iotapi/classes/Device',
            success: (response) => {
              if (response) {
                response.results.map((item) => {
                  if (item.product.name.indexOf('摄像头') != -1) {
                    this.tableData1.push(item)
                  }
                })
              }
            },
            fail: (error) => {
              if (error.code == '209') {
                this.$message({
                  type: 'warning',
                  message: '登陆权限过期，请重新登录',
                })
                this.$router.push({
                  path: '/login',
                })
              } else if (error.code == 119) {
                this.$message({
                  type: 'error',
                  message: '没有操作权限',
                })
              } else {
                this.$message.error(error.message)
              }
            },
          })
        })
      },
      Gotodetail(type, taskid) {
        if (type == 'PC') {
          this.$router.push({
            path: 'console_evidence',
            query: {
              type: type,
              taskid: taskid,
              reportId: this.reportid,
              tasknameid: this.tasknameid,
            },
          })
        } else if (type == 'DTU') {
          this.$router.push({
            path: 'controller_evidence',
            query: {
              type: type,
              taskid: taskid,
              reportId: this.reportid,
              tasknameid: this.tasknameid,
            },
          })
        } else {
          console.log('### live_evidence ###', {
            path: 'live_evidence',
            query: {
              type: type,
              taskid: taskid,
              reportId: this.reportid,
              tasknameid: this.tasknameid,
            },
          })

          /*        this.$router.push({
          path: "live_evidence",
          query: {
            type: type,
            taskid: taskid,
            reportId: this.reportid,
            tasknameid: this.tasknameid
          }
        }); */
        }
      },
    },
    // updated() {
    //   this.consoleEvidenvce()
    // },
  }
</script>
<style scoped>
  .reportdetail {
    box-sizing: border-box;
    width: 100%;
    min-height: 100%;
    padding: 20px;
    background: #ffffff;
  }
</style>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
  .el-table__expanded-cell[class*='cell'] {
    padding-left: 0;
  }
</style>
