<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-03-30 09:37:57
* @LastEditors: 9:37
* @LastEditTime: 2022-03-30 09:37:57
* @Description:
* @FilePath: src\views\CloudOc\Ftechnology\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
-->
<template>
  <div class="detail-container">
    <div class="detail">
      <div class="in_top">
        <div class="top_name">{{ name }}</div>
        <div class="top_btn">
          <el-button>归档</el-button>
          <el-button type="warning">发布</el-button>
          <el-button>删除</el-button>
          <el-button>编辑</el-button>
        </div>
      </div>
      <div class="in_ctr">工厂编码: {{ objectid }}</div>
      <div class="in_btm">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="车间属性" name="first">
            <el-button
              style="margin-bottom: 10px"
              type="warning"
              @click="openCreatePlant"
            >
              新增车间
            </el-button>
            <el-table
              ref="tableSort"
              v-loading="listLoading"
              :border="border"
              :data="list"
              :height="height"
              :size="lineHeight"
              :stripe="stripe"
            >
              <el-table-column
                align="center"
                label="车间名称"
                prop="name"
                show-overflow-tooltip
                width="200"
              />
              <el-table-column
                align="center"
                label="车间编码"
                prop="code"
                show-overflow-tooltip
                width="200"
              />
              <el-table-column
                align="center"
                label="状态"
                prop="status"
                show-overflow-tooltip
                width="200"
              />
              <el-table-column
                align="center"
                label="车间描述"
                prop="desc"
                show-overflow-tooltip
                width="300"
              />
              <el-table-column
                align="center"
                label="操作"
                show-overflow-tooltip
                width="300"
              >
                <template #default="{ row }">
                  <el-button
                    type="text"
                    @click.native="
                      $router.push({
                        path: '/oc/MetaData/module',
                        query: {
                          objectId: row.objectId,
                          type: 'edit',
                        },
                      })
                    "
                  >
                    编辑
                  </el-button>
                  <el-button type="text" @click="handleDelete(row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
              <template #empty>
                <el-image
                  class="dgiot-data-empty"
                  :src="
                    require('../../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                  "
                />
              </template>
            </el-table>
            <el-pagination
              background
              :current-page="queryForm.size"
              :layout="layout"
              :page-size="queryForm.limit"
              :total="total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </el-tab-pane>
          <el-tab-pane label="属性列表" name="second">配置管理</el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog
      :append-to-body="true"
      :direction="direction"
      height="60%"
      title="新增工厂"
      :visible.sync="drawer"
      width="30%"
    >
      <div class="demo-drawer__content">
        <el-form ref="ruleForm" :model="form" :rules="rules">
          <el-form-item label="工厂名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入工厂名称" />
          </el-form-item>
          <el-form-item label="岗位" prop="tempname">
            <el-select
              v-model="form.tempname"
              placeholder="请选择岗位"
              style="width: 100%"
            >
              <el-option
                v-for="item in dict"
                :key="item.objectId"
                :label="item.key"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工厂描述">
            <el-input
              v-model="form.desc"
              maxlength="500"
              placeholder="不超过500个字符"
              show-word-limit
              type="textarea"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">
              立即创建
            </el-button>
            <el-button @click="openCreatePlant">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Detail',
    components: {},
    props: {},
    data() {
      return {
        name: '',
        objectid: '',
        border: true,
        height: this.$baseTableHeight(0) - 100,
        stripe: true,
        lineHeight: 'mini',
        plantlist: [],
        activeName: 'first',
        drawer: false,
        parent: '', //当前部门id
        direction: 'rtl',
        dict: [],
        wrapclose: false,
        form: {
          name: '',
          tempname: '',
          desc: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入工厂名称', trigger: 'blur' },
            {
              min: 2,
              max: 50,
              message: '长度在 3 到 50 个字符',
              trigger: 'blur',
            },
          ],
          tempname: [
            { required: true, message: '请选择岗位', trigger: 'blur' },
          ],
        },
        queryForm: {
          skip: 0,
          limit: 20,
          name: '',
        },
      }
    },
    computed: {},
    watch: {},
    created() {
      const { name, objectid } = this.$route.query
      this.name = name
      this.objectid = objectid
      console.log('name', name, objectid)
    },
    mounted() {},
    destroyed() {},
    methods: {
      handleSizeChange(val) {
        this.queryForm.limit = val
        // this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.skip = Number(val - 1) * Number(this.queryForm.limit)
        // this.fetchData()
      },
      handleClick(tab, event) {
        console.log(tab, event)
      },
      async getDict() {
        const params = {
          where: {
            type: 'roletemp',
          },
        }
        const { results } = await queryDictTemp(params)
        console.log('模板', results)
        this.dict = results
      },
      async fetchData() {
        // const params = {
        //   skip: this.queryForm.skip,
        //   limit: this.queryForm.limit,
        //   count: 'objectId',
        //   order: '-createdAt',
        //   excludeKeys: 'properties',
        //   where: {
        //     name: this.queryForm.name
        //       ? { $regex: this.queryForm.name }
        //       : { $ne: null },
        //   },
        // }
        // console.info(params)
        // this.listLoading = true
        const { results } = await queryRoleTree()
        this.plantlist = results[0].children
        this.parent = results[0].objectId
        // this.total = count
        // this.listLoading = false
      },
      modelToDetail(item) {
        console.log(item)
        // return
        this.$router.push({
          path: '/oc/Modeling/modeldetail',
          query: {
            objectid: item.objectId,
            name: item.name,
          },
        })
      },
      openCreatePlant() {
        this.form = {
          name: '',
          tempname: '',
          desc: '',
        }
        this.drawer = !this.drawer
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = {
              depname: this.form.name,
              desc: this.form.desc,
              name: this.form.name,
              parent: this.parent,
              tempname: this.form.tempname,
            }
            console.log('部门', params)
            postRole(params).then((res) => {
              console.log('result', res)
              this.fetchData()
              this.drawer = !this.drawer
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .detail-container {
    width: 100%;
    height: 100%;
    .detail {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      .in_top {
        display: flex;
        justify-content: space-between;
        .top_name {
          font-size: 30px;
          font-weight: 600;
        }
        .top_btn {
          padding: 5px;
        }
      }
      .in_ctr {
        margin: 25px 0;
      }
      .in_btm {
      }
    }
  }
</style>
