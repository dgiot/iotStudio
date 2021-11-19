<!--
* @Author: h7ml
* @Date: 2021-11-10 09:45:57
* @LastEditors: h7ml
* @LastEditTime: 2021-11-10 09:45:57
* @Description:
* @FilePath: src\vab\components\VabAmis\drawerCode.vue
* @DocumentLink:
-->
<template>
  <div class="drawerCode-container">
    <el-button
      v-show="drawer == false"
      circle
      class="el-icon-edit fixed-btn"
      style="margin-left: 16px"
      type="primary"
      @click="drawer = true"
    />
    <div class="drawerCode-content">
      <el-drawer
        ref="drawer"
        v-drawerDrag
        append-to-body
        :direction="direction"
        size="50%"
        :visible.sync="drawer"
        :with-header="false"
      >
        <!--        <router-link to="/design/editor">-->
        <!--         -->
        <!--        </router-link>-->
        <el-button @click.native="toEditor('/design/editor')">
          请在amis编辑器中设计页面，并将页面配置好的json数据复制到下面的json组件中并保存
        </el-button>
        <vab-monaco-plus
          ref="monacoCode"
          :codes="monacoCode"
          :language="'json'"
          :read-only="false"
          :theme="'vs-dark'"
        />
        <div class="demo-drawer__footer">
          <el-button size="mini" @click="previewForm">
            {{ $translateTitle('application.preview') }}
          </el-button>
          <el-button
            :loading="loading"
            size="mini"
            type="primary"
            @click="submitForm"
          >
            {{
              loading
                ? $translateTitle('developer.Waitingtoreturn')
                : $translateTitle('application.submission')
            }}
          </el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
  import VabMonacoPlus from '../VabMonacoPlus'
  import { mapMutations } from 'vuex'

  export default {
    name: 'VabDrawerCode',
    components: {
      VabMonacoPlus,
    },
    props: {
      code: {
        type: Object,
        required: false,
        default: () => {},
      },
    },
    data() {
      return {
        loading: false,
        monacoCode: '',
        drawer: false,
        direction: 'rtl',
        infoData: 'drawerCode',
      }
    },
    computed: {},
    watch: {
      code: {
        handler(val) {
          this.monacoCode = JSON.stringify(val, null, 4)
        },
        immediate: true,
        deep: true,
      },
    },
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      ...mapMutations({
        set_amisJson: 'amis/set_amisJson',
      }),
      toEditor(path) {
        this.set_amisJson(
          JSON.parse(this.$refs.monacoCode.monacoEditor.getValue())
        )
        //
        this.$router.push({
          path: path,
        })
      },
      previewForm() {
        this.set_amisJson(
          JSON.parse(this.$refs.monacoCode.monacoEditor.getValue())
        )
        this.loading = false
        this.drawer = false
        clearTimeout(this.timer)
        console.log('在编辑器中的json')
        this.$dgiotBus.$emit(
          'setViewData',
          JSON.parse(this.$refs.monacoCode.monacoEditor.getValue())
        )
        console.table(JSON.parse(this.$refs.monacoCode.monacoEditor.getValue()))
        console.log('预览操作')
      },
      submitForm() {
        this.set_amisJson(
          JSON.parse(this.$refs.monacoCode.monacoEditor.getValue())
        )
        this.$dgiotBus.$emit(
          'submitCode',
          JSON.parse(this.$refs.monacoCode.monacoEditor.getValue())
        )
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .drawerCode-container {
    width: 100%;
    height: 100%;

    .fixed-btn {
      position: fixed;
      right: 24px;
      bottom: 48px;
      z-index: 999;
    }

    .demo-drawer__footer {
      text-align: center;
      cursor: pointer;
    }
  }
</style>
