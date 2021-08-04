<template>
  <div class="resourcechannel">
    <VabMqtt ref="mqtt" :topic="channeltopic" @mqttMsg="mqttMsg" />
    <vab-input ref="uploadFinish" @fileInfo="fileInfo" />
    <div class="firsttable">
      <el-form
        :inline="true"
        :model="channelformsearch"
        class="demo-form-inline"
        size="small"
      >
        <el-form-item>
          <el-input
            v-model="channelformsearch.name"
            :placeholder="$translateTitle('resource.name')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="Get_Re_Channel(0)">
            {{ $translateTitle('developer.search') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addchanneltype">
            {{ $translateTitle('developer.selectchannel') }}
          </el-button>
        </el-form-item>
      </el-form>
      <!----------------------------------------------------资源通道表格------------------>
      <el-table
        v-loading="listLoading"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        :data="tableData"
        :row-class-name="getChannelEnable"
        style="width: 100%"
      >
        <el-table-column
          sortable
          show-overflow-tooltip
          width="150"
          :label="$translateTitle('developer.channelnumber')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.objectId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          show-overflow-tooltip
          width="160"
          :label="$translateTitle('developer.channelname')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          show-overflow-tooltip
          width="180"
          :label="$translateTitle('developer.channeltype')"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">
              {{ $translateTitle('developer.collectionchannel') }}
            </span>
            <span v-else-if="scope.row.type == 2">
              {{ $translateTitle('developer.resourcechannel') }}
            </span>
            <span v-else>
              <!-- 任务通道 -->
              {{ $translateTitle('developer.missionchannel') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          show-overflow-tooltip
          width="140"
          :label="$translateTitle('developer.servicetype')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.cType }}</span>
          </template>
        </el-table-column>

        <el-table-column
          sortable
          show-overflow-tooltip
          width="100"
          :label="$translateTitle('developer.channelstatus')"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'ONLINE'" style="color: green">
              <!-- 在线 -->
              {{ $translateTitle('product.online') }}
            </span>
            <span v-else style="color: red">
              <!-- 离线 -->
              {{ $translateTitle('product.offline') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          sortable
          :label="$translateTitle('developer.channeladdr')"
          width="200"
        >
          <template slot-scope="scope">
            <span>{{ 'channel/' + scope.row.objectId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          show-overflow-tooltip
          :label="
            $translateTitle('developer.enable') +
            '/' +
            $translateTitle('developer.disable')
          "
        >
          <template slot-scope="scope">
            <el-tooltip
              :content="
                scope.row.isEnable
                  ? $translateTitle('developer.enable')
                  : $translateTitle('developer.disable')
              "
              placement="top"
            >
              <el-switch
                v-model="scope.row.isEnable"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="switchEnable(scope.row.objectId, scope.row.isEnable)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="$translateTitle('developer.describe')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$translateTitle('developer.operation')"
          fixed="right"
          width="340"
        >
          <template slot-scope="scope">
            <el-button
              slot="reference"
              type="primary"
              size="mini"
              @click="editorChannel(scope.row)"
            >
              <!-- 编辑 -->
              {{ $translateTitle('task.Edit') }}
            </el-button>
            <el-button
              type="success"
              size="mini"
              @click="updateChannel(scope.row)"
            >
              <!-- 详情 -->
              {{ $translateTitle('product.details') }}
            </el-button>
            <el-popover
              :ref="`popover-${scope.$index}`"
              placement="top"
              width="300"
              style="margin-left: 10px"
            >
              <!-- <p>确定删除这个{{ scope.row.name }}通道吗？</p> -->
              <p>
                {{ $translateTitle('product.qdsczg') }}{{ scope.row.name
                }}{{ $translateTitle('equipment.channel') }}
              </p>
              <div>
                <el-button
                  size="mini"
                  type="text"
                  @click="
                    scope._self.$refs[`popover-${scope.$index}`].doClose()
                  "
                >
                  {{ $translateTitle('developer.cancel') }}
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="deleteChannel(scope)"
                >
                  {{ $translateTitle('developer.determine') }}
                </el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini">
                {{ $translateTitle('developer.delete') }}
              </el-button>
            </el-popover>
            <!-- <el-popover
                placement="top-start"
                title="标题"
                width="200"
                trigger="hover"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <el-button slot="reference" :disabled="scope.row.attributes.status=='OFFLINE'">hover 激活</el-button>
              </el-popover> -->
            <el-tooltip
              :disabled="scope.row.status != 'OFFLINE'"
              class="item"
              effect="dark"
              content="请先启用通道"
              placement="top"
            >
              <el-button
                type="primary"
                size="mini"
                style="
                  position: absolute;
                  width: 100px;
                  height: 10px;
                  opacity: 0;
                "
                @click="subProTopic(scope.row)"
              />
            </el-tooltip>
            <el-button
              :disabled="scope.row.status == 'OFFLINE'"
              type="info"
              size="mini"
              @click="subProTopic(scope.row)"
            >
              <!-- 订阅日志 -->
              {{ $translateTitle('product.log') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="elpagination" style="margin-top: 20px">
        <el-pagination
          :page-sizes="[10, 20, 30, 50]"
          :page-size="length"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="channelSizeChange"
          @current-change="channelCurrentChange"
        />
      </div>
    </div>
    <!--弹窗--->
    <el-dialog
      :append-to-body="true"
      :title="channelupdated + '通道'"
      :visible.sync="channelForm"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="50%"
      top="10vh"
    >
      <el-form
        ref="addchannel"
        :model="addchannel"
        :rules="addrules"
        label-width="auto"
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
            @change="removeauto"
          >
            <el-option
              v-for="(item, index) in channelregion"
              :key="index"
              :label="item.title.zh"
              :value="item.cType"
            />
          </el-select>
          <el-row
            :gutter="24"
            style="
              width: 100%;
              min-height: 0;
              max-height: 100px;
              margin-top: 20px;
              text-align: center;
            "
          >
            <el-col
              v-for="(item, index) in channelregion"
              :key="index"
              :span="24"
              style="cursor: pointer"
            >
              <el-card
                v-if="item.params.ico && item.params.ico.default"
                v-show="addchannel.region == item.cType"
                :shadow="addchannel.region == item.cType ? 'always' : 'hover'"
                :style="{
                  display: addchannel.region == item.cType ? 'block' : 'none',
                  color:
                    addchannel.region == item.cType ? '#00bad0' : '#c0c4cc',
                }"
                size="mini"
                class="box-card"
              >
                <div slot="header" class="clearfix">
                  <span>{{ item.title.zh }}</span>
                  <el-button
                    :disabled="resourceid != ''"
                    type="success"
                    size="mini"
                    style="float: right"
                    @click="setCard(item.cType)"
                  >
                    <!-- 已选 -->
                    {{ $translateTitle('product.selected') }}
                  </el-button>
                </div>
                <div class="text item">
                  <el-row :gutter="24">
                    <el-col :span="12">
                      <img
                        :src="
                          item.params.ico.default ? item.params.ico.default : ''
                        "
                        class="image"
                        style="width: 50px; height: 50px"
                      />
                    </el-col>
                    <el-col :span="12">
                      <el-tag>{{ item.cType }}</el-tag>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          :label="$translateTitle('developer.channelname')"
          prop="name"
        >
          <el-input
            v-model="addchannel.name"
            :placeholder="$translateTitle('developer.channelname')"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          prop="applicationtText"
          :label="$translateTitle('application.applicationtype')"
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

        <el-col v-for="(item, index) in arrlist" :key="index" :span="12">
          <el-form-item
            :label="item.title.zh"
            :required="item.required"
            :prop="item.showname"
          >
            <el-tooltip effect="dark" placement="right-start">
              <div slot="content">
                {{ item.description.zh }}
              </div>
              <i class="el-icon-question" style="float: left" />
            </el-tooltip>
            <el-input
              v-if="item.type == 'string'"
              v-show="item.title.zh !== '通道ICO'"
              v-model="addchannel[item.showname]"
              style="width: 96%"
            />
            <el-input
              v-if="item.title.zh == '通道ICO'"
              v-show="item.title.zh == '通道ICO'"
              v-model.number="addchannel[item.showname]"
              style="width: 96%"
            >
              <el-button
                slot="append"
                icon="el-icon-upload"
                @click="
                  uploadCkick(addchannel[item.showname], index, 'arrlist')
                "
              />
            </el-input>
            <el-input
              v-else-if="item.type == 'integer'"
              v-model.number="addchannel[item.showname]"
              style="width: 96%"
            />
            <el-select
              v-else-if="item.type == 'boolean'"
              v-model="addchannel[item.showname]"
              style="width: 96%"
              class="notauto"
            >
              <!-- <el-option :value="true" label="是" />
              <el-option :value="false" label="否" /> -->
              <el-option
                :value="true"
                :label="$translateTitle('product.yes')"
              />
              <el-option
                :value="false"
                :label="$translateTitle('product.no')"
              />
            </el-select>
            <el-select
              v-else-if="item.type == 'enum'"
              v-model="addchannel[item.showname]"
              style="width: 96%"
              class="notauto"
            >
              <el-option
                v-for="(item1, index1) in item.enum"
                :key="index1"
                :label="item.enum[index1]"
                :value="item.enum[index1]"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!---------------------统一的配置描述---------------------------->
        <el-form-item :label="$translateTitle('developer.describe')">
          <el-input
            v-model="addchannel.desc"
            :rows="3"
            :placeholder="$translateTitle('developer.describe')"
            autocomplete="off"
            type="textarea"
            @change="inputChange"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="margin-right: 20px" @click="handleClose">
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button type="primary" @click="addchannelForm('addchannel')">
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </div>
    </el-dialog>
    <!--详情展示-->
    <!-- <el-dialog
  :append-to-body="true" :visible.sync="dialogVisible" title="通道详情" width="50%"> -->
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :title="$translateTitle('equipment.channeldetails')"
      width="50%"
    >
      <div>
        <el-row>
          <el-col :span="12">ID:</el-col>
          <el-col :span="12">{{ resourceid }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">Resource Type:</el-col>
          <el-col :span="12">{{ resoucetype }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">Description:</el-col>
          <el-col :span="12">{{ description }}</el-col>
        </el-row>

        <el-row v-for="(key, value) in detailchannel" :key="key">
          <el-col :span="12">{{ value }}</el-col>
          <el-col :span="12">{{ key }}</el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          <!-- 确定 -->
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </span>
    </el-dialog>
    <!--订阅日志-->
    <el-dialog
      :append-to-body="true"
      :title="channelname + '日志'"
      :visible.sync="subdialog"
      :before-close="handleCloseSubdialog"
      width="85%"
    >
      <div style="margin-top: 20px">
        <pre
          id="subdialog"
          class="ace_editor"
          style="width: 100%; min-height: 300px"
        >
                      <textarea class="ace_text-input" style="overflow:scroll"/>
        </pre>
      </div>
      <span slot="footer" class="dialog-footer" style="height: 30px">
        <el-switch
          v-model="value4"
          style="display: inline-block; margin-right: 10px"
          active-color="#13ce66"
          inactive-color="#ff4949"
          inactive-text="自动刷新"
          @change="stopsub"
        />
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    queryChannel,
    delChannel,
    postChannel,
    putChannel,
  } from '@/api/Channel/index'
  import { queryRole } from '@/api/Role/index'
  import { subupadte } from '@/api/System/index'
  import { resourceTypes } from '@/api/Rules'
  import { mapGetters } from 'vuex'

  var subdialog
  import { Websocket } from '@/utils/wxscoket.js'
  import VabInput from '@/vab/components/VabInput/input'

  export default {
    components: { VabInput },
    // inject: ['reload'],
    data() {
      return {
        channeltopic: '',
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
            { required: true, message: '请选择所属应用', trigger: 'change' },
          ],
          roles: [
            { required: true, message: '请选择所属应用', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入通道名称', trigger: 'blur' },
          ],
          region: [
            { required: true, message: '请选择服务类型', trigger: 'change' },
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
    mounted() {
      this.Get_Re_Channel(0)
      this.dialogType()
      this.getApplication()
    },
    methods: {
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
              aclObj[aclKey] = { read: true, write: true }
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
      async Get_Re_Channel(start) {
        this.listLoading = true
        if (start == 0) {
          this.start = 0
        }
        const params = {
          skip: this.start,
          limit: this.length,
          order: '-createdAt',
          keys: 'count(*)',
        }
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
              title: { en: 'channel ICO', zh: '通道ICO' },
              description: { en: 'channel ICO', zh: '通道ICO' },
              default:
                'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/logo/logo.png',
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
            this.$message.success(
              this.$translateTitle(`developer.${action}`) +
                '' +
                this.$translateTitle('node.success')
            )
            this.Get_Re_Channel(0)
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
        const data = {
          config: obj,
          name: this.addchannel.name,
          cType: this.addchannel.region,
          desc: this.addchannel.desc,
        }
        const res = await putChannel(channeld, data)
        if (res.updatedAt) {
          this.$message({
            type: 'success',
            message: '编辑成功',
          })
          this.$refs['addchannel'].resetFields()
          this.addchannel = {}
          this.channelForm = false
          this.resourceid = ''
          this.Get_Re_Channel(0)
        }
      },

      // 删除通道
      deleteChannel(scope) {
        this.delchannelaxios(scope)
      },
      delchannelaxios(scope) {
        delChannel(scope.row.objectId)
          .then((results) => {
            this.$message({
              type: 'success',
              message: '删除成功',
            })
            scope._self.$refs[`popover-${scope.$index}`].doClose()
            this.Get_Re_Channel(0)
          })
          .catch((e) => {
            console.log(e.error)
          })
      },
      addchanneltype() {
        // this.arrlist = []
        // this.channelForm = true
        // this.channelupdated = '新增'
        this.$router.push({
          path: '/CreateResourcechannel',
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
        this.Get_Re_Channel()
      },
      channelCurrentChange(val) {
        this.start = (val - 1) * this.length
        this.Get_Re_Channel()
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
        return arr.sort(this.arrSort)
      },
      setCard(item) {
        this.removeauto(item)
      },
      removeauto(val) {
        var obj = {}
        var obj1 = {
          applicationtText: [
            { required: true, message: '请选择所属应用', trigger: 'change' },
          ],
          roles: [
            { required: true, message: '请选择所属应用', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入通道名称', trigger: 'blur' },
          ],
          region: [
            { required: true, message: '请选择服务类型', trigger: 'change' },
          ],
        }
        if (this.resourceid == '') {
          this.channelregion.map((item) => {
            if (item.cType == val) {
              this.$forceUpdate()
              this.selectregion = item
              this.arrlist = this.orderObject(this.selectregion.params)
              this.arrlist.map((item) => {
                if (item.default) {
                  obj[item.showname] = item.default
                } else {
                  obj[item.showname] = ''
                }
                if (item.required) {
                  if (item.type == 'string' || item.type == 'integer') {
                    obj1[item.showname] = [{ required: true, trigger: 'blur' }]
                  } else {
                    obj1[item.showname] = [
                      { required: true, trigger: 'change' },
                    ]
                  }
                }
              })
              obj.region = val
              obj.desc = ''
              obj.name = ''
              obj.type = this.selectregion.type
              obj.isEnable = false
            }
          })
        } else {
          this.channelregion.map((item) => {
            if (item.cType == val) {
              this.selectregion = item
              this.$forceUpdate()
              this.arrlist = this.orderObject(this.selectregion.params)
              this.arrlist.map((item) => {
                for (var key in this.channelrow.config) {
                  if (item.showname == key) {
                    obj[item.showname] = this.channelrow.config[key]
                  }
                  if (item.required) {
                    if (item.type == 'string' || item.type == 'integer') {
                      obj1[item.showname] = [
                        { required: true, trigger: 'blur' },
                      ]
                    } else {
                      obj1[item.showname] = [
                        { required: true, trigger: 'change' },
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
        }
        // 读取acl列表,获取所属应用名称
        if (this.channelrow) {
          for (var key in this.channelrow.ACL) {
            obj.applicationtText = key ? key.substr(5) : ''
          }
        }
        this.addchannel = obj
        this.addchannel.region = val
        this.addrules = obj1
      },
      editorChannel(row) {
        console.log(row)
        this.channelrow = row
        this.resourceid = row.objectId
        this.channelForm = true
        this.channelupdated = '编辑'
        this.removeauto(row.cType)
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
      mqttMsg(e) {
        console.log(e)
      },
      subProTopic(row) {
        this.subdialog = true
        this.subdialogid = row.objectId
        this.channelname = row.objectId
        setTimeout(() => {
          subdialog = ace.edit('subdialog')
          subdialog.session.setMode('ace/mode/text') // 设置语言
          subdialog.setTheme('ace/theme/gob') // 设置主题
          subdialog.setReadOnly(true)
          subdialog.setOptions({
            enableBasicAutocompletion: false,
            enableSnippets: true,
            enableLiveAutocompletion: true, // 设置自动提示
          })
        })
        var info = {
          topic: 'log/channel/' + row.objectId,
          qos: 2,
        }
        var channeltopic = new RegExp('log/channel/' + row.objectId)
        var submessage = ''
        var _this = this
        _this.channeltopic = info.topic
        _this.$refs.mqtt.clientMqtt()
        Websocket.add_hook(channeltopic, function (Msg) {
          // 判断长度
          if (subdialog.session.getLength() >= 1000) {
            submessage = ''
          } else {
            submessage += _this.nowtime() + Msg + `\n`
          }
          subdialog.setValue(submessage)
          subdialog.gotoLine(subdialog.session.getLength())
        })
        // 订阅
        var text0 = JSON.stringify({ action: 'start_logger' })
        Websocket.subscribe(info, function (res) {
          if (res.result) {
            var sendInfo = {
              topic: 'channel/' + row.objectId,
              text: text0,
              retained: true,
              qos: 2,
            }
            Websocket.sendMessage(sendInfo)
            _this.subdialogtimer = window.setInterval(() => {
              Websocket.sendMessage(sendInfo)
            }, 600000)
          }
        })
      },
      stopsub(value) {
        var text0
        if (value == false) {
          // this.subaction = 'start'
          text0 = JSON.stringify({ action: 'stop_logger' })
        } else {
          // this.subaction = 'stop'
          text0 = JSON.stringify({ action: 'start_logger' })
        }
        var sendInfo = {
          topic: 'channel/' + this.subdialogid,
          text: text0,
          retained: true,
          qos: 2,
        }
        Websocket.sendMessage(sendInfo)
      },
      handleCloseSubdialog() {
        this.subdialog = false
        var text0 = JSON.stringify({ action: 'stop_logger' })
        var sendInfo = {
          topic: 'channel/' + this.subdialogid,
          text: text0,
          retained: true,
          qos: 2,
        }
        Websocket.sendMessage(sendInfo)
        window.clearInterval(this.subdialogtimer)
        this.subdialogtimer = null
      },
    },
  }
</script>
<style lang="scss" scoped>
  .resourcechannel {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;

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

    ::v-deep .row-bg {
      .el-form-item__content {
        width: 100%;
      }
    }

    ::v-deep .el-dialog__wrapper {
      margin-bottom: 20px;
    }
  }
</style>
