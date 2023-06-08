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
    name: 'Viewtemplate',
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
              tabs: [
                {
                  body: [
                    {
                      id: 'u:f6ea7f68a5c2',
                      type: 'button',
                      label: '新增',
                      level: 'primary',
                      dialog: {
                        body: [
                          {
                            id: 'u:437457820619',
                            api: {
                              url: '/iotapi/amis/View/parse_viewid',
                              data: {
                                add: '${add}',
                                render: '${render}',
                              },
                              method: 'put',
                              headers: {
                                store: 'localStorage',
                                dgiotReplace: 'parse_viewid',
                              },
                              requestAdaptor:
                                'console.log("发送值",api)\r\napi.data.add.api = api.data.add.apitemplate.label\r\nlet item = api.data.add\r\napi.data.render ? \'\' :api.data.render = []\r\napi.data.render.push(item)\r\ndelete api.data.add\r\nreturn {\r\n  ...api\r\n}',
                            },
                            body: [
                              {
                                name: 'add.key',
                                type: 'input-text',
                                label: '模板绑定字段名',
                                required: true,
                              },
                              {
                                name: 'add.value',
                                type: 'input-text',
                                label: '映射数据',
                              },
                              {
                                name: 'add.desc',
                                type: 'input-text',
                                label: '模板字段描述',
                              },
                              {
                                name: 'add.apitemplate',
                                size: 'lg',
                                type: 'select',
                                label: '模板类别',
                                source: {
                                  url: '/iotapi/amis/View?where=%7B%22flag%22:%7B%22regex%22:%22render%22%7D%7D',
                                  data: {},
                                  method: 'get',
                                  adaptor:
                                    "let options = []\r\npayload.data.items.forEach((item) =>{\r\n  let o = {\r\n    label:item.title,\r\n    value:item.objectId\r\n  }\r\n  options.push(o)\r\n})\r\nconsole.log('options',options)\r\npayload.data.options = options\r\nreturn {\r\n  ...payload\r\n}",
                                },
                                checkAll: false,
                                required: true,
                                clearable: true,
                                joinValues: false,
                                searchable: true,
                                perPageAvailable: [10],
                              },
                            ],
                            type: 'form',
                            title: '表单',
                            initApi: {
                              url: '/iotapi/amis/View/parse_viewid',
                              method: 'get',
                              headers: {
                                store: 'localStorage',
                                dgiotReplace: 'parse_viewid',
                              },
                            },
                            checkAll: false,
                          },
                        ],
                        type: 'dialog',
                        title: '系统提示',
                      },
                      className: 'm-t-sm m-b-sm',
                      actionType: 'dialog',
                      perPageAvailable: [10],
                    },
                    {
                      id: 'u:3eabde8848f8',
                      type: 'button',
                      label: '查看替换模板',
                      level: 'primary',
                      dialog: {
                        body: [
                          {
                            id: 'u:e2b46ca1caea',
                            api: {
                              url: '/iotapi/amis/View/parse_viewid',
                              data: {
                                render: '${render}',
                              },
                              method: 'put',
                              headers: {
                                store: 'localStorage',
                                dgiotReplace: 'parse_viewid',
                              },
                              requestAdaptor:
                                "// api.data.render = JSON.parse(api.data.render)\r\nif( typeof(api.data.render)=='string'){\r\n  api.data.render = JSON.parse(api.data.render)\r\n}\r\nreturn {\r\n  ...api\r\n}",
                            },
                            body: [
                              {
                                name: 'render',
                                size: 'xxl',
                                type: 'editor',
                                label: 'JSON编辑器',
                                language: 'json',
                              },
                            ],
                            type: 'form',
                            title: '表单',
                            initApi: {
                              url: '/iotapi/amis/View/parse_viewid',
                              data: null,
                              method: 'get',
                              headers: {
                                store: 'localStorage',
                                dgiotReplace: 'parse_viewid',
                              },
                            },
                          },
                        ],
                        size: 'lg',
                        type: 'dialog',
                        title: '文本替换模板详情',
                        closeOnEsc: false,
                        closeOnOutside: false,
                        showCloseButton: true,
                      },
                      className: 'm-t-sm m-b-sm m-l',
                      actionType: 'dialog',
                      perPageAvailable: [10],
                    },
                    {
                      id: 'u:95451a18509d',
                      api: {
                        url: '/iotapi/amis/View/parse_viewid',
                        data: null,
                        method: 'get',
                        adaptor:
                          "// let options = []\r\n// payload.data.items.forEach(item =>{\r\n//  let element = {\r\n//    label:item.key,\r\n//    value:item.objectId\r\n//  }\r\n//  options.push(element)\r\n// })\r\nlet items = payload.data.render || []\r\nlocalStorage.setItem('render',JSON.stringify(items))\r\nconsole.log('api',api)\r\nif(api.query.api){\r\n  let list = []\r\n  items.forEach(item =>{\r\n    if(item.api == api.query.api){\r\n      list.push(item)\r\n    }\r\n  })\r\n  return  {\r\n...payload,\r\ndata:{\r\n  items:list\r\n}\r\n}\r\n}\r\nreturn {\r\n...payload,\r\ndata:{\r\n  items:items\r\n}\r\n}",
                        headers: {
                          store: 'localStorage',
                          dgiotReplace: 'parse_viewid',
                        },
                      },
                      type: 'crud',
                      filter: {
                        body: [
                          {
                            name: 'api',
                            size: 'lg',
                            type: 'select',
                            label: '类别',
                            source: {
                              url: '/iotapi/amis/View?where=%7B%22flag%22:%7B%22regex%22:%22render%22%7D%7D',
                              data: {},
                              method: 'get',
                              adaptor:
                                "let options = []\r\npayload.data.items.forEach((item) =>{\r\n  let o = {\r\n    label:item.title,\r\n    value:item.title\r\n  }\r\n  options.push(o)\r\n})\r\nconsole.log('options',options)\r\npayload.data.options = options\r\nreturn {\r\n  ...payload\r\n}",
                            },
                            checkAll: false,
                            clearable: true,
                            joinValues: true,
                            searchable: true,
                            perPageAvailable: [10],
                          },
                        ],
                        title: '查询条件',
                      },
                      columns: [
                        {
                          name: 'key',
                          type: 'text',
                          label: '替换文本名称',
                          placeholder: '-',
                        },
                        {
                          name: 'value',
                          type: 'text',
                          label: '映射',
                          placeholder: '-',
                        },
                        {
                          name: 'desc',
                          type: 'text',
                          label: '名称描述',
                          placeholder: '-',
                        },
                        {
                          name: 'api',
                          type: 'text',
                          label: '类别',
                          placeholder: '-',
                        },
                        {
                          type: 'operation',
                          label: '操作',
                          buttons: [
                            {
                              id: 'u:36f225eaf7bc',
                              type: 'button',
                              label: '编辑',
                              level: 'primary',
                              dialog: {
                                body: [
                                  {
                                    id: 'u:f75efa0d1722',
                                    body: [
                                      {
                                        tpl: '内容',
                                        type: 'tpl',
                                        inline: false,
                                      },
                                    ],
                                    type: 'service',
                                    messages: {},
                                    schemaApi: {
                                      url: '/iotapi/amis/View/${apitemplate.value}',
                                      data: {},
                                      method: 'get',
                                      adaptor:
                                        'return {\r\n  ...payload,\r\n  data:payload.data.data,\r\n}',
                                    },
                                  },
                                ],
                                type: 'dialog',
                                title: '编辑',
                                closeOnEsc: false,
                                closeOnOutside: false,
                                showCloseButton: true,
                              },
                              actionType: 'dialog',
                            },
                            {
                              api: {
                                url: '/iotapi/amis/View/parse_viewid',
                                data: {
                                  key: '${key}',
                                },
                                method: 'put',
                                headers: {
                                  store: 'localStorage',
                                  dgiotReplace: 'parse_viewid',
                                },
                                requestAdaptor:
                                  "console.log('删除列',api)\r\nlet render = JSON.parse(localStorage.getItem('render')) || []\r\nconsole.log('render',render)\r\nlet index = -1\r\nfor(let i =0;i<render.length;i++){\r\n  if(render[i].key == api.data.key){\r\n    index = i\r\n    break;\r\n  }\r\n}\r\nif(index != -1){\r\n  render.splice(index,1)\r\n}\r\nconsole.log('删除了',render)\r\nreturn {\r\n  ...api,\r\n  data:{\r\n    render\r\n  }\r\n}",
                              },
                              type: 'button',
                              label: '删除',
                              level: 'danger',
                              actionType: 'ajax',
                              confirmText: '确定要删除？',
                            },
                          ],
                        },
                      ],
                      checkAll: false,
                      features: ['filter', 'delete'],
                      messages: {},
                      bulkActions: [],
                      itemActions: [],
                      placeholder: '-',
                      syncLocation: false,
                      perPageAvailable: [10],
                      filterColumnCount: 3,
                    },
                  ],
                  title: '数据模板',
                },
              ],
              type: 'tabs',
              tabsMode: 'card',
              unmountOnExit: true,
            },
          ],
          style: {},
          initApi: '',
          messages: {},
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
