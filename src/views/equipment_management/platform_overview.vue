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
                <p>{{ $translateTitle('home.app_count') }}</p>
                <p>{{ project_count }}</p>
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
                <p>{{ product_count }}</p>
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
                <p>{{ $translateTitle('home.cla_count') }}</p>
                <p>{{ app_count }}</p>
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
                <p>{{ dev_count }}</p>
              </el-col>
            </el-card>
          </el-col>
          <!--          <el-col-->
          <!--            :xs="24"-->
          <!--            :sm="24"-->
          <!--            :md="8"-->
          <!--            :lg="{ span: '4-8' }"-->
          <!--            class="card-panel-col"-->
          <!--            :xl="4"-->
          <!--          >-->
          <!--            <el-card class="box-card">-->
          <!--              <el-col :span="12">-->
          <!--                <vab-icon icon="bar-chart-2-line" />-->
          <!--              </el-col>-->
          <!--              <el-col :span="12" class="card-right">-->
          <!--                <p>{{ $translateTitle('home.dev_online') }}</p>-->
          <!--                <p>{{ dev_online_count }}</p>-->
          <!--              </el-col>-->
          <!--            </el-card>-->
          <!--          </el-col>-->
          <!--          <el-col-->
          <!--            :xs="24"-->
          <!--            :sm="24"-->
          <!--            :md="8"-->
          <!--            :lg="{ span: '4-8' }"-->
          <!--            class="card-panel-col"-->
          <!--            :xl="4"-->
          <!--          >-->
          <!--            <el-card class="box-card">-->
          <!--              <el-col :span="12">-->
          <!--                <vab-icon icon="mail-close-fill" />-->
          <!--              </el-col>-->
          <!--              <el-col :span="12" class="card-right">-->
          <!--                <p>{{ $translateTitle('home.dev_unline') }}</p>-->
          <!--                <p>{{ dev_off_count || 0 }}</p>-->
          <!--              </el-col>-->
          <!--            </el-card>-->
          <!--          </el-col>-->
        </el-row>
        <el-row style="display: none">
          <el-col
            v-for="item in projectList"
            :key="item.id"
            :xs="24"
            :sm="24"
            :md="8"
            :lg="{ span: '4-8' }"
          >
            <el-card class="box-card" shadow="always">
              <div slot="header" class="clearfix">
                <span>
                  {{ item.name }}
                </span>
              </div>
              <div v-if="item.userUnit" class="text item">
                <span>{{ $translateTitle('home.unit') }}</span>
                <span>{{ item.userUnit }}</span>
              </div>
              <div v-if="item.scale" class="text item">
                <span>{{ $translateTitle('home.scale') }}：</span>
                <span>{{ item.scale }}</span>
              </div>
              <div class="text item">
                <span>{{ $translateTitle('home.category') }}：</span>
                <span>{{ getCategory(item.category) }}</span>
              </div>
              <div class="text item">
                <span>{{ $translateTitle('home.updatedAt') }}：</span>
                <span>
                  {{
                    new Date(item.updatedAt).toLocaleDateString() +
                    ' ' +
                    new Date(item.updatedAt).toLocaleTimeString()
                  }}
                </span>
              </div>
              <div class="text item" style="text-align: center">
                <el-button-group>
                  <el-button
                    style="margin-right: 3px"
                    size="mini"
                    type="success"
                    @click="Gotoproduct(item.name)"
                  >
                    {{ $translateTitle('home.preview') }}
                  </el-button>
                  <el-button
                    v-if="NODE_ENV == 'development'"
                    size="mini"
                    type="primary"
                    target="_blank"
                    @click="handleClickVisit(item)"
                  >
                    {{ $translateTitle('home.konva') }}
                  </el-button>
                </el-button-group>
              </div>
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
              <el-button
                :icon="
                  fixedPaddingTop != '0px' ? 'el-icon-top' : 'el-icon-bottom'
                "
                type="primary"
                @click="setPadding(fixedPaddingTop)"
              >
                {{
                  fixedPaddingTop != '0px'
                    ? $translateTitle('konva.hide')
                    : $translateTitle('konva.show')
                }}
                {{ $translateTitle('konva.top') }}
              </el-button>
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
          <div v-show="tableData" class="chart_map">
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
                <bm-marker
                  v-for="item in tableData"
                  :key="item.objectId"
                  :content="item.name"
                  :position="{
                    lng: item.location.longitude,
                    lat: item.location.latitude,
                  }"
                  animation="BMAP_ANIMATION_BOUNCE"
                  @click="item.show = !item.show"
                >
                  <bm-label
                    v-if="item.show"
                    :content="item.name"
                    :label-style="{ color: 'red', fontSize: '12px' }"
                    :offset="{
                      width: -35,
                      height: 30,
                    }"
                    @click="deviceToDetail(item)"
                  />
                </bm-marker>
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
          <el-tabs v-model="activeName">
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
                            />
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
            </el-tab-pane>
            <el-tab-pane
              :label="$translateTitle('home.dev_unline')"
              name="second"
            >
              <div class="box-card">
                <el-card>
                  <div slot="header" class="clearfix">
                    <el-badge :value="dev_off_count" class="item">
                      <el-button size="small">
                        {{ $translateTitle('home.dev_unline') }}
                      </el-button>
                    </el-badge>
                  </div>
                  <div>
                    <el-row :gutter="24">
                      <el-col :span="24">
                        <div class="grid-content bg-purple">
                          <el-table
                            :data="offlineData"
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
                                  @click="showDeatils(scope.row)"
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
                    <el-badge :value="dev_online_count" class="item">
                      <el-button size="small">
                        {{ $translateTitle('home.dev_online') }}
                      </el-button>
                    </el-badge>
                  </div>
                  <div>
                    <el-row :gutter="24">
                      <el-col :span="24">
                        <div class="grid-content bg-purple">
                          <el-table
                            :data="onlineData"
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
                                  @click="showDeatils(scope.row)"
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
  import { mapGetters, mapMutations } from 'vuex'
  import { batch } from '@/api/Batch/index'
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
    BmLabel,
    BmControl,
    BmPanorama,
    BmOverviewMap,
    BmMapType,
    BmScale,
    BmlMarkerClusterer,
  } from 'vue-baidu-map'
  export default {
    name: 'Index',
    components: {
      info,
      BmScale,
      BmMapType,
      BmOverviewMap,
      BmPanorama,
      BmControl,
      BmLabel,
      BaiduMap,
      BmNavigation,
      BmGeolocation,
      BmCityList,
      BmMarker,
      BmlMarkerClusterer,
    },
    data() {
      return {
        deviceFlag: false,
        deviceInfo: [],
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
        chartExtend: {
          series: {
            center: ['50%', '50%'],
          },
          'yAxis.0.min': 0, // 设置左边最小值

          // 'yAxis.0.max': 20, //设置左边最大值

          'yAxis.0.minInterval': 1, // minInterval设置间隔值，1为整数

          'yAxis.1.splitLine.show': false, // yAxis.1： y轴右侧

          'yAxis.1.minInterval': 10, // minInterval设置间隔值，1为整数
        },
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
        _Product: 'user/_Product',
        language: 'settings/language',
        token: 'user/token',
      }),
    },
    mounted() {
      this.fixedPaddingTop = window.getComputedStyle($('.fixed')[0])[
        'padding-top'
      ]
      this.leftWidth = window.getComputedStyle($('.vab-side-bar')[0])['width']
      this.cardHeight = window.getComputedStyle($('.map_card')[0])['height']
      console.log(this.fixedPaddingTop, this.leftWidth, this.cardHeight)
      // this.getAllAxios({}, this.token, false)
      this.queryForm.account =
        this.language == 'zh' ? '全部产品' : 'All Products'
      this.getRoletree()
      this.getProduct()
    },
    activated() {
      console.log('keep-alive生效')
    }, //如果页面有keep-alive缓存功能，这个函数会触发
    destroyed() {
      this.$iotMqtt.unsubscribe(this.channeltopic)
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        if (rowIndex === 1) {
          return 'warning-row'
        } else if (rowIndex === 2) {
          return 'success-row'
        }
        return ''
      },
      ...mapMutations({
        setRoleTree: 'global/setRoleTree',
        set_Product: 'global/set_Product',
      }),
      // 设备详情
      deviceToDetail(row) {
        row.show = !row.show
        this.$router.push({
          path: '/roles/editdevices',
          query: {
            deviceid: row.objectId,
            nodeType: '2',
            ischildren: 'false',
          },
        })
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
      showDeatils(row) {
        console.log(row)
        let ProductId = row.product.objectId || 'undefined'
        let DevAddr = row.devaddr || 'undefined'
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
        row.product.topics
          ? (row.topicData = row.product.topics.concat(_toppic))
          : (row.topicData = _toppic)
        this.deviceFlag = true
        this.deviceInfo = row
        // this.$router.push({
        //   path: '/dashboard/devicelist',
        //   query: {
        //     devaddr: row.devaddr,
        //   },
        // })
      },
      mqttMsg(e) {
        let mqttMsg = isBase64(e) ? Base64.decode(e) : e
        let mqttMsgValue = JSON.parse(mqttMsg).value
        let key = JSON.parse(mqttMsg).vuekey
        console.log(mqttMsgValue, key)
        this.$baseNotify('', `收到消息${key}`)
        // console.clear()
        switch (key) {
          case 'app_count':
            this.app_count = mqttMsgValue.count
            break
          case 'project_count':
            this.project_count = mqttMsgValue.count
            break
          case 'product_count':
            this.product_count = mqttMsgValue.count
            this.Product = mqttMsgValue.results
            console.log(this.Product, 'this.Product')
            break
          case 'dev_online_count':
            this.dev_online_count = mqttMsgValue.count
            this.onlineData = mqttMsgValue.results
            console.log(mqttMsgValue.results, 'dev_online_count')
            break
          case 'dev_off_count':
            this.dev_off_count = mqttMsgValue.count
            this.offlineData = mqttMsgValue.results
            console.log(mqttMsgValue.results, 'dev_off_count')
            break
          case 'baiduMap':
            this.tableData = mqttMsgValue
            console.log(this.tableData, '百度 地图 ')
            break
          default:
            console.log(JSON.parse(mqttMsg))
            break
        }
        this.dev_count = this.dev_online_count + this.dev_off_count
      },
      mqttConnectLost(e) {
        console.log('mqttConnectLost', e)
      },
      mqttSuccess(e) {
        StartDashboard(queryParams)
          .then((res) => {
            console.log(res)
            this.$baseNotify(e, 'mqtt订阅成功')
          })
          .catch((e) => {
            console.log(e)
            this.$baseNotify(e, '请求错误', 'error')
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
          $('.baidu_map').css({ height: 'calc(78vh + 90px + 160px)' })

          $('section').css({ height: 'calc(100vh - 60px* 2.7 + 110px)' })
        } else {
          $('.fixed').css({ 'padding-top': '110px' })
          $('.fixed-header').css({ height: '110px', display: 'block' })
          $('.vab-tabs').css({ 'nim-height': '50px' })
          $('.baidu_map').css({ height: 'calc(78vh - 20px)' })
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
      queryData() {
        // this.getAllAxios({}, this.queryForm.access_token, true)
      },
      async getRoletree() {
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
          $('.el-tree').css({ height: '100px', display: 'block' })
        }
      },
      async handleNodeClick(data, node) {
        $('.el-tree').css({ height: '0px', display: 'none' })
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
        }
        // $('.el-select-dropdown').css({ height: '0px', display: 'none' })
      },
      async getAllAxios(data, token, flag) {
        this.dev_count = 0
        this.projectList = []
        this.product_count = 0
        this.project_count = 0
        this.dev_count = 0
        this.app_count = 0
        this.dev_online_count = 0
        this.Product = []
        this.tableData = []
        let product
        if (this.queryForm.account != '' || this.queryForm.account != 0) {
          product = this.queryForm.account
        } else {
          this.queryForm.account = '*'
        }
        this.$baseColorfullLoading(
          1,
          this.$translateTitle('home.messag_loding')
        )
        let _queryParams = {
          count: 'objectId',
          limit: 1,
          skip: 0,
          where: {},
        }
        const params = [
          {
            method: 'GET',
            path: '/classes/Project',
            body: _queryParams,
          },
          {
            method: 'GET',
            path: '/classes/Product',
            body: {
              // 这里查product 是导致整个查询变慢的主要原因
              count: 'objectId',
              skip: 0,
              keys: 'updatedAt,category,desc,icon',
              where: {
                category: 'IotHub',
                // category: 'Evidence',
                // nodeType: 1,
              },
            },
          },
          {
            method: 'GET',
            path: '/classes/App',
            body: _queryParams,
          },
          {
            method: 'GET',
            path: '/classes/Device',
            body: {
              count: 'objectId',
              limit: 1,
              skip: 0,
              where: {
                product: product,
              },
            },
          },
          {
            method: 'GET',
            path: '/classes/Device',
            body: {
              count: 'objectId',
              limit: 1,
              skip: 0,
              where: {
                status: 'ACTIVE',
                product: product,
              },
            },
          },
          {
            method: 'GET',
            path: '/classes/Device',
            body: {
              count: 'objectId',
              limit: 1,
              skip: 0,
              where: {
                status: 'ONLINE',
                product: product,
              },
            },
          },
          {
            method: 'GET',
            path: '/classes/Product',
            body: {
              count: 'objectId',
              order: '-updatedAt',
              keys: 'name,icon',
              where: {
                category: 'IotHub',
              },
            },
          },
          {
            method: 'GET',
            path: '/classes/Device',
            body: {
              count: 'objectId',
              order: '-updatedAt',
            },
          },
        ]
        data = params
        await batch(data, token, flag)
          .then((res) => {
            this.$baseColorfullLoading().close()
            this.dev_count = res[0].success.count
            this.projectList = res[1].success.results
            this.product_count = res[1].success.count
            this.project_count = res[2].success.count
            this.dev_count = res[3].success.count
            this.app_count = res[4].success.count
            this.dev_online_count = res[5].success.count
            this.Product = res[6].success.results
            this.queryForm.account =
              this.language == 'zh' ? '全部产品' : 'All Products'
            this.tableData = res[7].success.results
            this.tableData.forEach((i) => {
              if (!i.location) {
                // location 容错处理
                i.location = { longitude: 0, latitude: 0 }
              }
            })
            console.log(this.tableData)
          })
          .catch((error) => {
            this.$baseColorfullLoading().close()
            console.log(error)
          })
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
        .el-tabs {
          height: calc(78vh - 20px);
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
