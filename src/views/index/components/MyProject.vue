<template>
  <el-card shadow="hover">
    <template #header>
      <vab-icon icon="github-line" />
      我的开源项目
      <el-tag class="card-header-tag">爱我别走</el-tag>
    </template>
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in list"
        :key="index"
        :lg="12"
        :md="12"
        :sm="24"
        :xl="12"
        :xs="24"
      >
        <div
          :style="'background-image:url(' + item.image + ')'"
          class="project-card"
          @click="handleOpenWindow(item.url)"
        >
          <div class="project-card-title">{{ item.title }}</div>
          <div class="project-card-description">{{ item.description }}</div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        list: [
          {
            image:
              'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/index_images/image.jpg',
            title: 'vue-admin-beautiful(vue2.x)',
            description:
              '一款基于vue2.x + element-ui的绝佳的中后台前端开发管理框架',
            url: 'https://github.com/chuzhixin/vue-admin-beautiful/tree/master',
          },
          {
            image:
              'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/index_images/image.jpg',
            title: 'vue-admin-beautiful(vue3.x)',
            description:
              '一款基于vue3.x + ant-design-vue的绝佳的中后台前端开发管理框架',
            url:
              'https://github.com/chuzhixin/vue-admin-beautiful/tree/vue3.0-antdv',
          },
          /* {
            image: http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/index_images/image.jpg'),
            title: 'vue-admin-beautiful-template',
            description: '基础版',
            url: 'https://github.com/chuzhixin/vue-admin-beautiful-template',
          }, */
        ],
      }
    },
    methods: {
      handleOpenWindow(url) {
        window.open(url)
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-card__body {
      padding-bottom: 0 !important;
    }
  }

  .project-card {
    position: relative;
    width: 100%;
    height: 115px;
    padding: 15px;
    margin-bottom: $base-margin;
    cursor: pointer;
    background-size: 100% 100%;
    border-radius: $base-border-radius + 2px;

    &-title,
    &-description {
      margin-right: 45px;
      font-size: 20px;
      font-weight: bold;
      color: #fff;
    }

    &-description {
      font-size: 12px;
      font-weight: normal;
      line-height: 20px;
    }
  }
</style>
