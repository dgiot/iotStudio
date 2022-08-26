<template>
  <div
    class="topoCard"
    :style="{ width: comp.width + 'px', height: comp.height + 'px' }"
  >
    <div class="card_content">
      <div style="font-size: 20px">
        <span style="font-weight: bold">{{ comp.text }}:</span>
        <span v-if="comp.text == '产品数量'">{{ _product_count }}</span>
        <span v-else-if="comp.text == '设备数量'">{{ _dev_count }}</span>
        <span v-else-if="comp.text == '在线设备'">{{ _dev_online_count }}</span>
        <span v-else-if="comp.text == '离线设备'">{{ _dev_off_count }}</span>
      </div>
    </div>
    <img
      src="/assets/images/topo/screen/card.png"
      :style="{ width: comp.width + 'px', height: comp.height + 'px' }"
    />
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'TopoCard',
    props: {
      comp: {
        type: Object,
        default: () => ({
          type: 'line',
          width: 262,
          hieght: 72,
        }),
      },
    },
    computed: {
      ...mapGetters({
        _product_count: 'dashboard/_product_count',
        _dev_count: 'dashboard/_dev_count', //设备总数
        _dev_online_count: 'dashboard/_dev_online_count', //在线
        _dev_off_count: 'dashboard/_dev_off_count', //离线
      }),
    },
  }
</script>
<style lang="scss" scoped>
  .topoCard {
    position: relative;
    .card_content {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
</style>
