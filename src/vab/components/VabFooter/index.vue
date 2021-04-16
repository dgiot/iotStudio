<template>
  <footer class="vab-footer">
    <h3 v-if="Company != '云寓智慧公寓平台'">
      {{ copyright.replace(/Copyright /, '') }}
    </h3>
    <h3 v-else>{{ Company }}</h3>
  </footer>
</template>

<script>
  import { title } from '@/config'
  import { mapGetters } from 'vuex'
  import * as utils from '@/utils/vuex'
  export default {
    name: 'VabFooter',
    data() {
      return {
        Company: sessionStorage.getItem('title') || '',
        fullYear: new Date().getFullYear(),
        title,
      }
    },
    computed: {
      ...mapGetters({
        copyright: 'acl/copyright',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  .vab-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: $base-footer-height;
    color: rgba(0, 0, 0, 0.45);
    background: $base-color-white;
    border-top: 1px dashed $base-border-color;
    font-size: 12px;
    font-weight: 700;
    i {
      margin: 0 5px;
    }
  }
</style>
