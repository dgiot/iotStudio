<template>
  <div class="asian"></div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'Asian',
    props: {
      description: {
        required: false,
        type: String,
        default: '暂无数据',
      },
      width: {
        required: false,
        type: String,
        default: '100',
      },
      height: {
        required: false,
        type: String,
        default: '100',
      },
      image: {
        required: false,
        type: String,
        default: '',
      },
      imageStyle: {
        required: false,
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        objectId: 'user/objectId',
      }),
    },
    created() {
      this.setTreeFlag(false)
    },
    mounted() {
      this.setTreeFlag(false)
    },
    methods: {
      ...mapMutations({
        setTreeFlag: 'settings/setTreeFlag',
      }),
    },
  }
</script>

<style scoped>
  .asian {
    width: 100%;
    height: 100%;
    margin: 0 8px;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    background-image: url('../../../public/assets/images/Asian/55453dcb1d07771fcb5959ed24a525f.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
</style>
