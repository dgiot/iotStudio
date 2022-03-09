<template>
  <div class="addengine">
    <div class="addcontent">
      <el-card class="box-card">
        <el-form
          ref="formInline"
          label-width="px"
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
          <el-row :gutter="20">
            <el-col :span="row1">
              <el-row :gutter="24">
                <el-col :span="4">
                  <el-form-item label="触发器" prop="trigger">
                    <el-select
                      v-model="linkedge.form.trigger"
                      placeholder="请选择触发器类型"
                      @change="tiggerAction"
                    >
                      <el-option
                        v-for="item in linkedge.trigger"
                        :key="item.value"
                        :disabled="item.disabled"
                        :label="item.value"
                        :value="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="linkedge.form.trigger == 'device'"
                  v-loading="linkedge.trigger[0].loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  element-loading-spinner="el-icon-loading"
                  element-loading-text="查询产品列表"
                  :span="4"
                >
                  <el-form-item label="产品信息" prop="form.productid">
                    <el-select
                      v-model="linkedge.form.productid"
                      placeholder="请选择产品"
                      @change="tiggerProduct"
                    >
                      <el-option
                        v-for="item in linkedge.trigger[0].children"
                        :key="item.objectId"
                        :label="item.name"
                        :value="item.objectId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  v-show="linkedge.form.productid"
                  v-loading="linkedge.trigger[0].devaddr"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  element-loading-spinner="el-icon-loading"
                  element-loading-text="查询设备列表"
                  :span="4"
                >
                  <el-form-item label="触发器" prop="trigger">
                    <el-select
                      v-model="linkedge.form.devaddr"
                      placeholder="请选择设备"
                      @change="tiggerDevice"
                    >
                      <el-option
                        v-for="item in linkedge.device"
                        :key="item.devaddr"
                        :label="item.name"
                        :value="item.devaddr"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  v-if="linkedge.form.devaddr"
                  v-loading="linkedge.trigger[0].device"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  element-loading-spinner="el-icon-loading"
                  element-loading-text="查询设备列表"
                  :span="4"
                >
                  <el-form-item label="触发器" prop="trigger">
                    <el-select
                      v-model="linkedge.form.method"
                      placeholder="请选择触发方式"
                      @change="setDefaultWhere"
                    >
                      <el-option
                        v-for="item in linkedge.method"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-show="linkedge.form.trigger == 'cron'" :span="4">
                  <el-form-item label="触发器" prop="trigger">
                    <el-input
                      v-model="linkedge.form.cron"
                      placeholder="请输入Cron表达式"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                v-for="(domain, index) in linkedge.form.where"
                v-show="linkedge.form.method.length"
                :key="domain.key"
                :label="'执行条件' + Number(index + 1)"
                prop="trigger"
              >
                <el-row :gutter="24">
                  <el-col :span="4">
                    <el-select
                      v-if="linkedge.form.method == 'property'"
                      v-model="linkedge.form.where[index].identifier"
                      placeholder="请选择执行条件"
                    >
                      <el-option
                        v-for="item in linkedge.property"
                        :key="item.lable"
                        :label="item.lable"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select
                      v-if="linkedge.form.method == 'mqttEvent'"
                      v-model="linkedge.form.where[index].Event"
                      placeholder="mqtt事件"
                    >
                      <el-option
                        v-for="item in linkedge.mqttEvent"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select
                      v-if="linkedge.form.method == 'mqttConfig'"
                      :key="linkedge.form.method"
                      v-model="linkedge.form.where[index].config"
                      placeholder="mqtt属性"
                    >
                      <el-option
                        v-for="item in linkedge.mqttConfig"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-col>

                  <el-col :span="4">
                    <el-select
                      v-model="linkedge.form.where[index].operator"
                      placeholder="请选择比较条件"
                    >
                      <el-option
                        v-for="item in linkedge.erlOperator"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="4">
                    <el-input
                      v-model="linkedge.form.where[index].value"
                      placeholder="请输入比较参数"
                    />
                  </el-col>
                  <el-col v-show="index === 0" :span="4">
                    <el-button type="success" @click.prevent="addWhere">
                      新增
                    </el-button>
                  </el-col>
                  <el-col v-show="index !== 0" :span="4">
                    <el-button
                      type="warning"
                      @click.prevent="removeDomain(domain)"
                    >
                      删除
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item
                v-show="linkedge.form.method.length"
                label="执行动作"
                prop="trigger"
              >
                <el-select
                  v-model="linkedge.form.action"
                  placeholder="请选择执行动作"
                  style="width: 60%"
                >
                  <el-option
                    v-for="item in linkedge.action"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-button
                  type="success"
                  @click.native="generatorSql(linkedge.form)"
                >
                  生成sql
                </el-button>
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

            <!--中间间隔-->
            <el-col :span="4" />
            <el-col class="animated fadeInRightBig" :span="row2">
              <el-form-item
                v-show="formInline.sqltest == true"
                label="clientid"
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
                v-show="formInline.sqltest == true"
                label="username"
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
                v-show="formInline.sqltest == true"
                label="topic"
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
                prop="qos"
                :rules="[
                  { required: true, message: 'qos 不能为空', trigger: 'blur' },
                ]"
              >
                <el-input v-model.number="formInline.qos" />
              </el-form-item>
              <el-form-item
                v-show="formInline.sqltest == true"
                label="payload"
                prop="payload"
                :rules="[
                  { required: true, message: '请填写payload', trigger: 'blur' },
                ]"
              >
                <el-input
                  v-model="formInline.payload"
                  style="visibility: hidden"
                  type="text"
                />
                <pre
                  id="editor2"
                  class="ace_editor"
                  style="min-height: 300px"
                ><el-input
                  v-model="formInline.payload"
                  class="ace_text-input"
                  type="textarea"
                /></pre>
              </el-form-item>
              <el-form-item v-show="formInline.sqltest == true" label=" ">
                <el-button
                  type="success"
                  @click.native="testRule('formInline')"
                >
                  {{ $translateTitle('rule.Test') }}
                </el-button>
              </el-form-item>
              <el-form-item
                v-show="formInline.sqltest == true"
                :label="$translateTitle('rule.TestJie')"
              >
                <el-input
                  v-model="formInline.result"
                  :rows="4"
                  type="textarea"
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
        linkedge: {
          mqttEvent: [
            { label: '消息投递', value: 'message_delivered' },
            { label: '消息确认', value: 'message_acked' },
            { label: '消息丢弃', value: 'message_dropped' },
            { label: '连接完成', value: 'client_connected' },
            { label: '连接断开', value: 'client_disconnected' },
            { label: '订阅', value: 'session_subscribed' },
            { label: '取消订阅', value: 'session_unsubscribed' },
          ],
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
          ],
          trigger: [
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
          form: {
            productid: '', // 产品id
            devaddr: '', // 设备地址
            select: {
              mqttConfig: [],
              thingConfig: [],
            },

            trigger: 'device', // 触发规则
            cron: '', // cron的值
            method: 'property', // 触发方式
            from: {},
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
          }, // 提交到数据库中你的值
          action: [
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
          method: [
            {
              value: 'property',
              label: '物模型属性触发',
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
          options: [
            {
              value: '选项1',
              label: '黄金糕',
            },
          ],
        },
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
          user: '',
          region: '',
          enginesql:
            'SELECT\n' +
            '      payload.msg as msg,\n' +
            '      clientid,\n' +
            "      'productid' as productid\n" +
            '    FROM\n' +
            '      "t/#"\n' +
            '    WHERE\n' +
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
          method: 'property', // 触发方式
          from: {},
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
          'form.productid': [
            {
              required: true,
              message: '请选择产品',
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
          enginesql: [
            {
              required: true,
              message: '请填写规则SQL',
              trigger: 'blur',
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
        sqlexample: `SELECT
        payload.msg as msg
      FROM
        "t/#"
      WHERE
        msg = 'hello'`,
        actionslist: [],
        allChannelstart: 0,
      }
    },
    mounted() {
      if (this.$route.query.type && this.$route.query.uid) {
        this.queryRule(
          `rule:${this.$route.query.type}_${this.$route.query.uid}`
        )
      }
      this.$nextTick(() => {
        this.tiggerAction('device')
        editor2 = ace.edit('editor2')
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
        editor2 = ace.edit('editor2')
        editor2.session.setMode('ace/mode/json') // 设置语言
        editor2.setTheme('ace/theme/eclipse') // 设置主题
        editor2.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true, // 设置自动提示
        })
        editor2.setValue(`{"msg":"hello"}`)
        // this.formInline.topic = "thing/" + this.$route.query.productid;
        // this.client = this.originlist[0].columns;
        // this.sqlexample = this.originlist[0].sql_example;
      })
    },
    methods: {
      setDefaultWhere() {
        this.linkedge.form.where = [
          {
            identifier: '', // 物模型
            operator: '', // 条件判断
            value: '', //比较参数
            config: 'clientid',
            event: 'message_delivered',
          },
        ]
      },

      async addWhere() {
        await this.linkedge.form.where.push({
          identifier: '', // 物模型
          operator: '', // 条件判断
          value: '', //比较参数
          config: 'clientid',
          event: 'message_delivered',
        })
        // 添加执行条件的限制
        // if (this.linkedge.form.where.length > this.linkedge.property.length)
      },
      removeDomain(item) {
        var index = this.linkedge.form.where.indexOf(item)
        if (index !== -1) {
          this.linkedge.form.where.splice(index, 1)
        }
      },
      generatorSql(form) {
        this.formInline.sqltest = true
        this.getEditor2(true)
        const setValue =
          form.devaddr == '#'
            ? 'SELECT\n' +
              '      payload.msg as msg,\n' +
              '      clientid,\n' +
              "      'productid' as productid\n" +
              '    FROM\n' +
              `      "thing/${form.productid}/#"\n` +
              '    WHERE\n' +
              "      msg = 'hello'"
            : 'SELECT\n' +
              '      payload.msg as msg,\n' +
              '      clientid,\n' +
              "      'productid' as productid\n" +
              '    FROM\n' +
              `      "thing/${form.productid}/${form.devaddr}"\n` +
              '    WHERE\n' +
              "      msg = 'hello'"
        console.log(form)
        // 判断是否校验成功
        switch (form.method) {
          case 'device':
            form.select.payload = form.where.map((item) => {
              return item.identifier
            })
            break
          case 'property':
            form.select.payload = form.where.map((item) => {
              return item.identifier
            })
            break
          case 'mqttConfig':
            this.linkedge.form.select.mqttConfig = form.where.map((item) => {
              return item.config
            })
            break
          case 'mqttEvent':
            form.select.thingConfig = form.where.map((item) => {
              return item.event
            })
            alert('mqtt')
            break
        }
        this.$refs.formInline.validate(async (valid) => {
          if (valid) {
            try {
              const loading = this.$baseLoading(1)
              dgiotlogger.log('处理后的form表单', form)
              dgiotlogger.log('处理后的form表单select参数', form.select)
              const { template = setValue } = await sqlTpl(form)
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
        this.linkedge.trigger[0].loading = true
        try {
          const queryPayload = {
            // excludeKeys: 'config',
            order: '-updatedAt',
            count: 'objectId',
          }
          const { results = [] } = await queryProduct(queryPayload)
          this.linkedge.trigger[0].loading = false
          this.linkedge.trigger[0].children = results
        } catch (e) {
          this.linkedge.trigger[0].loading = false
        }
      },
      /**
       * @dgiot-fe
       * 查询产品下的设备
       * */
      async tiggerProduct(v) {
        this.linkedge.property = []
        this.linkedge.form.identifier = ''
        this.linkedge.form.devaddr = ''
        this.linkedge.form.where = [
          {
            identifier: '', // 物模型
            operator: '', // 条件判断
            value: '', //比较参数
          },
        ]
        var property = []
        // 选择产品时的物模型
        this.linkedge.trigger[0].children.forEach((product) => {
          if (product.objectId == v) {
            console.log(product)
            // return (product.objectId = v)
            property = product?.thing?.properties || []
          }
        })
        // this.linkedge.property.unshift({ value: '全部属性', lable: 'all' })
        // 循环为key value 的形式
        dgiotlogger.log(property, '919 line')
        // this.linkedge.property.forEach((e) => {
        //   dgiotlogger.log(e, 'line 920 property')
        // })
        for (var lable in property) {
          dgiotlogger.log(lable, property[lable], 'line 923 property')
          // 将对象形式的物模型转换为数组形式
          this.linkedge.property.push({
            lable: property[lable].name,
            value: property[lable].identifier,
            data: property[lable],
          })
        }
        dgiotlogger.log(this.linkedge.property, 'line 928 property')
        this.linkedge.trigger[0].device = true
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
        this.linkedge.device = results
        this.linkedge.device.unshift({
          name: '全部设备',
          devaddr: '#',
        })
        this.linkedge.trigger[0].device = false
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
        //       `      "thing/${this.linkedge.form.productid}/#"\n` +
        //       '    WHERE\n' +
        //       "      msg = 'hello'"
        //     : 'SELECT\n' +
        //       '      payload.msg as msg,\n' +
        //       '      clientid,\n' +
        //       "      'productid' as productid\n" +
        //       '    FROM\n' +
        //       `      "thing/${this.linkedge.form.productid}/${v}"\n` +
        //       '    WHERE\n' +
        //       "      msg = 'hello'"
        // await editor1.setValue(setValue)
        // editor2.setValue(setValue)
      },
      // 布局调整
      getEditor2(val) {
        if (val == true) {
          this.row1 = 12
          this.row2 = 12
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
                '    FROM\n' +
                '      "t/#"\n' +
                '    WHERE\n' +
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
        this.formInline.result = ''
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
            const params = {
              actions: this.actionData,
              ctx: ctx,
              description: this.formInline.remarks,
              for: editor1.getValue().match(regex)[1],
              name: this.formInline.username,
              rawsql: editor1.getValue(),
              test: 'true',
            }
            addRule(params)
              .then((response) => {
                console.log('response', response)
                const { code } = response
                if (code == 0) {
                  this.formInline.result = response.data.msg
                  console.log(
                    '     this.formInline.result ',
                    this.formInline.result
                  )
                } else {
                  this.$message.error('SQL Not Match')
                  console.log('error response', response)
                }
              })
              .catch((error) => {
                console.log(error)
                this.$message.error(error)
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
