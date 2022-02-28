<template>
  <div class="ProfileDict">
    <!--新增字典-->
    <a-drawer
      v-if="dictVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      style="z-index: 999"
      :title="titleTempDialog"
      :visible="dictVisible"
      width="60%"
      @close="$parent.dictVisible = !dictVisible"
    >
      <el-form
        ref="dictTempForm"
        :model="dictTempForm"
        :rules="rules"
        size="mini"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="字典模板名称"
              :label-width="formLabelWidth"
              prop="name"
            >
              <el-input v-model="dictTempForm.name" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="字典模板类型"
              :label-width="formLabelWidth"
              prop="cType"
            >
              <el-input v-model="dictTempForm.cType" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="字典模板状态"
              :label-width="formLabelWidth"
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

        <el-form-item label="字典模板数据" :label-width="formLabelWidth">
          <el-tabs v-model="elactiveName">
            <el-tab-pane label="Table" name="Table">
              <el-button
                class="mt-3"
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click.native="$parent.addRow(dictTempForm.params)"
              >
                新 增
              </el-button>

              <el-table
                :data="dictTempForm.params"
                height="300"
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
                      @click.native="
                        $parent.delRow($index, dictTempForm.params)
                      "
                    >
                      删除
                    </el-button>
                    <el-button
                      plain
                      size="mini"
                      title="编辑"
                      type="info"
                      @click.native="
                        $parent.editRow($index, dictTempForm.params)
                      "
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Json" name="Json">
              <dgiot-json-editor
                v-model="dictTempForm.params"
                lang="zh"
                :mode="'code'"
                @has-error="$parent.onError"
              />
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
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
            @click="$parent.onJsonSave('dictTempForm', dictTempForm)"
          >
            提交
          </el-button>
          <el-button @click="$parent.dictVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </a-drawer>
    <!--新增字典数据-->
    <el-dialog
      :append-to-body="true"
      :before-close="$parent.closeDict"
      :close-on-click-modal="false"
      :title="titleDict"
      top="5vh"
      :visible.sync="editFlag"
      width="60%"
      @open="$parent.opendialog('tempparams')"
    >
      <el-form
        ref="tempparams"
        label-position="left"
        label-width="100px"
        :model="tempparams"
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
                @change="$parent.tempTypeChange"
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
                filterable
                :placeholder="$translateTitle('product.unit')"
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
          border
          :data="dataList"
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
                    { value: 'readCoils', label: '0X01:读线圈寄存器' },
                    { value: 'readInputs', label: '0X02:读离散输入寄存器' },
                    {
                      value: 'readHregs',
                      label: '0X03:读保持寄存器',
                    },
                    {
                      value: 'readIregs',
                      label: '0X04:读输入寄存器',
                    },
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
            align="center"
            label="数据长度(字节)"
            min-width="120"
          >
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
              <el-radio v-model="tempparams.required" border :label="true">
                是
              </el-radio>
              <el-radio v-model="tempparams.required" border :label="false">
                否
              </el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="只读">
              <el-radio v-model="tempparams.readonly" border :label="true">
                是
              </el-radio>
              <el-radio v-model="tempparams.readonly" border :label="false">
                否
              </el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="列表显示">
              <el-radio v-model="tempparams.isshow" border :label="true">
                是
              </el-radio>
              <el-radio v-model="tempparams.isshow" border :label="false">
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
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
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
                @click.native="$parent.addDomain"
              >
                新 增
              </el-button>
              <el-table
                :data="tempparams.specs"
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
                      @click.native="$parent.removeDomain(row)"
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
          <el-button
            type="primary"
            @click.native="$parent.submitFormTempDict()"
          >
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ProfileDict',
    props: {
      titleDict: {
        required: false,
        type: String,
        default: '',
      },
      formLabelWidth: {
        required: false,
        type: String,
        default: '120px',
      },
      rules: {
        required: false,
        type: Object,
        default: () => {},
      },
      editFlag: {
        required: false,
        type: Boolean,
        default: false,
      },
      dictVisible: {
        required: false,
        type: Boolean,
        default: false,
      },
      titleTempDialog: {
        required: false,
        type: String,
        default: '',
      },
      parserTables: {
        required: false,
        type: Array,
        default: () => [],
      },
      tempparam: {
        required: false,
        type: Object,
        default: () => {},
      },
      allunit: {
        required: false,
        type: Array,
        default: () => [],
      },
      dataList: {
        required: false,
        type: Array,
        default: () => [{}],
      },
    },
    data() {
      return {
        elactiveName: 'Table',
        elactiveName1: 'Table1',
        tempparams: {},
      }
    },
    created() {
      this.tempparams = this.tempparam
    },
    mounted() {},
    methods: {
      addParse(table) {
        this.$parent.addParse(table)
      },
    },
  }
</script>
