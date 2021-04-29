<!-- 组件说明 -->
<template>
  <div class="icon-selector-popper">
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item title="图标" name="1">
        <el-row :gutter="20">
          <el-col :span="24">
            <vab-query-form>
              <vab-query-form-top-panel>
                <el-form :inline="true" label-width="0" @submit.native.prevent>
                  <el-form-item label="">
                    <el-input v-model="queryForm.title" size="mini">
                      <el-button
                        slot="append"
                        native-type="submit"
                        type="primary"
                        icon="el-icon-search"
                        @click="queryData"
                      />
                    </el-input>
                  </el-form-item>
                </el-form>
              </vab-query-form-top-panel>
            </vab-query-form>
          </el-col>

          <el-col v-for="(item, index) in queryIcon" :key="index" :span="8">
            <el-card
              shadow="hover"
              @click.native="handleIcon('ri-' + item)"
              @mousedown.native="mousedown('ri-' + item)"
              @mousemove.native="mousemove('ri-' + item)"
              @mouseup.native="mouseup('ri-' + item)"
            >
              <vab-icon :icon="item" />
            </el-card>
          </el-col>
          <el-col :span="24">
            <el-pagination
              :background="background"
              :current-page="queryForm.pageNo"
              :layout="layout"
              :page-size="queryForm.pageSize"
              :total="total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="其他" name="2">
        <el-row :gutter="20">
          <el-col v-for="item in eleicon" :key="item" :span="8">
            <el-card
              shadow="hover"
              @click.native="handleIcon('el-icon-' + item)"
              @mousedown.native="mousedown('el-icon-' + item)"
              @mousemove.native="mousemove('el-icon-' + item)"
              @mouseup.native="mouseup('el-icon-' + item)"
            >
              <i :class="'el-icon-' + item"></i>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import { getIconList } from '@/api/remixIcon'
  export default {
    name: 'Allocation',
    components: {},
    data() {
      return {
        eleicon: [
          'platform-eleme',
          'eleme',
          'delete-solid',
          'delete',
          's-tools',
          'setting',
          'user-solid',
          'user',
          'phone',
          'phone-outline',
          'more',
          'more-outline',
          'star-on',
          'star-off',
          's-goods',
          'goods',
          'warning',
          'warning-outline',
          'question',
          'info',
          'remove',
          'circle-plus',
          'success',
          'error',
          'zoom-in',
          'zoom-out',
          'remove-outline',
          'circle-plus-outline',
          'circle-check',
          'circle-close',
          's-help',
          'help',
          'minus',
          'plus',
          'check',
          'close',
          'picture',
          'picture-outline',
          'picture-outline-round',
          'upload',
          'upload2',
          'download',
          'camera-solid',
          'camera',
          'video-camera-solid',
          'video-camera',
          'message-solid',
          'bell',
          's-cooperation',
          's-order',
          's-platform',
          's-fold',
          's-unfold',
          's-operation',
          's-promotion',
          's-home',
          's-release',
          's-ticket',
          's-management',
          's-open',
          's-shop',
          's-marketing',
          's-flag',
          's-comment',
          's-finance',
          's-claim',
          's-custom',
          's-opportunity',
          's-data',
          's-check',
          's-grid',
          'menu',
          'share',
          'd-caret',
          'caret-left',
          'caret-right',
          'caret-bottom',
          'caret-top',
          'bottom-left',
          'bottom-right',
          'back',
          'right',
          'bottom',
          'top',
          'top-left',
          'top-right',
          'arrow-left',
          'arrow-right',
          'arrow-down',
          'arrow-up',
          'd-arrow-left',
          'd-arrow-right',
          'video-pause',
          'video-play',
          'refresh',
          'refresh-right',
          'refresh-left',
          'finished',
          'sort',
          'sort-up',
          'sort-down',
          'rank',
          'loading',
          'view',
          'c-scale-to-original',
          'date',
          'edit',
          'edit-outline',
          'folder',
          'folder-opened',
          'folder-add',
          'folder-remove',
          'folder-delete',
          'folder-checked',
          'tickets',
          'document-remove',
          'document-delete',
          'document-copy',
          'document-checked',
          'document',
          'document-add',
          'printer',
          'paperclip',
          'takeaway-box',
          'search',
          'monitor',
          'attract',
          'mobile',
          'scissors',
          'umbrella',
          'headset',
          'brush',
          'mouse',
          'coordinate',
          'magic-stick',
          'reading',
          'data-line',
          'data-board',
          'pie-chart',
          'data-analysis',
          'collection-tag',
          'film',
          'suitcase',
          'suitcase-1',
          'receiving',
          'collection',
          'files',
          'notebook-1',
          'notebook-2',
          'toilet-paper',
          'office-building',
          'school',
          'table-lamp',
          'house',
          'no-smoking',
          'smoking',
          'shopping-cart-full',
          'shopping-cart-1',
          'shopping-cart-2',
          'shopping-bag-1',
          'shopping-bag-2',
          'sold-out',
          'sell',
          'present',
          'box',
          'bank-card',
          'money',
          'coin',
          'wallet',
          'discount',
          'price-tag',
          'news',
          'guide',
          'male',
          'female',
          'thumb',
          'cpu',
          'link',
          'connection',
          'open',
          'turn-off',
          'set-up',
          'chat-round',
          'chat-line-round',
          'chat-square',
          'chat-dot-round',
          'chat-dot-square',
          'chat-line-square',
          'message',
          'postcard',
          'position',
          'turn-off-microphone',
          'microphone',
          'close-notification',
          'bangzhu',
          'time',
          'odometer',
          'crop',
          'aim',
          'switch-button',
          'full-screen',
          'copy-document',
          'mic',
          'stopwatch',
          'medal-1',
          'medal',
          'trophy',
          'trophy-1',
          'first-aid-kit',
          'discover',
          'place',
          'location',
          'location-outline',
          'location-information',
          'add-location',
          'delete-location',
          'map-location',
          'alarm-clock',
          'timer',
          'watch-1',
          'watch',
          'lock',
          'unlock',
          'key',
          'service',
          'mobile-phone',
          'bicycle',
          'truck',
          'ship',
          'basketball',
          'football',
          'soccer',
          'baseball',
          'wind-power',
          'light-rain',
          'lightning',
          'heavy-rain',
          'sunrise',
          'sunrise-1',
          'sunset',
          'sunny',
          'cloudy',
          'partly-cloudy',
          'cloudy-and-sunny',
          'moon',
          'moon-night',
          'dish',
          'dish-1',
          'food',
          'chicken',
          'fork-spoon',
          'knife-fork',
          'burger',
          'tableware',
          'sugar',
          'dessert',
          'ice-cream',
          'hot-water',
          'water-cup',
          'coffee-cup',
          'cold-drink',
          'goblet',
          'goblet-full',
          'goblet-square',
          'goblet-square-full',
          'refrigerator',
          'grape',
          'watermelon',
          'cherry',
          'apple',
          'pear',
          'orange',
          'coffee',
          'ice-tea',
          'ice-drink',
          'milk-tea',
          'potato-strips',
          'lollipop',
          'ice-cream-square',
          'ice-cream-round',
        ],
        icon: '24-hours-fill',
        layout: 'total, prev, next',
        total: 0,
        background: true,
        height: 0,
        selectRows: '',
        queryIcon: [],
        queryForm: {
          pageNo: 1,
          pageSize: 15,
          title: '',
        },
        activeNames: '1',
      }
    },
    computed: {},
    created() {
      this.fetchData()
    },
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      mousedown(item) {
        this.$emit('fatherMousedown', item)
      },
      mousemove(item) {
        this.$emit('fatherMousemove', item)
        // console.log(item)
      },
      mouseup(item) {
        this.$emit('fatherMouseup', item)
      },

      async fetchData() {
        const { data, totalCount } = await getIconList(this.queryForm)
        this.queryIcon = data
        this.total = totalCount
      },
      handleChange(val) {
        console.log(val)
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      handleIcon(item) {
        this.icon = item
        this.queryForm.title = item
        this.$emit('handle-icon', item)
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scope>
  .icon-selector-popper {
    height: calc(100vh - #{$base-top-bar-height}* 4 - 25px);
    margin-left: 10px;
    overflow-x: hidden;
    overflow-y: scroll;
    .el—card {
      height: 40px !important;
      padding: 10px;
    }
    .el-collapse-item__header {
      display: block;
      margin: 0 auto;
      text-align: center;
    }
    .el-card__body {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 20px;
      cursor: pointer;

      i {
        font-size: 28px;
        color: $base-color-gray;
        text-align: center;
        vertical-align: middle;
        pointer-events: none;
        cursor: pointer;
      }
    }

    .el-pagination {
      margin: 0;
    }
  }
</style>
