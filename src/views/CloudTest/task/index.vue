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
    <el-drawer
      v-drawerDrag
      append-to-body
      size="90%"
      :visible.sync="dialogVisible"
      :with-header="false"
    >
      <iframe :src="officeapps" style="width: 100%; height: 100%" />
    </el-drawer>
    <div class="components">
      <vab-dialog :show.sync="activePopShow">
        <h2 slot="title">
          {{ $translateTitle('cloudTest.addwordtask') }}
        </h2>
        <div class="content">
          <el-divider>
            {{
              $translateTitle('cloudTest.Basic information of inspection tasks')
            }}
          </el-divider>
          <el-form
            ref="ruleForm"
            v-loading="loading"
            class="demo-ruleForm"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            element-loading-spinner="el-icon-loading"
            :element-loading-text="$translateTitle('developer.Waitingtoreturn')"
            label-width="100px"
            :model="ruleForm"
            :rules="rules"
            size="mini"
          >
            <el-form-item
              :label="$translateTitle('cloudTest.taskname')"
              prop="name"
            >
              <el-input v-model="ruleForm.name" />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('cloudTest.wordtemplate')"
              prop="templatename"
            >
              <el-select
                v-model="ruleForm.templatename"
                :placeholder="$translateTitle('task.Select')"
                style="width: 100%"
                value-key="objectId"
                @change="categoryChange"
              >
                <el-option
                  v-for="item in categorylist"
                  :key="item.objectId"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
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
          </el-form>
          <div slot="footer" style="text-align: right">
            <el-button
              size="mini"
              type="primary"
              @click.native="submitForm('ruleForm')"
            >
              <i class="el-icon-finished">
                {{ $translateTitle('product.createnow') }}
              </i>
            </el-button>
          </div>
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
            <!--            <el-select-->
            <!--              v-model="queryForm.name"-->
            <!--              multiple-->
            <!--              :placeholder="-->
            <!--                $translateTitle('cloudTest.Please select review status')-->
            <!--              "-->
            <!--            >-->
            <!--              <el-option-->
            <!--                v-for="item in options"-->
            <!--                :key="item.value"-->
            <!--                :label="item.label"-->
            <!--                :value="item.value"-->
            <!--              />-->
            <!--            </el-select>-->
            <el-input
              v-model="queryForm.name"
              :placeholder="
                $translateTitle('cloudTest.Please select review status')
              "
            />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click.native="fetchData()"
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
        width="auto"
      >
        <template #default="{ row }">
          <el-tag v-show="row.profile.step == -1" effect="dark" type="warning">
            {{ $translateTitle('cloudTest.notapproved') }}
          </el-tag>
          <el-tag
            v-show="row.profile.step != -1"
            effect="dark"
            :type="
              ['info', 'warning', 'primary', 'primary'][
                row.profile.step ? row.profile.step : 0
              ]
            "
          >
            {{
              [
                $translateTitle('product.notstarted'),
                $translateTitle('product.testing'),
                $translateTitle('product.pending review'),
                $translateTitle('product.finishtest'),
                $translateTitle('product.review completed'),
              ][row.profile.step] || $translateTitle('product.finishtest')
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        :label="$translateTitle(`cloudTest.operate`)"
        width="380"
      >
        <template #default="{ row }">
          <el-button
            size="mini"
            type="success"
            @click.native="handleManagement(row)"
          >
            {{ $translateTitle(`task.Configuration`) }}
          </el-button>
          <el-button
            v-show="row.profile.step == 0"
            size="mini"
            type="info"
            @click.native="taskStart(row)"
          >
            {{ $translateTitle(`task.start`) }}
          </el-button>
          <el-button
            v-show="row.profile.step == 1 || row.profile.step == -1"
            size="mini"
            type="warning"
            @click.native="forensics(row)"
          >
            {{
              row.profile.step == 1
                ? $translateTitle(`cloudTest.forensics`)
                : $translateTitle(`cloudTest.re-review`)
            }}
          </el-button>
          <el-button
            v-show="row.profile.step == 2"
            size="mini"
            type="primary"
            @click.native="handleUnderreview(row.objectId)"
          >
            {{ $translateTitle(`product.Underreview`) }}
          </el-button>
          <el-button
            v-show="row.profile.step == 3"
            size="mini"
            type="success"
            @click.native="taskEnd(row)"
          >
            {{ $translateTitle(`concentrator.end`) }}
          </el-button>
          <el-button
            v-show="row.profile.step >= 4"
            size="mini"
            type="primary"
            @click.native="handleReport(row)"
          >
            {{ $translateTitle(`product.generate`) }}
          </el-button>
          <el-button
            v-show="row.profile.step == 5"
            size="mini"
            type="primary"
            @click.native="handlePreview(row)"
          >
            {{ $translateTitle(`application.preview`) }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native="handleDelete(row.objectId)"
          >
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
    <vab-parser-pagination
      ref="pagination"
      :pagination="paginations"
      :query-payload="queryPayload"
      @pagination="fetchData"
      @paginationQuery="paginationQuery"
    />
    <lowcode-design ref="lowcodeDesign" @objectId="lowcodeId" />
  </div>
</template>

<script src="../js/task.js"></script>
<style>
  .el-divider__text {
    font-size: 18px;
  }
</style>
