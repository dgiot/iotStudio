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
      <dgiot-amis modal-append-to-body :schema="viewData" :show-help="false" />
    </div>
  </div>
</template>

<script>
  import { getView } from '@/api/View'
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
        viewData: {},
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
    watch: {
      $route: {
        handler: async function (val, oldVal) {
          console.log('变化了', val)
          let viewid = val.path.split('/')[val.path.split('/').length - 1]
          const { data = {} } = await getView(viewid)
          this.viewData = data
          console.log('view表单', data)
          if (JSON.stringify(this.viewData) != '{}') {
            this.commandInfo.dialog = true
            this.loading = false
          } else {
            this.$baseMessage(
              '未找到该低代码模板',
              'info',
              'dgiot-hey-message-error'
            )
          }
        },
        // 深度观察监听
        deep: true,
      },
    },
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
      localStorage.setItem('parse_deptid', destId)
      let viewid = location.hash.split('/')[location.hash.split('/').length - 1]
      const { data = {} } = await getView(viewid)
      this.viewData = data
      console.log('view表单', data)
      if (JSON.stringify(this.viewData) != '{}') {
        this.commandInfo.dialog = true
        this.loading = false
      } else {
        this.$baseMessage(
          '未找到该低代码模板',
          'info',
          'dgiot-hey-message-error'
        )
      }
    },
    destroyed() {},
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
