<template>
  <div id="application">
    <el-tabs v-model="activeName">
      <el-tab-pane label="应用管理" name="app">
        <div class="form">
          <div class="search">
            <el-input
              v-model="name"
              :placeholder="$translateTitle('application.applicationname')"
              size="small"
            />
            <el-button type="primary" size="small" @click="getAppMange(0)">
              {{ $translateTitle('application.search') }}
            </el-button>
          </div>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <!-- 应用标识 -->
          <el-table-column
            :label="$translateTitle('application.applicationidentification')"
            prop="productIdentifier"
          />
          <!-- 应用名称 -->
          <el-table-column
            :label="$translateTitle('application.applicationname')"
            prop="title"
          />
          <el-table-column prop="userUnit" label="应用单位" />
          <!-- 服务规模 -->
          <el-table-column
            :label="$translateTitle('application.scaleofservice')"
            prop="scale"
            sortable
          />
          <!-- 所属行业 -->
          <el-table-column
            :label="$translateTitle('application.industrytype')"
            prop="category"
          />

          <el-table-column
            :label="$translateTitle('application.createtime')"
            prop="creation_time"
          />
          <el-table-column
            :label="$translateTitle('developer.operation')"
            prop="operation"
            width="350"
          >
            <template slot-scope="scope">
              <el-popover
                :ref="`popover-${scope.$index}`"
                placement="top"
                width="300"
              >
                <p>确定删除这个{{ scope.row.name }}应用吗？</p>
                <div style="margin: 0; text-align: right">
                  <el-button
                    size="mini"
                    @click="
                      scope._self.$refs[`popover-${scope.$index}`].doClose()
                    "
                  >
                    {{ $translateTitle('developer.cancel') }}
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="makeSure(scope)"
                  >
                    {{ $translateTitle('developer.determine') }}
                  </el-button>
                </div>
                <el-link
                  slot="reference"
                  :underline="false"
                  icon="el-icon-delete"
                  type="danger"
                >
                  {{ $translateTitle('developer.delete') }}
                </el-link>
              </el-popover>
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="handleClickUpdate(scope)"
              >
                {{ $translateTitle('developer.edit') }}
              </el-button>
              <el-button type="text" size="small" @click="Gotoproduct(scope)">
                <i class="el-icon-s-management" />
                管理
              </el-button>
              <el-link
                :underline="false"
                type="primary"
                @click="applicationDeployment(scope.row)"
              >
                部署
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page.currentPage"
          :page-sizes="page.pageSizes"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { queryDevice } from '@/api/Device/index'
  import { delProduct, getProduct } from '@/api/Product'
  import { utc2beijing } from '@/utils'
  import { setUpLictool, getProject, handleZero } from '@/api/License/index'
  export default {
    data() {
      return {
        // tab标题
        label: '我的应用',
        // 初始页
        activeName: 'app',
        // 查看模态框
        dialogVisible: false,
        // 应用名称
        name: '',
        // 分页
        page: {
          currentPage: 0,
          pageSizes: [10, 20, 30],
          pageSize: 10,
          total: 0,
        },
        // 提示文本
        description: '暂无数据',
        // 表格
        tableData: [],
        // 查看展开
        isShow: false,
        arr: [],
      }
    },
    created() {
      this.getAppMange()
    },
    methods: {
      // 访问
      handleClickVisit(scope) {
        const index = scope.$index
        const productIdentifier = this.tableData[index].productIdentifier
        const url =
          window.location.origin + '/iot/' + productIdentifier + '#/login'
        window.open(url, '__blank')
      },
      // 查询应用信息
      getAppMange(start) {
        if (start == 0) {
          this.page.currentPage = 0
        }
        this.tableData = []
        const where = {}
        if (this.name) {
          where.title = this.name
        }
        getProject({
          limit: this.page.pageSize,
          skip: this.page.currentPage,
          keys: 'count(*)',
          where,
        }).then((res) => {
          const r = res.results
          this.label = `我的应用(${res.count})`
          this.description = `获取${r.length}条数据`
          this.page.total = res.count
          for (let i = 0; i < r.length; i++) {
            const obj = {}
            obj.name = r[i].title
            obj.objectId = r[i].objectId
            obj.productIdentifier = r[i].productIdentifier
            obj.scale = handleZero(r[i].scale)
            obj.creation_time = utc2beijing(r[i].createdAt)
            obj.end_time = utc2beijing(r[i].updatedAt)
            obj.category = r[i].category
            obj.secret = r[i].secret
            obj.logo = r[i].logo
            obj.title = r[i].title
            obj.userUnit = r[i].userUnit
            obj.dashboard = r[i].dashboard
            obj.background = r[i].background
            obj.acl = r[i].ACL
            obj.desc = r[i].desc
            obj.copyright = r[i].copyright

            this.tableData.push(obj)
          }
        })
      },
      handleSizeChange(val) {
        this.page.pageSize = val
        this.getAppMange()
      },
      handleCurrentChange(val) {
        this.page.currentPage = (val - 1) * this.page.pageSize
        this.getAppMange()
      },
      // 查看
      handleClickLook(scope) {
        const index = scope.$index
        console.log(scope)
        const html = `
            <table
                class="mailtable"
                style="width:100%;"
                border="0"
                cellspacing="0"
                cellpadding="0"
              >
                <tr>
                    <td style="text-align:left;
                    color: #74777a;
                    font-weight: 400;
                    background: #fafafc;
                    width:200px;
                    font-weight:bold;">App Id:</td>
                    <td>${scope.row.objectId}</td>
                </tr>
                <tr ">
                     <td style="color: #74777a;
                    font-weight: 400;
                    background: #fafafc;
                    width:200px;
                    padding-top:20px;
                    font-weight:bold;">App Secret:
                    </td>
                    <td style="padding-top:20px;">${scope.row.secret}</td>
                </tr>
                </table>
            `
        this.$alert(html, '应用详情', {
          dangerouslyUseHTMLString: true,
        })
      },
      // 跳转修改
      handleClickUpdate(scope) {
        const row = scope.row
        console.log('$row', row)

        this.$router.push({
          path: '/applicationManagement/addApp',
          query: {
            actionType: 'update',
            title: '修改应用',
            name: row.name,
            scale: row.scale,
            creation_time: row.creation_time,
            end_time: row.end_time,
            category: row.category,
            productIdentifier: row.productIdentifier,
            secret: row.secret,
            objectId: row.objectId,
            logo: row.logo,
            userUnit: row.userUnit,
            dashboard: row.dashboard,
            background: row.background,
            // acl:this.$getFirstKey(row.acl),
            desc: row.desc,
            copyright: row.copyright,
          },
        })
      },

      makeSure(scope) {
        const params = {
          keys: 'count(*)',
          skip: 0,
          limit: 1,
          where: {
            product: scope.row.objectId,
          },
        }
        queryDevice(params)
          .then((results) => {
            // console.log(results, "jkjjjj")
            if (results.count > 0) {
              this.$message('请先删除该产品下设备')
              return
            } else {
              getProduct(scope.row.objectId)
                .then((results) => {
                  console.log(results)
                  delProduct(scope.row.objectId)
                    .then((response) => {
                      if (response) {
                        this.$message({
                          type: 'success',
                          message: '删除成功',
                        })
                        scope._self.$refs[`popover-${scope.$index}`].doClose()
                        this.getAppMange()
                      }
                    })
                    .catch((e) => {
                      console.log('delProduct ', e.error)
                    })
                })
                .catch((e) => {
                  console.log('getProduct ', e.error)
                })
            }
          })
          .catch((e) => {
            console.log('queryDevice ', e.error)
          })
      },

      Gotoproduct(scope) {
        var projectRoles = []
        for (var key in scope.row.acl) {
          console.log(key.substring(5))
          projectRoles.push(key.substring(5))
        }
        this.$store.dispatch('setProjectRole', projectRoles)

        this.$router.push({
          path: '/roles/product',
          query: {
            project: scope.row.objectId,
          },
        })
      },
      serverlictool(row) {
        console.log(row)
        this.$router.push({
          path: '/roles/server_control',
          query: {
            appid: row.objectId,
            appsecret: row.secret,
          },
        })
      },
      applicationDeployment(row) {
        if (!row.name) {
          this.$message('没有应用名')
          return
        }
        setUpLictool(row.name)
          .then((resultes) => {
            if (resultes) {
              this.$message('正在部署中')
            }
          })
          .catch((error) => {
            this.$message(error)
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
  #application {
    box-sizing: border-box;
    width: 100%;
    padding: 20px;
    margin: 0 auto;
    ::v-deep .el-tabs {
      .el-tabs__header {
        margin: 0;
        .el-tabs__item {
          font-size: 16px;
        }
      }
      .el-tabs__content {
        padding: 15px;
        background: #f4f4f4;
        .form {
          display: flex;
          justify-content: space-between;
          padding: 20px 15px;
          background: #fff;
          .search {
            display: flex;
            button {
              margin-left: 5%;
            }
          }
        }
      }
      .el-table {
        .el-divider {
          width: 2px;
          background-color: #409eff;
        }
        .el-button + .el-button {
          margin-left: 0;
        }
      }
    }
  }
</style>
