<template>
  <div :key="productId">
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
      <el-descriptions-item :label="$translateTitle('product.nodetype')">
        <span v-if="productDetail.nodeType == 1">
          {{ $translateTitle('product.gateway') }}
        </span>
        <span v-if="productDetail.nodeType == 0">
          {{ $translateTitle('product.equipment') }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item :label="$translateTitle('product.productgrouping')">
        <span>{{ productDetail.devType }}</span>
      </el-descriptions-item>
      <el-descriptions-item :label="$translateTitle('product.physicalmodel')">
        <el-link
          :type="productDetail.thing.properties.length ? 'success' : 'default'"
          :disabled="productDetail.thing.properties.length ? false : true"
          @click="featProperties(productDetail.thing.properties)"
        >
          {{ productDetail.thing.properties.length || 0 }}
        </el-link>
      </el-descriptions-item>
      <el-descriptions-item :label="$translateTitle('product.parser')">
        <template slot="label">
          <el-link
            type="success"
            @click="feateditorParser(productDetail, 'parser', true)"
          >
            {{ $translateTitle('product.parser') }}
          </el-link>
        </template>
        <el-link
          :type="productDetail.config.parser.length ? 'success' : 'default'"
          @click="feateditorParser(productDetail, 'parser', false)"
        >
          {{ productDetail.config.parser.length || 0 }}
        </el-link>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <el-link
            type="success"
            @click="feateditorParser(productDetail, 'profile', true)"
          >
            {{ $translateTitle('product.profile') }}
          </el-link>
        </template>
        <el-link
          type="primary"
          @click="feateditorParser(productDetail, 'profile', false)"
        >
          {{ productDetail.config.profile.length || 0 }}
        </el-link>
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <!--          有个坑,暂时不显示。-->
          <el-link
            type="success"
            disabled
            @click="feateditorParser(productDetail, 'basedate.params', true)"
          >
            {{ $translateTitle('product.dict') }}
          </el-link>
        </template>
        <el-link
          type="primary"
          @click="feateditorParser(productDetail, 'basedate.params', false)"
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

      <el-descriptions-item v-if="productDetail.decoder">
        <template slot="label">
          <el-link
            type="warning"
            :disabled="!productDetail.decoder.code.length"
            @click="seeDecoder(productDetail)"
          >
            {{ $translateTitle('product.decoder') }}
          </el-link>
        </template>

        <el-link
          type="success"
          @click.native="moveTemplate('set', productDetail)"
        >
          {{ $translateTitle('product.Set as template') }}
        </el-link>
      </el-descriptions-item>
    </el-descriptions>
    <el-table
      v-if="!codeFlag"
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
          : tableType == 'basedate.params'
          ? dictTableList
          : []
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
              style="box-sizing: border-box; width: 60%; text-align: center"
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
              row.dataForm && row.dataForm.protocol ? row.dataForm.protocol : ''
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
      <div v-else-if="tableType == 'basedate.params'">
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
    <vab-editor
      v-else-if="codeFlag"
      v-model="ace_editor"
      lang="erlang"
      theme="monokai"
      style="height: 500px"
    />
    <el-empty v-else :image-size="200" />
  </div>
  <!--  <el-table-column-->
  <!--    width="160"-->
  <!--    :label="$translateTitle('task.Operation')"-->
  <!--  >-->
  <!--    <template slot-scope="scope">-->
  <!--      <el-link-->
  <!--        type="success"-->
  <!--        @click="moveTemplate('set', scope.row)"-->
  <!--      >-->
  <!--        {{ $translateTitle('product.Set as template') }}-->
  <!--      </el-link>-->
  <!--    </template>-->
  <!--  </el-table-column>-->
</template>
<script>
  import Category from '@/api/Mock/Category'
  export default {
    name: 'ProfileDescriptions',
    props: {
      productId: {
        required: true,
        type: String,
        default: '',
      },
      tableLoading: {
        required: false,
        type: Boolean,
        default: false,
      },
      dictTableList: {
        required: false,
        type: Array,
        default: () => [],
      },
      decoderTableList: {
        required: false,
        type: Object,
        default: () => {},
      },
      parserTableList: {
        required: false,
        type: Array,
        default: () => [],
      },
      things: {
        required: false,
        type: Array,
        default: () => [],
      },
      tableType: {
        required: true,
        type: String,
        default: '',
      },
    },
    data() {
      return {
        ace_editor: '',
        codeFlag: false,
        productDetail: {
          thing: { properties: [] },
          config: { parser: [], profile: [] },
        },
        Category,
      }
    },
    mounted() {},
    methods: {
      seeDecoder(productDetail) {
        console.log(ace, 'ace', this.ace_editor)
        const { decoder = {} } = productDetail
        this.codeFlag = !this.codeFlag
        this.ace_editor = Base64.decode(decoder.code)
        // editor.gotoLine(editor.session.getLength())
      },
      moveTemplate(type, params) {
        this.$parent.$parent.$parent.moveTemplate(type, params)
      },
      featProperties(params) {
        this.codeFlag = false
        this.$parent.$parent.$parent.properties(params)
      },
      feateditorParser(config, type, flag) {
        this.codeFlag = false
        this.$parent.$parent.$parent.editorParser(config, type, flag)
      },
      getCategory(key) {
        // console.log(key)
        let name = ''
        this.Category.filter((item) => {
          if (item.type == key) name = item.data.CategoryName
        })
        return name
      },
    },
  }
</script>
