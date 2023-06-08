<template>
  <footer class="dgiot-footer">
    <h3>{{ copyright }}</h3>
  </footer>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'DgiotFooter',
    computed: {
      ...mapGetters({
        copyright: 'acl/copyright',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  .dgiot-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: $base-footer-height;
    font-size: 12px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.45);
    background: $base-color-white;
    border-top: 1px dashed $base-border-color;

    i {
      margin: 0 5px;
    }
  }
</style>
