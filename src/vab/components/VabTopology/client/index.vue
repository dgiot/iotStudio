<template lang="pug">
  .confing-layout
    .headers
      el-menu(mode='horizontal', @select='onMenu', background-color='#f8f8f8')
        el-submenu(index='file')
          template(slot='title') 文件
          el-menu-item(index='new') 新建文件
          el-menu-item(index='replace') 导入本地文件
          el-menu-item.separator
          el-menu-item(index='save') 保存到本地
          el-menu-item(index='savePng') 下载为PNG
        el-submenu(index='edit')
          template(slot='title') 编辑
          el-menu-item(index='undo') 撤消
          el-menu-item(index='redo') 重做
          el-menu-item.separator
          el-menu-item(index='copy') 复制
          el-menu-item(index='cut') 剪切
          el-menu-item(index='parse') 粘贴

      el-menu.full(mode='horizontal', background-color='#f8f8f8')
        el-menu-item(@click="handleView") 查看效果

      el-menu(mode='horizontal', background-color='#f8f8f8')
        el-menu-item 视图：{{scale}}%
        el-menu-item(index='scale', v-show="scale !== 100" @click="onState('scale',1)") 还原
        el-menu-item(index='locked', @click="onState('locked', locked ? 0 : 1)") {{ locked ? '解锁' : '锁定'}}

        el-submenu(index='lineName', title='默认连线类型')
          template(slot='title')
            i(:class='`iconfont icon-${lineName}`')
          el-menu-item(v-for='(item, index) in lineNames', :key='index', :index='`line-${item}`', @click="onState('lineName', item)")
            i(:class='`iconfont icon-${item}`')

      el-menu(mode='horizontal', background-color='#f8f8f8')
        el-submenu(index='fromArrowType', title='默认起点箭头')
          template(slot='title')
            i(:class='`iconfont icon-from-${fromArrowType}`')
          el-menu-item(v-for='(item, index) in arrowTypes', :key='index', :index='`fromArrowType-${item}`', @click="onState('fromArrowType', item)")
            i(:class='`iconfont icon-from-${item}`')

      el-menu(mode='horizontal', background-color='#f8f8f8')
        el-submenu(index='toArrowType', title='默认终点箭头')
          template(slot='title')
            i(:class='`iconfont icon-to-${toArrowType}`')
          el-menu-item(v-for='(item, index) in arrowTypes', :key='index', :index='`toArrowType-${item}`', @click="onState('toArrowType', item)")
            i(:class='`iconfont icon-to-${item}`')

      el-menu(mode='horizontal', background-color='#f8f8f8')
        el-submenu(index='lineStyle', title='连线样式')
          template(slot='title')
            span {{ lineStyle.label }}
          el-menu-item(v-for='(item, index) in lineStyleOptions', :key='item.value', @click="onState('lineStyle', item.value)")
            span {{ item.label }}
    workspace
</template>

<script>
  import workspace from '../config/workspace'

  export default {
    components: {
      workspace,
    },
    data() {
      return {
        lineStyleOptions: [
          { label: '默认', value: 'default' },
          { label: '水管', value: 'pipe' },
        ],
        lineNames: ['curve', 'polyline', 'line'],
        arrowTypes: [
          '',
          'triangleSolid',
          'triangle',
          'diamondSolid',
          'diamond',
          'circleSolid',
          'circle',
          'line',
          'lineUp',
          'lineDown',
        ],
      }
    },
    computed: {
      scale() {
        return Math.floor(this.$store.state.canvas.data.scale * 100)
      },
      lineName() {
        return this.$store.state.canvas.data.lineName
      },
      fromArrowType() {
        return this.$store.state.canvas.data.fromArrowType
      },
      toArrowType() {
        return this.$store.state.canvas.data.toArrowType
      },
      locked() {
        return this.$store.state.canvas.data.locked
      },
      lineStyle() {
        let lineStyle = this.$store.state.canvas.data.lineStyle
        let obj = this.lineStyleOptions.find((item) => item.value === lineStyle)
        return obj || {}
      },
    },
    methods: {
      handleView() {
        this.$router.push({
          path: '/client',
        })
      },
      onMenu(key, keyPath) {
        if (!key || key.indexOf('/') === 0) {
          return
        }

        switch (key) {
          case 'new':
            this.$router.push('/config')
            break
          case 'open':
            setTimeout(() => {
              this.$store.commit('canvas/setEvent', {
                name: key,
              })
            }, 100)
            break
          default:
            this.$store.commit('canvas/setEvent', {
              name: key,
            })
            break
        }
      },
      onState(key, value) {
        this.$store.commit('canvas/setEvent', {
          name: 'state',
          data: {
            key,
            value,
          },
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .confing-layout {
    height: 100%;
  }
</style>
