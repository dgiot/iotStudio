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
              size="40"
              :label="$translateTitle('equipment.name')"
              align="center"
            >
              <template #default="{ row }">
                <el-button v-copy="row.name" type="text">
                  {{ row.name }}
                </el-button>
              </template>
            </el-table-column>

            <el-table-column
              size="40"
              :label="$translateTitle('product.identifier')"
              align="center"
            >
              <template #default="{ row }">
                <el-button v-copy="row.identifier" type="text">
                  {{ row.identifier }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              size="40"
              :label="$translateTitle('equipment.defaultvalue')"
              align="center"
            >
              <template #default="{ row }">
                <el-button v-copy="row.defaultvalue" type="text">
                  {{ row.defaultvalue }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--        <div class="left">{{ dict.properties }}</div>-->
      </el-col>
      <el-col :span="jsonData.length ? rendeRow : rendeRow + 5">
        <vab-query-form-top-panel>
          <el-form
            ref="form"
            :inline="true"
            label-width="100px"
            :model="headerInfo"
            @submit.native.prevent
          >
            <el-alert
              :closable="false"
              :title="
                $translateTitle(
                  'Maintenance.Click on the name, identifier, default value on the left to copy automatically Can be associated with component property configuration filling'
                )
              "
              type="info"
            />
            <el-form-item>
              <el-button
                icon="el-icon-setting"
                @click="rendeRow == 19 ? (rendeRow = 24) : (rendeRow = 19)"
              />
            </el-form-item>
            <el-form-item :label="$translateTitle('product.chinesetitle')">
              <el-input
                v-model="headerInfo.name"
                :placeholder="$translateTitle('product.chinesetitle')"
              />
            </el-form-item>
            <el-form-item :label="$translateTitle('product.englishtitle')">
              <el-input
                v-model="headerInfo.enname"
                :placeholder="$translateTitle('product.englishtitle')"
              />
            </el-form-item>
          </el-form>
        </vab-query-form-top-panel>
        <f-render
          :loading="loading"
          :height="parseheight"
          :config="formConfig.config"
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
      // parserzh: {
      //   type: String,
      //   default: '',
      //   require: false,
      // },
      parserindex: {
        type: Number,
        default: 0,
        require: false,
      },
      // parseren: {
      //   type: String,
      //   default: '',
      //   require: false,
      // },
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
        headerInfo: [],
        loading: false,
      }
    },
    mounted() {
      this.jsonData = this.dict.basedate.params
      this.headerInfo = this.formConfig
      console.log('this.jsonData', this.jsonData)
      console.log('this.formConfig', this.formConfig)
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
        this.$emit(
          'ParserSave',
          {
            name: this.headerInfo.name,
            enname: this.headerInfo.enname,
            config: JSON.parse(res),
          },
          this.parserindex
        )
      },
    },
  }
</script>
