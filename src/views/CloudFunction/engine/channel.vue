<template>
  <div class="resourcechannel resourcechannel-container">
    <el-drawer v-drawerDrag append-to-body size="80%" :visible.sync="amisFlag">
      <div v-show="amisFlag" class="wrapper">
        <el-button
          size="mini"
          :title="$translateTitle('konva.save')"
          type="success"
          @click.native="saveAmis()"
        >
          {{ $translateTitle('konva.save') }}
        </el-button>
        <el-button
          size="mini"
          type="warning"
          @click.native="isPreview = !isPreview"
        >
          {{
            !isPreview
              ? $translateTitle('application.preview')
              : $translateTitle('task.Edit')
          }}
        </el-button>
      </div>
      <dgiot-amis
        v-show="isPreview"
        :key="channelid"
        :schema="renderSchema"
        :show-help="false"
      />
      <dgiot-amis-editor
        v-show="!isPreview"
        ref="dgiotAmis"
        :amis-key="channelid"
        :theme="'antd'"
        :value="amisJson"
        @onChange="onChange"
      />
    </el-drawer>
    <dgiot-input ref="uploadFinish" @fileInfo="fileInfo" />
    <div class="firsttable">
      <el-form
        class="demo-form-inline"
        :inline="true"
        :model="channelformsearch"
        size="small"
      >
        <el-form-item>
          <el-input
            v-model="channelformsearch.name"
            :placeholder="$translateTitle('resource.name')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="Get_Re_Channel(0)">
            {{ $translateTitle('developer.search') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="addchanneltype">
            {{ $translateTitle('developer.selectchannel') }}
          </el-button>
        </el-form-item>
      </el-form>
      <!----------------------------------------------------资源通道表格------------------>
      <el-table
        ref="tableRef"
        v-loading="listLoading"
        :cell-style="{ 'text-align': 'center' }"
        :data="tableData"
        :header-cell-style="{ 'text-align': 'center' }"
        :row-class-name="getChannelEnable"
        row-key="objectId"
        style="width: 100%"
      >
        <el-table-column
          :label="$translateTitle('developer.channelnumber')"
          prop="objectId"
          show-overflow-tooltip
          sortable
          width="auto"
        />
        <el-table-column
          :label="$translateTitle('developer.channelname')"
          prop="name"
          show-overflow-tooltip
          sortable
          width="auto"
        >
          <template #default="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$translateTitle('developer.channeltype')"
          prop="type"
          show-overflow-tooltip
          sortable
          width="auto"
        >
          <template #default="{ row }">
            <span v-if="row.type == 1">
              {{ $translateTitle('developer.collectionchannel') }}
            </span>
            <span v-else-if="row.type == 2">
              {{ $translateTitle('developer.resourcechannel') }}
            </span>
            <span v-else>
              <!-- 任务通道 -->
              {{ $translateTitle('developer.missionchannel') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$translateTitle('websocket.port')"
          prop="cType"
          show-overflow-tooltip
          sortable
          width="80"
        >
          <template #default="{ row }">
            <span>{{ row.config.port }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$translateTitle('developer.servicetype')"
          prop="cType"
          show-overflow-tooltip
          sortable
          width="140"
        >
          <template #default="{ row }">
            <span>{{ row.cType }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$translateTitle('developer.channelstatus')"
          prop="status"
          show-overflow-tooltip
          sortable
          width="100"
        >
          <template #default="{ row }">
            <span v-if="row.status == 'ONLINE'" style="color: green">
              <!-- 在线 -->
              {{ $translateTitle('product.online') }}
            </span>
            <span v-else style="color: red">
              <!-- 离线 -->
              {{ $translateTitle('product.offline') }}
            </span>
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          show-overflow-tooltip-->
        <!--          prop="objectId"-->
        <!--          sortable-->
        <!--          :label="$translateTitle('developer.channeladdr')"-->
        <!--          width="200"-->
        <!--        >-->
        <!--          <template #default="{ row }">-->
        <!--            <span>{{ 'channel/' + row.objectId }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column
          :label="
            $translateTitle('developer.enable') +
            '/' +
            $translateTitle('developer.disable')
          "
          prop="isEnable"
          show-overflow-tooltip
          sortable
          width="120"
        >
          <template #default="{ row }">
            <el-tooltip
              :content="
                row.isEnable
                  ? $translateTitle('developer.enable')
                  : $translateTitle('developer.disable')
              "
              placement="top"
            >
              <el-switch
                v-model="row.isEnable"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="switchEnable(row.objectId, row.isEnable)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          :label="$translateTitle('developer.describe')"
          prop="objectId"
          show-overflow-tooltip
          sortable
        />
        <!--        <el-table-column :label="$translateTitle('product.view')">-->
        <!--          <template #default="{ row }">-->
        <!--            <el-button @click="viewDesign(row.data, row.objectId)">-->
        <!--              {{ $translateTitle('product.view') }}-->
        <!--            </el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column
          fixed="right"
          :label="$translateTitle('developer.operation')"
          width="240"
        >
          <template #default="{ row, $index }">
            <el-button
              :disabled="row.status == 'OFFLINE'"
              size="mini"
              :title="row.status == 'ONLINE' ? '' : '请先启用通道'"
              type="success"
              @click="subProTopic(row)"
            >
              <!-- 订阅日志 -->
              {{ $translateTitle('product.log') }}
            </el-button>
            <el-button size="mini" type="primary" @click="editorChannel(row)">
              <!-- 编辑 -->
              {{ $translateTitle('task.Edit') }}
            </el-button>
            <!--            <el-button-->
            <!--              type="success"-->
            <!--              size="mini"-->
            <!--              @click="updateChannel(row)"-->
            <!--            >-->
            <!--              &lt;!&ndash; 详情 &ndash;&gt;-->
            <!--              {{ $translateTitle('product.details') }}-->
            <!--            </el-button>-->
            <el-popover
              :ref="`popover-${$index}`"
              placement="top"
              style="margin-left: 10px"
              width="300"
            >
              <!-- <p>确定删除这个{{ row.name }}通道吗？</p> -->
              <p>
                {{ $translateTitle('product.qdsczg') }}{{ row.name
                }}{{ $translateTitle('equipment.channel') }}
              </p>
              <div>
                <el-button
                  size="mini"
                  type="text"
                  @click="row._self.$refs[`popover-${$index}`].doClose()"
                >
                  {{ $translateTitle('developer.cancel') }}
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="deleteChannel(row, $index)"
                >
                  {{ $translateTitle('developer.determine') }}
                </el-button>
              </div>
              <el-button slot="reference" size="mini" type="danger">
                {{ $translateTitle('developer.delete') }}
              </el-button>
            </el-popover>
            <!--            <el-button-->
            <!--              type="goon"-->
            <!--              size="mini"-->
            <!--              @click="productinformation(row.objectId)"-->
            <!--            >-->
            <!--              &lt;!&ndash; 订阅日志 &ndash;&gt;-->
            <!--              {{ $translateTitle('product.productinformation') }}-->
            <!--            </el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="elpagination">
        <el-pagination
          :key="length + 'key' + total"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="length"
          :page-sizes="[5, 10, 20, 30, 50]"
          :total="total"
          @current-change="channelCurrentChange"
          @size-change="channelSizeChange"
        />
      </div>
    </div>
    <!--弹窗--->
    <el-dialog
      :append-to-body="true"
      :before-close="handleClose"
      :title="channelupdated + '通道'"
      top="10vh"
      :visible.sync="channelForm"
      width="50%"
    >
      <el-form
        ref="addchannel"
        label-width="auto"
        :model="addchannel"
        :rules="addrules"
      >
        <el-form-item
          :label="$translateTitle('developer.channeltype')"
          prop="region"
        >
          <!-- <el-select
            v-model="addchannel.region"
            disabled
            placeholder="通道类型"
            @change="removeauto"
          > -->
          <el-select
            v-model="addchannel.region"
            disabled
            :placeholder="$translateTitle('developer.channeltype')"
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in channelregion"
              :key="index"
              :label="item.title.zh"
              :value="item.cType"
            />
          </el-select>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-row :gutter="24">-->
        <!--            <el-col-->
        <!--              v-for="(item, index) in channelregion"-->
        <!--              :key="index"-->
        <!--              :span="24"-->
        <!--              style="cursor: pointer"-->
        <!--            >-->
        <!--              <el-card-->
        <!--                v-if="item.params.ico && item.params.ico.default"-->
        <!--                v-show="addchannel.region == item.cType"-->
        <!--                class="box-card"-->
        <!--                :shadow="addchannel.region == item.cType ? 'always' : 'hover'"-->
        <!--                size="mini"-->
        <!--                :style="{-->
        <!--                  display: addchannel.region == item.cType ? 'block' : 'none',-->
        <!--                  color:-->
        <!--                    addchannel.region == item.cType ? '#00bad0' : '#c0c4cc',-->
        <!--                }"-->
        <!--              >-->
        <!--                <div slot="header" class="clearfix">-->
        <!--                  <span>{{ item.title.zh }}</span>-->
        <!--                  &lt;!&ndash;                                  <el-button&ndash;&gt;-->
        <!--                  &lt;!&ndash;                                    :disabled="resourceid != ''"&ndash;&gt;-->
        <!--                  &lt;!&ndash;                                    size="mini"&ndash;&gt;-->
        <!--                  &lt;!&ndash;                                    style="float: right"&ndash;&gt;-->
        <!--                  &lt;!&ndash;                                    type="success"&ndash;&gt;-->
        <!--                  &lt;!&ndash;                                    @click="setCard(item.cType)"&ndash;&gt;-->
        <!--                  &lt;!&ndash;                                  >&ndash;&gt;-->
        <!--                  &lt;!&ndash;                                    &lt;!&ndash; 已选 &ndash;&gt;&ndash;&gt;-->
        <!--                  &lt;!&ndash;                                    {{ $translateTitle('product.selected') }}&ndash;&gt;-->
        <!--                  &lt;!&ndash;                                  </el-button>&ndash;&gt;-->
        <!--                </div>-->
        <!--                <div class="text item">-->
        <!--                  <el-row :gutter="24">-->
        <!--                    <el-col :span="12">-->
        <!--                      <img-->
        <!--                        class="image"-->
        <!--                        :src="-->
        <!--                          item.params.ico.default ? item.params.ico.default : ''-->
        <!--                        "-->
        <!--                        style="width: 50px; height: 50px"-->
        <!--                      />-->
        <!--                    </el-col>-->
        <!--                    <el-col :span="12">-->
        <!--                      <el-tag>{{ item.cType }}</el-tag>-->
        <!--                    </el-col>-->
        <!--                  </el-row>-->
        <!--                </div>-->
        <!--              </el-card>-->
        <!--            </el-col>-->
        <!--          </el-row>-->
        <!--        </el-form-item>-->
        <el-form-item
          :label="$translateTitle('developer.channelname')"
          prop="name"
        >
          <el-input
            v-model="addchannel.name"
            autocomplete="off"
            :placeholder="$translateTitle('developer.channelname')"
          />
        </el-form-item>
        <el-form-item
          :label="$translateTitle('application.applicationtype')"
          prop="applicationtText"
        >
          <el-input
            v-model="addchannel.applicationtText"
            :placeholder="$translateTitle('product.pleaseselectyourapp')"
            readonly
            @focus="showTree = !showTree"
          />
          <div v-if="showTree">
            <el-tree
              :data="allApps"
              :props="defaultProps"
              @node-click="handleNodeClick"
            />
          </div>
        </el-form-item>

        <el-col
          v-for="(item, index) in arrlist"
          :key="index"
          :span="item.allowCreate ? 24 : 12"
        >
          <el-form-item
            :label="item.title.zh"
            :prop="item.showname"
            :required="item.required"
          >
            <el-tooltip effect="dark" placement="right-start">
              <div slot="content">
                {{ item.description.zh }}
              </div>
              <i class="el-icon-question" style="float: left" />
            </el-tooltip>
            <el-select
              v-if="item.enum"
              v-model="addchannel[item.showname]"
              style="width: 100%"
            >
              <el-option
                v-for="(item2, index2) in item.enum"
                :key="index2"
                :label="item2.label"
                :value="item2.value"
              />
            </el-select>
            <el-input
              v-else-if="item.type == 'string'"
              v-show="item.title.zh !== '通道ICO'"
              v-model="addchannel[item.showname]"
              style="width: 96%"
            />
            <el-image
              v-else-if="item.showname == 'ico'"
              v-show="item.title.zh == '通道ICO'"
              :preview-src-list="[$FileServe + item.default]"
              :src="$FileServe + addchannel[item.default]"
              style="width: 26px; height: 26px"
            >
              <div slot="error" class="image-slot">
                {{ addchannel[item.showname] }}
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <!--            <el-button-->
            <!--              v-else-if="item.showname == 'ico'"-->
            <!--              slot="append"-->
            <!--              icon="el-icon-upload"-->
            <!--              @click="uploadCkick(addchannel[item.showname], index, 'arrlist')"-->
            <!--            />-->
            <el-input
              v-else-if="item.type == 'integer'"
              v-model.number="addchannel[item.showname]"
              style="width: 96%"
            />
            <el-select
              v-else-if="item.type == 'boolean'"
              v-model="addchannel[item.showname]"
              class="notauto"
              style="width: 96%"
            >
              <!-- <el-option :value="true" label="是" />
              <el-option :value="false" label="否" /> -->
              <el-option
                :label="$translateTitle('product.yes')"
                :value="true"
              />
              <el-option
                :label="$translateTitle('product.no')"
                :value="false"
              />
            </el-select>
            <el-select
              v-else-if="item.type == 'enum'"
              v-model="addchannel[item.showname]"
              class="notauto"
              style="width: 96%"
            >
              <el-option
                v-for="(item1, index1) in item.enum"
                :key="index1"
                :label="item.enum[index1]"
                :value="item.enum[index1]"
              />
            </el-select>
            <div v-else-if="item.allowCreate">
              <el-button
                @click.native="dybaneucForms[item.showname].unshift({})"
              >
                新增
              </el-button>

              <el-table
                :data="dybaneucForms[item.showname]"
                style="width: 100%"
              >
                <el-table-column
                  v-for="(j, _index) in colCum[item.showname].prop"
                  :key="_index"
                  align="center"
                  :label="colCum[item.showname].prop[_index]"
                  :prop="colCum[item.showname].label[_index]"
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
                        dybaneucDleform(
                          scope.$index,
                          dybaneucForms[item.showname]
                        )
                      "
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </el-col>
        <!---------------------统一的配置描述---------------------------->
        <div class="row-bg">
          <el-form-item :label="$translateTitle('developer.describe')">
            <el-input
              v-model="addchannel.desc"
              autocomplete="off"
              :placeholder="$translateTitle('developer.describe')"
              :rows="3"
              type="textarea"
              @change="inputChange"
            />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="margin-right: 20px" @click="handleClose">
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button type="primary" @click.native="addchannelForm('addchannel')">
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </div>
    </el-dialog>
    <!--详情展示-->
    <!-- <el-dialog
  :append-to-body="true" :visible.sync="dialogVisible" title="通道详情" width="50%"> -->
    <el-dialog
      :append-to-body="true"
      :title="$translateTitle('equipment.channeldetails')"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <el-row>
          <el-col :span="12">ID:</el-col>
          <el-col :span="12">
            {{ resourceid }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">Resource Type:</el-col>
          <el-col :span="12">
            {{ resoucetype }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">Description:</el-col>
          <el-col :span="12">
            {{ description }}
          </el-col>
        </el-row>

        <el-row v-for="(key, value) in detailchannel" :key="key">
          <el-col :span="12">
            {{ value }}
          </el-col>
          <el-col :span="12">
            {{ key }}
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="dialogVisible = false">
          <!-- 确定 -->
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </span>
    </el-dialog>
    <a-drawer
      :append-to-body="true"
      placement="right"
      :title="channelname + '日志'"
      :visible="subdialog"
      width="80%"
      @close="handleCloseSubdialog(pubtopic)"
    >
      <mqtt-log
        :channel-id="channelname"
        :list="msgList"
        :msg="submessage"
        :product="channelInfo"
        :refresh-key="refreshFlag"
      />
    </a-drawer>
    <el-dialog
      custom-class="dgiot_dialog"
      :show-close="false"
      :visible.sync="channelDialog"
      width="50%"
    >
      <dgiot-query-form>
        <dgiot-query-form-left-panel :span="12">
          <el-button
            :disabled="!selectedData.length"
            type="danger"
            @click="handleDelete(channelInfo)"
          >
            {{ $translateTitle('Maintenance.batch deletion') }}
          </el-button>
        </dgiot-query-form-left-panel>
      </dgiot-query-form>

      <el-table
        :data="channelInfo"
        height="60vh"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="index" />
        <el-table-column type="selection" width="50" />
        <el-table-column
          align="center"
          :label="$translateTitle('developer.channelname')"
          prop="name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          align="center"
          :label="$translateTitle('developer.servicetype')"
          prop="devType"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          align="center"
          :label="$translateTitle('developer.describe')"
          prop="desc"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          align="center"
          :label="$translateTitle('developer.operation')"
          prop="objectId"
          show-overflow-tooltip
          sortable
        >
          <template #default="{ row }">
            <el-button
              size="mini"
              type="danger"
              @click="deleteRelation(channelInfo, row.objectId)"
            >
              {{ $translateTitle('developer.remove') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pagination.currentPage"
        :layout="pagination.layout"
        :page-size="pagination.size"
        :page-sizes="pagination.sizes"
        :total="pagination.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-dialog>
  </div>
</template>
<script>
  import requiremodule from '@/utils/file/requiremodule'
  import {
    delChannel,
    postChannel,
    putChannel,
    queryChannel,
    saveChanne,
  } from '@/api/Channel/index'
  import { queryProduct } from '@/api/Product/index'
  import { queryRole } from '@/api/Role/index'
  import { subupadte } from '@/api/System/index'
  import { resourceTypes } from '@/api/Rules'
  import { mapGetters } from 'vuex'
  import defaultLogo from '../../../../public/assets/images/logo/logo.png'
  import DgiotInput from '@/dgiot/components/DgiotInput/input'
  import { putView } from '@/api/View'

  var subdialog

  export default {
    components: {
      DgiotInput,
      ...requiremodule(require.context('./components', true, /\.vue$/)),
    },
    // inject: ['reload'],
    data() {
      return {
        colCum: {},
        dybaneucForms: {},
        tableName: [],
        tableTitle: {},
        amisFlag: false,
        isPreview: true,
        renderSchema: {},
        amisJson: {},
        selectedData: [],
        pagination: {
          currentPage: 4,
          sizes: [10, 20, 30, 50, 100],
          size: 10,
          layout: 'total, sizes, prev, pager, next, jumper',
          total: 0,
          pageNo: 1,
          pageSize: 20,
          searchDate: [],
          limit: 10,
          skip: 0,
          order: '-createdAt',
          keys: 'count(*)',
        },
        channelid: '',
        channelInfo: [],
        channelDialog: false,
        router: '',
        topotopic: '',
        refreshFlag: '99',
        msgList: [],
        submessage: '',
        subtopic: '',
        pubtopic: '',
        channeindex: 0,
        channeType: '',
        listLoading: false,
        dialogVisible: false,
        isopen: 'suo',
        pwdType: 'password',
        tableData: [],
        channelForm: false,
        channelupdated: '新增',
        activeName: 'first',
        channelformsearch: {
          name: '',
        },
        channelregion: [],
        addchannel: {
          region: '',
          desc: '',
          applicationtText: '',
        },
        applicationList: [],
        addrules: {
          applicationtText: [
            {
              required: true,
              message: '请选择所属应用',
              trigger: 'change',
            },
          ],
          roles: [
            {
              required: true,
              message: '请选择所属应用',
              trigger: 'blur',
            },
          ],
          name: [
            {
              required: true,
              message: '请输入通道名称',
              trigger: 'blur',
            },
          ],
          region: [
            {
              required: true,
              message: '请选择服务类型',
              trigger: 'change',
            },
          ],
        },
        length: 10,
        start: 0,
        total: 0,
        selectregion: {},
        resourceid: '',
        resoucetype: '',
        description: '',
        detailchannel: '',
        // 订阅日志
        subdialog: false,
        value4: '',
        subdialogid: '',
        subdialogtimer: null,
        channelname: '',
        arrlist: [],
        channelId: '',
        channelrow: [],
        showTree: false,
        topicKey: '',
        allApps: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
      }
    },
    ...mapGetters({
      roleTree: 'user/roleTree',
    }),
    watch: {
      topicKey: {
        handler: function (newVal, oldval) {
          console.log('newVal topicKey', newVal)
          console.log('oldval topicKey', oldval)
          let _this = this
          if (newVal) {
            this.$dgiotBus.$off(newVal)
            this.$dgiotBus.$on(newVal, (res) => {
              console.error(res)
              const { payload } = res
              this.mqttMsg(payload)
            })
          }
          if (oldval) {
            // 取消订阅
            _this.submessage = ''
            _this.msgList = []
            _this.logKey = '99'
          }
        },
        deep: true,
        limit: true,
      },
    },
    mounted() {
      this.router = this.$dgiotBus.router(this.$route.fullPath)
      this.Get_Re_Channel(0)
      this.dialogType()
      this.getApplication()
    },
    methods: {
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
      dynamicTable(data, type, _table, showname, line) {
        console.log(data, type, _table, showname, line, 920)
        this.tableName.push(data.showname)
        // var dybaneucForms = {}
        this.dybaneucForms[showname] = []
        this.colCum[showname] = { label: [], prop: [] }
        dgiotlogger.error(925, data, _table)
        const { table } = data
        var arr = {}
        var title = {}
        arr[showname] = {}
        title[showname] = {}
        for (const t in table) {
          arr[showname][table[t].title.zh] =
            table[t].default.label || table[t].default
          this.colCum[showname].prop.push(table[t].title.zh)
          this.colCum[showname].label.push(table[t].key)
          title[showname][table[t].title.zh] = table[t].key
          title[showname][table[t].key] = table[t].zh
          arr[showname][table[t].key] =
            table[t].default.label || table[t].default
          this.tableTitle[showname] = title[showname]
          console.error(941, table[t], t, arr)
          console.error(942, t, table[t], this.tableTitle)
        }
        if (type === '回显') {
          console.error(945, '回显', title, _table)
          // dybaneucForms = []
          _table.forEach((_itme, _tidx) => {
            this.dybaneucForms[showname][_tidx] = {}
            for (var _t in title[showname]) {
              // console.info(_t, 949)
              var _title = title[showname][_t]
              // arr[showname][_t] = _itme[_title]
              this.dybaneucForms[showname][_tidx][_t] = _itme[_title]
              console.error(_itme[_title], _t, _itme, 952)
            }
            console.error(arr[showname], 954)
            // this.dybaneucForms[showname][_tidx] = arr[showname]
          })
        } else {
          this.dybaneucForms[showname].push(arr[showname])
        }
        dgiotlogger.error(
          '960',
          this.dybaneucForms,
          this.colCum,
          this.tableTitle
        )
        return this.dybaneucForms
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
      // 解析物模型字典为指定类型
      dictParse(dybaneucForms, title) {
        const obj = []
        dybaneucForms.map((i) => {
          var arr = {}
          for (let j in i) {
            console.log(j, i[j], title[j])
            if (title[j] != undefined) {
              arr[title[j]] = i[j]
            }
          }
          obj.push(arr)
        })
        dgiotlogger.error(1328, obj)
        return obj
      },
      /**
       * @Author: h7ml
       * @Date: 2021-11-22 11:07:21
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async saveAmis() {
        try {
          const loading = this.$baseColorfullLoading()
          const payload = {
            data: this.$refs['dgiotAmis'].getSchema(),
          }
          const res = await putChannel(this.channelid, payload)
          this.$baseMessage(
            this.$translateTitle('user.update completed'),
            'success',
            'dgiot-hey-message-success'
          )
          loading.close()
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },

      viewDesign(data = {}, channelid) {
        this.renderSchema = data
        this.amisFlag = true
        console.log(this.renderSchema, e)
        this.$refs['dgiotAmis'].setSchema(data)
        this.channelid = channelid
      },
      async onChange(e) {
        this.$refs['dgiotAmis'].setSchema(e)
        this.renderSchema = e
        this.amisJson = e
        console.log(this.renderSchema, e)
      },
      handleSelectionChange(data) {
        this.selectedData = data
      },
      handleDelete(channelInfo) {
        this.$baseConfirm(
          this.$translateTitle(
            'Maintenance.Are you sure you want to delete the current item'
          ),
          null,
          async () => {
            const selectedData = this.selectedData
            if (selectedData) {
              selectedData.forEach(function (item, index) {
                channelInfo.forEach(function (itemI, indexI) {
                  if (item === itemI) {
                    channelInfo.splice(indexI, 1)
                  }
                })
              })
            }
          }
        )
      },
      // 移除通道
      async deleteRelation(channelInfo, objectId) {
        try {
          const params = {
            product: {
              __op: 'RemoveRelation',
              objects: [
                {
                  __type: 'Pointer',
                  className: 'Product',
                  objectId: objectId,
                },
              ],
            },
          }
          const loading = this.$baseColorfullLoading()
          const res = await saveChanne(this.channelid, params)
          console.log(res)
          this.$baseMessage(
            this.$translateTitle('alert.Data request successfully'),
            'success',
            'dgiot-hey-message-success'
          )
          loading.close()
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      async handleSizeChange() {},
      async handleCurrentChange() {},
      async productinformation(objectId) {
        this.channelid = objectId
        const loading = this.$baseLoading(3)
        try {
          const params = {
            limit: this.pagination.limit,
            order: this.pagination.order,
            skip: this.pagination.skip,
            keys: this.pagination.keys,
            where: {
              $relatedTo: {
                object: {
                  __type: 'Pointer',
                  className: 'Channel',
                  objectId: objectId,
                },
                key: 'product',
              },
            },
          }
          const { results = [], count: total = 0 } = await queryProduct(params)
          loading.close()
          this.pagination.total = total
          this.channelInfo = results
          // this.channelDialog = true
        } catch (error) {
          console.log(error)
          loading.close()
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      uploadCkick(type, index, channeType) {
        console.log(type, index)
        this.channeindex = index
        this.channeType = channeType
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
      },
      fileInfo(info) {
        console.log('uploadFinish', info)
        if (this.channeType == 'arrlist') {
          this.arrlist[this.channeindex].default = info.url
          console.log(this.arrlist[this.channeindex])
        } else {
          this.channelregion[this.channeindex].params.ico.default = info.url
        }
      },
      addchannelForm(formName) {
        if (this.resourceid) {
          // this.$message("编辑通道")
          this.editChannel(this.resourceid, formName)
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid && this.addchannel.applicationtText) {
              var obj = {}
              for (var key in this.addchannel) {
                obj[key] = this.addchannel[key]
              }
              delete obj.region
              delete obj.desc
              delete obj.type
              delete obj.isEnable
              delete obj.name
              const aclKey = 'role' + ':' + this.addchannel.applicationtText
              const aclObj = {}
              aclObj[aclKey] = {
                read: true,
                write: true,
              }
              const _table = _.uniq(this.tableName)
              _table.forEach((item) => {
                obj[item] = this.dictParse(
                  this.dybaneucForms[item],
                  this.tableTitle[item]
                )
              })
              const data = {
                ACL: aclObj,
                config: obj,
                name: this.addchannel.name,
                cType: this.addchannel.region,
                desc: this.addchannel.desc,
                isEnable: false,
                status: 'OFFLINE',
                type: this.addchannel.type.toString(),
              }
              this.addchannelaxios(data)
            } else {
              this.$message('有必填项未填')
            }
          })
        }
      },
      async addchannelaxios(data) {
        await postChannel(data).then((results) => {
          if (results) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'success',
              message: this.channelupdated == '编辑' ? '编辑成功' : '创建成功',
            })
            this.$refs['addchannel'].resetFields()
            this.addchannel = {}
            // this.reload()
            this.channelForm = false
            this.resourceid = ''
          }
        })
      },
      handleNodeClick(data) {
        this.showTree = !this.showTree
        this.$set(this.addchannel, 'applicationtText', data.name)
      },
      inputChange(val) {
        console.log(val)
      },
      // 验证
      validUrl(rule, value, callback) {
        const reg =
          /^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
        if (!reg.test(value)) {
          callback(new Error('需要输入正确的url'))
        } else {
          callback()
        }
      },
      validPort(rule, value, callback) {
        const reg =
          /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
        if (!reg.test(value)) {
          callback(new Error('需要输入正确的端口号'))
        } else {
          callback()
        }
      },
      async Get_Re_Channel(start = 0) {
        this.listLoading = true
        this.tableData = []
        // this.total = 0
        if (start == 0) {
          this.start = 0
        }
        const params = {
          count: 'objectId',
          skip: this.start,
          limit: this.length,
          order: '-createdAt',
          keys: 'count(*)',
          where: {},
        }
        this.channelformsearch.name
          ? (params.where.name = { $regex: this.channelformsearch.name })
          : ''
        const { count, results } = await queryChannel(params)
        this.total = count
        this.tableData = results
        this.listLoading = false
      },

      async getApplication() {
        const params = {
          limit: 100,
        }
        const { results } = await queryRole(params)
        results.map((item) => {
          var obj = {}
          obj.id = item.id
          obj.name = item.desc
          this.applicationList.push(obj)
        })
      },
      // 初始化弹框数据
      async dialogType() {
        this.allApps = this.roleTree
        const res = await resourceTypes()
        res.forEach((item) => {
          if (!item.params.ico) {
            item.params.ico = {
              title: {
                en: 'channel ICO',
                zh: '通道ICO',
              },
              description: {
                en: 'channel ICO',
                zh: '通道ICO',
              },
              default: defaultLogo,
            }
          }
        })
        this.channelregion = res
      },
      // 更新状态
      async switchEnable(objectId, action) {
        action = action ? 'enable' : 'disable'
        try {
          const { updatedAt } = await subupadte(objectId, action)
          console.log(updatedAt)
          if (updatedAt) {
            this.$message({
              showClose: true,
              duration: 2000,
              message:
                this.$translateTitle(`developer.${action}`) +
                '' +
                this.$translateTitle('node.success'),
              type: 'success',
            })
            this.Get_Re_Channel(this.start)
          }

          // this.$message.success(`${res}`)
        } catch (error) {
          console.log(error)
          this.$message.error(`${error}`)
        }
        // this.$message(error.error)
      },
      // 编辑设备
      updateChannel(row) {
        this.dialogVisible = true
        this.resourceid = row.objectId
        this.detailchannel = row.config
        this.resoucetype = row.cType
        this.description = row.desc
      },
      async editChannel(channeld, form) {
        var obj = {}
        for (var key in this.addchannel) {
          obj[key] = this.addchannel[key]
        }
        delete obj.region
        delete obj.desc
        delete obj.type
        delete obj.isEnable
        delete obj.name
        const _table = _.uniq(this.tableName)
        _table.forEach((item) => {
          obj[item] = this.dictParse(
            this.dybaneucForms[item],
            this.tableTitle[item]
          )
        })
        const data = {
          config: obj,
          name: this.addchannel.name,
          cType: this.addchannel.region,
          desc: this.addchannel.desc,
        }
        const res = await putChannel(channeld, data)
        if (res.updatedAt) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'success',
            message: '编辑成功',
          })
          this.$refs['addchannel'].resetFields()
          this.addchannel = {}
          this.channelForm = false
          this.resourceid = ''
          this.Get_Re_Channel(this.start)
        }
      },

      // 删除通道
      deleteChannel(row, $index) {
        this.delchannelaxios(row, $index)
      },
      delchannelaxios(row, $index) {
        delChannel(row.objectId)
          .then((results) => {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'success',
              message: '删除成功',
            })
            row._self.$refs[`popover-${$index}`].doClose()
            this.Get_Re_Channel(this.start)
          })
          .catch((e) => {
            console.log(e.error)
            this.Get_Re_Channel(this.start)
          })
      },
      addchanneltype() {
        // this.arrlist = []
        // this.channelForm = true
        // this.channelupdated = '新增'
        this.$router.push({
          path: '/Createchannel',
          query: {
            type: 'create',
          },
        })
      },
      // 关闭弹窗
      handleClose() {
        this.addchannel = {}
        this.channelForm = false
        this.$refs['addchannel'].resetFields()
        this.resourceid = ''
      },
      getChannelEnable(row, rowIndex) {
        if (row.row.isEnable == true) {
          return 'green_active'
        } else {
          return 'red_active'
        }
      },
      // 分页
      channelSizeChange(val) {
        this.length = val
        // this.total = 0
        this.Get_Re_Channel(1)
      },
      channelCurrentChange(val) {
        // this.total = 0
        if (val <= 1) this.total = 0
        console.log(val)
        this.start = (val - 1) * this.length
        this.Get_Re_Channel(1)
      },
      arrSort(a, b) {
        var val1 = a.order
        var val2 = b.order
        if (val1 < val2) {
          return -1
        } else if (val1 > val2) {
          return 1
        } else {
          return 0
        }
      },
      orderObject(object) {
        var arr = []
        for (var key in object) {
          object[key].showname = key
          arr.push(object[key])
        }
        const sortBy = _.sortBy(arr, ['order'])
        return sortBy
        console.log(sortBy)
        // return arr.sort(this.arrSort)
      },
      setCard(item) {
        this.removeauto(item)
      },
      removeauto(val) {
        console.log(val)
        var obj = {}
        var obj1 = {
          applicationtText: [
            {
              required: true,
              message: '请选择所属应用',
              trigger: 'change',
            },
          ],
          roles: [
            {
              required: true,
              message: '请选择所属应用',
              trigger: 'blur',
            },
          ],
          name: [
            {
              required: true,
              message: '请输入通道名称',
              trigger: 'blur',
            },
          ],
          region: [
            {
              required: true,
              message: '请选择服务类型',
              trigger: 'change',
            },
          ],
        }
        // if (this.resourceid == '') {
        //   this.channelregion.map((item) => {
        //     if (item.cType == val) {
        //       this.$forceUpdate()
        //       this.selectregion = item
        //       this.arrlist = this.orderObject(this.selectregion.params)
        //       this.arrlist.map((item) => {
        //         if (item.allowCreate) {
        //           this.dynamicTable(
        //             item,
        //             '回显',
        //             this.channelrow.config[item.showname],
        //             item.showname,
        //             1485
        //           )
        //         }
        //         if (item.default) {
        //           obj[item.showname] = item.default
        //         } else {
        //           obj[item.showname] = ''
        //         }
        //         if (item.required) {
        //           if (item.type == 'string' || item.type == 'integer') {
        //             obj1[item.showname] = [
        //               {
        //                 required: true,
        //                 trigger: 'blur',
        //               },
        //             ]
        //           } else {
        //             obj1[item.showname] = [
        //               {
        //                 required: true,
        //                 trigger: 'change',
        //               },
        //             ]
        //           }
        //         }
        //       })
        //       obj.region = val
        //       obj.desc = ''
        //       obj.name = ''
        //       obj.type = this.selectregion.type
        //       obj.isEnable = false
        //     }
        //   })
        // } else {
        this.channelregion.map((item) => {
          if (item.cType == val) {
            this.selectregion = item
            this.$forceUpdate()
            this.arrlist = this.orderObject(this.selectregion.params)
            const sortBy = _.sortBy(this.arrlist, ['order'])
            this.arrlist = sortBy
            console.log(this.arrlist)
            this.arrlist.map((item) => {
              for (var key in this.channelrow.config) {
                if (item.showname == key) {
                  obj[item.showname] = this.channelrow.config[key]
                }
                if (item.allowCreate) {
                  console.error(item, '1532', item.showname)
                  this.dynamicTable(
                    item,
                    '回显',
                    this.channelrow.config[item.showname],
                    item.showname,
                    1535
                  )
                }
                if (item.required) {
                  if (item.type == 'string' || item.type == 'integer') {
                    obj1[item.showname] = [
                      {
                        required: true,
                        trigger: 'blur',
                      },
                    ]
                  } else {
                    obj1[item.showname] = [
                      {
                        required: true,
                        trigger: 'change',
                      },
                    ]
                  }
                }
                obj.region = val
                obj.desc = this.channelrow.desc
                obj.name = this.channelrow.name
                obj.type = this.selectregion.type
                obj.isEnable = this.channelrow.isEnable
                // obj.applicationtText =
              }
            })
          }
        })
        // }
        // 读取acl列表,获取所属应用名称
        if (this.channelrow) {
          for (var key in this.channelrow.ACL) {
            obj.applicationtText = key ? key.substr(5) : ''
          }
        }
        this.addchannel = obj
        console.log(this.addchannel)
        this.addchannel.region = val
        this.addrules = obj1
      },
      editorChannel(row) {
        console.log(row)
        this.channelrow = row
        this.resourceid = row.objectId
        this.channelupdated = '编辑'
        this.removeauto(row.cType)
        this.$nextTick(() => {
          this.channelForm = true
        })
      },
      // 弹窗订阅日志
      nowtime() {
        var timestamp3 = Date.parse(new Date())
        var date = new Date(timestamp3)
        var Y = date.getFullYear() + '年'
        var M =
          (date.getMonth() + 1 <= 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '月'
        var D =
          (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) +
          '日  '
        var h =
          (date.getHours() + 1 <= 10
            ? '0' + date.getHours()
            : date.getHours()) + ':'
        var m =
          (date.getMinutes() + 1 <= 10
            ? '0' + date.getMinutes()
            : date.getMinutes()) + ':'
        var s =
          date.getSeconds() + 1 <= 10
            ? '0' + date.getSeconds()
            : date.getSeconds()
        return h + m + s + ' '
      },
      mqttMsg(Msg) {
        this.msgList.push({
          timestamp: moment().format('x'),
          msg: Msg,
        })
        this.refreshFlag = moment().format('x')
        this.submessage += Msg + `\n`
        // subdialog.setValue(this.submessage)
        // subdialog.gotoLine(subdialog.session.getLength())
      },
      subProTopic(row) {
        this.productinformation(row.objectId)
        this.subdialog = true
        this.subdialogid = row.objectId
        this.channelname = row.objectId
        this.subtopic = '$dg/channel/' + row.objectId + '/#'
        this.submessage = ''
        this.msgList = []
        let subInfo = {
          router: this.router,
          topic: this.subtopic,
          qos: 2,
          ttl: 1000 * 60 * 60 * 3,
        }
        this.$dgiotBus.$emit('MqttSubscribe', subInfo)
        subupadte(row.objectId, 'start_logger')
        this.topicKey = this.$dgiotBus.topicKey(this.router, this.subtopic)
      },
      handleCloseSubdialog(pubtopic) {
        subupadte(this.channelid, 'stop_logger')
        this.refreshFlag = moment().format('x')
        this.submessage = ''
        this.msgList = []
        this.subdialog = !this.subdialog
      },
    },
  }
</script>
<style lang="scss">
  .dgiot_dialog {
    .el-dialog__header {
      display: none;
    }

    .dj-dialog-content {
      padding: 0;
      overflow: unset;
    }
  }
</style>
<style lang="scss" scoped>
  .el-button--goon.is-active,
  .el-button--goon:active {
    color: #fff;
    background: #20b2aa;
    border-color: #20b2aa;
  }

  .el-button--goon:focus,
  .el-button--goon:hover {
    color: #fff;
    background: #48d1cc;
    border-color: #48d1cc;
  }

  .el-button--goon {
    color: #fff;
    background-color: #20b2aa;
    border-color: #20b2aa;
  }

  ::v-deep .row-bg {
    .el-form-item {
      .el-form-item__content {
        position: revert;
        //width: 100%;
      }
    }
  }

  ::v-deep .el-dialog__wrapper {
    margin-bottom: 20px;
  }

  .resourcechannel {
    box-sizing: border-box;
    width: 100%;
    //height: 100%;
    height: calc(100vh - #{$base-top-bar-height} * 3 - 25px);

    ::v-deep {
      .green_active {
        color: green;
      }

      .dialog-footer {
        text-align: center;
      }
    }

    ::v-deep .red_active {
      color: red;
    }

    //::v-deep .el-button + .el-button {
    //  margin-left: 0;
    //}

    ::v-deep .el-tabs__item {
      height: 50px;
      margin: 0;
      margin-top: 20px;
      font-family: auto;
      font-size: 16px;
      line-height: 50px;
    }

    ::v-deep .el-dialog__header {
      border-bottom: 1px solid #cccccc;
    }

    ::v-deep .el-dialog__body {
      .el-form {
        display: flex;
        flex-wrap: wrap;

        .el-form-item {
          width: 100%;
          margin-bottom: 22px;

          .el-select {
            width: 100%;
          }
        }

        .el-col {
          @media screen and (max-width: 1350px) {
            width: 100%;
          }
        }
      }

      ::v-deep .el-row {
        margin: 20px 0;
      }
    }

    //::v-deep .el-button--mini {
    //  margin: 2px 0;
    //}
  }
</style>
<style lang="scss" scoped>
  .wrapper {
    position: fixed;
    right: -10.5px;
    bottom: 145px;
    z-index: 9999;
    padding: 7px 15px;
    padding-right: 19px;
    font-size: 12px;
    font-weight: 700;
    line-height: 12px;
    color: #fff;
    cursor: pointer;
    user-select: none;
    //background-color: rgba(0, 0, 0, 0.7);
    border: 1px solid #000;
    border-radius: 4px;
    opacity: 1;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    &:hover {
      right: -4px;
      //background-color: rgba(0, 0, 0, 0.9);
    }
    i {
      margin-right: 3px;
      font-size: 12px;
    }
  }
</style>
