<template>
  <div class="topo-properties">
    <div class="topo-properties-nav">
      <!-- <el-select v-model="curComponent" :options="componentOptions" @input="changeComponent" style="margin-right:0px;height:43px;border:none;" /> -->
      <template v-if="isLayer">
        <el-input v-model="topoData.name" />
      </template>
      <template v-if="configObject != null && isLayer == false">
        <el-input v-model="configObject.name" />
      </template>
    </div>
    <template v-if="configObject != null && isLayer == false">
      <div class="topo-properties-tabs">
        <div
          class="topo-properties-tab"
          :class="{ 'topo-properties-tab-active': tabIndex == 0 }"
          @click="changeTab(0)"
        >
          样式
        </div>
        <div
          class="topo-properties-tab"
          :class="{ 'topo-properties-tab-active': tabIndex == 1 }"
          @click="changeTab(1)"
        >
          数据
        </div>
        <div
          class="topo-properties-tab"
          :class="{ 'topo-properties-tab-active': tabIndex == 2 }"
          @click="changeTab(2)"
        >
          行为
        </div>
      </div>
      <div class="topo-properties-table">
        <div v-show="tabIndex == 0">
          <table style="display: none">
            <tr>
              <td
                style="padding: 5px 0px; background-color: #eee"
                width="50%"
              >
                属性
              </td>
              <td
                style="padding: 5px 0px; background-color: #eee"
                width="50%"
              >
                值
              </td>
            </tr>
          </table>
          <div
            no-border
            separator
          >
            <div
              default-opened
              label="Position"
            >
              <table>
                <tr>
                  <td width="50%">
                    X
                  </td>
                  <td width="50%">
                    <el-input
                      v-model.number.lazy="configObject.style.position.x"
                      style="padding-right: 5px"
                      suffix="px"
                      type="number"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Y</td>
                  <td>
                    <el-input
                      v-model.number.lazy="configObject.style.position.y"
                      style="padding-right: 5px"
                      suffix="px"
                      type="number"
                    />
                  </td>
                </tr>
                <tr>
                  <td>W</td>
                  <td>
                    <el-input
                      v-model.number.lazy="configObject.style.position.w"
                      style="padding-right: 5px"
                      suffix="px"
                      type="number"
                    />
                  </td>
                </tr>
                <tr>
                  <td>H</td>
                  <td>
                    <el-input
                      v-model.number.lazy="configObject.style.position.h"
                      style="padding-right: 5px"
                      suffix="px"
                      type="number"
                    />
                  </td>
                </tr>
              </table>
            </div>

            <div
              default-opened
              label="Border"
            >
              <table>
                <tr>
                  <td width="50%">
                    BorderWidth
                  </td>
                  <td width="50%">
                    <el-input
                      v-model.number.lazy="configObject.style.borderWidth"
                      style="padding-right: 5px"
                      suffix="px"
                      type="number"
                    />
                  </td>
                </tr>
                <tr>
                  <td>BorderStyle</td>
                  <td>
                    <el-select
                      v-model="configObject.style.borderStyle"
                      :options="borderStyleOptions"
                    />
                  </td>
                </tr>
                <tr>
                  <td>BorderColor</td>
                  <td>
                    <el-input
                      v-model="configObject.style.borderColor"
                      class="my-input"
                      filled
                    >
                      <template #append>
                        <!--                        <q-icon name="colorize" class="cursor-pointer">-->
                        <!--                          <q-popup-proxy-->
                        <!--                            transition-show="scale"-->
                        <!--                            transition-hide="scale"-->
                        <!--                          >-->
                        <!--                            <q-color v-model="configObject.style.borderColor" />-->
                        <!--                          </q-popup-proxy>-->
                        <!--                        </q-icon>-->
                      </template>
                    </el-input>
                  </td>
                </tr>
              </table>
            </div>

            <div
              default-opened
              label="Base"
            >
              <table>
                <tr>
                  <td width="50%">
                    Visible
                  </td>
                  <td width="50%">
                    <el-select
                      v-model="configObject.style.visible"
                      :options="[
                        { label: 'Visible', value: true },
                        { label: 'Invisible', value: false },
                      ]"
                    />
                  </td>
                </tr>
                <tr>
                  <td>z-index</td>
                  <td>
                    <el-input
                      v-model.number.lazy="configObject.style.zIndex"
                      type="number"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Rolate</td>
                  <td>
                    <el-input
                      v-model.number.lazy="configObject.style.transform"
                      style="padding-right: 5px"
                      suffix="deg"
                      type="number"
                    />
                  </td>
                </tr>
                <tr>
                  <td>BackColor</td>
                  <td>
                    <el-input
                      v-model="configObject.style.backColor"
                      class="my-input"
                      filled
                    >
                      <template #append>
                        <!--                        <q-icon name="colorize" class="cursor-pointer">-->
                        <!--                          <q-popup-proxy-->
                        <!--                            transition-show="scale"-->
                        <!--                            transition-hide="scale"-->
                        <!--                          >-->
                        <!--                            <q-color v-model="configObject.style.backColor" />-->
                        <!--                          </q-popup-proxy>-->
                        <!--                        </q-icon>-->
                      </template>
                    </el-input>
                  </td>
                </tr>
                <tr
                  v-if="
                    configObject.style.url != undefined &&
                      configObject.style.url != null
                  "
                >
                  <td>URL</td>
                  <td>
                    <el-input v-model.lazy="configObject.style.url" />
                  </td>
                </tr>
                <tr v-if="configObject.style.text != undefined">
                  <td>Text</td>
                  <td>
                    <el-input v-model.lazy="configObject.style.text" />
                  </td>
                </tr>
                <tr v-if="configObject.style.textAlign != undefined">
                  <td>TextAlign</td>
                  <td>
                    <el-select
                      v-model="configObject.style.textAlign"
                      :options="textAlignOptions"
                    />
                  </td>
                </tr>
                <tr>
                  <td>ForeColor</td>
                  <td>
                    <el-input
                      v-model="configObject.style.foreColor"
                      class="my-input"
                      filled
                    >
                      <template #append>
                        <!--                        <q-icon name="colorize" class="cursor-pointer">-->
                        <!--                          <q-popup-proxy-->
                        <!--                            transition-show="scale"-->
                        <!--                            transition-hide="scale"-->
                        <!--                          >-->
                        <!--                            <q-color v-model="configObject.style.foreColor" />-->
                        <!--                          </q-popup-proxy>-->
                        <!--                        </q-icon>-->
                      </template>
                    </el-input>
                  </td>
                </tr>
                <tr v-if="configObject.style.fontFamily != undefined">
                  <td>Font Family</td>
                  <td>
                    <el-select
                      v-model="configObject.style.fontFamily"
                      :options="fontFamilyOptions"
                    />
                  </td>
                </tr>
                <tr v-if="configObject.style.fontSize != undefined">
                  <td>Font Size</td>
                  <td>
                    <el-input
                      v-model.number.lazy="configObject.style.fontSize"
                      style="padding-right: 5px"
                      suffix="px"
                      type="number"
                    />
                  </td>
                </tr>
                <tr v-if="configObject.style.radius != undefined">
                  <td>Radius</td>
                  <td>
                    <el-input
                      v-model.lazy="configObject.style.radius"
                      type="number"
                    />
                  </td>
                </tr>
                <tr v-if="configObject.style.lineWidth != undefined">
                  <td>LineWidth</td>
                  <td>
                    <el-input
                      v-model.number.lazy="configObject.style.lineWidth"
                      style="padding-right: 5px"
                      suffix="px"
                      type="number"
                    />
                  </td>
                </tr>
                <tr v-if="configObject.style.setLineDash != undefined">
                  <td>LineDash</td>
                  <td>
                    <el-input
                      v-model.lazy="configObject.style.setLineDash"
                      type="text"
                    />
                  </td>
                </tr>
              </table>
            </div>
            <!-- 目前只有虚线有动画 -->
            <div
              v-if="configObject.type == 'dashed'"
              default-opened
              label="动画"
            >
              <table class="data-tb">
                <tr>
                  <td>Direction</td>
                  <td>
                    <el-select
                      v-model="configObject.style.animations"
                      clearable
                      :options="animations"
                    />
                  </td>
                </tr>
                <template v-if="configObject.style.animations">
                  <tr>
                    <td>DotSpace</td>
                    <td>
                      <el-input
                        v-model.number.lazy="configObject.style.dotSpace"
                        class="suffix"
                        suffix="px"
                        type="number"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>DotWidth</td>
                    <td>
                      <el-input
                        v-model.number.lazy="configObject.style.dotWidth"
                        class="suffix"
                        suffix="px"
                        type="number"
                      />
                    </td>
                  </tr>
                </template>
              </table>
            </div>
          </div>
        </div>
        <div v-show="tabIndex == 1">
          <div class="not-surpport">
            根据实际系统设计
          </div>
        </div>
        <div v-show="tabIndex == 2">
          <template v-if="configObject && configObject.action">
            <template v-for="(event, index) in configObject.action">
              <div
                :key="index"
                style="margin-top: 10px"
              >
                <div
                  style="
                    padding: 5px;
                    border-top: #ccc solid 1px;
                    border-right: #ccc solid 1px;
                    border-left: #ccc solid 1px;
                  "
                >
                  交互-{{ index + 1 }}
                  <!--                  <q-icon-->
                  <!--                    name="delete"-->
                  <!--                    color="negative"-->
                  <!--                    style="float: right; cursor: pointer"-->
                  <!--                    @click.native="removeAction(index)"-->
                  <!--                  />-->
                </div>
                <table>
                  <tr>
                    <td width="50%">
                      事件
                    </td>
                    <td width="50%">
                      <el-select
                        v-model="event.type"
                        emit-value
                        map-options
                        :option-disable="
                          (item) => (item === null ? true : item.cannotSelect)
                        "
                        option-label="label"
                        :options="[
                          { label: '点击', value: 'click' },
                          { label: '双击', value: 'dblclick' },
                          {
                            label: '鼠标移入',
                            value: 'mouseenter',
                            cannotSelect: true,
                          },
                          {
                            label: '鼠标双击',
                            value: 'mouseleave',
                            cannotSelect: true,
                          },
                        ]"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>动作</td>
                    <td>
                      <el-select
                        v-model="event.action"
                        emit-value
                        map-options
                        :option-disable="
                          (item) => (item === null ? true : item.cannotSelect)
                        "
                        option-label="label"
                        :options="[
                          {
                            label: '打开链接',
                            value: 'link',
                            cannotSelect: true,
                          },
                          {
                            label: '赋值变量',
                            value: 'val',
                            cannotSelect: true,
                          },
                          { label: '展示隐藏', value: 'visible' },
                          {
                            label: '调用服务',
                            value: 'service',
                            cannotSelect: true,
                          },
                        ]"
                      />
                    </td>
                  </tr>

                  <tr v-if="event.action == 'visible'">
                    <td>点击出现</td>
                    <td>
                      <el-select
                        v-model="event.showItems"
                        emit-value
                        filled
                        map-options
                        multiple
                        option-label="label"
                        :options="generateTargetComponentOptions()"
                        use-chips
                      />
                    </td>
                  </tr>
                  <tr v-if="event.action == 'visible'">
                    <td>点击隐藏</td>
                    <td>
                      <el-select
                        v-model="event.hideItems"
                        emit-value
                        filled
                        map-options
                        multiple
                        option-label="label"
                        :options="generateTargetComponentOptions()"
                        use-chips
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </template>
            <div style="width: 100%; padding: 10px 10px 10px 10px">
              <el-button
                label="Add"
                outline
                style="width: 100%"
                @click.native="addAction"
              />
            </div>
          </template>
        </div>
      </div>
    </template>
    <template v-if="isLayer">
      <table style="margin-top: 10px">
        <tr>
          <td width="40%">
            BackColor
          </td>
          <td>
            <el-input v-model.lazy="topoData.layer.backColor" />
          </td>
        </tr>
        <tr>
          <td>BackImage</td>
          <td>
            <el-input v-model.lazy="topoData.layer.backgroundImage" />
          </td>
        </tr>
        <tr>
          <td>分辨率</td>
          <td>
            <el-select
              v-model="layerWH"
              :options="whOptions"
            />
          </td>
        </tr>
        <tr v-if="layerWH == 'custom'">
          <td>W</td>
          <td>
            <el-input v-model.number.lazy="topoData.layer.width" />
          </td>
        </tr>
        <tr v-if="layerWH == 'custom'">
          <td>H</td>
          <td>
            <el-input v-model.number.lazy="topoData.layer.height" />
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>
<!--eslint-disable-->
<script>
  import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'

  export default {
    name: 'TopoProperties',
    data() {
      return {
        tabIndex: 0,
        fontFamilyOptions: [
          'Arial',
          'Helvetica',
          'sans-serif',
          '宋体',
          '黑体',
          '微软雅黑',
        ],
        textAlignOptions: ['left', 'right', 'center', 'justify'],
        borderStyleOptions: ['solid', 'dashed', 'dotted'],
        whOptions: [
          '1024x768',
          '1366x768',
          '1280x800',
          '1440x900',
          '1600x900',
          '1920x1080',
          'custom',
        ],
        layerWHTemp: '',
      }
    },
    computed: {
      layerWH: {
        get: function () {
          if (!this.topoData.layer.width || !this.topoData.layer.height) {
            this.topoData.layer.width = 1600
            this.topoData.layer.height = 900
          }
          if (this.layerWHTemp == '') {
            var wh =
              this.topoData.layer.width + 'x' + this.topoData.layer.height
            if (this.whOptions.indexOf(wh, 0) == -1) {
              this.layerWHTemp = 'custom'
            } else {
              this.layerWHTemp = wh
            }
          } else {
            var wh =
              this.topoData.layer.width + 'x' + this.topoData.layer.height
            if (this.whOptions.indexOf(wh, 0) == -1) {
              this.layerWHTemp = 'custom'
            }
          }
          return this.layerWHTemp
        },
        set: function (val) {
          this.layerWHTemp = val
          if (val == 'custom') {
          } else {
            var wh = val.split('x')
            this.topoData.layer.width = parseInt(wh[0])
            this.topoData.layer.height = parseInt(wh[1])
          }
        },
      },
      ...mapState({
        topoData: (state) => state.topoEditor.topoData,
        selectedComponents: (state) => state.topoEditor.selectedComponents,
        selectedComponentMap: (state) => state.topoEditor.selectedComponentMap,
        isLayer: (state) => state.topoEditor.selectedIsLayer,
        configObject: (state) => state.topoEditor.selectedComponent,
      }),
      animations() {
        let items = []
        if (this.configObject.type == 'dashed') {
          items =
            this.configObject.direction &&
            this.configObject.direction == 'vertical'
              ? [
                  { label: '向上', value: 'up' },
                  { label: '向下', value: 'down' },
                ]
              : [
                  { label: '向右', value: 'right' },
                  { label: '向左', value: 'left' },
                ]
        }
        return items
      },
    },
    mounted() {},
    methods: {
      initPage(configData) {
        this.configData = configData
      },
      changeTab(tabIndex) {
        this.tabIndex = tabIndex
      },
      bindData(configObject, index, isLayer) {
        this.configObject = configObject
        this.isLayer = isLayer
        if (isLayer === false) {
        }
      },
      generateTargetComponentOptions() {
        var options = []
        this.topoData.components.forEach((component) => {
          if (this.configObject.identifier != component.identifier) {
            options.push({
              label: component.name || component.type,
              value: component.identifier,
            })
          }
        })
        return options
      },
      removeAction(index) {
        this.configObject.action.splice(index, 1)
      },
      addAction() {
        var action = {
          type: 'click',
          action: 'visible',
          showItems: [],
          hideItems: [],
        }
        this.configObject.action.push(action)
      },
    },
  }
</script>

<style lang="scss">
  .topo-properties {
    height: 100%;
    background-color: white;
    border: #ccc solid 1px;

    .topo-properties-tabs {
      display: flex;
      height: 35px;
      background-color: white;
      border-bottom: #ccc solid 1px;

      .topo-properties-tab {
        flex: 1;
        height: 35px;
        line-height: 35px;
        color: #666;
        text-align: center;
      }

      .topo-properties-tab + .topo-properties-tab {
        border-left: #ccc solid 1px;
      }

      .topo-properties-tab:hover {
        cursor: pointer;
      }

      .topo-properties-tab-active {
        font-weight: bold;
        color: #000;
        border-bottom: #3388ff solid 2px;
      }
    }

    .topo-properties-table {
      height: calc(100% - 92px);
      overflow-x: hidden;
      overflow-y: auto;

      table {
        width: 100%;
        border-collapse: collapse;

        td {
          padding: 0px;
          text-align: center;
          border: #ccc solid 1px;
        }

        .el-input {
          border: none;
        }

        .q-select {
          margin-right: 0px;
          border: none;
        }
      }
    }

    .not-surpport {
      margin: 20px auto;
      text-align: center;
    }
  }
</style>
