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
                row.basedata.testStatus ? row.basedata.testStatus : 0
              ]
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

<script src="../js/task.js"></script>
<style>
  .el-divider__text {
    font-size: 18px;
  }
</style>
