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
                :label="$translateTitle('Maintenance.project') + ': '"
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
                <span>{{ form.info.devicename }}</span>
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
                {{ form.info.description }}
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

            <el-col v-if="showFooter" :span="24">
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
  import { update_object } from '@/api/Parse'
  import { queryUser } from '@/api/User'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    props: {
      detail: {
        type: Object,
        default: () => {},
      },
      step: {
        type: Number,
        default: 2,
      },
      showFooter: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        reverse: true,
        activeName: 'first',
        form: this.detail,
      }
    },
    computed: {
      ...mapGetters({
        username: 'user/username',
      }),
    },
    mounted() {
      this.featUser()
    },
    methods: {
      ...mapMutations({
        set_deviceFlag: 'global/set_deviceFlag',
        set_deviceStep: 'global/set_deviceStep',
      }),
      async featUser() {
        const { results } = await queryUser({})
        this.user = results
      },
      dispatchUser() {
        this.$refs['form'].validate(async (valid) => {
          if (valid && this.form.info.receiveusername) {
            const { objectId, info } = this.form
            info.timeline.push({
              timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              h4: '已处理',
              p: `${this.username}处理了这条工单`,
            })
            const params = {
              status: 2,
              info: info,
            }
            const res = await update_object('Maintenance', objectId, params)
            if (res.updatedAt) {
              this.set_deviceFlag(false)
              this.set_deviceStep(-1)
            }
          } else {
            this.$message.error('请选择分配人员')
            dgiotlog.log('error submit!!')
            return false
          }
        })
      },
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
