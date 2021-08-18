<template>
  <div
    ref="custom-table"
    class="devproduct"
    :class="{ 'vab-fullscreen': isFullscreen }"
  >
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="90%"
      top="1vh"
      :title="formConfig.uid"
      style="margin: 0 auto"
    >
      <VabParser
        :dba-table="DbaTable"
        :productid="productid"
        :form-config="formConfig"
        :parserindex="editIndex"
        :dict="parserDict"
        @ParserSave="saveParse"
      />
      <!--      <span slot="footer" class="dialog-footer">-->
      <!--        <el-button @click="dialogVisible = false">取 消</el-button>-->
      <!--        <el-button type="primary" @click="dialogVisible = false">-->
      <!--          确 定-->
      <!--        </el-button>-->
      <!--      </span>-->
    </el-dialog>
    <el-dialog v-drag-dialog :append-to-body="true" :visible.sync="parserView">
      <f-render v-model="formConfig" :config="formConfig" pure />
    </el-dialog>
    <a-drawer
      width="40%"
      direction="rtl"
      :visible="parserTable"
      class="parserTable"
      @close="parserTable = !parserTable"
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
      <el-table size="mini" :data="parserTableList">
        <el-table-column
          width="100"
          show-overflow-tooltip
          sortable
          align="center"
          prop="uid"
          label="uid"
        />
        <el-table-column
          show-overflow-tooltip
          sortable
          align="center"
          prop="name"
          width="140"
          :label="$translateTitle('product.chinesetitle')"
        >
          <template #default="{ row }">
            <el-popover trigger="hover" placement="top">
              <p>
                {{ $translateTitle('product.englishtitle') }}: {{ row.enname }}
              </p>
              <p>
                {{ $translateTitle('developer.describe') }}:
                {{ row.description }}
              </p>
              <p>
                {{ $translateTitle('product.identifier') }}:
                {{ row.identifier }}
              </p>
              <p>
                {{ $translateTitle('developer.describe') }}:
                {{ row.description }}
              </p>
              <p>
                {{ $translateTitle('product.Table Name') }}:
                {{ row.table }}
              </p>
              <p>
                {{ $translateTitle('product.class') }}:
                {{ row.field }}
              </p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          sortable
          align="center"
          prop="type"
          :label="$translateTitle('product.functionaltypes')"
        />
        <el-table-column
          sortable
          align="center"
          prop="visible"
          width="100"
          :label="$translateTitle('product.visible')"
        >
          <template #default="{ row }">
            <el-switch v-model="row.visible" disabled />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          width="200"
          :label="$translateTitle('developer.operation')"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="editParse(scope.$index, scope.row)">
              {{ $translateTitle('concentrator.edit') }}
            </el-button>
            <el-button
              type="text"
              :disabled="!scope.row.config.order"
              @click="previewParse(scope.row.config)"
            >
              {{ $translateTitle('application.preview') }}
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="
                lockingParse(scope.row.uid, scope.$index, parserTableList)
              "
            >
              {{ $translateTitle('application.locking') }}
            </el-button>
            <el-button
              type="text"
              size="small"
              :disabled="scope.row.disable"
              @click.native.prevent="
                deleteParse(scope.row.uid, scope.$index, parserTableList)
              "
            >
              {{ $translateTitle('task.Delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </a-drawer>
    <div class="prosecond">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-form
            label-width="100px"
            :inline="true"
            :model="formInline"
            class="demo-form-inline"
            @submit.native.prevent
          >
            <el-form-item :label="$translateTitle('resource.Servicetype')">
              <div class="border-panel">
                <el-select
                  v-model="formInline.category"
                  clearable
                  placeholder="请选择"
                  @clear="clearCategory"
                >
                  <el-option
                    v-for="(item, index) in category"
                    :key="index"
                    :label="item.data.CategoryName"
                    :value="item.type"
                    @click.native="categoryChange(item, index)"
                  />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item :label="$translateTitle('alert.product name')">
              <el-input
                v-model="formInline.productname"
                clearable
                :placeholder="$translateTitle('product.searchproductname')"
              >
                <el-button
                  slot="append"
                  size="mini"
                  icon="el-icon-search"
                  style="margin: 0 !important; padding: 0 !important"
                  @click="searchProduct(0)"
                />
              </el-input>
            </el-form-item>
          </el-form>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel>
          <div class="stripe-panel">
            <el-button
              type="primary"
              size="mini"
              @click="$refs['edit'].showEdit()"
            >
              {{ $translateTitle('product.Product template') }}
            </el-button>
            <el-button
              v-show="!$loadsh.isEmpty(productDetail)"
              size="mini"
              type="primary"
              @click="isFullscreen = !isFullscreen"
            >
              <vab-icon
                :icon="
                  isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'
                "
              />
              {{
                isFullscreen
                  ? $translateTitle('alert.Exit Full Screen')
                  : $translateTitle('alert.full screen')
              }}
            </el-button>
          </div>
        </vab-query-form-right-panel>
      </vab-query-form>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="6" :md="5" :lg="4" :xl="3">
          <ul class="infinite-list" style="overflow: auto">
            <li
              v-for="(item, index) in category"
              :key="index"
              disabled
              class="infinite-list-item"
              @click="categoryChange(item, index)"
            >
              <el-link :type="linkType == index ? 'success' : ''">
                {{ item.data.CategoryName }}
              </el-link>
            </li>
          </ul>
        </el-col>
        <el-col
          :xs="$loadsh.isEmpty(productDetail) ? 24 : 12"
          :sm="$loadsh.isEmpty(productDetail) ? 18 : 6"
          :md="$loadsh.isEmpty(productDetail) ? 19 : 6"
          :lg="$loadsh.isEmpty(productDetail) ? 20 : 6"
          :xl="$loadsh.isEmpty(productDetail) ? 21 : 6"
        >
          <div class="protable">
            <el-table
              ref="multipleTable"
              v-loading="listLoading"
              highlight-current-row
              height="60vh"
              size="medium"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
              :data="proTableData"
              style="width: 100%"
              @row-click="StepsListRowClick"
            >
              <el-table-column
                sortable
                show-overflow-tooltip
                :label="$translateTitle('product.productname')"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <!--              <el-table-column-->
              <!--                sortable-->
              <!--                show-overflow-tooltip-->
              <!--                width="100"-->
              <!--                :label="$translateTitle('product.profile')"-->
              <!--              >-->
              <!--                <template slot-scope="scope">-->
              <!--                  <el-link-->
              <!--                    type="primary"-->
              <!--                    @click="-->
              <!--                      editorParser(-->
              <!--                        scope.row.objectId,-->
              <!--                        scope.row.config,-->
              <!--                        scope.row.thing,-->
              <!--                        'profile'-->
              <!--                      )-->
              <!--                    "-->
              <!--                  >-->
              <!--                    {{-->
              <!--                      scope.row.config && scope.row.config.profile-->
              <!--                        ? scope.row.config.profile.length-->
              <!--                        : 0-->
              <!--                    }}-->
              <!--                  </el-link>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <!--              <el-table-column-->
              <!--                sortable-->
              <!--                show-overflow-tooltip-->
              <!--                width="100"-->
              <!--                :label="$translateTitle('product.parser')"-->
              <!--              >-->
              <!--                <template slot-scope="scope">-->
              <!--                  <el-link-->
              <!--                    type="primary"-->
              <!--                    @click="-->
              <!--                      editorParser(-->
              <!--                        scope.row.objectId,-->
              <!--                        scope.row.config,-->
              <!--                        scope.row.thing,-->
              <!--                        'parser'-->
              <!--                      )-->
              <!--                    "-->
              <!--                  >-->
              <!--                    {{-->
              <!--                      scope.row.config && scope.row.config.parser-->
              <!--                        ? scope.row.config.parser.length-->
              <!--                        : 0-->
              <!--                    }}-->
              <!--                  </el-link>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column
                width="160"
                :label="$translateTitle('task.Operation')"
              >
                <template slot-scope="scope">
                  <el-link
                    type="success"
                    @click="moveTemplate('set', scope.row)"
                  >
                    {{ $translateTitle('product.Set as template') }}
                  </el-link>
                </template>
              </el-table-column>
              <!--                        <el-table-column-->
              <!--            width="180"-->
              <!--            :label="$translateTitle('product.addingtime')"-->
              <!--          >-->
              <!--            <template slot-scope="scope">-->
              <!--              <span>{{ utc2beijing(scope.row.createdAt) }}</span>-->
              <!--            </template>-->
              <!--          </el-table-column>-->
            </el-table>
          </div>
          <div class="elpagination" style="margin-top: 20px">
            <el-pagination
              :page-sizes="[10, 20, 30, 50]"
              :page-size="length"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="productSizeChange"
              @current-change="productCurrentChange"
            />
          </div>
        </el-col>
        <el-col
          :xs="$loadsh.isEmpty(productDetail) ? 24 : 12"
          :sm="$loadsh.isEmpty(productDetail) ? 0 : 12"
          :md="$loadsh.isEmpty(productDetail) ? 0 : 13"
          :lg="$loadsh.isEmpty(productDetail) ? 0 : 14"
          :xl="$loadsh.isEmpty(productDetail) ? 0 : 15"
        >
          <div>
            <el-descriptions
              :label-style="{ 'text-align': 'center' }"
              :content-style="{ 'text-align': 'left' }"
              class="margin-top"
              :column="2"
              border
            >
              <el-descriptions-item :label="$translateTitle('home.category')">
                {{ getCategory(productDetail.category) }}
              </el-descriptions-item>
              <el-descriptions-item
                :label="$translateTitle('product.nodetype')"
              >
                <span v-if="productDetail.nodeType == 1">
                  {{ $translateTitle('product.gateway') }}
                </span>
                <span v-if="productDetail.nodeType == 0">
                  {{ $translateTitle('product.equipment') }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item
                :label="$translateTitle('product.productgrouping')"
              >
                <span>{{ productDetail.devType }}</span>
              </el-descriptions-item>
              <el-descriptions-item
                :label="$translateTitle('product.physicalmodel')"
              >
                <el-link
                  type="primary"
                  @click="properties(productDetail.thing.properties)"
                >
                  {{
                    productDetail.thing &&
                    productDetail.thing.properties &&
                    productDetail.thing.properties.length
                      ? productDetail.thing.properties.length
                      : 0
                  }}
                </el-link>
              </el-descriptions-item>
              <el-descriptions-item :label="$translateTitle('product.parser')">
                <template slot="label">
                  <el-link
                    type="success"
                    @click="
                      editorParser(
                        productDetail.objectId,
                        productDetail.config,
                        productDetail.thing,
                        'parser',
                        true
                      )
                    "
                  >
                    {{ $translateTitle('product.parser') }}
                  </el-link>
                </template>
                <el-link
                  type="primary"
                  @click="
                    editorParser(
                      productDetail.objectId,
                      productDetail.config,
                      productDetail.thing,
                      'parser'
                    )
                  "
                >
                  {{
                    productDetail.config && productDetail.config.parser
                      ? productDetail.config.parser.length
                      : 0
                  }}
                </el-link>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <el-link
                    type="success"
                    @click="
                      editorParser(
                        productDetail.objectId,
                        productDetail.config,
                        productDetail.thing,
                        'profile',
                        true
                      )
                    "
                  >
                    {{ $translateTitle('product.profile') }}
                  </el-link>
                </template>
                <el-link
                  type="primary"
                  @click="
                    editorParser(
                      productDetail.objectId,
                      productDetail.config,
                      productDetail.thing,
                      'profile'
                    )
                  "
                >
                  {{
                    productDetail.config && productDetail.config.profile
                      ? productDetail.config.profile.length
                      : 0
                  }}
                </el-link>
              </el-descriptions-item>

              <el-descriptions-item :label="$translateTitle('product.dict')">
                <el-link
                  type="primary"
                  @click="
                    editorParser(
                      productDetail.objectId,
                      productDetail.config,
                      productDetail.thing,
                      'dict'
                    )
                  "
                >
                  {{
                    productDetail.config &&
                    productDetail.config.basedate &&
                    productDetail.config.basedate.params
                      ? productDetail.config.basedate.params.length
                      : 0
                  }}
                </el-link>
              </el-descriptions-item>

              <el-descriptions-item :label="$translateTitle('product.decoder')">
                <el-link
                  disabled
                  type="primary"
                  @click="
                    editorParser(
                      productDetail.objectId,
                      productDetail.config,
                      productDetail.thing,
                      'profile'
                    )
                  "
                >
                  {{
                    productDetail.decoder && productDetail.decoder
                      ? productDetail.decoder.length
                      : 0
                  }}
                </el-link>
              </el-descriptions-item>
              <!--            <el-descriptions-item :label="$translateTitle('product.profile')">-->
              <!--              <el-link-->
              <!--                type="primary"-->
              <!--                @click="-->
              <!--                  editorParser(-->
              <!--                    productDetail.objectId,-->
              <!--                    productDetail.config,-->
              <!--                    productDetail.thing,-->
              <!--                    'profile'-->
              <!--                  )-->
              <!--                "-->
              <!--              >-->
              <!--                {{-->
              <!--                  productDetail.config && productDetail.config.profile-->
              <!--                    ? productDetail.profile.length-->
              <!--                    : 0-->
              <!--                }}-->
              <!--              </el-link>-->
              <!--            </el-descriptions-item>-->
            </el-descriptions>
            <el-table
              v-if="$loadsh.isEmpty(productDetail) != true"
              :key="tableType"
              v-loading="tableLoading"
              highlight-current-row
              height="60vh"
              size="medium"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
              :data="
                tableType == 'things'
                  ? things
                  : tableType == 'profile' || tableType == 'parser'
                  ? parserTableList
                  : tableType == 'dict'
                  ? dictTableList
                  : decoderTableList
              "
              style="width: 100%"
            >
              <div v-if="tableType == 'things'">
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
                  width="80"
                  align="center"
                  sortable
                >
                  <template #default="{ row }">
                    {{ row.dataForm.order }}
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$translateTitle('product.Rounds')"
                  width="80"
                  align="center"
                  sortable
                >
                  <template #default="{ row }">
                    {{ row.dataForm.round }}
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$translateTitle('product.Strategy')"
                  width="80"
                  align="center"
                  sortable
                >
                  <template #default="{ row }">
                    {{ row.dataForm.strategy }}
                  </template>
                </el-table-column>

                <el-table-column
                  :label="$translateTitle('product.protocol')"
                  width="80"
                  align="center"
                  sortable
                >
                  <template #default="{ row }">
                    {{
                      row.dataForm && row.dataForm.protocol
                        ? row.dataForm.protocol
                        : ''
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  width="120"
                  sortable
                  :label="$translateTitle('product.functionaltypes')"
                >
                  <span>{{ $translateTitle('product.attribute') }}</span>
                </el-table-column>

                <el-table-column
                  align="center"
                  sortable
                  :label="$translateTitle('product.identifier')"
                  prop="identifier"
                />
                <el-table-column
                  align="center"
                  sortable
                  :label="$translateTitle('product.functionname')"
                  prop="name"
                />
                <el-table-column
                  :label="$translateTitle('product.datatype')"
                  align="center"
                  sortable
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.dataType.type }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  sortable
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
              </div>
              <div v-else-if="tableType == 'profile' || tableType == 'parser'">
                <el-table-column
                  show-overflow-tooltip
                  sortable
                  align="center"
                  prop="uid"
                  label="uid"
                />
                <el-table-column
                  show-overflow-tooltip
                  sortable
                  align="center"
                  prop="name"
                  :label="$translateTitle('product.chinesetitle')"
                >
                  <template #default="{ row }">
                    <el-popover trigger="hover" placement="top">
                      <p>
                        {{ $translateTitle('product.englishtitle') }}:
                        {{ row.enname }}
                      </p>
                      <p>
                        {{ $translateTitle('developer.describe') }}:
                        {{ row.description }}
                      </p>
                      <p>
                        {{ $translateTitle('product.identifier') }}:
                        {{ row.identifier }}
                      </p>
                      <p>
                        {{ $translateTitle('developer.describe') }}:
                        {{ row.description }}
                      </p>
                      <p>
                        {{ $translateTitle('product.Table Name') }}:
                        {{ row.table }}
                      </p>
                      <p>
                        {{ $translateTitle('product.class') }}:
                        {{ row.field }}
                      </p>
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ row.name }}</el-tag>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  sortable
                  align="center"
                  prop="type"
                  :label="$translateTitle('product.functionaltypes')"
                />
              </div>
              <div v-else-if="tableType == 'dict'">
                <el-table-column prop="order" label="序号" />
                <el-table-column prop="identifier" label="标识符" />
                <el-table-column prop="name" label="功能名称" />
                <el-table-column prop="type" label="数据类型" />
                <el-table-column prop="address" label="数据地址" />
                <el-table-column prop="bytes" label="数据长度" />
                <el-table-column prop="required" label="是否必填">
                  <template slot-scope="scope">
                    <span v-if="scope.row.required">是</span>
                    <span v-else>否</span>
                  </template>
                </el-table-column>
              </div>
              <div v-else>
                <el-empty :image-size="200" />
              </div>
            </el-table>
            <el-empty v-else :image-size="200" />
          </div>
        </el-col>
      </el-row>
    </div>
    <ProductTemplet ref="edit" @fetch-data="searchProduct(0)" />
  </div>
</template>
<script>
  import ProductTemplet from './ProductTemplet'
  import { uuid } from '@/utils'
  import { mapGetters } from 'vuex'
  import { delProduct, getProduct, putProduct } from '@/api/Product'
  import { getAllunit } from '@/api/Dict/index'
  import { queryDevice } from '@/api/Device/index'
  import { export_txt_to_zip } from '@/utils/Export2Zip.js'
  import { getServer } from '@/api/Role/index'
  import { postDict } from '@/api/Dict'
  import { getHashClass } from '@/api/Hash'
  import Category from '@/api/Mock/Category'
  import { getTable } from '@/api/Dba'
  import categoryEdit from '@/views/devicemanage/categoryEdit'
  import {
    queryProductTemplet,
    getProductTemplet,
    delProductTemplet,
    putProductTemplet,
    postProductTemplet,
  } from '@/api/ProductTemplet'
  export default {
    components: { ProductTemplet },
    data() {
      return {
        isFullscreen: false,
        things: [],
        tableType: 'things',
        multipleTable: [],
        productDetail: {},
        linkType: 0,
        productOptions: [],
        DbaTable: [],
        parserView: false,
        parserTable: false,
        parserType: '',
        parserTableList: {},
        dictTableList: {},
        decoderTableList: {},
        productConfig: {},
        parserFromId: '',
        dialogVisible: false,
        moduleTitle: this.$translateTitle('product.createproduct'),
        allunit: [],
        productInfo: {},
        category: Category,
        edit_dict_temp_dialog: false,
        title_dict_edit_dialog: '新增字典数据',
        tempparams: {
          name: '',
          identifier: '',
          type: '',
          order: 0,
          address: '',
          bytes: '',
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
        },
        elactiveName: 'Table',
        elactiveName1: 'Table1',
        editDictTempId: '',
        title_temp_dialog: '',
        dictTempForm: '',
        rule: [],
        dictVisible: false,
        listLoading: false,
        tableLoading: false,
        custom_row: {},
        custom_status: 'add',
        hashkey: '',
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        length: 10,
        total: 0,
        start: 0,
        activeName: 'first',
        formInline: {
          productname: '',
          category: '',
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
        form: {
          name: '',
          category: [],
          nodeType: 0,
          desc: '',
          netType: '',
          devType: '',
          productSecret: '',
          roles: [],
          relationApp: '',
        },
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
          devType: [
            {
              required: true,
              message: '请输入产品标识，用于区分不同设备',
              trigger: 'blur',
            },
          ],
          category: [
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
            label: '蜂窝(2G/3G/4G)(直连)',
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
        imageUrl: '',
        productid: '',
        parserDict: [],
        formConfig: {},
        editIndex: 0,
        Parserzh: '',
        parseren: '',
        loading: false,
        allApps: [],
        categoryList: [],
        categoryListOptions: [],
        fileServer: '',
        access_token: '',
        projectid: '',
        allTableDate: [],
        showTree: false,
      }
    },
    computed: {
      ...mapGetters({
        token: 'user/token',
        roleTree: 'user/roleTree',
      }),
    },
    watch: {
      productDetail: {
        handler(productDetail) {
          this.$nextTick(function () {
            productDetail?.thing?.properties
              ? this.properties(productDetail.thing.properties)
              : ''
          })
        },
        immediate: true,
        deep: true,
      },
    },
    mounted() {
      const { project = '' } = this.$route.query
      this.formInline.productname = project
      this.Industry()
      this.featchTable()
      // this.searchProduct(0)
      this.categoryChange(this.category[0], 0)
    },
    methods: {
      async StepsListRowClick(params) {
        console.log(this.$refs.multipleTable)
        try {
          const loading = this.$baseColorfullLoading()
          const res = await getProduct(params.objectId)
          this.productDetail = res
          this.$baseMessage(
            this.$translateTitle('alert.Data request successfully'),
            'success',
            'vab-hey-message-success'
          )
          loading.close()
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error'
          )
        }
      },
      async moveTemplate(type, params) {
        switch (type) {
          case 'set':
            this.setTemplate(params)
            break
          case 'update':
            // this.closeLeftTabs()
            break
          case 'view':
            // this.closeRightTabs()
            break
          case 'delete':
            // this.closeAllTabs()
            break
        }
      },
      async setTemplate(params) {
        const {
          config = {},
          decoder = {},
          ACL,
          name,
          thing = {},
          netType,
          icon,
          nodeType,
          category,
        } = params
        const setParams = {
          config,
          decoder,
          ACL,
          name,
          thing,
          netType,
          icon,
          nodeType,
          category,
        }
        console.log(params, setParams)
        try {
          const loading = this.$baseColorfullLoading()
          const res = await postProductTemplet(setParams)
          console.log(res)
          loading.close()
          this.$message.success(
            this.$translateTitle('user.Save the template successfully')
          )
        } catch (error) {
          console.log(error)
          this.$message.error(
            this.$translateTitle('user.Save the template error') + `${error}`
          )
        }
      },
      clearCategory() {
        this.linkType = -1
        this.searchProduct(0)
      },
      categoryChange(v, index) {
        console.log(this.formInline.category)
        this.linkType = index
        console.log(v.type)
        this.proTableData = []
        this.productDetail = {}
        this.formInline.category = v.type
        this.searchProduct(0)
      },
      async featchTable() {
        try {
          const { results: table = [] } = await getTable()
          this.DbaTable = table
        } catch (error) {
          console.log(error)
          this.$message.error(`${error}`)
        }
        console.log(this.DbaTable)
      },
      uploadCkick() {
        this.loading = true
        // 触发子组件的点击事件
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
      },
      fileInfo(info) {
        console.log('info', info)
        this.imageUrl = info.url
        this.loading = false
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
      // 组态
      konvaDevice(row) {
        this.$router.push({
          path: '/Topo/VueKonva',
          query: {
            productid: row.objectId,
          },
        })
      },
      getCategory(key) {
        // console.log(key)
        let name = ''
        this.category.filter((item) => {
          if (item.type == key) {
            name = item.data.CategoryName
          }
        })
        return name
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
        // console.log("onJsonSave", this.dictTempForm.params);
        this.$refs[formName].validate((valid) => {
          console.log(this.editDictTempId)
          if (valid) {
            this.put_Dict_temp(this.editDictTempId, this.dictTempForm)
          }
        })
      },
      async put_Dict_temp(editDictId, row) {
        console.log(row)
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
      handleNodeClick(data) {
        console.log(data, 'data')
        this.$set(this.form, 'relationApp', data.name)
        this.showTree = !this.showTree
      },
      changeNode(val, first) {
        if (first != 0) {
          this.form.netType = ''
        }

        if (val == 0) {
          this.channel = [
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
              label: '5G通道',
              value: '5G',
            },
            {
              label: 'WIFI通道',
              value: 'WIFI',
            },
            {
              label: 'ZigBee通道',
              value: 'ZigBee',
            },
            {
              label: 'LoRa(WAN)',
              value: 'LoRaWAN',
            },
            {
              label: 'Modbus',
              value: 'Modbus',
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
              label: '网线连接',
              value: '网线连接',
            },

            {
              label: '自定义',
              value: 'OTHER',
            },
          ]
        } else {
          this.channel = [
            {
              label: '蜂窝(2G/3G/4G)',
              value: 'CELLULAR',
            },
            {
              label: '5G通道',
              value: '5G',
            },
            {
              label: 'WIFI通道',
              value: 'WIFI',
            },
            {
              label: 'NB-IOT通道',
              value: 'NB-IOT',
            },
            {
              label: 'LoRaWAN',
              value: 'LoRaWAN',
            },
            {
              label: '网线连接',
              value: '网线连接',
            },
            {
              label: '自定义',
              value: 'OTHER',
            },
          ]
        }
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
            (child) => father.id == child.parentid
          ) // 返回每一项的子级数组
          branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
          return father.parentid == 0 // 返回第一层
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
          // console.log('uploadHeaders',this.uploadHeaders);

          this.uploadData.appid = Cookies.get('appids')
          // this.uploadData.key = "key";
          this.$refs.fileUpload.submit()
        })
      },
      handleUploadSuccess(response, file, fileList) {
        // console.log('### Success response', response)
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
      // 得到category
      async getDict(category) {
        category = [...new Set(category)]
        const parsms = {
          limit: 100,
          where: {
            'data.key': 'category',
            type: category[0],
          },
        }
        const Dictres = await this.$query_object('Dict', parsms)
        // console.log(Dictres, 'results category')
        this.allTableDate = Dictres.results
      },
      properties(things, type = 'things') {
        this.tableLoading = true
        console.log(things)
        this.things = things
        this.tableType = type
        setTimeout(() => (this.tableLoading = false), 1200)
      },
      async searchProduct(start) {
        this.listLoading = true
        if (start == 0) {
          this.start = 0
        }
        var category = []
        const parsms = {
          count: 'objectId',
          order: '-updatedAt',
          limit: this.length,
          skip: this.start,
          // keys: 'updatedAt,category,desc,name,devType,netType,nodeType,icon,config,thing',
          keys: 'name',
          where: {
            category: this.formInline.category
              ? { $regex: this.formInline.category }
              : { $ne: null },
          },
        }
        if (this.formInline.productname != '') {
          parsms.where.name = this.formInline.productname
        }
        const { results, count } = await this.$query_object('Product', parsms)
        // console.log("results", results)
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
          this.$nextTick(() => {
            if (this.proTableData?.length) {
              this.StepsListRowClick(this.proTableData[0])
              this.$refs.multipleTable.setCurrentRow(this.proTableData[0], true)
            }
          })
        }
        this.getApps()
      },
      getApps() {
        this.allApps = this.roleTree
      },
      handleClose() {
        this.dialogFormVisible = false
      },
      // 关闭dialog 事件
      handleCloseDialogForm() {
        this.dialogFormVisible = false
        // 重置表单
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
        })
      },
      // 添加产品弹窗
      addproduct() {
        this.moduleTitle = this.$translateTitle('product.createproduct')
        this.imageUrl = ''
        this.handleNodeClick(this.allApps[0])
        this.form = {
          name: '',
          category: ['IotHub'],
          nodeType: 0,
          desc: '',
          netType: ' ',
          devType: '',
          productSecret: '',
          relationApp: this.allApps[0].name,
          roles: [],
        }
        this.custom_status = 'add'
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
      editorParser(objectId, config = {}, thing = {}, type, flag = false) {
        console.log('flag', flag)
        if (!flag) {
          this.tableLoading = true
          setTimeout(() => (this.tableLoading = false), 800)
        }
        var _sourceDict = []
        var _sourceModule = []
        var _sourceField = []
        var arrStr = ''
        this.productid = objectId
        this.parserFromId = objectId
        this.parserType = type
        this.tableType = type
        this.productConfig = config
        console.log('config[`${type}`]', type, config[`${type}`])
        // 将字典数据存在localStorage 中
        console.log('config', config)
        this.parserTableList = config[`${type}`] ? config[`${type}`] : []
        if (config?.basedate?.params?.length) {
          config.basedate.params.forEach((_dict) => {
            _sourceDict.push({
              field: _dict.identifier,
              label: _dict.name,
              default: _dict.default,
            })
          })
        }
        if (thing?.properties?.length) {
          thing.properties.forEach((_thing) => {
            _sourceModule.push({
              field: _thing.identifier,
              label: _thing.name,
              default: _thing.default || '',
            })
          })
        }
        localStorage.setItem('_sourceDict', JSON.stringify(_sourceDict))
        localStorage.setItem('_sourceModule', _sourceModule)
        localStorage.setItem('_sourceField', _sourceField)
        this.parserTable = flag
        this.dictTableList = config.basedate.params
        this.decoderTableList = {}
        console.log(' this.tableType ', this.tableType)
      },
      editParse(index, row) {
        this.formConfig = row
        this.editIndex = index
        this.dialogVisible = true
      },
      async saveParse(list, type = -1, mark = true) {
        console.log('this.productConfig', this.productConfig)
        const parserType = this.productConfig[`${this.parserType}`]
        if (type + 1 > 0) {
          parserType[type] = _.merge({}, list)
        } else {
          this.productConfig[`${this.parserType}`] = list
        }
        console.log('this.productConfig', this.productConfig, parserType)
        try {
          const res = await putProduct(this.parserFromId, {
            config: this.productConfig,
          })
          this.$message.success(
            this.$translateTitle('user.Save the template successfully')
          )
          this.dialogVisible = false
          if (mark) {
            this.parserTable = false
            this.searchProduct(0)
          }
        } catch (e) {
          this.$message.error(
            this.$translateTitle('user.Save the template error') + `${e}`
          )
          console.log(e, 'eeee')
        }
        console.log(list)
      },
      previewParse(row) {
        this.parserView = true
        this.formConfig = row
        console.log('previewParse', row)
      },
      addParse(row) {
        row.push({
          name: this.parserType + 'name',
          enname: this.parserType + 'English Name',
          uid: uuid(6),
          config: {},
          type: this.parserType,
          identifier: 'identifier',
          visible: true,
          table: 'Device',
          class: 'profile',
          description: this.parserType + 'description',
        })
        this.saveParse(row, -1, false)
      },
      deleteParse(uid, index, rows) {
        console.log('uid', uid)
        rows.forEach((e, i) => {
          if (e.uid == uid) {
            rows.splice(i, 1)
          }
          console.log('rows', rows)
        })
        // rows.splice(index, 1)
        this.saveParse(rows, -1, false)
      },
      lockingParse(uid, index, rows) {
        const { disable = false } = rows[`${index}`]
        rows[`${index}`].disable = !disable
        this.saveParse(rows, -1, false)
      },
      // async editorParser(ObjectId) {
      //   const { config = {}, thing = {} } = await getProduct(ObjectId)
      //   this.productid = ObjectId
      //   this.ParserConfig = config
      //   this.parserDict = _.merge(thing, config)
      //   this.formConfig = this.ParserConfig.parser
      //     ? this.ParserConfig.parser
      //     : {}
      //   this.dialogVisible = true
      // },
      // async ParserSave(parse, ObjectId) {
      //   this.ParserConfig.parser = parse
      //   const params = {
      //     config: this.ParserConfig,
      //   }
      //   try {
      //     let { updatedAt } = await putProduct(ObjectId, params)
      //     console.log(updatedAt)
      //     this.$message.success(
      //       this.$translateTitle('user.Save the template successfully')
      //     )
      //   } catch (e) {
      //     this.$message.error(
      //       this.$translateTitle('user.Save the template error') + `${e}`
      //     )
      //   }
      //   this.dialogVisible = false
      // },
      async editorDict(ObjectId) {
        this.getAllunit()
        const row = await getProduct(ObjectId)
        const { config = { basedate: {} } } = row
        this.productInfo = row
        console.log(' this.parserDict', this.parserDict)
        this.editDictTempId = ObjectId
        this.dictTempForm = {
          name: '',
          cType: '',
          enable: '1',
          description: '',
          params: [],
        }
        this.title_temp_dialog = '创建字典模板'
        console.log(config)
        if (config.basedate && config.basedate.name) {
          this.title_temp_dialog = '修改字典模板'
          this.dictTempForm = config.basedate
        }
        this.rule = {
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
        console.log(this.dictTempForm, 'config')
        this.dictVisible = true
      },
      editorProduct(row) {
        this.imageUrl = ''
        this.moduleTitle = this.$translateTitle('product.editproduct')
        this.custom_status = 'edit'
        this.custom_row = row
        // this.form.roles = [];
        // this.form.relationApp = ''
        this.dialogFormVisible = true
        this.productid = row.objectId
        this.getIndustryParent(row.category, this.categoryList)
        this.form.desc = row.desc
        this.form.name = row.name
        this.form.nodeType = row.nodeType
        this.form.netType = row.netType
        this.form.devType = row.devType
        this.form.productSecret = row.productSecret
        this.changeNode(row.nodeType, 0)
        if (row.icon) {
          this.imageUrl = row.icon
        }
        let rows = []
        for (var key in row.ACL) {
          rows.push(key)
          if (key.includes('role')) {
            console.log(key, 'key')
            this.form.relationApp = key ? key.substr(5) : ''
          }
        }
        console.log(rows)
        console.log(this.form.relationApp)
        // this.selectApp(this.form.relationApp)
      },
      async Industry() {
        const parsms = {
          limit: 100,
          where: {
            'data.key': 'category',
          },
        }
        const { results } = await this.$query_object('Dict', parsms)
        results.map((items) => {
          var obj = {}
          obj.value = items.type
          obj.label = items.data.CategoryName
          obj.id = items.data.Id
          obj.parentid = items.data.SuperId
          this.categoryList.push(obj)
        })
        // this.searchProduct();
        this.categoryListOptions = this.treeData(this.categoryList)
        // console.log(results)
      },
      submitForm() {
        var params = {}
        var initparams = {
          name: this.form.name,
          nodeType: this.form.nodeType,
          netType: this.form.netType,
          icon: this.imageUrl,
          devType: this.form.devType,
          desc: this.form.desc,
        }
        this.$refs.form.validate((valid) => {
          // console.log(this.$refs.form)
          // console.log(this.form)
          // console.log(valid)
          // return
          if (valid) {
            // 判断是新增产品还是修改
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
              var addparams = {
                category: this.form.category[this.form.category.length - 1],
                productSecret: productSecret,
                ACL: setAcl,
                topics: [],
                dynamicReg: false,
                config: {
                  konva: {
                    Stage: {
                      attrs: {
                        x: 14,
                        y: 29,
                        id: 'container',
                        width: 1868,
                        height: 469,
                        draggable: true,
                      },
                      children: [
                        {
                          attrs: {
                            id: 'Layer_' + Mock.mock('@string'),
                          },
                          children: [
                            {
                              attrs: {
                                id: 'Group_' + Mock.mock('@string'),
                                width: 2000,
                                height: 2000,
                              },
                              children: [],
                              className: 'Group',
                            },
                          ],
                          className: 'Layer',
                        },
                      ],
                      className: 'Stage',
                    },
                  },
                },
              }
              params = Object.assign(initparams, addparams)
              this.createProduct(params)
            } else {
              // console.log(this.custom_row)
              var editparams = {}
              params = Object.assign(initparams, editparams)
              this.editProduct(params)
            }
          } else {
            this.$message('必填项未填')
          }
        })
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
          category: [],
          nodeType: 0,
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
      makeSure(scope) {
        const params = {
          count: 'objectId',
          skip: 0,
          limit: 1,
          where: {
            product: scope.row.objectId,
          },
        }
        queryDevice(params).then((results) => {
          if (results.count > 0) {
            this.$message('请先删除该产品下设备')
            return
          } else {
            delProduct(scope.row.objectId).then((response) => {
              if (response) {
                this.$message({
                  type: 'success',
                  message: '删除成功',
                })
                scope._self.$refs[`popover-${scope.$index}`].doClose()
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
      // 导出
      exportpro() {
        if (this.allTableDate) {
          export_txt_to_zip(JSON.stringify(this.allTableDate), 'Dict', 'Dict')
        } else {
          this.$message({
            type: 'warning',
            message: '数据为空,无法导出',
          })
        }
      },
    },
  }
</script>
<style scoped lang="scss">
  .devproduct {
    ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #fdf3ea;
      color: #f19944;
    }
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    .infinite-list {
      height: 60vh;
      padding: 0;
      margin: 0;
      list-style: none;
      .infinite-list-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        background: #e8f3fe;
        margin: 10px;
        color: #7dbcfc;
      }
    }
  }

  .devproduct ::v-deep .el-dialog__wrapper .el-dialog__header,
    //.devproduct ::v-deep .el-dialog__wrapper .el-dialog__close {
    //  display: none;
    //}
  .devproduct .parserTable {
    display: block;
    text-align: center;
  }
  .devproduct ::v-deep .el-dialog {
    margin: 0 auto;
  }
  .devproduct .el-tabs__header {
    margin: 0;
  }

  .devproduct .el-tabs__item {
    height: 50px;
    margin: 0;
    margin-top: 20px;
    font-family: auto;
    font-size: 16px;
    line-height: 50px;
  }

  .devproduct .el-tabs__content {
    box-sizing: border-box;
    padding: 20px;
    background: #f4f4f4;
  }

  .devproduct .el-tab-pane {
    background: #ffffff;
  }

  .devproduct .procontent,
  .devproduct .prosecond {
    box-sizing: border-box;
    width: 100%;
    padding: 20px 10px;
  }

  .devproduct .el-dialog {
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

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    width: 150px;
    height: 150px;
    font-size: 28px;
    line-height: 150px;
    color: #8c939d;
    text-align: center;
    border: 1px dashed #cccccc;
  }

  .avatar {
    display: block;
    width: 150px;
    height: 150px;
  }

  /* .devproduct .el-icon-close{
    position:absolute;
    right:0;
  } */
</style>
