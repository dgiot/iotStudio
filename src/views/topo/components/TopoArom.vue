<!-- 组件说明 -->
<template>
  <div class="TopoArom">
    <el-dialog
      :append-to-body="true"
      :title="wmxSituation + '自定义属性'"
      :visible.sync="wmxdialogVisible"
      :before-close="wmxhandleClose"
      :close-on-click-modal="false"
      width="60%"
      top="5vh"
    >
      <div class="wmxheader">
        <el-form
          ref="sizeForm"
          :model="sizeForm"
          :rules="sizerule"
          size="mini"
          label-position="left"
          label-width="150px"
        >
          <!-- update 2020 05-27 hughWang -->
          <!-- 功能名称  -->

          <!--INT,FLOAT,DOUBLE数据类型添加模式-->
          <div
            v-if="
              sizeForm.type == 'int' ||
              sizeForm.type == 'float' ||
              sizeForm.type == 'double'
            "
          >
            <el-collapse v-model="collapseName">
              <el-collapse-item name="1">
                <template slot="title">
                  <h3 style="font-size: normal">数据存储</h3>
                </template>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('product.functionname')"
                      prop="name"
                    >
                      <el-input v-model="sizeForm.name" />
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('product.identifier')"
                      prop="identifier"
                    >
                      <el-input v-model="sizeForm.identifier" />
                    </el-form-item>
                    <!--type-->
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item prop="startnumber" label="取值范围(最小值)">
                      <el-input
                        v-model.number="sizeForm.startnumber"
                        :placeholder="$translateTitle('product.minimumvalue')"
                        type="number"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="endnumber" label="取值范围(最大值)">
                      <el-input
                        v-model.number="sizeForm.endnumber"
                        :placeholder="$translateTitle('product.maximumvalue')"
                        type="number"
                        @input="changeValue('sizeForm')"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="步长" prop="step">
                      <el-input-number
                        v-model="sizeForm.step"
                        style="width: 100%"
                        :precision="2"
                        :min="0"
                        :step="0.01"
                        controls-position="right"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item
                      :label="$translateTitle('product.readandwritetype')"
                      prop="isread"
                    >
                      <el-radio-group
                        v-model="sizeForm.isread"
                        style="width: 100%"
                        size="medium"
                      >
                        <el-radio label="rw">
                          {{ $translateTitle('product.readandwrite') }}
                        </el-radio>
                        <el-radio label="r">
                          {{ $translateTitle('product.onlyread') }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="24">
                  <el-col :span="12">
                    <!-- 数据类型 -->
                    <el-form-item
                      :label="$translateTitle('product.datatype')"
                      prop="type"
                    >
                      <!--少个@change=selectStruct-->
                      <el-select
                        v-model="sizeForm.type"
                        style="width: 100%"
                        @change="selectStruct"
                      >
                        <el-option
                          :label="$translateTitle('product.struct')"
                          value="struct"
                        />
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
                  <el-col :span="12">
                    <!-- 单位 -->
                    <el-form-item :label="$translateTitle('product.unit')">
                      <el-select
                        v-model="sizeForm.unit"
                        style="width: 100%"
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
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template slot="title">
                  <h3 style="font-size: normal">数据采集</h3>
                  <el-row style="margin: 0 auto">
                    <el-col :span="2">
                      <el-popover placement="right" width="400" trigger="click">
                        <el-table
                          :data="
                            wmxData.slice(
                              (wmxstart - 1) * wmxPageSize,
                              wmxstart * wmxPageSize
                            )
                          "
                        >
                          <el-table-column label="标识符">
                            <template slot-scope="scope">
                              <span style="margin-left: 10px">
                                {{ scope.row.identifier }}
                              </span>
                            </template>
                          </el-table-column>
                          <el-table-column label="功能名称">
                            <template slot-scope="scope">
                              <span style="margin-left: 10px">
                                {{ scope.row.name }}
                              </span>
                            </template>
                          </el-table-column>
                          <el-table-column label="数据类型">
                            <template slot-scope="scope">
                              <span style="margin-left: 10px">
                                {{ scope.row.dataType.type }}
                              </span>
                            </template>
                          </el-table-column>
                        </el-table>
                        <el-pagination
                          :page-sizes="[10, 20, 30, 50]"
                          :page-size="wmxPageSize"
                          :total="wmxData.length"
                          style="margin-top: 10px"
                          layout="total, sizes, prev, pager, next, jumper"
                          @size-change="wmxSizeChange"
                          @current-change="wmxCurrentChange"
                        />
                        <el-button
                          slot="reference"
                          style="text-align: center"
                          size="mini"
                        >
                          添加变量
                        </el-button>
                      </el-popover>
                    </el-col>
                  </el-row>
                </template>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-tooltip
                      style="float: left"
                      effect="dark"
                      placement="right-start"
                    >
                      <div slot="content">
                        采集策略表达式 。
                        <br />

                        如：
                        <br />

                        5分钟 = 5 * 60
                        <br />

                        1小时 = 60 * 60
                        <br />

                        5小时 = 5 * 60 * 60
                        <br />

                        1天 = 24 * 60 * 60
                        <br />
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                    <el-form-item label="采集策略(单位：秒)">
                      <!-- <el-input v-model="sizeForm.rate" auto-complete="off">   <template slot="append">秒</template>
                            </el-input> -->
                      <el-select
                        v-model="sizeForm.strategy"
                        style="width: 95%"
                        size="mini"
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in sizeOption"
                          :key="item.val"
                          :label="item.label"
                          :value="item.val"
                          size="mini"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="采集轮次">
                      <!-- <el-input v-model="sizeForm.rate" auto-complete="off">   <template slot="append">秒</template>
                            </el-input> -->
                      <el-select
                        v-model="sizeForm.round"
                        style="width: 100%"
                        size="mini"
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                      <p
                        style="
                          position: absolute;
                          top: 26px;
                          margin: 0;
                          font-size: 12px;
                          color: black;
                        "
                      >
                        例如:1,3,5,8;(可选可自主填写)(注意:逗号为英文逗号)
                      </p>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-tooltip
                      style="float: left"
                      effect="dark"
                      placement="right-start"
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

                        2. 计算值 添加变量按钮,
                        <br />
                        复制对应的标识符
                        <br />

                        例：pressure_out
                        <br />
                        加：pressure_out+10
                        <br />

                        减：pressure_out-10
                        <br />

                        乘：pressure_out*10
                        <br />

                        除：pressure_out/10
                        <br />

                        余数：pressure_out%10
                        <br />

                        3. 复杂值 ：关闭本弹窗后使用物解析处理
                        <br />
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                    <el-form-item label="采集公式">
                      <el-input
                        v-model="sizeForm.collection"
                        style="width: 95%"
                        :rows="1"
                        type="textarea"
                        placeholder="%s"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="采集顺序" style="width: 100%">
                      <el-input-number
                        v-model="sizeForm.Order"
                        style="width: 100%"
                        :min="0"
                        label="采集顺序"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="24">
                    <el-tooltip effect="dark" placement="right-start">
                      <div slot="content">
                        1. 采集值: 主动向设备写数据经控制公式计算后下发 。
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

                        2. 计算值: 点击添加变量按钮,
                        <br />
                        复制对应的标识符
                        <br />

                        例：pressure_out
                        <br />
                        加：pressure_out+10
                        <br />

                        减：pressure_out-10
                        <br />

                        乘：pressure_out*10
                        <br />

                        除：pressure_out/10
                        <br />

                        余数：pressure_out%10
                        <br />

                        3. 复杂值 ：关闭本弹窗后使用物解析处理
                        <br />
                      </div>
                      <i class="el-icon-question" style="float: left" />
                    </el-tooltip>
                    <el-form-item label="控制公式">
                      <el-input
                        v-model="sizeForm.control"
                        style="width: 98%"
                        :rows="1"
                        type="textarea"
                        placeholder="%s"
                      />
                    </el-form-item>
                    <!--type-->
                  </el-col>
                </el-row>
                <!-- <el-col :span="10">
                          <el-form-item label="修正偏移">
                            <el-input v-model="sizeForm.offset" auto-complete="off" />
                          </el-form-item>
                        </el-col> -->
              </el-collapse-item>
              <el-collapse-item name="3">
                <template slot="title">
                  <h3 style="font-size: normal">数据来源</h3>
                </template>
                <el-divider />
                <div name="dataIdentification">
                  <el-row :gutter="24">
                    <el-col :span="12">
                      <el-form-item label="数据标识" required prop="dis">
                        <el-input
                          v-model="sizeForm.dis"
                          placeholder="数据标识"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="数据" required>
                        <el-input
                          v-model.number="sizeForm.dinumber"
                          placeholder="数据个数"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="协议类型">
                      <el-select
                        v-model="sizeForm.protocol"
                        placeholder="请选择"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="(item, index) in [
                            'normal',
                            'modbus',
                            'DLT645',
                          ]"
                          :key="index"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col v-show="sizeForm.protocol == 'modbus'" :span="12">
                    <el-form-item label="字节序" prop="byteorder">
                      <el-select
                        v-model="sizeForm.byteorder"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in [
                            { value: 'big', label: '大端' },
                            { value: 'little', label: '小端' },
                          ]"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-show="showNewItem" :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="寄存器状态" prop="byteorder">
                      <el-select
                        v-model="sizeForm.operatetype"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in [
                            { value: 'coilStatus', label: '线圈状态' },
                            { value: '输入状态', label: '输入状态' },
                            {
                              value: 'holdingRegister',
                              label: '保持寄存器',
                            },
                            {
                              value: 'inputRegister',
                              label: '输入寄存器',
                            },
                          ]"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="数据类型">
                      <el-select
                        v-model="sizeForm.originaltype"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="(item, index) in [
                            'int16',
                            'uint16',
                            'int32',
                            'uint32',
                            'int64',
                            'uint64',
                            'float',
                            'double',
                            'string',
                            'customizedData',
                          ]"
                          :key="index"
                          style="width: 100%"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="10">
                    <el-form-item label="从机地址">
                      <el-input
                        v-model="sizeForm.slaveid"
                        auto-complete="off"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </div>

          <!--BOOL数据类型添加格式-->
          <div v-if="sizeForm.type == 'bool'">
            <el-form-item
              :label="$translateTitle('product.attribute')"
              required
            >
              <div style="height: 40px">
                <el-col :span="11">
                  <el-form-item>
                    <el-input
                      v-model="sizeForm.truevalue"
                      :placeholder="$translateTitle('product.attribute')"
                      class="inputnumber"
                      type="number"
                      readonly
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="2">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="true">
                    <el-input
                      v-model="sizeForm.true"
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
                      v-model="sizeForm.falsevalue"
                      :placeholder="$translateTitle('product.attribute')"
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
                      v-model="sizeForm.false"
                      :placeholder="$translateTitle('product.egclose')"
                      class="inputnumber"
                    />
                  </el-form-item>
                </el-col>
              </div>
            </el-form-item>
          </div>
          <!--枚举型添加格式-->
          <div v-if="sizeForm.type == 'enum'">
            <el-form-item
              v-for="(item, index) in sizeForm.specs"
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
                  :label="$translateTitle('product.attributevalue') + index"
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
                  @click.prevent="removeDomain(item)"
                >
                  {{ $translateTitle('developer.delete') }}
                </el-link>
              </el-col>
            </el-form-item>
            <el-link
              :underline="false"
              icon="el-icon-plus"
              type="primary"
              @click="addDomain"
            >
              {{ $translateTitle('product.add') }}
            </el-link>
          </div>
          <!--结构体类型添加格式-->
          <div v-if="sizeForm.type == 'struct'">
            <el-form-item label="JSON对象" required>
              <ul style="padding-left: 20px; margin: 0">
                <li
                  v-for="(item, index) in sizeForm.struct"
                  :key="index"
                  value="item"
                  style="display: flex; list-style: none"
                >
                  <div>
                    <span>
                      {{ $translateTitle('product.parametername') + ':' }}}
                    </span>
                    <span>{{ item.name }}</span>
                  </div>
                  <div>
                    <el-link
                      :underline="false"
                      type="primary"
                      style="margin-left: 20px"
                      @click="editStruct(item, index)"
                    >
                      {{ $translateTitle('developer.edit') }}
                    </el-link>
                    <el-link
                      :underline="false"
                      type="primary"
                      @click="deleteStruct(index)"
                    >
                      {{ $translateTitle('developer.delete') }}
                    </el-link>
                  </div>
                </li>
              </ul>
              <el-link
                :underline="false"
                icon="el-icon-plus"
                type="primary"
                @click="addStruct('structform')"
              >
                {{ $translateTitle('product.addparameter') }}
              </el-link>
            </el-form-item>
          </div>
          <!--字符串添加格式-->
          <div v-if="sizeForm.type == 'string'">
            <el-form-item
              :label="$translateTitle('product.datalength')"
              prop="string"
            >
              <el-input v-model.number="sizeForm.string" type="number">
                <template slot="append">
                  {{ $translateTitle('product.byte') }}
                </template>
              </el-input>
            </el-form-item>
          </div>
          <!--date类型添加格式-->
          <div v-if="sizeForm.type == 'date'">
            <el-form-item :label="$translateTitle('product.timeformat')">
              <el-input v-model="sizeForm.date" readonly />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="wmxhandleClose">
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <!-- 物模型提交 -->
        <el-button type="primary" @click.native="submitForm('sizeForm')">
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  // import x from ''
  export default {
    name: 'TopoArom',
    components: {},
    data() {
      return {
        infoData: 'TopoArom',
      }
    },
    computed: {},
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {}, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
