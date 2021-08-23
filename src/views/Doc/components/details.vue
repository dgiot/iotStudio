<template :key="setKey">
  <div class="dgiot-doc">
    <a-row>
      <a-col :span="4">
        <div class="dgiot-doc-tree">
          <a-tree
            :auto-expand-parent="true"
            show-line
            :default-expand-all="true"
            :default-expanded-keys="selectedKeys"
            :default-selected-keys="selectedKeys"
            :tree-data="docDetails.tree"
            @click="onSelect"
          >
            <template #title="{ da_title }">
              <a-dropdown>
                <span>{{ da_title }}</span>
              </a-dropdown>
            </template>
          </a-tree>
        </div>
      </a-col>
      <a-col :span="20">
        <div class="text">
          <vab-vditor :value="productDetail.da_markdown_content" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { getSetting } from '@/api/Doc'
  export default {
    name: 'DgiotDoc',
    data() {
      return {
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
      if (_.isEmpty(this.docDetails)) this.getSetting(this.$route.query)
      if (this.articleId) this.getArticle(this.$route.query)
    },
    created() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {
      this.set_docDetails({})
      this.setSelectedKeys([])
    }, //生命周期 - 销毁完成
    activated() {},
    methods: {
      ...mapMutations({
        delVisitedRoute: 'tabs/delVisitedRoute',
        setSelectedKeys: 'global/setSelectedKeys',
        set_docDetails: 'global/set_docDetails',
      }),
      /**
       *
       * @param
       * @returns
       */
      async getArticle(params) {
        try {
          const loading = this.$baseColorfullLoading()
          const { data } = await getSetting(
            `v1/home/article-item?id=${params.article}`
          )
          this.productDetail = data.data

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
          const { data } = await getSetting(
            `v1/home/article?tree=1&project_id=${params.details}&search=`
          )
          const docDetails = data.code == 200 ? data.data : {}
          const mergerDetails = _.merge(docDetails, this.docDetails)
          console.log(
            'mergerDetails',
            mergerDetails,
            this.setKey,
            this.set_docDetails(mergerDetails)
          )

          // this.set_docDetails(mergerDetails)
          this.docDetails = mergerDetails
          this.setKey = moment(new Date()).valueOf()
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
      onSelect(id, da_title) {
        const keys = []
        const { children = [] } = da_title.dataRef
        keys.push(da_title.eventKey)
        console.log(keys, 'keys')

        this.setSelectedKeys(keys)
        console.log(id, da_title, da_title.eventKey)
        // if (children.length == 0) {
        const rawPath = this.$route.path
        const query = {
          details: this.detailsId,
          article: da_title.dataRef.id,
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
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .dgiot-doc {
    height: calc(100vh - #{$base-top-bar-height}* 2.7);
    overflow-x: hidden;
    overflow-y: scroll;
    &-tree {
      height: calc(100vh - #{$base-top-bar-height}* 2.7);
      overflow-x: hidden;
      overflow-y: scroll;
    }
    //background-color: #ececec;
    transition: $base-transition;
    #components-layout-demo-custom-trigger .trigger {
      font-size: 18px;
      line-height: 64px;
      padding: 0 24px;
      cursor: pointer;
      transition: color 0.3s;
    }

    #components-layout-demo-custom-trigger .trigger:hover {
      color: #1890ff;
    }

    #components-layout-demo-custom-trigger .logo {
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      margin: 16px;
    }
  }
</style>
