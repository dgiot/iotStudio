<template>
  <div class="rulesengine">
    <div class="engintable">
      <div class="engineheader">
        <h3>{{ $translateTitle('rule.rule') }}</h3>
        <el-button
          :disabled="alarmsRuleId.length > 0 && engineData.length > 0"
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
              @click="editRule(scope.row.id)"
            >
              <!-- 编辑 -->
              {{ $translateTitle('task.Edit') }}
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
    <!--    <vab-parser />-->
  </div>
</template>
<script>
  import { getRule, getRuleDetail, ruleDelete, put_rule_id } from '@/api/Rules'
  // import VabParser from '@/vab/components/VabParser'
  import { getHashClass } from '@/api/Hash/index'
  export default {
    // components: { VabParser },
    data() {
      return {
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
          query: { id: id, title: '编辑' },
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
