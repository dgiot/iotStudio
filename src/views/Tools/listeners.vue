<template>
  <div class="listeners-view">
    <div class="page-title">
      {{ $translateTitle('leftbar.listeners') }}
      <el-select
        v-model="nodeName"
        class="select-radius"
        :disabled="$store.state.loading"
        :placeholder="$translateTitle('select.placeholder')"
        @change="loadListeners"
      >
        <el-option
          v-for="node in nodes"
          :key="node.node"
          :label="node.node"
          :value="node.node"
        />
      </el-select>
    </div>
    <el-table v-loading="$store.state.loading" border :data="listeners">
      <el-table-column
        :label="$translateTitle('listeners.protocol')"
        prop="protocol"
        width="240"
      />
      <el-table-column
        :label="$translateTitle('listeners.listenOn')"
        min-width="240"
        prop="listen_on"
      />
      <el-table-column
        :label="$translateTitle('listeners.maxConnections')"
        min-width="180"
        prop="max_conns"
      />
      <el-table-column
        :label="$translateTitle('listeners.currentConnections')"
        min-width="120"
        prop="current_conns"
      />
    </el-table>
  </div>
</template>
<!--eslint-disable-->
<script>
  import { mapActions } from 'vuex'
  import { Option, Select, Table, TableColumn } from 'element-ui'

  export default {
    name: 'ListenersView',
    components: {
      'el-select': Select,
      'el-option': Option,
      'el-table': Table,
      'el-table-column': TableColumn,
    },
    data() {
      return {
        nodeName: '',
        nodes: [],
        listeners: [],
      }
    },
    methods: {
      ...mapActions(['CURRENT_NODE']),
      loadData() {
        this.$httpGet('/nodes')
          .then((response) => {
            this.nodeName = this.$store.state.nodeName || response.data[0].node
            this.nodes = response.data
            this.loadListeners()
          })
          .catch((error) => {
            this.$baseMessage(
              error || this.$translateTitle('error.networkError'),
              'error',
              'dgiot-hey-message-error'
            )
          })
      },
      loadListeners() {
        this.CURRENT_NODE(this.nodeName)
        this.$httpGet(`/nodes/${this.nodeName}/listeners`)
          .then((response) => {
            this.listeners = response.data
          })
          .catch((error) => {
            this.$baseMessage(
              error || this.$translateTitle('error.networkError'),
              'error',
              'dgiot-hey-message-error'
            )
          })
      },
    },
    created() {
      this.loadData()
    },
  }
</script>

<style lang="scss">
  .listeners-view {
    .el-table {
      margin-top: 24px;
    }
  }
</style>
