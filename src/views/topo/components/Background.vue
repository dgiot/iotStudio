<!--
* @Author: h7ml
* @Date: 2021-10-29 13:48:23
* @LastEditors: h7ml
* @LastEditTime: 2021-10-29 13:48:23
* @Description:
* @FilePath: src\views\topo\components\Background.vue
* @DocumentLink:
-->
<template>
  <div class="Background">
    <div class="demo-image__lazy">
      <el-image
        v-for="url in urls"
        :key="url"
        lazy
        :src="url"
        @click.native="setKonvaBg(url)"
      />
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'Background',
    components: {},
    data() {
      return {
        BackgroundData: [],
        productconfig: {},
        BackgroundDialog: false,
        infoData: 'Background',
        BackgroundArgs: {},
        urls: ['//img7.ddove.com/upload/20181127/134600237598.jpg'],
      }
    },
    methods: {
      ...mapActions({
        setKonvaBg: 'topo/setKonvaBg',
      }),
    },
  }
</script>
<style lang="scss" scoped>
  .Background {
    margin-top: 20px;
  }
</style>
