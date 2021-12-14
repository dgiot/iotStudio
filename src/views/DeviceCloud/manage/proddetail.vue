<template>
  <div class="proddetail">
    <dgiot-profile v-show="false" :product-info="productInfo" />
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
            <vab-query-form>
              <vab-query-form-left-panel :disabled="!productName.length">
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
              </vab-query-form-left-panel>
              <vab-query-form-right-panel>
                <vab-help
                  src="https://tech.iotn2n.com/w/docs/details?id=6"
                  title="产品下的所有设备都会继承该产品的 Topic 类"
                  trigger="click"
                />
              </vab-query-form-right-panel>
            </vab-query-form>
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
                  :span="2"
                >
                  {{ productdetail.createdAt }}
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
                  :label="$translateTitle('product.parser')"
                >
                  <!--                  {{ productInfo.config.parser.length || 0 }}-->
                  <template slot="label">
                    <el-link
                      type="success"
                      @click.native="
                        feateditorParser1(productInfo, 'parser', true)
                      "
                    >
                      {{ $translateTitle('product.parser') }}
                    </el-link>
                  </template>
                  <el-link
                    :type="
                      productInfo.config.parser.length ? 'success' : 'default'
                    "
                    @click.native="
                      feateditorParser1(productInfo, 'parser', false)
                    "
                  >
                    {{ productInfo.config.parser.length || 0 }}
                  </el-link>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <el-link
                      type="success"
                      @click="feateditorParser1(productInfo, 'profile', true)"
                    >
                      {{ $translateTitle('product.profile') }}
                    </el-link>
                  </template>
                  <el-link
                    type="primary"
                    @click="feateditorParser1(productInfo, 'profile', false)"
                  >
                    {{ productInfo.config.profile.length || 0 }}
                  </el-link>
                </el-descriptions-item>
                <!--                <el-descriptions-item>-->
                <!--                  <template slot="label">-->
                <!--                    {{ $translateTitle("product.decoder") }}-->
                <!--                  </template>-->
                <!--                  <el-button type="text" @click="seeDecoder(productInfo.decoder)">-->
                <!--                    {{ $translateTitle("product.details") }}-->
                <!--                  </el-button>-->
                <!--                </el-descriptions-item>-->
              </el-descriptions>
            </div>
          </div>
        </el-tab-pane>
        <!--topic列表-->
        <el-tab-pane
          :label="'Topic' + $translateTitle('product.list')"
          name="second"
        >
          <div
            style="box-sizing: border-box; padding: 10px; background: #ffffff"
          >
            <vab-query-form>
              <vab-query-form-left-panel>
                <div class="addtopic">
                  <el-button
                    size="small"
                    type="primary"
                    @click.native="topicdialogVisible = true"
                  >
                    {{ $translateTitle('product.customtopicclass') }}
                  </el-button>
                </div>
              </vab-query-form-left-panel>
              <vab-query-form-right-panel>
                <vab-help
                  src="https://tech.iotn2n.com/w/docs/details?id=6"
                  title="产品下的所有设备都会继承该产品的 Topic 类"
                  trigger="click"
                />
              </vab-query-form-right-panel>
            </vab-query-form>
            <el-table
              :data="
                topicData.slice(
                  (topicstart - 1) * topiclength,
                  topicstart * topiclength
                )
              "
              :height="$baseTableHeight(0) - 60"
              style="width: 100%; text-align: center"
            >
              <el-table-column align="left" label="Topic">
                <template #default="{ row }">
                  <span>
                    {{ row.topic.replace('\$\{ProductId\}', productId) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('product.operationauthority')"
              >
                <template #default="{ row }">
                  <span v-if="row.type == 'pub'">
                    {{ $translateTitle('product.pub') }}
                  </span>
                  <span v-if="row.type == 'sub'">
                    {{ $translateTitle('product.sub') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('developer.describe')"
                prop="desc"
              />
              <el-table-column
                align="center"
                :label="$translateTitle('developer.operation')"
              >
                <template #default="{ row, $index }">
                  <el-button
                    v-if="!row.isdef"
                    size="mini"
                    type="primary"
                    @click.native="updatetopic($index)"
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
                    v-if="!row.isdef"
                    slot="reference"
                    size="mini"
                    type="danger"
                    @click.native="deletetopic(row, $index)"
                  >
                    {{ $translateTitle('developer.delete') }}
                  </el-button>
                  <!--                  </el-popover>-->
                </template>
              </el-table-column>
              <template #empty>
                <el-image
                  class="vab-data-empty"
                  :src="
                    require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                  "
                />
              </template>
            </el-table>
            <div class="elpagination" style="margin-top: 20px">
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="topiclength"
                :page-sizes="[10, 20, 30, 50]"
                :total="topicData.length"
                @current-change="topicCurrentChange"
                @size-change="topicSizeChange"
              />
            </div>
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
                  <el-form-item label="Topic类：" prop="topic">
                    <el-input v-model="topicform.topic">
                      <template slot="prepend">
                        {{ 'thing/' + productId + '/${DevAddr}/' }}
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    :label="$translateTitle('product.operationauthority')"
                    prop="type"
                  >
                    <el-select
                      v-model="topicform.type"
                      :placeholder="
                        $translateTitle(
                          'product.selectdeviceoperationpermission'
                        )
                      "
                    >
                      <el-option
                        :label="$translateTitle('product.sub')"
                        value="sub"
                      />
                      <el-option
                        :label="$translateTitle('product.pub')"
                        value="pub"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$translateTitle('developer.describe')">
                    <el-input v-model="topicform.desc" type="textarea" />
                  </el-form-item>
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
            <el-row :gutter="24">
              <el-col :lg="4" :md="5" :sm="6" :xl="3" :xs="24">
                <vab-query-form class="query-form">
                  <vab-query-form-top-panel>
                    <el-button type="primary" @click.native="addMachine">
                      添加类型
                    </el-button>
                  </vab-query-form-top-panel>
                </vab-query-form>
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
                      class="vab-data-empty"
                      :src="
                        require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                      "
                    />
                  </template>
                </el-table>
              </el-col>
              <el-col :lg="20" :md="19" :sm="18" :xl="21" :xs="24">
                <vab-query-form class="query-form">
                  <vab-query-form-right-panel style="width: 100%">
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
                        @click.native="createProperty"
                      >
                        {{ $translateTitle('product.newcustomattribute') }}
                      </el-button>
                      <!-- 新建标准属性 -->
                      <el-button
                        size="small"
                        type="primary"
                        @click.native="addcategory"
                      >
                        {{ $translateTitle('product.newstandardattribute') }}
                      </el-button>
                    </div>
                  </vab-query-form-right-panel>
                </vab-query-form>
                <el-table
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
                  :row-class-name="getRowClass"
                  row-key="identifier"
                  style="width: 100%; margin-top: 10px"
                >
                  <el-table-column type="expand">
                    <template
                      v-if="row.dataType.type == 'struct'"
                      slot-scope="{ row }"
                      class="opentable"
                    >
                      <el-table
                        :data="row.dataType.specs"
                        style="
                          box-sizing: border-box;
                          width: 60%;
                          text-align: center;
                        "
                      >
                        <el-table-column
                          align="center"
                          :label="$translateTitle('product.identifier')"
                        >
                          <template slot-scope="scope1">
                            <span>{{ scope1.row.identifier }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="center"
                          :label="$translateTitle('product.functionaltypes')"
                        >
                          <span>
                            {{ $translateTitle('product.attribute') }}
                          </span>
                        </el-table-column>

                        <el-table-column
                          align="center"
                          :label="$translateTitle('product.functionname')"
                          prop="name"
                        />
                        <el-table-column
                          align="center"
                          :label="$translateTitle('product.datadefinition')"
                        >
                          <template slot-scope="scope2">
                            <span>{{ scope2.row.dataType.type }}</span>
                          </template>
                        </el-table-column>
                        <template #empty>
                          <el-image
                            class="vab-data-empty"
                            :src="
                              require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                            "
                          />
                        </template>
                      </el-table>
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
                    width="80"
                  />
                  <el-table-column
                    align="center"
                    :label="$translateTitle('product.Rounds')"
                    width="60"
                  >
                    <template #default="{ row }">
                      {{ row.dataForm.round }}
                    </template>
                  </el-table-column>

                  <el-table-column
                    align="center"
                    :label="$translateTitle('product.Strategy')"
                    width="80"
                  >
                    <template #default="{ row }">
                      {{ row.dataForm.strategy }}
                    </template>
                  </el-table-column>

                  <el-table-column
                    align="center"
                    :label="$translateTitle('product.protocol')"
                    width="80"
                  >
                    <template #default="{ row }">
                      {{ row.dataForm.protocol }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    :label="$translateTitle('product.functionaltypes')"
                    width="90"
                  >
                    <span>{{ $translateTitle('product.attribute') }}</span>
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
                        @click.native="deletewmx(row)"
                      >
                        {{ $translateTitle('developer.delete') }}
                      </el-button>
                      <el-button
                        size="mini"
                        type="primary"
                        @click.native="wmxDataFill(row, $index)"
                      >
                        <!-- 编辑 -->
                        {{ $translateTitle('task.Edit') }}
                      </el-button>
                    </template>
                  </el-table-column>
                  <template #empty>
                    <el-image
                      class="vab-data-empty"
                      :src="
                        require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                      "
                    />
                  </template>
                </el-table>
                <!--功能定义分页-->
                <el-pagination
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
                      class="vab-data-empty"
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
            :append-to-body="true"
            :before-close="wmxhandleClose"
            :close-on-click-modal="false"
            :title="wmxSituation + '自定义属性'"
            top="5vh"
            :visible.sync="wmxdialogVisible"
            width="60%"
          >
            <dgiot-wmx
              ref="sizeForm"
              :size-form1="sizeForm"
              @addDas="addDas"
              @addDomain="addDomain"
              @removeDas="removeDas"
              @removeDomain="removeDomain"
              @submitForm="submitForm"
              @wmxhandleClose="wmxhandleClose"
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
                        :label="item.data.Name + '/' + item.data.Symbol"
                        :value="item.data.Symbol"
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
        <!--协议解析-->
        <!-- <div style="diaplay:none;"> -->
        <!-- <div> -->
        <!-- <el-tab-pane label="物解析" name="fourth"> -->
        <el-tab-pane
          :disabled="true"
          :label="$translateTitle('product.matteranalysis')"
          name="fourth"
          style="diaplay: none"
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
                  class="vab-data-empty"
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
                  class="vab-data-empty"
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
        <!-- </div> -->
        <!-----------------服务通道------------------------------------------>
        <el-tab-pane
          :label="$translateTitle('product.physicalaccess')"
          name="fiveth"
        >
          <vab-query-form>
            <vab-query-form-left-panel>
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
            </vab-query-form-left-panel>
            <vab-query-form-right-panel>
              <vab-help
                src="https://tech.iotn2n.com/w/docs/details?id=6"
                title="产品下的所有设备都会继承该产品的 Topic 类"
                trigger="click"
              />
            </vab-query-form-right-panel>
          </vab-query-form>
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
                  class="vab-data-empty"
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
        <!-- <el-tab-pane label="物采集" name="eighth">
          <TaskCollection1 :productId="productId" :isreload="isreload" />
        </el-tab-pane>-->
        <!-- <el-tab-pane label="物存储" name="seven"> -->
        <el-tab-pane
          :label="$translateTitle('product.materialstorage')"
          name="seven"
        >
          <vab-query-form>
            <vab-query-form-left-panel>
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
            </vab-query-form-left-panel>
            <vab-query-form-right-panel>
              <vab-help
                src="https://tech.iotn2n.com/w/docs/details?id=6"
                title="产品下的所有设备都会继承该产品的 Topic 类"
                trigger="manual"
              />
            </vab-query-form-right-panel>
          </vab-query-form>

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
                  class="vab-data-empty"
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
        <!-- <el-tab-pane label="物规则" name="sixeth">
          <div class="engintable">
            <div class="engineheader">
              <h3>{{ $translateTitle('rule.rule')}}</h3>
              <el-button
                type="primary"
                icon="el-icon-plus"
                style="float:right;margin:19px 0"
                size="small"
                @click.native="addEngine"
              >{{ $translateTitle('developer.add')}}</el-button>
            </div>
            <el-table
              :data="engineData"
              style="width: 100%;text-align:center"
              :cell-class-name="getRowindex"
            >
              <el-table-column label="ID" align="center" width="180">
                <template #default="{ row }">
                  <span @click.native="detailRules(row.id)">{{row.id}}</span>
                </template>
              </el-table-column>
              <el-table-column :label=" $translateTitle('rule.TriggerEvent')" align="center">
                <template #default="{ row }">
                  <span>{{row.for.join(',')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="rawsql" align="center" label="SQL"></el-table-column>
              <el-table-column align="center" :label=" $translateTitle('rule.ResponseAction')">
                <template #default="{ row }">
                  <span>{{actions(row.actions)}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :label=" $translateTitle('developer.operation')">
                <template #default="{ row }">
                  <el-button type="info" @click.native="detailRules(row.id)" size="mini" plain>查看</el-button>
                  <el-button type="info" @click.native="deleteRule(row.id)" size="mini" plain>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="rulepagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="ruletotal"
              ></el-pagination>
            </div>
          </div>

          <div style="width:40%">
            <div>
              <el-tag>{{ $translateTitle('product.modeltemplate')}}</el-tag>
            </div>
            <pre id="editor6" class="ace_editor" style="min-height:300px;width:100%">
               <textarea class="ace_text-input" style="overflow:scroll"></textarea>
              </pre>
            <el-divider direction="vertical"></el-divider>
          </div>

          <div style="width:30%">
            <div>
              <el-tag>{{ $translateTitle('product.modelstorage')}}</el-tag>
            </div>
            <pre id="editor4" class="ace_editor" style="min-height:300px;width:100%">
              <textarea class="ace_text-input"></textarea>
            </pre>
            <el-divider direction="vertical"></el-divider>
          </div>

          <div style="width:30%">
            <div>
              <el-tag>{{ $translateTitle('product.modeldataoutput')}}</el-tag>
              <el-button type="primary" size="small" @click.native="testgraphql">测试</el-button>
            </div>
            <pre id="editor5" class="ace_editor" style="min-height:300px;width:100%">
              <textarea class="ace_text-input"></textarea>
            </pre>
        </div>-->
        <!-- </el-tab-pane> -->

        <!--   告警模板     -->
        <!--        <el-tab-pane-->
        <!--          :label="$translateTitle('product.matteranalysis')"-->
        <!--          name="alarm"-->
        <!--        >-->
        <!--          -->
        <!--        </el-tab-pane>-->
      </el-tabs>
    </div>

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
        <el-button type="primary" @click.native="preserve">
          <!-- 更新 -->
          {{ $translateTitle('equipment.update') }}
        </el-button>
      </span>
    </el-dialog>
    <!--通道弹窗-->
    <!-- <el-dialog
  :append-to-body="true"
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
      title="添加通道"
      append-to-body
    > -->
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
              class="vab-data-empty"
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
      :append-to-body="true"
      :before-close="handleCloseSubdialog"
      :close-on-click-modal="false"
      :title="channelname + '日志'"
      :visible.sync="subdialog"
      width="85%"
    >
      <div style="margin-top: 20px">
        <pre
          id="subdialog"
          class="ace_editor"
          style="width: 100%; min-height: 300px"
        >
                      <textarea
                        class="ace_text-input"
                        style="overflow:scroll"
                      />
        </pre>
      </div>

      <!-- </div> -->
      <span slot="footer" class="dialog-footer" style="height: 30px">
        <el-switch
          v-model="value4"
          active-color="#13ce66"
          inactive-color="#ff4949"
          inactive-text="自动刷新"
          style="display: inline-block; margin-right: 10px"
          @change="stopsub"
        />
        <!-- <el-button type="success" size="mini" @click.native="stopsub('start')" v-if="subaction=='start'">启动</el-button>
        <el-button type="warning" size="mini" @click.native="stopsub('stop')" v-else>停止</el-button>-->
      </span>
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

    <!-- <el-dialog
  :append-to-body="true" :visible.sync="exportDialogShow" title="导出" width="25%"> -->
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

    <!--物模型采集公式按钮-->
    <!-- <el-dialog
  :append-to-body="true"
      :fullscreen="true"
      :before-close="handleCloseCollecttion"
      :visible.sync="collectionDialogVisible"
      :close-on-click-modal="false"
      title="查看采集公式"
      width="100%"
    > -->
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
