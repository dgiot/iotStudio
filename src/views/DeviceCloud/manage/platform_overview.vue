<!--
 * @Author: h7ml
 * @Date: 2021-02-02 17:52:06
 * @LastEditTime: 2021-03-15 12:42:33
 * @LastEditors: h7ml
 * @Description: In User Settings Edit
 * @FilePath: \dgiot-dashboard\src\views\equipment_management\platform_overview.vue
-->
<template>
  <div class="home_index">
    <div ref="platform" class="platform" :style="{ width: screenWidth }">
      <div class="home_dialog">
        <el-dialog
          :append-to-body="true"
          :title="deviceInfo.name"
          :visible.sync="deviceFlag"
          width="100vh"
        >
          <info :devicedetail="deviceInfo" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="deviceFlag = false">
              {{ $translateTitle('developer.cancel') }}
            </el-button>
            <el-button type="primary" @click.native="deviceFlag = false">
              {{ $translateTitle('developer.determine') }}
            </el-button>
          </span>
        </el-dialog>
      </div>
      <!-- <div
        class="map_header"
        :style="{ height: queryForm.workGroupTreeShow ? '160px' : 'auto' }"
      >
        <div v-show="cardHeight != '0px'" class="map_card">
          <el-row>
            <el-col
              class="card-panel-col"
              :lg="6"
              :md="6"
              :sm="12"
              :xl="6"
              :xs="24"
            >
              <el-card
                v-loading="loadingConfig['product_count'] == false"
                class="box-card"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                element-loading-spinner="el-icon-loading"
                :element-loading-text="
                  $translateTitle('developer.Waitingtoreturn')
                "
              >
                <el-col :span="12">
                  <dgiot-icon icon="projector-fill" />
                </el-col>
                <el-col class="card-right" :span="12">
                  <router-link to="/dashboard/productlist">
                    <p>{{ $translateTitle('home.pro_count') }}</p>
                    <p>{{ _product_count }}</p>
                  </router-link>
                </el-col>
              </el-card>
            </el-col>
            <el-col
              class="card-panel-col"
              :lg="6"
              :md="6"
              :sm="12"
              :xl="6"
              :xs="24"
            >
              <el-card
                v-loading="loadingConfig['app_count'] == false"
                class="box-card"
                :element-loading-text="
                  $translateTitle('developer.Waitingtoreturn')
                "
              >
                <el-col :span="12">
                  <dgiot-icon icon="apps-fill" />
                </el-col>
                <el-col class="card-right" :span="12">
                  <router-link to="/roles/applicationManagement">
                    <p>{{ $translateTitle('home.app_count') }}</p>
                    <p>{{ _app_count }}</p>
                  </router-link>
                </el-col>
              </el-card>
            </el-col>
            <el-col
              class="card-panel-col"
              :lg="6"
              :md="6"
              :sm="12"
              :xl="6"
              :xs="24"
            >
              <el-card
                v-loading="loadingConfig['device_count'] == false"
                class="box-card"
                :element-loading-text="
                  $translateTitle('developer.Waitingtoreturn')
                "
              >
                <el-col :span="12">
                  <dgiot-icon icon="device-recover-fill" />
                </el-col>
                <el-col
                  class="card-right"
                  :span="12"
                  style="cursor: pointer"
                  @click.native="goDevice()"
                >
                  <p>{{ $translateTitle('home.dev_count') }}</p>
                  <p>{{ _dev_count }}</p>
                </el-col>
              </el-card>
            </el-col>
            <el-col
              class="card-panel-col"
              :lg="6"
              :md="6"
              :sm="12"
              :xl="6"
              :xs="24"
            >
              <el-card
                v-loading="loadingConfig['warn_count'] == false"
                class="box-card"
                :element-loading-text="
                  $translateTitle('developer.Waitingtoreturn')
                "
              >
                <el-col class="card-left" :span="12">
                  <dgiot-icon icon="projector-2-fill" />
                </el-col>
                <el-col class="card-right" :span="12">
                  <router-link to="/CloudOt/alarm">
                    <p>
                      {{ $translateTitle('equipment.Total number of alarms') }}
                    </p>
                    <p>{{ warnCount }}</p>
                  </router-link>
                </el-col>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div> -->
      <!-- 通用版本 -->
      <div v-if="homeScreen == 0" class="baidu_map">
        <el-card shadow="hover" style="height: 100%">
          <el-row v-show="mapType == 'baidu'" :row="24" style="height: 100%">
            <el-col :span="leftRow" style="height: 100%" :xs="24">
              <el-row :span="24" style="height: 100%">
                <div
                  class="chart_map"
                  style="position: relative; width: 100%; height: 100%"
                >
                  <div v-show="false" class="card_left">
                    <el-row class="card_left-row" :gutter="24">
                      <el-col class="card_left-row-col" :span="6">
                        <Card
                          class="card_left-row-col-card"
                          style="
                            background-color: #ffad33;
                            border-color: #ffad33;
                          "
                        >
                          <div style="text-align: center">
                            <Tag
                              checkable
                              color="warning"
                              style="background: rgb(255, 173, 51)"
                            >
                              {{ offlineData.length || 0 }}
                            </Tag>
                            <p>{{ $translateTitle('zetadevices.offline') }}</p>
                          </div>
                        </Card>
                      </el-col>
                      <el-col class="card_left-row-col" :offset="2" :span="6">
                        <Card
                          class="card_left-row-col-card"
                          style="
                            background-color: #19be6b;
                            border-color: #19be6b;
                          "
                        >
                          <div style="text-align: center">
                            <Tag
                              checkable
                              color="success"
                              style="background: rgb(25, 190, 107)"
                            >
                              {{ dev_online_count || 0 }}
                            </Tag>
                            <p>{{ $translateTitle('zetadevices.online') }}</p>
                          </div>
                        </Card>
                      </el-col>
                      <el-col class="card_left-row-col" :offset="2" :span="6">
                        <Card
                          class="card_left-row-col-card"
                          style="
                            background-color: #f16643;
                            border-color: #f16643;
                          "
                        >
                          <div style="text-align: center">
                            <Tag
                              checkable
                              color="error"
                              style="background: rgb(241, 102, 67)"
                            >
                              {{ warnCount }}
                            </Tag>
                          </div>
                          <p>
                            {{ $translateTitle('leftbar.alarms') }}
                          </p>
                        </Card>
                      </el-col>
                    </el-row>
                  </div>
                  <!-- <div
                  class="card"
                  style="position: absolute; right: 100px; z-index: 1000"
                >
                  <p
                    style="
                      margin: 0;
                      font-size: 18px;
                      color: #f16643;
                      text-align: center;
                    "
                  >
                    {{ $translateTitle('zetadevices.offline') }}
                  </p>
                  <Card
                    style="
                      width: 80px;
                      height: 80px;
                      color: #fff;
                      background-color: #ffad33;
                      border-color: #ffad33;
                      border-radius: 50%;
                      opacity: 0.89;
                    "
                  >
                    <div style="text-align: center">
                      <p>{{ offlineData.length || 0 }}</p>
                    </div>
                  </Card>
                  <p
                    style="
                      margin: 0;
                      font-size: 18px;
                      color: rgb(25, 190, 107);
                      text-align: center;
                    "
                  >
                    {{ $translateTitle('zetadevices.online') }}
                  </p>
                  <Card
                    style="
                      width: 80px;
                      height: 80px;
                      margin: 5px 0;
                      color: #fff;
                      background-color: #19be6b;
                      border-color: #19be6b;
                      border-radius: 50%;
                      opacity: 0.89;
                    "
                  >
                    <div style="text-align: center">
                      <p>{{ dev_online_count || 0 }}</p>
                    </div>
                  </Card>
                  <p
                    style="
                      margin: 0;
                      font-size: 18px;
                      color: rgb(241, 102, 67);
                      text-align: center;
                    "
                  >
                    {{ $translateTitle('leftbar.alarms') }}
                  </p>
                  <Card
                    style="
                      width: 80px;
                      height: 80px;
                      color: #fff;
                      background-color: #f16643;
                      border-color: #f16643;
                      border-radius: 50%;
                      opacity: 0.89;
                    "
                  >
                    <div style="text-align: center">
                      <p>{{ warnCount }}</p>
                    </div>
                  </Card>
                </div> -->
                  <baidu-map
                    id="baidu_map"
                    :ak="ak"
                    :center="center"
                    class="baidu_map"
                    :scroll-wheel-zoom="true"
                    :zoom="sizeZoom"
                    @ready="handler"
                  >
                    <div class="screen_top">
                      <div class="screen_top_item">
                        <router-link to="/dashboard/productlist">
                          <p>{{ $translateTitle('home.pro_count') }}</p>
                          <p style="color: #f8a75c">{{ _product_count }}</p>
                        </router-link>
                      </div>
                      <div class="screen_top_item">
                        <router-link to="/roles/applicationManagement">
                          <p>{{ $translateTitle('home.app_count') }}</p>
                          <p style="color: #efdb75">{{ _app_count }}</p>
                        </router-link>
                      </div>
                      <div class="screen_top_item" @click="goDevice()">
                        <p>{{ $translateTitle('home.dev_count') }}</p>
                        <p style="color: #03fcfa">{{ _dev_count }}</p>
                      </div>
                      <div class="screen_top_item">
                        <router-link to="/CloudOt/alarm">
                          <p>
                            {{
                              $translateTitle(
                                'equipment.Total number of alarms'
                              )
                            }}
                          </p>
                          <p style="color: #179fff">{{ warnCount }}</p>
                        </router-link>
                      </div>
                    </div>
                    <div class="screen_bottom">
                      <div class="screen_bottom_title">
                        {{ $translateTitle('equipment.list') }}
                      </div>
                      <screen-device :comp="comp" />
                    </div>
                    <div class="screen_right_center">
                      <div class="screen_right_center_top">工单列表</div>
                      <work-order :comp="comp" />
                    </div>
                    <div class="screen_left_center">
                      <div class="screen_left_center_top">告警列表</div>
                      <topo-caltable :comp="comp" />
                    </div>
                    <div class="screen_right_bottom">
                      <div class="screen_right_bottom_top">设备运行状况</div>
                      <ve-pie
                        :data="piechartData"
                        :extend="pieextend"
                        height="100%"
                        :settings="piechartSettings"
                        width="100%"
                      />
                    </div>
                    <bm-map-type
                      anchor="BMAP_ANCHOR_TOP_LEFT"
                      :map-types="['BMAP_HYBRID_MAP', 'BMAP_NORMAL_MAP']"
                    />
                    <!-- 'BMAP_NORMAL_MAP' -->
                    <!-- :map-style="{ style: 'midnight' }" -->
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
                      <el-button
                        class="ri-fullscreen-fill"
                        size="mini"
                        @click="toggleFull()"
                      />
                      <!--                    <bm-panorama-->
                      <!--                      anchor="BMAP_ANCHOR_TOP_LEFT"-->
                      <!--                      :offset="{ width: 500, height: 0 }"-->
                      <!--                    />-->
                      <bm-overview-map :is-open="true" />
                      <bm-scale :offset="{ width: 260, height: 0 }" />
                      <bm-city-list :offset="{ width: 330, height: 0 }" />
                      <!--                    <bm-map-type-->
                      <!--                      anchor="BMAP_ANCHOR_TOP_LEFT"-->
                      <!--                      :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"-->
                      <!--                      :offset="{ width: 400, height: 0 }"-->
                      <!--                    />-->
                    </bm-control>
                    <!--                  <div-->
                    <!--                    v-for="position in getPosition(_tableData)"-->
                    <!--                    v-show="sizeZoom <= 8"-->
                    <!--                    :key="position.objectId"-->
                    <!--                  >-->
                    <!--                    <bm-point-collection-->
                    <!--                      v-if="sizeZoom <= 8"-->
                    <!--                      color="red"-->
                    <!--                      :points="[position]"-->
                    <!--                      :shape="-->
                    <!--                        position.icon == 1-->
                    <!--                          ? 'BMAP_POINT_SHAPE_STAR'-->
                    <!--                          : 'BMAP_POINT_SHAPE_WATERDROP'-->
                    <!--                      "-->
                    <!--                      size="BMAP_POINT_SIZE_SMALL"-->
                    <!--                      @click="_goDevice(position)"-->
                    <!--                    />-->
                    <!--                  </div>-->
                    <bml-marker-clusterer :average-center="true">
                      <div v-for="(item, index) in _tableData" :key="index">
                        <bm-marker
                          :ref="'bm_info' + index"
                          :icon="{
                            url:
                              item.icon == 1
                                ? icoPath.icoPath1
                                : icoPath.icoPath2,
                            size: { width: 100, height: 100 },
                          }"
                          :position="{
                            lng: item.location.longitude,
                            lat: item.location.latitude,
                          }"
                          @click="showDeatils(item, index)"
                        >
                          <bm-info-window
                            :key="index"
                            :position="{
                              lng: item.location.longitude,
                              lat: item.location.latitude,
                            }"
                            :show="item.show"
                            style="display: none"
                            @close="closeInfo(item, index)"
                          >
                            <div
                              v-show="deviceInfo"
                              class="deviceInfo"
                              style="width: 400px"
                            >
                              <el-row :gutter="24">
                                <el-col :span="6">
                                  <el-image
                                    :preview-src-list="[`${productIco}`]"
                                    :src="productIco"
                                    style="width: 100px; height: 100px"
                                  >
                                    <div slot="error" class="image-slot">
                                      <i
                                        class="el-icon-picture-outline empty"
                                        style="width: 100px; height: 100px"
                                      ></i>
                                    </div>
                                  </el-image>
                                </el-col>
                                <el-col :span="18">
                                  <p :title="deviceInfo.name">
                                    {{
                                      $translateTitle('equipment.devicename')
                                    }}
                                    ： {{ deviceInfo.name }}
                                  </p>
                                  <p>
                                    {{ $translateTitle('equipment.address') }}
                                    ： {{ deviceInfo.address }}
                                  </p>
                                  <p>
                                    {{
                                      $translateTitle(
                                        'zetadevices.devicestatus'
                                      )
                                    }}
                                    ：
                                    <el-link
                                      :type="
                                        deviceInfo.status === 'ONLINE'
                                          ? 'success'
                                          : 'warning'
                                      "
                                      :underline="false"
                                    >
                                      {{
                                        deviceInfo.status === 'ONLINE'
                                          ? $translateTitle(
                                              'zetadevices.online'
                                            )
                                          : $translateTitle(
                                              'zetadevices.offline'
                                            )
                                      }}
                                    </el-link>
                                  </p>
                                  <p>
                                    <el-link
                                      type="primary"
                                      @click="goLink('real-time', item)"
                                    >
                                      {{
                                        $translateTitle(
                                          'product.Device Information'
                                        )
                                      }}
                                    </el-link>
                                  </p>
                                </el-col>
                              </el-row>
                            </div>
                          </bm-info-window>
                        </bm-marker>
                      </div>
                    </bml-marker-clusterer>
                    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
                    <bm-geolocation
                      anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
                      :auto-location="true"
                      :show-address-bar="true"
                      :show-zoom-info="true"
                    />
                  </baidu-map>
                </div>
              </el-row>
            </el-col>
            <el-col :span="24 - leftRow" :xs="24">
              <div class="home_card">
                <el-tabs v-model="activeName" @tab-click="resizeTheChart">
                  <el-tab-pane
                    :label="$translateTitle('home.info')"
                    name="first"
                  >
                    <div class="box-card">
                      <el-card>
                        <div slot="header" class="clearfix">
                          <el-button>
                            {{ $translateTitle('home.info') }}
                          </el-button>
                        </div>
                        <div>
                          <el-row :gutter="24">
                            <el-col :span="24">
                              <div class="grid-content bg-purple">
                                <el-table
                                  v-if="Product"
                                  :cell-style="{ 'text-align': 'center' }"
                                  :data="Product"
                                  :header-cell-style="{
                                    'text-align': 'center',
                                  }"
                                  :row-class-name="tableRowClassName"
                                  style="width: 100%"
                                >
                                  <el-table-column
                                    :label="$translateTitle('menu.icon')"
                                    width="60"
                                  >
                                    <template #default="{ row }">
                                      <el-image
                                        :preview-src-list="[`${row.icon}`]"
                                        :src="row.icon"
                                        style="width: 26px; height: 26px"
                                      >
                                        <div slot="error" class="image-slot">
                                          <i
                                            class="el-icon-picture-outline"
                                          ></i>
                                        </div>
                                      </el-image>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    :label="$translateTitle('task.productname')"
                                    prop="name"
                                    :show-overflow-tooltip="true"
                                    width="120"
                                  >
                                    <template #default="{ row }">
                                      <span @click="goDevice(row.name)">
                                        {{ row.name }}
                                      </span>
                                    </template>
                                  </el-table-column>

                                  <el-table-column
                                    :label="$translateTitle('home.dev_count')"
                                  >
                                    <template #default="{ row }">
                                      <span @click="goDevice(row.name)">
                                        {{ row.deviceChild.length }}
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

                    <el-col :md="24" :sm="24" :xl="24" :xs="24">
                      <el-card class="box-card">
                        <div slot="header" class="clearfix">
                          <span>
                            {{
                              $translateTitle('equipment.Equipment Overview')
                            }}
                          </span>
                          <el-button
                            icon="el-icon-refresh"
                            style="float: right; padding: 3px 0"
                            type="text"
                            @click="resizeTheChart()"
                          />
                        </div>
                        <div class="text item">
                          <dgiot-chart
                            ref="charts"
                            :data="_ChartStatus"
                            :data-empty="!ChartStatus.rows"
                            :extend="chartExtend"
                            height="160px"
                            :loading="loading"
                            :settings="chartSettings"
                            type="ring"
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
                          <el-badge class="item" :value="_dev_off_count">
                            <el-button
                              size="small"
                              @click="_goDevice('dev_unline')"
                            >
                              {{ $translateTitle('home.dev_unline') }}
                            </el-button>
                          </el-badge>
                        </div>
                        <div>
                          <el-row :gutter="24">
                            <el-col :span="24">
                              <div class="grid-content bg-purple">
                                <el-table
                                  :cell-style="{ 'text-align': 'center' }"
                                  class="_el-table"
                                  :data="_offlineData"
                                  :header-cell-style="{
                                    'text-align': 'center',
                                  }"
                                  :row-class-name="tableRowClassName"
                                  style="width: 100%"
                                >
                                  <el-table-column
                                    :label="
                                      $translateTitle('equipment.devicename')
                                    "
                                    prop="name"
                                  >
                                    <template #default="{ row }">
                                      <span
                                        :title="
                                          row.name +
                                          $translateTitle(
                                            'home.Last online Time'
                                          ) +
                                          row.updatedAt
                                        "
                                        @click="showInfo(row.objectId)"
                                      >
                                        {{ row.name }}
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
                          <el-badge class="item" :value="_dev_online_count">
                            <el-button
                              size="small"
                              @click="_goDevice('dev_online')"
                            >
                              {{ $translateTitle('home.dev_online') }}
                            </el-button>
                          </el-badge>
                        </div>
                        <div>
                          <el-row :gutter="24">
                            <el-col :span="24">
                              <div class="grid-content bg-purple">
                                <el-table
                                  :cell-style="{ 'text-align': 'center' }"
                                  class="_el-table"
                                  :data="_onlineData"
                                  :header-cell-style="{
                                    'text-align': 'center',
                                  }"
                                  :row-class-name="tableRowClassName"
                                  style="width: 100%"
                                >
                                  <el-table-column
                                    :label="
                                      $translateTitle('equipment.devicename')
                                    "
                                    prop="name"
                                  >
                                    <template #default="{ row }">
                                      <span
                                        :title="
                                          row.name +
                                          $translateTitle(
                                            'home.Last online Time'
                                          ) +
                                          row.updatedAt
                                        "
                                        @click="showInfo(row.objectId)"
                                      >
                                        {{ row.name }}
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
        </el-card>
      </div>
      <div v-else-if="homeScreen == 1" class="baidu_map bg_screen1">
        <!-- 顶部数量 -->
        <div class="screen_top">
          <div class="screen_top_item">
            <router-link to="/dashboard/productlist">
              <p>{{ $translateTitle('home.pro_count') }}</p>
              <p style="color: #f8a75c">{{ _product_count }}</p>
            </router-link>
          </div>
          <div class="screen_top_item">
            <router-link to="/roles/applicationManagement">
              <p>{{ $translateTitle('home.app_count') }}</p>
              <p style="color: #efdb75">{{ _app_count }}</p>
            </router-link>
          </div>
          <div class="screen_top_item" @click="goDevice()">
            <p>{{ $translateTitle('home.dev_count') }}</p>
            <p style="color: #03fcfa">{{ _dev_count }}</p>
          </div>
          <div class="screen_top_item">
            <router-link to="/CloudOt/alarm">
              <p>
                {{ $translateTitle('equipment.Total number of alarms') }}
              </p>
              <p style="color: #179fff">{{ warnCount }}</p>
            </router-link>
          </div>
        </div>
        <!-- 3d底图背景 -->

        <div
          id="screen_center_bg"
          class="screen_center_center"
          :style="{
            backgroundImage: 'url(' + background + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          }"
          @mouseenter="enter"
          @mouseleave="leave"
        ></div>
        <!-- 底部设备列表 -->
        <div class="screen_bottom">
          <div class="screen_bottom_title">
            {{ $translateTitle('equipment.list') }}
          </div>
          <screen-device :comp="comp" />
          <!-- <topo-caltable :comp="comp" /> -->
        </div>
        <!-- 右侧工单列表 -->
        <div class="screen_right_center">
          <div class="screen_right_center_top">工单列表</div>
          <work-order :comp="comp" />
        </div>
        <!-- 告警列表 -->
        <div class="screen_left_center">
          <div class="screen_left_center_top">告警列表</div>
          <topo-caltable :comp="comp" />
        </div>

        <!-- 饼图设备在线离线数 -->
        <div class="screen_right_bottom">
          <div class="screen_right_bottom_top">设备运行状况</div>
          <ve-pie
            :data="piechartData"
            :extend="pieextend"
            height="100%"
            :settings="piechartSettings"
            width="100%"
          />
        </div>
      </div>
      <div v-else-if="homeScreen == 2" class="baidu_map bg_screen1">
        <div class="screen_top">
          <div class="screen_top_item">
            <router-link to="/dashboard/productlist">
              <p>{{ $translateTitle('home.pro_count') }}</p>
              <p style="color: #f8a75c">{{ _product_count }}</p>
            </router-link>
          </div>
          <div class="screen_top_item">
            <router-link to="/roles/applicationManagement">
              <p>{{ $translateTitle('home.app_count') }}</p>
              <p style="color: #efdb75">{{ _app_count }}</p>
            </router-link>
          </div>
          <div class="screen_top_item" @click="goDevice()">
            <p>{{ $translateTitle('home.dev_count') }}</p>
            <p style="color: #03fcfa">{{ _dev_count }}</p>
          </div>
          <div class="screen_top_item">
            <router-link to="/CloudOt/alarm">
              <p>
                {{ $translateTitle('equipment.Total number of alarms') }}
              </p>
              <p style="color: #179fff">{{ warnCount }}</p>
            </router-link>
          </div>
        </div>
        <!-- 3d底图 -->
        <div
          id="screen_center_bg"
          class="screen_center_center"
          :style="{
            backgroundImage: 'url(' + background + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          }"
          @mouseenter="enter"
          @mouseleave="leave"
        ></div>
        <!-- 折线图设备在线离线数 -->
        <div class="screen_left_bottom">
          <div class="screen_left_bottom_top">数据分析</div>
          <div class="screen_left_bottom_ctt">
            <screen-line style="width: 100%; height: 100%" />
          </div>
        </div>
        <!-- 饼图设备在线离线数 -->
        <div class="screen_right_bottom">
          <div class="screen_right_bottom_top">设备运行状况</div>
          <ve-pie
            :data="piechartData"
            :extend="pieextend"
            height="100%"
            :settings="piechartSettings"
            width="100%"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import topoCaltable from './component/topocompvue/TopoCaltable'
  import ScreenDevice from './component/Screen/ScreenDevice'
  import WorkOrder from './component/Screen/WorkOrder'
  import ScreenLine from './component/Screen/ScreenLine'
  import { postTopic, deleteTopic } from '@/api/Dlink'
  import icoPath1 from '../../../../public/assets/images/Device/1.png'
  import icoPath2 from '../../../../public/assets/images/Device/2.png'
  import { queryProduct } from '@/api/Product'
  import { getDevice } from '@/api/Device'
  import { mapGetters, mapMutations } from 'vuex'
  import { getToken } from '@/api/Menu'
  import { Startdashboard } from '@/api/System/index'
  import { isBase64 } from '@/utils'
  import info from '@/components/Device/info'
  import { getDlinkJson } from '@/api/Dlink'
  import {
    BaiduMap,
    BmCityList,
    BmControl,
    BmGeolocation,
    BmInfoWindow,
    BmlMarkerClusterer,
    BmMapType,
    BmMarker,
    BmNavigation,
    BmOverviewMap,
    BmPanorama,
    BmScale,
    BmLabel,
    BmPointCollection,
  } from 'vue-baidu-map'
  import { secret } from '@/config/secret.config'

  window.dgiot.dgiotEnv = process.env
  export default {
    name: 'Home',
    components: {
      BmPointCollection,
      BmInfoWindow,
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
      topoCaltable,
      ScreenDevice,
      WorkOrder,
      ScreenLine,
    },
    data() {
      this.piechartSettings = {
        type: 'pie',
      }
      this.pieextend = {
        series: {
          type: 'pie',
          radius: ['20%', '50%'],
          center: ['50%', '50%'],
          itemStyle: {
            borderRadius: 2,
            borderColor: '#fff',
            borderWidth: 1,
          },
          // left: 10,
          // top: '-12%',
          // offsetY: 10,
          // showAllSymbol: true,
          // symbol: 'none', //去掉圆点
          // smooth: true,
        },
        legend: {
          left: 5,
          top: 5,
          textStyle: {
            color: '#fff',
          },
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        // grid: {
        //   left: 10,
        //   right: 0,
        //   top: 0,
        //   width: '96%',
        //   height: '90%',
        // },
      }

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
        homeScreen: 0, //大屏版本
        backgroundimage: '',
        piechartData: {
          columns: ['名称', '数量'],
          rows: [
            { 名称: '在线设备', 数量: 0 },
            { 名称: '离线设备', 数量: 0 },
          ],
        },
        comp: {
          height: 390,
        },
        queryParams: {},
        mapHeight: '800px',
        mapWidth: '800px',
        polyline: {
          editing: false,
          paths: [],
        },
        list: {
          toolbar: false,
          latitude: '31.551162',
          longitude: '120.260545',
          zoom: 15,
        },
        mapType: 'baidu',
        isShow: true,
        ak: this.$dgiot.secret.baidu.map,
        // ak: 'oW2UEhdth2tRbEE4FUpF9E5YVDCIPYih',
        // center:{ lng: 120.187273, lat: 30.334877 },
        center: {
          lng: 120.260545,
          lat: 31.551162,
        },
        icoPath: {
          icoPath1: icoPath1,
          icoPath2: icoPath2,
        },
        router: '',
        loadingConfig: {
          product_count: false,
          app_count: false,
          device_count: false,
          warn_count: false,
        },
        warnCount: 0,
        count: 0,
        productIco: '',
        ChartStatus: {
          columns: ['状态', '数量'],
          rows: [
            {
              状态: '在线',
              数量: 0,
            },
            {
              状态: '离线',
              数量: 0,
            },
          ],
        },
        clientId: 'dgiot_clientId_',
        infoWindow: {
          show: true,
          contents:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
        loading: true,
        marker: {},
        deviceFlag: false,
        deviceInfo: {
          detail: {},
        },
        Product: [],
        imgurl:
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        subtopic: '',
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
        leftRow: 24,
        treeDataValue: '',
        deptTreeData: [],
        show: false,
        // sizeZoom: 6,
        // https://img-blog.csdnimg.cn/20200429215931435.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0dhYnJpZWxfd2Vp,size_16,color_FFFFFF,t_70
        sizeZoom: 6,
        tableData: [],
        offlineData: [],
        onlineData: [],
        chartSetting: {
          yAxis: {
            type: 'value',
            minInterval: 1,
          },
        },
        msgtopic: '',
        NODE_ENV: process.env.NODE_ENV,
        category: [],
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
        screenWidth: '100%',
      }
    },
    computed: {
      ...mapGetters({
        objectId: 'user/objectId',
        roleTree: 'user/roleTree',
        collapse: 'settings/collapse',
        _Product: 'user/_Product',
        language: 'settings/language',
        _dev_count: 'dashboard/_dev_count',
        _project_count: 'dashboard/_project_count',
        _app_count: 'dashboard/_app_count',
        _product_count: 'dashboard/_product_count',
        token: 'user/token',
        _dev_online_count: 'dashboard/_dev_online_count', //在线设备
        _onlineData: 'dashboard/_onlineData',
        _dev_off_count: 'dashboard/_dev_off_count', //离线设备
        _offlineData: 'dashboard/_offlineData',
        _ChartStatus: 'dashboard/_ChartStatus',
        _tableData: 'dashboard/_tableData',
        _pcimg: 'dashboard/_pcimg',
        _role: 'acl/role',
        _mimg: 'dashboard/_mimg',
        mqttInfo: 'mqttDB/mqttInfo',
        treeFlag: 'settings/treeFlag',
      }),
    },
    watch: {
      treeFlag: {
        handler: function (newVal) {
          if (newVal) this.mapWidth = window.innerWidth * 0.77 + 'px'
          else this.mapWidth = window.innerWidth * 0.98 + 'px'
        },
        deep: true,
        limit: true,
      },
      sizeZoom: {
        handler: function (zoom) {
          console.log(`当前sizeZoom 为 ${zoom}`)
        },
        deep: true,
        limit: true,
      },
      _dev_online_count: {
        handler: function (newVal) {
          // console.log('这是在线数量', newVal)
          this.piechartData.rows[0]['数量'] = newVal
        },
        deep: true,
        limit: true,
      },
      _dev_off_count: {
        handler: function (newVal) {
          // console.log('这是离线数量', newVal)
          this.piechartData.rows[1]['数量'] = newVal
        },
        deep: true,
        limit: true,
      },
    },
    mounted() {
      let _this = this

      // 监听窗口发生变化
      // window.addEventListener('resize', function () {
      //   // console.log('变化了')
      //   // var dom = document.querySelector('.home_index')
      //   // _this.screenWidth = dom.offsetWidth + 'px'
      // })
      window.bh = ''
      window.kd = ''
      this.homeScreen = localStorage.getItem('homeScreen') || 0
      let background = localStorage.getItem('background') || ''
      this.background =
        background == ''
          ? '/assets/bg/screen_center.png'
          : this.$FileServe + background
      console.log('路径', this.$FileServe)
      this.piechartData.rows = [
        { 名称: '在线设备', 数量: this._dev_online_count },
        { 名称: '离线设备', 数量: this._dev_off_count },
      ]
      this.initMapHeight()
      // setTimeout(() => {
      //   this.queryParams.forEach((e) => {
      //     let key = e.vuekey
      //     this.loadingConfig[`${key}`] = false
      //   })
      // }, 1240)
      this.router = this.$dgiotBus.router(this.$route.fullPath)
      this.$dgiotBus.$off('qqMapClcik')
      this.$dgiotBus.$on('qqMapClcik', (ev) => {
        console.log(ev)
      })
      // dgiotlog.log(`global static url ${this._role}`)
      this.queryForm.account =
        this.language == 'zh' ? '全部产品' : 'All Products'
      this.initDgiotMqtt()
      //监听鼠标滚动
      // if (this.homeScreen == 1 || this.homeScreen == 2) {
      //   window.addEventListener('mousewheel', this.handleScroll, true)
      // }
      //初始化大屏宽度,延迟等待
      setTimeout(() => {
        var dom = document.querySelector('.home_index')
        this.screenWidth = dom.offsetWidth + 'px'
      }, 2000)
      // 监听窗口发生变化
      window.onresize = () => {
        return (() => {
          this.mapHeight = window.innerHeight * 0.8 + 'px'
          this.mapWidth = window.innerWidth * 0.98 + 'px'
          var dom = document.querySelector('.home_index')
          _this.screenWidth = dom.offsetWidth + 'px'
        })()
      }
    },
    async beforeDestroy() {
      //  取消订阅http请求写法,http需要在topic中加页面路由
      // await this.$unSubscribe(this.subtopic)
      // 取消订阅mqtt写法 2022-5-27 改为http写法
      // this.$dgiotBus.$emit('MqttUnbscribe', this.topicKey, this.subtopic)
    },

    activated() {
      // dgiotlog.log('keep-alive生效')
      this.resizeTheChart()
    }, //如果页面有keep-alive缓存功能，这个函数会触发
    destroyed() {
      this.resizeTheChart()
    },
    methods: {
      enter() {
        window.addEventListener('mousewheel', this.handleScroll, true)
      },
      leave() {
        window.removeEventListener('mousewheel', this.handleScroll, true)
      },
      handleScroll(e) {
        e = e || window.event
        var box1 = document.querySelector('.screen_center_center')
        // console.log('滚动了', e)
        //判断滚轮滚动方向
        //wheelDelta获取到鼠标滚动方向，向上滚是正值，向下是负值，但火狐不支持
        //event.detail火狐支持，向上为负值，向下为正值
        // return
        if (e.wheelDelta > 0 || e.detail < 0) {
          box1.style.width = box1.offsetWidth * 1.02 + 'px'
          box1.style.height = box1.offsetHeight * 1.02 + 'px'
        } else {
          box1.style.width = box1.offsetWidth * 0.98 + 'px'
          box1.style.height = box1.offsetHeight * 0.98 + 'px'
        }
      },
      async initMapHeight() {
        this.mapHeight = window.innerHeight * 0.7 + 'px'
        this.mapWidth = window.innerWidth * 0.98 + 'px'
      },
      /**
       *
       * @param BMap
       * @param map
       */
      handler({ BMap, map }) {
        console.log(BMap, map)
        map.setMapType(BMAP_HYBRID_MAP)
        // map.setMapStyleV2({ style: 'midnight' })
        // 自动获取展示的比例
        // var view = map.getViewport(eval(this._tableData))
        // this.sizeZoom = view.zoom;
        // this.center = view.center;
      },
      /**
       *
       * @param position
       * @returns {*}
       */
      getPosition(position) {
        position.forEach((p) => {
          p.lng = p.location.longitude
          p.lat = p.location.latitude
        })
        return position
      },
      /**
       *
       * @param
       * @returns
       */
      initDgiotMqtt() {
        this.setTreeFlag(false)
        // 页面加载完cdn 资源后执行。
        this.$nextTick(async () => {
          // await this.getProduct()
          await this.queryData()
        })
      },
      async getWarnCount(
        params = {
          count: 'objectId',
          where: {},
        }
      ) {
        params.where['createdAt'] = {
          $gt: {
            __type: 'Date',
            iso: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          },
        }
        params.where['updatedAt'] = {
          $lt: {
            __type: 'Date',
            iso: moment(new Date()).format('YYYY-MM-DD'),
          },
        }
        try {
          const { count = 0 } = await this.$query_object('Maintenance', params)
          this.warnCount = count
          // this.$message.success(`${res}`)
        } catch (error) {
          // dgiotlog.log(error)
          this.$baseMessage(`${error}`, 'error', 'dgiot-hey-message-error')
        }
      },
      toggleFull(e) {
        this.count++
        this.count % 2 == 0
          ? this.$exitFull('baidu_map')
          : this.$beFull('baidu_map')
        // dgiotlog.log(this.count, this.count % 2)
      },
      resizeTheChart() {
        this.loading = true
        let charts = this.$refs[`charts`]
        if (charts) {
          charts.$children[0].resize()
          // dgiotlog.log('重绘完成', charts)
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
        setTreeFlag: 'settings/setTreeFlag',
        resaveMqttInfo: 'mqttDB/resaveMqttInfo',
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
        // dgiotlog.log(row, 'deviceToDetail')
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
      getCategory(key) {
        // dgiotlog.log(key)
        let name = ''
        this.category.filter((item) => {
          if (item.type == key) {
            name = item.data.CategoryName
          }
        })
        return name
      },
      closeInfo(item, index) {
        item.show = false
        // this.$refs[`bm_info${index}`][0].$children[0].show = false
        // this.set_tableData(_.merge([], this._tableData))
        // this.$forceUpdate()
      },
      async showDeatils(row, index) {
        const loading = this.$baseColorfullLoading(0)
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
        loading.close()
        this.$refs[`bm_info${index}`][0].$children[0].show = true
        // dgiotlog.log(this.productIco, row, row.show, index, this.deviceInfo)
        // 延时加载
        // setTimeout(() => {
        //   loading.close()
        //   dgiotlog.info(this.$refs[`bm_info${index}`])
        //   this.$refs[`bm_info${index}`][0].$children[0].show = true
        //   // this.set_tableData(_.merge([], this._tableData))
        //   // this.$forceUpdate()
        // }, 1000)
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
      // printQueryInfo(value, mqttMsg) {
      //   this.queryParams.forEach((e) => {
      //     if (e.vuekey)
      //       console.log(`收到订阅${value}的消息${mqttMsg},查询参数为${mqttMsg}`)
      //   })
      // },
      mqttMsg(e) {
        let mqttMsg = isBase64(e) ? Base64.decode(e) : e
        let mqttMsgValue = JSON.parse(mqttMsg).value
        let key = JSON.parse(mqttMsg).vuekey
        //console.log(`收到${key}消息`)
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
            console.error(mqttMsgValue, 'mqttMsgValue')
            this.dev_off_count = mqttMsgValue.count
            this.offlineData = mqttMsgValue.results
            this.set_dev_off_count(this.dev_off_count)
            this.set_offlineData(this.offlineData)
            break
          case 'warn_count':
            this.warnCount = mqttMsgValue.count
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
            })
            // console.log('tableData', this.tableData)
            this.set_tableData(this.tableData)
            this.$forceUpdate()
            break
          case 'device_count':
            this.dev_count = mqttMsgValue.count
            this.set_dev_count(this.dev_count)
            break
          default:
            break
        }
        this.$forceUpdate()
      },
      toggleCard(height) {
        // dgiotlog.log('cardHeight', height)
        if (height != '0px') {
          $('.map_card').css({
            height: '0px',
          })
          this.cardHeight = '0px'
        } else {
          $('.map_card').css({
            height: '98px',
          })
          this.cardHeight = '98px'
        }
      },
      toggleLeftWidth(width) {
        // dgiotlog.log(width, 'width')
        if (width != '0px') {
          $('.dgiot-side-bar').css({
            width: '0px',
          })
          $('.dgiot-main').css({
            'margin-left': '0px',
          })
          this.leftWidth = '0px'
        } else {
          $('.dgiot-side-bar').css({
            width: '200px',
          })
          $('.dgiot-main').css({
            'margin-left': '200px',
          })
          this.leftWidth = '200px'
        }
      },
      selectProdChange(objectId) {
        // dgiotlog.log(objectId)
      },
      async queryData() {
        const { dashboard = {} } = await getDlinkJson('Dashboard')
        this.queryParams = dashboard
        // https://lbsyun.baidu.com/cms/jsapi/class/jsapi_reference.html#a3b22
        setTimeout(() => {
          this.queryParams.forEach((e) => {
            let key = e.vuekey
            this.loadingConfig[`${key}`] = true
          })
        }, 1240)
        // this.$dgiotBus.$emit('MqttSubscribe', {
        //   router: this.router,
        //   topic: this.subtopic,
        //   qos: 0,
        //   ttl: 1000 * 60 * 60 * 3,
        // })
        // console.log(this.queryParams, 'queryParams')
        const Startdashboardid = '32511dbfe5'
        await Startdashboard(this.queryParams, Startdashboardid)
        // 本地mqtt 存在问题,在请求4秒后手动关闭所有loading
        // await this.$subscribe(this.subtopic)
        //  改为后端订阅

        this.$dgiotBus.$on(
          this.$dgiotBus.getTopicKeyBypage('dashboard'),
          (res) => {
            const { payloadString } = res
            // console.log('home page topic data', payloadString)
            // console.log(res)
            this.mqttMsg(payloadString)
          }
        )
        this.$nextTick(() => {
          if (this.mapType == 'tencent') {
            this.setTreeFlag(false)
            if (this.$refs.qqmap.$children[0].qqmap) {
              console.clear()
              console.error(
                this.$refs.qqmap.$children[0],
                ' this.$refs.qqmap.$children[0].qqmap'
              )
              document.querySelector('.lngTips').style.display = 'none'
              window.qq.maps.event.addListener(
                this.$refs.qqmap.$children[0].qqmap,
                'mousemove',
                function (event) {
                  document.querySelector('.lngTips').style.display = 'none'
                }
              )
              var center = new window.qq.maps.LatLng(28.475997, 121.331121) //设置中心点坐标
              //设置infoWindow
              var infoWindow = new qq.maps.InfoWindow({
                map: this.$refs.qqmap.$children[0].qqmap,
                position: center,
                content:
                  '<div>' +
                  '<h3>国家水泵产品质量检验中心(浙江)\n</h3>' +
                  '<p>浙江省台州市温岭市迎宾大道温岭市泵业创新服务综合体\n</p>' +
                  '<img class="pic" style="width:320px" src="https://sv6.map.qq.com/mmthumb?svid=18091033131005101120600&amp;from=web">' +
                  '</div>',
              })
              infoWindow.open()
              this.$refs.qqmap.$children[0].qqmap.setZoom(18)
            }
          }
        })
      },
      async getProduct() {
        const { results } = await queryProduct({
          count: 'objectId',
          order: '-updatedAt',
          keys: 'name,icon',
          where: {
            // category: 'IotHub',
          },
        })
        results.unshift({
          name: this.language == 'zh' ? '全部产品' : 'All Products',
          objectId: '0',
        })
        this.set_Product(results)
      },
      change(e) {
        // dgiotlog.log(e)
        if (e) {
          $('.el-tree').css({
            height: '100px',
            display: 'block',
            'overflow-x': 'auto',
          })
        }
      },
      async handleNodeClick(data, node) {
        const aclRole = this._role.map((r) => {
          return r.name
        })
        $('.el-tree').css({
          height: '0px',
          display: 'none',
          'overflow-x': 'auto',
        })
        $('.el-select-dropdown').css({
          display: 'none',
        })
        this.queryForm.workGroupName = data.label
        this.treeDataValue = data.label
        // dgiotlog.log(this.treeDataValue)
        if (aclRole.includes(data.name)) {
          this.queryForm.access_token = this.token
        } else if (node.level != 1) {
          // 在这里获取点击厂家的session
          const { access_token = '' } = await getToken(data.name)
          this.queryForm.access_token = access_token
        } else {
          // dgiotlog.log(node.level, '登录的token', this.token)
          this.queryForm.access_token = this.token
        }
        this.queryForm.workGroupTreeShow = !this.queryForm.workGroupTreeShow

        // 点击的公司名
        const { name, objectId } = data
        this.curDepartmentId = objectId
      },
      handleChange() {},
      handleClickVisit(project) {
        this.$router.push({
          path: '/Topo',
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
      _goDevice(item) {
        this.$router.push({
          path: '/roles/editdevices',
          query: {
            deviceid: item.objectId,
            ischildren: 'false',
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
              path: '/Topo',
              query: {
                productid: this.deviceInfo.product.objectId,
                devaddr: this.deviceInfo.devaddr,
                deviceid: this.deviceInfo.objectId,
                type: 'device',
              },
            })
            break
          case 'video':
            const { basedata } = this.deviceInfo
            if (basedata?.videoSrc?.length) {
              this.$router.push({
                path: '/Tools/player',
                query: {
                  type: basedata.videoType || 'm3u8',
                  url: basedata.videoSrc,
                },
              })
            } else {
              this.$baseMessage(
                this.$translateTitle(
                  'equipment.The device is not bound to the video address yet'
                ),
                'info',
                'dgiot-hey-message-error'
              )
              return false
            }
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
  .home_index {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .platform {
    box-sizing: border-box;
    // width: 100%;
    height: 94vh;
    position: fixed;
    // height: calc(100vh - #{$base-top-bar-height}* 3 - 25px);
    padding: 10px 10px 2px 10px;
    background-size: 100%;
    .bg_screen1 {
      background: url('/assets/bg/pageBg.png') no-repeat;
      background-size: 100% 100%;
    }
    .baidu_map {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
      // position: absolute;
      .screen_top {
        position: absolute;
        width: 90%;
        height: 90px;
        z-index: 99;
        // background-color: #ea1e63;
        top: 1%;
        left: 5%;
        display: flex;
        .screen_top_item {
          width: 20%;
          margin-left: 5%;
          display: inline-block;
          vertical-align: top;
          display: flex;
          justify-content: center;
          align-items: center;
          background: url('/assets/images/topo/screen/card.png') no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
          p {
            display: inline-block;
            padding-top: 10px;
            height: 90px;
            line-height: 90px;
          }
          p:nth-child(1) {
            color: #fff;
            font-size: 18px;
            margin-right: 16px;
          }
          p:nth-child(2) {
            font-size: 30px;
            font-weight: bold;
            // padding-top: 20px;
            margin-right: 5px;
          }
        }
      }
      .screen_bottom {
        position: absolute;
        width: 80%;
        height: 38%;
        box-sizing: border-box;
        // background-color: #00142f;
        background: url('/assets/bg/bg_warning.png') no-repeat;
        background-size: 100% 100%;
        // background-color: #ea1e63;
        bottom: 4px;
        left: 4px;
        display: flex;
        .screen_bottom_title {
          position: absolute;
          left: 50%;
          top: -15px;
          width: 330px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          background: url('/assets/bg/bg_title1.png') no-repeat;
          background-size: 100% 100%;
          transform: translateX(-50%);
          font-size: 20px;
          color: #fff;
          z-index: 99999;
        }
      }
      //左下角折线图 23+2占比
      .screen_left_bottom {
        position: absolute;
        background-color: #00142f;
        width: 19%;
        height: 38%;
        box-sizing: border-box;
        bottom: 4px;
        left: 4px;
        background: url('/assets/bg/bg_warning.png') no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        .screen_left_bottom_top {
          background: url('/assets/bg/bg_title.png') no-repeat;
          background-size: 100% 100%;
          width: 100%;
          height: 40px;
          line-height: 40px;
          padding-left: 50px;
          font-weight: bold;
          color: #fff;
        }
        .screen_left_bottom_ctt {
          width: 100%;
          height: 100%;
        }
      }
      // 右下角饼图
      .screen_right_bottom {
        position: absolute;
        background-color: #00142f;
        width: 19%;
        height: 38%;
        box-sizing: border-box;
        bottom: 4px;
        right: 4px;
        background: url('/assets/bg/bg_warning.png') no-repeat;
        background-size: 100% 100%;
        .screen_right_bottom_top {
          background: url('/assets/bg/bg_title.png') no-repeat;
          background-size: 100% 100%;
          width: 100%;
          height: 40px;
          line-height: 40px;
          padding-left: 50px;
          font-weight: bold;
          color: #fff;
        }
      }
    }
    // 大屏组件定位样式
    .screen_center_center {
      position: absolute;
      // background-color: #00142f;
      width: 60%;
      height: 50%;
      box-sizing: border-box;
      top: 10%;
      left: 50%;
      transform: translateX(-50%) scale(1);
      // background: url('/assets/bg/screen_center.png') no-repeat;
      // background-size: 100% 100%;
    }
    .screen_left_center {
      position: absolute;
      background-color: #00142f;
      width: 19%;
      height: 38%;
      box-sizing: border-box;
      bottom: 40%;
      left: 4px;
      background: url('/assets/bg/bg_warning.png') no-repeat;
      background-size: 100% 100%;
      .screen_left_center_top {
        position: absolute;
        background: url('/assets/bg/bg_title.png') no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding-left: 50px;
        font-weight: bold;
        color: #fff;
      }
    }
    .screen_right_center {
      position: absolute;
      background-color: #00142f;
      width: 19%;
      height: 38%;
      box-sizing: border-box;
      bottom: 40%;
      right: 4px;
      background: url('/assets/bg/bg_warning.png') no-repeat;
      background-size: 100% 100%;
      .screen_right_center_top {
        position: absolute;
        background: url('/assets/bg/bg_title.png') no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding-left: 50px;
        font-weight: bold;
        color: #fff;
      }
    }
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

    .chart_map {
      .card_left {
        position: absolute;
        bottom: 60px;
        left: 10px;
        z-index: 1000;
        color: black;

        &-row {
          &-col {
            color: black;

            &-card {
              width: 40px;
              height: 40px;
              padding: 8px;
              color: #fff;
              color: black;
              border-radius: 50%;
              opacity: 0.89;

              ::v-deep .ivu-card-body {
                padding: 0 !important;

                p {
                  margin-top: 6px;
                  margin-left: -5px;
                  white-space: nowrap;
                }
              }
            }
          }
        }
      }

      .card {
        .ivu-card,
        .ivu-card-bordered {
          font-size: 18px;

          .ivu-card-body {
            div {
              display: flex;
              justify-content: center;

              //width: 40px;
              //height: 40px;
              p {
                margin: 8px 0 auto;
                font-size: 20px;
                text-align: center;
              }
            }
          }
        }
      }

      margin: 8px;
    }
    .el-card {
      width: 100%;
      height: 100%;
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
        //display: none;
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

      .card-panel-col .el-card {
        background: #2090ff !important;
        opacity: 0.7;
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
      white-space: nowrap;
    }

    .card-right p {
      font-size: 20px;
      color: #fff;
      white-space: nowrap;
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
  ::v-deep .el-card__body {
    height: 100%;
  }
</style>
