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
          :rules="rules"
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
              <el-form-item :label="$translateTitle('Maintenance.Remarks')">
                <el-input
                  v-model="form.info.step1.Remarks"
                  :placeholder="
                    $translateTitle(
                      'Maintenance.Please record the processing content in detail!'
                    )
                  "
                  style="margin-bottom: 20px"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="showFooter" :span="24">
              <el-form-item
                :label="$translateTitle('Maintenance.Maintenance staff')"
                prop="info.receiveusername"
                required
              >
                <el-tree
                  ref="workGroup"
                  :data="deptTreeData"
                  default-expand-all
                  :expand-on-click-node="false"
                  node-key="index"
                  :props="roleProps"
                  style="float: left; width: 50%"
                >
                  <div slot-scope="{ node, data }" class="custom-tree-node">
                    <span
                      :class="{ selected: data.objectId == curDepartmentId }"
                      @click="handleNodeClick(data, node)"
                    >
                      {{ node.label }}
                    </span>
                  </div>
                </el-tree>
                <el-select
                  v-model="form.info.receiveusername"
                  v-loading="loading"
                  :disabled="!user.length"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  element-loading-spinner="el-icon-loading"
                  :element-loading-text="
                    $translateTitle('developer.Data is loading')
                  "
                  :placeholder="$translateTitle('product.selectdepartment')"
                  style="width: 50%"
                >
                  <el-option
                    v-for="item in user"
                    :key="item.objectId"
                    :label="item.nick"
                    :value="item.objectId"
                  >
                    <span style="float: left">{{ item.nick }}</span>
                    <span style="float: right; font-size: 14px; color: #8492a6">
                      {{ item.objectId }}
                    </span>
                  </el-option>
                </el-select>
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
  import { queryRoledepartment } from '@/api/Role/index'
  import { Roletree } from '@/api/Menu'
  import { mapGetters, mapMutations } from 'vuex'

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
      showFooter: {
        type: Boolean,
        default: false,
      },
      showHard: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        roleName: '',
        loading: false,
        user: [],
        deptTreeData: [],
        reverse: true,
        roleProps: {
          children: 'children',
          label: 'name',
        },
        rules: {
          reverse: true,
          'info.receiveusername': [
            {
              required: true,
              message: '请选择分配人员',
              trigger: 'change',
            },
          ],
        },
        curDepartmentId: '',
        activeName: 'first',
        form: this.detail,
      }
    },
    computed: {
      ...mapGetters({
        username: 'user/username',
        token: 'user/token',
        objectId: 'user/objectId',
      }),
    },
    mounted() {
      this.getRoletree()
    },
    methods: {
      ...mapMutations({
        set_deviceFlag: 'global/set_deviceFlag',
        set_deviceStep: 'global/set_deviceStep',
      }),
      async getRoletree() {
        await Roletree()
          .then((res) => {
            this.deptTreeData = res.results
            // this.setRoleTree(res.results)
            this.handleNodeClick(res.results[0], 0)
            // this.queryForm.workGroupTreeShow = false
          })
          .catch((e) => {
            dgiotlog.log(e)
          })
      },
      async handleNodeClick(data, node) {
        this.loading = true
        // this.form.info.user = ''
        this.curDepartmentId = data.objectId
        this.user = []
        this.roleName = data.name
        const { users } = await queryRoledepartment({ name: data.name })
        dgiotlog.log('res', users)
        this.user = users
        this.loading = false
      },
      dispatchUser() {
        this.$refs['form'].validate(async (valid) => {
          let _user = this.user.filter((e) => {
            return e.objectId == this.form.info.receiveusername
          })
          if (valid && this.form.info.receiveusername) {
            const setAcl = {}
            const { objectId, info, ACL: InitAcl, user } = this.form
            info.timeline.push({
              timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              h4: '已分配',
              p: `${this.username} 分配给 ${_user[0].nick}`,
            })
            dgiotlog.log('_user', _user)
            // ACL[`${'role' + ':' + this.form.info.user}`] = {
            //   read: true,
            //   write: true,
            // }
            info.receiveusername = _user[0].nick
            info.receiveuseid = _user[0].objectId
            info.receiveuserphone = _user[0].phone
            // if (_user[0].objectId !== this.objectId) {
            setAcl[`${_user[0].objectId}`] = {
              read: true,
              write: true,
            }
            setAcl[`role:${this.roleName}`] = {
              read: true,
              write: true,
            }
            // setUser.push({
            //   objectId: _user[0].objectId,
            //   __type: 'Pointer',
            //   className: '_User',
            // })
            // }
            // setAcl[`${info.receiveuseid}`] = {
            //   read: true,
            //   write: true,
            // }
            const params = {
              status: 1,
              info: info,
              ACL: _.merge(setAcl, InitAcl),
              user: {
                objectId: _user[0].objectId,
                __type: 'Pointer',
                className: '_User',
              },
            }
            dgiotlog.log(objectId, params, setAcl)
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
