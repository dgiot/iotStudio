<template>
  <dgiot-icon
    v-if="theme.showRefresh"
    icon="refresh-line"
    @click.native="refreshRoute"
  />
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'VabRefresh',
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
        extra: 'settings/extra',
        visitedRoutes: 'tabs/visitedRoutes',
      }),
    },
    created() {
      this.$dgiotBus.$off('refresh')
      this.$dgiotBus.$on('refresh', (args) => {
        dgiotlog.log('我调用了', args)
        // location.reload()
        // this.$router.go(0)
        this.refreshRoute()
      })
    },
    methods: {
      async refreshRoute() {
        const currentRoute = this.$route
        const parentRouteName = currentRoute.matched
          .slice(0, -1)
          .map((item) => item.name)
          .join(',')
        const otherRoutes = this.visitedRoutes.filter((item) => {
          return item.name !== currentRoute.name
        })
        if (otherRoutes.length) {
          let transferRoute = otherRoutes.find((item) => {
            return item.matched.slice(0, -1).join(',') === parentRouteName
          })
          if (!transferRoute) transferRoute = otherRoutes[0]
          this.extra.transferRouteName = currentRoute.name
          this.$router.replace(transferRoute).then(() => {
            this.extra.transferRouteName = ''
            this.$router.replace(currentRoute)
          })
        } else {
          this.$dgiotBus.$emit('reload-router-view')
        }
      },
    },
  }
</script>
