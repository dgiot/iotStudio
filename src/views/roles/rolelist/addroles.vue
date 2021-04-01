<template>
  <div class="app-container">
    <!-- <h2>添加角色</h2> -->
    <div class="role-box">
      <el-form :model="roleFormObj" :rules="roleFormRules" label-width="80px">
        <el-form-item label="parent" prop="parent">
          <el-select v-model="roleFormObj.ParentId" placeholder="请选择Parent">
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :value="item.objectId"
              :label="item.name + ':' + item.desc"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="角色名" prop="name">
          <el-input v-model="roleFormObj.name" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentid">
          <el-input
            v-model="roleFormObj.depname"
            placeholder="请输入部门名称"
          />
        </el-form-item>

        <!--      <el-form-item label="岗位" prop="departmentid">
          <el-input
            v-model="roleFormObj.org_type"

          />
        </el-form-item> -->

        <el-form-item label="岗位" prop="role">
          <el-select
            v-model="roleFormObj.dictvalue"
            :clearable="clearFlag"
            placeholder="请选择角色模版"
          >
            <el-option
              v-for="(item, index) in Option.dictOption"
              :key="index"
              :value="item.key"
              change="changeOption('dict',item.name)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            v-model="roleFormObj.description"
            placeholder="备注项为必填项"
            type="textarea"
          />
        </el-form-item>
        <el-form-item class="el_btn">
          <el-button type="warning" @click="resetFrom()">重置</el-button>

          <el-button
            v-if="insert == 0 || insert == 1"
            type="success"
            @click="addroles()"
          >
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import { queryDict } from '@/api/Dict/index'
  import { queryRole, addRoles } from '@/api/Role/index'

  export default {
    data() {
      return {
        treeModu: [],
        treeprops: {
          value: 'name',
          label: 'name',
        },
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        originrole: [],
        needdelarr: [],
        parentrole: [],
        userid: '',
        roleId: '',
        insert: '',
        Option: {
          deptvalue: '',
          deptOption: [],
          dictvalue: '',
          dictOption: [],
          objectId: 0,
          ParentId: 0,
        },
        clearFlag: true,
        roleFormObj: {
          parentId: '',
          name: '',
          phoneNum: '',
          mail: '',
          department: '',
          gender: '男',
          role: '',
          description: '',
          type: [],
          list: [],
          defaultProps: {
            children: 'children',
            label: 'label',
          },
          dictvalue: '',
        },
        roleFormRules: {
          name: [
            { required: true, message: '请输入角色名', trigger: 'blur' },
            {
              min: 2,
              max: 10,
              message: '长度在 2 到 10 个字符',
              trigger: 'blur',
            },
          ],
          description: [
            { required: true, message: '请输入权限描述', trigger: 'blur' },
            { min: 3, message: '最少三个字符', trigger: 'blur' },
          ],
        },
        roleList: [],
        deptInfo: {},
      }
    },
    computed: {},
    mounted() {
      this.searchAllOption()
    },
    methods: {
      getData(departData) {
        this.deptInfo = departData

        this.roleFormObj.ParentId = this.deptInfo.objectId // this.$store.state.user.departmentObj.objectId

        console.log('this.deptInfo', this.deptInfo.objectId)

        // 这里有点多余,但不加的话,parent select在视图上无法选中
        this.searchAllOption()
      },
      changeOption(key, val) {
        switch (key) {
          case 'tree':
            this.Option.deptvalue = this.$refs['cascaderAddr'].currentLabels[1]
            const fatheOptions = this.$refs['cascaderAddr'].options

            fatheOptions.forEach((val) => {
              if (this.$refs['cascaderAddr'].currentLabels[0] === val.name) {
                this.Option.objectId = val.children[0].objectId
              }
              this.Option.ParentId = val.objectId
            })
            break
          case 'dict':
            this.Option.dictvalue = val
            break
        }
      },
      // 查询部门  角色
      async searchAllOption() {
        const { results } = await queryDict({
          where: {
            type: 'roletemp',
          },
        })
        if (results) this.Option.dictOption = results
        let res = await queryRole({})

        const tempResults = []

        if (res.results) {
          res.results.forEach((item, key) => {
            const obj = {}
            obj.ParentId = item.ParentId
            obj.name = item.name
            obj.objectId = item.objectId
            obj.org_type = item.org_type
            obj.desc = item.desc
            obj.createdAt = item.createdAt
            tempResults.push(obj)
          })

          this.roleList = tempResults
          this.Option.deptOption = res.results
        } else {
          this.roleList = []
          this.$message('部门列表获取失败')
          this.Option.deptOption = []
        }
      },
      // 重置
      resetFrom() {
        ;(this.roleFormObj = {
          name: '',
          phoneNum: '',
          duty: '',
          gender: '男',
          role: '',
          description: '',
          alias: '',
        }),
          (this.Option.deptvalue = '')
        this.Option.dictvalue = ''
        this.Option.objectId = 0
        this.Option.ParentId = 0

        this.treeModu = []
        setTimeout(() => {
          this.searchAllOption()
        }, 1000)
      },
      diguiquchu(datas, arr, v, needdelarr) {
        // 递归找出半选中的数据
        arr.map((item) => {
          if (item.key == v && item.children.length > 0) {
            // datas.splice(i, 1);//因为每次截取会改变原数组，所以不能这样
            needdelarr.push(v)
            this.diguiquchu(datas, item.children, v, needdelarr)
          } else if (item.key != v && item.children.length > 0) {
            this.diguiquchu(datas, item.children, v, needdelarr)
          }
        })
      },
      async addroles() {
        const params = {
          depname: this.roleFormObj.depname,
          desc: this.roleFormObj.description,
          name: this.roleFormObj.name,
          parent: this.roleFormObj.ParentId,
          tempname: this.roleFormObj.dictvalue,
        }
        const { results } = await addRoles(params)
        if (results)
          this.$message({
            message: '新增成功',
            type: 'success',
          })
        this.$baseEventBus.$emit('dialogHide')
      },
      getdetail() {
        this.insert = this.$route.query.insert

        this.roleId = this.$route.query.roleId
      },
    },
  }
</script>
<style scoped lang="scss">
  .app-container {
    box-sizing: border-box;
    width: 100%;
    min-height: 320px;
    padding: 20px;
    background: #ffffff;
    h2 {
      width: 200px;
      // background: DarkCyan;
      height: 40px;
      margin: 20px auto;
      line-height: 40px;
      cursor: pointer;
    }
  }
</style>
