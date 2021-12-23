<template :key="setKey">
  <div class="dgiot-doc">
    <div class="dialog">
      <doc-dialog ref="DocDialog" />
    </div>

    <a-row>
      <a-col :span="4">
        <div class="dgiot-doc-tree">
          <a-tree
            :auto-expand-parent="true"
            :block-node="true"
            :default-expand-all="true"
            :default-expanded-keys="selectedKeys"
            :default-selected-keys="selectedKeys"
            :show-icon="true"
            :show-line="true"
            :tree-data="docDetails"
            @click="onSelect"
          >
            <template #title="{ objectId: treeKey, name }">
              <a-dropdown :trigger="['contextmenu']">
                <span>{{ name }}</span>

                <template #overlay>
                  <a-menu
                    @click="
                      ({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)
                    "
                  >
                    <a-menu-item key="child">
                      {{ $translateTitle('article.New category') }}
                    </a-menu-item>
                    <a-menu-item key="edit">
                      {{ $translateTitle('article.edit category') }}
                    </a-menu-item>
                    <a-menu-item key="delete">
                      {{ $translateTitle('button.delete') }}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </a-tree>
        </div>
      </a-col>
      <a-col :span="20">
        <div class="text">
          <vab-vditor ref="vditor" :value="productDetail.data" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import requireModule from '@/utils/file/requireModule'
  import { mapMutations } from 'vuex'
  import { post_tree } from '@/api/Data'
  import {
    createArticle,
    delArticle,
    getArticle,
    putArticle,
    queryArticle,
  } from '@/api/Article'

  export default {
    name: 'DgiotDoc',
    components: {
      ...requireModule(require.context('./module', true, /\.vue$/)),
    },
    data() {
      return {
        editId: '',
        collapsed: false,
        productDetail: {},
        setKey: moment(new Date()).valueOf(),
      }
    },
    computed: {
      selectedKeys: {
        get() {
          return this.$store.state.global.selectedKeys
        },
        set(v) {
          return this.setSelectedKeys(v)
        },
      },
      detailsId: function () {
        return this.$route.query.details
      },
      docDetails: {
        get() {
          return this.$store.state.global.docDetails || {}
        },
        set(v) {
          return this.set_docDetails(v)
        },
      },
      articleId: function () {
        return this.$route.query.article
      },
    },
    mounted() {
      console.log(
        // this.$router,
        this.detailsId,
        this.articleId,
        this.selectedKeys,
        this.docDetails,
        'vuex '
      )
      // if (_.unionBy(this.docDetails))
      this.getTree(this.$route.query)
      // if (_.isEmpty(this.docDetails)) this.getSetting(this.$route.query)
      if (this.articleId) this.getArticle(this.$route.query)
    },
    created() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {
      this.set_docDetails([])
      this.setSelectedKeys([])
    }, //生命周期 - 销毁完成
    activated() {},
    methods: {
      ...mapMutations({
        delVisitedRoute: 'tabs/delVisitedRoute',
        setSelectedKeys: 'global/setSelectedKeys',
        set_docDetails: 'global/set_docDetails',
      }),
      onContextMenuClick(treeKey, menuKey) {
        console.log(treeKey, menuKey)
        switch (menuKey) {
          case 'child':
            this.newCategory(menuKey, treeKey)
            break
          case 'edit':
            this.editId = treeKey
            this.editCategory(treeKey)
            break
          case 'delete':
            this.deletDoc(treeKey)
            break
        }
        console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`)
      },
      async editCategory(treeKey) {
        const res = await getArticle(treeKey)
        this.$refs.DocDialog.dialogFormVisible = true
        this.$refs.DocDialog.form = res
        this.$refs.DocDialog.form.type = 'edit'
      },
      deletDoc(objectId) {
        this.$baseConfirm(
          this.$translateTitle(
            'Maintenance.Are you sure you want to delete the current item'
          ),
          null,
          async () => {
            const loading = this.$baseColorfullLoading()
            const res = await delArticle(objectId)

            this.$baseMessage(
              this.$translateTitle('Maintenance.successfully deleted'),
              'success',
              'vab-hey-message-success'
            )
            setTimeout(() => {
              loading.close()
              this.getTree(this.$route.query)
            }, 800)
          }
        )
      },
      init() {
        this.$refs.DocDialog.$refs.form.resetFields()
        this.$refs.DocDialog.dialogFormVisible = false
        this.getTree(this.$route.query)
      },
      async getTree(router) {
        var filter =
          '{"keys":["parent","name","data","projectId","order","category","data","Icon","desc"],"where":{"projectId":"LYjcKG3ysu"}}'.replace(
            'LYjcKG3ysu',
            this.$route.query.details
          )
        const params = {
          class: 'Article',
          filter: filter,
          parent: 'parent',
        }
        console.log(params.filter, 'params')
        const { results = [] } = await post_tree(params)
        this.docDetails = results
      },
      /**
       *
       * @param
       * @returns
       */
      async getArticle(params) {
        try {
          const loading = this.$baseColorfullLoading()
          const data = await getArticle(this.articleId)
          this.productDetail = data
          console.log('productDetail', this.productDetail)
          this.$baseMessage(
            this.$translateTitle('alert.Data request successfully'),
            'success',
            'vab-hey-message-success'
          )
          loading.close()
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error'
          )
        }
      },
      /**
       *
       * @param
       * @returns
       */
      async getSetting(params) {
        console.log(params, 'params')
        try {
          const loading = this.$baseColorfullLoading()
          const { results = [] } = await queryArticle({
            where: { parent: params.details },
          })
          const mergerDetails = _.merge(docDetails, this.docDetails)
          // this.set_docDetails(mergerDetails)
          this.docDetails = mergerDetails
          this.setKey = moment(new Date()).valueOf()
          loading.close()
          this.init()
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error'
          )
        }
      },
      onSelect(id, da_title) {
        console.log('da_title', da_title.dataRef)
        // this.$refs.DocDialog.form = da_title.dataRef
        this.$nextTick(() => {
          this.$refs.DocDialog.form.category = da_title.category
          this.$refs.DocDialog.form.type = 'add'
          this.$refs.DocDialog.form.projectId = this.detailsId
          this.$refs.DocDialog.form.parent.objectId = da_title.dataRef.objectId
        })

        const keys = []
        const { children = [] } = da_title.dataRef
        keys.push(da_title.eventKey)
        console.log(keys, 'keys')
        this.setSelectedKeys(keys)
        console.log(id, da_title, da_title.eventKey, this.productDetail)
        // if (children.length == 0) {
        const rawPath = this.$route.path
        const query = {
          details: this.detailsId,
          article: da_title.dataRef.objectId,
        }
        this.delVisitedRoute(rawPath)
        console.log(rawPath, query)
        // this.$router.go(-1)
        this.$router.push({
          path: '/doc/details',
          query,
        })
        // }
      },
      async newCategory(type, treeKey) {
        this.$refs.DocDialog.form = {
          type: '',
          name: '',
          parent: {
            objectId: 'article',
            __type: 'Pointer',
            className: 'Article',
          },
          data: '',
          order: 0,
          category: '',
          Icon: '',
          desc: '',
        }
        console.log(type, treeKey)
        try {
          const loading = this.$baseColorfullLoading()
          const res = await getArticle(treeKey)
          this.$refs.DocDialog.form.projectId = this.detailsId
          this.$refs.DocDialog.key = moment(new Date()).valueOf()
          this.$refs.DocDialog.form.parent.objectId = res.objectId
          this.$refs.DocDialog.form.category = res.category
          this.$refs.DocDialog.form.type = 'add'
          console.log(this.$refs.DocDialog.form, 'this.$refs.DocDialog.form')
          this.$refs.DocDialog.dialogFormVisible = true
          loading.close()
        } catch (e) {
          console.error(e)
        }
      },
      createDoc(formName, form) {
        if (form.type == 'edit') this.putDoc(form)
        delete form.type
        this.$refs.DocDialog.$refs[`${formName}`].validate(async (valid) => {
          if (valid) {
            const loading = this.$baseColorfullLoading()
            const params = form
            const { createdAt = '' } = await createArticle(params)
            loading.close()
            if (createdAt.length) this.init()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async editDoc(formName, from) {
        this.$refs.DocDialog.$refs[`${formName}`].validate(async (valid) => {
          if (valid) {
            const loading = this.$baseColorfullLoading()
            const params = {
              category: from.category,
              ico: from.ico,
              name: from.name,
              order: from.order,
            }
            const res = await putArticle(from.objectId, params)
            loading.close()
            setTimeout(() => {
              this.getTree(this.$route.query)
              this.init()
            }, 800)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async putDoc(form) {
        delete form.createdAt
        delete form.updatedAt
        delete form.parent
        delete form.objectId
        delete form.createdAt

        try {
          const loading = this.$baseColorfullLoading()
          const res = await putArticle(this.editId, form)
          this.$baseMessage(
            this.$translateTitle('alert.Data request successfully'),
            'success',
            'vab-hey-message-success'
          )
          loading.close()
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error'
          )
        }
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .dgiot-doc {
    height: calc(100vh - #{$base-top-bar-height} * 2.7);
    overflow-x: hidden;
    overflow-y: scroll;

    &-tree {
      height: calc(100vh - #{$base-top-bar-height} * 2.7);
      overflow-x: hidden;
      overflow-y: scroll;
    }

    //background-color: #ececec;
    transition: $base-transition;

    #components-layout-demo-custom-trigger .trigger {
      padding: 0 24px;
      font-size: 18px;
      line-height: 64px;
      cursor: pointer;
      transition: color 0.3s;
    }

    #components-layout-demo-custom-trigger .trigger:hover {
      color: #1890ff;
    }

    #components-layout-demo-custom-trigger .logo {
      height: 32px;
      margin: 16px;
      background: rgba(255, 255, 255, 0.2);
    }
  }
</style>
