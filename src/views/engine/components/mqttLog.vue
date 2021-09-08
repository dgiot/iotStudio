<template>
  <div class="log log-container">
    <div>
      <a-tabs default-active-key="editor">
        <a-tab-pane key="editor">
          <span slot="tab">
            <vab-icon icon="aspect-ratio-fill" />
            {{ $translateTitle('Logs.console') }}
          </span>
          <vab-editor
            :key="logKey"
            :value="msg"
            :height="
              isFullscreen
                ? Number($baseTableHeight(0))
                : Number($baseTableHeight(0))
            "
            :max-lines="
              isFullscreen
                ? Number($baseTableHeight(0)) / 12
                : Number($baseTableHeight(0)) / 12
            "
            :min-lines="
              isFullscreen
                ? Number($baseTableHeight(0)) / 12
                : Number($baseTableHeight(0)) / 12
            "
            lang="text"
            theme="gob"
          />
        </a-tab-pane>
        <a-tab-pane key="table">
          <span slot="tab">
            <vab-icon icon="table-2" />
            {{ $translateTitle('Logs.table') }}
          </span>
          <el-table
            v-loading="listLoading"
            :height="height"
            :data="
              list.slice(
                (queryForm.pageNo - 1) * queryForm.pageSize,
                queryForm.pageNo * queryForm.pageSize
              )
            "
          >
            <el-table-column
              align="center"
              sortable
              :label="$translateTitle('home.updatedAt')"
              prop="timestamp"
              show-overflow-tooltip
              width="230px"
            >
              <template #default="{ row }">
                <span>
                  {{
                    $moment(Number(row.timestamp)).format(
                      'YYYY-MM-DD HH:mm:ss.SSS'
                    )
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="msg"
              sortable
              :label="$translateTitle('product.log')"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <el-input v-model="row.msg">
                  <el-button
                    slot="prepend"
                    v-copyText="row.msg"
                    icon="el-icon-copy-document"
                  />
                </el-input>
              </template>
            </el-table-column>
            <template #empty>
              <a-empty class="vab-data-empty" :description="false" />
            </template>
          </el-table>
          <el-pagination
            background
            :current-page="queryForm.pageNo"
            :layout="layout"
            :page-size="queryForm.pageSize"
            :total="list.length"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'MqttLog',
    props: {
      msg: {
        type: String,
        default: '',
        required: false,
      },
      list: {
        type: Array,
        default: () => [],
        required: false,
      },
      logKey: {
        type: String,
        default: '',
        required: false,
      },
    },
    data() {
      return {
        height: this.$baseTableHeight(0) + 60,
        clickItem: '',
        isFullscreen: false,
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        queryForm: {
          account: '',
          searchDate: '',
          pageNo: 1,
          pageSize: 20,
        },
      }
    },
    methods: {
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      async fetchData() {
        //   this.listLoading = true
        //   const {
        //     data: { list, total },
        //   } = await getList(this.queryForm)
        //   this.list = list
        //   this.total = total
        //   this.listLoading = false
      },
    },
  }
</script>
