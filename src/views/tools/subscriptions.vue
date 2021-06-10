<template>
  <div class="clients-subscriptions">
    <el-card class="el-card--self tabs-card">
      <el-row>
        <el-col class="card-subtitle" :span="12">
          {{ $t('clients.currentSubs') }}
        </el-col>

        <el-col class="oper-btn-group" :span="12">
          <el-button
            size="mini"
            type="success"
            icon="el-icon-refresh"
            plain
            @click="reload"
          >
            {{ $t('oper.refresh') }}
          </el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-plus"
            plain
            @click="open"
          >
            {{ $t('clients.addSubs') }}
          </el-button>
        </el-col>
      </el-row>

      <el-table
        v-loading="$store.state.loading"
        class="client-sub-table"
        border
        :data="tableData"
      >
        <el-table-column prop="topic" :label="$t('subscriptions.topic')" />
        <el-table-column prop="qos" :label="$t('subscriptions.qoS')" />
        <el-table-column width="120px" :label="$t('oper.oper')">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleUnsub(row)"
            >
              {{ $t('oper.unsubscribe') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="$t('clients.addSubs')"
      width="400px"
      :visible.sync="addVisible"
      class="create-subscribe"
      @keyup.enter.native="handleAdd"
    >
      <el-form
        ref="record"
        class="el-form--public"
        :model="record"
        :rules="rules"
        size="small"
        label-position="top"
      >
        <el-form-item prop="topic" :label="$t('subscriptions.topic')">
          <el-input v-model="record.topic" placeholder="Topic" />
        </el-form-item>
        <el-form-item prop="qos" label="QoS">
          <vab-emq-select
            v-model="record.qos"
            class="el-select--public"
            popper-class="el-select--public"
            size="small"
            :field="{ list: [0, 1, 2] }"
          />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="text" class="cache-btn" @click="handleClose">
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button
          type="success"
          class="confirm-btn"
          :loading="$store.state.loading"
          @click="handleAdd"
        >
          {{ $t('oper.add') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ClientsSubscriptions',
    components: {},
    props: {
      clientId: {
        type: String,
        required: true,
      },
      tableData: {
        type: Array,
        required: true,
      },
      reload: {
        type: Function,
        default: () => {},
      },
      mountpoint: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        addVisible: false,
        record: {
          topic: '',
          qos: 0,
        },
        rules: {
          clientid: {
            required: true,
            message: this.$t('oper.pleaseEnter'),
          },
          topic: {
            required: true,
            message: this.$t('oper.pleaseEnter'),
          },
        },
      }
    },
    methods: {
      handleUnsub(row) {
        this.$msgbox
          .confirm(
            this.$t('oper.unsubscribeConfirm'),
            this.$t('oper.warning'),
            {
              type: 'warning',
            }
          )
          .then(() => {
            const { topic, clientid } = row
            let topicVal = this.mountpoint
              ? topic.replace(this.mountpoint, '')
              : topic
            const body = {
              topic: topicVal,
              clientid,
            }
            this.$httpPost('/mqtt/unsubscribe', body)
              .then(() => {
                this.reload()
              })
              .catch(() => {})
          })
          .catch(() => {})
      },
      open() {
        this.addVisible = true
        this.record.clientid = this.clientId
      },
      handleAdd() {
        this.$refs.record.validate((valid) => {
          if (!valid) {
            return
          }
          const body = {}
          Object.assign(body, this.record)
          this.$httpPost('/mqtt/subscribe', body)
            .then(() => {
              this.handleClose()
              this.reload()
            })
            .catch(() => {})
        })
      },
      handleClose() {
        this.$refs.record.resetFields()
        this.addVisible = false
      },
    },
  }
</script>

<style lang="scss">
  .clients-subscriptions {
    .oper-btn-group {
      margin: 24px 0;
      text-align: right;
    }
    .client-sub-table {
      margin-bottom: 24px;
    }
    .el-select--public {
      width: 100%;
      .el-input__inner {
        height: 32px !important;
        line-height: 32px !important;
      }
    }
  }
</style>
