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
    <el-drawer
      v-drawerDrag
      append-to-body
      placement="right"
      size="50%"
      :visible="auditDialog"
      :with-header="false"
      :wrapper-closable="true"
      @close="auditDialog = false"
    >
      <vab-query-form style="margin: 10px 20px">
        <el-form ref="form" label-width="120px" :model="task">
          <el-form-item
            v-if="taskType == 'review'"
            label-width="0"
            style="float: left"
          >
            <el-button
              type="primary"
              @click="
                finishEvidence(task, Number($route.query.step) == 1 ? 2 : 3)
              "
            >
              {{ $translateTitle('application.submit') }}
            </el-button>
          </el-form-item>
          <el-form-item
            v-if="taskType == 'evidence'"
            label-width="0"
            style="float: left"
          >
            <el-button @click="notapproved(task, -1)">
              {{ $translateTitle('cloudTest.notapproved') }}
            </el-button>
            <el-button type="primary" @click="notapproved(task, 3)">
              {{ $translateTitle('cloudTest.Approved') }}
            </el-button>
          </el-form-item>
          <el-form-item
            :label="$translateTitle('cloudTest.report audit opinion')"
          >
            <el-input
              v-model="task.profile.message"
              :rows="2"
              style="width: 60%"
              type="textarea"
            />
            <!--            <el-button title="关闭" type="info" @click.native="clouseDraw">-->
            <!--              关闭-->
            <!--            </el-button>-->
          </el-form-item>
        </el-form>
      </vab-query-form>
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
            prop="row.original.path"
            show-overflow-tooltip
            sortable
            width="auto"
          >
            <template #default="{ row }">
              <!--              <vue-aliplayer-v2-->
              <!--                v-if="types.video.includes(`${row.original.type}`)"-->
              <!--                ref="VueAliplayerV2"-->
              <!--                :options="options"-->
              <!--                :source="$FileServe + row.original.path"-->
              <!--                style="margin: 0 auto"-->
              <!--              />-->
              <!--              <el-image-->
              <!--                v-else-if="types.image.includes(`${row.original.type}`)"-->
              <!--                :preview-src-list="[$FileServe + row.original.path]"-->
              <!--                :src="$FileServe + row.original.path"-->
              <!--                style="width: 50px; height: 50px"-->
              <!--              />-->
              <!--              <av-bars-->
              <!--                v-else-if="types.audio.includes(`${row.original.type}`)"-->
              <!--                :audio-src="$FileServe + row.original.path"-->
              <!--              />-->
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
            width="auto"
          >
            <template #default="{ row }">
              <el-tag effect="plain">
                {{ $translateTitle(`cloudTest.${row.original.type}`) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle('user.Remarks')"
            prop="row.original.remarks"
            sortable
            width="auto"
          >
            <template #default="{ row }">
              <el-input
                v-model="row.original.remarks"
                readonly
                :rows="2"
                type="textarea"
              />
            </template>
          </el-table-column>

          <el-table-column
            v-if="Number($route.query.step) == 1"
            align="center"
            :label="
              Number($route.query.step) == 1
                ? $translateTitle('concentrator.operation')
                : $translateTitle('cloudTest.single audit')
            "
            :width="Number($route.query.step) == 1 ? '220' : '420'"
          >
            <template #default="{ row, $index }">
              <el-button
                sizes="mini"
                type="danger"
                @click.native="deleteFile(row.objectId, $index, evidences)"
              >
                {{ $translateTitle('cloudTest.delete') }}
              </el-button>
              <el-button
                sizes="mini"
                type="success"
                @click.native="saveEvidences(row.objectId, $index, row)"
              >
                {{ $translateTitle('konva.save') }}
              </el-button>
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
          >
            <template #default="{ row }">
              <el-input
                v-model="row.original.message"
                :rows="2"
                type="textarea"
              />
            </template>
          </el-table-column>
        </el-table>
      </span>
    </el-drawer>
    <el-drawer
      v-drawerDrag
      append-to-body
      size="60%"
      :visible="evidenceDialog"
      :with-header="false"
      :wrapper-closable="false"
      @close="evidenceDialog = false"
    >
      <div>
        <vab-query-form style="margin: 10px 20px">
          <vab-query-form-left-panel
            v-if="evidenceList.id"
            v-show="Number($route.query.step) == 1"
          >
            <el-button
              class="el-icon-upload"
              title="取证"
              type="primary"
              @click.native="$refs.uploader.click()"
            >
              上传
            </el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel style="float: right">
            <el-button title="关闭" type="info" @click.native="clouseDraw">
              关闭
            </el-button>
          </vab-query-form-right-panel>
        </vab-query-form>

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
          prop="row.original.path"
          show-overflow-tooltip
          sortable
          width="auto"
        >
          <template #default="{ row }">
            <!--            <vue-aliplayer-v2-->
            <!--              v-if="types.video.includes(`${row.original.type}`)"-->
            <!--              ref="VueAliplayerV2"-->
            <!--              :options="options"-->
            <!--              :source="$FileServe + row.original.path"-->
            <!--            />-->
            <!--            <el-image-->
            <!--              v-else-if="types.image.includes(`${row.original.type}`)"-->
            <!--              :preview-src-list="[$FileServe + row.original.path]"-->
            <!--              :src="$FileServe + row.original.path"-->
            <!--              style="width: 50px; height: 50px"-->
            <!--            />-->
            <!--            <av-bars-->
            <!--              v-else-if="types.audio.includes(`${row.original.type}`)"-->
            <!--              :audio-src="$FileServe + row.original.path"-->
            <!--            />-->
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
          :label="$translateTitle('user.Remarks')"
          prop="row.original.remarks"
          sortable
          width="auto"
        >
          <template #default="{ row }">
            <el-input
              v-model="row.original.remarks"
              :rows="2"
              type="textarea"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$translateTitle('deviceLog.type')"
          prop="row.original.type"
          show-overflow-tooltip
          sortable
          width="auto"
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
          :width="Number($route.query.step) == 1 ? '220' : '420'"
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
            <el-button
              v-if="Number($route.query.step) == 1"
              sizes="mini"
              type="success"
              @click.native="saveEvidences(row.objectId, $index, row)"
            >
              {{ $translateTitle('konva.save') }}
            </el-button>
            <el-radio-group
              v-if="
                Number($route.query.step) !== 1 &&
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
              v-if="
                Number($route.query.step) !== 1 &&
                Number($route.query.step) != 3
              "
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
            <el-input
              v-model="row.original.message"
              size="mini"
              type="textarea"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="Number($route.query.step) == 3"
          align="center"
          :label="$translateTitle('application.submit')"
          width="auto"
        >
          <template #default="{ row }">
            <el-button plain @click.native="changeItem(row)">
              {{ $translateTitle('application.submit') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
        <span>
          <el-badge v-for="badge in badgePath" :key="badge.index" :value="3">
            <i class="material-icons" style="font-size: 12px; color: black">
              {{ badge.attrs.icon }}
            </i>
          </el-badge>
        </span>
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
