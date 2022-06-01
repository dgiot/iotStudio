<template>
  <component :is="menuComponent" v-if="!item.hidden" :item-or-menu="itemOrMenu">
    <template v-if="item.children && item.children.length">
      <el-scrollbar
        v-if="
          (layout === 'horizontal' && item.children.length > 18) ||
          (layout !== 'horizontal' && collapse && item.children.length > 18)
        "
        style="height: 86vh"
      >
        <dgiot-menu
          v-for="route in item.children"
          :key="route.path"
          :item="route"
        />
      </el-scrollbar>
      <template v-else>
        <dgiot-menu
          v-for="route in item.children"
          :key="route.path"
          :item="route"
        />
      </template>
    </template>
  </component>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'DgiotMenu',
    props: {
      item: {
        type: Object,
        required: true,
      },
      layout: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        itemOrMenu: this.item,
        menuComponent: 'DgiotMenuItem',
      }
    },
    computed: {
      ...mapGetters({
        collapse: 'settings/collapse',
      }),
    },
    created() {
      const showChildren = this.handleChildren(this.item.children)
      if (showChildren.length) {
        if (showChildren.length === 1 && this.item.alwaysShow !== true) {
          this.itemOrMenu = this.item.children[0]
        } else {
          this.menuComponent = 'DgiotSubMenu'
        }
      }
    },
    methods: {
      handleChildren(children = []) {
        if (!children) return []
        return children.filter((item) => {
          return item.hidden !== true
        })
      },
    },
  }
</script>
