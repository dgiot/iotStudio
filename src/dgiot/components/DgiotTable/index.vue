<template>
  <div class="table">
    <el-table
      border
      :cell-style="tableClass"
      class="elTable"
      :data="tableData"
      :header-cell-style="tableHeaderColor"
      height="100%"
      stripe
    >
      <template v-for="item in table_config.thead">
        <el-table-column
          v-if="item.type === 'function'"
          :key="item.prop"
          align="center"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        >
          <template slot-scope="scope">
            <span v-html="item.callback && item.callback(scope.row)"></span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          v-else-if="item.type === 'operation'"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        >
          <template slot-scope="scope">
            <el-button
              v-for="items in item.actionButtons"
              :key="items.title"
              :circle="items.circle"
              class="btn"
              :icon="items.icon"
              :type="items.type"
              @click="item.callback(scope.row, items.title)"
            >
              <span v-if="!items.circle">{{ items.title }}</span>
            </el-button>
          </template>
        </el-table-column>
        <!-- 普通渲染 -->
        <el-table-column
          v-else
          :key="item.prop"
          align="center"
          :label="item.label"
          :min-width="item.minWidth"
          :prop="item.prop"
          :width="item.width"
        />
      </template>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: 'DgiotTable',
    props: {
      // 表格数据
      config: {
        type: Object,
        default: () => {},
      },
      tableData: {
        type: Array,
        default: () => {},
      },
    },
    data() {
      return {
        table_config: {
          thead: [],
        },
      }
    },
    watch: {
      config: {
        handler(newValue) {
          this.initConfig()
        },
        immediate: true,
      },
    },

    methods: {
      //初始化表格数据
      initConfig() {
        for (let key in this.config) {
          if (Object.keys(this.table_config).includes(key)) {
            this.table_config[key] = this.config[key]
          }
        }
      },
      // 斑马线样式
      tableClass({ row, rowIndex }) {
        if (rowIndex % 2 == 1) {
          return 'background-color:var(--bgColor1);borderColor:var(--deepBlue);color:#fff;padding:4px'
        } else {
          return 'background-color:var(--bgColor2);borderColor:var(--deepBlue);color:#fff;padding:4px'
        }
      },
      // 表头样式
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        return 'background-color:var(--bgColor3);color:#fff;font-wight:500;font-size:14px;text-align:center;borderColor:var(--deepBlue);padding:4px'
      },
    },
  }
</script>
