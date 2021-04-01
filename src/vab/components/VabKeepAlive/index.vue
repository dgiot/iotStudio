<template>
  <keep-alive :include="cachedRoutes" :max="keepAliveMaxNum">
    <router-view :key="key" />
  </keep-alive>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { keepAliveMaxNum } from '@/config'

  export default {
    name: 'VabKeepAlive',
    data() {
      return {
        key: null,
        keepAliveMaxNum,
        dept: this.findParent(this).length,
        parentNames: null,
      }
    },
    computed: {
      ...mapGetters({
        cachedRoutes: 'routes/cachedRoutes',
      }),
    },
    watch: {
      $route: {
        handler(route) {
          // 根据判断条件决定是否更新该路由的Key, 1级路由特殊情况,直接进行更新
          // eg1. /setting/user/password
          //      路由层级  判断条件(父组件名)    key
          //      1级路由   null               /setting/user
          //      2级路由   /setting/user      /setting/user/password(fullPath)
          // eg2. /setting/user/username
          //      路由层级  判断条件(父组件名)    key
          //      1级路由   null               /setting/user
          //      2级路由   /setting/user      /setting/user/username(fullPath)
          // eg1 -> eg2: 1级路由情况特殊, 直接更新key, 新旧一致, key值保持原样, 最后1级路由会直接使用fullPath
          // eg3. /setting/system/time
          //      路由层级  判断条件(父组件名)    key
          //      1级路由   null               /setting/user
          //      2级路由   /setting/user      /setting/user/username(Keep)
          //      2级路由   /setting/system    /setting/system/time(fullPath)
          // eg2 -> eg3: 跳转新的2级路由并不是替换之前的2级路由, 而是新建了一个,
          //             旧的2级判断条件与新的不符, key值就保持不变
          //             新的2级路由, 最后一个路由, key值直接使用fullPath
          // eg3. /vab/icon/remix/list
          //      路由层级  判断条件(父组件名)    key
          //      1级路由   null               /setting/user
          //      2级路由   /setting/user      /setting/user/username(Keep)
          //      2级路由   /setting/system    /setting/system/time(Keep)
          //      2级路由   /vab/icon          /vab/icon/remix
          //      3级路由   /vab/icon/remix    /vab/icon/remix/list(fullPath)
          // eg3 -> eg4: 从2级路由跳转3级路由, 新建2级路由和3级路由各一个
          //             因旧的2级判断条件与新判断条件不符, 所以之前的key值就都保持不变,
          //             新的2级路由, 会同样记录一个自己的判断条件, 使用长1位的name作为key
          //             新的3级路由, 会使用上一个2级路由的key作为判断条件, 因为是最后一个, 所以直接使用fullPath
          // 以上为多级路由缓存的基本逻辑, 相较于直接加v-if="!noKeepAlive"的逻辑, 该逻辑减少了冗余的缓存页面,
          // 可结合相应代码实现 多级缓存, 动态路由, 单页刷新等复合功能
          // 每个路由组件独立维护自身children下的路由, 特此注释, 结合Vue Tools更加直观

          // 该路由组件的判断条件, 根据当前route更新
          const _matchedNames = this.$route.matched.map((item) => item.name)
          // 该路由的父组件名, 判断是否是统一父组件下的路由
          const _parentNames = _matchedNames.slice(0, this.dept).join(',')
          if (!this.parentNames) this.parentNames = _parentNames
          // 该路由作为中间路由[1级-最后1级前一级]使用的Key
          const _parentNamesKey = _matchedNames
            .slice(0, this.dept + 1)
            .join(',')
          // 当前路由为一级路由 或 多级路由父组件相同的情况下, 更新key, 其他情况保持不变
          if (this.dept === 1 || _parentNames === this.parentNames)
            this.key =
              this.dept === _matchedNames.length - 1
                ? route.fullPath
                : _parentNamesKey
        },
        immediate: true,
      },
    },
    methods: {
      findParent(node) {
        if (node.$options.name === 'VabAppMain') return ['VabAppMain']
        return node.$options.name === 'VabKeepAlive' ||
          node.$options.name.startsWith('El')
          ? this.findParent(node.$parent)
          : [...this.findParent(node.$parent), node.$options.name]
      },
    },
  }
</script>
