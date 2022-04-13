<!-- 物模型详情组件 -->
<template>
  <div class="wmxheader">
    <dgiot-input
      ref="uploadFinish"
      :params="inputParams"
      @fileInfo="fileInfo"
      @files="files"
    />

    <el-dialog append-to-body :visible.sync="createModal.dialog" width="30%">
      <el-input v-model="createModal.data" :rows="6" type="textarea" />
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="createModal.dialog = false">取 消</el-button>
        <el-button type="primary" @click.native="createModal.dialog = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <el-form
      :key="upKey"
      ref="sizeForm"
      label-position="left"
      label-width="150px"
      :model="sizeForm"
      :rules="sizerule"
      size="medium"
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
              <el-col :span="8">
                <el-form-item label="图标" prop="precision">
                  <el-avatar
                    :key="sizeForm.ico"
                    :size="50"
                    :src="$FileServe + sizeForm.ico"
                    @click.native="uploadCkick('userinfo.avatar')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$translateTitle('product.devicetype')"
                  prop="devicetype"
                >
                  <el-input v-model="sizeForm.devicetype" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$translateTitle('product.functionname')"
                  prop="name"
                >
                  <el-select
                    v-if="sizeForm.nobound && sizeForm.nobound.length > 0"
                    v-model="sizeForm.name"
                    allow-create
                    default-first-option
                    filterable
                    placeholder="请选择"
                    style="width: 100%"
                    value-key="name"
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

              <el-col :span="8">
                <el-form-item
                  :label="$translateTitle('product.identifier')"
                  prop="identifier"
                >
                  <el-input
                    v-model="sizeForm.identifier"
                    :disabled="sizeForm.editdatatype"
                  />
                </el-form-item>
                <!--type-->
              </el-col>
              <el-col :span="8">
                <!-- 数据类型 -->
                <el-form-item
                  :label="$translateTitle('product.datatype')"
                  prop="type"
                >
                  <!--少个@change=selectStruct-->
                  <el-select
                    v-model="sizeForm.type"
                    :disabled="sizeForm.editdatatype"
                    style="width: 100%"
                    @change="changeGroup"
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
            </el-row>
            <el-row :gutter="24">
              <el-col
                v-if="sizeForm.type == 'float' || sizeForm.type == 'double'"
                :span="8"
              >
                <el-form-item label="小数位数" prop="precision">
                  <el-select v-model="sizeForm.precision" style="width: 100%">
                    <el-option :label="1" value="1" />
                    <el-option :label="2" value="2" />
                    <el-option :label="3" value="3" />
                    <el-option :label="4" value="4" />
                    <el-option :label="5" value="5" />
                    <el-option :label="6" value="6" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$translateTitle('product.readandwritetype')"
                  prop="isread"
                >
                  <el-radio-group
                    v-model="sizeForm.isread"
                    size="medium"
                    style="width: 100%"
                  >
                    <el-radio label="r">
                      {{ $translateTitle('product.read') }}
                    </el-radio>
                    <el-radio label="rw">
                      {{ $translateTitle('product.write') }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$translateTitle('product.isstorage')"
                  prop="isshow"
                >
                  <el-radio-group
                    v-model="sizeForm.isshow"
                    size="medium"
                    style="width: 100%"
                  >
                    <el-radio :label="true">
                      {{ $translateTitle('product.storage') }}
                    </el-radio>
                    <el-radio :label="false">
                      {{ $translateTitle('product.notstorage') }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$translateTitle('product.isaccumulate')"
                  prop="isshow"
                >
                  <el-radio-group
                    v-model="sizeForm.isaccumulate"
                    size="medium"
                    style="width: 100%"
                  >
                    <el-radio :label="true">累积</el-radio>
                    <el-radio :label="false">不累积</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col
                v-if="
                  moduletype == 'properties' &&
                  sizeForm.type !== 'enum' &&
                  sizeForm.type !== 'text'
                "
                :span="8"
              >
                <!-- <el-form-item
                  prop="startnumber"
                  label="取值范围(最小值)"
                > -->
                <el-form-item
                  v-if="
                    moduletype == 'properties' ||
                    sizeForm.type == 'int' ||
                    sizeForm.type == 'long' ||
                    sizeForm.type == 'float' ||
                    sizeForm.type == 'double'
                  "
                  :label="$translateTitle('product.valuerangemin')"
                  prop="startnumber"
                >
                  <el-input
                    v-model.number="sizeForm.startnumber"
                    :placeholder="$translateTitle('product.minimumvalue')"
                    type="number"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              v-if="
                sizeForm.type == 'int' ||
                sizeForm.type == 'long' ||
                sizeForm.type == 'float' ||
                sizeForm.type == 'double'
              "
              :gutter="24"
            >
              <el-col v-if="moduletype == 'properties'" :span="12">
                <!-- <el-form-item
                  prop="endnumber"
                  label="取值范围(最大值)"
                > -->
                <el-form-item
                  :label="$translateTitle('product.valuerangemax')"
                  prop="endnumber"
                >
                  <el-input
                    v-model.number="sizeForm.endnumber"
                    :placeholder="$translateTitle('product.maximumvalue')"
                    type="number"
                    @input="changeValue('sizeForm')"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="moduletype == 'properties'" :span="6">
                <el-form-item label="步长" prop="step">
                  <el-input-number
                    v-model="sizeForm.step"
                    controls-position="right"
                    :min="0"
                    :precision="2"
                    :step="0.01"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="moduletype == 'properties'" :span="6">
                <!-- 单位 -->
                <el-form-item :label="$translateTitle('product.unit')">
                  <el-select
                    v-model="sizeForm.unit"
                    filterable
                    :placeholder="$translateTitle('product.unit')"
                    style="width: 100%"
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
              <el-col :span="4">
                <el-form-item
                  :label="$translateTitle('product.attribute')"
                  prop="truevalue"
                  required
                >
                  <el-input
                    v-model="sizeForm.truevalue"
                    :placeholder="$translateTitle('product.attribute')"
                    readonly
                    type="number"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="-">
                  <el-input
                    v-model="sizeForm.true"
                    :placeholder="$translateTitle('product.egopen')"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="sizeForm.type == 'bool'" :gutter="24">
              <el-col :span="4">
                <el-form-item>
                  <el-input
                    v-model="sizeForm.falsevalue"
                    :placeholder="$translateTitle('product.attribute')"
                    readonly
                    type="number"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
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
                    icon="el-icon-plus"
                    type="primary"
                    :underline="false"
                    @click="addDomain"
                  >
                    {{ $translateTitle('product.add') }}
                  </el-link>
                  <el-alert
                    :closable="false"
                    description="存库值必须是int类型，界面值是字符串类型,设备值与存库值转化请使用采集公式"
                    title="参数提示"
                    type="success"
                  />
                  <el-table
                    :data="sizeForm.struct"
                    style="width: 100%; text-align: center"
                  >
                    <el-table-column align="center" label="存库值">
                      <template #default="{ row }">
                        <el-input v-model="row.attribute" />
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="界面值">
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
                    style="display: flex; list-style: none"
                    value="item"
                  >
                    <div>
                      <span>
                        {{ $translateTitle('product.parametername') + ':' }}}
                      </span>
                      <span>{{ item.name }}</span>
                    </div>
                    <div>
                      <el-link
                        style="margin-left: 20px"
                        type="primary"
                        :underline="false"
                        @click="editStruct(item, index)"
                      >
                        {{ $translateTitle('developer.edit') }}
                      </el-link>
                      <el-link
                        type="primary"
                        :underline="false"
                        @click="deleteStruct(index)"
                      >
                        {{ $translateTitle('developer.delete') }}
                      </el-link>
                    </div>
                  </li>
                </ul>
                <el-link
                  icon="el-icon-plus"
                  type="primary"
                  :underline="false"
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
            <!--            地理位置-->
            <div v-if="sizeForm.type == 'geopoint'">
              <!--百度地图-->
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    class="is-required"
                    :label="$translateTitle('product.gps type')"
                  >
                    <el-select
                      v-model="sizeForm.gpstype"
                      clearable
                      style="width: 100%"
                    >
                      <el-option
                        v-for="(item, key) in ['NMEA0183']"
                        :key="key"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <!--              谷歌地图-->
              <!--              高德地图-->
            </div>
            <!--           文件类型 -->
            <div v-if="sizeForm.type == 'file'">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    class="is-required"
                    :label="$translateTitle('product.image type')"
                  >
                    <el-select
                      v-model="options.value"
                      clearable
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in ['二进制', 'Base64']"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$translateTitle('product.File parameters')"
                  >
                    <el-input v-model="sizeForm.file" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <!--           图片类型 -->
            <div v-if="sizeForm.type == 'image'">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    class="is-required"
                    :label="$translateTitle('product.image type')"
                  >
                    <el-select
                      v-model="sizeForm.imagevalue"
                      clearable
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in ['jpg', 'png', 'ico']"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!--                <el-col :span="12">-->
                <!--                  <el-form-item :label="$translateTitle('product.Link')">-->
                <!--                    <el-input v-model="sizeForm.Link"/>-->
                <!--                  </el-form-item>-->
                <!--                </el-col>-->
              </el-row>
            </div>
          </el-collapse-item>
          <el-collapse-item v-if="moduletype == 'properties'" name="2">
            <template slot="title">
              {{ $translateTitle('task.dataacquisition') }}
              <el-row style="margin: 0 auto">
                <el-col :span="2">
                  <el-popover placement="right" trigger="click" width="400">
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
                        <template #default="{ row }">
                          <span style="margin-left: 10px">
                            {{ row.identifier }}
                          </span>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column label="功能名称"> -->
                      <el-table-column
                        :label="$translateTitle('product.functionname')"
                      >
                        <template #default="{ row }">
                          <span style="margin-left: 10px">
                            {{ row.name }}
                          </span>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column label="数据类型"> -->
                      <el-table-column
                        :label="$translateTitle('product.datatype')"
                      >
                        <template #default="{ row }">
                          <span style="margin-left: 10px">
                            {{ row.dataType.type }}
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-pagination
                      layout="total, sizes, prev, pager, next, jumper"
                      :page-size="wmxPageSize"
                      :page-sizes="[10, 20, 30, 50]"
                      style="margin-top: 10px"
                      :total="wmxData.length"
                      @current-change="wmxCurrentChange"
                      @size-change="wmxSizeChange"
                    />
                  </el-popover>
                </el-col>
              </el-row>
            </template>
            <el-row :gutter="24">
              <el-col :span="8">
                <el-tooltip
                  effect="dark"
                  placement="right-start"
                  style="float: left"
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
                    allow-create
                    default-first-option
                    filterable
                    placeholder="请选择"
                    size="mini"
                    style="width: 95%"
                  >
                    <el-option
                      v-for="item in sizeOption"
                      :key="item.val"
                      :label="item.label"
                      size="mini"
                      :value="item.val"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采集轮次">
                  <!-- <el-input v-model="sizeForm.rate" auto-complete="off">   <template slot="append">秒</template>
                  </el-input> -->
                  <el-select
                    v-model="sizeForm.round"
                    allow-create
                    default-first-option
                    filterable
                    placeholder="请选择生效轮次,例如:1,3,5,8;(可选可自主填写)(注意:逗号为英文逗号)"
                    size="mini"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采集顺序" style="width: 100%">
                  <el-input-number
                    v-model="sizeForm.order"
                    label="采集顺序"
                    :min="0"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :gutter="24">
              <el-col :span="8">
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
                    placeholder="%s"
                    :rows="1"
                    style="width: 90%"
                    type="textarea"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
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
                    placeholder="%s"
                    :rows="1"
                    style="width: 90%"
                    type="textarea"
                  />
                </el-form-item>
                <!--type-->
              </el-col>
              <el-col :span="8">
                <el-form-item label="协议类型">
                  <el-select
                    v-model="resource.value"
                    :disabled="resource.disabled"
                    placeholder="请选择"
                    style="width: 100%"
                    @change="changeResource"
                  >
                    <el-option
                      v-for="item in resource.data"
                      :key="item.cType"
                      :label="item.cType"
                      :value="item.cType"
                    >
                      <span style="float: left">{{ item.title.zh }}</span>
                      <el-link
                        style="float: right; color: #8492a6; font-size: 13px"
                      >
                        协议:{{ item.app }}
                      </el-link>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
          </el-collapse-item>
          <el-collapse-item v-if="resource.value" :key="upKey" name="4">
            <template slot="title">数据来源</template>
            <el-row
              v-for="(k, index) in resource.data"
              :key="index"
              :gutter="24"
            >
              <el-col
                v-for="(item, index) in resource.data[index].arr"
                v-show="resource.value == k.cType"
                :key="resource.value + index + upKey"
                :lg="item.allowCreate ? 24 : 12"
                :md="item.allowCreate ? 24 : 12"
                :sm="item.allowCreate ? 24 : 12"
                :xl="item.allowCreate ? 24 : 6"
                :xs="item.allowCreate ? 24 : 12"
              >
                <el-form-item
                  v-if="item.showname != 'ico'"
                  id="allowCreate"
                  :key="item.title.zh + upKey"
                  :label="item.title.zh"
                  :label-width="item.allowCreate ? '100px' : '100px'"
                  :prop="item.showname"
                >
                  <el-tooltip effect="dark" placement="right-start">
                    <div slot="content">
                      {{ item.description.zh }}
                    </div>
                    <i class="el-icon-question" style="float: left" />
                  </el-tooltip>
                  <el-select
                    v-if="item.type == 'enum' || item._types == 'enum'"
                    v-model="resource.addchannel[item.showname]"
                    style="width: 98%"
                  >
                    <el-option
                      v-for="(item1, index1) in item.enum"
                      :key="item.enum[index1].value"
                      :label="item.enum[index1].label"
                      :value="item.enum[index1].value"
                    />
                  </el-select>
                  <div v-else-if="item.allowCreate">
                    <el-button @click="createColumn(item)">新增</el-button>

                    <el-table :data="dybaneucForms" style="width: 100%">
                      <el-table-column
                        v-for="(j, index) in colCum.prop"
                        :key="index"
                        align="center"
                        :label="colCum.prop[index]"
                        :prop="colCum.label[index]"
                        show-overflow-tooltip
                        sortable
                      >
                        <template slot-scope="scope">
                          <el-input
                            v-show="getFromType(item, j) == 'input'"
                            v-model="scope.row[j]"
                            placeholder="placeholder"
                          />
                          <el-select
                            v-show="getFromType(item, j) == 'select'"
                            v-model="scope.row[j]"
                            placeholder="placeholder"
                          >
                            <el-option
                              v-for="item in getFromType(item, j, 'select')"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        align="center"
                        fixed="right"
                        label="操作"
                        width="220px"
                      >
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            type="danger"
                            @click.native="
                              dybaneucDleform(scope.$index, dybaneucForms)
                            "
                          >
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <el-input
                    v-else-if="
                      item.type == 'string' &&
                      item._types !== 'enum' &&
                      !item.dis
                    "
                    :key="item.title.zh + upKey"
                    v-model="resource.addchannel[item.showname]"
                    style="width: 98%"
                  />
                  <el-input
                    v-else-if="item.type == 'integer'"
                    :key="item.title.zh + upKey"
                    v-model.number="resource.addchannel[item.showname]"
                    style="width: 98%"
                  />
                  <el-select
                    v-else-if="item.type == 'boolean'"
                    :key="item.title.zh + upKey"
                    v-model="resource.addchannel[item.showname]"
                    class="notauto"
                    readonly
                    style="width: 98%"
                  >
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                  </el-select>
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
      <el-button type="primary" @click.native="submitForm('sizeForm')">
        {{ $translateTitle('developer.determine') }}
      </el-button>
    </div>
  </div>
</template>

<script>
  import mockModules from '@/api/Mock/Modules'

  // dgiotlog.log('dataType', mockModules)
  import { delDict, getAllunit } from '@/api/Dict/index'
  import { getProtocol } from '@/api/Protocol/index'
  import { mapGetters, mapMutations } from 'vuex'
  import defaultLogo from '../../../../../public/assets/images/logo/logo.png'

  export default {
    name: 'Wmxdetail',
    components: {},
    props: {
      moduletype: {
        type: String,
        required: false,
        default: 'properties', // properties // tags // services // events
      },
    },
    data() {
      let identifier = /^[a-z][a-z0-9_]*$/
      let isidentifier = (rule, value, callback) => {
        if (!identifier.test(value)) {
          return callback(
            new Error('请以小写字母开头，只能输入小写字母,数字,_')
          )
        } else {
          callback()
        }
      }
      var validminnumber = (rule, value, callback) => {
        // dgiotlog.log(value);
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
        colCum: {},
        dybaneucForms: [],
        tableName: '',
        tableTitle: {},
        upKey: moment.now(),
        createModal: {
          dialog: false,
          data: '',
        },
        resource: {
          value: '',
          data: [],
          arrlist: [],
          addchannel: {},
          disabled: false,
          changeData: {},
        },
        value: '',
        inputParams: {},
        dataList: [{}],
        dataType: mockModules.mockModules.dataType,
        options: [
          {
            value: 'all',
            label: '全部',
          },
          {
            value: 'first',
            label: '第一轮',
          },
          {
            value: 'last',
            label: '最后一轮',
          },
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
            { validator: isidentifier },
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
          isshow: [
            {
              required: true,
              message: '请选择是否存储',
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
    watch: {
      'resource.arrlist': {
        deep: true,
        immediate: true,
        handler(e) {
          this.upKey++
        },
      },
    },
    async created() {
      /**
       * @description 查询资源通道
       */
      await this.queryResource()
    },
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    activated() {},
    methods: {
      handleClick(tab) {
        console.log(tab)
      },
      createColumn(tab) {
        this.dybaneucForms.unshift({})
        console.log(tab)
      },
      getFromType(item, column, type) {
        var res = 'input'
        for (var i in item.table) {
          if (item.table[i].title.zh == column) {
            res = item.table[i].enum?.length ? 'select' : 'input'
            if (type === 'select') return item.table[i].enum
            else return res
          }
        }
      },
      dybaneucDleform(index, row) {
        this.$baseConfirm(
          this.$translateTitle(
            'Maintenance.Are you sure you want to delete the current item'
          ),
          null,
          async () => {
            row.splice(index, 1)
            this.$baseMessage(
              this.$translateTitle('user.successfully deleted'),
              'success',
              'dgiot-hey-message-success'
            )
          }
        )
        console.log(index, row)
      },
      dynamicTable(data, type, _table) {
        console.log(type)
        this.tableName = data.showname
        var dybaneucForms = []
        this.colCum = { label: [], prop: [] }
        dgiotlogger.error(1291, data, _table)
        const { table } = data
        var arr = {}
        var title = {}
        for (let t in table) {
          arr[table[t].title.zh] = table[t].default.label || table[t].default
          this.colCum.prop.push(table[t].title.zh)
          this.colCum.label.push(table[t].key)
          title[table[t].title.zh] = table[t].key
          title[table[t].key] = table[t].zh
          arr[table[t].key] = table[t].default.label || table[t].default
          this.tableTitle = title
          console.error(1298, table[t], t, arr)
          console.error(1304, t, table[t], this.tableTitle)
        }
        if (type === '回显') {
          console.error(1307, '回显', title)
          dybaneucForms = []
          _table.forEach((_itme, _tidx) => {
            arr = {}
            for (var t in title) {
              var _title = title[t]
              arr[t] = _itme[_title]
              console.error(_itme[_title], t, _itme, 1312)
            }
            dybaneucForms.push(arr)
          })
        } else {
          dybaneucForms.push(arr)
        }
        dgiotlogger.error('1320', dybaneucForms, this.colCum, this.tableTitle)
        this.dybaneucForms = dybaneucForms
        return this.dybaneucForms
      },
      async showCreate(row) {
        this.createModal = {
          dialog: true,
          data: row,
        }
      },
      // 解析物模型字典为指定类型
      dictParse(dybaneucForms, title) {
        const obj = []
        dybaneucForms.map((i) => {
          var arr = {}
          for (let j in i) {
            console.log(j, i[j], title[j])
            arr[title[j]] = i[j]
          }
          obj.push(arr)
        })
        dgiotlogger.error(1328, obj)
        return obj
      },
      async changeResource(val) {
        console.error('changeResource', val)
        this.resource.changeData = {}
        // this.resource.arrlist = []
        // this.$nextTick(async () => {
        await this.$refs['sizeForm'].clearValidate()
        await this.resource.data.forEach((resource) => {
          if (resource.cType == val) {
            this.resource.changeData = resource
            this.resource.arrlist = resource.arr
            this.resource.addchannel = resource.obj
            console.log(this.resource.arrlist)
            this.resource.arrlist.forEach((i) => {
              console.error(i)
              if (i.allowCreate) this.dynamicTable(i)
            })
            // allowCreate
          }
        })
        //  修改子组件el-form 后 修改父组件的uPKey
        // })
      },
      async queryResource() {
        this.resource.data = (await getProtocol()) ?? [
          {
            app: 'dgiot_meter',
            cType: 'DLT376',
            colum: 10,
            description: {
              zh: 'DLT376协议',
            },
            mod: 'dlt376_decoder',
            params: {
              afn: {
                default: '00',
                description: {
                  zh: '功能码',
                },
                order: 1,
                required: true,
                title: {
                  zh: '功能码',
                },
                type: 'string',
              },
              di: {
                default: '0000',
                description: {
                  zh: '信息标识',
                },
                order: 2,
                required: true,
                title: {
                  zh: '信息标识',
                },
                type: 'string',
              },
              ico: {
                default:
                  'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/product/dgiot/channel/MQTT.png',
                description: {
                  en: 'protocol ICO',
                  zh: '协议ICO',
                },
                order: 102,
                required: false,
                title: {
                  en: 'protocol ICO',
                  zh: '协议ICO',
                },
                type: 'string',
              },
              length: {
                default: 'byte',
                description: {
                  zh: '长度',
                },
                enum: ['byte', 'little', 'bit'],
                order: 4,
                required: true,
                title: {
                  zh: '长度',
                },
                type: 'integer',
              },
              type: {
                default: 'byte',
                description: {
                  zh: '数据类型',
                },
                enum: ['byte', 'little', 'bit'],
                order: 3,
                required: true,
                title: {
                  zh: '数据类型',
                },
                type: 'string',
              },
            },
            title: {
              zh: 'DLT376协议',
            },
            type: 'energy',
            vsn: [52, 46, 51, 46, 48],
          },
        ]
        this.resource.data.forEach((item, index) => {
          this.resource.data[index].arr = []
          this.resource.data[index].obj = {}
          for (var key in this.resource.data[index].params) {
            this.resource.data[index].params[key].showname = key
            for (var resource in this.resource.data[index].params[key]) {
              // dgiotlogger.log(resource, 'resource')
              if (resource === 'enum') {
                this.resource.data[index].params[key]._types = 'enum'
                dgiotlogger.info(
                  '设置类型为下拉',
                  resource,
                  this.resource.data[index].params[key]
                )
              }
            }
            this.resource.data[index].arr.push(item.params[key])
          }
          this.resource.data[index].arr.map((_item) => {
            this.resource.data[index].obj[_item.showname] = _item?.default
              ?.value
              ? _item.default.value
              : _item.default
              ? _item.default
              : ''
            // _item.enum
            //   ? console.info(_item.enum, _item, 'set select')
            //   : console.log(_item.enum, _item, 'default')
            if (_item.enum)
              // 设置默认值
              dgiotlogger.info(_item.type, _item.enum, _item, 'set select')
          })
        })
        console.info('this.resource.data', this.resource.data)
      },
      // 数据类型
      changeGroup(type) {
        console.log(type, this.sizeForm.type)
      },
      fileInfo(info) {
        dgiotlog.log('========================', info)
        this.sizeForm.ico = info.path
        console.log('========================path', this.sizeForm.ico)
      },
      uploadCkick(type) {
        this.upNodeType = type
        // 触发子组件的点击事件
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
        this.inputParams = {
          file: '',
          scene: 'app',
          path: 'devicething/ico/',
          filename: '',
        }
      },
      files(file, type) {
        this.inputParams.filename = `${this.$route.query.id}.${
          this.sizeForm.identifier
            ? this.sizeForm.identifier
            : moment().format('x')
        }.${type}`
        this.inputParams.file = file
      },
      ...mapMutations({
        setSizeForm: 'konva/setSizeForm',
      }),
      changeThing(item) {
        let that = this
        dgiotlog.log('this.sizeFormaaa', that.$refs.sizeForm.model.name)
        dgiotlog.log('item', item)
        var obj = {}
        var daslist = []
        item.dataType.das.forEach((val) => {
          daslist.push({
            addr: val,
          })
        })
        // 提交之前需要先判断类型
        if (
          ['float', 'double', 'int', 'long'].indexOf(item.dataType.type) != -1
        ) {
          obj = {
            name: item.name,
            devicetype: item.devicetype,
            ico: item.ico,
            // item.dataType
            type: item.dataType.type,
            daslist: daslist,
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
            afn: that.$objGet(item, 'dataForm.afn'),
            da: that.$objGet(item, 'dataForm.da'),
            dt: that.$objGet(item, 'dataForm.dt'),
            bytelen: that.$objGet(item, 'dataForm.bytelen'),
            byteType: that.$objGet(item, 'dataForm.byteType'),
            iscount: that.$objGet(item, 'dataForm.iscount'),
            countstrategy: that.$objGet(item, 'dataForm.countstrategy'),
            countround: that.$objGet(item, 'dataForm.countround'),
            countcollection: that.$objGet(item, 'dataForm.countcollection'),
            collection: '',
            control: '',
            strategy: '',
            required: true,
            isread: item.accessMode,
            isshow: item.isshow,
            isaccumulate: item.isaccumulate,
            identifier: item.identifier,
          }
          if (item.dataForm) {
            obj.collection = item.dataForm.collection
            obj.control = item.dataForm.control
            obj.strategy = item.dataForm.strategy
          }
        } else if (item.dataType.type == 'image') {
          obj = {
            name: item.name,
            devicetype: item.devicetype,
            ico: item.ico,
            type: item.dataType.type,
            daslist: daslist,
            imagevalue: item.dataType.imagevalue,
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
            afn: that.$objGet(item, 'dataForm.afn'),
            da: that.$objGet(item, 'dataForm.da'),
            dt: that.$objGet(item, 'dataForm.dt'),
            bytelen: that.$objGet(item, 'dataForm.bytelen'),
            byteType: that.$objGet(item, 'dataForm.byteType'),
            iscount: that.$objGet(item, 'dataForm.iscount'),
            countstrategy: that.$objGet(item, 'dataForm.countstrategy'),
            countround: that.$objGet(item, 'dataForm.countround'),
            countcollection: that.$objGet(item, 'dataForm.countcollection'),
            required: false,
            isread: item.accessMode,
            isshow: item.isshow,
            isaccumulate: item.isaccumulate,
            identifier: item.identifier,
            collection:
              item.dataForm == undefined ? '' : item.dataForm.collection,
            control: item.dataForm == undefined ? '' : item.dataForm.control,
            strategy: item.dataForm == undefined ? '' : item.dataForm.strategy,
          }
        } else if (item.dataType.type == 'bool') {
          obj = {
            name: item.name,
            devicetype: item.devicetype,
            ico: item.ico,
            type: item.dataType.type,
            daslist: daslist,
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
            afn: that.$objGet(item, 'dataForm.afn'),
            da: that.$objGet(item, 'dataForm.da'),
            dt: that.$objGet(item, 'dataForm.dt'),
            bytelen: that.$objGet(item, 'dataForm.bytelen'),
            byteType: that.$objGet(item, 'dataForm.byteType'),
            iscount: that.$objGet(item, 'dataForm.iscount'),
            countstrategy: that.$objGet(item, 'dataForm.countstrategy'),
            countround: that.$objGet(item, 'dataForm.countround'),
            countcollection: that.$objGet(item, 'dataForm.countcollection'),
            required: false,
            isread: item.accessMode,
            isshow: item.isshow,
            isaccumulate: item.isaccumulate,
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
            devicetype: item.devicetype,
            ico: item.ico,
            type: item.dataType.type,
            daslist: daslist,
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
            slaveid: that.$objGet(item, 'dataForm.slaveid'),
            afn: that.$objGet(item, 'dataForm.afn'),
            da: that.$objGet(item, 'dataForm.da'),
            dt: that.$objGet(item, 'dataForm.dt'),
            bytelen: that.$objGet(item, 'dataForm.bytelen'),
            byteType: that.$objGet(item, 'dataForm.byteType'),
            iscount: that.$objGet(item, 'dataForm.iscount'),
            countstrategy: that.$objGet(item, 'dataForm.countstrategy'),
            countround: that.$objGet(item, 'dataForm.countround'),
            countcollection: that.$objGet(item, 'dataForm.countcollection'),
            required: true,
            isread: item.accessMode,
            isshow: item.isshow,
            isaccumulate: item.isaccumulate,
            identifier: item.identifier,
            collection:
              item.dataForm == undefined ? '' : item.dataForm.collection,
            control: item.dataForm == undefined ? '' : item.dataForm.control,
            strategy: item.dataForm == undefined ? '' : item.dataForm.strategy,
          }
        } else if (item.dataType.type == 'struct') {
          obj = {
            name: item.name,
            devicetype: item.devicetype,
            ico: item.ico,
            type: item.dataType.type,
            daslist: daslist,
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
            afn: that.$objGet(item, 'dataForm.afn'),
            da: that.$objGet(item, 'dataForm.da'),
            dt: that.$objGet(item, 'dataForm.dt'),
            bytelen: that.$objGet(item, 'dataForm.bytelen'),
            byteType: that.$objGet(item, 'dataForm.byteType'),
            iscount: that.$objGet(item, 'dataForm.iscount'),
            countstrategy: that.$objGet(item, 'dataForm.countstrategy'),
            countround: that.$objGet(item, 'dataForm.countround'),
            countcollection: that.$objGet(item, 'dataForm.countcollection'),
            required: true,
            isread: item.accessMode,
            isshow: item.isshow,
            isaccumulate: item.isaccumulate,
            collection:
              item.dataForm == undefined ? '' : item.dataForm.collection,
            control: item.dataForm == undefined ? '' : item.dataForm.control,
            identifier: item.dataForm == undefined ? '' : item.identifier,
            strategy: item.dataForm == undefined ? '' : item.dataForm.strategy,
          }
        } else if (item.dataType.type == 'text') {
          obj = {
            name: item.name,
            devicetype: item.devicetype,
            ico: item.ico,
            type: item.dataType.type,
            daslist: daslist,
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
            afn: that.$objGet(item, 'dataForm.afn'),
            da: that.$objGet(item, 'dataForm.da'),
            dt: that.$objGet(item, 'dataForm.dt'),
            bytelen: that.$objGet(item, 'dataForm.bytelen'),
            byteType: that.$objGet(item, 'dataForm.byteType'),
            iscount: that.$objGet(item, 'dataForm.iscount'),
            countstrategy: that.$objGet(item, 'dataForm.countstrategy'),
            countround: that.$objGet(item, 'dataForm.countround'),
            countcollection: that.$objGet(item, 'dataForm.countcollection'),
            required: true,
            isread: item.accessMode,
            isshow: item.isshow,
            isaccumulate: item.isaccumulate,
            identifier: item.identifier,
            strategy: item.dataForm == undefined ? '' : item.dataForm.strategy,
          }
        } else if (item.dataType.type == 'date') {
          obj = {
            name: item.name,
            devicetype: item.devicetype,
            ico: item.ico,
            type: item.dataType.type,
            daslist: daslist,
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
            afn: that.$objGet(item, 'dataForm.afn'),
            da: that.$objGet(item, 'dataForm.da'),
            dt: that.$objGet(item, 'dataForm.dt'),
            bytelen: that.$objGet(item, 'dataForm.bytelen'),
            byteType: that.$objGet(item, 'dataForm.byteType'),
            iscount: that.$objGet(item, 'dataForm.iscount'),
            countstrategy: that.$objGet(item, 'dataForm.countstrategy'),
            countround: that.$objGet(item, 'dataForm.countround'),
            countcollection: that.$objGet(item, 'dataForm.countcollection'),
            required: true,
            isread: item.accessMode,
            isshow: item.isshow,
            isaccumulate: item.isaccumulate,
            identifier: item.identifier,
          }
        } else if (item.dataType.type == 'file') {
          obj = {
            name: item.name,
            devicetype: item.devicetype,
            ico: item.ico,
            type: item.dataType.type,
            daslist: daslist,
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
            afn: this.$objGet(item, 'dataForm.afn'),
            da: this.$objGet(item, 'dataForm.da'),
            dt: this.$objGet(item, 'dataForm.dt'),
            bytelen: that.$objGet(item, 'dataForm.bytelen'),
            byteType: that.$objGet(item, 'dataForm.byteType'),
            iscount: that.$objGet(item, 'dataForm.iscount'),
            countstrategy: that.$objGet(item, 'dataForm.countstrategy'),
            countround: that.$objGet(item, 'dataForm.countround'),
            countcollection: that.$objGet(item, 'dataForm.countcollection'),
            required: true,
            isread: item.accessMode,
            isshow: item.isshow,
            isaccumulate: item.isaccumulate,
            identifier: item.identifier,
          }
        } else if (item.dataType.type == 'url') {
          obj = {
            name: item.name,
            devicetype: item.devicetype,
            ico: item.ico,
            type: item.dataType.type,
            daslist: daslist,
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
            afn: that.$objGet(item, 'dataForm.afn'),
            da: that.$objGet(item, 'dataForm.da'),
            dt: that.$objGet(item, 'dataForm.dt'),
            bytelen: that.$objGet(item, 'dataForm.bytelen'),
            byteType: that.$objGet(item, 'dataForm.byteType'),
            iscount: that.$objGet(item, 'dataForm.iscount'),
            countstrategy: that.$objGet(item, 'dataForm.countstrategy'),
            countround: that.$objGet(item, 'dataForm.countround'),
            countcollection: that.$objGet(item, 'dataForm.countcollection'),
            required: true,
            isread: item.accessMode,
            isaccumulate: item.isaccumulate,
            isshow: item.isshow,
            identifier: item.identifier,
          }
        } else if (item.dataType.type == 'geopoint') {
          obj = {
            name: item.name,
            devicetype: item.devicetype,
            ico: item.ico,
            type: item.dataType.type,
            daslist: daslist,
            gpstype: item.dataType.gpstype,
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
            afn: that.$objGet(item, 'dataForm.afn'),
            da: that.$objGet(item, 'dataForm.da'),
            dt: that.$objGet(item, 'dataForm.dt'),
            bytelen: that.$objGet(item, 'dataForm.bytelen'),
            byteType: that.$objGet(item, 'dataForm.byteType'),
            iscount: that.$objGet(item, 'dataForm.iscount'),
            countstrategy: that.$objGet(item, 'dataForm.countstrategy'),
            countround: that.$objGet(item, 'dataForm.countround'),
            countcollection: that.$objGet(item, 'dataForm.countcollection'),
            required: true,
            isread: item.accessMode,
            isaccumulate: item.isaccumulate,
            isshow: item.isshow,
            isaccumulate: item.isaccumulate,
            identifier: item.identifier,
          }
        }
        obj.nobound = that.sizeForm.nobound
        obj.dis = item.dataForm.address
        obj.isdis = that.sizeForm.isdis
        dgiotlogger.log('obj', obj)
        that.setSizeForm(obj)
      },
      wmxCurrentChange(val) {
        console.log(this.wmxData)
        this.wmxstart = val
      },
      wmxSizeChange(val) {
        console.log(this.wmxData)
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
      addDas() {
        this.$emit('addDas')
      },
      removeDas(item) {
        this.$emit('removeDas', item)
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
        const table = this.dictParse(this.dybaneucForms, this.tableTitle)
        console.log(table)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var sizeForm = this.sizeForm
            var das = []
            sizeForm.daslist.map((items) => {
              var newval = items['addr']
              das.push(newval)
            })
            var obj = {
              name: sizeForm.name,
              devicetype: sizeForm.devicetype,
              dataForm: {
                round: sizeForm.round,
                data: sizeForm.dinumber,
                address: sizeForm.dis,
                rate: sizeForm.rate,
                offset: sizeForm.offset,
                order: sizeForm.order,
                protocol: sizeForm.protocol,
                afn: sizeForm.afn,
                da: sizeForm.da,
                dt: sizeForm.dt,
                bytelen: sizeForm.bytelen,
                byteType: sizeForm.byteType,
                operatetype: sizeForm.operatetype,
                originaltype: sizeForm.originaltype,
                slaveid: sizeForm.slaveid,
                collection: sizeForm.collection,
                control: sizeForm.control,
                strategy: sizeForm.strategy,
                iscount: sizeForm.iscount,
                countstrategy: sizeForm.countstrategy,
                countround: sizeForm.countround,
                countcollection: sizeForm.countcollection,
              },
              ico: sizeForm.ico,
              required: true,
              accessMode: sizeForm.isread,
              isshow: sizeForm.isshow,
              isaccumulate: sizeForm.isaccumulate,
              identifier: sizeForm.identifier,
            }
            // 提交之前需要先判断类型
            if (
              sizeForm.type == 'float' ||
              sizeForm.type == 'double' ||
              sizeForm.type == 'int' ||
              sizeForm.type == 'long'
            ) {
              var obj1 = {
                dataType: {
                  type: sizeForm.type.toLowerCase(),
                  specs: {
                    max: sizeForm.endnumber,
                    min: sizeForm.startnumber,
                    step: sizeForm.step,
                    precision: Number(sizeForm.precision),
                    unit: sizeForm.unit == '' ? '' : sizeForm.unit,
                  },
                  das: das,
                },
              }
              Object.assign(obj, obj1)
            } else if (sizeForm.type == 'image') {
              var obj1 = {
                dataType: {
                  type: sizeForm.type.toLowerCase(),
                  imagevalue: sizeForm.imagevalue,
                  specs: {},
                  das: das,
                },
              }
              Object.assign(obj, obj1)
            } else if (sizeForm.type == 'bool') {
              var obj1 = {
                dataType: {
                  type: sizeForm.type.toLowerCase(),
                  specs: {
                    0: sizeForm.false,
                    1: sizeForm.true,
                  },
                  das: das,
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
                  das: das,
                },
              }
              Object.assign(obj, obj1)
            } else if (sizeForm.type == 'struct') {
              var obj1 = {
                dataType: {
                  type: sizeForm.type.toLowerCase(),
                  specs: sizeForm.struct,
                  das: das,
                },
              }
              Object.assign(obj, obj1)
            } else if (sizeForm.type == 'string') {
              var obj1 = {
                dataType: {
                  type: sizeForm.type.toLowerCase(),
                  size: sizeForm.string,
                  das: das,
                },
              }
              Object.assign(obj, obj1)
            } else if (sizeForm.type == 'text') {
              var obj1 = {
                dataType: {
                  type: sizeForm.type.toLowerCase(),
                  size: sizeForm.string,
                  specs: {},
                  das: das,
                },
              }
              Object.assign(obj, obj1)
            } else if (sizeForm.type == 'date') {
              var obj1 = {
                dataType: {
                  type: sizeForm.type.toLowerCase(),
                  das: das,
                },
              }
              Object.assign(obj, obj1)
            } else if (sizeForm.type == 'geopoint') {
              var obj1 = {
                dataType: {
                  type: sizeForm.type.toLowerCase(),
                  gpstype: sizeForm.gpstype,
                  specs: {},
                  das: das,
                },
              }
              Object.assign(obj, obj1)
            }
            delete obj.index
            dgiotlog.log(this.resource.changeData, 'changeData')
            dgiotlog.log('dynamicData', this.resource.addchannel)
            // 新增协议类型参数
            obj.dataForm.protocol = this.resource.value
            // 处理动态数据源
            console.log(this.resource)
            var dataSource = {
              ...this.resource.addchannel,
            }
            dataSource[this.tableName] = table
            Object.assign(obj, {
              dataSource: dataSource,
            })
            //  物模型类型属性
            // properties  tags  services  events
            // 属性 事件 服务 标签
            obj.moduleType = this.moduletype
            // 物模型 创建、更新时间戳(排序用)
            obj.updateAt = moment(new Date()).format('x')
            // 删除掉icon 属性
            delete obj.dataForm.ico
            dgiotlog.log('submitForm obj', obj)
            dgiotlog.log('resource.arrlist', this.resource)
            this.$emit('submitForm', obj)
            // this.$refs[formName].resetFields()
          } else {
            dgiotlog.log(valid, 'error submit!!')
            return false
          }
        })
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
