<template>
  <div class="createResourcechannel">
    <!-- <dgiot-input
      ref="uploadFinish"
      accept=".csv"
      :params="inputParams"
      @fileInfo="fileInfo"
      @files="files"
    /> -->
    <input
      v-show="false"
      id="fileExport"
      ref="inputer"
      type="file"
      value="上传菜单"
      @change="handleFileChange"
    />
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="付费通道" name="license">
        <el-form
          ref="addchannel"
          label-width="auto"
          :model="addchannel"
          :rules="addrules"
          size="mini"
        >
          <!-- {{ $translateTitle('product.export') }} -->
          <div class="dialog-footer" style="margin: 15px">
            <el-button
              :disabled="checkedChannels.length <= 0"
              type="primary"
              @click="saveJSON"
            >
              导出License
            </el-button>
            <el-button type="primary" @click="importFile">
              导入License
            </el-button>
            <!-- <el-button
          v-if="active == 2"
          type="primary"
          @click.native="addchannelForm('addchannel')"
        >
          {{ $translateTitle('developer.create') }}
        </el-button>
        <el-button v-if="active == 2" type="info" @click="active = 1">
          上一步
        </el-button> -->
          </div>

          <el-row>
            <el-col :span="24">
              <el-row
                :gutter="24"
                style="
                  width: 100%;
                  max-height: 60vh;
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
                  :lg="6"
                  :md="8"
                  :sm="8"
                  style="padding: 10px; margin: 0px; cursor: pointer"
                  :xl="4"
                  :xs="8"
                >
                  <!-- :shadow="addchannel.region == item.cType ? 'always' : 'hover'" -->
                  <el-card
                    class="box-card"
                    :class="[
                      checkedChannels.indexOf(item.name) >= 0
                        ? 'checked_border'
                        : '',
                    ]"
                    shadow="hover"
                    size="mini"
                  >
                    <div class="text item" @click="handleCheck(item.name)">
                      <el-row :gutter="24">
                        <el-col :span="6">
                          <img
                            class="image"
                            :src="
                              item.ico
                                ? item.ico
                                : require('../../../../public/assets/images/logo/logo.png')
                            "
                            style="width: 50px; height: 50px"
                          />
                        </el-col>
                        <el-col :span="18">
                          <span>
                            <div
                              class="text-gradient"
                              style="text-align: left; font-size: 16px"
                            >
                              {{ item.description.zh }}
                            </div>
                            <p
                              style="
                                overflow: hidden;
                                font-size: 12px;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                color: #ccc;
                              "
                              :title="item.name"
                            >
                              {{ item.name }}
                            </p>
                          </span>
                          <div style="text-align: left">
                            <div class="item_tag tag_pay">付费</div>
                          </div>
                        </el-col>
                      </el-row>
                      <div class="">{{ item.license }}</div>
                    </div>
                    <div class="check_item">
                      <div
                        v-if="checkedChannels.indexOf(item.name) >= 0"
                        class="check_selected"
                      ></div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="免费通道" name="free">
        <el-form
          ref="addchannel"
          label-width="auto"
          :model="addchannel"
          :rules="addrules"
          size="mini"
        >
          <div class="dialog-footer" style="margin: 15px"></div>

          <el-row>
            <el-col :span="24">
              <el-row
                :gutter="24"
                style="
                  width: 100%;
                  max-height: 60vh;
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
                  :lg="6"
                  :md="8"
                  :sm="8"
                  style="padding: 10px; margin: 0px; cursor: pointer"
                  :xl="4"
                  :xs="8"
                >
                  <!-- :shadow="addchannel.region == item.cType ? 'always' : 'hover'" -->
                  <!-- :class="[
                      checkedChannels.indexOf(item.name) >= 0
                        ? 'checked_border'
                        : '',
                    ]" -->
                  <el-card
                    class="box-card"
                    shadow="hover"
                    size="mini"
                    :style="{
                      color:
                        addchannel.region == item.cType ? '#00bad0' : '#c0c4cc',
                    }"
                  >
                    <div class="text item" @click="handleCheck(item.name)">
                      <el-row :gutter="24">
                        <el-col :span="6">
                          <img
                            class="image"
                            :src="
                              item.ico
                                ? item.ico
                                : require('../../../../public/assets/images/logo/logo.png')
                            "
                            style="width: 50px; height: 50px"
                          />
                        </el-col>
                        <el-col :span="18">
                          <span>
                            <div
                              class="text-gradient"
                              style="text-align: left; font-size: 16px"
                            >
                              {{ item.description.zh }}
                            </div>
                            <p
                              style="
                                overflow: hidden;
                                font-size: 12px;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                color: #ccc;
                              "
                              :title="item.name"
                            >
                              {{ item.name }}
                            </p>
                          </span>
                          <div style="text-align: left">
                            <div class="item_tag tag_free">免费</div>
                            <div class="">
                              {{ item.license }}
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <!-- <div class="check_item">
                      <div
                        v-if="checkedChannels.indexOf(item.name) >= 0"
                        class="check_selected"
                      ></div>
                    </div> -->
                  </el-card>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import defaultLogo from '../../../../public/assets/images/logo/logo.png'
  import {
    putResourceTypes,
    resourceTypes,
    resourceLicense,
    importLicense,
  } from '@/api/Rules'
  import { postChannel } from '@/api/Channel'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'Channelstore',
    components: {},
    data() {
      return {
        license: {}, //认证对象
        checkedChannels: [], //选中通道列表
        activeName: 'license',
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
              message: '请选择所属部门',
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
      // this.getResource()
      this.getLicense()
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
      handleTabClick(tab) {
        console.log(tab.name, this.activeName)
        this.getLicense()
      },
      importFile() {
        this.$refs.inputer.click()
      },
      // 真正的文件上传
      async handleFileChange(e) {
        this.inputDOM = this.$refs.inputer
        if (!/\.json$/.test(this.inputDOM.files[0].name)) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: '仅支持json文件',
          })
          return false
        } else {
          this.file = this.inputDOM.files[0] // 通过DOM取文件数据
          const loading = this.$baseColorfullLoading(3)
          try {
            const res = await importLicense(this.file)
            loading.close()
            dgiotlog.log('eresresrror', res)
            this.$message({
              type: 'success',
              message: '导入成功',
              showClose: true,
            })
            setTimeout(() => {
              this.file = ''
              this.inputDOM = ''
              this.size = ''
              this.formData = ''
              this.getLicense()
            }, 1500)
          } catch (error) {
            loading.close()
            this.$message({
              type: 'error',
              message: '导入失败' + error,
            })
            dgiotlog.log('error', error)
            this.$baseMessage(error, 'error', 'dgiot-hey-message-error')
          }
          loading.close()
        }
      },
      /**
       * 导出json
       *  https://blog.csdn.net/qq_37312180/article/details/125088139
       */
      saveJSON(data, filename = '') {
        // if (!data) {
        //   alert('保存的数据为空')
        //   return
        // }
        data = JSON.parse(JSON.stringify(this.license))
        console.log(data)
        data.channels.forEach((item) => {
          if (this.checkedChannels.indexOf(item.name) >= 0) {
            item.purchase = true
          }
        })
        // return
        // console.log(typeof this.channelregion === 'object')
        if (!filename) filename = '通道.json'

        if (typeof data === 'object') {
          data = JSON.stringify(data, undefined, 4)
        }
        console.log('data', data)
        var blob = new Blob([data], { type: 'text/json' }),
          e = document.createEvent('MouseEvents'),
          a = document.createElement('a')
        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
        e.initMouseEvent(
          'click',
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        )
        a.dispatchEvent(e)
      },
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
        const newname = this.inputParams.item.showname + 'filename'
        this.$set(this.addchannel, this.inputParams.item.showname, info.src)
        this.$set(this.addchannel, newname, this.inputParams.filename)
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
      handleCheck(item) {
        console.log(item)
        if (this.checkedChannels.indexOf(item) == -1) {
          this.checkedChannels.push(item)
        } else {
          this.checkedChannels.splice(this.checkedChannels.indexOf(item), 1)
        }
        console.log('this.checkedChannels', this.checkedChannels)
        // this.removeauto(item)
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
              message: '请选择所属部门',
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
        // 读取acl列表,获取所属部门名称
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
      // 获取通道资源
      async getLicense() {
        this.channelregion = []
        this.checkedChannels = []
        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.5)',
        })
        this.allApps = this.roleTree
        try {
          const res = await resourceLicense()
          console.log('认证', res)
          this.license = res
          let list = []
          res.channels.forEach((item) => {
            if (item.model == this.activeName) {
              list.push(item)
            }
          })
          this.channelregion = list
          loading.close()
        } catch (error) {}
        loading.close()
        // console.log(this.channelregion)
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
  .text-gradient {
    background-image: linear-gradient(to right, #02439b, #a1e5fc);
    -webkit-background-clip: text;
    color: transparent;
    font-weight: bold;
  }
  .el-card {
    margin-bottom: 0 !important;
  }
  .checked_border {
    border: 0.5px solid #1588f5;
  }
  .box-card {
    position: relative;
    .check_item {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 10px;
      height: 10px;
      border: 0.5px solid #ebeef5;
      box-sizing: border-box;
      .check_selected {
        width: 10px;
        height: 10px;
        // margin: 1px;
        background-color: #1588f5;
      }
    }
    .item_tag {
      color: #fff;
      display: inline-block;
      font-size: 12px;
      padding: 0px 8px;
      border-radius: 8px;
      line-height: 20px;
    }
    .tag_pay {
      background-color: #fa732f;
    }
    .tag_free {
      background-color: #1588f5;
    }
    ::v-deep {
      .el-card__body {
        // border: 1px solid #252528 !important;
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
      // text-align: center;
    }
  }
</style>
