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
          :model="form"
          size="medium "
          label-width="auto"
        >
          <el-row :gutter="24">
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.project') + ': '"
              >
                <!--                <el-input v-model="detail._product" readonly disabled />-->
                <span>{{ form._product }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.Equipment name') + ': '"
              >
                <!--                <el-input v-model="detail._device" readonly disabled />-->
                <span>{{ form._device }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.Initiator') + ': '"
              >
                <!--                <el-input v-model="detail.user" readonly disabled />-->
                <span>{{ form.user }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="
                  $translateTitle('Maintenance.Ticket description') + ': '
                "
              >
                {{ form.info.description }}
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.photo') + ': '"
              >
                <div
                  v-for="(item, index) in form.info.photo"
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

            <el-col v-if="showFooter" :span="24">
              <el-form-item
                :label="
                  $translateTitle('Maintenance.Evaluation description') + ': '
                "
              >
                <el-input
                  v-model="form.info.step3.Remarks"
                  type="textarea"
                  :placeholder="
                    $translateTitle(
                      'Maintenance.Please record the processing content in detail!'
                    )
                  "
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        style="height: 90%; overflow-x: hidden; overflow-y: auto"
        :label="$translateTitle('Maintenance.work process')"
        name="second"
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
              :timestamp="item.timestamp"
              placement="top"
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
  import { update_object } from '@/api/shuwa_parse'
  import { queryUser } from '@/api/User'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    props: {
      detail: {
        type: Object,
        default: () => {},
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
      }),
      async featUser() {
        const { results } = await queryUser({})
        this.user = results
      },
      dispatchUser() {
        this.$refs['form'].validate(async (valid) => {
          if (valid && this.form.info.user) {
            const { objectId, info } = this.form
            info.timeline.push({
              timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              h4: '已结单',
              p: `${this.username} 已结束这条工单`,
            })
            const params = {
              status: 3,
              info: info,
            }
            const res = await update_object('Maintenance', objectId, params)
            if (res.updatedAt) {
              this.set_deviceFlag(false)
            }
          } else {
            this.$message.error('请选择分配人员')
            console.log('error submit!!')
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
