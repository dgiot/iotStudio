<template>
  <div class="equipment">
    <div class="equ_header">
      <ul>
        <li>
          <p>
            <span class="svg-container">
              <dgiot-icon icon="device-line" />
            </span>
            {{ $translateTitle('equipment.totalequipment') }}
            <el-tooltip
              :content="$translateTitle('equipment.totalequipment')"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </p>
          <span>{{ devicetotal }}</span>
        </li>
        <li>
          <p>
            <span class="svg-container">
              <dgiot-icon icon="numbers-line" />
            </span>
            {{ $translateTitle('equipment.activationdevice') }}
            <el-tooltip
              :content="$translateTitle('equipment.totalactive')"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </p>
          <span>{{ activeall }}</span>
        </li>
        <li>
          <p>
            <span class="svg-container">
              <dgiot-icon icon="contrast-drop-fill" />
            </span>
            {{ $translateTitle('equipment.onlinedevices') }}
            <el-tooltip
              :content="$translateTitle('equipment.totalonline')"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </p>
          <span>{{ onlineall }}</span>
        </li>
        <li>
          <div class="block">
            <el-image
              v-if="productimg"
              :src="productimg"
              style="
                position: relative;
                top: -55px;
                width: 250px;
                height: 200px;
                line-height: 200px;
                text-align: center;
              "
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
        </li>
      </ul>
    </div>
    <div class="equtabs">
      <!--tabs第一个标签页-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$translateTitle('route.设备管理')" name="first">
          <div>
            <div>
              <el-button size="small">
                {{ $translateTitle('equipment.batchaddition') }}
              </el-button>
              <el-button size="small" type="primary" @click="addDeviceForm">
                {{ $translateTitle('equipment.adddevice') }}
              </el-button>
            </div>
          </div>
          <div class="equdevices" style="margin-top: 20px">
            <!--            <el-select-->
            <!--              v-model="equvalue"-->
            <!--              :disabled="!productenable"-->
            <!--              class="selectdetail"-->
            <!--              size="small"-->
            <!--              @change="selectProductid"-->
            <!--            >-->
            <!--              <el-option-->
            <!--                v-for="(item, index) in proTableData"-->
            <!--                :key="index"-->
            <!--                :label="item.name"-->
            <!--                :value="item.id"-->
            <!--              />-->
            <!--            </el-select>-->
            <el-select v-model="selectdevice" class="selectdetail" size="small">
              <el-option :value="$translateTitle('equipment.devicename')" />
              <el-option :value="$translateTitle('equipment.devicenumber')" />
            </el-select>
            <el-input
              v-if="selectdevice == $translateTitle('equipment.devicename')"
              v-model="deviceinput"
              class="selectdetail"
              :placeholder="$translateTitle('equipment.enterproductname')"
              size="small"
            />
            <el-input
              v-else
              v-model="deviceinput"
              class="selectdetail"
              :placeholder="$translateTitle('equipment.enterdevicenumber')"
              size="small"
            />
            <!-- <el-input v-model="devicenumber" placeholder="请输入设备编号" style="margin:0;"></el-input> -->
            <el-button
              class="selectdetail"
              size="small"
              type="primary"
              @click="getDevices(0)"
            >
              {{ $translateTitle('developer.search') }}
            </el-button>
            <el-button
              class="selectdetail"
              :disabled="multipleTable.length == 0"
              size="small"
              type="primary"
              @click="deleteDevcie"
            >
              {{ $translateTitle('developer.delete') }}
            </el-button>
            <el-button
              class="selectdetail"
              :disabled="multipleTable.length == 0"
              size="small"
              type="primary"
              @click="unactiveDevice(false)"
            >
              {{ $translateTitle('developer.prohibit') }}
            </el-button>
            <el-button
              class="selectdetail"
              :disabled="multipleTable.length == 0"
              size="small"
              type="primary"
              @click="unactiveDevice(true)"
            >
              {{ $translateTitle('developer.enable') }}
            </el-button>
          </div>
          <!--第一个表格-->
          <div class="tabstable">
            <el-table
              ref="filterTable"
              :data="tableData"
              :row-style="rowClass"
              style="width: 100%; margin-top: 20px; text-align: center"
              @selection-change="handleSelectionChange"
            >
              <el-table-column align="center" type="selection" width="55" />
              <el-table-column
                align="center"
                :label="
                  $translateTitle('equipment.devicenumber') +
                  '/' +
                  $translateTitle('equipment.name')
                "
                prop="name"
                show-overflow-tooltip
                sortable
              >
                <template #default="{ row }">
                  <span>{{ row.name }}</span>
                  <p style="margin: 0; color: green">
                    {{ row.devaddr }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('equipment.state')"
                prop="status"
                show-overflow-tooltip
                sortable
                width="200"
              >
                <template #default="{ row }">
                  <!-- <span  :class="row.status" v-if="row.status=='ACTIVE'">{{ $translateTitle('product.active')}}</span><el-tooltip content="设备已注册" placement="top" v-if="row.status=='ACTIVE'">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                  <span class="ACTIVE">已注册</span>
                  <el-tooltip content="设备已注册" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>

                   <span  :class="row.status" v-if="row.status=='UNACTIVE'">{{ $translateTitle('product.unactive')}}</span><el-tooltip content="设备未注册" placement="top" v-if="row.status=='UNACTIVE'">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                  -->
                  <span v-if="row.status == 'ONLINE'" :class="row.status">
                    {{ $translateTitle('product.online') }}
                  </span>
                  <el-tooltip
                    v-if="row.status == 'ONLINE'"
                    content="设备已经上线"
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>

                  <span v-if="row.status == 'OFFLINE'" :class="row.status">
                    {{ $translateTitle('product.offline') }}
                  </span>
                  <el-tooltip
                    v-if="row.status == 'OFFLINE'"
                    content="设备已经离线"
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                  <span
                    v-if="row.status != 'OFFLINE' && row.status != 'ONLINE'"
                    :class="row.status"
                  >
                    未注册
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('equipment.product')"
                prop="product.name"
                show-overflow-tooltip
                sortable
                width="200"
              >
                <template #default="{ row }">
                  <span>{{ row.product.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('equipment.nodetype')"
                prop="product.nodeType"
                show-overflow-tooltip
                sortable
                width="200"
              >
                <template #default="{ row }">
                  <dgiot-icon
                    :icon="row.nodeType == 0 ? 'hotel-bed-fill' : 'hotel-fill'"
                    style="width: 2rem; height: 2rem"
                  />
                  <!-- <el-tag type="success" >设备</el-tag>
                                <el-tag type="success" v-else>网关</el-tag>-->
                </template>
              </el-table-column>
              <!--              <el-table-column label="授权码" align="center" width="200">-->
              <!--                <template #default="{ row }">-->
              <!--                  <span>-->
              <!--                    {{-->
              <!--                      row.basedata && row.basedata.auth-->
              <!--                        ? row.basedata.auth-->
              <!--                        : ''-->
              <!--                    }}-->
              <!--                  </span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column
                align="center"
                :label="
                  $translateTitle('developer.enable') +
                  '/' +
                  $translateTitle('developer.prohibit')
                "
                prop="enable"
                show-overflow-tooltip
                sortable
              >
                <template #default="{ row, $index }">
                  <!-- <span
                    style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#cccccc;vertical-align:middle"
                    v-if="row.isEnable==false"
                  ></span>
                  <span v-if="row.isEnable==false">已禁用</span>
                  <span
                    style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#5eb058;vertical-align:middle"
                    v-if="row.isEnable==true"
                  ></span>
                  <span v-if="row.isEnable==true">已启用</span>-->
                  <el-switch
                    v-model="row.isEnable"
                    active-color="#5eb058"
                    inactive-color="#cccccc"
                    @change="handelUpdate($event, $index)"
                  />
                </template>
              </el-table-column>

              <!-- <el-table-column :label=" $translateTitle('equipment.lastonlinetime')" align="center">
                <template #default="{ row }">
                  <span
                    v-if="row.lastOnlineTime"
                  >{{timestampToTime(row.lastOnlineTime)}}</span>
                  <span v-else>—</span>
                </template>
              </el-table-column>-->
              <el-table-column
                label="创建时间"
                prop="createdAt"
                show-overflow-tooltip
                sortable
              >
                <template #default="{ row }">
                  <span>{{ utc2beijing(row.createdAt) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                fixed="right"
                :label="$translateTitle('developer.operation')"
                width="180"
              >
                <template #default="{ row, $index }">
                  <!--                  <el-link-->
                  <!--                    :underline="false"-->
                  <!--                    type="primary"-->
                  <!--                    icon="el-icon-view"-->
                  <!--                    @click="deviceToDetail(row)"-->
                  <!--                  >-->
                  <!--                    {{ $translateTitle('equipment.see') }}-->
                  <!--                  </el-link>-->
                  <el-link
                    type="primary"
                    :underline="false"
                    @click="editorDevice(row)"
                  >
                    编辑
                  </el-link>
                  <el-popover
                    :ref="`popover-${$index}`"
                    placement="top"
                    width="300"
                  >
                    <p>确定删除这个{{ row.name }}设备吗？</p>
                    <div style="margin: 0; text-align: right">
                      <el-button
                        size="mini"
                        @click="row._self.$refs[`popover-${$index}`].doClose()"
                      >
                        {{ $translateTitle('developer.cancel') }}
                      </el-button>
                      <el-button
                        size="mini"
                        type="primary"
                        @click="makeSure(row, $index)"
                      >
                        {{ $translateTitle('developer.determine') }}
                      </el-button>
                    </div>
                    <el-link slot="reference" type="danger" :underline="false">
                      {{ $translateTitle('developer.delete') }}
                    </el-link>
                  </el-popover>
                  <!--                  <el-link-->
                  <!--                    v-if="row.nodeType != 0"-->
                  <!--                    :underline="false"-->
                  <!--                    type="primary"-->
                  <!--                    icon="el-icon-s-unfold"-->
                  <!--                    @click="deviceToChildren(row)"-->
                  <!--                  >-->
                  <!--                    {{ $translateTitle('equipment.subdevice') }}-->
                  <!--                  </el-link>-->
                  <!--                  <el-link type="primary" @click.native="goEdit(row)">-->
                  <!--                    视图-->
                  <!--                  </el-link>-->
                </template>
              </el-table-column>
            </el-table>
            <div class="elpagination" style="margin-top: 20px">
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="devicelength"
                :page-sizes="[10, 20, 30, 50]"
                :total="devicetotal"
                @current-change="deviceCurrentChange"
                @size-change="deviceSizeChange"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="$translateTitle('equipment.batchmanagement')"
          name="second"
        >
          <el-table :data="pctableData" style="width: 100%; text-align: center">
            <el-table-column
              align="center"
              :label="$translateTitle('equipment.serialnumber')"
              type="index"
              width="200"
            />
            <el-table-column
              align="center"
              :label="$translateTitle('equipment.batchname')"
              prop="data.batch_name"
              show-overflow-tooltip
              sortable
            >
              <template #default="{ row }">
                <span>{{ row.data.batch_name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$translateTitle('equipment.createdAt')"
              prop="createdAt"
              show-overflow-tooltip
              sortable
            >
              <template #default="{ row }">
                <span>{{ utc2beijing(row.createdAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="300">
              <template #default="{ row }">
                <el-button
                  size="mini"
                  type="primary"
                  @click="updatebatch(row, row.objectId)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deletebatch(row.objectId)"
                >
                  删除
                </el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="selectbatch(row, row.objectId)"
                >
                  选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!--添加设备弹窗-->
      <el-dialog
        :append-to-body="true"
        :before-close="handleClose"
        :close-on-click-modal="false"
        :title="'设备' + equipmentEditor"
        :visible.sync="devicedialogVisible"
        width="50%"
      >
        <div slot="title" class="header-title">
          <span class="title-name">
            {{ '设备' + equipmentEditor }}
            <el-tooltip
              :content="$translateTitle('equipment.text')"
              placement="top"
              style="margin-left: 5px"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
        </div>
        <div class="devicecontent">
          <el-form
            ref="deviceform"
            label-width="150px"
            :model="deviceform"
            :rules="rules"
          >
            <el-form-item
              :label="$translateTitle('equipment.devicename')"
              prop="name"
            >
              <el-input v-model="deviceform.name" />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('equipment.devicenumber')"
              prop="devaddr"
            >
              <el-input v-model="deviceform.devaddr" />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('equipment.batchname')"
              prop="batchId"
            >
              <el-input v-model="deviceform.batchId" disabled>
                <i slot="suffix" class="el-icon-plus" @click="addDeviceBatch" />
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="节点类型" prop="nodeType">
              <el-select v-model="deviceform.nodeType" placeholder="请选择节点类型">
                <el-option label="采集器" :value="0"></el-option>
                <el-option label="终端设备" :value="1"></el-option>
              </el-select>
            </el-form-item>-->
            <!-- <el-form-item label="设备类型" prop="devType">
                <el-input v-model="deviceform.devType" placeholder="请输入设备类型"></el-input>
            </el-form-item>-->
            <el-form-item
              :label="$translateTitle('product.productname')"
              prop="productName"
            >
              <el-input v-model="deviceform.productName" readonly />
            </el-form-item>
            <el-form-item :label="$translateTitle('equipment.assetnumber')">
              <el-input v-model="deviceform.assetNum" />
            </el-form-item>
            <el-form-item :label="$translateTitle('equipment.equipmenttype')">
              <el-input v-model="deviceform.devModel" />
            </el-form-item>
            <el-form-item :label="$translateTitle('equipment.equipmentbrand')">
              <el-input v-model="deviceform.brand" />
            </el-form-item>
            <!--            <el-form-item v-if="deviceform.auth" label="授权码">-->
            <!--              <el-input v-model="deviceform.auth" />-->
            <!--            </el-form-item>-->
            <!--            <el-form-item v-if="deviceform.yysId" label="应用商">-->
            <!--              <el-select v-model="deviceform.yysId" placeholder="应用商">-->
            <!--                <el-option-->
            <!--                  v-for="(item, index) in yysSelect"-->
            <!--                  :key="index"-->
            <!--                  :label="item.name"-->
            <!--                  :value="item.key"-->
            <!--                />-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <el-form-item
              :label="$translateTitle('equipment.installationlocation')"
            >
              <el-input v-model="deviceform.address" @focus="updateLocation" />
            </el-form-item>
            <el-form-item :label="$translateTitle('developer.describe')">
              <el-input
                v-model="deviceform.desc"
                :autosize="{ minRows: 4, maxRows: 4 }"
                type="textarea"
              />
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click.native="submitForm('deviceform')">
            {{ $translateTitle('developer.determine') }}
          </el-button>
          <el-button @click="handleClose">
            {{ $translateTitle('developer.cancel') }}
          </el-button>
        </span>
      </el-dialog>
      <!--第二个个弹窗批次添加-->
      <el-dialog
        :append-to-body="true"
        :before-close="handleClose1"
        :close-on-click-modal="false"
        title="批次添加"
        :visible.sync="pcdialogVisible"
        width="50%"
      >
        <div class="pccontent">
          <el-form
            ref="pcformInline"
            class="demo-form-inline"
            :inline="true"
            :model="pcformInline"
            :rules="pcformrule"
          >
            <el-form-item
              :label="$translateTitle('equipment.batchname')"
              prop="pcname"
            >
              <el-input
                v-model="pcformInline.pcname"
                :placeholder="$translateTitle('equipment.batchname')"
                width="100%"
              />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('equipment.createdAt')"
              prop="createdtime"
            >
              <el-date-picker
                v-model="pcformInline.createdtime"
                type="datetime"
                width="100%"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click.native="addbatch('pcformInline')"
              >
                {{ $translateTitle('equipment.addbatch') }}
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="pctableData"
            height="450"
            style="width: 100%; text-align: center"
          >
            <el-table-column
              align="center"
              :label="$translateTitle('equipment.serialnumber')"
              type="index"
              width="50"
            />
            <el-table-column
              align="center"
              :label="$translateTitle('equipment.batchname')"
              prop="data.batch_name"
              show-overflow-tooltip
              sortable
            >
              <template #default="{ row }">
                <span>{{ row.data.batch_name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$translateTitle('equipment.createdAt')"
              prop="createdAt"
              show-overflow-tooltip
              sortable
            >
              <template #default="{ row }">
                <span>{{ utc2beijing(row.createdAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$translateTitle('developer.operation')"
              width="300"
            >
              <template #default="{ row }">
                <el-button
                  size="mini"
                  type="primary"
                  @click="updatebatch(row, row.objectId)"
                >
                  {{ $translateTitle('developer.edit') }}
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deletebatch(row.objectId)"
                >
                  {{ $translateTitle('developer.delete') }}
                </el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="selectbatch(row, row.objectId)"
                >
                  选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <el-dialog
        v-drag-dialog
        :append-to-body="true"
        :before-close="handleClosebmap"
        :close-on-click-modal="false"
        title="设备安装地址"
        :visible.sync="bmapdialogVisible"
        width="50%"
      >
        <div>
          <el-form :inline="true" :model="bmapform" size="small">
            <!-- <el-form-item label="地址">
              <el-input v-model="bmapform.location" placeholder="请输入市或者县名称"></el-input>
            </el-form-item>-->
            <el-form-item label="地址名称">
              <el-input v-model="bmapform.keyword" />
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click.native="addressSure">搜 索</el-button>
            </el-form-item>-->
            <el-form-item label="选中地址">
              <el-input v-model="bmapform.address" readonly />
            </el-form-item>
          </el-form>
          <!-- <label>地址：<input v-model="bmapfrom.keyword"></label> -->
          <baidu-map
            :ak="secret.baidu.map"
            :center="center"
            :map-click="false"
            :scroll-wheel-zoom="true"
            style="height: 300px"
            :zoom="zoom"
            @click="mapClick"
            @ready="handler"
          >
            <!-- 必须给容器指高度，不然地图将显示在一个高度为0的容器中，看不到 -->
            <!-- <bml-marker-clusterer :averageCenter="true">
            <bm-marker :position="{lng: center.lng, lat: center.lat}"></bm-marker>
            </bml-marker-clusterer>-->
            <bm-local-search
              :auto-viewport="true"
              :keyword="bmapform.keyword"
              :location="bmapform.location"
              style="display: none"
              zoom="12.8"
            />
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
            <bm-geolocation
              anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
              :auto-location="true"
              :show-address-bar="true"
            />
            <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />
            <!-- <bm-marker :position="center" style="display:none">
              <bm-info-window  @close="infoWindowClose" @open="infoWindowOpen" style="font-size: 14px">
              <p>11111</p>
              </bm-info-window>
            </bm-marker>-->
          </baidu-map>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click.native="addressSure">
            保 存
          </el-button>
          <el-button @click="bmapdialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { Promise } from 'q'
  import { Batchdelete } from '@/api/Batch'
  import { delDict, getBatchNumer, queryDict } from '@/api/Dict'
  import { mapGetters } from 'vuex'
  import {
    BaiduMap,
    BmCityList,
    BmGeolocation,
    BmLocalSearch,
    BmNavigation,
  } from 'vue-baidu-map'
  import { getProduct } from '@/api/Product/index.js'
  import { returnLogin } from '@/utils/utilwen'
  import { secret } from '@/config/secret.config'
  var pcdata
  export default {
    components: {
      BmNavigation,
      BaiduMap,
      BmLocalSearch,
      BmGeolocation,
      BmCityList,
    },
    data() {
      const CheckDevaddr = function (rule, value, callback) {
        var reg = /[0-9A-Za-z]$/
        if (value == '') {
          callback(new Error('设备地址不能为空'))
        } else {
          if (!reg.test(value)) {
            callback(new Error('设备地址必须为大小写字母数字'))
          } else {
            callback()
          }
        }
      }
      return {
        secret: secret,
        productimg: '',
        bmapdialogVisible: false,
        onlineall: '',
        activeall: '',
        userId: '',
        batchid: '',
        pcdialogVisible: false,
        devicedialogVisible: false,
        equvalue: '0',
        cities: [],
        activeName: 'first',
        selectdevice: '',
        deviceinput: '',
        devicenumber: '',
        multipleTable: [],
        selectRow: [],
        devicelength: 10,
        devicestart: 0,
        devicetotal: 0,
        visible2: false,
        deviceform: {
          name: '',
          devaddr: '',
          batchId: '',
          desc: '',
          nodeType: 0,
          devType: '',
          netType: '',
          assetNum: '',
          devModel: '',
          address: '',
          productName: '',
          status: '',
          isEnable: '',
          brand: '',
          auth: 12345678,
          yysId: '09',
        },
        yysSelect: [],
        rules: {
          name: [
            {
              required: true,
              message: '请输入设备名称',
              trigger: 'blur',
            },
          ],
          devaddr: [
            {
              required: true,
              message: '请输入设备编号',
              trigger: 'blur',
            },
            { validator: CheckDevaddr },
          ],
          batchId: [
            {
              required: true,
              message: '请输入设备批次',
              trigger: 'blur',
            },
          ],
          nodeType: [
            {
              required: true,
              message: '请输入设备类型',
              trigger: 'blur',
            },
          ],
          netType: [
            {
              required: true,
              message: '请选择网络格式',
              trigger: 'change',
            },
          ],
          devType: [
            {
              required: true,
              message: '请选择设备类型',
              trigger: 'change',
            },
          ],
          productName: [
            {
              required: true,
              message: '请选择产品名称',
              trigger: 'change',
            },
          ],
        },
        aclObj: {},
        pcformrule: {
          pcname: [
            {
              required: true,
              message: '请输入批次名称',
              trigger: 'blur',
            },
          ],
          createdtime: [
            {
              type: 'date',
              required: true,
              message: '请选择创建时间',
              trigger: 'change',
            },
          ],
        },
        pcformInline: {
          pcnumber: '',
          pcname: '',
          createdtime: '',
        },
        pctableData: [],
        equipmentEditor: '添加',
        tableData: [],
        proTableData: [],
        proTableData1: [],
        activelength: [],
        onlinelength: [],
        center: {
          lng: 0,
          lat: 0,
        }, // 经纬度
        zoom: 13, // 地图展示级别
        bmapform: {
          keyword: '',
          location: '',
          address: '',
        },
        productName: '',
        deviceid: '',
        map: null,
        addresspointer: '',
        productenable: true,
        changeproduct: true,
        tagsid: '',
        productroleslist: [],
      }
    },
    computed: {
      ...mapGetters({
        _role: 'acl/role',
      }),
    },
    watch: {
      multipleTable(data) {
        this.selectRow = []
        if (data.length > 0) {
          data.forEach((item, index) => {
            this.selectRow.push(this.tableData.indexOf(item))
          })
        }
      },
    },
    mounted() {
      // Todo 这里拿到的还是空的
      // this.userId = this.$route.query.__ob__.dep.id; 我注释的
      // dgiotlog.log(this.$route)
      this.getDevices(0)
      this.addDeviceBatch(0)
      this.queryYysId()
      // this.$store.dispatch('getUserId', '111')
      if (this.$route.query.productid) {
        // this.selectProductid(this.$route.query.productid)
        this.equvalue = this.$route.query.productid
        this.searchProduct(this.equvalue)
      }
      this.aclObj = this.$aclObj(this._role)
    },
    methods: {
      async queryYysId() {
        const parsms = {
          order: '-createdAt',
          limit: 100,
          skip: 0,
          where: {
            type: 'b83b5d9fc0',
          },
        }
        queryDict(parsms).then((res) => {
          this.yysSelect = [
            {
              name: '空',
              key: '',
            },
          ]
          res.results.map((item) => {
            this.yysSelect.push(item.data)
          })
        })
      },
      rolesSelect(val) {
        this.productroleslist = []
        this.$queryProduct({}).then(
          (response) => {
            if (response) {
              for (var key in response.results[0].ACL) {
                if (key.includes('role')) {
                  this.productroleslist.push(key.substr(5))
                }
              }
            }
          },
          (error) => {
            returnLogin(error)
          }
        )
      },
      goEdit(row) {
        var topoUrl = window.location.origin + '/spa'
        const { NODE_ENV } = process.env
        if (NODE_ENV == 'development') {
          topoUrl = this.$globalConfig.localTopoUrl
        } else {
          topoUrl = window.location.origin + '/spa'
        }
        var url = `${topoUrl}/#?devaddr=${row.devaddr}&proudctid=${row.productid}`
        window.open(url, '__blank')
        localStorage.setItem('topoData', JSON.stringify(row.config))
        // window.open(
        //   `http://192.168.2.58:8339/#/equipment?devaddr=${row.devaddr}&productid=${row.productid}`,
        //   '_blank'
        // )
      },
      // 从产品处进来
      // async selectProductid(val) {
      //   this.productroleslist = []
      //   const parsms = {}
      //   const { results } = await this.$query_object('Product', parsms)
      //   const res = results.filter((i) => {
      //     return i.objectId == val
      //   })
      //   this.productimg = res[0].icon
      //   for (var key in res[0].ACL) {
      //     if (key.includes('role')) {
      //       this.productroleslist.push(key.substr(5))
      //     }
      //   }
      // },
      addressSure() {
        var localSearch = new BMap.LocalSearch(this.map)
        localSearch.enableAutoViewport() // 允许自动调节窗体大小
        var _this = this
        //       localSearch.setSearchCompleteCallback(function (searchResult) {
        //         dgiotlog.log(searchResult)
        // 　　　　var poi = searchResult.getPoi(0);
        // 　　　　dgiotlog.log(poi.point.lng + "," + poi.point.lat) //获取经度和纬度，将结果显示在文本框中
        // 　　　　_this.map.centerAndZoom(poi.point, 13);
        // 　　});
        if (this.bmapform.address == '') {
          this.deviceform.address = this.bmapform.keyword
        }
        localSearch.search(this.bmapform.keyword)
        this.bmapdialogVisible = false
      },
      handler({ BMap, map }) {
        this.center.lng = 120.2
        this.center.lat = 30.26667
        this.zoom = this.zoom
        this.map = map
      },
      mapClick(e) {
        this.center.lng = e.point.lng
        this.center.lat = e.point.lat
        this.addresspointer =
          e.point.lng.toFixed(6) + ',' + e.point.lat.toFixed(6)
        const geocoder = new BMap.Geocoder() // 创建地址解析器的实例
        //  let Marker = new BMap.Marker()
        geocoder.getLocation(e.point, (rs) => {
          // this.add.site = rs.address;
          //  Marker.closeInfoWindow()
          //   dgiotlog.log(rs)
          this.bmapform.address = rs.address
          this.deviceform.address = rs.address
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
      },
      // 地图更新
      updateLocation() {
        this.bmapdialogVisible = true
      },
      handleClosebmap() {
        this.bmapdialogVisible = false
      },
      // 在线设备
      async getOnlineDevices() {
        var params = {
          where: {
            status: 'ONLINE',
          },
        }

        if (this.deviceinput != '') {
          if (this.selectdevice == '设备名称') {
            params.where.name = this.deviceinput
          } else {
            params.where.devaddr = this.deviceinput
          }
        }
        if (this.devicenumber != '') {
          params.where.devaddr = this.devicenumber
        }
        if (this.equvalue != 0) {
          params.where.product = this.equvalue
        }
        var devices = await this.$queryDevice(params)
        this.onlineall = devices.results.length
      },
      // 激活设备
      async getActiveDevices() {
        var params = {
          where: {
            status: 'ACTIVE',
          },
        }
        if (this.deviceinput != '') {
          if (
            this.selectdevice == '设备名称' ||
            this.selectdevice == 'Device Name'
          ) {
            params.where.name = this.deviceinput
          } else {
            params.where.devaddr = this.deviceinput
          }
        }
        if (this.devicenumber != '') {
          params.where.devaddr = this.devicenumber
        }
        if (this.equvalue != 0) {
          params.where.product = this.equvalue
        }
        var devices = await this.$queryDevice(params)
        this.activeall = devices.results.length
      },

      async searchProduct() {
        getProduct(this.equvalue).then((res) => {
          this.deviceform.productName = res.name
          this.productName = res.name
        })
      },
      // 查询设备
      async getDevices(start) {
        if (start === 0) {
          this.devicestart = 0
        }
        this.tableData = []
        var parsms = {
          order: '-updatedAt',
          limit: this.devicelength,
          skip: this.devicestart,
          count: 'objectId',
          include: 'product',
          where: {
            product: this.$route.query.productid,
          },
        }
        if (this.deviceinput != '') {
          if (this.selectdevice == '设备名称') {
            params.where.name = this.deviceinput
          } else {
            params.where.devaddr = this.deviceinput
          }
        }
        if (this.devicenumber != '') {
          params.where.devaddr = this.devicenumber
        }
        // if (this.equvalue != 0) {
        //   params.where.product = this.equvalue
        // }

        const res = await this.$queryDevice(parsms)
        this.devicetotal = res.count
        this.tableData = res.results
        // 查询激活设备
        this.getActiveDevices()
        // 查询在线设备
        this.getOnlineDevices()
      },
      // 状态设备编辑
      handelUpdate(event, row, index) {
        dgiotlog.log('row', row)
        var newData1 = {}
        for (var key in row) {
          newData1[key] = row[key]
        }
        newData1.isEnable = newData1.isEnable != true
        this.tableData[index] = newData1
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
            //   this.tableData[index] = newData2
            var params = {
              isEnable: newData2.isEnable,
            }
            dgiotlog.log('row', row)
            this.$putDevice(row.objectId, params).then((respone) => {
              if (!respone.error) {
                this.initQuery('状态修改成功', 'success')
                this.getDevices()
              } else {
                this.initQuery('状态修改失败', 'error')
              }
            }),
              (error) => {
                returnLogin(error)
              }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消修改',
              showClose: true,
              duration: 2000,
            })
            const newData = row
            newData.isEnable = newData.isEnable != true
            this.tableData[index] = newData
          })
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
      utc2beijing(utc_datetime) {
        // 转为正常的时间格式 年-月-日 时:分:秒
        var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '')
        return date // 2017-03-31 16:02:06
      },
      filterTag(value, row) {
        return row.tag === value
      },
      /* 设备列表选中 */
      handleSelectionChange(val) {
        this.multipleTable = val
        dgiotlog.log(this.multipleTable)
      },
      // 批量删除设备
      async deleteDevcie(val) {
        const idarr = []
        this.multipleTable.map((item) => {
          idarr.push(item.id)
        })

        await Batchdelete('_Device', idarr, {}).then((res) => {
          if (!res.error) {
            this.initQuery(`设备${idarr}删除成功`, 'success')
          } else {
            this.initQuery(`设备${idarr}删除失败`, 'error')
          }
        })
      },
      // 设备多个启用和禁用
      async unactiveDevice(isEnable) {
        const idarr = []
        this.multipleTable.map((item) => {
          idarr.push(item.id)
        })
        const body = {
          isEnable: isEnable,
        }
        await Batchdelete('_Device', idarr, body).then((res) => {
          if (!res.error) {
            if (isEnable) {
              this.initQuery(`设备${idarr}启动成功`, 'success')
            } else {
              this.initQuery(`设备${idarr}禁用成功`, 'success')
            }
          } else {
            if (isEnable) {
              this.initQuery(`设备${idarr}启动失败`, 'error')
            } else {
              this.initQuery(`设备${idarr}禁用失败`, 'error')
            }
          }
        })
      },
      // activeDevice(val) {
      //   this.$changeDeviceStatus(this.multipleTable,true)
      //     .then(data => {
      //       if (data && data.length != 0) {
      //         this.initQuery('启动成功','success')
      //         this.getDevices();
      //       } else {
      //         this.initQuery('启动失败','error')
      //       }
      //     })
      //     .catch(error => {
      //       dgiotlog.log(error);
      //     });
      // },
      /* @pamras 选中高亮*/
      rowClass({ row, rowIndex }) {
        if (this.selectRow.includes(rowIndex)) {
          return { 'background-color': 'rgba(185, 221, 249, 0.3)' }
        }
      },
      initQuery(msg, type) {
        this.$message({
          type: type || 'info',
          message: msg,
          showClose: true,
          duration: 2000,
        })
      },
      /* @param deviceSizeChange 设备列表分页*/
      deviceSizeChange(val) {
        this.devicelength = val
        this.getDevices()
      },
      deviceCurrentChange(val) {
        this.devicestart = (val - 1) * this.devicelength
        this.getDevices()
      },
      /* 关闭添加设备弹窗*/
      handleClose() {
        this.deviceid = ''
        this.deviceform = {
          name: '',
          devaddr: '',
          batchId: '',
          desc: '',
          nodeType: 0,
          devType: '',
          netType: '',
          assetNum: '',
          devModel: '',
          address: '',
          status: '',
          isEnable: '',
          brand: '',
          auth: 12345678,
          yysId: '',
        }
        this.$refs['deviceform'].resetFields()
        this.deviceform.productName = this.productName
        this.devicedialogVisible = false
        this.equipmentEditor = '添加'
      },
      /* 添加设备弹窗 */
      addDeviceForm() {
        this.deviceid = ''
        this.devicedialogVisible = true
        this.equipmentEditor = '添加'
      },
      /* 关闭批次弹窗*/
      handleClose1() {
        this.pcdialogVisible = false
        this.batchid = ''
        this.pcformInline = {
          pcname: '',
          createdtime: '',
        }
      },
      /* el-popover点击关闭*/
      makeSure(row, $index) {
        // 可以在这里执行删除数据的回调操作.......删除操作.....
        this.$deleteDevice(row.objectId).then((response) => {
          if (!response.error) {
            this.initQuery('删除成功', 'success')
            this.getDevices()
          } else {
            this.initQuery('删除失败', 'error')
          }
        })
      },
      // 增加批次
      async addDeviceBatch(isdialog) {
        if (isdialog == 0) {
          this.pcdialogVisible = false
        } else {
          this.pcdialogVisible = true
        }
        const { results } = await getBatchNumer()
        this.pctableData = results.filter((e) => {
          return e.data.batch_name
        })
      },
      /* device添加表单提交*/
      editorDevice(row) {
        dgiotlog.log('row', row)
        this.deviceid = row.objectId
        this.devicedialogVisible = true
        this.deviceform = {
          devaddr: row.devaddr,
          name: row.name,
          assetNum: row.detail == undefined ? '' : row.detail.assetNum,
          devModel: row.detail == undefined ? '' : row.detail.devModel,
          desc: row.detail == undefined ? '' : row.detail.desc,
          productid: row.product.objectId,
          brand: row.detail == undefined ? '' : row.detail.brand,
          productName: row.product.name,
          status: row.status,
          isEnable: row.isEnable,
          address: row.detail == undefined ? '' : row.detail.address,
          auth: row.basedata && row.basedata.auth ? row.basedata.auth : '',
          yysId: row.basedata && row.basedata.yysId ? row.basedata.yysId : '',
        }
        this.bmapform.address = row.address
        this.batchid = row.detail.batchid
        this.center.lat = row.latitude
        this.center.lng = row.longitude
        this.addresspointer = row.latitude + ',' + row.longitude

        this.tagsid = row.tagid
        this.equipmentEditor = '编辑'
        this.rolesSelect(row.productid)
        // this.getBatch()
        //   .then(results => {
        //     dgiotlog.log(results);
        //     this.pctableData.map(item => {
        //       if (item.id == row.batchid) {
        //         dgiotlog.log(item);
        //         this.deviceform.batchId = item.data.batch_name;
        //       }
        //     });
        //   })
        //   .catch(error => {
        //     dgiotlog.log(error);
        //   });
      },
      getBatch() {
        return new Promise((resolve, reject) => {
          if (pcdata.length > 0) {
            resolve(pcdata)
          } else {
            reject(false)
          }
        })
      },
      submitForm(formName) {
        var initparams = {
          devaddr: this.deviceform.devaddr,
          name: this.deviceform.name,
        }
        var params = {}
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.deviceid != '') {
              var params = {
                where: {
                  devaddr: this.deviceform.devaddr,
                },
              }
              this.$queryDevice(params).then((respone) => {
                if (respone.results.length == 0) {
                  var editParams = {
                    ACL: this.aclObj,
                    detail: {
                      assetNum: this.deviceform.assetNum,
                      devModel: this.deviceform.devModel,
                      brand: this.deviceform.brand,
                      address: this.deviceform.address,
                      desc: this.deviceform.desc,
                    },
                    product: {
                      __type: 'Pointer',
                      className: 'Product',
                      objectId: this.$route.query.productid,
                    },
                    basedata: {
                      auth: this.deviceform.auth,
                      yysId: this.deviceform.yysId,
                    },
                  }
                  params = Object.assign(initparams, editParams)

                  this.$putDevice(this.deviceid, params).then((res) => {
                    if (!res.error) {
                      this.initQuery('修改成功', 'success')
                      this.devicedialogVisible = false
                      this.getDevices()
                      this.deviceform = {}
                      this.deviceform.productName = this.productName
                    } else {
                      this.initQuery('修改失败', 'error')
                    }
                  })
                } else {
                  this.initQuery('设备已经存在', 'error')
                }
              })
            } else {
              var params = {
                where: {
                  devaddr: this.deviceform.devaddr,
                },
              }
              this.$queryDevice(params).then((respone) => {
                if (respone.results.length == 0) {
                  var createParams = {
                    ACL: this.aclObj,
                    detail: {
                      assetNum: this.deviceform.assetNum,
                      devModel: this.deviceform.devModel,
                      brand: this.deviceform.brand,
                      address: this.deviceform.address,
                      desc: this.deviceform.desc,
                    },
                    // isEnable: false,
                    // status: false,
                    // location: {
                    //   "__type": "GeoPoint",
                    //   "latitude": this.center.lat ? this.center.lat : 0,
                    //   "longitude": this.center.lng ? this.center.lng : 0
                    // },
                    product: {
                      __type: 'Pointer',
                      className: 'Product',
                      objectId: this.$route.query.productid,
                    },
                    basedata: {
                      auth: this.deviceform.auth,
                      yysId: this.deviceform.yysId,
                    },
                  }
                  params = Object.assign(initparams, createParams)
                  this.$postDevice(params).then((res) => {
                    if (!res.error) {
                      this.initQuery('创建成功', 'success')
                      this.devicedialogVisible = false
                      this.getDevices()
                      this.deviceform = {}
                      this.deviceform.productName = this.productName
                    } else {
                      this.initQuery('创建失败', 'error')
                    }
                  })
                } else {
                  this.initQuery('设备已经存在', 'error')
                }
              })
            }
          } else {
            this.$message('必填项未填')
          }
        })
      },

      /* @pamars addbatch添加批次名称 */
      async addbatch(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.batchid === '') {
              // 这里是创建批次
              const params = {
                data: {
                  batch_name: this.pcformInline.pcname,
                  createdtime: Math.ceil(this.pcformInline.createdtime / 1000),
                },
                ACL: this.aclObj,
                key: this.pcformInline.pcname,
                type: 'batch_number',
              }
              this.$postDict(params).then((res) => {
                if (!res.error) {
                  this.$message({
                    message: '新增成功',
                    showClose: true,
                    duration: 2000,
                    type: 'success',
                  })
                  this.$refs[formName].resetFields()
                  this.addDeviceBatch()
                } else {
                  this.$message({
                    message: `新增失败${res.error}`,
                    showClose: true,
                    duration: 2000,
                    type: 'error',
                  })
                }
              })
            } else {
              const params = {
                objectId: this.batchid,
                data: {
                  batch_name: this.pcformInline.pcname,
                  createdtime: Math.ceil(this.pcformInline.createdtime / 1000),
                },
                ACL: this.aclObj,
                type: 'batch_number',
              }
              // 更新批次
              this.$putDict(params.objectId, params).then((res) => {
                if (!res.error) {
                  this.initQuery('修改成功', 'success')
                  this.batchid = ''
                  this.pcformInline = {
                    pcname: '',
                    createdtime: '',
                  }
                  this.$refs[formName].resetFields()
                  this.addDeviceBatch()
                } else {
                  this.initQuery('修改失败', 'error')
                }
              })
            }
          } else {
            dgiotlog.log('error submit!!')
            return false
          }
        })
      },
      // 编辑批次
      updatebatch(row, id) {
        this.pcformInline.pcname = row.data.batch_name
        this.pcformInline.createdtime = row.data.createdtime * 1000
        this.batchid = id
      },
      /**
       *
       * @param
       * @returns
       */
      async deletebatch(id) {
        try {
          const res = await delDict(id)
          dgiotlog.log(res)
          this.queryDict()
          this.addDeviceBatch()
          // this.$message.success(`${error}`)
        } catch (error) {
          dgiotlog.log(error)
          this.$message.error(`${error}`)
        }
      },

      // 选择批次
      selectbatch(row, id) {
        this.batchid = id
        this.deviceform.pc = row.data.batch_name
        this.deviceform.batchId = row.data.batch_name
        this.pcdialogVisible = false

        dgiotlog.log(this.batchid, 'this.batchid ')
      },
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
      handleClick(tab, event) {
        if (tab.name == 'second') {
          this.queryDict()
        }
      },
      async queryDict() {
        const { results } = await this.$getBatchNumer()
        this.pctableData = results.filter((e) => {
          return e.data.batch_name
        })
      },
      // 前往子设备
      deviceToChildren(row) {
        this.$router.push({
          path: '/roles/editdevices',
          query: {
            deviceid: row.objectId,
            nodeType: row.nodeType,
            ischildren: 'true',
          },
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .equipment {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;

    .equ_header {
      box-sizing: border-box;
      width: 100%;
      height: 60px;
      padding-left: 40px;

      ul {
        box-sizing: border-box;
        display: flex;
        padding-left: 20px;

        li {
          width: 200px;
          height: 60px;
          text-align: center;
          list-style: none;
          border-right: 1px solid #cccccc;
          // &:first-child {
          //   width: 15%;
          //   text-align: left;
          //   line-height: 60px;
          // }
          &:last-child {
            flex-grow: 2;
            text-align: right;
            border: 0;
          }

          &:nth-child(4) {
            border: 0;
          }

          p {
            font-size: 14px;
            line-height: 0;
            color: #666666;
          }
        }
      }
    }
  }
</style>
<style>
  .equipment .el-tabs__item {
    height: 50px;
    margin: 0;
    margin-top: 20px;
    font-family: auto;
    font-size: 16px;
    line-height: 50px;
  }

  .equipment .el-tabs__header {
    margin: 0;
  }

  .equipment .el-tabs__content {
    box-sizing: border-box;
    padding: 20px;
    background: #f4f4f4;
  }

  .equipment #pane-first {
    box-sizing: border-box;
    padding: 10px;
    background: #ffffff;
  }

  .equipment #pane-second {
    box-sizing: border-box;
    padding: 10px;
    background: #ffffff;
  }

  .equipment #pane-first .equdevices .el-input {
    width: 200px;
  }

  .equipment .el-dialog__footer {
    border-top: 1px solid #cccccc;
  }

  .equipment .devicecontent .el-form {
    display: flex;
    flex-wrap: wrap;
  }

  .equipment .devicecontent .el-form .el-input--suffix .el-input__inner {
    padding: 0 15px;
  }

  .equipment .devicecontent .el-form .el-icon-plus {
    width: 40px;
    height: 40px;
    margin-right: -4px;
    line-height: inherit;
    color: white;
    cursor: pointer;
    background: cornflowerblue;
  }

  .equipment .devicecontent .el-form .el-form-item {
    width: 50%;
  }

  .equipment .devicecontent .el-form .el-form-item:last-child {
    width: 100%;
  }

  .equipment .devicecontent .el-form .el-select {
    width: 100%;
  }

  .equipment .ACTIVE,
  .equipment .ONLINE {
    color: green;
  }

  .equipment .OFFLINE,
  .equipment .UNACTIVE {
    color: red;
  }

  .equipment .selectdetail {
    margin: 10px 0;
  }

  /* .equipment .devicecontent .el-form .el-form-item .is-required:not(.is-no-asterisk):after{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
} */
  /* .equipment .devicecontent .el-form .el-form-item__label:before{
    content:''
}
.equipment .devicecontent .el-form .el-form-item__label:after{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
} */
</style>
