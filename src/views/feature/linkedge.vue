<template>
  <div class="addengine">
    <div class="addcontent">
      <el-card class="box-card">
        <el-form
          ref="formInline"
          label-width="75px"
          :model="formInline"
          :rules="formlinerule"
          size="mini"
        >
          <div class="form-block__title">
            {{ $translateTitle('rule.condtion') }}
            <div class="form-block__title-tips">
              {{ $translateTitle('rule.Processing') }}
            </div>
          </div>
          <el-row :gutter="24">
            <el-col :span="row1">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item
                    label="触发器"
                    label-width="70px"
                    prop="trigger"
                  >
                    <el-select
                      v-model="formInline.from.trigger"
                      placeholder="请选择触发器类型"
                      @change="tiggerAction"
                    >
                      <el-option
                        v-for="item in formInline.triggerSelect"
                        :key="item.value"
                        :disabled="item.disabled"
                        :label="item.value"
                        :value="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="formInline.from.trigger == 'device'"
                  v-loading="formInline.triggerSelect[0].loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  element-loading-spinner="el-icon-loading"
                  element-loading-text="查询产品列表"
                  :span="6"
                >
                  <el-form-item
                    label="产品信息"
                    label-width="80px"
                    prop="from.from.productid"
                  >
                    <el-select
                      v-model="formInline.from.from.productid"
                      placeholder="请选择产品"
                      @change="tiggerProduct"
                    >
                      <el-option
                        v-for="item in formInline.triggerSelect[0].children"
                        :key="item.objectId"
                        :label="item.name"
                        :value="item.objectId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="formInline.from.from.productid"
                  v-loading="formInline.triggerSelect[0].devaddr"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  element-loading-spinner="el-icon-loading"
                  element-loading-text="查询设备列表"
                  :span="6"
                >
                  <el-form-item
                    label="设备信息"
                    label-width="80px"
                    prop="from.from.devaddr"
                  >
                    <el-select
                      v-model="formInline.from.from.devaddr"
                      placeholder="请选择设备"
                      @change="tiggerDevice"
                    >
                      <el-option
                        v-for="item in formInline.device"
                        :key="item.devaddr"
                        :label="item.name"
                        :value="item.devaddr"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="formInline.from.from.devaddr"
                  v-loading="formInline.triggerSelect[0].device"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  element-loading-spinner="el-icon-loading"
                  element-loading-text="查询设备列表"
                  :span="6"
                >
                  <el-form-item
                    label="事件信息"
                    label-width="80px"
                    prop="from.method"
                  >
                    <el-select
                      v-model="formInline.from.method"
                      placeholder="请选择触发方式"
                      @change="setDefaultWhere"
                    >
                      <el-option
                        v-for="item in formInline.methodSelect"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-show="formInline.from.trigger == 'cron'" :span="6">
                  <el-form-item label="触发器" prop="trigger">
                    <el-input
                      v-model="formInline.from.cron"
                      placeholder="请输入Cron表达式"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row
                v-for="(domain, index) in formInline.from.where"
                v-show="formInline.from.trigger == 'device'"
                :key="domain.key"
                :gutter="24"
              >
                <el-divider content-position="left">
                  {{ '执行条件:' + Number(index + 1) }}
                </el-divider>

                <el-col
                  prop="trigger"
                  :span="formInline.from.method === 'mqttEvent' ? 20 : 6"
                >
                  <el-form-item label="属性" label-width="70px" prop="trigger">
                    <!--          如果选择的是属性的判断          -->
                    <el-select
                      v-if="formInline.from.method == 'properties'"
                      v-model="formInline.from.where[index].identifier"
                      placeholder="物模型属性"
                    >
                      <el-option
                        v-for="item in formInline.data.properties"
                        :key="item.lable + item.disable"
                        :disabled="computedDisable(item)"
                        :label="item.lable"
                        :value="item.value"
                      />
                    </el-select>
                    <!--          如果选择的是事件的判断          -->
                    <el-select
                      v-if="formInline.from.method == 'Event'"
                      v-model="formInline.from.where[index].identifier"
                      placeholder="物模型事件"
                    >
                      <el-option
                        v-for="item in formInline.data.events"
                        :key="item.lable + item.disable"
                        :disabled="computedDisable(item)"
                        :label="item.lable"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select
                      v-if="formInline.from.method == 'mqttEvent'"
                      v-model="formInline.from.where[index].identifier"
                      placeholder="mqtt事件"
                    >
                      <el-option
                        v-for="item in formInline.mqttEvent"
                        :key="item.lable"
                        :disabled="computedDisable(item)"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select
                      v-if="formInline.from.method == 'mqttConfig'"
                      v-model="formInline.from.where[index].identifier"
                      placeholder="mqtt属性"
                    >
                      <el-option
                        v-for="item in formInline.mqttConfig"
                        :key="item.label"
                        :disabled="computedDisable(item)"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="formInline.from.method !== 'mqttEvent'" :span="6">
                  <el-form-item label="条件" label-width="70px" prop="trigger">
                    <el-select
                      v-model="formInline.from.where[index].operator"
                      placeholder="请选择比较条件"
                    >
                      <el-option
                        v-for="item in formInline.erlOperator"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="formInline.from.method !== 'mqttEvent'" :span="6">
                  <el-form-item label="值" label-width="70px" prop="trigger">
                    <el-input
                      v-model="formInline.from.where[index].value"
                      placeholder="请输入比较参数"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="" label-width="0px">
                    <el-button
                      v-if="
                        index === 0 && formInline.from.method !== 'mqttEvent'
                      "
                      :disabled="calculateDisable == true"
                      type="info"
                      @click.prevent="addWhere(formInline.from.method)"
                    >
                      新增
                    </el-button>
                    <el-button
                      v-if="index === 0"
                      :disabled="calculateDisable == true"
                      type="success"
                      @click.native="generatorSql(formInline.from)"
                    >
                      生成sql
                    </el-button>
                    <el-button
                      v-if="index !== 0"
                      type="warning"
                      @click.prevent="
                        removeDomain(formInline.from.method, domain)
                      "
                    >
                      删除
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                v-show="formInline.from.method.length"
                label="执行动作"
                label-width="80px"
                prop="trigger"
              >
                <el-select
                  v-model="formInline.from.action"
                  placeholder="请选择执行动作"
                  style="width: 60%"
                >
                  <el-option
                    v-for="item in formInline.actionSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$translateTitle('rule.RuleSQL')"
                prop="enginesql"
              >
                <pre
                  id="editor1"
                  class="ace_editor"
                  style="min-height: 300px"
                ><el-input
                  v-model="formInline.enginesql"
                  class="ace_text-input"
                  type="textarea"
                /></pre>
              </el-form-item>
              <!--备注-->
              <el-form-item :label="$translateTitle('rule.rule Id')">
                <el-input
                  v-model="formInline.ruleId"
                  :readonly="title == '编辑'"
                  type="text"
                />
              </el-form-item>
              <el-form-item :label="$translateTitle('rule.Remarks')">
                <el-input v-model="formInline.remarks" type="text" />
              </el-form-item>
              <!--SQL测试-->
              <el-form-item :label="$translateTitle('rule.SQLtest')">
                <el-switch
                  v-model="formInline.sqltest"
                  active-color="#13ce66"
                  inactive-color="gray"
                  @change="getEditor2"
                />
                <el-popover
                  content="自定义模拟数据进行 SQL 命令测试，仅用于测试功能"
                  placement="top-start"
                  trigger="hover"
                  width="200"
                >
                  <i
                    slot="reference"
                    class="el-icon-question"
                    style="color: #71737d"
                  />
                </el-popover>
              </el-form-item>
              <!--其他信息-->
            </el-col>
            <el-col class="animated fadeInRightBig" :span="row2">
              <el-form-item
                v-if="formInline.sqltest == true"
                label="clientid"
                label-width="80px"
                prop="clientid"
                :rules="[
                  {
                    required: true,
                    message: 'clientid 不能为空',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input v-model="formInline.clientid" />
              </el-form-item>
              <el-form-item
                v-if="formInline.sqltest == true"
                label="username"
                label-width="80px"
                prop="username"
                :rules="[
                  {
                    required: true,
                    message: 'username 不能为空',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input v-model="formInline.username" />
              </el-form-item>
              <el-form-item
                v-if="formInline.sqltest == true"
                label="topic"
                label-width="80px"
                prop="topic"
                :rules="[
                  {
                    required: true,
                    message: 'topic 不能为空',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input v-model="formInline.topic" />
              </el-form-item>
              <el-form-item
                v-if="formInline.sqltest == true"
                label="qos"
                label-width="80px"
                prop="qos"
                :rules="[
                  { required: true, message: 'qos 不能为空', trigger: 'blur' },
                ]"
              >
                <el-input v-model.number="formInline.qos" />
              </el-form-item>
              <el-form-item
                v-if="formInline.sqltest == true"
                label="payload"
                label-width="80px"
                prop="payload"
                :rules="[
                  { required: true, message: '请填写payload', trigger: 'blur' },
                ]"
              >
                <pre
                  id="editor2"
                  class="ace_editor"
                  style="min-height: 100px"
                ></pre>
              </el-form-item>
              <el-form-item
                v-if="formInline.sqltest == true"
                label=" "
                label-width="80px"
              >
                <el-button
                  type="success"
                  @click.native="testRule('formInline')"
                >
                  {{ $translateTitle('rule.Test') }}
                </el-button>
                <el-input
                  v-model="formInline.payload"
                  style="visibility: hidden"
                  type="text"
                />
                <el-input
                  v-model="formInline.payload"
                  class="ace_text-input"
                  type="textarea"
                />
              </el-form-item>
              <el-form-item
                v-if="formInline.sqltest == true"
                :label="$translateTitle('rule.TestJie')"
              >
                <!--                <el-input-->
                <!--                  v-model="formInline.result"-->
                <!--                  :rows="4"-->
                <!--                  type="textarea"-->
                <!--                />-->
                <dgiot-editor
                  :key="formInline.result"
                  v-model="formInline.result"
                  :height="100"
                  :lang="'sql'"
                  :min-lines="100"
                  :readonly="true"
                  style="min-height: 100px"
                  :theme="'eclipse'"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!--响应动作-->
          <div class="tablebottom">
            <div class="form-block__title">
              <span style="color: rgb(255, 109, 109)">*</span>
              {{ $translateTitle('rule.ResponseAction') }}
              <div class="form-block__title-tips">
                {{ $translateTitle('rule.Processing') }}
              </div>
            </div>
            <div class="bottomtable" style="padding-left: 20px">
              <div class="tableaction">
                <el-table
                  :cell-style="{ 'text-align': 'center' }"
                  :data="actionData"
                  :header-cell-style="{ 'text-align': 'center' }"
                  style="width: 100%"
                >
                  <el-table-column :label="$translateTitle('rule.channel')">
                    <template #default="{ row }">
                      <span v-if="row.params.$resource">
                        {{ '关联资源:' + row.params.$resource }}
                      </span>
                      <span v-else />
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('rule.target_topic')"
                  >
                    <template #default="{ row }">
                      {{ row.params.target_topic }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="$translateTitle('rule.target_qos')">
                    <template #default="{ row }">
                      {{ row.params.target_qos }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('rule.payload_tmpl')"
                  >
                    <template #default="{ row }">
                      {{ row.params.payload_tmpl }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('developer.operation')"
                    width="180"
                  >
                    <template #default="{ row, $index }">
                      <el-button
                        size="mini"
                        type="warning"
                        @click="editAisle(row)"
                      >
                        {{ $translateTitle('button.edit') }}
                      </el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        @click="deleteOneData($index)"
                      >
                        {{ $translateTitle('button.delete') }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div>
                  <el-button
                    icon="el-icon-circle-plus-outline"
                    plain
                    size="small"
                    style="margin-top: 20px"
                    type="success"
                    @click="addresouce"
                  >
                    {{ $translateTitle('rule.Addto') }}
                  </el-button>
                </div>
              </div>
            </div>
            <div>
              <el-dialog
                :append-to-body="true"
                :close-on-click-modal="false"
                :title="$translateTitle('rule.ResponseAction')"
                top="10%"
                :visible.sync="dialogFormVisible"
                width="40%"
                @close="resetForm('params')"
              >
                <el-form
                  ref="params"
                  label-position="left"
                  label-width="140px"
                  :model="params"
                  :rules="paramsrules"
                >
                  <el-form-item prop="channel">
                    <span slot="label">
                      <span class="span-box">
                        <i class="icon-dd-schetit" />
                        <span>{{ $translateTitle('rule.channel') }}</span>
                        <el-tooltip
                          class="item"
                          content="重新发布消息到物联网通道"
                          effect="dark"
                          placement="top-start"
                        >
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </span>
                    <el-select v-model="params.channel" style="width: 100%">
                      <el-option
                        v-for="item in channellist"
                        :key="item.name"
                        :disabled="item.name != 'dgiot'"
                        :label="item.title.zh"
                        :value="item.title.zh"
                      >
                        <span style="float: left">
                          <i v-if="item.title">
                            {{ item.title.zh }}
                          </i>
                        </span>
                        <span style="float: right; color: #8492a6">
                          {{ item.description.zh }}
                        </span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label="$translateTitle('rule.resource')"
                    prop="resources"
                  >
                    <span slot="label">
                      <span class="span-box">
                        <i class="icon-dd-schetit" />
                        <span>{{ $translateTitle('rule.resource') }}</span>
                        <el-tooltip
                          class="item"
                          :content="$translateTitle('rule.resource')"
                          effect="dark"
                          placement="top-start"
                        >
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </span>
                    <el-select v-model="params.resources" style="width: 100%">
                      <el-option
                        v-for="item in resources"
                        :key="item.id"
                        :label="item.description"
                        :value="item.id"
                      >
                        <span style="float: left">
                          <i v-if="item.description">
                            {{ item.description }}
                          </i>
                        </span>
                        <span style="float: right; color: #8492a6">
                          {{ item.id }}
                        </span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$translateTitle('rule.target_qos')">
                    <span slot="label">
                      <span class="span-box">
                        <i class="icon-dd-schetit" />
                        <span>{{ $translateTitle('rule.target_qos') }}</span>
                        <el-tooltip
                          class="item"
                          content="重新发布消息时用的 QoS 级别, 设置为 -1 以使用原消息中的 QoS"
                          effect="dark"
                          placement="top-start"
                        >
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </span>
                    <el-select v-model="params.target_qos" style="width: 100%">
                      <el-option
                        v-for="item in params.target_qosSelect"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$translateTitle('rule.target_topic')">
                    <span slot="label">
                      <span class="span-box">
                        <i class="icon-dd-schetit" />
                        <span>{{ $translateTitle('rule.target_topic') }}</span>
                        <el-tooltip
                          class="item"
                          content="重新发布消息到哪个主题"
                          effect="dark"
                          placement="top-start"
                        >
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </span>
                    <el-input v-model="params.target_topic" />
                  </el-form-item>
                  <el-form-item :label="$translateTitle('rule.payload_tmpl')">
                    <span slot="label">
                      <span class="span-box">
                        <i class="icon-dd-schetit" />
                        <span>{{ $translateTitle('rule.payload_tmpl') }}</span>
                        <el-tooltip
                          class="item"
                          content="消息内容模板，支持变量"
                          effect="dark"
                          placement="top-start"
                        >
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </span>
                    <el-input
                      v-model="params.payload_tmpl"
                      :rows="2"
                      type="textarea"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      v-if="aisleRow.name"
                      @click="editFom('formInline')"
                    >
                      {{ $translateTitle('button.modify') }}
                    </el-button>
                    <el-button
                      v-else
                      type="primary"
                      @click="submitForm('params')"
                    >
                      {{ $translateTitle('button.create') }}
                    </el-button>
                    <el-button @click="dialogFormVisible = !dialogFormVisible">
                      {{ $translateTitle('button.cancel') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
            </div>
          </div>
          <el-form-item label-width="90">
            <el-button
              v-if="ruleId.length"
              type="success"
              @click="editrules(ruleId, 'formInline')"
            >
              {{ $translateTitle('button.modify') }}
            </el-button>
            <el-button
              v-else
              type="success"
              @click.native="addrules('formInline')"
            >
              {{ $translateTitle('button.create') }}
            </el-button>
            <el-button>{{ $translateTitle('button.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
  var editor1
  var editor2
  import {
    addRule,
    get_actions,
    get_resources,
    get_rule_id,
    postResource,
    put_rule_id,
  } from '@/api/Rules'
  import { sqlTpl } from '@/api/Rules'
  import provider from '@/api/Ace/index'
  import datalist from '@/views/CloudFunction/engine/datalist.js'
  import { queryProduct } from '@/api/Product'
  import { queryDevice } from '@/api/Device'

  export default {
    data() {
      return {
        calculateDisable: true,
        ruleId: this.$route.query.id || '',
        uid: this.$route.query.uid || '',
        ruleType: this.$route.query.type || '',
        resources: [],
        aisleRow: {},
        params: {
          name: '',
          payload_tmpl: '${payload}',
          target_qos: 0,
          target_qosSelect: [-1, 0, 1, 2],
          target_topic: 'thing/${productid}/${clientid}/post',
          $resource: '',
          resources: '',
          channel: '',
        },
        dialogVisible: false,
        resourceform: {
          objectId: '',
          region: 'data_resource',
          desc: '',
        },
        resourcerule: {
          objectId: [
            {
              required: true,
              message: '请填写通道编号',
              trigger: 'blur',
            },
          ],
          desc: [
            {
              required: true,
              message: '请填写通道描述',
              trigger: 'blur',
            },
          ],
        },
        row1: 24,
        row2: 0,
        dialogFormVisible: false,
        title: '',
        formInline: {
          data: {},
          mqttEvent: [
            { label: '消息投递', value: 'message_delivered' },
            { label: '消息确认', value: 'message_acked' },
            { label: '消息丢弃', value: 'message_dropped' },
            { label: '连接完成', value: 'client_connected' },
            { label: '连接断开', value: 'client_disconnected' },
            { label: '订阅', value: 'session_subscribed' },
            { label: '取消订阅', value: 'session_unsubscribed' },
          ], // mqtt事件
          mqttConfig: [
            { label: '消息目的 Client ID', value: 'clientid' },
            { label: '终端连接完成时间 (s)', value: 'connected_at' },
            { label: 'MQTT 消息 ID', value: 'id' },
            { label: '用户名', value: 'username' },
            { label: '客户端地址', value: 'peerhost' },
            { label: 'MQTT topic', value: 'topic' },
            { label: 'MQTT qos', value: 'qos' },
            { label: 'MQTT flags', value: 'flags' },
            { label: '事件触发时间 (ms)', value: 'timestamp' },
            {
              label: 'PUBLISH 消息到达 Broker 的时间 (ms)',
              value: 'publish_received_at',
            },
            { label: '事件触发节点', value: 'node' },
          ], // mqtt属性
          Event: [],
          triggerSelect: [
            {
              label: 'device',
              value: '设备触发',
              children: [],
              loading: false,
              device: false,
            },
          ], // 触发器下拉
          device: [
            {
              name: '全部设备',
              devaddr: '#',
            },
          ], // 设备列表
          sqlOperator: ['>', '>=', '<', '<=', '==', '!=', 'in'], // 基础sql运算符 https://www.cnblogs.com/nwgdk/p/9772312.html
          erlOperator: ['>', '>=', '<', '<=', '==', '=:=', '/=', '=/='], //ERLANG比较运算符  https://blog.csdn.net/u010164190/article/details/51005282
          value: '',
          actionSelect: [
            {
              label: '设备输出',
              value: 'device output',
            },
            {
              label: '规则输出',
              value: 'rule output',
            },
            {
              label: '函数输出',
              value: 'function output',
            },
            {
              label: '告警输出',
              value: 'Alarm output',
            },
          ],
          methodSelect: [
            {
              value: 'properties',
              label: '物模型属性触发',
            },
            {
              value: 'Event',
              label: '物模型事件触发',
            },
            {
              value: 'mqttConfig',
              label: 'mqtt属性触发',
              disable: true,
            },
            {
              value: 'mqttEvent',
              label: 'mqtt事件触发',
              disable: true,
            },
          ], // 触发方式
          property: [], // 属性触发的下拉

          user: '',
          region: '',
          enginesql:
            'SELECT\n' +
            '      payload.msg as msg,\n' +
            '      clientid,\n' +
            "      'productid' as productid\n" +
            'FROM\n' +
            '      "t/#"\n' +
            'WHERE\n' +
            "      msg = 'hello'",
          remarks: '',
          sqltest: false,
          clientid: 'c_swqx',
          username: 'u_swqx',
          qos: 1,
          topic: 't/a',
          payload: '',
          // ruleId: 'rule:929035',
          result: '',
          productid: '', // 产品id
          devaddr: '', // 设备地址
          select: {
            mqttConfig: [],
            thingConfig: [],
          },

          trigger: 'device', // 触发规则
          cron: '', // cron的值
          method: 'properties', // 触发方式
          from: {
            productid: '', // 产品id
            devaddr: '', // 设备地址
            select: {
              mqttConfig: [],
              thingConfig: [],
            },

            trigger: 'device', // 触发规则
            cron: '', // cron的值
            method: 'properties', // 触发方式
            from: {
              productid: '', // 产品id
              devaddr: '', // 设备地址
            },
            where: [
              {
                identifier: '', // 物模型
                operator: '', // 条件判断
                value: '', //比较参数
                config: 'clientid',
                event: 'message_delivered',
              },
            ],
            action: [], //执行动作
          },
          where: [
            {
              identifier: '', // 物模型
              operator: '', // 条件判断
              value: '', //比较参数
              config: 'clientid',
              event: 'message_delivered',
            },
          ],
          action: [], //执行动作
        },
        formlinerule: {
          region: [
            {
              required: true,
              message: '请选择触发事件',
              trigger: 'change',
            },
          ],
          'from.from.productid': [
            {
              required: true,
              message: '请选择产品',
              trigger: 'change',
            },
          ],
          'from.method': [
            {
              required: true,
              message: '请选择触发方式',
              trigger: 'change',
            },
          ],
          'from.from.devaddr': [
            {
              required: true,
              message: '请选择设备',
              trigger: 'change',
            },
          ],
          enginesql: [
            {
              required: true,
              message: '请填写规则SQL',
              trigger: 'blur',
            },
          ],
          trigger: [
            {
              required: true,
              message: '请选择触发规则',
              trigger: 'change',
            },
          ],
          method: [
            {
              required: true,
              message: '请选择触发方式',
              trigger: 'change',
            },
          ],
          'where.identifier': [
            {
              required: true,
              message: '请选择物模型',
              trigger: 'change',
            },
          ],
          'where.operator': [
            {
              required: true,
              message: '请选择物模型执行条件',
              trigger: 'change',
            },
          ],
          'where.value': [
            {
              required: true,
              message: '请输入比较参数',
              trigger: 'blue',
            },
          ],
        },
        actionData: [],
        form: {
          action: 'dgiot_resource',
          resource: '',
        },
        paramsrules: {
          channel: [
            {
              required: true,
              message: '请选择通道',
              trigger: 'change',
            },
          ],
          resources: [
            {
              required: true,
              message: '请选择关联资源',
              trigger: 'change',
            },
          ],
        },
        formrule: {
          action: [
            {
              required: true,
              message: '请选择动作',
              trigger: 'change',
            },
          ],
        },
        productid: '',
        resourcelist: [],
        channellist: [],
        ctype: '',
        originlist: datalist,
        client: [],
        sqlexample: `SELECT payload.msg as msg
                   FROM "t/#"
                   WHERE msg = 'hello'`,
        actionslist: [],
        allChannelstart: 0,
      }
    },
    watch: {
      'formInline.from.where': {
        handler(val, oldVal) {
          // https://www.emqx.io/docs/zh/v4.3/rule/rule-engine.html#sql-%E8%AF%AD%E5%8F%A5
          // 将已经选中了的物模型设置为disable
          if (this.formInline.from.from.devaddr == '')
            this.calculateDisable = true
          val.forEach((where) => {
            if (where.identifier == '') this.calculateDisable = true
            else this.calculateDisable = false

            if (this.formInline.data[this.formInline.from.method])
              this.formInline.data[this.formInline.from.method].forEach(
                (data) => {
                  data.disabled = false
                  if (where.identifier == data.value) {
                    data.disabled = true
                  }
                }
              )
          })
        },
        deep: true,
      },
    },
    mounted() {
      if (this.$route.query.type && this.$route.query.uid) {
        this.queryRule(
          `rule:${this.$route.query.type}_${this.$route.query.uid}`
        )
      }
      this.$nextTick(() => {
        this.tiggerAction('device')
        editor1 = ace.edit('editor1')
        if (this.ruleId) {
          this.queryRule(this.ruleId)
        }
        this.title = this.$route.query.title
        this.productid = this.$route.query.productid
        editor1.session.setMode('ace/mode/sql') // 设置语言
        editor1.setTheme('ace/theme/eclipse') // 设置主题
        editor1.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true, // 设置自动提示
        })
        editor1.setValue(this.formInline.enginesql)
        // this.formInline.topic = "thing/" + this.$route.query.productid;
        // this.client = this.originlist[0].columns;
        // this.sqlexample = this.originlist[0].sql_example;
      })
    },
    methods: {
      // 设置选中项不可重复选择
      computedDisable(item) {
        let flag = false
        this.formInline.from.where.forEach((where) => {
          if (where.identifier == item.value) {
            flag = true
          }
        })
        return flag
      },
      setDefaultWhere() {
        this.formInline.from.where = [
          {
            identifier: '', // 物模型
            operator: '', // 条件判断
            value: '', //比较参数
            config: '',
            event: '',
          },
        ]
        console.log('toggle', this.formInline.from.method)
      },

      async addWhere(type) {
        console.log(type)
        if (
          this.formInline.data[this.formInline.from.method].length <=
          this.formInline.from.where.length
        ) {
          this.$message({
            message: `最多只能添加${
              this.formInline.data[this.formInline.from.method].length
            }个比较参数`,
            type: 'warning',
          })
          return
        }
        // // 将已经选中了的物模型设置为disable
        await this.formInline.from.where.push({
          identifier: '', // 物模型
          operator: '', // 条件判断
          value: '', //比较参数
        })
        // 添加执行条件的限制
        // if (this.formInline.from.where.length > this.formInline.property.length)
      },
      removeDomain(type, item) {
        var index = this.formInline.from.where.indexOf(item)
        if (index !== -1) {
          this.formInline.from.where.splice(index, 1)
        }
      },
      /**
       * 查询规则
       * @param {String} ruleId 规则id
       *@docs https://www.emqx.io/docs/zh/v4.3/rule/rule-engine.html#sql-%E8%AF%AD%E5%8F%A5
       * @param tpl
       */
      generatorSql(from) {
        // topo 过滤&&验证重复的执行条件
        console.error(from)
        // this.formInline.sqltest = true
        // this.getEditor2(true)
        const setValue =
          from.devaddr == '#'
            ? 'SELECT\n' +
              '      payload.msg as msg,\n' +
              '      clientid,\n' +
              "      'productid' as productid\n" +
              'FROM\n' +
              `      "thing/${from.productid}/#"\n` +
              'WHERE\n' +
              "      msg = 'hello'"
            : 'SELECT\n' +
              '      payload.msg as msg,\n' +
              '      clientid,\n' +
              "      'productid' as productid\n" +
              'FROM\n' +
              `      "thing/${from.productid}/${from.devaddr}"\n` +
              'WHERE\n' +
              "      msg = 'hello'"
        // 判断是否校验成功
        switch (from.method) {
          case 'device':
            from.select.payload = from.where.map((item) => {
              return item.identifier
            })
            break
          case 'properties':
            from.select.payload = from.where.map((item) => {
              return item.identifier
            })
            break
          case 'mqttConfig':
            from.select.mqttConfig = from.where.map((item) => {
              return item.identifier
            })
            break
          case 'mqttEvent':
            from.select.thingConfig = from.where.map((item) => {
              return item.identifier
            })
            // 将mqtt event 事件 处理为from 语句
            break
        }
        // 过滤掉 select 为空的物模型
        // from.where = from.where.filter((item) => {
        //   return item.identifier != ''
        // })
        this.$refs.formInline.validate(async (valid) => {
          if (valid) {
            try {
              const loading = this.$baseLoading(1)
              dgiotlogger.log('处理后的form表单', from)
              dgiotlogger.log('处理后的form表单select参数', from.select)
              const { template = setValue } = await sqlTpl(from)
              this.formInline.enginesql = template
              await editor1.setValue(template)
              dgiotlogger.log(template)
              loading.close()
            } catch (error) {
              console.log(error)
              this.$baseMessage(
                this.$translateTitle('alert.Data request error') + `${error}`,
                'error',
                'dgiot-hey-message-error'
              )
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /*
       * @dgiot-fe
       * 根据下来触发器查询产品
       *
       * */
      async tiggerAction(v) {
        await console.log(v)
        if (v === 'device') await this.getProduct()
      },
      async getProduct() {
        this.formInline.triggerSelect[0].loading = true
        try {
          const queryPayload = {
            // excludeKeys: 'config',
            order: '-updatedAt',
            count: 'objectId',
          }
          const { results = [] } = await queryProduct(queryPayload)
          this.formInline.triggerSelect[0].loading = false
          this.formInline.triggerSelect[0].children = results
        } catch (e) {
          this.formInline.triggerSelect[0].loading = false
        }
      },
      /**
       * @dgiot-fe
       * 查询产品下的设备
       * */
      async tiggerProduct(v) {
        this.formInline.property = []
        this.formInline.from.identifier = ''
        this.formInline.from.devaddr = ''
        this.formInline.from.where = [
          {
            identifier: '', // 物模型
            operator: '', // 条件判断
            value: '', //比较参数
          },
        ]
        var property = []
        var event = []
        var Thing = []
        // 选择产品时的物模型
        this.formInline.triggerSelect[0].children.forEach((product) => {
          if (product.objectId == v) Thing = product.thing || []
        })
        dgiotlogger.log('Thing', Thing)
        for (var lable in Thing) {
          this.formInline.data[lable] = []
          console.error(Thing[lable])
          for (let j in Thing[lable]) {
            this.formInline.data[lable].push({
              lable: Thing[lable][j].name,
              value: Thing[lable][j].identifier,
              data: Thing[lable][j],
              disabled: false,
            })
          }
          // // 将对象形式的物模型转换为数组形式
          // this.formInline.property.push({
          //   lable: property[lable].name,
          //   value: property[lable].identifier,
          //   data: property[lable],
          // })
        }
        dgiotlogger.log(this.formInline.property, 'line 928 property')
        dgiotlogger.log(this.formInline.data, 'line 1160 linkedge')
        this.formInline.triggerSelect[0].device = true
        await console.log(v)
        const queryPayload = {
          // excludeKeys: 'config',
          order: '-updatedAt',
          count: 'objectId',
          where: {
            product: v,
          },
        }
        const { results = [] } = await queryDevice(queryPayload)
        dgiotlogger.info('results', results)
        this.formInline.device = results
        this.formInline.device.unshift({
          name: '全部设备',
          devaddr: '#',
        })
        this.formInline.triggerSelect[0].device = false
        // if (v === 'device') await this.getProduct()
      },
      // 规则选择
      selectRegion(val) {
        this.originlist.map((item) => {
          if (item.event == val) {
            this.client = item.columns
            this.sqlexample = item.sql_example
          }
        })
      },
      // 设置规则sql
      async tiggerDevice(v) {
        dgiotlogger.log(v)
        // const setValue =
        //   v == '#'
        //     ? 'SELECT\n' +
        //       '      payload.msg as msg,\n' +
        //       '      clientid,\n' +
        //       "      'productid' as productid\n" +
        //       '    FROM\n' +
        //       `      "thing/${this.formInline.from.productid}/#"\n` +
        //       '    WHERE\n' +
        //       "      msg = 'hello'"
        //     : 'SELECT\n' +
        //       '      payload.msg as msg,\n' +
        //       '      clientid,\n' +
        //       "      'productid' as productid\n" +
        //       '    FROM\n' +
        //       `      "thing/${this.formInline.from.productid}/${v}"\n` +
        //       '    WHERE\n' +
        //       "      msg = 'hello'"
        // await editor1.setValue(setValue)
        // editor2.setValue(setValue)
      },
      // 布局调整
      getEditor2(val) {
        if (val == true) {
          this.row1 = 16
          this.row2 = 8
          this.$nextTick(() => {
            editor2 = ace.edit('editor2')
            editor2 = ace.edit('editor2')
            editor2.session.setMode('ace/mode/json') // 设置语言
            editor2.setTheme('ace/theme/eclipse') // 设置主题
            editor2.setOptions({
              enableBasicAutocompletion: true,
              enableSnippets: true,
              enableLiveAutocompletion: true, // 设置自动提示
            })
            editor2.setValue(`{"msg":"hello"}`)
            window.editor2 = editor2
          })
        } else {
          this.row1 = 24
          this.row2 = 0
        }
      },
      async queryRule(ruleId) {
        try {
          const {
            data = {
              id: ruleId,
              actions: [],
              description: '',
              rawsql:
                'SELECT\n' +
                '      payload.msg as msg,\n' +
                '      clientid,\n' +
                "      'productid' as productid\n" +
                'FROM\n' +
                '      "t/#"\n' +
                'WHERE\n' +
                "      msg = 'hello'",
            },
          } = await get_rule_id(ruleId)
          dgiotlogger.log(data)
          // this.formInline.username = data.ctx
          this.actionData = data.actions
          this.formInline.enginesql = data.rawsql
          editor1.setValue(this.formInline.enginesql)
          this.formInline.ruleId = data.id
          this.formInline.remarks = data.description
          editor1.setValue(data.rawsql)
        } catch (error) {
          dgiotlogger.error(error)
          this.formInline.ruleId = ruleId
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.relationChannel(this.params)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      editFom(formName) {
        console.log(this.params)
        this.aisleRow.name = this.params.name
        this.aisleRow.params.payload_tmpl = this.params.payload_tmpl
        this.aisleRow.params.target_qos = this.params.target_qos
        this.aisleRow.params.target_topic = this.params.target_topic
        this.aisleRow.params.$resource = this.params.$resource
        this.aisleRow.params.resources = this.params.resources
        this.aisleRow.params.channel = this.params.channel
        this.dialogFormVisible = !this.dialogFormVisible
        this.aisleRow = {}
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.aisleRow = {}
      },
      relationChannel(row) {
        console.log(row)
        this.actionData.push({
          name: 'dgiot',
          params: {
            $resource: row.resources,
            target_topic: row.target_topic,
            target_qos: row.target_qos,
            payload_tmpl: row.payload_tmpl,
            channel: this.params.channel,
          },
          fallbacks: [],
        })
        console.log(this.actionData, 'this.actionData')
        this.dialogFormVisible = !this.dialogFormVisible
      },
      async _get_actions() {
        const { data } = await get_actions()
        this.channellist = data
      },
      async _get_resources() {
        const { data } = await get_resources()
        this.resources = data
      },
      // showAllChannel() {
      //   const params = {
      //     count: 'objectId',
      //     limit: this.allChannelstart,
      //     where: {},
      //   }
      //   this.$query_object('Channel', params).then((res) => {
      //     this.allChanneltotal = res.count
      //     this.channellist = res.results
      //   })
      // },
      testRule(forName) {
        this.formInline.result = '{}'
        this.formInline.payload = editor2.getValue()
        this.formInline.enginesql = editor1.getValue()
        this.$refs[forName].validate((valid) => {
          if (valid) {
            var regex = /from[^"]+?"([^"]+)"/im
            var ctx = {
              clientid: this.formInline.clientid,
              payload: editor2.getValue(),
              qos: this.formInline.qos,
              topic: this.formInline.topic,
              username: this.formInline.username,
            }
            console.log(editor1.getValue(), 'rawsql')
            window.editor1 = editor1
            window.editor1Value = editor1.getValue()
            console.log(editor1, editor1.getValue().match(regex)[1], 'for')
            const params = {
              actions: this.actionData,
              ctx: ctx,
              description: this.formInline.remarks,
              for: editor1.getValue().match(regex)[1],
              // for: 'thing/test/#',
              name: this.formInline.username,
              rawsql: editor1.getValue(),
              test: 'true',
            }
            addRule(params)
              .then((response) => {
                console.log('response', response)
                const { code, message = '', data = {} } = response
                if (code == 0) {
                  this.formInline.result = JSON.stringify(data, null, 2)
                  console.log(
                    '     this.formInline.result ',
                    this.formInline.result
                  )
                  this.$message({
                    message: 'sql测试成功',
                    type: 'success',
                  })
                } else {
                  this.formInline.result = JSON.stringify(response, null, 2)
                  this.$message({
                    message: 'sql测试失败' + message,
                    type: 'error',
                  })
                }
              })
              .catch((error) => {
                this.$message({
                  message: 'sql测试失败，原因' + error,
                  type: 'error',
                })
                console.log(error)
              })
          }
        })
      },
      async editrules(ruleid, forName) {
        var ctx = {
          clientid: this.formInline.clientid,
          payload: editor2.getValue(),
          qos: this.formInline.qos,
          topic: this.formInline.topic,
          username: this.formInline.username,
        }
        const params = {
          actions: this.actionData,
          ctx: ctx,
          description: this.formInline.remarks,
          for: '["t/#"]',
          rawsql: editor1.getValue(),
        }
        const res = await put_rule_id(ruleid, params)
        console.log(ruleid, forName, res)
        this.$message('修改成功')
        this.$router.push({
          path: '/rules_engine/engine',
        })
      },
      addrules(forName) {
        this.formInline.payload = editor2.getValue()
        this.formInline.enginesql = editor1.getValue()
        this.$refs[forName].validate((valid) => {
          if (valid) {
            if (this.actionData.length == 0) {
              this.$message('动作不能为空')
              return
            }
            var ctx = {
              clientid: this.formInline.clientid,
              payload: editor2.getValue(),
              qos: this.formInline.qos,
              topic: this.formInline.topic,
              username: this.formInline.username,
            }
            const params = {
              actions: this.actionData,
              ctx: ctx,
              description: this.formInline.remarks,
              for: '["t/#"]',
              rawsql: editor1.getValue(),
            }

            if (this.$route.query.type && this.$route.query.uid) {
              // params.id = `rule:${this.ruleType}_${this.productid}_${this.uid}`
              // rule:Notification_start_ProductId_告警id
              // rule:Notification_stop_ProductId_告警id
              params.id = `rule:${this.$route.query.type}_${this.$route.query.uid}`
            }
            // const params = {
            //   rawsql:
            //     'SELECT\n  payload.msg as msg\nFROM\n  "t/#"\nWHERE\n  msg = \'hello\'',
            //   actions: [
            //     {
            //       name: 'dgiot',
            //       params: {
            //         target_topic: 'thing/${productid}/${clientid}/post',
            //         target_qos: 0,
            //         payload_tmpl: '${payload}',
            //         $resource: 'resource:057108',
            //       },
            //       fallbacks: [],
            //     },
            //   ],
            //   description: '',
            //   ctx: {
            //     clientid: 'c_emqx',
            //     username: 'u_emqx',
            //     topic: 't/a',
            //     qos: 1,
            //     payload: '{"msg":"hello"}',
            //   },
            //   id: 'rule:955894',
            // }
            addRule(params)
              .then((resultes) => {
                console.log(resultes)
                if (resultes) {
                  this.$message('创建成功')
                  this.$router.push({
                    path: '/rules_engine/engine',
                  })
                }
              })
              .catch((e) => {
                console.log(e)
                this.$message.error(e.error)
              })
          } else {
            this.$message('有必填项未填写')
          }
        })
      },
      // 初始化resource通道
      addresouce() {
        console.log(this.aisleRow)
        this._get_actions()
        this._get_resources()
        if (this.aisleRow.name) {
          this.params = {
            name: this.aisleRow.name,
            payload_tmpl: this.aisleRow.params.payload_tmpl,
            target_qos: this.aisleRow.params.target_qos,
            target_qosSelect: [-1, 0, 1, 2],
            target_topic: this.aisleRow.params.target_topic,
            $resource: this.aisleRow.params.$resource,
            resources: this.aisleRow.params.$resource,
            channel: this.aisleRow.params.channel,
          }
        }
        this.dialogFormVisible = true
      },
      addRes(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            postResource(
              { channel: this.resourceform.objectId },
              this.resourceform.desc,
              '',
              'data_resource'
            ).then((response) => {
              if (response) {
                this.$message('创建成功')
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                // getResource().then(response=>{
                //   if(response){
                //       this.resourcelist = response;
                //   }
                // }).catch(error=>{
                //   this.$message(error)
                // })
              }
            })
          } else {
            this.$message.error('error submit!!')
            return false
          }
        })
      },
      // 删除通道关联
      deleteOneData(index) {
        this.actionData.splice(index, 1)
      },
      // 编辑通道关联
      editAisle(row) {
        this.aisleRow = row
        this.addresouce()
      },
    },
  }
</script>
<style lang="scss" scoped>
  .addengine {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #f6f7fb;

    .addenheader {
      padding-bottom: 10px;

      ::v-deep .el-breadcrumb {
        font-size: 20px;
      }
    }

    .addcontent {
      color: #71737d !important;

      ::v-deep .form-block__title {
        padding-left: 10px;
        margin-bottom: 30px;
        border-left: 4px solid #34c388;

        .form-block__title-tips {
          display: inline-block;
          margin-left: 4px;
          font-size: 12px;
          color: #71737d;
        }
      }

      ::v-deep .el-row {
        margin-bottom: 20px;
        //border-bottom: 1px solid #666666;
      }

      ::v-deep .tablebottom {
        box-sizing: border-box;
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid #666666;
      }

      ::v-deep .el-select {
        width: 100%;
      }

      ::v-deep .show-guess {
        margin-top: 4px;
        line-height: 1.4;

        p {
          margin-top: 6px;
          margin-bottom: 4px;
          font-size: 13px;
          font-weight: 400;
          color: #71737d;
        }

        .code {
          padding: 6px;
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 1.4;
          background-color: hsla(0, 0%, 87%, 0.8);
          border-radius: 4px;
        }
      }
    }

    ::v-deep .el-dialog__footer {
      padding-bottom: 40px;
    }

    .sql-tips {
      width: 100vh;
      max-height: 480px;
      padding: 20px;
      font-size: 15px;
      color: #71737d;
      border: 4px dashed #d8d8d8;
      border-radius: 4px;
    }

    .code {
      padding: 6px;
      margin-bottom: 12px;
      line-height: 1.4;
      background: hsla(0, 0%, 87.5%, 0.8);
      border-radius: 4px;
    }

    // ::v-deep .el-dialog__body{
    //   ::v-deep .el-input{
    //     width:200px;
    //   }
    // }
  }
</style>
