<!--
* @Author: h7ml
* @Date: 2021-11-25 14:31:08
* @LastEditors: h7ml
* @LastEditTime: 2021-11-25 14:31:08
* @Description: 组态取证
* @FilePath: src\views\CloudFunction\topo\evidence\index.vue
* @DocumentLink:
-->
<template>
  <el-container class="evidence">
    <el-drawer v-drawerDrag append-to-body :visible.sync="auditDialog">
      <span>
        <el-table border :data="auditList" size="mini" stripe>
          <el-table-column
            align="center"
            :label="$translateTitle('cloudTest.number')"
            prop="original.path"
            show-overflow-tooltip
            width="80"
          >
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle('cloudTest.evidence')"
            min-width="100"
            prop="original.path"
            width="auto"
          >
            <template #default="{ row }">
              <vue-aliplayer-v2
                v-if="types.video.includes(`${row.original.type}`)"
                ref="VueAliplayerV2"
                :options="options"
                :source="$FileServe + row.original.path"
              />
              <el-image
                v-else-if="types.image.includes(`${row.original.type}`)"
                :preview-src-list="[$FileServe + row.original.path]"
                :src="$FileServe + row.original.path"
                style="width: 50px; height: 50px"
              />
              <av-bars
                v-else-if="types.audio.includes(`${row.original.type}`)"
                :audio-src="$FileServe + row.original.path"
              />
              <el-link
                v-else-if="types.file.includes(`${row.original.type}`)"
                :href="$FileServe + row.original.path"
              >
                {{ $FileServe + row.original.path }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle('developer.filepath')"
            prop="original.path"
            show-overflow-tooltip
            width="auto"
          >
            <template #default="{ row }">
              <el-link :href="$FileServe + row.original.path" type="success">
                {{ row.original.path }}
              </el-link>
            </template>
          </el-table-column>

          <el-table-column
            v-if="taskType != 'review'"
            align="center"
            :label="$translateTitle('user.Current state')"
            prop="original.status"
            width="100"
          >
            <template #default="{ row }">
              <el-tag
                effect="dark"
                :type="
                  ['success', 'info', 'danger'][
                    row.original.status == '未审核'
                      ? 1
                      : row.original.status == '通过审核'
                      ? 0
                      : 2
                  ]
                "
              >
                {{ row.original.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="taskType != 'review'"
            align="center"
            fixed="right"
            :label="$translateTitle('cloudTest.single audit opinion')"
            prop="original.message"
            show-overflow-tooltip
          />
        </el-table>
        <el-form
          v-if="taskType != 'review'"
          ref="form"
          label-width="120px"
          :model="task"
        >
          <el-form-item
            :label="$translateTitle('cloudTest.report audit opinion')"
          >
            <el-input
              v-show="task.profile.message"
              v-model="task.profile.message"
            />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <div v-if="taskType == 'review'">
          <el-button
            type="primary"
            @click="
              finishEvidence(task, Number($route.query.step) == 1 ? 2 : 3)
            "
          >
            {{ $translateTitle('cloudTest.submit review') }}
          </el-button>
        </div>
        <div v-if="taskType == 'evidence'">
          <el-button @click="notapproved(task, -1)">
            {{ $translateTitle('cloudTest.notapproved') }}
          </el-button>
          <el-button type="primary" @click="notapproved(task, 3)">
            {{ $translateTitle('cloudTest.Approved') }}
          </el-button>
        </div>
      </span>
    </el-drawer>
    <el-drawer v-drawerDrag append-to-body :visible.sync="evidenceDialog">
      <el-card class="box-card" shadow="hover">
        <div
          v-if="evidenceList.id"
          v-show="Number($route.query.step) == 1"
          slot="header"
          class="clearfix"
        >
          <i class="material-icons" :title="evidenceList.node.attrs.icon">
            {{ evidenceList.node.attrs.icon }}
          </i>
          <i
            class="el-icon-upload"
            style="
              float: right;
              padding: 3px 0;
              font-size: 46px;
              cursor: pointer;
            "
            title="取证"
            @click="$refs.uploader.click()"
          />
          <input
            ref="uploader"
            accept="*"
            style="display: none"
            type="file"
            @change="doUpload($event, evidenceList.node.attrs.icon)"
          />
        </div>
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
            show-overflow-tooltip
            width="auto"
          >
            <template #default="{ row }">
              <vue-aliplayer-v2
                v-if="types.video.includes(`${row.original.type}`)"
                ref="VueAliplayerV2"
                :options="options"
                :source="$FileServe + row.original.path"
              />
              <el-image
                v-else-if="types.image.includes(`${row.original.type}`)"
                :preview-src-list="[$FileServe + row.original.path]"
                :src="$FileServe + row.original.path"
                style="width: 50px; height: 50px"
              />
              <av-bars
                v-else-if="types.audio.includes(`${row.original.type}`)"
                :audio-src="$FileServe + row.original.path"
              />
              <el-link
                v-else-if="types.file.includes(`${row.original.type}`)"
                :href="$FileServe + row.original.path"
              >
                {{ $FileServe + row.original.path }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle('deviceLog.type')"
            prop="row.original.type"
            show-overflow-tooltip
            sortable
            :width="120"
          >
            <template #default="{ row }">
              <el-tag effect="plain">
                {{ $translateTitle(`cloudTest.${row.original.type}`) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="
              Number($route.query.step) == 1
                ? $translateTitle('concentrator.operation')
                : $translateTitle('cloudTest.single audit')
            "
            :width="Number($route.query.step) == 1 ? '120' : '320'"
          >
            <template #default="{ row, $index }">
              <el-button
                v-if="Number($route.query.step) == 1"
                sizes="mini"
                type="danger"
                @click.native="deleteFile(row.objectId, $index, evidences)"
              >
                {{ $translateTitle('cloudTest.delete') }}
              </el-button>
              <el-radio-group
                v-if="
                  Number($route.query.step) > 1 &&
                  Number($route.query.step) != 4
                "
                v-model="row.original.status"
                size="mini"
              >
                <el-radio label="未审核">
                  {{ $translateTitle('cloudTest.Unreviewed') }}
                </el-radio>
                <el-radio label="通过审核">
                  {{ $translateTitle('cloudTest.Approved') }}
                </el-radio>
                <el-radio label="不通过审核">
                  {{ $translateTitle('cloudTest.notapproved') }}
                </el-radio>
              </el-radio-group>

              <el-tag
                v-else
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
    </el-drawer>
    <el-header class="evidence_header">
      <el-row class="evidence_header_row" :gutter="24">
        <el-col :lg="1" :md="1" :sm="1" title="检测详情" :xl="1" :xs="1">
          <el-button
            round
            size="mini"
            type="success"
            @click.native="asideShow = !asideShow"
          >
            <dgiot-icon color="red" icon="file-list-line" />
          </el-button>
        </el-col>
        <el-col :lg="22" :md="22" :sm="22" :xl="22" :xs="22">
          <p>
            <el-tooltip
              v-if="task.name"
              class="item"
              content="报告名称"
              effect="dark"
              placement="top-start"
            >
              <el-tag>{{ task.name }}</el-tag>
            </el-tooltip>
            <el-tooltip
              v-if="ukey"
              class="item"
              content="ukey"
              effect="dark"
              placement="top-start"
            >
              <el-tag effect="dark" title="ukey">{{ ukey }}</el-tag>
            </el-tooltip>
            <el-tooltip
              v-if="ukey"
              class="item"
              content="报告id"
              effect="dark"
              placement="top-start"
            >
              <el-tag effect="dark" title="objectId">
                {{ task.objectId }}
              </el-tag>
            </el-tooltip>
          </p>
        </el-col>
        <!--        <el-col :lg="2" :md="2" :sm="2" :xl="1" :xs="2">-->
        <!--          <el-button size="mini" type="success">-->
        <!--            {{ role[0].org_type }}-->
        <!--          </el-button>-->
        <!--        </el-col>-->
        <el-col :lg="1" :md="1" :sm="1" title="检测列表" :xl="1" :xs="1">
          <el-button
            v-show="!$route.query.disable"
            round
            size="mini"
            type="success"
            @click.native="taskFlag = !taskFlag"
          >
            <dgiot-icon color="red" icon="file-list-line" />
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-container
      v-loading="loading"
      class="evidence_container"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-spinner="el-icon-loading"
      :element-loading-text="$translateTitle('developer.Waitingtoreturn')"
    >
      <transition name="el-fade-in-linear">
        <el-aside v-show="asideShow" class="evidence_container_aside">
          <div
            v-for="(btn, index) in evidence"
            :key="btn.objectId"
            class="btns"
          >
            <el-button
              circle
              :type="btn.type.length ? btn.type : 'info'"
              @click.native="activeBtn(btn, index)"
            >
              {{ index + 1 }}
            </el-button>
          </div>
        </el-aside>
      </transition>
      <el-main class="evidence_main">
        <div id="konva" class="evidence_main_konva"></div>
      </el-main>
      <transition name="el-fade-in-linear">
        <el-aside
          v-show="taskFlag"
          style="
            width: 400px !important;
            height: 100vh;
            background: #fff;
            overflow: scroll;
          "
        >
          <div
            v-for="(item, index) in taskList"
            :key="item.objectId"
            :style="{ height: scrollerHeight }"
          >
            <el-card
              :shadow="
                $route.query.taskid == item.objectId ? 'always' : 'hover'
              "
              style="cursor: pointer"
              @click.native="headerTask(item, index)"
            >
              <el-descriptions
                border
                :column="2"
                direction="vertical"
                size="medium"
              >
                <el-descriptions-item label="检测任务">
                  <el-tag
                    :type="
                      $route.query.taskid == item.objectId ? 'success' : 'info'
                    "
                  >
                    {{ item.name }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="检测进度">
                  <el-tag
                    v-if="item.profile.step == -1"
                    effect="dark"
                    type="warning"
                  >
                    {{ $translateTitle('cloudTest.notapproved') }}
                  </el-tag>
                  <el-tag
                    v-if="item.profile.step != -1"
                    effect="dark"
                    :type="
                      ['info', 'warning', 'primary', 'primary'][
                        item.profile.step ? item.profile.step : 0
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
                      ][item.profile.step] ||
                      $translateTitle('product.finishtest')
                    }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="任务id">
                  {{ item.objectId }}
                </el-descriptions-item>
                <el-descriptions-item label="检测台体">
                  {{ item.detail.brand }}
                </el-descriptions-item>
                <el-descriptions-item label="开始时间">
                  {{ utc2beijing(item.createdAt) }}
                </el-descriptions-item>
                <el-descriptions-item label="设备地址">
                  {{ item.devaddr }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </div>
          <vab-parser-pagination
            ref="pagination"
            :pagination="paginations"
            :query-payload="queryPayload"
            @pagination="fetchData"
            @paginationQuery="paginationQuery"
          />
        </el-aside>
      </transition>
    </el-container>
    <el-footer v-if="task.name" class="evidence_footer">
      <el-row :gutter="10">
        <el-col :lg="3" :md="2" :sm="3" :xl="1" :xs="4">
          <el-button
            v-if="Number($route.query.step) == 1"
            round
            type="success"
            @click.native="auditQuery(1, 'review')"
          >
            {{
              $translateTitle(
                `${
                  Number($route.query.step) == 1
                    ? 'cloudTest.submit review'
                    : 'cloudTest.audit opinion'
                }`
              )
            }}
          </el-button>
          <el-button
            v-if="Number($route.query.step) == 3"
            round
            type="success"
            @click.native="auditQuery(1, 'evidence')"
          >
            {{ $translateTitle('cloudTest.audit opinion') }}
          </el-button>
        </el-col>
        <el-col :lg="16" :md="13" :sm="11" :xl="18" :xs="10">
          <el-link
            v-if="$route.query.message && Number($route.query.step) != 5"
            type="warning"
            :underline="false"
          >
            {{ $translateTitle('cloudTest.The reason is not reviewed') }}：
            {{ $route.query.message }}
          </el-link>
          <el-link
            v-if="Number($route.query.step) == 3"
            type="success"
            :underline="false"
          >
            {{ task.profile.message || '' }}
          </el-link>
        </el-col>
        <el-col
          v-if="Number($route.query.step) != 1"
          :lg="4"
          :md="9"
          :sm="10"
          :xl="4"
          :xs="10"
        >
          <el-badge
            type="warning"
            :value="badge.Unreviewed.length"
            @click.native="evidenceClick(badge.Unreviewed)"
          >
            <el-button circle size="mini" type="warning">
              {{ $translateTitle('cloudTest.Unreviewed') }}
            </el-button>
          </el-badge>
          <el-badge
            type="primary"
            :value="badge.Approved.length"
            @click.native="evidenceClick(badge.Approved)"
          >
            <el-button circle size="mini" type="primary">
              {{ $translateTitle('cloudTest.Approved') }}
            </el-button>
          </el-badge>
          <el-badge
            type="danger"
            :value="badge.notapproved.length"
            @click.native="evidenceClick(badge.notapproved)"
          >
            <el-button circle size="mini" type="danger">
              {{ $translateTitle('cloudTest.notapproved') }}
            </el-button>
          </el-badge>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>
<script src="../js/evidence.js"></script>

<style lang="scss" scoped>
  .evidence {
    color: #fff;
    .el-header {
      line-height: 60px;
      text-align: center;
      background-color: #027be3;
    }
    .el-footer {
      line-height: 60px;
      text-align: center;
      background-color: #027be3;
    }

    .el-aside {
      width: 60px !important;
      color: #333;
      text-align: center;
      background-color: #d3dce6;
    }

    .el-main {
      line-height: 160px;
      color: #333;
      text-align: center;
    }

    body > .el-container {
      margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
      line-height: 280px;
    }

    .el-container:nth-child(7) .el-aside {
      line-height: 320px;
    }
  }
  .evidence {
    padding: 0px !important;
    &_header {
      &_row {
        text-align: center;
        i {
          cursor: pointer;
        }
      }
    }
    &_container {
      height: 80vh;
      &_aside {
        .btns {
          display: grid;
          button {
            width: 30px;
            height: 30px;
            margin: 20px auto;
            font-size: 18px;
            line-height: 15px;
            text-align: center;
          }
        }
      }
    }
    &_main {
      &_konva {
        display: inline-block;
        overflow: scroll;
      }
    }
    &_footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      text-align: left !important;
    }
  }
</style>
