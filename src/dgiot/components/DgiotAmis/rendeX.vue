<template>
  <div :key="amisKey" ref="renderBox" className="box"></div>
</template>

<script>
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
    name: 'AmisRenderX',
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
        default: 'cxd', // antd // cxd
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
        `%c amis logs`,
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.info('ReactDOM', ReactDOM)
      console.info('code', this.schema)
      console.info('edit ： https://aisuda.github.io/amis-editor-demo/#/edit/0')
      console.info(
        'demo ： https://baidu.gitee.io/amis/zh-CN/docs/concepts/schema?page=1'
      )
      console.groupEnd()
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
          // 下面三个接口必须实现
          fetcher: ({
            url, // 接口地址
            method, // 请求方法 get、post、put、delete
            data, // 请求数据
            responseType,
            config, // 其他配置
            headers, // 请求头
          }) => {
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
              departmentToken: this.departmentToken,
              sessionToken: this.token,
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
            console.groupCollapsed(
              `%c amis axios logs`,
              'color:#009a61; font-size: 28px; font-weight: 300'
            )
            console.info('config', config)
            console.info('data', config.data)
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
        this.$nextTick((e) => {
          this.render(
            this.schema,
            this.env,
            this.handleAction,
            this.theme,
            this.$refs.renderBox
          )
        })
      },
      render(schema, env, handleAction, theme, dom) {
        const res = ReactDOM.render(
          renderAmis(
            schema,
            {
              onAction: handleAction,
              theme: theme,
            },
            env
          ),
          dom
        )
        console.groupCollapsed(
          `%c amis render logs`,
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.info(res)
        console.groupEnd()
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
