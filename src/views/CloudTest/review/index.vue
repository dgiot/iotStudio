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
    >
      <iframe :src="officeapps" style="width: 100%; height: 100%" />
    </el-drawer>
    <el-drawer
      v-drawerDrag
      append-to-body
      size="90%"
      :visible.sync="statisticsVisible"
    >
      <evidence-statistics ref="statistics" :evidence-id="evidenceId" />
    </el-drawer>
    <div class="components">
      <el-dialog append-to-body :visible.sync="evidenceDialog">
        <el-card class="box-card" shadow="hover">
          <el-table border :data="evidences" stripe>
            <el-table-column
              align="center"
              :label="$translateTitle('cloudTest.number')"
              show-overflow-tooltip
              width="100"
            >
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$translateTitle('cloudTest.evidence')"
              min-width="180"
              prop="row.original.path"
              show-overflow-tooltip
              sortable
              width="auto"
            >
              <template #default="{ row }">
                <!--                <vue-aliplayer-v2-->
                <!--                  v-if="types.video.includes(`${row.original.type}`)"-->
                <!--                  :options="aliplayer"-->
                <!--                  :source="$FileServe + row.original.path"-->
                <!--                />-->
                <!--                <el-image-->
                <!--                  v-else-if="types.image.includes(`${row.original.type}`)"-->
                <!--                  :preview-src-list="[$FileServe + row.original.path]"-->
                <!--                  :src="$FileServe + row.original.path"-->
                <!--                  style="width: 100px; height: 100px"-->
                <!--                />-->
                <!--                <av-bars-->
                <!--                  v-else-if="types.audio.includes(`${row.original.type}`)"-->
                <!--                  :audio-src="$FileServe + row.original.path"-->
                <!--                />-->
                <el-link :href="$FileServe + row.original.path" target="_blank">
                  {{
                    row.original.path.split('/')[
                      `${row.original.path.split('/').length - 1}`
                    ]
                  }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$translateTitle('deviceLog.type')"
              prop="row.original.type"
              show-overflow-tooltip
              sortable
              :width="180"
            >
              <template #default="{ row }">
                <el-tag effect="plain">
                  {{ $translateTitle(`cloudTest.${row.original.type}`) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$translateTitle('cloudTest.single audit')"
              show-overflow-tooltip
              :width="120"
            >
              <template #default="{ row }">
                <el-tag
                  effect="dark"
                  :type="
                    ['', 'success', 'danger'][
                      ['未审核', '通过审核', '不通过审核'].indexOf(
                        row.original.status
                      )
                    ]
                  "
                >
                  {{ row.original.status }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column
              v-if="Number($route.query.step) == 3"
              align="center"
              :label="$translateTitle('cloudTest.single audit opinion')"
              width="auto"
            >
              <template #default="{ row, $index }">
                <el-input v-model="row.original.message" size="mini" />
              </template>
            </el-table-column>
            <el-table-column
              v-if="Number($route.query.step) == 3"
              align="center"
              :label="$translateTitle('cloudTest.submit review')"
              width="auto"
            >
              <template #default="{ row }">
                <el-button plain @click.native="changeItem(row)">
                  {{ $translateTitle('cloudTest.submit review') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <!--      <span slot="footer" class="dialog-footer">-->
        <!--        <el-button type="primary" @click="evidenceDialog = false">-->
        <!--          {{ $translateTitle('cloudTest.save evidence') }}-->
        <!--        </el-button>-->
        <!--      </span>-->
      </el-dialog>
      <dgiot-dialog :show.sync="activePopShow">
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
                value-key="objectId"
                @change="testbedChange"
              >
                <el-option
                  v-for="item in grouplist"
                  :key="item.objectId"
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
      </dgiot-dialog>
    </div>
    <dgiot-query-form>
      <dgiot-query-form-left-panel>
        <el-form
          ref="form"
          :inline="true"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item>
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
          </el-form-item>
        </el-form>
      </dgiot-query-form-left-panel>
    </dgiot-query-form>
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :border="border"
      :data="list.examination"
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
        width="120"
      >
        <template #default="{ row }">
          <el-tooltip
            v-show="row.profile.step == -1"
            class="item"
            :content="row.profile.message"
            effect="dark"
            placement="top-start"
          >
            <el-tag effect="dark" type="warning">
              {{ $translateTitle('cloudTest.notapproved') }}
            </el-tag>
          </el-tooltip>
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
                $translateTitle('product.review completed'),
                $translateTitle('product.report generated'),
              ][row.profile.step] || $translateTitle('product.finishtest')
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        :label="$translateTitle(`cloudTest.operate`)"
        width="420"
      >
        <template #default="{ row }">
          <el-button
            v-show="row.profile.step == 2"
            size="mini"
            type="primary"
            @click.native="handleUnderreview(row.objectId)"
          >
            {{ $translateTitle(`product.Underreview`) }}
          </el-button>
          <el-button
            v-show="row.profile.iszjimee"
            size="mini"
            type="primary"
            @click.native="handleManagement(row)"
          >
            {{ $translateTitle(`task.testItemsreview`) }}
          </el-button>
          <el-button
            v-show="row.profile.step == 3"
            size="mini"
            type="success"
            @click.native="handleReport(row)"
          >
            {{ $translateTitle(`product.generate`) }}
          </el-button>
          <el-button
            v-show="row.profile.step == 4"
            size="mini"
            type="primary"
            @click.native="handleReport(row)"
          >
            {{ $translateTitle(`application.preview report`) }}
          </el-button>
          <el-button
            v-show="row.profile.step >= 4"
            size="mini"
            type="info"
            @click.native="handleEvidence(row.objectId)"
          >
            {{ $translateTitle(`application.List evidence`) }}
          </el-button>
          <el-button
            v-show="row.profile.step >= 4"
            size="mini"
            type="success"
            @click.native="handleRouter(row)"
          >
            {{ $translateTitle(`application.evidence`) }}
          </el-button>
          <el-button
            v-show="row.profile.step != -1"
            size="mini"
            type="danger"
            @click.native="handleHistory(row)"
          >
            历史数据
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-image
          class="dgiot-data-empty"
          :src="
            require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
          "
        />
      </template>
    </el-table>
    <dgiot-parser-pagination
      :key="list.examination.length + 'examination'"
      ref="examination"
      :pagination="paginations"
      :query-payload="queryPayload"
      @pagination="fetchData"
      @paginationQuery="paginationQuery"
    />
    <lowcode-design ref="lowcodeDesign" @objectId="lowcodeId" />
    <!--检测项审核-->
    <el-dialog
      append-to-body
      :before-close="handleCloseAmis"
      center
      top="5vh"
      :visible.sync="management.dialog"
      width="80%"
    >
      <el-tabs v-model="managementactiveName">
        <el-tab-pane
          v-for="(item, index) in management.data"
          :key="index + 'i'"
          :label="item.title"
          :name="index + ''"
        >
          <dgiot-amis :schema="item.data" :show-help="false" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script src="../js/review.js"></script>
<style>
  .el-divider__text {
    font-size: 18px;
  }
</style>
