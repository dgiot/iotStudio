<template>
  <div class="edituser">
    <div
      class="admin"
      style="margin-bottom: 20px"
    >
      <!-- 编辑用户 -->
      {{ $translateTitle('developer.edituser') }}
    </div>
    <el-form
      ref="ruleForm2"
      class="demo-ruleForm"
      label-width="100px"
      :model="ruleForm2"
      status-icon
    >
      <el-form-item
        :label="$translateTitle('user.account')"
        prop="account"
      >
        <el-input
          v-model="ruleForm2.account"
          :placeholder="$translateTitle('product.enteraccount')"
        />
      </el-form-item>
      <el-form-item
        :label="$translateTitle('product.phone')"
        prop="phone"
      >
        <el-input
          v-model="ruleForm2.phone"
          :maxlength="11"
          :placeholder="$translateTitle('product.enterphonenumber')"
        />
      </el-form-item>
      <el-form-item
        :label="$translateTitle('user.email')"
        prop="email"
      >
        <el-input
          v-model="ruleForm2.email"
          :placeholder="$translateTitle('product.enteremail')"
        />
      </el-form-item>
      <el-form-item
        :label="$translateTitle('user.name1')"
        prop="username"
      >
        <el-input
          v-model="ruleForm2.username"
          :maxlength="5"
          :placeholder="$translateTitle('product.eqwords1')"
        />
      </el-form-item>
      <!-- <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm2.password"></el-input>
      </el-form-item> -->
      <el-form-item :label="$translateTitle('developer.departmentselection')">
        <el-cascader
          v-model="ruleForm2.departmentid"
          auto-complete="off"
          change-on-select
          :options="data"
          :placeholder="$translateTitle('product.selectdepartment')"
          :props="treeprops"
          :show-all-levels="false"
          style="width: 600px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click.native="submit_edituser(ruleForm2)"
        >
          <!-- 保存 -->
          {{ $translateTitle('product.preservation') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { getUser, putUser } from '@/api/User/index'
  import { roletree } from '@/api/Role/index'

  export default {
    data() {
      return {
        data: [],
        treeprops: {
          value: 'objectId',
          label: 'name',
        },
        ruleForm2: {
          account: '',
          phone: '',
          username: '',
          password: '',
          email: '',
          checkPass: '',
          departmentid: [],
        },
        id: '',
      }
    },
    computed: {},
    mounted() {
      this.editUser()
    },

    methods: {
      async submit_edituser(formName) {
        console.log(formName)
        // 更新用户详情
        const params = {
          username: this.ruleForm2.account,
          nick: this.ruleForm2.username,
          phone: this.ruleForm2.phone,
          email: this.ruleForm2.email,
          emailVerified: true,
        }
        const res = await putUser(this.$route.query.id, params)
        if (res) {
          this.$message({
            message: '更改成功',
            type: 'success',
          })
        } else {
          this.$message({
            type: 'error',
            message: '修改用户失败',
          })
        }
      },

      editUser() {
        // 获取用户详情
        getUser(this.$route.query.id)
          .then((res) => {
            this.ruleForm2.username = res.nick
            this.ruleForm2.phone = res.phone
            this.ruleForm2.account = res.username
            this.ruleForm2.email = res.email
            this.getDepartment()
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: '用户详情获取失败',
            })
            console.log(err)
          })
      },
      getDepartment() {
        roletree()
          .then((res) => {
            const results = res.results
            results.forEach((element) => {
              console.log(element)
            })
            this.data = res.results
          })
          .catch((err) => {
            this.$message('部门列表获取失败')
            this.data = []
            console.log(err)
          })
      },
    },
  }
</script>
<style scoped>
  .edituser {
    box-sizing: border-box;
    width: 100%;
    min-height: 875px;
    padding: 20px;
    background: #ffffff;
  }

  .admin {
    margin: 20px 0 10px 20px;
    font-size: 24px;
  }

  .admin .des {
    padding-left: 5px;
    font-size: 15px;
    color: #777;
  }

  .goodslist {
    margin-bottom: 10px;
    margin-left: 20px;
  }

  .el-input {
    width: 600px;
  }

  .el-form {
    margin-left: 20px;
  }
</style>
