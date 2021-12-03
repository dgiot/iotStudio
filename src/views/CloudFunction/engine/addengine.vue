<template>
  <div class="addengine">
    <div class="addcontent">
      <el-card class="box-card">
        <el-form
          ref="formInline"
          label-width="80px"
          :model="formInline"
          :rules="formlinerule"
          size="medium"
        >
          <div class="form-block__title">
            {{ $translateTitle('rule.condtion') }}
            <div class="form-block__title-tips">
              {{ $translateTitle('rule.Processing') }}
            </div>
          </div>
          <el-row :gutter="20">
            <el-col :span="row1">
              <!--触发事件-->
              <el-form-item>
                <!-- <el-select v-model="formInline.region" :placeholder=" $translateTitle('rule.TriggerEvent')" @change="selectRegion">
                  <el-option
                    v-for="(item,index) in originlist"
                    :key="index"
                    :label="item.title.zh+'('+item.event+')'"
                    :value="item.event">

                  </el-option>
                </el-select> -->
                <!-- <el-input v-model="formInline.region" ></el-input> -->
                <div class="show-guess">
                  <!-- <p>{{ $translateTitle('rule.AvailableField')}}</p> -->
                  <!-- <div class="code">
                    <code
                      style="font-size: 12px;"
                    >{{client.join(',')}}</code>
                  </div> -->
                  <!-- <p>
                    <span class="notice" style="color:#ff6d6d">*</span>
                    {{ $translateTitle('rule.UpgradeHints')}}
                  </p>
                  <div
                    class="code"
                  >当前版本取消对 payload 的自动 JSON 解码，选择 payload 中的字段请使用 json_decode 解码，如 SQL 示例。</div> -->
                  <p>{{ $translateTitle('rule.RuleSQLexample') }}</p>
                  <div class="code">
                    <code style="font-size: 12px">{{ sqlexample }}</code>
                  </div>
                </div>
              </el-form-item>
              <!--编写SQL-->
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

                    <el-select v-model="params.channel">
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
                    <el-select v-model="params.resources">
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
                    <el-select v-model="params.target_qos">
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
  import provider from '@/api/Ace/index'

  export default {
    data() {
      return {
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
        },
        formlinerule: {
          region: [
            {
              required: true,
              message: '请选择触发事件',
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
        // originlist: datalist,
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
      if (this.ruleId) {
        this.queryRule(this.ruleId)
      }
      this.title = this.$route.query.title
      this.productid = this.$route.query.productid
      editor1 = ace.edit('editor1')
      editor1.session.setMode('ace/mode/sql') // 设置语言
      editor1.setTheme('ace/theme/eclipse') // 设置主题
      editor1.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true, // 设置自动提示
      })
      var languageTools = ace.require('ace/ext/language_tools')
      languageTools.addCompleter({
        getCompletions: function (editor, session, pos, prefix, callback) {
          callback(null, provider)
        },
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
    },
    methods: {
      // 规则选择
      // selectRegion(val) {
      //   this.originlist.map(item => {
      //     if (item.event == val) {
      //       this.client = item.columns;
      //       this.sqlexample = item.sql_example;
      //     }
      //   });
      // },
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
        const { data } = await get_rule_id(ruleId)
        dgiotlog.log(data)
        // this.formInline.username = data.ctx
        this.actionData = data.actions
        this.formInline.enginesql = data.rawsql
        editor1.setValue(this.formInline.enginesql)
        this.formInline.ruleId = data.id
        this.formInline.remarks = data.description
        editor1.setValue(data.rawsql)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.relationChannel(this.params)
          } else {
            dgiotlog.log('error submit!!')
            return false
          }
        })
      },
      editFom(formName) {
        dgiotlog.log(this.params)
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
        dgiotlog.log(row)
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
        dgiotlog.log(this.actionData, 'this.actionData')
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
                dgiotlog.log('response', response)
                const { code } = response
                if (code == 0) {
                  this.formInline.result = response.data.msg
                  dgiotlog.log(
                    '     this.formInline.result ',
                    this.formInline.result
                  )
                } else {
                  this.$message.error('SQL Not Match')
                  dgiotlog.log('error response', response)
                }
              })
              .catch((error) => {
                dgiotlog.log(error)
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
        dgiotlog.log(ruleid, forName, res)
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
            if (this.uid && this.productid) {
              params.id = `rule:${this.ruleType}_${this.productid}_${this.uid}`
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
                dgiotlog.log(resultes)
                if (resultes) {
                  this.$message('创建成功')
                  this.$router.push({
                    path: '/rules_engine/engine',
                  })
                }
              })
              .catch((e) => {
                dgiotlog.log(e)
                this.$message.error(e.error)
              })
          } else {
            this.$message('有必填项未填写')
          }
        })
      },
      // 初始化resource通道
      addresouce() {
        dgiotlog.log(this.aisleRow)
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
        border-bottom: 1px solid #666666;
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
