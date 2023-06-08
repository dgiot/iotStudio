<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-03-29 20:02:43
* @LastEditors: 20:02
* @LastEditTime: 2022-03-29 20:02:43
* @Description:
* @FilePath: src\views\CloudOc\MetaData\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
-->
<template>
  <div ref="custom-table" v-loading="loading" class="index-container">
    <!-- 低代码表单渲染 
    append-to-body
      :before-close="handleCloseAmis"
      center
      class="dialog_wrap"
      custom-class="dialog_index"
      top="5vh"
      :visible.sync="commandInfo.dialog"
    -->
    <div v-show="commandInfo.dialog" class="dialog_wrap">
      <el-tabs v-model="activeName" class="dialog_wrap_item_content">
        <el-tab-pane
          v-for="(item, index) in commandInfo.data"
          :key="index + 'i'"
          :label="item.title"
          lazy="true"
          :name="index + ''"
        >
          <dgiot-amis
            modal-append-to-body
            :schema="item.data"
            :show-help="false"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { putView, queryView } from '@/api/View'
  import { queryRelation } from '@/api/Relation'
  import { queryMaterial } from '@/api/MetaData'
  import { getProduct, queryProduct } from '@/api/Product'
  import {
    putDevice,
    querycompanyDevice,
    postDevice,
    delDevice,
  } from '@/api/Device'
  import { doDelete, getList } from '@/api/Mock/table'
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'
  export default {
    name: 'Index',
    components: {
      TableEdit,
    },
    props: {},
    data() {
      return {
        infoData: 'Empty',
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(0) - 40,
        stripe: true,
        lineHeight: 'mini',
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        pageNo: 1,
        wlList: [],
        wldialog: false,
        ylList: [],
        yldialog: false,
        commandInfo: {
          dialog: false,
        },
        activeName: '0',
        product: [],
        isPC: true,
        loading: true,
      }
    },
    computed: {
      dragOptions() {
        return {
          animation: 600,
          group: 'description',
        }
      },
      finallyColumns() {
        return this.columns.filter((item) =>
          this.checkList.includes(item.label)
        )
      },
    },
    watch: {},
    async created() {
      this.isPC = this.$ispc()

      // this.fetchProduct()
      // this.fetchData()
      // console.log('是否是pc端', this.$ispc())
    },
    async mounted() {
      let destId =
        JSON.parse(Base64.decode(localStorage.getItem('role')))?.vuexinfo[0]
          ?.objectId || ''
      let name =
        JSON.parse(Base64.decode(localStorage.getItem('username')))?.vuexinfo ||
        ''
      localStorage.setItem('parse_name', name)
      // localStorage.setItem('parse_productid', row.product.objectId)
      const { results = [] } = await queryRelation({
        destClass: '_Role',
        destId: destId,
        destField: 'views',
        srcClass: 'View',
      })
      if (_.isEmpty(results)) {
        this.$baseMessage('暂未配置amis', 'info', 'dgiot-hey-message-error')
        return false
      } else {
        this.commandInfo.dialog = true
        this.loading = false
        this.commandInfo.data = results
      }
    },
    destroyed() {},
    methods: {
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-27 20:45:36
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async fetchProduct() {
        try {
          const { results = [] } = await queryProduct({
            excludeKeys:
              'children,thing,decoder,topics,productSecret,desc,view,category,producttemplet',
          })
          this.product = results
        } catch (error) {}
      },
      handleCloseAmis() {
        this.coordinate = {
          lng: 116.404,
          lat: 39.915,
        }
        this.dialog_device = false
        this.commandInfo.dialog = false
        this.fetchData(false)
      },
      handleCloseDetailYl() {
        this.yldialog = false
      },
      async handleMaterial(row) {
        console.log(row)
        let params = {
          objectId: row.objectId,
        }
        const { data: list = [] } = await queryMaterial(params)
        console.log('原料清单', list)
        this.ylList = list
        this.yldialog = true
      },
      handleCloseDetailWl() {
        this.wldialog = false
      },
      //查看物料表
      handleDetail(row) {
        console.log(row)
        this.wlList = row.content?.baseInfo?.Material_List || []
        this.wldialog = true
      },
      clickFullScreen() {
        this.isFullscreen = !this.isFullscreen
        this.handleHeight()
      },
      handleHeight() {
        if (this.isFullscreen) {
          this.height = this.$baseTableHeight(1) + 210
        } else {
          this.height = this.$baseTableHeight(1)
        }
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      // handleAdd() {
      //   this.$refs['edit'].showEdit()
      // },
      // handleEdit(row) {
      //   this.$refs['edit'].showEdit(row)
      // },
      async handleOperation(row) {
        let destId =
          JSON.parse(Base64.decode(localStorage.getItem('role')))?.vuexinfo[0]
            ?.objectId || ''
        let name =
          JSON.parse(Base64.decode(localStorage.getItem('username')))
            ?.vuexinfo || ''
        localStorage.setItem('parse_objectid', row.objectId)
        localStorage.setItem('parse_name', name)
        localStorage.setItem('parse_productid', row.product.objectId)
        const { results = [] } = await queryRelation({
          destClass: '_Role',
          destId: destId,
          destField: 'views',
          srcClass: 'View',
        })
        if (_.isEmpty(results)) {
          this.$baseMessage('暂未配置amis', 'info', 'dgiot-hey-message-error')
          return false
        } else {
          this.commandInfo.dialog = true
          this.commandInfo.data = results
        }
      },

      handleDelete(row) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          const { msg } = await doDelete({ ids: row.id })
          this.$baseMessage(msg, 'success', 'dgiot-hey-message-success')
          await this.fetchData()
        })
      },
      handleSizeChange(val) {
        this.queryForm.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.pageNo = val
        this.queryForm.skip = Number(val - 1) * Number(this.queryForm.limit)
        this.fetchData()
      },
      async handleQuery() {
        this.pageNo = 1
        this.queryForm.limit = 10
        this.queryForm.skip = 0
        // this.paginationKey = moment(new Date()).valueOf() + ''
        await this.fetchData()
      },
      async fetchData() {
        console.log(this.queryForm)
        this.listLoading = true
        let params = {
          skip: this.queryForm.skip,
          limit: this.queryForm.limit,
          excludeKeys: this.queryForm.excludeKeys || '',
          // include: this.queryForm.include,
          order: this.queryForm.way,
          count: 'objectId',
          where: {}, //product: '21efa507f6'
        }
        this.queryForm.name
          ? (params.where.name = {
              $regex: this.queryForm.name,
            })
          : ''
        this.queryForm.realstatus
          ? (params.where.realstatus = this.queryForm.realstatus)
          : ''
        this.queryForm.product
          ? (params.where.product = this.queryForm.product)
          : ''
        this.queryForm.search
          ? (params.where[this.queryForm.type] = {
              $regex: this.queryForm.search,
            })
          : ''
        this.queryForm.status
          ? (params.where.status = this.queryForm.status)
          : ''
        this.queryForm.isEnable
          ? (params.where.isEnable = this.queryForm.isEnable)
          : ''
        const { results: list = [], count: total = 0 } =
          await querycompanyDevice(params, this.token)
        list.forEach((item) => {
          item.address = item.address == '' ? '---' : item.address
          item.detail = item?.detail ? item.detail : {}
          item.detail.address =
            item?.detail && item?.detail?.address ? item.detail.address : '---'
          item.isEdit = false
          item.oldName = item.name
        })
        this.list = list
        this.total = total
        this.listLoading = false
        // 订阅处理所有的设备
        // await this.subAllDevice()
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .index-container {
    width: 100%;
    height: 100%;
    .dialog_wrap_item_content {
      height: 100%;
      width: 100%;
      overflow: scroll;
    }
  }
</style>
