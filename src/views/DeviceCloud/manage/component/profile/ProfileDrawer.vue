<template>
  <el-dialog
    :append-to-body="true"
    class="parserTable"
    direction="rtl"
    :visible.sync="parserTable"
    width="60%"
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
    <el-table :data="parserTables" size="mini">
      <el-table-column
        align="center"
        label="uid"
        prop="uid"
        show-overflow-tooltip
        sortable
        width="100"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('product.chinesetitle')"
        prop="name"
        show-overflow-tooltip
        sortable
        width="140"
      >
        <template #default="{ row }">
          <el-popover placement="top" trigger="hover">
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
              <el-tag size="medium">
                {{ row.name }}
              </el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('product.functionaltypes')"
        prop="type"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        align="center"
        :label="$translateTitle('product.visible')"
        prop="visible"
        sortable
        width="100"
      >
        <template #default="{ row }">
          <el-switch v-model="row.visible" disabled />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        :label="$translateTitle('developer.operation')"
        width="200"
      >
        <template #default="{ row, $index }">
          <el-button type="text" @click="editParse($index, row)">
            {{ $translateTitle('concentrator.edit') }}
          </el-button>
          <el-button
            :disabled="!row.config.order"
            type="text"
            @click="previewParse(row.config)"
          >
            {{ $translateTitle('application.preview') }}
          </el-button>
          <el-button
            size="small"
            type="text"
            @click.native.prevent="lockingParse(row.uid, $index, parserTables)"
          >
            {{ $translateTitle('application.locking') }}
          </el-button>
          <el-button
            :disabled="row.disable"
            size="small"
            type="text"
            @click.native.prevent="deleteParse(row.uid, $index, parserTables)"
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
        console.log('Preservation', table)
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
