<template>
  <div class="app-container">
    <!-- <h2>添加角色</h2> -->
    <div class="role-box">
      <el-form
        ref="roleFormObj"
        label-width="80px"
        :loading="isloading"
        :model="roleFormObj"
        :rules="roleFormRules"
      >
        <el-form-item v-if="!isStructures" label="父及部门" prop="ParentId">
          <el-select
            v-model="roleFormObj.ParentId"
            placeholder="请选择Parent"
            style="width: 100%"
            @change="handleChangeDeptId($event)"
          >
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.name"
              :title="item.name + ':' + item.desc"
              :value="item.objectId"
            />
          </el-select>
        </el-form-item>

        <!--        <el-form-item label="角色名" prop="name">-->
        <!--          <el-input v-model="roleFormObj.name" />-->
        <!--        </el-form-item>-->
        <el-form-item label="部门" prop="depname">
          <el-input
            v-model="roleFormObj.depname"
            placeholder="请输入部门名称"
            style="width: 75%"
          />
          <span style="float: right; font-size: 14px; color: #8492a6">
            <el-button
              v-if="insert == 0 || insert == 1"
              type="success"
              @click="addroles('roleFormObj')"
            >
              {{ $translateTitle('developer.determine') }}
            </el-button>
          </span>
        </el-form-item>
        <el-form-item label="岗位" prop="dictvalue">
          <el-select
            v-model="roleFormObj.dictvalue"
            :clearable="clearFlag"
            placeholder="请选择角色模版"
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in Option.dictOption"
              :key="index"
              change="changeOption('dict',item.name)"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isStructures" label="备注">
          <el-input v-model="roleFormObj.description" type="textarea" />
        </el-form-item>
        <el-form-item v-if="!isStructures" class="el_btn">
          <el-button type="warning" @click.native="resetFrom()">重置</el-button>

          <el-button
            v-if="insert == 0 || insert == 1"
            type="success"
            @click="addroles('roleFormObj')"
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
  import { addRoles, queryRole } from '@/api/Role/index'

  export default {
    props: {
      deptData: {
        type: Object,
        default: () => {},
        required: true,
      },
      isStructures: {
        type: Boolean,
        required: false,
        default: false,
      },
    },

    data() {
      return {
        isloading: '',
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
        deptLevel: 0,
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
            {
              required: true,
              message: '请输入角色名',
              trigger: 'blur',
            },
            {
              min: 2,
              max: 10,
              message: '长度在 2 到 10 个字符',
              trigger: 'blur',
            },
          ],
          depname: [
            {
              required: true,
              message: '请选择部门',
              trigger: 'blur',
            },
          ],
          dictvalue: [
            {
              required: true,
              message: '请选择岗位',
              trigger: 'change',
            },
          ],
          ParentId: [
            {
              required: true,
              message: '请选择部门父级',
              trigger: 'blur',
            },
          ],
        },
        roleList: [],
        deptInfo: {},
      }
    },
    computed: {},
    mounted() {
      this.searchAllOption()
      if (this.deptData?.objectId) {
        console.log(this.deptData)
        this.isloading = this.$baseLoading(3)
        this.getData(this.deptData)
        setTimeout(() => {
          this.isloading.close()
        }, 1500)
      }
    },
    methods: {
      handleChangeDeptId(e) {
        this.roleList.forEach((r) => {
          if (r.objectId == e) {
            console.log(r)
            this.deptLevel = r.level
            this.searchAllOption()
          }
        })
        console.log(this.deptLevel, 'deptLevel')
      },
      getData(departData) {
        this.deptInfo = departData
        this.deptLevel = departData.level
        this.roleFormObj.ParentId = this.deptInfo.objectId // this.$store.state.user.departmentObj.objectId

        console.log('this.deptInfo', this.deptLevel, this.deptInfo.objectId)

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
        console.log(this.deptInfo, 'deptInfo')
        const { results } = await queryDict({
          where: {
            'data.level': { $gt: this.deptLevel },
            type: 'roletemp',
          },
        })
        if (results?.length) {
          this.Option.dictOption = results
          this.roleFormObj.dictvalue = results[0].key
          console.log(this.roleFormObj.dictvalue, results[0].key)
        }
        const { results: roleresults = [] } = await queryRole({})
        console.log(roleresults, 'roleresults')
        const tempResults = []

        if (roleresults?.length) {
          roleresults.forEach((item, key) => {
            const obj = {}
            obj.ParentId = item.ParentId
            obj.name = item.name
            obj.objectId = item.objectId
            obj.org_type = item.org_type
            obj.desc = item.desc
            obj.level = item.level
            obj.createdAt = item.createdAt
            tempResults.push(obj)
          })

          this.roleList = tempResults
          this.Option.deptOption = roleresults
        } else {
          this.roleList = []
          this.$message('部门列表获取失败')
          this.Option.deptOption = []
        }
      },
      // 重置
      resetFrom() {
        this.roleFormObj = {
          name: '',
          phoneNum: '',
          duty: '',
          gender: '男',
          role: '',
          description: '',
          alias: '',
        }
        this.Option.deptvalue = ''
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
      addroles(formName) {
        this.$refs[formName].validate(async (valid) => {
          console.log(this.$refs[formName], this.roleFormObj)
          if (valid) {
            const params = {
              depname: this.roleFormObj.depname,
              desc: this.roleFormObj.description?.length
                ? this.roleFormObj.description
                : this.roleFormObj.depname + this.roleFormObj.name,
              name: this.roleFormObj.name?.length
                ? this.roleFormObj.name
                : this.roleFormObj.depname,
              parent: this.roleFormObj.ParentId,
              tempname: this.roleFormObj.dictvalue,
            }
            try {
              const res = await addRoles(params)
              if (res?.createdAt?.length) {
                this.$message({
                  message: '新增成功',
                  type: 'success',
                })
                this.$baseEventBus.$emit('dialogHide')
                this.$baseEventBus.$emit('dialogHide2', res.objectId)
              } else {
                console.log(res)
                this.$message({
                  message: `角色添加出錯${res}`,
                  type: 'error',
                })
              }
            } catch (_error) {
              this.$message({
                message: `角色添加出錯${_error}`,
                type: 'error',
              })
              console.log(_error, '_error')
            }
          } else {
            return false
          }
        })
      },
      getdetail() {
        this.insert = this.$route.query.insert

        this.roleId = this.$route.query.roleId
      },
    },
  }
</script>
<style lang="scss" scoped>
  .app-container {
    //box-sizing: border-box;
    //width: 100%;
    //min-height: 320px;
    //padding: 20px;
    //background: #ffffff;
    //h2 {
    //  width: 200px;
    //  // background: DarkCyan;
    //  height: 40px;
    //  margin: 20px auto;
    //  line-height: 40px;
    //  cursor: pointer;
    //}
  }
</style>
