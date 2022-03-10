<template>
  <span v-if="theme.showTheme" v-show="false">
    <dgiot-icon icon="brush-2-line" @click.native="handleOpenTheme" />
  </span>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'DgiotTheme',
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    methods: {
      handleOpenTheme() {
        this.$dgiotBus.$emit('theme')
      },
    },
  }
</script>
