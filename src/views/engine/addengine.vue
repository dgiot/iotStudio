<template>
  <div class="addengine">
    <div class="addcontent">
      <el-card class="box-card">
        <el-form
          ref="formInline"
          :model="formInline"
          :rules="formlinerule"
          label-width="80px"
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
                ><el-input v-model="formInline.enginesql" class="ace_text-input" type="textarea"/></pre>
              </el-form-item>
              <!--备注-->
              <el-form-item :label="$translateTitle('rule.rule Id')">
                <el-input v-model="formInline.ruleId" type="text" />
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
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  content="自定义模拟数据进行 SQL 命令测试，仅用于测试功能"
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
            <el-col :span="12">
              <div class="sql-tips el-col el-col-8 el-col-offset-1">
                <div>
                  <p>
                    规则引擎是标准 MQTT 之上基于 SQL
                    的核心数据处理与分发组件，可以方便的筛选并处理 MQTT
                    消息与设备生命周期事件，并将数据分发移动到 HTTP
                    Server、数据库、消息队列甚至是另一个 MQTT Broker 中。
                  </p>
                  <p>1. 选择 't/#' 主题的消息，提取全部字段：</p>
                  <div class="code"><code>SELECT * FROM "t/#"</code></div>
                </div>
                <p>
                  2. 通过事件主题选择客户端连接事件，筛选 Username 为 'emqx'
                  的设备并获取连接信息：
                </p>
                <div class="code">
                  <code>
                    SELECT clientid, connected_at FROM
                    "$events/client_connected" WHERE username = 'emqx'
                  </code>
                </div>
              </div>
            </el-col>
            <!--中间间隔-->
            <el-col :span="4" />
            <el-col :span="row2" class="animated fadeInRightBig">
              <el-form-item
                v-show="formInline.sqltest == true"
                :rules="[
                  {
                    required: true,
                    message: 'clientid 不能为空',
                    trigger: 'blur',
                  },
                ]"
                label="clientid"
                prop="clientid"
              >
                <el-input v-model="formInline.clientid" />
              </el-form-item>
              <el-form-item
                v-show="formInline.sqltest == true"
                :rules="[
                  {
                    required: true,
                    message: 'username 不能为空',
                    trigger: 'blur',
                  },
                ]"
                label="username"
                prop="username"
              >
                <el-input v-model="formInline.username" />
              </el-form-item>
              <el-form-item
                v-show="formInline.sqltest == true"
                :rules="[
                  {
                    required: true,
                    message: 'topic 不能为空',
                    trigger: 'blur',
                  },
                ]"
                label="topic"
                prop="topic"
              >
                <el-input v-model="formInline.topic" />
              </el-form-item>
              <el-form-item
                v-if="formInline.sqltest == true"
                :rules="[
                  { required: true, message: 'qos 不能为空', trigger: 'blur' },
                ]"
                label="qos"
                prop="qos"
              >
                <el-input v-model.number="formInline.qos" />
              </el-form-item>
              <el-form-item
                v-show="formInline.sqltest == true"
                :rules="[
                  { required: true, message: '请填写payload', trigger: 'blur' },
                ]"
                label="payload"
                prop="payload"
              >
                <el-input
                  v-model="formInline.payload"
                  type="text"
                  style="visibility: hidden"
                />
                <pre
                  id="editor2"
                  class="ace_editor"
                  style="min-height: 300px"
                ><el-input v-model="formInline.payload" class="ace_text-input" type="textarea"/></pre>
              </el-form-item>
              <el-form-item v-show="formInline.sqltest == true" label=" ">
                <el-button type="success" @click="testRule('formInline')">
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
                <el-table :data="actionData" style="width: 100%">
                  <el-table-column :label="$translateTitle('rule.channel')">
                    <template slot-scope="scope">
                      <span v-if="scope.row.params.$resource">
                        {{ '关联资源:' + scope.row.params.$resource }}
                      </span>
                      <span v-else />
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('rule.target_topic')"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.params.target_topic }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="$translateTitle('rule.target_qos')">
                    <template slot-scope="scope">
                      {{ scope.row.params.target_qos }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('rule.payload_tmpl')"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.params.payload_tmpl }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('developer.operation')"
                    width="180"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="danger"
                        size="mini"
                        @click="deleteOneData(scope.$index)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div>
                  <el-button
                    type="success"
                    plain
                    icon="el-icon-circle-plus-outline"
                    size="small"
                    style="margin-top: 20px"
                    @click="addresouce"
                  >
                    {{ $translateTitle('rule.Addto') }}
                  </el-button>
                </div>
              </div>
            </div>
            <div>
              <el-dialog
                :title="$translateTitle('rule.ResponseAction')"
                :visible.sync="dialogFormVisible"
                :close-on-click-modal="false"
                width="40%"
                top="10%"
                @close="resetForm('params')"
              >
                <el-form
                  ref="params"
                  :rules="paramsrules"
                  label-position="left"
                  label-width="140px"
                  :model="params"
                >
                  <el-form-item prop="channel">
                    <span slot="label">
                      <span class="span-box">
                        <i class="icon-dd-schetit" />
                        <span>通道</span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="重新发布消息到物联网通道"
                          placement="top-start"
                        >
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </span>

                    <el-select
                      v-model="params.channel"
                      placeholder="请选择"
                      @change="changeChanel"
                    >
                      <el-option
                        v-for="item in channellist"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"
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
                  <el-form-item prop="resources" label="关联资源">
                    <span slot="label">
                      <span class="span-box">
                        <i class="icon-dd-schetit" />
                        <span>关联资源</span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="关联资源"
                          placement="top-start"
                        >
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </span>
                    <el-select
                      v-model="params.resources"
                      placeholder="请选择"
                      @change="changeChanel"
                    >
                      <el-option
                        v-for="item in resources"
                        :key="item.id"
                        :label="item.id"
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
                  <el-form-item label="目的 QoS ">
                    <span slot="label">
                      <span class="span-box">
                        <i class="icon-dd-schetit" />
                        <span>目的 QoS</span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="重新发布消息时用的 QoS 级别, 设置为 -1 以使用原消息中的 QoS"
                          placement="top-start"
                        >
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </span>
                    <el-select v-model="params.target_qos" placeholder="请选择">
                      <el-option
                        v-for="item in params.target_qosSelect"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="目的主题 ">
                    <span slot="label">
                      <span class="span-box">
                        <i class="icon-dd-schetit" />
                        <span>目的主题</span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="重新发布消息到哪个主题"
                          placement="top-start"
                        >
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </span>
                    <el-input v-model="params.target_topic" />
                  </el-form-item>
                  <el-form-item label="消息内容模板">
                    <span slot="label">
                      <span class="span-box">
                        <i class="icon-dd-schetit" />
                        <span>消息内容模板</span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="消息内容模板，支持变量"
                          placement="top-start"
                        >
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </span>
                    <el-input
                      v-model="params.payload_tmpl"
                      type="textarea"
                      :rows="2"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('params')">
                      创建
                    </el-button>
                    <el-button @click="dialogFormVisible = !dialogFormVisible">
                      取消
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
            </div>
          </div>
          <el-form-item label-width="0">
            <el-button
              v-if="ruleId.length"
              @click="editrules(ruleId, 'formInline')"
            >
              修改
            </el-button>
            <el-button v-else type="success" @click="addrules('formInline')">
              新建
            </el-button>
            <el-button>取消</el-button>
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
    ruleTest,
    postResource,
    get_actions,
    get_resources,
    get_rule_id,
  } from '@/api/Rules'

  export default {
    data() {
      return {
        ruleId: this.$route.query.id || '',
        resources: [],
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
            { required: true, message: '请填写通道编号', trigger: 'blur' },
          ],
          desc: [
            { required: true, message: '请填写通道描述', trigger: 'blur' },
          ],
        },
        row1: 12,
        row2: 0,
        dialogFormVisible: false,
        title: '',
        formInline: {
          user: '',
          region: '',
          enginesql: '',
          remarks: '',
          sqltest: false,
          clientid: 'c_swqx',
          username: 'u_swqx',
          qos: 1,
          topic: 't/a',
          payload: '',
          ruleId: 'rule:929035',
          result: '',
        },
        formlinerule: {
          region: [
            { required: true, message: '请选择触发事件', trigger: 'change' },
          ],
          enginesql: [
            { required: true, message: '请填写规则SQL', trigger: 'blur' },
          ],
        },
        actionData: [],
        form: {
          action: 'dgiot_resource',
          resource: '',
        },
        paramsrules: {
          channel: [
            { required: true, message: '请选择通道', trigger: 'change' },
          ],
          resources: [
            { required: true, message: '请选择关联资源', trigger: 'change' },
          ],
        },
        formrule: {
          action: [
            { required: true, message: '请选择动作', trigger: 'change' },
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
        console.log('1111')
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
      editor1.setValue(`SELECT
        payload.msg as msg
      FROM
        "t/#"
      WHERE
        msg = 'hello'`)
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
      // 资源通道选择
      selectResource(val) {
        // this.resourcelist.map(item => {
        //   if (val == item.id) {
        //     this.ctype = item.attributes.cType;
        //   }
        // });
      },
      openDialog() {
        this.dialogVisible = true
      },
      async queryRule(ruleId) {
        const { data } = await get_rule_id(ruleId)
        console.log(data)
        this.actionData = data.actions
        this.formInline.enginesql = data.rawsql
        this.formInline.ruleId = data.id
        this.formInline.remarks = data.description
        editor1.setValue(data.rawsql)
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
      resetForm(formName) {
        this.$refs[formName].resetFields()
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
            // type: this.ctype
          },
          fallbacks: [],
        })
        this.dialogFormVisible = !this.dialogFormVisible
      },
      async _get_actions() {
        const { data } = await get_actions()
        this.channellist = data
      },
      changeChanel(v) {
        console.log(v, 'changeChanel')
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
            ruleTest(
              this.actionData,
              ctx,
              this.formInline.remarks,
              editor1.getValue().match(regex)[1],
              '',
              editor1.getValue()
            )
              .then((response) => {
                this.formInline.result = JSON.stringify(response, null, 4)
              })
              .catch((error) => {
                this.$message(error.error)
              })
          }
        })
      },
      editrules(ruleid, forName) {
        console.log(ruleid, forName)
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
            var regex = /from[^"]+?"([^"]+)"/im
            const params = {
              actions: this.actionData,
              ctx: ctx,
              description: this.formInline.remarks,
              for: '["t/#"]',
              rawsql: editor1.getValue(),
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
                    // query: {
                    //   id: this.productid,
                    //   activeName: "sixeth"
                    // }
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
        this.dialogFormVisible = true
        this._get_actions()
        this._get_resources()
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
