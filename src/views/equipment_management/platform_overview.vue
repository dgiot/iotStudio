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
    <div
      :style="{ height: queryForm.workGroupTreeShow ? '160px' : 'auto' }"
      class="map_header"
    >
      <div v-show="cardHeight != '0px'" class="map_card">
        <el-row>
          <el-col
            :lg="{ span: '4-8' }"
            class="card-panel-col"
            :xs="24"
            :sm="24"
            :md="8"
            :xl="4"
          >
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
          <el-col
            :lg="{ span: '4-8' }"
            class="card-panel-col"
            :xs="24"
            :sm="24"
            :md="8"
            :xl="4"
          >
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
            :md="8"
            :xl="4"
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
          <el-col
            :xs="24"
            :sm="24"
            :md="8"
            :lg="{ span: '4-8' }"
            class="card-panel-col"
            :xl="4"
          >
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
          <el-col
            :xs="24"
            :sm="24"
            :md="8"
            :lg="{ span: '4-8' }"
            class="card-panel-col"
            :xl="4"
          >
            <el-card class="box-card">
              <el-col :span="12">
                <vab-icon icon="bar-chart-2-line" />
              </el-col>
              <el-col :span="12" class="card-right">
                <p>{{ $translateTitle('home.dev_online') }}</p>
                <p>{{ dev_online_count }}</p>
              </el-col>
            </el-card>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :md="8"
            :lg="{ span: '4-8' }"
            class="card-panel-col"
            :xl="4"
          >
            <el-card class="box-card">
              <el-col :span="12">
                <vab-icon icon="mail-close-fill" />
              </el-col>
              <el-col :span="12" class="card-right">
                <p>{{ $translateTitle('home.dev_unline') }}</p>
                <p>{{ dev_count - dev_online_count || 0 }}</p>
              </el-col>
            </el-card>
          </el-col>
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
                :icon="leftRow == 18 ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                type="primary"
                @click="leftRow == 18 ? (leftRow = 24) : (leftRow = 18)"
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
                  leftRow == 18
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
              <bm-marker
                v-for="(item, index) in tableData"
                :key="item.objectId"
                :dragging="true"
                :content="item.name"
                :position="{
                  lng: item.location.longitude,
                  lat: item.location.latitude,
                }"
                animation="BMAP_ANIMATION_BOUNCE"
                @click="show = !show"
              >
                <bm-label
                  :content="item.name"
                  :label-style="{ color: 'red', fontSize: '12px' }"
                  :offset="{
                    width: -35 * index,
                    height: 30 * index,
                  }"
                  @click="deviceToDetail(item)"
                />
              </bm-marker>
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
          <div class="box-card">
            <el-card>
              <div slot="header" class="clearfix">
                <span>{{ $translateTitle('home.info') }}</span>
              </div>
              <div>
                <el-row>
                  <el-col :span="18">
                    <ve-histogram
                      :extend="chartExtend"
                      height="260px"
                      :data="chartData"
                      :settings="chartSetting"
                    />
                  </el-col>
                  <el-col :span="6">
                    <div style="margin: 20px 0 20px 20px">
                      <p>
                        {{
                          $translateTitle('home.app_count') +
                          ':' +
                          project_count
                        }}
                      </p>
                      <p>
                        {{
                          $translateTitle('home.pro_count') +
                          ':' +
                          product_count
                        }}
                      </p>
                      <p>
                        {{
                          $translateTitle('home.cla_count') + ':' + app_count
                        }}
                      </p>
                      <p>
                        {{
                          $translateTitle('home.dev_count') + ':' + dev_count
                        }}
                      </p>
                      <p>
                        {{
                          $translateTitle('home.dev_online') +
                          ':' +
                          dev_online_count
                        }}
                      </p>
                      <p>
                        {{ $translateTitle('home.dev_unline') + ':' }}
                        {{ dev_count - dev_online_count }}
                      </p>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
          <div class="box-card">
            <el-card>
              <div slot="header" class="clearfix">
                <span>未确认报警展示</span>
                <el-button style="float: right; padding: 3px 0" type="text">
                  操作按钮
                </el-button>
              </div>
              <div v-for="o in 4" :key="o" class="text item">
                {{ '设备 ' + o }}
              </div>
            </el-card>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { queryProduct } from '@/api/Product'
  import { mapGetters, mapMutations } from 'vuex'
  import { batch } from '@/api/Batch/index'
  import { queryDevice } from '@/api/Device'
  import Category from '@/api/Mock/Category'
  import { Roletree, getToken } from '@/api/Menu'
  import { Websocket } from '@/utils/wxscoket.js'
  import { uuid } from '@/utils'
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
  } from 'vue-baidu-map'
  export default {
    name: 'Index',
    components: {
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
    },
    data() {
      return {
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
        leftRow: 18,
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
        chartData: {
          columns: [],
          rows: [],
        },
        show: false,
        sizeZoom: 5,
        tableData: [],
        chartSetting: {
          yAxis: {
            type: 'value',
            minInterval: 1,
          },
        },
        NODE_ENV: process.env.NODE_ENV,
        category: Category,
        activeName: 'devchart',
        filterBox: 'filterBox-first',
        project_count: '-',
        app_count: '-',
        product_count: '-',
        dev_count: '-',
        dev_active_count: '-',
        dev_online_count: '-',
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
      this.getAllAxios({}, this.token, false)
      this.getDevices()
      this.getRoletree()
      this.getProduct()
    },
    activated() {
      console.log('keep-alive生效')
    }, //如果页面有keep-alive缓存功能，这个函数会触发
    methods: {
      ...mapMutations({
        setRoleTree: 'global/setRoleTree',
        set_Product: 'global/set_Product',
      }),
      // 设备详情
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
      connectScoket() {
        var channeltopic = `thing/${this.queryForm.access_token}/${uuid(6)}`
        console.log('订阅mqtt channeltopic', channeltopic)
        Websocket.add_hook(channeltopic, (Msg) => {
          console.log('收到消息', Msg)
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
      async getProduct() {
        const params = {
          count: 'objectId',
          order: '-updatedAt',
          keys: 'name',
          where: {
            category: 'IotHub',
          },
        }
        const { results } = await queryProduct(params)
        results.unshift({
          name: this.language == 'zh' ? '全部产品' : 'All Products',
          objectId: '0',
        })
        this.set_Product(results)
        this.queryForm.account =
          this.language == 'zh' ? '全部产品' : 'All Products'
      },
      selectProdChange(objectId) {
        console.log(objectId)
      },
      queryData() {
        this.getAllAxios({}, this.queryForm.access_token, true)
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
        console.log('this.queryForm.access_token', this.queryForm.access_token)
        this.connectScoket()
        // $('.el-select-dropdown').css({ height: '0px', display: 'none' })
      },
      async getDevices() {
        const { results } = await queryDevice({})
        results.forEach((i) => {
          if (!i.location) {
            // location 容错处理
            i.location = { longitude: 0, latitude: 0 }
          }
        })
        this.tableData = results
      },
      async getAllAxios(data, token, flag) {
        let product
        if (this.queryForm.account != '' || this.queryForm.account != 0) {
          product = this.queryForm.account
        } else {
          this.queryForm.account = '*'
        }
        this.chartData = {
          columns: [],
          rows: [],
        }
        var rows = {}
        this.chartData.columns.push(
          '日期',
          this.$translateTitle('home.app_count'),
          this.$translateTitle('home.pro_count'),
          this.$translateTitle('home.cla_count'),
          this.$translateTitle('home.dev_count'),
          this.$translateTitle('home.dev_online'),
          this.$translateTitle('home.dev_unline')
        )
        this.chartData.columns.forEach((i) => {
          rows[i] = 0
          rows['日期'] = moment().format('YYYY-MM-DD')
        })
        this.chartData.rows[0] = rows
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
              keys: 'updatedAt,category,desc',
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
        ]
        data = params
        await batch(data, token, flag)
          .then((res) => {
            let columnsdata = []
            this.$baseColorfullLoading().close()
            this.dev_count = res[0].success.count
            this.projectList = res[1].success.results
            this.product_count = res[1].success.count
            this.project_count = res[2].success.count
            this.dev_count = res[3].success.count
            this.app_count = res[4].success.count
            this.dev_online_count = res[5].success.count
            columnsdata.push(
              moment().format('YYYY-MM-DD'),
              this.project_count,
              this.product_count,
              this.app_count,
              this.dev_count,
              this.dev_online_count,
              this.dev_count - this.dev_online_count
            )
            this.chartData.columns.forEach((i, index) => {
              // rows[`${this.chartData.columns}`] = index
              for (var key in rows) {
                // rows['类别'] = this.chartData.columns
                if (key == i) {
                  rows[`${key}`] = columnsdata[index]
                }
              }
            })
            this.chartData.rows[0] = rows
          })
          .catch((error) => {
            this.$baseColorfullLoading().close()
            console.log(error)
            this.chartData.rows[0] = rows
          })
        this.$set(this.chartData, 'rows', [rows])
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
    //.home_card {
    //  margin: 20px;
    //  .box-card {
    //    height: 50%;
    //  }
    //}
    .box-card {
      //background: red;
      margin: 5px;
      i {
        color: #fff;
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
        background: #1890ff;
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
      color: #fff;
      font-size: 18px;
    }
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
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
