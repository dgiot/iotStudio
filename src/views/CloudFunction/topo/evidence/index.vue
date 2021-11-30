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
    <el-dialog append-to-body :visible.sync="evidenceDialog">
      <el-card v-if="evidenceList.id" class="box-card" shadow="hover">
        <div
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
                :autoplay="false"
                height="290"
                :source="$FileServe + row.original.path"
                width="290"
              />
              <el-image
                v-else-if="types.image.includes(`${row.original.type}`)"
                :preview-src-list="[$FileServe + row.original.path]"
                :src="$FileServe + row.original.path"
                style="width: 100px; height: 100px"
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
              <el-radio-group v-else v-model="row.original.status" size="mini">
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
            </template>
          </el-table-column>

          <el-table-column
            v-if="Number($route.query.step) == 3"
            align="center"
            :label="$translateTitle('cloudTest.audit opinion')"
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
          <p>{{ task.name }}</p>
          <el-tag v-if="ukey" effect="dark" title="ukey">{{ ukey }}</el-tag>
        </el-col>
        <!--        <el-col :lg="2" :md="2" :sm="2" :xl="1" :xs="2">-->
        <!--          <el-button size="mini" type="success">-->
        <!--            {{ role[0].org_type }}-->
        <!--          </el-button>-->
        <!--        </el-col>-->
        <el-col :lg="1" :md="1" :sm="1" title="检测列表" :xl="1" :xs="1">
          <el-button
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
          style="width: 300px !important; background: #fff"
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
              @click.native="headerTask(item, index)"
            >
              <div slot="header" class="clearfix">
                <span>{{ item.name }}</span>
              </div>
              {{ item.detail.brand }}
              <br />
              {{ item.profile.testbed }}
              <br />
              {{ item.createdAt }}
              <br />
              {{ item.devaddr }}
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
        <el-col :lg="3" :md="4" :sm="6" :xl="1" :xs="8">
          <el-button
            round
            type="success"
            @click.native="
              finishEvidence(task, Number($route.query.step) == 1 ? 2 : 3)
            "
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
        </el-col>
        <el-col :lg="9" :md="8" :sm="6" :xl="11" :xs="4" />
        <el-col :lg="9" :md="8" :sm="6" :xl="11" :xs="4" />
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
      line-height: 260px;
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
    }
  }
</style>
