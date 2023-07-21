<!--eslint-disable-->
<template>
  <div
    :class="{ 'dgiot-fullscreen': isFullscreen, 'konva-fullscreen': isDevice }"
    class="konva"
  >
    <!--    <dgiot-xterm />-->
    <el-container class="konva-container">
      <el-header
        v-show="!isDevice"
        class="konva-container-header hidden-xs-only"
      >
        <topo-header
          :noTools="Boolean($route.query.noTools)"
          @createTemplate="createTemplate"
        />
      </el-header>
      <div style="position: absolute; left: 50%; top: 6px; display: flex">
        <el-tooltip
          class="item"
          effect="dark"
          :content="o.title"
          placement="top"
          v-for="(o, index) in viewList"
          :key="index"
        >
          <div
            v-show="!isDevice"
            :class="{ isactive: o.objectId == konvaId }"
            style="
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 1px solid #ccc;
              text-align: center;
              line-height: 30px;
              margin-left: 10px;
              cursor: pointer;
              z-index: 99;
            "
            @click="handleChangeKonva(o)"
          >
            {{ index + 1 }}
          </div>
        </el-tooltip>
      </div>
      <el-main class="konva-container-main">
        <el-row :gutter="gutter.gutter" class="user-content">
          <el-col
            :lg="isDevice || isFull ? 0 : 3"
            :md="isDevice || isFull ? 0 : 3"
            :sm="isDevice || isFull ? 0 : 4"
            :xl="isDevice || isFull ? 0 : 3"
            :xs="0"
            class="hidden-xs-only konva-container-main-allocation"
          >
            <Topo-tabs
              class="tabs"
              :isDirver="Boolean($route.query.isDirver)"
            />
          </el-col>
          <el-col
            :lg="isDevice || isFull ? 24 : gutter.lg"
            :md="isDevice || isFull ? 24 : gutter.md"
            :sm="isDevice || isFull ? 24 : gutter.sm"
            :xl="isDevice || isFull ? 24 : gutter.xl"
            :xs="isDevice || isFull ? 24 : gutter.xs"
            class="konva-container-main-baseCol"
          >
            <el-main class="konva-container-baseCol-baseContainer">
              <topo-base
                ref="topobase"
                style="position: absolute; width: 100%"
              />
              <div v-if="Boolean($route.query.guide)">
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="$route.query.page < 0"
                  icon="el-icon-arrow-left"
                  style="position: relative; left: 0"
                  @click.native="nextPage('left')"
                >
                  {{ $translateTitle('button.previous') }}
                </el-button>
                <el-button
                  :disabled="$route.query.page > $route.query.list.length"
                  type="primary"
                  size="mini"
                  icon="el-icon-arrow-right"
                  @click.native="nextPage('right')"
                  style="position: fixed; right: 30px"
                >
                  {{ $translateTitle('button.next') }}
                </el-button>
              </div>
              <div
                id="konva"
                ref="konva"
                class="konva, _center"
                style="display: none"
              ></div>
            </el-main>
          </el-col>
        </el-row>
        <el-drawer
          title="样式编辑"
          append-to-body
          :before-close="handleCloseEdit"
          :direction="direction"
          size="20%"
          :modal="false"
          :visible.sync="editFlag"
        >
          <!-- <div :style="{'text-align':'center','font-weight':'600'}">{{editNode.attrs.text}}</div> -->
          <el-form
            ref="form"
            :model="editForm"
            label-width="80px"
            style="margin-right: 10px"
          >
            <div
              v-if="
                editNode.attrs.name != 'sprite' &&
                editNode.attrs.name != 'printer'
              "
            >
              <el-form-item label="颜色" v-if="!editNode.attrs.src">
                <el-input
                  v-model="editForm.fill"
                  @input="handleEditKonva"
                ></el-input>
                <el-color-picker
                  v-model="editForm.fill"
                  color-format="rgb"
                  :show-alpha="true"
                  @active-change="colorChange($event, 'fill', true)"
                ></el-color-picker>
              </el-form-item>
              <el-form-item
                label="组件颜色"
                v-if="
                  editNode.attrs.type == 'count' &&
                  editNode.attrs.source == 'api'
                "
              >
                <el-input
                  v-model="editForm.color"
                  @input="handleEditKonva"
                ></el-input>
                <el-color-picker
                  v-model="editForm.color"
                  color-format="rgb"
                  :show-alpha="true"
                  @active-change="colorChange($event, 'color', true)"
                ></el-color-picker>
              </el-form-item>
              <el-form-item class="item_block" label="宽度">
                <el-input
                  v-model="editForm.width"
                  type="number"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>
              <el-form-item class="item_block" label="高度">
                <el-input
                  v-model="editForm.height"
                  type="number"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-if="editNode.attrs.name == 'amiscomponent'"
                label="低代码绑定"
              >
                <el-select
                  v-model="screenViewId"
                  @change="handleEditViewId"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in screenViewList"
                    :key="item.value"
                    :label="item.title"
                    :value="item.objectId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                class="item_block"
                label="字体大小"
                v-if="
                  editNode.attrs.name != 'amiscomponent' &&
                  editNode.attrs.name != 'vuecomponent' &&
                  editNode.attrs.name != 'konvaimage' &&
                  editNode.attrs.name != 'staticimage'
                "
              >
                <el-input
                  v-model="editForm.fontSize"
                  type="number"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>
              <el-form-item
                class="item_block"
                label="字体类型"
                v-if="
                  editNode.attrs.name != 'amiscomponent' &&
                  editNode.attrs.name != 'vuecomponent' &&
                  editNode.attrs.name != 'konvaimage' &&
                  editNode.attrs.name != 'staticimage'
                "
              >
                <el-select
                  v-model="editForm.fontFamily"
                  @change="handleEditKonva"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item1 in fontfamilyList"
                    :key="item1.value"
                    :label="item1.label"
                    :value="item1.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                class="item_block"
                label="纵向偏移"
                v-if="
                  editNode.attrs.name != 'amiscomponent' &&
                  editNode.attrs.name != 'vuecomponent' &&
                  editNode.attrs.name != 'konvaimage' &&
                  editNode.attrs.name != 'staticimage'
                "
              >
                <el-input
                  v-model="editForm.lineHeight"
                  type="number"
                  :step="0.1"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>

              <el-form-item
                class="item_block"
                label="描边宽度"
                v-if="
                  editNode.attrs.name != 'amiscomponent' &&
                  editNode.attrs.name != 'vuecomponent' &&
                  editNode.attrs.name != 'konvaimage' &&
                  editNode.attrs.name != 'staticimage'
                "
              >
                <el-input
                  v-model="editForm.strokeWidth"
                  type="number"
                  :step="0.1"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="描边颜色"
                v-if="
                  editNode.attrs.name != 'amiscomponent' &&
                  editNode.attrs.name != 'vuecomponent' &&
                  editNode.attrs.name != 'konvaimage' &&
                  editNode.attrs.name != 'staticimage'
                "
              >
                <el-input
                  v-model="editForm.stroke"
                  @input="handleEditKonva"
                ></el-input>
                <el-color-picker
                  v-model="editForm.stroke"
                  color-format="rgb"
                  :show-alpha="true"
                  @active-change="colorChange($event, 'stroke', true)"
                ></el-color-picker>
              </el-form-item>
              <el-form-item
                v-if="
                  editNode.attrs.name == 'vuecomponent' &&
                  editNode.attrs.type == 'counter'
                "
                label="绑定类型"
              >
                <el-select
                  v-model="editForm.text"
                  @change="handleEditKonva"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in dataTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-else
                :label="
                  editNode.attrs.type == 'count'
                    ? '跳转路径'
                    : editNode.attrs.type == 'liveboard'
                    ? '地址/m3u8'
                    : editNode.attrs.type == 'map'
                    ? '地图密钥'
                    : '文本内容'
                "
              >
                <el-input
                  v-model="editForm.text"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="底部颜色"
                v-if="
                  editNode.attrs.name != 'amiscomponent' &&
                  editNode.attrs.name != 'vuecomponent' &&
                  editNode.attrs.name != 'konvaimage' &&
                  editNode.attrs.name != 'staticimage'
                "
              >
                <el-input
                  v-model="btmfill"
                  @input="handleEditbtmKonva"
                ></el-input>
                <el-color-picker
                  v-model="btmfill"
                  color-format="rgb"
                  :show-alpha="true"
                  @active-change="colorChange($event, 'btmfill', false)"
                ></el-color-picker>
              </el-form-item>
            </div>
            <!-- 打印编辑 -->
            <div v-if="editNode.attrs.name == 'printer'">
              <el-form-item label="颜色">
                <el-input
                  v-model="editForm.fill"
                  @input="handleEditKonva"
                ></el-input>
                <el-color-picker
                  v-model="editForm.fill"
                  color-format="rgb"
                  :show-alpha="true"
                  @active-change="colorChange($event, 'fill', true)"
                ></el-color-picker>
              </el-form-item>
              <el-form-item label="文本内容">
                <el-input
                  v-model="editForm.text"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>
              <el-form-item label="宽度">
                <el-input
                  v-model="editForm.width"
                  type="number"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>
              <el-form-item label="高度">
                <el-input
                  v-model="editForm.height"
                  type="number"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>
              <el-form-item label="字体大小">
                <el-input
                  v-model="editForm.fontSize"
                  type="number"
                  @input="handleEditKonva"
                ></el-input>
              </el-form-item>
              <el-form-item label="字体类型">
                <el-select
                  v-model="editForm.fontFamily"
                  @change="handleEditKonva"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item1 in fontfamilyList"
                    :key="item1.value"
                    :label="item1.label"
                    :value="item1.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标签类型">
                <el-select
                  v-model="type"
                  @change="handlePrintType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item2 in printTypeList"
                    :key="item2.value"
                    :label="item2.label"
                    :value="item2.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="条码内容位置">
                <el-select
                  v-model="align"
                  @change="handlePrintType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item3 in alignList"
                    :key="item3.value"
                    :label="item3.label"
                    :value="item3.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="条码格式">
                <el-select
                  v-model="format"
                  @change="handlePrintType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item4 in formatList"
                    :key="item4.value"
                    :label="item4.label"
                    :value="item4.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="id">
                <el-select
                  v-model="id"
                  @change="handlePrintType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item3 in profileList"
                    :key="item3.value"
                    :label="item3.label"
                    :value="item3.value"
                  ></el-option>
                </el-select>
                <!-- <el-input v-model="id" @input="handlePrintType"></el-input> -->
              </el-form-item>
            </div>
            <el-form-item
              class="item_block"
              label="横坐标"
              v-if="
                editNode.attrs.name != 'amiscomponent' &&
                editNode.attrs.name != 'vuecomponent' &&
                editNode.attrs.name != 'konvaimage' &&
                editNode.attrs.name != 'staticimage'
              "
            >
              <el-input
                v-model="x"
                type="number"
                :step="1"
                @input="handleEditPosition"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="纵坐标"
              class="item_block"
              v-if="
                editNode.attrs.name != 'amiscomponent' &&
                editNode.attrs.name != 'vuecomponent' &&
                editNode.attrs.name != 'konvaimage' &&
                editNode.attrs.name != 'staticimage'
              "
            >
              <el-input
                v-model="y"
                type="number"
                :step="1"
                @input="handleEditPosition"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="比例大小"
              v-if="editNode.attrs.name == 'sprite'"
            >
              <el-input
                v-model="scale"
                type="number"
                :step="0.1"
                @input="handleEditSacle"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="editNode.attrs.type == 'thing'">
              <span slot="label">
                <span style="color: red">绑定物模型</span>
              </span>
              <el-select
                v-model="editForm.id"
                filterable
                @change="handleBindWmx"
                placeholder="请选择"
              >
                <el-option
                  v-for="(itemwmx, index) in wmxList"
                  :key="itemwmx.value + index"
                  :label="itemwmx.label"
                  :value="itemwmx.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <div
              v-if="editNode.attrs.type == 'realdata'"
              style="border-top: 1px solid #000"
            >
              <h3 style="font-weight: 600; margin: 10px">数据源绑定</h3>
              <el-form-item v-if="editNode.attrs.type == 'realdata'">
                <span slot="label">
                  <span style="color: red">产品选择</span>
                </span>
                <el-select
                  v-model="screen_productid"
                  filterable
                  @change="handleBindProduct"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(product, index) in screenproductList"
                    :key="product.value + index"
                    :label="product.label"
                    :value="product.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="editNode.attrs.type == 'realdata'">
                <span slot="label">
                  <span style="color: red">设备选择</span>
                </span>
                <el-select
                  v-model="screen_deviceid"
                  :disabled="screen_productid == ''"
                  filterable
                  @change="handleBindDevice"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(itemdevice, index) in screendeviceList"
                    :key="itemdevice.value + index"
                    :label="itemdevice.label"
                    :value="itemdevice.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="editNode.attrs.type == 'realdata'">
                <span slot="label">
                  <span style="color: red">绑定物模型</span>
                </span>
                <el-select
                  v-model="screen_wmxid"
                  :disabled="screen_deviceid == ''"
                  filterable
                  @change="handleBindDeviceWmx"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(itemscreenwmx, index) in screenwmxList"
                    :key="itemscreenwmx.value + index"
                    :label="itemscreenwmx.label"
                    :value="itemscreenwmx.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
          <el-button
            @click="copyNode"
            style="position: absolute; bottom: 10px; left: 10px"
          >
            复制节点
          </el-button>
        </el-drawer>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import steps from './js/guide'
  import 'element-ui/lib/theme-chalk/display.css'
  import requiremodule from '@/utils/file/requiremodule'
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { _getTopo, edit_konva_thing, get_konva_thing } from '@/api/Topo'
  import { getProduct, queryProduct } from '@/api/Product'
  import { queryView, putView, getView, postView } from '@/api/View'

  import { isBase64 } from '@/utils'
  import { queryDevice } from '../../../api/Device'
  export default {
    components: {
      ...requiremodule(require.context('./components', true, /\.vue$/)),
    },
    data() {
      return {
        subtopic: '',
        editFlag: false,
        direction: 'rtl',
        viewList: [],
        screenViewList: [],
        screenViewId: '',
        konvaId: '',
        editNode: {
          attrs: {},
        },
        profileList: [],
        dataTypeList: [
          {
            label: '产品数量',
            value: '产品数量',
          },
          {
            label: '设备数量',
            value: '设备数量',
          },
          {
            label: '在线设备',
            value: '在线设备',
          },
          {
            label: '离线设备',
            value: '离线设备',
          },
          {
            label: '开机设备',
            value: '开机设备',
          },
          {
            label: '关机设备',
            value: '关机设备',
          },
          {
            label: '平时设备',
            value: '平时设备',
          },
          {
            label: '战时设备',
            value: '战时设备',
          },
        ],
        fontfamilyList: [
          {
            label: '宋体',
            value: '宋体',
          },
          {
            label: '微软雅黑',
            value: '微软雅黑',
          },
          {
            label: '黑体',
            value: '黑体',
          },
          {
            label: '楷体',
            value: '楷体',
          },
          {
            label: 'Helvetica Neue',
            value: 'Helvetica Neue',
          },
          {
            label: 'Helvetica',
            value: 'Helvetica',
          },
          {
            label: 'Arial',
            value: 'Arial',
          },
          {
            label: 'Lucida Family',
            value: 'Lucida Family',
          },
          {
            label: 'Verdana',
            value: 'Verdana',
          },
          {
            label: 'Calibri',
            value: 'Calibri',
          },
        ],
        printTypeList: [
          {
            label: '静态文本',
            value: 'label',
          },
          {
            label: '文本替换值',
            value: 'value',
          },
          // {
          //   label: '图片',
          //   value: 'image',
          // },
          {
            label: '条码',
            value: 'scancode',
          },
          {
            label: '条码字符串',
            value: 'scancodetext',
          },
          {
            label: '打印纸张',
            value: 'paper',
          },
          {
            label: '打印机',
            value: 'printer',
          },
        ],
        align: '',
        alignList: [
          {
            label: '顶部居左',
            value: 0,
          },
          {
            label: '顶部居中',
            value: 1,
          },
          {
            label: '顶部居右',
            value: 2,
          },
          {
            label: '底部居左',
            value: 3,
          },
          {
            label: '底部居中',
            value: 4,
          },
          {
            label: '底部居右',
            value: 5,
          },
        ],
        format: '',
        formatList: [
          {
            label: 'UNSPECIFIED',
            value: 0,
          },
          {
            label: 'UPCA',
            value: 1,
          },
          {
            label: 'UPCE',
            value: 2,
          },
          {
            label: 'UPC_SUPPLEMENTAL_2DIGIT',
            value: 3,
          },
          {
            label: 'UPC_SUPPLEMENTAL_5DIGIT',
            value: 4,
          },
          {
            label: 'EAN13',
            value: 5,
          },
          {
            label: 'EAN8',
            value: 6,
          },
          {
            label: 'Interleaved2of5',
            value: 7,
          },
          {
            label: 'Standard2of5',
            value: 8,
          },
          {
            label: 'Industrial2of5',
            value: 9,
          },
          {
            label: 'CODE39',
            value: 10,
          },
          {
            label: 'CODE39Extended',
            value: 11,
          },
          {
            label: 'Codabar',
            value: 12,
          },
          {
            label: 'PostNet',
            value: 13,
          },
          {
            label: 'BOOKLAND',
            value: 14,
          },
          {
            label: 'ISBN',
            value: 15,
          },
          {
            label: 'JAN13',
            value: 16,
          },
          {
            label: 'MSI_Mod10',
            value: 17,
          },
          {
            label: 'MSI_2Mod10',
            value: 18,
          },
          {
            label: 'MSI_Mod11',
            value: 19,
          },
          {
            label: 'MSI_Mod11_Mod10',
            value: 20,
          },
          {
            label: 'Modified_Plessey',
            value: 21,
          },
          {
            label: 'CODE11',
            value: 22,
          },
          {
            label: 'USD8',
            value: 23,
          },
          {
            label: 'UCC12',
            value: 24,
          },
          {
            label: 'UCC13',
            value: 25,
          },
          {
            label: 'LOGMARS',
            value: 26,
          },
          {
            label: 'CODE128',
            value: 27,
          },
          {
            label: 'CODE128A',
            value: 28,
          },
          {
            label: 'CODE128B',
            value: 29,
          },
          {
            label: 'CODE128C',
            value: 30,
          },
          {
            label: 'ITF14',
            value: 31,
          },
          {
            label: 'CODE93',
            value: 32,
          },
          {
            label: 'TELEPEN',
            value: 33,
          },
        ],
        type: '',
        id: '', //打印标签id
        router: '',
        viewInfo: {},
        defaultTopo: {
          konva: {
            Stage: {
              attrs: {
                height: 700,
                width: 1200,
              },
              children: [
                {
                  attrs: {
                    id: 'Layer_Thing',
                  },
                  children: [
                    {
                      attrs: {
                        draggable: true,
                        id: 'f9dddd0eeb_amisBMK8t',
                        name: 'amis',
                        opacity: 0.75,
                        x: 323,
                        y: 84.95900920567532,
                      },
                      children: [],
                      className: 'Label',
                    },
                  ],
                  className: 'Layer',
                },
              ],
              className: 'Stage',
            },
          },
        },
        editForm: {
          fill: '', //字体颜色
          width: 42, //宽度
          height: 35, //高度
          lineHeight: 0, //纵向偏移
          fontSize: 14, //字体大小
          stroke: '', //描边颜色
          strokeWidth: 0, //描边宽度
          text: '', //文本内容
        },
        btmfill: '', //底部背景颜色
        scale: 1,
        x: 0,
        y: 0,
        driver: null,
        Stage: {},
        isFull: false,
        topicKey: '',
        isFullscreen: false,
        gutter: {
          gutter: 24,
          xs: 24,
          sm: 20,
          md: 21,
          lg: 21,
          xl: 21,
        },
        productid: this.$route.query.productid || '',
        viewid: this.$route.query.viewid || '',
        wmxList: [],
        screenproductList: [],
        screendeviceList: [],
        screenwmxList: [],
        screen_productid: '',
        screen_deviceid: '',
        screen_wmxid: '',
      }
    },
    computed: {
      ...mapGetters({
        defaultKonva: 'topo/defaultKonva',
        graphColor: 'konva/graphColor',
        drawing: 'konva/drawing',
        graphNow: 'konva/graphNow',
        pointStart: 'konva/pointStart',
        draw: 'konva/draw',
        flag: 'konva/flag',
        drawParams: 'konva/drawParams',
      }),
      isDevice: {
        get: function () {
          return this.$route.query.type == 'device' ||
            this.$route.query.deviceid
            ? true
            : false
        },
      },
    },
    async mounted() {
      // console.log('document.body.style.zoom', document.body.style.zoom)
      // document.body.style.zoom = 1
      let params = {
        count: 'objectId',
        order: 'createdAt',
        excludeKeys: 'data',
        skip: 0,
        where: {
          class: { $regex: 'Product' },
          type: { $regex: 'Topo' },
          key: { $regex: this.$route.query.productid },
        },
      }
      // if (this.$route.query.viewid) {
      let param = {
        count: 'objectId',
        order: 'createdAt',
        excludeKeys: 'data',
        skip: 0,
        where: { flag: { $regex: 'Amis' } },
      }
      let screenViewList = await queryView(param)
      console.log('screenViewList', screenViewList)
      this.screenViewList = screenViewList.results
      // }

      if (!this.$route.query.viewid) {
        let viewList = []
        const { results = [] } = await queryView(params)
        // console.log('查询topo列表', results)
        results.forEach((item) => {
          if (item.title == this.$route.query.productid) {
            viewList.unshift(item)
            this.konvaId == '' ? (this.konvaId = item.objectId) : ''
          } else {
            viewList.push(item)
          }
        })
        if (this.konvaId == '' && viewList.length > 0) {
          this.konvaId = viewList[0].objectId
        }

        this.viewList = viewList
      } else {
        this.konvaId = this.$route.query.viewid
      }
      this.$nextTick(() => {
        this.handleKonva()
        // if (this.$route.query.dashboard) {
        //   setTimeout(() => {
        //     this.setSale(90)
        //   }, 2500)
        // }
      })
      this.$dgiotBus.$off('nodeEdit')
      this.$dgiotBus.$on('nodeEdit', async (node) => {
        console.log('接收到编辑节点消息', node)
        this.editNode = node
        this.editFlag = true
        if (node.attrs.type == 'realdata') {
          this.screen_productid = node.attrs.screen_productid || ''
          this.screen_deviceid = node.attrs.screen_deviceid || ''
          this.screen_wmxid = node.attrs.screen_wmxid || ''
          if (this.screen_productid) {
            this.handlegetScreenWmxList(this.screen_productid)
            this.handleQueryDeviceList(this.screen_productid)
          }
        }
        // this.editNode.setAttrs({
        //   fill: '#091322',
        //   width: 80,
        //   height: 80,
        //   lineHeight: 2.2,
        //   fontSize: 28,
        //   // x: 20,
        //   // y: -0,
        // })
        this.editForm = {
          id: node.attrs.id || '',
          fill: node.attrs.fill || '',
          width: node.attrs.width || 100,
          height: node.attrs.height || 35,
          lineHeight: node.attrs.lineHeight || 0,
          fontSize: node.attrs.fontSize || 12,
          stroke: node.attrs.stroke || '', //描边颜色
          strokeWidth: node.attrs.strokeWidth || 0.1, //描边宽度
          text: node.attrs.text || '',
          fontFamily: node.attrs.fontFamily || '',
          color: node.attrs.color,
        }
        if (!node.attrs.color) {
          delete this.editForm['color']
        }
        if (node.attrs.name == 'amiscomponent') {
          this.screenViewId = node.attrs.id
        }
        this.btmfill = node.parent.children[0].attrs.fill
        if (node.attrs.name == 'printer') {
          this.x = node.attrs.x || ''
          this.y = node.attrs.y || ''
          this.type = node.attrs.type || ''
          this.id = node.attrs.id || ''
        } else {
          this.x = node.parent.attrs.x || ''
          this.y = node.parent.attrs.y || ''
        }

        this.scale = node.attrs.scaleX
        // color: '',
      })
      this.$dgiotBus.$off('_busUpdata')
      this.$dgiotBus.$on('_busUpdata', async () => {
        if (this.viewInfo.objectId) {
          await this._updataTopo(this.viewInfo.objectId)
        }
      })
      this.$dgiotBus.$off('_busCopy')
      this.$dgiotBus.$on('_busCopy', async () => {
        if (this.viewInfo.objectId) {
          await this._copyTopo()
        }
      })
      this.subtopic = `$dg/user/konva/${this.$route.query.deviceid}/report` //组态订阅主题
      if (this.$route.query.type == 'device') {
        this.handleMqttMsg()
      }
      this.driver = new this.$Driver({
        className: 'vue-admin-beautiful-wrapper', // className to wrap driver.js popover
        animate: true, // Animate while changing highlighted element
        opacity: 0.75, // Background opacity (0 means only popovers and without overlay)
        padding: 10, // Distance of element from around the edges
        allowClose: true, // Whether clicking on overlay should close or not
        overlayClickNext: false, // Should it move to next step on overlay click
        doneBtnText: '完成', // Text on the final button
        closeBtnText: '关闭', // Text on the close button for this step
        nextBtnText: '下一步', // Next button text for this step
        prevBtnText: '上一步', // Previous button text for this step
        // Called when moving to next step on any step
      })
      if (
        this?.$router?.query?.guide &&
        Boolean(this.$router.query.guide) == true
      )
        this.guide()

      this.$baseEventBus.$off('ToggleView')
      this.$baseEventBus.$on('ToggleView', () => {
        this.isFull = !this.isFull
      })
      this.Stage = _.isEmpty(localStorage.getItem('konvaStale'))
        ? localStorage.getItem('konvaStale')
        : this.defaultKonva
      this.router = this.$dgiotBus.router(this.$route.fullPath)
      this.setTreeFlag(false)
    },
    async destroyed() {
      console.log('this.topotopic', this.topotopic)
      this.$dgiotBus.$off('$dg/user/konva')
      if (!_.isEmpty(localStorage.getItem('konvaStale')))
        localStorage.setItem('konvaStale', JSON.stringify(canvas.stageJson))
      await this.$unSubscribe(this.topotopic)
    },
    methods: {
      ...mapMutations({
        deleteTopo: 'topo/deleteTopo',
        initKonva: 'topo/initKonva',
        createThing: 'topo/createThing',
        setTreeFlag: 'settings/setTreeFlag',
        createdEvidence: 'topo/createdEvidence',
      }),
      ...mapActions({
        setSale: 'topo/setSale',
      }),
      copyNode() {
        // console.log(this.editNode)
        this.$dgiotBus.$emit('copyNode', this.editNode)
      },
      handleEditViewId(e) {
        console.log(e, this.editForm)
        let params = {
          id: e,
        }
        this.editNode.setAttrs(params)
      },
      /**
       * 改变背景颜色
       */
      colorChange(e, type, flag) {
        // console.log(e, type)
        if (flag) {
          this.editForm[type] = e
          this.handleEditKonva()
        } else {
          type == 'btmfill' ? (this.btmfill = e) : ''
          this.handleEditbtmKonva()
        }
      },
      async handleQueryView() {
        let params = {
          count: 'objectId',
          order: 'createdAt',
          excludeKeys: 'data',
          skip: 0,
          where: {
            class: { $regex: 'Product' },
            type: { $regex: 'Topo' },
            key: { $regex: this.$route.query.productid },
          },
        }
        if (!this.$route.query.viewid) {
          let viewList = []
          const { results = [] } = await queryView(params)
          // console.log('查询topo列表', results)
          results.forEach((item) => {
            if (item.title == this.$route.query.productid) {
              viewList.unshift(item)
              this.konvaId == '' ? (this.konvaId = item.objectId) : ''
            } else {
              viewList.push(item)
            }
          })
          if (this.konvaId == '' && viewList.length > 0) {
            this.konvaId = viewList[0].objectId
          }

          this.viewList = viewList
        }
      },
      async createTemplate() {
        let params = {
          data: this.defaultTopo,
          language: 'zh',
          class: 'Product',
          flag: 'Konva',
          type: 'Topo',
          title: this.viewList.length + 1 + '',
          key: this.$route.query.productid,
        }
        const res = await postView(params)
        this.handleQueryView()
      },
      // 查找设备列表
      async handleQueryDeviceList(id) {
        let params = {
          skip: 0,
          limit: 100,
          order: '-createdAt',
          count: 'objectId',
          where: { product: id },
        }
        let res = await queryDevice(params)
        let nowlist = []
        res.results.forEach((item) => {
          let current = {
            label: item.name,
            value: item.objectId,
          }
          nowlist.push(current)
        })
        this.screendeviceList = nowlist
      },
      async handlegetScreenWmxList(id) {
        let productdetail = await getProduct(id)
        let wmxList = productdetail.thing?.properties || []
        let nowlist = []
        wmxList.forEach((wmxitem) => {
          let current = {
            label: wmxitem.name,
            value: wmxitem.identifier,
          }
          nowlist.push(current)
        })
        this.screenwmxList = nowlist
      },
      // 大屏绑定产品
      handleBindProduct(e) {
        console.log(e)
        let data = {
          screen_productid: e,
        }
        this.editNode.setAttrs(data)
        this.handlegetScreenWmxList(e)
        this.handleQueryDeviceList(e)
      },
      handleBindDevice(e) {
        console.log(e)
        let id = e + '_' + this.screen_wmxid + '_text'
        let data = {
          id,
          screen_deviceid: e,
        }
        this.editNode.setAttrs(data)
      },
      handleBindDeviceWmx(e) {
        console.log(e)
        let id = this.screen_deviceid + '_' + e + '_text'
        let data = {
          id,
          screen_wmxid: e,
        }
        this.editNode.setAttrs(data)
      },
      handleBindWmx(e) {
        this.editNode.setAttrs(this.editForm)
      },
      /**
       * 编辑组态节点
       */
      handleEditKonva() {
        if (this.editNode.attrs.name == 'printer') {
          let params = {
            width: Number(this.editForm.width),
            height: Number(this.editForm.height),
            text: this.editForm.text,
            fill: this.editForm.fill,
            fontSize: Number(this.editForm.fontSize) || 12,
            fontFamily: this.editForm.fontFamily,
          }
          this.editNode.setAttrs(params)
          return
        }
        // console.log(this.editForm)
        this.editForm.width = Number(this.editForm.width)
        this.editForm.height = Number(this.editForm.height)
        this.editForm.lineHeight = Number(this.editForm.lineHeight)
        this.editForm.fontSize = Number(this.editForm.fontSize) || 12
        this.editForm.strokeWidth = Number(this.editForm.strokeWidth)
        // console.log(this.editForm)
        if (this.editNode.attrs.id == 'bg') {
          let editForm = {
            width: Number(this.editForm.width),
            height: Number(this.editForm.height),
          }
          this.editNode.setAttrs(editForm)
          return
        }
        if (this.editNode.attrs.type == 'counter') {
          let data = { ...this.editForm }
          data.id =
            data.text == '产品数量'
              ? 'product_counter'
              : data.text == '设备数量'
              ? 'device_counter'
              : data.text == '在线设备'
              ? 'device_online_counter'
              : data.text == '离线设备'
              ? 'device_offline_counter'
              : data.text == '开机设备'
              ? 'device_poweron_counter'
              : data.text == '关机设备'
              ? 'device_poweroff_counter'
              : data.text == '平时设备'
              ? 'device_peace_counter'
              : data.text == '战时设备'
              ? 'device_war_counter'
              : this.editNode.attrs.id
          console.log('datavue', data)
          this.editNode.setAttrs(data)
          return
        }
        console.log(this.editForm)
        this.editNode.setAttrs(this.editForm)
      },
      handlePrintType() {
        let params = {
          type: this.type,
          id: this.id,
          align: this.align, //位置
          format: this.format, //编码类型
        }
        if (params.type == 'scancodetext') {
          params.id = params.id + '_barcode'
          this.id = params.id
        }
        console.log(params)
        this.editNode.setAttrs(params)
      },
      handleEditPosition() {
        let params = {
          x: Number(this.x),
          y: Number(this.y),
        }
        if (this.editNode.attrs.name == 'printer') {
          this.editNode.setAttrs(params)
        } else if (this.editNode.parent) this.editNode.parent.setAttrs(params)
      },
      /**
       * 编辑修改底部颜色
       */
      handleEditbtmKonva() {
        let params = {
          fill: this.btmfill,
        }
        this.editNode.parent.children[0].setAttrs(params)
      },
      /**
       * 缩放
       */
      handleEditSacle() {
        let params = {
          scaleX: Number(this.scale),
          scaleY: Number(this.scale),
        }
        this.editNode.setAttrs(params)
      },
      /**
       * 关闭样式编辑
       */
      handleCloseEdit() {
        this.editFlag = false
      },
      nextPage(type) {
        let query = JSON.parse(JSON.stringify(this.$route.query))
        const list = JSON.parse(this.$route.query.list)
        const length = query.length
        query.page = Number(query.page)
        query.page =
          type == 'left'
            ? query.page-- >= -1
              ? query.page > 0
                ? query.page
                : length
              : length
            : query.page++ >= length
            ? 0
            : query.page
        query.viewid = list[query.page].viewid
        this.$router.push({ path: this.$route.path, query })
        this.handleKonva()
      },
      handleChangeKonva(o) {
        this.konvaId = o.objectId
        this.handleKonva()
      },
      guide() {
        this.driver.defineSteps(steps)
        this.driver.start()
      },
      async handleMqttMsg() {
        // console.error('this.topicKey', this.$mqttInfo.topicKey)
        // console.log('是否是pc端', this.$ispc())
        if (this.$route.query.type == 'device') {
          await this.$nopostsubscribe(this.subtopic)
        }
        this.$dgiotBus.$off('$dg/user/konva')
        this.$dgiotBus.$on('$dg/user/konva', (Msg) => {
          //console.log('这是组态消息', Msg)
          if (Msg.payloadString) {
            let decodeMqtt = null
            if (!isBase64(Msg.payloadString)) {
              decodeMqtt = JSON.parse(Msg.payloadString)
            } else {
              decodeMqtt = JSON.parse(Base64.decode(Msg.payloadString))
            }
            // decodeMqtt = Msg.payloadString
            // console.log('decodeMqtt.konva', canvas.stage)
            // console.log(decodeMqtt)
            // const Shape = decodeMqtt.konva
            // const Text = canvas.stage.find('Text')
            // console.log('text', Text)
            decodeMqtt.konva.forEach((item) => {
              // console.log(item)
              var info = konvaUtils.putNode(
                canvas.stage,
                item.id,
                item.text,
                item.type
              )
              // canvas.stage.find(item.id)[0].setAttrs(item.params)
            })
            // var info = konvaUtils.putNode(
            //   canvas.stage,
            //   decodeMqtt.id,
            //   decodeMqtt.params
            // )
            //  node.find(nodeid)[0].setAttrs(params)
            return
          }
        })
      },
      async _copyTopo() {
        let data = {
          konva: {
            Stage: JSON.parse(canvas.stage.toJSON()),
          },
          type: 'page',
        }
        data.konva.Stage?.children[0]?.children.forEach((item) => {
          if (!item.attrs.fontSize) {
            item.attrs.fontSize = 12
          }
        })
        // console.log('当前stage', data)
        // 原文链接：https://blog.csdn.net/m0_51066449/article/details/125686925
        let oInput = document.createElement('input')
        // 将想要复制的值
        oInput.value = JSON.stringify(data)
        // 页面底部追加输入框
        document.body.appendChild(oInput)
        // 选中输入框
        oInput.select()
        // 执行浏览器复制命令
        document.execCommand('Copy')
        // 弹出复制成功信息
        this.$baseMessage('复制成功', 'success', 'dgiot-hey-message-success')
        // 复制后移除输入框
        oInput.remove()
      },
      async _updataTopo(objectId) {
        // let stage = JSON.stringify(canvas.stage)
        // console.log('第一次转化stage', stage)
        // stage = stage.replace(/\\/g, '')
        // stage = stage.substr(1)
        // stage = stage.substring(0, stage.length - 1)
        // console.log('stage', canvas.stage, stage)
        this.viewInfo.data.konva = {
          Stage: JSON.parse(canvas.stage.toJSON()),
        }

        this.viewInfo.data.konva.Stage?.children[0]?.children.forEach(
          (item) => {
            if (!item.attrs.fontSize) {
              item.attrs.fontSize = 12
            }
          }
        )
        try {
          await putView(objectId, {
            data: this.viewInfo.data,
          })
          this.$baseMessage(
            this.$translateTitle('user.update completed'),
            'success',
            'dgiot-hey-message-success'
          )
        } catch (e) {}
      },
      async handlequeryProduct() {
        let params = {
          skip: 0,
          count: 'objectId',
          order: '-updatedAt',
        }
        const res = await queryProduct(params)
        let screenproductList = []
        res.results.forEach((item) => {
          let option = {
            label: item.name,
            value: item.objectId,
          }
          screenproductList.push(option)
        })
        this.screenproductList = screenproductList
      },
      async handleKonva() {
        let _this = this
        if (_this.$route.query.type == 'device') {
          _this.productid = _this.$route.query.deviceid
        }
        const loading = _this.$baseColorfullLoading(3)
        try {
          const {
            productid,
            viewid = undefined,
            devaddr = undefined,
          } = _this.$route.query
          let params = {
            productid: productid,
            devaddr: devaddr,
            viewid: viewid,
          }
          if (!_this.$route.query.viewid && _this.konvaId) {
            params.viewid = _this.konvaId
          }
          if (this.$route.query.dashboard) {
            const res = await getView(this.$route.query.viewid)
            this.viewInfo = res
            console.log('请求view', res)
            await _this.initKonva({
              data: res.data.konva.Stage,
              id: 'kevCurrent',
            })
            // loading.close()
            // 产品列表
            this.handlequeryProduct()
            _this.productconfig = productconfig || {}
            let profile = productconfig.profile || {}
            let profileList = []
            for (let key in profile) {
              let option = {
                label: key,
                value: key,
              }
              profileList.push(option)
            }
            this.profileList = profileList

            return
          }
          const { message = '', data = {} } = await _getTopo(params)
          // 绘制前不光需要获取到组态数据，还需要获取产品数据
          const productconfig = await getProduct(_this.$route.query.productid)
          // console.log('productconfigproductconfigproductconfig', productconfig)
          let wmxList = productconfig.thing?.properties || []
          let nowlist = []
          wmxList.forEach((wmxitem) => {
            let current = {
              label: wmxitem.name,
              value: `${this.$route.query.productid}_${wmxitem.identifier}_text`,
            }
            nowlist.push(current)
          })
          _this.wmxList = nowlist
          _this.productconfig = productconfig || {}
          let profile = productconfig.profile || {}
          let profileList = []
          for (let key in profile) {
            let option = {
              label: key,
              value: key,
            }
            profileList.push(option)
          }
          this.profileList = profileList
          // }
          // console.log('paramsparamsparamsparamsparams', params)

          // console.groupCollapsed(
          //   '%c productconfig',
          //   'color:#009a61; font-size: 28px; font-weight: 300'
          // )
          // console.info('productconfig ->\n', _this.productconfig)
          console.groupEnd()
          if (message == 'SUCCESS') {
            console.groupCollapsed(
              '%c _getTopo',
              'color:#009a61; font-size: 28px; font-weight: 300'
            )
            console.info('data ->\n', data)
            console.groupEnd()
            _this.$refs['operation']
              ? (_this.$refs['operation'].productconfig = results[0])
              : console.log(
                  " _this.$refs['operation']",
                  _this.$refs['operation']
                )
            _this.globalStageid = data.Stage.attrs.id
            _this.paramsconfig = { konva: data }
            //
            console.log(
              'topo info msg 请求数据有组态 就设置这个组态为请求回来的组态',
              data.Stage,
              data.viewid
            )
            if (data.viewid) {
              this.viewInfo = await getView(data.viewid)
            }
            console.error(this.viewInfo)
            await _this.initKonva({
              data: data.Stage,
              id: 'kevCurrent',
            })
          } else {
            if (!this.$route.query.deviceid) {
              let params = {
                data: this.defaultTopo,
                language: 'zh',
                class: 'Product',
                type: 'Topo',
                flag: 'Konva',
                title: this.$route.query.productid,
                key: this.$route.query.productid,
              }
              const res = await postView(params)
              params.objectId = res.objectId
              this.viewInfo = params
              await _this.initKonva({
                data: this.viewInfo.data.konva.Stage,
                id: 'kevCurrent',
              })
            } else {
              _this.$baseMessage(
                '暂无组态。显示默认组态',
                'info',
                'dgiot-hey-message-error'
              )
              await _this.initKonva({
                data: _this.initKonva,
                id: 'kevCurrent',
              })
            }
          }
          loading.close()
        } catch (e) {
          await _this.initKonva({
            data: this.Stage,
            id: 'kevCurrent',
          })
          loading.close()
        }
        setTimeout(() => {
          const icon = {
            icon: 'timeline',
            type: 'delete',
            path: 'M23,8c0,1.1-0.9,2-2,2c-0.18,0-0.35-0.02-0.51-0.07l-3.56,3.55C16.98,13.64,17,13.82,17,14c0,1.1-0.9,2-2,2s-2-0.9-2-2 c0-0.18,0.02-0.36,0.07-0.52l-2.55-2.55C10.36,10.98,10.18,11,10,11s-0.36-0.02-0.52-0.07l-4.55,4.56C4.98,15.65,5,15.82,5,16 c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2c0.18,0,0.35,0.02,0.51,0.07l4.56-4.55C8.02,9.36,8,9.18,8,9c0-1.1,0.9-2,2-2s2,0.9,2,2 c0,0.18-0.02,0.36-0.07,0.52l2.55,2.55C14.64,12.02,14.82,12,15,12s0.36,0.02,0.52,0.07l3.55-3.56C19.02,8.35,19,8.18,19,8 c0-1.1,0.9-2,2-2S23,6.9,23,8z',
          }
          _this.createdEvidence(
            _.merge(icon, {
              index: 7,
              // blue表示取证阶段，黄色表示审核阶段，绿色标识审核通过，红色标识审核不过
              fill: 'orange',
              productid: _this.$route.query.productid,
            })
          )
          _this.deleteTopo(window.deletePath)
        }, 1000)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .item_block {
    display: inline-block;
    width: 50%;
  }
  .isactive {
    color: #fff;
    background-color: #1890ff;
  }
  .konva-fullscreen {
    height: calc(100vh - #{$base-top-bar-height} * 3) !important;

    .konva-container {
      .konva-container-main {
        height: calc(100vh - #{$base-top-bar-height} * 3) !important;
      }
    }
  }

  .konva {
    height: calc(100vh - #{$base-top-bar-height} * 2.7);
    overflow-x: hidden;
    overflow-y: hidden;
    background: $base-color-white;
    transition: $base-transition;

    &-container {
      &-header {
        white-space: nowrap;
        background-color: #fff;
        border-bottom: 1px solid #e5e5e5;
      }

      &-main {
        height: calc(100vh - #{$base-top-bar-height} * 2.7 - 10px) !important;
        padding: 0 !important;

        &-allocation {
        }

        &-baseCol {
          padding: 0 !important;
          margin: 0;
          overflow: auto;

          &-baseContainer {
            width: 100%;
            height: calc(
              100vh - #{$base-top-bar-height} * 2.7 - #{$base-padding} * 2 -
                90px
            ) !important;
            overflow: auto;
          }
        }

        &-operationsSide {
          width: auto !important;
        }
      }

      ::v-deep {
        .el-header {
          height: 50px !important;
        }

        .el-row {
          padding: 0 !important;
          margin: 0 !important;

          .el-col {
            padding: 0 !important;
            margin: 0 !important;
          }
        }

        .hidden-xs-only {
          border: 1px solid #ddd !important;
        }

        .el-aside {
          color: #333 !important;
        }
      }
    }
  }
</style>
