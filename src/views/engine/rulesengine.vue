<template>
  <div class="rulesengine dgiot-container">
    <div class="engintable">
      <div class="engineheader">
        <el-button
          :disabled="alarmsRuleId.length > 0 && engineData.length > 0"
          icon="el-icon-plus"
          size="small"
          style="float: right"
          type="primary"
          @click="addEngine"
        >
          {{ $translateTitle('developer.add') }}
        </el-button>
      </div>
      <el-table
        :cell-class-name="getRowindex"
        :data="engineData"
        :height="height"
        style="width: 100%; text-align: center"
      >
        <el-table-column
          align="center"
          label="ID"
          show-overflow-tooltip
          width="180"
        >
          <template slot-scope="scope">
            <span @click="detailRules(scope.row.id)">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="主题" align="center"> -->
        <el-table-column
          align="center"
          :label="$translateTitle('leftbar.topics')"
          show-overflow-tooltip
          width="200"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.for.join(',') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="SQL"
          prop="rawsql"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          align="center"
          :label="$translateTitle('rule.ResponseAction')"
        >
          <template slot-scope="scope">
            <p
              v-for="(item, index) in scope.row.actions"
              :key="index"
            >
              {{ item.name }}
            </p>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="已命中"> -->
        <el-table-column
          align="center"
          :label="$translateTitle('product.hit')"
        >
          <template slot-scope="scope">
            <span>{{ matched(scope.row.metrics) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$translateTitle('equipment.state')"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeRule(scope.row.id, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          :label="$translateTitle('developer.operation')"
          width="210"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="detailRules(scope.row.id)"
            >
              <!-- 查看 -->
              {{ $translateTitle('equipment.see') }}
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="editRule(scope.row.id)"
            >
              <!-- 编辑 -->
              {{ $translateTitle('task.Edit') }}
            </el-button>
            <el-button
              size="mini"
              type="danger"
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
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pagesize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <!--    <vab-parser />-->
  </div>
</template>
<script>
  import { getRule, getRuleDetail, put_rule_id, ruleDelete } from '@/api/Rules'
  // import VabParser from '@/vab/components/VabParser'

  export default {
    // components: { VabParser },
    data() {
      return {
        height: this.$baseTableHeight(0),
        engineData: [],
        pagesize: 10,
        start: 0,
        total: 0,
        productid: this.$route.query.productid || '',
        ruleType: this.$route.query.type || '',
        uid: this.$route.query.uuid || '',
        alarmsRuleId: '',
      }
    },
    mounted() {
      this.featchData({})
    },
    methods: {
      featchData(args) {
        console.log(args)
        if (this.productid && this.uid && this.ruleType) {
          this.alarmsRuleId = `rule:${this.ruleType}_${this.productid}_${this.uid}`
          this.getalarmsRule(this.alarmsRuleId)
          // this.orginRule()
        } else {
          this.orginRule()
        }
      },
      async getalarmsRule(ruleId) {
        const response = await getRuleDetail(ruleId)
        console.log(response, 'response')
        let res = []
        res.push(response.data)
        this.engineData = res
        console.log(this.engineData, '  this.engineData')
        this.total = this.engineData.length
      },
      // 初始化数据
      orginRule() {
        getRule({})
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
        var query = {
          title: '新增',
        }
        if (this.productid.length) query['productid'] = this.productid
        if (this.uid.length) query['uid'] = this.uid
        if (this.ruleType.length) query['type'] = this.ruleType
        this.$router.push({
          path: '/rules_engine/addengine',
          query: query,
        })
      },
      matched(metrics) {
        var matched = 0
        for (var i = 0; i < metrics.length; i++) {
          matched += metrics[i].matched
        }
        return matched
      },
      async changeRule(ruleid, status) {
        const params = { enabled: status }
        const res = await put_rule_id(ruleid, params)
        console.log(res)
        this.$message('状态修改成功')
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
      editRule(id) {
        this.$router.push({
          path: '/rules_engine/addengine',
          query: {
            id: id,
            title: '编辑',
          },
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

    .engintable {
      width: 100%;
      height: auto;

      .engineheader {
        h3 {
          float: left;
        }
      }

      .block {
      }
    }

    ::v-deep .firstcolumn {
      color: #34c388;
      cursor: pointer;
    }
  }
</style>
