<template>
  <el-dialog
    width="60%"
    :append-to-body="true"
    direction="rtl"
    :visible.sync="parserTable"
    class="parserTable"
    @close="$parent.parserTable = !parserTable"
  >
    <div slot="title" class="header-title">
      <el-button type="primary" @click.native.prevent="addParse(parserTables)">
        {{ $translateTitle('product.newlyadded') }}
      </el-button>
      <el-button type="success" @click.native.prevent="saveParse(parserTables)">
        {{ $translateTitle('product.preservation') }}
      </el-button>
    </div>
    <el-table size="mini" :data="parserTables">
      <el-table-column
        width="100"
        show-overflow-tooltip
        sortable
        align="center"
        prop="uid"
        label="uid"
      />
      <el-table-column
        show-overflow-tooltip
        sortable
        align="center"
        prop="name"
        width="140"
        :label="$translateTitle('product.chinesetitle')"
      >
        <template #default="{ row }">
          <el-popover trigger="hover" placement="top">
            <p>
              {{ $translateTitle('product.englishtitle') }}: {{ row.enname }}
            </p>
            <p>
              {{ $translateTitle('developer.describe') }}:
              {{ row.description }}
            </p>
            <p>
              {{ $translateTitle('product.identifier') }}:
              {{ row.identifier }}
            </p>
            <p>
              {{ $translateTitle('developer.describe') }}:
              {{ row.description }}
            </p>
            <p>
              {{ $translateTitle('product.Table Name') }}:
              {{ row.table }}
            </p>
            <p>
              {{ $translateTitle('product.class') }}:
              {{ row.field }}
            </p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        sortable
        align="center"
        prop="type"
        :label="$translateTitle('product.functionaltypes')"
      />
      <el-table-column
        sortable
        align="center"
        prop="visible"
        width="100"
        :label="$translateTitle('product.visible')"
      >
        <template #default="{ row }">
          <el-switch v-model="row.visible" disabled />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        width="200"
        :label="$translateTitle('developer.operation')"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="editParse(scope.$index, scope.row)">
            {{ $translateTitle('concentrator.edit') }}
          </el-button>
          <el-button
            type="text"
            :disabled="!scope.row.config.order"
            @click="previewParse(scope.row.config)"
          >
            {{ $translateTitle('application.preview') }}
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="
              lockingParse(scope.row.uid, scope.$index, parserTables)
            "
          >
            {{ $translateTitle('application.locking') }}
          </el-button>
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.disable"
            @click.native.prevent="
              deleteParse(scope.row.uid, scope.$index, parserTables)
            "
          >
            {{ $translateTitle('task.Delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  export default {
    name: 'ProfileDrawer',
    props: {
      parserTable: {
        required: true,
        type: Boolean,
        default: false,
      },
      parserTables: {
        required: false,
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {}
    },
    created() {},
    mounted() {},
    methods: {
      addParse(table) {
        this.$parent.addParse(table)
      },
      saveParse(table) {
        this.$parent.saveParse(table)
      },
      editParse(index, row) {
        this.$parent.editParse(index, row)
      },
      previewParse(config) {
        this.$parent.previewParse(config)
      },
      lockingParse(uid, index, table) {
        this.$parent.lockingParse(uid, index, table)
      },
      deleteParse(uid, index, table) {
        this.$parent.deleteParse(uid, index, table)
      },
    },
  }
</script>
