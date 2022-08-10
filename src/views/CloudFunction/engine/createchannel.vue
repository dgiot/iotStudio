<template>
  <div class="createResourcechannel">
    <dgiot-input
      ref="uploadFinish"
      accept=".csv"
      :params="inputParams"
      @fileInfo="fileInfo"
      @files="files"
    />
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
        <el-button
          v-if="active == 2"
          type="primary"
          @click.native="addchannelForm('addchannel')"
        >
          {{ $translateTitle('developer.create') }}
        </el-button>
        <el-button v-if="active == 2" type="info" @click="active = 1">
          上一步
        </el-button>
      </div>

      <el-row>
        <el-col :offset="1" :span="22">
          <el-steps :active="active" finish-status="success">
            <el-step title="通道类型" />
            <el-step title="通道配置" />
          </el-steps>
        </el-col>

        <el-col v-if="active == 1" :span="24">
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
                <div class="text item" @click="setCard(item.cType)">
                  <el-row :gutter="24">
                    <el-col :span="6">
                      <img
                        class="image"
                        :src="
                          item.params.ico.default
                            ? item.params.ico.default
                            : require('../../../../public/assets/images/logo/logo.png')
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
                        <p
                          style="
                            overflow: hidden;
                            font-size: 12px;
                            text-overflow: ellipsis;
                          "
                          :title="item.title.zh"
                        >
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
        <el-col v-if="active == 2" :span="12">
          <el-form-item v-if="active == 2" label="通道类型" prop="region">
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
        </el-col>
        <el-col v-if="active == 2" :span="12">
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
        <el-col v-if="active == 2" :span="12">
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
        <el-col
          v-for="(item, index) in arrlist"
          v-show="active === 2"
          :key="index"
          :span="12"
        >
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
            <el-select
              v-if="item.enum"
              v-model="addchannel[item.showname]"
              style="width: 100%"
            >
              <el-option
                v-for="(item2, index2) in item.enum"
                :key="index2"
                :label="item2.label"
                :value="item2.value"
              />
            </el-select>
            <el-input
              v-else-if="item.type == 'string'"
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
                :label="item1.enum[index1]"
                :value="item1.enum[index1]"
              />
            </el-select>
            <div v-else-if="item.type == 'upload'">
              <el-button type="primary" @click.native="uploadCkick(item)">
                {{ $translateTitle('application.uploadfile') }}
              </el-button>
              &nbsp;
              <span>{{ addchannel[item.filename] }}</span>
            </div>
            <div v-else-if="item.allowCreate">
              <el-button
                @click.native="dybaneucForms[item.showname].unshift({})"
              >
                新增
              </el-button>

              <el-table
                :data="dybaneucForms[item.showname]"
                style="width: 100%"
              >
                <el-table-column
                  v-for="(j, index) in colCum[item.showname].prop"
                  :key="index"
                  align="center"
                  :label="colCum[item.showname].prop[index]"
                  :prop="colCum[item.showname].label[index]"
                  show-overflow-tooltip
                  sortable
                >
                  <template slot-scope="scope">
                    <el-input
                      v-show="getFromType(item, j) == 'input'"
                      v-model="scope.row[j]"
                      placeholder="placeholder"
                    />
                    <el-select
                      v-show="getFromType(item, j) == 'select'"
                      v-model="scope.row[j]"
                      allow-create
                      filterable
                      placeholder="placeholder"
                    >
                      <el-option
                        v-for="item in getFromType(item, j, 'select')"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  fixed="right"
                  label="操作"
                  width="50px"
                >
                  <template slot-scope="scope">
                    <el-button
                      circle
                      class="el-icon-delete"
                      size="mini"
                      type="danger"
                      @click.native="
                        dybaneucDleform(
                          scope.$index,
                          dybaneucForms[item.showname]
                        )
                      "
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </el-col>
        <!---------------------统一的配置描述---------------------------->
        <el-col v-if="active == 2" :span="24">
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
        <!-- 低代码-->
        <!--        <el-col v-if="active == 2" :span="24">-->
        <!--          <el-form-item :label="$translateTitle('product.view')">-->
        <!--            &lt;!&ndash;            <el-input&ndash;&gt;-->
        <!--            &lt;!&ndash;              v-model="addchannel.data"&ndash;&gt;-->
        <!--            &lt;!&ndash;              autocomplete="off"&ndash;&gt;-->
        <!--            &lt;!&ndash;              :placeholder="$translateTitle('product.view')"&ndash;&gt;-->
        <!--            &lt;!&ndash;              :rows="3"&ndash;&gt;-->
        <!--            &lt;!&ndash;              type="textarea"&ndash;&gt;-->
        <!--            &lt;!&ndash;            />&ndash;&gt;-->
        <!--            <div style="height: 30vh; overflow: auto">-->
        <!--              <dgiot-monaco-plus-->
        <!--                ref="monacoCode"-->
        <!--                :codes="addchannel.codes"-->
        <!--                :lang="'json'"-->
        <!--                :read-only="false"-->
        <!--                :theme="'vs-dark'"-->
        <!--              />-->
        <!--            </div>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import defaultLogo from '../../../../public/assets/images/logo/logo.png'
  import { putResourceTypes, resourceTypes } from '@/api/Rules'
  import { postChannel } from '@/api/Channel'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'Createchannel',
    components: {},
    data() {
      return {
        colCum: {},
        dybaneucForms: {},
        tableName: [],
        tableTitle: {},
        active: 1,
        viewShow: false,
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
            {
              required: true,
              message: '请选择所属应用',
              trigger: 'change',
            },
          ],
          name: [
            {
              required: true,
              message: '请输入通道名称',
              trigger: 'blur',
            },
          ],
          region: [
            {
              required: true,
              message: '请选择通道类型',
              trigger: 'change',
            },
          ],
        },
        inputParams: {},
        listLoading: false,
        addchannel: {
          codes: '{}',
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
    watch: {
      // 'addchannel.codes': {
      //   handler(val) {
      //     this.addchannel.codes = JSON.stringify(val, null, 4)
      //   },
      //   immediate: true,
      //   deep: true,
      // },
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
        // this.addchannel = {}
        this.channelForm = false
        this.$refs['addchannel'].resetFields()
        this.resourceid = ''
      },
      uploadCkick(item) {
        // 触发子组件的点击事件
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
        this.inputParams = {
          item: item,
          file: '',
          scene: 'app',
          path: 'product/csv/',
        }
      },
      async fileInfo(info) {
        this.$set(this.addchannel, this.inputParams.item.showname, info.path)
        this.$set(
          this.addchannel,
          this.inputParams.item.filename,
          this.inputParams.filename
        )
        this.inputParams = {}
        if (info.url) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'success',
            message: '上传成功',
          })
        } else {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'error',
            message: '上传失败',
          })
        }
      },
      files(file) {
        this.inputParams.filename = file.name
        this.inputParams.file = file
      },
      // 关闭本页面
      handleClose() {
        this.handleTabRemove()
      },
      dynamicTable(data, type, _table, showname) {
        console.log(type)
        this.tableName.push(data.showname)
        // var dybaneucForms = {}
        this.dybaneucForms[showname] = []
        this.colCum[showname] = { label: [], prop: [] }
        dgiotlogger.error(1291, data, _table)
        const { table } = data
        var arr = {}
        var title = {}
        arr[showname] = {}
        title[showname] = {}
        for (let t in table) {
          arr[showname][table[t].title.zh] =
            table[t].default.label || table[t].default
          this.colCum[showname].prop.push(table[t].title.zh)
          this.colCum[showname].label.push(table[t].key)
          title[showname][table[t].title.zh] = table[t].key
          title[showname][table[t].key] = table[t].zh
          arr[showname][table[t].key] =
            table[t].default.label || table[t].default
          this.tableTitle[showname] = title[showname]
          console.error(1298, table[t], t, arr)
          console.error(1304, t, table[t], this.tableTitle)
        }
        if (type === '回显') {
          console.error(945, '回显', title)
          // dybaneucForms = []
          arr[showname] = {}
          _table.forEach((_itme, _tidx) => {
            for (var t in title[showname]) {
              var _title = title[showname][t]
              arr[showname][t] = _itme[_title]
              console.error(_itme[_title], t, _itme, 952)
            }
            this.dybaneucForms[showname].push(arr[showname])
          })
        } else {
          this.dybaneucForms[showname].push(arr[showname])
        }
        dgiotlogger.error(
          '1320',
          this.dybaneucForms,
          this.colCum,
          this.tableTitle
        )
        return this.dybaneucForms
      },
      getFromType(item, column, type) {
        var res = 'input'
        for (var i in item.table) {
          if (item.table[i].title.zh == column) {
            res = item.table[i].enum?.length ? 'select' : 'input'
            if (type === 'select') return item.table[i].enum
            else return res
          }
        }
      },
      // 解析物模型字典为指定类型
      dictParse(dybaneucForms, title) {
        const obj = []
        dybaneucForms.map((i) => {
          var arr = {}
          for (let j in i) {
            console.log(j, i[j], title[j])
            if (title[j] != undefined) {
              arr[title[j]] = i[j]
            }
          }
          obj.push(arr)
        })
        dgiotlogger.error(1328, obj)
        return obj
      },
      dybaneucDleform(index, row) {
        this.$baseConfirm(
          this.$translateTitle(
            'Maintenance.Are you sure you want to delete the current item'
          ),
          null,
          async () => {
            row.splice(index, 1)
            this.$baseMessage(
              this.$translateTitle('user.successfully deleted'),
              'success',
              'dgiot-hey-message-success'
            )
          }
        )
        console.log(index, row)
      },
      addchannelForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var obj = {}
            for (var key in this.addchannel) {
              obj[key] = this.addchannel[key]
            }
            const _table = _.uniq(this.tableName)
            _table.forEach((item) => {
              obj[item] = this.dictParse(
                this.dybaneucForms[item],
                this.tableTitle[item]
              )
            })
            console.error(525, obj)
            delete obj.region
            delete obj.desc
            delete obj.type
            delete obj.isEnable
            delete obj.name
            const aclKey = 'role' + ':' + this.addchannel.applicationtText
            const aclObj = {}
            aclObj[aclKey] = {
              read: true,
              write: true,
            }
            const data = {
              // data: this.$refs.monacoCode.$refs.monacoEditor.editor
              //   ? JSON.parse(
              //       this.$refs.monacoCode.$refs.monacoEditor.editor.getValue()
              //     )
              //   : {},
              data: {},
              ACL: aclObj,
              config: obj,
              name: this.addchannel.name,
              cType: this.addchannel.region,
              desc: this.addchannel.desc,
              isEnable: false,
              status: 'OFFLINE',
              type: this.addchannel.type.toString(),
            }
            console.error(data)
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
        const sortBy = _.sortBy(arr, ['order'])
        return sortBy
      },
      removeauto(val) {
        this.active = 2
        this.viewShow = true
        var obj = {}
        var obj1 = {
          applicationtText: [
            {
              required: true,
              message: '请选择所属应用',
              trigger: 'change',
            },
          ],
          name: [
            {
              required: true,
              message: '请输入通道名称',
              trigger: 'blur',
            },
          ],
          region: [
            {
              required: true,
              message: '请选择通道类型',
              trigger: 'change',
            },
          ],
        }
        if (this.resourceid == '') {
          this.channelregion.map((item) => {
            if (item.cType == val) {
              this.$forceUpdate()
              this.selectregion = item
              this.arrlist = this.orderObject(this.selectregion.params)
              this.arrlist.map((item) => {
                if (item.allowCreate)
                  this.dynamicTable(item, '', {}, item.showname)
                //  这里过滤掉 showname 为ico的
                if (item.default) {
                  obj[item.showname] = item.default.value || item.default
                } else {
                  obj[item.showname] = ''
                }
                if (item.required) {
                  if (item.type == 'string' || item.type == 'integer') {
                    obj1[item.showname] = [
                      {
                        required: true,
                        trigger: 'blur',
                      },
                    ]
                  } else {
                    obj1[item.showname] = [
                      {
                        required: true,
                        trigger: 'change',
                      },
                    ]
                  }
                  // if (item.enum) {
                  //   obj[item.showname] = item.default.value
                  // }
                }
              })
              console.log('arr', this.arrlist)
              const sortBy = _.sortBy(this.arrlist, ['order'])
              console.log(sortBy)
              console.log('sortBy')
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
                        {
                          required: true,
                          trigger: 'blur',
                        },
                      ]
                    } else {
                      obj1[item.showname] = [
                        {
                          required: true,
                          trigger: 'change',
                        },
                      ]
                    }
                    // if (item.enum) {
                    //   obj[item.showname] =
                    //     this.channelrow.config[key].default.value
                    // }
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
        this.viewShow = true
        this.addchannel.codes = '{}'
        this.$nextTick(() => {
          console.log("this.$refs['monacoCode']", this.$refs['monacoCode'])
          this.addchannel.codes = '{}'
        })
      },
      async addchannelaxios(data) {
        await postChannel(data).then((results) => {
          if (results) {
            this.$message({
              showClose: true,
              duration: 2000,
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
              title: {
                en: 'channel ICO',
                zh: '通道ICO',
              },
              description: {
                en: 'channel ICO',
                zh: '通道ICO',
              },
              default: defaultLogo,
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
