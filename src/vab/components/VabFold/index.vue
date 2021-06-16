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
        _pcimg: 'dashboard/_pcimg',
        _mimg: 'dashboard/_mimg',
      }),
    },
    watch: {
      collapse: {
        handler(_collapse) {
          $('.appendLogo').remove()
          $('.logo-container .router-link-active').css({
            display: 'none',
          })
          let img = this.collapse == true ? this._pcimg : this._mimg
          $('.logo-container').append(
            `<img src=${img} class="appendLogo" style="width: 100%" />`
          )
        },
        deep: true,
        immediate: true,
      },
    },
    mounted() {
      $('.appendLogo').remove()
      $('.logo-container .router-link-active').css({
        display: 'none',
      })
      let img = this.collapse == true ? this._pcimg : this._mimg
      $('.logo-container').append(
        `<img src=${img} class="appendLogo" style="width: 100%" />`
      )
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
