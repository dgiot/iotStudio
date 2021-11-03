<!--
* @Author: h7ml
* @Date: 2021-11-02 19:55:00
* @LastEditors: h7ml
* @LastEditTime: 2021-11-02 19:55:00
* @Description: 物模型取证组件
* @FilePath: src\views\topo\components\TopoEvidence.vue
* @document https://fonts.google.com/icons?selected=Material+Icons
* @api https://github.com/material-components/material-web/tree/ae060177fac6ab2d7987a49ff9f34f0de2c335af/packages/icon-button
* @DocumentLink:
-->
<template>
  <div class="TopoEvidence">
    <div class="TopoEvidence-content">
      <div
        class="TopoEvidence-content-icons"
        v-for="(item,index) in materialIcons"
        :key="index"
      >
        <i
          draggable
          @click="evidenceHandle(item)"
          class="material-icons"
        >
          {{ item }}
        </i>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
  export default {
    name: 'TopoEvidence',
    components: {
    },
    data() {
      return {
        materialIcons:['timeline','live_tv','personal_video','volume_up','image','archive']
      }
    },
    methods: {
      ...mapMutations({
        createdEvidence: 'topo/createdEvidence',
      }),
      evidenceHandle(icon){
        console.log(icon)
        this.createdEvidence(icon)
      }
    }
  }
</script>
<style>
  .material-icons{
    font-size: 48px !important;
    cursor: pointer;
  }
</style>
<style lang="scss" scoped>
  .TopoEvidence {
    width: 100%;
    height: 100%;
    &--content {
      width: 100%;
      height: 100%;
      .material-icons{
        font-size: 48px !important;
      }
    }
  }
</style>
