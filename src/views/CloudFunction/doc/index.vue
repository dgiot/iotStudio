<script>
  import { createArticle, delArticle, getArticle } from '@/api/Article'
  import { post_tree } from '@/api/Logs'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'DgiotDoc',
    data() {
      return {
        ruleForm: {
          name: '',
          orderBy: 0,
          data: '',
          type: 'page',
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            {
              min: 1,
              max: 10,
              message: '长度在 1 到 10 个字符',
              trigger: 'blur',
            },
          ],
          type: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
          ],
        },
        father: 0,
        Article: {},
        id: 1000,
        type: 'preview',
        filterText: '',
        innerVisible: false,
        data: [],
      }
    },
    computed: {
      ...mapGetters({}),
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      },
    },
    created() {
      this.setTreeFlag(false)
      this.qureyTree()
    },
    methods: {
      ...mapMutations({
        setTreeFlag: 'settings/setTreeFlag',
      }),
      async handleNodeClick(data) {
        // 根据类型显示文档
        if (data.type == 'page') {
          this.ruleForm = await getArticle(data.objectId)
          this.$refs.vditor.flagType = 'editor'
        }
        // this.$refs.vditor.flagType == 'preview'
        //   ? (this.$refs.vditor.flagType = 'editor')
        //   : (this.$refs.vditor.flagType = 'preview')
      },
      async qureyTree() {
        const params = {
          province: '',
          class: 'Article',
          filter: '{"keys":["parent","name","type"],"where":{}}',
          parent: 'parent',
        }
        const { results = [] } = await post_tree(params)
        this.data = results
      },
      append(data, father, type) {
        this.ruleForm.type = type
        this.father = father
        this.innerVisible = true
        // const newChild = { id: this.id++, name: 'testtest', children: [] }
        // if (!data.children) {
        //   this.$set(data, 'children', [])
        // }
        // data.children.push(newChild)
      },
      handleTypeClick() {
        console.log(this.$refs.vditor)
        this.type == 'preview'
          ? (this.type = 'editor')
          : (this.type = 'preview')
        this.$refs.vditor.flagType == 'preview'
          ? (this.$refs.vditor.flagType = 'editor')
          : (this.$refs.vditor.flagType = 'preview')
      },
      remove(node, data) {
        // 二次删除确认
        this.$baseConfirm(`你确定要删除${data.name}吗`, null, async () => {
          await delArticle(data.objectId)
          this.$baseMessage(
            '已成功删除',
            'success',
            'dgiot-hey-message-success'
          )
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex((d) => d.objectId === data.objectId)
          children.splice(index, 1)
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const Article = {
              ...this.ruleForm,
              parent: {
                objectId: this.father,
                __type: 'Pointer',
                className: 'Article',
              },
            }
            delete Article.createdAt
            delete Article.updatedAt
            delete Article.objectId
            await createArticle(Article)
            this.innerVisible = false
            this.qureyTree()
            this.$message({
              type: 'success',
              message:
                ruleForm.type === 'page' ? '文档名称' : '目录名称' + '添加成功',
              showClose: true,
              duration: 2200,
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
    },
  }
</script>
<template>
  <el-container>
    <el-aside width="300px">
      <div class="dialog">
        <dgiot-dialog append-to-body :show.sync="innerVisible" width="400px">
          <el-form
            ref="ruleForm"
            class="demo-ruleForm"
            label-width="100px"
            :model="ruleForm"
            :rules="rules"
            size="mini"
          >
            <el-form-item
              :label="ruleForm.type === 'page' ? '文档名称' : '目录名称'"
              prop="name"
            >
              <el-input v-model="ruleForm.name" />
            </el-form-item>
            <el-form-item
              :label="ruleForm.type === 'page' ? '文档顺序' : '目录顺序'"
              prop="orderBy"
            >
              <el-input-number
                v-model="ruleForm.orderBy"
                label="文档顺序"
                :max="100"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item
              v-show="ruleForm.type === 'page'"
              label="文档内容"
              prop="data"
            >
              <el-input
                v-model="ruleForm.data"
                label="文档内容"
                :rows="2"
                type="textarea"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">
                立即创建
              </el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </dgiot-dialog>
      </div>
      <el-dropdown v-if="type == 'editor'" trigger="click">
        <el-button type="text">
          添加页面
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="append({}, '0', 'page')">
            添加页面
          </el-dropdown-item>
          <el-dropdown-item @click.native="append({}, '0', 'subject')">
            添加目录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button style="margin: 0 20px" type="text" @click="handleTypeClick">
        {{ type == 'preview' ? '编辑' : '预览' }}
      </el-button>
      <el-input
        v-model="filterText"
        placeholder="输入关键字搜索文件"
        size="mini"
        style="width: 80%"
      />
      <el-tree
        ref="tree"
        :data="data"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        node-key="objectId"
        @node-click="handleNodeClick"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span
            :class="
              data.type == 'subject' ? 'el-icon-files' : 'el-icon-document'
            "
          >
            {{ data.name }}
          </span>
          <span v-show="type == 'editor'">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="append(data, data.objectId, 'page')"
                >
                  添加子页面
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="append(data, data.objectId, 'subject')"
                >
                  添加子目录
                </el-dropdown-item>
                <!--                <el-dropdown-item @click.native="rname(node, data)">-->
                <!--                  重命名-->
                <!--                </el-dropdown-item>-->
                <el-dropdown-item @click.native="remove(node, data)">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>
    </el-aside>
    <el-container>
      <dgiot-vditor
        v-show="ruleForm.objectId"
        ref="vditor"
        :object-id="ruleForm.objectId"
        :rule-form="ruleForm"
        :title="ruleForm.name"
        :value="ruleForm.data"
      />
      <el-empty v-show="!ruleForm.objectId" style="width: 100%">
        <div slot="description">
          欢迎使用文档 你可与你的团队在此共同记录开发文档（规范，流程）等等。
        </div>
      </el-empty>
    </el-container>
  </el-container>
</template>
<style>
  .custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    font-size: 14px;
  }
</style>
