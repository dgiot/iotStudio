<template>
  <div>
    <dgiot-icon icon="node-tree" @click.native="setTreeFlag(!treeFlag)" />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'VabRoleSwitch',
    data() {
      return {
        drawer: false,
        direction: 'rtl',
      }
    },
    computed: {
      ...mapGetters({
        treeFlag: 'settings/treeFlag',
      }),
    },
    created() {},
    methods: {
      ...mapActions({
        setTreeFlag: 'settings/setTreeFlag',
      }),
    },
  }
</script>
