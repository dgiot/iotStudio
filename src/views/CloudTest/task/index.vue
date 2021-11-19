<!--
* @Author: h7ml
* @Date: 2021-11-08 17:17:58
* @LastEditors: h7ml
* @LastEditTime: 2021-11-08 17:17:58
* @Description: 检测任务
* @FilePath: src\views\CloudTest\Task\index.vue
* @DocumentLink:
-->
<template>
  <div ref="custom-table" class="custom-table-container">
    <div class="components">
      <vab-dialog :show.sync="activePopShow" width="60%">
        <h3 slot="title">
          {{ $translateTitle('cloudTest.addwordtask') }}
        </h3>
        <div style="margin: 0 0 20px 0; text-align: right">
          <el-button plain type="primary" @click="nextpage('ruleForm')">
            {{ $translateTitle('cloudTest.nextpage') }}
          </el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">
            <i class="el-icon-finished">
              {{ $translateTitle('product.createnow') }}
            </i>
          </el-button>
        </div>
        <div class="content">
          <el-divider content-position="left">检测任务基本信息</el-divider>
          <el-form
            ref="ruleForm"
            class="demo-ruleForm"
            label-width="100px"
            :model="ruleForm"
            :rules="rules"
          >
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item
                  :label="$translateTitle('cloudTest.taskname')"
                  prop="name"
                >
                  <el-input v-model="ruleForm.name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$translateTitle('cloudTest.starttime')"
                  prop="starttime"
                >
                  <el-date-picker
                    v-model="ruleForm.starttime"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择开始时间"
                    style="width: 100%"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item
                  :label="$translateTitle('cloudTest.wordtemplate')"
                  prop="wordtemplate"
                >
                  <el-select
                    v-model="ruleForm.wordtemplatename"
                    :placeholder="$translateTitle('task.Select')"
                    style="width: 100%"
                    @change="wordtemplateChange"
                  >
                    <el-option
                      v-for="(item, index) in wordtemplist"
                      :key="index"
                      :label="item.name"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$translateTitle('cloudTest.endtime')"
                  prop="endtime"
                >
                  <el-date-picker
                    v-model="ruleForm.endtime"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择结束时间"
                    style="width: 100%"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider content-position="left">检测资源信息</el-divider>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item
                  :label="$translateTitle('cloudTest.testbed')"
                  prop="testbed"
                >
                  <el-select
                    v-model="ruleForm.testbed"
                    :placeholder="$translateTitle('task.Select')"
                    style="width: 100%"
                    @change="testbedChange"
                  >
                    <el-option
                      v-for="(item, index) in grouplist"
                      :key="index"
                      :label="item.name"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </vab-dialog>
    </div>
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form
          ref="form"
          :inline="true"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-select
              v-model="queryForm.name"
              multiple
              :placeholder="
                $translateTitle('cloudTest.Please select review status')
              "
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="fetchData(queryForm)"
            >
              {{ $translateTitle('cloudTest.search') }}
            </el-button>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click.native="activePopShow = !activePopShow"
            >
              {{ $translateTitle('cloudTest.add') }}
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-popover
          ref="popover"
          popper-class="custom-table-checkbox"
          trigger="hover"
        >
          <el-radio-group v-model="lineHeight">
            <el-radio label="medium">
              {{ $translateTitle('cloudTest.medium') }}
            </el-radio>
            <el-radio label="small">
              {{ $translateTitle('cloudTest.small') }}
            </el-radio>
            <el-radio label="mini">
              {{ $translateTitle('cloudTest.mini') }}
            </el-radio>
          </el-radio-group>
          <template #reference>
            <el-button style="margin: 0 10px 10px 0 !important" type="primary">
              <dgiot-icon icon="line-height" />
              {{ $translateTitle('cloudTest.size') }}
            </el-button>
          </template>
        </el-popover>
        <el-popover popper-class="custom-table-checkbox" trigger="hover">
          <el-checkbox-group v-model="checkList">
            <vab-draggable :list="columns" v-bind="dragOptions">
              <div v-for="(item, index) in columns" :key="item + index">
                <dgiot-icon icon="drag-drop-line" />
                <el-checkbox
                  :disabled="item.disableCheck === true"
                  :label="item.label"
                >
                  {{ $translateTitle(`cloudTest.${item.label}`) }}
                </el-checkbox>
              </div>
            </vab-draggable>
          </el-checkbox-group>
          <template #reference>
            <el-button
              icon="el-icon-setting"
              style="margin: 0 0 10px 0 !important"
              type="primary"
            >
              {{ $translateTitle('cloudTest.Draggable column') }}
            </el-button>
          </template>
        </el-popover>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :border="border"
      :data="list"
      :height="height"
      :size="lineHeight"
      :stripe="stripe"
    >
      <el-table-column
        align="center"
        :label="$translateTitle('cloudTest.number')"
        show-overflow-tooltip
        width="95"
      >
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in finallyColumns"
        :key="index"
        align="center"
        :label="$translateTitle(`cloudTest.${item.label}`)"
        :prop="item.prop"
        show-overflow-tooltip
        :sortable="item.sortable"
        :width="item.width"
      />

      <el-table-column
        align="center"
        :label="$translateTitle(`deviceLog.status`)"
        show-overflow-tooltip
        width="185"
      >
        <template #default="{ row }">
          <el-tag
            effect="dark"
            :type="
              ['success', 'info', 'warning', 'danger'][
                row.basedata.testStatus
              ] || 0
            "
          >
            {{
              [
                $translateTitle('product.notstarted'),
                $translateTitle('product.testing'),
                $translateTitle('product.finishtest'),
              ][row.basedata.testStatus] || $translateTitle('product.notested')
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle(`cloudTest.operate`)"
        show-overflow-tooltip
        width="185"
      >
        <template #default="{ row }">
          <el-button type="success" @click="handleManagement(row)">
            {{ $translateTitle(`product.Template management`) }}
          </el-button>
          <el-button type="warning" @click="handleDelete(row, 0)">
            {{ $translateTitle(`cloudTest.delete`) }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-image
          class="vab-data-empty"
          :src="
            require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
          "
        />
      </template>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page.sync="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :page-sizes="queryForm.pageSizes"
      :total="queryForm.total"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
  </div>
</template>

<script>
  import { queryDevice } from '@/api/Device'
  import VabDraggable from 'vuedraggable'
  import { mapGetters } from 'vuex'
  import { queryProduct } from '@/api/Product'
  import { postreport } from '@/api/Report'

  export default {
    name: 'TaskIndex',
    components: {
      VabDraggable,
    },
    data() {
      return {
        options: [
          {
            value: 'Underreview',
            label: '审核中',
          },
          {
            value: 'finishreview',
            label: '审核完成',
          },
        ],
        ruleForm: {
          testbedid: '',
          testbed: '',
          wordtemplatename: '',
          endtime: '',
          starttime: '',
          wordtemplateid: '',
          name: '',
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入任务名称',
              trigger: 'blur',
            },
          ],
          wordtemplatename: [
            {
              required: true,
              message: '请选择报告模板',
              trigger: 'change',
            },
          ],
          starttime: [
            {
              required: true,
              message: '请选择开始时间',
              trigger: 'change',
            },
          ],
          endtime: [
            {
              required: true,
              message: '请选择结束时间',
              trigger: 'change',
            },
          ],
          testbed: [
            {
              required: true,
              message: '请选择测试台体',
              trigger: 'change',
            },
          ],
          organization: [
            {
              required: true,
              message: '请选择所属组织',
              trigger: 'change',
            },
          ],
        },
        activePopShow: false,
        border: true,
        height: 1000 - 20,
        stripe: true,
        lineHeight: 'medium',
        checkList: [
          'mission name',
          'Inspection number',
          'Inspection template',
          'testbed',
          'Trade Names',
          'Creation time',
          'Starting time',
          'end time',
        ],
        columns: [
          {
            label: 'mission name',
            width: 'auto',
            prop: 'name',
            sortable: true,
          },
          {
            label: 'Inspection number',
            width: 'auto',
            prop: 'devaddr',
            sortable: true,
            disableCheck: true,
          },
          {
            label: 'Inspection template',
            width: 'auto',
            prop: 'basedata.wordtemplatename',
            sortable: true,
          },
          {
            label: 'testbed',
            width: 'auto',
            prop: 'basedata.testbed',
            sortable: true,
          },
          {
            label: 'Creation time',
            width: 'auto',
            prop: 'createdAt',
            sortable: true,
          },
          {
            label: 'Starting time',
            width: 'auto',
            prop: 'basedata.starttime',
            sortable: true,
          },
          {
            label: 'end time',
            width: 'auto',
            prop: 'basedata.endtime',
            sortable: true,
          },
        ],
        list: [],
        listLoading: true,
        queryForm: {
          pageSizes: [10, 20, 30, 50],
          limit: 10,
          order: '-createdAt',
          keys: 'count(*)',
          total: 0,
          skip: 0,
          pageNo: 1,
          pageSize: 10,
          name: ['审核中', '审核完成'],
        },
        wordtemplist: [],
        grouplist: [],
      }
    },
    computed: {
      ...mapGetters({
        language: 'settings/language',
        collapse: 'settings/collapse',
      }),
      dragOptions() {
        return {
          animation: 600,
          group: 'description',
        }
      },
      finallyColumns() {
        return this.columns.filter((item) =>
          this.checkList.includes(item.label)
        )
      },
    },
    watch: {
      language: {
        deep: true,
        limit: true,
        handler(val) {
          console.error(val)
        },
      },
    },
    created() {
      this.fetchData(this.queryForm)
      this.getwordtemp()
      this.getgroup()
    },
    methods: {
      wordtemplateChange(val) {
        this.$set(this.ruleForm, 'wordtemplatename', val.name),
          this.$set(this.ruleForm, 'wordtemplateid', val.objectId),
          console.log('this.ruleForm', this.ruleForm)
      },
      testbedChange(val) {
        this.$set(this.ruleForm, 'testbed', val.name),
          this.$set(this.ruleForm, 'testbedid', val.objectId),
          console.log('this.ruleForm', this.ruleForm)
      },
      nextpage() {
        if (this.ruleForm.wordtemplate) {
          console.log(this.ruleForm.wordtemplate)
        } else {
          this.$message({
            type: 'error',
            message: '请选择报告模板',
          })
        }
      },
      async getwordtemp() {
        const params = {
          skip: 0,
          where: {
            netType: 'Evidence',
            nodeType: 1,
          },
        }
        const res = await queryProduct(params)
        this.wordtemplist = res.results
      },
      async getgroup() {
        const params = {
          skip: 0,
          where: {
            nodeType: 2,
          },
        }
        const res = await queryProduct(params)
        this.grouplist = res.results
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const task = {
              basedata: {
                testbedid: this.ruleForm.testbedid,
                testbed: this.ruleForm.testbed,
                wordtemplatename: this.ruleForm.wordtemplatename,
                endtime: this.ruleForm.endtime,
                starttime: this.ruleForm.starttime,
                reportId: this.ruleForm.wordtemplateid,
                identifier: 'inspectionReportTemp',
              },
              name: this.ruleForm.name,
              product: this.ruleForm.wordtemplateid,
            }
            const loading = this.$baseColorfullLoading(1)
            postreport(task)
            this.fetchData(this.queryForm)
            loading.close()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      sizeChange(val) {
        this.queryForm.limit = val
        this.fetchData(this.queryForm)
      },
      currentChange(val) {
        this.queryForm.skip = (val - 1) * this.queryForm.limit
        this.fetchData(this.queryForm)
      },
      async handleManagement(row) {},
      handleDelete(row, flag) {},
      async fetchData(args) {
        const params = {
          limit: args.limit,
          order: args.order,
          skip: this.queryForm.name.length ? 0 : args.skip,
          keys: args.keys,
          where: {
            'basedata.identifier': 'inspectionReportTemp',
          },
        }
        this.listLoading = true
        const { count = 0, results = [] } = await queryDevice(params)
        this.list = results
        results.forEach((item) => {
          item.basedata.endtime = moment(item.basedata.endtime).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          item.basedata.starttime = moment(item.basedata.starttime).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        })
        // this.list = results
        this.queryForm.total = count
        this.listLoading = false
      },
    },
  }
</script>
<style>
  .el-divider__text {
    font-size: 18px;
  }
</style>
