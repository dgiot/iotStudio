<!--
* @Author: h7ml
* @Date: 2021-11-18 17:44:20
* @LastEditors: h7ml
* @LastEditTime: 2021-11-18 17:44:20
* @Description:
* @FilePath: src\views\CloudFunction\amis\editor.vue
* @DocumentLink:
-->
<template>
  <div>
    <div class="wrapper">
      <el-button
        size="mini"
        :title="$translateTitle('konva.save')"
        type="success"
        @click.native="saveAmis()"
      >
        {{ $translateTitle('konva.save') }}
      </el-button>
      <el-button
        size="mini"
        type="warning"
        @click.native="isPreview = !isPreview"
      >
        {{
          !isPreview
            ? $translateTitle('application.preview')
            : $translateTitle('task.Edit')
        }}
      </el-button>
    </div>
    <dgiot-amis v-show="isPreview" :schema="renderSchema" :show-help="false" />
    <dgiot-amis-editor
      v-show="!isPreview"
      ref="dgiotAmis"
      :amis-key="viewId"
      :schema="amisJson"
      :theme="theme"
      @onChange="onChange"
    />
  </div>
</template>

<script>
  import { putView, getView, getAmisView } from '@/api/View'
  export default {
    name: 'Editor',
    data() {
      return {
        renderSchema: {},
        theme: 'cxd',
        viewId: this.$route.query.viewId || '',
        isPreview: this.$route.query.isPreview || false,
        amisJson: {},
      }
    },
    computed: {},
    mounted() {
      if (this.viewId) this.viewData(this.viewId)
    },
    methods: {
      async onChange(e) {
        this.$refs['dgiotAmis'].setSchema(e)
        this.renderSchema = e
      },
      /**
       * @Author: h7ml
       * @Date: 2021-11-22 11:05:29
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async viewData(viewId) {
        localStorage.removeItem('parse_objectid')
        const amisEnv = {}
        try {
          const loading = this.$baseLoading(1)
          const res = await getAmisView(viewId, { mode: 1 })
          const { data, class: _class, key: parse_objectid } = res.data
          if (_class == 'Device') {
            // const { headers = { store: 'localStorage' } } = data.initApi
            // 设置amis中的变量参数。
            // 目前只设置了parse_objectid
            amisEnv['parse_objectid'] = parse_objectid
            localStorage.setItem('parse_objectid', parse_objectid)
            // headers.store == 'localStorage'
            //   ? localStorage.setItem('parse_objectid', parse_objectid)
            //   : store === 'sessionStorage'
            //   ? sessionStorage.setItem('parse_objectid', parse_objectid)
            //   : Cookies.set('parse_objectid', parse_objectid)
            console.groupCollapsed(
              `%c amis env`,
              'color:#009a61; font-size: 28px'
            )
            console.log('amisEnv', amisEnv)
            console.groupEnd()
          }
          this.amisJson = data
          this.$refs['dgiotAmis'].schema = data
          this.renderSchema = this.$refs['dgiotAmis'].schema
          this.$baseMessage(
            this.$translateTitle('alert.Data request successfully'),
            'success',
            'dgiot-hey-message-success'
          )
          loading.close()
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      /**
       * @Author: h7ml
       * @Date: 2021-11-22 11:07:21
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async saveAmis() {
        try {
          const loading = this.$baseColorfullLoading()
          const payload = {
            data: this.$refs['dgiotAmis'].getSchema(),
          }
          const res = await putView(this.$route.query.viewId, payload)
          console.groupCollapsed(
            '%c putView logs',
            'color:red; font-size: 28px; font-weight: 300'
          )
          console.table({
            id: this.$route.query.viewId,
            data: this.$refs['dgiotAmis'].schema,
          })
          console.groupEnd()
          this.$baseMessage(
            this.$translateTitle('user.update completed'),
            'success',
            'dgiot-hey-message-success'
          )
          loading.close()
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .wrapper {
    position: fixed;
    right: -10.5px;
    bottom: 145px;
    z-index: 9999;
    padding: 7px 15px;
    padding-right: 19px;
    font-size: 12px;
    font-weight: 700;
    line-height: 12px;
    color: #fff;
    cursor: pointer;
    user-select: none;
    //background-color: rgba(0, 0, 0, 0.7);
    border: 1px solid #000;
    border-radius: 4px;
    opacity: 1;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    &:hover {
      right: -4px;
      //background-color: rgba(0, 0, 0, 0.9);
    }
    i {
      margin-right: 3px;
      font-size: 12px;
    }
  }
</style>
