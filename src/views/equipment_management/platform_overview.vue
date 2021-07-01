<!--
 * @Author: h7ml
 * @Date: 2021-02-02 17:52:06
 * @LastEditTime: 2021-03-15 12:42:33
 * @LastEditors: h7ml
 * @Description: In User Settings Edit
 * @FilePath: \dgiot_dashboard\src\views\equipment_management\platform_overview.vue
-->
<template>
  <div ref="platform" class="platform">
    <VabMqtt
      ref="mqtt"
      :connect="isConnect"
      :topic="channeltopic"
      :reconnection="true"
      @mqttMsg="mqttMsg"
      @mqttError="mqttError"
      @mqttConnectLost="mqttConnectLost"
      @mqttSuccess="mqttSuccess"
    />
    <vab-input ref="uploadFinish" @fileInfo="fileInfo" />

    <div class="home_dialog">
      <el-dialog
        width="100vh"
        :title="deviceInfo.name"
        :visible.sync="deviceFlag"
      >
        <info :devicedetail="deviceInfo" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="deviceFlag = false">
            {{ $translateTitle('developer.cancel') }}
          </el-button>
          <el-button type="primary" @click="deviceFlag = false">
            {{ $translateTitle('developer.determine') }}
          </el-button>
        </span>
      </el-dialog>
    </div>
    <div
      :style="{ height: queryForm.workGroupTreeShow ? '160px' : 'auto' }"
      class="map_header"
    >
      <div v-show="cardHeight != '0px'" class="map_card">
        <el-row>
          <el-col class="card-panel-col" :xs="24" :sm="24" :md="6" :xl="6">
            <el-card class="box-card">
              <el-col :span="12" class="card-left">
                <vab-icon icon="projector-2-fill" />
              </el-col>
              <el-col :span="12" class="card-right">
                <p>{{ $translateTitle('home.cla_count') }}</p>
                <p>{{ _project_count }}</p>
              </el-col>
            </el-card>
          </el-col>
          <el-col class="card-panel-col" :xs="24" :sm="24" :md="6" :xl="6">
            <el-card class="box-card">
              <el-col :span="12">
                <vab-icon icon="projector-fill" />
              </el-col>
              <el-col :span="12" class="card-right">
                <p>{{ $translateTitle('home.pro_count') }}</p>
                <p>{{ _product_count }}</p>
              </el-col>
            </el-card>
          </el-col>
          <el-col
            :lg="{ span: '4-8' }"
            class="card-panel-col"
            :xs="24"
            :sm="24"
            :md="6"
            :xl="6"
          >
            <el-card class="box-card">
              <el-col :span="12">
                <vab-icon icon="apps-fill" />
              </el-col>
              <el-col :span="12" class="card-right">
                <p>{{ $translateTitle('home.app_count') }}</p>
                <p>{{ _app_count }}</p>
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" class="card-panel-col" :xl="6">
            <el-card class="box-card">
              <el-col :span="12">
                <vab-icon icon="device-recover-fill" />
              </el-col>
              <el-col :span="12" class="card-right">
                <p>{{ $translateTitle('home.dev_count') }}</p>
                <p>{{ _dev_count }}</p>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <vab-query-form>
        <vab-query-form-top-panel>
          <el-form
            :inline="true"
            label-width="100px"
            :model="queryForm"
            @submit.native.prevent
          >
            <el-form-item :label="$translateTitle('user.department')">
              <el-select
                v-model="queryForm.workGroupName"
                placeholder="请选择"
                clearable
                @visible-change="change($event)"
              >
                <el-option
                  :value="treeDataValue"
                  style="height: auto; padding: 0"
                >
                  <el-tree
                    ref="workGroup"
                    :data="deptTreeData"
                    :props="roleProps"
                    node-key="index"
                    default-expand-all
                    :expand-on-click-node="false"
                  >
                    <div slot-scope="{ node, data }" class="custom-tree-node">
                      <span
                        :class="{ selected: data.objectId == curDepartmentId }"
                        @click="handleNodeClick(data, node)"
                      >
                        {{ node.label }}
                      </span>
                    </div>
                  </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$translateTitle('equipment.products')">
              <el-select
                v-model="queryForm.account"
                class="selectdetail"
                size="small"
                @change="selectProdChange"
              >
                <el-option
                  v-for="(item, index) in _Product"
                  :key="index"
                  :label="item.name"
                  :value="item.objectId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$translateTitle('user.createdtime')">
              <el-date-picker
                v-model="queryForm.searchDate"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                start-placeholder="开始日期"
                type="daterange"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="queryData"
              >
                {{ $translateTitle('concentrator.search') }}
              </el-button>
              <el-button
                :icon="leftWidth != '0px' ? 'el-icon-back' : 'el-icon-right'"
                type="primary"
                @click="toggleLeftWidth(leftWidth)"
              >
                {{
                  leftWidth != '0px'
                    ? $translateTitle('konva.hide')
                    : $translateTitle('konva.show')
                }}
                {{ $translateTitle('konva.left') }}
              </el-button>
              <!--              <el-button-->
              <!--                :icon="-->
              <!--                  fixedPaddingTop != '0px' ? 'el-icon-top' : 'el-icon-bottom'-->
              <!--                "-->
              <!--                type="primary"-->
              <!--                @click="setPadding(fixedPaddingTop)"-->
              <!--              >-->
              <!--                {{-->
              <!--                  fixedPaddingTop != '0px'-->
              <!--                    ? $translateTitle('konva.hide')-->
              <!--                    : $translateTitle('konva.show')-->
              <!--                }}-->
              <!--                {{ $translateTitle('konva.top') }}-->
              <!--              </el-button>-->
              <el-button
                :icon="leftRow == 20 ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                type="primary"
                @click="leftRow == 20 ? (leftRow = 24) : (leftRow = 20)"
              >
                {{
                  cardHeight != '0px'
                    ? $translateTitle('konva.hide')
                    : $translateTitle('konva.show')
                }}
                {{ $translateTitle('konva.right') }}
              </el-button>
              <el-button
                :icon="
                  cardHeight != '0px' ? 'el-icon-s-unfold' : 'el-icon-s-fold'
                "
                type="primary"
                @click="toggleCard(cardHeight)"
              >
                {{
                  leftRow == 20
                    ? $translateTitle('konva.hide')
                    : $translateTitle('konva.show')
                }}
                {{ $translateTitle('konva.card') }}
              </el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-top-panel>
      </vab-query-form>
    </div>
    <el-row :row="24">
      <el-col :span="leftRow" :xs="24">
        <el-row :span="24">
          <div class="chart_map">
            <baidu-map
              ak="fnc5Z92jC7CwfBGz8Dk66E9sXEIYZ6TG"
              :scroll-wheel-zoom="true"
              class="baidu_map"
              :center="{ lng: 116.404, lat: 39.915 }"
              :zoom="sizeZoom"
            >
              <bm-control>
                <el-button size="mini" @click="sizeZoom = 19">
                  {{ $translateTitle('home.max') }}
                </el-button>
                <el-button size="mini" @click="sizeZoom = 10">
                  {{ $translateTitle('home.restore') }}
                </el-button>
                <el-button size="mini" @click="sizeZoom = 3">
                  {{ $translateTitle('home.min') }}
                </el-button>
                <bm-panorama
                  anchor="BMAP_ANCHOR_TOP_LEFT"
                  :offset="{ width: 460, height: 0 }"
                />
                <bm-overview-map :is-open="true" />
                <bm-scale :offset="{ width: 200, height: 0 }" />
                <bm-city-list :offset="{ width: 280, height: 0 }" />
                <bm-map-type
                  anchor="BMAP_ANCHOR_TOP_LEFT"
                  :map-types="['BMAP_HYBRID_MAP', 'BMAP_NORMAL_MAP']"
                  :offset="{ width: 360, height: 0 }"
                />
              </bm-control>
              <bml-marker-clusterer :average-center="true">
                <div v-for="(item, index) in _tableData" :key="index">
                  <bm-marker
                    :ref="'bm_info' + index"
                    :position="{
                      lng: item.location.longitude,
                      lat: item.location.latitude,
                    }"
                    :icon="{
                      url: item.iconUrl,
                      size: { width: 100, height: 100 },
                    }"
                    @click="showDeatils(item, index)"
                  >
                    <bm-info-window
                      :key="index"
                      style="display: none"
                      :position="{
                        lng: item.location.longitude,
                        lat: item.location.latitude,
                      }"
                      :show="item.show"
                      @close="closeInfo(item, index)"
                    >
                      <div
                        v-show="deviceInfo"
                        style="width: 400px"
                        class="deviceInfo"
                      >
                        <el-row :gutter="24">
                          <el-col :span="8">
                            <el-image
                              style="width: 120px; height: 120px"
                              :src="productIco"
                              :preview-src-list="[`${productIco}`]"
                            >
                              <div slot="error" class="image-slot">
                                <i
                                  class="el-icon-picture-outline empty"
                                  style="width: 100px; height: 100px"
                                ></i>
                              </div>
                            </el-image>
                          </el-col>
                          <el-col :span="14">
                            <p :title="deviceInfo.name">
                              <el-link type="primary">
                                {{ $translateTitle('equipment.devicename') }}
                              </el-link>
                              :{{ deviceInfo.name }}
                            </p>
                            <p>
                              <el-link type="primary">
                                {{ $translateTitle('equipment.address') }}
                              </el-link>
                              :
                              {{
                                deviceInfo.detail && deviceInfo.detail.address
                                  ? deviceInfo.detail.address
                                  : ''
                              }}
                            </p>
                            <p>
                              <el-link type="primary">
                                {{
                                  $translateTitle('zetadevices.devicestatus')
                                }}
                              </el-link>
                              ：
                              <el-link
                                :underline="false"
                                :type="
                                  item.icon === '0'
                                    ? 'success'
                                    : item.icon === '1'
                                    ? 'warning'
                                    : 'danger'
                                "
                              >
                                {{
                                  item.icon === '0'
                                    ? $translateTitle('zetadevices.在线')
                                    : item.icon === '1'
                                    ? $translateTitle('zetadevices.offline')
                                    : $translateTitle('zetadevices.malfunction')
                                }}
                              </el-link>
                            </p>
                            <el-divider />
                            <el-row :gutter="24">
                              <el-col :span="8">
                                <el-link
                                  type="primary"
                                  @click="goLink('real-time', item)"
                                >
                                  {{ $translateTitle('equipment.real-time') }}
                                </el-link>
                              </el-col>
                              <el-col :span="6">
                                <el-link
                                  type="primary"
                                  @click="goLink('konva', item)"
                                >
                                  {{ $translateTitle('concentrator.konva') }}
                                </el-link>
                              </el-col>
                              <el-col :span="6">
                                <el-link
                                  type="primary"
                                  @click="goLink('video', item)"
                                >
                                  {{ $translateTitle('concentrator.video') }}
                                </el-link>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                        <!--                        <info :devicedetail="deviceInfo" />-->
                      </div>
                    </bm-info-window>
                  </bm-marker>
                </div>
              </bml-marker-clusterer>
              <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
              <bm-geolocation
                :show-address-bar="true"
                :auto-location="true"
                anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
              />
            </baidu-map>
          </div>
        </el-row>
      </el-col>
      <el-col :span="24 - leftRow" :xs="24">
        <div class="home_card">
          <el-tabs v-model="activeName" @tab-click="resizeTheChart">
            <el-tab-pane :label="$translateTitle('home.info')" name="first">
              <div class="box-card">
                <el-card>
                  <div slot="header" class="clearfix">
                    <el-button>{{ $translateTitle('home.info') }}</el-button>
                  </div>
                  <div>
                    <el-row :gutter="24">
                      <el-col :span="24">
                        <div class="grid-content bg-purple">
                          <el-table
                            :data="Product"
                            style="width: 100%"
                            :header-cell-style="{
                              background: '#073646',
                              color: '#00D3E0',
                            }"
                            :row-class-name="tableRowClassName"
                          >
                            <el-table-column width="60">
                              <template slot-scope="scope">
                                <el-image
                                  style="width: 26px; height: 26px"
                                  :src="scope.row.icon"
                                  :preview-src-list="[`${scope.row.icon}`]"
                                >
                                  <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                  </div>
                                </el-image>
                              </template>
                            </el-table-column>
                            <el-table-column
                              width="120"
                              prop="name"
                              :show-overflow-tooltip="true"
                            >
                              <template slot-scope="scope">
                                <span @click="goDevice(scope.row.name)">
                                  {{ scope.row.name }}
                                </span>
                              </template>
                            </el-table-column>

                            <el-table-column width="40">
                              <template slot-scope="scope">
                                <span @click="goDevice(scope.row.name)">
                                  {{ scope.row.deviceChild.length }}
                                </span>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </div>

              <el-col :xs="24" :sm="24" :md="28" :xl="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>
                      {{ $translateTitle('equipment.Equipment Overview') }}
                    </span>
                    <el-button
                      icon="el-icon-refresh"
                      style="float: right; padding: 3px 0"
                      type="text"
                      @click="resizeTheChart()"
                    />
                  </div>
                  <div class="text item">
                    <vab-chart
                      ref="charts"
                      :loading="loading"
                      height="160px"
                      type="ring"
                      :data-empty="!ChartStatus.rows"
                      :data="_ChartStatus"
                      :settings="chartSettings"
                      :extend="chartExtend"
                    />
                  </div>
                </el-card>
              </el-col>
            </el-tab-pane>
            <el-tab-pane
              :label="$translateTitle('home.dev_unline')"
              name="second"
            >
              <div class="box-card">
                <el-card>
                  <div slot="header" class="clearfix">
                    <el-badge :value="_dev_off_count" class="item">
                      <el-button size="small" @click="_goDevice('dev_unline')">
                        {{ $translateTitle('home.dev_unline') }}
                      </el-button>
                    </el-badge>
                  </div>
                  <div>
                    <el-row :gutter="24">
                      <el-col :span="24">
                        <div class="grid-content bg-purple">
                          <el-table
                            :data="_offlineData"
                            class="_el-table"
                            style="width: 100%"
                            :header-cell-style="{
                              background: '#073646',
                              color: '#00D3E0',
                            }"
                            :row-class-name="tableRowClassName"
                          >
                            <el-table-column prop="name">
                              <template slot-scope="scope">
                                <span
                                  :title="
                                    scope.row.name +
                                    $translateTitle('home.Last online time') +
                                    scope.row.updatedAt
                                  "
                                  @click="showInfo(scope.row.objectId)"
                                >
                                  {{ scope.row.name }}
                                </span>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="$translateTitle('home.dev_online')"
              name="third"
            >
              <div class="box-card">
                <el-card>
                  <div slot="header" class="clearfix">
                    <el-badge :value="_dev_online_count" class="item">
                      <el-button size="small" @click="_goDevice('dev_online')">
                        {{ $translateTitle('home.dev_online') }}
                      </el-button>
                    </el-badge>
                  </div>
                  <div>
                    <el-row :gutter="24">
                      <el-col :span="24">
                        <div class="grid-content bg-purple">
                          <el-table
                            :data="_onlineData"
                            style="width: 100%"
                            class="_el-table"
                            :header-cell-style="{
                              background: '#073646',
                              color: '#00D3E0',
                            }"
                            :row-class-name="tableRowClassName"
                          >
                            <el-table-column prop="name">
                              <template slot-scope="scope">
                                <span
                                  :title="
                                    scope.row.name +
                                    $translateTitle('home.Last online time') +
                                    scope.row.updatedAt
                                  "
                                  @click="showInfo(scope.row.objectId)"
                                >
                                  {{ scope.row.name }}
                                </span>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { queryProduct } from '@/api/Product'
  import { getDevice, putDevice } from '@/api/Device'
  import { mapGetters, mapMutations } from 'vuex'
  import Category from '@/api/Mock/Category'
  import { Roletree, getToken } from '@/api/Menu'
  import { StartDashboard } from '@/api/dashboard'
  import { isBase64 } from '@/utils'
  import info from '@/components/Device/info'
  import queryParams from '@/api/Mock/Dashboard'
  import {
    BmNavigation,
    BaiduMap,
    BmGeolocation,
    BmCityList,
    BmMarker,
    // BmLabel,
    BmControl,
    BmPanorama,
    BmOverviewMap,
    BmMapType,
    BmScale,
    BmlMarkerClusterer,
    BmInfoWindow,
  } from 'vue-baidu-map'

  export default {
    name: 'Index',
    components: {
      BmInfoWindow,
      info,
      BmScale,
      BmMapType,
      BmOverviewMap,
      BmPanorama,
      BmControl,
      // BmLabel,
      BaiduMap,
      BmNavigation,
      BmGeolocation,
      BmCityList,
      BmMarker,
      BmlMarkerClusterer,
    },
    data() {
      this.chartSettings = {
        radius: [5, 40],
        offsetY: 100,
      }
      this.chartExtend = {
        yAxisType: ['percent'],
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
      }

      return {
        productIco: '',
        ChartStatus: {
          columns: ['状态', '数量'],
          rows: [
            { 状态: '在线', 数量: 0 },
            { 状态: '离线', 数量: 0 },
          ],
        },
        infoWindow: {
          show: true,
          contents:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
        loading: true,
        marker: {},
        deviceFlag: false,
        deviceInfo: { detail: {} },
        Product: [],
        imgurl:
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        channeltopic: '',
        isConnect: false,
        queryForm: {
          account: '',
          searchDate: '',
          pageNo: 1,
          pageSize: 20,
          workGroupName: '',
          workGroupTreeShow: false,
          access_token: '',
        },
        roleProps: {
          children: 'children',
          label: 'name',
        },
        leftWidth: '',
        cardHeight: '',
        fixedPaddingTop: '',
        curDepartmentId: '',
        leftRow: 20,
        treeDataValue: '',
        deptTreeData: [],
        show: false,
        sizeZoom: 5,
        tableData: [],
        offlineData: [],
        onlineData: [],
        chartSetting: {
          yAxis: {
            type: 'value',
            minInterval: 1,
          },
        },
        NODE_ENV: process.env.NODE_ENV,
        category: Category,
        activeName: 'second',
        filterBox: 'filterBox-first',
        project_count: 0,
        app_count: 0,
        product_count: 0,
        dev_count: 0,
        active: false,
        dev_active_count: 0,
        dev_online_count: 0,
        dev_off_count: 0,
        projectList: [],
        formInline: {
          starttime: '',
          project: '',
        },
      }
    },
    computed: {
      ...mapGetters({
        roleTree: 'user/roleTree',
        collapse: 'settings/collapse',
        _Product: 'user/_Product',
        language: 'settings/language',
        _dev_count: 'dashboard/_dev_count',
        _project_count: 'dashboard/_project_count',
        _app_count: 'dashboard/_app_count',
        _product_count: 'dashboard/_product_count',
        token: 'user/token',
        _dev_online_count: 'dashboard/_dev_online_count',
        _onlineData: 'dashboard/_onlineData',
        _dev_off_count: 'dashboard/_dev_off_count',
        _offlineData: 'dashboard/_offlineData',
        _ChartStatus: 'dashboard/_ChartStatus',
        _tableData: 'dashboard/_tableData',
        _pcimg: 'dashboard/_pcimg',
        _mimg: 'dashboard/_mimg',
      }),
    },
    // watch: {
    //   collapse: {
    //     handler(_collapse) {
    //       $('.appendLogo').remove()
    //       $('.logo-container .router-link-active').css({
    //         display: 'none',
    //       })
    //       let img = this.collapse == true ? this._pcimg : this._mimg
    //       $('.logo-container').append(
    //         `<img src=${img} class="appendLogo" style="width: 100%" />`
    //       )
    //     },
    //     deep: true,
    //     immediate: true,
    //   },
    // },
    mounted() {
      this.queryForm.account =
        this.language == 'zh' ? '全部产品' : 'All Products'
      this.getRoletree()
      this.getProduct()
    },
    activated() {
      console.log('keep-alive生效')
      this.resizeTheChart()
    }, //如果页面有keep-alive缓存功能，这个函数会触发
    destroyed() {
      this.$iotMqtt.unsubscribe(this.channeltopic)
      this.resizeTheChart()
    },
    methods: {
      resizeTheChart() {
        this.loading = true
        let charts = this.$refs[`charts`]
        if (charts) {
          charts.$children[0].resize()
          console.log('重绘完成', charts)
          setTimeout(() => {
            this.loading = false
          }, 2000)
        }
      },
      tableRowClassName({ row, rowIndex }) {
        if (rowIndex === 1) {
          return 'warning-row'
        } else if (rowIndex === 2) {
          return 'success-row'
        }
        return ''
      },
      ...mapMutations({
        setRoleTree: 'user/setRoleTree',
        set_Product: 'user/set_Product',
        set_dev_count: 'dashboard/set_dev_count',
        set_project_count: 'dashboard/set_project_count',
        set_app_count: 'dashboard/set_app_count',
        set_product_count: 'dashboard/set_product_count',
        // set_Product: 'dashboard/set_Product',
        set_dev_online_count: 'dashboard/set_dev_online_count',
        set_onlineData: 'dashboard/set_onlineData',
        set_dev_off_count: 'dashboard/set_dev_off_count',
        set_offlineData: 'dashboard/set_offlineData',
        set_ChartStatus: 'dashboard/set_ChartStatus',
        set_tableData: 'dashboard/set_tableData',
      }),
      // 设备详情
      deviceToDetail(row) {
        console.log(row, 'deviceToDetail')
        // row.show = !row.show
        this.$router.push({
          path: '/roles/editdevices',
          query: {
            deviceid: row.objectId,
            nodeType: '2',
            ischildren: 'false',
          },
        })
      },
      uploadCkick(item) {
        this.deviceId = item.objectId
        // 触发子组件的点击事件
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
      },
      async fileInfo(info) {
        this.deviceInfo.detail.deviceIco = info.url
        const params = {
          detail: this.deviceInfo.detail,
        }
        this.deviceInfo = await putDevice(this.deviceId, params)
        info.url
      },
      /*
   连接webscroket
   */
      getCategory(key) {
        console.log(key)
        let name = ''
        this.category.filter((item) => {
          if (item.type == key) {
            name = item.data.CategoryName
          }
        })
        return name
      },
      mqttError(e) {
        console.log('mqttError', e)
      },
      closeInfo(item, index) {
        // item.show = false
        // this.$refs[`bm_info${index}`][0].$children[0].show = false
        // this.set_tableData(_.merge([], this._tableData))
        // this.$forceUpdate()
      },
      async showDeatils(row, index) {
        // const loading = this.$baseColorfullLoading(0)
        this.productIco = ''
        this.deviceInfo = await getDevice(row.objectId)
        const { results = [{ icon: '' }] } = await queryProduct({
          count: 'objectId',
          order: '-updatedAt',
          keys: 'icon',
          where: {
            objectId: this.deviceInfo.product.objectId,
          },
        })
        this.productIco = results[0].icon
        row.show = true
        // loading.close()
        console.log(this.productIco, row, row.show, index, this.deviceInfo)
        // 延时加载
        setTimeout(() => {
          console.info(this.$refs[`bm_info${index}`])
          this.$refs[`bm_info${index}`][0].$children[0].show = true
          // this.set_tableData(_.merge([], this._tableData))
          // this.$forceUpdate()
        }, 1000)
      },
      async showInfo(objectId) {
        this.deviceInfo = await getDevice(objectId)
        let ProductId = this.deviceInfo.product.objectId || 'undefined'
        let DevAddr = this.deviceInfo.devaddr || 'undefined'
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
        this.deviceInfo.product.topics
          ? (this.deviceInfo.topicData =
              this.deviceInfo.product.topics.concat(_toppic))
          : (this.deviceInfo.topicData = _toppic)
        this.deviceFlag = true
      },
      mqttMsg(e) {
        let mqttMsg = isBase64(e) ? Base64.decode(e) : e
        let mqttMsgValue = JSON.parse(mqttMsg).value
        let key = JSON.parse(mqttMsg).vuekey
        this.$baseNotify(
          '',
          `${this.$translateTitle('websocket.messages')}${key}`
        )
        console.log(key, mqttMsgValue, JSON.parse(mqttMsg))
        // console.clear()

        switch (key) {
          case 'app_count':
            this.app_count = mqttMsgValue.count
            this.set_app_count(this.app_count)
            break
          case 'project_count':
            this.project_count = mqttMsgValue.count
            this.set_project_count(this.project_count)
            break
          case 'product_count':
            this.product_count = mqttMsgValue.count
            this.set_product_count(this.product_count)
            this.Product = mqttMsgValue.results
            // this.set_dev_online_count(this.set_dev_online_count)
            break
          case 'dev_online_count':
            this.dev_online_count = mqttMsgValue.count
            this.set_dev_online_count(this.dev_online_count)
            this.onlineData = mqttMsgValue.results
            this.set_onlineData(this.onlineData)
            break
          case 'dev_off_count':
            this.dev_off_count = mqttMsgValue.count
            this.offlineData = mqttMsgValue.results
            this.set_dev_off_count(this.dev_off_count)
            this.set_offlineData(this.offlineData)
            break
          case 'ChartStatus':
            this.ChartStatus = mqttMsgValue.chartData
            this.set_ChartStatus(this.ChartStatus)
            this.resizeTheChart()
            this.$forceUpdate()
            break
          case 'baiduMap':
            this.tableData = mqttMsgValue
            this.tableData.forEach((item) => {
              item.show = false
              item.color =
                item.icon === '0'
                  ? 'yellow'
                  : item.icon === '1'
                  ? 'blue'
                  : 'red'
              item.iconUrl = `https://dgiot-1253666439.file.myqcloud.com/shuwa_tech/zh/frontend/web/Device/${
                item.icon
              }.png?${new Date().getTime()}`
            })
            this.set_tableData(this.tableData)
            this.$forceUpdate()
            break
          case 'device_count':
            this.dev_count = mqttMsgValue.count
            this.set_dev_count(this.dev_count)
            break
          default:
            console.log(JSON.parse(mqttMsg))
            break
        }
        this.$forceUpdate()
      },
      mqttConnectLost(e) {
        console.log('mqttConnectLost', e)
      },
      mqttSuccess(e) {
        StartDashboard(queryParams)
          .then((res) => {
            console.log(res)
            this.$baseNotify(
              e,
              `mqtt${this.$translateTitle('websocket.subscribeSuccess')}`
            )
          })
          .catch((e) => {
            console.log(e)
            this.$baseNotify(
              e,
              `mqtt${this.$translateTitle('websocket.subscribeSuccess')}`,
              'error'
            )
          })
      },
      toggleCard(height) {
        console.log('cardHeight', height)
        if (height != '0px') {
          $('.map_card').css({ height: '0px' })
          this.cardHeight = '0px'
        } else {
          $('.map_card').css({ height: '98px' })
          this.cardHeight = '98px'
        }
      },
      toggleLeftWidth(width) {
        console.log(width, 'width')
        if (width != '0px') {
          $('.vab-side-bar').css({ width: '0px' })
          $('.vab-main').css({ 'margin-left': '0px' })
          this.leftWidth = '0px'
        } else {
          $('.vab-side-bar').css({ width: '200px' })
          $('.vab-main').css({ 'margin-left': '200px' })
          this.leftWidth = '200px'
        }
      },
      setPadding(top) {
        console.log(top, 'top')
        if (top != '0px') {
          $('.fixed').css({ 'padding-top': '0px' })
          $('.fixed-header').css({ height: '0px', display: 'none' })
          $('.vab-tabs').css({ 'nim-height': '0px' })
          $('.baidu_map').css({ height: 'calc(78vh + 90px + 140px)' })
          $('_el-table').css({ height: 'calc(78vh + 90px + 140px)' })
          $('.el-tabs').css({ height: 'calc(78vh + 90px + 140px)' })
          $('section').css({ height: 'calc(100vh - 60px* 2.7 + 110px)' })
        } else {
          $('.fixed').css({ 'padding-top': '110px' })
          $('.fixed-header').css({ height: '110px', display: 'block' })
          $('.vab-tabs').css({ 'nim-height': '50px' })
          $('.baidu_map').css({ height: 'calc(78vh - 20px)' })
          $('_el-table').css({ height: 'calc(78vh)' })
          $('.el-tabs').css({ height: 'calc(78vh - 20px)' })
          $('section').css({ height: 'calc(100vh - 60px* 2.7)' })
        }
        this.fixedPaddingTop = window.getComputedStyle($('.fixed')[0])[
          'padding-top'
        ]
        console.log($('.fixed')[0].style)
        console.log(this.fixedPaddingTop)
      },
      selectProdChange(objectId) {
        console.log(objectId)
      },
      queryData() {},
      async getRoletree() {
        this.fixedPaddingTop = window.getComputedStyle($('.fixed')[0])[
          'padding-top'
        ]
        this.leftWidth = window.getComputedStyle($('.vab-side-bar')[0])['width']
        this.cardHeight = window.getComputedStyle($('.map_card')[0])['height']
        console.log(this.fixedPaddingTop, this.leftWidth, this.cardHeight)
        await Roletree()
          .then((res) => {
            console.log(res)
            this.setRoleTree(res.results)
            this.handleNodeClick(res.results[0], 0)
            this.queryForm.workGroupTreeShow = false
          })
          .catch((e) => {
            console.log(e)
          })
        this.deptTreeData = this.roleTree
      },
      async getProduct() {
        const { results } = await queryProduct({
          count: 'objectId',
          order: '-updatedAt',
          keys: 'name,icon',
          where: {
            category: 'IotHub',
          },
        })
        results.unshift({
          name: this.language == 'zh' ? '全部产品' : 'All Products',
          objectId: '0',
        })
        this.set_Product(results)
      },
      change(e) {
        console.log(e)
        if (e) {
          $('.el-tree').css({
            height: '100px',
            display: 'block',
            'overflow-x': 'auto',
          })
        }
      },
      async handleNodeClick(data, node) {
        $('.el-tree').css({
          height: '0px',
          display: 'none',
          'overflow-x': 'auto',
        })
        $('.el-select-dropdown').css({ display: 'none' })
        this.queryForm.workGroupName = data.label
        this.treeDataValue = data.label
        console.log(this.treeDataValue)
        this.queryForm.workGroupTreeShow = !this.queryForm.workGroupTreeShow
        if (node.level != 1) {
          // 在这里获取点击厂家的session
          const { access_token = '' } = await getToken(data.name)
          this.queryForm.access_token = access_token
        } else {
          console.log(node.level, '登录的token', this.token)
          this.queryForm.access_token = this.token
        }
        // 点击的公司名
        const { name, objectId } = data
        this.curDepartmentId = objectId
        // this.channeltopic = `dashboard/${this.queryForm.access_token}/post`
        this.channeltopic = `dashboard/${this.token}/post`

        // this.isConnect = true
        console.log(this.channeltopic, 'this.channeltopic')
        // this.$iotMqtt.subscribe(this.channeltopic)
        // console.log(this.$iotMqtt, 'this.$iotMqtt.init')
        if (this.$refs.mqtt) {
          this.$refs.mqtt.clientMqtt()
          this.resizeTheChart()
        }
        // $('.el-select-dropdown').css({ height: '0px', display: 'none' })
      },
      handleChange() {},
      handleClickVisit(project) {
        this.$router.push({
          path: '/Topo/VueKonva',
          query: {
            productid: project.objectId,
          },
        })
      },
      goDevice(name) {
        this.$router.push({
          path: '/dashboard/devicelist',
          query: {
            product: name,
          },
        })
      },
      _goDevice(type) {
        this.$router.push({
          path: '/dashboard/devicelist',
          query: {
            deciceType: type,
          },
        })
      },
      goLink(type, item) {
        switch (type) {
          case 'real-time':
            this.$router.push({
              path: '/roles/editdevices',
              query: {
                deviceid: this.deviceInfo.objectId,
                nodeType: 2,
                ischildren: 'false',
              },
            })
            break
          case 'konva':
            this.$router.push({
              path: '/Topo/VueKonva',
              query: {
                productid: this.deviceInfo.product.objectId,
                devaddr: this.deviceInfo.devaddr,
                deviceid: this.deviceInfo.objectId,
                type: 'device',
              },
            })
            break
          case 'video':
            this.$router.push({
              path: '/Topo/VueKonva',
              query: {
                productid: this.deviceInfo.product.objectId,
                devaddr: this.deviceInfo.devaddr,
                deviceid: this.deviceInfo.objectId,
                type: 'device',
              },
            })
            break
        }
      },
      Gotoproduct(name) {
        this.$router.push({
          path: '/dashboard/productlist',
          query: {
            project: name,
          },
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .platform {
    .map_header {
      height: auto;
      .workGroupTreeShow {
        height: 100px;
        overflow: auto;
        overflow-y: scroll;
      }
    }
    .deviceInfo {
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .empty {
        display: block;
        width: 100px;
        height: 100px;
        margin: 20px 7px;
        text-align: center;
      }
      .upload {
        margin: 0 auto;
        font-size: 24px !important;
        text-align: center;
        cursor: pointer;
      }
    }
    box-sizing: border-box;
    width: 100%;
    //height: calc(100vh - #{$base-top-bar-height}* 3 - 25px);
    padding: 10px;
    background-size: 100%;
    .chart_map {
      .baidu_map {
        height: calc(78vh - 20px);
      }
      margin: 8px;
    }
    .home_card {
      ::v-deep {
        ._el-table {
          height: calc(78vh - 60px);
        }
        .el-tabs {
          height: calc(78vh - 20px);
          overflow-x: auto;
        }
      }
      //margin: 20px;
      //.box-card {
      //  height: 50%;
      //}
    }
    .box-card {
      //background: red;
      margin: 5px;
      i {
        color: #fff;
      }
      .el-row {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .el-col {
        border-radius: 4px;
      }
      .bg-purple-dark {
        background: #99a9bf;
      }
      .bg-purple {
      }
      .bg-purple-light {
        background: #e5e9f2;
      }
      .grid-content {
        border-radius: 4px;
      }
      .row-bg {
        height: 40px;
        padding: 10px 0;
        background-color: #f9fafc;
      }
    }
    ::v-deep {
      .has-gutter {
        display: none;
      }
      .el-badge {
        margin: 0;
      }
    }
    .map_card ::v-deep .el-row {
      .card-panel-col:nth-child(1) .el-card {
        background: #673bb7;
      }
      .card-panel-col:nth-child(2) .el-card {
        background: #8bc24a;
      }
      .card-panel-col:nth-child(3) .el-card {
        background: #00bcd5;
      }
      .card-panel-col:nth-child(4) .el-card {
        background: #ea1e63;
      }
      .card-panel-col:nth-child(5) .el-card {
        background: #ff4c4f;
      }
      .card-panel-col:nth-child(6) .el-card {
        background: #2090ff;
      }
    }
    .el-card__body {
      div {
        p {
          text-align: center;
        }
      }
    }
    .clearfix {
      ont-weight: bolder;
      text-align: center;
    }
    .card-left {
      font-size: 80px;
      color: white;
    }
    .card-right p:first-child {
      padding: 5px;
      margin: 0px;
      font-weight: bolder;
    }
    .card-right p {
      font-size: 20px;
      color: #fff;
    }
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 20px;
  }
  i {
    display: block !important;
    width: 50px;
    height: 50px;
    margin: auto;
    margin-top: -10px;
    font-size: 50px !important;
    font-size: 40px;
    color: black;
    transition: all ease-in-out 0.3s;
  }
</style>
