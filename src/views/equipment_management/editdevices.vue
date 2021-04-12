<!--f27f2683b124-->
<template>
  <div class="editdevices">
    <div class="editheader">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/roles/thing' }">
          {{ $translateTitle('route.设备管理') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ $translateTitle('route.设备详情') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-tabs v-model="activeName" @tab-click="tabHandleClick">
        <el-tab-pane
          :label="$translateTitle('equipment.deviceinformation')"
          name="first"
        >
          <div
            style="box-sizing: border-box; padding: 10px; background: #ffffff"
          >
            <!-- <h4>设备信息</h4> -->
            <div>
              <table
                class="mailtable"
                style="width: 100%"
                border="0"
                cellspacing="0"
                cellpadding="0"
              >
                <!-- 设备编号: 所属产品: 安装位置 -->
                <tr>
                  <td class="cloumn">
                    {{ $translateTitle('equipment.devicenumber') + ':' }}
                  </td>
                  <td>{{ devicedetail.devaddr }}</td>
                  <td class="cloumn">
                    {{ $translateTitle('equipment.product') + ':' }}
                  </td>
                  <td>{{ devicedetail.productName }}</td>
                  <td class="cloumn">
                    {{ $translateTitle('equipment.installationlocation') }}
                  </td>
                  <td>{{ devicedetail.address }}</td>
                </tr>

                <tr>
                  <td class="cloumn">
                    {{ $translateTitle('equipment.state') + ':' }}
                  </td>
                  <!-- <td  :class="devicedetail.status"  v-if="devicedetail.status=='ACTIVE'">{{$t('product.active')}}</td>
                   <td  :class="devicedetail.status" v-else-if="devicedetail.status=='UNACTIVE'">{{$t('product.unactive')}}</td>
                   <td  :class="devicedetail.status" v-else-if="devicedetail.status=='ONLINE'">{{$t('product.online')}}</td>
                  <td  :class="devicedetail.status"  v-else>{{$t('product.offline')}}</td>-->
                  <td class="ACTIVE">
                    {{ $translateTitle('product.active') }}
                  </td>
                  <td class="cloumn">ProductId:</td>
                  <td>{{ devicedetail.productid }}</td>

                  <td class="cloumn">
                    {{ $translateTitle('equipment.lastonlinetime') + ':' }}
                  </td>
                  <td>{{ devicedetail.lastOnlineTime }}</td>
                </tr>
                <tr>
                  <td class="cloumn">
                    {{ $translateTitle('equipment.ipaddress') + ':' }}
                  </td>
                  <td>{{ devicedetail.ip || '-' }}</td>
                  <td class="cloumn">
                    ProductSecret:
                    <el-tooltip
                      content="注意保密，如有泄露即使更换"
                      placement="top"
                      style="margin-left: 5px; color: #cccccc"
                    >
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </td>
                  <td>{{ devicedetail.productSecret }}</td>
                  <td class="cloumn">
                    {{ $translateTitle('equipment.createdAt') + ':' }}
                  </td>
                  <td>{{ devicedetail.createdAt }}</td>
                </tr>
                <tr>
                  <!-- <td class="cloumn">{{$t('equipment.subordinatenode')+':'}}</td>
                  <td>{{devicedetail.node}}</td>-->
                  <td class="cloumn">
                    {{ $translateTitle('equipment.nodetype') + ':' }}
                  </td>
                  <td v-if="devicedetail.nodeType == 0">
                    {{ $translateTitle('product.equipment') }}
                  </td>
                  <td v-else>{{ $translateTitle('product.gateway') }}</td>
                  <td class="cloumn">
                    {{ $translateTitle('developer.describe') + ':' }}
                  </td>
                  <td>{{ devicedetail.desc }}</td>
                </tr>
              </table>
            </div>
          </div>
          <!-- <div class="jiange" style="width:100%;height:20px;background:#f4f4f4">

          </div>-->
          <div
            class="twofirsttable"
            style="
              box-sizing: border-box;
              padding: 10px;
              margin-top: 20px;
              background: #ffffff;
            "
          >
            <h4>
              {{ $translateTitle('equipment.deviceextensioninformation') }}
            </h4>
            <el-input
              v-model="devicedetail.shadow"
              :row="10"
              :cols="5"
              type="textarea"
              readonly
            />
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="'Topic' + $translateTitle('product.list')"
          name="second"
        >
          <div
            style="box-sizing: border-box; padding: 10px; background: #ffffff"
          >
            <!-- <div>
                              <h4 style="display:inline">设备TOPIC类 <el-tooltip content="产品下的所有设备都会继承该产品的Topic类" placement="top" style="margin-left:5px;color:#cccccc">
                                <i class="el-icon-question"></i>
                                </el-tooltip></h4>
            </div>-->
            <el-table :data="topicData" style="width: 100%; text-align: center">
              <el-table-column label="Topic" align="left">
                <template slot-scope="scope">
                  <span>
                    {{
                      scope.row.topic.replace(
                        '\${ProductId}\/${DevAddr\}',
                        devicedetail.productid + '/' + devicedetail.devaddr
                      )
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('equipment.operationauthority')"
                align="center"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 'pub'">
                    {{ $translateTitle('product.pub') }}
                  </span>
                  <span v-if="scope.row.type == 'sub'">
                    {{ $translateTitle('product.sub') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.describe')"
                prop="desc"
                align="center"
              />
              <el-table-column
                :label="$translateTitle('developer.operation')"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button v-if="!scope.row.isdef" type="primary" size="mini">
                    {{ $translateTitle('developer.edit') }}
                  </el-button>
                  <el-button v-if="!scope.row.isdef" type="danger" size="mini">
                    {{ $translateTitle('developer.delete') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="$translateTitle('equipment.runningstate')"
          name="third"
        >
          <div
            style="box-sizing: border-box; padding: 10px; background: #ffffff"
          >
            <div style="text-align: right">
              <div style="float: left">
                <span>{{ $translateTitle('equipment.realtimerefresh') }}</span>
                <el-switch
                  v-model="isupdate"
                  active-color="#13ce66"
                  inactive-color="#cccccc"
                  @change="updateTrue($event)"
                />
              </div>

              <!-- 右上角(图表,表格)的按钮 -->
              <el-button-group>
                <el-button
                  :class="!isshowtable ? 'buttonactive' : ''"
                  type="primary"
                  plain
                  size="small"
                  @click="isshowtable = false"
                >
                  {{ $translateTitle('equipment.chart') }}
                </el-button>
                <el-button
                  :class="isshowtable ? 'buttonactive' : ''"
                  type="primary"
                  plain
                  size="small"
                  @click="isshowtable = true"
                >
                  {{ $translateTitle('equipment.table') }}
                </el-button>
              </el-button-group>
            </div>

            <div v-if="!isshowtable" class="thirdtb">
              <!--运行状态卡片-->
              <ul style="display: flex; flex-wrap: wrap">
                <li
                  v-for="(item, index) in properties"
                  :key="index"
                  class="updatedtable"
                >
                  <div style="height: 70px">
                    <span style="font-size: 16px">{{ item.name }}</span>
                    <span style="float: right; margin-right: 10px">
                      <!-- <svg-icon :icon-class="item.name" /> -->
                    </span>
                  </div>
                  <div
                    v-if="
                      item.dataType.type == 'double' ||
                      item.dataType.type == 'float' ||
                      item.dataType.type == 'int'
                    "
                    :title="item.dataType.type"
                    class="stla"
                  >
                    <span>{{ item.value | filterVal }}</span>
                    <span v-if="item.dataType.specs.unit">
                      {{ item.dataType.specs.unit }}
                    </span>
                  </div>

                  <div
                    v-if="
                      item.dataType.type == 'enmu' ||
                      item.dataType.type == 'bool'
                    "
                    :title="item.dataType.type"
                    class="stla"
                  >
                    <span>{{ item.value | filterVal }}</span>
                    <span>{{ item.dataType.specs[item.value] }}</span>
                  </div>

                  <div
                    v-if="item.dataType.type == 'struct'"
                    :title="item.dataType.type"
                    class="stla"
                  >
                    <i
                      v-for="(key, indexK) in item.specs"
                      :key="indexK"
                      style="display: block; height: 30px; font-style: normal"
                    >
                      <div
                        v-if="
                          key.dataType.type == 'double' ||
                          key.dataType.type == 'float' ||
                          key.dataType.type == 'int'
                        "
                        class="stla"
                      >
                        <span>{{ key.name + ':' }}ee</span>
                        <span>{{ key.value }}aa</span>
                        <span v-if="key.dataType.specs.unit">
                          {{ key.dataType.specs.unit }}rr
                        </span>
                      </div>
                      <div
                        v-if="
                          key.dataType.type == 'enmu' ||
                          key.dataType.type == 'bool'
                        "
                        class="stla"
                      >
                        <span>{{ key.name + ':' }}</span>
                        <span>{{ key.value }}</span>
                        <span>{{ key.dataType.specs[key.value] }}</span>
                      </div>
                    </i>
                  </div>

                  <div class="ta">
                    <span class="fontSize">
                      {{ $translateTitle('equipment.updatetime') + ':' }}
                    </span>
                    <span
                      v-if="item.createdat"
                      class="fontSize"
                      @click="print(properties)"
                    >
                      {{ timestampToTime(item.createdat) }}
                    </span>
                  </div>
                  <div class="ta">
                    <el-link
                      :underline="false"
                      type="primary"
                      @click="dataDetail(item)"
                    >
                      查看数据
                    </el-link>
                  </div>
                </li>
              </ul>
            </div>
            <div v-if="isshowtable" class="thirdtable">
              <!--运行状态表格-->

              <el-table
                :data="
                  thirdData.slice(
                    (thirdstart - 1) * thirdlength,
                    thirdstart * thirdlength
                  )
                "
                style="width: 100%; margin-top: 10px; text-align: center"
              >
                <el-table-column
                  :label="$translateTitle('equipment.serialnumber')"
                  align="center"
                  type="index"
                  width="100"
                />

                <el-table-column
                  :label="$translateTitle('equipment.value')"
                  prop="value"
                  align="center"
                  show-overflow-tooltip
                />
                <el-table-column
                  :label="$translateTitle('equipment.time')"
                  prop="time"
                  align="center"
                  width="300"
                />
              </el-table>
              <el-pagination
                :page-sizes="[10, 25, 50, 100]"
                :page-size="thirdlength"
                :total="thirdtotal"
                background
                layout="total, sizes, prev, pager, next, jumper"
                style="margin-top: 20px"
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
              />
            </div>
          </div>
        </el-tab-pane>
        <!--         <el-tab-pane label="事件管理" name="fixth">事件管理</el-tab-pane>
                <el-tab-pane label="服务调用" name="sixth">服务调用</el-tab-pane>
                <el-tab-pane label="设备影子" name="seventh">设备影子</el-tab-pane>
        <el-tab-pane label="日志服务" name="eighth">日志服务</el-tab-pane>-->
        <el-tab-pane :label="$translateTitle('route.在线调试')" name="ninth" />
        <!--子设备管理-->
        <el-tab-pane
          v-if="$route.query.nodeType != '0'"
          :label="$translateTitle('equipment.subdevice')"
          name="children"
        >
          <div class="childrendevices">
            <el-form
              :inline="true"
              :model="childrendevices"
              class="demo-form-inline"
              size="small"
            >
              <el-form-item
                :label="$translateTitle('equipment.devicenumber') + ':'"
              >
                <el-input
                  v-model="childrendevices.devicesname"
                  :placeholder="$t('equipment.devicenumber')"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getDevices(0)">
                  {{ $translateTitle('developer.search') }}
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button
                  :disabled="multipleTable.length == 0"
                  type="primary"
                  @click="deleteDevcie"
                >
                  {{ $translateTitle('equipment.RelievingAssociation') }}
                </el-button>
                <el-button
                  :disabled="multipleTable.length == 0"
                  type="primary"
                  @click="unactiveDevice"
                >
                  {{ $translateTitle('developer.prohibit') }}
                </el-button>
                <el-button
                  :disabled="multipleTable.length == 0"
                  type="primary"
                  @click="activeDevice"
                >
                  {{ $translateTitle('developer.enable') }}
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="info" plain>
                  {{ $translateTitle('equipment.Refresh') }}
                </el-button>
                <!-- 添加子设备按钮  -->
                <el-button type="primary" @click="childDialog = true">
                  {{ $translateTitle('equipment.addchilddevice') }}
                </el-button>
              </el-form-item>
            </el-form>
            <div class="devicetable">
              <el-table
                ref="filterTable"
                :data="devicesTableData"
                style="width: 100%; margin-top: 20px; text-align: center"
                @selection-change="DevicesSelectionChange"
              >
                <el-table-column type="selection" align="center" width="55" />
                <el-table-column
                  :label="$translateTitle('equipment.devicenumber')"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.devaddr }}</span>
                    <p style="margin: 0; color: green">{{ scope.row.name }}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$translateTitle('equipment.state')"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span :class="scope.row.status">
                      {{ scope.row.status }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="子网地址" align="center">
                  <template slot-scope="scope">
                    <span>
                      {{
                        scope.row.route == undefined
                          ? ''
                          : scope.row.route[devicedetail.devaddr]
                      }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$translateTitle('equipment.product')"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span type="success">{{ scope.row.productName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$translateTitle('equipment.nodetype')"
                  align="center"
                >
                  <!-- <template slot-scope="scope">
                    <svg-icon
                      v-if="scope.row.nodeType == 0"
                      icon-class="iot"
                      style="width: 2rem; height: 2rem"
                    />
                    <svg-icon
                      v-else
                      icon-class="wgicon"
                      style="width: 2rem; height: 2rem"
                    />
                  </template> -->
                </el-table-column>
                <el-table-column
                  :label="
                    $translateTitle('developer.prohibit') +
                    '/' +
                    $translateTitle('developer.enable')
                  "
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.isEnable"
                      active-color="#5eb058"
                      inactive-color="#cccccc"
                      @change="handelUpdate($event, scope.row, scope.$index)"
                    />
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$translateTitle('equipment.lastonlinetime')"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.lastOnlineTime">
                      {{ timestampToTime(scope.row.lastOnlineTime) }}
                    </span>
                    <span v-else>—</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$translateTitle('developer.operation')"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-link
                      :underline="false"
                      type="primary"
                      icon="el-icon-view"
                      @click="deviceToDetail(scope.row)"
                    >
                      {{ $translateTitle('equipment.see') }}
                    </el-link>

                    <el-popover
                      :ref="`popover-${scope.$index}`"
                      placement="top"
                      width="300"
                    >
                      <p>确定解除这个{{ scope.row.name }}设备关联吗？</p>
                      <div style="margin: 0; text-align: right">
                        <el-button
                          size="mini"
                          @click="
                            scope._self.$refs[
                              `popover-${scope.$index}`
                            ].doClose()
                          "
                        >
                          {{ $translateTitle('developer.cancel') }}
                        </el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          @click="makeSure(scope)"
                        >
                          {{ $translateTitle('developer.determine') }}
                        </el-button>
                      </div>
                      <el-link
                        slot="reference"
                        :underline="false"
                        icon="el-icon-delete"
                        type="danger"
                      >
                        {{ $translateTitle('equipment.RelievingAssociation') }}
                      </el-link>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="elpagination" style="margin-top: 20px">
              <el-pagination
                :page-sizes="[10, 20, 30, 50]"
                :page-size="childrenDeviceLength"
                :total="childrenDeviceTotal"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="childrenDeviceSizeChange"
                @current-change="childrenDeviceCurrentChange"
              />
            </div>
          </div>
          <!--添加子设备弹窗-->
          <el-dialog
            :title="$t('equipment.addchilddevice')"
            :visible.sync="childDialog"
            :close-on-click-modal="false"
            width="30%"
          >
            <div class="childdialog">
              <el-form
                ref="childrenForm"
                :model="childrenForm"
                class="demo-form-inline"
              >
                <el-form-item
                  :label="$translateTitle('equipment.products')"
                  :rules="[
                    { required: true, message: '选择产品', trigger: 'change' },
                  ]"
                  prop="product"
                >
                  <el-select
                    v-model="childrenForm.product"
                    :placeholder="$t('equipment.products')"
                    @change="checkProduct"
                  >
                    <el-option
                      v-for="(item, index) in allProudct"
                      :key="index"
                      :label="item.name"
                      :value="item.objectId"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$translateTitle('product.equipment')"
                  :rules="[
                    { required: true, message: '选择设备', trigger: 'change' },
                  ]"
                  prop="device"
                >
                  <el-select
                    v-model="childrenForm.device"
                    v-el-select-loadmore="loadmore"
                    :placeholder="$t('product.equipment')"
                    :disabled="!ischange"
                  >
                    <el-option
                      v-for="(item, index) in productDevices"
                      :key="index"
                      :label="item.name"
                      :value="item.objectId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :rules="[
                    {
                      required: true,
                      message: '请输入子网地址',
                      trigger: 'blur',
                    },
                  ]"
                  label="子网地址"
                  prop="route"
                >
                  <el-input
                    v-model="childrenForm.route"
                    placeholder="子网地址"
                  />
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="childDialog = false">
                {{ $translateTitle('developer.cancel') }}
              </el-button>
              <el-button type="primary" @click="submitDevice('childrenForm')">
                {{ $translateTitle('developer.determine') }}
              </el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane v-if="isshowchild" label="设备指令" name="instruct">
          <Instruct :product-id="productid" :devices-id="deviceid" />
        </el-tab-pane>
      </el-tabs>
      <!--data数据dialog-->
      <el-dialog
        :visible.sync="datadialogVisible"
        :close-on-click-modal="false"
        title="历史数据"
        width="40%"
      >
        <div class="dialogcontent">
          <!--数据图表-->
          <el-tabs type="border-card" @tab-click="handleClick">
            <el-tab-pane>
              <span slot="label">
                <i class="el-icon-date" />
                表格
              </span>
              <el-table
                :data="
                  datafordetail.slice(
                    (dataDeviceStart - 1) * dataDeviceLength,
                    dataDeviceStart * dataDeviceLength
                  )
                "
                stripe
                height="300"
                style="width: 100%; text-align: center"
              >
                <el-table-column prop="name" label="名称" align="center" />
                <el-table-column prop="value" label="数值" align="center" />
                <el-table-column label="时间" align="center">
                  <template slot-scope="scope">
                    <span>{{ timestampToTime(scope.row.time) }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="elpagination" style="margin-top: 20px">
                <el-pagination
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="dataDeviceLength"
                  :total="dataDeviceTotal.length"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="dataDeviceSizeChange"
                  @current-change="dataDeviceCurrentChange"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label">
                <i class="el-icon-tickets" />
                图表
              </span>
              <div id="echarts" style="width: 100%; height: auto">
                <line-chart :chart-data="lineChartData" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="datadialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="datadialogVisible = false">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { getTdDevice } from '@/api/Device/index.js'
  import { utc2beijing, timestampToTime } from '@/utils/index'
  import LineChart from '../dashboard/admin/components/LineChart'
  import { returnLogin } from '@/utils/return'
  import Instruct from '../devicemanage/instruct_manage'
  var dataobj = {}
  export default {
    components: {
      LineChart,
      Instruct,
    },
    filters: {
      filterVal(val) {
        if (val || val == 0) {
          return val
        } else {
          return '--'
        }
      },
    },
    directives: {
      'el-select-loadmore': {
        bind(el, binding) {
          // 获取element-ui定义好的scroll盒子
          const SELECTWRAP_DOM = el.querySelector(
            '.el-select-dropdown .el-select-dropdown__wrap'
          )
          SELECTWRAP_DOM.addEventListener('scroll', function () {
            /**
             * scrollHeight 获取元素内容高度(只读)
             * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
             * clientHeight 读取元素的可见高度(只读)
             * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
             * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
             */
            const condition =
              this.scrollHeight - this.scrollTop <= this.clientHeight
            if (condition) {
              binding.value()
            }
          })
        },
      },
    },
    data() {
      return {
        width: 0,
        lineChartData: '',
        datafordetail: [],
        datadialogVisible: false,
        childDialog: false,
        ninthform: {
          product: '',
          devices: '',
        },
        wmxform: {
          product: '',
          devices: '',
        },
        tableData: [],
        activeName: 'first',
        text: '1111111',
        deviceid: '',
        devicedetail: {},
        topicData: [],
        thirdstart: 1,
        thirdlength: 10,
        thirdtotal: 0,
        topic: [
          {
            topic: 'thing/${ProductId}/${DevAddr}/post',
            type: 'pub',
            desc: '设备上报',
            isdef: true,
          },
          {
            topic: 'thing/${ProductId}/${DevAddr}',
            type: 'sub',
            desc: '消息下发',
            isdef: true,
          },
        ],
        thirdData: [],
        isupdate: false,
        ispushdata: true,
        timer: null,
        properties: [],
        isshowtable: false,
        productProperties: [],
        // 子设备数据
        childrendevices: {
          devicesname: '',
        },
        multipleTable: [],
        devicesTableData: [],
        childrenDeviceLength: 10,
        childrenDeviceStart: 0,
        childrenDeviceTotal: 0,
        childrenForm: {
          product: '',
          device: '',
          route: '',
        },
        isshowchild: false,
        allProudct: [],
        productDevices: [],
        ischange: false,
        ischildren: false,
        productid: '',
        dataDeviceTotal: 0,
        dataDeviceLength: 10,
        dataDeviceStart: 1,
        devicedevaddr: '',
        dirstart: 1,
        dirlength: 20,
        selectproduct: '',
      }
    },
    watch: {
      properties: {
        deep: true,
        handler(val) {},
      },
    },
    mounted() {
      this.getDeviceDetail()
    },
    // 清除定时器
    destroyed() {
      window.clearInterval(this.timer)
      this.timer = null
    },
    methods: {
      print(item) {
        console.log(item)
      },
      tabHandleClick(tab) {
        if (tab.name == 'ninth') {
          this.$router.push({
            path: '/roles/onlinetest',
            query: {
              deviceid: this.devicedevaddr,
              productid: this.productid,
            },
          })
        }
        if (tab.name == 'children') {
          this.getDevices()
        }
      },
      timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000)
        var Y = date.getFullYear() + '-'
        var M =
          (date.getMonth() + 1 < 10
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
      getDevices(start) {
        if (start == 0) {
          this.childrenDeviceStart = 0
        }
        this.devicesTableData = []

        // devices.matches(`route.${this.devicedetail.devaddr}`, '.+')
        const key = 'route.' + this.devicedetail.devaddr
        const setkey = {}
        setkey[key] = { $regex: '.+' }

        const params = {
          limit: this.childrenDeviceLength,
          skip: this.childrenDeviceStart,
          count: 'objectId',
          include: 'product',
          parentId: this.deviceId,
          where: setkey,
        }
        if (this.childrendevices.devicesname != '') {
          params.where.devaddr = this.childrendevices.devicesname
        }
        this.$queryDevice(params)
          .then((res) => {
            this.childrenDeviceTotal = res.count
            if (res.results) {
              res.results.map((items) => {
                var obj = {}
                obj.objectId = items.objectId
                obj.name = items.name
                // obj.lastOnlineTime = this.$dateFormat(
                //   this.$objGet(items, 'tag.lastOnlineTime')
                // )
                obj.status = items.status
                obj.originstatus = items.status
                obj.nodeType = items.product.nodeType
                obj.productName = items.product.name
                obj.devaddr = items.devaddr
                obj.isEnable = items.isEnable
                obj.route = items.route
                this.devicesTableData.push(obj)
              })
            }
          })
          .catch((err) => {
            console.log(err)
            this.$baseMessage('请求出错11', err.error, 3000)
          })
      },

      // 详情
      async getDeviceDetail() {
        var vm = this
        this.deviceid = this.$route.query.deviceid
        this.ischildren = this.$route.query.ischildren
        getTdDevice(this.deviceid).then((res) => {
          console.log(res, 'res')
          if (res.results.length > 0) {
            var resultes = res.results[0]
            // console.log(resultes, 'resproduct')
            // 产品
            var obj = {}
            this.productid = this.$objGet(resultes, 'product.objectId')
            this.devicedevaddr = this.$objGet(resultes, 'devaddr')
            obj.id = resultes.objectId
            obj.createdAt = utc2beijing(resultes.createdAt)
            obj.productName = this.$objGet(resultes, 'product.name')
            obj.productid = this.$objGet(resultes, 'product.objectId')
            obj.address =
              this.$objGet(resultes, 'location.latitude') +
              '，' +
              this.$objGet(resultes, 'location.longitude')
            // obj.lastOnlineTime = this.$timestampToTime(this.$objGet(resultes, 'lastOnlineTime'), true)
            // obj.updatedAt = this.$dateFormat('YYYY-mm-dd HH:MM', this.$objGet(resultes, 'updatedAt'))
            obj.ip = this.$objGet(resultes, 'ip')
            obj.basedata = JSON.stringify(resultes.basedata)
            obj.DeviceName = resultes.name
            obj.status = resultes.status
            obj.desc = this.$objGet(resultes, 'desc')
            obj.devaddr = this.$objGet(resultes, 'devaddr')
            obj.nodeType = this.$objGet(resultes, 'product.nodeType')
            obj.devType = this.$objGet(resultes, 'product.devType')
            obj.productSecret = this.$objGet(resultes, 'product.productSecret')
            const tddata = this.$objGet(resultes, 'tddata')
            // const thingTemp = this.$objGet(resultes, 'product.thing')
            vm.properties = JSON.parse(
              JSON.stringify(this.$objGet(resultes, 'product.thing.properties'))
            )
            // console.log('vm.properties', vm.properties)
            if (vm.properties) {
              vm.properties.map((items) => {
                dataobj[items['identifier']] = {
                  expectedData: [],
                  actualData: [],
                  results: [],
                  title:
                    items['dataType']['type'] === 'int' ||
                    items['dataType']['type'] === 'float' ||
                    items['dataType']['type'] === 'double'
                      ? items['name'] +
                        '(' +
                        items['dataType']['specs']['unit'] +
                        ')'
                      : items['name'],
                  data: [],
                  max: 0,
                }
              })
            } else {
              console.log('product resultes none')
            }
            this.devicedetail = obj

            if (this.$route.query.nodeType != 0 && this.ischildren == 'true') {
              this.activeName = 'children'
              this.isshowchild = true
              this.getDevices()
              const params = {}
              this.$queryProduct(params).then((res) => {
                this.allProudct = res.results
              })
            } else {
              this.ischildren = false
              this.isshowchild = true
              this.$queryProduct({}).then((res) => {
                this.allProudct = res.results
              })
            }
            // 初始化物模型数据
            this.isupdate = true
            // this.Update()
            this.updateTrue(true)
            if (resultes.product.topics) {
              this.topicData = resultes.product.topics.concat(this.topic)
            } else {
              this.topicData = this.topic
            }
          } else {
            this.$message('objectId 未返回')
          }
        })
      },
      Update() {
        function deteleObject(obj) {
          var uniques = []
          var stringify = {}
          for (var i = 0; i < obj.length; i++) {
            var keys = Object.keys(obj[i])
            keys.sort(function (a, b) {
              return Number(a) - Number(b)
            })
            var str = ''
            for (var j = 0; j < keys.length; j++) {
              str += JSON.stringify(keys[j])
              str += JSON.stringify(obj[i][keys[j]])
            }
            if (!stringify.hasOwnProperty(str)) {
              uniques.push(obj[i])
              stringify[str] = true
            }
          }
          // uniques = uniques;
          return uniques
        }

        var vm = this

        // console.log('实时刷新')

        // this.deviceid 李宏杰修改
        getTdDevice(this.deviceid) // 此方法数据渲染还需调整 todo
          .then((response) => {
            // console.log(response, "response")
            if (response) {
              if (response.results && response.results.length != 0) {
                vm.thirdData.unshift({
                  time: timestampToTime(Math.ceil(new Date().getTime() / 1000)),
                  value: JSON.stringify(response.results[0].tddata[0].data),
                })
              }
              // console.log('vm.properties1',vm.properties)
              vm.thirdtotal = vm.$objGet(vm, 'thirdData.length')
              // 动态$set,数据更新试图也一样更新，如果只是遍历的话试图回更新过慢
              if (vm.properties && response.results) {
                vm.properties.map((item, index) => {
                  for (var key in response.results[0].tddata[0].data) {
                    if (item.identifier.toLowerCase() == key.toLowerCase()) {
                      item.createdat = response.results[0].lasttime
                      //    console.log(key,vm.properties[index], response.results[0][key])
                      vm.$set(
                        vm.properties[index],
                        'value',
                        response.results[0].tddata[0].data[key]
                      )
                    }
                  }
                })

                // console.log("dataobj", dataobj)
                for (var key in dataobj) {
                  for (var item in response.results[0].tddata[0].data) {
                    if (key.toLowerCase() == item.toLowerCase()) {
                      // dataobj[key].expectedData = Array.from(new Set(dataobj[key].expectedData.push(response.results[0].tddata[0].data[item])))
                      dataobj[key].expectedData.push(
                        response.results[0].tddata[0].data[item]
                      )
                      // dataobj[key].actualData = Array.from(new Set(dataobj[key].actualData.push(response.results[0].createdAt.substring(0, 19))))
                      dataobj[key].actualData.push(
                        response.results[0].createdAt.substring(0, 19)
                      )
                      if (
                        dataobj[key].results &&
                        dataobj[key].results.length > 0
                      ) {
                        dataobj[key].results = Array.from(
                          new Set(dataobj[key].results.unshift(item))
                        )
                      }
                    }
                  }
                }
              }
            }
          })
          .catch((error) => {
            console.log('update error 清除timer', error)
            window.clearInterval(vm.timer)
            this.isupdate = false
          })
      },

      dataDetail(item) {
        this.datadialogVisible = true
        var lineChartData = {}
        for (var key in dataobj) {
          console.log('dataobj', dataobj)
          if (item.identifier == key) {
            this.datafordetail = dataobj[key].data
            lineChartData = dataobj[key]
            this.dataDeviceTotal = dataobj[key].data
          }
        }
        console.log('lineChartData===', lineChartData)
        this.lineChartData = lineChartData
      },
      // 定时器启动
      updateTrue(event) {
        this.ispushdata = false
        if (event == true) {
          this.timer = window.setInterval(() => {
            this.Update()
          }, 5000)
        } else {
          window.clearInterval(this.timer)
          this.timer = null
        }
      },
      // 实时数据的分页
      dataDeviceSizeChange(val) {
        this.dataDeviceStart = 1
      },
      dataDeviceCurrentChange(val) {
        this.dataDeviceStart = val
      },
      handleSizeChange1(val) {
        this.thirdstart = 1
        this.thirdlength = val
      },
      handleCurrentChange1(val) {
        this.thirdstart = val
      },
      // 子设备管理表格
      DevicesSelectionChange(val) {
        this.multipleTable = val
      },
      // 子设备分页
      childrenDeviceCurrentChange(val) {
        this.childrenDeviceStart = (val - 1) * this.childrenDeviceLength
        this.getDevices()
      },
      childrenDeviceSizeChange(val) {
        this.childrenDeviceLength = val
        this.getDevices()
      },
      checkProduct(val) {
        this.ischange = true
        this.selectproduct = val

        // devices.equalTo('product', val)
        // devices.notEqualTo('objectId', this.deviceid)
        // devices.notEqualTo('parentId', this.deviceid)

        const params = {
          limit: this.dirlength,
          skip: (this.dirstart - 1) * this.dirlength,
          count: 'objectId',
          where: {
            product: val,
          },
        }
        this.$queryDevice(params).then((response) => {
          if (response.results && response.results.length > 0) {
            this.productDevices = response.results
          } else {
            this.productDevices = []
          }
          this.childrenForm.device = ''
        })
      },
      deviceToDetail(row) {
        this.$router.push({
          path: '/roles/editdevices',
          query: {
            deviceid: row.objectId,
            nodeType: row.nodeType,
            ischildren: 'false',
          },
        })
      },
      loadmore() {
        this.dirstart++
        this.checkProduct(this.selectproduct)
      },
      submitDevice(formName) {
        // 添加子设备
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var route = {}
            route[this.devicedevaddr] = this.childrenForm.route
            var childrenDevicesParmas = {
              parentId: {
                __type: 'Pointer',
                className: 'Device',
                objectId: this.deviceid,
              },
              route: route,
            }
            this.$putDevice(
              this.childrenForm.device,
              childrenDevicesParmas
            ).then((resultes) => {
              if (resultes) {
                this.$message({
                  type: 'success',
                  message: '添加成功',
                })
                this.childDialog = false
                this.getDevices()
                this.$refs['childrenForm'].resetFields()
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      deleteDevcie(val) {
        Promise.all([
          this.multipleTable.map((item) => {
            const params = {
              parentId: null,
            }
            this.$putDevice(item.objectId, params).then((resultes) => {})
          }),
        ])
          .then((data) => {
            if (data && data.length != 0) {
              this.$message({
                message: '解除关联成功',
                type: 'success',
              })
              this.getDevices()
            } else {
              this.$message({
                message: '解除关联失败',
                type: 'error',
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      // 设备多个启用和禁用
      unactiveDevice(val) {
        Promise.all([
          this.multipleTable.map((item) => {
            const params = {
              isEnable: false,
            }
            this.$putDevice(item.objectId, params).then((resultes) => {})
          }),
        ])
          .then((data) => {
            if (data && data.length != 0) {
              this.$message({
                message: '禁用成功',
                type: 'success',
              })
              this.getDevices()
            } else {
              this.$message({
                message: '禁用失败',
                type: 'error',
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      activeDevice(val) {
        Promise.all([
          this.multipleTable.map((item) => {
            const params = {
              isEnable: true,
            }
            this.$putDevice(item.objectId, params).then((resultes) => {})
          }),
        ])
          .then((data) => {
            if (data && data.length != 0) {
              this.$message({
                message: '启用成功',
                type: 'success',
              })
              this.getDevices()
            } else {
              this.$message({
                message: '启用失败',
                type: 'error',
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      /* el-popover点击关闭*/
      makeSure(scope) {
        // 可以在这里执行删除数据的回调操作.......删除操作.....

        const objRoute = JSON.parse(JSON.stringify(scope.row.route))

        const routeKey = this.devicedevaddr
        // 删除key为上级设备地址值
        delete objRoute[routeKey]
        const params = {
          parentId: null,
          route: objRoute,
        }
        this.$putDevice(scope.row.objectId, params).then((response) => {
          if (response) {
            this.$message({
              type: 'success',
              message: '解除关联成功',
            })
            scope._self.$refs[`popover-${scope.$index}`].doClose()
            this.getDevices()
          }
        })
      },
      handelUpdate(event, row, index) {
        var newData1 = {}
        for (var key in row) {
          newData1[key] = row[key]
        }
        newData1.isEnable = newData1.isEnable != true
        this.devicesTableData[index] = newData1
        this.$confirm('是否修改此设备状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            var newData2 = {}
            for (var key in row) {
              newData2[key] = row[key]
            }
            newData2.isEnable = newData2.isEnable == true
            const params = {
              isEnable: newData2.isEnable,
            }
            this.$putDevice(row.objectId, params).then((resultes) => {
              this.$message({
                type: 'success',
                message: '状态修改成功',
              })
            })
            this.getDevices()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消修改',
            })
            const newData = row
            newData.isEnable = newData.isEnable != true
            this.devicesTableData[index] = newData
          })
      },
      // 查看历史数据
      /**/
      handleClick(val) {},
    },
  }
</script>
<style scoped>
  .editdevices {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
  }

  .editdevices .OFFLINE {
    color: red;
  }

  .editdevices .ACTIVE,
  .editdevices .ONLINE {
    color: green;
  }

  .mailtable .cloumn {
    font-weight: bold;
    color: #74777a;
    text-align: left;
    background: #fafafc;
    border-right: 1px solid #ebecec;
    border-bottom: 1px solid #ebecec;
  }

  .editdevices .updatedtable {
    box-sizing: border-box;
    width: 300px;
    height: 190px;
    /* letter-spacing: 1px; */
    padding-left: 20px;
    margin: 20px 20px 0 0;
    font-size: 14px;
    line-height: 40px;
    list-style: none;
    border: 1px solid #cccccc;
    /* text-align: center; */
    border-radius: 5px;
    box-shadow: 10px 10px 10px 5px grey;
  }

  .editdevices .buttonactive {
    color: white;
    background-color: #409eff;
  }

  .mailtable td {
    box-sizing: border-box;
    padding: 15px;
    font-size: 14px;
    color: #74777a;
    text-align: left;
    border: 1px solid #ebecec;
  }

  .childrendevices {
    box-sizing: border-box;
    width: 100%;
    height: auto;
    padding: 10px;
    background: white;
  }
</style>
<style>
  .editdevices .el-tabs__item {
    height: 50px;
    margin: 0;
    margin-top: 20px;
    font-family: auto;
    font-size: 16px;
    line-height: 50px;
  }

  .editdevices .el-tabs__content {
    box-sizing: border-box;
    padding: 20px;
    background: #f4f4f4;
  }

  .editdevices .childrendevices .el-form-item:last-child {
    float: right;
  }

  .editdevices .childdialog .el-form-item__content {
    clear: both;
  }

  .editdevices .childdialog .el-form-item__content .el-select {
    width: 100%;
  }

  .fontSize {
    font-size: 12px;
    color: #666666;
  }

  .editdevices .svg-icon {
    width: 3rem;
    height: 3rem;
    margin-top: 5px;
  }

  .stla {
    font-family: fantasy;
    font-size: 25px;
    color: #666666;
    text-align: center;
  }

  .ht7 {
    height: 70px;
  }
</style>
