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
    <el-header class="evidence_header">
      <el-row class="evidence_header_row" :gutter="24">
        <el-col :span="1">
          <dgiot-icon
            color="red"
            icon="file-list-line"
            @click="asideShow = !asideShow"
          />
        </el-col>
        <el-col :span="23">{{ task.name }}</el-col>
      </el-row>
    </el-header>
    <el-container
      v-loading="loading"
      class="evidence_container"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-spinner="el-icon-loading"
      :element-loading-text="$translateTitle('developer.Waitingtoreturn')"
    >
      <el-aside v-show="asideShow" class="evidence_container_aside">
        <div v-for="(btn, index) in evidence" :key="btn.objectId" class="btns">
          <el-button
            circle
            :type="btn.type.length ? btn.type : 'info'"
            @click.native="activeBtn(btn)"
          >
            {{ index + 1 }}
          </el-button>
        </div>
      </el-aside>
      <el-main class="evidence_main">
        <div id="konva" class="evidence_main_konva"></div>
      </el-main>
    </el-container>
    <el-footer class="evidence_footer">Footer</el-footer>
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
      line-height: 200px;
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
