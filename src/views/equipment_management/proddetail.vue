<template>
  <div class="editproduct">
    <div class="editheader">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/roles/product' }">
          {{ $translateTitle('route.产品管理') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ $translateTitle('route.产品详情') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="product">
        <ul>
          <li>
            <!-- <span>产品名称:</span> -->
            {{ $translateTitle('product.productname') }}:
            <span>{{ productName }}</span>
          </li>
          <li>
            <span>ProductSecret:</span>
            <span v-if="isshow == false">
              ********************
              <el-link
                :underline="false"
                type="primary"
                style="margin-left: 5px; cursor: pointer"
                @click="isshow = true"
              >
                {{ $translateTitle('product.display') }}
              </el-link>
            </span>
            <span v-else>
              {{ ProductSecret }}
              <el-link
                :underline="false"
                type="primary"
                style="margin-left: 5px; cursor: pointer"
                @click="isshow = false"
              >
                {{ $translateTitle('product.hidden') }}
              </el-link>
            </span>
          </li>
          <li>
            <span>{{ $translateTitle('product.numberofequipment') }}:</span>
            <span>
              {{ form.ProductAll }}
              <el-link
                :underline="false"
                type="primary"
                style="margin-left: 10px; font-size: 16px"
                @click.native="goToDevices"
              >
                {{ $translateTitle('product.gotoequipment') }}
              </el-link>
            </span>
          </li>
          <li>
            <div class="block">
              <el-image
                v-if="productimg"
                :src="productimg"
                style="
                  position: relative;
                  top: -40px;
                  max-width: 200px;
                  height: auto;
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
    </div>
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
              <vab-query-form-left-panel>
                <div class="addtopic">
                  <el-button type="primary" :disabled="!productName.length" size="small" @click.native="exportProduct(productName)">
                    {{ $translateTitle('product.exportpro') }}
                  </el-button>
                  <el-button size="small" type="primary" @click.native="SetTemplate">
                    {{ $translateTitle('product.Set as template') }}
                  </el-button>
                </div>
              </vab-query-form-left-panel>
              <vab-query-form-right-panel>
                <vab-help
                  trigger="click"
                  src="https://tech.iotn2n.com/w/docs/details?id=6"
                  title="产品下的所有设备都会继承该产品的 Topic 类"
                />
              </vab-query-form-right-panel>
            </vab-query-form>
            <div>
              <table
                class="mailtable"
                style="width: 100%"
                border="0"
                cellspacing="0"
                cellpadding="0"
              >
                <tr>
                  <td class="cloumn notbottom">
                    {{ $translateTitle('product.productname') }}
                  </td>
                  <td class="notbottom">{{ productdetail.name }}</td>
                  <td class="cloumn notbottom">
                    {{ $translateTitle('product.nodetype') }}
                  </td>
                  <td v-if="productdetail.nodeType == 1" class="notbottom">
                    {{ $translateTitle('product.gateway') }}
                  </td>
                  <td v-else class="notbottom">
                    {{ $translateTitle('product.equipment') }}
                  </td>
                  <td class="cloumn notbottom">
                    {{ $translateTitle('product.addingtime') }}
                  </td>
                  <td>{{ productdetail.createdAt }}</td>
                </tr>
                <tr>
                  <td class="cloumn notbottom">
                    {{ $translateTitle('product.classification') }}
                  </td>
                  <td class="notbottom">{{ productdetail.category }}</td>
                  <td class="cloumn notbottom">
                    {{ $translateTitle('product.dynamicregistration') }}
                    <el-tooltip
                      :content="$translateTitle('product.text1')"
                      placement="top"
                      style="margin-left: 5px; color: #cccccc"
                      effect="light"
                    >
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </td>
                  <td class="notbottom">
                    <span v-if="dynamicReg == false" style="color: #cccccc">
                      {{ $translateTitle('product.close') }}
                    </span>
                    <span v-else>{{ $translateTitle('product.open') }}</span>
                    <el-switch
                      v-model="dynamicReg"
                      :active-value="true"
                      :inactive-value="false"
                      active-color="#5eb058"
                      inactive-color="#cccccc"
                      @change="handelUpdate($event, dynamicReg)"
                    />
                  </td>
                  <td class="cloumn notbottom">
                    {{ $translateTitle('product.networking') }}
                  </td>
                  <td
                    v-if="productdetail.netType == 'CELLULAR'"
                    class="notbottom"
                  >
                    <!-- 蜂窝(2G/3G/4G) -->
                    {{ $translateTitle('product.honeycomb') }}(2G/3G/4G)
                  </td>
                  <td
                    v-else-if="productdetail.netType == 'WIFI'"
                    class="notbottom"
                  >
                    WiFi
                  </td>
                  <td
                    v-else-if="productdetail.netType == 'ETHERNET'"
                    class="notbottom"
                  >
                    <!-- 以太网 -->
                    {{ $translateTitle('product.ethernet') }}
                  </td>
                  <td
                    v-else-if="productdetail.netType == 'LORA'"
                    class="notbottom"
                  >
                    LoRaWAN
                  </td>
                  <td v-else class="notbottom">{{ productdetail.netType }}</td>
                </tr>
                <tr>
                  <td class="cloumn">
                    {{ $translateTitle('developer.describe') }}
                  </td>
                  <td colspan="6">{{ productdetail.desc }}</td>
                </tr>
              </table>
              <dgiot-profile ref="profile" :is-product="true" />
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
                    type="primary"
                    size="small"
                    @click.native="topicdialogVisible = true"
                  >
                    {{ $translateTitle('product.customtopicclass') }}
                  </el-button>
                </div>
              </vab-query-form-left-panel>
              <vab-query-form-right-panel>
                <vab-help
                  trigger="click"
                  src="https://tech.iotn2n.com/w/docs/details?id=6"
                  title="产品下的所有设备都会继承该产品的 Topic 类"
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
              style="width: 100%; text-align: center"
            >
              <el-table-column label="Topic" align="left">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.topic.replace('\$\{ProductId\}', productId) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('product.operationauthority')"
                align="center"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 'pub'">
                    {{ $translateTitle('product.pub') }}
                  </span>
                  <span v-if="scope.row.type == 'sub'">
                    {{ $translateTitle('product.sub') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.describe')"
                prop="desc"
                align="center"
              />
              <el-table-column
                :label="$translateTitle('developer.operation')"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="!scope.row.isdef"
                    type="primary"
                    size="mini"
                    @click.native="updatetopic(scope.row, scope.$index)"
                  >
                    {{ $translateTitle('developer.edit') }}
                  </el-button>
                  <!--                  <el-popover-->
                  <!--                    :ref="`popover-${scope.$index}`"-->
                  <!--                    placement="top"-->
                  <!--                    width="300"-->
                  <!--                  >-->
                  <!--                    <p>确定删除Topic【{{ scope.row.topic }}】吗？</p>-->
                  <!--                  <div style="text-align: right; margin: 0">-->
                  <!--                    <el-button-->
                  <!--                      size="mini"-->
                  <!--                      size="mini"-->
                  <!--                      @click.native="-->
                  <!--                        scope._self.$refs[`popover-${scope.$index}`].doClose()-->
                  <!--                      "-->
                  <!--                    >-->
                  <!--                      {{  $translateTitle("developer.cancel") }}</el-button-->
                  <!--                      >-->
                  <!--                    <el-button-->
                  <!--                      type="primary"-->
                  <!--                      size="mini"-->
                  <!--                      @click.native="deletetopic(scope, scope.$index)"-->
                  <!--                    >-->
                  <!--                      {{  $translateTitle("developer.determine") }}</el-button-->
                  <!--                      >-->
                  <!--                  </div>-->
                  <el-button
                    v-if="!scope.row.isdef"
                    slot="reference"
                    type="danger"
                    size="mini"
                    @click.native="deletetopic(scope, scope.$index)"
                  >
                    {{ $translateTitle('developer.delete') }}
                  </el-button>
                  <!--                  </el-popover>-->
                </template>
              </el-table-column>
            </el-table>
            <div class="elpagination" style="margin-top: 20px">
              <el-pagination
                :page-sizes="[10, 20, 30, 50]"
                :page-size="topiclength"
                :total="topicData.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="topicSizeChange"
                @current-change="topicCurrentChange"
              />
            </div>
          </div>
          <!--topic弹窗-->
          <el-dialog
            :append-to-body="true"
            :title="$translateTitle('product.definetopicclass')"
            :visible.sync="topicdialogVisible"
            :close-on-click-modal="false"
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
            :title="$translateTitle('product.addMachine')"
            :visible.sync="machine"
            :close-on-click-modal="false"
            width="30%"
          >
            <div>
              <el-form
                ref="sizeForm"
                :model="machineForm"
                size="mini"
                label-position="left"
                label-width="80px"
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
              <el-button type="primary" size="mini" @click.native="machine = false">
                {{ $translateTitle('developer.cancel') }}
              </el-button>
              <el-button size="mini" @click.native="savemachine(machineForm)">
                {{ $translateTitle('developer.determine') }}
              </el-button>
            </span>
          </el-dialog>
          <div>
            <el-row :gutter="24">
              <el-col :xs="24" :sm="6" :md="5" :lg="4" :xl="3">
                <vab-query-form class="query-form">
                  <vab-query-form-top-panel>
                    <el-button type="primary" @click.native="addMachine">
                      添加类型
                    </el-button>
                  </vab-query-form-top-panel>
                </vab-query-form>
                <el-table
                  :data="FromMachine"
                  style="width: 60vh; overflow: auto"
                  border
                  :row-class-name="tableRowClassName"
                  @row-click="clickmachine"
                >
                  <el-table-column
                    prop="sort"
                    label="序号"
                    width="50"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{ scope.$index + 1 }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="设备类型"
                    align="center"
                  />
                </el-table>
              </el-col>
              <el-col :xs="24" :sm="18" :md="19" :lg="20" :xl="21">
                <vab-query-form class="query-form">
                  <vab-query-form-right-panel style="width: 100%">
                    <div class="stripe-panel">
                      <el-button
                        type="primary"
                        size="small"
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
                        type="primary"
                        size="small"
                        @click.native="checkschema"
                      >
                        {{ $translateTitle('product.viewobjectmodel') }}
                      </el-button>

                      <!-- 新增自定义属性 -->
                      <el-button
                        type="primary"
                        size="small"
                        @click.native="createProperty"
                      >
                        {{ $translateTitle('product.newcustomattribute') }}
                      </el-button>
                      <!-- 新建标准属性 -->
                      <el-button
                        type="primary"
                        size="small"
                        @click.native="addcategory"
                      >
                        {{ $translateTitle('product.newstandardattribute') }}
                      </el-button>
                    </div>
                  </vab-query-form-right-panel>
                </vab-query-form>
                <el-table
                  :default-sort="{ prop: 'date', order: 'descending' }"
                  :data="
                    wmxData.slice(
                      (wmxstart - 1) * wmxPageSize,
                      wmxstart * wmxPageSize
                    )
                  "
                  :default-expand-all="false"
                  :row-class-name="getRowClass"
                  border
                  row-key="identifier"
                  style="width: 100%; margin-top: 10px"
                >
                  <el-table-column type="expand">
                    <template
                      v-if="scope.row.dataType.type == 'struct'"
                      slot-scope="scope"
                      class="opentable"
                    >
                      <el-table
                        :data="scope.row.dataType.specs"
                        style="
                          box-sizing: border-box;
                          width: 60%;
                          text-align: center;
                        "
                      >
                        <el-table-column
                          :label="$translateTitle('product.identifier')"
                          align="center"
                        >
                          <template slot-scope="scope1">
                            <span>{{ scope1.row.identifier }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          :label="$translateTitle('product.functionaltypes')"
                          align="center"
                        >
                          <span>
                            {{ $translateTitle('product.attribute') }}
                          </span>
                        </el-table-column>

                        <el-table-column
                          :label="$translateTitle('product.functionname')"
                          prop="name"
                          align="center"
                        />
                        <el-table-column
                          :label="$translateTitle('product.datadefinition')"
                          align="center"
                        >
                          <template slot-scope="scope2">
                            <span>{{ scope2.row.dataType.type }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>

                  <el-table-column
                    :label="$translateTitle('product.order')"
                    width="60"
                    align="center"
                  >
                    <template #default="{ row }">
                      {{ row.dataForm.order }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('product.devicetype')"
                    width="80"
                    prop="devicetype"
                    align="center"
                  />
                  <el-table-column
                    :label="$translateTitle('product.Rounds')"
                    width="60"
                    align="center"
                  >
                    <template #default="{ row }">
                      {{ row.dataForm.round }}
                    </template>
                  </el-table-column>

                  <el-table-column
                    :label="$translateTitle('product.Strategy')"
                    width="80"
                    align="center"
                  >
                    <template #default="{ row }">
                      {{ row.dataForm.strategy }}
                    </template>
                  </el-table-column>

                  <el-table-column
                    :label="$translateTitle('product.protocol')"
                    width="80"
                    align="center"
                  >
                    <template #default="{ row }">
                      {{ row.dataForm.protocol }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    width="90"
                    :label="$translateTitle('product.functionaltypes')"
                  >
                    <span>{{ $translateTitle('product.attribute') }}</span>
                  </el-table-column>

                  <el-table-column
                    align="center"
                    width="100"
                    :label="$translateTitle('product.identifier')"
                    prop="identifier"
                  />
                  <el-table-column
                    align="center"
                    :label="$translateTitle('product.functionname')"
                    prop="name"
                  />
                  <el-table-column
                    width="90"
                    :label="$translateTitle('product.datatype')"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.row.dataType.type }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    :label="$translateTitle('product.datadefinition')"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="
                          scope.row.dataType.specs &&
                          (scope.row.dataType.type == 'double' ||
                            scope.row.dataType.type == 'float' ||
                            scope.row.dataType.type == 'int')
                        "
                      >
                        {{
                          $translateTitle('product.rangeofvalues') +
                          scope.row.dataType.specs.min +
                          '~' +
                          scope.row.dataType.specs.max
                        }}
                      </span>
                      <span v-else-if="scope.row.dataType.type == 'string'">
                        {{
                          $translateTitle('product.datalength') +
                          ':' +
                          scope.row.dataType.size +
                          $translateTitle('product.byte')
                        }}
                      </span>
                      <span v-else-if="scope.row.dataType.type == 'date'" />
                      <span v-else-if="scope.row.dataType.type != 'struct'">
                        {{ scope.row.dataType.specs }}
                      </span>
                      <span v-else />
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    width="160"
                    :label="$translateTitle('developer.operation')"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="danger"
                        size="mini"
                        @click.native="deletewmx(scope.row)"
                      >
                        {{ $translateTitle('developer.delete') }}
                      </el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click.native="wmxDataFill(scope.row, scope.row.index)"
                      >
                        <!-- 编辑 -->
                        {{ $translateTitle('task.Edit') }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!--功能定义分页-->
                <el-pagination
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="wmxPageSize"
                  :total="wmxData.length"
                  style="margin-top: 10px"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="wmxSizeChange"
                  @current-change="wmxCurrentChange"
                />
              </el-col>
            </el-row>
          </div>

          <!--取物模型模板-->
          <el-dialog
            :append-to-body="true"
            :title="$translateTitle('product.addfunction')"
            :visible.sync="originwmx"
            :close-on-click-modal="false"
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
                <el-button type="primary" size="mini" @click.native="getPropData(0)">
                  {{ $translateTitle('developer.search') }}
                </el-button>
              </div>
              <div style="margin-top: 10px; text-align: center">
                <el-table
                  :data="PropData"
                  style="width: 100%; text-align: center"
                >
                  <el-table-column label="ID" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.data.SuperId }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('product.identifier')"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.row.type }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('product.applicabletype')"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.row.data.CategoryName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('developer.operation')"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        size="mini"
                        @click.native="addProCategory(scope.row)"
                      >
                        {{ $translateTitle('product.add') }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div>
                <el-pagination
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="productlength"
                  :total="producttotal"
                  style="margin-top: 10px"
                  layout="total, sizes, prev, pager, next, jumper"
                  small
                  @size-change="productSizeChange"
                  @current-change="productCurrentChange"
                />
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click.native="originwmx = false">
                {{ $translateTitle('developer.cancel') }}
              </el-button>
              <el-button type="primary" size="mini" @click.native="originwmx = false">
                {{ $translateTitle('developer.determine') }}
              </el-button>
            </span>
          </el-dialog>
          <!--添加物模型弹窗-->
          <el-dialog
            :append-to-body="true"
            :title="wmxSituation + '自定义属性'"
            :visible.sync="wmxdialogVisible"
            :before-close="wmxhandleClose"
            :close-on-click-modal="false"
            width="60%"
            top="5vh"
          >
            <dgiot-wmxdetail
              ref="sizeForm"
              :size-form1="sizeForm"
              @addDomain="addDomain"
              @removeDomain="removeDomain"
              @wmxhandleClose="wmxhandleClose"
              @submitForm="submitForm"
            />
          </el-dialog>
          <!--物模型结构体-->
          <el-dialog
            :append-to-body="true"
            :title="$translateTitle('product.addparameter')"
            :visible.sync="structdialog"
            :close-on-click-modal="false"
            width="40%"
            top="15vh"
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
                  <el-form-item required label="取值范围">
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
                      :precision="2"
                      :step="0.01"
                      :min="0"
                      controls-position="right"
                    />
                  </el-form-item>

                  <el-form-item :label="$translateTitle('product.unit')">
                    <el-select
                      v-model="structform.unit"
                      :placeholder="$translateTitle('product.unit')"
                      filterable
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
                            :placeholder="
                              $translateTitle('product.attributevalue')
                            "
                            class="inputnumber"
                            type="number"
                            readonly
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="2">-</el-col>
                      <el-col :span="11">
                        <el-form-item prop="true">
                          <el-input
                            v-model="structform.true"
                            :placeholder="$translateTitle('product.egopen')"
                            class="inputnumber"
                          />
                        </el-form-item>
                      </el-col>
                    </div>
                    <div style="margin-top: 20px">
                      <el-col :span="11">
                        <el-form-item>
                          <el-input
                            v-model="structform.falsevalue"
                            :placeholder="
                              $translateTitle('product.attributevalue')
                            "
                            class="inputnumber"
                            type="number"
                            readonly
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="2">-</el-col>
                      <el-col :span="11">
                        <el-form-item prop="true">
                          <el-input
                            v-model="structform.false"
                            :placeholder="$translateTitle('product.egclost')"
                            class="inputnumber"
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
                    <el-col :span="2" class="line">-</el-col>
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
                    <el-col :span="2" class="line" />
                    <el-col :span="4" class="line">
                      <el-link
                        :underline="false"
                        type="primary"
                        icon="el-icon-minus"
                        style="margin-top: 30px; margin-left: 5px"
                        @click.prevent="removeDomain1(item)"
                      >
                        {{ $translateTitle('developer.delete') }}
                      </el-link>
                    </el-col>
                  </el-form-item>
                  <el-link
                    :underline="false"
                    icon="el-icon-plus"
                    type="primary"
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
              <el-button type="primary" @click.native="submitStruct('structform')">
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
          style="diaplay: none"
          :label="$translateTitle('product.matteranalysis')"
          name="fourth"
        >
          <div class="protolheader">
            <el-form
              ref="formInline"
              :inline="true"
              :model="formInline"
              :rules="addRules"
              class="demo-form-inline"
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
                  type="primary"
                  size="small"
                  @click.native="subAce('formInline', true)"
                >
                  {{ $translateTitle('product.preservation') }}
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click.native="subAce1('formInline')"
                >
                  <!-- 设为公共 -->
                  {{ $translateTitle('product.setaspublic') }}
                </el-button>
                <el-button type="primary" size="small" @click.native="chaxun">
                  {{ $translateTitle('product.publicagreementlibrary') }}
                </el-button>
              </el-form-item>
              <el-form-item style="display: block">
                <el-button type="primary" size="small" @click.native="protol">
                  {{ $translateTitle('product.compile') }}
                </el-button>
                <el-button type="success" size="small" @click.native="updatesubdialog">
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
            :visible.sync="protoldialog"
            :close-on-click-modal="false"
            :title="$translateTitle('product.tdthermalloading')"
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
                <template slot-scope="scope">
                  <span>{{ scope.row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channelname')"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channeladdr')"
              >
                <template slot-scope="scope">
                  <span>{{ 'channel/' + scope.row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channeltype')"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 1">
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
                <template slot-scope="scope">
                  <span>{{ scope.row.cType }}</span>
                </template>
              </el-table-column>
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
            :title="$translateTitle('product.publicagreementlibrary')"
            :visible.sync="dialogTableVisible"
            :close-on-click-modal="false"
            width="50%"
          >
            <el-table
              :data="gridData"
              style="width: 100%; margin-top: 20px; text-align: center"
            >
              <el-table-column
                :label="$translateTitle('product.protocolname')"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.data.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('plugins.version')"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.data.version }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.describe')"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.data.desc }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="创建时间" align="center"> -->
              <el-table-column
                :label="$translateTitle('equipment.createdAt')"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ utc2beijing(scope.row.createdAt) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.operation')"
                align="center"
                width="200"
              >
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click.native="editordata(scope.row)"
                  >
                    {{ $translateTitle('product.clone') }}
                  </el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    @click.native="deletedata(scope.row.objectId)"
                  >
                    {{ $translateTitle('developer.delete') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="elpagination" style="padding: 20px 0">
              <el-pagination
                :page-sizes="[10, 20, 30, 50]"
                :page-size="decoderlength"
                :total="decodertotal"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="decoderSizeChange"
                @current-change="devicerCurrentChange"
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
            ><textarea class="ace_text-input"/></pre>
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
            ><textarea class="ace_text-input"/></pre>
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
                <el-button type="primary" size="small" @click.native="showAllChannel">
                  {{ $translateTitle('developer.createchannel') }}
                </el-button>
              </div>
            </vab-query-form-left-panel>
            <vab-query-form-right-panel>
              <vab-help
                trigger="click"
                src="https://tech.iotn2n.com/w/docs/details?id=6"
                title="产品下的所有设备都会继承该产品的 Topic 类"
              />
            </vab-query-form-right-panel>
          </vab-query-form>
          <div>
            <el-table
              :data="channelData"
              :row-class-name="getChannelEnable"
              style="width: 100%"
            >
              <el-table-column
                :label="$translateTitle('developer.channelnumber')"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channelname')"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channeladdr')"
              >
                <template slot-scope="scope">
                  <span>{{ 'channel/' + scope.row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channeltype')"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 1">
                    {{ $translateTitle('developer.collectionchannel') }}
                  </span>
                  <span v-else-if="scope.row.type == 3">
                    <!-- 任务通道 -->
                    {{ $translateTitle('developer.missionchannel') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.servicetype')"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.cType }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.operation')"
                width="350"
              >
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    @click.native="deleteRelation(scope.row)"
                  >
                    {{ $translateTitle('developer.remove') }}
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click.native="subProTopic(scope.row)"
                  >
                    <!-- 订阅日志 -->
                    {{ $translateTitle('product.subscriptionlog') }}
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click.native="updatesub(scope.row)"
                  >
                    <!-- 重载配置 -->
                    {{ $translateTitle('product.overloadconfiguration') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="elpagination" style="margin-top: 20px">
              <el-pagination
                :page-sizes="[10, 20, 30, 50]"
                :page-size="channellength"
                :total="channeltotal"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="channelSizeChange"
                @current-change="channelCurrentChange"
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
                  :title="$translateTitle('developer.tipsforcustomdatamodel')"
                  placement="right"
                  width="600"
                  trigger="hover"
                  @show="questionModel"
                >
                  <pre
                    id="editorinsert"
                    class="ace_editor"
                    style="min-height: 400px"
                  ><el-input class="ace_text-input" type="textarea"/></pre>
                  <el-button
                    slot="reference"
                    type="primary"
                    size="mini"
                    icon="el-icon-question"
                  >
                    <!-- 自定义数据模型帮助 -->
                    {{ $translateTitle('developer.customizedatamodelhelp') }}
                  </el-button>
                </el-popover>
                <el-button
                  type="primary"
                  size="mini"
                  style="margin-left: 20px"
                  @click.native="resourceShowAllChannel"
                >
                  {{ $translateTitle('developer.createchannel') }}
                </el-button>
              </div>
            </vab-query-form-left-panel>
            <vab-query-form-right-panel>
              <vab-help
                trigger="manual"
                src="https://tech.iotn2n.com/w/docs/details?id=6"
                title="产品下的所有设备都会继承该产品的 Topic 类"
              />
            </vab-query-form-right-panel>
          </vab-query-form>

          <div>
            <el-table
              :data="resourcechannelData"
              :row-class-name="getChannelEnable"
              style="width: 100%"
            >
              <el-table-column
                :label="$translateTitle('developer.channelnumber')"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channelname')"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channeladdr')"
              >
                <template slot-scope="scope">
                  <span>{{ 'channel/' + scope.row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.channeltype')"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 1">
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
                <template slot-scope="scope">
                  <span>{{ scope.row.cType }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.operation')"
                width="350"
              >
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    @click.native="deleteRelation(scope.row)"
                  >
                    {{ $translateTitle('developer.remove') }}
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click.native="subProTopic(scope.row)"
                  >
                    <!-- 订阅日志 -->
                    {{ $translateTitle('product.subscriptionlog') }}
                  </el-button>

                  <el-button
                    type="primary"
                    size="mini"
                    @click.native="customize(scope.row)"
                  >
                    <!-- 自定义模型 -->
                    {{ $translateTitle('product.custommodel') }}
                  </el-button>

                  <!-- <el-button type="primary" size="mini" @click.native="customize(scope.row)">自定义模型</el-button> -->
                </template>
              </el-table-column>
            </el-table>
            <div class="elpagination" style="margin-top: 20px">
              <el-pagination
                :page-sizes="[10, 20, 30, 50]"
                :page-size="resourcelength"
                :total="resourcetotal"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="resourcechannelSizeChange"
                @current-change="resourcechannelCurrentChange"
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
                <template slot-scope="scope">
                  <span @click.native="detailRules(scope.row.id)">{{scope.row.id}}</span>
                </template>
              </el-table-column>
              <el-table-column :label=" $translateTitle('rule.TriggerEvent')" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.for.join(',')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="rawsql" align="center" label="SQL"></el-table-column>
              <el-table-column align="center" :label=" $translateTitle('rule.ResponseAction')">
                <template slot-scope="scope">
                  <span>{{actions(scope.row.actions)}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :label=" $translateTitle('developer.operation')">
                <template slot-scope="scope">
                  <el-button type="info" @click.native="detailRules(scope.row.id)" size="mini" plain>查看</el-button>
                  <el-button type="info" @click.native="deleteRule(scope.row.id)" size="mini" plain>删除</el-button>
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
      :title="$translateTitle('product.viewobjectmodel')"
      :visible.sync="schemadialogVisible"
      :close-on-click-modal="false"
    >
      <div>
        <div style="background: #ffffff">
          <label id="plug-name" />
        </div>
        <pre
          id="editor1"
          class="ace_editor"
          style="min-height: 400px"
        ><textarea class="ace_text-input" style="overflow:scroll"/></pre>
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
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
      :title="$translateTitle('equipment.addchannel')"
    >
      <div class="addchannel">
        <el-table :data="allchannelData" height="400" style="width: 100%">
          <el-table-column :label="$translateTitle('developer.channelnumber')">
            <template slot-scope="scope">
              <span>{{ scope.row.objectId }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.channelname')">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.channeladdr')">
            <template slot-scope="scope">
              <span>{{ 'channel/' + scope.row.objectId }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.channeltype')">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">
                {{ $translateTitle('developer.collectionchannel') }}
              </span>
              <span v-else-if="scope.row.type == 2">
                {{ $translateTitle('developer.resourcechannel') }}
              </span>
              <span v-else>
                <!-- 任务通道 -->
                {{ $translateTitle('developer.missionchannel') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.servicetype')">
            <template slot-scope="scope">
              <span>{{ scope.row.cType }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.operation')">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click.native="addProductChannel(scope.row.objectId)"
              >
                {{ $translateTitle('developer.add') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="elpagination" style="margin-top: 20px">
          <el-pagination
            :page-sizes="[10, 20, 30, 50]"
            :page-size="allChannellength"
            :total="allChanneltotal"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="allChannelSizeChange"
            @current-change="allChannelCurrentChange"
          />
        </div>
      </div>
    </el-dialog>
    <!---日志订阅弹窗-->
    <el-dialog
      :append-to-body="true"
      :title="channelname + '日志'"
      :visible.sync="subdialog"
      :before-close="handleCloseSubdialog"
      :close-on-click-modal="false"
      width="85%"
    >
      <div style="margin-top: 20px">
        <pre
          id="subdialog"
          class="ace_editor"
          style="width: 100%; min-height: 300px"
        >
                      <textarea class="ace_text-input" style="overflow:scroll"/>
        </pre>
      </div>

      <!-- </div> -->
      <span slot="footer" class="dialog-footer" style="height: 30px">
        <el-switch
          v-model="value4"
          style="display: inline-block; margin-right: 10px"
          active-color="#13ce66"
          inactive-color="#ff4949"
          inactive-text="自动刷新"
          @change="stopsub"
        />
        <!-- <el-button type="success" size="mini" @click.native="stopsub('start')" v-if="subaction=='start'">启动</el-button>
        <el-button type="warning" size="mini" @click.native="stopsub('stop')" v-else>停止</el-button>-->
      </span>
    </el-dialog>
    <!--资源通道关联模型-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="resourcedialogFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :before-close="closeWuDialog"
      width="90%"
      top="1vh"
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
                  ><el-input class="ace_text-input" type="textarea"/></pre>
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
                  ><el-input class="ace_text-input" type="textarea"/></pre>
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
      :visible.sync="exportDialogShow"
      :title="$translateTitle('product.export')"
      width="25%"
    >
      <!-- <p class="export-p">  <a :href="exportUrl" :download="exportNameDownload">文件下载 </a></p>       -->

      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          class="btn-right"
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
      :fullscreen="true"
      :before-close="handleCloseCollecttion"
      :visible.sync="collectionDialogVisible"
      :close-on-click-modal="false"
      :title="$translateTitle('product.viewcollectionformula')"
      width="100%"
    >
      <el-row>
        <el-col :span="6">
          <div class="diaCollLeftCls">
            <el-menu
              :default-active="activeIndex"
              class="el-menu-vertical-demo"
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
            type="card"
            closable
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
                ><textarea class="ace_text-input"/></pre>
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
