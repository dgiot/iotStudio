<template>
  <div class="equipment">
    <div class="dialog">
      <el-dialog :visible.sync="popoverVisible" top="5vh" width="30vh">
        <div class="leftTree">
          <p style="text-align: center">
            {{ $translateTitle('developer.Company') }} :
            {{ deciceCompany }}
          </p>
          <el-tree
            :data="deptTreeData"
            :props="roleProps"
            :expand-on-click-node="false"
            node-key="index"
            default-expand-all
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
      <el-dialog :visible.sync="mapDialog" top="5vh" width="80vh">
        <baidu-map
          :center="center"
          :zoom="zoom"
          :scroll-wheel-zoom="true"
          :map-click="false"
          style="height: 80vh"
          @ready="handler"
          @click="mapClick"
        >
          <bm-marker
            :position="center"
            :dragging="true"
            animation="BMAP_ANIMATION_BOUNCE"
          >
            <bm-label
              :content="deviceId"
              :label-style="{ color: 'red', fontSize: '12px' }"
              :offset="{ width: -25, height: 30 }"
            />
          </bm-marker>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
        </baidu-map>
      </el-dialog>
    </div>
    <div class="equtabs">
      <!--tabs第一个标签页-->
      <el-row :gutter="gutter">
        <el-col :span="leftRow">
          <div class="leftTree">
            <el-tree
              :data="deptTreeData"
              :props="roleProps"
              :expand-on-click-node="false"
              node-key="index"
              default-expand-all
            >
              <!-- @node-click="handleNodeClick" -->
              <!-- eslint-disable-next-line -->
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
        </el-col>
        <el-col :span="gutter - leftRow">
          <div class="equ_header">
            <ul>
              <li>
                <p>
                  <span class="svg-container">
                    <vab-icon icon="device-fill" />
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
                    <vab-icon icon="24-hours-line" />
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
            </ul>
          </div>
          <div style="margin-top: 20px" class="equdevices">
            <!-- 显示影藏 -->
            <vab-icon
              style="cursor: pointer"
              :icon="vabicon"
              @click="leftRow = leftRow == 3 ? 0 : 3"
            />
            <el-select
              v-model="equvalue"
              :disabled="!productenable"
              class="selectdetail"
              size="small"
              @change="selectProdChange"
            >
              <el-option
                v-for="(item, index) in proTableData"
                :key="index"
                :label="item.name"
                :value="item.objectId"
              />
            </el-select>
            <!-- <el-select
              v-model="onlinedevices"
              placeholder="请选择状态"
              class="selectdetail"
              size="small"
              clearable
            > -->
            <el-select
              v-model="onlinedevices"
              :placeholder="$translateTitle('equipment.pleaseselectstatus')"
              class="selectdetail"
              size="small"
              clearable
            >
              <!-- <el-option value="在线" /> -->
              <el-option :value="$translateTitle('zetadevices.online')" />
              <!-- <el-option value="离线" /> -->
              <el-option :value="$translateTitle('zetadevices.offline')" />
            </el-select>
            <el-select
              v-model="selectdevice"
              class="selectdetail"
              size="small"
              clearable
            >
              <el-option :value="$translateTitle('equipment.devicename')" />
              <el-option :value="$translateTitle('equipment.devicenumber')" />
            </el-select>
            <el-input
              v-if="selectdevice == $translateTitle('equipment.devicename')"
              v-model="deviceinput"
              :placeholder="$translateTitle('equipment.enterproductname')"
              size="small"
              class="selectdetail"
            />
            <el-input
              v-else
              v-model="deviceinput"
              :placeholder="$translateTitle('equipment.enterdevicenumber')"
              size="small"
              class="selectdetail"
            />
            <!-- <el-input v-model="devicenumber" placeholder="请输入设备编号" style="margin:0;"></el-input> -->
            <el-button
              size="small"
              type="primary"
              class="selectdetail"
              @click="getDevices(0)"
            >
              {{ $translateTitle('developer.search') }}
            </el-button>
            <el-button
              :disabled="multipleTable.length == 0"
              size="small"
              type="primary"
              class="selectdetail"
              @click="deleteDevcie"
            >
              {{ $translateTitle('developer.delete') }}
            </el-button>
            <el-button
              :disabled="multipleTable.length == 0"
              size="small"
              type="primary"
              class="selectdetail"
              @click="unactiveDevice(false)"
            >
              {{ $translateTitle('developer.prohibit') }}
            </el-button>
            <el-button
              :disabled="multipleTable.length == 0"
              size="small"
              type="primary"
              class="selectdetail"
              @click="unactiveDevice(true)"
            >
              {{ $translateTitle('developer.enable') }}
            </el-button>
            <el-button size="small">
              {{ $translateTitle('equipment.batchaddition') }}
            </el-button>
            <el-button type="primary" size="small" @click="addDeviceForm">
              {{ $translateTitle('equipment.adddevice') }}
            </el-button>
          </div>
          <el-tabs v-model="activeName">
            <el-tab-pane
              :label="$translateTitle('equipment.list')"
              name="first"
            >
              <div class="tabstable">
                <el-table
                  v-show="isALL"
                  ref="filterTable"
                  v-loading="listLoading"
                  :data="tableData"
                  :row-style="rowClass"
                  style="width: 100%; margin-top: 20px; text-align: center"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" align="center" width="55" />
                  <el-table-column
                    :label="$translateTitle('equipment.devicenumber')"
                    align="center"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.devaddr }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('equipment.name')"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span style="margin: 0; color: green">
                        {{ scope.row.name }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('equipment.state')"
                    align="center"
                    width="80"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.status == 'ONLINE'"
                        :class="scope.row.status"
                      >
                        {{ $translateTitle('product.online') }}
                      </span>
                      <!-- <el-tooltip
                    v-if="scope.row.status == 'ONLINE'"
                    content="设备已经上线"
                    placement="top"
                  > -->
                      <el-tooltip
                        v-if="scope.row.status == 'ONLINE'"
                        :content="
                          $translateTitle('equipment.thedeviceisonline')
                        "
                        placement="top"
                      >
                        <i class="el-icon-question" />
                      </el-tooltip>

                      <span
                        v-if="scope.row.status == 'OFFLINE'"
                        :class="scope.row.status"
                      >
                        {{ $translateTitle('product.offline') }}
                      </span>
                      <!-- <el-tooltip
                    v-if="scope.row.status == 'OFFLINE'"
                    content="设备已经离线"
                    placement="top"
                  > -->
                      <el-tooltip
                        v-if="scope.row.status == 'OFFLINE'"
                        :content="
                          $translateTitle('equipment.thedeviceisoffline')
                        "
                        placement="top"
                      >
                        <i class="el-icon-question" />
                      </el-tooltip>
                      <span
                        v-if="
                          scope.row.status != 'OFFLINE' &&
                          scope.row.status != 'ONLINE'
                        "
                        :class="scope.row.status"
                      >
                        <!-- 未注册 -->
                        {{ $translateTitle('product.unregistered') }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('equipment.product')"
                    align="center"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.product && scope.row.product.name">
                        {{ scope.row.product.name || '' }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="Company == '云寓智慧公寓平台'"
                    :label="$translateTitle('developer.authcode')"
                    align="center"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{
                          scope.row.basedata && scope.row.basedata.auth
                            ? scope.row.basedata.auth
                            : ''
                        }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('developer.Company')"
                    align="center"
                    width="100"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{ scope.row.Company }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="Company == '云寓智慧公寓平台'"
                    :label="$translateTitle('developer.Application')"
                    align="center"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{ scope.row.basedata.yysId }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="
                      $translateTitle('developer.enable') +
                      '/' +
                      $translateTitle('developer.prohibit')
                    "
                    align="center"
                    width="100"
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
                    align="center"
                    :label="$translateTitle('developer.createdAt')"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <span>{{ utc2beijing(scope.row.createdAt) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="360"
                    fixed="right"
                    :label="$translateTitle('developer.operation')"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <vab-icon
                        style="color: #1890ff"
                        icon="file-transfer-line"
                      />

                      <el-link
                        :underline="false"
                        type="primary"
                        style="margin: 0 10px"
                        @click="showTree(scope.row.objectId, scope.row.Company)"
                      >
                        {{ $translateTitle('equipment.move') }}
                      </el-link>
                      <vab-icon
                        style="color: #1890ff"
                        icon="map-pin-range-line"
                      />
                      <el-link
                        :underline="false"
                        type="primary"
                        :disabled="!scope.row.location"
                        @click="showMap(scope.row.location, scope.row.objectId)"
                      >
                        {{ $translateTitle('equipment.location') }}
                      </el-link>
                      <el-link
                        v-if="Company != '云寓智慧公寓平台'"
                        :underline="false"
                        type="primary"
                        style="margin: 0 10px"
                        icon="el-icon-view"
                        @click="deviceToDetail(scope.row)"
                      >
                        {{ $translateTitle('equipment.see') }}
                      </el-link>
                      <el-link
                        :underline="false"
                        type="primary"
                        style="margin: 0 10px 0 0"
                        icon="el-icon-edit"
                        @click="editorDevice(scope.row)"
                      >
                        {{ $translateTitle('concentrator.edit') }}
                      </el-link>
                      <el-link
                        :underline="false"
                        type="primary"
                        style="margin: 0 10px 0 0"
                        icon="el-icon-s-flag                    "
                        @click="konvaDevice(scope.row)"
                      >
                        {{ $translateTitle('concentrator.konva') }}
                      </el-link>
                      <el-popover
                        :ref="`popover-${scope.$index}`"
                        placement="top"
                        width="300"
                      >
                        <!-- <p>确定删除这个{{ scope.row.name }}设备吗？</p> -->
                        <p>
                          {{ $translateTitle('product.qdsczg')
                          }}{{ scope.row.name
                          }}{{ $translateTitle('equipment.sbm') }}
                        </p>
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
                          {{ $translateTitle('developer.delete') }}
                        </el-link>
                      </el-popover>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table
                  v-show="!isALL"
                  ref="filterTable"
                  v-loading="listLoading"
                  :data="tableData"
                  :row-style="rowClass"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" align="center" width="55" />
                  <el-table-column
                    :label="$translateTitle('equipment.devicenumber')"
                    align="center"
                    width="100"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.devaddr }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('equipment.name')"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span style="margin: 0; color: green">
                        {{ scope.row.name }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('equipment.state')"
                    align="center"
                    width="70"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.status == 'ONLINE'"
                        :class="scope.row.status"
                      >
                        {{ $translateTitle('product.online') }}
                      </span>
                      <el-tooltip
                        v-if="scope.row.status == 'ONLINE'"
                        :content="
                          $translateTitle('equipment.thedeviceisonline')
                        "
                        placement="top"
                      >
                        <i class="el-icon-question" />
                      </el-tooltip>
                      <span
                        v-if="scope.row.status == 'OFFLINE'"
                        :class="scope.row.status"
                      >
                        {{ $translateTitle('product.offline') }}
                      </span>
                      <el-tooltip
                        v-if="scope.row.status == 'OFFLINE'"
                        :content="
                          $translateTitle('equipment.thedeviceisoffline')
                        "
                        placement="top"
                      >
                        <i class="el-icon-question" />
                      </el-tooltip>
                      <span
                        v-if="
                          scope.row.status != 'OFFLINE' &&
                          scope.row.status != 'ONLINE'
                        "
                        :class="scope.row.status"
                      >
                        <!-- 未注册 -->
                        {{ $translateTitle('product.unregistered') }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('equipment.product')"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.product && scope.row.product.name">
                        {{ scope.row.product.name }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="Company == '云寓智慧公寓平台'"
                    :label="$translateTitle('developer.authcode')"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{
                          scope.row.basedata && scope.row.basedata.auth
                            ? scope.row.basedata.auth
                            : ''
                        }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('developer.Company')"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{ scope.row.Company }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="Company == '云寓智慧公寓平台'"
                    :label="$translateTitle('developer.Application')"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{ scope.row.basedata.yysId }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="
                      $translateTitle('developer.enable') +
                      '/' +
                      $translateTitle('developer.prohibit')
                    "
                    align="center"
                    width="80"
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
                  <template v-for="(item, index) in dialogtempconfig">
                    <el-table-column
                      v-if="item.type == 'bool' && item.isshow"
                      :key="index"
                      align="center"
                      :label="item.name"
                      :prop="item.identifier"
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row[item.default]">
                          <!-- 是 -->
                          {{ $translateTitle('product.yes') }}
                        </span>
                        <span v-else>
                          <!-- 否 -->
                          {{ $translateTitle('product.no') }}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-else-if="item.type == 'enum' && item.isshow"
                      :key="index"
                      align="center"
                      :label="item.name"
                    >
                      <template slot-scope="scope">
                        <span>
                          {{ item.struct[scope.row[item.identifier]] }}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-else-if="item.isshow"
                      :key="index"
                      align="center"
                      :label="item.name"
                      :prop="item.identifier"
                    >
                      <template slot-scope="scope">
                        <span>
                          {{ scope.row[item.identifier] }} {{ item.unit }}
                        </span>
                      </template>
                    </el-table-column>
                  </template>
                  <el-table-column
                    align="center"
                    :label="$translateTitle('developer.createdAt')"
                    width="180"
                  >
                    <template slot-scope="scope">
                      <span>{{ utc2beijing(scope.row.createdAt) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    :label="$translateTitle('developer.operation')"
                    align="center"
                    width="300"
                  >
                    <template slot-scope="scope">
                      <vab-icon
                        style="color: #1890ff"
                        icon="file-transfer-line"
                      />

                      <el-link
                        :underline="false"
                        type="primary"
                        @click="showTree(scope.row.objectId, scope.row.Company)"
                      >
                        {{ $translateTitle('equipment.move') }}
                      </el-link>
                      <vab-icon
                        style="color: #1890ff"
                        icon="map-pin-range-line"
                      />
                      <el-link
                        :underline="false"
                        type="primary"
                        :disabled="!scope.row.location"
                        @click="showMap(scope.row.location, scope.row.objectId)"
                      >
                        {{ $translateTitle('equipment.location') }}
                      </el-link>
                      <el-link
                        v-if="Company != '云寓智慧公寓平台'"
                        :underline="false"
                        type="primary"
                        style="margin: 0 10px"
                        icon="el-icon-view"
                        @click="deviceToDetail(scope.row)"
                      >
                        {{ $translateTitle('equipment.see') }}
                      </el-link>
                      <el-link
                        :underline="false"
                        type="primary"
                        style="margin: 0 10px 0 0"
                        icon="el-icon-edit"
                        @click="editorDevice(scope.row)"
                      >
                        {{ $translateTitle('concentrator.edit') }}
                      </el-link>
                      <el-popover
                        :ref="`popover-${scope.$index}`"
                        placement="top"
                        width="300"
                      >
                        <!-- <p>确定删除这个{{ scope.row.name }}设备吗？</p> -->
                        <p>
                          {{ $translateTitle('product.qdsczg')
                          }}{{ scope.row.name
                          }}{{ $translateTitle('equipment.sbm') }}
                        </p>
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
                          {{ $translateTitle('developer.delete') }}
                        </el-link>
                      </el-popover>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="elpagination" style="margin-top: 30px">
                  <el-pagination
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="devicelength"
                    :total="devicetotal"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="deviceSizeChange"
                    @current-change="deviceCurrentChange"
                  />
                </div>
              </div>
              <!--添加设备弹窗-->
              <!-- <el-dialog
            :title="'设备' + equipmentEditor"
            :visible.sync="devicedialogVisible"
            :close-on-click-modal="false"
            :before-close="handleClose"
            width="50%"
          > -->
              <!--第一个表格-->
            </el-tab-pane>
            <el-tab-pane
              :label="$translateTitle('equipment.map')"
              name="second"
            >
              <baidu-map
                :scroll-wheel-zoom="true"
                class="map"
                :center="{ lng: 116.404, lat: 39.915 }"
                style="height: 57vh"
                :zoom="sizeZoom"
              >
                <bm-control>
                  <el-button size="mini" @click="sizeZoom = 19">
                    缩放至最大
                  </el-button>
                  <el-button size="mini" @click="sizeZoom = 10">还原</el-button>
                  <el-button size="mini" @click="sizeZoom = 3">
                    缩放至最小
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
                  v-for="item in tableData"
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
                    :label-style="{ color: 'red', fontSize: '24px' }"
                    :offset="{ width: -35, height: 30 }"
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
            </el-tab-pane>
          </el-tabs>
          <el-dialog
            :title="$translateTitle('product.edit') + equipmentEditor"
            :visible.sync="devicedialogVisible"
            :close-on-click-modal="false"
            :before-close="handleClose"
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
                :model="deviceform"
                :rules="rules"
                label-width="150px"
              >
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('equipment.devicename')"
                      prop="name"
                    >
                      <el-input v-model="deviceform.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('equipment.devicenumber')"
                      prop="devaddr"
                    >
                      <el-input
                        v-model="deviceform.devaddr"
                        :disabled="equipmentEditor == '编辑'"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('product.productname')"
                      prop="productName"
                    >
                      <el-select
                        v-model="deviceform.productName"
                        :disabled="equipmentEditor == '编辑'"
                        :placeholder="$translateTitle('equipment.entername')"
                        @change="selectChange"
                      >
                        <el-option
                          v-for="(item, index) in proTableData1"
                          :key="index"
                          :label="item.name"
                          :value="item.objectId"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('equipment.assetnumber')"
                    >
                      <el-input v-model="deviceform.assetNum" />
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('equipment.equipmenttype')"
                    >
                      <el-input v-model="deviceform.devModel" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('equipment.equipmentbrand')"
                    >
                      <el-input v-model="deviceform.brand" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      v-if="Company == '云寓智慧公寓平台'"
                      :label="$translateTitle('equipment.auth')"
                    >
                      <el-input v-model="deviceform.auth" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      v-if="Company == '云寓智慧公寓平台'"
                      :label="$translateTitle('equipment.application')"
                    >
                      <el-select
                        v-model="deviceform.yysId"
                        :placeholder="$translateTitle('equipment.application')"
                      >
                        <el-option
                          v-for="(item, index) in yysSelect"
                          :key="index"
                          :label="item.name"
                          :value="item.key"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('equipment.installationlocation')"
                    >
                      <el-input
                        v-model="deviceform.address"
                        @focus="updateLocation"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-for="(item, index) in arrlist"
                    :key="index"
                    :span="12"
                  >
                    <el-form-item
                      :label="item.name"
                      :prop="item.identifier"
                      :required="item.required"
                    >
                      <el-select
                        v-if="item.type == 'bool'"
                        v-model="deviceform[item.identifier]"
                        style="width: 100%"
                        class="notauto"
                        :disabled="item.readonly"
                      >
                        <el-option
                          :value="true"
                          :label="$translateTitle('product.yes')"
                        />
                        <el-option
                          :value="false"
                          :label="$translateTitle('product.no')"
                        />
                      </el-select>
                      <el-select
                        v-else-if="item.type == 'enum'"
                        v-model="deviceform[item.identifier]"
                        style="width: 100%"
                        class="notauto"
                        :disabled="item.readonly"
                      >
                        <el-option
                          v-for="(spec, index1) in item.specs"
                          :key="index1"
                          :label="spec.attributevalue"
                          :value="spec.attribute"
                        />
                      </el-select>
                      <!--                      <el-input-->
                      <!--                        v-else-if="item.unit != ''"-->
                      <!--                        v-model="deviceform[item.identifier]"-->
                      <!--                        :disabled="item.readonly"-->
                      <!--                      />-->
                      <el-input
                        v-else-if="item.readonly"
                        :value="deviceform[item.identifier] + item.unit"
                        :disabled="item.readonly"
                      />
                      <el-input
                        v-else
                        v-model="deviceform[item.identifier]"
                        :disabled="item.readonly"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      :label="$translateTitle('developer.describe')"
                    >
                      <el-input
                        v-model="deviceform.desc"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        type="textarea"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitForm('deviceform')">
                {{ $translateTitle('developer.determine') }}
              </el-button>
              <el-button @click="handleClose">
                {{ $translateTitle('developer.cancel') }}
              </el-button>
            </span>
          </el-dialog>
          <!-- <el-dialog
            v-drag-dialog
            :visible.sync="bmapdialogVisible"
            :close-on-click-modal="false"
            :before-close="handleClosebmap"
            title="设备安装地址"
            width="50%"
          > -->
          <el-dialog
            v-drag-dialog
            :visible.sync="bmapdialogVisible"
            :close-on-click-modal="false"
            :before-close="handleClosebmap"
            :title="$translateTitle('developer.equipmentinstallationaddress')"
            width="50%"
          >
            <div>
              <el-form :model="bmapform" :inline="true" size="small">
                <!-- <el-form-item label="地址">
              <el-input v-model="bmapform.location" placeholder="请输入市或者县名称"></el-input>
            </el-form-item>-->
                <!-- <el-form-item label="地址名称"> -->
                <el-form-item :label="$translateTitle('developer.addressname')">
                  <el-input v-model="bmapform.keyword" />
                </el-form-item>
                <!-- <el-form-item>
              <el-button type="primary" @click="addressSure">搜 索</el-button>
            </el-form-item>-->
                <!-- <el-form-item label="选中地址"> -->
                <el-form-item
                  :label="$translateTitle('developer.selectaddress')"
                >
                  <el-input v-model="bmapform.address" readonly />
                </el-form-item>
              </el-form>
              <!-- <label>地址：<input v-model="bmapfrom.keyword"></label> -->
              <baidu-map
                :center="center"
                :zoom="zoom"
                :scroll-wheel-zoom="true"
                :map-click="false"
                style="height: 300px"
                @ready="handler"
                @click="mapClick"
              >
                <!-- 必须给容器指高度，不然地图将显示在一个高度为0的容器中，看不到 -->
                <!-- <bml-marker-clusterer :averageCenter="true">
            <bm-marker :position="{lng: center.lng, lat: center.lat}"></bm-marker>
            </bml-marker-clusterer>-->
                <bm-local-search
                  :keyword="bmapform.keyword"
                  :auto-viewport="true"
                  :location="bmapform.location"
                  zoom="12.8"
                  style="display: none"
                />
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
                <bm-geolocation
                  :show-address-bar="true"
                  :auto-location="true"
                  anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
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
              <el-button type="primary" @click="addressSure">
                <!-- 保存 -->
                {{ $translateTitle('product.preservation') }}
              </el-button>
              <el-button @click="bmapdialogVisible = false">
                <!-- 取消 -->
                {{ $translateTitle('developer.cancel') }}
              </el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { get_object } from '@/api/shuwa_parse'
  import { queryDict } from '@/api/Direct/index.js'
  import { Batchdelete } from '@/api/Batch'
  import { Promise } from 'q'
  import Cookies from 'js-cookie'
  import store from '@/store'
  import { getProduct } from '@/api/Product/index'
  import {
    BmNavigation,
    BaiduMap,
    BmLocalSearch,
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
  import { returnLogin } from '@/utils/return'
  import { querycompanyDevice, putDevice } from '@/api/Device'
  import { getToken } from '@/api/Menu'

  var language
  var pcdata
  export default {
    components: {
      BmScale,
      BmMapType,
      BmOverviewMap,
      BmPanorama,
      BmControl,
      BmLabel,
      BaiduMap,
      BmLocalSearch,
      BmNavigation,
      BmGeolocation,
      BmCityList,
      BmMarker,
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
        isALL: true,
        sizeZoom: 10,
        activeName: 'first',
        mapDialog: false,
        dialogtempconfig: [],
        arrlist: [],
        deviceId: '',
        deciceCompany: '',
        gutter: 24,
        leftRow: 3,
        rightRow: 21,
        popoverVisible: false,
        vabicon: 'ancient-gate-fill',
        Company: sessionStorage.getItem('title') || '',
        access_token: '',
        curDepartmentId: '',
        deptTreeData: [],
        roleProps: {
          children: 'children',
          label: 'name',
        },
        listLoading: false,
        productimg: '',
        bmapdialogVisible: false,
        onlineall: 0,
        activeall: 0,
        userId: '',
        batchid: '',
        pcdialogVisible: true,
        devicedialogVisible: false,
        equvalue: '0',
        cities: [],
        selectdevice: '',
        onlinedevices: '',
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
        },
        yysSelect: [],
        rules: {
          name: [
            { required: true, message: '请输入设备名称', trigger: 'blur' },
          ],
          devaddr: [
            { required: true, message: '请输入设备编号', trigger: 'blur' },
            { validator: CheckDevaddr },
          ],
          batchId: [
            { required: true, message: '请输入设备批次', trigger: 'blur' },
          ],
          nodeType: [
            { required: true, message: '请输入设备类型', trigger: 'blur' },
          ],
          netType: [
            { required: true, message: '请选择网络格式', trigger: 'change' },
          ],
          devType: [
            { required: true, message: '请选择设备类型', trigger: 'change' },
          ],
          productName: [
            { required: true, message: '请选择产品名称', trigger: 'change' },
          ],
        },
        pcformrule: {
          pcname: [
            { required: true, message: '请输入批次名称', trigger: 'blur' },
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
        options: [],
        proTableData: [],
        proTableData1: [],
        activelength: [],
        onlinelength: [],
        center: { lng: 0, lat: 0 }, // 经纬度
        zoom: 13, // 地图展示级别
        bmapform: {
          keyword: '',
          location: '',
          address: '',
        },
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
        token: 'user/token',
        roleTree: 'global/roleTree',
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
      this.access_token = store.getters['user/token']
      this.getMenu()
      this.searchProduct()
      this.queryYysId()
      language = Cookies.get('language')
      // this.$store.dispatch('getUserId', '111')
      // if (this.$route.query.productid) {
      //   this.selectProductid(this.$route.query.productid)
      // }
    },
    methods: {
      async selectProdChange(objectId) {
        if (objectId == '0') {
          this.isALL = true
        } else {
          getProduct(objectId).then((res) => {
            const { config = { basedate: { params: [] } } } = res
            this.dialogtempconfig = []
            if (config.basedate.params && config.basedate.params.length > 0) {
              this.dialogtempconfig = config.basedate.params
              console.log('this.dialogtempconfig', this.dialogtempconfig)
            }
          })
          this.listLoading = true
          this.isALL = false
          this.tableData = []
          const params = {
            limit: this.devicelength,
            skip: this.devicestart,
            order: '-createdAt',
            count: 'objectId',
            include: 'product',
            where: {},
          }
          if (this.deviceinput != '') {
            if (this.selectdevice == '设备名称') {
              params.where.name = this.deviceinput
            } else {
              params.where.devaddr = this.deviceinput
            }
          }
          if (this.onlinedevices != '') {
            if (this.onlinedevices == '在线') {
              params.where.status = 'ONLINE'
            } else {
              params.where.status = 'OFFLINE'
            }
          }
          if (this.devicenumber != '') {
            params.where.devaddr = this.devicenumber
          }
          params.where.product = objectId
          this.devicestart = 0

          const { results = [], count = 0 } = await querycompanyDevice(
            params,
            this.access_token
          )
          results.forEach((item) => {
            if (item.ACL) {
              for (var key in item.ACL) {
                item.Company = key.substr(5)
              }
            } else {
              item.Company = ''
            }
            if (item.basedata) {
              for (var key in item.basedata) {
                item[key] = item.basedata[key]
              }
            }
          })
          this.tableData = results
          this.devicetotal = count
          console.log('tableData', this.tableData)
        }
        this.listLoading = false
      },

      // 显示菜单树
      showTree(objectId, acl) {
        this.deviceId = objectId
        this.deciceCompany = acl
        this.popoverVisible = !this.popoverVisible
      },
      // 显示设备位置
      showMap(location, objectId) {
        this.deviceId = objectId
        const { latitude = 0, longitude = 0 } = location
        if (Number(latitude) && Number(longitude)) {
          this.mapDialog = true
          this.center.lng = longitude
          this.center.lat = latitude
        } else {
          this.$message.error('位置信息获取失败')
        }
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
          detail: { factory: data.depname },
        }
        this.$confirm(
          this.$translateTitle(`确定要将设备迁移到` + data.name + '吗'),
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(async () => {
            const { updatedAt } = await putDevice(this.deviceId, parmas)
            if (updatedAt) {
              this.popoverVisible = false
              this.getMenu()
              this.$message({
                type: 'success',
                message: this.$translateTitle(`迁移成功`),
              })
            } else {
              this.$message({
                type: 'error',
                message: this.$translateTitle(`迁移失败`),
              })
            }
          })
          .catch((e) => {
            console.log(e)
          })
        console.log(data.name)
      },
      getMenu() {
        this.deptTreeData = this.roleTree
        this.handleNodeClick(results[0], 0)
      },
      async handleNodeClick(data, node) {
        if (node.level != 1) {
          // 在这里获取点击厂家的session
          const { access_token = '' } = await getToken(data.name)
          this.access_token = access_token
        } else {
          this.access_token = store.getters['user/token']
        }
        // 点击的公司名
        const { name, objectId } = data
        this.curDepartmentId = objectId
        // this.Company = name
        this.getDevices(0)
      },
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
          this.yysSelect = [{ name: '空', key: '' }]
          res.results.map((item) => {
            this.yysSelect.push(item.data)
          })
        })
      },
      async rolesSelect(val) {
        this.productroleslist = []
        const { results } = await this.$get_object('Product', val)
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
      //   const parsms = {
      //     where: {
      //       product: val,
      //     },
      //   }
      //   const { results } = await this.$query_object('Product', parsms)
      //   const res = results.filter((i) => {
      //     return i.objectId == val
      //   })
      //
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
        //         console.log(searchResult)
        // 　　　　var poi = searchResult.getPoi(0);
        // 　　　　console.log(poi.point.lng + "," + poi.point.lat) //获取经度和纬度，将结果显示在文本框中
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
          //   console.log(rs)
          this.bmapform.address = rs.address
          this.deviceform.address = rs.address
          // 地址描述(string)=
          // console.log(rs.address);    //这里打印可以看到里面的详细地址信息，可以根据需求选择想要的
          // console.log(rs.addressComponents);//结构化的地址描述(object)
          // console.log(rs.addressComponents.province); //省
          // console.log(rs.addressComponents.city); //城市
          // console.log(rs.addressComponents.district); //区县
          // console.log(rs.addressComponents.street); //街道
          // console.log(rs.addressComponents.streetNumber); //门牌号
          // console.log(rs.surroundingPois); //附近的POI点(array)
          // console.log(rs.business); //商圈字段，代表此点所属的商圈(string)
        })
      },
      // 地图更新
      updateLocation() {
        this.bmapdialogVisible = true
      },
      handleClosebmap() {
        this.bmapdialogVisible = false
      },
      // // 激活设备
      // async getActiveDevices() {
      //   var params = {
      //     limit: 1,
      //     count: 'objectId',
      //     where: {
      //       status: 'ACTIVE',
      //     },
      //   }
      //   if (this.deviceinput != '') {
      //     if (
      //       this.selectdevice == '设备名称' ||
      //       this.selectdevice == 'Device Name'
      //     ) {
      //       params.where.name = this.deviceinput
      //     } else {
      //       params.where.devaddr = this.deviceinput
      //     }
      //   }
      //   if (this.devicenumber != '') {
      //     params.where.devaddr = this.devicenumber
      //   }
      //   if (this.equvalue != 0) {
      //     params.where.product = this.equvalue
      //   }
      //   var res = await this.$queryDevice(params)
      //   this.activeall = res.count
      // },
      async getOnlineDevices() {
        var params = {
          limit: 1,
          count: 'objectId',
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
          // params.where.product = this.equvalue
          this.selectProdChange(this.equvalue)
        }
        var res = await querycompanyDevice(params, this.access_token)
        this.onlineall = res.count
      },

      // 查询产品
      async searchProduct() {
        this.proTableData = []
        this.proTableData1 = []
        const parsms = {
          count: 'objectId',
          order: '-updatedAt',
          keys: 'name',
          where: {
            category: 'IotHub',
          },
        }
        const { results } = await this.$query_object('Product', parsms)
        this.proTableData = results
        this.proTableData.unshift({
          name: language == 'zh' ? '全部产品' : 'All Products',
          objectId: '0',
        })

        this.proTableData1 = results.filter((item) => item.objectId != '0')

        if (this.$route.query.productid) {
          this.equvalue = this.$route.query.productid
          this.productenable = false
        }
        // this.getDevices()
      },
      async getDevices(start) {
        this.listLoading = true
        this.tableData = []
        const params = {
          limit: this.devicelength,
          skip: this.devicestart,
          order: '-createdAt',
          count: 'objectId',
          include: 'product',
          where: {},
        }
        if (this.deviceinput != '') {
          if (this.selectdevice == '设备名称') {
            params.where.name = this.deviceinput
          } else {
            params.where.devaddr = this.deviceinput
          }
        }
        if (this.onlinedevices != '') {
          if (this.onlinedevices == '在线') {
            params.where.status = 'ONLINE'
          } else {
            params.where.status = 'OFFLINE'
          }
        }
        if (this.devicenumber != '') {
          params.where.devaddr = this.devicenumber
        }
        if (this.equvalue != 0) {
          // params.where.product = this.equvalue
          this.selectProdChange(this.equvalue)
        }
        if (start == 0) {
          this.devicestart = 0
        }
        const { results = [], count = 0 } = await querycompanyDevice(
          params,
          this.access_token
        )
        results.forEach((item) => {
          if (item.ACL) {
            for (var key in item.ACL) {
              item.Company = key.substr(5)
              // obj.applicationtText = key ? key.substr(5) : ''
            }
          } else {
            item.Company = ''
          }
        })
        this.listLoading = false
        console.log(results)
        results.forEach((i) => {
          if (!i.location) {
            // location 容错处理
            i.location = { longitude: 0, latitude: 0 }
          }
        })
        this.tableData = results
        this.devicetotal = count
        // 查询在线设备
        this.getOnlineDevices()
      },

      // 状态设备编辑
      async handelUpdate(event, row, index) {
        var newData1 = {}
        var that = this
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
          .then(async () => {
            // var newData2 = {}
            // for (var key in row) {
            //   newData2[key] = row[key]
            // }
            // newData2.isEnable = newData2.isEnable == true
            // this.tableData[index] = newData2
            var deviceData = await get_object('Device', row.objectId)
            var isEnable = deviceData.isEnable
            if (isEnable == undefined) {
              isEnable = false
            } else {
              isEnable = !isEnable
            }
            deviceData.isEnable = isEnable
            const { createdAt, ...data } = deviceData
            const { updatedAt, ...data2 } = data
            var result = await this.$update_object(
              'Device',
              row.objectId,
              data2
            )
            if (result != undefined) {
              this.$message({
                type: 'success',
                message: '状态修改成功',
              })
              this.getDevices()
            } else {
              console.log('Device error', error)
              returnLogin(error)
            }
          })
          .catch(async () => {
            this.$message({
              type: 'info',
              message: '已取消修改',
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
      },

      // 批量删除设备
      async deleteDevcie(val) {
        this.multipleTable.map(async (item) => {
          const result = await this.$del_object('Device', item.objectId)
        })
        this.$message({
          message: '删除成功',
          type: 'success',
        })
        this.getDevices()
      },
      async editDevice() {
        const res = await this.$update_object('Device', item.objectId, params)
        if (res.updatedAt) {
          this.initQuery('设备修改成功', 'success')
        } else {
          this.$message({
            type: 'error',
            message: res.error,
          })
        }
      },
      // 设备多个启用和禁用
      // async unactiveDevice(val) {
      //   var fail = 0
      //   this.multipleTable.map(async item => {
      //     var params = {
      //       'objectId': item.objectId,
      //       'isEnable': false
      //     }
      //     const result = await this.$update_object('Device', item.objectId, params)
      //     if (result.code == 101) {
      //       fail++;
      //     }
      //   })

      //   if (fail == 0) {
      //     this.$message({
      //       message: '禁用成功',
      //       type: 'success'
      //     })

      //     this.getDevices()
      //   } else {
      //     this.$message({
      //       message: '禁用失败',
      //       type: 'error'
      //     })
      //   }
      // },
      // 设备多个启用和禁用
      async unactiveDevice(isEnable) {
        const idarr = []
        const requests = []
        this.multipleTable.map((item) => {
          idarr.push(item.objectId)
        })
        const body = {
          isEnable: isEnable,
        }
        const res = await Batchdelete('PUT', 'Device', idarr, body)
        // console.log(res)
        if (res) {
          // 处理不规则的返回参数
          res.forEach((li, index) => {
            li.objectId = idarr[index]
            li.sortIndex = index + 1
            if (Object.keys(res[index])[0] == 'success') {
              li.msg = `edit success`
              li.dangerouslyUseHTMLString = false
            } else {
              li.msg = `<ol>
              edit error <br>
              message: ${li.error.error} <br>
              code: ${li.error.code} <ol>`
              li.dangerouslyUseHTMLString = true
            }
            requests.push({
              type: Object.keys(res[index])[0],
              message: li.msg,
              dangerouslyUseHTMLString: li.dangerouslyUseHTMLString,
            })
          })
          // console.log(requests)
          requests.forEach((i, index) => {
            this.$baseNotify(
              i.message,
              `${idarr[index]}`,
              i.type,
              'top-right',
              5000 * i.sortIndex,
              i.dangerouslyUseHTMLString
            )
          })
          this.getDevices()
        }
      },
      /* @pamras 选中高亮*/
      rowClass({ row, rowIndex }) {
        if (this.selectRow.includes(rowIndex)) {
          return { 'background-color': 'rgba(185, 221, 249, 0.3)' }
        }
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
          productName: '',
          status: '',
          isEnable: '',
          brand: '',
          auth: '',
          yysId: '',
        }
        this.$refs['deviceform'].resetFields()
        this.devicedialogVisible = false
        this.equipmentEditor = '添加'
      },
      addDeviceForm() {
        this.devicedialogVisible = true
        this.arrlist = []
        this.equipmentEditor = '添加'
        if (this.$route.query.productid) {
          this.deviceform.productName = this.$route.query.productid
        } else {
          if (this.equvalue != 0) {
            this.changeproduct = false
            this.deviceform.productName = this.equvalue
            this.selectChange(this.equvalue, 'add')
          } else {
            this.deviceform.productName = ''
          }
        }
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
      async makeSure(scope) {
        // 可以在这里执行删除数据的回调操作.......删除操作.....
        const res = await this.$del_object('Device', scope.row.objectId)
        if (res.error) {
          this.$message({
            type: 'error',
            message: '删除失败',
          })
        } else {
          this.$message({
            type: 'success',
            message: '删除成功',
          })
          this.getDevices()
        }
        scope._self.$refs[`popover-${scope.$index}`].doClose()
      },
      /* device表单修改*/
      async editorDevice(row) {
        this.selectChange(row.product.objectId, 'edit')
        this.deviceform = {}
        // 这里再去查询tag
        console.log('row', row)
        this.deviceid = row.objectId
        this.devicedialogVisible = true
        this.deviceform = {
          devaddr: row.devaddr,
          name: row.name,
          assetNum: row.detail.assetNum,
          devModel: row.detail.devModel,
          desc: row.detail.desc,
          productid: row.product.objectId,
          brand: row.detail.brand,
          productName: row.product.objectId,
          status: row.status,
          isEnable: row.isEnable,
          address: row.detail.address,
        }
        for (var key in row.basedata) {
          this.$set(this.deviceform, key, row.basedata[key])
        }
        console.log('this.deviceform', this.deviceform)
        this.bmapform = {
          address: row.detail.address,
        }
        this.center = {
          lat: location.latitude,
          lng: location.longitude,
        }
        // row.location.latitude +  row.location.longitude
        // this.addresspointer = row.latitude + ',' + row.longitude
        this.addresspointer =
          row.detail == undefined
            ? ''
            : location == undefined
            ? ''
            : location.latitude + row.detail == undefined
            ? ''
            : location.longitude
        this.equipmentEditor = '编辑'
        // this.rolesSelect(row.productid)
        // this.deviceform.batchId = row.detail.batchId.batch_name
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
      initQuery(msg, type) {
        this.$message({
          type: type || 'info',
          message: msg,
        })
        this.dialogFormVisible = false
        // this.resetProductForm()
        // this.$refs['ruleForm'].resetFields()
        this.getDevices()
      },
      async updateDevice(params) {
        const res = await this.$update_object('Device', this.deviceid, params)
        if (res.updatedAt || res.devaddr) {
          this.initQuery('设备更新成功', 'success')
        } else {
          this.$message({
            type: 'error',
            message: res.error,
          })
        }
      },
      async createDevice(params) {
        const res = await this.$create_object('Device', params)
        if (res.objectId) {
          this.initQuery('设备创建成功', 'success')
        } else {
          this.$message({
            type: 'error',
            message: res.error,
          })
        }
      },
      selectChange(objectId, flag) {
        this.arrlist = []
        getProduct(objectId).then((res) => {
          const { config = { basedate: {} } } = res
          if (config.basedate.params.length > 0) {
            this.arrlist = config.basedate.params
            if (flag == 'add') {
              this.arrlist.map((item) => {
                if (item.type == 'bool') {
                  this.$set(this.deviceform, item.identifier, item.default)
                } else if (item.type == 'enum') {
                  this.$set(
                    this.deviceform,
                    item.identifier,
                    item.specs[0].attribute
                  )
                } else {
                  if (item.default) {
                    this.$set(this.deviceform, item.identifier, item.default)
                  } else {
                    this.$set(this.deviceform, item.identifier, '')
                  }
                }
                if (item.required) {
                  if (item.type == 'bool') {
                    this.rules[item.identifier] = [
                      {
                        required: true,
                        message: '请选择' + item.name,
                        trigger: 'change',
                      },
                    ]
                  } else {
                    this.rules[item.identifier] = [
                      {
                        required: true,
                        message: '请输入' + item.name,
                        trigger: 'blur',
                      },
                    ]
                  }
                }
              })
            }
            console.log('afd', this.arrlist)
          }
        })
      },
      async submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var location = {
              __type: 'GeoPoint',
              latitude: this.center.lat ? this.center.lat : 0,
              longitude: this.center.lng ? this.center.lng : 0,
            }
            var detail = {
              assetNum: this.deviceform.assetNum,
              devModel: this.deviceform.devModel,
              brand: this.deviceform.brand,
              address: this.bmapform.address,
              desc: this.deviceform.desc,
            }
            var obj = {}
            for (var key in this.deviceform) {
              obj[key] = this.deviceform[key]
            }
            this.$delete(obj, 'address')
            this.$delete(obj, 'assetNum')
            this.$delete(obj, 'batchId')
            this.$delete(obj, 'brand')
            this.$delete(obj, 'desc')
            this.$delete(obj, 'devModel')
            this.$delete(obj, 'devType')
            this.$delete(obj, 'devaddr')
            this.$delete(obj, 'isEnable')
            this.$delete(obj, 'name')
            this.$delete(obj, 'netType')
            this.$delete(obj, 'nodeType')
            this.$delete(obj, 'productName')
            this.$delete(obj, 'status')
            this.$delete(obj, 'productid')
            getProduct(this.deviceform.productName).then((response) => {
              if (response) {
                if (this.deviceid != '') {
                  // 编辑
                  var devicesParmas = {
                    name: this.deviceform.name,
                    devaddr: this.deviceform.devaddr,
                    product: {
                      __type: 'Pointer',
                      className: 'Product',
                      objectId: response.objectId,
                    },
                    detail: detail,
                    location: location,
                    basedata: obj,
                  }
                  this.updateDevice(devicesParmas)
                  this.handleClose()
                  this.getDevices()
                } else {
                  var params = {
                    count: 'objectId',
                    where: {
                      name: { $in: [this.deviceform.name] },
                      devaddr: { $in: [this.deviceform.devaddr] },
                    },
                  }
                  this.$query_object('Device', params).then((result) => {
                    if (result.count > 0) {
                      this.$message('此设备已被创建')
                      return
                    } else {
                      var devicesParmas = {
                        product: {
                          __type: 'Pointer',
                          className: 'Product',
                          objectId: this.deviceform.productName,
                        },
                        status: 'OFFLINE',
                        isEnable: false,
                        ACL: response.ACL,
                        name: this.deviceform.name,
                        devaddr: this.deviceform.devaddr,
                        objectId: this.deviceform.devaddr,
                        lastOnlineTime: 0,
                        detail: detail,
                        location: location,
                        basedata: obj,
                      }
                      // console.log(devicesParmas)
                      this.createDevice(devicesParmas)
                      this.deviceform = {}
                      this.handleClose()
                      this.getDevices()
                    }
                  })
                }
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: '请按照要求填写参数',
            })
            return false
          }
        })
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
      // 组态
      konvaDevice(row) {
        this.$router.push({
          path: '/Topo/VueKonva',
          query: {
            productid: row.product.objectId,
            devaddr: row.devaddr,
            deviceid: row.objectId,
            type: 'device',
          },
        })
      },
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .equtabs {
    height: calc(100vh - #{$base-top-bar-height} * 4 + 38px);
    margin: 20px;
    overflow-x: hidden;
    overflow-y: scroll;

    .equ_header {
      box-sizing: border-box;
      width: 100%;
      height: 60px;
      margin: 0 auto;

      ul {
        box-sizing: border-box;
        display: flex;
        width: 200px * 4;
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
          //&:last-child {
          //  flex-grow: 2;
          //  text-align: right;
          //  border: 0;
          //}

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

  .leftTree {
    width: 200px;
    /* height: calc(100vh - #{$base-top-bar-height}* 4 + 38px); */
    overflow-x: scroll;
    overflow-y: scroll;

    ::v-deep .el-tree {
      width: 200px;
      height: calc(100vh - 60px * 4 + 30px);
      overflow-x: scroll;
      overflow-y: scroll;
    }
  }

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
    max-width: 200px;
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
