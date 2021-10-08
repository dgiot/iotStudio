<template>
  <div class="license">
    <div class="licenseleft">
      <el-row>
        <el-col :span="12">
          <img v-if="isend == false" alt :src="originimgsrc" srcset />
          <img v-if="isend == true" alt :src="originimgsrc" srcset />
        </el-col>
        <el-col :span="12">
          <div v-if="isend == false" class="originupdate">
            <p>部署配置</p>
            <span>请完成配置后进行部署</span>
          </div>
        </el-col>
      </el-row>
      <!-- <el-row v-if="isend==false" style="margin-top:50px;text-align:right">
        <el-col :span="24" style="text-align:center;margin-left:40px;">
          <el-button type="primary">部署</el-button>
        </el-col>
      </el-row> -->
      <el-row style="margin-top: 50px">
        <el-col class="originupdate" :span="12">
          <p>当前时间:</p>
          <span>{{ updatetime }}</span>
        </el-col>
        <el-col class="originupdate" :span="12">
          <p>服务器状态</p>
          <span v-if="isarrange == false">未部署</span>
          <span v-else>部署完成</span>
        </el-col>
      </el-row>
    </div>
    <div class="licenseright">
      <div class="righttop">
        <p style="font-size: 20px">部署进度</p>
        <el-steps :active="active" finish-status="success">
          <el-step title="基础服务部署" />
          <el-step title="数据库部署" />
          <el-step title="完成" />
        </el-steps>
      </div>
      <div class="rightcenter">
        <p style="font-size: 20px; color: #67c23a">机器信息</p>
        <!-- <div class="rightcomputer">
          <el-row>
            <el-col :span="12">
              <span style="margin-right:20px;">用户名:</span>
              <span>{{configdata.hostName}}</span>
            </el-col>
            <el-col :span="12">
              <span style="margin-right:20px;">计算机信息:</span>
              <span>{{configdata.computerConfig}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span style="margin-right:20px;">IP地址:</span>
              <span>
                 <span>{{configdata.natIP+'(私)'}}</span>
                 <span>{{configdata.wlanIp+'(公)'}}</span>
              </span>

            </el-col>
            <el-col :span="12">
              <span style="margin-right:20px;">服务器连接状态:</span>
              <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <span style="margin-right:20px;">授权状态:</span>
              <span>{{configdata.computerAuth}}</span>
            </el-col>
            <el-col :span="12">
              <span style="margin-right:20px;">机器码:</span>
              <span style="font-size:12px;">{{configdata.computerKey}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <span style="margin-right:20px;">数据中心地址:</span>
              <el-input placeholder="请输入数据中心地址" v-model="infomation"></el-input>
            </el-col>
            <el-col :span="8" style="position:relative">
              <span style="margin-right:20px;">授权码:</span>
              <el-input placeholder="请输入授权码" v-model="authorizenumber"></el-input>
              <i
                style="color:red;margin:0;position:absolute;top:40px;font-style:normal;left:80px;"
              >请提交机器码至管理员,获取授权码</i>
            </el-col>
            <el-col :span="8">
              <span style="margin-right:20px;">服务版本:</span>
              <el-select placeholder="请输入服务版本" v-model="standard">
                <el-option label="标准版" value="standard"></el-option>
                <el-option label="企业版" value="enterprise"></el-option>
                <el-option label="旗舰版" value="ultimate"></el-option>
              </el-select>
            </el-col>
          </el-row>

        </div> -->
        <el-form ref="form" label-width="140px" :model="configdata">
          <el-form-item label="用户名:">
            <span>{{ configdata.hostName }}</span>
          </el-form-item>
          <el-form-item label="计算机信息:">
            <span>{{ configdata.computerConfig }}</span>
          </el-form-item>
          <el-form-item label="IP地址(公):">
            <span>{{ configdata.wlanIp }}</span>
          </el-form-item>
          <el-form-item label="IP地址(私):">
            <span>{{ configdata.natIP }}</span>
          </el-form-item>
          <el-form-item label="授权状态:">
            <span>{{ configdata.computerAuth }}</span>
          </el-form-item>
          <el-form-item label="服务器连接状态:">
            <el-switch
              v-model="value2"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>

          <el-form-item label="数据库是否部署:">
            <span v-if="configdata.dbInstalled == true">是</span>
            <span v-else>否</span>
          </el-form-item>
          <el-form-item label="机器码:">
            <span>{{ configdata.computerKey }}</span>
          </el-form-item>
          <el-form-item label="数据中心地址:">
            <el-input
              v-model="configdata.infomation"
              placeholder="请输入数据中心地址"
            />
          </el-form-item>
          <el-form-item label="授权码:">
            <el-input
              v-model="configdata.authorizenumber"
              placeholder="请输入授权码"
            />
          </el-form-item>
          <el-form-item label="服务版本:">
            <el-select
              v-model="configdata.standard"
              placeholder="请输入服务版本"
            >
              <el-option label="标准版" value="standard" />
              <el-option label="企业版" value="enterprise" />
              <el-option label="旗舰版" value="ultimate" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="dbinstall"
              style="margin-right: 100px"
              type="success"
              @click="uploadHub"
            >
              部 署
            </el-button>
            <el-button
              v-else
              style="margin-right: 100px"
              type="success"
              @click="uploadDb"
            >
              数据库部署
            </el-button>
            <el-button type="primary" @click.native="update">刷新</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import { hardInfo, iotHub, iotApp } from '@/api/License/index'
  import Cookies from 'js-cookie'
  export default {
    data() {
      return {
        value2: false,
        isarrange: false,
        isend: false,
        timer: null,
        updatetime: '',
        active: 1,
        authorizenumber: '',
        dbinstall: true,
        configdata: {
          computerAuth: '',
          natIP: '',
          wlanIp: '',
          computerKey: '',
          computerConfig: '',
          hostName: '',
          infomation: 'localhost',
          standard: 'standard',
          authorizenumber: '',
          dbInstalled: '',
        },
        standard: 'standard',
      }
    },
    mounted() {
      window.clearInterval(this.timer)
      this.timeUpdate()
      this.getHardInfo()
      if (Cookies.get('authorizenumber')) {
        this.configdata.authorizenumber = Cookies.get('authorizenumber')
      } else {
        this.configdata.authorizenumber = ''
      }
    },
    beforeDestroy() {
      window.clearInterval(this.timer)
      this.timer = null
    },
    methods: {
      nowtime() {
        var timestamp3 = Date.parse(new Date())
        var date = new Date(timestamp3)
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
        this.updatetime = Y + M + D + h + m + s
      },
      timeUpdate() {
        var _this = this
        _this.timer = window.setInterval(() => {
          _this.nowtime()
        }, 1000)
      },
      getHardInfo() {
        hardInfo().then((resultes) => {
          this.configdata.computerAuth = resultes.computerAuth
          this.configdata.natIP = resultes.natIP
          this.configdata.wlanIp = resultes.wlanIp
          this.configdata.computerKey = resultes.computerKey
          this.configdata.hostName = resultes.hostName
          this.configdata.computerConfig = resultes.computerConfig
          this.configdata.dbInstalled = resultes.dbInstalled
          this.value2 = resultes.serverHealth
        })
      },
      uploadHub() {
        if (this.configdata.infomation == '') {
          this.$message('请填写数据中心地址')
          return
        }
        if (this.configdata.authorizenumber == '') {
          this.$message('请填写授权码')
          return
        }

        iotHub(
          this.configdata.standard,
          this.configdata.authorizenumber,
          this.configdata.infomation
        ).then((resultes) => {
          if (resultes.result == true) {
            this.active = 3
            this.$router.push('/login')
          } else {
            if (resultes.status == 'license_failed') {
              this.$message('授权码错误，请重新填写')
              return
            } else if (resultes.status == 'server_disconnected') {
              this.$message('服务器未连接')
              return
            } else if (resultes.status == 'database_uninstalled') {
              this.active = 2
              this.$message('服务器部署完成，请完成下一步数据库部署')
              this.dbinstall = false
              Cookies.set('authorizenumber', this.configdata.authorizenumber)
            }
          }
        })
      },
      uploadDb() {},
    },
  }
</script>
<style lang="scss" scoped>
  .license {
    display: flex;
    min-width: 1100px !important;
    .licenseleft {
      box-sizing: border-box;
      width: 400px;
      padding: 40px 20px;
    }
    .licenseright {
      box-sizing: border-box;
      width: calc(100% - 400px);
      padding: 40px;
      background-size: cover;
      ::v-deep .is-process {
        color: white;
      }
      .rightcenter {
        margin-top: 40px;
      }
      .rightcomputer {
        box-sizing: border-box;
        padding: 0 50px;
        .el-row {
          margin: 50px 0;
          .el-col {
            //   text-align:center;
            span {
              font-size: 18px;
              font-weight: 700;
            }
          }
        }
      }
      .buttongroup {
        box-sizing: border-box;
        padding: 0 50px;
        text-align: center;
      }
    }
    ::v-deep .originupdate {
      p {
        font-size: 18px;
        color: white;
      }
      span {
        font-size: 14px;
        color: white;
      }
    }
    ::v-deep p {
      font-weight: 700;
      color: white;
    }
    ::v-deep span {
      font-size: 16px;
      color: white;
    }
    ::v-deep .el-input {
      width: 200px;
    }
    ::v-deep .el-col {
      @media screen and (max-width: 1350px) {
        width: 100%;
        margin-bottom: 20px;
      }
    }
    ::v-deep .el-form-item__label {
      font-size: 16px;
      color: #ffffff;
    }
    ::v-deep .el-form-item {
      width: 500px !important;
    }
  }
</style>
