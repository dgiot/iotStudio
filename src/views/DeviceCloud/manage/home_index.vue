<template>
  <div class="comprehensive-table-container">
    <div class="dialog">
      <Modal
        v-model="topoFlag"
        class="wrap_konva"
        footer-hide
        :query="routerInfo.query"
        width="1200"
        @on-cancel="closeModal"
      >
        <span slot="title" v-if="false"></span>
        <span slot="footer" v-if="false"></span>
        <topopreview v-if="topoFlag" ref="topo" />
        <div v-if="vueFlag">
          <div
            v-for="(comp, index) in vueComponents"
            :key="index"
            class="vue_component"
            :style="{
              left: comp.x + 'px',
              top: comp.y + 'px',
              width: comp.width + 'px',
              height: comp.height + 'px',
            }"
          >
            <topo-line
              v-if="comp.type == 'line'"
              :comp="comp"
              :style="{
                width: comp.width + 'px',
                height: comp.height + 'px',
              }"
            />
            <topo-pie
              v-if="comp.type == 'pie'"
              :comp="comp"
              :style="{
                width: comp.width + 'px',
                height: comp.height + 'px',
              }"
            />
            <topo-caltable
              v-if="comp.type == 'carousel'"
              :comp="comp"
              :style="{
                width: comp.width + 'px',
                height: comp.height + 'px',
              }"
            />
            <topo-card
              v-if="comp.type == 'realcard'"
              :comp="comp"
              :style="{
                width: comp.width + 'px',
                height: comp.height + 'px',
              }"
            />
            <img
              v-if="comp.type == 'konvaimage'"
              :src="comp.src"
              :style="{
                width: comp.width + 'px',
                height: comp.height + 'px',
              }"
            />
          </div>
        </div>
      </Modal>

      <el-dialog
        append-to-body
        :before-close="handleCloseAmis"
        center
        top="5vh"
        :visible.sync="commandInfo.dialog"
        width="80%"
      >
        <el-tabs v-model="activeName">
          <el-tab-pane
            v-for="(item, index) in commandInfo.data"
            :key="index + 'i'"
            :label="item.title"
            :name="index + ''"
          >
            <dgiot-amis :schema="item.data" :show-help="false" />
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
      <el-dialog
        v-if="dialog_device"
        append-to-body
        :before-close="closeMap"
        class="map_dialog"
        title="安装位置"
        :visible.sync="dialog_device"
        width="60%"
      >
        <el-card>
          <label>
            关键词：
            <el-input v-model="map.keyword">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                style="cursor: pointer"
              ></i>
            </el-input>
          </label>
          <!--          <label>-->
          <!--            地区：-->
          <!--            <el-input v-model="map.location" />-->
          <!--          </label>-->
          <label>
            安装位置：
            <el-input v-model="form.address">
              <i
                slot="suffix"
                class="el-icon-s-promotion"
                style="cursor: pointer"
                @click="map.innerVisible = !map.innerVisible"
              ></i>
            </el-input>
          </label>
          <baidu-map
            :ak="$dgiot.secret.baidu.map"
            :center="{ lng: mapLabel.position.lng, lat: mapLabel.position.lat }"
            :map-click="false"
            :scroll-wheel-zoom="true"
            style="height: 300px"
            :style="{ height: mapHeight, width: mapWidth }"
            :zoom="15"
            @click="mapClick"
          >
            <bm-view class="map" />
            <bm-local-search
              :auto-viewport="true"
              :keyword="map.keyword"
              :location="map.location"
            />
            <bm-control>
              <bm-panorama
                anchor="BMAP_ANCHOR_TOP_LEFT"
                :offset="{ width: 500, height: 0 }"
              />
              <bm-overview-map :is-open="true" />
              <bm-scale :offset="{ width: 260, height: 0 }" />
              <bm-city-list :offset="{ width: 330, height: 0 }" />
              <bm-map-type
                anchor="BMAP_ANCHOR_TOP_LEFT"
                :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
                :offset="{ width: 400, height: 0 }"
              />
            </bm-control>
            <bml-marker-clusterer>
              <!-- latitude: '120.161324',
          longitude: '30.262441', -->
              <bm-marker
                :position="{
                  lng: location.longitude,
                  lat: location.latitude,
                }"
              />
              <!-- <bm-label>1</bm-label> -->
            </bml-marker-clusterer>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
            <bm-geolocation
              anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
              :auto-location="true"
              :show-address-bar="true"
              :show-zoom-info="true"
            />
          </baidu-map>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog_device = false">取 消</el-button>
          <el-button type="primary" @click="editMap">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :append-to-body="true"
        top="5vh"
        :visible.sync="popoverVisible"
        width="40vh"
      >
        <div class="deviceTree">
          <p style="text-align: center">
            {{ $translateTitle('developer.Company') }} :
            {{ deciceCompany }}
          </p>
          <el-tree
            :data="roleTree"
            default-expand-all
            :expand-on-click-node="false"
            node-key="index"
            :props="roleProps"
          >
            <!-- @node-click="handleNodeClick" -->
            <!-- eslint-disable-next-line -->
            <div slot-scope="{ node, data }" class="custom-tree-node">
              <span
                :class="{
                  selected: data.objectId == curDepartmentId,
                }"
                @click="transferAcl(data)"
              >
                {{ node.label }}
              </span>
            </div>
          </el-tree>
        </div>
      </el-dialog>
      <dgiot-dialog
        :show.sync="form.sync"
        :title="form.type == 'add' ? '添加设备' : '修改设备：' + form.name"
        width="60%"
        @beforeClose="handleClose"
      >
        <dgiot-dialog append-to-body :show.sync="map.innerVisible" width="55%">
          <label>
            关键词：
            <el-input v-model="map.keyword">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                style="cursor: pointer"
              ></i>
            </el-input>
          </label>
          <!--          <label>-->
          <!--            地区：-->
          <!--            <el-input v-model="map.location" />-->
          <!--          </label>-->
          <label>
            安装位置：
            <el-input v-model="form.address">
              <i
                slot="suffix"
                class="el-icon-s-promotion"
                style="cursor: pointer"
                @click="map.innerVisible = !map.innerVisible"
              ></i>
            </el-input>
          </label>
          <baidu-map
            v-if="map.innerVisible"
            :ak="$dgiot.secret.baidu.map"
            :center="{ lng: 116.404, lat: 39.915 }"
            :map-click="false"
            :scroll-wheel-zoom="true"
            style="height: 300px"
            :style="{ height: mapHeight, width: mapWidth }"
            :zoom="15"
            @click="mapClick"
          >
            <bml-marker-clusterer>
              <bm-marker />
              <bm-label />
            </bml-marker-clusterer>
            <bm-view class="map" />
            <bm-local-search
              :auto-viewport="true"
              :keyword="map.keyword"
              :location="map.location"
            />
            <bm-control>
              <bm-panorama
                anchor="BMAP_ANCHOR_TOP_LEFT"
                :offset="{ width: 500, height: 0 }"
              />
              <bm-overview-map :is-open="true" />
              <bm-scale :offset="{ width: 260, height: 0 }" />
              <bm-city-list :offset="{ width: 330, height: 0 }" />
              <bm-map-type
                anchor="BMAP_ANCHOR_TOP_LEFT"
                :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
                :offset="{ width: 400, height: 0 }"
              />
            </bm-control>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
            <bm-geolocation
              anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
              :auto-location="true"
              :show-address-bar="true"
              :show-zoom-info="true"
            />
          </baidu-map>
        </dgiot-dialog>
        <el-form
          ref="form"
          class="demo-form"
          label-width="100px"
          :model="form"
          :rules="rules"
        >
          <el-form-item label="所属部门">
            <el-input v-model="currentDepartment.name" disabled readonly />
          </el-form-item>
          <el-form-item label="所属产品" prop="product">
            <el-select
              v-model="form.product"
              clearable
              :disabled="form.type == 'edit' ? true : false"
              placeholder="请选择产品"
              style="width: 100%"
              @change="selectChange"
            >
              <el-option
                v-for="item in product"
                :key="item.objectId"
                :label="item.name"
                :value="item.objectId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备地址" prop="devaddr">
            <el-input
              v-model="form.devaddr"
              :disabled="form.type == 'edit' ? true : false"
              placeholder="请输入设备地址"
            />
          </el-form-item>
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入设备名称" />
          </el-form-item>
          <el-form-item label="资产编号">
            <el-input
              v-model="form.detail.assetNum"
              placeholder="请输入资产编号"
            />
          </el-form-item>
          <el-form-item
            :label="$translateTitle('Maintenance.maintenance_personnel')"
          >
            <el-cascader
              ref="myCascader"
              v-model="form.detail.executor"
              :options="user"
              :placeholder="
                $translateTitle('Maintenance.selectmaintenance_personnel')
              "
              :show-all-levels="false"
              style="width: 100%"
              @change="handleChangeExecutor"
            />
          </el-form-item>
          <el-form-item label="安装位置" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请选择安装位置"
              @focus="map.innerVisible = !map.innerVisible"
            >
              <i
                slot="suffix"
                class="el-icon-s-promotion"
                style="cursor: pointer"
              ></i>
            </el-input>
          </el-form-item>
          <el-form-item label="到期时间">
            <el-date-picker
              v-model="form.detail.expirationTime"
              placeholder="选择日期："
              style="width: 100%"
              type="date"
              value-format="timestamp"
            />
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" @click="submitForm('form', form.type)">
              {{ form.type == 'add' ? '新建' : '修改' }}
            </el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </dgiot-dialog>
    </div>
    <dgiot-query-form>
      <dgiot-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="75px"
          :model="queryForm"
          size="mini"
          @submit.native.prevent
        >
          <el-form-item label="产品名称">
            <el-select
              v-model="queryForm.product"
              clearable
              placeholder="请选择产品"
              @change="handleQuery()"
            >
              <el-option
                v-for="item in product"
                :key="item.objectId + 'j'"
                :label="item.name"
                :value="item.objectId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="queryForm.search"
              class="input-with-select"
              placeholder="请输入查询参数"
              style="margin-left: 20px"
            >
              <el-select
                v-model="queryForm.type"
                clearable
                placeholder="请选择查询类型"
                style="width: 160px"
                slot="prepend"
              >
                <el-option label="设备名称" value="name" />
                <el-option label="资产编号" value="detail.assetNum" />
                <el-option label="设备地址" value="devaddr" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item v-show="!fold" label="状态">
            <el-select
              v-model="queryForm.status"
              clearable
              placeholder="请选择设备状态"
              @change="handleQuery()"
            >
              <el-option label="在线" value="ONLINE" />
              <el-option label="离线" value="OFFLINE" />
            </el-select>
          </el-form-item>
          <el-form-item v-show="!fold" label="开关机">
            <el-select
              v-model="queryForm.isEnable"
              clearable
              placeholder="请选择开关机状态"
              @change="handleQuery()"
            >
              <el-option label="开机" value="true" />
              <el-option label="关机" value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="运维人员">
            <el-cascader
              ref="myCascader1"
              v-model="queryForm.executor"
              :options="user"
              :placeholder="
                $translateTitle('Maintenance.selectmaintenance_personnel')
              "
              :show-all-levels="false"
              style="width: 100%"
              @change="handleQuery()"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="handleQuery"
            >
              查询
            </el-button>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click.native="handleAdd"
            >
              新增
            </el-button>
          </el-form-item>
        </el-form>
      </dgiot-query-form-top-panel>
    </dgiot-query-form>

    <el-table
      :key="upkey + 't'"
      ref="tableSort"
      v-loading="listLoading"
      border
      :data="list"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-spinner="el-icon-loading"
      :element-loading-text="$translateTitle('developer.Waitingtoreturn')"
      :gutter="20"
    >
      <el-table-column
        align="center"
        label="序号"
        show-overflow-tooltip
        sortable
        width="100"
      >
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="设备名称"
        prop="name"
        show-overflow-tooltip
        sortable
        width="auto"
      >
        <template slot="header">
          <span>设备名称</span>
          <el-tooltip placement="top" popper-class="tooltip">
            <i class="el-icon-edit-outline"></i>
            <div slot="content" class="tooltip-content">
              <div slot="content">点击修改设备名称</div>
            </div>
          </el-tooltip>
        </template>
        <template #default="{ row }">
          <el-form :model="row">
            <el-form-item size="mini" style="margin-bottom: 0">
              <el-input
                v-if="row.isEdit"
                v-model="row.name"
                v-focus
                size="mini"
                style="margin: 0 auto"
                @blur="blurEvent(row)"
                @focus="row.oldName = row.name"
              />
              <p
                v-else
                style="float: left; height: 8px"
                @click="row.isEdit = !row.isEdit"
                v-html="row.name"
              />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="设备地址"
        prop="devaddr"
        show-overflow-tooltip
        sortable
        width="120"
      />
      <!--      <el-table-column-->
      <!--        align="center"-->
      <!--        label="资产编号"-->
      <!--        prop="detail.assetNum"-->
      <!--        show-overflow-tooltip-->
      <!--        sortable-->
      <!--        width="120"-->
      <!--      />-->
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.maintenance_personnel')"
        prop="detail.executorname"
        show-overflow-tooltip
        sortable
        width="130"
      />
      <el-table-column
        align="center"
        label="安装位置"
        prop="address"
        show-overflow-tooltip
        sortable
        width="auto"
      >
        <template slot="header">
          <span>安装位置</span>
          <el-tooltip placement="top" popper-class="tooltip">
            <i class="el-icon-edit-outline"></i>
            <div slot="content">
              <div slot="content">点击修改安装位置</div>
            </div>
          </el-tooltip>
        </template>
        <template #default="{ row }">
          <span
            :key="row.address"
            style="color: #67c23a"
            type="success"
            @click="showAdddress(row)"
          >
            {{ row.address || row.detail.address || '---' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="所属产品"
        prop="product.objectId"
        show-overflow-tooltip
        sortable
        width="auto"
      >
        <template #default="{ row }">
          {{ getProductName(row.product.objectId) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="所属部门"
        prop="ACL"
        show-overflow-tooltip
        sortable
        width="auto"
      >
        <template #default="{ row }">
          <el-tag
            v-for="(item, index) in getAcl(row.ACL)"
            :key="index"
            effect="plain"
            :type="item"
          >
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态"
        prop="status"
        show-overflow-tooltip
        sortable
        width="220"
      >
        <template slot="header">
          <span>状态</span>
          <el-tooltip placement="top" popper-class="tooltip">
            <i class="el-icon-warning-outline"></i>
            <div slot="content" class="tooltip-content">
              <div slot="content">
                1. 开机关机属于网关子设备
                <br />
                2. 在线离线属于网关网络状态
                <br />
                3. 战时平时属于现场状态
              </div>
            </div>
          </el-tooltip>
        </template>
        <template #default="{ row, $index }">
          <el-tag :type="row.isEnable ? 'info' : 'danger'">
            {{ row.isEnable == true ? '开机' : '关机' }}
          </el-tag>
          <el-tag :type="row.status == 'ONLINE' ? 'success' : 'warning'">
            {{ row.status == 'ONLINE' ? '在线' : '离线' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="最后更新时间"
        show-overflow-tooltip
        sortable
        width="160"
      >
        <template #default="{ row }">
          {{
            row.lastOnlineTime
              ? $moment.unix(row.lastOnlineTime).format('YYYY-MM-DD HH:mm:ss')
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        :label="$translateTitle('developer.operation')"
        width="260"
      >
        <template #default="{ row }">
          <el-button size="mini" type="text" @click="konvaDevice(row)">
            设备面板
          </el-button>
          <el-button size="mini" type="text" @click="info(row)">
            设备信息
          </el-button>
          <el-button size="mini" type="text" @click="command(row)">
            控制
          </el-button>
          <!--          <el-button size="mini" type="text" @click="konvaDevice(row)">-->
          <!--            {{ $translateTitle('concentrator.konva') }}-->
          <!--          </el-button>-->
          <el-button
            size="mini"
            style="margin-left: 10px"
            type="text"
            @click="deviceToDetail(row)"
          >
            {{ $translateTitle('product.details') }}
          </el-button>
          <a-dropdown style="margin-left: 10px">
            <a class="el-icon-more" @click.prevent></a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <el-button size="mini" type="text" @click="handleEdit(row)">
                    修改
                  </el-button>
                </a-menu-item>
                <a-menu-item>
                  <el-button
                    size="mini"
                    type="text"
                    @click="showTree(row, row.objectId, row.Company)"
                  >
                    {{ $translateTitle('equipment.move') }}
                  </el-button>
                </a-menu-item>
                <a-menu-item>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleDelete(row.objectId, 2)"
                  >
                    {{ $translateTitle('developer.delete') }}
                  </el-button>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :key="paginationKey"
      background
      :current-page="queryForm.size"
      :layout="layout"
      :page-size="queryForm.limit"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import {
    putDevice,
    querycompanyDevice,
    postDevice,
    delDevice,
  } from '@/api/Device'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'
  import { getProduct, queryProduct } from '@/api/Product'
  import { userTree } from '@/api/User'
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
    BmView,
    BmLocalSearch,
    BmPointCollection,
  } from 'vue-baidu-map'
  import info from '@/components/Device/info'
  import topoLine from './component/topocompvue/TopoLine'
  import topoPie from './component/topocompvue/TopoPie'
  import topoCaltable from './component/topocompvue/TopoCaltable'
  import topoCard from './component/topocompvue/TopoCard'
  import { putView, queryView } from '@/api/View'
  import topopreview from '@/views/CloudFunction/topo/index'
  export default {
    name: 'Device',
    components: {
      topopreview,
      TableEdit,
      BmLocalSearch,
      BmPointCollection,
      BmInfoWindow,
      BmScale,
      BmMapType,
      BmView,
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
      topoLine, //vuetopocomp
      topoPie,
      topoCaltable,
      topoCard,
    },
    data() {
      return {
        location: {
          __type: 'GeoPoint',
          latitude: '120.161324',
          longitude: '30.262441',
        },
        position: {
          lat: '120.161324',
          lng: '30.262441',
        },
        productDetail: {},
        activeName: '0',
        vueComponents: [],
        vueFlag: false,
        commandInfo: {
          dialog: false,
          data: {},
        },
        settingInfo: {
          dialog: false,
        },
        statisticsInfo: {
          dialog: false,
        },
        moveInfo: {
          dialog: false,
        },
        topoFlag: false,
        routerInfo: {},
        paginationKey: moment(new Date()).valueOf() + '',
        upkey: moment(new Date()).valueOf() + '',
        dialog_device: false,
        mapLabel: {
          content: '我爱北京天安门',
          style: {
            color: 'red',
            fontSize: '24px',
          },
          position: {
            lng: 116.404,
            lat: 39.915,
          },
          title: '我爱北京天安门',
        },
        bmLabel: false,
        popoverVisible: false,
        deciceCompany: '',
        roleProps: {
          children: 'children',
          label: 'name',
        },
        curDepartmentId: '',
        mapHeight: '300px',
        mapWidth: '100%',
        map: {
          innerVisible: false,
          keyword: '余杭区良渚平高创业城c1座',
          location: '杭州',
        },
        user: [],
        form: {
          sync: false,
          type: 'add',
          product: '',
          name: '',
          devaddr: '',
          address: '',
          location: {
            __type: 'GeoPoint',
            latitude: '120.161324',
            longitude: '30.262441',
          },
          detail: { assetNum: '', expirationTime: moment().format('x') },
        },
        rules: {
          name: [
            { required: true, message: '请输入设备名称', trigger: 'blur' },
          ],
          product: [
            { required: true, message: '请选择所属产品', trigger: 'change' },
          ],
          devaddr: [
            { required: true, message: '请输入设备编号', trigger: 'change' },
          ],
          address: [
            {
              required: false,
              message: '请选择设备安装位置',
              trigger: 'change',
            },
          ],
          'detail.assetNum': [
            { required: true, message: '请输入资产编号', trigger: 'blur' },
          ],
        },
        product: [],
        editRow: {},
        fold: false,
        height: this.$baseTableHeight(0),
        imgShow: true,
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          type: 'name',
          excludeKeys:
            'channel,children,config,thing,decoder,data,basedata,content',
          include: 'product',
          product: this.$route.query.product ? this.$route.query.product : '',
          title: '',
          name: '',
          isEnable: this.$route.query.isEnable
            ? this.$route.query.isEnable
            : '',
          devaddr: '',
          all: true,
          status: this.$route.query.status ? this.$route.query.status : '',
          skip: 0,
          limit: 10,
          state: '',
        },
      }
    },
    computed: {
      ...mapGetters({
        routes: 'routes/routes',
        _tableDict: 'global/_tableDict',
        token: 'user/token',
        roleTree: 'user/roleTree',
        language: 'settings/language',
        _product: 'user/_Product',
        _role: 'acl/role',
        currentDepartment: 'user/currentDepartment',
      }),
    },
    created() {
      this.fetchProduct()
      this.fetchData()
    },
    mounted() {
      this.roleuser()
      this.vueComponents = []
      this.vueFlag = false
      this.$dgiotBus.$off('vueComponent')
      this.$dgiotBus.$on('vueComponent', async (list, flag) => {
        this.vueComponents = list
        this.vueFlag = flag
      })
    },
    methods: {
      ...mapActions({
        addVisitedRoute: 'tabs/addVisitedRoute',
        changeTabsMeta: 'tabs/changeTabsMeta',
        set_tableDict: 'global/set_tableDict',
        set_tableParser: 'global/set_tableParser',
      }),
      async blurEvent(row) {
        row.isEdit = !row.isEdit
        if (row.name !== row.oldName) {
          await putDevice(row.objectId, {
            name: row.name,
          })
          this.$message({
            message: '设备名称修改成功',
            type: 'success',
            showClose: true,
            duration: 1500,
          })
        }
      },
      async info(row) {
        localStorage.setItem('parse_objectid', row.objectId)
        localStorage.setItem('product_objectid', row.product.objectId)
        const { results = [] } = await queryView({
          where: {
            class: 'Product',
            type: 'deviceInfo',
            key: row.product.objectId,
          },
        })
        if (_.isEmpty(results)) {
          this.$baseMessage(
            '暂未配置下发控制表单',
            'info',
            'dgiot-hey-message-error'
          )
          return false
        } else {
          this.commandInfo.dialog = true
          this.commandInfo.data = results
        }
      },
      async command(row) {
        localStorage.setItem('parse_objectid', row.objectId)
        localStorage.setItem('product_objectid', row.product.objectId)
        const { results = [] } = await queryView({
          where: {
            class: 'Product',
            type: {
              $in: ['amis', 'profile', 'content', 'Amis', 'Profile', 'Content'],
            },
            key: row.product.objectId,
          },
        })
        if (_.isEmpty(results)) {
          this.$baseMessage(
            '暂未配置下发控制表单',
            'info',
            'dgiot-hey-message-error'
          )
          return false
        } else {
          this.commandInfo.dialog = true
          this.commandInfo.data = results
        }
      },
      async editMap() {
        const mapInfo = {
          location: this.location,
          address: this.form.address,
        }
        await putDevice(this.editRow.objectId, mapInfo)
        this.dialog_device = false
        this.$message({
          message: '设备位置更新成功',
          showClose: true,
          type: 'success',
        })
        this.fetchData()
      },
      closeMap() {
        this.dialog_device = false
        this.map = {
          innerVisible: false,
          keyword: '余杭区良渚平高创业城c1座',
          location: '杭州',
        }
        this.mapLabel = {
          content: '我爱北京天安门',
          style: {
            color: 'red',
            fontSize: '24px',
          },
          position: {
            lng: 116.404,
            lat: 39.915,
          },
          title: '我爱北京天安门',
        }
      },
      showAdddress(item) {
        this.editRow = item
        this.map.keyword = '' //item?.address ? item.address : this.map.keyword
        this.form.address = item?.address ? item.address : this.form.keyword
        let position = {
          lng: Number(item.location.longitude),
          lat: Number(item.location.latitude),
        }
        this.location = {
          __type: 'GeoPoint',
          latitude: Number(item.location.latitude),
          longitude: Number(item.location.longitude),
        }
        console.log('this.location', this.location)
        this.mapLabel = {
          content: item.name,
          style: {
            color: 'red',
            fontSize: '12px',
          },
          position: position,
          title: item.address,
        }
        this.bmLabel = true
        this.dialog_device = true
      },
      // 迁移设备
      transferAcl(data) {
        const aclKey1 = 'role' + ':' + data.name
        const aclObj = {}
        aclObj[aclKey1] = {
          read: true,
          write: true,
        }
        const parmas = {
          ACL: aclObj,
        }
        this.$confirm(
          this.$translateTitle(`确定要将设备迁移到` + data.name + '吗'),
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(async () => {
          await putDevice(this.editRow.objectId, parmas)
          this.$message({
            showClose: true,
            type: 'success',
            message: this.$translateTitle(`迁移成功`),
          })
          this.popoverVisible = false
          this.fetchData()
        })
        dgiotlog.log(data.name)
      },
      // 显示菜单树
      showTree(row, objectId, acl) {
        this.editRow = row
        this.deciceCompany = acl
        this.popoverVisible = !this.popoverVisible
      },
      // 二次删除确认
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-28 15:36:08
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      handleDelete(objectId) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          await delDevice(objectId)
          this.$baseMessage(
            '设备已成功删除',
            'success',
            'dgiot-hey-message-success'
          )
          await this.fetchData()
        })
      },
      handler({ BMap, map }) {
        // this.center.lng = 120.2
        // this.center.lat = 30.26667
        // this.zoom = this.zoom
        this.map = map
      },
      mapClick(e) {
        this.location = {
          __type: 'GeoPoint',
          latitude: e.point.lat,
          longitude: e.point.lng,
        }
        // this.center.lng = e.point.lng
        // this.center.lat = e.point.lat
        // this.addresspointer =
        //   e.point.lng.toFixed(6) + ',' + e.point.lat.toFixed(6)
        const geocoder = new BMap.Geocoder() // 创建地址解析器的实例
        //  let Marker = new BMap.Marker()
        geocoder.getLocation(e.point, (rs) => {
          console.log('rs', rs, rs.surroundingPois.length)
          let title =
            rs.surroundingPois.length >= 1 ? rs.surroundingPois[0].title : ''
          this.form.address = rs.address + title

          // this.add.site = rs.address;
          //  Marker.closeInfoWindow()
          //   dgiotlog.log(rs)
          // this.bmapform.address = rs.address
          // this.deviceform.address = rs.address
          // this.imeiform.address = rs.address
          // 地址描述(string)=
          // dgiotlog.log(rs.address);    //这里打印可以看到里面的详细地址信息，可以根据需求选择想要的
          // dgiotlog.log(rs.addressComponents);//结构化的地址描述(object)
          // dgiotlog.log(rs.addressComponents.province); //省
          // dgiotlog.log(rs.addressComponents.city); //城市
          // dgiotlog.log(rs.addressComponents.district); //区县
          // dgiotlog.log(rs.addressComponents.street); //街道
          // dgiotlog.log(rs.addressComponents.streetNumber); //门牌号
          // dgiotlog.log(rs.surroundingPois); //附近的POI点(array)
          // dgiotlog.log(rs.business); //商圈字段，代表此点所属的商圈(string)
        })
        if (this.editRow.objectId) {
          this.editRow.location = this.location
          this.editRow.address = this.form.address
        }
      },
      getProductName(id) {
        let name = ''
        this.product.forEach((item) => {
          if (item.objectId === id) name = item.name
        })
        return name
      },
      async selectChange(productId) {
        getProduct(productId).then((res) => {
          this.productDetail = res
        })
      },
      submitForm(formName, type) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (type == 'add') {
              const aclKey = 'role' + ':' + this.currentDepartment.name
              const setAcl = {}
              setAcl[aclKey] = {
                read: true,
                write: true,
              }
              setAcl[this.form.detail.executorid] = {
                read: true,
                write: true,
              }
              const params = {
                name: this.form.name,
                devaddr: this.form.devaddr,
                address: this.form.address,
                location: this.location,
                detail: this.form.detail,
                ACL: setAcl,
                product: {
                  __type: 'Pointer',
                  className: 'Product',
                  objectId: this.form.product,
                },
                // profile: {},
                // route: {},
                isEnable: true,
                status: 'ONLINE',
                detail: {
                  executor: this.form.detail.executor,
                  executorid: this.form.detail.executorid,
                  executorname: this.form.detail.executorname,
                },
              }
              if (params.address == '') {
                delete params.address
                delete params.location
              }
              params.detail.devType = this.productDetail.devType
              params.detail.category = this.productDetail.category.objectId
              // console.log('params', params)
              const { error = '', objectId = '' } = await postDevice(params)
              if (error) {
                this.$message({
                  type: 'error',
                  message: error,
                  showClose: true,
                  duration: 2000,
                })
                return false
              } else {
                this.$message({
                  type: 'success',
                  message: '设备添加成功',
                  showClose: true,
                  duration: 2000,
                })
                this.form.sync = false
                // this.resetForm(formName)
                this.fetchData()
              }
            } else {
              const params = {
                name: this.form.name,
                address: this.form.address,
                location: this.location,
                detail: this.form.detail,
              }
              const { error = '' } = await putDevice(this.form.objectId, params)
              if (error) {
                this.$message({
                  type: 'error',
                  message: error,
                  showClose: true,
                  duration: 2000,
                })
                return false
              } else {
                this.$message({
                  type: 'success',
                  message: '设备信息修改成功',
                  showClose: true,
                  duration: 2000,
                })
                this.form.sync = false
                // this.resetForm(formName)
                this.fetchData()
              }
            }
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        console.log(formName)
        this.$refs[formName].resetFields()
      },
      async roleuser() {
        let params = {
          where: {
            objectId: this.currentDepartment.objectId,
          },
          include: true,
          limit: 10,
        }
        const res = await userTree()
        console.log('人员树', res)
        this.user = res.data.options
      },
      handleChangeExecutor(value) {
        this.form.detail.executorid =
          this.$refs.myCascader.getCheckedNodes()[0].value
        this.form.detail.executorname =
          this.$refs.myCascader.getCheckedNodes()[0].label
      },
      handleCloseAmis() {
        this.coordinate = {
          lng: 116.404,
          lat: 39.915,
        }
        this.dialog_device = false
        this.commandInfo.dialog = false
        this.fetchData(false)
      },
      handleClose(done) {
        this.form = {
          sync: false,
          type: 'add',
          product: '',
          name: '',
          devaddr: '',
          address: '',
          location: {
            __type: 'GeoPoint',
            latitude: '120.161324',
            longitude: '30.262441',
          },
          detail: { assetNum: '' },
        }
      },
      getAcl(ACL) {
        let name = []
        for (let a in ACL) {
          if (a == '*') {
            delete ACL[a]
          } else if (a.split(':')[1]) {
            name.push(a.split(':')[1])
          }
        }
        return name
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-4-27 21:33:23
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async handelUpdate(event, row, index) {
        var newData1 = {}
        var that = this
        for (var key in row) {
          newData1[key] = row[key]
        }
        newData1.isEnable = newData1.isEnable != true
        this.list[index] = newData1
        this.$confirm('是否修改此设备状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            await this.$update_object('Device', row.objectId, {
              isEnable: event,
            })
            this.$message({
              duration: 2000,
              showClose: true,
              type: 'info',
              message: '设备状态修改成功修改',
            })
            this.fetchData()
          })
          .catch(async () => {
            this.$message({
              duration: 2000,
              showClose: true,
              type: 'info',
              message: '已取消修改',
            })
            const newData = row
            newData.isEnable = newData.isEnable != true
            this.list[index] = newData
          })
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-27 20:45:36
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async fetchProduct() {
        try {
          const { results = [] } = await queryProduct({
            excludeKeys:
              'children,thing,decoder,topics,productSecret,desc,view,category,producttemplet',
          })
          this.product = results
        } catch (error) {}
      },
      // 设备编辑
      editorDevice(row) {
        this.editRow = row
        this.form = {
          sync: true,
          type: 'edit',
          product: row.product.objectId,
          name: row.name,
          devaddr: row.devaddr,
          address: row.address,
          location: row.detail,
          detail: row.detail,
        }
        this.map = {
          innerVisible: false,
          keyword: row.address ? row.address : '余杭区良渚平高创业城c1座',
          location: '杭州',
        }
      },
      // 设备详情
      deviceToDetail(row) {
        this.$router.push({
          path: '/roles/editdevices',
          query: {
            deviceid: row.objectId,
            nodeType: row.nodeType,
            productid: row.product.objectId,
            ischildren: 'false',
          },
        })
      },
      async closeModal() {
        this.$router.go(-1)
        this.topoFlag = false
        this.vueFlag = false
      },
      // 组态
      konvaDevice(row) {
        this.topoFlag = true
        this.$router.push({
          path: '/dashboard/devicelist', // /roles/konvadetail  /dashboard/devicelist 原页面
          query: {
            productid: row.product.objectId,
            devaddr: row.devaddr,
            deviceid: row.objectId,
            type: 'device',
          },
        })
      },
      handleAdd() {
        this.form.type = 'add'
        this.form.sync = true
        // this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        // this.form = row
        for (let i in row) {
          this.form[i] = row[i]
          console.log(i)
        }
        // this.$set(this.form, 'detail.executor', row.detail.executor)
        this.form.type = 'edit'
        console.log(this.form)
        this.form.sync = true
        // this.roleuser()
        // this.$refs['edit'].showEdit(row)
      },
      handleDetail(row) {},
      handleSizeChange(val) {
        this.queryForm.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.skip = Number(val - 1) * Number(this.queryForm.limit)
        this.fetchData()
      },
      async handleQuery() {
        this.queryForm.limit = 20
        this.queryForm.skip = 0
        this.paginationKey = moment(new Date()).valueOf() + ''
        await this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        let params = {
          skip: this.queryForm.skip,
          limit: this.queryForm.limit,
          excludeKeys: this.queryForm.excludeKeys,
          // include: this.queryForm.include,
          order: '-createdAt',
          count: 'objectId',
          where: {},
        }
        this.queryForm.product
          ? (params.where.product = this.queryForm.product)
          : ''
        this.queryForm.search
          ? (params.where[this.queryForm.type] = {
              $regex: this.queryForm.search,
            })
          : ''
        this.queryForm.status
          ? (params.where.status = this.queryForm.status)
          : ''
        this.queryForm.isEnable
          ? (params.where.isEnable = this.queryForm.isEnable)
          : ''
        this.queryForm.state ? (params.where.state = this.queryForm.state) : ''
        if (this.queryForm.executor) {
          params.where['detail.executorid'] =
            this.$refs.myCascader1.getCheckedNodes()[0].value
        }
        const { results: list = [], count: total = 0 } =
          await querycompanyDevice(params, this.token)
        list.forEach((item) => {
          item.address = item.address == '' ? '---' : item.address
          item.detail = item?.detail ? item.detail : {}
          item.detail.address =
            item?.detail && item?.detail?.address ? item.detail.address : '---'
          item.isEdit = false
          item.oldName = item.name
        })
        this.list = list
        this.total = total
        this.listLoading = false
        // 订阅处理所有的设备
        await this.subAllDevice()
      },
      async subAllDevice() {
        let _this = this
        // await _this.$subscribe('$dg/user/devicestate/#')
        // _this.$dgiotBus.$off('devicestate')
        _this.$dgiotBus.$on('$dg/user/devicestate', (Msg) => {
          let args = {}
          const parseString = JSON.parse(Msg.payloadString)
          if (parseString) {
            const topicsKeys = Object.keys(parseString)
            console.groupCollapsed(
              `%c收到devicestate消息 ${topicsKeys}`,
              'color:#009a61; font-size: 28px; font-weight: 300'
            )
            args.key = topicsKeys[0]
            args.parseString = parseString
            _this.list.forEach((t) => {
              topicsKeys.forEach((j) => {
                if (t.objectId == j) {
                  const mergeInfo = _.merge(t, parseString[j], {
                    detail: { address: parseString[j].address },
                  })
                  args.name = t.name
                  args.Info = parseString[j]
                  args.mergeInfo = mergeInfo
                  _this.upkey = moment(new Date()).valueOf() + ''
                }
              })
            })
          }
          console.info(args)
          console.groupEnd()
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .dialog-map,
  .map {
    display: block;
    width: 100%;
    height: 300px;
  }
  .wrap_konva {
    box-sizing: border-box !important;
    position: relative;
    .vue_component {
      position: absolute;
      z-index: 99999;
      // background-color: #0077b8;
    }
  }
</style>
