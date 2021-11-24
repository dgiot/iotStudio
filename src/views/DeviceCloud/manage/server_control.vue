<template>
  <div class="serverlist serverlist-container">
    <div class="servercontent">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        style="margin-bottom: 20px"
      >
        <el-breadcrumb-item :to="{ path: '/roles/applicationManagement' }">
          <!-- 返回应用管理 -->
          {{ $translateTitle('application.return') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <!-- 部署服务 -->
          {{ $translateTitle('developer.DeploymentServices') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <h3>
        <!-- 服务器部署 -->
        {{ $translateTitle('developer.Serverdeployment') }}
      </h3>
      <el-form
        class="demo-form-inline"
        :inline="true"
        :model="formInline"
        size="small"
      >
        <el-form-item style="float: left">
          <el-button
            class="el-icon-download"
            :disabled="appid && appid.length == 0"
            type="success"
            @click="downlictool()"
          >
            <!-- 下载引导脚本 -->
            {{ $translateTitle('product.Downloadbootscripts') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <!-- <el-input v-model="formInline.user" placeholder="请输入用户名称" /> -->
          <el-input
            v-model="formInline.user"
            :placeholder="$translateTitle('product.entertheusername')"
          />
        </el-form-item>
        <el-form-item>
          <!-- <el-select v-model="formInline.region" placeholder="运行状态">
            <el-option :value="1" label="全部" />
            <el-option :value="true" label="在线" />
            <el-option :value="false" label="离线" />
          </el-select> -->
          <el-select
            v-model="formInline.region"
            :placeholder="$translateTitle('equipment.runningstate')"
          >
            <el-option :label="$translateTitle('zetadevices.all')" :value="1" />
            <el-option
              :label="$translateTitle('zetadevices.online')"
              :value="true"
            />
            <el-option
              :label="$translateTitle('zetadevices.offline')"
              :value="false"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <el-select v-model="formInline.app" placeholder="应用商名称"> -->
          <el-select
            v-model="formInline.app"
            :placeholder="$translateTitle('product.Nameofapplicationprovider')"
          >
            <el-option
              v-for="(item, index) in applist"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <el-select v-model="formInline.version" placeholder="请选择应用类型">
            <el-option label="标准版" value="standard" />
            <el-option label="企业版" value="enterprise" />
            <el-option label="旗舰版" value="ultimate" />
          </el-select> -->
          <el-select
            v-model="formInline.version"
            :placeholder="$translateTitle('developer.selectapplicationtype')"
          >
            <el-option
              :label="$translateTitle('product.Standard')"
              value="standard"
            />
            <el-option
              :label="$translateTitle('product.Enterprise')"
              value="enterprise"
            />
            <el-option
              :label="$translateTitle('product.Flagship')"
              value="ultimate"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="getOrigin(0)">
            <!-- 查询 -->
            {{ $translateTitle('concentrator.search') }}
          </el-button>
          <el-button type="primary" @click.native="addServer">
            <!-- 新增 -->
            {{ $translateTitle('product.newlyadded') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="servertable">
      <el-table
        :data="tableData"
        :height="height"
        style="width: 100%; text-align: center"
      >
        <!-- <el-table-column label="编号" type="index" width="50" align="center" /> -->
        <el-table-column
          align="center"
          :label="$translateTitle('equipment.number')"
          type="index"
          width="80"
        />
        <!-- <el-table-column label="客户名称" align="center" width="100"> -->
        <el-table-column
          align="center"
          :label="$translateTitle('user.Customername')"
          width="150"
        >
          <template #default="{ row }">
            <span>{{ row.customer_name }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="客户应用" align="center" width="200"> -->
        <el-table-column
          align="center"
          :label="$translateTitle('user.Customerapplication')"
          width="200"
        >
          <template #default="{ row }">
            <span>{{ row.appname }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="版本" align="center" width="100"> -->
        <el-table-column
          align="center"
          :label="$translateTitle('plugins.version')"
          width="100"
        >
          <template #default="{ row }">
            <span v-if="row.product">
              {{ row.product.shuwa_iot_software }}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="服务器IP" align="center" width="150"> -->
        <el-table-column
          align="center"
          :label="$translateTitle('resource.server') + ' IP'"
          width="150"
        >
          <template #default="{ row }">
            <p v-if="row.private_ip">
              {{ row.private_ip + '(' + $translateTitle('task.private') + ')' }}
            </p>
            <p v-if="row.public_ip">
              {{ row.public_ip + '(' + $translateTitle('task.pubic') + ')' }}
            </p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="服务器配置" align="center" width="150"> -->
        <el-table-column
          align="center"
          :label="$translateTitle('product.Serverconfiguration')"
          width="150"
        >
          <template v-if="row.private_ip" #default="{ row }">
            <el-popover placement="top" trigger="hover">
              <p>
                {{ $translateTitle('equipment.ipaddress') }}:
                {{ row.private_ip }}
              </p>
              <p>
                {{ $translateTitle('equipment.macaddress') }}:
                {{ row.mac }}
              </p>
              <div slot="reference" class="name-wrapper">
                <el-tag effect="dark">
                  <!-- ////////////////////////////////////////////////// -->
                  <!-- ////////////////////////////////////////////////// -->
                  <!-- ////////////////////////////////////////////////// -->
                  <!-- ////////////////////////////////////////////////// -->
                  <span>
                    {{
                      row.core +
                      $translateTitle('node.core') +
                      row.memory +
                      ' ' +
                      row.disk +
                      $translateTitle('node.memory')
                    }}
                  </span>
                </el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- 机器码 -->
        <el-table-column
          align="center"
          :label="$translateTitle('product.Machinecode')"
          show-overflow-tooltip
          width="200"
        >
          <template #default="{ row }">
            <span>{{ row.key }}</span>
          </template>
        </el-table-column>
        <!-- 授权码 -->
        <el-table-column
          align="center"
          :label="$translateTitle('developer.authcode')"
        >
          <template #default="{ row }">
            <span>{{ row.license }}</span>
          </template>
        </el-table-column>
        <!-- 连接状态 -->
        <el-table-column
          align="center"
          :label="$translateTitle('concentrator.connection')"
          width="100"
        >
          <template #default="{ row }">
            <span v-if="row.is_online == true" style="color: green">
              <!-- 在线 -->
              {{ $translateTitle('zetadevices.online') }}
            </span>
            <span v-else style="color: red">
              <!-- 离线 -->
              {{ $translateTitle('zetadevices.offline') }}
            </span>
          </template>
        </el-table-column>
        <!-- 部署情况 -->
        <el-table-column
          align="center"
          :label="$translateTitle('developer.Deployment')"
          width="100"
        >
          <template #default="{ row }">
            <span v-if="row.status == 'unauthorized'" style="color: red">
              <!-- 未授权 -->
              {{ $translateTitle('developer.Unauthorized') }}
            </span>
            <span
              v-else-if="row.status == 'start_install'"
              style="color: green"
            >
              <!-- 开始部署 -->
              {{ $translateTitle('product.Startdeployment') }}
            </span>
            <span v-else-if="row.status == 'installing'" style="color: green">
              <!-- 部署中 -->
              {{ $translateTitle('product.Underdeployment') }}
            </span>
            <span v-else style="color: green">
              <!-- 部署完成 -->
              {{ $translateTitle('product.Deploymentcomplete') }}
            </span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          align="center"
          :label="$translateTitle('node.operation')"
          width="500"
        >
          <template #default="{ row, $index }">
            <el-button size="mini" @click="handleDetail($index, row)">
              <!-- 详情 -->
              {{ $translateTitle('application.detail') }}
            </el-button>
            <el-button
              icon="el-icon-s-operation"
              size="mini"
              type="primary"
              @click="addserver(row)"
            >
              <!-- 在线安装 -->
              {{ $translateTitle('zetadevices.Onlineinstallation') }}
            </el-button>
            <el-button size="mini" type="success" @click="uploadLicense1(row)">
              <!-- 离线安装 -->
              {{ $translateTitle('zetadevices.Offlineinstallation') }}
            </el-button>
            <el-button size="mini" type="primary" @click="onlineLictool(row)">
              <!-- 在线升级 -->
              {{ $translateTitle('zetadevices.Onlineupgrade') }}
            </el-button>
            <el-button size="mini" type="success" @click="offlineLictool(row)">
              <!-- 离线升级 -->
              {{ $translateTitle('zetadevices.Offlineupgrade') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="serverpagina">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="pagesize"
        :page-sizes="[10, 20, 30, 50]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <!--新增编辑弹窗-->
    <!-- 服务部署 -->
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="$translateTitle('developer.Servicedeployment')"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="ruleForm"
        class="demo-ruleForm"
        label-width="100px"
        :model="ruleForm"
        :rules="rules"
      >
        <!-- <el-form-item label="设备规模" prop="name">
          <el-input v-model.number="ruleForm.name">
               <template slot="append">台</template>
          </el-input>
        </el-form-item>-->
        <!-- <el-form-item label="应用类型" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择应用类型">
            <el-option label="标准版" value="standard" />
            <el-option label="企业版" value="enterprise" />
            <el-option label="旗舰版" value="ultimate" />
          </el-select> -->
        <el-form-item
          :label="$translateTitle('developer.applicationtype')"
          prop="region"
        >
          <el-select v-model="ruleForm.region" placeholder="请选择应用类型">
            <el-option
              :label="$translateTitle('product.Standard')"
              value="standard"
            />
            <el-option
              :label="$translateTitle('product.Enterprise')"
              value="enterprise"
            />
            <el-option
              :label="$translateTitle('product.Flagship')"
              value="ultimate"
            />
          </el-select>
          <p
            style="
              position: absolute;
              top: 30px;
              margin: 0;
              color: black;
              color: #cc6e00;
            "
          >
            <!-- 标准版本为单机版 -->
            {{
              $translateTitle(
                'product.Thestandardversionisthestandaloneversion'
              )
            }}
          </p>
        </el-form-item>
        <!-- <el-form-item label="应用名称" prop="appname">
          <el-select v-model="ruleForm.appname" placeholder="请选择需要应用">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>-->
        <!-- 授权码 -->
        <el-form-item
          :label="$translateTitle('developer.authcode')"
          prop="licensekey"
        >
          <!-- 请输入license授权码 -->
          <el-input
            v-model="ruleForm.licensekey"
            :placeholder="$translateTitle('product.enterthelicensecode')"
          />
        </el-form-item>
        <!-- 客户名称 -->
        <el-form-item
          :label="$translateTitle('user.Customername')"
          prop="username"
        >
          <el-input
            v-model="ruleForm.username"
            :placeholder="
              $translateTitle('product.enter1') +
              $translateTitle('user.Customername')
            "
          />
          <!-- <el-select v-model="" placeholder="请选择应用版本">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>-->
        </el-form-item>
        <!-- 软件版本 -->
        <el-form-item
          :label="$translateTitle('plugins.version')"
          prop="version"
        >
          <el-input
            v-model="ruleForm.version"
            :placeholder="
              $translateTitle('product.enter1') +
              $translateTitle('plugins.version')
            "
          />
          <!-- <el-select v-model="" placeholder="请选择应用版本">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>-->
        </el-form-item>
        <!-- <el-form-item label="许可有效期" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="datetime"
                placeholder="选择开始时间"
                v-model="ruleForm.date1"
                style="width: 100%;"
                :picker-options="pickerOptionsStart"
                 @change="startDate"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-date-picker  type="datetime" placeholder="选择结束时间" v-model="ruleForm.date2" style="width: 100%;"  :picker-options="pickerOptionsEnd" @change="endDate"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>-->
        <!-- <el-form-item class="notall">
          <el-button type="primary" @click.native="submitForm('ruleForm')">部 署</el-button>
          <el-button @click="resetForm('ruleForm')">取 消</el-button>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="updatedLicense('ruleForm')">
          <!-- 部署 -->
          {{ $translateTitle('developer.deploy') }}
        </el-button>
        <el-button @click="dialogFormVisible = false">
          <!-- 取消 -->
          {{ $translateTitle('developer.cancel') }}
        </el-button>
      </div>
    </el-dialog>
    <!--详情信息dialog-->
    <!-- 详情 -->
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="$translateTitle('product.details')"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <el-input v-model="licensedetail" readonly :rows="20" type="textarea" />
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="dialogVisible = false">确 定</el-button>-->
      </span>
    </el-dialog>
    <!--新增dialog-->
    <!-- 服务器配置 -->
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="$translateTitle('product.Serverconfiguration')"
      :visible.sync="serverdialogVisible"
      width="50%"
    >
      <el-form
        ref="serverForm"
        class="demo-serverForm"
        label-width="150px"
        :model="serverForm"
        :rules="serverrules"
      >
        <!-- 用户名称 -->
        <el-form-item
          :label="$translateTitle('product.username')"
          prop="customer_name"
        >
          <el-input v-model="serverForm.customer_name" />
        </el-form-item>
        <!-- 应用名称 -->
        <el-form-item :label="$translateTitle('product.appid')" prop="app">
          <!-- 应用商名称 -->
          <el-select
            v-model="serverForm.app"
            :placeholder="$translateTitle('product.Nameofapplicationprovider')"
          >
            <el-option
              v-for="(item, index) in applist"
              :key="index"
              :label="item.desc"
              :value="item.desc"
            />
          </el-select>
        </el-form-item>
        <!-- 服务器IP(私) -->
        <el-form-item
          :label="
            $translateTitle('resource.server') +
            ' IP' +
            '(' +
            $translateTitle('task.private') +
            ')'
          "
          prop="serverip"
        >
          <el-input v-model="serverForm.serverip" />
        </el-form-item>
        <!-- 服务器IP(公) -->
        <el-form-item
          :label="
            $translateTitle('resource.server') +
            ' IP' +
            '(' +
            $translateTitle('task.public') +
            ')'
          "
          prop="publicip"
        >
          <el-input v-model="serverForm.publicip" />
        </el-form-item>
        <!-- MAC地址 -->
        <el-form-item
          :label="$translateTitle('equipment.macaddress')"
          prop="mac"
        >
          <el-input v-model="serverForm.mac" />
        </el-form-item>
        <!-- 服务器配置 -->
        <el-form-item
          :label="$translateTitle('product.Serverconfiguration')"
          required
        >
          <el-col :span="11">
            <el-form-item prop="serverhe">
              <el-input v-model="serverForm.serverhe">
                <template slot="append">
                  <!-- 核 -->
                  {{ $translateTitle('node.core') }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="serverg">
              <el-input v-model.number="serverForm.serverg">
                <template slot="append">G</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 内存 -->
        <el-form-item :label="$translateTitle('node.memory')" prop="disk">
          <el-input v-model.number="serverForm.disk">
            <template slot="append">G</template>
          </el-input>
        </el-form-item>
        <!-- 机器码 -->
        <el-form-item
          :label="$translateTitle('product.Machinecode')"
          prop="serverkey"
        >
          <!-- 请输入机器码 -->
          <el-input
            v-model="serverForm.serverkey"
            :placeholder="
              $translateTitle('product.enter1') +
              $translateTitle('product.Machinecode')
            "
          />
        </el-form-item>
        <!-- 授权码 -->
        <el-form-item :label="$translateTitle('developer.authcode')">
          <!-- 请输入授权码(未授权可为空) -->
          <el-input
            v-model="serverForm.licence"
            :placeholder="
              $translateTitle('product.enter1') +
              $translateTitle('developer.authcode') +
              ' (' +
              $translateTitle('developer.Unauthorizedcanbeempty') +
              ')'
            "
          />
        </el-form-item>
        <!-- <el-form-item label="服务器状态" prop="status">
          <el-select v-model="serverForm.status" placeholder="应用商名称">
            <el-option label="未授权" value="unauthorized" />
            <el-option label="开始部署" value="start_install" />
            <el-option label="部署中" value="installing" />
            <el-option label="部署完成" value="installed" />
          </el-select>
        </el-form-item> -->
        <el-form-item
          :label="
            $translateTitle('resource.server') + $translateTitle('node.state')
          "
          prop="status"
        >
          <el-select
            v-model="serverForm.status"
            :placeholder="$translateTitle('product.Nameofapplicationprovider')"
          >
            <el-option
              :label="$translateTitle('developer.Unauthorized')"
              value="unauthorized"
            />
            <el-option
              :label="$translateTitle('product.Startdeployment')"
              value="start_install"
            />
            <el-option
              :label="$translateTitle('product.Underdeployment')"
              value="installing"
            />
            <el-option
              :label="$translateTitle('product.Deploymentcomplete')"
              value="installed"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$translateTitle('zetadevices.onlinestate')"
          :label-width="50"
          prop="online"
        >
          <span v-if="serverForm.online" style="color: #13ce66">
            <!-- 在线 -->
            {{ $translateTitle('zetadevices.online') }}
          </span>
          <span v-else style="color: #ff4949">
            <!-- 离线 -->
            {{ $translateTitle('zetadevices.offline') }}
          </span>
          <el-switch
            v-model="serverForm.online"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="serverdialogVisible = false">
          <!-- 取消 -->
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button type="primary" @click.native="serverOption('serverForm')">
          <!-- 确定 -->
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </span>
    </el-dialog>
    <!--在线升级弹窗-->
    <!-- 在线升级 -->
    <el-dialog
      :append-to-body="true"
      :title="$translateTitle('zetadevices.Onlineupgrade')"
      :visible.sync="dialogOnline"
    >
      <el-form ref="onlineform" :model="onlineform" :rules="onlineformrule">
        <!-- 版本号 -->
        <el-form-item
          :label="$translateTitle('plugins.version')"
          label-width="120px"
          prop="name"
        >
          <el-input
            v-model="onlineform.name"
            autocomplete="off"
            :placeholder="
              $translateTitle('product.enter1') +
              $translateTitle('plugins.version')
            "
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOnline = false">
          <!-- 取消 -->
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button type="primary" @click.native="updateLictool('onlineform')">
          <!-- 确定 -->
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    offlineServer,
    postLicense,
    putLicense,
    queryLicense,
    uploadLicense,
    uploadServer,
  } from '@/api/License'
  import { app_count } from '@/api/Platform/index'

  var product = {}
  export default {
    data() {
      const validUrl = (rule, value, callback) => {
        const reg =
          /^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
        if (!reg.test(value)) {
          callback(new Error('需要输入正确的服务器IP'))
        } else {
          callback()
        }
      }
      const validKey = (rule, value, callback) => {
        const reg = /^[A-Za-z0-9]{32}$/
        if (!reg.test(value)) {
          callback(new Error('需要输入正确32位机器码'))
        } else {
          callback()
        }
      }
      var valiNumberPass1 = (rule, value, callback) => {
        // 包含小数的数字
        const reg = /^[+]?(0|([1-9]\d*))(\.\d+)?$/g
        if (value === '') {
          callback(new Error('请输入正数'))
        } else if (!reg.test(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }
      return {
        height: this.$baseTableHeight(1),
        appid: '',
        appsecret: '',
        serverdialogVisible: false,
        dialogFormVisible: false,
        dialogVisible: false,
        dialogOnline: false,
        // 在线升级弹窗
        onlineform: {
          name: '',
        },
        onlineformrule: {
          name: [
            {
              required: true,
              message: '请输入要更新的版本号',
              trigger: 'blur',
            },
          ],
        },
        licensedetail: {},
        formInline: {
          user: '',
          region: 1,
          app: '',
          version: '',
        },
        tableData: [],
        pagesize: 10,
        total: 0,
        start: 0,
        licenseid: '',
        ruleForm: {
          name: '',
          region: 'standard',
          date1: '',
          date2: '',
          appname: '',
          licensekey: '',
          username: '',
          version: '',
        },
        serverForm: {
          app: '',
          serverip: '',
          serverhe: '',
          serverg: '',
          serverkey: '',
          license: '',
          online: false,
          customer_name: '',
          disk: Number('50G'.replace(/G/g, '')),
          status: 'unauthorized',
          publicip: '',
          mac: '',
        },
        applist: [],
        rules: {
          name: [
            {
              required: true,
              message: '请输入预计设计规模',
            },
            {
              type: 'number',
              message: '预计设计规模 必须为数字值',
            },
          ],
          region: [
            {
              required: true,
              message: '请选择应用类型',
              trigger: 'change',
            },
          ],
          appname: [
            {
              required: true,
              message: '请选择需要应用',
              trigger: 'change',
            },
          ],
          licensekey: [
            {
              required: true,
              message: 'license必填',
              trigger: 'blur',
            },
          ],
          username: [
            {
              required: true,
              message: '客户名称必填',
              trigger: 'blur',
            },
          ],
          version: [
            {
              required: true,
              message: '应用版本必填',
              trigger: 'blur',
            },
          ],
          date1: [
            {
              type: 'date',
              required: true,
              message: '请选择开始时间',
              trigger: 'change',
            },
          ],
          date2: [
            {
              type: 'date',
              required: true,
              message: '请选择结束时间',
              trigger: 'change',
            },
          ],
        },
        serverrules: {
          app: [
            {
              required: true,
              message: '请选择客户名称',
              trigger: 'change',
            },
          ],
          serverip: [
            {
              required: true,
              message: '请输入服务器私网IP',
              trigger: 'blur',
            },
            {
              validator: validUrl,
            },
          ],
          publicip: [
            {
              required: true,
              message: '请输入服务器公网IP',
              trigger: 'blur',
            },
            {
              validator: validUrl,
            },
          ],
          mac: [
            {
              required: true,
              message: '请输入服务器MAC地址',
              trigger: 'blur',
            },
          ],
          serverhe: [
            {
              required: true,
              message: '请输入服务器配置',
            },
            {
              validator: valiNumberPass1,
              type: 'number',
              message: '服务器配置必须为数字值',
            },
          ],
          serverg: [
            {
              required: true,
              message: '请输入服务器配置',
            },
            {
              type: 'number',
              message: '服务器配置必须为数字值',
            },
          ],
          serverkey: [
            {
              required: true,
              message: '请输入机器码',
              trigger: 'blur',
            },
            { validator: validKey },
          ],
          customer_name: [
            {
              required: true,
              message: '请输入用户名称',
              trigger: 'blur',
            },
          ],
          disk: [
            {
              required: true,
              message: '请输入服务器内存',
            },
            {
              type: 'number',
              message: '服务器内存必须为数字值',
            },
          ],
          stauts: [
            {
              required: true,
              message: '请选择服务器状态',
              trigger: 'change',
            },
          ],
        },
        pickerOptionsStart: {
          disabledDate: (time) => {
            const endDateVal = this.ruleForm.date2
            if (endDateVal) {
              return (
                time.getTime() > new Date(endDateVal).getTime() ||
                time.getTime() < Date.now() - 8.64e7
              )
            } else {
              return time.getTime() < Date.now() - 8.64e7
            }
          },
        },
        pickerOptionsEnd: {
          disabledDate: (time) => {
            const beginDateVal = this.ruleForm.date1
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime()
            } else {
              return time.getTime() < Date.now() - 8.64e7
            }
          },
        },
        isupdatedserver: '',
        licenseObj: {
          id: '',
        },
      }
    },
    mounted() {
      this.getApp()
      if (this.$route.query.appid) {
        this.formInline.app = this.$route.query.appid
      }
      this.getOrigin(0)
    },
    methods: {
      addServer() {
        // initFrom
        this.serverForm = {
          app: '',
          serverip: '127.7.0.1',
          serverhe: 4,
          serverg: 8,
          serverkey: 'EtXWoGpE74FnpANsLGDvj9uwkat8c7AU',
          license: '127.7.0.1',
          online: false,
          customer_name: 'addServe',
          disk: Number('50G'.replace(/G/g, '')),
          status: 'unauthorized',
          publicip: '127.7.0.1',
          mac: '127.7.0.1',
        }
        this.serverdialogVisible = true
      },
      serverOption(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const aclKey1 = this.$Cookies.get('appids')
            const setAcl = {}
            setAcl[aclKey1] = {
              read: true,
              write: true,
            }
            var params = { ACL: setAcl }
            params.appname = this.serverForm.customer_name
            params.detail = {}
            params.product = {}
            params.key = this.serverForm.serverkey
            params.private_ip = this.serverForm.serverip
            params.is_online = this.serverForm.online
            params.customer_name = this.serverForm.customer_name
            params.public_ip = this.serverForm.publicip
            params.disk = this.serverForm.disk + 'G'
            params.core = this.serverForm.serverhe
            params.memory = this.serverForm.serverg + 'G'
            params.mac = this.serverForm.mac
            params.license = this.serverForm.license
            params.app = {
              __type: 'Pointer',
              className: 'App',
              objectId: this.serverForm.app,
            }
            const res = await postLicense(params)
            if (res) {
              this.$message('添加成功')
              this.$refs[formName].resetFields()
              this.getOrigin(0)
              this.serverdialogVisible = false
            }
          }
        })
      },
      // 初始化应用data  axios query
      async getApp() {
        this.appid = this.$route.query.appid
        this.appsecret = this.$route.query.appsecret
        console.log(this.appid, this.appsecret)
        const { results } = await app_count({})
        if (results) this.applist = results
      },
      // 初始化数
      async getOrigin(isstart) {
        console.log('isstart', isstart)
        if (isstart == 0) {
          this.start = 0
        }
        var params = {
          order: '-updatedAt',
          skip: this.start,
          limit: this.pagesize,
          count: 'objectId',
          where: {},
        }
        if (this.formInline.region !== 1) {
          params.where.is_online = this.formInline.region
          // params.is_online=this.formInline.region
        }
        if (this.formInline.app !== '') {
          params.where.app = this.formInline.app
        }
        if (this.formInline.user !== '') {
          params.where.customer_name = this.formInline.user
        }
        if (this.formInline.version !== '') {
          params.type = this.formInline.version
        }
        // console.log('search license is', params)
        const { count, results } = await queryLicense(params)
        if (count) this.total = count
        if (results) this.tableData = results
      },
      // 分页
      handleSizeChange(val) {
        this.pagesize = val
        this.getOrigin(1)
      },
      handleCurrentChange(val) {
        this.start = (val - 1) * this.pagesize
        this.getOrigin(1)
      },
      // 服务器部署弹窗打开
      addserver(row) {
        this.licenseid = row.id
        this.ruleForm.version = row.attributes.software
        if (row.attributes.license) {
          this.ruleForm.licensekey = row.attributes.license
        } else {
          this.ruleForm.licensekey = ''
        }
        this.ruleForm.username = row.attributes.customer_name
        if (row.attributes.product) {
          for (var key in row.attributes.product) {
            product[key] = row.attributes.product[key]
          }
        }
        if (
          row.attributes.status == 'installed' ||
          row.attributes.status == 'start_install' ||
          row.attributes.status == 'installing'
        ) {
          this.$confirm(
            `${
              row.attributes.status == 'installed'
                ? '是否重新部署服务器, 是否继续?'
                : '服务器正在部署中，是否重新部署'
            }`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
            .then(() => {
              this.dialogFormVisible = true
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消重新部署',
              })
            })
        } else {
          this.dialogFormVisible = true
        }
      },
      // 服务器部署 installed
      updatedLicense(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = {
              type: this.ruleForm.region,
              license: this.ruleForm.licensekey,
              status: 'start_install',
              customer_name: this.ruleForm.username,
              software: this.ruleForm.version,
            }
            putLicense(this.licenseid, data)
              .then((resultes) => {
                if (resultes) {
                  this.$message('正在部署中')
                  this.dialogFormVisible = false
                  this.getOrigin(1)
                }
              })
              .catch((e) => {
                console.log('updatedLicense faild ' + e.error)
                return false
              })
            return true
          }
        })
      },

      // 下载服务器配置
      uploadLicense1(row) {
        uploadServer(row.attributes.license).then((resultes) => {
          window.open(
            window.location.origin +
              '/licsetup?license=' +
              row.attributes.license,
            '_blank'
          )
        })
      },
      // 在线升级
      onlineLictool(row) {
        this.licenseObj.id = row.id
        for (var key in row.attributes.product) {
          this.licenseObj[key] = row.attributes.product[key]
        }
        this.dialogOnline = true
      },
      updateLictool(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = {
              status: 'start_update',
              software: this.onlineform.name,
            }
            putLicense(this.licenseid, data)
              .then((results) => {
                if (results) {
                  this.dialogOnline = false
                  this.$message('正在升级中')
                }
              })
              .catch((e) => {
                console.log('updatedLicense faild ' + e.error)
                return false
              })
          }
        })
      },
      // 离线升级
      offlineLictool(row) {
        offlineServer(row.attributes.license).then((resultes) => {
          window.open(
            window.location.origin +
              '/licsetup?license=' +
              row.attributes.license,
            '_blank'
          )
        })
      }, // 通用配置下载
      async downlictool() {
        const res = await uploadLicense(this.appid, this.appsecret)
        if (res) {
          window.open(
            window.location.origin +
              '/lictool?appid=' +
              this.appid +
              '&appsecret=' +
              this.appsecret,
            '_blank'
          )
        }
      },
      // 详情查看
      handleDetail(index, row) {
        this.dialogVisible = true
        this.licensedetail = JSON.stringify(row.attributes.product, null, 10)
      },
      startDate() {
        if (
          this.ruleForm.date2 <= this.ruleForm.date1 &&
          this.ruleForm.date2 != '' &&
          this.ruleForm.date2 != null
        ) {
          this.$message('采集结束时间要小于开始时间')
          this.ruleForm.date1 = ''
        }
        if (this.ruleForm.date1 < Date.now() - 2000) {
          this.$message('采集开始时间要大于当前时间')
          this.ruleForm.date1 = ''
        }
      },
      endDate() {
        if (this.ruleForm.date2 <= this.ruleForm.date1) {
          this.$message('采集结束时间要小于开始时间')
          this.ruleForm.date2 = ''
        }
        if (this.ruleForm.date2 < Date.now() - 2000) {
          this.$message('采集结束时间要大于当前时间')
          this.ruleForm.date2 = ''
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .serverlist {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #fff;

    .servercontent {
      .el-form {
        text-align: right;
      }
    }

    .serverpagina {
      margin-top: 20px;
    }

    ::v-deep .el-dialog__body {
      .el-form {
        display: flex;
        flex-wrap: wrap;

        .el-form-item {
          width: 50%;

          ::v-deep .el-select {
            width: 100%;
          }
        }

        ::v-deep .notall {
          width: 100%;
          text-align: center;
        }

        ::v-deep .el-col-11 {
          .el-form-item {
            width: 100%;
          }
        }

        ::v-deep .el-col-2 {
          text-align: center;
        }
      }
    }

    @media screen and (max-width: 1350px) {
      ::v-deep .el-dialog__body {
        .el-form {
          .el-form-item {
            width: 100%;
          }
        }
      }
    }
  }
</style>
