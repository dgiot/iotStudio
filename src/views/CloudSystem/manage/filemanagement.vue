<template>
  <div class="resourcechannel resourcechannel-container">
    <div class="firsttable">
      <vab-input
        ref="uploadFinish"
        :params="inputParams"
        @fileInfo="fileInfo"
        @files="files"
      />
      <el-form
        class="demo-form-inline"
        :inline="true"
        :model="fileParams"
        size="small"
      >
        <el-form-item :label="$translateTitle('application.scene')">
          <el-input v-model="fileParams.scene" />
        </el-form-item>
        <el-form-item :label="$translateTitle('developer.path')">
          <el-input
            v-model="fileParams.path"
            :placeholder="$translateTitle('application.pathdescription')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="uploadCkick()">
            {{ $translateTitle('application.uploadfile') }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-breadcrumb separator="/">
        <template v-for="(item, index) in filebreadcrumb">
          <el-breadcrumb-item
            :key="index"
            @click.native="breadcrumbClick(item)"
          >
            {{ item.name }}
          </el-breadcrumb-item>
        </template>
      </el-breadcrumb>
      <h5></h5>
      <!----------------------------------------------------文件表格------------------>
      <el-table
        ref="tableRef"
        v-loading="listLoading"
        :cell-style="{ 'text-align': 'center' }"
        :data="filelist"
        :header-cell-style="{ 'text-align': 'center' }"
        style="width: 100%"
        @row-click="fileclick"
      >
        <el-table-column
          :label="$translateTitle('developer.filename')"
          prop="name"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          :label="$translateTitle('developer.filesize')"
          prop="name"
          show-overflow-tooltip
          sortable
          width="200"
        >
          <template #default="{ row }">
            <span v-if="row.is_dir">{{ '-' }}</span>
            <span v-else>{{ Math.round(row.size / 1024) + 'kb' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$translateTitle('developer.filemtime')"
          prop="name"
          show-overflow-tooltip
          sortable
          width="260"
        >
          <template #default="{ row }">
            <span>
              {{ $moment(row.mtime * 1000).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$translateTitle('developer.operation')"
          width="300"
        >
          <template #default="{ row }">
            <el-button
              v-if="!row.is_dir"
              size="mini"
              type="primary"
              @click.native.stop="get_fileinfo(row)"
            >
              <!-- 详情 -->
              {{ $translateTitle('application.detail') }}
            </el-button>
            <el-button
              v-if="!row.is_dir"
              size="mini"
              type="primary"
              @click.native.stop="download_file(row)"
            >
              <!-- 下载 -->
              {{ $translateTitle('application.preview') }}
            </el-button>
            <el-button
              v-if="!row.is_dir"
              slot="reference"
              size="mini"
              type="danger"
              @click.native.stop="delete_file(row)"
            >
              {{ $translateTitle('developer.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :model="detailinfo"
        title="文件信息"
        :visible.sync="detailView"
        width="30%"
      >
        <el-form v-loading="ViewLoading">
          <el-form-item label="名称" label-width="200">
            <span>{{ detailinfo.rename }}</span>
          </el-form-item>
          <el-form-item label="路径" label-width="200">
            <span>{{ detailinfo.path }}</span>
          </el-form-item>
          <el-form-item label="url" label-width="200">
            <span>{{ detailinfo.url }}</span>
          </el-form-item>
          <el-form-item label="MD5" label-width="200">
            <span>{{ detailinfo.md5 }}</span>
          </el-form-item>
          <el-form-item label="场景" label-width="200">
            <span>{{ detailinfo.scene }}</span>
          </el-form-item>
          <el-form-item label="大小" label-width="200">
            <span>{{ Math.round(detailinfo.size / 1024) + 'kb' }}</span>
          </el-form-item>
          <el-form-item label="日期" label-width="200">
            <span>
              {{
                $moment(detailinfo.timeStamp * 1000).format(
                  'YYYY-MM-DD HH:mm:ss'
                )
              }}
            </span>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { delete_file, file_info, list_dir } from '@/api/System/filemanagement'

  export default {
    data() {
      return {
        filelist: [],
        filebreadcrumb: [
          {
            name: '全部文件',
            path: 'dgiot_file',
            is_dir: true,
          },
        ],
        fileParams: { scene: 'app' },
        inputParams: {},
        parentfile: 'dgiot_file',
        listLoading: false,
        ViewLoading: false,
        detailView: false,
        detailinfo: {},
      }
    },
    watch: {},
    mounted() {
      this.get_filelist(this.parentfile)
    },
    methods: {
      breadcrumbClick(row) {
        if (row.name == '全部文件') {
          this.filebreadcrumb = [
            {
              name: '全部文件',
              path: 'dgiot_file',
            },
          ]
          this.get_filelist(row.path)
        } else {
          if (row.child) {
            for (var i = 0; i < this.filebreadcrumb.length; i++) {
              if (this.filebreadcrumb[i].path == row.child.path) {
                this.filebreadcrumb.splice(i, 1)
              }
            }
          }
          this.get_filelist(row.path + '/' + row.name)
        }
      },
      fileclick(row) {
        dgiotlog.log(row)
        if (row.is_dir) {
          this.get_filelist(row.path + '/' + row.name)
          const len = this.filebreadcrumb.length - 1
          var key = 'child'
          this.filebreadcrumb[len][key] = row
          this.filebreadcrumb.push(row)
        } else {
          window.open(this.$FileServe + '/' + row.path + '/' + row.name)
        }
      },
      uploadCkick() {
        this.loading = true
        // 触发子组件的点击事件
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
        this.inputParams = {
          file: '',
          scene: this.fileParams.scene ? this.fileParams.scene : 'default',
          path: this.fileParams.path ? this.fileParams.path : 'default',
          filename: moment(new Date()).valueOf().toString(),
        }
      },
      fileInfo(info) {
        this.listLoading = true
        if (info.url) {
          this.$message({
            type: 'success',
            message: '上传成功',
          })
          this.get_filelist(this.parentfile)
        } else {
          this.$message({
            type: 'error',
            message: '上传失败',
          })
        }
        this.listLoading = false
      },
      files(file) {
        this.inputParams.filename = file.name
        this.inputParams.file = file
      },
      get_filelist(path) {
        this.listLoading = true
        list_dir(path).then((res) => {
          if (res.status == 'ok') {
            this.filelist = res.data
          } else {
            this.filelist = []
          }
          this.listLoading = false
        })
      },
      get_fileinfo(row) {
        this.detailView = true
        this.ViewLoading = true
        file_info('files/' + row.path + '/' + row.name).then((res) => {
          this.detailinfo = res.data
          this.detailinfo.url =
            this.$FileServe + '/' + row.path + '/' + row.name
          this.ViewLoading = false
        })
      },
      delete_file(row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            delete_file('files/' + row.path + '/' + row.name)
              .then((res) => {
                if (res.status == 'ok') {
                  this.$message({
                    type: 'success',
                    message: '删除成功',
                  })
                  this.get_filelist(row.path)
                } else {
                  this.$message({
                    type: 'error',
                    message: res.message,
                  })
                }
              })
              .catch(() => {
                this.$message({
                  type: 'error',
                  message: '删除失败',
                })
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },
      download_file(row) {
        window.open(this.$FileServe + '/' + row.path + '/' + row.name)
      },
    },
  }
</script>
<style lang="scss">
  .dgiot_dialog {
    .el-dialog__header {
      display: none;
    }

    .dj-dialog-content {
      padding: 0;
      overflow: unset;
    }
  }
</style>
<style lang="scss" scoped>
  .el-button--goon.is-active,
  .el-button--goon:active {
    color: #fff;
    background: #20b2aa;
    border-color: #20b2aa;
  }

  .el-button--goon:focus,
  .el-button--goon:hover {
    color: #fff;
    background: #48d1cc;
    border-color: #48d1cc;
  }

  .el-button--goon {
    color: #fff;
    background-color: #20b2aa;
    border-color: #20b2aa;
  }

  ::v-deep .row-bg {
    .el-form-item {
      .el-form-item__content {
        position: revert;
        //width: 100%;
      }
    }
  }

  ::v-deep .el-dialog__wrapper {
    margin-bottom: 20px;
  }

  .resourcechannel {
    box-sizing: border-box;
    width: 100%;
    //height: 100%;
    height: calc(100vh - #{$base-top-bar-height} * 3 - 25px);

    ::v-deep {
      .green_active {
        color: green;
      }

      .dialog-footer {
        text-align: center;
      }
    }

    ::v-deep .red_active {
      color: red;
    }

    //::v-deep .el-button + .el-button {
    //  margin-left: 0;
    //}

    ::v-deep .el-tabs__item {
      height: 50px;
      margin: 0;
      margin-top: 20px;
      font-family: auto;
      font-size: 16px;
      line-height: 50px;
    }

    ::v-deep .el-dialog__header {
      border-bottom: 1px solid #cccccc;
    }

    ::v-deep .el-dialog__body {
      .el-form {
        display: flex;
        flex-wrap: wrap;

        .el-form-item {
          width: 100%;
          margin-bottom: 22px;

          .el-select {
            width: 100%;
          }
        }

        .el-col {
          @media screen and (max-width: 1350px) {
            width: 100%;
          }
        }
      }

      ::v-deep .el-row {
        margin: 20px 0;
      }
    }

    //::v-deep .el-button--mini {
    //  margin: 2px 0;
    //}
  }
</style>
