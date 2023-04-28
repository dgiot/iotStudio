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
    <el-button class="editAmis" @click="handleToEdit">编辑</el-button>
    <div v-if="commandInfo.dialog" class="dialog_wrap">
      <topo
        v-if="showType === 'Konva'"
        :code="viewData.konva"
        :object-id="viewId"
      />
      <dgiot-amis
        v-else
        modal-append-to-body
        :schema="viewData"
        :show-help="false"
      />
    </div>
  </div>
</template>

<script>
  import { getView, getAmisView } from '@/api/View'
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'
  import topo from '@/views/CloudFunction/lowcode/components/dgiotKonva'
  export default {
    name: 'Index',
    components: {
      TableEdit,
      topo,
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
        viewId: '',
        showType: '',
        type: '',
        key: '',
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
          this.loading = true
          this.commandInfo.dialog = false
          console.log('变化了', val)
          let viewid = val.path.split('/')[val.path.split('/').length - 1]
          this.viewId = viewid
          const { data = {} } = await getAmisView(viewid, { mode: 1 })
          this.viewData = data.data
          console.log('view表单', data)
          if (JSON.stringify(this.viewData) != '{}') {
            this.showType = data.flag
            this.type = data.type
            this.key = data.key
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
      this.loading = true
      this.commandInfo.dialog = false
      let destId =
        JSON.parse(Base64.decode(localStorage.getItem('role')))?.vuexinfo[0]
          ?.objectId || ''
      let name =
        JSON.parse(Base64.decode(localStorage.getItem('username')))?.vuexinfo ||
        ''
      localStorage.setItem('parse_name', name)
      localStorage.setItem('parse_deptid', destId)
      let viewid = location.hash.split('/')[location.hash.split('/').length - 1]
      this.viewId = viewid
      const { data = {} } = await getAmisView(viewid, { mode: 1 })
      this.viewData = data.data
      console.log('view表单', data)
      if (JSON.stringify(this.viewData) != '{}') {
        this.showType = data.flag
        this.type = data.type
        this.key = data.key
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
    methods: {
      handleToEdit() {
        console.log('this.viewData', this.showType, this.type)
        if (this.showType == 'Konva') {
          if (this.type == 'Dashboard') {
            this.$router.push({
              path: '/Topo',
              query: {
                viewid: this.viewId,
                dashboard: true,
                // productid: row.key || 'none',
              },
            })
          } else if (this.type.toLowerCase() == 'topo') {
            this.$router.push({
              path: '/Topo',
              query: {
                // viewid: row.objectId,
                // dashboard: true,
                productid: this.key,
              },
            })
          }
        } else {
          this.$router.push({
            path: `/design/editor/amis/`,
            query: {
              viewId: this.viewId,
              type: this.viewData.type,
            },
          })
        }
      },
    },
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
    .editAmis {
      position: fixed;
      top: 70px;
      right: 40px;
    }
  }
</style>
