<template>
  <div class="clients-basic">
    <el-card class="el-card--self tabs-card">
      <el-row>
        <el-form
          ref="record"
          class="clients-basic-form"
          label-suffix=":"
          :model="record"
        >
          <el-col :span="12">
            <div class="card-subtitle">
              {{ $t('clients.connectInfo') }}
            </div>
            <el-form-item
              :label="$t('clients.node')"
              prop="node"
            >
              <span>{{ record.node }}</span>
            </el-form-item>
            <el-form-item
              v-if="record.clientid"
              :label="$t('clients.clientId')"
              prop="clientid"
            >
              <el-popover
                v-if="record.clientid.length > 60"
                :content="record.clientid"
                placement="top-start"
                trigger="hover"
              >
                <span slot="reference">
                  {{ interceptString(record.clientid, 60) }}
                </span>
              </el-popover>
              <span v-else>{{ record.clientid }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('clients.username')"
              prop="username"
            >
              <span>{{ record.username }}</span>
            </el-form-item>
            <el-form-item :label="$t('clients.protoType')">
              <template v-if="record.proto_name === 'MQTT'">
                <span>
                  {{ record.proto_name }} {{ mqttVersionMap[record.proto_ver] }}
                </span>
              </template>
              <template v-else>
                <span>
                  {{ record.proto_name }}
                  <span v-if="record.proto_ver">v{{ record.proto_ver }}</span>
                </span>
              </template>
            </el-form-item>
            <el-form-item
              :label="$t('clients.ipAddr')"
              prop="ip_address"
            >
              <span>{{ record.ip_address }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('clients.port')"
              prop="port"
            >
              <span>{{ record.port }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('clients.keepalive')"
              prop="keepalive"
            >
              <span>{{ record.keepalive }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('clients.isBridge')"
              prop="is_bridge"
            >
              <span>{{ record.is_bridge }}</span>
            </el-form-item>
            <el-form-item
              v-if="record.connected"
              :label="$t('clients.connectedAt')"
              prop="connected_at"
            >
              <span>{{ record.connected_at }}</span>
            </el-form-item>
            <el-form-item
              v-if="!record.connected"
              :label="$t('clients.disconnectAt')"
              prop="disconnected_at"
            >
              <span>{{ record.disconnected_at }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('clients.connected')"
              prop="connected"
            >
              <span :class="record.connected ? 'connected' : 'disconnected'">
                {{
                  record.connected
                    ? $t('websocket.connected')
                    : $t('websocket.disconnected')
                }}
              </span>
            </el-form-item>
            <el-form-item
              label="Zone"
              prop="zone"
            >
              <span>{{ record.zone }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <div class="card-subtitle">
              {{ $t('clients.session') }}
            </div>
            <el-form-item
              :label="record.proto_ver === 5 ? 'Clean Start' : 'Clean Session'"
              prop="clean_start"
            >
              <span>{{ record.clean_start }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('clients.expiryInterval')"
              prop="expiry_interval"
            >
              <span>{{ record.expiry_interval }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('clients.createdAt')"
              prop="created_at"
            >
              <span>{{ record.created_at }}</span>
            </el-form-item>
            <el-form-item :label="$t('clients.subscriptions')">
              <span>
                {{ record.subscriptions_cnt }} /
                {{ record.max_subscriptions | transToUnlimit }}
              </span>
            </el-form-item>
            <el-form-item
              :label="`${$t('clients.max')} ${$t('clients.subscriptions')}`"
            >
              <span>{{ record.max_subscriptions | transToUnlimit }}</span>
            </el-form-item>
            <el-form-item :label="$t('clients.inflight')">
              <span>{{ record.inflight }} / {{ record.max_inflight }}</span>
            </el-form-item>
            <el-form-item
              :label="`${$t('clients.max')} ${$t('clients.inflight')}`"
            >
              <span>{{ record.max_inflight }}</span>
            </el-form-item>
            <el-form-item :label="$t('clients.mqueue')">
              <span>{{ record.mqueue_len }} / {{ record.max_mqueue }}</span>
            </el-form-item>
            <el-form-item
              :label="`${$t('clients.max')} ${$t('clients.mqueue')}`"
            >
              <span>{{ record.max_mqueue }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('clients.awaiting_rel')"
              prop="awaiting_rel"
            >
              <span>{{ record.awaiting_rel }}</span>
            </el-form-item>
            <el-form-item
              :label="`${$t('clients.max')} ${$t('clients.awaiting_rel')}`"
              prop="max_awaiting_rel"
            >
              <span>{{ record.max_awaiting_rel }}</span>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div class="view-more">
        <a
          href="javascript:;"
          @click="showMore = !showMore"
        >
          {{ showMore ? $t('oper.collapse') : $t('oper.viewMore') }}
          <i :class="showMore ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </a>
      </div>

      <el-collapse-transition>
        <el-form
          v-if="showMore"
          ref="record"
          class="clients-basic-form"
          label-suffix=":"
          :model="record"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('clients.recv_cnt_desc')"
                prop="recv_cnt"
              >
                <span>{{ record.recv_cnt }}</span>
              </el-form-item>
              <el-form-item
                :label="$t('clients.recv_msg_desc')"
                prop="recv_msg"
              >
                <span>{{ record.recv_msg }}</span>
              </el-form-item>
              <el-form-item
                :label="$t('clients.recv_oct_desc')"
                prop="recv_oct"
              >
                <span>{{ record.recv_oct }}</span>
              </el-form-item>
              <el-form-item
                :label="$t('clients.recv_pkt_desc')"
                prop="recv_pkt"
              >
                <span>{{ record.recv_pkt }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('clients.send_cnt_desc')"
                prop="send_cnt"
              >
                <span>{{ record.send_cnt }}</span>
              </el-form-item>
              <el-form-item
                :label="$t('clients.send_msg_desc')"
                prop="send_msg"
              >
                <span>{{ record.send_msg }}</span>
              </el-form-item>
              <el-form-item
                :label="$t('clients.send_oct_desc')"
                prop="send_oct"
              >
                <span>{{ record.send_oct }}</span>
              </el-form-item>
              <el-form-item
                :label="$t('clients.send_pkt_desc')"
                prop="send_pkt"
              >
                <span>{{ record.send_pkt }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-transition>
    </el-card>
  </div>
</template>

<script>
  import { intercept } from '@/utils'
  export default {
    name: 'VabClientsBasic',
    filters: {
      transToUnlimit(val) {
        return val === 0 ? 'Unlimited' : val
      },
    },

    props: {
      record: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        showMore: false,
        mqttVersionMap: {
          3: 'v3.1',
          4: 'v3.1.1',
          5: 'v5.0',
        },
      }
    },
    methods: {
      interceptString(text, len) {
        return intercept(text, len)
      },
    },
  }
</script>

<style lang="scss">
  .clients-basic {
    .clients-basic-form {
      .form-item-desc {
        margin-left: 20px;
        font-size: 14px;
        color: #5f6067;
      }
      .el-form-item__content {
        color: #f8f8f8;
      }
      .el-form-item {
        margin-bottom: 12px;
      }
    }
    .view-more {
      margin: 24px 0;
      font-size: 14px;
    }
  }
</style>
