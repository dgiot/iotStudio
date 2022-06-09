<template>
  <div id="application dgiot-container">
    <dgiot-query-form-top-panel>
      <el-form ref="form" :inline="true" label-width="0">
        <el-form-item>
          <el-input
            v-model="name"
            :placeholder="$translateTitle('application.applicationname')"
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="getAppMange(0)">
            {{ $translateTitle('application.search') }}
          </el-button>
        </el-form-item>
      </el-form>
    </dgiot-query-form-top-panel>
    <el-table
      :cell-style="{ 'text-align': 'center' }"
      :data="tableData"
      :header-cell-style="{ 'text-align': 'center' }"
      :height="tableHeight"
      style="width: 100%"
    >
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
      <!-- 应用单位 -->
      <el-table-column
        :label="$translateTitle('developer.Applicationunit')"
        prop="userUnit"
      />
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
        flex="right"
        :label="$translateTitle('developer.operation')"
        prop="operation"
        width="350"
      >
        <template #default="{ row, $index }">
          <el-popover :ref="`popover-${$index}`" placement="top" width="300">
            <p>
              {{ $translateTitle('product.qdsczg') }}{{ row.name
              }}{{ $translateTitle('equipment.yym') }}
            </p>
            <div style="margin: 0; text-align: right">
              <el-button
                size="mini"
                @click="row._self.$refs[`popover-${$index}`].doClose()"
              >
                {{ $translateTitle('developer.cancel') }}
              </el-button>
              <el-button
                size="mini"
                type="primary"
                @click="makeSure(scope, $index)"
              >
                {{ $translateTitle('developer.determine') }}
              </el-button>
            </div>
            <el-link
              slot="reference"
              icon="el-icon-delete"
              type="danger"
              :underline="false"
            >
              {{ $translateTitle('developer.delete') }}
            </el-link>
          </el-popover>
          <el-button
            icon="el-icon-edit"
            size="small"
            type="text"
            @click="handleClickUpdate(scope)"
          >
            {{ $translateTitle('developer.edit') }}
          </el-button>
          <el-button size="small" type="text" @click="Gotoproduct(scope)">
            <i class="el-icon-s-management" />
            <!-- 管理 -->
            {{ $translateTitle('leftbar.management') }}
          </el-button>
          <el-link
            type="primary"
            :underline="false"
            @click="applicationDeployment(row)"
          >
            <!-- 部署 -->
            {{ $translateTitle('developer.deploy') }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page.currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :page-size="page.pageSize"
      :page-sizes="page.pageSizes"
      :total="page.total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
  import { queryDevice } from '@/api/Device/index'
  import { delProduct, getProduct } from '@/api/Product'
  import { utc2beijing } from '@/utils'

  export default {
    data() {
      return {
        tableHeight: this.$baseTableHeight(0),
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
      handleClickVisit(scope, $index) {
        const index = $index
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
          count: 'objectId',
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
      handleClickLook(scope, $index) {
        const index = $index
        dgiotlog.log(scope)
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
                    <td>${row.objectId}</td>
                </tr>
                <tr ">
                     <td style="color: #74777a;
                    font-weight: 400;
                    background: #fafafc;
                    width:200px;
                    padding-top:20px;
                    font-weight:bold;">App Secret:
                    </td>
                    <td style="padding-top:20px;">${row.secret}</td>
                </tr>
                </table>
            `
        this.$alert(html, '应用详情', {
          dangerouslyUseHTMLString: true,
        })
      },
      // 跳转修改
      handleClickUpdate(scope) {
        const row = scope
        dgiotlog.log('$row', row)

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

      makeSure(scope, $index) {
        const params = {
          count: 'objectId',
          skip: 0,
          limit: 1,
          where: {
            product: row.objectId,
          },
        }
        queryDevice(params)
          .then((results) => {
            // dgiotlog.log(results, "jkjjjj")
            if (results.count > 0) {
              this.$message('请先删除该产品下设备')
              return
            } else {
              getProduct(row.objectId)
                .then((results) => {
                  dgiotlog.log(results)
                  delProduct(row.objectId)
                    .then((response) => {
                      if (response) {
                        this.$message({
                          showClose: true,
                          duration: 2000,
                          type: 'success',
                          message: '删除成功',
                        })
                        scope._self.$refs[`popover-${$index}`].doClose()
                        this.getAppMange()
                      }
                    })
                    .catch((e) => {
                      dgiotlog.log('delProduct ', e.error)
                    })
                })
                .catch((e) => {
                  dgiotlog.log('getProduct ', e.error)
                })
            }
          })
          .catch((e) => {
            dgiotlog.log('queryDevice ', e.error)
          })
      },

      Gotoproduct(scope) {
        var projectRoles = []
        for (var key in row.acl) {
          dgiotlog.log(key.substring(5))
          projectRoles.push(key.substring(5))
        }
        this.$store.dispatch('setProjectRole', projectRoles)

        this.$router.push({
          path: '/roles/product',
          query: {
            project: row.objectId,
          },
        })
      },
      serverlictool(row) {
        dgiotlog.log(row)
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
    margin: 0 auto;

    ::v-deep .el-tabs {
    }
  }
</style>
