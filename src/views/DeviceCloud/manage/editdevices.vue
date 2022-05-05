<!--eslint-disable-->
<template>
  <div class="editdevices">
    <div>
      <el-tabs v-model="activeName" @tab-click="tabHandleClick">
        <el-tab-pane
          :label="$translateTitle('equipment.deviceinformation')"
          name="first"
        >
          <info :devicedetail="deviceInfo" />
          <el-card>
            <dgiot-baidu-map
              ref="map"
              :bmLabel="bmLabel"
              :label="mapLabel"
              :navShow="true"
              :scaleShow="true"
              :mapCenter="mapLabel.position"
            />
          </el-card>
        </el-tab-pane>
        <el-tab-pane
          :label="$translateTitle('equipment.realTime data')"
          name="first1"
        >
          <div v-loading="loading">
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
                                :src="item.imgurl"
                                style="width: 60px; height: 60px"
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
          </div>
        </el-tab-pane>
        <!-- 历史数据 -->
        <el-tab-pane
          :label="$translateTitle('equipment.historical data')"
          name="third"
        >
          <div
            v-loading="loading"
            style="box-sizing: border-box; padding: 10px; background: #ffffff"
          >
            <!-- <h4>设备信息</h4> -->
            <div class="chartsinfo">
              <div
                :style="{ height: Device == 'desktop' ? '50px' : '240px' }"
                class="queryHeader"
              >
                <dgiot-query-form-top-panel>
                  <el-form
                    :inline="true"
                    :label-width="Device == 'desktop' ? '80px' : '70px'"
                    :model="queryForm"
                    @submit.native.prevent
                  >
                    <el-form-item
                      :label="$translateTitle('developer.startTime')"
                    >
                      <el-date-picker
                        v-model="params.startTime"
                        :picker-options="pickerOptionsDay"
                        :placeholder="$translateTitle('developer.startTime')"
                        align="right"
                        size="mini"
                        style="width: 83%"
                        type="datetime"
                      />
                    </el-form-item>
                    <el-form-item :label="$translateTitle('developer.EndTime')">
                      <el-date-picker
                        v-model="params.endTime"
                        :clearable="false"
                        :picker-options="pickerOptionsDay"
                        :placeholder="$translateTitle('developer.EndTime')"
                        align="right"
                        size="mini"
                        style="width: 83%"
                        type="datetime"
                      />
                    </el-form-item>
                    <el-form-item :label="$translateTitle('developer.type')">
                      <el-select
                        v-model="params.style"
                        placeholder="请选择"
                        size="mini"
                        style="width: 90px"
                        @change="toggleChart"
                      >
                        <el-option
                          v-for="(item, index) in chartType"
                          :key="index"
                          :disabled="disabledChart.indexOf(item.type) != -1"
                          :label="item.name"
                          :value="item.type"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item
                      :label="$translateTitle('developer.interval')"
                    >
                      <el-input-number
                        v-model="params.number"
                        :min="1"
                        placeholder="请输入内容"
                        size="mini"
                        style="width: 100px"
                      />
                      <el-select
                        v-model="params.interval"
                        placeholder="请选择"
                        size="mini"
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
                        placeholder="请选择"
                        size="mini"
                        style="width: 100px"
                      >
                        <el-option
                          v-for="(item, index) in functionarr"
                          :key="index"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                      <el-button
                        :disabled="queryFlag"
                        icon="el-icon-search"
                        size="mini"
                        type="primary"
                        @click="queryChart"
                      >
                        {{ $translateTitle('developer.search') }}
                      </el-button>
                    </el-form-item>
                  </el-form>
                </dgiot-query-form-top-panel>
              </div>
              <div :key="chartKey" class="chartsmain">
                <dgiotChart
                  ref="charts"
                  :after-config="afterConfig"
                  :data="chartData"
                  :data-empty="dataEmpty"
                  :data-zoom="chartDataZoom"
                  :extend="chartExtend"
                  :set-option-opts="false"
                  :settings="chartSettings"
                  :toolbox="toolbox"
                  :type="params.style"
                />
              </div>
              <div class="chartOther">
                <el-row :gutter="20">
                  <el-col
                    v-for="(item, index) in chartData.child"
                    v-show="item.columns[1] != '日期'"
                    :key="index"
                    :md="md"
                    :sm="sm"
                    :xl="xl"
                    :xs="xs"
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

                      <dgiotChart
                        ref="charts"
                        :after-config="afterConfig"
                        :data="chartData.child[index]"
                        :data-empty="dataEmpty"
                        :data-zoom="chartDataZoom"
                        :extend="chartExtend"
                        :legend-visible="false"
                        :set-option-opts="false"
                        :settings="chartSettings"
                        :toolbox="toolbox"
                        :type="params.style"
                        height="300px"
                      />
                    </el-card>
                  </el-col>
                  <el-col v-show="!chartData.child" :span="24">
                    <dgiot-empty />
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
          <div class="childrendevices" v-loading="loading">
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
                  :placeholder="$translateTitle('equipment.devicenumber')"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click.native="getDevices(0)">
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
                <el-button plain type="info" @click.native="getDevices(0)">
                  {{ $translateTitle('equipment.Refresh') }}
                </el-button>
                <!-- 添加子设备按钮  -->
                <el-button type="primary" @click.native="childDialog = true">
                  {{ $translateTitle('equipment.addchilddevice') }}
                </el-button>
              </el-form-item>
            </el-form>
            <div class="devicetable">
              <el-table
                ref="filterTable"
                :data="devicesTableData"
                style="width: 100%; margin-top: 20px; text-align: center"
                :height="$baseTableHeight(0) - 120"
                @selection-change="DevicesSelectionChange"
              >
                <el-table-column align="center" type="selection" width="55" />
                <el-table-column
                  :label="$translateTitle('equipment.devicenumber')"
                  align="center"
                  width="170"
                >
                  <template #default="{ row }">
                    <span>{{ row.devaddr }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$translateTitle('equipment.devicename')"
                  align="center"
                >
                  <template #default="{ row }">
                    <span>{{ row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$translateTitle('equipment.state')"
                  align="center"
                >
                  <template #default="{ row }">
                    <span :class="row.status">
                      {{ row.status }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="子网地址" width="165">
                  <template #default="{ row }">
                    <span>
                      {{
                        row.route == undefined
                          ? ''
                          : row.route[deviceInfo.devaddr]
                      }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$translateTitle('equipment.product')"
                  align="center"
                >
                  <template #default="{ row }">
                    <span type="success">{{ row.productName }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  :label="
                    $translateTitle('developer.prohibit') +
                    '/' +
                    $translateTitle('developer.enable')
                  "
                  align="center"
                >
                  <template #default="{ row, $index }">
                    <el-switch
                      v-model="row.isEnable"
                      active-color="#5eb058"
                      inactive-color="#cccccc"
                      @change="handelUpdate($event, row.$index)"
                    />
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$translateTitle('equipment.lastonlinetime')"
                  align="center"
                >
                  <template #default="{ row }">
                    <span v-if="row.lastOnlineTime">
                      {{ timestampToTime(row.lastOnlineTime) }}
                    </span>
                    <span v-else>—</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$translateTitle('developer.operation')"
                  align="center"
                  width="220"
                >
                  <template slot-scope="{ row, $index }">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="deviceToDetail(row)"
                    >
                      {{ $translateTitle("equipment.see") }}
                    </el-button>

                    <el-button
                      size="mini"
                      type="primary"
                      @click="makeSure(row, $index)"
                    >
                      {{ $translateTitle("equipment.RelievingAssociation") }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="elpagination" style="margin-top: 20px">
              <el-pagination
                :page-size="childrenDeviceLength"
                :page-sizes="[10, 20, 30, 50]"
                :total="childrenDeviceTotal"
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="childrenDeviceCurrentChange"
                @size-change="childrenDeviceSizeChange"
              />
            </div>
          </div>
          <!--添加子设备弹窗-->
          <el-dialog
            :append-to-body="true"
            :close-on-click-modal="false"
            :title="$translateTitle('equipment.addchilddevice')"
            :visible.sync="childDialog"
            width="40%"
          >
            <div class="childdialog">
              <el-form
                label-position="left"
                ref="childrenForm"
                :model="childrenForm"
                label-width="120px"
                class="demo-form-inline"
              >
                <el-form-item
                  :label="$translateTitle('equipment.Products')"
                  :rules="[
                    { required: true, message: '选择产品', trigger: 'change' },
                  ]"
                  prop="product"
                >
                  <el-select
                    style="width: 100%"
                    v-model="childrenForm.product"
                    :placeholder="$translateTitle('equipment.products')"
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
                    style="width: 100%"
                    v-model="childrenForm.device"
                    v-el-select-loadmore="loadmore"
                    :disabled="!ischange"
                    :placeholder="$translateTitle('product.equipment')"
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
                    style="width: 100%"
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
              <el-button
                type="primary"
                @click.native="submitDevice('childrenForm')"
              >
                {{ $translateTitle('developer.determine') }}
              </el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane
          v-if="isshowchild"
          :label="$translateTitle('device.instruct')"
          name="instruct"
        >
          <Instruct
            v-loading="loading"
            :devices-id="deviceid"
            :product-id="productid"
          />
        </el-tab-pane>
        <el-tab-pane
          v-show="activeName == 'task'"
          :label="$translateTitle('device.trace')"
          name="task"
        >
          <scene-log
            v-if="activeName == 'task'"
            ref="SceneLog"
            :device-info="deviceInfo"
            :name="activeName"
          />
        </el-tab-pane>
        <el-tab-pane :label="$translateTitle('device.log')" name="trace">
          <device-log
            v-if="activeName == 'trace'"
            :devaddr="devicedevaddr"
            :deviceid="deviceid"
            :is-device-info="true"
            :productid="productId"
          />
        </el-tab-pane>

        <el-tab-pane label="可视化" name="view">
          <el-row :gutter="24" style="margin: 0 !important">
            <el-col :span="22">
              <el-alert
                title="可视化控制表单"
                type="info"
                description="信息可视化是利用人的视觉能力，将信息通过图形图像设计的方式视觉呈现，使枯燥的信息数据变得更为直观，更易于被接受，从而提升信息的传播速度和准确度。"
                show-icon
              />
            </el-col>
            <el-col :span="2">
              <el-button
                type="primary"
                @click.native="
                  $router.push({
                    path: `/design`,
                    query: {
                      type: 'amis',
                      _class: 'Product',
                      key: productId,
                    },
                  })
                "
              >
                前往配置
              </el-button>
            </el-col>
          </el-row>

          <el-tabs v-model="amisTable" type="border-card">
            <el-tab-pane
              v-for="(item, index) in commandInfo.data"
              :key="index+'_j'"
              :label="item.title"
              :name="index+'_j'"
            >
              <dgiot-amis :schema="item.data" :show-help="false" />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="视频监控" name="video">
          <dgiot-aliplayer
            v-if="activeName==='video'"
            ref="dgiotPlayer"
            height="76vh"
            :playsource="
              deviceInfo.detail && deviceInfo.detail.videoSrc
                ? deviceInfo.detail.videoSrc
                : 'https://media.w3.org/2010/05/sintel/trailer.mp4'
            "
            :type="
              deviceInfo.detail && deviceInfo.detail.videoType
                ? deviceInfo.detail.videoType
                : 'mp4'
            "
            width="100%"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<!--eslint-disable-->
<script src="./js/editdevices.js"></script>
<style lang="scss" scoped>
  ::v-deep {
    .el-tabs__header {
      margin: 0;
    }

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
    padding: 0 20px;
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

  .thirdtb {
    width: 100vh;
    height: 76vh;
    background: #f4f4f4;
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
    padding: 12px;
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
<style lang="scss">
  @media screen and(max-width: 600px) {
    .editdevices {
      .el-tabs__item {
        height: 50px;
        margin: 0;
        margin-top: 5px;
        font-family: auto;
        font-size: 12px;
        line-height: 50px;
      }
    }

    .el-tabs {
      width: 560px;
      font-size: 12px;
    }
    .mailtable {
      tr {
        .cloumn {
          font-size: 12px;
        }
      }

      td {
        width: 70px;
        padding: 1px;
        font-size: 10px;
      }
    }
  }

  @media screen and(min-width: 601px) {
    .editdevices .el-tabs__item {
      height: 50px;
      margin: 0;
      margin-top: 20px;
      font-family: auto;
      font-size: 16px;
      line-height: 50px;
    }
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
