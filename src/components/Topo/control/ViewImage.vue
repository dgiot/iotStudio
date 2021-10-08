<template>
  <div class="view-image">
    <template v-if="editMode">
      <template v-if="imageURL != ''">
        <img
          :src="detail.style.url"
          style="width: 100%; height: 100%"
          @dragover.prevent
          @dragstart.prevent
          @drop.prevent
        />
      </template>
      <!--      <q-icon-->
      <!--        v-else-->
      <!--        name="photo_size_select_actual"-->
      <!--        size="120px"-->
      <!--        color="light"-->
      <!--      />-->
    </template>
    <template v-else>
      <img
        :src="imageURL"
        style="width: 100%; height: 100%"
        @dragover.prevent
        @dragstart.prevent
        @drop.prevent
      />
    </template>
  </div>
</template>

<script>
  import BaseView from './View'
  export default {
    name: 'ViewImage',
    components: {},
    extends: BaseView,
    props: {},
    data() {
      return {}
    },
    computed: {
      imageURL: function () {
        if (this.detail.style.url == undefined || this.detail.style.url == '') {
          return ''
        } else {
          return this.detail.style.url
        }
      },
    },
    methods: {},
  }
</script>

<style lang="scss">
  .view-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
  }
</style>
