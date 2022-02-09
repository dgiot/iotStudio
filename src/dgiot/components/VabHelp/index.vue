<template>
  <div
    :key="src"
    ref="custom-table"
    class="VabHelp"
    :class="{ 'vab-fullscreen': isFullscreen }"
  >
    <el-popover
      v-model="visible"
      :placement="fatherPlacement"
      :trigger="trigger"
      :width="width"
    >
      <el-tooltip slot="reference" :placement="childPlacement">
        <div slot="content">
          {{ title }}
          <br />
          {{ $translateTitle('alert.For details, please refer to') }}
          <a-popconfirm
            :cancel-text="cancelText ? cancelText : setCancelText"
            :ok-text="okText ? okText : setOkText"
            :placement="fatherPlacement"
          >
            <!--            <dgiot-icon-->
            <!--              slot="icon"-->
            <!--              style="float: right"-->
            <!--              :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"-->
            <!--              @click.native="isFullscreen = !isFullscreen"-->
            <!--            />-->
            <template slot="title">
              <iframe
                frameborder="0"
                :height="isFullscreen ? '100vh' : height"
                :src="src"
                :width="isFullscreen ? '100vh' : width"
              ></iframe>
            </template>
            <el-link type="primary">
              {{ $translateTitle('alert.Documentation') }}
            </el-link>
          </a-popconfirm>
        </div>
        <el-button circle icon="el-icon-question" />
      </el-tooltip>
    </el-popover>
  </div>
</template>

<script>
  export default {
    name: 'VabHelp',
    props: {
      okText: {
        required: false,
        type: String,
        // default: this.$translateTitle('button.determine'),
        default: '',
      },
      cancelText: {
        required: false,
        type: String,
        // default: this.$translateTitle('button.cancel'),
        default: '',
      },
      fatherPlacement: {
        required: false,
        type: String,
        default: 'bottom',
      },
      childPlacement: {
        required: false,
        type: String,
        default: 'top',
      },
      trigger: {
        required: false,
        type: String,
        default: 'click',
      },
      title: {
        required: false,
        type: String,
        default: '',
      },
      src: {
        required: true,
        type: String,
        default: 'https://tech.iotn2n.com/w/docs',
      },
      // height: {
      //   required: true,
      //   type: String,
      //   default: this.$baseTableHeight(1) - 1,
      // },
      // width: {
      //   required: true,
      //   type: String,
      //   default: '400',
      // },
    },
    data() {
      return {
        visible: false,
        isFullscreen: false,
        height: this.$baseTableHeight(1) - 1,
        width: this.$baseTableHeight(0) + 100,
        setOkText: this.$translateTitle('button.determine'),
        setCancelText: this.$translateTitle('button.cancel'),
      }
    },
  }
</script>

<style scoped>
  .VabHelp {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 42px;
    margin: 0 8px;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
  }
</style>
