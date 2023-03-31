<template>
  <div class="proddetail">
    <dgiot-profile v-show="false" :product-info="productInfo" />
    <el-dialog
      append-to-body
      :before-close="handleAddressClose"
      class="map_dialog"
      title="安装位置"
      :visible.sync="dialog_address"
      width="70%"
    >
      <el-card>
        <label>
          安装位置：
          <el-input
            v-model="productdetail.config.address"
            @input="inputAddress"
          >
            <i
              slot="suffix"
              class="el-icon-s-promotion"
              style="cursor: pointer"
            ></i>
          </el-input>
        </label>
        <baidu-map
          id="container"
          :key="productdetail.config.location.latitude"
          :ak="ak"
          :center="{
            lng: productdetail.config.location.longitude,
            lat: productdetail.config.location.latitude,
          }"
          :map-click="false"
          :scroll-wheel-zoom="true"
          style="height: 300px"
          :style="{ height: '500px', width: '100%' }"
          :zoom="15"
          @click="mapClick"
        >
          <bm-view class="map" />
          <bm-city-list :offset="{ width: 330, height: 0 }" />
          <bm-local-search
            :auto-viewport="true"
            :keyword="productdetail.config.address"
            :location="{
              lng: productdetail.config.location.longitude,
              lat: productdetail.config.location.latitude,
            }"
          />
          <bm-control>
            <bm-panorama
              anchor="BMAP_ANCHOR_TOP_LEFT"
              :offset="{ width: 500, height: 0 }"
            />
            <bm-overview-map :is-open="true" />
            <bm-scale :offset="{ width: 260, height: 0 }" />
            <bm-city-list :offset="{ width: 450, height: 0 }" />
            <bm-map-type
              anchor="BMAP_ANCHOR_TOP_LEFT"
              :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
              :offset="{ width: 400, height: 0 }"
            />
          </bm-control>
          <bml-marker-clusterer>
            <bm-marker />
            <bm-label />
          </bml-marker-clusterer>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
          <bm-geolocation
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :auto-location="true"
            :show-address-bar="true"
            :show-zoom-info="true"
          />
        </baidu-map>
        <!--        <dgiot-baidu-map-->
        <!--          ref="map"-->
        <!--          :bm-label="true"-->
        <!--          :label="{-->
        <!--            content: productdetail.config.address,-->
        <!--            style: {-->
        <!--              color: 'red',-->
        <!--              fontSize: '24px',-->
        <!--            },-->
        <!--            position: {-->
        <!--              lng: productdetail.config.location.latitude,-->
        <!--              lat: productdetail.config.location.longitude,-->
        <!--            },-->
        <!--            title: productdetail.config.address,-->
        <!--          }"-->
        <!--          :map-center="{-->
        <!--            lng: productdetail.config.location.latitude,-->
        <!--            lat: productdetail.config.location.longitude,-->
        <!--          }"-->
        <!--          :markers="[-->
        <!--            {-->
        <!--              lng: productdetail.config.location.latitude,-->
        <!--              lat: productdetail.config.location.longitude,-->
        <!--            },-->
        <!--          ]"-->
        <!--          :nav-show="true"-->
        <!--          :scale-show="true"-->
        <!--          :scroll-wheel-zoom="true"-->
        <!--        />-->
      </el-card>
      <!--      <span slot="footer" class="dialog-footer">-->
      <!--        <el-button @click="dialog_device = false">取 消</el-button>-->
      <!--        <el-button type="primary" @click="dialog_device = false">-->
      <!--          确 定-->
      <!--        </el-button>-->
      <!--      </span>-->
    </el-dialog>
    <div>
      <el-tabs ref="_tabs" v-model="activeName" @tab-click="handleClick">
        <!--产品信息-->
        <el-tab-pane
          :label="$translateTitle('product.productinformation')"
          name="first"
        >
          <div
            style="box-sizing: border-box; padding: 10px; background: #ffffff"
          >
            <!-- 导出 -->
            <dgiot-query-form>
              <dgiot-query-form-left-panel :disabled="!productName.length">
                <div class="addtopic">
                  <el-button
                    size="small"
                    type="primary"
                    @click.native="exportProduct(productName)"
                  >
                    {{ $translateTitle('product.exportpro') }}
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click.native="setTemplate(productInfo)"
                  >
                    {{ $translateTitle('product.Set as template') }}
                  </el-button>
                </div>
              </dgiot-query-form-left-panel>
              <dgiot-query-form-right-panel>
                <dgiot-help
                  src="https://tech.iotn2n.com/w/docs/details?id=6"
                  title="产品下的所有设备都会继承该产品的 Topic 类"
                  trigger="click"
                />
              </dgiot-query-form-right-panel>
            </dgiot-query-form>
            <div>
              <el-descriptions
                v-loading="productName == ''"
                border
                :column="3"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                element-loading-spinner="el-icon-loading"
                :element-loading-text="
                  $translateTitle('developer.Waitingtoreturn')
                "
                :height="$baseTableHeight(0) - 60"
                size="'medium'"
              >
                <el-descriptions-item
                  :label="$translateTitle('product.productname')"
                >
                  {{ productdetail.name }}
                </el-descriptions-item>
                <el-descriptions-item
                  :label="$translateTitle('product.ProductSecret')"
                >
                  <span v-if="isshow == false">
                    ********************
                    <el-link
                      style="margin-left: 5px; cursor: pointer"
                      type="primary"
                      :underline="false"
                      @click="isshow = true"
                    >
                      {{ $translateTitle('product.display') }}
                    </el-link>
                  </span>
                  <span v-else>
                    <span v-copyText="ProductSecret">{{ ProductSecret }}</span>
                    <el-link
                      style="margin-left: 5px; cursor: pointer"
                      type="primary"
                      :underline="false"
                      @click="isshow = false"
                    >
                      {{ $translateTitle('product.hidden') }}
                    </el-link>
                  </span>
                </el-descriptions-item>
                <el-descriptions-item
                  :label="$translateTitle('product.numberofequipment')"
                >
                  <el-link
                    style="margin-left: 10px; font-size: 16px"
                    type="primary"
                    :underline="false"
                    @click.native="goToDevices"
                  >
                    {{ form.ProductAll }}
                  </el-link>
                </el-descriptions-item>
                <el-descriptions-item
                  :label="$translateTitle('product.nodetype')"
                >
                  <td v-if="productdetail.nodeType == 1" class="notbottom">
                    {{ $translateTitle('product.gateway') }}
                  </td>
                  <td v-else class="notbottom">
                    {{ $translateTitle('product.equipment') }}
                  </td>
                </el-descriptions-item>
                <el-descriptions-item
                  :label="$translateTitle('product.addingtime')"
                >
                  {{ productdetail.createdAt }}
                </el-descriptions-item>
                <el-descriptions-item
                  :label="$translateTitle('deviceLog.productid')"
                >
                  {{ productdetail.objectId }}
                </el-descriptions-item>
                <el-descriptions-item
                  :label="$translateTitle('product.classification')"
                >
                  {{ productdetail.categoryname }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <el-tooltip
                      :content="$translateTitle('product.text1')"
                      effect="light"
                      placement="top"
                      style="margin-left: 5px; color: #cccccc"
                    >
                      <i class="el-icon-question" />
                    </el-tooltip>
                    {{ $translateTitle('product.dynamicregistration') }}
                  </template>
                  <span v-if="dynamicReg == false" style="color: #cccccc">
                    {{ $translateTitle('product.close') }}
                  </span>
                  <span v-else>{{ $translateTitle('product.open') }}</span>
                  <el-switch
                    v-model="dynamicReg"
                    active-color="#5eb058"
                    :active-value="true"
                    inactive-color="#cccccc"
                    :inactive-value="false"
                    @change="handelUpdate($event, dynamicReg)"
                  />
                </el-descriptions-item>
                <el-descriptions-item
                  :label="$translateTitle('product.networking')"
                >
                  <td v-if="productdetail.netType == 'CELLULAR'">
                    <!-- 蜂窝(2G/3G/4G) -->
                    {{ $translateTitle('product.honeycomb') }}(2G/3G/4G)
                  </td>
                  <td v-else-if="productdetail.netType == 'WIFI'">WiFi</td>
                  <td v-else-if="productdetail.netType == 'ETHERNET'">
                    <!-- 以太网 -->
                    {{ $translateTitle('product.ethernet') }}
                  </td>
                  <td v-else-if="productdetail.netType == 'LORA'">LoRaWAN</td>
                  <td v-else>
                    {{ productdetail.netType }}
                  </td>
                </el-descriptions-item>
                <el-descriptions-item
                  :label="$translateTitle('developer.describe')"
                >
                  {{ productdetail.desc || '' }}
                </el-descriptions-item>
                <el-descriptions-item
                  :label="$translateTitle('product.physicalmodel')"
                >
                  <el-button
                    :disabled="productInfo.thing.properties.length == 0"
                    type="text"
                    @click="activeName = 'third'"
                  >
                    {{ productInfo.thing.properties.length || 0 }}
                  </el-button>
                </el-descriptions-item>
                <el-descriptions-item
                  :label="$translateTitle('konva.notificationtemplate')"
                >
                  <!--告警数量 -->
                  <el-button
                    :disabled="amisproductInfo.length == 0"
                    type="text"
                    @click="activeName = 'notification'"
                  >
                    {{ amisproductInfo.length || 0 }}
                  </el-button>
                </el-descriptions-item>
                <el-descriptions-item
                  :label="$translateTitle('product.productinterval')"
                >
                  <el-select
                    v-model="productdetail.config.interval"
                    allow-create
                    default-first-option
                    filterable
                    placeholder="请选择"
                    size="mini"
                    style="width: 95%"
                    @change="blurinterval(productdetail)"
                  >
                    <el-option
                      v-for="item in cachList"
                      :key="item.val"
                      :label="item.label"
                      size="mini"
                      :value="item.val"
                    />
                  </el-select>
                  <!-- <el-input
                    v-model="productdetail.config.interval"
                    size="mini"
                    style="margin: 0 auto"
                    type="number"
                    @blur="blurinterval(productdetail)"
                  /> -->
                </el-descriptions-item>
                <el-descriptions-item
                  :label="$translateTitle('equipment.address')"
                >
                  <el-link
                    type="success"
                    @click="dialog_address = !dialog_address"
                  >
                    {{ productdetail.config.address || '-' }}
                  </el-link>
                </el-descriptions-item>
                <el-descriptions-item
                  :label="$translateTitle('equipment.Longitude and latitude')"
                >
                  <el-link type="success">
                    {{ productdetail.config.location.latitude }}
                    {{ productdetail.config.location.longitude }}
                  </el-link>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </el-tab-pane>
        <!--topic列表-->
        <el-tab-pane
          :label="'Topic' + $translateTitle('product.list')"
          name="second"
        >
          <div class="card-container">
            <a-tabs type="card" @change="topicChange">
              <a-tab-pane key="basic" tab="基础通信Topic">
                <el-table
                  ref="basic"
                  border
                  :data="dlinkTopic.basic"
                  :span-method="basicMethod"
                  style="width: 100%; margin-top: 20px"
                >
                  <el-table-column label="功能" prop="category" width="180" />
                  <!--                  <el-table-column label="操作权限" prop="isdef" />-->
                  <el-table-column label="topic" prop="topic" />
                  <el-table-column label="描述" prop="desc" />
                  <el-table-column label="唯一标识" prop="id" />
                  <el-table-column label="发布者" prop="publisher" />
                  <el-table-column label="订阅者" prop="subscribe" />
                  <el-table-column label="类型" prop="type" />
                </el-table>
              </a-tab-pane>
              <a-tab-pane key="thing" tab="物模型通信Topic">
                <el-table
                  ref="thing"
                  border
                  :data="dlinkTopic.thing"
                  :span-method="thingMethod"
                  style="width: 100%; margin-top: 20px"
                >
                  <el-table-column label="功能" prop="category" width="180" />
                  <!--                  <el-table-column label="操作权限" prop="isdef" />-->
                  <el-table-column label="topic" prop="topic" />
                  <el-table-column label="描述" prop="desc" />
                  <el-table-column label="描述" prop="type" />
                </el-table>
              </a-tab-pane>
              <a-tab-pane key="user" tab="自定义Topic">
                <div
                  style="
                    box-sizing: border-box;
                    padding: 10px;
                    background: #ffffff;
                  "
                >
                  <dgiot-query-form>
                    <dgiot-query-form-left-panel>
                      <div class="addtopic">
                        <el-button
                          size="small"
                          type="primary"
                          @click.native="topicdialogVisible = true"
                        >
                          {{ $translateTitle('product.customtopicclass') }}
                        </el-button>
                      </div>
                    </dgiot-query-form-left-panel>
                    <dgiot-query-form-right-panel>
                      <dgiot-help
                        src="https://tech.iotn2n.com/w/docs/details?id=6"
                        title="产品下的所有设备都会继承该产品的 Topic 类"
                        trigger="click"
                      />
                    </dgiot-query-form-right-panel>
                  </dgiot-query-form>
                  <el-table
                    :data="topicData"
                    :height="$baseTableHeight(0) - 60"
                    style="width: 100%; text-align: center"
                  >
                    <el-table-column
                      align="center"
                      label="name"
                      prop="name"
                      show-overflow-tooltip
                      sortable
                      width="auto"
                    />
                    <el-table-column
                      align="center"
                      label="value"
                      prop="value"
                      show-overflow-tooltip
                      sortable
                      width="auto"
                    />
                    <!--                  <el-table-column label="操作权限" prop="isdef" />-->
                    <el-table-column
                      align="center"
                      label="topic"
                      prop="topic"
                      show-overflow-tooltip
                      sortable
                      width="auto"
                    />
                    <el-table-column
                      align="center"
                      label="描述"
                      prop="desc"
                      show-overflow-tooltip
                      sortable
                      width="auto"
                    />
                    <el-table-column
                      align="center"
                      label="唯一标识"
                      prop="id"
                      show-overflow-tooltip
                      sortable
                      width="auto"
                    />
                    <el-table-column
                      align="center"
                      label="发布者"
                      prop="publisher"
                      show-overflow-tooltip
                      sortable
                      width="100"
                    />
                    <el-table-column
                      align="center"
                      label="订阅者"
                      prop="subscribe"
                      show-overflow-tooltip
                      sortable
                      width="100"
                    />
                    <el-table-column
                      align="center"
                      label="订阅类型"
                      prop="type"
                      show-overflow-tooltip
                      sortable
                      width="100"
                    />
                    <el-table-column
                      align="center"
                      label="所属类型"
                      prop="info"
                      show-overflow-tooltip
                      sortable
                      width="100"
                    />
                    <el-table-column
                      align="center"
                      :label="$translateTitle('developer.operation')"
                    >
                      <template #default="{ row, $index }">
                        <el-button
                          size="mini"
                          type="primary"
                          @click.native="updatetopic(row, $index)"
                        >
                          {{ $translateTitle('developer.edit') }}
                        </el-button>
                        <!--                  <el-popover-->
                        <!--                    :ref="`popover-${$index}`"-->
                        <!--                    placement="top"-->
                        <!--                    width="300"-->
                        <!--                  >-->
                        <!--                    <p>确定删除Topic【{{ row.topic }}】吗？</p>-->
                        <!--                  <div style="text-align: right; margin: 0">-->
                        <!--                    <el-button-->
                        <!--                      size="mini"-->
                        <!--                      size="mini"-->
                        <!--                      @click.native="-->
                        <!--                        scope._self.$refs[`popover-${$index}`].doClose()-->
                        <!--                      "-->
                        <!--                    >-->
                        <!--                      {{  $translateTitle("developer.cancel") }}</el-button-->
                        <!--                      >-->
                        <!--                    <el-button-->
                        <!--                      type="primary"-->
                        <!--                      size="mini"-->
                        <!--                      @click.native="deletetopic(row, $index)"-->
                        <!--                    >-->
                        <!--                      {{  $translateTitle("developer.determine") }}</el-button-->
                        <!--                      >-->
                        <!--                  </div>-->
                        <el-button
                          slot="reference"
                          size="mini"
                          type="danger"
                          @click.native="deletetopic(topicData, row, $index)"
                        >
                          {{ $translateTitle('developer.delete') }}
                        </el-button>
                        <!--                  </el-popover>-->
                      </template>
                    </el-table-column>
                    <template #empty>
                      <el-image
                        class="dgiot-data-empty"
                        :src="
                          require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                        "
                      />
                    </template>
                  </el-table>
                  <!--                  <div class="elpagination" style="margin-top: 20px">-->
                  <!--                    <el-pagination-->
                  <!--                      layout="total, sizes, prev, pager, next, jumper"-->
                  <!--                      :page-size="topiclength"-->
                  <!--                      :page-sizes="[10, 20, 30, 50]"-->
                  <!--                      :total="topicData.length"-->
                  <!--                      @current-change="topicCurrentChange"-->
                  <!--                      @size-change="topicSizeChange"-->
                  <!--                    />-->
                  <!--                  </div>-->
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>

          <!--topic弹窗-->
          <el-dialog
            :append-to-body="true"
            :close-on-click-modal="false"
            :title="$translateTitle('product.definetopicclass')"
            :visible.sync="topicdialogVisible"
            width="40%"
          >
            <div class="topiccontent">
              <div
                style="
                  box-sizing: border-box;
                  padding: 10px;
                  font-size: 16px;
                  background: #e6f9fc;
                "
              >
                <i class="el-icon-warning" />
                {{ $translateTitle('product.text2') }}
              </div>
              <div class="topicform">
                <el-form ref="topicform" :model="topicform" :rules="topicrule">
                  <el-form-item label="所属类型：" prop="info">
                    <el-radio-group v-model="topicform.info">
                      <el-radio :label="'basic'">基础通信</el-radio>
                      <el-radio :label="'thing'">物模型通信</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="官方 Topic：" prop="topic">
                    <el-select
                      v-model="topicform.topic"
                      allow-create
                      filterable
                      placeholder="请选择活动区域"
                      style="float: left; width: 91%"
                    >
                      <el-option
                        v-for="(item, index) in dlinkTopic[topicform.info]"
                        :key="index"
                        :label="item.topic"
                        :value="item.id"
                      >
                        <span style="float: left">{{ item.topic }}</span>
                        <span
                          style="float: right; font-size: 13px; color: #8492a6"
                        >
                          {{ item.id }}
                        </span>
                      </el-option>
                    </el-select>
                    <dgiot-help
                      src="https://gitee.com/dgiiot/dgiot_dlink"
                      style="width: 60px; margin-top: 24px"
                      title="产品下的所有设备都会继承该产品的 Topic 类"
                      trigger="click"
                    />
                  </el-form-item>
                  <el-form-item label="Topic value：" prop="topic">
                    <el-input
                      v-model="topicform.value"
                      style="float: left; width: 100%"
                    />
                  </el-form-item>
                  <!--                  <el-form-item-->
                  <!--                    :label="$translateTitle('product.operationauthority')"-->
                  <!--                    prop="type"-->
                  <!--                  >-->
                  <!--                    <el-select-->
                  <!--                      v-model="topicform.type"-->
                  <!--                      :placeholder="-->
                  <!--                        $translateTitle(-->
                  <!--                          'product.selectdeviceoperationpermission'-->
                  <!--                        )-->
                  <!--                      "-->
                  <!--                      style="width: 100%"-->
                  <!--                    >-->
                  <!--                      <el-option-->
                  <!--                        :label="$translateTitle('product.sub')"-->
                  <!--                        value="sub"-->
                  <!--                      />-->
                  <!--                      <el-option-->
                  <!--                        :label="$translateTitle('product.pub')"-->
                  <!--                        value="pub"-->
                  <!--                      />-->
                  <!--                    </el-select>-->
                  <!--                  </el-form-item>-->
                  <!--                  <el-form-item :label="$translateTitle('developer.describe')">-->
                  <!--                    <el-input v-model="topicform.desc" type="textarea" />-->
                  <!--                  </el-form-item>-->
                </el-form>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click.native="topicdialogVisible = false">
                {{ $translateTitle('developer.cancel') }}
              </el-button>
              <el-button
                type="primary"
                @click.native="subTopic('topicform', topicform.isupdated)"
              >
                {{ $translateTitle('developer.determine') }}
              </el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
        <!--物模型-->
        <el-tab-pane
          :label="$translateTitle('product.physicalmodel')"
          name="third"
        >
          <el-dialog
            :append-to-body="true"
            :close-on-click-modal="false"
            :title="$translateTitle('product.addMachine')"
            :visible.sync="machine"
            width="30%"
          >
            <div>
              <el-form
                ref="sizeForm"
                label-position="left"
                label-width="80px"
                :model="machineForm"
                size="mini"
              >
                <el-row :gutter="24">
                  <el-col :span="24">
                    <el-form-item
                      :label="$translateTitle('product.devicetype')"
                      prop="devicetype"
                    >
                      <el-input v-model="machineForm.name" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button
                size="mini"
                type="primary"
                @click.native="machine = false"
              >
                {{ $translateTitle('developer.cancel') }}
              </el-button>
              <el-button size="mini" @click.native="savemachine(machineForm)">
                {{ $translateTitle('developer.determine') }}
              </el-button>
            </span>
          </el-dialog>

          <div>
            <a-drawer
              :closable="false"
              :title="wmxSituation + '物模型事件'"
              :visible="atbas.visible && modules.type === 'events'"
              width="620"
              @close="onClose"
            >
              <el-form
                v-show="modules.type == 'services'"
                ref="services"
                label-position="right"
                label-width="80px"
                :model="modules.services.data"
                :rules="modules.services.rules"
                size="mini"
              >
                <el-form-item label="功能名称" prop="name">
                  <el-input v-model="modules.services.data.name" />
                </el-form-item>
                <el-form-item label="标识符" prop="identifier">
                  <el-input v-model="modules.services.data.identifier" />
                </el-form-item>
                <el-form-item label="调用方式" prop="transfer">
                  <el-radio-group
                    v-model="modules.services.data.transfer"
                    size="mini"
                  >
                    <el-radio border label="sync">同步</el-radio>
                    <el-radio border label="async">异步</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="输入参数" prop="enter">
                  <el-select
                    v-model="modules.services.data.enter"
                    multiple
                    placeholder="请选择输出参数"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in wmxDataBk"
                      :key="item.name"
                      :label="item.name"
                      :value="item.identifier"
                    >
                      <span style="float: left">{{ item.name }}</span>
                      <span
                        style="float: right; font-size: 13px; color: #8492a6"
                      >
                        {{ item.name }}
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="输出参数" prop="output">
                  <el-select
                    v-model="modules.services.data.output"
                    multiple
                    placeholder="请选择输出参数"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in wmxDataBk"
                      :key="item.name"
                      :label="item.identifier"
                      :value="item.identifier"
                    >
                      <span style="float: left">{{ item.name }}</span>
                      <span
                        style="float: right; font-size: 13px; color: #8492a6"
                      >
                        {{ item.identifier }}
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="describe">
                  <el-input
                    v-model="modules.services.data.describe"
                    type="textarea"
                  />
                </el-form-item>
                <el-form-item size="large" style="text-align: center">
                  <el-button
                    size="mini"
                    type="primary"
                    @click.native="submitModules('services', modules.services)"
                  >
                    确认
                  </el-button>
                  <el-button size="mini" @click.native="handleClose">
                    取消
                  </el-button>
                </el-form-item>
              </el-form>

              <el-form
                v-show="modules.type == 'events'"
                ref="events"
                label-position="right"
                label-width="80px"
                :model="modules.events.data"
                :rules="modules.events.rules"
                size="mini"
              >
                <el-form-item label="功能名称" prop="name">
                  <el-input v-model="modules.events.data.name" />
                </el-form-item>
                <el-form-item label="标识符" prop="identifier">
                  <el-input v-model="modules.events.data.identifier" />
                </el-form-item>
                <el-form-item label="事件类型" prop="types">
                  <el-radio-group
                    v-model="modules.events.data.types"
                    size="mini"
                  >
                    <el-radio label="info">信息</el-radio>
                    <el-radio label="warning">告警</el-radio>
                    <el-radio label="error">故障</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="输出参数" prop="output">
                  <a-list
                    :data-source="modules.events.data.output"
                    item-layout="horizontal"
                  >
                    <a-list-item slot="renderItem" slot-scope="item, index">
                      <el-button
                        slot="actions"
                        type="info"
                        @click.native="editEvent(item, index, 'output')"
                      >
                        编辑
                      </el-button>
                      <el-button
                        slot="actions"
                        size="mini"
                        type="danger"
                        @click.native="
                          modules.events.data.output.splice(index, 1)
                        "
                      >
                        删除
                      </el-button>
                      <a-list-item-meta style="border: 1px solid #e1e2e5">
                        <!--                        <el-link slot="avatar">{{ item.name   }}</el-link>-->
                        <el-tag slot="title" type="success">
                          参数名称:{{ item.identifier }}
                        </el-tag>
                      </a-list-item-meta>
                    </a-list-item>
                  </a-list>
                  <el-link type="primary" @click.native="showChildrenDrawer">
                    <a-icon type="plus" />
                    增加参数
                  </el-link>
                </el-form-item>
                <el-form-item label="描述" prop="describe">
                  <el-input
                    v-model="modules.events.data.describe"
                    type="textarea"
                  />
                </el-form-item>
                <el-form-item size="large" style="text-align: center">
                  <el-button
                    size="mini"
                    type="primary"
                    @click.native="submitModules('events', modules.events)"
                  >
                    确认
                  </el-button>
                  <el-button size="mini" @click.native="handleClose">
                    取消
                  </el-button>
                </el-form-item>
              </el-form>

              <a-drawer
                :closable="false"
                :title="
                  eventType == 'add'
                    ? '新增'
                    : '修改' + thingType == 'events'
                    ? '事件定义'
                    : '服务定义'
                "
                :visible="atbas.childrenDrawer"
                width="550"
                @close="onChildrenDrawerClose"
              >
                <thing-form
                  ref="thingForm"
                  :dlink-unit="dlinkUnit"
                  :event-type="eventType"
                  :form-type="formType"
                  :rule-form="eventForm"
                  @OutputParameters="thingParameters"
                  @editParameters="editParameters"
                />
              </a-drawer>
              <div
                :style="{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  borderTop: '1px solid #e8e8e8',
                  padding: '10px 16px',
                  textAlign: 'right',
                  left: 0,
                  background: '#fff',
                  borderRadius: '0 0 4px 4px',
                }"
              >
                <!--                <a-button style="marginright: 8px" @click="onClose">-->
                <!--                  Cancel-->
                <!--                </a-button>-->
                <!--                <a-button type="primary" @click="onClose">Submit</a-button>-->
              </div>
            </a-drawer>
            <a-drawer
              :closable="false"
              :title="wmxSituation + '物模型服务'"
              :visible="atbas.visible && modules.type === 'services'"
              width="620"
              @close="onClose"
            >
              <el-form
                v-show="modules.type == 'services'"
                ref="services"
                label-position="right"
                label-width="80px"
                :model="modules.services.data"
                :rules="modules.services.rules"
                size="mini"
              >
                <el-form-item label="功能名称" prop="name">
                  <el-input v-model="modules.services.data.name" />
                </el-form-item>
                <el-form-item label="标识符" prop="identifier">
                  <el-input v-model="modules.services.data.identifier" />
                </el-form-item>
                <el-form-item label="调用方式" prop="transfer">
                  <el-radio-group
                    v-model="modules.services.data.transfer"
                    size="mini"
                  >
                    <el-radio border label="sync">同步</el-radio>
                    <el-radio border label="async">异步</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="输入参数" prop="enter">
                  <a-list
                    :data-source="modules.services.data.enter"
                    item-layout="horizontal"
                  >
                    <a-list-item slot="renderItem" slot-scope="item, index">
                      <el-button
                        slot="actions"
                        type="info"
                        @click.native="editEvent(item, index, 'enter')"
                      >
                        编辑
                      </el-button>
                      <el-button
                        slot="actions"
                        size="mini"
                        type="danger"
                        @click.native="
                          modules.services.data.enter.splice(index, 1)
                        "
                      >
                        删除
                      </el-button>
                      <a-list-item-meta style="border: 1px solid #e1e2e5">
                        <!--                        <el-link slot="avatar">{{ item.name   }}</el-link>-->
                        <el-tag slot="title" type="success">
                          参数名称:{{ item.identifier }}
                        </el-tag>
                      </a-list-item-meta>
                    </a-list-item>
                  </a-list>
                  <el-link type="primary" @click.native="showChildrenDrawer">
                    <a-icon type="plus" />
                    增加参数
                  </el-link>
                </el-form-item>
                <el-form-item label="输出参数" prop="output">
                  <a-list
                    :data-source="modules.services.data.output"
                    item-layout="horizontal"
                  >
                    <a-list-item slot="renderItem" slot-scope="item, index">
                      <el-button
                        slot="actions"
                        type="info"
                        @click.native="editEvent(item, index, 'output')"
                      >
                        编辑
                      </el-button>
                      <el-button
                        slot="actions"
                        size="mini"
                        type="danger"
                        @click.native="
                          modules.services.data.output.splice(index, 1)
                        "
                      >
                        删除
                      </el-button>
                      <a-list-item-meta style="border: 1px solid #e1e2e5">
                        <!--                        <el-link slot="avatar">{{ item.name   }}</el-link>-->
                        <el-tag slot="title" type="success">
                          参数名称:{{ item.identifier }}
                        </el-tag>
                      </a-list-item-meta>
                    </a-list-item>
                  </a-list>
                  <el-link type="primary" @click.native="showChildrenDrawer">
                    <a-icon type="plus" />
                    增加参数
                  </el-link>
                </el-form-item>
                <el-form-item label="描述" prop="describe">
                  <el-input
                    v-model="modules.services.data.describe"
                    type="textarea"
                  />
                </el-form-item>
                <el-form-item size="large" style="text-align: center">
                  <el-button
                    size="mini"
                    type="primary"
                    @click.native="submitModules('services', modules.services)"
                  >
                    确认
                  </el-button>
                  <el-button size="mini" @click.native="handleClose">
                    取消
                  </el-button>
                </el-form-item>
              </el-form>

              <el-form
                v-show="modules.type == 'events'"
                ref="events"
                label-position="right"
                label-width="80px"
                :model="modules.events.data"
                :rules="modules.events.rules"
                size="mini"
              >
                <el-form-item label="功能名称" prop="name">
                  <el-input v-model="modules.events.data.name" />
                </el-form-item>
                <el-form-item label="标识符" prop="identifier">
                  <el-input v-model="modules.events.data.identifier" />
                </el-form-item>
                <el-form-item label="事件类型" prop="types">
                  <el-radio-group
                    v-model="modules.events.data.types"
                    size="mini"
                  >
                    <el-radio label="info">信息</el-radio>
                    <el-radio label="warning">告警</el-radio>
                    <el-radio label="error">故障</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="输出参数" prop="output">
                  <a-list
                    :data-source="modules.events.data.output"
                    item-layout="horizontal"
                  >
                    <a-list-item slot="renderItem" slot-scope="item, index">
                      <el-button
                        slot="actions"
                        type="info"
                        @click.native="editEvent(item, index, 'output')"
                      >
                        编辑
                      </el-button>
                      <el-button
                        slot="actions"
                        size="mini"
                        type="danger"
                        @click.native="
                          modules.events.data.output.splice(index, 1)
                        "
                      >
                        删除
                      </el-button>
                      <a-list-item-meta style="border: 1px solid #e1e2e5">
                        <!--                        <el-link slot="avatar">{{ item.name   }}</el-link>-->
                        <el-tag slot="title" type="success">
                          参数名称:{{ item.identifier }}
                        </el-tag>
                      </a-list-item-meta>
                    </a-list-item>
                  </a-list>
                  <el-link type="primary" @click.native="showChildrenDrawer">
                    <a-icon type="plus" />
                    增加参数
                  </el-link>
                </el-form-item>
                <el-form-item label="描述" prop="describe">
                  <el-input
                    v-model="modules.events.data.describe"
                    type="textarea"
                  />
                </el-form-item>
                <el-form-item size="large" style="text-align: center">
                  <el-button
                    size="mini"
                    type="primary"
                    @click.native="submitModules('events', modules.events)"
                  >
                    确认
                  </el-button>
                  <el-button size="mini" @click.native="handleClose">
                    取消
                  </el-button>
                </el-form-item>
              </el-form>

              <a-drawer
                :closable="false"
                :title="
                  (eventType == 'add' ? '新增' : '修改',
                  thingType == 'events' ? '事件定义' : '服务定义')
                "
                :visible="atbas.childrenDrawer"
                width="550"
                @close="onChildrenDrawerClose"
              >
                <thing-form
                  ref="thingForm"
                  :dlink-unit="dlinkUnit"
                  :event-type="eventType"
                  :rule-form="eventForm"
                  @OutputParameters="thingParameters"
                  @editParameters="editParameters"
                />
              </a-drawer>
              <div
                :style="{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  borderTop: '1px solid #e8e8e8',
                  padding: '10px 16px',
                  textAlign: 'right',
                  left: 0,
                  background: '#fff',
                  borderRadius: '0 0 4px 4px',
                }"
              >
                <!--                <a-button style="marginright: 8px" @click="onClose">-->
                <!--                  Cancel-->
                <!--                </a-button>-->
                <!--                <a-button type="primary" @click="onClose">Submit</a-button>-->
              </div>
            </a-drawer>
          </div>

          <el-tabs v-model="tabsChild" @tab-click="handleChildClick">
            <el-tab-pane label="属性定义" name="properties">
              <div>
                <el-row :gutter="24">
                  <el-col :lg="4" :md="5" :sm="6" :xl="3" :xs="24">
                    <dgiot-query-form class="query-form">
                      <dgiot-query-form-top-panel>
                        <el-button type="primary" @click.native="addMachine">
                          添加类型
                        </el-button>
                      </dgiot-query-form-top-panel>
                    </dgiot-query-form>
                    <el-table
                      border
                      :data="FromMachine"
                      :height="$baseTableHeight(0) - 60"
                      :row-class-name="tableRowClassName"
                      style="width: 60vh; overflow: auto"
                      @row-click="clickmachine"
                    >
                      <el-table-column
                        align="center"
                        label="序号"
                        prop="sort"
                        width="50"
                      >
                        <template #default="{ $index }">
                          <span>
                            {{ $index + 1 }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        align="center"
                        label="设备类型"
                        prop="name"
                      />
                      <template #empty>
                        <el-image
                          class="dgiot-data-empty"
                          :src="
                            require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                          "
                        />
                      </template>
                    </el-table>
                  </el-col>
                  <el-col :lg="20" :md="19" :sm="18" :xl="21" :xs="24">
                    <dgiot-query-form class="query-form">
                      <dgiot-query-form-right-panel style="width: 100%">
                        <div class="stripe-panel">
                          <el-button
                            size="small"
                            type="primary"
                            @click.native="checkAddTest"
                          >
                            <!-- 物模型采集公式 -->
                            {{
                              $translateTitle(
                                'product.collectionformulaofobjectmodel'
                              )
                            }}
                          </el-button>
                          <el-button
                            size="small"
                            type="primary"
                            @click.native="checkschema"
                          >
                            {{ $translateTitle('product.viewobjectmodel') }}
                          </el-button>

                          <!-- 新增自定义属性 -->
                          <el-button
                            size="small"
                            type="primary"
                            @click.native="createThing('properties')"
                          >
                            {{ $translateTitle('product.newcustomattribute') }}
                          </el-button>
                        </div>
                      </dgiot-query-form-right-panel>
                    </dgiot-query-form>
                    <el-table
                      key="tabsChild"
                      border
                      :data="
                        wmxData.slice(
                          (wmxstart - 1) * wmxPageSize,
                          wmxstart * wmxPageSize
                        )
                      "
                      :default-expand-all="false"
                      :default-sort="{ prop: 'date', order: 'descending' }"
                      :height="$baseTableHeight(0) - 60"
                      row-key="identifier"
                      style="width: 100%; margin-top: 10px"
                    >
                      <el-table-column type="expand">
                        <template slot-scope="props" class="opentable">
                          <el-descriptions
                            border
                            :column="4"
                            direction="vertical"
                          >
                            <el-descriptions-item label="采集轮次">
                              {{ props.row.dataForm.round }}
                            </el-descriptions-item>
                            <el-descriptions-item
                              :label="
                                $translateTitle('product.functionaltypes')
                              "
                            >
                              {{ $translateTitle('product.attribute') }}
                            </el-descriptions-item>
                          </el-descriptions>
                        </template>
                      </el-table-column>

                      <el-table-column
                        align="center"
                        :label="$translateTitle('product.order')"
                        width="60"
                      >
                        <template #default="{ row }">
                          {{ row.dataForm.order }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        align="center"
                        :label="$translateTitle('product.devicetype')"
                        prop="devicetype"
                      />

                      <el-table-column
                        align="center"
                        :label="$translateTitle('product.Strategy')"
                      >
                        <template #default="{ row }">
                          {{ row.dataForm.strategy }}
                        </template>
                      </el-table-column>

                      <el-table-column
                        align="center"
                        :label="$translateTitle('product.protocol')"
                      >
                        <template #default="{ row }">
                          {{ row.dataForm.protocol }}
                        </template>
                      </el-table-column>

                      <el-table-column
                        align="center"
                        :label="$translateTitle('product.identifier')"
                        prop="identifier"
                      />
                      <el-table-column
                        align="center"
                        :label="$translateTitle('product.functionname')"
                        prop="name"
                      />
                      <el-table-column
                        align="center"
                        label="是否展示"
                        prop="name"
                        width="100"
                      >
                        <template #default="{ row }">
                          <a-switch
                            :checked="row.isshow"
                            checked-children="展示"
                            un-checked-children="不展示"
                            @click="toggleSwitch(row)"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column
                        align="center"
                        label="是否存储"
                        prop="name"
                        width="100"
                      >
                        <template #default="{ row }">
                          <a-switch
                            :checked="row.isstorage"
                            checked-children="存储"
                            un-checked-children="不存储"
                            @click="toggleStore(row)"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column
                        align="center"
                        :label="$translateTitle('product.datatype')"
                        width="90"
                      >
                        <template #default="{ row }">
                          <span>{{ row.dataType.type }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        align="center"
                        :label="$translateTitle('product.datadefinition')"
                      >
                        <template #default="{ row }">
                          <span
                            v-if="
                              row.dataType.specs &&
                              (row.dataType.type == 'double' ||
                                row.dataType.type == 'float' ||
                                row.dataType.type == 'long' ||
                                row.dataType.type == 'int')
                            "
                          >
                            {{
                              $translateTitle('product.rangeofvalues') +
                              row.dataType.specs.min +
                              '~' +
                              row.dataType.specs.max
                            }}
                          </span>
                          <span v-else-if="row.dataType.type == 'text'">
                            {{
                              $translateTitle('product.datalength') +
                              ':' +
                              row.dataType.size +
                              $translateTitle('product.byte')
                            }}
                          </span>
                          <span v-else-if="row.dataType.type == 'date'" />
                          <span v-else-if="row.dataType.type != 'struct'">
                            {{ row.dataType.specs }}
                          </span>
                          <span v-else />
                        </template>
                      </el-table-column>
                      <el-table-column
                        align="center"
                        :label="$translateTitle('developer.operation')"
                        width="160"
                      >
                        <template #default="{ row, $index }">
                          <el-button
                            size="mini"
                            type="danger"
                            @click.native="deletewmx(row, $index)"
                          >
                            {{ $translateTitle('developer.delete') }}
                          </el-button>
                          <el-button
                            size="mini"
                            type="primary"
                            @click.native="
                              wmxDataFill(row, $index, 'properties')
                            "
                          >
                            <!-- 编辑 -->
                            {{ $translateTitle('task.Edit') }}
                          </el-button>
                        </template>
                      </el-table-column>
                      <template #empty>
                        <el-image
                          class="dgiot-data-empty"
                          :src="
                            require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                          "
                        />
                      </template>
                    </el-table>
                    <!--功能定义分页-->
                    <el-pagination
                      :current-page="currentPage"
                      layout="total, sizes, prev, pager, next, jumper"
                      :page-size="wmxPageSize"
                      :page-sizes="[10, 20, 30, 50]"
                      style="margin-top: 10px"
                      :total="wmxData.length"
                      @current-change="wmxCurrentChange"
                      @size-change="wmxSizeChange"
                    />
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="事件定义" name="events">
              <dgiot-query-form class="query-form">
                <dgiot-query-form-right-panel style="width: 100%">
                  <div class="stripe-panel">
                    <el-button
                      size="small"
                      type="primary"
                      @click.native="checkschema"
                    >
                      {{ $translateTitle('product.viewobjectmodel') }}
                    </el-button>

                    <!-- 新增自定义属性 -->
                    <el-button
                      size="small"
                      type="primary"
                      @click.native="createThing('events')"
                    >
                      新增事件
                    </el-button>
                  </div>
                </dgiot-query-form-right-panel>
              </dgiot-query-form>
              <el-table
                key="tabsChild"
                border
                :data="
                  modules.data.events.slice(
                    (eventsStart - 1) * eventsPageSize,
                    eventsStart * eventsPageSize
                  )
                "
                :default-sort="{ prop: 'date', order: 'descending' }"
                :height="$baseTableHeight(0) - 60"
                row-key="identifier"
                style="width: 100%; margin-top: 10px"
              >
                <el-table-column prop="输出参数" type="expand">
                  <template slot-scope="props">
                    <el-form
                      class="demo-table-expand"
                      inline
                      label-position="left"
                    >
                      <a-descriptions
                        v-for="(item, index) in props.row.output"
                        :key="index"
                        bordered
                        :title="'输出参数:' + item.name"
                      >
                        <a-descriptions-item label="标识符">
                          {{ item.identifier }}
                        </a-descriptions-item>
                        <a-descriptions-item label="数据类型">
                          {{ item.dataType }}
                        </a-descriptions-item>
                        <a-descriptions-item label="取值范围">
                          最小值:{{ item.min }} 最大值:{{ item.max }}
                        </a-descriptions-item>
                        <a-descriptions-item label="步长">
                          {{ item.step }}
                        </a-descriptions-item>
                        <a-descriptions-item label="单位">
                          <el-tag
                            v-for="(Unit, index) of dlinkUnit"
                            v-show="Unit.Symbol == item.unit"
                            :key="index"
                            type="success"
                          >
                            <span>
                              {{ Unit.Name }}
                            </span>
                          </el-tag>
                        </a-descriptions-item>
                        <a-descriptions-item label="读写类型">
                          {{ item.isread == 'rw' ? '读写' : '只读' }}
                        </a-descriptions-item>
                      </a-descriptions>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  :label="$translateTitle('product.order')"
                  prop="dataForm.order"
                  sortable
                  width="auto"
                />
                <el-table-column
                  align="center"
                  :label="$translateTitle('product.identifier')"
                  prop="identifier"
                  width="auto"
                />
                <el-table-column
                  align="center"
                  :label="$translateTitle('product.functionname')"
                  prop="name"
                />
                <el-table-column
                  align="center"
                  label="事件类型"
                  prop="types"
                  sortable
                >
                  <template #default="{ row }">
                    <span>
                      {{
                        ['信息', '告警', '故障'][
                          ['info', 'warning', 'error'].indexOf(row.types)
                        ]
                      }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  :label="$translateTitle('developer.operation')"
                  width="160"
                >
                  <template #default="{ row, $index }">
                    <el-button
                      size="mini"
                      type="danger"
                      @click.native="deletewmx(row, $index)"
                    >
                      {{ $translateTitle('developer.delete') }}
                    </el-button>
                    <el-button
                      size="mini"
                      type="primary"
                      @click.native="wmxDataFill(row, $index, 'events')"
                    >
                      <!-- 编辑 -->
                      {{ $translateTitle('task.Edit') }}
                    </el-button>
                  </template>
                </el-table-column>
                <template #empty>
                  <el-image
                    class="dgiot-data-empty"
                    :src="
                      require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                    "
                  />
                </template>
              </el-table>
              <!--功能定义分页-->
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="eventsPageSize"
                :page-sizes="[10, 20, 30, 50]"
                style="margin-top: 10px"
                :total="modules.data.events.length"
                @current-change="eventsCurrentChange"
                @size-change="eventsChange"
              />
            </el-tab-pane>
            <el-tab-pane label="服务定义" name="services">
              <dgiot-query-form class="query-form">
                <dgiot-query-form-right-panel style="width: 100%">
                  <div class="stripe-panel">
                    <el-button
                      size="small"
                      type="primary"
                      @click.native="checkschema"
                    >
                      {{ $translateTitle('product.viewobjectmodel') }}
                    </el-button>

                    <!-- 新增自定义服务 -->
                    <el-button
                      size="small"
                      type="primary"
                      @click.native="createThing('services')"
                    >
                      新增服务
                    </el-button>
                  </div>
                </dgiot-query-form-right-panel>
              </dgiot-query-form>
              <el-table
                key="tabsChild"
                border
                :data="
                  modules.data.services.slice(
                    (servicesStart - 1) * servicesPageSize,
                    servicesStart * servicesPageSize
                  )
                "
                :default-sort="{ prop: 'date', order: 'descending' }"
                :height="$baseTableHeight(0) - 60"
                row-key="identifier"
                style="width: 100%; margin-top: 10px"
              >
                <el-table-column prop="输出参数" type="expand">
                  <template slot-scope="props">
                    <el-form
                      class="demo-table-expand"
                      inline
                      label-position="left"
                    >
                      <a-descriptions
                        v-for="(item, index) in props.row.enter"
                        :key="index"
                        bordered
                        :title="'输入参数:' + item.name"
                      >
                        <a-descriptions-item label="标识符">
                          {{ item.identifier }}
                        </a-descriptions-item>
                        <a-descriptions-item label="数据类型">
                          {{ item.dataType }}
                        </a-descriptions-item>
                        <a-descriptions-item label="取值范围">
                          最小值:{{ item.min }} 最大值:{{ item.max }}
                        </a-descriptions-item>
                        <a-descriptions-item label="步长">
                          {{ item.step }}
                        </a-descriptions-item>
                        <a-descriptions-item label="单位">
                          <el-tag
                            v-for="(Unit, index) of dlinkUnit"
                            v-show="Unit.Symbol == item.unit"
                            :key="index"
                            type="success"
                          >
                            <span>
                              {{ Unit.Name }}
                            </span>
                          </el-tag>
                        </a-descriptions-item>
                        <a-descriptions-item label="读写类型">
                          {{ item.isread == 'rw' ? '读写' : '只读' }}
                        </a-descriptions-item>
                      </a-descriptions>
                    </el-form>
                    <el-form
                      class="demo-table-expand"
                      inline
                      label-position="left"
                    >
                      <a-descriptions
                        v-for="(item, index) in props.row.output"
                        :key="index"
                        bordered
                        :title="'输出参数:' + item.name"
                      >
                        <a-descriptions-item label="标识符">
                          {{ item.identifier }}
                        </a-descriptions-item>
                        <a-descriptions-item label="数据类型">
                          {{ item.dataType }}
                        </a-descriptions-item>
                        <a-descriptions-item label="取值范围">
                          最小值:{{ item.min }} 最大值:{{ item.max }}
                        </a-descriptions-item>
                        <a-descriptions-item label="步长">
                          {{ item.step }}
                        </a-descriptions-item>
                        <a-descriptions-item label="单位">
                          <el-tag
                            v-for="(Unit, index) of dlinkUnit"
                            v-show="Unit.Symbol == item.unit"
                            :key="index"
                            type="success"
                          >
                            <span>
                              {{ Unit.Name }}
                            </span>
                          </el-tag>
                        </a-descriptions-item>
                        <a-descriptions-item label="读写类型">
                          {{ item.isread == 'rw' ? '读写' : '只读' }}
                        </a-descriptions-item>
                      </a-descriptions>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  :label="$translateTitle('product.order')"
                  width="60"
                >
                  <template #default="{ row }">
                    {{ row.dataForm.order }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="标识符"
                  prop="identifier"
                  width="auto"
                />
                <el-table-column
                  align="center"
                  :label="$translateTitle('product.datatype')"
                  width="auto"
                >
                  <template #default="{ row }">
                    <span>{{ row.dataType.type }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="调用方式"
                  prop="types"
                  sortable
                >
                  <template #default="{ row }">
                    <span>
                      {{
                        ['同步', '异步'][
                          ['sync', 'async'].indexOf(row.transfer)
                        ]
                      }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  :label="$translateTitle('developer.operation')"
                  width="160"
                >
                  <template #default="{ row, $index }">
                    <el-button
                      size="mini"
                      type="danger"
                      @click.native="deletewmx(row, $index)"
                    >
                      {{ $translateTitle('developer.delete') }}
                    </el-button>
                    <el-button
                      size="mini"
                      type="primary"
                      @click.native="wmxDataFill(row, $index, 'services')"
                    >
                      <!-- 编辑 -->
                      {{ $translateTitle('task.Edit') }}
                    </el-button>
                  </template>
                </el-table-column>
                <template #empty>
                  <el-image
                    class="dgiot-data-empty"
                    :src="
                      require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                    "
                  />
                </template>
              </el-table>
              <!--功能定义分页-->
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="servicesPageSize"
                :page-sizes="[10, 20, 30, 50]"
                style="margin-top: 10px"
                :total="modules.data.services.length"
                @current-change="serverCurrentChange"
                @size-change="serverSizeChange"
              />
            </el-tab-pane>
            <el-tab-pane label="标签定义" name="tags">
              <dgiot-query-form class="query-form">
                <dgiot-query-form-right-panel style="width: 100%">
                  <div class="stripe-panel">
                    <el-button
                      size="small"
                      type="primary"
                      @click.native="checkschema"
                    >
                      {{ $translateTitle('product.viewobjectmodel') }}
                    </el-button>

                    <!-- 新增自定义属性 -->
                    <el-button
                      size="small"
                      type="primary"
                      @click.native="createThing('tags')"
                    >
                      新增标签
                    </el-button>
                  </div>
                </dgiot-query-form-right-panel>
              </dgiot-query-form>
              <el-table
                key="tabsChild"
                border
                :data="
                  modules.data.tags.slice(
                    (tagsStart - 1) * tagsPageSize,
                    tagsStart * tagsPageSize
                  )
                "
                :default-sort="{ prop: 'date', order: 'descending' }"
                :height="$baseTableHeight(0) - 60"
                row-key="identifier"
                style="width: 100%; margin-top: 10px"
              >
                <el-table-column
                  align="center"
                  :label="$translateTitle('product.order')"
                  width="60"
                >
                  <template #default="{ row }">
                    {{ row.dataForm.order }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  :label="$translateTitle('product.identifier')"
                  prop="identifier"
                  width="100"
                />
                <el-table-column
                  align="center"
                  :label="$translateTitle('product.functionname')"
                  prop="name"
                />
                <el-table-column
                  align="center"
                  :label="$translateTitle('product.datatype')"
                  width="90"
                >
                  <template #default="{ row }">
                    <span>{{ row.dataType.type }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  :label="$translateTitle('product.datadefinition')"
                >
                  <template #default="{ row }">
                    <span
                      v-if="
                        row.dataType.specs &&
                        (row.dataType.type == 'double' ||
                          row.dataType.type == 'float' ||
                          row.dataType.type == 'int')
                      "
                    >
                      {{
                        $translateTitle('product.rangeofvalues') +
                        row.dataType.specs.min +
                        '~' +
                        row.dataType.specs.max
                      }}
                    </span>
                    <span v-else-if="row.dataType.type == 'string'">
                      {{
                        $translateTitle('product.datalength') +
                        ':' +
                        row.dataType.size +
                        $translateTitle('product.byte')
                      }}
                    </span>
                    <span v-else-if="row.dataType.type == 'date'" />
                    <span v-else-if="row.dataType.type != 'struct'">
                      {{ row.dataType.specs }}
                    </span>
                    <span v-else />
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  :label="$translateTitle('developer.operation')"
                  width="160"
                >
                  <template #default="{ row, $index }">
                    <el-button
                      size="mini"
                      type="danger"
                      @click.native="deletewmx(row, $index)"
                    >
                      {{ $translateTitle('developer.delete') }}
                    </el-button>
                    <el-button
                      size="mini"
                      type="primary"
                      @click.native="wmxDataFill(row, $index, 'tags')"
                    >
                      <!-- 编辑 -->
                      {{ $translateTitle('task.Edit') }}
                    </el-button>
                  </template>
                </el-table-column>
                <template #empty>
                  <el-image
                    class="dgiot-data-empty"
                    :src="
                      require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                    "
                  />
                </template>
              </el-table>
              <!--功能定义分页-->
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="tagsPageSize"
                :page-sizes="[10, 20, 30, 50]"
                style="margin-top: 10px"
                :total="modules.data.tags.length"
                @current-change="tagsCurrentChange"
                @size-change="tagsSizeChange"
              />
            </el-tab-pane>
          </el-tabs>
          <!--取物模型模板-->
          <el-dialog
            :append-to-body="true"
            :close-on-click-modal="false"
            :title="$translateTitle('product.addfunction')"
            :visible.sync="originwmx"
            width="50%"
          >
            <div>
              <div style="margin: 20px 0">
                <label for>
                  {{ $translateTitle('product.classification') }}
                </label>
                <el-cascader
                  v-model="category"
                  :options="treeData"
                  @change="handleChange"
                />
                <el-button
                  size="mini"
                  type="primary"
                  @click.native="getPropData(0)"
                >
                  {{ $translateTitle('developer.search') }}
                </el-button>
              </div>
              <div style="margin-top: 10px; text-align: center">
                <el-table
                  :data="PropData"
                  style="width: 100%; text-align: center"
                >
                  <el-table-column align="center" label="ID">
                    <template #default="{ row }">
                      <span>{{ row.data.SuperId }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    :label="$translateTitle('product.identifier')"
                  >
                    <template #default="{ row }">
                      <span>{{ row.type }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    :label="$translateTitle('product.applicabletype')"
                  >
                    <template #default="{ row }">
                      <span>{{ row.data.CategoryName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    :label="$translateTitle('developer.operation')"
                  >
                    <template #default="{ row }">
                      <el-button
                        size="mini"
                        type="primary"
                        @click.native="addProCategory(row)"
                      >
                        {{ $translateTitle('product.add') }}
                      </el-button>
                    </template>
                  </el-table-column>
                  <template #empty>
                    <el-image
                      class="dgiot-data-empty"
                      :src="
                        require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                      "
                    />
                  </template>
                </el-table>
              </div>

              <div>
                <el-pagination
                  layout="total, sizes, prev, pager, next, jumper"
                  :page-size="productlength"
                  :page-sizes="[10, 20, 30, 50]"
                  small
                  style="margin-top: 10px"
                  :total="producttotal"
                  @current-change="productCurrentChange"
                  @size-change="productSizeChange"
                />
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click.native="originwmx = false">
                {{ $translateTitle('developer.cancel') }}
              </el-button>
              <el-button
                size="mini"
                type="primary"
                @click.native="originwmx = false"
              >
                {{ $translateTitle('developer.determine') }}
              </el-button>
            </span>
          </el-dialog>
          <!--添加物模型弹窗-->
          <el-dialog
            v-if="wmxdialogVisible"
            :append-to-body="true"
            :before-close="wmxhandleClose"
            :close-on-click-modal="false"
            :fullscreen="moduletype == 'properties' ? true : false"
            :title="wmxSituation + '自定义属性'"
            :top="moduletype == 'properties' ? '0vh' : '10vh'"
            :visible.sync="wmxdialogVisible"
            :width="moduletype == 'properties' ? '100%' : '80%'"
          >
            <dgiot-wmx
              v-if="wmxdialogVisible"
              :key="upKey"
              ref="sizeForm"
              :moduletype="moduletype"
              :size-form1="sizeForm"
              @addDas="addDas"
              @addDomain="addDomain"
              @removeDas="removeDas"
              @removeDomain="removeDomain"
              @submitForm="submitForm"
              @wmxhandleClose="wmxhandleClose('close')"
            />
          </el-dialog>
          <!--物模型结构体-->
          <el-dialog
            :append-to-body="true"
            :close-on-click-modal="false"
            :title="$translateTitle('product.addparameter')"
            top="15vh"
            :visible.sync="structdialog"
            width="40%"
          >
            <div class="structheader">
              <el-form
                ref="structform"
                :model="structform"
                :rules="structrule"
                size="small"
              >
                <el-row :gutter="30">
                  <el-col :span="10">
                    <el-form-item
                      :label="$translateTitle('product.functionname')"
                      prop="name"
                    >
                      <el-input v-model="structform.name" />
                    </el-form-item>
                    <el-form-item
                      :label="$translateTitle('product.identifier')"
                      prop="identifier"
                    >
                      <el-input v-model="structform.identifier" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item
                      :label="$translateTitle('product.datatype')"
                      prop="type"
                    >
                      <el-select v-model="structform.type">
                        <el-option
                          :label="$translateTitle('product.init')"
                          value="int"
                        />
                        <el-option
                          :label="$translateTitle('product.float')"
                          value="float"
                        />
                        <el-option
                          :label="$translateTitle('product.double')"
                          value="double"
                        />
                        <el-option
                          :label="$translateTitle('product.bool')"
                          value="bool"
                        />
                        <el-option
                          :label="$translateTitle('product.enum')"
                          value="enum"
                        />
                        <el-option
                          :label="$translateTitle('product.string')"
                          value="string"
                        />
                        <el-option
                          :label="$translateTitle('product.date')"
                          value="date"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <div>
                  <el-form-item label="数据标识" required>
                    <el-col :span="11">
                      <el-form-item prop="dis">
                        <el-input
                          v-model="structform.dis"
                          placeholder="数据标识"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">-</el-col>
                    <el-col :span="11">
                      <el-form-item>
                        <el-input
                          v-model.number="structform.dinumber"
                          placeholder="数据长度(字节)"
                        />
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                </div>

                <div>
                  <el-form-item label="取值范围" required>
                    <el-col :span="12">
                      <el-form-item prop="startnumber">
                        <el-input
                          v-model.number="structform.startnumber"
                          :placeholder="$translateTitle('product.minimumvalue')"
                          type="number"
                          @input="changeStructValue('structform')"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="endnumber">
                        <el-input
                          v-model.number="structform.endnumber"
                          :placeholder="$translateTitle('product.maximumvalue')"
                          type="number"
                        />
                      </el-form-item>
                    </el-col>
                  </el-form-item>

                  <el-form-item label="步长" prop="step">
                    <el-input
                      v-model="structform.step"
                      controls-position="right"
                      :min="0"
                      :precision="2"
                      :step="0.01"
                    />
                  </el-form-item>

                  <el-form-item :label="$translateTitle('product.unit')">
                    <el-select
                      v-model="structform.unit"
                      filterable
                      :placeholder="$translateTitle('product.unit')"
                    >
                      <el-option
                        v-for="(item, index) in allunit"
                        :key="index"
                        :label="item.Name + '/' + item.Symbol"
                        :value="item.Symbol"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <div v-if="structform.type == 'bool'">
                  <el-form-item
                    :label="$translateTitle('product.attribute')"
                    required
                  >
                    <div style="height: 40px">
                      <el-col :span="11">
                        <el-form-item>
                          <el-input
                            v-model="structform.truevalue"
                            class="inputnumber"
                            :placeholder="
                              $translateTitle('product.attributevalue')
                            "
                            readonly
                            type="number"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="2">-</el-col>
                      <el-col :span="11">
                        <el-form-item prop="true">
                          <el-input
                            v-model="structform.true"
                            class="inputnumber"
                            :placeholder="$translateTitle('product.egopen')"
                          />
                        </el-form-item>
                      </el-col>
                    </div>
                    <div style="margin-top: 20px">
                      <el-col :span="11">
                        <el-form-item>
                          <el-input
                            v-model="structform.falsevalue"
                            class="inputnumber"
                            :placeholder="
                              $translateTitle('product.attributevalue')
                            "
                            readonly
                            type="number"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="2">-</el-col>
                      <el-col :span="11">
                        <el-form-item prop="true">
                          <el-input
                            v-model="structform.false"
                            class="inputnumber"
                            :placeholder="$translateTitle('product.egclost')"
                          />
                        </el-form-item>
                      </el-col>
                    </div>
                  </el-form-item>
                </div>
                <div v-if="structform.type == 'enum'">
                  <el-form-item
                    v-for="(item, index) in structform.specs"
                    v-show="structform.specs.length"
                    :key="index"
                    required
                  >
                    <el-col :span="9">
                      <el-form-item
                        :label="$translateTitle('product.attribute') + index"
                        :prop="'specs.' + index + '.attribute'"
                        :rules="[{ required: true, message: '输入属性' }]"
                      >
                        <el-input
                          v-model="item.attribute"
                          :placeholder="$translateTitle('product.egnumber0')"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="9">
                      <el-form-item
                        :label="$translateTitle('product.attribute') + index"
                        :prop="'specs.' + index + '.attributevalue'"
                        :rules="[{ required: true, message: '输入属性值' }]"
                      >
                        <el-input
                          v-model="item.attributevalue"
                          :placeholder="$translateTitle('developer.describe')"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2" />
                    <el-col class="line" :span="4">
                      <el-link
                        icon="el-icon-minus"
                        style="margin-top: 30px; margin-left: 5px"
                        type="primary"
                        :underline="false"
                        @click.prevent="removeDomain1(item)"
                      >
                        {{ $translateTitle('developer.delete') }}
                      </el-link>
                    </el-col>
                  </el-form-item>
                  <el-link
                    icon="el-icon-plus"
                    type="primary"
                    :underline="false"
                    @click.native="addDomain1"
                  >
                    {{ $translateTitle('product.add') }}
                  </el-link>
                </div>
                <div v-if="structform.type == 'string'">
                  <el-form-item
                    :label="$translateTitle('product.datalength')"
                    prop="string"
                  >
                    <el-input v-model.number="structform.string" type="number">
                      <template slot="append">
                        {{ $translateTitle('product.byte') }}
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
                <!--date类型添加格式-->
                <div v-if="structform.type == 'date'">
                  <el-form-item :label="$translateTitle('product.timeformat')">
                    <el-input v-model="structform.date" readonly />
                  </el-form-item>
                </div>
                <el-form-item
                  :label="$translateTitle('product.readandwritetype')"
                  prop="isread"
                >
                  <el-radio-group v-model="structform.isread" size="medium">
                    <el-radio label="rw">
                      {{ $translateTitle('product.readandwrite') }}
                    </el-radio>
                    <el-radio label="r">
                      {{ $translateTitle('product.onlyread') }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click.native="structdialog = false">
                {{ $translateTitle('developer.cancel') }}
              </el-button>
              <el-button
                type="primary"
                @click.native="submitStruct('structform')"
              >
                {{ $translateTitle('developer.determine') }}
              </el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
        <!--物解析-->
        <el-tab-pane
          :label="$translateTitle('product.matteranalysis')"
          name="fourth"
        >
          <div class="protolheader">
            <el-form
              ref="formInline"
              class="demo-form-inline"
              :inline="true"
              :model="formInline"
              :rules="addRules"
            >
              <el-form-item
                :label="$translateTitle('product.protocolname')"
                prop="name"
              >
                <el-input
                  v-model="formInline.name"
                  :placeholder="$translateTitle('product.protocolname')"
                />
              </el-form-item>
              <el-form-item :label="$translateTitle('plugins.version')">
                <el-input
                  v-model="formInline.version"
                  :placeholder="$translateTitle('plugins.version')"
                />
              </el-form-item>
              <el-form-item :label="$translateTitle('developer.describe')">
                <el-input
                  v-model="formInline.desc"
                  :placeholder="$translateTitle('developer.describe')"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  size="small"
                  type="primary"
                  @click.native="subAce('formInline', true)"
                >
                  {{ $translateTitle('product.preservation') }}
                </el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click.native="subAce1('formInline')"
                >
                  <!-- 设为公共 -->
                  {{ $translateTitle('product.setaspublic') }}
                </el-button>
                <el-button size="small" type="primary" @click.native="chaxun">
                  {{ $translateTitle('product.publicagreementlibrary') }}
                </el-button>
              </el-form-item>
              <el-form-item style="display: block">
                <el-button size="small" type="primary" @click.native="protol">
                  {{ $translateTitle('product.compile') }}
                </el-button>
                <el-button
                  size="small"
                  type="success"
                  @click.native="updatesubdialog"
                >
                  <!-- 热加载 -->
                  {{ $translateTitle('product.thermalloading') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <!--通道热加载-->
          <!-- <el-dialog
  :append-to-body="true"
            :visible.sync="protoldialog"
            :close-on-click-modal="false"
            title="通道热加载"
            width="50%"
          > -->
          <el-dialog
            :append-to-body="true"
            :close-on-click-modal="false"
            :title="$translateTitle('product.tdthermalloading')"
            :visible.sync="protoldialog"
            width="50%"
          >
            <el-table
              ref="multipleTable"
              :data="protolchannel"
              :row-class-name="getChannelEnable"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column
                :label="$translateTitle('developer.channelnumber')"
              >
                <template #default="{ row }">
                  <span>{{ row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channelname')"
              >
                <template #default="{ row }">
                  <span>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channeladdr')"
              >
                <template #default="{ row }">
                  <span>{{ 'channel/' + row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channeltype')"
              >
                <template #default="{ row }">
                  <span v-if="row.type == 1">
                    {{ $translateTitle('developer.collectionchannel') }}
                  </span>
                  <span v-else>
                    {{ $translateTitle('developer.resourcechannel') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.servicetype')"
              >
                <template #default="{ row }">
                  <span>{{ row.cType }}</span>
                </template>
              </el-table-column>
              <template #empty>
                <el-image
                  class="dgiot-data-empty"
                  :src="
                    require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                  "
                />
              </template>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click.native="updateAllChannel">
                <!-- 确定 -->
                {{ $translateTitle('developer.determine') }}
              </el-button>
            </div>
          </el-dialog>
          <!--公共协议库弹窗-->
          <el-dialog
            :append-to-body="true"
            :close-on-click-modal="false"
            :title="$translateTitle('product.publicagreementlibrary')"
            :visible.sync="dialogTableVisible"
            width="50%"
          >
            <el-table
              :data="gridData"
              style="width: 100%; margin-top: 20px; text-align: center"
            >
              <el-table-column
                align="center"
                :label="$translateTitle('product.protocolname')"
              >
                <template #default="{ row }">
                  <span>{{ row.data.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('plugins.version')"
              >
                <template #default="{ row }">
                  <span>{{ row.data.version }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('developer.describe')"
              >
                <template #default="{ row }">
                  <span>{{ row.data.desc }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="创建时间" align="center"> -->
              <el-table-column
                align="center"
                :label="$translateTitle('equipment.createdAt')"
              >
                <template #default="{ row }">
                  <span>{{ utc2beijing(row.createdAt) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('developer.operation')"
                width="200"
              >
                <template #default="{ row }">
                  <el-button
                    size="mini"
                    type="primary"
                    @click.native="editordata(row)"
                  >
                    {{ $translateTitle('product.clone') }}
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click.native="deletedata(row.objectId)"
                  >
                    {{ $translateTitle('developer.delete') }}
                  </el-button>
                </template>
              </el-table-column>
              <template #empty>
                <el-image
                  class="dgiot-data-empty"
                  :src="
                    require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                  "
                />
              </template>
            </el-table>
            <div class="elpagination" style="padding: 20px 0">
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="decoderlength"
                :page-sizes="[10, 20, 30, 50]"
                :total="decodertotal"
                @current-change="devicerCurrentChange"
                @size-change="decoderSizeChange"
              />
            </div>
          </el-dialog>
          <div>
            <div style="background: #ffffff">
              <label id="plug-name1" />
            </div>
            <pre
              id="editor"
              class="ace_editor ace-monokai ace_dark"
              style="min-height: 600px; margin-bottom: 0"
            ><textarea class="ace_text-input" /></pre>
            <div style="background: #ffffff">
              <label id="plug-name2" />
            </div>
            <div
              style="
                padding: 5px;
                color: #c2be9e;
                background: #272822;
                border-top: 1px solid #dddddd;
              "
            >
              <span>{{ $translateTitle('product.controloutput') }}</span>
            </div>
            <pre
              id="editor2"
              class="ace_editor"
              style="min-height: 300px; margin-top: 0; margin-bottom: 0"
            ><textarea class="ace_text-input" /></pre>
          </div>
        </el-tab-pane>
        <!--物接入-->
        <el-tab-pane
          :label="$translateTitle('product.physicalaccess')"
          name="fiveth"
        >
          <dgiot-query-form>
            <dgiot-query-form-left-panel>
              <div
                class="productchannel"
                style="padding: 10px; text-align: right"
              >
                <el-button
                  size="small"
                  type="primary"
                  @click.native="showAllChannel"
                >
                  {{ $translateTitle('developer.createchannel') }}
                </el-button>
              </div>
            </dgiot-query-form-left-panel>
            <dgiot-query-form-right-panel>
              <dgiot-help
                src="https://tech.iotn2n.com/w/docs/details?id=6"
                title="产品下的所有设备都会继承该产品的 Topic 类"
                trigger="click"
              />
            </dgiot-query-form-right-panel>
          </dgiot-query-form>
          <div>
            <el-table
              :data="channelData"
              :height="$baseTableHeight(0) - 60"
              :row-class-name="getChannelEnable"
              style="width: 100%"
            >
              <el-table-column
                :label="$translateTitle('developer.channelnumber')"
              >
                <template #default="{ row }">
                  <span>{{ row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channelname')"
              >
                <template #default="{ row }">
                  <span>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channeladdr')"
              >
                <template #default="{ row }">
                  <span>{{ 'channel/' + row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channeltype')"
              >
                <template #default="{ row }">
                  <span v-if="row.type == 1">
                    {{ $translateTitle('developer.collectionchannel') }}
                  </span>
                  <span v-else-if="row.type == 3">
                    <!-- 任务通道 -->
                    {{ $translateTitle('developer.missionchannel') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.servicetype')"
              >
                <template #default="{ row }">
                  <span>{{ row.cType }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.operation')"
                width="350"
              >
                <template #default="{ row }">
                  <el-button
                    size="mini"
                    type="danger"
                    @click.native="deleteRelation(row)"
                  >
                    {{ $translateTitle('developer.remove') }}
                  </el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click.native="subProTopic(row)"
                  >
                    <!-- 订阅日志 -->
                    {{ $translateTitle('product.subscriptionlog') }}
                  </el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click.native="updatesub(row)"
                  >
                    <!-- 重载配置 -->
                    {{ $translateTitle('product.overloadconfiguration') }}
                  </el-button>
                </template>
              </el-table-column>
              <template #empty>
                <el-image
                  class="dgiot-data-empty"
                  :src="
                    require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                  "
                />
              </template>
            </el-table>
            <div class="elpagination" style="margin-top: 20px">
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="channellength"
                :page-sizes="[10, 20, 30, 50]"
                :total="channeltotal"
                @current-change="channelCurrentChange"
                @size-change="channelSizeChange"
              />
            </div>

            <!--添加通道-->
          </div>
        </el-tab-pane>
        <!--物存储-->
        <el-tab-pane
          :label="$translateTitle('product.materialstorage')"
          name="seven"
        >
          <dgiot-query-form>
            <dgiot-query-form-left-panel>
              <div
                class="productchannel"
                style="padding: 10px; text-align: right"
              >
                <!-- <el-popover
                  title="自定义数据模型提示"
                  placement="right"
                  width="600"
                  trigger="hover"
                  @show="questionModel"
                > -->
                <el-popover
                  placement="right"
                  :title="$translateTitle('developer.tipsforcustomdatamodel')"
                  trigger="hover"
                  width="600"
                  @show="questionModel"
                >
                  <pre
                    id="editorinsert"
                    class="ace_editor"
                    style="min-height: 400px"
                  ><el-input
                    class="ace_text-input"
                    type="textarea"
                  /></pre>
                  <el-button
                    slot="reference"
                    icon="el-icon-question"
                    size="mini"
                    type="primary"
                  >
                    <!-- 自定义数据模型帮助 -->
                    {{ $translateTitle('developer.customizedatamodelhelp') }}
                  </el-button>
                </el-popover>
                <el-button
                  size="mini"
                  style="margin-left: 20px"
                  type="primary"
                  @click.native="resourceShowAllChannel"
                >
                  {{ $translateTitle('developer.createchannel') }}
                </el-button>
              </div>
            </dgiot-query-form-left-panel>
            <dgiot-query-form-right-panel>
              <dgiot-help
                src="https://tech.iotn2n.com/w/docs/details?id=6"
                title="产品下的所有设备都会继承该产品的 Topic 类"
                trigger="manual"
              />
            </dgiot-query-form-right-panel>
          </dgiot-query-form>

          <div>
            <el-table
              :data="resourcechannelData"
              :height="$baseTableHeight(0) - 60"
              :row-class-name="getChannelEnable"
              style="width: 100%"
            >
              <el-table-column
                :label="$translateTitle('developer.channelnumber')"
              >
                <template #default="{ row }">
                  <span>{{ row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channelname')"
              >
                <template #default="{ row }">
                  <span>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channeladdr')"
              >
                <template #default="{ row }">
                  <span>{{ 'channel/' + row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channeltype')"
              >
                <template #default="{ row }">
                  <span v-if="row.type == 1">
                    {{ $translateTitle('developer.collectionchannel') }}
                  </span>
                  <span v-else>
                    {{ $translateTitle('developer.resourcechannel') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.servicetype')"
              >
                <template #default="{ row }">
                  <span>{{ row.cType }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.operation')"
                width="350"
              >
                <template #default="{ row }">
                  <el-button
                    size="mini"
                    type="danger"
                    @click.native="deleteRelation(row)"
                  >
                    {{ $translateTitle('developer.remove') }}
                  </el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click.native="subProTopic(row)"
                  >
                    <!-- 订阅日志 -->
                    {{ $translateTitle('product.subscriptionlog') }}
                  </el-button>

                  <el-button
                    size="mini"
                    type="primary"
                    @click.native="customize(row)"
                  >
                    <!-- 自定义模型 -->
                    {{ $translateTitle('product.custommodel') }}
                  </el-button>

                  <!-- <el-button type="primary" size="mini" @click.native="customize(row)">自定义模型</el-button> -->
                </template>
              </el-table-column>
              <template #empty>
                <el-image
                  class="dgiot-data-empty"
                  :src="
                    require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                  "
                />
              </template>
            </el-table>
            <div class="elpagination" style="margin-top: 20px">
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="resourcelength"
                :page-sizes="[10, 20, 30, 50]"
                :total="resourcetotal"
                @current-change="resourcechannelCurrentChange"
                @size-change="resourcechannelSizeChange"
              />
            </div>
          </div>
        </el-tab-pane>
        <!--可视化-->
        <el-tab-pane
          :label="$translateTitle('konva.Visualization')"
          name="view"
        >
          <dgiot-views :key="activeName" :view-form="viewForm" />
        </el-tab-pane>
        <!--告警-->
        <el-tab-pane
          :label="$translateTitle('leftbar.alarms')"
          name="notification"
        >
          <dgiot-views :view-form="viewForm" />
        </el-tab-pane>
        <!--字典-->
        <el-tab-pane :label="$translateTitle('product.dict')" name="dict">
          <dgiot-dict />
        </el-tab-pane>
        <!--文件-->
        <el-tab-pane :label="$translateTitle('product.file')" name="file">
          <!-- <dgiot-dict /> -->
          <dgiot-input
            ref="uploadFinish"
            :params="inputParams"
            @fileInfo="fileInfo"
            @files="files"
          />
          <!----------------------------------------------------文件表格------------------>
          <el-button type="primary" @click.native="uploadCkick()">
            {{ $translateTitle('application.uploadfile') }}
          </el-button>
          <el-table
            ref="tableRef"
            v-loading="listLoading"
            :cell-style="{ 'text-align': 'center' }"
            :data="filelist"
            :header-cell-style="{ 'text-align': 'center' }"
            style="width: 100%"
          >
            <el-table-column
              :label="$translateTitle('developer.filename')"
              prop="name"
              show-overflow-tooltip
              sortable
            />
            <el-table-column
              :label="$translateTitle('developer.filesize')"
              prop="name"
              show-overflow-tooltip
              sortable
              width="200"
            >
              <template #default="{ row }">
                <span v-if="row.is_dir">{{ '-' }}</span>
                <span v-else>{{ Math.round(row.size / 1024) + 'kb' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$translateTitle('developer.filemtime')"
              prop="name"
              show-overflow-tooltip
              sortable
              width="260"
            >
              <template #default="{ row }">
                <span>
                  {{ $moment(row.mtime * 1000).format('YYYY-MM-DD HH:mm:ss') }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              :label="$translateTitle('developer.operation')"
              width="300"
            >
              <template #default="{ row }">
                <el-button
                  v-if="!row.is_dir"
                  size="mini"
                  type="primary"
                  @click.native.stop="get_fileinfo(row)"
                >
                  <!-- 详情 -->
                  {{ $translateTitle('application.detail') }}
                </el-button>
                <el-button
                  v-if="!row.is_dir"
                  size="mini"
                  type="primary"
                  @click.native.stop="download_file(row)"
                >
                  <!-- 下载 -->
                  {{ $translateTitle('application.preview') }}
                </el-button>
                <el-button
                  v-if="!row.is_dir"
                  slot="reference"
                  size="mini"
                  type="danger"
                  @click.native.stop="delete_file(row)"
                >
                  {{ $translateTitle('developer.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog
            append-to-body
            :model="detailinfo"
            title="文件信息"
            :visible.sync="detailView"
            width="30%"
          >
            <el-form v-loading="ViewLoading">
              <el-form-item label="名称" label-width="200">
                <span>{{ detailinfo.rename }}</span>
              </el-form-item>
              <el-form-item label="路径" label-width="200">
                <span>{{ detailinfo.path }}</span>
              </el-form-item>
              <el-form-item label="url" label-width="200">
                <span>{{ detailinfo.url }}</span>
              </el-form-item>
              <el-form-item label="MD5" label-width="200">
                <span>{{ detailinfo.md5 }}</span>
              </el-form-item>
              <el-form-item label="场景" label-width="200">
                <span>{{ detailinfo.scene }}</span>
              </el-form-item>
              <el-form-item label="大小" label-width="200">
                <span>{{ Math.round(detailinfo.size / 1024) + 'kb' }}</span>
              </el-form-item>
              <el-form-item label="日期" label-width="200">
                <span>
                  {{
                    $moment(detailinfo.timeStamp * 1000).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )
                  }}
                </span>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      append-to-body
      :before-close="handleClose"
      :center="true"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :destroy-on-close="true"
      :modal="true"
      :title="modules.type == 'events' ? '自定义事件' : '自定义服务'"
      :visible.sync="modules.visible"
      width="30%"
    >
      <!-- <div style="margin-bottom: 9px; display: inline-block">
        <span
          style="
            width: 80px;
            text-align: right;
            vertical-align: middle;
            float: left;
            font-size: 14px;
            color: #606266;
            font-weight: 700;
            line-height: 40px;
            padding: 0 12px 0 0;
            box-sizing: border-box;
            display: inline-block;
          "
        >
          功能类型
        </span>
        <el-radio-group
          v-model="modules.type"
          :disabled="modules.disabled"
          size="mini"
        >
          <el-radio border label="service" @change="clearfix(modules.type)">
            服务
          </el-radio>
          <el-radio border label="event" @change="clearfix(modules.type)">
            事件
          </el-radio>
        </el-radio-group>
      </div> -->
    </el-dialog>
    <!--物模型-->
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="$translateTitle('product.viewobjectmodel')"
      :visible.sync="schemadialogVisible"
    >
      <div>
        <div style="background: #ffffff">
          <label id="plug-name" />
        </div>
        <pre id="editor1" class="ace_editor" style="min-height: 400px"><textarea
          class="ace_text-input"
          style="overflow:scroll"
        /></pre>
      </div>
      <span slot="footer" class="dialog-footer" style="height: 30px">
        <el-button type="primary" @click.native="preserve('json')">
          <!-- 更新 -->
          {{ $translateTitle('equipment.update') }}
        </el-button>
      </span>
    </el-dialog>
    <!--通道弹窗-->
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="$translateTitle('equipment.addchannel')"
      :visible.sync="innerVisible"
    >
      <div class="addchannel">
        <el-table :data="allchannelData" height="400" style="width: 100%">
          <el-table-column :label="$translateTitle('developer.channelnumber')">
            <template #default="{ row }">
              <span>{{ row.objectId }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.channelname')">
            <template #default="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.channeladdr')">
            <template #default="{ row }">
              <span>{{ 'channel/' + row.objectId }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.channeltype')">
            <template #default="{ row }">
              <span v-if="row.type == 1">
                {{ $translateTitle('developer.collectionchannel') }}
              </span>
              <span v-else-if="row.type == 2">
                {{ $translateTitle('developer.resourcechannel') }}
              </span>
              <span v-else>
                <!-- 任务通道 -->
                {{ $translateTitle('developer.missionchannel') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.servicetype')">
            <template #default="{ row }">
              <span>{{ row.cType }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.operation')">
            <template #default="{ row }">
              <el-button
                size="mini"
                type="primary"
                @click.native="addProductChannel(row.objectId)"
              >
                {{ $translateTitle('developer.add') }}
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-image
              class="dgiot-data-empty"
              :src="
                require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
              "
            />
          </template>
        </el-table>
        <div class="elpagination" style="margin-top: 20px">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :page-size="allChannellength"
            :page-sizes="[10, 20, 30, 50]"
            :total="allChanneltotal"
            @current-change="allChannelCurrentChange"
            @size-change="allChannelSizeChange"
          />
        </div>
      </div>
    </el-dialog>
    <!---日志订阅弹窗-->
    <el-dialog
      v-if="subdialog"
      :append-to-body="true"
      :before-close="handleCloseSubdialog"
      :close-on-click-modal="false"
      :title="channelname + '日志'"
      :visible.sync="subdialog"
      width="85%"
    >
      <mqtt-log
        :channel-id="channelname"
        :list="msgList"
        :msg="submessage"
        :refresh-key="refreshFlag"
      />
    </el-dialog>
    <!--资源通道关联模型-->
    <el-dialog
      :append-to-body="true"
      :before-close="closeWuDialog"
      :close-on-click-modal="false"
      :show-close="false"
      top="1vh"
      :visible.sync="resourcedialogFormVisible"
      width="90%"
    >
      <el-form ref="resourceform" :model="resourceform">
        <div class="wumoxing">
          <el-row>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <!-- <el-form-item label="物模型"> -->
                <el-form-item :label="$translateTitle('product.physicalmodel')">
                  <pre
                    id="editormodel"
                    class="ace_editor"
                    style="min-height: 600px"
                  ><el-input
                    class="ace_text-input"
                    type="textarea"
                  /></pre>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="grid-content bg-purple-light">
                <!-- <el-form-item label="自定义数据模型"> -->
                <el-form-item
                  :label="$translateTitle('product.customizedatamodel')"
                >
                  <pre
                    id="editorcreate"
                    class="ace_editor"
                    style="min-height: 600px"
                  ><el-input
                    class="ace_text-input"
                    type="textarea"
                  /></pre>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="closeWuDialog">
          <!-- 退 出 -->
          {{ $translateTitle('product.quit') }}
        </el-button>
        <el-button type="primary" @click.native="addData">
          <!-- 保 存 -->
          {{ $translateTitle('product.preservation') }}
        </el-button>
      </div>
    </el-dialog>
    <!--导出-->
    <el-dialog
      :append-to-body="true"
      :title="$translateTitle('product.export')"
      :visible.sync="exportDialogShow"
      width="25%"
    >
      <!-- <p class="export-p">  <a :href="exportUrl" :download="exportNameDownload">文件下载 </a></p>       -->

      <div slot="footer" class="dialog-footer">
        <el-button
          class="btn-right"
          size="small"
          @click.native="exportDialogShow = false"
        >
          <!-- 关闭 -->
          {{ $translateTitle('tagsView.close') }}
        </el-button>
      </div>
    </el-dialog>
    <!--查看采集公式-->
    <el-dialog
      :append-to-body="true"
      :before-close="handleCloseCollecttion"
      :close-on-click-modal="false"
      :fullscreen="true"
      :title="$translateTitle('product.viewcollectionformula')"
      :visible.sync="collectionDialogVisible"
      width="100%"
    >
      <el-row>
        <el-col :span="6">
          <div class="diaCollLeftCls">
            <el-menu
              class="el-menu-vertical-demo"
              :default-active="activeIndex"
            >
              <template v-for="(item, index) in wmxData">
                <el-menu-item
                  :key="index + ''"
                  :index="item.identifier"
                  @click.native="menuTabClick(item, index)"
                >
                  <ol v-if="item.dataType.specs">
                    {{
                      item.identifier +
                      '&nbsp; &nbsp; &nbsp; &nbsp; ' +
                      item.name +
                      '&nbsp; &nbsp; &nbsp; &nbsp; 取值范围' +
                      item.dataType.specs.min +
                      '~' +
                      item.dataType.specs.max
                    }}
                  </ol>
                  <ol v-else>
                    {{
                      item.identifier +
                      '&nbsp; &nbsp; &nbsp; &nbsp; ' +
                      item.name
                    }}
                  </ol>
                </el-menu-item>
              </template>
            </el-menu>
          </div>
        </el-col>
        <el-col :span="18">
          <el-tabs
            v-model="editableTabsValue"
            closable
            type="card"
            @tab-click="handleRightTopTabClick"
            @tab-remove="removeTab"
          >
            <el-tab-pane
              v-for="(item, index) in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
              <div class="diaCollRightCls">
                <el-row style="margin: 10px">
                  <el-button type="success">
                    <!-- 测试 -->
                    {{ $translateTitle('rule.Test') }}
                  </el-button>
                  <el-button type="info" @click.native="onReductionTap(index)">
                    <!-- 还原 -->
                    {{ $translateTitle('product.reduction') }}
                  </el-button>
                  <el-button type="primary" @click.native="onSaveTap(index)">
                    <!-- 保存 -->
                    {{ $translateTitle('product.preservation') }}
                  </el-button>
                </el-row>
                <pre
                  :id="item.name"
                  class="ace_editor3"
                  style="min-height: 300px; margin-top: 0; margin-bottom: 0"
                ><textarea class="ace_text-input" /></pre>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script src="./js/proddetail.js"></script>
<style lang="scss" scoped>
  @import './css/proddetail.css';

  .engintable {
    width: 100%;
    height: auto;

    .engineheader {
      h3 {
        float: left;
      }
    }

    .block {
      margin-top: 20px;
    }
  }

  ::v-deep .firstcolumn {
    color: #34c388;
    cursor: pointer;
  }

  .export-p {
    text-align: center;
  }
</style>
