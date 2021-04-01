<template>
  <div class="home">
    <!-- 使用topology组件 -->
    <topology
      :configs="topologyConfigs"
      :materials="materials"
      :user="user"
      :data="data"
      @event="onEvent"
    />
  </div>
</template>

<script>
  // 导入topology-vue组件
  import topology from 'topology-vue'
  Vue.use(topology)
  import {
    defalutMenus,
    defalutUserMenus,
    defalutMaterials,
    userMaterials,
    images,
  } from './data'
  export default {
    name: 'Home',
    data: function () {
      return {
        topologyConfigs: {
          license: {
            key: '企业版授权码',
            value: '国产原创开源发展做出我们的贡献',
          },
          logo: {
            img: 'http://topology.le5le.com/assets/img/favicon.ico',
            url: 'http://topology.le5le.com',
            target: '_blank',
          },
          menus: defalutMenus,
          loginUrl: 'https://account.le5le.com',
          signupUrl: 'https://account.le5le.com',
          userMenus: defalutUserMenus,
          dataOptionsFn: (pen, key, value) => {
            // pen - 当前画笔对象
            // key - 表单输入左侧的属性名
            // value - 仅下拉搜索时有效，当前输入文本
            console.log('dataOptionsFn', pen, key, value)
            // ************
            // 根据实际业务场景 + 参数返回数组对象。
            // Do sth.
            // ************
            return [
              {
                label: '选项1',
                value: 1,
              },
              {
                label: '选项2',
                value: 2,
              },
              {
                label: '选项3',
                value: 3,
              },
            ]
          },
        },
        user: {
          username: 'le5le',
        },
        materials: {
          system: defalutMaterials,
          user: userMaterials,
          images,
          uploadUrl: '/api/file',
          uploadHeaders: {
            Authorization: 'your token',
          },
          uploadParams: {
            mydata: 1,
          },
        },
        data: {},
      }
    },
    created: function () {
      const data = window.topologyData
      // 存在缓存数据，预览页返回
      if (data) {
        this.data = { data: Object.assign({}, data) }
        setTimeout(() => {
          window.topologyData = null
        }, 200)
      } else {
        // Do sth.
      }
    },
    methods: {
      onEvent(e) {
        switch (e.name) {
          case 'logout':
            // 退出登录
            this.user = null
            // Do sth.
            break
          case 'openMaterialGroup':
            // 展开/折叠图标工具栏分组
            console.log('openMaterialGroup', e.params)
            // Do sth.
            break
          case 'addMaterial':
            // 添加“我的组件”
            // Do sth. For example:
            this.$router.push({
              path: '/',
              query: { component: '1' },
            })
            break
          case 'editMaterial':
            // 编辑“我的组件”
            // Do sth. For example:
            this.$router.push({
              path: '/',
              query: { id: e.params.id, component: '1' },
            })
            break
          case 'open':
            // 导航菜单configs.menus里面定义的action
            // 比如这里表示打开文件
            break
          case 'save':
            // 导航菜单configs.menus里面定义的action
            // 比如这里表示保存文件
            break
          case 'addImageUrl':
            // 在“我的图片”里面添加了一张新图片
            // this.addImageUrl(e.params);
            break
          case 'deleteImage':
            // 在“我的图片”里面删除了一张图片
            // this.deleteImage(e.params);
            break
          case 'preview':
            // 点击工具栏“预览”
            // 保存当前编辑数据，方便预览时直接打开
            window.topologyData = window.topology.data
            this.$router.push({
              path: '/preview',
              query: { id: 'xxx', r: '1' },
            })
            break
          // ...
          // ...
        }
      },
    },
  }
</script>
<style lang="scss">
  .home {
    height: 100vh;
  }
</style>
