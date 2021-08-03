<!-- 物模型详情组件 -->
<template>
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
      <div>
        <el-collapse v-model="collapseName">
          <el-collapse-item name="1">
            <template slot="title">
              {{ $translateTitle('task.datastorage') }}
            </template>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item
                  :label="$translateTitle('product.functionname')"
                  prop="name"
                >
                  <el-select
                    v-if="sizeForm.nobound && sizeForm.nobound.length > 0"
                    v-model="sizeForm.name"
                    style="width: 100%"
                    filterable
                    placeholder="请选择"
                    @change="changeThing"
                  >
                    <el-option
                      v-for="(item, index) in sizeForm.nobound"
                      :key="index"
                      :label="item.name"
                      :value="item"
                    />
                  </el-select>
                  <el-input v-else v-model="sizeForm.name" />
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
                <!-- 数据类型 -->
                <el-form-item
                  :label="$translateTitle('product.datatype')"
                  prop="type"
                >
                  <!--少个@change=selectStruct-->
                  <el-select
                    v-model="sizeForm.type"
                    style="width: 100%"
                    :disabled="sizeForm.editdatatype"
                  >
                    <el-option-group
                      v-for="group in dataType"
                      :key="group.label"
                      :label="group.label"
                    >
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value"
                      >
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6">
                          {{ item.value }}
                        </span>
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                v-if="sizeForm.type == 'float' || sizeForm.type == 'double'"
                :span="12"
              >
                <el-form-item label="小数位数" prop="precision">
                  <el-select v-model="sizeForm.precision" style="width: 100%">
                    <el-option :label="0" value="0" />
                    <el-option :label="1" value="1" />
                    <el-option :label="2" value="2" />
                    <el-option :label="3" value="3" />
                    <el-option :label="4" value="4" />
                    <el-option :label="5" value="5" />
                    <el-option :label="6" value="6" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="图标" prop="precision">
                  <el-avatar
                    :size="100"
                    :src="sizeForm.ico"
                    @click.native="uploadCkick('userinfo.avatar')"
                  />
                  <vab-input ref="uploadFinish" @fileInfo="fileInfo" />
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
            <el-row
              v-if="
                sizeForm.type == 'int' ||
                sizeForm.type == 'float' ||
                sizeForm.type == 'double'
              "
              :gutter="24"
            >
              <el-col :span="12">
                <!-- <el-form-item
                  prop="startnumber"
                  label="取值范围(最小值)"
                > -->
                <el-form-item
                  prop="startnumber"
                  :label="$translateTitle('product.valuerangemin')"
                >
                  <el-input
                    v-model.number="sizeForm.startnumber"
                    :placeholder="$translateTitle('product.minimumvalue')"
                    type="number"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!-- <el-form-item
                  prop="endnumber"
                  label="取值范围(最大值)"
                > -->
                <el-form-item
                  prop="endnumber"
                  :label="$translateTitle('product.valuerangemax')"
                >
                  <el-input
                    v-model.number="sizeForm.endnumber"
                    :placeholder="$translateTitle('product.maximumvalue')"
                    type="number"
                    @input="changeValue('sizeForm')"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              v-if="
                sizeForm.type == 'int' ||
                sizeForm.type == 'float' ||
                sizeForm.type == 'double'
              "
              :gutter="24"
            >
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
                <!-- 单位 -->
                <el-form-item :label="$translateTitle('product.unit')">
                  <el-select
                    v-model="sizeForm.unit"
                    style="width: 100%"
                    :placeholder="$translateTitle('product.unit')"
                    filterable
                  >
                    <el-option-group
                      v-for="group in allunit"
                      :key="group.label"
                      :label="group.label"
                    >
                      <el-option
                        v-for="item in group.options"
                        :key="item.id"
                        :label="item.symbol"
                        :value="item.symbol"
                      >
                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6">
                          {{ item.symbol }}
                        </span>
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!--BOOL数据类型添加格式-->
            <el-row v-if="sizeForm.type == 'bool'" :gutter="24">
              <el-col :span="12">
                <el-form-item
                  :label="$translateTitle('product.attribute')"
                  required
                  prop="truevalue"
                >
                  <el-input
                    v-model="sizeForm.truevalue"
                    :placeholder="$translateTitle('product.attribute')"
                    type="number"
                    readonly
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="-">
                  <el-input
                    v-model="sizeForm.true"
                    :placeholder="$translateTitle('product.egopen')"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="sizeForm.type == 'bool'" :gutter="24">
              <el-col :span="12">
                <el-form-item>
                  <el-input
                    v-model="sizeForm.falsevalue"
                    :placeholder="$translateTitle('product.attribute')"
                    type="number"
                    readonly
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="-">
                  <el-input
                    v-model="sizeForm.false"
                    :placeholder="$translateTitle('product.egclose')"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <!--枚举型添加格式-->
            <el-row v-if="sizeForm.type == 'enum'" :gutter="24">
              <el-col :span="24">
                <el-form-item label="枚举项">
                  <!--枚举型添加格式-->
                  <el-link
                    :underline="false"
                    icon="el-icon-plus"
                    type="primary"
                    @click="addDomain"
                  >
                    {{ $translateTitle('product.add') }}
                  </el-link>
                  <el-table
                    :data="sizeForm.struct"
                    style="width: 100%; text-align: center"
                  >
                    <el-table-column label="属性" align="center">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.attribute" />
                      </template>
                    </el-table-column>
                    <el-table-column label="属性值" align="center">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.attributevalue" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          type="danger"
                          plain
                          title="删除"
                          @click.native="removeDomain(scope.row)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
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
            <div v-if="sizeForm.type == 'text'">
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
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              {{ $translateTitle('task.dataacquisition') }}
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
                      <!-- <el-table-column label="标识符"> -->
                      <el-table-column
                        :label="$translateTitle('product.identifier')"
                      >
                        <template slot-scope="scope">
                          <span style="margin-left: 10px">
                            {{ scope.row.identifier }}
                          </span>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column label="功能名称"> -->
                      <el-table-column
                        :label="$translateTitle('product.functionname')"
                      >
                        <template slot-scope="scope">
                          <span style="margin-left: 10px">
                            {{ scope.row.name }}
                          </span>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column label="数据类型"> -->
                      <el-table-column
                        :label="$translateTitle('product.datatype')"
                      >
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
                    <!--                    <el-button-->
                    <!--                      slot="reference"-->
                    <!--                      style="text-align: center"-->
                    <!--                      size="mini"-->
                    <!--                    >-->
                    <!--                      &lt;!&ndash; 添加变量 &ndash;&gt;-->
                    <!--                      {{ $translateTitle('product.addvariable') }}-->
                    <!--                    </el-button>-->
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
                    placeholder="请选择生效轮次"
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
                    v-model="sizeForm.order"
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
              {{ $translateTitle('task.datacount') }}
            </template>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="是否统计">
                  <el-select
                    v-model="sizeForm.iscount"
                    style="width: 100%"
                    size="mini"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option label="否" value="0" />
                    <el-option label="是" value="1" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-tooltip
                  style="float: left"
                  effect="dark"
                  placement="right-start"
                >
                  <div slot="content">
                    统计策略表达式 。
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
                <el-form-item label="统计策略(单位：秒)">
                  <!-- <el-input v-model="sizeForm.rate" auto-complete="off">   <template slot="append">秒</template>
                  </el-input> -->
                  <el-select
                    v-model="sizeForm.countstrategy"
                    style="width: 95%"
                    size="mini"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in countsizeOption"
                      :key="item.val"
                      :label="item.label"
                      :value="item.val"
                      size="mini"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="统计轮次">
                  <!-- <el-input v-model="sizeForm.rate" auto-complete="off">   <template slot="append">秒</template>
                  </el-input> -->
                  <el-select
                    v-model="sizeForm.countround"
                    style="width: 100%"
                    size="mini"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择生效轮次"
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
                <el-form-item label="统计公式">
                  <el-input
                    v-model="sizeForm.countcollection"
                    style="width: 95%"
                    :rows="1"
                    type="textarea"
                    placeholder="%s"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="4">
            <template slot="title">数据来源</template>
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
                        'xinchuangwei',
                        'mingcheng',
                      ]"
                      :key="index"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-show="sizeForm.protocol == 'modbus'" :gutter="24">
              <el-col :span="12">
                <el-form-item label="数据格式">
                  <el-select
                    v-model="sizeForm.originaltype"
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
              v-show="sizeForm.protocol == 'modbus'"
              :data="dataList"
              border
              style="width: 100%"
              size="small"
            >
              <el-table-column
                align="center"
                label="从机地址(16进制加0X,例:0X10,否则是十进制)"
                min-width="120"
              >
                <!--关键代码-->
                <template slot-scope="scope">
                  <el-input v-model="sizeForm.slaveid" />
                  <span v-show="false">{{ scope.row }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="寄存器状态"
                min-width="120"
              >
                <!--关键代码-->
                <template slot-scope="scope">
                  <el-select
                    v-model="sizeForm.operatetype"
                    style="width: 100%"
                    placeholder="请选择"
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
                          label: '0X06:写单个保持寄存',
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
                  <span v-show="false">{{ scope.row.slaveid }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="数据地址(16进制加0X,例:0X10,否则是十进制)"
                min-width="120"
              >
                <!--关键代码-->
                <template slot-scope="scope">
                  <el-input v-model="sizeForm.dis" />
                  <span v-show="false">{{ scope.row.slaveid }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="数据长度(字节)"
                min-width="120"
              >
                <!--关键代码-->
                <template slot-scope="scope">
                  <el-input v-model="sizeForm.dinumber" />
                  <span v-show="false">{{ scope.row.slaveid }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-row v-show="sizeForm.protocol != 'modbus'" :gutter="24">
              <el-col :span="12">
                <el-form-item label="数据地址">
                  <el-input
                    v-model="sizeForm.dis"
                    :disabled="sizeForm.isdis"
                    placeholder="数据地址"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数据长度">
                  <el-input
                    v-model.number="sizeForm.dinumber"
                    placeholder="数据长度（字节）"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-form>
    <div style="margin-top: 26px; text-align: center">
      <el-button @click="wmxhandleClose">
        {{ $translateTitle('developer.cancel') }}
      </el-button>
      <!-- 物模型提交 -->
      <el-button type="primary" @click="submitForm('sizeForm')">
        {{ $translateTitle('developer.determine') }}
      </el-button>
    </div>
  </div>
</template>

<script>
  import mockModules from '@/api/Mock/Modules'

  console.log('dataType', mockModules)
  import { getAllunit } from '@/api/Dict/index'
  import { mapGetters, mapMutations } from 'vuex'
  import { putProject } from '@/api/Project'

  export default {
    name: 'Wmxdetail',
    components: {},
    data() {
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
      return {
        dataList: [{}],
        dataType: mockModules.mockModules.dataType,
        options: [
          { value: 'all', label: '全部' },
          { value: 'first', label: '第一轮' },
          { value: 'last', label: '最后一轮' },
        ],
        wmxData: [],
        allunit: mockModules.mockModules.dataNnit,
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
        collapseName: ['1', '2', '3', '4'],
        wmxstart: 1,
        wmxPageSize: 10,
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
        countsizeOption: [
          {
            label: '10',
            val: '10',
          },
          {
            label: '20',
            val: '20',
          },
          {
            label: '30',
            val: '30',
          },
        ],
      }
    },
    computed: {
      ...mapGetters({
        sizeForm: 'konva/sizeForm',
      }),
      showNewItem() {
        if (this.sizeForm && this.sizeForm.protocol == 'modbus') {
          return true
        } else {
          return false
        }
      },
    },
    watch: {},
    mounted() {
      // this.getAllunit()
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    activated() {},
    methods: {
      fileInfo(info) {
        console.log('uploadFinish', info)
        this.sizeForm.ico = info.url
      },
      uploadCkick(type) {
        this.upNodeType = type
        // 触发子组件的点击事件
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
      },
      ...mapMutations({
        setSizeForm: 'konva/setSizeForm',
      }),
      changeThing(item) {
        let that = this
        console.log('this.sizeFormaaa', that.$refs.sizeForm.model.name)
        console.log('item', item)
        var obj = {}
        // 提交之前需要先判断类型
        if (['float', 'double', 'int'].indexOf(item.dataType.type) != -1) {
          obj = {
            name: item.name,
            ico: item.ico,
            // item.dataType
            type: item.dataType.type,
            endnumber: that.$objGet(item, 'dataType.specs.max'),
            startnumber: that.$objGet(item, 'dataType.specs.min'),
            step: that.$objGet(item, 'dataType.specs.step'),
            unit: that.$objGet(item, 'dataType.specs.unit'),
            precision: this.$objGet(item, 'dataType.specs.precision'),
            // : item.dataForm.
            round: that.$objGet(item, 'dataForm.round'),
            dinumber: that.$objGet(item, 'dataForm.data'),
            rate: that.$objGet(item, 'dataForm.rate'),
            offset: that.$objGet(item, 'dataForm.offset'),
            order: that.$objGet(item, 'dataForm.order'),
            protocol: that.$objGet(item, 'dataForm.protocol'),
            operatetype: that.$objGet(item, 'dataForm.operatetype'),
            originaltype: that.$objGet(item, 'dataForm.originaltype'),
            slaveid: that.$objGet(item, 'dataForm.slaveid'),
            iscount: this.$objGet(item, 'dataForm.iscount'),
            countstrategy: this.$objGet(item, 'dataForm.countstrategy'),
            countround: this.$objGet(item, 'dataForm.countround'),
            countcollection: this.$objGet(item, 'dataForm.countcollection'),
            collection: '',
            control: '',
            strategy: '',
            required: true,
            isread: item.accessMode,
            identifier: item.identifier,
          }
          if (item.dataForm) {
            obj.collection = item.dataForm.collection
            obj.control = item.dataForm.control
            obj.strategy = item.dataForm.strategy
          }
        } else if (item.dataType.type == 'bool') {
          obj = {
            name: item.name,
            ico: item.ico,
            type: item.dataType.type,
            true: item.dataType.specs[1],
            false: item.dataType.specs[0],
            // item.dataForm.
            startnumber: that.$objGet(item, 'dataType.specs.min'),
            step: that.$objGet(item, 'dataType.specs.step'),
            unit: that.$objGet(item, 'dataType.specs.unit'),
            round: that.$objGet(item, 'dataForm.round'),
            dinumber: that.$objGet(item, 'dataForm.data'),
            rate: that.$objGet(item, 'dataForm.rate'),
            offset: that.$objGet(item, 'dataForm.offset'),
            order: that.$objGet(item, 'dataForm.order'),
            protocol: that.$objGet(item, 'dataForm.protocol'),
            operatetype: that.$objGet(item, 'dataForm.operatetype'),
            originaltype: that.$objGet(item, 'dataForm.originaltype'),
            slaveid: that.$objGet(item, 'dataForm.slaveid'),
            iscount: this.$objGet(item, 'dataForm.iscount'),
            countstrategy: this.$objGet(item, 'dataForm.countstrategy'),
            countround: this.$objGet(item, 'dataForm.countround'),
            countcollection: this.$objGet(item, 'dataForm.countcollection'),
            required: false,
            isread: item.accessMode,
            identifier: item.identifier,
            collection:
              item.dataForm == undefined ? '' : item.dataForm.collection,
            control: item.dataForm == undefined ? '' : item.dataForm.control,
            strategy: item.dataForm == undefined ? '' : item.dataForm.strategy,
          }
        } else if (item.dataType.type == 'enum') {
          var structArray = []
          for (const key in item.dataType.specs) {
            structArray.push({
              attribute: key,
              attributevalue: item.dataType.specs[key],
            })
          }
          obj = {
            name: item.name,
            ico: item.ico,
            type: item.dataType.type,
            specs: item.dataType.specs,
            struct: structArray,
            startnumber: that.$objGet(item, 'dataType.specs.min'),
            step: that.$objGet(item, 'dataType.specs.step'),
            unit: that.$objGet(item, 'dataType.specs.unit'),
            round: that.$objGet(item, 'dataForm.round'),
            dinumber: that.$objGet(item, 'dataForm.data'),
            rate: that.$objGet(item, 'dataForm.rate'),
            offset: that.$objGet(item, 'dataForm.offset'),
            order: that.$objGet(item, 'dataForm.order'),
            protocol: that.$objGet(item, 'dataForm.protocol'),
            operatetype: that.$objGet(item, 'dataForm.operatetype'),
            originaltype: that.$objGet(item, 'dataForm.originaltype'),
            slaveid: this.$objGet(item, 'dataForm.slaveid'),
            iscount: this.$objGet(item, 'dataForm.iscount'),
            countstrategy: this.$objGet(item, 'dataForm.countstrategy'),
            countround: this.$objGet(item, 'dataForm.countround'),
            countcollection: this.$objGet(item, 'dataForm.countcollection'),
            required: true,
            isread: item.accessMode,
            identifier: item.identifier,
            collection:
              item.dataForm == undefined ? '' : item.dataForm.collection,
            control: item.dataForm == undefined ? '' : item.dataForm.control,
            strategy: item.dataForm == undefined ? '' : item.dataForm.strategy,
          }
        } else if (item.dataType.type == 'struct') {
          obj = {
            name: item.name,
            ico: item.ico,
            type: item.dataType.type,
            struct: item.dataType.specs,
            startnumber: that.$objGet(item, 'dataType.specs.min'),
            step: that.$objGet(item, 'dataType.specs.step'),
            unit: that.$objGet(item, 'dataType.specs.unit'),
            round: that.$objGet(item, 'dataForm.round'),
            dinumber: that.$objGet(item, 'dataForm.data'),
            rate: that.$objGet(item, 'dataForm.rate'),
            offset: that.$objGet(item, 'dataForm.offset'),
            order: that.$objGet(item, 'dataForm.order'),
            protocol: that.$objGet(item, 'dataForm.protocol'),
            operatetype: that.$objGet(item, 'dataForm.operatetype'),
            originaltype: that.$objGet(item, 'dataForm.originaltype'),
            slaveid: that.$objGet(item, 'dataForm.slaveid'),
            iscount: this.$objGet(item, 'dataForm.iscount'),
            countstrategy: this.$objGet(item, 'dataForm.countstrategy'),
            countround: this.$objGet(item, 'dataForm.countround'),
            countcollection: this.$objGet(item, 'dataForm.countcollection'),
            required: true,
            isread: item.accessMode,
            collection:
              item.dataForm == undefined ? '' : item.dataForm.collection,
            control: item.dataForm == undefined ? '' : item.dataForm.control,
            identifier: item.dataForm == undefined ? '' : item.identifier,
            strategy: item.dataForm == undefined ? '' : item.dataForm.strategy,
          }
        } else if (item.dataType.type == 'text') {
          obj = {
            name: item.name,
            ico: item.ico,
            type: item.dataType.type,
            collection:
              item.dataForm == undefined ? '' : item.dataForm.collection,
            control: item.dataForm == undefined ? '' : item.dataForm.control,
            string: item.dataType.size,
            startnumber: this.$objGet(item, 'dataType.specs.min'),
            step: that.$objGet(item, 'dataType.specs.step'),
            unit: that.$objGet(item, 'dataType.specs.unit'),
            round: that.$objGet(item, 'dataForm.round'),
            dinumber: that.$objGet(item, 'dataForm.data'),
            rate: that.$objGet(item, 'dataForm.rate'),
            offset: that.$objGet(item, 'dataForm.offset'),
            order: that.$objGet(item, 'dataForm.order'),
            protocol: that.$objGet(item, 'dataForm.protocol'),
            operatetype: that.$objGet(item, 'dataForm.operatetype'),
            originaltype: that.$objGet(item, 'dataForm.originaltype'),
            slaveid: that.$objGet(item, 'dataForm.slaveid'),
            iscount: this.$objGet(item, 'dataForm.iscount'),
            countstrategy: this.$objGet(item, 'dataForm.countstrategy'),
            countround: this.$objGet(item, 'dataForm.countround'),
            countcollection: this.$objGet(item, 'dataForm.countcollection'),
            required: true,
            isread: item.accessMode,
            identifier: item.identifier,
            strategy: item.dataForm == undefined ? '' : item.dataForm.strategy,
          }
        } else if (item.dataType.type == 'date') {
          obj = {
            name: item.name,
            ico: item.ico,
            type: item.dataType.type,
            collection:
              item.dataForm == undefined ? '' : item.dataForm.collection,
            control: item.dataForm == undefined ? '' : item.dataForm.control,
            strategy: item.dataForm == undefined ? '' : item.dataForm.strategy,
            startnumber: that.$objGet(item, 'dataType.specs.min'),
            step: that.$objGet(item, 'dataType.specs.step'),
            unit: that.$objGet(item, 'dataType.specs.unit'),
            round: that.$objGet(item, 'dataForm.round'),
            dinumber: that.$objGet(item, 'dataForm.data'),
            rate: that.$objGet(item, 'dataForm.rate'),
            offset: that.$objGet(item, 'dataForm.offset'),
            order: that.$objGet(item, 'dataForm.order'),
            protocol: that.$objGet(item, 'dataForm.protocol'),
            operatetype: that.$objGet(item, 'dataForm.operatetype'),
            originaltype: that.$objGet(item, 'dataForm.originaltype'),
            slaveid: that.$objGet(item, 'dataForm.slaveid'),
            iscount: this.$objGet(item, 'dataForm.iscount'),
            countstrategy: this.$objGet(item, 'dataForm.countstrategy'),
            countround: this.$objGet(item, 'dataForm.countround'),
            countcollection: this.$objGet(item, 'dataForm.countcollection'),
            required: true,
            isread: item.accessMode,
            identifier: item.identifier,
          }
        }
        obj.nobound = this.sizeForm.nobound
        obj.dis = this.sizeForm.dis
        obj.isdis = this.sizeForm.isdis
        console.log('obj', obj)
        that.setSizeForm(obj)
      },
      wmxCurrentChange(val) {
        this.wmxstart = val
      },
      wmxSizeChange(val) {
        this.wmxstart = 1
        this.wmxPageSize = val
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
      // 删除枚举型
      removeDomain(item) {
        this.$emit('removeDomain', item)
      },
      addDomain() {
        this.$emit('addDomain')
      },
      wmxhandleClose() {
        this.$emit('wmxhandleClose')
      },
      changeValue(formName) {
        this.$refs[formName].validateField('startnumber', (errMsg) => {
          if (errMsg) {
            return false
          } else {
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.sizeForm, 'dsaf')
            this.$emit('submitForm', this.sizeForm)
            // this.$refs[formName].resetFields()
          } else {
            console.log(valid)
            console.log('error submit!!')
            return false
          }
        })
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
