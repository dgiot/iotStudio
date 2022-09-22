<template>
  <div class="changeInfo">
    <el-row class="row-bg" justify="space-around" type="flex">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          {{ $translateTitle('Maintenance.Ticket number') }} :
          {{ form.number }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          {{ $translateTitle('Maintenance.Ticket type') }} : {{ form.type }}
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple">
          {{ $translateTitle('cloudTest.Creation time') }} :
          {{ $moment(form.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </el-col>
    </el-row>
    <el-steps
      v-show="step == 4"
      :active="active"
      class="steps"
      finish-status="success"
      simple
    >
      <el-step :title="$translateTitle('Maintenance.republish')" />
      <el-step :title="$translateTitle('Maintenance.To be assigned')" />
      <el-step :title="$translateTitle('Maintenance.processing')" />
      <el-step :title="$translateTitle('Maintenance.Statement')" />
    </el-steps>
    <el-steps
      v-show="step != 4"
      :active="step"
      class="steps"
      finish-status="success"
      simple
    >
      <el-step :title="$translateTitle('Maintenance.To be assigned')" />
      <el-step :title="$translateTitle('Maintenance.processing')" />
      <el-step :title="$translateTitle('Maintenance.Statement')" />
    </el-steps>
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
        >
          <el-row :gutter="24">
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('equipment.Products') + ': '"
              >
                <span>{{ form.info.productname }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.Equipment name') + ': '"
              >
                <span>{{ form.info.devicename }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.planstartdata') + ': '"
              >
                <span>
                  {{ $moment(form.info.startdata).format('YYYY-MM-DD') }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.planenddata') + ': '"
              >
                <span>
                  {{ $moment(form.info.completiondata).format('YYYY-MM-DD') }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.Initiator') + ': '"
              >
                <span>{{ form.info.createdname }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.principal') + ': '"
              >
                <el-select
                  v-if="step == 4 && objectid == form.info.created"
                  v-model="form.info.principal"
                  :placeholder="$translateTitle('Maintenance.selectprincipal')"
                  style="width: 60%"
                  @change="principalChange"
                >
                  <el-option
                    v-for="item in user"
                    :key="item.objectId"
                    :label="item.nick"
                    :value="item.objectId"
                  />
                </el-select>
                <span v-else>{{ form.info.principalname }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.executor') + ': '"
              >
                <el-select
                  v-if="step == 4 && objectid == form.info.created"
                  v-model="form.info.executor"
                  :placeholder="$translateTitle('Maintenance.selectexecutor')"
                  style="width: 60%"
                  @change="executorChange"
                >
                  <el-option
                    v-for="item in user"
                    :key="item.objectId"
                    :label="item.nick"
                    :value="item.objectId"
                  />
                </el-select>
                <span v-else>{{ form.info.executorname }}</span>
              </el-form-item>
            </el-col>
            <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
              <el-form-item
                :label="
                  $translateTitle('Maintenance.Ticket description') + ': '
                "
                style="margin-top: 10px"
              >
                <el-input
                  v-if="
                    (form.status != 2 && objectid == form.info.executor) ||
                    (form.status == 3 && objectid == form.info.created)
                  "
                  v-model="form.info.description"
                  type="textarea"
                />
                <span v-else>
                  {{ form.info.description }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
              <el-form-item
                :label="$translateTitle('Maintenance.photo') + ': '"
                style="margin-top: 10px"
              >
                <el-upload
                  v-if="
                    (form.status != 2 && objectid == form.info.executor) ||
                    (form.status == 3 && objectid == form.info.created)
                  "
                  action="#"
                  :auto-upload="true"
                  :http-request="myUpload"
                  list-type="picture-card"
                >
                  <i slot="default" class="el-icon-plus"></i>
                </el-upload>
                <el-carousel
                  v-if="form.info.photo"
                  height="200px"
                  :interval="2000"
                  type="card"
                >
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
                :label="$translateTitle('Maintenance.Remarks') + ': '"
                style="margin-top: 10px"
              >
                <el-input
                  v-if="
                    (form.status != 2 && objectid == form.info.executor) ||
                    (form.status == 3 && objectid == form.info.created)
                  "
                  v-model="form.info.Remarks"
                  :placeholder="
                    $translateTitle(
                      'Maintenance.Please record the processing content in detail!'
                    )
                  "
                  style="margin-bottom: 20px"
                  type="textarea"
                />
                <span v-else>
                  {{ form.info.Remarks }}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        v-if="form.type == '巡检'"
        :label="$translateTitle('Maintenance.inspection data')"
        name="second"
        style="height: 90%; overflow-x: hidden; overflow-y: auto"
      >
        <div class="card_content">
          <div
            v-for="(item, key) in form.info.dynamicdata"
            :key="key + 'd'"
            class="card_content_item"
          >
            <div class="card_name">
              <div>
                {{ item.name }}
              </div>
              <div style="color: #e8b300">
                {{ item.unit }}
              </div>
            </div>
            <div class="card_value">
              <input
                v-model="item.number"
                class="card_number"
                :placeholder="item.name"
                type="text"
              />
              <!-- disabled -->
            </div>
            <div class="card_time"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="$translateTitle('Maintenance.work process')"
        name="third"
        style="height: 90%; overflow-x: hidden; overflow-y: auto"
      >
        <el-card shadow="hover">
          <template #header>
            <el-radio-group v-model="reverse" class="card-header-radio">
              <el-radio :label="false">
                {{ $translateTitle('Maintenance.Positive order') }}
              </el-radio>
              <el-radio :label="true">
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
  import { UploadImg } from '@/api/File'
  import { getRoleuser } from '@/api/Role'
  import { mapGetters, mapMutations } from 'vuex'
  import { update_object } from '@/api/Parse'

  export default {
    name: 'ChangeStep',
    components: {},
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
        user: [],
        activeName: 'first',
        active: 1,
        rules: {},
        form: this.detail,
        reverse: false,
      }
    },
    computed: {
      ...mapGetters({
        _Product: 'user/_Product',
        objectid: 'user/objectId',
        role: 'acl/role',
        username: 'user/username',
        currentDepartment: 'user/currentDepartment',
      }),
    },
    watch: {
      detail: {
        handler(newData) {
          this.form = newData
        },
        deep: true,
      },
    },
    mounted() {
      this.roleuser()
    },
    methods: {
      async roleuser() {
        let params = {
          where: {
            objectId: this.currentDepartment.objectId,
          },
          include: true,
          limit: 10,
        }
        const { results } = await getRoleuser(params)
        this.user = results
      },
      principalChange(e) {
        this.user.map((p) => {
          if (p.objectId == e) {
            this.form.info.principalname = p.nick
          }
        })
      },
      executorChange(e) {
        this.user.map((p) => {
          if (p.objectId == e) {
            this.form.info.executorname = p.nick
          }
        })
      },
      myUpload(content) {
        const file = content.file
        let extension = file.name.substring(file.name.lastIndexOf('.') + 1)
        const params = {
          file: file,
          // scene: 'ticket',
          path: 'ticket',
          filename: 'ticket' + `${moment().format('x')}.${extension}`,
        }
        UploadImg(params)
          .then((res) => {
            console.log(res)
            if (res.data.url) {
              this.form.info.photo.push(res.data.url)
            } else {
            }
          })
          .catch((e) => {})
      },
    },
  }
</script>
<style lang="scss" scoped>
  .changeInfo {
    .steps {
      margin: 20px 0;
    }
  }
  /* 数据卡片列表 */
  .card_content {
    display: flex;
    flex-wrap: wrap;
  }

  .card_content_item {
    width: 22%;
    margin: 1%;
    background-color: #fff;
    box-shadow: 1px 1px 1px 1px #ccc;
  }

  .card_name {
    display: flex;
    justify-content: space-between;
    padding: 0.5em 0.4em;
  }

  .card_value {
    padding-left: 20%;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  }

  .card_number {
    color: #1e49c5;
    width: 80%;
    border: 0;
  }
  .card_time {
    height: 0.5em;
    width: 100%;
  }
  input {
    outline: none;
  }
</style>
