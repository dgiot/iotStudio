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
        <div slot="header" class="clearfix">
          <i class="material-icons">
            {{ evidenceList.node.attrs.icon }}
          </i>
          <el-button style="float: right; padding: 3px 0" type="text">
            {{ evidenceList.id ? evidenceList.id.split('_')[0] : '' }}
          </el-button>
        </div>
        <div>
          <div
            v-if="
              evidenceList.node.attrs.icon === 'video' ||
              evidenceList.node.attrs.icon === 'personal_video'
            "
          >
            <div v-for="(item, index) in evidences" :key="index">
              <vue-aliplayer-v2 :source="$FileServe + item.original.path" />
            </div>
          </div>
          <div
            v-else-if="
              evidenceList.node.attrs.icon === 'audio' ||
              evidenceList.node.attrs.icon === 'volume_up'
            "
          >
            <div v-for="(item, index) in evidences" :key="index">
              <av-bars :audio-src="$FileServe + item.original.path" />
            </div>
          </div>
          <div v-else-if="evidenceList.node.attrs.icon === 'image'">
            <div v-for="(item, index) in evidences" :key="index">
              <el-image
                :preview-src-list="[$FileServe + item.original.path]"
                :src="$FileServe + item.original.path"
                style="width: 100px; height: 100px"
              />
            </div>
          </div>
          <div
            v-else-if="
              evidenceList.node.attrs.icon === 'file' ||
              evidenceList.node.attrs.icon === 'archive'
            "
          >
            <div v-for="(item, index) in evidences" :key="index">
              {{ $FileServe + item.original.path }}
            </div>
          </div>
          <input
            ref="uploader"
            accept="image/*"
            type="file"
            @change="doUpload($event, evidenceList.node.attrs.icon)"
          />
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="evidenceDialog = false">取 消</el-button>
        <el-button type="primary" @click="evidenceDialog = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <el-header class="evidence_header">
      <el-row class="evidence_header_row" :gutter="24">
        <el-col :lg="1" :md="1" :sm="1" :xl="1" :xs="1">
          <el-button
            plain
            size="mini"
            type="success"
            @click.native="asideShow = !asideShow"
          >
            <dgiot-icon color="red" icon="file-list-line" />
          </el-button>
        </el-col>
        <el-col :lg="22" :md="22" :sm="22" :xl="22" :xs="22">
          <p>{{ task.name }}</p>
        </el-col>
        <!--        <el-col :lg="2" :md="2" :sm="2" :xl="1" :xs="2">-->
        <!--          <el-button size="mini" type="success">-->
        <!--            {{ role[0].org_type }}-->
        <!--          </el-button>-->
        <!--        </el-col>-->
        <el-col :lg="1" :md="1" :sm="1" :xl="1" :xs="1">
          <el-button
            plain
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
    <!--    <el-footer class="evidence_footer">Footer</el-footer>-->
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
      background-color: #e9eef3;
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
  }
</style>
