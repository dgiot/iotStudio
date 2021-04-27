<!--
 * @Author: h7ml
 * @Date: 2021-02-02 17:52:06
 * @LastEditTime: 2021-03-15 12:42:33
 * @LastEditors: h7ml
 * @Description: In User Settings Edit
 * @FilePath: \dgiot_dashboard\src\views\equipment_management\platform_overview.vue
-->
<template>
  <div class="platform">
    <el-tabs v-model="activeName">
      <el-row>
        <el-col
          :lg="{ span: '4-8' }"
          class="card-panel-col"
          :xs="24"
          :sm="24"
          :md="8"
          :xl="4"
        >
          <el-card class="box-card">
            <el-col :span="12" class="card-left">
              <vab-icon icon="projector-2-fill" />
            </el-col>
            <el-col :span="12" class="card-right">
              <p>{{ $translateTitle('home.app_count') }}</p>
              <p>{{ project_count }}</p>
            </el-col>
          </el-card>
        </el-col>
        <el-col
          :lg="{ span: '4-8' }"
          class="card-panel-col"
          :xs="24"
          :sm="24"
          :md="8"
          :xl="4"
        >
          <el-card class="box-card">
            <el-col :span="12">
              <vab-icon icon="projector-fill" />
            </el-col>
            <el-col :span="12" class="card-right">
              <p>{{ $translateTitle('home.pro_count') }}</p>
              <p>{{ product_count }}</p>
            </el-col>
          </el-card>
        </el-col>
        <el-col
          :lg="{ span: '4-8' }"
          class="card-panel-col"
          :xs="24"
          :sm="24"
          :md="8"
          :xl="4"
        >
          <el-card class="box-card">
            <el-col :span="12">
              <vab-icon icon="apps-fill" />
            </el-col>
            <el-col :span="12" class="card-right">
              <p>{{ $translateTitle('home.cla_count') }}</p>
              <p>{{ app_count }}</p>
            </el-col>
          </el-card>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="8"
          :lg="{ span: '4-8' }"
          class="card-panel-col"
          :xl="4"
        >
          <el-card class="box-card">
            <el-col :span="12">
              <vab-icon icon="device-recover-fill" />
            </el-col>
            <el-col :span="12" class="card-right">
              <p>{{ $translateTitle('home.dev_count') }}</p>
              <p>{{ dev_count }}</p>
            </el-col>
          </el-card>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="8"
          :lg="{ span: '4-8' }"
          class="card-panel-col"
          :xl="4"
        >
          <el-card class="box-card">
            <el-col :span="12">
              <vab-icon icon="bar-chart-2-line" />
            </el-col>
            <el-col :span="12" class="card-right">
              <p>{{ $translateTitle('home.dev_online') }}</p>
              <p>{{ dev_online_count }}</p>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          v-for="item in projectList"
          :key="item.id"
          :xs="24"
          :sm="24"
          :md="8"
          :lg="{ span: '4-8' }"
        >
          <el-card class="box-card" shadow="always">
            <div slot="header" class="clearfix">
              <span>
                {{ item.name }}
              </span>
            </div>
            <div v-if="item.userUnit" class="text item">
              <span>{{ $translateTitle('home.unit') }}</span>
              <span>{{ item.userUnit }}</span>
            </div>
            <div v-if="item.scale" class="text item">
              <span>{{ $translateTitle('home.scale') }}：</span>
              <span>{{ item.scale }}</span>
            </div>
            <div class="text item">
              <span>{{ $translateTitle('home.category') }}：</span>
              <span>{{ getCategory(item.category) }}</span>
            </div>
            <div class="text item">
              <span>{{ $translateTitle('home.updatedAt') }}：</span>
              <span>
                {{
                  new Date(item.updatedAt).toLocaleDateString() +
                  ' ' +
                  new Date(item.updatedAt).toLocaleTimeString()
                }}
              </span>
            </div>
            <div class="text item" style="text-align: center">
              <el-button-group>
                <el-button
                  style="margin-right: 3px"
                  size="mini"
                  type="success"
                  @click="Gotoproduct(item.name)"
                >
                  {{ $translateTitle('home.preview') }}
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  target="_blank"
                  @click="handleClickVisit(item)"
                >
                  {{ $translateTitle('home.konva') }}
                </el-button>
              </el-button-group>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- <el-tab-pane label="统计总览" name="devchart">

      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
  import { batch } from '@/api/Batch/index'
  import Category from '@/api/Mock/Category'
  export default {
    name: 'Index',
    components: {},
    data() {
      return {
        category: Category,
        activeName: 'devchart',
        filterBox: 'filterBox-first',
        project_count: '-',
        app_count: '-',
        product_count: '-',
        dev_count: '-',
        dev_active_count: '-',
        dev_online_count: '-',
        projectList: [],
        formInline: {
          starttime: '',
          project: '',
        },
      }
    },
    mounted() {
      this.getAllAxios()
      console.log(this.category)
    },
    activated() {
      console.log('keep-alive生效')
    }, //如果页面有keep-alive缓存功能，这个函数会触发
    methods: {
      getCategory(key) {
        console.log(key)
        let name = ''
        this.category.filter((item) => {
          if (item.type == key) {
            name = item.data.CategoryName
          }
        })
        return name
      },
      // async getAllAxios() {
      //   console.log(process.env)
      //   this.$baseColorfullLoading(
      //     1,
      //     this.$translateTitle('home.messag_loding')
      //   )
      //   // （1）如果列为主键，count(列名)效率优于count(1)
      //   // （2）如果列不为主键，count(1)效率优于count(列名)
      //   // （3）如果表中存在主键，count(主键列名)效率最优
      //   // （4）如果表中只有一列，则count(*)效率最优
      //   // （5）如果表有多列，且不存在主键，则count(1)效率优于count(*)
      //   let params = {
      //     // count: 'objectId',
      //     count: 'objectId',
      //     limit: 1,
      //     skip: 0,
      //     where: {},
      //   }
      //   const res = await this.$moreHttp({
      //     dev_num: await dev_count(params),
      //     app_num: await app_count(params),
      //     projectList: await app_count({
      //       limit: 30,
      //     }),
      //     Product_num: await product_count(params),
      //     Project_num: await Project_count(params),
      //     dev_active_num: await dev_active_count(
      //       Object.assign(params, {
      //         where: {
      //           status: 'ACTIVE',
      //         },
      //       })
      //     ),
      //     dev_online_num: await dev_online_count(
      //       Object.assign(params, {
      //         where: {
      //           status: 'ONLINE',
      //         },
      //       })
      //     ),
      //   })
      //   const {
      //     dev_num = { count: 0 },
      //     Product_num = { count: 0 },
      //     Project_num = { count: 0 },
      //     app_num = { count: 0 },
      //     dev_active_num = { count: 0 },
      //     dev_online_num = { count: 0 },
      //     projectList = { results: {} },
      //   } = res
      //   this.$baseColorfullLoading().close()
      //   console.log(res)
      //   console.log(dev_online_num)
      //   this.dev_count = dev_num.count || 0
      //   this.product_count = Product_num.count
      //   this.project_count = Project_num.count
      //   this.app_count = app_num.count
      //   this.projectList = projectList.results
      //   this.dev_active_count = dev_active_num.count
      //   this.dev_online_count = dev_online_num.count
      // },
      async getAllAxios() {
        this.$baseColorfullLoading(
          1,
          this.$translateTitle('home.messag_loding')
        )
        let _queryParams = {
          count: 'objectId',
          limit: 1,
          skip: 0,
          where: {},
        }
        const params = [
          {
            method: 'GET',
            path: '/classes/Project',
            body: _queryParams,
          },
          {
            method: 'GET',
            path: '/classes/Product',
            body: {
              count: 'objectId',
              skip: 0,
              where: {},
            },
          },
          {
            method: 'GET',
            path: '/classes/App',
            body: _queryParams,
          },
          {
            method: 'GET',
            path: '/classes/Device',
            body: _queryParams,
          },
          {
            method: 'GET',
            path: '/classes/Device',
            body: {
              count: 'objectId',
              limit: 1,
              skip: 0,
              where: {
                status: 'ACTIVE',
              },
            },
          },
          {
            method: 'GET',
            path: '/classes/Device',
            body: {
              count: 'objectId',
              limit: 1,
              skip: 0,
              where: {
                status: 'ONLINE',
              },
            },
          },
        ]
        const res = await batch(params)
        if (res) {
          this.dev_count = res[0].success.count
          this.projectList = res[1].success.results
          this.product_count = res[1].success.count
          this.project_count = res[2].success.count
          this.dev_count = res[3].success.count
          this.app_count = res[4].success.count
          this.dev_online_count = res[5].success.count
        }
        this.$baseColorfullLoading().close()
      },
      handleChange() {},
      handleClickVisit(project) {
        this.$router.push({
          path: '/Topo/VueKonva',
          query: {
            productid: project.objectId,
          },
        })
      },
      Gotoproduct(name) {
        this.$router.push({
          path: '/dashboard/productlist',
          query: {
            project: name,
          },
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  @media only screen and (min-width: 768px) {
    .el-col-sm-4-8 {
      width: 20%;
    }

    .el-col-sm-offset-4-8 {
      margin-left: 20%;
    }

    .el-col-sm-pull-4-8 {
      position: relative;

      right: 20%;
    }

    .el-col-sm-push-4-8 {
      position: relative;

      left: 20%;
    }
  }

  @media only screen and (min-width: 992px) {
    .el-col-md-4-8 {
      width: 20%;
    }

    .el-col-md-offset-4-8 {
      margin-left: 20%;
    }

    .el-col-md-pull-4-8 {
      position: relative;

      right: 20%;
    }

    .el-col-md-push-4-8 {
      position: relative;

      left: 20%;
    }
  }

  @media only screen and (min-width: 1200px) {
    .el-col-lg-4-8 {
      width: 20%;
    }

    .el-col-lg-offset-4-8 {
      margin-left: 20%;
    }

    .el-col-lg-pull-4-8 {
      position: relative;

      right: 20%;
    }

    .el-col-lg-push-4-8 {
      position: relative;

      left: 20%;
    }
  }

  @media only screen and (min-width: 1920px) {
    .el-col-xl-4-8 {
      width: 20%;
    }

    .el-col-xl-offset-4-8 {
      margin-left: 20%;
    }

    .el-col-xl-pull-4-8 {
      position: relative;

      right: 20%;
    }

    .el-col-xl-push-4-8 {
      position: relative;

      left: 20%;
    }
  }
  .platform {
    box-sizing: border-box;
    width: 100%;
    //height: calc(100vh - #{$base-top-bar-height}* 3 - 25px);
    padding: 10px;
    background-size: 100%;
    .box-card {
      padding: 5px;
      margin: 5px;
    }
    .clearfix {
      ont-weight: bolder;
      text-align: center;
    }
    .card-left {
      font-size: 80px;
      color: white;
    }
    .card-right p:first-child {
      padding: 5px;
      margin: 0px;
      font-weight: bolder;
    }
    .card-right p:last-child {
      padding: 5px;
      margin: 0px;
      font-size: 40px;
      font-weight: bolder;
      color: #8b1515;
    }
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
  i {
    display: block !important;
    width: 50px;
    height: 50px;
    margin: auto;
    font-size: 50px !important;
    font-size: 40px;
    color: black;
    transition: all ease-in-out 0.3s;
  }
</style>
