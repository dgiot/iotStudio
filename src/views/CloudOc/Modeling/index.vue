<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-03-29 20:02:49
* @LastEditors: 20:02
* @LastEditTime: 2022-03-29 20:02:49
* @Description:
* @FilePath: src\views\CloudOc\Modeling\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
-->
<template>
  <div class="index-container">
    <div class="index">
      <div class="in_top">工厂建模</div>
      <div class="in_ctr">工厂列表</div>
      <div class="in_btm">
        <el-button type="warning" @click="openCreatePlant">新增工厂</el-button>
        <el-row class="btm_wrap">
          <el-col
            v-for="item in plantlist"
            :key="item.id"
            class="wrap_content"
            :lg="{ span: 7 }"
            :md="{ span: 7 }"
            :sm="{ span: 11 }"
            :xl="{ span: 5 }"
            :xs="{ span: 20 }"
          >
            <div class="ct_top">
              <img src="../../../../public/assets/images/plant/gc.png" />
              <div class="top_right">
                <div class="right_item right_title">{{ item.name }}</div>
                <div class="right_item">编码:{{ item.objectId }}</div>
                <div class="right_item">
                  描述:
                  <span v-if="item.desc">{{ item.desc }}</span>
                  <span v-else>--</span>
                </div>
              </div>
            </div>
            <div class="ct_btm">
              <el-button class="btm_left" @click.native="modelToDetail(item)">
                查看
              </el-button>
              <div class="btm_right">组织类型:{{ item.org_type }}</div>
            </div>
          </el-col>
        </el-row>
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
  import { getList } from '@/api/Mock/plant'
  import { queryRoleTree, postRole, queryDictTemp } from '@/api/Modeling'
  export default {
    name: 'Index',
    components: {},
    props: {},
    data() {
      return {
        plantlist: [],
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
      }
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
      this.fetchData()
      this.getDict()
      // const res = getList()
      // console.log('list', res)
      // this.plantlist = res.data.List
    },
    destroyed() {},
    methods: {
      async getDict() {
        const params = {
          where: {
            type: 'roletemp',
          },
        }
        const { results } = await queryDictTemp(params)
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
            postRole(params).then((res) => {
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
  .index-container {
    width: 100%;
    height: 100%;
    .index {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      .in_top {
        font-size: 30px;
        font-weight: 600;
      }
      .in_ctr {
        margin: 25px 0;
      }
      .in_btm {
        .btm_wrap {
          display: flex;
          flex-wrap: wrap;
          margin-top: 20px;
          .wrap_content {
            // width: 22%;
            height: 220px;
            margin-right: 3%;
            margin-bottom: 20px;
            box-shadow: -1px -1px 6px #ccc;
            .ct_top {
              display: flex;
              width: 100%;
              height: 70%;
              padding: 30px;
              img {
                width: 90px;
                height: 90px;
              }
              .top_right {
                margin-left: 10px;
                .right_item:nth-child(n + 2) {
                  margin-top: 10px;
                }
                .right_title {
                  font-size: 24px;
                  font-weight: 600;
                }
              }
            }
            .ct_btm {
              display: flex;
              height: 30%;
              margin-left: 30px;
              .btm_left {
                width: 60px;
                height: 30px;
              }
              .btm_right {
                padding-top: 6px;
                margin-left: 25px;
                color: #c7c6c0;
              }
            }
          }
        }
      }
    }
  }
</style>
