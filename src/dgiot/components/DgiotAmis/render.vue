<template>
  <div :key="amisKey" ref="renderBox" class="box" className="box"></div>
</template>

<script>
  import store from '@/store'
  import { mapGetters } from 'vuex'
  /**
   * @description amis配置参数
   */
  // https://baidu.gitee.io/amis/zh-CN/docs/start/getting-started#props
  // eslint-disable
  import { render as renderAmis } from 'amis'
  import { alert, confirm } from 'amis/lib/components/Alert'
  import { toast } from 'amis/lib/components/Toast'
  import copy from 'copy-to-clipboard'
  // import ReactDOM from 'react-dom'

  export default {
    name: 'AmisRender',
    props: {
      // eslint-disable-next-line
    schema: {
        type: Object,
      },
      updateLocation: {
        type: Function,
        required: false,
        default: () => {},
      },
      onAction: {
        type: Function,
        required: false,
        default: () => {},
      },
      theme: {
        type: String,
        required: false,
        default: 'antd', // antd // cxd
      },
    },
    data() {
      return {
        amisKey: moment(new Date()).format('X'),
      }
    },
    computed: {
      ...mapGetters({
        token: 'user/token',
        departmentToken: 'user/departmentToken',
      }),
    },
    mounted() {
      this.initEnv()
      console.groupCollapsed(
        `%c amis Help`,
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.info('ReactDOM', ReactDOM)
      console.info('code', this.schema)
      console.info('edit ： https://aisuda.github.io/amis-editor-demo/#/edit/0')
      console.info(
        'demo ： https://baidu.gitee.io/amis/zh-CN/docs/concepts/schema?page=1'
      )
      console.groupEnd()
      ReactDOM.render(
        renderAmis(
          this.schema,
          {
            onAction: this.onAction || this.handleAction,
            theme: this.theme,
          },
          this.env
        ),
        this.$refs.renderBox
      )
    },

    methods: {
      initEnv() {
        this.env = {
          session: 'global',
          updateLocation: this.updateLocation || this.updateRoute,
          isCurrentUrl: (to) => {
            const link = this.normalizeLink(to)
            const location = window.location
            let pathname = link
            let search = ''
            const idx = link.indexOf('?')
            if (~idx) {
              pathname = link.substring(0, idx)
              search = link.substring(idx)
            }
            if (search) {
              if (pathname !== location.pathname || !location.search) {
                return false
              }
              const query = qs.parse(search.substring(1))
              const currentQuery = qs.parse(location.search.substring(1))
              return Object.keys(query).every(
                (key) => query[key] === currentQuery[key]
              )
            } else if (pathname === location.pathname) {
              return true
            }
            return false
          },
          fetcher: ({ url, method, data, config, headers }) => {
            let replaceArr = {}
            config = config || {}
            config.headers = config.headers || {}
            config.withCredentials = true

            if (config.cancelExecutor) {
              config.cancelToken = new axios.CancelToken(config.cancelExecutor)
            }

            config.headers = headers || {}
            config.method = method
            _.merge(config.headers, {
              author: 'iotn2n',
              platform: 'amis',
              departmentToken: store.getters['user/departmentToken'],
              sessionToken: store.getters['user/token'],
            })
            if (method === 'get' && data) {
              config.params = data
              console.log('请求参数', config, config.data, data)
            } else if (data && data instanceof FormData) {
              // config.headers = config.headers || {};
              config.headers['Content-Type'] = 'multipart/form-data'
            } else if (
              data &&
              typeof data !== 'string' &&
              !(data instanceof Blob) &&
              !(data instanceof ArrayBuffer)
            ) {
              data = JSON.stringify(data)
              // config.headers = config.headers || {};
              config.headers['Content-Type'] = 'application/json'
            }
            data && (config.data = data)
            // amis headers 拦截扩展
            // 请求url变量替换。因为目前已知需要替换parse_objectid。所以不需要其他的替换配置
            localStorage.getItem('parse_objectid')
              ? url.replaceAll(
                  'parse_objectid',
                  localStorage.getItem('parse_objectid')
                )
              : ''
            if (headers?.dgiotReplace?.length) {
              const dgiotReplace = headers['dgiotReplace'].split(',') // 将dgiotReplace参数string格式转化为对象格式
              const { store = 'localStorage' } = headers // token 存储方式 默认存储在localStorage中
              console.info(
                'dgiotReplace',
                dgiotReplace,
                dgiotReplace.length,
                typeof dgiotReplace
              )
              // eslint-disable-next-line no-useless-catch
              try {
                dgiotReplace.forEach((h) => {
                  replaceArr[h] =
                    store === 'localStorage'
                      ? localStorage.getItem(h)
                      : store === 'sessionStorage'
                      ? sessionStorage.getItem(h)
                      : Cookies.get(h)
                  if (replaceArr[h] !== 'undefined' && url.indexOf(h) !== -1) {
                    console.groupCollapsed(
                      `%caxios dgiotReplace logs \n${h}`,
                      'color:#009a61; font-size: 28px; font-weight: 300'
                    )
                    // 如果有默认值,就使用默认值进行替换。
                    if (headers?.amisdefault?.length) {
                      console.log('amisdefault', headers.amisdefault)
                    }
                    url = headers?.amisdefault?.length
                      ? ''
                      : url.replaceAll(h, replaceArr[h])
                    console.log(`将变量${h}替换为了${replaceArr[h]}`)
                    console.log(`替换后的url为\n${url}`)
                    console.groupEnd()
                  } else console.warn(`需要替换的变量${h}值为${replaceArr[h]}`)
                })
              } catch (e) {
                throw e
              }
            }
            //
            console.groupCollapsed(
              `%c axios logs \n${url}`,
              'color:#009a61; font-size: 28px; font-weight: 300'
            )
            console.log('请求的headers', headers)
            console.log('请求的config', config)
            console.log('replaceArr', replaceArr)
            console.info('请求url', url)
            console.groupEnd()
            // return axios(url, config)
            // topo: fix https://gitee.com/dgiiot/dgiot/issues/I4RRY3
            // 处理静态资源部署在在二级下页面下,但是页面
            console.info('url', url)
            // 零时解决
            // 将/lite /dev 替换为空
            return axios(
              url.replace('/lite/', '/').replace('/dev/', '/'),
              config
            )
          },
          isCancel: (e) => axios.isCancel(e),
          alert,
          notify: (type, msg) => {
            toast[type]
              ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
              : console.warn('[Notify]', type, msg)
            console.log('[notify]', type, msg)
            //   当前页面路由router
            const { path } = this.$route
            // 解决设计界面弹出提示问题
            // if (!path.indexOf('design')) {
            console.log(path.indexOf('design'), path)
            this.$message({
              type: type,
              message: msg,
              duration: 2000,
              showClose: true,
            })
            // }
          },
          confirm,
          copy: (contents, options = {}) => {
            const ret = copy(contents, options)
            ret &&
              (!options || options.shutup !== true) &&
              toast.info('内容已拷贝到剪切板')
            return ret
          },
        }
      },

      updateRoute(location, replace) {
        if (location === 'goBack') {
          return this.$router.go(-1)
        }
        this.$router[replace ? 'replace' : 'push'](this.normalizeLink(location))
      },

      handleAction(e, action) {
        this.env.alert(`没有识别的动作：${JSON.stringify(action)}`)
      },

      normalizeLink(to) {
        if (/^\/api\//.test(to)) {
          return to
        }
        to = to || ''
        const location = window.location
        if (to && to[0] === '#') {
          to = location.pathname + location.search + to
        } else if (to && to[0] === '?') {
          to = location.pathname + to
        }
        const idx = to.indexOf('?')
        const idx2 = to.indexOf('#')
        let pathname = ~idx
          ? to.substring(0, idx)
          : ~idx2
          ? to.substring(0, idx2)
          : to
        const search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : ''
        const hash = ~idx2 ? to.substring(idx2) : ''
        if (!pathname) {
          pathname = location.pathname
        } else if (pathname[0] != '/' && !/^https?:\/\//.test(pathname)) {
          const relativeBase = location.pathname
          const paths = relativeBase.split('/')
          paths.pop()
          let m
          while ((m = /^\.\.?\//.exec(pathname))) {
            if (m[0] === '../') {
              paths.pop()
            }
            pathname = pathname.substring(m[0].length)
          }
          pathname = paths.concat(pathname).join('/')
        }
        return pathname + search + hash
      },
    },
    schema: {
      amisJson: {
        handler(val) {
          console.log(val)
          this.amisKey = moment(new Date()).format('X') + 'j'
        },
        immediate: true,
        deep: true,
      },
    },
  }
</script>
<style scoped>
  .box {
    height: 80vh;
    overflow: auto;
  }
</style>
