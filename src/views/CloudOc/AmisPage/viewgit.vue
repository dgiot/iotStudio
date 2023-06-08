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
    <!-- 11111111111 -->
    <div v-if="commandInfo.dialog" class="dialog_wrap">
      <dgiot-amis modal-append-to-body :schema="viewData" :show-help="false" />
    </div>
  </div>
</template>

<script>
  import { getView } from '@/api/View'
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'
  export default {
    name: 'Viewgit',
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
        viewData: {
          type: 'page',
          body: [
            {
              id: 'u:d3f622937cdb',
              api: {
                url: '/iotapi/amis/Git?where=%7B%22id%22:%22parse_viewid%22,%22type%22:%22${type}%22%7D',
                data: {
                  '&': '$$',
                  count: 'objectId',
                  orderBy: 'createdAt',
                  orderDir: 'desc',
                },
                method: 'get',
                adaptor:
                  ' payload.data.items.forEach(item =>{\r\n    let createdAt =  new Date(item.createdAt).toISOString().replace(/T/g, " ").replace(/\\.[\\d]{3}Z/, "")\r\n    // 处理成为时间戳\r\n\r\n    let timestamp = new Date(Date.parse(createdAt));\r\n    timestamp = timestamp.getTime();\r\n    timestamp = timestamp/1000;\r\n    // 增加8个小时，北京时间比utc时间多八个时区\r\n    item.createdAt = timestamp+8*60*60;\r\n    item.data = JSON.parse(item.data)\r\n })\r\n\r\n return {\r\n   ...payload,\r\n  \r\n }',
                headers: {
                  store: 'localStorage',
                  dgiotReplace: 'parse_viewid',
                },
              },
              type: 'crud',
              filter: {
                body: [
                  {
                    type: 'select',
                    label: '类别',
                    name: 'type',
                    options: [
                      {
                        label: 'commit',
                        value: 'commit',
                      },
                      {
                        label: 'tag',
                        value: 'tag',
                      },
                    ],
                    id: 'u:2551fa9961ec',
                    size: 'md',
                    checkAll: false,
                    clearable: true,
                  },
                ],
                title: '',
                submitOnChange: true,
              },
              columns: [
                {
                  name: 'objectId',
                  type: 'text',
                  label: 'Id',
                },
                {
                  name: 'class',
                  type: 'text',
                  label: '视图类型',
                },
                {
                  name: 'type',
                  type: 'text',
                  label: '类别',
                  width: 200,
                  quickEdit: {
                    mode: 'inline',
                    type: 'select',
                    options: [
                      {
                        label: 'commit',
                        value: 'commit',
                      },
                      {
                        label: 'tag',
                        value: 'tag',
                      },
                    ],
                    checkAll: false,
                    className: 'w-40',
                    saveImmediately: true,
                  },
                },
                {
                  name: 'createdAt',
                  type: 'datetime',
                  label: '创建时间',
                },
                {
                  type: 'operation',
                  label: '用户日志',
                  buttons: [
                    {
                      type: 'button',
                      label: '查看',
                      level: 'primary',
                      drawer: {
                        body: [
                          {
                            id: 'u:4a42fc26c68c',
                            api: {
                              url: '/iotapi/amis/Userlog?where=%7B%22user%22%3A%22${objectId}%22,%22type%22%3A%22login%22,%22data.desc%22%3A%7B%22regex%22%3A%22${desc}%22%7D%7D',
                              data: {
                                '&': '$$',
                                count: 'objectId',
                                orderBy: 'objectId',
                                orderDir: 'desc',
                              },
                              method: 'get',
                              adaptor:
                                ' payload.data.items.forEach(item =>{\r\n    let createdAt =  new Date(item.createdAt).toISOString().replace(/T/g, " ").replace(/\\.[\\d]{3}Z/, "")\r\n    // 处理成为时间戳\r\n\r\n    let timestamp = new Date(Date.parse(createdAt));\r\n    timestamp = timestamp.getTime();\r\n    timestamp = timestamp/1000;\r\n    // 增加8个小时，北京时间比utc时间多八个时区\r\n    item.createdAt = timestamp+8*60*60;\r\n })\r\n return {\r\n   ...payload\r\n }',
                            },
                            type: 'crud',
                            filter: {
                              body: [
                                {
                                  name: 'desc',
                                  size: 'md',
                                  type: 'input-text',
                                  label: '描述',
                                  clearable: true,
                                },
                              ],
                            },
                            columns: [
                              {
                                name: 'data.desc',
                                type: 'text',
                                label: '描述',
                              },
                              {
                                name: 'createdAt',
                                type: 'datetime',
                                label: '创建时间',
                              },
                              {
                                name: 'data.desc',
                                type: 'operation',
                                label: '操作',
                                buttons: [
                                  {
                                    api: 'delete:/iotapi/amis/Userlog/${objectId}',
                                    type: 'button',
                                    label: '删除',
                                    level: 'danger',
                                    actionType: 'ajax',
                                    confirmText: '确认删除嘛？',
                                    placeholder: '-',
                                  },
                                ],
                              },
                            ],
                            features: ['create'],
                            messages: {},
                            bulkActions: [],
                            itemActions: [],
                            placeholder: '-',
                            syncLocation: false,
                            headerToolbar: [
                              {
                                type: 'button',
                                label: '新增',
                                level: 'primary',
                                dialog: {
                                  body: [
                                    {
                                      api: {
                                        url: '/iotapi/amis/Userlog',
                                        data: {
                                          '&': '$$',
                                          type: 'login',
                                          'user.__type': 'Pointer',
                                          'user.objectId': '${objectId}',
                                          'user.className': '_User',
                                        },
                                        method: 'post',
                                        requestAdaptor:
                                          "api.data.ACL = {\r\n  'role:获客管理':{\r\n    'read':true,\r\n    'write':true\r\n  }\r\n}\r\nreturn {\r\n  ...api\r\n}",
                                      },
                                      body: [
                                        {
                                          mode: 'inline',
                                          name: 'data.desc',
                                          size: 'lg',
                                          type: 'input-text',
                                          label: '备注',
                                          labelClassName: 'font-bold',
                                        },
                                      ],
                                      type: 'form',
                                    },
                                  ],
                                  type: 'dialog',
                                  title: '新增日志',
                                  closeOnEsc: false,
                                  closeOnOutside: true,
                                  showCloseButton: true,
                                },
                                actionType: 'dialog',
                              },
                              'bulkActions',
                            ],
                            perPageAvailable: [10],
                          },
                        ],
                        size: 'lg',
                        type: 'drawer',
                        title: '弹框标题',
                        position: 'right',
                        resizable: true,
                        closeOnOutside: true,
                      },
                      visible: false,
                      disabled: '',
                      visibleOn: '',
                      actionType: 'drawer',
                      clearValueOnHidden: false,
                    },
                    {
                      type: 'button',
                      label: '比较',
                      level: 'dark',
                      drawer: {
                        body: [
                          {
                            id: 'u:dffe2bb80d16',
                            api: '',
                            body: [
                              {
                                name: 'currentView',
                                size: 'xxl',
                                type: 'diff-editor',
                                label: '比较 修改',
                                language: 'json',
                                diffValue: '${data.data}',
                                disabledOn: 'this.data',
                              },
                            ],
                            type: 'form',
                            title: '表单',
                            initApi: {
                              url: '/iotapi/amis/View/parse_viewid',
                              method: 'get',
                              adaptor:
                                'return {\r\n  ...payload,\r\n  data:{\r\n    currentView:payload.data.data\r\n  }\r\n}',
                              headers: {
                                store: 'localStorage',
                                dgiotReplace: 'parse_viewid',
                              },
                            },
                          },
                        ],
                        size: 'xl',
                        type: 'drawer',
                        title: '弹框标题',
                        position: 'right',
                        resizable: true,
                        closeOnOutside: true,
                      },
                      actionType: 'drawer',
                    },
                    {
                      type: 'button',
                      api: 'delete:/iotapi/amis/Git/${objectId}',
                      label: '删除',
                      level: 'danger',
                      actionType: 'ajax',
                      confirmText: '确认要删除？',
                    },
                  ],
                },
              ],
              features: ['delete', 'update'],
              messages: {},
              bulkActions: [],
              itemActions: [],
              placeholder: '-',
              primaryField: 'phone',
              syncLocation: false,
              perPageAvailable: [10],
              quickSaveItemApi: {
                url: '/iotapi/amis/Git/${objectId}',
                data: {
                  type: '${type}',
                },
                method: 'put',
              },
            },
          ],
        },
        viewId: '',
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
          // this.loading = true
          // this.commandInfo.dialog = false
          // console.log('变化了', val)
          // let viewid = val.path.split('/')[val.path.split('/').length - 1]
          // this.viewId = viewid
          // const { data = {} } = await getView(viewid)
          // this.viewData = data
          // console.log('view表单', data)
          // if (JSON.stringify(this.viewData) != '{}') {
          //   this.commandInfo.dialog = true
          //   this.loading = false
          // } else {
          //   this.$baseMessage(
          //     '未找到该低代码模板',
          //     'info',
          //     'dgiot-hey-message-error'
          //   )
          // }
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
      localStorage.setItem('parse_viewid', this.$route.query.viewid)
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
      // let viewid = location.hash.split('/')[location.hash.split('/').length - 1]
      // this.viewId = viewid
      this.commandInfo.dialog = true
      this.loading = false
      //   this.loading = false
      // const { data = {} } = await getView(viewid)
      // this.viewData = data
      // console.log('view表单', data)
      // if (JSON.stringify(this.viewData) != '{}') {
      //   this.commandInfo.dialog = true
      //   this.loading = false
      // } else {
      //   this.$baseMessage(
      //     '未找到该低代码模板',
      //     'info',
      //     'dgiot-hey-message-error'
      //   )
      // }
    },
    destroyed() {},
    methods: {
      handleToEdit() {
        console.log('this.viewData', this.viewData)
        this.$router.push({
          path: `/design/editor/amis/`,
          query: {
            viewId: this.viewId,
            type: this.viewData.type,
          },
        })
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
