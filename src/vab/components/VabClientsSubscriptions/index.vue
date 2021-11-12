<template>
  <div class="clients-subscriptions">
    <el-card class="el-card--self tabs-card">
      <el-row>
        <el-col
          :span="12"
          class="card-subtitle"
        >
          {{ $t('clients.currentSubs') }}
        </el-col>

        <el-col
          :span="12"
          class="oper-btn-group"
        >
          <el-button
            icon="el-icon-refresh"
            plain
            size="mini"
            type="success"
            @click.native="reload"
          >
            {{ $t('oper.refresh') }}
          </el-button>
          <el-button
            icon="el-icon-plus"
            plain
            size="mini"
            type="success"
            @click.native="open"
          >
            {{ $t('clients.addSubs') }}
          </el-button>
        </el-col>
      </el-row>

      <el-table
        v-loading="$store.state.loading"
        :data="tableData"
        border
        class="client-sub-table"
      >
        <el-table-column
          :label="$t('subscriptions.topic')"
          prop="topic"
        />
        <el-table-column
          :label="$t('subscriptions.qoS')"
          prop="qos"
        />
        <el-table-column
          :label="$t('oper.oper')"
          width="120px"
        >
          <template slot-scope="{ row }">
            <el-button
              plain
              size="mini"
              type="danger"
              @click.native="handleUnsub(row)"
            >
              {{ $t('oper.unsubscribe') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :append-to-body="true"
      :title="$t('clients.addSubs')"
      :visible.sync="addVisible"
      class="create-subscribe"
      width="400px"
      @keyup.enter.native="handleAdd"
    >
      <el-form
        ref="record"
        :model="record"
        :rules="rules"
        class="el-form--public"
        label-position="top"
        size="small"
      >
        <el-form-item
          :label="$t('subscriptions.topic')"
          prop="topic"
        >
          <el-input
            v-model="record.topic"
            placeholder="Topic"
          />
        </el-form-item>
        <el-form-item
          label="QoS"
          prop="qos"
        >
          <vab-emq-select
            v-model="record.qos"
            :field="{ list: [0, 1, 2] }"
            class="el-select--public"
            popper-class="el-select--public"
            size="small"
          />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          class="cache-btn"
          type="text"
          @click.native="handleClose"
        >
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button
          :loading="$store.state.loading"
          class="confirm-btn"
          type="success"
          @click.native="handleAdd"
        >
          {{ $t('oper.add') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import VabEmqSelect from '@/vab/components/VabEmqSelect'

  export default {
    name: 'VabClientsSubscriptions',
    components: {
      VabEmqSelect,
    },
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
        default: () => {
        },
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
            },
          )
          .then(() => {
            const {
              topic,
              clientid,
            } = row
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
              .catch(() => {
              })
          })
          .catch(() => {
          })
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
            .catch(() => {
            })
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
