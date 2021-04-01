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
              <p>{{ $translateTitle('home.app_count') }}</p>
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
          :xs="12"
          :sm="8"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <el-card class="box-card" shadow="always">
            <div slot="header" class="clearfix">
              <span style="font-weight: bolder">{{ item.title }}</span>
            </div>
            <div class="text item">
              <span>工程单位：</span>
              <span>{{ item.userUnit }}</span>
            </div>
            <div class="text item">
              <span>服务规模：</span>
              <span>{{ item.scale }}</span>
            </div>
            <div class="text item">
              <span>所属行业：</span>
              <span>{{ item.category }}</span>
            </div>
            <div class="text item">
              <span>更新时间：</span>
              <span>
                {{
                  new Date(item.updatedAt).toLocaleDateString() +
                  ' ' +
                  new Date(item.updatedAt).toLocaleTimeString()
                }}
              </span>
            </div>
            <div class="text item" style="float: right">
              <el-button-group>
                <el-button
                  style="margin-right: 3px"
                  size="mini"
                  type="success"
                  @click="Gotoproduct(item)"
                >
                  查看产品
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  target="_blank"
                  @click="handleClickVisit(item)"
                >
                  进入登录
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
  import {
    Project_count,
    product_count,
    app_count,
    dev_count,
    dev_active_count,
    dev_online_count,
  } from '@/api/Platform/index'
  export default {
    name: 'Index',
    components: {},
    data() {
      return {
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
    },
    activated() {
      console.log('keep-alive生效')
    }, //如果页面有keep-alive缓存功能，这个函数会触发
    methods: {
      async getAllAxios() {
        this.$baseColorfullLoading(1, '批量请求数据中')
        // （1）如果列为主键，count(列名)效率优于count(1)
        // （2）如果列不为主键，count(1)效率优于count(列名)
        // （3）如果表中存在主键，count(主键列名)效率最优
        // （4）如果表中只有一列，则count(*)效率最优
        // （5）如果表有多列，且不存在主键，则count(1)效率优于count(*)
        let params = {
          // keys: 'count(*)',
          count: 'objectId',
          limit: 1,
          skip: 0,
          where: {},
        }
        const res = await this.$moreHttp({
          dev_num: await dev_count(params),
          app_num: await app_count(params),
          Product_num: await product_count(params),
          Project_num: await Project_count(params),
          dev_active_num: await dev_active_count(
            Object.assign(params, {
              where: {
                status: 'ACTIVE',
              },
            })
          ),
          dev_online_num: await dev_online_count(
            Object.assign(params, {
              where: {
                status: 'ONLINE',
              },
            })
          ),
        })
        const {
          dev_num = { count: 0 },
          Product_num = { count: 0 },
          Project_num = { count: 0 },
          app_num = { count: 0 },
          dev_active_num = { count: 0 },
          dev_online_num = { count: 0 },
        } = res
        this.$baseColorfullLoading().close()
        console.log(res)
        console.log(dev_online_num)
        this.dev_count = dev_num.count || 0
        this.product_count = Product_num.count
        this.project_count = Project_num.count
        this.app_count = app_num.count
        this.dev_active_count = dev_active_num.count
        this.dev_online_count = dev_online_num.count
      },
      handleChange() {},
      handleClickVisit(project) {
        const url =
          window.location.origin +
          '/iot/' +
          project.attributes.productIdentifier +
          '#/login'
        window.open(url, '__blank')
      },
      Gotoproduct(project) {
        this.$router.push({
          path: '/product',
          query: {
            project: project.id,
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
