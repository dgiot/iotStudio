<!-- 组件说明 -->
<template>
  <div class="dict">
    <div class="dialog">
      <el-dialog
        :visible.sync="add_dict_dialog"
        :close-on-click-modal="false"
        :title="title_dict_dialog"
        width="40%"
        @open="opendialog('dictForm')"
      >
        <el-form
          ref="dictForm"
          :model="addDictForm"
          :rules="rules1"
          class="dict_type"
          label-width="135px"
          size="mini"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <!-- <el-form-item label="字典类型" prop="templateId"> -->
              <el-form-item
                :label="$translateTitle('developer.dictionarytype')"
                prop="templateId"
              >
                <!-- <el-select
                  v-model="addDictForm.templateId"
                  :disabled="editDictId == '' ? false : true"
                  style="width: 100%"
                  placeholder="请选择"
                  @change="selectChange"
                > -->
                <el-select
                  v-model="addDictForm.templateId"
                  :disabled="editDictId == '' ? false : true"
                  style="width: 100%"
                  :placeholder="$translateTitle('task.Select')"
                  @change="selectChange"
                >
                  <el-option
                    v-for="item in dictRecord"
                    :key="item.objectId"
                    :label="item.data.name"
                    :value="item.objectId"
                    :disabled="item.data.name == 'ALL'"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- <el-form-item label="字典名称" title="字典唯一标识" prop="key"> -->
              <el-form-item
                :label="$translateTitle('developer.dictionaryname')"
                :title="$translateTitle('developer.dictionaryuniqueID')"
                prop="key"
              >
                <el-input
                  v-model="addDictForm.key"
                  :disabled="editDictId == '' ? false : true"
                />
              </el-form-item>
            </el-col>
            <el-col v-for="(item, index) in arrlist" :key="index" :span="12">
              <el-form-item
                :label="item.title.zh"
                :prop="item.name"
                :required="item.required"
              >
                <el-select
                  v-if="item.type == 'Boolean'"
                  v-model="addDictForm[item.name]"
                  style="width: 100%"
                  class="notauto"
                  readonly
                >
                  <!-- <el-option :value="true" label="是" /> -->
                  <el-option
                    :value="true"
                    :label="$translateTitle('product.yes')"
                  />
                  <!-- <el-option :value="false" label="否" /> -->
                  <el-option
                    :value="false"
                    :label="$translateTitle('product.no')"
                  />
                </el-select>
                <el-input v-else v-model="addDictForm[item.name]" />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="z-index: 99999">
              <!-- <el-form-item
                :rules1="[
                  {
                    required: true,
                    message: '请选择所属应用',
                    trigger: 'blur',
                  },
                ]"
                label="所属应用"
              > -->
              <el-form-item
                :rules1="[
                  {
                    required: true,
                    message: $translateTitle('product.pleaseselectyourapp'),
                    trigger: 'blur',
                  },
                ]"
                :label="$translateTitle('application.applicationtype')"
              >
                <!-- <el-input
                  v-model="addDictForm.applicationtText"
                  placeholder="请选择所属应用"
                  readonly
                > -->
                <el-input
                  v-model="addDictForm.applicationtText"
                  :placeholder="$translateTitle('product.pleaseselectyourapp')"
                  readonly
                >
                  <template slot="append">
                    <i
                      :class="[
                        showTree ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
                      ]"
                      style="cursor: pointer"
                      @click="showTree = !showTree"
                    />
                  </template>
                </el-input>
                <div v-if="showTree" class="device-tree">
                  <el-tree
                    :data="allApps"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="height: 47px">
              <!-- <el-form-item label="状态" prop="enable"> -->
              <el-form-item
                :label="$translateTitle('equipment.state')"
                prop="enable"
              >
                <el-radio v-model="addDictForm.enable" label="1" border>
                  <!-- 启用 -->
                  {{ $translateTitle('developer.enable') }}
                </el-radio>
                <el-radio v-model="addDictForm.enable" label="2" border>
                  <!-- 废弃 -->
                  {{ $translateTitle('developer.scrap') }}
                </el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- <el-form-item label="备注"> -->
          <el-form-item :label="$translateTitle('user.Remarks')">
            <!-- <el-input
              v-model="addDictForm.description"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="请输入内容"
            /> -->
            <el-input
              v-model="addDictForm.description"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              :placeholder="$translateTitle('concentrator.input')"
            />
          </el-form-item>
          <el-form-item
            size="mini"
            label-width="0px"
            style="text-align: center"
          >
            <el-button
              v-if="editDictId"
              type="primary"
              @click="onSubmit('dictForm')"
            >
              <!-- 修改 -->
              {{ $translateTitle('product.modify') }}
            </el-button>
            <el-button v-else type="primary" @click="onSubmit('dictForm')">
              <!-- 立即创建 -->
              {{ $translateTitle('product.createnow') }}
            </el-button>
            <el-button @click="add_dict_dialog = false">
              <!-- 取消 -->
              {{ $translateTitle('developer.cancel') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog
        :visible.sync="dict_temp_dialog"
        :close-on-click-modal="false"
        :title="title_temp_dialog"
        width="80%"
        @open="opendialog('dictTempForm')"
      >
        <el-form
          ref="dictTempForm"
          :model="dictTempForm"
          :rules="rules"
          size="mini"
        >
          <!-- <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                :label-width="formLabelWidth"
                label="字典模板名称"
                prop="name"
              > -->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                :label-width="formLabelWidth"
                :label="$translateTitle('developer.dictionarytemplatename')"
                prop="name"
              >
                <el-input v-model="dictTempForm.name" autocomplete="off" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item
                :label-width="formLabelWidth"
                label="字典模板类型"
                prop="cType"
              > -->
            <el-col :span="8">
              <el-form-item
                :label-width="formLabelWidth"
                :label="$translateTitle('developer.dictionarytemplatetype')"
                prop="cType"
              >
                <el-input v-model="dictTempForm.cType" autocomplete="off" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item
                :label-width="formLabelWidth"
                label="字典模板状态"
                prop="enable"
              > -->
            <el-col :span="8">
              <el-form-item
                :label-width="formLabelWidth"
                :label="$translateTitle('developer.dictionarytemplatestatus')"
                prop="enable"
              >
                <el-radio v-model="dictTempForm.enable" label="1" border>
                  <!-- 启用 -->
                  {{ $translateTitle('developer.enable') }}
                </el-radio>
                <el-radio v-model="dictTempForm.enable" label="0" border>
                  <!-- 禁用 -->
                  {{ $translateTitle('developer.disable') }}
                </el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- <el-form-item :label-width="formLabelWidth" label="字典模板数据"> -->
          <el-form-item
            :label-width="formLabelWidth"
            :label="$translateTitle('developer.dictionarytemplatedata')"
          >
            <el-tabs v-model="elactiveName">
              <el-tab-pane label="Table" name="Table">
                <el-button
                  type="primary"
                  class="mt-3"
                  size="small"
                  icon="el-icon-plus"
                  @click.native="addRow(dictTempForm.params)"
                >
                  <!-- 新增 -->
                  {{ $translateTitle('product.newlyadded') }}
                </el-button>

                <el-table
                  :data="dictTempForm.params"
                  height="300"
                  style="width: 100%; text-align: center"
                >
                  <!-- <el-table-column prop="name" label="名称" /> -->
                  <el-table-column
                    prop="name"
                    :label="$translateTitle('equipment.name')"
                  />
                  <!-- <el-table-column prop="type" label="类型" /> -->
                  <el-table-column
                    prop="type"
                    :label="$translateTitle('rule.Type')"
                  />
                  <!-- <el-table-column prop="order" label="序号" /> -->
                  <el-table-column
                    prop="order"
                    :label="$translateTitle('equipment.serialnumber')"
                  />
                  <!-- <el-table-column prop="default" label="默认值"> -->
                  <el-table-column
                    prop="default"
                    :label="$translateTitle('equipment.defaultvalue')"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="
                          scope.row.default == true &&
                          scope.row.type == 'Boolean'
                        "
                      >
                        <!-- 是 -->
                        {{ $translateTitle('product.yes') }}
                      </span>
                      <span
                        v-else-if="
                          scope.row.default == false &&
                          scope.row.type == 'Boolean'
                        "
                      >
                        <!-- 否 -->
                        {{ $translateTitle('product.no') }}
                      </span>
                      <span v-else-if="scope.row.type == 'Number'">
                        {{ scope.row.default }}
                      </span>
                      <span v-else>{{ scope.row.default }}</span>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="required" label="是否必填"> -->
                  <el-table-column
                    prop="required"
                    :label="$translateTitle('product.isitrequired')"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.required">
                        <!-- 是 -->
                        {{ $translateTitle('product.yes') }}
                      </span>
                      <span v-else>
                        <!-- 否 -->
                        {{ $translateTitle('product.no') }}
                      </span>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="description" label="中文标题"> -->
                  <el-table-column
                    prop="description"
                    :label="$translateTitle('product.chinesetitle')"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.title.zh }}
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="description" label="英文标题"> -->
                  <el-table-column
                    prop="description"
                    :label="$translateTitle('product.englishtitle')"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.title.en }}
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="description" label="中文描述"> -->
                  <el-table-column
                    prop="description"
                    :label="$translateTitle('product.chinesedescription')"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.description.zh }}
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="description" label="英文描述"> -->
                  <el-table-column
                    prop="description"
                    :label="$translateTitle('product.englishdescription')"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.description.en }}
                    </template>
                  </el-table-column>

                  <!-- <el-table-column label="操作" width="160" align="center"> -->
                  <el-table-column
                    :label="$translateTitle('task.Operation')"
                    width="160"
                    align="center"
                  >
                    <!-- <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        plain
                        title="删除"
                        @click.native="
                          delRow(scope.$index, dictTempForm.params)
                        "
                      > -->
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        plain
                        :title="$translateTitle('task.Delete')"
                        @click.native="
                          delRow(scope.$index, dictTempForm.params)
                        "
                      >
                        <!-- 删除 -->
                        {{ $translateTitle('task.Delete') }}
                      </el-button>
                      <!-- <el-button
                        size="mini"
                        type="info"
                        plain
                        title="编辑"
                        @click.native="
                          editRow(scope.row, scope.$index, dictTempForm.params)
                        "
                      > -->
                      <el-button
                        size="mini"
                        type="info"
                        plain
                        :title="$translateTitle('task.Edit')"
                        @click.native="
                          editRow(scope.row, scope.$index, dictTempForm.params)
                        "
                      >
                        <!-- 编辑 -->
                        {{ $translateTitle('task.Edit') }}
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
                  @json-change="onJsonChange"
                  @has-error="onError"
                />
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
          <!-- <el-form-item :label-width="formLabelWidth" label="描述"> -->
          <el-form-item
            :label-width="formLabelWidth"
            :label="$translateTitle('developer.describe')"
          >
            <!-- <el-input
              v-model="dictTempForm.description"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="请输入描述"
            /> -->
            <el-input
              v-model="dictTempForm.description"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              :placeholder="
                $translateTitle('developer.Pleaseenteradescription')
              "
            />
          </el-form-item>

          <el-form-item size="mini" style="text-align: center">
            <el-button type="primary" @click="onJsonSave('dictTempForm')">
              <!-- 提交 -->
              {{ $translateTitle('application.submit') }}
            </el-button>
            <el-button @click="dict_temp_dialog = false">
              <!-- 取消 -->
              {{ $translateTitle('developer.cancel') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog
        :visible.sync="edit_dict_temp_dialog"
        :title="title_dict_edit_dialog"
        :close-on-click-modal="false"
        size="mini"
        @open="opendialog('tempparams')"
      >
        <el-form
          ref="tempparams"
          :model="tempparams"
          size="mini"
          status-icon
          label-width="70px"
          class="demo-ruleForm"
        >
          <el-row :gutter="24">
            <el-col :span="5">
              <!-- <el-form-item label="名称" label-width="50px" prop="name"> -->
              <el-form-item
                :label="$translateTitle('product.name')"
                label-width="50px"
                prop="name"
              >
                <el-input v-model="tempparams.name" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <!-- <el-form-item label="类型" label-width="50px" prop="type"> -->
              <el-form-item
                :label="$translateTitle('rule.Type')"
                label-width="50px"
                prop="type"
              >
                <!-- <el-select
                  v-model="tempparams.type"
                  placeholder="请选择"
                  @change="tempTypeChange"
                > -->
                <el-select
                  v-model="tempparams.type"
                  :placeholder="$translateTitle('task.Select')"
                  @change="tempTypeChange"
                >
                  <el-option
                    v-for="item in dictOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <!-- <el-form-item label="序号" label-width="50px" prop="order"> -->
              <el-form-item
                :label="$translateTitle('equipment.serialnumber')"
                label-width="50px"
                prop="order"
              >
                <el-input v-model.number="tempparams.order" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <!-- <el-form-item label="必填" label-width="50px"> -->
              <el-form-item
                :label="$translateTitle('product.mustfill')"
                label-width="50px"
              >
                <el-radio v-model="tempparams.required" :label="true" border>
                  <!-- 是 -->
                  {{ $translateTitle('product.yes') }}
                </el-radio>
                <el-radio v-model="tempparams.required" :label="false" border>
                  <!-- 否 -->
                  {{ $translateTitle('product.no') }}
                </el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-form-item label="中文标题" prop="title"> -->
          <el-form-item
            :label="$translateTitle('product.chinesetitle')"
            prop="title"
          >
            <el-input v-model="tempparams.title.zh" autocomplete="off" />
          </el-form-item>
          <!-- <el-form-item label="英文标题" prop="title"> -->
          <el-form-item
            :label="$translateTitle('product.englishtitle')"
            prop="title"
          >
            <el-input v-model="tempparams.title.en" autocomplete="off" />
          </el-form-item>
          <!-- <el-form-item label="默认值" prop="default"> -->
          <el-form-item
            :label="$translateTitle('equipment.defaultvalue')"
            prop="default"
          >
            <el-select
              v-if="tempparams.type == 'Boolean'"
              v-model="tempparams.default"
              class="notauto"
              readonly
            >
              <!-- <el-option :value="true" label="是" /> -->
              <el-option
                :value="true"
                :label="$translateTitle('product.yes')"
              />
              <!-- <el-option :value="false" label="否" /> -->
              <el-option
                :value="false"
                :label="$translateTitle('product.no')"
              />
            </el-select>
            <el-input
              v-else-if="tempparams.type == 'Number'"
              v-model.number="tempparams.default"
            />
            <el-input v-else v-model="tempparams.default" />
          </el-form-item>
          <!-- <el-form-item label="中文描述" prop="title"> -->
          <el-form-item
            :label="$translateTitle('product.chinesedescription')"
            prop="title"
          >
            <el-input v-model="tempparams.description.zh" autocomplete="off" />
          </el-form-item>
          <!-- <el-form-item label="英文描述" prop="title"> -->
          <el-form-item
            :label="$translateTitle('product.englishdescription')"
            prop="title"
          >
            <el-input v-model="tempparams.description.en" autocomplete="off" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFormTempDict()">
              <!-- 提交 -->
              {{ $translateTitle('application.submit') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <el-tabs v-model="activeName">
      <!-- <el-tab-pane label="字典模板管理" name="字典模板管理"> -->
      <el-tab-pane
        :label="$translateTitle('developer.dictionarytemplatemanagement')"
        name="字典模板管理"
      >
        <!-- <el-input
          v-model="search_dict"
          placeholder="请输入字典模板名称"
          style="width: 200px"
          size="mini"
          clearable
        /> -->
        <el-input
          v-model="search_dict"
          :placeholder="
            $translateTitle('developer.pleaseenterdictionarytemplatename')
          "
          style="width: 200px"
          size="mini"
          clearable
        />
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="searchDict(search_dict)"
        >
          <!-- 搜索 -->
          {{ $translateTitle('task.Search') }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="createDictTemp"
        >
          <!-- 创建字典模板 -->
          {{ $translateTitle('developer.createdictionarytemplate') }}
        </el-button>
        <el-table
          v-loading="listLoading"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          :data="dictRecord"
          :row-class-name="tableRowClassName"
          style="width: 100%"
        >
          <el-table-column
            :label="$translateTitle('developer.indexes')"
            type="index"
            width="50"
          />
          <el-table-column
            :label="$translateTitle('developer.dictionarytemplatenumber')"
            width="200"
          >
            <template v-if="scope.row.objectId" slot-scope="scope">
              {{ scope.row.objectId }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$translateTitle('developer.dictionarytemplatename')"
            width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.data.name }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$translateTitle('developer.dictionarytemplatetype')"
            width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.data.cType }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$translateTitle('developer.dictionarytemplatestatus')"
            width="200"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.data.enable == '1'" type="success">
                <!-- 启用 -->
                {{ $translateTitle('developer.enable') }}
              </el-tag>
              <el-tag v-else type="warning">
                <!-- 禁用 -->
                {{ $translateTitle('developer.disable') }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column label="描述"> -->
          <el-table-column :label="$translateTitle('developer.describe')">
            <template slot-scope="scope">
              {{ scope.row.data.description }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" width="500"> -->
          <el-table-column
            :label="$translateTitle('task.Operation')"
            width="500"
          >
            <template v-if="scope.row.objectId" slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                plain
                @click="editDictTemp(scope.row)"
              >
                <!-- 编辑 -->
                {{ $translateTitle('task.Edit') }}
              </el-button>
              <el-button
                v-if="scope.row.data.enable == '0'"
                size="mini"
                type="warning"
                plain
                @click="disabledAllDict(scope.row, '1')"
              >
                <!-- 启用 -->
                {{ $translateTitle('developer.enable') }}
              </el-button>
              <el-button
                v-else
                size="mini"
                type="warning"
                plain
                @click="disabledAllDict(scope.row, '0')"
              >
                <!-- 禁用 -->
                {{ $translateTitle('developer.disable') }}
              </el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                @click="deleteDict(scope.row, '字典模板')"
              >
                <!-- 删除 -->
                {{ $translateTitle('task.Delete') }}
              </el-button>
              <!--              <el-button-->
              <!--                size="mini"-->
              <!--                type="info"-->
              <!--                plain-->
              <!--                @click="detailsTemp(scope.row)"-->
              <!--              >-->
              <!--                详情-->
              <!--              </el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="elpagination" style="margin-top: 20px; text-align: center">
          <el-pagination
            :page-sizes="[10, 20, 30, 50]"
            :page-size="length1"
            :total="total1"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="channelSizeChange1"
            @current-change="channelCurrentChange1"
          />
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="字典管理" name="字典管理"> -->
      <el-tab-pane
        :label="$translateTitle('developer.dictionarymanagement')"
        name="字典管理"
      >
        <!-- <el-select
          v-model="dictType"
          style="width: 200px"
          size="mini"
          placeholder="请选择"
          @change="selectDictChange"
        > -->
        <el-select
          v-model="dictType"
          style="width: 200px"
          size="mini"
          :placeholder="$translateTitle('task.Select')"
          @change="selectDictChange"
        >
          <el-option
            v-for="item in dictRecordOpt"
            :key="item.data.name"
            :label="item.data.name"
            :value="item.objectId"
          />
        </el-select>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="showDictDialog"
        >
          <!-- 创建字典 -->
          {{ $translateTitle('developer.createdictionary') }}
        </el-button>
        <el-table
          v-show="isALL"
          v-loading="listLoading"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          :data="dictData"
          :row-class-name="tableRowClassName"
          :element-loading-text="
            $translateTitle('developer.loadingdesperately')
          "
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          style="width: 100%"
          border
          stripe
        >
          <el-table-column
            :label="$translateTitle('developer.indexes')"
            type="index"
            width="50"
          />
          <el-table-column
            prop="key"
            :label="$translateTitle('developer.dictionaryname')"
          >
            <template slot-scope="scope">
              {{ scope.row.key }}
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            :label="$translateTitle('developer.dictionarynumber')"
          >
            <template slot-scope="scope">
              {{ scope.row.objectId }}
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            :label="$translateTitle('developer.dictionarytype')"
          >
            <template slot-scope="scope">
              {{ scope.row.data.templateName }}
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('concentrator.status')">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.data.enable == '1'" type="success">
                <!-- 启用 -->
                {{ $translateTitle('developer.enable') }}
              </el-tag>
              <el-tag v-else type="warning">
                <!-- 废弃 -->
                {{ $translateTitle('developer.scrap') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('user.Remarks')">
            <template slot-scope="scope">
              {{ scope.row.data.description }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$translateTitle('product.commandoperation')"
            width="400"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                plain
                @click="editAllDict(scope.row)"
              >
                <!-- 编辑 -->
                {{ $translateTitle('task.Edit') }}
              </el-button>
              <el-button
                v-if="scope.row.data.enable == '0'"
                size="mini"
                type="warning"
                plain
                @click="disabledAllDict(scope.row, '1')"
              >
                <!-- 启用 -->
                {{ $translateTitle('developer.enable') }}
              </el-button>
              <el-button
                v-else
                size="mini"
                type="warning"
                plain
                @click="disabledAllDict(scope.row, '0')"
              >
                <!-- 禁用 -->
                {{ $translateTitle('developer.disable') }}
              </el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                @click="deleteDict(scope.row, '字典')"
              >
                <!-- 删除 -->
                {{ $translateTitle('task.Delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-show="!isALL"
          ref="filterObj"
          v-loading="loading"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          :data="dictList"
          :row-class-name="tableRowClassName"
          :element-loading-text="
            $translateTitle('developer.loadingdesperately')
          "
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          class="filter_obj"
          style="width: 100%"
          border
        >
          <el-table-column
            :label="$translateTitle('developer.dictionarytype')"
            width="150"
            prop="templateName"
          />
          <template v-for="(item, index) in dialogtempconfig">
            <el-table-column
              v-if="item.type == 'Boolean'"
              :key="index"
              :label="item.title.zh"
              :prop="item.name"
            >
              <template slot-scope="scope">
                <span v-if="scope.row[item.name]">
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
              v-else
              :key="index"
              :label="item.title.zh"
              :prop="item.name"
            />
          </template>
          <el-table-column
            :label="$translateTitle('product.commandoperation')"
            fixed="right"
            width="240"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                plain
                @click="editDict(scope.row)"
              >
                <!-- 编辑 -->
                {{ $translateTitle('task.Edit') }}
              </el-button>
              <el-button
                v-if="scope.row.enable == '0'"
                size="mini"
                type="warning"
                plain
                @click="disabledDict(scope.row, '1')"
              >
                <!-- 启用 -->
                {{ $translateTitle('developer.enable') }}
              </el-button>
              <el-button
                v-else
                size="mini"
                type="warning"
                plain
                @click="disabledDict(scope.row, '0')"
              >
                <!-- 禁用 -->
                {{ $translateTitle('developer.disable') }}
              </el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                @click="deleteDict(scope.row, '字典')"
              >
                <!-- 删除 -->
                {{ $translateTitle('task.Delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="isALL"
          class="elpagination"
          style="margin-top: 20px; text-align: center"
        >
          <el-pagination
            :page-sizes="[10, 20, 30, 50]"
            :page-size="length"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="channelSizeChange"
            @current-change="channelCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import { queryDict, postDict, getDict, putDict } from '@/api/Direct/index.js'
  import { mapGetters } from 'vuex'
  import { resourceTypes } from '@/api/Rules'
  import { aclObj } from '@/utils/acl'
  export default {
    name: 'Dict',
    components: {},
    data() {
      return {
        queryid: this.$route.query.dictid,
        arrlist: [],
        addDictForm: {
          templateId: '',
          key: '',
        },
        rules: {},
        rules1: {},
        loading: false,
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        count: 0,
        start: 0,
        total: 0,
        length: 10,
        count1: 0,
        start1: 0,
        total1: 0,
        length1: 10,
        isALL: true,
        filterObj: [],
        tempObjectId: '',
        dictType: 'ALL',
        allApps: [],
        showTree: false,
        editIndexId: undefined,
        editDictId: '',
        editDictTempId: '',
        infoData: new Date(),
        elactiveName: 'Table',
        activeName: '字典模板管理',
        title_dict_edit_dialog: '新增字典数据',
        title_temp_dialog: '新增字典模板',
        title_dict_dialog: '新增字典',
        search_dict: '',
        add_dict_dialog: false,
        dict_temp_dialog: false,
        edit_dict_temp_dialog: false,
        dialogtempconfigVisible: false,
        dialogtempconfig: [],
        dictData: [],
        dictRecord: [],
        listLoading: false,
        dictRecordOpt: [],
        dictOptions: ['String', 'Boolean', 'Number'],
        dictForm: {
          type: '',
          name: '',
          nameEncrypt: '',
          needReply: '',
          enable: '',
          description: '',
          tempconfig: [],
        },
        tempparams: {
          name: '',
          type: '',
          order: 0,
          title: {
            en: '',
            zh: '',
          },
          default: 5,
          required: false,
          description: {
            en: '',
            zh: '',
          },
        },
        dictList: [],
        dictTempForm: {
          name: '',
          cType: '',
          enable: '1',
          description: '',
          params: [],
        },
        formLabelWidth: '120px',
      }
    },
    computed: {
      ...mapGetters({
        roleTree: 'user/roleTree',
      }),
      dragOptions() {
        return {
          animation: 600,
          group: 'description',
        }
      },
      finallyColumns() {
        return this.columns.filter((item) =>
          this.checkList.includes(item.label)
        )
      },
    },
    mounted() {
      this.getDictData()
      this.getDictRecord()
      this.dialogType()
    },
    beforeCreate() {}, // 生命周期 - 创建之前
    beforeMount() {}, // 生命周期 - 挂载之前
    beforeUpdate() {}, // 生命周期 - 更新之前
    updated() {}, // 生命周期 - 更新之后
    beforeDestroy() {}, // 生命周期 - 销毁之前
    destroyed() {}, // 生命周期 - 销毁完成
    activated() {},
    methods: {
      opendialog(name) {
        this.$nextTick(() => {
          this.$refs[name].clearValidate()
        })
      },
      async selectDictChange(objectId) {
        if (objectId == '0') {
          this.listLoading = true
          this.getDictRecord()
          this.isALL = true
        } else {
          getDict(objectId).then((res) => {
            this.dialogtempconfig = res.data.params
            // console.log(res.data.params)
            // this.dialogtempconfig.key = res.key
          })
          this.listLoading = true
          const parsms = {
            order: '-createdAt',
            limit: 100,
            skip: 0,
            where: {
              type: objectId,
            },
          }
          const { results } = await queryDict(parsms)
          this.isALL = false
          this.filterObj = results
          this.listLoading = false
          this.dictList = []
          this.filterObj.map((item) => {
            const data = { objectId: item.objectId }
            for (var key in item.data) {
              data[key] = item.data[key]
            }
            this.dictList.push(data)
          })
          console.log(this.dictList)
        }
      },
      async dialogType() {
        this.allApps = this.roleTree
        const res = await resourceTypes()
        this.channelregion = res
      },
      handleNodeClick(data) {
        this.showTree = !this.showTree
        this.addDictForm.applicationtText = data.name
      },
      editAllDict(row) {
        this.editDictId = row.objectId
        this.selectChange(row.type)
        this.addDictForm = row.data
        this.addDictForm.type = row.type
        this.add_dict_dialog = true
        this.title_dict_dialog = '编辑字典'
      },
      editDict(row) {
        this.editDictId = row.objectId
        this.selectChange(row.templateId)
        this.addDictForm = row
        this.add_dict_dialog = true
        this.title_dict_dialog = '编辑字典'
      },
      tempTypeChange(value) {
        if (value == 'Boolean') {
          this.tempparams.default = true
        } else if (value == 'Number') {
          this.tempparams.default = 0
        } else {
          this.tempparams.default = undefined
        }
      },
      selectChange(objectId) {
        var obj = {}
        getDict(objectId).then((res) => {
          this.listLoading = true
          this.arrlist = res.data.params
          var obj1 = {
            key: [
              { required: true, message: '请输入字典名称', trigger: 'blur' },
            ],
            templateId: [
              { required: true, message: '请选择字典类型', trigger: 'blur' },
            ],
            rolesObj: [
              { required: true, message: '请选择所属应用', trigger: 'change' },
            ],
            // enable: [{ required: true, message: "请选择状态", trigger: "blur" }]
          }
          this.arrlist.map((item) => {
            if (item.default) {
              obj[item.name] = item.default
            } else {
              obj[item.name] = ''
            }
            if (item.required) {
              if (item.type == 'Boolean') {
                obj1[item.name] = [
                  {
                    required: true,
                    message: '请选择' + item.title.zh,
                    trigger: 'change',
                  },
                ]
              } else {
                obj1[item.name] = [
                  {
                    required: true,
                    message: '请输入' + item.title.zh,
                    trigger: 'blur',
                  },
                ]
              }
            }
          })
          this.rules1 = obj1
          if (!this.editDictId) {
            this.addDictForm = obj
            console.log(obj)
          }
          this.addDictForm.templateId = objectId
          this.addDictForm.templateName = res.data.name
          this.listLoading = false
        })
      },
      submitFormTempDict() {
        this.edit_dict_temp_dialog = false
        if (this.editIndexId != undefined) {
          this.dictTempForm.params[this.editIndexId] = this.tempparams
          this.$message('编辑成功')
        } else {
          this.dictTempForm.params.push(this.tempparams)
          this.$message('新增成功')
        }
      },
      addRow(tabs) {
        this.editIndexId = undefined
        this.title_dict_edit_dialog = '新增字典数据'
        this.edit_dict_temp_dialog = true
        this.tempparams = {
          name: '',
          type: '',
          order: 0,
          title: {
            en: '',
            zh: '',
          },
          default: 0,
          required: false,
          description: {
            en: '',
            zh: '',
          },
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
      clearFormValidate(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      },
      onError() {
        this.$message('非Json数据类型')
      },
      onJsonChange() {
        // 数据改变时触发
        // console.log("onJsonChange", this.dictTempForm.params);
      },
      onJsonSave(formName) {
        // 点击保存触发
        // console.log("onJsonSave", this.dictTempForm.params);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.editDictTempId) {
              this.put_Dict_temp(this.editDictTempId, this.dictTempForm)
            } else {
              this.addDict_temp(this.dictTempForm)
            }
          } else {
            return false
          }
        })
      },
      tableRowClassName({ row, rowIndex }) {
        if (rowIndex === 1) {
          return 'warning-row'
        } else if (rowIndex === 3) {
          return 'success-row'
        }
        return ''
      },
      searchDict(v) {
        this.queryid = ''
        this.getDictData()
      },
      /**
       * 創建詞典模板
       **/
      createDictTemp() {
        this.dict_temp_dialog = true
        this.editDictTempId = ''
        this.title_temp_dialog = '创建字典模板'
        this.dictTempForm = {
          name: '',
          cType: '',
          enable: '1',
          description: '',
          params: [],
        }
        this.rules = {
          name: [
            { required: true, message: '请输入字典模板名称', trigger: 'blur' },
          ],
          cType: [
            { required: true, message: '请输入字典模板类型', trigger: 'blur' },
          ],
          enable: [
            { required: true, message: '请选择状态', trigger: 'change' },
          ],
        }
      },
      detailsTemp(row) {
        alert(JSON.stringify(row))
      },
      showDictDialog() {
        this.add_dict_dialog = true
        this.title_dict_dialog = '新增字典'
        this.editDictId = ''
        this.addDictForm = {}
        this.arrlist = []
        this.rules1 = {
          key: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
          templateId: [
            { required: true, message: '请选择字典类型', trigger: 'blur' },
          ],
          rolesObj: [
            { required: true, message: '请选择所属应用', trigger: 'change' },
          ],
          // enable: [{ required: true, message: "请选择状态", trigger: "blur" }]
        }
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (!this.addDictForm.applicationtText) {
            this.$message('请选择所属应用')
            return
          }
          if (valid) {
            if (this.editDictId) {
              this.put_Dict(this.editDictId, this.addDictForm)
            } else {
              this.addDict(this.addDictForm)
            }
          }
        })
      },

      async addDict_temp(form) {
        const params = {
          data: form,
          ACL: aclObj,
          key: form.name,
          type: 'dict_template',
        }
        const res = await postDict(params)
        if (res.createdAt != undefined) {
          this.$message('创建成功')
          this.dict_temp_dialog = false
          this.getDictData()
        } else if (res.code == 137) {
          this.$message('字典名称重复')
        } else {
          this.$message('创建失败')
        }
      },
      async addDict(form) {
        var obj = {}
        form.templateTypekey = 'dict_template'
        for (var key in form) {
          obj[key] = form[key]
        }
        const aclKey = 'role' + ':' + form.applicationtText
        const set_acl = {}
        set_acl[aclKey] = {
          read: true,
          write: true,
        }
        const params = {
          data: obj,
          ACL: set_acl,
          // key: 'dict_' + Math.round(new Date().getTime() / 1000),
          key: form.key,
          type: form.templateId,
        }
        const res = await postDict(params)
        if (res) {
          this.$message('创建成功')
          this.add_dict_dialog = false
          this.dictType = form.templateName
          this.selectDictChange(form.templateId)
        }
      },
      editDictTemp(row) {
        this.editDictTempId = row.objectId
        this.dictTempForm = row.data
        const { params = {} } = row.data
        this.dictTempForm.params = params
        this.dict_temp_dialog = true
        this.title_temp_dialog = '编辑字典模板'
      },
      async put_Dict_temp(editDictId, row) {
        const params = {
          data: row,
          key: row.key,
        }
        const { updatedAt } = await putDict(editDictId, params)
        if (updatedAt != undefined) {
          this.getDictData()
          this.dict_temp_dialog = false
          this.$message('字典数据更新成功')
        } else {
          this.$message('字典数据更新失败')
        }
      },
      async put_Dict(editDictId, row) {
        var obj = {}
        for (var key in row) {
          obj[key] = row[key]
        }
        const params = {
          data: obj,
        }
        const { updatedAt } = await putDict(editDictId, params)
        if (updatedAt) {
          this.dictType = row.templateName
          this.selectDictChange(row.templateId)
          this.add_dict_dialog = false
          this.$message('字典数据更新成功')
        } else {
          this.$message('字典数据更新失败')
        }
      },
      async disabledDict(row, type) {
        row.enable = type
        const params = {
          key: row.key,
          data: row,
        }
        const { updatedAt } = await putDict(row.objectId, params)
        if (updatedAt) {
          this.$message('字典状态设置成功')
        } else {
          this.$message('字典状态设置失败')
        }
      },
      async disabledAllDict(row, type) {
        row.data.enable = type
        const params = {
          data: row.data,
        }
        const { updatedAt } = await putDict(row.objectId, params)
        if (updatedAt) {
          this.$message('字典状态设置成功')
        } else {
          this.$message('字典状态设置失败')
        }
      },
      async deleteDict(row, type) {
        const res = await this.$del_object('Dict', row.objectId)
        if (res) {
          if (type == '字典') {
            this.selectDictChange(row.templateId)
            this.getDictRecord()
          } else {
            this.selectDictChange('0')
            this.getDictData()
          }
          this.$message(type + '删除成功')
        } else {
          this.$message(type + '删除失败')
        }
      },
      async getDictData() {
        this.listLoading = true
        let parsms = {
          order: '-createdAt',
          count: 'objectId',
          limit: this.length,
          skip: this.start,
          where: {
            type: 'dict_template',
          },
        }
        if (this.queryid) {
          parsms.where['objectId'] = this.queryid
        }
        if (this.search_dict) {
          parsms.where['data.name'] = this.search_dict
        }
        const { results, count } = await queryDict(parsms)
        this.total1 = count
        this.dictRecordOpt = []
        this.dictRecord = results
        if (this.queryid) {
          this.search_dict = this.dictRecord[0].data.name
        }
        this.listLoading = false
        this.dictRecordOpt.push(
          { data: { name: 'ALL' }, objectId: '0' },
          ...results
        )
        // console.log('aa', this.dictRecordOpt);
      },
      channelSizeChange1(val) {
        this.length1 = val
        this.getDictData()
      },
      channelSizeChange(val) {
        this.length = val
        this.getDictRecord()
      },
      channelCurrentChange1(val) {
        this.start1 = (val - 1) * this.length1
        this.getDictData()
      },
      channelCurrentChange(val) {
        this.start = (val - 1) * this.length
        this.getDictRecord()
      },
      async getDictRecord() {
        this.listLoading = true
        const parsms = {
          order: '-createdAt',
          count: 'objectId',
          limit: this.length,
          skip: this.start,
          where: {
            'data.templateTypekey': 'dict_template',
          },
        }
        const { results, count } = await queryDict(parsms)
        this.total = count
        this.listLoading = false
        this.dictData = results
      },
    }, // 如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .dict {
    .device-tree {
      height: 100px;
      overflow: auto;
      ::v-deep {
        .el-scrollbar .el-scrollbar__wrap {
          overflow-x: hidden;
        }
        .clearfix {
          margin: 0;
        }
        .el-tree > .el-tree-node {
          display: inline-block;
          min-width: 100%;
          height: 100px; //这里的高根据实际情况
        }
      }
    }
    margin: 20px;
    ::v-deep .el-table .warning-row {
      background: oldlace;
    }

    ::v-deep .el-table .success-row {
      background: #f0f9eb;
    }

    ::v-deep .jsoneditor-vue {
      height: 300px;
    }

    ::v-deep .json-save-btn {
      cursor: pointer;
    }
    .dict_type ::v-deep .el-form-item {
    }
  }
</style>
