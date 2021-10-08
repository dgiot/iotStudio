<template>
  <div class="dgiot-doc custom-table-container">
    <div class="dialog">
      <doc-dialog ref="DocDialog" />
    </div>
    <div class="dgiot-doc-header">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-form
            ref="form"
            :inline="true"
            label-width="0"
            :model="queryForm"
            @submit.native.prevent
          >
            <el-form-item>
              <el-input
                v-model="queryForm.name"
                clearable
                :placeholder="$translateTitle('product.title')"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                native-type="submit"
                type="primary"
                @click="queryDoc"
              >
                {{ $translateTitle('concentrator.search') }}
              </el-button>
              <el-button
                icon="el-icon-plus"
                type="primary"
                @click="newCategory('add')"
              >
                {{ $translateTitle('article.New category') }}
              </el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-left-panel>
      </vab-query-form>
    </div>
    <div class="dgiot-doc-center">
      <a-row class="dgiot-doc-center-row" :gutter="24">
        <a-col
          v-for="item in HomePageForDetails"
          :key="item.objectId"
          class="dgiot-doc-center-row-antdcol"
          :lg="8"
          :md="8"
          :sm="12"
          :span="6"
          :xl="6"
          :xs="24"
          :xxl="4.5"
        >
          <a-card
            :bordered="false"
            class="dgiot-doc-center-row-antdcol-card ant-card-bordered"
            hoverable
            :title="item.name"
          >
            <el-image slot="cover" :alt="item.ico" :src="item.ico">
              <div slot="error" class="block image-slot">
                <vab-empty height="100px" width="100" />
              </div>
            </el-image>
            <template slot="actions" class="ant-card-actions">
              <a-icon
                key="edit"
                type="edit"
                @click="newCategory('edit', item)"
              />
              <a-icon key="delete" type="delete" @click="deletDoc(item)" />
            </template>
            <el-button type="success" @click.native="goChild(item)">
              {{ $translateTitle('article.view') }}
            </el-button>
            <!--            {{ $moment(Number(item.created_at)).format('YYYY-MM-DD HH:mm:ss') }}-->
          </a-card>
        </a-col>
      </a-row>
      <el-empty v-show="HomePageForDetails.length == 0" :image-size="200" />
    </div>
  </div>
</template>

<script>
  import { uuid } from '@/utils'
  import { requireModule } from '@/utils/file'
  import {
    createArticle,
    getArticle,
    delArticle,
    putArticle,
    queryArticle,
  } from '@/api/Article'
  import { batch } from '@/api/Batch'
  export default {
    name: 'DgiotDoc',
    components: {
      ...requireModule(require.context('./components/module', true, /\.vue$/)),
    },
    data() {
      return {
        iconStyle: {
          width: '22px',
          height: '22px',
        },
        queryForm: {
          name: '',
        },
        HomePageForDetails: {},
        settingDetails: {},
      }
    },
    computed: {},
    mounted() {},
    created() {
      this.queryDoc()
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      init() {
        this.$refs.DocDialog.$refs.form.resetFields()
        this.$refs.DocDialog.dialogFormVisible = false
        this.queryDoc()
      },
      newCategory(type, item) {
        this.$refs.DocDialog.dialogFormVisible = true
        if (item) this.$refs.DocDialog.form = item
        this.$refs.DocDialog.form.type = type
      },
      deletDoc(item) {
        this.$baseConfirm(
          this.$translateTitle(
            'Maintenance.Are you sure you want to delete the current item'
          ),
          null,
          async () => {
            const loading = this.$baseColorfullLoading()
            const res = await delArticle(item.objectId)
            loading.close()

            this.$baseMessage(
              this.$translateTitle('Maintenance.successfully deleted'),
              'success',
              'vab-hey-message-success'
            )
            setTimeout(() => {
              this.queryDoc()
            }, 1200)
          }
        )
      },
      /**
       *
       * @param
       * @returns
       */
      async queryDoc() {
        this.HomePageForDetails = []
        try {
          const loading = this.$baseColorfullLoading()
          const { results = [] } = await queryArticle({
            where: {
              parent: 'article',
              name: this.queryForm.name.length
                ? { $regex: this.queryForm.name }
                : { $ne: null },
            },
          })
          this.HomePageForDetails = results
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
      createDoc(formName, form) {
        delete form.type
        form.parent.objectId.includes('article')
          ? (form.projectId = `pid_${uuid(6)}`)
          : ''
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
              this.init()
            }, 800)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      goChild(itme) {
        console.log(itme)
        this.$router.push({
          path: '/doc/details',
          query: {
            details: itme.projectId,
            // article: '',
          },
        })
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .dgiot-doc {
    height: calc(100vh - #{$base-top-bar-height}* 2.7);
    overflow-x: hidden;
    overflow-y: scroll;
    transition: $base-transition;
    &-center {
      &-row {
        margin: auto 60px !important;
        text-align: center;

        &-antdcol {
          margin-top: 20px;
          &-card {
            min-height: 220px;
            .el-image,
            .image-slot {
              width: 100px;
              height: 100px;
              margin: 0 auto;
            }
          }
        }
      }
    }
  }
</style>
