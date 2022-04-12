<template>
  <span v-if="theme.showTheme" v-show="$route.query.theme">
    <dgiot-icon icon="brush-2-line" @click.native="handleOpenTheme" />
  </span>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'DgiotTheme',
    data() {},
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    mounted() {
      console.error('this.$route.query.theme', this.$route.query.theme)
    },
    methods: {
      handleOpenTheme() {
        this.$dgiotBus.$emit('theme')
      },
    },
  }
</script>
