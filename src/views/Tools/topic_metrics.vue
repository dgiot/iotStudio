<template>
  <div class="topic-metrics">
    <div class="page-title">
      {{ $translateTitle('analysis.topicMetrics') }}
      <span class="sub-tip">{{ $translateTitle('analysis.metricsTip') }}</span>
      <el-button
        v-if="!modClosed"
        class="confirm-btn"
        :disable="$store.state.loading"
        icon="el-icon-plus"
        plain
        round
        size="medium"
        style="float: right"
        type="success"
        @click="handleOperation"
      >
        {{ $translateTitle('rule.create') }}
      </el-button>
      <el-button
        v-else
        class="confirm-btn"
        :disable="$store.state.loading"
        plain
        round
        size="medium"
        style="float: right"
        type="success"
        @click="handleModLoad"
      >
        {{ $translateTitle('modules.enable') }}
      </el-button>
    </div>
    <el-table
      ref="crudTable"
      v-loading="$store.state.loading"
      border
      :data="topics"
      :expand-row-keys="expands"
      :row-key="getRowKeys"
      @expand-change="handleExpandChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="expand-header">
            {{ $translateTitle('analysis.details') }}
            <el-radio-group
              v-model="topicQos"
              class="topic-qos-radio"
              :prop="props"
              size="mini"
            >
              <el-radio-button label="all">
                {{ $translateTitle('analysis.all') }}
              </el-radio-button>
              <el-radio-button label="qos0">QoS 0</el-radio-button>
              <el-radio-button label="qos1">QoS 1</el-radio-button>
              <el-radio-button label="qos2">QoS 2</el-radio-button>
            </el-radio-group>
          </div>
          <el-row class="expand-body" :gutter="20">
            <el-col :span="8">
              <div class="message-card in">
                <div>
                  {{ $translateTitle('analysis.messageIn') }}
                  <span class="message-rate">
                    {{
                      $translateTitle('analysis.rateItem', [
                        getCurrentTopicData('in', 'rate'),
                      ])
                    }}
                    {{ $translateTitle('analysis.rate') }}
                  </span>
                </div>
                <div class="message-card--body">
                  {{ getCurrentTopicData('in', 'count') }}
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="message-card out">
                <div>
                  {{ $translateTitle('analysis.messageOut') }}
                  <span class="message-rate">
                    {{
                      $translateTitle('analysis.rateItem', [
                        getCurrentTopicData('out', 'rate'),
                      ])
                    }}
                    {{ $translateTitle('analysis.rate') }}
                  </span>
                </div>
                <div class="message-card--body">
                  {{ getCurrentTopicData('out', 'count') }}
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="message-card drop">
                <div>
                  {{ $translateTitle('analysis.messageDrop') }}
                  <span class="message-rate">
                    {{
                      $translateTitle('analysis.rateItem', [
                        getCurrentTopicDropRate(
                          currentTopic['messages.dropped.rate']
                        ),
                      ])
                    }}
                    {{ $translateTitle('analysis.rate') }}
                  </span>
                </div>
                <div class="message-card--body">
                  {{ currentTopic['messages.dropped.count'] }}
                </div>
              </div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :label="$translateTitle('topics.topic')" prop="topic" />
      <el-table-column
        :label="$translateTitle('analysis.messageIn')"
        prop="messageIn"
      />
      <el-table-column
        :label="$translateTitle('analysis.messageOut')"
        prop="messageOut"
      />
      <el-table-column
        :label="$translateTitle('analysis.messageDrop')"
        prop="messageDrop"
      />
      <el-table-column :label="$translateTitle('oper.oper')" width="180px">
        <template slot-scope="props">
          <el-button
            plain
            size="mini"
            type="success"
            @click="viewTopicDetails(props.row, props.$index)"
          >
            {{ $translateTitle('oper.view') }}
          </el-button>
          <el-popover placement="right" trigger="click" :value="popoverVisible">
            <p>{{ $translateTitle('oper.confirmDelete') }}</p>
            <div style="text-align: right">
              <el-button
                class="cache-btn"
                size="mini"
                type="text"
                @click="hidePopover"
              >
                {{ $translateTitle('oper.cancel') }}
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="deleteTopicMetric(props.row)"
              >
                {{ $translateTitle('oper.confirm') }}
              </el-button>
            </div>
            <el-button slot="reference" plain size="mini" type="danger">
              {{ $translateTitle('oper.delete') }}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :append-to-body="true"
      class="create-subscribe"
      :title="$translateTitle('analysis.addTopic')"
      :visible.sync="addVisible"
      width="400px"
      @keyup.enter.native="handleAdd"
    >
      <el-form
        ref="record"
        class="el-form--public"
        label-position="top"
        :model="record"
        :rules="rules"
        size="small"
      >
        <el-form-item
          :label="$translateTitle('subscriptions.topic')"
          prop="topic"
        >
          <el-input v-model="record.topic" placeholder="Topic" />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button class="cache-btn" type="text" @click="handleClose">
          {{ $translateTitle('oper.cancel') }}
        </el-button>
        <el-button
          class="confirm-btn"
          :loading="$store.state.loading"
          type="success"
          @click="handleAdd"
        >
          {{ $translateTitle('oper.add') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'TopicMetrics',
    components: {},
    beforeRouteLeave(to, from, next) {
      clearInterval(this.timer)
      next()
    },
    props: {},
    data() {
      return {
        expands: [],
        addVisible: false,
        popoverVisible: false,
        modClosed: false,
        topicQos: 'all',
        timer: 0,
        topics: [],
        currentExpandRow: {},
        currentTopic: {},
        record: {},
        rules: {
          topic: {
            required: true,
            message: this.$translateTitle('oper.pleaseEnter'),
          },
        },
      }
    },
    watch: {
      currentExpandRow: {
        deep: true,
        handler() {
          clearInterval(this.timer)
        },
      },
    },
    created() {
      this.loadData()
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    methods: {
      getRowKeys(row) {
        return row.topic
      },
      loadData() {
        this.$httpGet('/topic-metrics')
          .then((res) => {
            const { data } = res
            this.topics = data.map((item) => {
              const { metrics } = item
              return {
                topic: item.topic,
                messageIn: metrics['messages.in.count'],
                messageOut: metrics['messages.out.count'],
                messageDrop: metrics['messages.dropped.count'],
              }
            })
            this.modClosed = false
          })
          .catch((error) => {
            this.$message.warning(
              this.$translateTitle(`error.${error.message}`)
            )
            this.modClosed = true
          })
      },
      hidePopover() {
        this.popoverVisible = true
        setTimeout(() => {
          this.popoverVisible = false
        }, 0)
      },
      handleOperation() {
        this.addVisible = true
      },
      handleModLoad() {
        this.$httpPut('/modules/emqx_mod_topic_metrics/load')
          .then(() => {
            this.$message({
              showClose: true,
              message: this.$translateTitle('oper.enableSuccess'),
              type: 'success',
            })
            this.loadData()
            this.modClosed = false
          })
          .catch((error) => {
            this.$message.error(
              error || this.$translateTitle('error.networkError')
            )
          })
      },
      deleteTopicMetric(row) {
        this.$httpDelete(`/topic-metrics/${encodeURIComponent(row.topic)}`)
          .then(() => {
            this.loadData()
            this.hidePopover()
          })
          .catch((error) => {
            this.$message.error(
              error || this.$translateTitle('error.networkError')
            )
          })
      },
      handleAdd() {
        this.$refs.record.validate((valid) => {
          if (!valid) {
            return
          }
          const body = {}
          Object.assign(body, this.record)
          this.$httpPost('/topic-metrics', body)
            .then(() => {
              this.handleClose()
              this.loadData()
            })
            .catch(() => {})
        })
      },
      handleClose() {
        this.addVisible = false
        this.$refs.record.resetFields()
      },
      viewTopicDetails(row, index) {
        const elExpand = document.querySelectorAll('.el-table__expand-icon')[
          index
        ]
        if (elExpand) {
          elExpand.click()
        }
      },
      loadDetail() {
        this.$httpGet(
          `/topic-metrics/${encodeURIComponent(this.currentTopic.topic)}`
        )
          .then((res) => {
            this.currentTopic = res.data
            this.loadData()
          })
          .catch(() => {})
      },
      setLoadDetailInterval() {
        this.timer = setInterval(() => {
          this.$httpGet(
            `/topic-metrics/${encodeURIComponent(this.currentExpandRow.topic)}`
          )
            .then((res) => {
              this.currentTopic = res.data
            })
            .catch(() => {})
        }, 10000)
      },
      handleExpandChange(row, expandedRows) {
        if (!expandedRows.length) {
          this.currentExpandRow = {}
          clearInterval(this.timer)
          return
        }
        this.currentExpandRow = row
        this.currentTopic = {}
        this.$httpGet(`/topic-metrics/${encodeURIComponent(row.topic)}`)
          .then((res) => {
            this.currentTopic = res.data
            this.$refs.crudTable.store.states.expandRows = expandedRows.length
              ? [row]
              : []
            this.loadData()
            this.setLoadDetailInterval()
          })
          .catch(() => {})
      },
      getCurrentTopicData(type, analysis) {
        const label = {
          all: 'messages',
          qos0: 'messages.qos0',
          qos1: 'messages.qos1',
          qos2: 'messages.qos2',
        }
        const key = label[this.topicQos]
        const res = this.currentTopic[`${key}.${type}.${analysis}`]
        if (analysis === 'rate' && res) {
          return res.toFixed(2)
        }
        return res
      },
      getCurrentTopicDropRate(rate) {
        if (rate) {
          return rate.toFixed(2)
        }
        return rate
      },
    },
  }
</script>

<style lang="scss">
  .topic-metrics {
    .sub-tip {
      margin-right: 10px;
      font-size: 14px;
      color: #9e9e9f;
      text-transform: none;
    }

    .el-table {
      margin-top: 24px;

      .expand-header {
        height: 32px;
        margin-bottom: 20px;
        line-height: 32px;
      }

      .topic-qos-radio {
        float: right;
      }

      .message-card {
        height: 112px;
        padding: 6px 12px;
        border-radius: 4px;

        .message-card--body {
          height: 80px;
          font-size: 28px;
          line-height: 80px;
          text-align: center;
        }

        .message-rate {
          float: right;
        }
      }
    }
  }
</style>
