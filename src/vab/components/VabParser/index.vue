<!--
 * @Author: h7ml
 * @Date: 2021-6-28 14:49:32
 * @LastEditTime: 2021-6-28 14:49:40
 * @LastEditors: h7ml
 * @Description: https://www.yuque.com/chaojie-vjiel/vbwzgu/twp49o https://github.com/dream2023/f-render/blob/7bc377cf1b88f6c01aad96844d63f7bc832a9415/README.md#%E7%AC%AC-3-%E6%AD%A5%E4%BD%BF%E7%94%A8
 * @FilePath: src/vab/components/VabParser/index.vue
-->

<template>
  <div class="center">
    <el-row>
      <el-col :span="jsonData.length ? 24 - rendeRow : 0">
        <div class="left">
          <!--          <VabJsonEditor ref="jsonEdit" v-model="jsonData" />-->
          <el-table size="mini" :data="jsonData">
            <el-table-column
              :label="$translateTitle('equipment.name')"
              align="center"
              prop="name"
            />
            <el-table-column
              :label="$translateTitle('product.identifier')"
              align="center"
              prop="identifier"
            />
            <el-table-column
              :label="$translateTitle('equipment.defaultvalue')"
              align="center"
              prop="default"
            />
            <el-table-column
              size="40"
              :label="$translateTitle('leftbar.settings')"
              align="center"
            >
              <template #default="{ row }">
                <el-button type="text" @click="setLabel(row)">
                  {{ $translateTitle('leftbar.settings') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--        <div class="left">{{ dict.properties }}</div>-->
      </el-col>
      <el-col :span="jsonData.length ? rendeRow : rendeRow + 5">
        <f-render
          :loading="loading"
          :height="parseheight"
          :config="formConfig"
          :productid="productid"
          @save="handleSave"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'VabParser',
    props: {
      parseheight: {
        type: String,
        default: 'calc(100vh - 70px)',
      },
      formConfig: {
        type: Object,
        default: () => {},
      },
      dict: {
        type: Object,
        default: () => {},
      },
      productid: {
        type: String,
        default: '',
        require: true,
      },
    },
    data() {
      return {
        rendeRow: 19,
        jsonData: [],
        loading: false,
      }
    },
    mounted() {
      this.jsonData = this.dict.basedate.params
      console.log('this.jsonData', this.jsonData)
      // 模拟异步加载
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    methods: {
      setLabel(row) {
        const { name, identifier, defaultvalue } = row
        console.log(name, identifier, defaultvalue, 'row')
      },
      handleSave(res) {
        this.$emit('ParserSave', JSON.parse(res), this.productid)
      },
    },
  }
</script>
