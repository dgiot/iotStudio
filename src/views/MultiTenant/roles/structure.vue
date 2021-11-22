<!-- eslint-disable-next-line -->

<template>
  <div class="structure dgiot-container">
    <div class="adduserDiadlog">
      <a-drawer
        v-loading="isloading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-spinner="el-icon-loading"
        :element-loading-text="$translateTitle('developer.Waitingtoreturn')"
        :title="$translateTitle('user.newusers')"
        :visible.sync="adduserDiadlog"
        width="600px"
        @close="adduserDiadlog = !adduserDiadlog"
      >
        <el-form
          ref="userInfoFormRef"
          class="demo-ruleForm"
          label-width="160px"
          :model="userInfoForm"
          :rules="userFormRules"
          status-icon
        >
          <el-form-item
            :label="$translateTitle('product.Current department')"
            prop="departmentid"
          >
            <el-select
              v-model="userInfoForm.departmentid"
              disabled
              :placeholder="$translateTitle('product.Current department')"
              style="width: 100%"
            >
              <el-option
                v-for="item in deptOption"
                :key="item.objectId"
                :label="item.name"
                :title="item.name + ':' + item.desc"
                :value="item.objectId"
              />
            </el-select>
            <!--            <span style="float: right; font-size: 14px; color: #8492a6">-->
            <!--              <a-button-->
            <!--                type="danger"-->
            <!--                @click="centerDialogRole = !centerDialogRole"-->
            <!--              >-->
            <!--                {{ $translateTitle('user.new group') }}-->
            <!--              </a-button>-->
            <!--            </span>-->
          </el-form-item>
          <el-form-item v-if="centerDialogRole" label-width="78px">
            <addroles
              ref="addRoleRef"
              :dept-data="deptOption[0]"
              :is-structures="isStructures"
            />
          </el-form-item>
          <el-form-item :label="$translateTitle('user.name1')" prop="nick">
            <el-input
              v-model="userInfoForm.nick"
              auto-complete="off"
              :placeholder="$translateTitle('product.eqwords')"
            />
          </el-form-item>

          <el-form-item
            :label="$translateTitle('product.phone')"
            prop="phone"
            :width="85"
          >
            <el-input
              v-model="userInfoForm.phone"
              auto-complete="off"
              :maxlength="11"
              :placeholder="$translateTitle('product.enterphonenumber')"
            />
          </el-form-item>
          <el-form-item :label="$translateTitle('user.email')" prop="email">
            <el-input
              v-model="userInfoForm.email"
              auto-complete="off"
              :placeholder="$translateTitle('product.enteremail')"
            />
          </el-form-item>
          <el-form-item :label="$translateTitle('user.account')" prop="account">
            <el-input
              v-model="userInfoForm.account"
              auto-complete="off"
              :placeholder="$translateTitle('product.enteraccount')"
            />
          </el-form-item>

          <el-form-item
            :label="$translateTitle('developer.password')"
            prop="password"
          >
            <el-input
              v-model="userInfoForm.password"
              auto-complete="off"
              :placeholder="$translateTitle('product.entermmzh')"
            />
          </el-form-item>
          <!-- <el-form-item label="确认密码" prop="checkPass"> -->
          <el-form-item
            :label="$translateTitle('developer.confirmpassword')"
            prop="checkPass"
          >
            <el-input
              v-model="userInfoForm.checkPass"
              auto-complete="off"
              :placeholder="$translateTitle('product.enterpwa')"
            />
          </el-form-item>
          <!-- <el-form-item label="部门选择" prop="departmentid"> -->
        </el-form>
        <div
          :style="{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            left: 40,
            textAlign: 'center',
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }"
        >
          <el-button
            :disabled="centerDialogRole"
            @click="adduserDiadlog = false"
          >
            <!-- 取消 -->
            {{ $translateTitle('developer.cancel') }}
          </el-button>
          <el-button
            :disabled="centerDialogRole"
            type="primary"
            @click="addUser"
          >
            <!-- 确定 -->
            {{ $translateTitle('developer.determine') }}
          </el-button>
        </div>
      </a-drawer>
    </div>
    <el-row :gutter="20">
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <!--表格渲染-->
        <div class="tabContent">
          <el-row :gutter="24">
            <el-col :span="24">
              <vab-query-form v-show="currentDepartment.depname">
                <vab-query-form-top-panel>
                  <el-form
                    :inline="true"
                    label-width="auto"
                    :model="queryForm"
                    @submit.native.prevent
                  >
                    <el-form-item
                      :label="$translateTitle('product.Current department')"
                    >
                      {{ currentDepartment.depname }}
                      <el-button @click.native="addItemUser(currentDepartment)">
                        {{ $translateTitle('user.newusers') }}
                      </el-button>
                    </el-form-item>
                  </el-form>
                </vab-query-form-top-panel>
              </vab-query-form>
              <div class="elTable">
                <el-table
                  v-loading="pictLoading"
                  :data="tableFilterData"
                  style="width: 100%; margin-top: 20px"
                >
                  <el-table-column :label="$translateTitle('user.username')">
                    <template #default="{ row }">
                      <div>{{ row.username }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$translateTitle('user.phonenumber')">
                    <template #default="{ row }">
                      <div>{{ row.phone }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$translateTitle('user.email')"
                    :show-overflow-tooltip="true"
                  >
                    <template #default="{ row }">
                      <div>{{ row.email }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$translateTitle('user.department')">
                    <template #default="{ row }">
                      <div>
                        {{ row.departmentname || departmentname }}
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column
                    :label="$translateTitle('user.createdtime')"
                    :show-overflow-tooltip="true"
                  >
                    <template #default="{ row }">
                      <span>
                        {{ new Date(row.createdAt).toLocaleDateString() }}
                      </span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    align="center"
                    :label="$translateTitle('developer.operation')"
                    width="400"
                  >
                    <template #default="{ row }">
                      <el-button
                        :disabled="row.objectId !== objectId"
                        size="small"
                        type="success"
                        @click="handleEditor(row)"
                      >
                        {{ $translateTitle('developer.edit') }}
                      </el-button>
                      <el-button
                        :disabled="!curDepartmentId"
                        size="small"
                        type="danger"
                        @click="handleDetele(row)"
                      >
                        {{ $translateTitle('developer.delete') }}
                      </el-button>
                      <!-- <el-button
                        size="mini"
                        type="primary"
                        @click="editorrole(row.objectId)"
                      >{{  $translateTitle("user.assignroles") }}</el-button
                      > -->
                    </template>
                  </el-table-column>

                  <el-table-column
                    align="center"
                    :label="
                      $translateTitle('user.Disable') +
                      $translateTitle('user.account')
                    "
                    width="140px"
                  >
                    <template #default="{ row }">
                      <el-tooltip
                        :content="
                          $translateTitle('user.Current state') +
                          row.emailVerified
                            ? $translateTitle('user.Enable')
                            : $translateTitle('user.Disable')
                        "
                        placement="top"
                      >
                        <el-switch
                          v-model="row.emailVerified"
                          active-color="#13ce66"
                          :active-text="$translateTitle('user.Enable')"
                          inactive-color="#ff4949"
                          :inactive-text="$translateTitle('user.Disable')"
                          @change="disableRow(row.objectId, row.emailVerified)"
                        />
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
                <!--分页组件-->
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <!--分配角色-->
      <el-dialog
        :append-to-body="true"
        :close-on-click-modal="false"
        :title="$translateTitle('user.assignroles')"
        :visible.sync="roleacl"
      >
        <el-table
          ref="multipleTable"
          :data="rolelist"
          size="mini"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column align="center" :label="$translateTitle('user.name')">
            <template #default="{ row }">
              <span>{{ row.alias }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle('developer.describe')"
          >
            <template #default="{ row }">
              <span>{{ row.desc }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="ID">
            <template #default="{ row }">
              <span>{{ row.objectId }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="roleacl = false">
            {{ $translateTitle('developer.cancel') }}
          </el-button>
          <el-button type="primary" @click.native="adduseracl">
            {{ $translateTitle('developer.determine') }}
          </el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
  import addroles from '@/views/MultiTenant/roles/list/roles'
  import { Promise } from 'q'
  import { mapGetters, mapMutations } from 'vuex'
  import {
    disableuser,
    EmployeesHired,
    EmployeeTurnover,
    getUser,
    queryUser,
  } from '@/api/User/index'
  import { queryRoledepartment } from '@/api/Role/index'
  import { Roletree } from '@/api/Menu'

  var arr = []
  export default {
    components: {
      addroles,
    },
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (!/^\w{4,10}$/.test(value)) {
            // if (!/^([\w]|[.]){6,10}$/.test(value)) {
            callback(new Error('密码长度必须大于4位'))
          }
          callback()
        }
      }
      var validatecheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.userInfoForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        tableHeight: this.$baseTableHeight(0) - 20,
        isloading: false,
        isStructures: true,
        upKey: Number(moment().unix()),
        isEvent: false,
        depobjectId: '',
        centerDialogRole: false,
        deptData: {},
        roleProps: {
          children: 'children',
          label: 'name',
        },
        treeDataValue: '',
        queryForm: {
          account: '',
          searchDate: '',
          pageNo: 1,
          pageSize: 20,
          workGroupName: '',
          workGroupTreeShow: false,
          access_token: '',
        },
        departmentObj: [],
        departmentname: '',
        curDepartmentId: '',
        deptTreeData: [],
        deptOption: [],
        departmentidFlag: 'false',
        height: document.documentElement.clientHeight - 180 + 'px;',
        delLoading: false,
        sup_this: this,
        loading: false,
        deptName: '',
        depts: [],
        deptId: null,
        structure: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        data: [],
        elTreedefaultProps: {
          children: 'children',
          label: 'name',
        },
        dataforuser: [],
        total: 0,
        query: {
          value: '',
          type: '',
          enabled: '',
        },
        tableData: [],
        pagesize: 10,
        start: 0,
        departmentid: [],
        userlist: [],
        rolelist: [],
        userId: '',
        roleacl: false,
        multipleSelection: [],
        userrolelist: [],
        tempData: [],
        adduserDiadlog: false,
        userInfoForm: {
          account: '',
          phone: '',
          nick: '',
          password: '',
          email: '',
          checkPass: '',
          departmentid: [],
        },
        userFormRules: {
          account: [
            {
              required: true,
              message: '请输入账号名',
              trigger: 'blur',
            },
          ],
          phone: [
            {
              required: false,
              message: '请输入手机号',
              trigger: 'blur',
            },
            {
              validator: function (rule, value, callback) {
                var MobileRegex = /^1[34578]\d{9}$/
                if (value) {
                  if (!MobileRegex.test(value)) {
                    callback(new Error('手机号码格式不正确！'))
                  } else {
                    callback()
                  }
                } else {
                  callback()
                }
              },
              trigger: 'blur',
            },
          ],
          password: [
            {
              validator: validatePass,
              trigger: 'blur',
              required: true,
            },
          ],
          checkPass: [
            {
              validator: validatecheckPass,
              trigger: 'blur',
              required: true,
            },
          ],
          departmentid: [
            {
              required: true,
              message: '请选择部门',
              trigger: 'blur',
            },
          ],
          nick: [
            {
              required: true,
              message: '请输入昵称',
              trigger: 'blur',
            },
            {
              min: 2,
              max: 7,
              message: '昵称格式不正确',
              trigger: 'blur',
            },
          ],
          email: [
            {
              required: true,
              message: '请输入邮箱地址',
              trigger: 'blur',
            },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change'],
            },
          ],
        },
        treeprops: {
          value: 'objectId',
          label: 'name',
        },
        pictLoading: false,
      }
    },
    computed: {
      ...mapGetters({
        roleTree: 'user/roleTree',
        title: 'settings/title',
        objectId: 'user/objectId',
        currentDepartment: 'user/currentDepartment',
      }),
      tableFilterData() {
        return this.tempData
      },
    },
    mounted() {
      this.isEvent = false
      this.searchAllOption()
      this.userFordepartment()
      this.$dgiotBus.$on('dialogHide2', (depobjectId) => {
        console.log(depobjectId)
        if (depobjectId?.length) {
          this.depobjectId = depobjectId
          this.isEvent = true
        }
        this.$nextTick(() => {
          this.centerDialogRole = false
          // this.dialogVisible = false
          this.getRoletree()
        })
      })
    },
    methods: {
      ...mapMutations({
        setRoleTree: 'user/setRoleTree',
      }),
      async getRoletree() {
        this.upKey++
        const { results = [] } = await Roletree()
        console.log(results, 'results')
        this.$dgiotBus.$emit('asyncTreeData')
        this.deptTreeData = this.currentDepartment
        console.log(
          this.deptTreeData,
          'this.deptTreeData',
          this.currentDepartment
        )
        this.isloading = true
        setTimeout(() => {
          if (this.isEvent) {
            this.$query_object('_Role', {
              limit: 1,
              where: {
                objectId: this.depobjectId,
              },
            })
              .then((res) => {
                if (res.results?.length) {
                  this.addItemUser(res.results[0])
                  this.departmentname = res.results[0].name
                  this.curDepartmentId = res.results[0].objectId
                  this.treeDataValue = res.results[0].label
                  this.queryForm.workGroupName = res.results[0].label
                }
              })
              .catch((e) => {
                console.log(e)
              })
          }
          this.isloading = false
        }, 1500)
      },
      closeDialogRole() {
        this.centerDialogRole = false
      },
      addGroup(item) {
        console.log(item)
      },
      // addItemUser
      addItemUser(item) {
        this.deptOption = []
        this.departmentObj = item
        console.log(item)
        this.deptOption.push(item)
        this.adduserDiadlog = true
        this.userInfoForm.departmentid = item.objectId
      },
      change(e) {
        console.log(e)
        if (e) {
          $('.el-tree').css({
            height: '300px',
            display: 'block',
            'overflow-x': 'auto',
          })
        }
      },
      // 添加用户
      addUser() {
        this.$refs['userInfoFormRef'].validate(async (valid) => {
          if (!valid) {
            this.$message({
              message: '用户信息不完整',
              type: 'danger',
            })
            return false
          }

          // if (this.userInfoForm.departmentid) {
          //   var departmentStr = this.userInfoForm.departmentid[
          //     this.userInfoForm.departmentid.length - 1
          //   ];
          // } else {
          //   var departmentStr = "";
          // }
          const { tag } = await getUser(this.objectId)
          this.$delete(tag, 'wechat')
          console.log('tag', tag)
          const params = {
            username: this.userInfoForm.account,
            nick: this.userInfoForm.nick,
            password: this.userInfoForm.password,
            phone: this.userInfoForm.phone,
            email: this.userInfoForm.email,
            department: this.userInfoForm.departmentid,
            emailVerified: true,
            tag: tag,
            // aclId:this.aclId
          }
          // {
          //   userinfo: {
          //     sex: '保密',
          //       phone: '',
          //       avatar:
          //     'http://47.105.106.54:1250/group1/default/20210616/15/33/7/pc',
          //   },
          //   companyinfo: {
          //     logo: 'http://www.iotn2n.com/favicon.ico?1558342112',
          //       name: this.title,
          //       _mimg: 'http://47.105.106.54:1250/group1/group1/70224.png',
          //       title: '欢迎登录' + this.title,
          //       _pcimg: 'http://47.105.106.54:1250/group1/group1/1_411.png',
          //       Copyright:
          //     '© 2010-2021' +
          //     this.title +
          //     ' Corporation, All Rights Reserved',
          //       backgroundimage:
          //     'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/login_images/background.jpg',
          //   },
          //   theme: {
          //     layout: 'comprehensive',
          //       themeName: 'ocean',
          //       columnStyle: 'horizontal',
          //       fixedHeader: true,
          //       showProgressBar: true,
          //       showTabs: true,
          //       tabsBarStyle: 'card',
          //       showTabsBarIcon: true,
          //       showLanguage: true,
          //       showRefresh: true,
          //       showSearch: false,
          //       showTheme: true,
          //       showNotice: true,
          //       showFullScreen: true,
          //       showThemeSetting: true,
          //       pictureSwitch: true,
          //   },
          // },
          const res = await EmployeesHired(params)
          if (res) {
            this.$message({
              message: '用户添加成功！',
              type: 'success',
            })
            this.adduserDiadlog = false
            this.handleNodeClick(this.departmentObj)
          } else {
            this.$message('添加失败')
          }
        })
      },
      async editorrole(id) {
        const params = {
          order: 'createdAt',
          where: {
            users: {
              className: '_User',
              __type: 'Pointer',
            },
          },
        }
        this.rolelist = []
        this.userrolelist = []
        this.userId = id
        const { results } = await this.$query_object('_User', {
          limit: 1,
          where: {
            objectId: this.userId,
          },
        })
        if (results.length) {
          params.where.users.objectId = results[0].objectId
        }
        const req = await this.$query_object('_Role', params)
        const result = req.results
        this.rolelist = result
        console.log('result', req.results)
        if (result.length) {
          result.map((roleitem, index) => {
            console.log(
              roleitem.objectId,
              roleitem,
              this.userId == roleitem.objectId
            )
            if (this.userId == roleitem.objectId) {
              this.$refs.multipleTable.toggleRowSelection(
                this.rolelist[index],
                true
              )
              this.userrolelist.push(roleitem.objectId)
            }
          })
          console.log(this.userrolelist)
          this.roleacl = true
        }
      },
      seleItem(arr1, arr2, arr3) {
        console.log('arr1, arr2, arr3', arr1, arr2, arr3)
        arr1.map((items) => {
          if (!arr2.includes(items)) {
            arr3.push(items)
          }
        })
        arr2.map((disitem) => {
          if (!arr1.includes(disitem)) {
            arr3.push(disitem)
          }
        })
        this.userRolereset(arr3)
      },

      userRolereset(disroles) {
        Promise.all([
          disroles.map((nowitems) => {
            console.log(nowitems)
            this.testroles(nowitems)
          }),
        ]).then((data) => {
          if (data.length != 0) {
            this.$message({
              type: 'success',
              message: '分配成功',
            })
            this.roleacl = false
          }
        })
      },
      testroles(id) {
        console.log(id)
        // var Roles = Parse.Object.extend("_Role");
        // var roles = new Roles();
        // var User = Parse.Object.extend("_User");
        // var userrelation = new User();
        //
        // roles.id = id;
        // if (this.multipleSelection.includes(id)) {
        //   var relation = roles.relation("users");
        //   userrelation.set("objectId", this.objectId);
        //   relation.add(userrelation);
        //   roles.save().then(resultes => {});
        // } else {
        //   var relation = roles.relation("users");
        //   userrelation.set("objectId", this.objectId);
        //   relation.remove(userrelation);
        //   roles.save().then(resultes => {});
        // }
      },
      adduseracl() {
        this.seleItem(this.userrolelist, this.multipleSelection, [])
        // this.userRolereset(this.userrolelist, this.multipleSelection);
        // var roles = Parse.Object.extend("_Role");
        // var query = new Parse.Query(roles);
        // var User = Parse.Object.extend("_User");
        // var user = new Parse.Query(User);
        // var userrelation = new User()
        // user.get(this.objectId).then(object => {
        //   this.multipleSelection.map(items => {
        //     query.get(items).then(resultes => {
        //       var relation = resultes.relation("users");
        //       if (!this.userrolelist.includes(items)) {
        //         userrelation.set("objectId", this.objectId);
        //         relation.add(userrelation);
        //       }
        //       this.userrolelist.map(items => {
        //         if (!this.multipleSelection.includes(items)) {
        //           userrelation.set("objectId", this.objectId);
        //           relation.remove(userrelation);
        //         }
        //       });
        //       resultes.save().then(resulte => {
        //         this.$message({
        //           type: "success",
        //           message: "成功!"
        //         });
        //         this.roleacl = false;
        //       });
        //     });
        //   });
        // });
      },
      handleSelectionChange(val) {
        this.multipleSelection = []

        val.map((items) => {
          this.multipleSelection.push(items.id)
        })
      },
      // 编辑
      handleEditor(row) {
        console.log(row)
        this.$router.push({
          path: '/roles/edituser',
          query: {
            id: row.objectId,
          },
        })
      },
      disableRow(objectId, emailVerified) {
        let action = 'enable'
        if (emailVerified) {
          action = 'enable'
        } else {
          action = 'disable'
        }
        const params = {
          userid: objectId,
          action: action,
        }
        disableuser(params).then((res) => {
          console.log(res)
          if (res != undefined) {
            if (emailVerified) {
              this.$message({
                type: 'success',
                message: '启用成功!',
              })
            } else {
              this.$message({
                type: 'success',
                message: '禁用成功!',
              })
            }
          } else {
            this.userFordepartment()
            if (emailVerified) {
              this.$message({
                type: 'error',
                message: '权限不足,启用失败!',
              })
            } else {
              this.$message({
                type: 'error',
                message: '权限不足,禁用失败!',
              })
            }
          }
        })
      },
      // 删除
      handleDetele(row) {
        this.$confirm('此操作将永久删除此用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          // const data = {
          //   department: this.curDepartmentId,
          //   username: row.username,
          // }
          const params = {
            department: this.curDepartmentId,
            username: row.username,
          }
          const res = await EmployeeTurnover(params)
          this.$dgiotBus.$emit('asyncTreeData')
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.handleNodeClick({ name: this.departmentname })
          }
        })
      },
      handleSizeChange(val) {
        this.pagesize = val
        this.userFordepartment()
      },
      handleCurrentChange(val) {
        this.start = Number(val - 1) * Number(this.pagesize)
        this.userFordepartment()
      },
      // 初始化用户
      async userFordepartment(start) {
        this.pictLoading = true
        this.tempData = []
        if (start == 0) {
          this.start = 0
        } else {
          this.query.value = ''
        }
        let params = {
          limit: this.pagesize,
          skip: this.start,
          where: {},
          count: 'objectId',
        }
        const { results } = await queryUser(params)
        if (results) {
          if (this.query.value) {
            this.tempData = results.filter((item) => {
              return item.username.indexOf(this.query.value) != -1
            })
          } else {
            this.tempData = results
          }
          this.pictLoading = false
        } else {
          this.pictLoading = false
        }
        this.total = this.tempData.length
      },
      // adduser() {
      //   this.adduserDiadlog = true
      //   // this.$router.push({
      //   //   path: "/roles/adduser"
      //   // });
      // },
      async handleNodeClick(data) {
        this.treeDataValue = data.label
        this.queryForm.workGroupName = data.label
        // $('.el-tree').css({
        //   height: '0px',
        //   display: 'none',
        //   'overflow-x': 'auto',
        // })
        // $('.el-select-dropdown').css({ display: 'none' })
        console.log(this.treeDataValue)
        this.departmentname = data.name
        this.curDepartmentId = data.objectId
        this.tempData = []
        this.pictLoading = true
        const params = {
          name: data.name,
        }
        const { users } = await queryRoledepartment(params)
        if (users) {
          this.tempData = users.filter((item) => {
            return item.username.indexOf('user_for_') == -1
          })
          this.pictLoading = false
          this.total = this.tempData.length
        } else {
          this.pictLoading = false
          this.total = 0
        }
      },
      // 查询部门
      searchAllOption() {
        this.deptTreeData = this.roleTree
        this.userFordepartment()
      },
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .elTable ::v-deep .el-table th > .cell,
  .elTable ::v-deep .el-table--enable-row-transition .el-table__body td {
    text-align: center;
  }

  .structure {
    box-sizing: border-box;
    width: 100%;
    background: #ffffff;

    .tabContent {
      .elTree {
        float: left;
        margin-top: 30px;
        margin-left: 20px;
      }

      .leftTree {
        width: 100%;
        height: calc(100vh - #{$base-top-bar-height} * 4 - 25px);
        overflow: scroll;
        overflow: scroll;

        ::v-deep .el-tree {
          width: 100%;
          overflow: scroll;
        }
      }

      .elTable {
        .total_pagination {
          width: 100%;
          margin-top: 20px;
          text-align: center;
        }
      }
    }
  }
</style>
<style>
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #cccccc;
  }

  .structure .el-switch__label--left {
    color: #ff4949 !important;
  }

  .structure .el-switch__label--right {
    color: rgb(19, 206, 102) !important;
  }

  .custom-tree-node .el-icon-circle-plus-outline:hover {
    color: #409eff;
  }
</style>
