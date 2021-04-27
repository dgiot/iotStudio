<template>
  <div class="evidence_detail">
    <div class="evidence_left">
      <div class="left1">
        <p
          style="
            border-bottom: 1px solid #cccccc;
            color: #409eff;
            font-size: 14px;
            height: 40px;
            margin: 0;
          "
        >
          取证产品信息
        </p>
        <el-form
          ref="productform"
          :model="productform"
          label-width="120px"
          size="small"
          class="productform"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="检验编号:">
                <span>{{ taskform.pump_id }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="水泵名称:">
                <span />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="水泵型号:">
                <span>{{ taskform.pump_use }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="水泵类型:">
                <span>{{ taskform.pump_model }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检验标准:">
                <span>{{ taskform.datas.name }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="left2">
        <p
          style="
            border-bottom: 1px solid #cccccc;
            color: #409eff;
            font-size: 14px;
            height: 40px;
            margin: 0;
          "
        >
          取证设备信息
        </p>

        <div
          v-for="item in tableData"
          :key="item.id"
          class="devices1"
          style="padding: 10px"
        >
          <el-form :model="item" label-position="top">
            <el-row style="border-bottom: 1px solid #dddddd">
              <el-col :span="2" style="text-align: right">
                <span class="svg-container">
                  <svg-icon
                    icon-class="carams"
                    style="width: 3rem; height: 3rem"
                  />
                </span>
              </el-col>
              <el-col :span="3">
                <el-form-item label="设备名称">
                  <span>{{ item.name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="设备统一编号">
                  <span>{{ item.devaddr }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="取证用途">
                  <span v-if="item.basedata.evidenceuse">
                    {{ item.basedata.evidenceuse }}
                  </span>
                  <span />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="IP">
                  <span>{{ item.basedata.ip }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="MAC地址">
                  <span>{{ item.basedata.mac }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="生产厂家">
                  <span>{{ item.basedata.factory }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="投运时间">
                  <span>{{ $dateFormat(item.createdAt) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="left3">
        <p
          style="
            border-bottom: 1px solid #cccccc;
            color: #409eff;
            font-size: 14px;
            height: 40px;
            margin: 0;
          "
        >
          取证设备信息
        </p>
        <el-form :model="evidenceform" label-position="top">
          <div class="devices1" style="padding: 10px">
            <el-row style="border-bottom: 1px solid #dddddd">
              <el-col :span="2" style="text-align: right">
                <span class="svg-container">
                  <svg-icon
                    icon-class="luxiang"
                    style="width: 3rem; height: 3rem"
                  />
                </span>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据类型">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="设证据编号">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据格式">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据大小">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据来源">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据数量">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="存储时间">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-link :underline="false" type="primary">预览</el-link>
              </el-col>
            </el-row>
          </div>
          <div class="devices1" style="padding: 10px">
            <el-row style="border-bottom: 1px solid #dddddd">
              <el-col :span="2" style="text-align: right">
                <span class="svg-container">
                  <svg-icon
                    icon-class="dianzizhengju"
                    style="width: 3rem; height: 3rem"
                  />
                </span>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据类型">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="设证据编号">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据格式">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据大小">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据来源">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据数量">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="存储时间">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-link :underline="false" type="primary">预览</el-link>
              </el-col>
            </el-row>
          </div>
          <div class="devices1" style="padding: 10px">
            <el-row style="border-bottom: 1px solid #dddddd">
              <el-col :span="2" style="text-align: right">
                <span class="svg-container">
                  <svg-icon
                    icon-class="tupian"
                    style="width: 3rem; height: 3rem"
                  />
                </span>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据类型">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="设证据编号">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据格式">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据大小">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据来源">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据数量">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="存储时间">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-link :underline="false" type="primary">预览</el-link>
              </el-col>
            </el-row>
          </div>
          <div class="devices1" style="padding: 10px">
            <el-row style="border-bottom: 1px solid #dddddd">
              <el-col :span="2" style="text-align: right">
                <span class="svg-container">
                  <svg-icon
                    icon-class="video"
                    style="width: 3rem; height: 3rem"
                  />
                </span>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据类型">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="设证据编号">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据格式">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据大小">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据来源">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="证据数量">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="存储时间">
                  <span>中央一号摄像头</span>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-link :underline="false" type="primary">预览</el-link>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div class="left4">
        <p
          style="
            border-bottom: 1px solid #cccccc;
            color: #409eff;
            font-size: 14px;
            height: 40px;
          "
        >
          质检报告文件上传
        </p>
        <el-form :model="reportform" label-width="120px" size="small">
          <el-form-item label="质检报告:">
            <el-input v-model="reportform.filesrc" placeholder="请输入内容">
              <template slot="append">
                <el-upload
                  :limit="1"
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  accept=".PDF"
                >
                  <el-button size="small" type="primary">选 择</el-button>
                </el-upload>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: center">
        <el-button type="primary" size="small">确定</el-button>
        <el-button type="primary" size="small">提交</el-button>
        <el-button type="info" size="small">取消</el-button>
      </div>
    </div>
    <div class="evidence_right">
      <el-card class="box-card">
        <div class="box_top">取证任务详情</div>
        <div class="box_content">
          <div class="content">
            <el-form
              ref="form"
              :model="form"
              label-width="100px"
              size="small"
              label-position="left"
            >
              <el-form-item label="检验编号">
                <span>{{ taskform.pump_id }}</span>
              </el-form-item>
              <el-form-item label="委托方">
                <span>{{ taskform.factory }}</span>
              </el-form-item>
              <el-form-item label="委托方联系人">
                <span>{{}}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{ taskform.entrust_phone }}</span>
              </el-form-item>
              <el-form-item label="检测单位">
                <span>{{ taskform.detection_unit }}</span>
              </el-form-item>
              <el-form-item label="检测实验室">
                <span>{{ taskform.lab }}</span>
              </el-form-item>
              <el-form-item label="检测台">
                <span>{{ taskform.internal_num }}</span>
              </el-form-item>
              <el-form-item label="检测人员">
                <span>{{ taskform.detection_unit }}</span>
              </el-form-item>
              <el-form-item label="U盾序列号">
                <span>{{}}</span>
              </el-form-item>
              <el-form-item label="检测时间">
                <span>{{ taskform.test_time }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
  import { returnLogin } from '@/utils/return'
  // import Parse from 'parse'
  import deepClone from '@/utils/deepClone'
  import ajax from '@/utils/$ajax'
  export default {
    data() {
      return {
        form: {},
        productform: {},
        devicesform: {},
        evidenceform: {},
        reportform: {
          filesrc: '',
        },
        taskform: {
          datas: {
            name: '',
          },
        },
        // 取证设备信息
        tableData: [],
      }
    },
    mounted() {
      // this.evidenceDetail()
    },
    methods: {
      evidenceDetail() {
        var taskid = this.$route.query.taskid
        var PumpClient = Parse.Object.extend('PumpClient')
        var reportTask = new Parse.Query(PumpClient)
        reportTask.get(taskid).then(
          (resultes) => {
            if (resultes) {
              this.taskform = deepClone(resultes.attributes)
              this.evidenceDevice()
            }
          },
          (error) => {
            returnLogin(error)
          }
        )
      },
      evidenceDevice() {
        var where = {}
        where['basedata.laboratoryid'] = this.taskform.laboratory.id
        var devicesQuery = {
          where: JSON.stringify(where),
        }
        ajax('iotapi/classes/Device', 'GET', devicesQuery)
          .then((resDevice) => {
            if (resDevice) {
              this.tableData = deepClone(resDevice.results)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .evidence_detail {
    width: 100%;
    background: #ffffff;
    display: flex;
    padding: 20px;
    box-sizing: border-box;
    .evidence_right {
      width: 350px;
      box-sizing: border-box;
      .el-card {
        .el-card__body {
          padding: 0;
          .box_content {
            width: 100%;
            height: auto;
            padding: 10px;
            box-sizing: border-box;
            .content {
              width: 100%;
              height: auto;
              background: #f0e2f1;
              padding: 5px;
              box-sizing: border-box;
              ::v-deep .el-form-item {
                margin-bottom: 5px;
                .el-form-item__label {
                  color: black;
                }
              }
            }
          }
        }
      }

      ::v-deep .box_top {
        height: 40px;
        width: 100%;
        text-align: center;
        background: #409eff;
        color: white;
        line-height: 40px;
      }
    }
    .evidence_left {
      width: calc(100% - 350px);
      box-sizing: border-box;
      .devices1 {
        ::v-deep .el-form-item__label {
          border: 0;
          line-height: 20px;
        }
        ::v-deep .el-form-item {
          margin-bottom: 10px;
        }
        ::v-deep .el-form-item__content {
          line-height: 20px;
        }
      }

      ::v-deep .el-upload-list {
        display: none;
      }
      ::v-deep .el-input-group {
        width: 300px;
      }
    }
    ::v-deep .productform {
      ::v-deep span {
        color: #67c23a;
      }
    }
  }
</style>
