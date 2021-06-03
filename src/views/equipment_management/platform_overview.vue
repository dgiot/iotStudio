<!--
 * @Author: h7ml
 * @Date: 2021-02-02 17:52:06
 * @LastEditTime: 2021-03-15 12:42:33
 * @LastEditors: h7ml
 * @Description: In User Settings Edit
 * @FilePath: \dgiot_dashboard\src\views\equipment_management\platform_overview.vue
-->
<template>
  <div class="platform">
    <div
      :style="{ height: queryForm.workGroupTreeShow ? '140px' : '40px' }"
      class="map_header"
    >
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
              <el-input
                ref="workGroupInput"
                v-model="queryForm.workGroupName"
                readonly
                auto-complete="off"
                @focus="
                  queryForm.workGroupTreeShow = !queryForm.workGroupTreeShow
                "
              />
              <div v-if="queryForm.workGroupTreeShow" class="workGroupTreeShow">
                <el-tree
                  v-if="queryForm.workGroupTreeShow"
                  ref="workGroup"
                  :data="deptTreeData"
                  :props="roleProps"
                  class="workGroupTree"
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
              </div>
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
                :icon="leftRow == 18 ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                type="primary"
                @click="leftRow == 18 ? (leftRow = 24) : (leftRow = 18)"
              >
                {{
                  leftRow == 18
                    ? $translateTitle('konva.hide')
                    : $translateTitle('konva.show')
                }}
                {{ $translateTitle('konva.right') }}
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
                :content="item.name"
                :position="{
                  lng: item.location.longitude,
                  lat: item.location.latitude,
                }"
                :dragging="true"
                animation="BMAP_ANIMATION_BOUNCE"
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
  import store from '@/store'
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
        curDepartmentId: '',
        leftRow: 18,
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
        sizeZoom: 10,
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
        roleTree: 'global/roleTree',
        _Product: 'global/_Product',
        language: 'settings/language',
        token: 'user/token',
      }),
    },
    mounted() {
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
      async handleNodeClick(data, node) {
        this.queryForm.workGroupName = data.label
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
      // async getAllAxios() {
      //   console.log(process.env)
      //   this.$baseColorfullLoading(
      //     1,
      //     this.$translateTitle('home.messag_loding')
      //   )
      //   // （1）如果列为主键，count(列名)效率优于count(1)
      //   // （2）如果列不为主键，count(1)效率优于count(列名)
      //   // （3）如果表中存在主键，count(主键列名)效率最优
      //   // （4）如果表中只有一列，则count(*)效率最优
      //   // （5）如果表有多列，且不存在主键，则count(1)效率优于count(*)
      //   let params = {
      //     // count: 'objectId',
      //     count: 'objectId',
      //     limit: 1,
      //     skip: 0,
      //     where: {},
      //   }
      //   const res = await this.$moreHttp({
      //     dev_num: await dev_count(params),
      //     app_num: await app_count(params),
      //     projectList: await app_count({
      //       limit: 30,
      //     }),
      //     Product_num: await product_count(params),
      //     Project_num: await Project_count(params),
      //     dev_active_num: await dev_active_count(
      //       Object.assign(params, {
      //         where: {
      //           status: 'ACTIVE',
      //         },
      //       })
      //     ),
      //     dev_online_num: await dev_online_count(
      //       Object.assign(params, {
      //         where: {
      //           status: 'ONLINE',
      //         },
      //       })
      //     ),
      //   })
      //   const {
      //     dev_num = { count: 0 },
      //     Product_num = { count: 0 },
      //     Project_num = { count: 0 },
      //     app_num = { count: 0 },
      //     dev_active_num = { count: 0 },
      //     dev_online_num = { count: 0 },
      //     projectList = { results: {} },
      //   } = res
      //   this.$baseColorfullLoading().close()
      //   console.log(res)
      //   console.log(dev_online_num)
      //   this.dev_count = dev_num.count || 0
      //   this.product_count = Product_num.count
      //   this.project_count = Project_num.count
      //   this.app_count = app_num.count
      //   this.projectList = projectList.results
      //   this.dev_active_count = dev_active_num.count
      //   this.dev_online_count = dev_online_num.count
      // },
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
      height: 40px;
      .workGroupTreeShow {
        height: 100px;
        overflow: auto;
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
      margin: 5px;
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
      font-size: 14px;
      font-weight: bolder;
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
