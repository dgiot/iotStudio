<template>
  <dgiot-icon
    class="fold-unfold"
    :icon="collapse ? 'menu-unfold-line' : 'menu-fold-line'"
    @click.native="toggleCollapse"
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
        pictureSwitch: 'settings/pictureSwitch',
      }),
    },
    watch: {
      collapse: {
        handler(_collapse) {
          this.setTabImg(this.pictureSwitch, _collapse, 'collapse')
        },
        deep: true,
        // immediate: true,
      },
      pictureSwitch: {
        handler(_pictureSwitch) {
          this.setTabImg(_pictureSwitch, this.collapse, 'pictureSwitch')
        },
        deep: true,
        // immediate: true,
      },
    },
    mounted() {
      this.setTabImg(this.pictureSwitch, this.collapse, 'mounted')
    },
    methods: {
      setTabImg(pictureSwitch, collapse, type) {
        let img = collapse == true ? this._pcimg : this._mimg
        $('.logo-container .appendLogo').remove()
        if (pictureSwitch == true && collapse == true) {
          $('.logo-container').append(
            `<img src=${
              this.$FileServe + img
            } class="appendLogo" style="width: 100%" />`
          )
          $('.logo-container .router-link-active').css({
            display: 'none',
          })
        } else {
          $('.logo-container .appendLogo').remove()
          $('.logo-container .router-link-active').css({
            display: 'block',
          })
        }
        if (pictureSwitch == true) {
          $('.logo-container .appendLogo').remove()
          $('.logo-container').append(
            `<img src=${
              this.$FileServe + img
            } class="appendLogo" style="width: 100%" />`
          )
          $('.logo-container .router-link-active').css({
            display: 'none',
          })
        } else {
          $('.logo-container .appendLogo').remove()
          $('.logo-container .router-link-active').css({
            display: 'block',
          })
        }
      },
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
