<template>
  <vab-icon
    :icon="collapse ? 'menu-unfold-line' : 'menu-fold-line'"
    class="fold-unfold"
    @click="toggleCollapse"
  />
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'VabFold',
    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        collapse: 'settings/collapse',
      }),
    },
    methods: {
      ...mapActions({
        toggleCollapse: 'settings/toggleCollapse',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  .fold-unfold {
    color: $base-color-gray;
    cursor: pointer;
  }
</style>
