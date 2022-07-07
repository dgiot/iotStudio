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
          label-width="auto"
          :model="form"
          size="medium "
        >
          <el-row :gutter="24">
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('equipment.Products') + ': '"
              >
                <!--                <el-input v-model="detail._product" readonly disabled />-->
                <span>{{ form.info.productname }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.Equipment name') + ': '"
              >
                <!--                <el-input v-model="detail._device" readonly disabled />-->
                <span>{{ form.info.createdname }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.Initiator') + ': '"
              >
                <!--                <el-input v-model="detail.user" readonly disabled />-->
                <span>{{ form.info.createdname }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
              <el-form-item
                :label="
                  $translateTitle('Maintenance.Ticket description') + ': '
                "
              >
                <el-input
                  v-model="form.info.description"
                  :placeholder="
                    $translateTitle(
                      'Maintenance.Please record the processing content in detail!'
                    )
                  "
                  readonly
                  type="textarea"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.photo') + ': '"
              >
                <el-carousel height="200px" :interval="2000" type="card">
                  <el-carousel-item
                    v-for="(item, index) in form.info.photo"
                    :key="index"
                  >
                    <img
                      :alt="item"
                      :src="item"
                      style="width: 100%; height: 100%"
                      :title="item"
                    />
                  </el-carousel-item>
                </el-carousel>
              </el-form-item>
            </el-col>
            <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
              <el-form-item
                :label="
                  $translateTitle('Maintenance.Processing records') + ': '
                "
              >
                <el-input
                  v-model="form.info.step2.Remarks"
                  :placeholder="
                    $translateTitle(
                      'Maintenance.Please record the processing content in detail!'
                    )
                  "
                  readonly
                  size="1"
                  style="margin: 0 0 10px"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
              <el-form-item
                :label="
                  $translateTitle('Maintenance.Evaluation description') + ': '
                "
              >
                <el-input
                  v-model="form.info.step3.Remarks"
                  :placeholder="
                    $translateTitle(
                      'Maintenance.Please record the processing content in detail!'
                    )
                  "
                  readonly
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        :label="$translateTitle('Maintenance.work process')"
        name="second"
        style="height: 90%; overflow-x: hidden; overflow-y: auto"
      >
        <el-card shadow="hover">
          <template #header>
            <el-radio-group v-model="reverse" class="card-header-radio">
              <el-radio :label="true">
                {{ $translateTitle('Maintenance.Positive order') }}
              </el-radio>
              <el-radio :label="false">
                {{ $translateTitle('Maintenance.Reverse order') }}
              </el-radio>
            </el-radio-group>
          </template>

          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="item in form.info.timeline"
              :key="item.timestamp"
              placement="top"
              :timestamp="item.timestamp"
            >
              <el-card>
                <h4>{{ item.h4 }}</h4>
                <p>{{ item.p }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    props: {
      detail: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        reverse: true,
        activeName: 'first',
        form: this.detail,
      }
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-form-item {
      margin-bottom: 0;
    }

    .el-form-item__label {
      font-weight: 700;
    }

    .el-card__body {
      h3 {
        float: left;
        width: 90px;
        margin: 10px 0;
      }

      span {
        margin: 10px 0;
        font-size: 16px;
      }
    }
  }
</style>
