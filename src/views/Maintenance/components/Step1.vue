<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane
        :label="$translateTitle('Maintenance.Work order information')"
        name="first"
      >
        <el-form
          ref="form"
          class="create-ticker"
          :model="from"
          size="medium "
          label-width="auto"
        >
          <el-row :gutter="24">
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item :label="$translateTitle('Maintenance.project')">
                <!--                <el-input v-model="from._product" readonly disabled />-->
                <span>: {{ from._product }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.Equipment name')"
              >
                <!--                <el-input v-model="from._device" readonly disabled />-->
                <span>: {{ from._device }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item :label="$translateTitle('Maintenance.Initiator')">
                <!--                <el-input v-model="from.user" readonly disabled />-->
                <span>: {{ from.user }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.Ticket description')"
              >
                <el-input
                  v-model="from.info.description"
                  readonly
                  type="textarea"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item :label="$translateTitle('Maintenance.photo')">
                <div
                  v-for="(item, index) in from.info.photo"
                  :key="index"
                  style="float: left; margin-right: 3px"
                  class="block"
                >
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="item"
                    :preview-src-list="[`${item}`]"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-form
          ref="step1"
          class="create-ticker"
          :model="from"
          size="medium "
          label-width="auto"
        >
          <el-col :span="24">
            <el-form-item :label="$translateTitle('Maintenance.Remarks')">
              <el-input
                v-model="from.info.step1.Remarks"
                type="textarea"
                :placeholder="
                  $translateTitle(
                    'Maintenance.Please record the processing content in detail!'
                  )
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$translateTitle('Maintenance.Maintenance staff')"
            >
              <el-input
                v-model="from.info.description"
                readonly
                type="textarea"
              />
              <el-cascader :props="props" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        :label="$translateTitle('Maintenance.work process')"
        name="second"
      >
        <el-timeline v-for="item in from.info.timeline" :key="item.timestamp">
          <el-timeline-item :timestamp="item.timestamp" placement="top">
            <el-card>
              <h4>{{ item.h4 }}</h4>
              <p>{{ item.p }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  let id = 0
  export default {
    props: {
      detail: {
        type: Object,
        default: () => {},
      },
      step: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        props: {
          lazy: true,
          lazyLoad(node, resolve) {
            const { level } = node
            setTimeout(() => {
              const nodes = Array.from({ length: level + 1 }).map((item) => ({
                value: ++id,
                label: `选项${id}`,
                leaf: level >= 2,
              }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes)
            }, 1000)
          },
        },
        activeName: 'first',
        from: '',
      }
    },
    mounted() {
      this.from = this.detail
    },
    methods: {},
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-card__body {
      h3 {
        float: left;
        width: 90px;
        margin: 10px 0;
      }
      span {
        font-size: 16px;
        margin: 10px 0;
      }
    }
  }
</style>
