<template>
  <div class="rulesengine">
    <div class="engintable">
      <div class="engineheader">
        <h3>{{ $translateTitle('rule.rule') }}</h3>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="float: right; margin: 19px 0"
          size="small"
          @click="addEngine"
        >
          {{ $translateTitle('developer.add') }}
        </el-button>
      </div>
      <el-table
        :data="engineData"
        :cell-class-name="getRowindex"
        style="width: 100%; text-align: center"
      >
        <el-table-column label="ID" align="center" width="180">
          <template slot-scope="scope">
            <span @click="detailRules(scope.row.id)">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="主题" align="center"> -->
        <el-table-column
          :label="$translateTitle('leftbar.topics')"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.for.join(',') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rawsql" align="center" label="SQL" />
        <el-table-column
          :label="$translateTitle('rule.ResponseAction')"
          align="center"
        >
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.actions" :key="index">
              {{ item.name }}
            </p>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="已命中"> -->
        <el-table-column align="center" :label="$translateTitle('product.hit')">
          <template slot-scope="scope">
            <span>{{ matched(scope.row.metrics) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$translateTitle('developer.operation')"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="info"
              size="mini"
              plain
              @click="detailRules(scope.row.id)"
            >
              <!-- 查看 -->
              {{ $translateTitle('equipment.see') }}
            </el-button>
            <el-button
              type="info"
              size="mini"
              plain
              @click="deleteRule(scope.row.id)"
            >
              <!-- 删除 -->
              {{ $translateTitle('developer.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagesize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!--    <vab-a-map />-->
  </div>
</template>
<script>
  import { getRule, ruleDelete } from '@/api/Rules'
  export default {
    data() {
      return {
        engineData: [],
        pagesize: 10,
        start: 0,
        total: 0,
      }
    },
    mounted() {
      this.orginRule()
    },
    methods: {
      // 初始化数据
      orginRule() {
        getRule()
          .then((response) => {
            if (response) {
              this.engineData = response.data
              this.total = this.engineData.length
            }
          })
          .catch((error) => {
            this.$message(error.error)
          })
      },
      // 分页
      handleSizeChange(val) {},
      handleCurrentChange(val) {},
      addEngine() {
        this.$router.push({
          path: '/rules_engine/addengine',
          query: {
            title: '新增',
          },
        })
      },
      matched(metrics) {
        var matched = 0
        for (var i = 0; i < metrics.length; i++) {
          matched += metrics[i].matched
        }
        return matched
      },
      actions(row) {
        // var string = []
        row.map((items) => {
          // string.push(items.name)
          return items.name
        })
        return string.join(',')
      },
      // 表格单个单元格class添加
      getRowindex(row, rowIndex, columnIndex) {
        if (row.columnIndex == 0) {
          return 'firstcolumn'
        }
      },
      detailRules(id) {
        this.$router.push({
          path: '/rules_engine/checkengine',
          query: { id: id },
        })
      },
      deleteRule(id) {
        ruleDelete(id)
          .then((resultes) => {
            if (resultes) {
              this.$message('删除成功')
              this.orginRule()
            }
          })
          .catch((error) => {
            this.$message(error.error)
          })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .rulesengine {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    .engintable {
      width: 100%;
      height: auto;
      .engineheader {
        h3 {
          float: left;
        }
      }
      .block {
        margin-top: 20px;
      }
    }
    ::v-deep .firstcolumn {
      color: #34c388;
      cursor: pointer;
    }
  }
</style>
