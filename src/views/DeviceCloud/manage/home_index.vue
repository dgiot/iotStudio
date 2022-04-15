<template>
  <div class="equipment equipment-container">
    <div class="dialog">
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
      <el-dialog
        :append-to-body="true"
        top="5vh"
        :visible.sync="mapDialog"
        width="80vh"
      >
        <baidu-map
          :ak="secret.baidu.map"
          :center="center"
          :map-click="false"
          :scroll-wheel-zoom="true"
          style="height: 80vh"
          :zoom="zoom"
          @click="mapClick"
          @ready="handler"
        >
          <bm-marker
            animation="BMAP_ANIMATION_BOUNCE"
            :dragging="true"
            :position="center"
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
      <el-dialog
        :append-to-body="true"
        :title="devicedetail.name"
        top="5vh"
        :visible.sync="InfoDialog"
        width="80%"
      >
        <el-tabs
          v-model="activeparseTbas"
          size="mini"
          type="border-card"
          @tab-click="handleTabClick"
        >
          <el-tab-pane
            v-for="item in parseTbas"
            :key="item.name"
            :label="item.name"
            :name="item.name"
          >
            <ele-form
              v-model="item.config"
              :request-fn="handleSubmit"
              v-bind="item.config"
              @request-success="handleSuccess(item)"
            />
            <!--            <f-render v-model="item.config" :config="item.config" pure />-->
            <!--            <f-render :config="item.config" />-->
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="InfoDialog = false">
            {{ $translateTitle('developer.cancel') }}
          </el-button>
          <el-button type="primary" @click.native="InfoDialog = false">
            {{ $translateTitle('developer.determine') }}
          </el-button>
        </span>
      </el-dialog>
      <el-dialog
        :append-to-body="true"
        :before-close="CloseState"
        :title="stateDialog.name"
        top="5vh"
        :visible.sync="stateDialog"
        width="80%"
      >
        <deviceState :devicedetail="stateDetail" @ParserSave="ParserSave" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="stateDialog = false">
            {{ $translateTitle('developer.cancel') }}
          </el-button>
          <el-button type="primary" @click.native="stateDialog = false">
            {{ $translateTitle('developer.determine') }}
          </el-button>
        </span>
      </el-dialog>
    </div>
    <div class="equtabs">
      <!--tabs第一个标签页-->
      <!--      <div class="equ_header">-->
      <!--        <ul>-->
      <!--          <li>-->
      <!--            <p>-->
      <!--              <span class="svg-container">-->
      <!--                <dgiot-icon icon="device-fill" />-->
      <!--              </span>-->

      <!--              <el-tooltip-->
      <!--                :content="$translateTitle('equipment.totalequipment')"-->
      <!--                placement="top"-->
      <!--              >-->
      <!--                <i class="el-icon-question" />-->
      <!--              </el-tooltip>-->
      <!--            </p>-->
      <!--            <span>{{ devicetotal }}</span>-->
      <!--          </li>-->
      <!--          <li>-->
      <!--            <p>-->
      <!--              <span class="svg-container">-->
      <!--                <dgiot-icon icon="24-hours-line" />-->
      <!--              </span>-->
      <!--              {{ $translateTitle('equipment.onlinedevices') }}-->
      <!--              <el-tooltip-->
      <!--                :content="$translateTitle('equipment.totalonline')"-->
      <!--                placement="top"-->
      <!--              >-->
      <!--                <i class="el-icon-question" />-->
      <!--              </el-tooltip>-->
      <!--            </p>-->
      <!--            <span>{{ onlineall }}</span>-->
      <!--          </li>-->
      <!--        </ul>-->
      <!--      </div>-->
      <el-tabs v-model="activeName">
        <div class="equdevices">
          <dgiot-query-form>
            <dgiot-query-form-top-panel>
              <el-form
                :inline="true"
                label-width="100px"
                :model="queryForm"
                @submit.native.prevent
              >
                <el-form-item :label="$translateTitle('equipment.Products')">
                  <el-select
                    v-model="equvalue"
                    clearable
                    :disabled="!productenable"
                    @change="selectProdChange"
                  >
                    <el-option
                      v-for="(item, index) in proTableData"
                      v-show="item.objectId != 0"
                      :key="index"
                      :label="item.name"
                      :value="item.objectId"
                    />
                  </el-select>
                </el-form-item>
                <!-- <el-select
                v-model="onlinedevices"
                placeholder="请选择状态"
                class="selectdetail"
                size="small"
                clearable
              > -->
                <el-form-item
                  :label="$translateTitle('equipment.device status')"
                >
                  <el-select
                    v-model="onlinedevices"
                    clearable
                    style="width: 100px"
                  >
                    <!-- <el-option value="在线" /> -->
                    <el-option :value="$translateTitle('zetadevices.online')" />
                    <!-- <el-option value="离线" /> -->
                    <el-option
                      :value="$translateTitle('zetadevices.offline')"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$translateTitle('equipment.condition')">
                  <el-input
                    v-if="
                      selectdevice == $translateTitle('equipment.devicename')
                    "
                    v-model="deviceinput"
                    :placeholder="$translateTitle('equipment.enterproductname')"
                  >
                    <el-select
                      slot="prepend"
                      v-model="selectdevice"
                      style="width: 140px"
                    >
                      <el-option
                        :value="$translateTitle('equipment.devicename')"
                      />
                      <el-option
                        :value="$translateTitle('equipment.devicenumber')"
                      />
                    </el-select>
                    <i
                      slot="suffix"
                      class="el-icon-search"
                      style="line-height: 32px; color: #606266; cursor: pointer"
                      @click="getDevices({ start: 0 })"
                    ></i>
                  </el-input>
                  <el-input
                    v-else
                    v-model="deviceinput"
                    :placeholder="
                      $translateTitle('equipment.enterdevicenumber')
                    "
                  >
                    <el-select
                      slot="prepend"
                      v-model="selectdevice"
                      style="width: 120px"
                    >
                      <el-option
                        :value="$translateTitle('equipment.devicename')"
                      />
                      <el-option
                        :value="$translateTitle('equipment.devicenumber')"
                      />
                    </el-select>

                    <el-button
                      slot="append"
                      icon="el-icon-search"
                      size="mini"
                      @click="getDevices({ start: 0 })"
                    />
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    class="el-icon-plus"
                    size="small"
                    :title="$translateTitle('equipment.adddevice')"
                    type="primary"
                    @click="addDeviceForm"
                  />
                  <el-button
                    class="el-icon-delete"
                    :disabled="!selectedList.length"
                    size="small"
                    :title="$translateTitle('aintenance.batch deletion')"
                    type="danger"
                    @click="handleDelete(selectedList, 1)"
                  />
                </el-form-item>
                <el-form-item style="display: none">
                  <!-- <el-input v-model="devicenumber" placeholder="请输入设备编号" style="margin:0;"></el-input> -->
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
                  <el-button size="small">
                    {{ $translateTitle('equipment.batchaddition') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </dgiot-query-form-top-panel>
          </dgiot-query-form>
        </div>
        <el-tab-pane :label="$translateTitle('equipment.list')" name="first">
          <div class="tabstable">
            <el-table
              v-show="isALL"
              ref="filterTable"
              v-loading="listLoading"
              :border="border"
              class="tab_wrap_1"
              :data="tableData"
              :row-style="rowClass"
              :size="lineHeight"
              :stripe="stripe"
              style="margin-top: 20px; text-align: center"
              @selection-change="changeBox"
            >
              <el-table-column
                align="center"
                class-name="isCheck"
                show-overflow-tooltip
                sortable
                type="selection"
                width="55"
              />
              <el-table-column
                align="center"
                :label="$translateTitle('equipment.devicenumber')"
                prop="devaddr"
                show-overflow-tooltip
                sortable
                width="100"
              />
              <el-table-column
                align="center"
                :label="$translateTitle('equipment.name')"
                prop="name"
                show-overflow-tooltip
                sortable
              />
              <el-table-column
                align="center"
                :label="$translateTitle('equipment.state')"
                prop="status"
                show-overflow-tooltip
                sortable
                width="80"
              >
                <template #default="{ row }">
                  <span v-if="row.status == 'ONLINE'" :class="row.status">
                    {{ $translateTitle('product.online') }}
                  </span>
                  <!-- <el-tooltip
                    v-if="row.status == 'ONLINE'"
                    content="设备已经上线"
                    placement="top"
                  > -->
                  <el-tooltip
                    v-if="row.status == 'ONLINE'"
                    :content="$translateTitle('equipment.thedeviceisonline')"
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>

                  <span v-if="row.status == 'OFFLINE'" :class="row.status">
                    {{ $translateTitle('product.offline') }}
                  </span>
                  <!-- <el-tooltip
                    v-if="row.status == 'OFFLINE'"
                    content="设备已经离线"
                    placement="top"
                  > -->
                  <el-tooltip
                    v-if="row.status == 'OFFLINE'"
                    :content="$translateTitle('equipment.thedeviceisoffline')"
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                  <span
                    v-if="row.status != 'OFFLINE' && row.status != 'ONLINE'"
                    :class="row.status"
                  >
                    <!-- 未注册 -->
                    {{ $translateTitle('product.unregistered') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('equipment.product')"
                prop="product.name"
                show-overflow-tooltip
                sortable
                width="auto"
              />
              <el-table-column
                align="center"
                :label="$translateTitle('developer.Company')"
                prop="Company"
                show-overflow-tooltip
                sortable
                width="auto"
              />
              <el-table-column
                align="center"
                :label="
                  $translateTitle('developer.enable') +
                  '/' +
                  $translateTitle('developer.prohibit')
                "
                prop="isEnable"
                show-overflow-tooltip
                sortable
                width="auto"
              >
                <template #default="{ row, $index }">
                  <el-switch
                    v-model="row.isEnable"
                    active-color="#5eb058"
                    inactive-color="#cccccc"
                    @change="handelUpdate($event, row, $index)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('developer.createdAt')"
                prop="createdAt"
                show-overflow-tooltip
                sortable
                width="auto"
              >
                <template #default="{ row }">
                  <span>{{ utc2beijing(row.createdAt) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                fixed="right"
                :label="$translateTitle('developer.operation')"
                min-width="220"
                width="auto"
              >
                <template #default="{ row }">
                  <el-button
                    size="mini"
                    style="margin-left: 10px"
                    type="primary"
                    @click="deviceToDetail(row)"
                  >
                    {{ $translateTitle('product.details') }}
                  </el-button>
                  <el-button
                    size="mini"
                    style="text-align: center"
                    type="warning"
                    @click="editorDevice(row)"
                  >
                    {{ $translateTitle('concentrator.edit') }}
                  </el-button>
                  <el-button size="mini" type="info" @click="konvaDevice(row)">
                    {{ $translateTitle('concentrator.konva') }}
                  </el-button>
                  <el-dropdown style="margin: 0 10px">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="isFullscreen = !isFullscreen"
                    >
                      {{ $translateTitle('concentrator.more') }}
                    </el-button>

                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <el-link
                          size="mini"
                          type="primary"
                          @click="showTree(row, row.objectId, row.Company)"
                        >
                          {{ $translateTitle('equipment.move') }}
                        </el-link>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-link
                          size="mini"
                          type="warning"
                          @click="goLink('video', row.objectId)"
                        >
                          {{ $translateTitle('concentrator.video') }}
                        </el-link>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-link
                          size="mini"
                          type="danger"
                          @click="handleDelete(row, 2)"
                        >
                          {{ $translateTitle('developer.delete') }}
                        </el-link>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
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
              @selection-change="changeBox"
            >
              <el-table-column
                align="center"
                class-name="isCheck"
                show-overflow-tooltip
                sortable
                type="selection"
                width="55"
              />
              <el-table-column
                align="center"
                :label="$translateTitle('equipment.devicenumber')"
                prop="devaddr"
                show-overflow-tooltip
                sortable
                width="auto"
              />
              <el-table-column
                align="center"
                :label="$translateTitle('equipment.name')"
                prop="name"
                show-overflow-tooltip
                sortable
                width="auto"
              />
              <el-table-column
                align="center"
                :label="$translateTitle('equipment.state')"
                show-overflow-tooltip
                sortable
                width="100"
              >
                <template #default="{ row }">
                  <span v-if="row.status == 'ONLINE'" :class="row.status">
                    {{ $translateTitle('product.online') }}
                  </span>
                  <el-tooltip
                    v-if="row.status == 'ONLINE'"
                    :content="$translateTitle('equipment.thedeviceisonline')"
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                  <span v-if="row.status == 'OFFLINE'" :class="row.status">
                    {{ $translateTitle('product.offline') }}
                  </span>
                  <el-tooltip
                    v-if="row.status == 'OFFLINE'"
                    :content="$translateTitle('equipment.thedeviceisoffline')"
                    placement="top"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                  <span
                    v-if="row.status != 'OFFLINE' && row.status != 'ONLINE'"
                    :class="row.status"
                  >
                    <!-- 未注册 -->
                    {{ $translateTitle('product.unregistered') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('equipment.product')"
                show-overflow-tooltip
                sortable
                width="auto"
              >
                <template #default="{ row }">
                  <span v-if="row.product && row.product.name">
                    {{ row.product.name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('developer.Company')"
                show-overflow-tooltip
                sortable
                width="auto"
              >
                <template #default="{ row }">
                  <span>
                    {{ row.Company }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                :label="
                  $translateTitle('developer.enable') +
                  '/' +
                  $translateTitle('developer.prohibit')
                "
                show-overflow-tooltip
                sortable
                width="120"
              >
                <template #default="{ row, $index }">
                  <el-switch
                    v-model="row.isEnable"
                    active-color="#5eb058"
                    inactive-color="#cccccc"
                    @change="handelUpdate($event, row, $index)"
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
                  <template #default="{ row }">
                    <span v-if="row[item.default]">
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
                  <template #default="{ row }">
                    <span>
                      {{ item.struct[row[item.identifier]] }}
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
                  <template #default="{ row }">
                    <span>{{ row[item.identifier] }} {{ item.unit }}</span>
                  </template>
                </el-table-column>
              </template>
              <el-table-column
                align="center"
                :label="$translateTitle('developer.createdAt')"
                width="180"
              >
                <template #default="{ row }">
                  <span>{{ utc2beijing(row.createdAt) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                fixed="right"
                :label="$translateTitle('developer.operation')"
                width="300"
              >
                <template #default="{ row }">
                  <el-button
                    size="mini"
                    style="margin-left: 10px"
                    type="primary"
                    @click="deviceToDetail(row)"
                  >
                    {{ $translateTitle('product.details') }}
                  </el-button>
                  <el-button
                    size="mini"
                    style="text-align: center"
                    type="warning"
                    @click="editorDevice(row)"
                  >
                    {{ $translateTitle('concentrator.edit') }}
                  </el-button>
                  <el-button size="mini" type="info" @click="konvaDevice(row)">
                    {{ $translateTitle('concentrator.konva') }}
                  </el-button>
                  <el-dropdown style="margin: 0 10px">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="isFullscreen = !isFullscreen"
                    >
                      {{ $translateTitle('concentrator.more') }}
                    </el-button>

                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <el-link
                          size="mini"
                          type="primary"
                          @click="showTree(row, row.objectId, row.Company)"
                        >
                          {{ $translateTitle('equipment.move') }}
                        </el-link>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-link
                          size="mini"
                          type="warning"
                          @click="goLink('video', row)"
                        >
                          {{ $translateTitle('concentrator.video') }}
                        </el-link>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-link
                          size="mini"
                          type="danger"
                          @click="handleDelete(row, 2)"
                        >
                          {{ $translateTitle('developer.delete') }}
                        </el-link>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <div class="elpagination">
              <!--              <el-pagination-->
              <!--                :page-sizes="[10, 20, 30, 50]"-->
              <!--                :page-size="devicelength"-->
              <!--                :total="devicetotal"-->
              <!--                layout="total, sizes, prev, pager, next, jumper"-->
              <!--                @size-change="deviceSizeChange"-->
              <!--                @current-change="deviceCurrentChange"-->
              <!--              />-->
              <!--              <dgiot-Pagination-->
              <!--                v-show="devicetotal > 0"-->
              <!--                :limit.sync="queryForm.pageSize"-->
              <!--                :page.sync="queryForm.pageNo"-->
              <!--                :total="devicetotal"-->
              <!--                @pagination="getDevices"-->
              <!--              />-->
              <!--              <dgiot-parser-pagination-->
              <!--                :key="devicetotal.length + 'forensics'"-->
              <!--                ref="devicePagination"-->
              <!--                :pagination="paginations"-->
              <!--                :query-payload="queryPayload"-->
              <!--                @pagination="getDevices"-->
              <!--                @paginationQuery="paginationQuery"-->
              <!--              />-->
              <el-pagination
                :background="ination.background"
                :current-page.sync="ination.currentPage"
                :layout="ination.layout"
                :page-size.sync="ination.pageSize"
                :page-sizes="ination.pageSizes"
                :total="ination.total"
                v-bind="$attrs"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
              />
            </div>
          </div>
          <!--添加设备弹窗-->
          <!-- <el-dialog
  :append-to-body="true"
            :title="'设备' + equipmentEditor"
            :visible.sync="devicedialogVisible"
            :close-on-click-modal="false"
            :before-close="handleClose"
            width="50%"
          > -->
          <!--第一个表格-->
        </el-tab-pane>
        <el-tab-pane :label="$translateTitle('equipment.map')" name="second">
          <baidu-map
            :ak="secret.baidu.map"
            :center="{ lng: 116.404, lat: 39.915 }"
            class="map"
            :scroll-wheel-zoom="true"
            style="height: 67vh"
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
              animation="BMAP_ANIMATION_BOUNCE"
              :content="item.name"
              :dragging="true"
              :position="{
                lng: item.location.longitude,
                lat: item.location.latitude,
              }"
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
              anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
              :auto-location="true"
              :show-address-bar="true"
            />
          </baidu-map>
        </el-tab-pane>
        <!--        <el-tab-pane-->
        <!--          :label="$translateTitle('leftbar.analysis')"-->
        <!--          name="analysis"-->
        <!--        >-->
        <!--          <div class="equ_header">-->
        <!--            <el-row>-->
        <!--              <el-col :xs="24" :sm="24" :md="8" :xl="8">-->
        <!--                <el-card class="box-card">-->
        <!--                  <div slot="header" class="clearfix">-->
        <!--                    <span>-->
        <!--                      {{ $translateTitle('equipment.Equipment Overview') }}-->
        <!--                    </span>-->
        <!--                    <el-button-->
        <!--                      icon="el-icon-refresh"-->
        <!--                      style="float: right; padding: 3px 0"-->
        <!--                      type="text"-->
        <!--                    />-->
        <!--                  </div>-->
        <!--                  <div class="text item">-->
        <!--                    <ve-ring-->
        <!--                      height="140px"-->
        <!--                      :data-empty="!chartOnlone.rows"-->
        <!--                      :data="chartOnlone"-->
        <!--                      :settings="chartSettings"-->
        <!--                      :extend="chartExtend"-->
        <!--                    />-->
        <!--                  </div>-->
        <!--                </el-card>-->
        <!--              </el-col>-->
        <!--              <el-col :xs="24" :sm="24" :md="8" :xl="8">-->
        <!--                <el-card class="box-card">-->
        <!--                  <div slot="header" class="clearfix">-->
        <!--                    <span>-->
        <!--                      {{ $translateTitle('equipment.Warning today') }}-->
        <!--                    </span>-->
        <!--                    <el-button-->
        <!--                      icon="el-icon-refresh"-->
        <!--                      style="float: right; padding: 3px 0"-->
        <!--                      type="text"-->
        <!--                    />-->
        <!--                  </div>-->
        <!--                  <div class="text item">-->
        <!--                    <ve-ring-->
        <!--                      height="140px"-->
        <!--                      :data-empty="!chartwaring.rows"-->
        <!--                      :data="chartwaring"-->
        <!--                    />-->
        <!--                  </div>-->
        <!--                </el-card>-->
        <!--              </el-col>-->
        <!--              <el-col :xs="24" :sm="24" :md="8" :xl="8">-->
        <!--                <el-card class="box-card">-->
        <!--                  <div slot="header" class="clearfix">-->
        <!--                    <span>{{ $translateTitle('equipment.Products') }}</span>-->
        <!--                    <el-button-->
        <!--                      icon="el-icon-refresh"-->
        <!--                      style="float: right; padding: 3px 0"-->
        <!--                      type="text"-->
        <!--                    />-->
        <!--                  </div>-->
        <!--                  <div class="text item">-->
        <!--                    <ve-ring-->
        <!--                      height="140px"-->
        <!--                      :data-empty="!chartProduct.rows"-->
        <!--                      :data="chartProduct"-->
        <!--                    />-->
        <!--                  </div>-->
        <!--                </el-card>-->
        <!--              </el-col>-->
        <!--            </el-row>-->
        <!--          </div>-->
        <!--        </el-tab-pane>-->
      </el-tabs>
      <el-dialog
        :append-to-body="true"
        :before-close="handleClose"
        :close-on-click-modal="false"
        :title="$translateTitle('product.edit') + equipmentEditor"
        :visible.sync="devicedialogVisible"
        width="70%"
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
          <el-tabs v-model="imeideviceName">
            <el-tab-pane
              :label="$translateTitle('equipment.commdevice')"
              name="first"
            >
              <el-form
                ref="deviceform"
                label-width="150px"
                :model="deviceform"
                :rules="rules"
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
                        style="width: 100%"
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
                      :label="$translateTitle('equipment.installationlocation')"
                    >
                      <el-input
                        v-model="deviceform.address"
                        @focus="updateLocation"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('equipment.videoSrc')"
                    >
                      <el-input v-model="deviceform.videoSrc" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('equipment.videoType')"
                    >
                      <el-select
                        v-model="deviceform.videoType"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in videoOptions"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
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
                        class="notauto"
                        :disabled="item.readonly"
                        style="width: 100%"
                      >
                        <el-option
                          :label="$translateTitle('product.yes')"
                          :value="true"
                        />
                        <el-option
                          :label="$translateTitle('product.no')"
                          :value="false"
                        />
                      </el-select>
                      <el-select
                        v-else-if="item.type == 'enum'"
                        v-model="deviceform[item.identifier]"
                        class="notauto"
                        :disabled="item.readonly"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="(spec, index1) in item.specs"
                          :key="index1"
                          :label="spec.attributevalue"
                          :value="spec.attribute ? spec.attribute : ''"
                        />
                      </el-select>
                      <el-switch
                        v-else-if="item.type == 'switch'"
                        v-model="deviceform[item.identifier]"
                        active-color="#13ce66"
                        :active-value="item.activevalue"
                        inactive-color="#ff4949"
                        :inactive-value="item.inactivevalue"
                      />
                      <!--                      <el-input-->
                      <!--                        v-else-if="item.unit != ''"-->
                      <!--                        v-model="deviceform[item.identifier]"-->
                      <!--                        :disabled="item.readonly"-->
                      <!--                      />-->
                      <el-input
                        v-else-if="item.readonly"
                        :disabled="item.readonly"
                        :value="
                          deviceform[item.identifier]
                            ? deviceform[item.identifier]
                            : ''
                        "
                      >
                        <el-button slot="append">
                          {{ item.unit ? item.unit : '' }}
                        </el-button>
                      </el-input>
                      <el-input
                        v-else
                        v-model="deviceform[item.identifier]"
                        :disabled="item.readonly"
                      >
                        <el-button slot="append">
                          {{ item.unit ? item.unit : '' }}
                        </el-button>
                      </el-input>
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
              <div style="text-align: right">
                <el-button
                  type="primary"
                  @click.native="submitForm('deviceform')"
                >
                  {{ $translateTitle('developer.determine') }}
                </el-button>
                <el-button @click="handleClose">
                  {{ $translateTitle('developer.cancel') }}
                </el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane
              v-if="equipmentEditor != '编辑'"
              :label="$translateTitle('equipment.imeidevice')"
              name="second"
            >
              <el-form
                ref="imeiform"
                label-width="150px"
                :model="imeiform"
                :rules="rules"
              >
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="IMEI" prop="devimei">
                      <el-input v-model="imeiform.devimei" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('product.productname')"
                      prop="productName"
                    >
                      <el-select
                        v-model="imeiform.productName"
                        :placeholder="$translateTitle('equipment.entername')"
                        style="width: 100%"
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
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('equipment.installationlocation')"
                    >
                      <el-input
                        v-model="imeiform.address"
                        @focus="updateLocation"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div style="text-align: right">
                <el-button
                  type="primary"
                  @click.native="submitimeiForm('imeiform')"
                >
                  {{ $translateTitle('developer.determine') }}
                </el-button>
                <el-button @click="handleClose">
                  {{ $translateTitle('developer.cancel') }}
                </el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-dialog>
      <!-- <el-dialog
  :append-to-body="true"
            v-drag-dialog
            :visible.sync="bmapdialogVisible"
            :close-on-click-modal="false"
            :before-close="handleClosebmap"
            title="设备安装地址"
            width="50%"
          > -->
      <el-dialog
        v-drag-dialog
        :append-to-body="true"
        :before-close="handleClosebmap"
        :close-on-click-modal="false"
        :title="$translateTitle('developer.equipmentinstallationaddress')"
        :visible.sync="bmapdialogVisible"
        width="50%"
      >
        <div>
          <el-form :inline="true" :model="bmapform" size="small">
            <!-- <el-form-item label="地址">
              <el-input v-model="bmapform.location" placeholder="请输入市或者县名称"></el-input>
            </el-form-item>-->
            <!-- <el-form-item label="地址名称"> -->
            <el-form-item :label="$translateTitle('developer.addressname')">
              <el-input v-model="bmapform.keyword" />
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click.native="addressSure">搜 索</el-button>
            </el-form-item>-->
            <!-- <el-form-item label="选中地址"> -->
            <el-form-item :label="$translateTitle('developer.selectaddress')">
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
            <!-- 保存 -->
            {{ $translateTitle('product.preservation') }}
          </el-button>
          <el-button @click="bmapdialogVisible = false">
            <!-- 取消 -->
            {{ $translateTitle('developer.cancel') }}
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import deviceState from '@/components/Device/deviceState'
  import { mapGetters, mapMutations } from 'vuex'
  import { batch, Batchdelete } from '@/api/Batch'
  import { Promise } from 'q'
  import { getProduct, queryProduct } from '@/api/Product/index'
  import {
    BaiduMap,
    BmCityList,
    BmControl,
    BmGeolocation,
    BmLabel,
    BmLocalSearch,
    BmMapType,
    BmMarker,
    BmNavigation,
    BmOverviewMap,
    BmPanorama,
    BmScale,
  } from 'vue-baidu-map'
  import { returnLogin } from '@/utils/utilwen'
  import {
    addimeidevice,
    putDevice,
    querycompanyDevice,
    getDevice,
  } from '@/api/Device'
  import { getToken } from '@/api/Menu'
  import { secret } from '@/config/secret.config'

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
      deviceState,
    },
    data() {
      let imei = /^[0-9]{15}$/
      let isimei = (rule, value, callback) => {
        if (!imei.test(value)) {
          return callback(new Error('请输入15位IMEI'))
        } else {
          callback()
        }
      }
      this.chartSettings = {
        radius: [5, 40],
        offsetY: 70,
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
        queryPayloads: {
          where: {
            // $lt	Less Than
            // $lte	Less Than Or Equal To
            // $gt	Greater Than
            // $gte	Greater Than Or Equal To
            // $ne	Not Equal To
            // $in	Contained In
            // $nin	Not Contained in
            // $exists	A value is set for the key
            // $select	This matches a value for a key in the result of a different query
            // $dontSelect	Requires that a key’s value not match a value for a key in the result of a different query
            // $all	Contains all of the given values
            // $regex	Requires that a key’s value match a regular expression
            // $text	Performs a full text search on indexed fields
          },
          // excludeKeys: '',
          include: '',
          order: '-updatedAt',
          limit: 10,
          skip: 0,
          count: 'objectId',
        },
        pagination: {
          // 每页显示个数选择器的选项设置
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          // 组件布局，子组件名用逗号分隔
          layout: 'total, sizes, prev, pager, next, jumper',
          // 是否为分页按钮添加背景色
          background: true,
          // 是否显示本控件
          hidden: false,
          // 是否使用小型分页样式
          small: false,
          // 每页显示条目个数，支持 .sync 修饰符
          pageSize: 10,
          // 总条目数
          total: 0,
          // 总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性
          pageCount: 0,
          // 页码按钮的数量，当总页数超过该值时会折叠 大于等于 5 且小于等于 21 的奇数
          pagerCount: 7,
          // 当前页数，支持 .sync 修饰符
          currentPage: 1,
          // 每页显示个数选择器的下拉框类名
          popperClass: '',
          // 替代图标显示的上一页文字
          prevText: '',
          // 替代图标显示的下一页文字
          nextText: '',
          // 是否禁用
          disabled: false,
          // 只有一页时是否隐藏
          hideOnSinglePage: false,
        },
        deviceInfo: {},
        paginations: { layout: 'total, sizes, prev, pager, next, jumper' },
        queryPayload: {
          excludeKeys: 'data',
          include: '',
          order: '-createdAt',
          limit: 10,
          skip: 0,
          count: 'objectId',
        },
        secret: secret,
        productDetail: {},
        addACL: {},
        videoOptions: ['m3u8', 'mp4', 'flv', 'mp3'],
        queryInfo: {},
        isFullscreen: false,
        border: true,
        // height: this.$baseTableHeight(1),
        stripe: true,
        lineHeight: 'medium',
        aclObj: {},
        editRow: {},
        selectedList: [],
        formData: {},
        topicData: [],
        InfoDialog: false,
        devicedetail: {},
        stateDialog: false,
        stateDetail: {},
        chartOnlone: {
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
        chartwaring: {},
        parseTbas: [],
        activeparseTbas: '',
        chartProduct: {},
        queryForm: {
          account: '',
          searchDate: '',
          pageNo: 1,
          pageSize: 20,
          workGroupName: '',
          workGroupTreeShow: false,
          statusFlag: false,
          status: '',
          number: '',
          product: '',
          type: '',
          limit: 20,
          skip: 0,
          order: '-createdAt',
          keys: 'count(*)',
        },
        treeDataValue: '',
        isALL: true,
        sizeZoom: 10,
        activeName: 'first',
        imeideviceName: 'first',
        mapDialog: false,
        dialogtempconfig: [],
        arrlist: [],
        deviceId: '',
        deciceCompany: '',
        gutter: 24,
        leftRow: 3,
        rightRow: 21,
        popoverVisible: false,
        dgioticon: 'ancient-gate-fill',
        Company: sessionStorage.getItem('title') || '',
        curDepartmentId: '',
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
        equvalue: '',
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
        imeiform: {
          devimei: '',
          productName: '',
          address: '',
        },
        deviceform: {
          videoSrc: '',
          videoType: 'm3u8',
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
          devimei: [
            {
              required: true,
              message: '请输入设备IMEI',
              trigger: 'blur',
            },
            { validator: isimei },
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
        options: [],
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
      query: function () {
        // eslint-disable-next-line vue/no-reserved-keys
        return _.merge(this.queryPayload, this.queryPayloads)
      },
      ination: function () {
        // eslint-disable-next-line vue/no-reserved-keys
        return _.merge(this.pagination, this.paginations)
      },
      ...mapGetters({
        _tableDict: 'global/_tableDict',
        token: 'user/token',
        roleTree: 'user/roleTree',
        language: 'settings/language',
        _product: 'user/_Product',
        _role: 'acl/role',
        currentDepartment: 'user/currentDepartment',
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
      this.onlinedevices =
        this.$route.query.deciceType == 'dev_online'
          ? '在线'
          : this.$route.query.deciceType == 'dev_unline'
          ? '离线'
          : ''
      this.selectdevice = this.language == 'zh' ? '设备名称' : 'devicename'
      this.queryProduct()
      this.getDevices()
      this.aclObj = this.$aclObj(this._role)
      dgiotlog.log('this.aclObj', this.aclObj)
    },
    methods: {
      /**
       * @description 每页显示多少条
       * @param pagesize
       */
      handleSizeChange(pagesize) {
        console.log(this.$route)
        let query = this.query
        query.limit = pagesize
        this.queryPayloads.limit = pagesize
        this.queryPayload.limit = pagesize
        this.queryForm.limit = pagesize
        // this.$emit('paginationQuery', query)
        // this.$emit('pagination', query)
        this.paginationQuery(query)
        this.getDevices(query)
      },
      handleCurrentChange(currentPage) {
        console.log(this.$route.path)
        let query = this.query
        query.skip = (currentPage - 1) * this.ination.pageSize
        this.queryPayloads.skip = (currentPage - 1) * this.ination.pageSize
        this.queryPayload.skip = (currentPage - 1) * this.ination.pageSize
        this.queryForm.skip = (currentPage - 1) * this.ination.pageSize
        // this.$emit('paginationQuery', query)
        // this.$emit('getDevices', query)
        this.paginationQuery(query)
        this.getDevices(query)
      },
      async paginationQuery(queryPayload) {
        this.queryPayload = queryPayload
      },
      async goLink(type, objectId) {
        const { basedata = {} } = await getDevice(objectId)
        console.error(objectId, basedata)
        if (basedata?.videoSrc?.length) {
          this.$router.push({
            path: '/Tools/player',
            query: {
              type: basedata.videoType || 'm3u8',
              url: basedata.videoSrc,
            },
          })
        } else {
          this.$message.info(
            this.$translateTitle(
              'equipment.The device is not bound to the video address yet'
            )
          )
          return false
        }
      },
      handleTabClick(tab, event) {
        dgiotlog.log(this.activeparseTbas)
        dgiotlog.log(this.parseTbas)
      },
      async updateParse(table, field, deviceId, item, params = {}) {
        console.clear()
        dgiotlog.log('字段', field)
        params[`${field}`] = {}
        let isField = [] // parse表中存在字段
        let noField = [] // parse表中不存在的字段
        dgiotlog.log(this.queryInfo)
        dgiotlog.log('frender ', item)
        for (let v in item.config) {
          if (this.queryInfo[`${v}`]) {
            //字段存在去做一下判斷 更新数据
            dgiotlog.log(item.config[`${v}`], v)
            params[`${field}`][`${v}`] = item.config[`${v}`]
          } else {
            dgiotlog.log(item.config[`${v}`], '字段不存在')
            noField.push[item.config[`${v}`]]
            // 字段不存在的话，从 formDesc 中找
            // if (typeof item.config.formDesc[`${v}`] == 'object') {
            //   dgiotlog.log(' item.config', item.config)
            //   dgiotlog.log(' item.config', `${item.config.formDesc[`${v}`]}`)
            //   params.field[`${item.config.formDesc[`${v}`]}`] =
            //     item.config.formDesc[`${v}`].default
            // } else {
            // }
          }
        }

        dgiotlog.log('isField', isField)
        dgiotlog.log('noField', noField)
        dgiotlog.log('params', params.field)
        // 对数据进行合并处理
        let mergerInfo = {}
        mergerInfo[`${field}`] = this.queryInfo
        const _mergeparams = _.merge(mergerInfo, params)
        dgiotlog.log(_mergeparams, '合并后的數據')
        dgiotlog.log({ field: _mergeparams[`${field}`] })
        try {
          const res = await this.$update_object(table, deviceId, _mergeparams)
          dgiotlog.log(res)
          this.$message({
            showClose: true,
            message: this.$translateTitle('user.update completed'),
            type: 'success',
          })
        } catch (error) {
          dgiotlog.log(error)
          this.$message.error(`${error}`)
        }
      },
      ...mapMutations({
        set_tableDict: 'global/set_tableDict',
        set_tableParser: 'global/set_tableParser',
      }),
      handleSubmit(data) {
        dgiotlog.log('data', data)
        // eslint-disable-next-line no-console
        return Promise.resolve()
      },
      handleSuccess(item) {
        if (item.table && item.field && item.config.order) {
          // 首先查一下这个表中对应的字段
          this.$get_object(item.table, this.deviceId).then((res) => {
            dgiotlog.log(res)
            this.queryInfo = res[`${item.field}`]
            if (this.queryInfo) {
              this.updateParse(item.table, item.field, this.deviceId, item)
            } else {
              this.$message.error(`${item.table} no field ${item.field}`)
            }
          })
        } else {
          this.$message.error(`${item.table} no field ${item.field}`)
        }
      },
      changeBox(val) {
        this.selectedList = []
        val.forEach((item) => {
          this.selectedList.push(item)
        })
        dgiotlog.log(this.selectedList)
      },
      handleDelete(row, type) {
        let batchParams = []

        if (type == 2) {
          batchParams.push({
            method: 'DELETE',
            path: `/classes/Device/${row.objectId}`,
            body: {},
          })
        } else {
          row.forEach((item) => {
            batchParams.push({
              method: 'DELETE',
              path: `/classes/Device/${item.objectId}`,
              body: {},
            })
          })
        }
        dgiotlog.log(batchParams, 'batchParams')
        this.$baseConfirm(
          this.$translateTitle(
            'Maintenance.Are you sure you want to delete the current item'
          ),
          null,
          async () => {
            const res = await batch(batchParams)
            this.$baseMessage(
              this.$translateTitle('Maintenance.successfully deleted'),
              'success',
              'dgiot-hey-message-success'
            )
            setTimeout(() => {
              this.getDevices({ start: 0 })
            }, 1500)
          }
        )
      },
      ParserSave(e) {
        dgiotlog.log(
          `如果监听到有修改,则更新vuex 并 存入到数据库 ${JSON.stringify(e)}`
        )
      },
      async queryProduct() {
        // 查询产品
        this.proTableData = []
        this.proTableData1 = []
        const { results = [] } = await queryProduct({
          count: 'objectId',
          order: '-updatedAt',
          // keys: 'name',
          where: {},
        })
        this.proTableData = results

        dgiotlog.log(this.proTableData, '  this.proTableData')

        if (this.$route.query.product) {
          this.proTableData.forEach((i, index) => {
            if (i.objectId == this.$route.query.product) {
              this.equvalue = this.proTableData[index].objectId
              this.productenable = true
              this.queryForm.access_token = this.token
              this.$nextTick(() => {
                this.selectProdChange(this.$route.query.product)
              })
            }
          })
        }
        this.proTableData1 = results.filter((item) => item.objectId != '0')

        if (this.$route.query.productid) {
          this.equvalue = this.$route.query.productid
          this.productenable = false
        }
        dgiotlog.log('this.equvalue', this.equvalue)
      },
      change(e) {
        dgiotlog.log(e)
        if (e) {
          $('.el-tree').css({
            height: '120px',
            display: 'block',
          })
        }
      },
      async selectProdChange(objectId) {
        if (!objectId) return
        this.listLoading = true
        if (objectId == '0') {
          this.isALL = true
        } else {
          await getProduct(objectId).then((res) => {
            this.listLoading = false
            const { config = { basedate: {} } } = res
            const { basedate = { params: [] } } = config
            dgiotlog.log(res, basedate)
            this.dialogtempconfig = []
            if (basedate.params != 'undefined') {
              this.dialogtempconfig = basedate.params
              dgiotlog.log('this.dialogtempconfig', this.dialogtempconfig)
            }
          })
          this.isALL = false
          this.tableData = []
          const params = {
            limit: this.devicelength,
            skip: this.devicestart,
            order: '-createdAt',
            count: 'objectId',
            include: 'product,name',
            where: {
              product: { $ne: null },
              name: {
                $ne: null,
                $exists: true,
              },
            },
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
            this.queryForm.access_token
          )
          results.forEach((item) => {
            if (_.isEmpty(item.location)) {
              item.location = {
                longitude: 0,
                latitude: 0,
              }
            }
            if (item.ACL) {
              for (var key in item.ACL) {
                item.Company = key.substr(5)
              }
            } else {
              item.Company = ''
            }
            if (item.profile) {
              for (var key in item.profile) {
                item[key] = item.profile[key]
              }
            }
          })
          dgiotlog.log(results)
          this.tableData = results
          this.devicetotal = count
          this.pagination.total = count
          this.chartOnlone.rows[1]['数量'] = this.devicetotal
          dgiotlog.log('tableData', this.tableData)
        }
        this.listLoading = false
      },

      // 显示菜单树
      showTree(row, objectId, acl) {
        this.deviceInfo = row
        this.deviceId = objectId
        this.deciceCompany = acl
        this.popoverVisible = !this.popoverVisible
      },
      CloseState() {
        this.stateDialog = false
      },
      // showInfo(data) {
      //   this.deviceId = data.objectId
      //   let _from = {
      //     isArr: [],
      //     obj: [],
      //   }
      //   let parseTbas = []
      //   dgiotlog.log(data)
      //   this.devicedetail = data
      //   if (data.product.config.parser) {
      //     parseTbas.push(...data.product.config.parser)
      //   }
      //   if (data.product.config.profile) {
      //     parseTbas.push(...data.product.config.profile)
      //   }
      //   this.devicedetail = {}
      //   parseTbas = parseTbas.filter((e) => {
      //     return e.visible
      //     // && e.field == 'Device'
      //   })
      //   dgiotlog.log(this.parseTbas)
      //   if (this.devicedetail && parseTbas.length) {
      //     // 拿到设备数据中对应的class
      //     parseTbas.forEach((from) => {
      //       dgiotlog.log(from.class)
      //       dgiotlog.info(
      //         '%c%s',
      //         'color: #fff; background: #20B2AA; font-size: 16px;',
      //         `原始关联${from.table}表中${from.class}字段的值为`
      //       )
      //       dgiotlog.info(
      //         '%c%s',
      //         'color: #fff; background: #20B2AA; font-size: 16px;',
      //         `${JSON.stringify(from.config)}`
      //       )
      //       if (data[`${from.class}`]) {
      //         for (let f in data[`${from.class}`]) {
      //           for (let v in from.config) {
      //             if (f == v) {
      //               if (typeof from.config.formDesc[`${f}`] == 'object') {
      //                 dgiotlog.log(
      //                   f,
      //                   v,
      //                   'f ==== v object',
      //                   from.config.formDesc[`${f}`].label,
      //                   from.config.formDesc[`${f}`].default,
      //                   'data[`${from.class}`][`${v}`] 为 ' +
      //                     data[`${from.class}`][`${v}`]
      //                 )
      //                 _from.obj.push(f)
      //                 from.config.formDesc[`${f}`]['default'] =
      //                   data[`${from.class}`][`${v}`]
      //                 dgiotlog.log(
      //                   from.config.formDesc[`${f}`].label,
      //                   data[`${from.class}`],
      //                   from.config.formDesc[`${f}`].default
      //                 )
      //               } else {
      //                 _from.isArr.push(v)
      //                 from.config[`${f}`] = data[`${from.class}`][`${v}`]
      //               }
      //             } else {
      //               for (let i in from.config.formDesc) {
      //                 if (f == i) {
      //                   _from.obj.push(f)
      //                   from.config.formDesc[`${i}`]['default'] =
      //                     data[`${from.class}`][`${f}`]
      //                 }
      //               }
      //             }
      //           }
      //         }
      //         dgiotlog.log(`对象数据${_from.obj}`)
      //         dgiotlog.log(`数组数据${_from.isArr}`)
      //         dgiotlog.info(
      //           '%c%s',
      //           'color: #fff; background: #20B2AA; font-size: 16px;',
      //           `修改后${from.table}表中${from.class}字段的值为`
      //         )
      //         dgiotlog.info(
      //           '%c%s',
      //           'color: #fff; background: #20B2AA; font-size: 16px;',
      //           `${JSON.stringify(from.config)}`
      //         )
      //       }
      //     })
      //     this.parseTbas = parseTbas
      //     this.$nextTick(() => {
      //       this.activeparseTbas = this.parseTbas[0].name
      //       this.InfoDialog = true
      //     })
      //   } else {
      //     this.$baseMessage(
      //       this.$translateTitle('product.No device template configured yet'),
      //       'error',
      //       'dgiot-hey-message-error'
      //     )
      //   }
      // },
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
        this.deviceInfo.detail['factory'] = data.depname
        const parmas = {
          ACL: aclObj,
          detail: this.deviceInfo.detail,
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
            await putDevice(this.deviceId, parmas).then((res) => {
              if (res.updatedAt) {
                this.popoverVisible = false
                this.$message({
                  type: 'success',
                  message: this.$translateTitle(`迁移成功`),
                })
              } else {
                this.$message({
                  type: 'success',
                  message: this.$translateTitle(`迁移成功`),
                })
              }
            })
          })
          .catch((e) => {
            dgiotlog.log(e)
          })
        dgiotlog.log(data.name)
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
        $('.el-select-dropdown').css({ display: 'none' })
        this.queryForm.workGroupName = data.label
        // 点击的公司名
        const { name, objectId } = data
        this.curDepartmentId = objectId
        // this.Company = name
        if (aclRole.includes(data.name)) {
          this.queryForm.access_token = this.token
        } else if (node.level != 1) {
          // 在这里获取点击厂家的session
          const { access_token = '' } = await getToken(data.name)
          this.queryForm.access_token = access_token
        } else {
          this.queryForm.access_token = this.token
        }
        this.getDevices({ start: 0 })
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
        //         dgiotlog.log(searchResult)
        // 　　　　var poi = searchResult.getPoi(0);
        // 　　　　dgiotlog.log(poi.point.lng + "," + poi.point.lat) //获取经度和纬度，将结果显示在文本框中
        // 　　　　_this.map.centerAndZoom(poi.point, 13);
        // 　　});
        if (this.bmapform.address == '') {
          this.deviceform.address = this.bmapform.keyword
          this.imeiform.address = this.bmapform.keyword
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
          this.imeiform.address = rs.address
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
        this.chartOnlone = {
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
        }
        var params = {
          limit: 1,
          count: 'objectId',
          include: 'product,name',
          keys: 'name',
          where: {
            status: 'ONLINE',
            product: { $ne: null },
            name: {
              $ne: null,
              $exists: true,
            },
          },
        }
        if (this.deviceinput != '') {
          if (this.selectdevice == '设备名称') {
            params.where.name = { $regex: this.deviceinput }
          } else {
            params.where.devaddr = { $regex: this.deviceinput }
          }
        }
        if (this.devicenumber != '') {
          params.where.devaddr = this.devicenumber
        }
        if (this.equvalue != 0) {
          // params.where.product = this.equvalue
          this.selectProdChange(this.equvalue)
        }

        try {
          const { count = 0 } = await querycompanyDevice(
            params,
            this.queryForm.access_token
          )

          this.chartOnlone.rows[1]['数量'] = this.devicetotal - count
          this.chartOnlone.rows[0]['数量'] = count
          // this.$message.success(`${res}`)
        } catch (error) {
          dgiotlog.log(error)
          this.$message.error(`${error}`)
        }
      },
      async getDevices(args = {}) {
        // this.pagination.total = 0
        this.listLoading = true
        // const loading = this.$baseColorfullLoading(3)
        this.tableData = []
        this.queryPayload.excludeKeys =
          'channel,children,config,thing,decoder,data,basedata,content'
        this.queryPayload.include = 'product.name,name'
        this.queryPayload.where = {
          product: { $ne: null },
          name:
            this.selectdevice === '设备名称' && this.deviceinput
              ? { $regex: this.deviceinput }
              : {
                  $ne: null,
                  $exists: true,
                },
          devaddr:
            this.selectdevice === '设备编号' && this.deviceinput
              ? { $regex: this.deviceinput }
              : { $ne: null },
          status:
            this.onlinedevices == '在线'
              ? 'ONLINE'
              : this.onlinedevices == '离线'
              ? 'OFFLINE'
              : { $ne: null },
        }
        if (this.equvalue != 0) {
          // params.where.product = this.equvalue
          this.selectProdChange(this.equvalue)
        }
        if (args.start == 0) {
          this.devicestart = 0
        }
        delete this.queryPayload.productid
        try {
          const { results = [], count = 0 } = await querycompanyDevice(
            this.queryPayload,
            this.queryForm.access_token
          )
          this.listLoading = false
          // loading.close()
          if (!results?.length) return
          results.forEach((item) => {
            if (!item.location) {
              item.location = {
                longitude: 0,
                latitude: 0,
              }
            }
            if (item.ACL) {
              for (var key in item.ACL) {
                item.Company = key.substr(5)
                // obj.applicationtText = key ? key.substr(5) : ''
              }
            } else {
              item.Company = ''
            }
          })
          this.tableData = results
          this.devicetotal = count
          // this.$refs['devicePagination'].ination.total = count
          this.pagination.total = count

          // 查询在线设备
          // this.getOnlineDevices()
        } catch (error) {
          dgiotlog.log(error)
          this.listLoading = false
          // loading.close()
          this.tableData = []
          this.devicetotal = 0
          this.$message.error(`${error}`)
        }
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
            console.log('row', row)
            // var deviceData = await get_object('Device', row.objectId)
            // var isEnable = deviceData.isEnable
            // if (isEnable == undefined) {
            //   isEnable = false
            // } else {
            //   isEnable = !isEnable
            // }
            // deviceData.isEnable = isEnable
            // const { createdAt, ...data } = deviceData
            // const { updatedAt, ...data2 } = data
            var result = await this.$update_object('Device', row.objectId, {
              isEnable: event,
            })
            if (result != undefined) {
              this.$message({
                type: 'success',
                message: '状态修改成功',
              })
              this.getDevices()
            } else {
              dgiotlog.log('Device error', error)
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
        var date = new Date(timestamp * 1200)
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
      // handleSelectionChange(val) {
      //   this.multipleTable = val
      // },

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
        // dgiotlog.log(res)
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
          // dgiotlog.log(requests)
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
          videoSrc: '',
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
      async makeSure(scope, $index) {
        // 可以在这里执行删除数据的回调操作.......删除操作.....
        const res = await this.$del_object('Device', row.objectId)
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
        scope._self.$refs[`popover-${$index}`].doClose()
      },
      /* device表单修改*/
      async editorDevice(row) {
        this.editRow = {}
        this.selectChange(row.product.objectId, 'edit')
        this.deviceform = {}
        // 这里再去查询tag
        dgiotlog.log('row', row)
        this.editRow = row
        this.deviceid = row.objectId
        this.devicedialogVisible = true
        this.imeideviceName = 'first'
        this.deviceform = {
          devaddr: row.devaddr,
          name: row.name,
          assetNum: row.detail.assetNum || '',
          devModel: row.detail.devModel || '',
          desc: row.detail.desc || '',
          productid: row.product.objectId,
          brand: row.detail.brand || '',
          productName: row.product.objectId,
          status: row.status,
          isEnable: row.isEnable,
          videoType: row.detail.videoType || '',
          videoSrc: row.detail.videoSrc || '',
          address: row.detail.address || '',
        }
        dgiotlog.log('this.deviceform12131', this.deviceform)
        dgiotlog.log('row.basedata', row.basedata)
        for (var key in row.basedata) {
          this.$set(this.deviceform, key, row.basedata[key])
        }
        dgiotlog.log('this.deviceform', this.deviceform)
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
        this.getDevices({ start: 0 })
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
          this.deviceform = {}
          this.handleClose()
          this.initQuery('设备创建成功', 'success')
        } else {
          this.$message({
            type: 'error',
            message: res,
          })
        }
      },
      selectChange(objectId, flag = 'add') {
        this.arrlist = []
        getProduct(objectId).then((res) => {
          const { config = { basedate: {} }, ACL } = res
          this.productDetail = res
          // this.addACL = ACL
          if (config.basedate && config.basedate.params.length > 0) {
            this.arrlist = config.basedate.params
            if (flag == 'add') {
              this.arrlist.map((item) => {
                if (item.type == 'bool') {
                  this.$set(
                    this.deviceform,
                    item.identifier ? item.identifier : '',
                    item.default?.length ? item.default : ''
                  )
                } else if (item.type == 'enum') {
                  this.$set(
                    this.deviceform,
                    item.identifier ? item.identifier : '',
                    item.specs?.[0]?.attribute?.length
                      ? item.specs[0].attribute
                      : ''
                  )
                } else {
                  this.$set(
                    this.deviceform,
                    item.identifier ? item.identifier : '',
                    item.default?.length ? item.default : ''
                  )
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
            dgiotlog.log('afd', this.arrlist)
            dgiotlog.log('deviceform', this.deviceform)
            dgiotlog.log('rules', this.rules)
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
              videoType: this.deviceform.videoType,
              videoSrc: this.deviceform.videoSrc,
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
            if (this.deviceid != '') {
              // 编辑
              var devicesParmas = {
                name: this.deviceform.name,
                devaddr: this.deviceform.devaddr,
                product: {
                  __type: 'Pointer',
                  className: 'Product',
                  objectId: this.editRow.product.objectId,
                },
                detail: detail,
                location: location,
                basedata: obj,
                profile: obj,
              }
              this.updateDevice(devicesParmas)
              this.handleClose()
              this.getDevices({ start: 0 })
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
                } else {
                  // const aclKey1 = 'role' + ':' + data.name
                  // const aclObj = {}
                  // aclObj[aclKey1] = {
                  //   read: true,
                  //   write: true,
                  // }
                  const aclKey = 'role' + ':' + this.currentDepartment.name
                  const setAcl = {}
                  setAcl[aclKey] = {
                    read: true,
                    write: true,
                  }
                  var devicesParmas = {
                    product: {
                      __type: 'Pointer',
                      className: 'Product',
                      objectId: this.deviceform.productName,
                    },
                    status: 'OFFLINE',
                    isEnable: false,
                    ACL: setAcl,
                    name: this.deviceform.name,
                    devaddr: this.deviceform.devaddr,
                    objectId: this.deviceform.devaddr,
                    lastOnlineTime: 0,
                    detail: detail,
                    location: location,
                    basedata: obj,
                  }
                  devicesParmas.detail.devType = this.productDetail.devType
                  devicesParmas.detail.category =
                    this.productDetail.category.objectId
                  console.log('createDevice params\n ', devicesParmas)
                  this.createDevice(devicesParmas)
                }
              })
            }
          } else {
            this.$message({
              type: 'error',
              message: '请按照要求填写参数',
            })
            return false
          }
        })
      },
      //imei添加设备
      async submitimeiForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var devicesParmas = {
              productid: this.imeiform.productName,
              devaddr: this.imeiform.devimei,
              latitude: this.center.lat ? this.center.lat : 0,
              longitude: this.center.lng ? this.center.lng : 0,
            }
            addimeidevice(devicesParmas).then((res) => {
              if (res.objectId) {
                this.deviceform = {}
                this.handleClose()
                this.initQuery('设备创建成功', 'success')
              } else {
                this.$message({
                  type: 'error',
                  message: res,
                })
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
            productid: row.product.objectId,
            ischildren: 'false',
          },
        })
      },
      // 组态
      konvaDevice(row) {
        this.$router.push({
          path: '/Topo',
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
<style lang="scss" scoped>
  @media screen and(max-width: 600px) {
    .multipane {
      width: 500px;

      .equtabs {
        width: 500px;
      }

      .pane {
        width: 500px;
      }

      .equde_wrap {
        width: 500px;

        .equdevices {
          width: 100%;

          .tabstable {
            width: 90%;

            .tab_wrap_1 {
              width: 500px;

              .operation_right {
                width: 100px;
              }
            }
          }
        }
      }
    }
    .el-tabs {
      width: 100%;
    }
    .el-tabs__content {
      .el-form {
        width: 100%;

        .el-row {
          display: flex;
          flex-direction: column;
          width: 100%;

          .el-col-12 {
            width: 80%;
          }
        }
      }
    }
  }

  .equtabs {
    margin-top: -40px;
    //height: calc(120vh - #{$base-top-bar-height} * 4);
    overflow-x: hidden;
    overflow-y: scroll;

    .equ_header {
      box-sizing: border-box;
      width: 100%;

      margin: 0 auto;

      .text {
        font-size: 14px;
      }

      .item {
        margin-bottom: 18px;
      }

      .clearfix:before,
      .clearfix:after {
        display: table;
        content: '';
      }

      .clearfix:after {
        clear: both;
      }

      .box-card {
        margin: 0 20px;
      }
    }
  }

  .deviceTree {
    //width: 200px;
    /* height: calc(120vh - #{$base-top-bar-height}* 4 + 38px); */
    overflow-x: scroll;
    //overflow-y: scroll;

    ::v-deep .el-tree {
      //width: 200px;
      //height: calc(120vh - 60px * 4 + 30px);
      height: auto;
      overflow-x: scroll;
      //overflow-y: scroll;
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
    padding: 0;
    //background: #f4f4f4;
  }

  .equipment #pane-first {
    box-sizing: border-box;
    //padding: 10px;
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
    width: 100% !important;
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
  .mailtable .cloumn {
    font-weight: bold;
    color: #74777a;
    text-align: left;
    background: #fafafc;
    border-right: 1px solid #ebecec;
    border-bottom: 1px solid #ebecec;
  }

  .mailtable td {
    box-sizing: border-box;
    padding: 15px;
    font-size: 14px;
    color: #74777a;
    text-align: left;
    border: 1px solid #ebecec;
  }
</style>
