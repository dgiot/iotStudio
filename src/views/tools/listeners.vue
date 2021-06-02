<template>
  <div class="listeners-view">
    <div class="page-title">
      {{ $translateTitle('leftbar.listeners') }}
      <el-select
        v-model="nodeName"
        class="select-radius"
        :placeholder="$translateTitle('select.placeholder')"
        :disabled="$store.state.loading"
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
        prop="protocol"
        width="240"
        :label="$translateTitle('listeners.protocol')"
      />
      <el-table-column
        prop="listen_on"
        min-width="240"
        :label="$translateTitle('listeners.listenOn')"
      />
      <el-table-column
        prop="max_conns"
        min-width="180"
        :label="$translateTitle('listeners.maxConnections')"
      />
      <el-table-column
        prop="current_conns"
        min-width="120"
        :label="$translateTitle('listeners.currentConnections')"
      />
    </el-table>
  </div>
</template>
<!--eslint-disable-->
<script>
  import { mapActions } from 'vuex'
  import { Select, Option, Table, TableColumn } from 'element-ui'
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
            this.$message.error(
              error || this.$translateTitle('error.networkError')
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
            this.$message.error(
              error || this.$translateTitle('error.networkError')
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
