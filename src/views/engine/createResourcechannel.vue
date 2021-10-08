<template>
  <div class="createResourcechannel">
    <vab-input ref="uploadFinish" @fileInfo="fileInfo" />
    <el-form
      ref="addchannel"
      label-width="auto"
      :model="addchannel"
      :rules="addrules"
      size="mini"
    >
      <div class="dialog-footer" style="margin: 15px">
        <el-button @click="handleClose">
          {{ $translateTitle('developer.back') }}
        </el-button>
        <el-button type="primary" @click.native="addchannelForm('addchannel')">
          {{ $translateTitle('developer.create') }}
        </el-button>
      </div>
      <el-row>
        <el-form-item label="通道类型" prop="region">
          <el-select
            v-model="addchannel.region"
            placeholder="通道类型"
            style="display: block"
            @change="removeauto"
          >
            <el-option
              v-for="(item, index) in channelregion"
              :key="index"
              :label="item.title.zh"
              style="display: block"
              :value="item.cType"
            />
          </el-select>
        </el-form-item>
        <el-col :span="12">
          <el-form-item
            :label="$translateTitle('developer.channelname')"
            prop="name"
          >
            <el-input
              v-model="addchannel.name"
              autocomplete="off"
              :placeholder="$translateTitle('developer.channelname')"
              style="float: left"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属应用" prop="applicationtText">
            <el-input
              v-model="addchannel.applicationtText"
              readonly
              @focus="showTree = !showTree"
            />
            <div v-if="showTree" class="device-tree">
              <el-tree
                :data="allApps"
                default-expand-all
                :props="defaultProps"
                @node-click="handleNodeClick"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col v-for="(item, index) in arrlist" :key="index" :span="12">
          <el-form-item
            v-show="item.showname != 'ico'"
            :label="item.title.zh"
            :prop="item.showname"
            :required="item.required"
          >
            <el-tooltip effect="dark" placement="right-start">
              <div slot="content">
                {{ item.description.zh }}
              </div>
              <i class="el-icon-question" style="float: left" />
            </el-tooltip>
            <el-input
              v-if="item.type == 'string'"
              v-model="addchannel[item.showname]"
              style="width: 98%"
            />
            <el-input
              v-else-if="item.type == 'integer'"
              v-model.number="addchannel[item.showname]"
              style="width: 98%"
            />
            <el-image
              v-else-if="item.showname == 'ico'"
              style="display: none; width: 98%"
            />
            <el-select
              v-else-if="item.type == 'boolean'"
              v-model="addchannel[item.showname]"
              class="notauto"
              readonly
              style="width: 98%"
            >
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
            <el-select
              v-else-if="item.type == 'enum'"
              v-model="addchannel[item.showname]"
              style="width: 98%"
            >
              <el-option
                v-for="(item1, index1) in item.enum"
                :key="index1"
                :label="item.enum[index1]"
                :value="item.enum[index1]"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!---------------------统一的配置描述---------------------------->
        <el-col :span="24">
          <el-form-item :label="$translateTitle('developer.describe')">
            <el-input
              v-model="addchannel.desc"
              autocomplete="off"
              :placeholder="$translateTitle('developer.describe')"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-row
            :gutter="24"
            style="
              width: 100%;
              max-height: 500px;
              margin: 0;
              overflow-x: hidden;
              overflow-y: scroll;
              line-height: 30px;
              text-align: center;
            "
          >
            <el-col
              v-for="(item, index) in channelregion"
              :key="index"
              :span="4"
              style="padding: 10px; margin: 0px; cursor: pointer"
            >
              <el-card
                class="box-card"
                :shadow="addchannel.region == item.cType ? 'always' : 'hover'"
                size="mini"
                :style="{
                  color:
                    addchannel.region == item.cType ? '#00bad0' : '#c0c4cc',
                }"
              >
                <!--                <div slot="header" class="clearfix">-->
                <!--                  <el-button-->
                <!--                    :disabled="resourceid != ''"-->
                <!--                    :type="-->
                <!--                      addchannel.region == item.cType ? 'success' : 'primary'-->
                <!--                    "-->
                <!--                    size="mini"-->
                <!--                    style="text-align: center"-->
                <!--                    @click="setCard(item.cType)"-->
                <!--                  >-->
                <!--                    {{ addchannel.region == item.cType ? '已选' : '选择' }}-->
                <!--                  </el-button>-->
                <!--                  <p>{{ item.title.zh }}</p>-->
                <!--                </div>-->
                <div class="text item" @click="setCard(item.cType)">
                  <el-row :gutter="24">
                    <el-col :span="6">
                      <img
                        class="image"
                        :src="
                          item.params.ico.default
                            ? item.params.ico.default
                            : 'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/logo/logo.png'
                        "
                        style="width: 50px; height: 50px"
                      />
                    </el-col>
                    <el-col :span="18">
                      <span>
                        <p>
                          <el-tag
                            style="
                              float: left;
                              color: black;
                              text-align: left;
                              background: #fff;
                            "
                          >
                            {{ item.cType }}
                          </el-tag>
                        </p>
                        <p :title="item.title.zh">
                          {{ item.title.zh }}
                        </p>
                      </span>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { resourceTypes, putResourceTypes } from '@/api/Rules'
  import { postChannel } from '@/api/Channel'
  import { mapActions, mapGetters } from 'vuex'
  export default {
    name: 'CreateResourcechannel',
    components: {},
    data() {
      return {
        channelregion: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        resourceid: '',
        showTree: false,
        allApps: [],
        arrlist: [],
        addrules: {
          applicationtText: [
            { required: true, message: '请选择所属应用', trigger: 'change' },
          ],
          name: [
            { required: true, message: '请输入通道名称', trigger: 'blur' },
          ],
          region: [
            { required: true, message: '请选择通道类型', trigger: 'change' },
          ],
        },
        addchannel: {
          name: '',
          region: '',
        },
      }
    },
    computed: {
      ...mapGetters({
        roleTree: 'user/roleTree',
      }),
    },
    mounted() {
      this.getResource()
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      ...mapActions({
        addVisitedRoute: 'tabs/addVisitedRoute',
        delVisitedRoute: 'tabs/delVisitedRoute',
        delOthersVisitedRoutes: 'tabs/delOthersVisitedRoutes',
        delLeftVisitedRoutes: 'tabs/delLeftVisitedRoutes',
        delRightVisitedRoutes: 'tabs/delRightVisitedRoutes',
        delAllVisitedRoutes: 'tabs/delAllVisitedRoutes',
      }),
      // initFrom
      initFrom() {
        this.addchannel = {}
        this.channelForm = false
        this.$refs['addchannel'].resetFields()
        this.resourceid = ''
      },
      uploadCkick(type, index) {
        console.log(type, index)
        this.channeindex = index
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
      },
      async fileInfo(info) {
        console.log('uploadFinish', info)
        console.log(this.channelregion)
        this.channelregion[this.channeindex].params.ico.default = info.url
        console.log(this.channelregion[this.channeindex].params.ico.default)
        const res = await putResourceTypes(this.channelregion)
        console.log(res)
      },
      // 关闭本页面
      handleClose() {
        this.handleTabRemove()
      },
      addchannelForm(formName) {
        console.log(this.addchannel.applicationtText)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var obj = {}
            for (var key in this.addchannel) {
              obj[key] = this.addchannel[key]
            }
            delete obj.region
            delete obj.desc
            delete obj.type
            delete obj.isEnable
            delete obj.name
            const aclKey = 'role' + ':' + this.addchannel.applicationtText
            const aclObj = {}
            aclObj[aclKey] = { read: true, write: true }
            const data = {
              ACL: aclObj,
              config: obj,
              name: this.addchannel.name,
              cType: this.addchannel.region,
              desc: this.addchannel.desc,
              isEnable: false,
              status: 'OFFLINE',
              type: this.addchannel.type.toString(),
            }
            this.addchannelaxios(data)
          } else {
            this.$message('有必填项未填')
          }
        })
      },
      setCard(item) {
        this.removeauto(item)
      },
      orderObject(object) {
        var arr = []
        for (var key in object) {
          object[key].showname = key
          arr.push(object[key])
        }
        return arr.sort(this.arrSort)
      },
      removeauto(val) {
        console.log(val)
        var obj = {}
        var obj1 = {
          applicationtText: [
            { required: true, message: '请选择所属应用', trigger: 'change' },
          ],
          name: [
            { required: true, message: '请输入通道名称', trigger: 'blur' },
          ],
          region: [
            { required: true, message: '请选择通道类型', trigger: 'change' },
          ],
        }
        if (this.resourceid == '') {
          this.channelregion.map((item) => {
            if (item.cType == val) {
              this.$forceUpdate()
              this.selectregion = item
              this.arrlist = this.orderObject(this.selectregion.params)
              this.arrlist.map((item) => {
                //  这里过滤掉 showname 为ico的
                if (item.default) {
                  obj[item.showname] = item.default
                } else {
                  obj[item.showname] = ''
                }
                if (item.required) {
                  if (item.type == 'string' || item.type == 'integer') {
                    obj1[item.showname] = [{ required: true, trigger: 'blur' }]
                  } else {
                    obj1[item.showname] = [
                      { required: true, trigger: 'change' },
                    ]
                  }
                }
              })
              console.log('arr', this.arrlist)
              obj.region = val
              obj.desc = ''
              obj.name = ''
              obj.type = this.selectregion.type
              obj.isEnable = false
            }
          })
        } else {
          this.channelregion.map((item) => {
            if (item.cType == val) {
              this.selectregion = item
              this.$forceUpdate()
              this.arrlist = this.orderObject(this.selectregion.params)
              this.arrlist.map((item) => {
                for (var key in this.channelrow.config) {
                  if (item.showname == key) {
                    obj[item.showname] = this.channelrow.config[key]
                  }
                  if (item.required) {
                    if (item.type == 'string' || item.type == 'integer') {
                      obj1[item.showname] = [
                        { required: true, trigger: 'blur' },
                      ]
                    } else {
                      obj1[item.showname] = [
                        { required: true, trigger: 'change' },
                      ]
                    }
                  }
                  obj.region = val
                  obj.desc = this.channelrow.desc
                  obj.name = this.channelrow.name
                  obj.type = this.selectregion.type
                  obj.isEnable = this.channelrow.isEnable
                  // obj.applicationtText =
                }
              })
            }
          })
        }
        // 读取acl列表,获取所属应用名称
        if (this.channelrow) {
          for (var key in this.channelrow.ACL) {
            obj.applicationtText = key ? key.substr(5) : ''
          }
        }
        console.log('obj', obj)
        this.addchannel = obj
        this.addchannel.region = val
        this.addrules = obj1
      },
      async addchannelaxios(data) {
        await postChannel(data).then((results) => {
          if (results) {
            this.$message({
              type: 'success',
              message: this.channelupdated == '编辑' ? '编辑成功' : '创建成功',
            })
            // this.$refs['addchannel'].resetFields()
            this.addchannel = {}
            // this.reload()
            this.channelForm = false
            this.resourceid = ''
            // 创建成功后返回通道管理页，关闭当前页
            this.handleTabRemove()
          }
        })
      },
      /**
       * 根据原生路径删除标签中的标签
       * @param rawPath 原生路径
       * @returns {Promise<void>}
       */
      async handleTabRemove() {
        const rawPath = this.$route.path
        await this.delVisitedRoute(rawPath)
        this.$router.go(-1)
      },
      handleNodeClick(data) {
        this.$set(this.addchannel, 'applicationtText', data.name)
        this.showTree = !this.showTree
      },
      clearValidate(type) {
        console.log(`清除了 ${type} 的规则校验`)
        this.$refs.addchannel.clearValidate(`${type}`)
      },
      async getResource() {
        this.allApps = this.roleTree
        const res = await resourceTypes()
        res.forEach((item) => {
          if (!item.params.ico) {
            item.params.ico = {
              title: { en: 'channel ICO', zh: '通道ICO' },
              description: { en: 'channel ICO', zh: '通道ICO' },
              default:
                'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/logo/logo.png',
            }
          }
        })
        this.channelregion = res
        this.$nextTick(() => {
          this.initFrom()
        })
      },
      onSubmit() {
        console.log('submit!')
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .el-card {
    margin-bottom: 0 !important;
  }
  .box-card {
    ::v-deep {
      .el-card__body {
        border: 1px solid #252528 !important;
      }
      //span {
      //  float: left;
      //}
      p {
        flex: auto;
        margin-bottom: 4px;
        overflow: hidden;
        color: black;
        text-align: left;
        text-align: left;
        //white-space: nowrap;
        //text-overflow: ellipsis;
        //font-size: 14px;
      }
    }
  }
  /* @import url() */
  .createResourcechannel {
    margin: 20px;

    .device-tree {
      height: 200px;
      overflow: auto;

      ::v-deep {
        .el-scrollbar .el-scrollbar__wrap {
          overflow-x: hidden;
        }

        .clearfix {
          margin: 0;
        }
        .el-tree > .el-tree-node {
          display: inline-block;
          min-width: 100%;
          height: 200px; //这里的高根据实际情况
        }
      }
    }

    .dialog-footer {
      text-align: center;
    }
  }
</style>
