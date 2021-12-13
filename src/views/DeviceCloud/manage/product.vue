<!--eslint-disable-->
<template>
  <div class="devproduct devproduct-container">
    <input
      ref="uploader"
      accept="zip"
      style="display: none"
      type="file"
      @change="doUpload($event)"
    />
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogVisible"
      style="margin: 0 auto"
      top="1vh"
      width="90%"
    >
      <VabParser
        :dict="parserDict"
        :form-config="formConfig"
        :parserindex="editIndex"
        :productid="productid"
        @ParserSave="saveParse"
      />
    </el-dialog>
    <el-dialog :append-to-body="true" :visible.sync="parserView">
      <f-render v-model="formConfig" :config="formConfig" pure />
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      :visible.sync="parserTable"
      class="parserTable"
    >
      <div slot="title" class="header-title parserTable">
        <el-button
          type="primary"
          @click.native.prevent="addParse(parserTableList)"
        >
          {{ $translateTitle('product.newlyadded') }}
        </el-button>
        <el-button
          type="success"
          @click.native.prevent="saveParse(parserTableList)"
        >
          {{ $translateTitle('product.preservation') }}
        </el-button>
      </div>
      <el-table
        :data="parserTableList.parser"
        :height="height"
        style="width: 100%"
      >
        <el-table-column
          :label="$translateTitle('product.chinesetitle')"
          align="center"
          prop="name"
          sortable
        />
        <el-table-column
          :label="$translateTitle('product.englishtitle')"
          align="center"
          prop="enname"
          sortable
        />
        <el-table-column
          :label="$translateTitle('leftbar.settings')"
          align="center"
          show-overflow-tooltip
          sortable
        >
          <template #default="{ row, $index }">
            <el-button plain type="primary" @click="editParse($index, row)">
              {{ $translateTitle('concentrator.edit') }}
            </el-button>
            <el-button plain type="success" @click="previewParse(row.config)">
              {{ $translateTitle('application.preview') }}
            </el-button>
            <el-button
              plain
              size="small"
              type="danger"
              @click.native.prevent="
                deleteParse($index, parserTableList.parser)
              "
            >
              {{ $translateTitle('task.Delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <vab-input
      ref="uploadFinish"
      :params="inputParams"
      @fileInfo="fileInfo"
      @files="files"
    />
    <div class="prosecond">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        size="small"
      >
        <el-form-item>
          <el-input
            v-model="formInline.productname"
            :placeholder="$translateTitle('product.searchproductname')"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="searchProduct(0)">
            {{ $translateTitle('developer.search') }}
          </el-button>
        </el-form-item>
        <el-form-item style="float: right; text-align: right">
          <el-button type="primary" @click.native="addproduct">
            {{ $translateTitle('product.createproduct') }}
          </el-button>
          <el-button type="primary" @click.native="exportpro">
            {{ $translateTitle('product.exportpro') }}
          </el-button>
          <el-button type="primary" @click.native="handleImport()">
            {{ $translateTitle('product.importpro') }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-card>
        <el-table
          v-loading="listLoading"
          :cell-style="{ 'text-align': 'center' }"
          :data="proTableData"
          :header-cell-style="{ 'text-align': 'center' }"
          :height="height"
          border
          size="mini"
          style="width: 100%"
        >
          <el-table-column
            label="ProductID"
            prop="objectId"
            width="auto"
            show-overflow-tooltip
            sortable
          />
          <el-table-column
            width="auto"
            show-overflow-tooltip
            sortable
            prop="name"
            :label="$translateTitle('product.productname')"
          />
          <el-table-column
            show-overflow-tooltip
            sortable
            prop="nodeType"
            width="160"
            :label="$translateTitle('product.nodetype')"
          >
            <template #default="{ row }">
              <span v-if="row.nodeType == 3">
                {{ $translateTitle('product.direct') }}
              </span>
              <span v-if="row.nodeType == 1">
                {{ $translateTitle('product.gateway') }}
              </span>
              <span v-if="row.nodeType == 2">
                {{ $translateTitle('product.groupgateway') }}
              </span>
              <span v-else-if="row.nodeType == 0">
                {{ $translateTitle('product.equipment') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            sortable
            prop="nodeType"
            width="auto"
            :label="$translateTitle('product.classification')"
          >
            <template #default="{ row }">
              <span>
                {{ row.category ? row.category.name : '' }}
              </span>
            </template>
          </el-table-column>
          <!--          <el-table-column :label="$translateTitle('product.producttemplet')">-->
          <!--            <template #default="{ row }">-->
          <!--              <span>-->
          <!--                {{ row.producttemplet ? row.producttemplet.name : '' }}-->
          <!--              </span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            sortable
            prop="createdAt"
            width="auto"
            :label="$translateTitle('product.addingtime')"
          >
            <template #default="{ row }">
              <span>{{ utc2beijing(row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            ref="rightCol"
            :label="$translateTitle('developer.operation')"
            fixed="right"
            width="auto"
            min-width="160"
          >
            <template #default="{ row, $index }">
              <el-button
                :underline="false"
                size="mini"
                type="primary"
                style="margin-left: 10px"
                @click="deviceToDetail(row)"
              >
                {{ $translateTitle('product.config') }}
              </el-button>
              <el-button
                :underline="false"
                size="mini"
                type="warning"
                @click="editorDict(row.objectId)"
              >
                {{ $translateTitle('product.dict') }}
              </el-button>

              <el-button size="mini" @click="goKonva(row.objectId)">
                {{ $translateTitle('concentrator.konva') }}
              </el-button>

              <el-button
                :underline="false"
                size="mini"
                type="success"
                @click="editorProduct(row)"
              >
                {{ $translateTitle('concentrator.edit') }}
              </el-button>

              <el-button
                size="mini"
                type="danger"
                @click="makeSure(row, $index)"
              >
                {{ $translateTitle('task.Delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="elpagination" style="margin-top: 20px">
          <el-pagination
            :page-size="length"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="productCurrentChange"
            @size-change="productSizeChange"
          />
        </div>
      </el-card>
    </div>
    <div class="devproduct-prodialog">
      <!-- 创建产品对话框 ###-->
      <el-drawer
        v-drawerDrag
        :before-close="handleClose"
        :close-on-click-modal="false"
        :title="moduleTitle"
        :visible.sync="dialogFormVisible"
        append-to-body
        size="80%"
        top="5vh"
      >
        <el-alert
          v-show="!currentDepartment.name"
          :closable="false"
          description="请先选择部门后,再来新增产品"
          title="温馨提示"
          type="success"
        />
        <div class="devproduct-prodialog-content">
          <!--产品信息-->
          <div class="contentone">
            <div style="display: flex">
              <span>
                {{ $translateTitle('product.productinformation') }}
              </span>
              <p
                style="
                  flex-grow: 2;
                  width: auto;
                  height: 1px;
                  margin: 10px;
                  border-top: 1px dashed #dddddd;
                "
              />
            </div>
            <el-form
              :key="form.type"
              ref="form"
              :label-width="
                $translateTitle('product.productname') == '产品名称'
                  ? '120px'
                  : '160px'
              "
              :model="form"
              :rules="rules"
            >
              <el-form-item
                :label="$translateTitle('product.productname')"
                prop="name"
              >
                <el-input
                  :disabled="custom_status == 'edit'"
                  v-model="form.name"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item
                :label="$translateTitle('product.device manufacturer')"
                prop="devType"
              >
                <el-input
                  :disabled="custom_status == 'edit'"
                  v-model="form.devType"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item
                :label="$translateTitle('product.classification')"
                :prop="form.type == 0 ? '' : 'categoryname'"
              >
                <el-row :gutter="24" v-if="custom_status != 'edit'">
                  <el-col :span="10">
                    <el-radio-group
                      v-model="form.type"
                      :disabled="custom_status == 'edit'"
                    >
                      <el-radio :label="1">
                        {{ $translateTitle('product.Standard category') }}
                      </el-radio>
                      <el-radio :label="0">
                        {{ $translateTitle('product.Custom category') }}
                      </el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="13" style="padding: 0" v-if="form.type == 1">
                    <el-input v-model="form.categoryname" readonly>
                      <el-icon
                        slot="append"
                        class="el-icon-edit el-input__icon"
                        size="mini"
                        @click.native="handlecateClick"
                      />
                    </el-input>
                  </el-col>
                </el-row>
                <span v-else>{{ product.category.name }}</span>
              </el-form-item>
              <el-form-item
                :label="$translateTitle('product.Storage channel')"
                prop="tdchannel"
              >
                <el-select
                  v-model="form.tdchannel"
                  :placeholder="$translateTitle('task.Select')"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in tdchannelList"
                    :key="item.objectId"
                    :label="item.name"
                    :value="item.objectId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$translateTitle('product.taskchannel')"
                prop="taskchannel"
              >
                <el-select
                  v-model="form.taskchannel"
                  :placeholder="$translateTitle('task.Select')"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in taskchannelList"
                    :key="item.objectId"
                    :label="item.name"
                    :value="item.objectId"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                :label="$translateTitle('product.Acquisition channel')"
                prop="otherchannel"
              >
                <el-select
                  v-model="form.otherchannel"
                  :placeholder="$translateTitle('task.Select')"
                  multiple
                  style="width: 100%"
                  value-key="objectId"
                >
                  <el-option
                    v-for="item in otherchannelList"
                    :key="item.objectId"
                    :label="item.name"
                    :value="item.objectId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-show="custom_status != 'edit'"
                :label="$translateTitle('product.Current department')"
                :prop="custom_status != 'edit' ? 'relationApp' : ''"
              >
                <el-input
                  v-model="form.relationApp"
                  :placeholder="$translateTitle('product.Current department')"
                  readonly
                />
              </el-form-item>
              <el-form-item
                :label="$translateTitle('product.nodetype')"
                prop="nodeType"
              >
                <el-radio-group v-model="form.nodeType">
                  <el-radio :label="3">
                    {{ $translateTitle('product.direct') }}
                  </el-radio>
                  <el-radio :label="1">
                    {{ $translateTitle('product.gateway') }}
                  </el-radio>
                  <el-radio :label="2">
                    {{ $translateTitle('product.groupgateway') }}
                  </el-radio>
                  <el-radio :label="0">
                    {{ $translateTitle('product.equipment') }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                :label="$translateTitle('product.networking')"
                prop="netType"
              >
                <el-select
                  v-model="form.netType"
                  :placeholder="$translateTitle('product.selectgateway')"
                >
                  <el-option
                    v-for="(item, index) in channel"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$translateTitle('menu.icon')" prop="icon">
                <div v-if="imageUrl">
                  <img :src="$FileServe + imageUrl" class="avatar" />
                  <el-button
                    size="mini"
                    style="vertical-align: text-bottom"
                    type="danger"
                    @click.stop="deleteImgsrc"
                  >
                    删除
                  </el-button>
                </div>
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                  @click="uploadCkick('product_ico')"
                />
                <form
                  ref="uploadform"
                  enctype="multipart/form-data"
                  method="POST"
                  style="position: absolute; visibility: hidden"
                >
                  <input
                    style="
                      position: relative;
                      z-index: 5;
                      width: 100px;
                      height: 100px;
                      cursor: pointer;
                      opacity: 0;
                    "
                    type="file"
                    @change="upload($event)"
                  />
                </form>
                <br />
              </el-form-item>
              <el-form-item
                :label="$translateTitle('developer.describe')"
                prop="desc"
              >
                <el-input v-model="form.desc" type="textarea" />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="devproduct-prodialog-footer">
          <el-button type="primary" @click.native="submitForm()">
            {{ $translateTitle('developer.determine') }}
          </el-button>
          <el-button @click="handleCloseDialogForm()">
            {{ $translateTitle('developer.cancel') }}
          </el-button>
        </div>
        <!-- 分类对话框 ###-->
        <el-drawer
          :append-to-body="true"
          :visible.sync="cascaderDrawer"
          size="40%"
        >
          <div>
            <el-row :gutter="20">
              <el-col :span="24">
                <vab-query-form>
                  <vab-query-form-top-panel>
                    <el-form
                      :inline="true"
                      label-width="100px"
                      @submit.native.prevent
                    >
                      <el-form-item
                        :label="$translateTitle('product.classification')"
                      >
                        <el-select
                          v-model="queryForm.category"
                          :placeholder="$translateTitle('task.Select')"
                          style="width: 100%"
                          @change="handleCateSearch"
                        >
                          <el-option
                            v-for="(item, index) in categoryList"
                            :key="index"
                            :label="item.name"
                            :value="item.objectId"
                          />
                        </el-select>
                      </el-form-item>

                      <el-form-item
                        :label="$translateTitle('developer.Templatename')"
                      >
                        <el-input
                          v-model="queryForm.name"
                          clearable
                          placeholder="请输入模板名称"
                        />
                      </el-form-item>
                      <el-form-item label-width="0">
                        <el-button
                          class="el-icon-search"
                          native-type="submit"
                          type="primary"
                          @click="queryprodut({})"
                        />
                      </el-form-item>
                    </el-form>
                  </vab-query-form-top-panel>
                </vab-query-form>
              </el-col>
            </el-row>
            <el-table
              :cell-style="{ 'text-align': 'center' }"
              :data="tableData"
              :header-cell-style="{ 'text-align': 'center' }"
              :height="$baseTableHeight(0) + 40"
              border
              size="mini"
              style="width: 100%"
            >
              <el-table-column
                :label="$translateTitle('developer.Templatename')"
                align="center"
              >
                <template #default="{ row }">
                  {{ row.name }}
                  <el-popover placement="left" trigger="click" width="800">
                    <dgiot-profile ref="profile" :is-product="true" />
                    <i
                      slot="reference"
                      class="el-icon-info"
                      @click="referenceHandle(row)"
                    ></i>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('department.category')"
                prop="categoryname"
              >
                <template #default="{ row }">
                  {{ row.category.name }}
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.operation')"
                align="center"
              >
                <template #default="{ row }">
                  <el-button
                    size="mini"
                    type="text"
                    @click="chooseTemplate(row)"
                  >
                    {{ $translateTitle('product.choose') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <vab-Pagination
              v-show="queryForm.total > 0"
              :limit.sync="queryForm.pageSize"
              :page.sync="queryForm.pageNo"
              :total="queryForm.total"
              @pagination="categorytree"
            />
          </div>
        </el-drawer>
      </el-drawer>
      <el-dialog :append-to-body="true" :visible.sync="dialogProfile" top="1vh">
        <dgiot-profile ref="dialogProfile" :is-product="true" />
      </el-dialog>
      <!--新增字典-->
      <a-drawer
        v-if="dictVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        :title="title_temp_dialog"
        :visible="dictVisible"
        style="z-index: 999"
        width="60%"
        @close="dictVisible = !dictVisible"
      >
        <el-form
          ref="dictTempForm"
          :model="dictTempForm"
          :rules="rule"
          size="mini"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                :label-width="formLabelWidth"
                label="字典模板名称"
                prop="name"
              >
                <el-input v-model="dictTempForm.name" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label-width="formLabelWidth"
                label="字典模板类型"
                prop="cType"
              >
                <el-input v-model="dictTempForm.cType" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label-width="formLabelWidth"
                label="字典模板状态"
                prop="enable"
              >
                <el-radio v-model="dictTempForm.enable" border label="1">
                  启用
                </el-radio>
                <el-radio v-model="dictTempForm.enable" border label="0">
                  禁用
                </el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item :label-width="formLabelWidth" label="字典模板数据">
            <el-tabs v-model="elactiveName">
              <el-tab-pane label="Table" name="Table">
                <el-button
                  class="mt-3"
                  icon="el-icon-plus"
                  size="small"
                  type="primary"
                  @click.native="addRow(dictTempForm.params)"
                >
                  新 增
                </el-button>

                <el-table
                  :data="dictTempForm.params"
                  :height="height"
                  style="width: 100%; text-align: center"
                >
                  <el-table-column label="序号" prop="order" />
                  <el-table-column label="标识符" prop="identifier" />
                  <el-table-column label="功能名称" prop="name" />
                  <el-table-column label="数据类型" prop="type" />
                  <el-table-column label="数据地址" prop="address" />
                  <el-table-column label="数据长度" prop="bytes" />
                  <el-table-column label="是否必填" prop="required">
                    <template #default="{ row }">
                      <span v-if="row.required">是</span>
                      <span v-else>否</span>
                    </template>
                  </el-table-column>
                  <!--                  <el-table-column prop="readonly" label="是否只读">-->
                  <!--                    <template #default="{ row }">-->
                  <!--                      <span v-if="row.readonly">是</span>-->
                  <!--                      <span v-else>否</span>-->
                  <!--                    </template>-->
                  <!--                  </el-table-column>-->
                  <el-table-column align="center" label="操作" width="160">
                    <template #default="{ row, $index }">
                      <el-button
                        plain
                        size="mini"
                        title="删除"
                        type="danger"
                        @click.native="delRow($index, dictTempForm.params)"
                      >
                        删除
                      </el-button>
                      <el-button
                        plain
                        size="mini"
                        title="编辑"
                        type="info"
                        @click.native="editRow($index, dictTempForm.params)"
                      >
                        编辑
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="Json" name="Json">
                <vab-json-editor
                  v-model="dictTempForm.params"
                  :mode="'code'"
                  lang="zh"
                  @has-error="onError"
                />
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="描述">
            <el-input
              v-model="dictTempForm.description"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入描述"
              type="textarea"
            />
          </el-form-item>

          <el-form-item size="mini" style="text-align: center">
            <el-button
              type="primary"
              @click.native="onJsonSave('dictTempForm')"
            >
              提交
            </el-button>
            <el-button @click="dictVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </a-drawer>
      <!--新增字典数据-->
      <el-dialog
        :append-to-body="true"
        :before-close="closeDict"
        :close-on-click-modal="false"
        :title="title_dict_edit_dialog"
        :visible.sync="edit_dict_temp_dialog"
        top="5vh"
        width="60%"
        @open="opendialog('tempparams')"
      >
        <el-form
          ref="tempparams"
          :model="tempparams"
          label-position="left"
          label-width="100px"
          size="mini"
        >
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="序号" prop="order">
                <el-input v-model.number="tempparams.order" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$translateTitle('product.identifier')"
                prop="identifier"
              >
                <el-input v-model="tempparams.identifier" />
              </el-form-item>
              <!--type-->
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item
                :label="$translateTitle('product.functionname')"
                prop="name"
              >
                <el-input v-model="tempparams.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$translateTitle('product.datatype')"
                prop="type"
              >
                <el-select
                  v-model="tempparams.type"
                  placeholder="请选择"
                  style="width: 100%"
                  @change="tempTypeChange"
                >
                  <!--                  <el-option-->
                  <!--                    :label="$translateTitle('product.struct')"-->
                  <!--                    value="struct"-->
                  <!--                  />-->
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
                  <el-option label="switch" value="switch" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <!-- 单位 -->
              <el-form-item :label="$translateTitle('product.unit')">
                <el-select
                  v-model="tempparams.unit"
                  :placeholder="$translateTitle('product.unit')"
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in allunit"
                    :key="index"
                    :label="item.data.Name + '/' + item.data.Symbol"
                    :value="item.data.Symbol"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="协议类型">
                <el-select
                  v-model="tempparams.protocol"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in [
                      'normal',
                      'modbus',
                      'mingcheng',
                      'xinchuangwei',
                      'hex',
                    ]"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="tempparams.protocol == 'modbus'" :gutter="24">
            <el-col :span="12">
              <el-form-item label="数据格式">
                <el-select
                  v-model="tempparams.originaltype"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in [
                      { value: 'bit', label: '位' },
                      { value: 'short16_AB', label: '16位 有符号(AB)' },
                      { value: 'short16_BA', label: '16位 有符号(BA)' },
                      { value: 'ushort16_AB', label: '16位 无符号(AB)' },
                      { value: 'ushort16_BA', label: '16位 无符号(BA)' },
                      { value: 'long32_ABCD', label: '32位 有符号(ABCD)' },
                      { value: 'long32_CDAB', label: '32位 有符号(CDAB)' },
                      { value: 'ulong32_ABCD', label: '32位 无符号(ABCD)' },
                      { value: 'ulong32_CDAB', label: '32位 无符号(CDAB)' },
                      { value: 'float32_ABCD', label: '32位 浮点数(ABCD)' },
                      { value: 'float32_CDAB', label: '32位 浮点数(CDAB)' },
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-table
            v-show="tempparams.protocol == 'modbus'"
            :data="dataList"
            :height="height"
            border
            size="small"
            style="width: 100%"
          >
            <el-table-column
              align="center"
              label="从机地址(16进制加0X,例:0X10,否则是十进制)"
              min-width="120"
            >
              <!--关键代码-->
              <template #default="{ row }">
                <el-input v-model="tempparams.slaveid" />
                <span v-show="false">{{ row }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="寄存器状态" min-width="120">
              <!--关键代码-->
              <template #default="{ row }">
                <el-select
                  v-model="tempparams.operatetype"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in [
                      {
                        value: 'writeCoil',
                        label: '0X05:写单个线圈寄存器',
                      },
                      {
                        value: 'writeHreg',
                        label: '0X06:写单个保持寄存器',
                      },
                      {
                        value: 'writeCoils',
                        label: '0X0f:写多个线圈寄存器',
                      },
                      {
                        value: 'writeHregs',
                        label: '0X10:写多个保持寄存器',
                      },
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span v-show="false">{{ row.slaveid }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="数据地址(16进制加0X,例:0X10,否则是十进制)"
              min-width="120"
            >
              <!--关键代码-->
              <template #default="{ row }">
                <el-input v-model="tempparams.address" />
                <span v-show="false">{{ row.slaveid }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="
                tempparams.operatetype == 'writeCoils' ||
                tempparams.operatetype == 'writeHregs'
              "
              align="center"
              label="寄存器个数"
              min-width="120"
            >
              <!--关键代码-->
              <template #default="{ row }">
                <el-input v-model="tempparams.registersnumber" />
                <span v-show="false">{{ row.slaveid }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="写入字节数" min-width="120">
              <!--关键代码-->
              <template #default="{ row }">
                <el-input v-model="tempparams.bytes" />
                <span v-show="false">{{ row.slaveid }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-row v-show="tempparams.protocol != 'modbus'" :gutter="24">
            <el-col :span="12">
              <el-form-item label="数据地址">
                <el-input v-model="tempparams.address" placeholder="数据地址" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据长度">
                <el-input
                  v-model.number="tempparams.bytes"
                  placeholder="数据长度（字节）"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-tooltip
                effect="dark"
                placement="right-start"
                style="float: left"
              >
                <div slot="content">
                  1. 采集值 设备上行数据经采集公式计算后显示 。
                  <br />

                  公式中的%s为占位符，是固定字段。
                  <br />

                  如：
                  <br />

                  加：%s+10
                  <br />

                  减：%s-10
                  <br />

                  乘：%s*10
                  <br />

                  除：%s/10
                  <br />

                  余数：%s%10
                  <br />
                </div>
                <i class="el-icon-question" />
              </el-tooltip>
              <el-form-item label="采集公式">
                <el-input
                  v-model="tempparams.collection"
                  :rows="1"
                  style="width: 100%"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-tooltip
                effect="dark"
                placement="right-start"
                style="float: left"
              >
                <div slot="content">
                  1. 设置值 平台下行数据经设置公式计算后设置 。
                  <br />
                  公式中的%s为占位符，是固定字段。
                  <br />

                  如：
                  <br />

                  加：%s+10
                  <br />

                  减：%s-10
                  <br />

                  乘：%s*10
                  <br />

                  除：%s/10
                  <br />

                  余数：%s%10
                  <br />
                </div>
                <i class="el-icon-question" />
              </el-tooltip>
              <el-form-item label="设置公式">
                <el-input
                  v-model="tempparams.setting"
                  :rows="1"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="必填">
                <el-radio v-model="tempparams.required" :label="true" border>
                  是
                </el-radio>
                <el-radio v-model="tempparams.required" :label="false" border>
                  否
                </el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="只读">
                <el-radio v-model="tempparams.readonly" :label="true" border>
                  是
                </el-radio>
                <el-radio v-model="tempparams.readonly" :label="false" border>
                  否
                </el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="列表显示">
                <el-radio v-model="tempparams.isshow" :label="true" border>
                  是
                </el-radio>
                <el-radio v-model="tempparams.isshow" :label="false" border>
                  否
                </el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item v-if="tempparams.type == 'switch'" label="开">
                <el-input v-model="tempparams.activevalue" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="tempparams.type == 'switch'" label="关">
                <el-input v-model="tempparams.inactivevalue" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            v-if="tempparams.type != 'enum' && tempparams.type != 'switch'"
            label="默认值"
            prop="default"
          >
            <el-select
              v-if="tempparams.type == 'bool'"
              v-model="tempparams.default"
              class="notauto"
              readonly
            >
              <el-option :value="true" label="是" />
              <el-option :value="false" label="否" />
            </el-select>
            <el-input
              v-else-if="tempparams.type == 'int'"
              v-model.number="tempparams.default"
            />
            <el-input v-else v-model="tempparams.default" />
          </el-form-item>
          <el-form-item v-if="tempparams.type == 'enum'" label="Enum数据">
            <el-tabs v-model="elactiveName1">
              <el-tab-pane label="Table" name="Table1">
                <!--枚举型添加格式-->
                <el-button
                  class="mt-3"
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  @click.native="addDomain"
                >
                  新 增
                </el-button>
                <el-table
                  :data="tempparams.specs"
                  :height="height"
                  style="width: 100%; text-align: center"
                >
                  <el-table-column align="center" label="属性">
                    <template #default="{ row }">
                      <el-input v-model="row.attribute" />
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="属性值">
                    <template #default="{ row }">
                      <el-input v-model="row.attributevalue" />
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作">
                    <template #default="{ row }">
                      <el-button
                        plain
                        size="mini"
                        title="删除"
                        type="danger"
                        @click.native="removeDomain(row)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.native="submitFormTempDict()">
              提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div class="import-dialog">
      <el-dialog
        :append-to-body="true"
        :visible.sync="importDialogShow"
        title="导入产品"
        width="25%"
      >
        <el-form ref="uploadProForm" :model="formPro">
          <el-upload
            ref="fileUpload"
            :action="uploadAction"
            :auto-upload="false"
            :data="uploadData"
            :file-list="fileList"
            :headers="uploadHeaders"
            :on-change="handleChange"
            :on-error="handleUploadError"
            :on-success="handleUploadSuccess"
            :with-credentials="true"
            accept=".xls, .xlsx, .zip"
            class="upload-demo"
          >
            <el-button slot="trigger" size="small" type="primary">
              选泽文件
            </el-button>
          </el-upload>

          <!-- </el-row> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            class="btn-left"
            size="small"
            type="primary"
            @click="submitUpload"
          >
            上 传
          </el-button>

          <el-button
            class="btn-right"
            size="small"
            @click="importDialogShow = false"
          >
            取 消
          </el-button>
        </div>
      </el-dialog>
    </div>
    <VabRender v-show="false" :config="config" :loading="true" />
  </div>
</template>
<!--eslint-disable-->
<script>
  // import Pagination from '@dgiot/dgiot-component/src/components/Pagination'
  import profile from '@/views/DeviceCloud/manage/profile'
  import { uuid } from '@/utils'
  import { queryChannel } from '@/api/Channel/index'
  import { mapGetters } from 'vuex'
  import { delProduct, getProduct, putProduct } from '@/api/Product'
  import { getAllunit } from '@/api/Dict/index'
  import { queryDevice } from '@/api/Device/index'
  import { getServer } from '@/api/Role/index'
  import { postDict } from '@/api/Dict'
  import { getHashClass } from '@/api/Hash'
  import { ExportParse, ImportParse } from '@/api/Export'
  import { queryProductTemplet } from '@/api/ProductTemplet'
  import { getCategory, queryCategory } from '@/api/Category'

  const context = require.context('./component/profile', true, /\.vue$/)
  let res_components = {}
  context.keys().forEach((fileName) => {
    let comp = context(fileName)
    res_components[fileName.replace(/^\.\/(.*)\.\w+$/, '$1')] = comp.default
  })

  export default {
    components: {
      'dgiot-profile': profile,
      ...res_components,
    },
    data() {
      return {
        inputParams: {},
        storageArr: [
          '默认-行式存储',
          '默认-列式存储',
          'InfluxDB-行式存储',
          'InfluxDB-列式存储',
          'TDEngine-列式存储',
        ], // http://doc.jetlinks.cn/best-practices/start.html#tdengine-%E5%88%97%E5%BC%8F%E5%AD%98%E5%82%A8
        channeltype: '2', // 1，采集 2，存储 任务
        channeldialog: false,
        channelResource: [],
        selectedRow: {},
        tableData: [],
        product: {},
        allTemp: [],
        category: [],
        descriptions: {
          tableType: 'things',
          things: [],
          productId: '',
          dictTableList: [],
          decoderTableList: {},
          productDetail: {
            decoder: { code: '' },
            thing: { properties: [] },
            config: {
              parser: [],
              profile: [],
              basedate: { params: [] },
            },
          },
          parserTableList: [],
          tableLoading: false,
        },
        queryForm: {
          name: '',
          category: '',
          productId: '',
          productFlag: false,
          pageNo: 1,
          pageSize: 20,
          searchDate: [],
          limt: 10,
          skip: 0,
          total: 0,
          order: '-createdAt',
          keys: 'count(*)',
        },
        cascaderDrawer: false,
        drawerWidth: Number($(window).width()) - 240,
        height: this.$baseTableHeight(0),
        config: {},
        dataList: [{}],
        parserView: false,
        parserTable: false,
        parserTableList: { parser: [] },
        parserFromId: '',
        dialogVisible: false,
        moduleTitle: this.$translateTitle('product.createproduct'),
        allunit: [],
        productInfo: {},
        edit_dict_temp_dialog: false,
        title_dict_edit_dialog: '新增字典数据',
        tempparams: {
          name: '',
          identifier: '',
          type: '',
          order: 0,
          address: '',
          bytes: '',
          registersnumber: '',
          default: 0,
          required: false,
          readonly: true,
          specs: [
            {
              attribute: '',
              attributevalue: '',
            },
          ],
          struct: {},
          unit: '',
          inactivevalue: '',
          activevalue: '',
        },
        elactiveName: 'Table',
        elactiveName1: 'Table1',
        editDictTempId: '',
        title_temp_dialog: '',
        dictTempForm: '',
        rule: [],
        dictVisible: false,
        listLoading: false,
        custom_row: {},
        custom_status: 'add',
        hashkey: '',
        length: 10,
        total: 0,
        start: 0,
        activeName: 'first',
        formInline: {
          productname: '',
        },
        uploadHeaders: {
          sessionToken: Cookies.get('access_token'),
        },
        uploadAction: '',
        uploadData: {},
        fileList: [],
        productIdentifier: '',
        proTableData: [],
        formLabelWidth: '120px',
        dialogFormVisible: false,
        importDialogShow: false,
        cType: '',
        form: {
          type: 1,
          storageStrategy: '',
          name: '',
          tdchannel: '7b290e5a0a',
          category: '',
          taskchannel: '6c48effac2',
          otherchannel: [],
          nodeType: 3,
          desc: '',
          netType: '',
          devType: '',
          categoryid: '',
          producttempid: '',
          productSecret: '',
          roles: [],
          relationApp: '',
        },
        taskchannelList: [],
        tdchannelList: [],
        otherchannelList: [],
        formPro: {
          name: '',
          url: '',
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入产品',
              trigger: 'blur',
            },
          ],
          tdchannel: [
            {
              required: true,
              message: '请选择存储通道',
              trigger: 'blur',
            },
          ],
          storageStrategy: [
            {
              required: true,
              message: '请选择存储策略',
              trigger: 'blur',
            },
          ],
          taskchannel: [
            {
              required: true,
              message: '请选择任务通道',
              trigger: 'blur',
            },
          ],
          otherchannel: [
            {
              required: true,
              message: '请选择采集通道',
              trigger: 'blur',
            },
          ],
          devType: [
            {
              required: true,
              message: '请输入设备厂家',
              trigger: 'blur',
            },
          ],
          categoryname: [
            {
              required: true,
              message: '请选择所属分类',
              trigger: 'change',
            },
          ],
          nodeType: [
            {
              required: true,
              message: '请选择节点类型',
              trigger: 'change',
            },
          ],
          netType: [
            {
              required: true,
              message: '请选择联网方式',
              trigger: 'change',
            },
          ],
          relationApp: [
            {
              required: true,
              message: '请选择产品可见角色',
              trigger: 'change',
            },
          ],
        },
        option: [],
        ruleoptions: [],
        channel: [
          {
            label: '蜂窝(2G/3G/4G)',
            value: 'CELLULAR',
          },
          {
            label: 'NB-IOT通道',
            value: 'NB-IOT',
          },
          {
            label: 'BLE(低功耗蓝牙)',
            value: 'Bluetooth',
          },
          {
            label: '5G通道(直连)',
            value: '5G',
          },
          {
            label: 'WIFI通道(直连)',
            value: 'WIFI',
          },
          {
            label: 'ZigBee通道',
            value: 'ZigBee',
          },
          {
            label: 'Modbus',
            value: 'Modbus',
          },
          {
            label: 'LoRa(WAN)(直连)',
            value: 'LoRaWAN',
          },
          {
            label: 'OPC UA',
            value: ' OPC UA',
          },
          {
            label: 'ZETA通道',
            value: 'ZETA',
          },
          {
            label: '网线连接(直连)',
            value: '网线连接',
          },
          {
            label: '自定义',
            value: 'OTHER',
          },
        ],
        dialogProfile: false,
        imageUrl: '',
        selectfromtype: '',
        productid: '',
        parserDict: [],
        formConfig: {},
        editIndex: 0,
        Parserzh: '',
        parseren: '',
        loading: false,
        categoryList: [],
        fileServer: '',
        access_token: '',
        projectid: '',
        projectName: '',
        allTableDate: [],
        showTree: false,
        showcateTree: false,
        multipleSelection: [],
      }
    },
    computed: {
      ...mapGetters({
        defaultKonva: 'topo/defaultKonva',
        token: 'user/token',
        currentDepartment: 'user/currentDepartment',
      }),
    },
    mounted() {
      const { project = '' } = this.$route.query
      this.formInline.productname = project
      this.Get_Re_Channel()
      this.queryprodut({})
      this.searchProduct(0)
    },
    beforeDestroy() {
      this.projectName = ''
    },
    methods: {
      async handleIconClick(ev) {
        this.dialogProfile = !this.dialogProfile
        await this.$refs.dialogProfile.StepsListRowClick(this.selectedRow)
      },
      handlecateClick() {
        this.categorytree()
        this.cascaderDrawer = true
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        let vals = []
        dgiotlog.log(
          'multipleSelection',
          this.multipleSelection,
          this.selectfromtype
        )
        if (!_.isObject(val)) {
          val.forEach((v) => {
            vals.push(v.objectId)
          })
        }

        if (this.selectfromtype == 'otherchannel') {
          this.form[this.selectfromtype] = vals
        } else {
          dgiotlog.log(this.cType)
          this.form[this.selectfromtype] = val.objectId
        }
        dgiotlog.log('multipleSelection', this.form)
      },
      async getResource(text, type, cType) {
        this.cType = cType
        this.selectfromtype = text
        this.channeltype = type
      },
      getChannel(channelResource, type, cType) {
        let res = {}
        if (cType == '') {
          res = channelResource.filter(function (item) {
            return item.type == type
          })
        } else {
          res = channelResource.filter(function (item) {
            return item.type == type && item.cType == cType
          })
        }
        return res
      },
      async Get_Re_Channel() {
        const params = {
          count: 'objectId',
          order: '-createdAt',
          keys: 'count(*)',
          where: {},
        }
        const { results } = await queryChannel(params)
        this.channelResource = results
        this.taskchannelList = this.getChannel(results, '2', 'INSTRUCT')
        this.tdchannelList = this.getChannel(results, '2', 'TD')
        this.otherchannelList = this.getChannel(results, '1', '')
      },
      async referenceHandle(row) {
        await this.$refs.profile.StepsListRowClick(row)
      },
      async queryprodut(args) {
        const categorys = args.categorys
        const loading = this.$baseColorfullLoading()
        if (!args.limit) {
          args = this.queryForm
        }
        let params = {
          limit: args.limit,
          order: args.order,
          skip: args.skip,
          keys: args.keys,
          include: 'category',
          where: {
            category: categorys ? { $in: categorys } : { $ne: null },
            name: args.name
              ? {
                  $regex: args.name,
                  $options: 'i',
                }
              : { $ne: null },
          },
        }
        try {
          const { results = [], count = 0 } = await queryProductTemplet(params)
          loading.close()
          this.tableData = results
          this.queryForm.total = count
        } catch (error) {
          loading.close()
          dgiotlog.log(error)
          this.$message.error(`${error}`)
        }
      },
      goKonva(id) {
        this.$router.push({
          path: '/Topo?productid',
          query: {
            productid: id,
          },
        })
      },
      uploadCkick(type) {
        this.loading = true
        // 触发子组件的点击事件
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
        this.inputParams = {
          file: '',
          scene: 'app',
          path: 'product/ico/',
          filename: `${this.productid}.${type}`,
        }
      },
      fileInfo(info) {
        dgiotlog.log('info', info)
        this.imageUrl = info.path
        this.loading = false
      },
      files(file, type) {
        this.inputParams.filename = `${this.productid}.${type}`
        this.inputParams.file = file
      },
      async getAllunit() {
        this.allunit = []
        const { results } = await getAllunit('unit', 200)
        this.allunit = results.concat([])
      },
      submitEnum() {
        if (this.tempparams.type == 'Enum') {
          this.tempparams.specs.map((items) => {
            var newkey = items['attribute']
            this.tempparams.struct[newkey] = items['attributevalue']
          })
        }
      },
      // 添加枚举型
      addDomain() {
        this.tempparams.specs.push({
          attribute: '',
          attributevalue: '',
        })
      },
      // 删除枚举型
      removeDomain(item) {
        var index = this.tempparams.specs.indexOf(item)
        if (index !== -1) {
          this.tempparams.specs.splice(index, 1)
        }
      },
      delRow(index, rows) {
        rows.splice(index, 1)
        // this.onJsonSave("dictTempForm");
      },
      editRow(row, index, params) {
        this.editIndexId = index
        this.title_dict_edit_dialog = '修改字典数据'
        this.edit_dict_temp_dialog = true
        this.tempparams = row
      },
      closeDict() {
        this.edit_dict_temp_dialog = !this.edit_dict_temp_dialog
        // this.$refs.tempparams.resetFields()
      },
      onJsonSave(formName) {
        // 点击保存触发
        // dgiotlog.log("onJsonSave", this.dictTempForm.params);
        this.$refs[formName].validate((valid) => {
          dgiotlog.log(this.editDictTempId)
          if (valid) {
            this.put_Dict_temp(this.editDictTempId, this.dictTempForm)
          }
        })
      },
      async put_Dict_temp(editDictId, row) {
        dgiotlog.log(row)
        const {
          config = {
            basedate: {},
          },
        } = this.productInfo
        config.basedate = row
        const params = {
          config: config,
        }
        const { updatedAt } = await putProduct(editDictId, params)
        if (updatedAt != undefined) {
          this.dictVisible = false
          this.$message('字典数据更新成功')
        } else {
          this.$message('字典数据更新失败')
        }
      },
      submitFormTempDict() {
        this.submitEnum()
        this.edit_dict_temp_dialog = false
        if (this.editIndexId != undefined) {
          this.dictTempForm.params[this.editIndexId] = this.tempparams
          this.$message('编辑成功')
        } else {
          this.dictTempForm.params.push(this.tempparams)
          this.$message('新增成功')
        }
      },
      opendialog(name) {
        this.$nextTick(() => {
          this.$refs[name].clearValidate()
        })
      },
      tempTypeChange(value) {
        if (value == 'bool') {
          this.tempparams.default = true
          this.tempparams.default = true
        } else if (value == 'int') {
          this.tempparams.default = 0
        } else {
          this.tempparams.default = undefined
        }
      },
      addRow(tabs) {
        this.editIndexId = undefined
        this.title_dict_edit_dialog = '新增字典数据'
        this.edit_dict_temp_dialog = true
        this.tempparams = {
          name: '',
          identifier: '',
          type: '',
          order: 0,
          address: '',
          bytes: '',
          registersnumber: '',
          default: 0,
          required: false,
          readonly: true,
          specs: [
            {
              attribute: '',
              attributevalue: '',
            },
          ],
          struct: {},
          collection: '%s',
          setting: '%s',
          unit: '',
        }
      },
      onError() {
        this.$message('非Json数据类型')
      },
      selectApp(val) {
        if (!val) {
          return
        }
        getServer(val).then((resultes) => {
          if (resultes) {
            this.fileServer = resultes.file
            this.access_token = resultes.access_token
          }
        })
      },
      treeData(paramData) {
        const cloneData = JSON.parse(JSON.stringify(paramData)) // 对源数据深度克隆
        return cloneData.filter((father) => {
          const branchArr = cloneData.filter(
            (child) => father.objectId == child.parent.objectId
          ) // 返回每一项的子级数组
          branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
          return father.parent.objectId == 0 // 返回第一层
        })
      },
      deleteImgsrc() {
        // event.stopPropagation()
        this.imageUrl = ''
      },
      dataURItoBlob(dataURI) {
        // base64 解码
        var byteString = atob(dataURI.split(',')[1])
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length)
        var ia = new Uint8Array(ab)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ab], {
          type: mimeString,
        })
      },
      submitUpload() {
        // this.uploadAction = Cookies.get('apiserver') + '/product?appid=' + Cookies.get("appids");

        this.uploadAction = '/product'
        // this.uploadAction = 'http://cad.iotn2n.com:5080/product?appid=' + Cookies.get("appids");

        this.$nextTick(() => {
          // dgiotlog.log('uploadHeaders',this.uploadHeaders);

          this.uploadData.appid = Cookies.get('appids')
          // this.uploadData.key = "key";
          this.$refs.fileUpload.submit()
        })
      },
      handleUploadSuccess(response, file, fileList) {
        // dgiotlog.log('### Success response', response)
        this.$message({
          type: 'success',
          message: '产品导入成功',
        })
        this.importDialogShow = false
        this.$refs['uploadProForm'].resetFields()
        this.searchProduct()
      },
      handleUploadError(err, file, fileList) {
        this.$message({
          showClose: true,
          message: err,
        })
      },
      handleChange(file, fileList) {
        if (fileList.length > 0) {
          this.fileList = [fileList[fileList.length - 1]] // 展示最后一次选择的文件
        }
      },
      utc2beijing(utc_datetime) {
        // 转为正常的时间格式 年-月-日 时:分:秒
        var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '')
        return date // 2017-03-31 16:02:06
      },
      async searchProduct(start) {
        try {
          this.listLoading = true
          if (start == 0) this.start = 0

          var category = []
          const parsms = {
            count: 'objectId',
            order: '-updatedAt',
            limit: this.length,
            skip: this.start,
            include: 'category,producttemplet',
            where: {
              name: this.formInline.productname.length
                ? { $regex: this.formInline.productname }
                : { $ne: null },
            },
          }
          const { results = [], count = 0 } = await this.$query_object(
            'Product',
            parsms
          )
          // dgiotlog.log("results", results)
          if (results) {
            results.map((items) => {
              if (
                items.category != '' &&
                items.category &&
                items.devType != 'report'
              ) {
                category.push(items.category)
              }
            })
            this.listLoading = false
            this.proTableData = results
            this.total = count
          }
        } catch (error) {
          this.listLoading = false
          dgiotlog.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error'
          )
        }
      },
      handleClose() {
        this.dialogFormVisible = false
      },
      // 选择产品模板
      async chooseTemplate(row) {
        const res = await this.getcategoryname(row.category)
        this.selectedRow = row
        this.$set(this.form, 'categoryid', row.category.objectId)
        this.$set(this.form, 'categoryname', res + '/' + row.name)
        this.$set(this.form, 'producttempid', row.objectId)
        this.form.thing = row.thing ? row.thing : {}
        this.cascaderDrawer = !this.cascaderDrawer
      },
      async getcategoryname(category) {
        const { name } = await getCategory(category.parent.objectId)
        const returnName =
          name == '所有领域' ? category.name : name + '/' + category.name
        return returnName
      },
      // 关闭dialog 事件
      handleCloseDialogForm() {
        this.dialogFormVisible = false
        // 重置表单
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
        })
      },
      properties(things, type = 'things') {
        this.descriptions.tableLoading = true
        dgiotlog.log(things)
        this.descriptions.things = things
        this.descriptions.tableType = type
        setTimeout(() => (this.descriptions.tableLoading = false), 1200)
      },
      // 添加产品弹窗
      addproduct() {
        this.custom_status = 'add'
        // return false
        this.moduleTitle = this.$translateTitle('product.createproduct')
        this.imageUrl = ''
        this.form = {
          name: '',
          type: 1,
          category: '',
          nodeType: 3,
          desc: '',
          netType: ' ',
          devType: '',
          productSecret: '',
          relationApp: this.currentDepartment.name,
          roles: [],
          categoryname: '',
        }
        this.productid = moment(new Date()).valueOf().toString()
        this.dialogFormVisible = true
      },
      getParent(id, origin, returnarr) {
        origin.map((item) => {
          if (id == item.id) {
            returnarr.unshift(item.value)
            this.getParent(item.parentid, origin, returnarr)
          } else if (item.parentid == 0 && item.id == id) {
            returnarr.unshift(item.value)
          }
        })
        this.form.category = returnarr[0]
        return returnarr
      },
      // 查找Industry父级
      getIndustryParent(type, originarr) {
        originarr.map((item) => {
          if (item.value == type) {
            this.getParent(item.id, originarr, [])
          }
        })
      },
      async editorParser(ObjectId) {
        this.parserFromId = ObjectId
        try {
          const {
            config = {
              parser: [],
            },
            thing = {},
          } = await getProduct(ObjectId)
          this.parserTableList = config
          dgiotlog.log(this.parserTableList)
          this.parserDict = _.merge(thing, config)
        } catch (e) {
          this.parserTableList = { parser: [] }
          dgiotlog.log('eeeeeeeeeeeee', e)
        }
        this.parserTable = true
      },
      editParse(index, row) {
        this.formConfig = row
        this.editIndex = index
        this.dialogVisible = true
      },
      async saveParse(list, type = -1) {
        if (type + 2 > 0) {
          this.parserTableList.parser[type] = _.merge({}, list)
        }
        try {
          const res = await putProduct(this.parserFromId, {
            config: type + 2 > 0 ? this.parserTableList : list,
          })
          this.$message.success(
            this.$translateTitle('user.Save the template successfully')
          )
          this.dialogVisible = false
          this.parserTable = false
        } catch (e) {
          this.$message.error(
            this.$translateTitle('user.Save the template error') + `${e}`
          )
          dgiotlog.log(e, 'eeee')
        }
        dgiotlog.log(list)
      },
      previewParse(row) {
        this.parserView = true
        this.formConfig = row
        dgiotlog.log('previewParse', row)
      },
      addParse(row) {
        row['parser'].push({
          name: uuid(6),
          enname: uuid(6),
          config: {},
        })
      },
      deleteParse(index, rows) {
        rows.splice(index, 1)
      },
      async editorDict(ObjectId) {
        this.getAllunit()
        const row = await getProduct(ObjectId)
        const { config = { basedate: {} } } = row
        this.productInfo = row
        dgiotlog.log(' this.parserDict', this.parserDict)
        this.editDictTempId = ObjectId
        this.dictTempForm = {
          name: '',
          cType: '',
          enable: '1',
          description: '',
          params: [],
        }
        this.title_temp_dialog = '创建字典模板'
        dgiotlog.log(config)
        if (config.basedate && config.basedate.name) {
          this.title_temp_dialog = '修改字典模板'
          this.dictTempForm = config.basedate
        }
        this.rule = {
          name: [
            {
              required: true,
              message: '请输入字典模板名称',
              trigger: 'blur',
            },
          ],
          cType: [
            {
              required: true,
              message: '请输入字典模板类型',
              trigger: 'blur',
            },
          ],
          enable: [
            {
              required: true,
              message: '请选择状态',
              trigger: 'change',
            },
          ],
        }
        dgiotlog.log(this.dictTempForm, 'config')
        this.dictVisible = true
      },
      editorProduct(row) {
        this.product = row
        this.imageUrl = ''
        this.moduleTitle = this.$translateTitle('product.editproduct')
        this.custom_status = 'edit'
        this.custom_row = row
        this.dialogFormVisible = true
        this.productid = row.objectId
        this.form.desc = row.desc
        this.form.category = row.category
        this.form.producttemplet = row.producttemplet
        this.form.config = row.config
        this.form.name = row.name
        this.form.nodeType = row.nodeType
        this.$set(this.form, 'type', row.channel ? row.channel.type : '')
        this.$set(
          this.form,
          'tdchannel',
          row.channel ? row.channel.tdchannel : ''
        )
        this.$set(
          this.form,
          'taskchannel',
          row.channel ? row.channel.taskchannel : ''
        )
        this.$set(
          this.form,
          'otherchannel',
          row.channel ? row.channel.otherchannel : []
        )
        this.$set(
          this.form,
          'storageStrategy',
          row.channel ? row.channel.storageStrategy : ''
        )
        this.form.netType = row.netType
        this.form.devType = row.devType
        this.form.categoryname = row.category ? row.category.name : ''
        this.form.productSecret = row.productSecret
        this.form.nodeType = row.nodeType
        if (row.icon) {
          this.imageUrl = row.icon
        }

        // this.form.relationApp = this.currentDepartment.name
        console.log('row', row)
        dgiotlog.log('form', this.form)
      },
      async categorytree() {
        const parsms = {
          order: 'createdAt',
          keys: 'count(*)',
          where: { level: { $in: [0, 1] } },
        }
        const { results } = await queryCategory(parsms)
        this.categoryList = results
        dgiotlog.log('this', this.categoryList)
      },
      handleCateSearch(objectId) {
        this.queryForm.category = objectId
        this.showcateTree = !this.showcateTree
        if (objectId == 'a60a85475a') {
          this.queryprodut({})
        } else {
          let params = {
            keys: 'objectId',
            where: {
              parent: {
                className: 'Category',
                objectId: objectId,
                __type: 'Pointer',
              },
            },
          }
          queryCategory(params).then((res) => {
            const ids = []
            ids.push(objectId)
            res.results.forEach((result) => {
              ids.push(result.objectId)
            })
            dgiotlog.log('ids', ids)
            this.queryprodut({ categorys: ids })
          })
        }
      },
      submitForm() {
        var initparams = {
          name: this.form.name,
          nodeType: this.form.nodeType,
          netType: this.form.netType,
          icon: this.imageUrl,
          devType: this.form.devType,
          desc: this.form.desc,
          thing: this.form.thing ? this.form.thing : {},
          category: {
            objectId:
              Number(this.form.type) == 0 ? '5ca6049839' : this.form.categoryid,
            __type: 'Pointer',
            className: 'Category',
          },
          producttemplet: {
            objectId:
              Number(this.form.type) == 0 ? '0' : this.form.producttempid,
            __type: 'Pointer',
            className: 'ProductTemplet',
          },
          channel: {
            type: this.form.type,
            tdchannel: this.form.tdchannel,
            taskchannel: this.form.taskchannel,
            otherchannel: this.form.otherchannel,
            storageStrategy: this.form.storageStrategy,
          },
        }
        this.$refs.form.validate((valid) => {
          // 判断是新增产品还是修改
          if (valid) {
            if (this.custom_status === 'add') {
              var ranNum = Math.ceil(Math.random() * 25)
              var productSecret = Base64.encode(
                String.fromCharCode(65 + ranNum) +
                  Math.ceil(Math.random() * 10000000) +
                  Number(new Date())
              )
              const aclKey = 'role' + ':' + this.form.relationApp
              const setAcl = {}
              setAcl[aclKey] = {
                read: true,
                write: true,
              }
              setAcl['*'] = {
                read: true,
              }
              const addparams = {
                  productSecret: productSecret,
                  ACL: setAcl,
                  topics: [],
                  decoder: {},
                  config: {
                    konva: {
                      Stage: this.defaultKonva,
                    },
                  },
                },
                params = _.merge(initparams, addparams)
              dgiotlog.log('createProduct', params)
              this.createProduct(params)
            } else {
              console.log('editProduct', initparams)
              delete initparams.category
              delete initparams.producttemplet
              this.editProduct(initparams)
            }
          } else {
            this.$message('必填项未填')
          }
        })
      },
      async doUpload(event) {
        const parseFile = event.target.files[0]
        const loading = this.$baseColorfullLoading(3)
        try {
          const res = await ImportParse('Product', parseFile)
          loading.close()
          dgiotlog.log('eresresrror', res)
          this.$message.success(``)
        } catch (error) {
          loading.close()
          dgiotlog.log('error', error)
          this.$message.error(`${error}`)
        }
        this.$dgiotBus.$emit('reload-router-view')
      },
      async createProduct(params) {
        const res = await this.$create_object('Product', params)
        if (res.objectId) {
          this.initQuery('产品创建成功', 'success')
        } else {
          this.$message({
            type: 'error',
            message: res.error,
          })
        }
      },
      async editProduct(data) {
        const res = await this.$update_object(
          'Product',
          this.custom_row.objectId,
          data
        )
        if (res.updatedAt) {
          this.initQuery('产品修改成功', 'success')
        } else {
          this.$message({
            type: 'error',
            message: res.error,
          })
        }
      },
      initQuery(msg, type) {
        this.$message({
          type: type || 'info',
          message: msg,
        })
        this.dialogFormVisible = false
        this.resetProductForm()
        this.$refs['form'].resetFields()
        this.searchProduct()
      },
      resetProductForm() {
        this.form = {
          name: '',
          category: '',
          nodeType: 3,
          desc: '',
          netType: '',
          devType: '',
          productSecret: '',
          roles: [],
          relationApp: '',
        }
        this.imageUrl = ''
      },
      deviceToDetail(row) {
        this.$router.push({
          path: '/roles/detailproduct',
          query: {
            id: row.objectId,
          },
        })
      },
      GoTodevices(row) {
        this.$router.push({
          path: '/roles/thing',
          query: {
            productid: row.objectId,
          },
        })
      },
      /* el-popover点击关闭*/
      makeSure(row, index) {
        const params = {
          count: 'objectId',
          skip: 0,
          limit: 1,
          where: {
            product: row.objectId,
          },
        }
        queryDevice(params).then((results) => {
          if (results.count > 0) {
            this.$message('请先删除该产品下设备')
            return
          } else {
            delProduct(row.objectId).then((response) => {
              if (response) {
                this.$message({
                  type: 'success',
                  message: '删除成功',
                })
                // row._self.$refs[`popover-${index}`].doClose()
                this.searchProduct()
              }
            })
          }
        })
      },
      productSizeChange(val) {
        this.length = val
        this.searchProduct()
      },
      productCurrentChange(val) {
        this.start = (val - 1) * this.length
        this.searchProduct()
      },
      async blackDict(hashkey, data) {
        const params = {
          data: data,
          key: hashkey,
          type: 'Product',
        }
        const res = await postDict(params)
        if (res) {
          this.$message({
            type: 'success',
            message: '备份成功',
          })
        } else {
          this.$message({
            type: 'error',
            message: `备份失败`,
          })
        }
      },
      async CloneData(row) {
        const data = {
          category: row.attributes.category,
          devType: row.attributes.devType,
          name: row.attributes.name,
          thing: row.attributes.thing,
        }
        const { objectId, code } = await getHashClass('Product', data)
        if (code == 200) {
          this.blackDict(objectId, data)
        }
      },
      // 克隆组态
      proudctClone(row) {
        row.attributes.config.cloneState = true
        row.attributes.config.cloneState = true
        const config = row
        const res = putProduct(row.id, config)
        if (res) {
          this.CloneData(row)
        }
      },
      // 编辑组态
      proudctEdit(row) {
        var topoUrl = window.location.origin + '/spa'
        const { NODE_ENV } = process.env
        if (NODE_ENV == 'development') {
          topoUrl = this.$globalConfig.localTopoUrl
        } else {
          topoUrl = window.location.origin + '/spa'
        }
        // 为了兼容性,暂时传两个相同的值
        var url = `${topoUrl}/#?drawProudctid=${row.objectId}&proudctid=${row.objectId}`
        localStorage.setItem('rowId', row.objectId)
        window.open(url, '__blank')
      },
      proudctView(row) {
        var topoUrl = window.location.origin + '/spa'
        const { NODE_ENV } = process.env
        if (NODE_ENV == 'development') {
          topoUrl = this.$globalConfig.localTopoUrl
        } else {
          topoUrl = window.location.origin + '/spa'
        }
        // 为了兼容性,暂时传两个相同的值
        var url = `${topoUrl}/#/views/${row.objectId}`
        window.open(url, '__blank')
      },
      // 跳转到组态大屏
      goTopoview() {
        var topoUrl = window.location.origin + '/spa'
        const { NODE_ENV } = process.env
        if (NODE_ENV == 'development') {
          topoUrl = this.$globalConfig.localTopoUrl
        } else {
          topoUrl = window.location.origin + '/spa'
        }
        var url = `${topoUrl}/#/view`
        window.open(url, '__blank')
      },
      async handleImport() {
        await this.$refs.uploader.click()
      },
      // 导出
      async exportpro() {
        const loading = this.$baseColorfullLoading(2)
        try {
          const res = await ExportParse('Product', {})
          loading.close()
          this.$convertRes2Blob(res)
          // this.$message.success(`${res}`)
        } catch (error) {
          loading.close()
          this.$message.error(`${error}`)
        }
      },
    },
  }
</script>
<style lang="scss">
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    width: 80px !important;
    height: 80px !important;
    font-size: 28px;
    line-height: 80px !important;
    color: #8c939d;
    text-align: center;
    border: 1px dashed #cccccc;
  }

  .avatar {
    display: block;
    width: 80px !important;
    height: 80px !important;
  }
</style>
<style lang="scss" scoped>
  @media screen and(max-width: 600px) {
    .devproduct {
      width: 500px;
    }
  }
  .devproduct {
    box-sizing: border-box;
    width: 100%;
    height: 100%;

    &-prodialog {
      margin-left: 52px;

      &-content {
        margin: auto 30px;
      }

      &-footer {
        text-align: center;
      }
    }
  }

  .devproduct ::v-deep .el-dialog__wrapper .el-dialog__header,
  //.devproduct ::v-deep .el-dialog__wrapper .el-dialog__close {
  //  display: none;
  //}
.devproduct .parserTable {
    display: block;
  }

  .devproduct ::v-deep {
    .el-dialog {
      margin: 0 auto;
    }

    .devproduct .el-tabs__header {
      margin: 0;
    }

    .devproduct ::v-deep .el-tabs__item {
      height: 50px;
      margin: 0;
      margin-top: 20px;
      font-family: auto;
      font-size: 16px;
      line-height: 50px;
    }

    .devproduct ::v-deep .el-tabs__content {
      box-sizing: border-box;
      padding: 20px;
      background: #f4f4f4;
    }

    .devproduct ::v-deep .el-tab-pane {
      background: #ffffff;
    }

    .devproduct ::v-deep .procontent,
    .devproduct ::v-deep .prosecond {
      box-sizing: border-box;
      width: 100%;
    }

    .devproduct ::v-deep .el-dialog {
      margin-top: 5vh;
    }

    .devproduct .el-dialog .el-dialog__header {
      border-bottom: 1px solid #cccccc;
    }

    .devproduct .el-dialog .el-cascader,
    .devproduct .el-dialog .el-select {
      width: 100%;
    }

    .devproduct .el-dialog .el-form {
      box-sizing: border-box;
      padding: 0 10px;
    }

    .devproduct .el-dialog .el-form .el-form-item {
      margin-bottom: 5px;
    }

    .devproduct .el-dialog .el-form .el-form-item__content {
      margin-left: 10px;
      clear: both;
    }

    .devproduct .avatar-uploader {
      display: inline-block;
    }

    .avatar-uploader .el-upload {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
    }
  }

  /* .devproduct .el-icon-close{
position:absolute;
right:0;
} */
</style>
