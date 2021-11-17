<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogFormVisible"
    width="70%"
    @close="close"
  >
    <vab-input
      ref="uploadFinish"
      :params="inputParams"
      @fileInfo="fileInfo"
      @files="files"
    />
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1" title="菜单参数配置项">
        <menu-collapse />
      </el-collapse-item>
    </el-collapse>
    <el-form
      ref="form"
      :inline="true"
      label-width="100px"
      :model="form"
      :rules="rules"
      style="margin-top: 20px"
    >
      <!--      <el-form-item-->
      <!--        v-show="title != '编辑菜单'"-->
      <!--        label="菜单选择"-->
      <!--      >-->
      <!--        <vab-icon-->
      <!--          class="el-input-group__prepend"-->
      <!--          icon="pages-line"-->
      <!--        />-->
      <!--        <el-cascader-->
      <!--          ref="menuCascader"-->
      <!--          v-model="cascadervalue"-->
      <!--          :options="router"-->
      <!--          :props="{ checkStrictly: true, label: 'title', value: 'title' }"-->
      <!--          clearable-->
      <!--          @change="handleChange"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="name" prop="name">
        <el-input
          v-model="form.name"
          :disabled="title == '编辑菜单'"
          :readonly="title == '编辑菜单'"
        >
          <template slot="prepend">
            <vab-icon icon="pages-line" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="路径" prop="url">
        <el-input v-model="form.url">
          <template slot="prepend">
            <vab-icon icon="route-fill" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="vue文件路径" prop="meta.component">
        <el-input v-model="form.meta.component">
          <template slot="prepend">
            <vab-icon icon="vuejs-fill" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="重定向" prop="redirect">
        <el-input v-model="form.meta.redirect">
          <template slot="prepend">
            <vab-icon icon="infrared-thermometer-fill" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="标题" prop="meta.title">
        <el-input v-model="form.meta.title">
          <template slot="prepend">
            <vab-icon icon="article-line" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="icon图标" prop="meta.icon">
        <el-input
          v-model="form.meta.icon"
          style="cursor: pointer"
          suffix-icon="el-icon-upload2"
          @click.native="uploadIcon(form)"
        >
          <el-popover
            slot="prepend"
            popper-class="icon-selector-popper"
            size="mini"
            trigger="hover"
            width="292"
          >
            <template #reference>
              <el-image
                v-if="form.meta.icon && form.meta.icon.includes('dgiot')"
                :src="$FileServe + form.meta.icon"
                style="width: 16px; height: 16px"
              >
                <img
                  slot="error"
                  :src="$FileServe + form.meta.icon"
                  style="width: 16px; height: 16px"
                  :title="$FileServe + form.meta.icon"
                />
              </el-image>
              <vab-icon v-else :icon="form.meta.icon" />
            </template>
            <vab-icon-selector @handle-icon="handleIcon" />
          </el-popover>
        </el-input>
      </el-form-item>
      <el-form-item label="badge" prop="badge">
        <el-input v-model="form.meta.badge">
          <template slot="prepend">
            <vab-icon icon="notification-badge-fill" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="隐藏"
        prop="hidden"
        title="隐藏后将不在菜单列表中展示，但是可以被访问"
      >
        <el-switch v-model="form.meta.hidden" />
      </el-form-item>
      <!--      <el-form-item label="始终显示当前节点" prop="alwaysShow">-->
      <!--        <el-switch v-model="form.meta.alwaysShow" />-->
      <!--      </el-form-item>-->
      <el-form-item
        label="固定"
        prop="noClosable"
        title="除首页外,其他页面不建议选择此项"
      >
        <el-switch v-model="form.meta.noClosable" />
      </el-form-item>
      <el-form-item
        label="无缓存"
        prop="noKeepAlive"
        title="开启后该页面的数据将不被缓存"
      >
        <el-switch v-model="form.meta.noKeepAlive" />
      </el-form-item>
      <!--      <el-form-item label="不显示当前标签页" prop="tabHidden">-->
      <!--        <el-switch v-model="form.meta.tabHidden" />-->
      <!--      </el-form-item>-->
      <el-form-item label="排序" prop="orderBy">
        <el-input-number v-model.number="form.orderBy" label="描述文字" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click.native="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import VabIconSelector from '@/vab/components/VabIconSelector'
  import { postMenu, putMenu } from '@/api/Menu'
  import menuCollapse from './menuCollapse.vue'
  import router from '@/router/router'
  import { mapGetters } from 'vuex'

  export default {
    name: 'MenuManagementEdit',
    components: {
      VabIconSelector,
      menuCollapse,
    },
    data() {
      return {
        router,
        visible: false,
        inputParams: {},
        cascadervalue: [],
        jsonModel: {
          hidden: true, //是否显示在菜单中显示隐藏路由（默认值：false）
          menuHidden: false, //是否显示在菜单中显示隐藏一级路由（默认值：false，除分栏布局有效）
          alwaysShow: true, //当只有一级子路由时是否显示父路由是否显示在菜单中显示路由（默认值：false）
          name: 'Demo', //首字母大写，一定要与vue文件的name对应起来，用于noKeepAlive缓存控制（该项特别重要）
          meta: {
            title: 'title', //菜单、面包屑、多标签页显示的名称
            roles: {
              //当config/settings.js中rolesControl配置开启时，用于控制角色（全写）
              role: ['admin', '...'],
              ability: ['READ', 'WRITE', 'DELETE'], //ability: ["READ","WRITE"],
              mode: 'allOf', //allOf: 数组内所有角色都拥有，返回True oneOf: 数组内拥有任一角色，返回True(等价第1种数据) except: 不拥有数组内任一角色，返回True(取反)
            },
            remixIcon: '', //旧版remix图标
            icon: '', //新版
            isCustomSvgIcon: false, //旧版，是否是自定义svg图标（默认值：false，如果设置true，那么需要把你的svg拷贝到icon/remixIcon下，然后remixIcon字段配置上你的图标名）
            isCustomSvg: false, //新版，是否是自定义svg图标（默认值：false，如果设置true，那么需要把你的svg拷贝到icon/remixIcon下，然后remixIcon字段配置上你的图标名）
            noKeepAlive: true, //当前路由是否不缓存（默认值：false）
            affix: true, //当前路由是否固定多标签页（旧版）
            noCLosable: true, //当前路由是否可关闭多标签页，同上（新版）
            badge: 'New', //badge小标签（只支持子级）
            tabHidden: true, //当前路由是否不显示多标签页
            activeMenu: '', //高亮指定菜单
            dot: false, //小圆点
            dynamicNewTab: false, // 动态传参路由是否新开标签页
          },
          children: [],
        },
        activeNames: ['0'],
        menuid: '',
        form: {
          orderBy: 100,
          name: '',
          url: '',
          meta: {
            icon: '',
            component: '',
            // redirect: '',
            title: '',
            // badge: '',
            // hidden: '',
            // alwaysShow: '',
            // isCustomSvg: '',
            // noClosable: '',
            // noKeepAlive: '',
            // tabHidden: '',
          },
        },
        rules: {
          name: [
            {
              type: 'string',
              required: true,
              message: 'name,用做页面缓存,首字母大写,不可重复',
              trigger: 'blur',
            },
            {
              type: 'string',
              message: 'name类型为string',
              trigger: 'blur',
            },
            {
              type: 'string',
              pattern: /^[A-Z][A-z0-9]*$/,
              message: '首字母请修改为大写',
              trigger: 'blur',
            },
          ],
          url: [
            {
              type: 'string',
              required: true,
              trigger: 'blur',
              message: '路径地址,将展示在浏览器地址栏中',
            },
          ],
          'meta.component': [
            {
              required: true,
              trigger: 'blur',
              message: 'vue文件路径,一般为@views/下的文件路径',
            },
          ],
          'meta.title': [
            {
              required: true,
              trigger: 'blur',
              message: '标题,展示在侧边栏菜单列表和顶部菜单列表',
            },
          ],
          'meta.icon': [
            {
              required: true,
              trigger: 'blur',
              message: '图标，展示在侧边栏菜单列表和顶部菜单列表',
            },
          ],
          orderBy: [
            {
              type: 'number',
              required: true,
              trigger: 'blur',
              message: '排序层级,决定页面的排序',
            },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    computed: {
      ...mapGetters({
        ObjectId: 'user/objectId',
      }),
    },
    mounted() {
      router.forEach((r) => {
        r.title = r.meta.title
        if (r?.children?.length) {
          r.children.forEach((c) => {
            c.title = c.meta.title
          })
        }
      })
      console.log('router', router)
    },
    methods: {
      uploadIcon(item) {
        console.log(item, this.form)
        // 触发子组件的点击事件
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
        this.inputParams = {
          file: '',
          scene: 'app',
          path: 'user/profile/',
          filename: `${this.ObjectId}_${this.form.name}`,
        }
      },
      fileInfo({ path = '' } = img) {
        console.log(path)
        this.form.meta.icon = path
      },
      files(file) {
        this.inputParams.filename = `${this.ObjectId}_${this.form.name}`
        this.inputParams.file = file
      },
      handleChange(value) {
        const obj = this.$refs['menuCascader'].getCheckedNodes()
        console.log(obj[0].data)
        console.log(value, this.cascadervalue)
        this.form = obj[0].data
      },
      handleIcon(item) {
        this.form.meta.icon = item
      },
      showEdit(row, type) {
        this.title =
          type == 'addChildMenu'
            ? '新增子菜单'
            : type == 'one'
            ? '新增一级菜单'
            : '编辑菜单'
        if (type == 'addChildMenu') {
          this.form = {
            orderBy: row.orderBy * 10 + 1, // 如果是新增子菜单
            name: '',
            url: row.url,
            meta: {
              icon: 'home-3-fill',
              component: '',
              redirect: '',
              title: '',
              badge: '',
              hidden: false,
              alwaysShow: false,
              isCustomSvg: false,
              noClosable: false,
              noKeepAlive: false,
              tabHidden: false,
            },
          }
          this.menuid = row.objectId
        } else if (type == 'editMenu') {
          this.form = row
        } else {
          console.log('row', row)
          this.form = {
            orderBy: row.orderBy,
            name: '',
            url: '',
            meta: {
              icon: 'home-3-fill',
              component: '',
              redirect: '',
              title: '',
              badge: '',
              hidden: false,
              alwaysShow: false,
              isCustomSvg: false,
              noClosable: false,
              noKeepAlive: false,
              tabHidden: false,
            },
          }
        }
        this.dialogFormVisible = true
      },
      close() {
        // this.$refs['form'].resetFields()
        this.menuid = ''
        // this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.form.objectId) {
              this._putMenu(this.form.objectId, this.form)
            } else {
              this._addMenu(this.form)
            }
          }
        })
      },
      async _putMenu(objectId, form) {
        let params = {
          url: form.url,
          name: form.name,
          icon: form.icon,
          orderBy: form.orderBy,
          meta: form.meta,
        }
        const { updatedAt } = await putMenu(objectId, params)
        console.log('updatedAt', updatedAt)
        if (updatedAt) {
          this.closeDialog()
        }
      },
      closeDialog() {
        this.menuid = ''
        this.$emit('fetch-data')
        this.$refs['form'].resetFields()
        this.dialogFormVisible = false
        this.form = this.$options.data().form
      },
      async _addMenu(form) {
        const aclKey = '*'
        const aclKey1 = 'role:admin'
        const setAcl = {}
        setAcl[aclKey] = {
          read: true,
          write: true,
        }
        setAcl[aclKey1] = {
          read: true,
          write: true,
        }
        let params = {
          ACL: setAcl,
          meta: form.meta,
          name: form.name,
          parent: {
            objectId: '0',
            __type: 'Pointer',
            className: 'Menu',
          },
          url: form.url,
          icon: form.meta.icon,
          orderBy: Number(form.orderBy),
        }
        if (this.menuid == '') {
          params.parent.objectId = '0'
          const res = await postMenu(params)
          this.$message({
            message: '新增成功',
            type: 'success',
          })
          this.closeDialog()
        } else {
          params.parent.objectId = this.menuid

          const res = await postMenu(params)
          this.$message({
            message: '新增成功',
            type: 'success',
          })

          this.closeDialog()
        }
      },
    },
  }
</script>
