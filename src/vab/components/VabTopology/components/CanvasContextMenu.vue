<template lang="pug">
    .menus
      div
        a(:class='{disabled:!props.node && !props.nodes}', @click='onTop()') 置顶
      div
        a(:class='{disabled:!props.node && !props.nodes}', @click='onBottom()') 置底
      .line
      div(v-if='props.nodes')
        a(@click='onCombine()') 组合
        div
          a(@click='onCombine(true)') 包含
      div(v-if="props.node && props.node.name === 'combine'")
        a(@click='onUncombine()') 取消组合/包含
      div
        a(:class='{disabled:!props.node && !props.nodes}', @click='onLock()') {{ props.locked ? '解锁' : '锁定' }}
      .line
      div
        a(:class='{disabled:!props.node && !props.nodes && !props.line}', @click='onDel()') 删除
      .line
      div
        a.flex(@click='canvas.undo()')
          span.full 撤消
          span.ml50 Ctrl + Z
      div
        a(@click='canvas.redo()')
          | 恢复
          span.ml50 Ctrl + Shift+ Z
      .line
      div
        a.flex(@click='canvas.cut()')
          span.full 剪切
          span.ml50 Ctrl + X
      div
        a.flex(@click='canvas.copy()')
          span.full 复制
          span.ml50 Ctrl + C
      div
        a.flex(@click='canvas.parse()')
          span.full 粘贴
          span.ml50 Ctrl + V
      .line
      div
        a.flex(:class='{disabled:!props.node || !props.node.image}', @click='onCopyImage()')
          span.full 复制节点图片地址
</template>

<script>
  export default {
    props: {
      canvas: {
        type: Object,
        require: true,
        default: () => {},
      },
      props: {
        type: Object,
        require: true,
        default: () => {},
      },
    },
    data() {
      return {}
    },
    computed: {
      locked: function () {
        return this.props.locked
      },
      nodeLocked: function () {
        return this.props.node.locked
      },
    },
    methods: {
      onTop() {
        if (this.props.node) {
          this.canvas.top(this.props.node)
        }

        if (this.props.nodes) {
          for (const item of this.props.nodes) {
            this.canvas.top(item)
          }
        }

        this.canvas.render()
      },

      onBottom() {
        if (this.props.node) {
          this.canvas.bottom(this.props.node)
        }

        if (this.props.nodes) {
          for (const item of this.props.nodes) {
            this.canvas.bottom(item)
          }
        }

        this.canvas.render()
      },

      onCombine(stand) {
        if (!this.props.nodes) {
          return
        }
        this.canvas.combine(this.props.nodes, stand)
        this.canvas.render()
      },

      onUncombine() {
        if (!this.props.node) {
          return
        }
        this.canvas.uncombine(this.props.node)
        this.canvas.render()
      },

      onLock() {
        this.locked = !this.locked
        if (this.props.node) {
          this.nodeLocked = this.props.locked
        }
        if (this.props.nodes) {
          for (const item of this.props.nodes) {
            item.locked = this.props.locked
          }
        }
        if (this.props.lines) {
          for (const item of this.props.lines) {
            item.locked = this.props.locked
          }
        }
        this.canvas.render(true)
      },

      onDel() {
        this.canvas.delete()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .menus {
    min-width: 1.8rem;
    padding: 0.08rem 0;
    color: #000;
    text-align: left;
    background-color: #fff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);

    & > div {
      line-height: 2.2;
      a {
        display: block;
        padding: 0 0.2rem;
        color: #314659;
        text-decoration: none;
        cursor: pointer;

        &:hover {
          color: #1890ff;
        }

        &.flex {
          display: flex;
        }

        &.disabled {
          color: #ccc;
          cursor: default;
        }
      }
    }

    .line {
      padding: 0;
      margin: 0.05rem 0;
      background-color: transparent !important;
      border-top: 1px solid #eee;
    }
  }
</style>
