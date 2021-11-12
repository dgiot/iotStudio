<template>
  <div :key="productId">
    <el-drawer
      v-drawerDrag
      :visible.sync="amisFlag"
      size="100%"
    >
      <vab-amis :schema="amisJson" />
      <div
        class="demo-drawer__footer"
      >
        <el-button @click="cancelForm">
          保存
        </el-button>
      </div>
    </el-drawer>
    <el-descriptions
      :column="2"
      :content-style="{ 'text-align': 'left' }"
      :label-style="{ 'text-align': 'center' }"
      border
      class="margin-top"
    >
      <!--      <el-descriptions-item :label="$translateTitle('home.category')">-->
      <!--        {{ productDetail.netType }}-->
      <!--      </el-descriptions-item>-->
      <!--      <el-descriptions-item :label="$translateTitle('product.nodetype')">-->
      <!--        <span v-if="productDetail.nodeType == 1">-->
      <!--          {{ $translateTitle('product.gateway') }}-->
      <!--        </span>-->
      <!--        <span v-if="productDetail.nodeType == 0">-->
      <!--          {{ $translateTitle('product.equipment') }}-->
      <!--        </span>-->
      <!--      </el-descriptions-item>-->
      <el-descriptions-item :label="$translateTitle('product.classification')">
        <span>{{ productDetail.netType }}</span>
      </el-descriptions-item>
      <el-descriptions-item :label="$translateTitle('product.physicalmodel')">
        <el-link
          :disabled="productDetail.thing.properties.length ? false : true"
          :type="productDetail.thing.properties.length ? 'success' : 'default'"
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
      <!--      组态完善之后再加-->
      <el-descriptions-item v-if="false">
        <template slot="label">
          <el-link
            type="warning"
            @click="goKonva(productDetail.objectId)"
          >
            {{ $translateTitle('concentrator.konva') }}
          </el-link>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <el-link
            :disabled="!productDetail.decoder.code.length"
            type="primary"
            @click="seeDecoder(productDetail)"
          >
            {{ $translateTitle('product.decoder') }}
          </el-link>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <el-link
            type="primary"
            @click="seeLowcode(productDetail.config)"
          >
            {{ $translateTitle('product.lowcode') }}
          </el-link>
        </template>
      </el-descriptions-item>
    </el-descriptions>
    <!--    查看物模型-->
    <el-button
      v-if="productDetail.objectId"
      size="small"
      type="primary"
      @click="checkschema"
    >
      {{ $translateTitle('product.viewobjectmodel') }}
    </el-button>
    <!-- 新增自定义属性 -->
    <el-button
      v-if="productDetail.objectId"
      size="small"
      type="primary"
      @click="createProperty"
    >
      {{ $translateTitle('product.newobjectmodel') }}
    </el-button>
    <el-table
      v-if="!codeFlag"
      :key="tableType"
      v-loading="tableLoading"
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
      :header-cell-style="{ 'text-align': 'center' }"
      height="60vh"
      highlight-current-row
      size="medium"
      style="width: 100%"
    >
      <div
        v-if="tableType == 'things'"
        :key="tableType+thingKey"
      >
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
                align="center"
                prop="name"
              />
              <el-table-column
                :label="$translateTitle('product.datadefinition')"
                align="center"
              />
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          :label="$translateTitle('product.order')"
          align="center"
          sortable
          width="80"
        >
          <template #default="{ row }">
            {{ row.dataForm.order }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$translateTitle('product.Rounds')"
          align="center"
          sortable
          width="80"
        >
          <template #default="{ row }">
            {{ row.dataForm.round }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$translateTitle('product.Strategy')"
          align="center"
          sortable
          width="80"
        >
          <template #default="{ row }">
            {{ row.dataForm.strategy }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$translateTitle('product.protocol')"
          align="center"
          sortable
          width="80"
        >
          <template #default="{ row }">
            {{
              row.dataForm && row.dataForm.protocol ? row.dataForm.protocol : ''
            }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$translateTitle('product.functionaltypes')"
          align="center"
          sortable
          width="120"
        >
          <span>{{ $translateTitle('product.attribute') }}</span>
        </el-table-column>

        <el-table-column
          :label="$translateTitle('product.identifier')"
          align="center"
          prop="identifier"
          sortable
        />
        <el-table-column
          :label="$translateTitle('product.functionname')"
          align="center"
          prop="name"
          sortable
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
          :label="$translateTitle('product.datadefinition')"
          align="center"
          sortable
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
          :label="$translateTitle('developer.operation')"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deletewmx(scope.$index)"
            >
              {{ $translateTitle('developer.delete') }}
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="wmxDataFill(scope.row, scope.$index)"
            >
              <!-- 编辑 -->
              {{ $translateTitle('task.Edit') }}
            </el-button>
          </template>
        </el-table-column>
      </div>
      <div v-else-if="tableType == 'profile' || tableType == 'parser'">
        <el-table-column
          align="center"
          label="uid"
          prop="uid"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          :label="$translateTitle('product.chinesetitle')"
          align="center"
          prop="name"
          show-overflow-tooltip
          sortable
        >
          <template #default="{ row }">
            <el-popover
              placement="top"
              trigger="hover"
            >
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
              <div
                slot="reference"
                class="name-wrapper"
              >
                <el-tag size="medium">
                  {{ row.name }}
                </el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          :label="$translateTitle('product.functionaltypes')"
          align="center"
          prop="type"
          show-overflow-tooltip
          sortable
        />
      </div>
      <div v-else-if="tableType == 'basedate.params'">
        <el-table-column
          label="序号"
          prop="order"
        />
        <el-table-column
          label="标识符"
          prop="identifier"
        />
        <el-table-column
          label="功能名称"
          prop="name"
        />
        <el-table-column
          label="数据类型"
          prop="type"
        />
        <el-table-column
          label="数据地址"
          prop="address"
        />
        <el-table-column
          label="数据长度"
          prop="bytes"
        />
        <el-table-column
          label="是否必填"
          prop="required"
        >
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
      style="height: 500px"
      theme="monokai"
    />
    <el-empty
      v-else
      :image-size="200"
    />
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import Category from '@/api/Mock/Category'

  export default {
    name: 'ProfileDescriptions',
    props: {
      thingKey: {
        required: true,
        type: String,
        default: '',
      },
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
        default: () => {
        },
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
        key: moment(new Date())
          .valueOf(),
        amisJsonPlus: '',
        ace_editor: '',
        codeFlag: false,
        amisFlag: false,
        activeName: 'first',
        productDetail: {
          thing: { properties: [] },
          config: {
            parser: [],
            profile: [],
          },
          decoder: { code: [] },
        },
        Category,
      }
    },
    computed: {
      ...mapGetters({
        amisJson: 'amis/amisJson',
      }),
    },
    watch: {
      amisJson: {
        deep: true,
        handler(val) {
          this.amisJsonPlus = JSON.stringify(val)
        },
      },
    },
    mounted() {
    },
    methods: {
      cancelForm() {
        this.$message.success('待实现')
        console.log('保存到数据库')
        // 格式是 config{amis:this.amisJson} 记得_merge config 一下
        console.log(this.amisJson)
      },
      ...mapMutations({
        set_amisJson: 'amis/set_amisJson',
      }),
      seeDecoder(productDetail) {
        console.log(ace, 'ace', this.ace_editor)
        const { decoder = {} } = productDetail
        this.codeFlag = !this.codeFlag
        this.ace_editor = Base64.decode(decoder.code)
        // editor.gotoLine(editor.session.getLength())
      },
      seeLowcode(params) {
        const { amis = {} } = params
        this.set_amisJson(amis)
        // this.amisJson = amis
        this.amisFlag = true
      },
      featProperties(params) {
        this.codeFlag = false
        this.$parent.$parent.$parent.properties(params)
      },
      feateditorParser(config, type, flag) {
        this.codeFlag = false
        this.$parent.$parent.$parent.editorParser(config, type, flag)
      },
      createProperty() {
        this.$parent.$parent.$parent.createProperty()
      },
      deletewmx(row) {
        this.$parent.$parent.$parent.deletewmx(row)
      },
      wmxDataFill(rowData, index) {
        this.$parent.$parent.$parent.wmxDataFill(rowData, index)
      },
      goKonva(objectId) {
        this.$parent.$parent.$parent.goKonva(objectId)
      },
      checkschema() {
        this.$parent.$parent.$parent.checkschema()
      },
    },
  }
</script>
<style lang="scss" scoped>
  .iframe-container {
    iframe {
      width: 100%;
      height: $base-keep-alive-height;
    }
  }
</style>

