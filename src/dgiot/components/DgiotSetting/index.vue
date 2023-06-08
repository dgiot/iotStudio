<template>
  <span>
    <dgiot-icon
      icon="settings-5-line"
      @click.native="changeThemeSetting(showThemeSetting)"
    />
  </span>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'DgiotSetting',
    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        showThemeSetting: 'settings/showThemeSetting',
      }),
    },
    methods: {
      changeThemeSetting(flag) {
        this.setshowThemeSetting(!flag)
      },
      ...mapActions({
        setshowThemeSetting: 'settings/setshowThemeSetting',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-dialog {
      &__header {
        display: none;
        border: 0 !important;
      }

      &__body {
        padding: 0;
        border: 0 !important;
      }

      .el-form-item__content {
        position: relative;

        i {
          position: absolute;
          top: 14px;
          left: $base-margin/1.5;
        }

        .el-autocomplete {
          width: 100%;

          .el-input__inner {
            width: 100%;
            height: 60px;
            padding-left: $base-padding * 2.5;
            border: 0 !important;
          }
        }
      }
    }
  }
</style>
