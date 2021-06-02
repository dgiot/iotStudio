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
                @click="goToDevices"
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
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!--产品信息-->
        <el-tab-pane
          :label="$translateTitle('product.productinformation')"
          name="first"
        >
          <div
            style="box-sizing: border-box; padding: 10px; background: #ffffff"
          >
            <!-- 导出 -->
            <div
              class="addtopic"
              style="margin-bottom: 10px; text-align: right"
            >
              <el-button type="primary" size="small" @click="exportProduct">
                {{ $translateTitle('product.exportpro') }}
              </el-button>
            </div>

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
            <div
              class="addtopic"
              style="margin-bottom: 10px; text-align: right"
            >
              <el-button
                type="primary"
                size="small"
                @click="topicdialogVisible = true"
              >
                {{ $translateTitle('product.customtopicclass') }}
              </el-button>
            </div>
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
                    @click="updatetopic(scope.row, scope.$index)"
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
                  <!--                      @click="-->
                  <!--                        scope._self.$refs[`popover-${scope.$index}`].doClose()-->
                  <!--                      "-->
                  <!--                    >-->
                  <!--                      {{  $translateTitle("developer.cancel") }}</el-button-->
                  <!--                      >-->
                  <!--                    <el-button-->
                  <!--                      type="primary"-->
                  <!--                      size="mini"-->
                  <!--                      @click="deletetopic(scope, scope.$index)"-->
                  <!--                    >-->
                  <!--                      {{  $translateTitle("developer.determine") }}</el-button-->
                  <!--                      >-->
                  <!--                  </div>-->
                  <el-button
                    v-if="!scope.row.isdef"
                    slot="reference"
                    type="danger"
                    size="mini"
                    @click="deletetopic(scope, scope.$index)"
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
              <el-button @click="topicdialogVisible = false">
                {{ $translateTitle('developer.cancel') }}
              </el-button>
              <el-button
                type="primary"
                @click="subTopic('topicform', topicform.isupdated)"
              >
                {{ $translateTitle('developer.determine') }}
              </el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
        <!--功能定义-->
        <el-tab-pane
          :label="$translateTitle('product.physicalmodel')"
          name="third"
        >
          <div style="text-align: right">
            <el-button type="primary" size="small" @click="checkAddTest">
              <!-- 物模型采集公式 -->
              {{ $translateTitle('product.collectionformulaofobjectmodel') }}
            </el-button>
            <el-button type="primary" size="small" @click="checkschema">
              {{ $translateTitle('product.viewobjectmodel') }}
            </el-button>

            <!-- 新增自定义属性 -->
            <el-button type="primary" size="small" @click="createProperty">
              {{ $translateTitle('product.newcustomattribute') }}
            </el-button>
            <!-- 新建标准属性 -->
            <el-button type="primary" size="small" @click="addcategory">
              {{ $translateTitle('product.newstandardattribute') }}
            </el-button>
          </div>
          <div>
            <el-table
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
                      <span>{{ $translateTitle('product.attribute') }}</span>
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
                :label="$translateTitle('product.identifier')"
                prop="identifier"
              />
              <el-table-column
                :label="$translateTitle('product.functionaltypes')"
              >
                <span>{{ $translateTitle('product.attribute') }}</span>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('product.functionname')"
                prop="name"
              />
              <el-table-column :label="$translateTitle('product.datatype')">
                <template slot-scope="scope">
                  <span>{{ scope.row.dataType.type }}</span>
                </template>
              </el-table-column>
              <el-table-column
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
              <el-table-column :label="$translateTitle('developer.operation')">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="deletewmx(scope.$index)"
                  >
                    {{ $translateTitle('developer.delete') }}
                  </el-button>

                  <el-button
                    type="primary"
                    size="mini"
                    @click="wmxDataFill(scope.row, scope.$index)"
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
          </div>
          <!--取物模型模板-->
          <el-dialog
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
                <el-button type="primary" size="mini" @click="getPropData(0)">
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
                        @click="addProCategory(scope.row)"
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
              <el-button size="mini" @click="originwmx = false">
                {{ $translateTitle('developer.cancel') }}
              </el-button>
              <el-button type="primary" size="mini" @click="originwmx = false">
                {{ $translateTitle('developer.determine') }}
              </el-button>
            </span>
          </el-dialog>
          <!--添加物模型弹窗-->
          <el-dialog
            :title="wmxSituation + '自定义属性'"
            :visible.sync="wmxdialogVisible"
            :before-close="wmxhandleClose"
            :close-on-click-modal="false"
            width="60%"
            top="5vh"
          >
            <wmxdetail
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
                    @click="addDomain1"
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
              <el-button @click="structdialog = false">
                {{ $translateTitle('developer.cancel') }}
              </el-button>
              <el-button type="primary" @click="submitStruct('structform')">
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
                  @click="subAce('formInline', true)"
                >
                  {{ $translateTitle('product.preservation') }}
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="subAce1('formInline')"
                >
                  <!-- 设为公共 -->
                  {{ $translateTitle('product.setaspublic') }}
                </el-button>
                <el-button type="primary" size="small" @click="chaxun">
                  {{ $translateTitle('product.publicagreementlibrary') }}
                </el-button>
              </el-form-item>
              <el-form-item style="display: block">
                <el-button type="primary" size="small" @click="protol">
                  {{ $translateTitle('product.compile') }}
                </el-button>
                <el-button type="success" size="small" @click="updatesubdialog">
                  <!-- 热加载 -->
                  {{ $translateTitle('product.thermalloading') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <!--通道热加载-->
          <!-- <el-dialog
            :visible.sync="protoldialog"
            :close-on-click-modal="false"
            title="通道热加载"
            width="50%"
          > -->
          <el-dialog
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
              <el-button type="primary" @click="updateAllChannel">
                <!-- 确定 -->
                {{ $translateTitle('developer.determine') }}
              </el-button>
            </div>
          </el-dialog>
          <!--公共协议库弹窗-->
          <el-dialog
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
                    @click="editordata(scope.row)"
                  >
                    {{ $translateTitle('product.clone') }}
                  </el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    @click="deletedata(scope.row.objectId)"
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
              <label id="plug-name" />
            </div>
            <pre
              id="editor"
              class="ace_editor ace-monokai ace_dark"
              style="min-height: 600px; margin-bottom: 0"
            ><textarea class="ace_text-input" /></pre>
            <div style="background: #ffffff">
              <label id="plug-name" />
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
          <div class="productchannel" style="padding: 10px; text-align: right">
            <el-button type="primary" size="small" @click="showAllChannel">
              {{ $translateTitle('developer.createchannel') }}
            </el-button>
          </div>
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
                    @click="deleteRelation(scope.row)"
                  >
                    {{ $translateTitle('developer.remove') }}
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="subProTopic(scope.row)"
                  >
                    <!-- 订阅日志 -->
                    {{ $translateTitle('product.subscriptionlog') }}
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="updatesub(scope.row)"
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
          <div class="productchannel" style="padding: 10px; text-align: right">
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
              ><el-input class="ace_text-input" type="textarea" /></pre>
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
              size="small"
              @click="resourceShowAllChannel"
            >
              {{ $translateTitle('developer.createchannel') }}
            </el-button>
          </div>
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
                    @click="deleteRelation(scope.row)"
                  >
                    {{ $translateTitle('developer.remove') }}
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="subProTopic(scope.row)"
                  >
                    <!-- 订阅日志 -->
                    {{ $translateTitle('product.subscriptionlog') }}
                  </el-button>

                  <el-button
                    type="primary"
                    size="mini"
                    @click="customize(scope.row)"
                  >
                    <!-- 自定义模型 -->
                    {{ $translateTitle('product.custommodel') }}
                  </el-button>

                  <!-- <el-button type="primary" size="mini" @click="customize(scope.row)">自定义模型</el-button> -->
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
                @click="addEngine"
              >{{ $translateTitle('developer.add')}}</el-button>
            </div>
            <el-table
              :data="engineData"
              style="width: 100%;text-align:center"
              :cell-class-name="getRowindex"
            >
              <el-table-column label="ID" align="center" width="180">
                <template slot-scope="scope">
                  <span @click="detailRules(scope.row.id)">{{scope.row.id}}</span>
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
                  <el-button type="info" @click="detailRules(scope.row.id)" size="mini" plain>查看</el-button>
                  <el-button type="info" @click="deleteRule(scope.row.id)" size="mini" plain>删除</el-button>
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
              <el-button type="primary" size="small" @click="testgraphql">测试</el-button>
            </div>
            <pre id="editor5" class="ace_editor" style="min-height:300px;width:100%">
              <textarea class="ace_text-input"></textarea>
            </pre>
        </div>-->
        <!-- </el-tab-pane> -->
      </el-tabs>
    </div>

    <!--物模型-->
    <el-dialog
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
        ><textarea class="ace_text-input" style="overflow:scroll" /></pre>
      </div>
      <span slot="footer" class="dialog-footer" style="height: 30px">
        <el-button type="primary" @click="preserve">
          <!-- 更新 -->
          {{ $translateTitle('equipment.update') }}
        </el-button>
      </span>
    </el-dialog>
    <!--通道弹窗-->
    <!-- <el-dialog
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
      title="添加通道"
      append-to-body
    > -->
    <el-dialog
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
      :title="$translateTitle('equipment.addchannel')"
      append-to-body
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
                @click="addProductChannel(scope.row.objectId)"
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
                      <textarea class="ace_text-input" style="overflow:scroll" />
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
        <!-- <el-button type="success" size="mini" @click="stopsub('start')" v-if="subaction=='start'">启动</el-button>
        <el-button type="warning" size="mini" @click="stopsub('stop')" v-else>停止</el-button>-->
      </span>
    </el-dialog>
    <!--资源通道关联模型-->
    <el-dialog
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
                  ><el-input class="ace_text-input" type="textarea" /></pre>
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
                  ><el-input class="ace_text-input" type="textarea" /></pre>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeWuDialog">
          <!-- 退 出 -->
          {{ $translateTitle('product.quit') }}
        </el-button>
        <el-button type="primary" @click="addData">
          <!-- 保 存 -->
          {{ $translateTitle('product.preservation') }}
        </el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :visible.sync="exportDialogShow" title="导出" width="25%"> -->
    <el-dialog
      :visible.sync="exportDialogShow"
      :title="$translateTitle('product.export')"
      width="25%"
    >
      <!-- <p class="export-p">  <a :href="exportUrl" :download="exportNameDownload">文件下载 </a></p>       -->

      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          class="btn-right"
          @click="exportDialogShow = false"
        >
          <!-- 关闭 -->
          {{ $translateTitle('tagsView.close') }}
        </el-button>
      </div>
    </el-dialog>

    <!--物模型采集公式按钮-->
    <!-- <el-dialog
      :fullscreen="true"
      :before-close="handleCloseCollecttion"
      :visible.sync="collectionDialogVisible"
      :close-on-click-modal="false"
      title="查看采集公式"
      width="100%"
    > -->
    <el-dialog
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
                  @click="menuTabClick(item, index)"
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
                  <el-button type="info" @click="onReductionTap(index)">
                    <!-- 还原 -->
                    {{ $translateTitle('product.reduction') }}
                  </el-button>
                  <el-button type="primary" @click="onSaveTap(index)">
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
<script>
  import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'

  import { getDeviceCountByProduct } from '@/api/Device/index'
  import { queryProduct } from '@/api/Product/index'
  import { getAllunit, getDictCount } from '@/api/Dict/index'
  import { getChannelCountByProduct, saveChanne } from '@/api/Channel/index'
  import { getRule } from '@/api/Rules'
  var editor
  var editor1
  var editor2
  var subdialog
  var editormodel
  var editorcreate
  var editorinsert
  var channelrow = {}
  const Base64 = require('js-base64').Base64
  var setdata = ''
  var isallchannel = false
  var isupdatetrue = ''
  import { Compile, subupadte } from '@/api/System/index'
  import { setTimeout } from 'timers'
  import { Websocket } from '@/utils/wxscoket.js'
  import wmxdetail from './component/wmxdetail'
  import { returnLogin } from '@/utils/return'
  export default {
    components: {
      wmxdetail,
    },
    data() {
      var validCode = (rule, value, callback) => {
        const reg = /[0-9a-zA-Z]/
        if (!reg.test(value)) {
          callback(new Error('协议名称由数字和字母组合'))
        } else {
          callback()
        }
      }
      var validminnumber = (rule, value, callback) => {
        // console.log(value);
        if (value === '') {
          callback(new Error('最小值不能为空'))
        } else {
          //   if(value<0){
          //   callback(new Error('最小值不能小于0'))
          // }else{
          if (this.sizeForm.endnumber !== '') {
            if (value >= this.sizeForm.endnumber) {
              callback(new Error('最小值小于最大值'))
            } else {
              callback()
            }
          }
          // }
        }
      }
      var validmaxnumber = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('最大值不能为空'))
        } else {
          if (this.sizeForm.startnumber !== '') {
            if (value <= this.sizeForm.startnumber) {
              callback(new Error('最大值必须大于最小值'))
            } else {
              callback()
            }
          }
          // }
        }
      }
      var vailspecs = (rule, value, callback) => {
        if (value < 0) {
          callback(new Error('步长大于0'))
        } else if (
          value >=
          this.sizeForm.endnumber - this.sizeForm.startnumber
        ) {
          callback(new Error('步长必须小于最大值和最小值的差值'))
        } else {
          callback()
        }
      }
      var validstructminnumber = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('最小值不能为空'))
        } else {
          //   if(value<0){
          //   callback(new Error('最小值不能小于0'))
          // }else{
          if (this.structform.endnumber !== '') {
            if (value >= this.structform.endnumber) {
              callback(new Error('最小值小于最大值'))
            } else {
              callback()
            }
            // }
          }
        }
      }
      var validstructmaxnumber = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('最大值不能为空'))
        } else {
          // if(value<0){
          //   callback(new Error('最大值不能小于0'))
          // }else{
          if (this.structform.startnumber !== '') {
            if (value <= this.structform.startnumber) {
              callback(new Error('最大值必须大于最小值'))
            } else {
              callback()
            }
          }
          // }
        }
      }
      var vailstructspecs = (rule, value, callback) => {
        if (value < 0) {
          callback(new Error('步长大于0'))
        } else if (
          value >=
          this.structform.endnumber - this.structform.startnumber
        ) {
          callback(new Error('步长必须小于最大值和最小值的差值'))
        } else {
          callback()
        }
      }
      return {
        options: [
          { value: 'first', label: '第一轮' },
          { value: 'last', label: '最后一轮' },
          { value: 'all', label: '全部' },
        ],
        activeIndex: '',
        editableTabsValue: '1',
        editableTabs: [],
        tabIndex: 1,
        sizeOption: [
          {
            label: '20',
            val: '20',
          },
          {
            label: '不采集(计算值)',
            val: '计算值',
          },
          {
            label: '不采集(主动上报)',
            val: '主动上报',
          },
        ],
        // topic数据
        showList: false,
        collapseName: ['1', '2', '3', '4'],
        multipleSelection: [],
        protolchannel: [],
        protoldialog: false,
        productimg: '',
        topicdialogVisible: false,
        topicform: {
          topic: '',
          type: '',
          desc: '',
          isupdated: -1,
        },
        exportDialogShow: false,
        exportUrl: '',
        exportName: '',
        decodertotal: 0,
        decoderstart: 0,
        leftItemPos: 0,
        ed3isShow: false,
        rightCollection: '',
        decoderlength: 10,
        topicrule: {
          topic: [
            {
              required: true,
              message: '请输入Topic类',
              trigger: 'blur',
            },
          ],
          type: [
            {
              required: true,
              message: '请选择Topic权限',
              trigger: 'change',
            },
          ],
        },
        topicstart: 1,
        topiclength: 10,
        topictotal: 0,
        // 服务通道数据
        channelData: [],
        allchannelData: [],
        innerVisible: false,
        allChannelstart: 0,
        allChannellength: 10,
        allChanneltotal: 0,
        // 物模型数据
        category: [],
        current: 0,
        schemadialogVisible: false,
        collectionDialogVisible: false,
        PropData: [],
        originwmx: false,
        wmxdialogVisible: false,
        wmxSituation: '新增',
        // 自定义物模型
        allunit: [],
        sizerule: {
          step: [
            {
              required: true,
              trigger: 'blur',
              validator: vailspecs,
            },
          ],
          string: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入数据长度',
            },
            {
              type: 'number',
              message: '数据长度必须为数字',
            },
          ],
          startnumber: [
            {
              validator: validminnumber,
              required: true,
              trigger: 'blur',
            },
          ],
          endnumber: [
            {
              validator: validmaxnumber,
              required: true,
              trigger: 'blur',
            },
          ],
          resource: [
            {
              required: true,
              message: '请选择功能类型',
              trigger: 'change',
            },
          ],
          true: [
            {
              required: true,
              message: '请输入属性值',
              trigger: 'blur',
            },
          ],
          false: [
            {
              required: true,
              message: '请输入属性值',
              trigger: 'blur',
            },
          ],
          name: [
            {
              required: true,
              message: '请输入属性名称',
              trigger: 'blur',
            },
          ],
          identifier: [
            {
              required: true,
              message: '请输入标识符',
              trigger: 'blur',
            },
          ],
          dis: [
            {
              required: true,
              message: '请输入数据标识',
              trigger: 'blur',
            },
          ],
          type: [
            {
              required: true,
              message: '请选择数据类型',
              trigger: 'change',
            },
          ],
          attribute: [
            {
              required: true,
              message: '请输入属性',
              trigger: 'blur',
            },
          ],
          attributevalue: [
            {
              required: true,
              message: '请输入属性值',
              trigger: 'blur',
            },
          ],
          isread: [
            {
              required: true,
              message: '请选择读写类型',
              trigger: 'change',
            },
          ],
        },
        // 结构体判断规则
        structrule: {
          string: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入数据长度',
            },
            {
              type: 'number',
              message: '数据长度必须为数字',
            },
          ],
          step: [
            {
              required: true,
              trigger: 'blur',
              validator: vailstructspecs,
            },
          ],
          startnumber: [
            {
              validator: validstructminnumber,
              required: true,
              trigger: 'blur',
            },
          ],
          endnumber: [
            {
              validator: validstructmaxnumber,
              required: true,
              trigger: 'blur',
            },
          ],
          resource: [
            {
              required: true,
              message: '请选择功能类型',
              trigger: 'change',
            },
          ],
          true: [
            {
              required: true,
              message: '请输入属性值',
              trigger: 'blur',
            },
          ],
          false: [
            {
              required: true,
              message: '请输入属性值',
              trigger: 'blur',
            },
          ],
          name: [
            {
              required: true,
              message: '请输入属性名称',
              trigger: 'blur',
            },
          ],
          identifier: [
            {
              required: true,
              message: '请输入标识符',
              trigger: 'blur',
            },
          ],
          dis: [
            {
              required: true,
              message: '请输入数据标识',
              trigger: 'blur',
            },
          ],
          type: [
            {
              required: true,
              message: '请选择数据类型',
              trigger: 'change',
            },
          ],
          attribute: [
            {
              required: true,
              message: '请输入属性',
              trigger: 'blur',
            },
          ],
          attributevalue: [
            {
              required: true,
              message: '请输入属性值',
              trigger: 'blur',
            },
          ],
          isread: [
            {
              required: true,
              message: '请选择读写类型',
              trigger: 'change',
            },
          ],
        },
        structdialog: false,
        structform: {
          resource: 1,
          identifier: '',
          type: 'INT',
          startnumber: '',
          endnumber: '',
          step: '',
          true: '',
          truevalue: 1,
          false: '',
          falsevalue: 0,
          isread: 'r',
          unit: '',
          date: 'String类型的UTC时间戳 (毫秒)',
          string: '',
          specs: [],
          dis: 'Edit-24',
          dinumber: '528590',
        },
        tableData: [],
        activeName: 'first',
        form: {
          Productname: '',
          ProductKey: '',
          ProductAll: 0,
        },
        ProductSecret: '',
        dynamicReg: false,
        productId: '',
        productName: '',
        productdetail: {},
        topicData: [],
        topic: [
          {
            topic: 'thing/${ProductId}/${DevAddr}/post',
            type: 'pub',
            desc: '设备上报',
            isdef: true,
          },
          {
            topic: 'thing/${ProductId}/${DevAddr}',
            type: 'sub',
            desc: '消息下发',
            isdef: true,
          },
        ],
        isshow: false,
        addRules: {
          name: [
            {
              required: true,
              message: '请输入协议名称',
              trigger: 'blur',
            },
            {
              validator: validCode,
              trigger: 'blur',
            },
          ],
        },
        dialogTableVisible: false,
        gridData: [],
        formInline: {
          name: '',
          version: '',
          desc: '',
          resource: false,
        },
        objectId: '',
        option: [],
        CategoryKey: '',
        productstart: 0,
        productlength: 10,
        producttotal: 0,
        wmxstart: 1,
        wmxPageSize: 10,
        wmxtotal: 20,
        wmxData: [],
        editorList: [],

        warningeditror: [],
        channellength: 10,
        channelstart: 0,
        channeltotal: 0,
        isupdatedstruct: -1,
        issub: false,
        subtimer: null,
        subdialog: false,
        textarea: '',
        subdialogtimer: null,
        subdialogid: '',
        subaction: 'stop',
        channelname: '',
        value4: true,
        // 规则配置
        rulepagesize: 10,
        rulestart: 0,
        ruletotal: 0,
        engineData: [],
        // 物存储型式
        channeltype: 0,
        resourcechannelData: [],
        resourcestart: 0,
        resourcelength: 10,
        resourcetotal: 0,
        // 自定义模型模板
        resourcedialogFormVisible: false,
        resourceform: {},
        resourcechannelid: '',
        isreload: 1,
        modifyIndex: -1,
      }
    },
    computed: {
      treeData() {
        const cloneData = JSON.parse(JSON.stringify(this.option)) // 对源数据深度克隆
        // console.log("cloneData", cloneData)
        return cloneData.filter((father) => {
          const branchArr = cloneData.filter(
            (child) => father.id == child.parentid
          ) // 返回每一项的子级数组
          branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
          return father.parentid == 0 // 返回第一层
        })
      },
      showNewItem() {
        if (this.sizeForm && this.sizeForm.protocol == 'modbus') {
          return true
        } else {
          return false
        }
      },
      ...mapGetters({
        sizeForm: 'konva/sizeForm',
      }),
    },
    watch: {
      issub: {
        deep: true,
        handler(val) {
          this.subtimer = window.setInterval(() => {
            this.subAce('formInline', false)
          }, 5000)
        },
      },
    },
    mounted() {
      // editor编辑器使用
      editor2 = ace.edit('editor2')
      editor2.session.setMode('ace/mode/text') // 设置语言
      editor2.setTheme('ace/theme/monokai') // 设置主题
      editor2.setReadOnly(true)
      editor2.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true, // 设置自动提示
      })

      this.Industry()
      this.getAllunit()

      if (this.$route.query.activeName) {
        this.activeName = this.$route.query.activeName
      }
    },
    beforeDestroy() {
      window.clearInterval(this.subtimer)
      this.subtimer = null
      window.clearInterval(this.subdialogtimer)
      this.subdialogtimer = null
    },
    methods: {
      ...mapMutations({
        setSizeForm: 'konva/setSizeForm',
      }),
      selectStruct(v) {
        // console.log(v);
      },
      toggleList() {
        this.showList = !this.showList
      },
      getFormOrginalData() {
        return {
          strategy: '20',
          resource: 1,
          identifier: '',
          dis: 'Edit-24',
          dinumber: '528590',
          type: 'int',
          startnumber: '',
          endnumber: '',
          step: '',
          true: '',
          truevalue: 1,
          false: '',
          falsevalue: 0,
          isread: 'r',
          unit: '',
          string: '',
          date: 'String类型的UTC时间戳 (毫秒)',
          specs: {},
          round: 'all',
          struct: [
            {
              attribute: '',
              attributevalue: '',
            },
          ],
          rate: 1,
          offset: 0,
          byteorder: 'big',
          protocol: 'normal',
          operatetype: 'holdingRegister',
          originaltype: 'int16',
          slaveid: 256,
          collection: '%s',
          control: '%d',
          nobound: [],
        }
      },
      changeValue(formName) {
        this.$refs[formName].validateField('startnumber', (errMsg) => {
          if (errMsg) {
            return false
          } else {
          }
        })
      },
      changeStructValue(formName) {
        this.$refs[formName].validateField('startnumber', (errMsg) => {
          if (errMsg) {
            return false
          } else {
          }
        })
      },
      // 判断是否为结构体，可展开
      getRowClass(row, rowIndex) {
        if (row.row.dataType.type != 'struct') {
          // 判断当前行是否有子数据
          return 'row-expand-cover'
        }
      },
      getChannelEnable(row, rowIndex) {
        if (row.row.isEnable == true) {
          return 'green_active'
        } else {
          return 'red_active'
        }
      },
      handleClick(val) {
        if (val.name == 'fourth') {
          // this.$router.push({
          //   path: '/roles/thingsParse',
          //   query: {
          //     id: this.$route.query.id
          //   }
          // })
        } else if (val.name == 'fiveth') {
          this.getProductChannel()
        } else if (val.name == 'second') {
          this.getTopic()
        } else if (val.name == 'seven') {
          this.getResourceChannel()
        } else if (val.name == 'sixeth') {
          this.orginRule()
        } else if (val.name == 'eighth') {
          this.isreload++
        } else if (val.name != 'fourth') {
          window.clearInterval(this.subtimer)
          this.subtimer = null
        }
      },
      async getAllunit() {
        this.allunit = []
        const { results } = await getAllunit('unit', 200)
        this.allunit = results.concat([])
        this.allunit.unshift({
          data: {
            Name: '无',
            Symbol: '',
          },
        })
      },
      getTopic() {
        this.$get_object('Product', this.productId)
          .then((resultes) => {
            if (resultes) {
              this.topicData = resultes.topics.concat(this.topic)
            }
          })
          .catch((err) => {
            this.$baseMessage('请求出错', err.error, 3000)
          })
      },
      async exportProduct() {
        const params = {
          name: this.productName,
        }
        const res = await queryProduct(params)
        if (res) {
          window.open(
            window.location.origin + '/product?name=' + this.productName,
            '_blank'
          )
        }
      },
      // 热加载弹窗
      async updatesubdialog() {
        this.protoldialog = true
        const type = '1'
        const product = {
          __type: 'Pointer',
          className: 'Product',
          objectId: this.productId,
        }
        getChannelCountByProduct(
          this.channellength,
          this.channelstart,
          product,
          type
        )
          .then((res) => {
            this.protolchannel = res.results
            this.$refs.multipleTable.toggleAllSelection()
          })
          .catch((err) => {
            console.log(err)
            this.$baseMessage('请求出错', err.error, 3000)
          })
      },
      // 通道全选
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      updateAllChannel() {
        if (this.multipleSelection.length == 0) {
          this.protoldialog = false
        } else {
          var arr = []
          this.multipleSelection.map((item) => {
            arr.push(
              new Promise((reslove, reject) => {
                return subupadte(item.objectId, 'update')
                  .then((resultes) => {
                    if (resultes) {
                      reslove(resultes)
                    }
                  })
                  .catch((error) => {
                    reject(error)
                  })
              })
            )
          })
          Promise.all(arr)
            .then((data) => {
              this.$message({
                message: '热加载成功',
                type: 'success',
              })
              if (data.length == this.multipleSelection.length) {
                this.protoldialog = false
              }
            })
            .catch((error) => {
              this.$message({
                message: error,
                type: 'error',
              })
            })
        }
      },

      // 物接入选择通道
      showAllChannel() {
        this.allChanneltotal = 0
        this.allchannelData = []
        this.channeltype = 1
        this.innerVisible = true
        const type = { $in: ['1', '3'] }
        const product = {
          $ne: {
            __type: 'Pointer',
            className: 'Product',
            objectId: this.productId,
          },
        }
        getChannelCountByProduct(
          this.channellength,
          this.channelstart,
          product,
          type
        )
          .then((res) => {
            this.allChanneltotal = res.count
            this.allchannelData = res.results
          })
          .catch((e) => {
            console.log(e)
          })
      },
      // 物接入
      getProductChannel() {
        const type = { $in: ['1', '3'] }
        const product = {
          __type: 'Pointer',
          className: 'Product',
          objectId: this.productId,
        }
        getChannelCountByProduct(
          this.channellength,
          this.channelstart,
          product,
          type
        )
          .then((res) => {
            this.channeltotal = res.count
            this.channelData = res.results
            if (res.results.length == 0) {
              isallchannel = true
            } else {
              isallchannel = false
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },

      // 物存储选择通道
      resourceShowAllChannel() {
        this.allChanneltotal = 0
        this.allchannelData = []
        this.channeltype = 0
        this.innerVisible = true
        const type = { $in: ['2'] }
        const product = {
          $ne: {
            __type: 'Pointer',
            className: 'Product',
            objectId: this.productId,
          },
        }
        getChannelCountByProduct(
          this.channellength,
          this.channelstart,
          product,
          type
        )
          .then((res) => {
            this.allChanneltotal = res.count
            this.allchannelData = res.results
          })
          .catch((e) => {
            console.log(e)
          })
      },

      // 物存储
      getResourceChannel() {
        const type = { $in: ['2'] }
        const product = {
          __type: 'Pointer',
          className: 'Product',
          objectId: this.productId,
        }
        getChannelCountByProduct(
          this.channellength,
          this.channelstart,
          product,
          type
        )
          .then((res) => {
            this.resourcetotal = res.count
            this.resourcechannelData = res.results
          })
          .catch((e) => {
            console.log(e)
          })
      },

      // 添加关联
      async addProductChannel(id) {
        const params = {
          product: {
            __op: 'AddRelation',
            objects: [
              {
                __type: 'Pointer',
                className: 'Product',
                objectId: this.productId,
              },
            ],
          },
        }
        const res = await saveChanne(id, params)
        if (res) {
          this.$message({
            type: 'success',
            message: '添加成功',
          })
          if (this.channeltype == 1) {
            this.showAllChannel()
            this.getProductChannel()
          } else {
            this.resourceShowAllChannel()
            this.getResourceChannel()
          }
        }
      },
      // 移除通道
      deleteRelation(row) {
        const params = {
          product: {
            __op: 'RemoveRelation',
            objects: [
              {
                __type: 'Pointer',
                className: 'Product',
                objectId: this.productId,
              },
            ],
          },
        }
        saveChanne(row.objectId, params).then((res) => {
          if (res) {
            this.$message({
              type: 'success',
              message: '移除成功',
            })
          }
          this.getProductChannel()
          this.getResourceChannel()
        })
      },
      // 关联服务通道分页
      channelSizeChange(val) {
        this.channellength = val
        this.getProductChannel()
      },
      channelCurrentChange(val) {
        this.channelstart = (val - 1) * this.channellength
        this.getProductChannel()
      },
      // 资源通道关联
      resourcechannelSizeChange(val) {
        this.resourcelength = val
        this.getResourceChannel()
      },
      resourcechannelCurrentChange(val) {
        this.resourcestart = (val - 1) * this.resourcelength
        this.getResourceChannel()
      },

      allChannelSizeChange(val) {
        this.allChannellength = val
        this.showAllChannel()
      },
      allChannelCurrentChange(val) {
        this.allChannelstart = (val - 1) * this.allChannellength
        this.showAllChannel()
      },

      // 自定义模型弹窗
      customize(row) {
        this.resourcedialogFormVisible = true
        this.resourcechannelid = row.objectId
        // for (var key in row.config) {
        //   channelrow[key] = row.config[key];
        // }
        channelrow = JSON.parse(JSON.stringify(row.config))
        // console.log(row,channelrow)
        setTimeout(() => {
          editormodel = ace.edit('editormodel')
          editormodel.session.setMode('ace/mode/json') // 设置语言
          editormodel.setTheme('ace/theme/twilight') // 设置主题
          editormodel.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true, // 设置自动提示
          })
          editormodel.setReadOnly(true)
          editormodel.setValue(
            JSON.stringify(this.productdetail.thing, null, 4)
          )
          // 物建表
          editorcreate = ace.edit('editorcreate')
          editorcreate.session.setMode('ace/mode/mysql') // 设置语言
          editorcreate.setTheme('ace/theme/twilight') // 设置主题
          editorcreate.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true, // 设置自动提示
          })
          if (row.config.datamodel && row.config.datamodel != '') {
            editorcreate.setValue(row.config.datamodel)
          } else {
            editorcreate.setValue(`{
            "vars":{
              "database":"aosong",
              "stable":"meter",
              "value":[
                {
                  "timestamp":"TIMESTAMP",
                  "bytes":8
                },
                {
                  "temperature":"FLOAT",
                  "bytes":4
                },
                {
                  "humidity":"FLOAT",
                  "bytes":4
                }
              ],
              "tags":[
                {
                  "devaddr":"BINARY",
                  "bytes":12
                }
              ],
              "table":"devaddr",
              "keep":3650
            },
            "sql":{
              "create_database":"CREATE DATABASE IF NOT EXISTS \${database} KEEP \${keep}",
              "drop_database":"DROP DATABASE IF EXISTS \${database}",
              "creat_stable":"CREATE TABLE IF NOT EXISTS \${database}.\${stable} (\${timestamp} TIMESTAMP, temperature FLOAT, humidity FLOAT) TAGS(devaddr BINARY[12]);",
              "drop_stable":"DROP TABLE \${database}.\${stable}",
              "insert_stable":"INSERT INTO \${database}.\${table} USING \${database}.\${stable} TAGS (\${devaddr}) VALUES (\${temperature}, \${humidity})",
              "insert_table":"INSERT INTO \${database}.\${table} VALUES (\${temperature}, \${humidity})",
              "create_table":"CREATE TABLE \${databas}.\${table} USING \${database}.\${stable} TAGS (\${devaddr});"
            }
          }`)
          }
          // 物存储

          // 子表
          //   editorsubtable = ace.edit("editorsubtable");
          //   editorsubtable.session.setMode("ace/mode/mysql"); // 设置语言
          //   editorsubtable.setTheme("ace/theme/gob"); // 设置主题
          //   editorsubtable.setOptions({
          //     enableBasicAutocompletion: true,
          //     enableSnippets: true,
          //     enableLiveAutocompletion: true // 设置自动提示
          //   });
          //   if(row.config.subtable){
          //     editorsubtable.setValue(row.config.subtable)
          //   }else{
          //     editorsubtable.setValue('')
          //   }
        })
      },
      questionModel() {
        setTimeout(() => {
          editorinsert = ace.edit('editorinsert')
          editorinsert.session.setMode('ace/mode/mysql') // 设置语言
          editorinsert.setTheme('ace/theme/gob') // 设置主题
          editorinsert.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true, // 设置自动提示
          })
          editorinsert.setValue(`{
          "vars":{
            "database":"database",
            "table":"stable",
            "value":[
              {
                "timestamp":"TIMESTAMP",
                "bytes":8
              },
              {
                "int":"INT",
                "bytes":4
              },
              {
                "bigint":"BIGINT",
                "bytes":8
              },
              {
                "float":"FLOAT",
                "bytes":4
              },
              {
                "double":"DOUBLE",
                "bytes":8
              },
              {
                "binary":"BINARY",
                "bytes":"自定义"
              },
              {
                "smallint":"SMALLINT",
                "bytes":2
              },
              {
                "tinyint":"TINYINT",
                "bytes":1
              },
              {
                "bool":"BOOL",
                "bytes":1
              },
              {
                "nchar":"NCHAR",
                "bytes":"自定义"
              }
            ],
            "tags":[
              {
                "int":"INT",
                "bytes":4
              },
              {
                "bigint":"BIGINT",
                "bytes":8
              },
              {
                "float":"FLOAT",
                "bytes":4
              },
              {
                "double":"DOUBLE",
                "bytes":8
              },
              {
                "binary":"BINARY",
                "bytes":"自定义"
              },
              {
                "smallint":"SMALLINT",
                "bytes":2
              },
              {
                "tinyint":"TINYINT",
                "bytes":1
              },
              {
                "bool":"BOOL",
                "bytes":1
              },
              {
                "nchar":"NCHAR",
                "bytes":"自定义"
              }
            ]
          },
          "sql":{
            "create_database":"CREATE DATABASE IF NOT EXISTS {{database}} KEEP {{keep}}",
            "drop_database":"DROP DATABASE IF EXISTS {{database}}",
            "creat_stable":"CREATE TABLE IF NOT EXISTS {{database}}.{{stable}} ({{timestamp}} TIMESTAMP, temperature FLOAT, humidity FLOAT) TAGS(devaddr BINARY[12]);",
            "drop_stable":"DROP TABLE {{database}}.{{stable}}",
            "insert_stable":"INSERT INTO {{database}}.{{table}} USING {{database}}.{{stable}} TAGS ({{devaddr}}) VALUES ({{temperature}}, {{humidity}})",
            "insert_table":"INSERT INTO {{database}}.{{table}} VALUES ({{temperature}}, {{humidity}})",
            "create_table":"CREATE TABLE {{database}}.{{table}} USING {{database}}.{{stable}} TAGS ({{devaddr}});"
          }
        }`)
        })
      },
      // 添加自定义模型
      addData() {
        // console.log(channelrow)
        channelrow.datamodel = editorcreate.getValue()
        const params = {
          config: channelrow,
        }
        this.$update_object(
          'Channel',
          this.rproductdetailesourcechannelid,
          params
        ).then(
          (response) => {
            if (response) {
              this.$message('添加成功')
            }
          },
          (error) => {
            returnLogin(error)
          }
        )
      },
      closeWuDialog() {
        this.resourcedialogFormVisible = false
        this.resourcechannelid = ''
      },
      // 删除枚举型
      removeDomain(item) {
        var index = this.sizeForm.struct.indexOf(item)
        if (index !== -1) {
          this.sizeForm.struct.splice(index, 1)
        }
      },
      addDomain() {
        this.sizeForm.struct.push({
          attribute: '',
          attributevalue: '',
        })
      },
      removeDomain1(item) {
        var index = this.structform.specs.indexOf(item)
        if (index !== -1) {
          this.structform.specs.splice(index, 1)
        }
      },
      addDomain1() {
        this.structform.specs.push({
          value: '',
          name: '',
        })
      },
      // 物模型提交
      submitForm(sizeForm) {
        var obj = {
          name: sizeForm.name,
          dataForm: {
            round: sizeForm.round,
            order: sizeForm.order,
            data: sizeForm.dinumber,
            address: sizeForm.dis,
            quantity: sizeForm.dinumber,
            rate: sizeForm.rate,
            offset: sizeForm.offset,
            byteorder: sizeForm.byteorder,
            protocol: sizeForm.protocol,
            operatetype: sizeForm.operatetype,
            originaltype: sizeForm.originaltype,
            slaveid: sizeForm.slaveid,
            collection: sizeForm.collection,
            control: sizeForm.control,
            strategy: sizeForm.strategy,
          },
          required: true,
          accessMode: sizeForm.isread,
          identifier: sizeForm.identifier,
        }
        // 提交之前需要先判断类型
        if (
          sizeForm.type == 'float' ||
          sizeForm.type == 'double' ||
          sizeForm.type == 'int'
        ) {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              specs: {
                max: sizeForm.endnumber,
                min: sizeForm.startnumber,
                step: sizeForm.step,
                unit: sizeForm.unit == '' ? '' : sizeForm.unit,
              },
            },
          }
          Object.assign(obj, obj1)
          // 去除多余的属性
          if (!this.showNewItem) {
            delete obj.dataForm.operatetype
            delete obj.dataForm.originaltype
            delete obj.dataForm.slaveid
          }
        } else if (sizeForm.type == 'bool') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              specs: {
                0: sizeForm.false,
                1: sizeForm.true,
              },
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'enum') {
          var specs = {}
          sizeForm.struct.map((items) => {
            var newkey = items['attribute']
            specs[newkey] = items['attributevalue']
          })
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              specs: specs,
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'struct') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              specs: sizeForm.struct,
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'string') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              size: sizeForm.string,
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'date') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
            },
          }
          Object.assign(obj, obj1)
        }

        // 检测到
        if (this.wmxSituation == '新增') {
          // console.log("新增");
          this.productdetail.thing.properties.unshift(obj)
        } else if (this.wmxSituation == '编辑') {
          // console.log("编辑" + obj);
          this.productdetail.thing.properties[this.modifyIndex] = obj
        }
        const params = {
          thing: this.productdetail.thing,
        }
        this.$update_object('Product', this.productId, params)
          .then((resultes) => {
            if (resultes) {
              this.$message({
                type: 'success',
                message: '添加成功',
              })
              this.getProDetail()
              this.wmxdialogVisible = false
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      createProperty() {
        this.setSizeForm(this.getFormOrginalData())
        this.wmxdialogVisible = true
        this.wmxSituation = '新增'
      },
      // 物模型修改submitForm
      wmxDataFill(rowData, index) {
        this.modifyIndex = (this.wmxstart - 1) * this.wmxPageSize + index
        // console.log("rowData ", rowData);
        this.wmxdialogVisible = true
        this.wmxSituation = '编辑'
        var obj = {}
        // 提交之前需要先判断类型
        if (['float', 'double', 'int'].indexOf(rowData.dataType.type) != -1) {
          obj = {
            name: rowData.name,
            // rowData.dataType
            type: rowData.dataType.type,
            endnumber: this.$objGet(rowData, 'dataType.specs.max'),
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            // : rowData.dataForm.
            dis: this.$objGet(rowData, 'dataForm.address'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dinumber: this.$objGet(rowData, 'dataForm.quantity'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            byteorder: this.$objGet(rowData, 'dataForm.byteorder'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            collection: '',
            control: '',
            strategy: '',
            required: true,
            isread: rowData.accessMode,
            identifier: rowData.identifier,
          }
          if (rowData.dataForm) {
            obj.collection = rowData.dataForm.collection
            obj.control = rowData.dataForm.control
            obj.strategy = rowData.dataForm.strategy
          }
        } else if (rowData.dataType.type == 'bool') {
          obj = {
            name: rowData.name,
            type: rowData.dataType.type,
            true: rowData.dataType.specs[1],
            false: rowData.dataType.specs[0],
            // rowData.dataForm.
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dis: this.$objGet(rowData, 'dataForm.address'),
            dinumber: this.$objGet(rowData, 'dataForm.quantity'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            byteorder: this.$objGet(rowData, 'dataForm.byteorder'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            required: false,
            isread: rowData.accessMode,
            identifier: rowData.identifier,
            collection:
              rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
            control:
              rowData.dataForm == undefined ? '' : rowData.dataForm.control,
            strategy:
              rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
          }
        } else if (rowData.dataType.type == 'enum') {
          var structArray = []
          for (const key in rowData.dataType.specs) {
            structArray.push({
              attribute: key,
              attributevalue: rowData.dataType.specs[key],
            })
          }
          obj = {
            name: rowData.name,
            type: rowData.dataType.type,
            specs: rowData.dataType.specs,
            struct: structArray,
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dis: this.$objGet(rowData, 'dataForm.address'),
            dinumber: this.$objGet(rowData, 'dataForm.quantity'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            byteorder: this.$objGet(rowData, 'dataForm.byteorder'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            required: true,
            isread: rowData.accessMode,
            identifier: rowData.identifier,
            collection:
              rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
            control:
              rowData.dataForm == undefined ? '' : rowData.dataForm.control,
            strategy:
              rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
          }
        } else if (rowData.dataType.type == 'struct') {
          obj = {
            name: rowData.name,
            type: rowData.dataType.type,
            struct: rowData.dataType.specs,
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dis: this.$objGet(rowData, 'dataForm.address'),
            dinumber: this.$objGet(rowData, 'dataForm.quantity'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            byteorder: this.$objGet(rowData, 'dataForm.byteorder'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            required: true,
            isread: rowData.accessMode,
            collection:
              rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
            control:
              rowData.dataForm == undefined ? '' : rowData.dataForm.control,
            identifier: rowData.dataForm == undefined ? '' : rowData.identifier,
            strategy:
              rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
          }
        } else if (rowData.dataType.type == 'string') {
          obj = {
            name: rowData.name,
            type: rowData.dataType.type,
            collection:
              rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
            control:
              rowData.dataForm == undefined ? '' : rowData.dataForm.control,
            string: rowData.dataType.size,
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dis: this.$objGet(rowData, 'dataForm.address'),
            dinumber: this.$objGet(rowData, 'dataForm.quantity'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            byteorder: this.$objGet(rowData, 'dataForm.byteorder'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            required: true,
            isread: rowData.accessMode,
            identifier: rowData.identifier,
            strategy:
              rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
          }
        } else if (rowData.dataType.type == 'date') {
          obj = {
            name: rowData.name,
            type: rowData.dataType.type,
            collection:
              rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
            control:
              rowData.dataForm == undefined ? '' : rowData.dataForm.control,
            strategy:
              rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dis: this.$objGet(rowData, 'dataForm.address'),
            dinumber: this.$objGet(rowData, 'dataForm.quantity'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            byteorder: this.$objGet(rowData, 'dataForm.byteorder'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            required: true,
            isread: rowData.accessMode,
            identifier: rowData.identifier,
          }
        }
        this.setSizeForm(obj)
        // console.log('this.sizeForm', this.sizeForm)
      },
      // 物模型结构体
      submitStruct(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var obj = {}
            if (
              this.structform.type == 'float' ||
              this.structform.type == 'double' ||
              this.structform.type == 'int'
            ) {
              obj = {
                name: this.structform.name,
                dataType: {
                  type: this.structform.type.toLowerCase(),
                  specs: {
                    max: this.structform.endnumber,
                    min: this.structform.startnumber,
                    step: this.structform.step,
                    unit:
                      this.structform.unit == '' ? '' : this.structform.unit,
                  },
                },
                dataForm: {
                  address: this.structform.dis,
                  quantity: this.structform.dinumber,
                },
                required: true,
                accessMode: this.structform.isread,
                identifier: this.structform.identifier,
              }
            } else if (this.structform.type == 'bool') {
              obj = {
                name: this.structform.name,
                dataType: {
                  type: this.structform.type.toLowerCase(),
                  specs: {
                    0: this.structform.false,
                    1: this.structform.true,
                  },
                },
                dataForm: {
                  address: this.structform.dis,
                  quantity: this.structform.dinumber,
                },
                required: false,
                accessMode: this.structform.isread,
                identifier: this.structform.identifier,
              }
            } else if (this.structform.type == 'enum') {
              var specs = {}
              this.structform.struct.map((items) => {
                var newkey = items['attribute']
                specs[newkey] = items['attributevalue']
              })
              obj = {
                name: this.structform.name,
                dataType: {
                  type: this.structform.type.toLowerCase(),
                  struct: this.structform.struct,
                  specs: specs,
                },
                dataForm: {
                  address: this.structform.dis,
                  quantity: this.structform.dinumber,
                },
                required: true,
                accessMode: this.structform.isread,
                identifier: this.structform.identifier,
              }
            } else if (this.structform.type == 'string') {
              obj = {
                name: this.structform.name,
                dataType: {
                  type: this.structform.type.toLowerCase(),
                  size: this.structform.string,
                },
                dataForm: {
                  address: this.structform.dis,
                  quantity: this.structform.dinumber,
                },
                required: true,
                accessMode: this.structform.isread,
                identifier: this.structform.identifier,
              }
            } else if (this.structform.type == 'date') {
              obj = {
                name: this.structform.name,
                dataType: {
                  type: this.structform.type.toLowerCase(),
                },
                dataForm: {
                  address: this.structform.dis,
                  quantity: this.structform.dinumber,
                },
                required: true,
                accessMode: this.structform.isread,
                identifier: this.structform.identifier,
              }
            }
            if (this.isupdatedstruct == -1) {
              this.sizeForm.struct.push(obj)
            } else {
              this.sizeForm.struct.splice(this.isupdatedstruct, 1, obj)
              this.isupdatedstruct = -1
            }
            this.$refs[formName].resetFields()
            this.structdialog = false
          } else {
          }
        })
      },
      // 新增结构体
      addStruct(formName) {
        this.structdialog = true
        this.structform = {
          resource: 1,
          identifier: '',
          type: 'int',
          startnumber: '',
          endnumber: '',
          step: '',
          true: '',
          truevalue: 1,
          false: '',
          falsevalue: 0,
          isread: 'r',
          unit: '',
          specs: [],
          date: 'String类型的UTC时间戳 (毫秒)',
          string: '',
        }
      },
      editStruct(item, index) {
        console.log(item, index)
        this.isupdatedstruct = index
        this.structdialog = true
        this.structform.type = item.dataType.type.toUpperCase()
        this.structform.name = item.name
        this.structform.identifier = item.identifier
        this.structform.isread = item.accessMode
        if (
          item.dataType.type == 'float' ||
          item.dataType.type == 'double' ||
          item.dataType.type == 'int'
        ) {
          this.structform.startnumber = item.dataType.specs.min
          this.structform.endnumber = item.dataType.specs.max
          this.structform.step = item.dataType.specs.step
          this.structform.unit = item.dataType.specs.unit
        } else if (item.dataType.type == 'bool') {
          this.structform.true = item.dataType.specs['1']
          this.structform.false = item.dataType.specs['0']
        } else if (item.dataType.type == 'enum') {
          this.structform.specs = []
          var obj = {}
          Object.keys(item.dataType.specs).forEach((value, index) => {
            obj.attribute = value
            obj.attributevalue = item.dataType.specs[value]
            this.structform.specs.push(obj)
          })
        } else if (item.dataType.type == 'string') {
          this.structform.string = item.dataType.size
        }
      },
      // 删除结构体
      deleteStruct(index) {
        this.sizeForm.struct.splice(index, 1)
      },
      preserve() {
        const params = {
          thing: JSON.parse(editor1.getValue()),
        }
        this.$update_object('Product', this.productId, params)
          .then((resultes) => {
            if (resultes) {
              this.$message({
                type: 'success',
                message: '添加成功',
              })
              this.schemadialogVisible = false
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      async Industry() {
        this.option = []
        const { results } = await this.$getIndustry('category', 100)
        results.map((items) => {
          var obj = {}
          obj.value = items.type
          obj.label = items.data.CategoryName
          obj.id = items.data.Id
          obj.parentid = items.data.SuperId
          this.option.push(obj)
        })
        this.getProDetail()
      },
      utc2beijing(utc_datetime) {
        // 转为正常的时间格式 年-月-日 时:分:秒
        var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '')
        return date // 2017-03-31 16:02:06
      },
      getPropData(start) {
        if (start == 0) {
          this.productstart = 0
        }
        this.CategoryKey = this.$route.query.CategoryKey
        const params = {
          count: 'objectId',
          limit: this.productlength,
          skip: this.productstart,
          where: {
            'data.key': 'category',
          },
        }
        if (this.category.length != 0) {
          params.where.type = this.category[this.category.length - 1]
        }
        getDictCount(params)
          .then((res) => {
            this.producttotal = res.count
            this.PropData = res.results
          })
          .catch((e) => {
            console.log(e)
          })
      },
      productSizeChange(val) {
        this.productlength = val
        this.getPropData()
      },
      productCurrentChange(val) {
        this.productstart = (val - 1) * this.productlength
        this.getPropData()
      },
      // 李宏杰新增  查看采集公式
      checkAddTest() {
        this.collectionDialogVisible = true
        // let newTabName = ++this.tabIndex + '';
        ;(this.editableTabsValue = this.wmxData[0].identifier),
          (this.activeIndex = this.wmxData[0].identifier),
          (this.editableTabs = []),
          (this.editorList = []),
          (this.tabIndex = 1),
          (this.ed3isShow = false)
        this.editableTabs.push({
          title: this.wmxData[0].identifier,
          name: this.wmxData[0].identifier,
          leftItemPos: 0,
          content:
            this.wmxData[0].dataForm == undefined
              ? ''
              : this.wmxData[0].dataForm.collection,
        })

        // 进入先添加一个默认显示的
        if (this.ed3isShow == false) {
          setTimeout(() => {
            // editor3 = ace.edit(this.wmxData[0].identifier);
            this.editorList.push(ace.edit(this.wmxData[0].identifier))
            this.editorList[0].session.setMode('ace/mode/erlang') // 设置语言
            this.editorList[0].setTheme('ace/theme/monokai') // 设置主题
            this.editorList[0].setHighlightActiveLine(true)
            this.editorList[0].setFontSize(20) // 设置字号
            this.editorList[0].setOptions({
              enableBasicAutocompletion: true,
              enableSnippets: true,
              enableLiveAutocompletion: true, // 设置自动提示
            })
            this.ed3isShow = true
            //  this.editorList.push(editor3);
            // console.log(this.wmxData);
            this.editorList[0].setValue(
              this.wmxData[0].dataForm == undefined
                ? ''
                : this.wmxData[0].dataForm.collection
            )
          }, 1)
        }
        // this.menuTabClick(this.wmxData)
      },
      //
      handleRightTopTabClick(tab, event) {
        this.activeIndex = tab.label
        // console.log(tab.label);
      },
      // 左边切换,先判断是否添加过
      menuTabClick(item, itemPos) {
        // console.log(item)
        // 先判断是否添加过
        this.activeIndex = item.identifier
        const tabs = this.editableTabs
        let isAdd = false
        let mIndex = 0
        tabs.forEach((tab, index) => {
          if (tab.name === item.identifier) {
            // console.log("tab.name   " + tab.name, "   item.identifier   " + item.identifier, "   index  " + index);
            isAdd = true
            mIndex = index
          }
        })
        if (isAdd == false) {
          this.editableTabs.push({
            title: item.identifier,
            name: item.identifier,
            leftItemPos: itemPos,
            content: item.dataForm == undefined ? '' : item.dataForm.collection,
          })
          setTimeout(() => {
            this.editorList.push(ace.edit(item.identifier))
            this.editorList[this.editorList.length - 1].session.setMode(
              'ace/mode/erlang'
            ) // 设置语言
            this.editorList[this.editorList.length - 1].setTheme(
              'ace/theme/monokai'
            ) // 设置主题
            this.editorList[this.editorList.length - 1].setHighlightActiveLine(
              true
            )
            this.editorList[this.editorList.length - 1].setFontSize(20) // 设置字号
            this.editorList[this.editorList.length - 1].setOptions({
              enableBasicAutocompletion: true,
              enableSnippets: true,
              enableLiveAutocompletion: true, // 设置自动提示
            })
            this.editorList[this.editorList.length - 1].setValue(
              item.dataForm == undefined ? '' : item.dataForm.collection
            )
          }, 1)

          this.editableTabsValue = item.identifier
          this.rightCollection =
            item.dataForm == undefined ? '' : item.dataForm.collection
        } else {
          this.editableTabsValue = item.identifier
          // console.log("this.editorList ==  " + this.editorList.length)
          this.editorList[mIndex].setValue(
            item.dataForm == undefined ? '' : item.dataForm.collection
          )
        }
      },
      // 关闭上面的单个tab
      removeTab(targetName) {
        const tabs = this.editableTabs
        let activeName = this.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.editableTabsValue = activeName
        this.activeIndex = activeName
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
      },

      // 保存
      onSaveTap(index) {
        const leftPos = this.editableTabs[index].leftItemPos
        this.productdetail.thing.properties[
          leftPos
        ].dataForm.collection = this.editorList[index].getValue()
        const params = {
          thing: this.productdetail.thing,
        }
        this.$update_object('Product', this.productId, params)
          .then((resultes) => {
            if (resultes) {
              this.$message({
                type: 'success',
                message: '添加成功',
              })
              this.getProDetail()
              // this.$refs[formName].resetFields();
              //  this.wmxdialogVisible = false;
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },

      handleCloseCollecttion(done) {
        this.$confirm('确认关闭？')
          .then((_) => {
            done()
          })
          .catch((_) => {})
      },

      // 还原
      onReductionTap(index) {
        const leftPos = this.editableTabs[index].leftItemPos
        // console.log(this.wmxData[leftPos].dataForm.collection)

        this.editorList[index].setValue(
          this.wmxData[leftPos].dataForm.collection
        )
      },

      // 李宏杰添加结束

      // 查看物模型模板
      checkschema() {
        this.schemadialogVisible = true
        setTimeout(() => {
          editor1 = ace.edit('editor1')
          editor1.session.setMode('ace/mode/json') // 设置语言
          editor1.setTheme('ace/theme/eclipse') // 设置主题
          editor1.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true, // 设置自动提示
          })
          editor1.setValue(JSON.stringify(this.productdetail.thing, null, 4))
        }, 1)
      },
      // 得到产品详情
      getProDetail() {
        editor = ace.edit('editor')
        editor.session.setMode('ace/mode/erlang') // 设置语言
        editor.setTheme('ace/theme/monokai') // 设置主题
        editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true, // 设置自动提示
        })
        // 需要找到 this.productId 并传入
        this.productId = this.$route.query.id
        this.queryDeviceCount(this.productId)
        this.$get_object('Product', this.productId)
          .then((response) => {
            // console.log("response", response)
            if (response) {
              this.productName = response.name
              for (var key in response) {
                this.productdetail[key] = response[key]
              }
              this.option.map((items) => {
                if (this.productdetail.category == items.value) {
                  this.productdetail.category = items.label
                }
              })
              this.productdetail.createdAt = this.utc2beijing(
                response.createdAt
              )
              this.productdetail.id = response.id
              this.dynamicReg = response.dynamicReg
              this.productdetail.isshow = 0
              this.form.Productname = response.name
              this.ProductSecret = response.productSecret
              this.form.Productkey = this.productId
              // window.location.origin
              this.productimg = response.icon
              if (response.decoder) {
                setdata = response.decoder.code
                this.formInline.name = response.decoder.name
                this.formInline.version = response.decoder.version
                this.formInline.desc = response.decoder.desc
              } else {
                setdata =
                  'JSUlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQolJSUgQGNvcHlyaWdodCAoQykgMjAxOCwgPHNodXdhPgolJSUgQGRvYwolJSUg5Y2P6K6u6Kej5p6QRGVtbwolJSUgQGVuZAolJSUgQ3JlYXRlZCA6IDA4LiDljYHkuIDmnIggMjAxOCAxNDo0OQolJSUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCi1tb2R1bGUoc2h1d2FfZGVtb19kZWNvZGVyKS4KLWF1dGhvcigic2h1d2EiKS4KLWRlZmluZShNU0dfVFlQRSwgPDwiREVNTyI+PikuCi1wcm90b2NvbChbPDwiREVNTyI+Pl0pLgoKLWV4cG9ydChbcGFyc2VfZnJhbWUvMiwgdG9fZnJhbWUvMV0pLgoKCnBhcnNlX2ZyYW1lKEJ1ZmYsIE9wdHMpIC0+CiAgICBwYXJzZV9mcmFtZShCdWZmLCBbXSwgT3B0cykuCgoKcGFyc2VfZnJhbWUoPDw+PiwgQWNjLCBfT3B0cykgLT4KICAgIHs8PD4+LCBBY2N9OwpwYXJzZV9mcmFtZSg8PDE2IzY4LCBSZXN0L2JpbmFyeT4+ID0gQmluLCBBY2MsIF9PcHRzKSB3aGVuIGJ5dGVfc2l6ZShSZXN0KSA9PCA2IC0+CiAgICB7QmluLCBBY2N9OwpwYXJzZV9mcmFtZSg8PDE2IzY4LCBMZW46MTYvbGl0dGxlLWludGVnZXIsIExlbjoxNi9saXR0bGUtaW50ZWdlciwgMTYjNjgsIFJlc3QvYmluYXJ5Pj4gPSBCaW4sIEFjYywgT3B0cykgLT4KICAgIGNhc2UgYnl0ZV9zaXplKFJlc3QpIC0gMiA+PSBMZW4gb2YKICAgICAgICB0cnVlIC0+CiAgICAgICAgICAgIGNhc2UgUmVzdCBvZgogICAgICAgICAgICAgICAgPDxVc2VyWm9uZTpMZW4vYnl0ZXMsIENyYzo4LCAxNiMxNiwgUmVzdDEvYmluYXJ5Pj4gLT4KICAgICAgICAgICAgICAgICAgICBBY2MxID0KICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBzaHV3YV91dGlsczpnZXRfcGFyaXR5KFVzZXJab25lKSA9Oj0gQ3JjIG9mCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIC0+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRnJhbWUgPSAjewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8PCJtc2d0eXBlIj4+ID0+ID9NU0dfVFlQRSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPDwiZGF0YSI+PiA9PiBVc2VyWm9uZQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWNjICsrIFtGcmFtZV07CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSAtPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjYwogICAgICAgICAgICAgICAgICAgICAgICBlbmQsCiAgICAgICAgICAgICAgICAgICAgcGFyc2VfZnJhbWUoUmVzdDEsIEFjYzEsIE9wdHMpOwogICAgICAgICAgICAgICAgXyAtPgogICAgICAgICAgICAgICAgICAgIHBhcnNlX2ZyYW1lKFJlc3QsIEFjYywgT3B0cykKICAgICAgICAgICAgZW5kOwogICAgICAgIGZhbHNlIC0+CiAgICAgICAgICAgIHtCaW4sIEFjY30KICAgIGVuZDsKcGFyc2VfZnJhbWUoPDxfOjgsIFJlc3QvYmluYXJ5Pj4sIEFjYywgT3B0cykgLT4KICAgIHBhcnNlX2ZyYW1lKFJlc3QsIEFjYywgT3B0cykuCgoKJSUg57uE6KOF5oiQ5bCB5YyFLCDlj4LmlbDkuLpNYXDlvaLlvI8KdG9fZnJhbWUoI3s8PCJtc2d0eXBlIj4+IDo9ID9NU0dfVFlQRX0gPSBGcmFtZSkgLT4KICAgIFBheWxvYWQgPSB0ZXJtX3RvX2JpbmFyeShGcmFtZSksCiAgICA8PDE2IzAzLCBQYXlsb2FkL2JpbmFyeSwgMTYjMjM+Pi4='
              }
              if (
                this.productdetail.thing == undefined ||
                JSON.stringify(this.productdetail.thing) == '{}'
              ) {
                this.productdetail.thing = {
                  properties: [],
                }
              }
              // console.log('=====', this.wmxData)
              this.wmxData = []
              this.wmxData = this.productdetail.thing.properties.filter(
                (item) => {
                  return item.name && item.dataType
                }
              )
              // console.log('----------', this.wmxData)
              editor.setValue(Base64.decode(setdata))
              editor.gotoLine(editor.session.getLength())
            }
          })
          .catch((err) => {
            console.log('err', err)
            this.$baseMessage('请求出错', err.error, 3000)
          })
      },
      // 查询设备总数
      async queryDeviceCount(productId) {
        this.form.ProductAll = await getDeviceCountByProduct(productId)
      },
      // 产品修改
      handelUpdate(event, row) {
        var isopen
        if (event == true) {
          isopen = false
        } else {
          isopen = true
        }
        this.dynamicReg = isopen
        const params = {
          dynamicReg: !isopen,
        }
        this.$update_object('Product', this.productId, params)
          .then((resultes) => {
            if (resultes) {
              this.$message({
                type: 'success',
                message: '修改成功',
              })
              this.dynamicReg = !isopen
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      wmxhandleClose() {
        this.wmxdialogVisible = false
        this.setSizeForm(this.getFormOrginalData())
      },
      // 协议编辑
      protol() {
        var log = ''
        Compile(Base64.encode(editor.getValue()))
          .then((res) => {
            if (res) {
              this.$message({
                type: 'success',
                message: '编译成功',
              })
              log = '编译成功' + res.mod + '\r\n'
              this.warningeditror = res.warnings
              this.warningeditror.map((items) => {
                log += items + '\r\n'
              })
              isupdatetrue += log
              editor2.setValue(isupdatetrue)
            }
          })
          .catch((error) => {
            this.warningeditror = error.error
            this.warningeditror.map((items) => {
              log += items + '\r\n'
            })
            isupdatetrue += log
            editor2.setValue(isupdatetrue)
          })
      },
      decoderSizeChange(val) {
        this.decoder.length = val
        this.chaxun()
      },
      devicerCurrentChange(val) {
        this.decoderstart = (val - 1) * this.decoderlength
        this.chaxun()
      },
      deletedata(objectId) {
        this.$del_object('Dict', objectId)
          .then((resultes) => {
            if (resultes) {
              this.$message('成功删除')
              this.chaxun()
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      subAce(formName, istrue) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var obj = {
              name: this.formInline.name,
              version: this.formInline.version,
              code: Base64.encode(editor.getValue()),
              desc: this.formInline.desc,
            }
            const params = {
              decoder: obj,
            }
            this.$update_object('Product', this.productId, params)
              .then((res) => {
                if (this.issub == false) {
                  this.$message({
                    type: 'success',
                    message: '保存成功',
                  })
                  if (istrue == true) {
                    isupdatetrue += '保存成功'
                    editor2.setValue(isupdatetrue)
                  }
                }
                this.issub = true
              })
              .catch((e) => {
                console.log(e)
              })
          } else {
            this.$message({
              type: 'warning',
              message: '输入格式有误',
            })
          }
        })
      },
      subAce1(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = {
              where: {
                'data.name': this.formInline.name,
                'data.version': this.formInline.version,
              },
            }
            this.$query_object('Dict', params)
              .then((response) => {
                if (response.results && response.results.length >= 1) {
                  this.$message('此协议版本已存在')
                  return
                } else {
                  this.$get_object('Product', this.productId).then(
                    (response) => {
                      if (response) {
                        var obj = {
                          name: this.formInline.name,
                          version: this.formInline.version,
                          code: Base64.encode(editor.getValue()),
                          desc: this.formInline.desc,
                        }
                        const params = {
                          key:
                            this.formInline.name +
                            ':' +
                            this.formInline.version,
                          type: 'decoder',
                          data: obj,
                          ACL: response.ACL,
                        }
                        this.$create_object('Dict', params)
                          .then((resultes) => {
                            if (resultes.error) {
                              this.$message({
                                type: 'error',
                                message: resultes.error,
                              })
                            } else {
                              this.$message({
                                type: 'success',
                                message: '保存到公共协议库成功',
                              })
                            }
                          })
                          .catch((e) => {
                            console.log(e)
                          })
                      }
                    }
                  )
                }
              })
              .catch((e) => {
                console.log(e)
              })
          } else {
            this.$message({
              type: 'warning',
              message: '输入格式有误',
            })
          }
        })
      },
      // 通道更新协议状态
      updatesub(row) {
        subupadte(row.objectId, 'update')
          .then((resultes) => {
            if (resultes) {
              this.$message('重载成功')
            }
          })
          .catch((error) => {
            this.$message(error.error)
          })
      },

      chaxun() {
        const params = {
          count: 'objectId',
          skip: this.decoderstart,
          limit: this.decoderlength,
          where: {
            type: 'decoder',
          },
        }
        this.dialogTableVisible = true
        this.$query_object('Dict', params)
          .then((res) => {
            if (res) {
              this.decodertotal = res.count
              this.gridData = res.results
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      editordata(row) {
        this.formInline.name = row.data.name
        this.formInline.version = row.data.version
        this.formInline.desc = row.data.desc
        this.formInline.resource = row.data.enable
        editor.setValue(Base64.decode(row.data.code))
        this.dialogTableVisible = false
      },
      goToDevices() {
        this.$router.push({
          path: '/roles/thing',
          query: {
            productid: this.productId,
          },
        })
      },
      addcategory() {
        this.originwmx = true
        this.getPropData()
      },
      handleChange(value, direction, movedKeys) {
        // console.log(value, direction, movedKeys);
      },
      // 用于处理定义好的物模型模板
      TypeInstall(origin, arr) {
        arr.map((items, index) => {
          if (items.DataType == 'enum' || items.DataType == 'bool') {
            var obj = {
              dataType: {
                specs: {},
              },
            }
            obj.name = items.Name
            obj.dataType.type = items.DataType
            obj.required = items.Required
            obj.identifier = items.Identifier
            obj.accessMode = items.RwFlag == 1 ? 'r' : 'rw'
            JSON.parse(items.DataSpecsList).map((child) => {
              for (var key in child) {
                var attribute = child['value']
                var value = child['name']
                obj.dataType.specs[attribute] = value
              }
            })
            origin.push(obj)
          } else if (
            items.DataType == 'double' ||
            items.DataType == 'int' ||
            items.DataType == 'float'
          ) {
            var obj = {
              dataType: {
                specs: {},
              },
            }
            obj.name = items.Name
            obj.dataType.type = items.DataType
            obj.required = items.Required
            obj.identifier = items.Identifier
            obj.accessMode = items.RwFlag == 1 ? 'r' : 'rw'
            for (var key in JSON.parse(items.DataSpecs)) {
              obj.dataType.specs.min = JSON.parse(items.DataSpecs)['min']
              obj.dataType.specs.max = JSON.parse(items.DataSpecs)['max']
              obj.dataType.specs.step = JSON.parse(items.DataSpecs)['step']
              obj.dataType.specs.unit = JSON.parse(items.DataSpecs)['unit']
            }
            origin.push(obj)
            // 分开结构体单独遍历
          } else if (items.DataType == 'struct') {
            var structobj = {
              dataType: {
                specs: [],
              },
            }
            structobj.name = items.Name
            structobj.dataType.type = items.DataType
            structobj.required = !items.Required
            structobj.identifier = items.Identifier
            structobj.accessMode = items.RwFlag == 1 ? 'r' : 'rw'
            JSON.parse(items.DataSpecsList).map((children) => {
              if (
                children.childDataType == 'enum' ||
                children.childDataType == 'bool'
              ) {
                var obj = {
                  dataType: {
                    specs: {},
                  },
                }
                obj.name = children.childName
                obj.dataType.type = children.childDataType.toLowerCase()
                obj.required = children.Required
                obj.identifier = children.identifier
                obj.accessMode = children.RwFlag == 1 ? 'r' : 'rw'
                children.childEnumSpecsDTO.map((child) => {
                  for (var key in child) {
                    var attribute = child['value']
                    var value = child['name']
                    obj.dataType.specs[attribute] = value
                  }
                })
                structobj.dataType.specs.push(obj)
              } else if (
                children.childDataType == 'double' ||
                children.childDataType == 'int' ||
                children.childDataType == 'float'
              ) {
                var obj = {
                  dataType: {
                    specs: {},
                  },
                }
                obj.name = children.childName
                obj.dataType.type = children.childDataType.toLowerCase()
                obj.required = children.Required
                obj.identifier = children.identifier
                obj.accessMode = children.RwFlag == 1 ? 'r' : 'rw'
                for (var key in children.childSpecsDTO) {
                  obj.dataType.specs.min = children.childSpecsDTO['min']
                  obj.dataType.specs.max = children.childSpecsDTO['max']
                  obj.dataType.specs.step = children.childSpecsDTO['precise']
                  obj.dataType.specs.unit = children.childSpecsDTO['unit']
                }
                structobj.dataType.specs.push(obj)
              }
            })
            origin.push(structobj)
          }
        })
        var update = {}
        origin = origin.reduce((cur, next) => {
          update[next.identifier]
            ? ''
            : (update[next.identifier] = true && cur.push(next))
          return cur
        }, [])
      },
      // 添加物模型模板
      addProCategory(row) {
        const params = {
          where: {
            type: row.type,
            'data.key': 'detail',
          },
        }
        this.$query_object('Dict', params).then((res) => {
          const results = res.results
          if (results && results[0].data.Ability) {
            this.TypeInstall(
              this.productdetail.thing.properties,
              results[0].data.Ability
            )
            const params = {
              thing: this.productdetail.thing,
            }
            this.$update_object('Product', this.productId, params)
              .then((resultes) => {
                if (resultes) {
                  this.$message({
                    type: 'success',
                    message: '添加成功',
                  })
                  this.getProDetail()
                }
              })
              .catch((e) => {
                console.log(e)
              })
          } else {
            console.log('此选项没有属性功能')
          }
        })
      },
      /* 删除物模型*/
      deletewmx(index) {
        this.productdetail.thing.properties.splice(
          (this.wmxstart - 1) * this.wmxPageSize + index,
          1
        )
        const params = {
          thing: this.productdetail.thing,
        }
        this.$update_object('Product', this.productId, params)
          .then((resultes) => {
            if (resultes) {
              this.$message({
                type: 'success',
                message: '删除成功',
              })
              this.wmxData = this.productdetail.thing.properties.concat([])
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      wmxSizeChange(val) {
        this.wmxstart = 1
        this.wmxPageSize = val
      },
      wmxCurrentChange(val) {
        this.wmxstart = val
      },
      // 订阅日志按钮
      nowtime() {
        var timestamp3 = Date.parse(new Date())
        var date = new Date(timestamp3)
        var Y = date.getFullYear() + '年'
        var M =
          (date.getMonth() + 1 <= 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '月'
        var D =
          (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) +
          '日  '
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
        return h + m + s + ' '
      },
      // 订阅日志
      subProTopic(row) {
        this.subdialog = true
        this.subdialogid = row.id
        this.channelname = row.id
        setTimeout(() => {
          subdialog = ace.edit('subdialog')
          subdialog.session.setMode('ace/mode/text') // 设置语言
          subdialog.setTheme('ace/theme/gob') // 设置主题
          subdialog.setReadOnly(true)
          subdialog.setOptions({
            enableBasicAutocompletion: false,
            enableSnippets: true,
            enableLiveAutocompletion: true, // 设置自动提示
          })
        })
        var info = {
          topic: 'log/channel/' + row.id + '/' + this.productId,
          qos: 2,
        }
        var channeltopic = new RegExp(
          'log/channel/' + row.id + '/' + this.productId
        )
        var submessage = ''
        var _this = this
        Websocket.add_hook(channeltopic, function (Msg) {
          // 判断长度
          if (subdialog.session.getLength() >= 1000) {
            submessage = ''
          } else {
            submessage += _this.nowtime() + Msg + `\n`
          }
          subdialog.setValue(submessage)
          subdialog.gotoLine(subdialog.session.getLength())
        })
        // 订阅
        var text0 = JSON.stringify({
          action: 'start_logger',
        })
        Websocket.subscribe(info, function (res) {
          if (res.result) {
            // console.log(info);
            // console.log("订阅成功");
            var sendInfo = {
              topic: 'channel/' + row.id + '/' + _this.productId,
              text: text0,
              retained: true,
              qos: 2,
            }
            Websocket.sendMessage(sendInfo)
            _this.subdialogtimer = window.setInterval(() => {
              Websocket.sendMessage(sendInfo)
            }, 600000)
          }
        })
      },
      // 关闭弹窗操作
      handleCloseSubdialog() {
        var text0 = JSON.stringify({
          action: 'stop_logger',
        })
        var sendInfo = {
          topic: 'channel/' + this.subdialogid + '/' + this.productId,
          text: text0,
          retained: true,
          qos: 2,
        }
        Websocket.sendMessage(sendInfo)
        this.subdialog = false
        window.clearInterval(this.subdialogtimer)
        this.subdialogtimer = null
      },
      // 停止topic刷新
      stopsub(value) {
        var text0
        if (value == false) {
          // this.subaction = 'start'
          text0 = JSON.stringify({
            action: 'stop_logger',
          })
        } else {
          // this.subaction = 'stop'
          text0 = JSON.stringify({
            action: 'start_logger',
          })
        }
        var sendInfo = {
          topic: 'channel/' + this.subdialogid + '/' + this.productId,
          text: text0,
          retained: true,
          qos: 2,
        }
        Websocket.sendMessage(sendInfo)
      }, // topic增加
      subTopic(formName, isupdated) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var Topic =
              'thing/' + this.productId + '/${DevAddr}/' + this.topicform.topic

            this.$get_object('Product', this.productId).then((resultes) => {
              var addTopic = {
                topic: Topic,
                type: this.topicform.type,
                desc: this.topicform.desc,
              }
              var arr = []
              arr.push(addTopic)
              const params = {}
              if (isupdated == -1) {
                arr = arr.concat(resultes.topics)
                params.topics = arr
              } else {
                var topicupdated = resultes.topics.concat([])
                topicupdated[isupdated] = addTopic
                params.topics = topicupdated
              }
              this.$update_object('Product', this.productId, params)
                .then((response) => {
                  if (response) {
                    this.$message({
                      type: 'success',
                      message: '成功',
                    })
                    this.topicdialogVisible = false
                    this.$refs[formName].resetFields()
                    ;(this.topicform.isupdated = -1),
                      (this.topicform.topic = '')
                    this.topicform.desc = ''
                    this.handleClick({
                      name: 'second',
                    })
                  }
                })
                .catch((e) => {
                  console.log(e)
                })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      topicSizeChange(val) {
        this.topicstart = 1
        this.topiclength = val
      },
      topicCurrentChange(val) {
        this.topicstart = val
      },
      updatetopic(row, index) {
        this.topicform.topic = row.topic.substr(row.topic.lastIndexOf('/') + 1)
        this.topicform.type = row.type
        this.topicform.desc = row.desc
        this.topicdialogVisible = true
        this.topicform.isupdated = index
      },
      async deletetopic(scope, index) {
        const { topics } = await this.$get_object('Product', this.productId)
        if (topics) {
          // scope._self.$refs[`popover-${scope.$index}`].doClose();
          var topic = topics.concat([])
          topic.splice(index, 1)
          const params = {
            topics: topic,
          }
          const $update_object = this.$update_object(
            'Product',
            this.productId,
            params
          )
          // console.log($update_object)
          this.$message({
            type: 'success',
            message: '删除成功',
          })
        }
        this.getTopic()
      },
      // 规则tab显示
      orginRule() {
        getRule()
          .then((response) => {
            if (response) {
              this.engineData = response
            }
          })
          .catch((error) => {
            this.$message(error.error)
          })
      },
      // 分页
      handleSizeChange(val) {},
      handleCurrentChange(val) {},
      addEngine() {
        this.$router.push({
          path: '/rules_engine/addengine',
          query: {
            title: '新增',
            productid: this.productId,
          },
        })
      },
      actions(row) {
        var string = []
        row.map((items) => {
          string.push(items.name)
        })
        return string.join(',')
      },
      // 表格单个单元格class添加
      getRowindex(row, rowIndex, columnIndex) {
        if (row.columnIndex == 0) {
          return 'firstcolumn'
        }
      },
      detailRules(id) {
        this.$router.push({
          path: '/rules_engine/checkengine',
          query: {
            id: id,
          },
        })
      },
    },
  }
</script>
<style scoped>
  /* <!--李宏杰新增--> */
  .diaCollLeftCls {
    width: 100%;
    height: calc(100vh - 100px);
  }
  .ace_editor3 {
    height: calc(100vh - 100px);
  }
  .diaCollRightCls {
    width: 100%;
    height: calc(100vh - 100px);
  }
  .editproduct {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
  }

  .mailtable .cloumn {
    width: 200px;
    font-weight: 400;
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

  .mailtable .notbottom {
    border-bottom: 0;
  }

  .editheader .product ul {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 50px;
    padding-left: 0;
  }

  .editheader .product ul li {
    font-size: 16px;
    color: #74777a;
    text-align: left;
    list-style: none;
  }

  /* .editheader .product ul li:first-child,
  .editheader .product ul li:last-child {
    width: 25%;
    list-style: none;
    color: #74777a;
    font-size: 16px;
    line-height: 50px;
    float: left;
    text-align: left;
  }
  .editheader .product ul li:nth-child(2) {
    width: 50%;
    list-style: none;
    color: #74777a;
    font-size: 16px;
    line-height: 50px;
    float: left;
    text-align: left;
  } */
</style>
<style scoped>
  .editproduct .el-tabs__item {
    width: 150px;
    height: 50px;
    margin: 0;
    margin-top: 20px;
    font-family: auto;
    font-size: 16px;
    line-height: 50px;
  }

  .editproduct .el-tabs__header {
    margin: 0;
  }

  .editproduct .el-tabs__content {
    box-sizing: border-box;
    padding: 20px 10px 0 10px;
    background: #f4f4f4;
  }

  .editproduct .el-tab-pane {
    box-sizing: border-box;
    padding-top: 10px;
    background: #ffffff;
  }

  .editproduct .el-dialog__body {
    padding: 0 20px;
  }

  .editproduct .inputnumber {
    width: auto;
  }

  .editproduct .el-table td,
  .editproduct .el-table th {
    padding: 5px 0;
  }

  .editproduct .warning {
    width: 100%;
    color: #ffffff;
    background: #272822;
  }

  .editproduct .error {
    width: 100%;
    color: #f56c6c;
    background: #272822;
  }

  .editproduct .el-form-item {
    margin-bottom: 5px;
  }

  ::v-deep .el-form-item__content {
    /*line-height: 24px !important;*/
    /*margin-left: 0;*/
    /*clear: both;*/
    /*margin-top: -25px !important;*/
    /*color: pink;*/
  }
  ::v-deep .el-form-item__label {
    height: 48px;
    line-height: 30px;
  }
  ::v-deep .el-form-item--mini .el-form-item__error {
    margin-top: -13px;
  }
  .editproduct .el-dialog__header {
    border-bottom: 1px solid #dddddd;
  }

  .editproduct .el-cascader {
    width: 60%;
  }

  .editproduct .el-cascader .el-input__inner {
    height: 30px;
  }

  .editproduct .topiccontent {
    box-sizing: border-box;
    padding: 10px;
  }

  .editproduct .topicform .el-select {
    width: 100%;
  }

  .editproduct .row-expand-cover td:first-child .el-icon-arrow-right {
    visibility: hidden;
  }

  /* .editproduct .row-expand-cover + tr {
    display: none;
  } */
  .editproduct .el-table__expanded-cell {
    left: 100px;
    box-sizing: border-box;
    padding: 20px 0 !important;
    margin: 0 auto;
    text-align: center;
  }

  .editproduct .el-table__expanded-cell .el-table th.is-leaf {
    background: #ced7de9c;
  }

  /* .editproduct #pane-sixeth {
    display: flex;
  } */
  .editproduct .el-col-2 {
    text-align: center;
  }

  .green_active {
    color: green;
  }

  .red_active {
    color: red;
  }

  .wumoxing .el-form-item__content {
    margin-left: 10px;
  }

  .task_collection .el-form-item__content {
    clear: none;
  }

  .task_collection .el-form-item {
    margin-bottom: 10px;
  }
</style>
<style lang="scss" scoped>
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
