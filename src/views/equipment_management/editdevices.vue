<template>
  <div class="editdevices">
    <div class="editheader">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard/devicelist' }">
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
          <info :devicedetail="deviceInfo" />
        </el-tab-pane>
        <el-tab-pane
          :label="$translateTitle('equipment.real time data')"
          name="first1"
        >
          <vab-query-form>
            <vab-query-form-left-panel>
              <span>
                {{ $translateTitle('equipment.realtimerefresh') }}
              </span>
              <el-switch
                v-model="isupdate"
                active-color="#13ce66"
                inactive-color="#cccccc"
                @change="updateTrue($event)"
              />
            </vab-query-form-left-panel>
            <vab-query-form-right-panel>
              <vab-help
                trigger="click"
                src="https://tech.iotn2n.com/w/docs/details?id=6"
                title="产品下的所有设备都会继承该产品的 Topic 类"
              />
            </vab-query-form-right-panel>
          </vab-query-form>
          <div>
            <!--            <div style="text-align: right">-->
            <!--              <div style="float: left">-->
            <!--                <span>-->
            <!--                  {{ $translateTitle('equipment.realtimerefresh') }}-->
            <!--                </span>-->
            <!--                <el-switch-->
            <!--                  v-model="isupdate"-->
            <!--                  active-color="#13ce66"-->
            <!--                  inactive-color="#cccccc"-->
            <!--                  @change="updateTrue($event)"-->
            <!--                />-->
            <!--              </div>-->

            <!--              &lt;!&ndash; 右上角(图表,表格)的按钮 &ndash;&gt;-->
            <!--              &lt;!&ndash;              <el-button-group>&ndash;&gt;-->
            <!--              &lt;!&ndash;                <el-button&ndash;&gt;-->
            <!--              &lt;!&ndash;                  type="primary"&ndash;&gt;-->
            <!--              &lt;!&ndash;                  plain&ndash;&gt;-->
            <!--              &lt;!&ndash;                  size="small"&ndash;&gt;-->
            <!--              &lt;!&ndash;                  @click="buttonactive = 1"&ndash;&gt;-->
            <!--              &lt;!&ndash;                >&ndash;&gt;-->
            <!--              &lt;!&ndash;                  {{ $translateTitle('equipment.chart') }}&ndash;&gt;-->
            <!--              &lt;!&ndash;                </el-button>&ndash;&gt;-->
            <!--              &lt;!&ndash;                <el-button&ndash;&gt;-->
            <!--              &lt;!&ndash;                  type="primary"&ndash;&gt;-->
            <!--              &lt;!&ndash;                  plain&ndash;&gt;-->
            <!--              &lt;!&ndash;                  size="small"&ndash;&gt;-->
            <!--              &lt;!&ndash;                  @click="buttonactive = 2"&ndash;&gt;-->
            <!--              &lt;!&ndash;                >&ndash;&gt;-->
            <!--              &lt;!&ndash;                  {{ $translateTitle('equipment.table') }}&ndash;&gt;-->
            <!--              &lt;!&ndash;                </el-button>&ndash;&gt;-->
            <!--              &lt;!&ndash;                <el-button&ndash;&gt;-->
            <!--              &lt;!&ndash;                  type="primary"&ndash;&gt;-->
            <!--              &lt;!&ndash;                  plain&ndash;&gt;-->
            <!--              &lt;!&ndash;                  size="small"&ndash;&gt;-->
            <!--              &lt;!&ndash;                  @click="buttonactive = 3"&ndash;&gt;-->
            <!--              &lt;!&ndash;                >&ndash;&gt;-->
            <!--              &lt;!&ndash;                  {{ $translateTitle('equipment.lists') }}&ndash;&gt;-->
            <!--              &lt;!&ndash;                </el-button>&ndash;&gt;-->
            <!--              &lt;!&ndash;              </el-button-group>&ndash;&gt;-->
            <!--            </div>-->

            <div class="thirdtb">
              <!--运行状态卡片-->
              <el-row :key="thirdtbKey">
                <el-col
                  v-for="(value, key, index) in machinelist"
                  :key="index"
                  :span="24"
                >
                  <el-card :body-style="{ padding: '0px' }" shadow="never">
                    <div style="padding: 14px">
                      <span style="font-size: 30px">{{ key }}</span>
                      <ul
                        v-if="value.length"
                        style="display: flex; flex-wrap: wrap"
                      >
                        <li
                          v-for="(item, index) in value"
                          :key="index"
                          class="updatedtable"
                        >
                          <div style="height: 70px">
                            <span style="font-size: 16px">{{ item.name }}</span>
                            <span
                              style="
                                float: right;
                                margin-top: 10px;
                                margin-right: 15px;
                              "
                            >
                              <el-image
                                style="width: 60px; height: 60px"
                                :src="item.imgurl"
                              >
                                <div
                                  slot="error"
                                  class="image-slot"
                                  style="width: 60px; height: 60px"
                                >
                                  <i class="el-icon-picture-outline"></i>
                                </div>
                              </el-image>
                            </span>
                          </div>
                          <div class="stla">
                            <span :title="item.number | filterVal">
                              {{ item.number | filterVal }}
                            </span>
                            <span v-if="item.unit" :title="item.unit">
                              {{ item.unit }}
                            </span>
                          </div>
                          <div class="ta">
                            <span class="fontSize">
                              {{
                                $translateTitle('equipment.updatetime') + ':'
                              }}
                            </span>
                            <span class="fontSize" @click="print(machinelist)">
                              {{ item.time }}
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
            <!--            <div v-else>-->
            <!--              <a-table-->
            <!--                v-if="properties.length"-->
            <!--                size="middle"-->
            <!--                align="center"-->
            <!--                :columns="columns"-->
            <!--                :data-source="properties"-->
            <!--                bordered-->
            <!--              >-->
            <!--                <img-->
            <!--                  slot="imgurl"-->
            <!--                  slot-scope="imgurl"-->
            <!--                  style="width: 100px; heigth: 100px"-->
            <!--                  :src="-->
            <!--                    imgurl-->
            <!--                      ? imgurl-->
            <!--                      : 'https://i.loli.net/2021/07/30/J5byW634csj7okH.png'-->
            <!--                  "-->
            <!--                />-->
            <!--              </a-table>-->
            <!--            </div>-->
            <!--            <div v-else-if="buttonactive == 2" class="thirdtable">-->
            <!--              &lt;!&ndash;运行状态表格&ndash;&gt;-->

            <!--              <el-table-->
            <!--                :data="-->
            <!--                  thirdData.slice(-->
            <!--                    (thirdstart - 1) * thirdlength,-->
            <!--                    thirdstart * thirdlength-->
            <!--                  )-->
            <!--                "-->
            <!--                style="width: 100%; margin-top: 10px; text-align: center"-->
            <!--              >-->
            <!--                <el-table-column-->
            <!--                  :label="$translateTitle('equipment.serialnumber')"-->
            <!--                  align="center"-->
            <!--                  type="index"-->
            <!--                  width="100"-->
            <!--                />-->

            <!--                <el-table-column-->
            <!--                  :label="$translateTitle('equipment.value')"-->
            <!--                  prop="value"-->
            <!--                  align="center"-->
            <!--                  show-overflow-tooltip-->
            <!--                />-->
            <!--                <el-table-column-->
            <!--                  :label="$translateTitle('equipment.time')"-->
            <!--                  prop="time"-->
            <!--                  align="center"-->
            <!--                  width="300"-->
            <!--                />-->
            <!--              </el-table>-->
            <!--              <el-pagination-->
            <!--                :page-sizes="[10, 25, 50, 100]"-->
            <!--                :page-size="thirdlength"-->
            <!--                :total="thirdtotal"-->
            <!--                background-->
            <!--                layout="total, sizes, prev, pager, next, jumper"-->
            <!--                style="margin-top: 20px"-->
            <!--                @size-change="handleSizeChange1"-->
            <!--                @current-change="handleCurrentChange1"-->
            <!--              />-->
            <!--            </div>-->
          </div>
        </el-tab-pane>
        <!-- 历史数据 -->
        <el-tab-pane
          :label="$translateTitle('equipment.historical data')"
          name="third"
        >
          <div
            style="box-sizing: border-box; padding: 10px; background: #ffffff"
          >
            <!-- <h4>设备信息</h4> -->
            <div class="chartsinfo">
              <div
                class="queryHeader"
                :style="{ height: Device == 'desktop' ? '50px' : '240px' }"
              >
                <vab-query-form-top-panel>
                  <el-form
                    :inline="true"
                    :model="queryForm"
                    :label-width="Device == 'desktop' ? '80px' : '70px'"
                    @submit.native.prevent
                  >
                    <el-form-item
                      :label="$translateTitle('developer.startTime')"
                    >
                      <el-date-picker
                        v-model="params.startTime"
                        type="datetime"
                        align="right"
                        size="mini"
                        style="width: 83%"
                        :placeholder="$translateTitle('developer.startTime')"
                        :picker-options="pickerOptionsDay"
                      />
                    </el-form-item>
                    <el-form-item :label="$translateTitle('developer.EndTime')">
                      <el-date-picker
                        v-model="params.endTime"
                        style="width: 83%"
                        size="mini"
                        type="datetime"
                        align="right"
                        :clearable="false"
                        :placeholder="$translateTitle('developer.EndTime')"
                        :picker-options="pickerOptionsDay"
                      />
                    </el-form-item>
                    <el-form-item :label="$translateTitle('developer.type')">
                      <el-select
                        v-model="params.style"
                        size="mini"
                        style="width: 90px"
                        placeholder="请选择"
                        @change="toggleChart"
                      >
                        <el-option
                          v-for="(item, index) in chartType"
                          :key="index"
                          :label="item.name"
                          :value="item.type"
                          :disabled="disabledChart.indexOf(item.type) != -1"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item
                      :label="$translateTitle('developer.interval')"
                    >
                      <el-input-number
                        v-model="params.number"
                        size="mini"
                        style="width: 100px"
                        :min="1"
                        placeholder="请输入内容"
                      />
                      <el-select
                        v-model="params.interval"
                        size="mini"
                        placeholder="请选择"
                        style="width: 70px"
                      >
                        <el-option
                          v-for="(item, index) in interval"
                          :key="index"
                          :label="item.name"
                          :value="item.type"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item
                      :label="$translateTitle('developer.function')"
                    >
                      <el-select
                        v-model="params._function"
                        size="mini"
                        style="width: 100px"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="(item, index) in functionarr"
                          :key="index"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                      <el-button
                        size="mini"
                        type="primary"
                        :disabled="queryFlag"
                        icon="el-icon-search"
                        @click="queryChart"
                      >
                        {{ $translateTitle('developer.search') }}
                      </el-button>
                    </el-form-item>
                  </el-form>
                </vab-query-form-top-panel>
              </div>
              <div :key="chartKey" class="chartsmain">
                <vabChart
                  ref="charts"
                  :type="params.style"
                  :extend="chartExtend"
                  :data="chartData"
                  :set-option-opts="false"
                  :settings="chartSettings"
                  :data-zoom="chartDataZoom"
                  :toolbox="toolbox"
                  :loading="loading"
                  :after-config="afterConfig"
                  :data-empty="dataEmpty"
                />
              </div>
              <div class="chartOther">
                <el-row :gutter="20">
                  <el-col
                    v-for="(item, index) in chartData.child"
                    v-show="item.columns[1] != '日期'"
                    :key="index"
                    :xs="xs"
                    :sm="sm"
                    :md="md"
                    :xl="xl"
                  >
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span>{{ item.columns[1] }} : {{ item.unit }}</span>

                        <el-button-group
                          style="float: right; padding: 3px 0"
                          type="text"
                        >
                          <el-button icon="el-icon-warning-outline" />
                          <el-button
                            icon="el-icon-full-screen"
                            @click="toggleCardRow(index, xs, sm, md, xl)"
                          />
                        </el-button-group>
                      </div>

                      <vabChart
                        ref="charts"
                        :type="params.style"
                        height="300px"
                        :extend="chartExtend"
                        :legend-visible="false"
                        :data="chartData.child[index]"
                        :set-option-opts="false"
                        :settings="chartSettings"
                        :data-zoom="chartDataZoom"
                        :toolbox="toolbox"
                        :loading="loading"
                        :after-config="afterConfig"
                        :data-empty="dataEmpty"
                      />
                    </el-card>
                  </el-col>
                  <el-col v-show="!chartData.child" :span="24">
                    <vab-empty />
                  </el-col>
                </el-row>
              </div>
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
          ></div>
        </el-tab-pane>

        <!--         <el-tab-pane label="事件管理" name="fixth">事件管理</el-tab-pane>
                <el-tab-pane label="服务调用" name="sixth">服务调用</el-tab-pane>
                <el-tab-pane label="设备影子" name="seventh">设备影子</el-tab-pane>
        <el-tab-pane label="日志服务" name="eighth">日志服务</el-tab-pane>-->
        <!--        <el-tab-pane :label="$translateTitle('route.在线调试')" name="ninth" />-->
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
            :append-to-body="true"
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
        <el-tab-pane
          v-if="isshowchild"
          :label="$translateTitle('device.Equipment Directive')"
          name="instruct"
        >
          <Instruct :product-id="productid" :devices-id="deviceid" />
        </el-tab-pane>
        <el-tab-pane
          :label="$translateTitle('device.Equipment message')"
          name="task"
        >
          <scene-log
            v-show="activeName == 'task'"
            :name="activeName"
            :device-info="deviceInfo"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="$translateTitle('device.Equipment log')"
          name="trace"
        >
          <device-log
            v-show="activeName == 'trace'"
            :is-device-info="true"
            :productid="productId"
            :devaddr="devicedevaddr"
          />
        </el-tab-pane>

        <el-tab-pane
          :label="$translateTitle('device.Equipment alert settings')"
          name="alert"
        >
          <vab-empty />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import info from '@/components/Device/info'
  import deviceLog from '@/views/Logs/device'
  import { requireModule } from '@/utils/file'
  const columns = [
    {
      title: '图片',
      width: 120,
      dataIndex: 'imgurl',
      fixed: 'left',
      key: 'imgurl',
      scopedSlots: { customRender: 'imgurl' },
    },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '值', dataIndex: 'number', key: 'number' },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
  ]
  import { mapGetters } from 'vuex'
  import {
    getTdDevice,
    getDabDevice,
    getCardDevice,
    getDevice,
    queryDevice,
  } from '@/api/Device/index.js'
  import { utc2beijing, timestampToTime } from '@/utils/index'
  import Instruct from '../devicemanage/instruct_manage'
  import chartType from '@/api/Mock/Chart'
  var dataobj = {}
  export default {
    components: {
      Instruct,
      info,
      deviceLog,
      ...requireModule(require.context('./component', true, /\.vue$/)),
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
      this.chartExtend = {
        series: {
          barMaxWidth: 35,
        },
        dataZoom: [
          // 鼠标滚轮滚动
          // {
          //   type: 'inside',
          // },
          // 坐标轴滚动
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            left: '9%',
            bottom: -5,
            start: 10,
            end: 90, //初始化滚动条
          },
        ],
        grid: {
          right: 40,
        },
      }
      this.toolbox = {
        orient: 'vertical',
        right: -5,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          magicType: {
            type: [
              'line',
              'bar',
              'histogram',
              'pie',
              'ring',
              'waterfall',
              'funnel',
              'radar',
              'heatmap',
              'scatter',
              'candle',
              'stack',
            ],
          },
          dataView: { show: true, readOnly: false },
          saveAsImage: { show: true },
          restore: { show: true },
        },
      }
      return {
        chartKey: moment(new Date()).valueOf(),
        machinelist: {},
        thirdtbKey: moment(new Date()).valueOf(),
        deviceInfo: {},
        columns,
        productId: this.$route.query.productid,
        activeNames: ['1'],
        queryForm: {
          account: '',
          searchDate: '',
          pageNo: 1,
          pageSize: 20,
        },
        buttonactive: 1,
        loading: true,
        xl: 6,
        xs: 24,
        sm: 24,
        md: 12,
        dataEmpty: true,
        chartDataZoom: [{ type: 'slider' }],
        pickerOptions: {
          shortcuts: [
            {
              text: this.$translateTitle('developer.LastWeek'),
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: this.$translateTitle('developer.LastMonth'),
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: this.$translateTitle('developer.LastThreeMonths'),
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              },
            },
          ],
        },
        pickerOptionsDay: {
          shortcuts: [
            {
              text: this.$translateTitle('developer.today'),
              onClick(picker) {
                picker.$emit('pick', new Date())
              },
            },
            {
              text: this.$translateTitle('developer.yesterday'),
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              },
            },
            {
              text: this.$translateTitle('developer.A week ago'),
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              },
            },
          ],
        },
        chartData: {
          identifier: [],
          columns: [],
          rows: [],
        },
        params: {
          _function: 'last',
          style: '',
          number: 1,
          interval: 'h',
          datetimerange: '',
          keys: '*',
          limit: 100,
          endTime: new Date(),
          startTime: new Date().getTime() - 3600 * 1000 * 24 * 7,
        },
        interval: [
          {
            type: 'y',
            name: '年',
          },
          {
            type: 'n',
            name: '月',
          },
          {
            type: 'w',
            name: '周',
          },
          {
            type: 'd',
            name: '日',
          },
          {
            type: 'h',
            name: '时',
          },
          {
            type: 'm',
            name: '分',
          },
          {
            type: 's',
            name: '秒',
          },
          {
            type: 'a',
            name: '毫秒',
          },
          {
            type: 'u',
            name: '微秒',
          },
        ],
        functionarr: [
          'count',
          'avg',
          'sum',
          'stddev',
          'min',
          'max',
          'first',
          'last',
        ],
        disabledChart: [
          'map',
          'sankey',
          'wordcloud',
          'liquidfill',
          'tree',
          'gauge',
        ],
        chartType: chartType,
        options: [
          {
            value: '选项1',
            label: '黄金糕',
          },
          {
            value: '选项2',
            label: '双皮奶',
          },
          {
            value: '选项3',
            label: '蚵仔煎',
          },
          {
            value: '选项4',
            label: '龙须面',
          },
          {
            value: '选项5',
            label: '北京烤鸭',
          },
        ],
        value: '',
        chartSettings: {},
        queryFlag: true,
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
        thirdDatas: [],
        isupdate: false,
        ispushdata: true,
        timer: null,
        isshowtable: false,
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
        watchNum: 0,
      }
    },
    computed: {
      ...mapGetters({
        Device: 'settings/device',
      }),
    },
    watch: {
      machinelist: {
        deep: true,
        handler(val) {},
      },
      sm(v) {
        this.$nextTick((_) => {
          this.resizeTheChart()
          setTimeout(() => {
            this.loading = false
          }, 2000)
        })
      },
    },
    mounted() {
      this.params.style = this.chartType[0].type
      console.log(' this.params.style', this.params.style)
      if (this.$route.query.deviceid) {
        const deviceid = this.$route.query.deviceid
        this.getDeviceDetail(deviceid)
        this.initChart()
        this.getDeviceInfo(deviceid)
        window.addEventListener('resize', this.resizeTheChart)
      }
    },
    // 清除定时器
    destroyed() {
      window.clearInterval(this.timer)
      this.timer = null
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeTheChart)
    },
    methods: {
      async getDeviceInfo(deviceid) {
        const resultes = await getDevice(deviceid)
        var ProductId = ''
        resultes?.product?.objectId
          ? (ProductId = resultes.product.objectId)
          : (ProductId = '')
        const DevAddr = resultes.devaddr
        console.log('ProductId', ProductId)
        let _toppic = [
          {
            topic: `thing/${ProductId}/${DevAddr}/post`,
            type: 'pub',
            desc: '设备上报',
            isdef: true,
          },
          {
            topic: `thing/${ProductId}/${DevAddr}`,
            type: 'sub',
            desc: '消息下发',
            isdef: true,
          },
        ]
        if (resultes.product.topics) {
          resultes.topicData = resultes.product.topics.concat(_toppic)
        } else {
          resultes.topicData = _toppic
        }
        this.deviceInfo = resultes
      },
      toggleChart(e) {
        this.chartKey = moment(new Date()).valueOf()
        this.loading = false
        console.log(e)
        this.chartExtend = {}
        this.chartDataZoom = []
        let type = ['funnel', 'radar', 'radar']
        if (type.indexOf(e) != -1) {
          this.chartExtend = {}
          this.chartDataZoom = []
        } else {
          this.chartExtend = {
            series: {
              barMaxWidth: 35,
            },
            dataZoom: [
              // 鼠标滚轮滚动
              // {
              //   type: 'inside',
              // },
              // 坐标轴滚动
              {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                left: '9%',
                bottom: -5,
                start: 10,
                end: 90, //初始化滚动条
              },
            ],
            grid: {
              right: 40,
            },
            yAxis: [
              {
                type: 'value',
                axisLabel: {
                  formatter: '{value} %',
                },
              },
            ],
          }
          this.chartDataZoom = [{ type: 'slider' }]
        }
        this.resizeTheChart()
      },
      resizeTheChart() {
        let charts = this.$refs[`charts`]
        console.log('charts', charts)
        if (charts instanceof Array) {
          charts.forEach((chart) => {
            chart.$children[0].resize()
          })
          console.log('重绘完成', charts)
        } else {
          charts.$children[0].resize()
        }
      },
      toggleCardRow(index, xs, sm, md, xl) {
        sm == 24 ? (this.sm = 12) : (this.sm = 24)
        md == 12 ? (this.md = 24) : (this.md = 12)
        xl == 6 ? (this.xl = 12) : (this.xl = 6)
        this.loading = true
      },
      afterConfig(options) {
        options.tooltip.showDelay = 500
        return options
      },
      initChart() {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        this.params.datetimerange = [start, end]
        this.queryFlag = false
        this.$queryProduct({}).then((res) => {
          this.allProudct = res.results
        })
      },
      async queryChart() {
        this.chartData = {
          identifier: [],
          columns: [],
          rows: [],
        }
        if (this.params.startTime && this.params.endTime) {
          this.$baseColorfullLoading(
            1,
            this.$translateTitle('home.messag_loding')
          )
          let deviceid = this.$route.query.deviceid
          // let endTime = moment(this.params.datetimerange[1]).valueOf()
          // let startTime = moment(this.params.datetimerange[0]).valueOf()
          console.log('endTime', endTime)
          console.log('startTime', startTime)
          // const limit = moment(endTime).diff(moment(startTime), 'days')
          const {
            interval,
            keys,
            limit,
            number,
            style,
            _function,
            startTime,
            endTime,
          } = this.params
          let params = {
            starttime: moment(startTime).valueOf(),
            endtime: moment(endTime).valueOf(),
            interval: number + interval,
            keys: keys,
            limit: limit,
            function: _function,
            style: style,
          }
          await getDabDevice(deviceid, params)
            .then((res) => {
              this.$baseColorfullLoading().close()
              console.log(res, 'res charts')
              if (res?.chartData) {
                const { chartData = {} } = res
                this.chartData = chartData
                this.$nextTick(() => {
                  setTimeout(() => {
                    this.loading = true
                    this.toggleChart('line')
                  }, 1000)
                })
              }
              console.log('this.chartData', this.chartData)
              this.loading = false
              this.dataEmpty = false
            })
            .catch((e) => {
              console.log(e)
              this.loading = false
              this.$baseColorfullLoading().close()
            })
        } else {
          this.$message.error(
            this.$translateTitle('developer.Please select the query time')
          )
        }
      },
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
        } else if (tab.name == 'children') {
          this.getDevices()
        } else if (tab.name == 'third') {
          this.queryChart()
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
      async getDeviceDetail(deviceid) {
        const vm = this
        vm.deviceid = deviceid
        vm.ischildren = vm.$route.query.ischildren
        const params = {
          limit: 1,
          count: 'objectId',
          include: 'product',
          where: { objectId: deviceid },
        }
        queryDevice(params).then((res) => {
          console.log(res, 'res')
          if (res.results.length > 0) {
            // console.log(resultes, 'resproduct')
            // 产品
            const resultes = res.results[0]
            var obj = {}
            vm.productid = vm.$objGet(resultes, 'product.objectId')
            vm.devicedevaddr = vm.$objGet(resultes, 'devaddr')
            obj.id = resultes.objectId
            obj.createdAt = utc2beijing(resultes.createdAt)
            obj.productName = vm.$objGet(resultes, 'product.name')
            obj.productid = vm.$objGet(resultes, 'product.objectId')
            // obj.lastOnlineTime = this.$timestampToTime(this.$objGet(resultes, 'lastOnlineTime'), true)
            // obj.updatedAt = this.$dateFormat('YYYY-mm-dd HH:MM', this.$objGet(resultes, 'updatedAt'))
            obj.ip = vm.$objGet(resultes, 'ip')
            obj.basedata = JSON.stringify(resultes.basedata)
            obj.DeviceName = resultes.name
            obj.status = resultes.status
            obj.desc = vm.$objGet(resultes, 'desc')
            obj.devaddr = vm.$objGet(resultes, 'devaddr')
            obj.nodeType = vm.$objGet(resultes, 'product.nodeType')
            obj.devType = vm.$objGet(resultes, 'product.devType')
            obj.productSecret = vm.$objGet(resultes, 'product.productSecret')
            obj.address =
              vm.$objGet(resultes, 'detail.address') ||
              vm.$objGet(resultes, 'location.latitude') +
                '，' +
                vm.$objGet(resultes, 'location.longitude')
            const tddata = vm.$objGet(resultes, 'tddata')
            // const thingTemp = this.$objGet(resultes, 'product.thing')
            let resData = JSON.parse(
              JSON.stringify(vm.$objGet(resultes, 'product.thing.properties'))
            )
            this.Update()
            let array = []
            resData.forEach((item) => {
              if (item.devicetype) {
                array.push(item.devicetype)
              }
            })
            array = _.uniqBy(array)
            let machine = {}
            array.forEach((item) => {
              let arr = []
              resData.forEach((item1) => {
                if (item == item1.devicetype) {
                  arr.push(item1)
                }
              })
              machine[item] = arr
            })
            vm.machinelist = machine
            vm.thirdtbKey = moment(new Date()).valueOf()
            console.log('this.machinelist', vm.machinelist)
            vm.devicedetail = obj
            if (vm.$route.query.nodeType != 0 && vm.ischildren == 'true') {
              vm.activeName = 'children'
              vm.isshowchild = true
              vm.getDevices()
              const params = {}
            } else {
              vm.ischildren = false
              vm.isshowchild = true
            }
            // 初始化物模型数据
            vm.isupdate = true
            // this.Update()
            vm.updateTrue(true)
            if (resultes.product.topics) {
              vm.topicData = resultes.product.topics.concat(vm.topic)
            } else {
              vm.topicData = vm.topic
            }
          } else {
            vm.$message('objectId 未返回')
          }
        })
      },
      Update() {
        var vm = this
        console.log('实时刷新')
        getCardDevice(vm.deviceid)
          .then((response) => {
            vm.machinelist = {}
            if (response?.data) {
              let array = []
              const resData = response.data
              resData.forEach((item) => {
                if (item.devicetype) {
                  array.push(item.devicetype)
                }
              })
              array = _.uniqBy(array)
              let machine = {}
              array.forEach((item) => {
                let arr = []
                resData.forEach((item1) => {
                  if (item == item1.devicetype) {
                    arr.push(item1)
                  }
                })
                machine[item] = arr
              })
              vm.machinelist = machine
              vm.thirdtbKey = moment(new Date()).valueOf()
              console.log('this.machinelist', vm.machinelist)
            }
          })
          .catch((error) => {
            console.log('update error 清除timer', error)
            window.clearInterval(vm.timer)
            this.isupdate = false
          })
      },
      // 定时器启动
      updateTrue(event) {
        this.ispushdata = false
        if (event == true) {
          this.timer = window.setInterval(() => {
            this.Update()
          }, 10000)
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
        console.log('row', row)
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
    },
  }
</script>
<style scoped lang="scss">
  ::v-deep {
    .el-icon-time {
      display: none;
    }
    .el-date-editor--datetime {
      input {
        padding: 0 10px;
      }
    }
    .el-card {
      overflow: hidden;
      color: #303133;
      background-color: #f4f4f4 !important;
      border: 0px solid #ebeef5;
      border-radius: 0px;
      transition: 0.3s;
    }
  }
  .chartsinfo {
    margin-top: 15px;
    .chartsmain {
      margin: 30px 0;
    }
  }
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
    width: 280px;
    height: 180px;
    /* letter-spacing: 1px; */
    padding-left: 20px;
    margin: 20px 20px 0 0;
    font-size: 50px;
    line-height: 40px;
    list-style: none;
    border: 1px solid #c0c4cc;
    /* text-align: center; */
    border-radius: 5px;
    box-shadow: 10px 10px 10px 5px #f4f4f4;
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
    overflow: hidden;
    font-family: fantasy;
    font-size: 25px;
    color: #666666;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ht7 {
    height: 70px;
  }
</style>
