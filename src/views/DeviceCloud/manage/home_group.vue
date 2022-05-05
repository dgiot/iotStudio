<template>
  <div class="devproduct">
    <div class="prosecond">
      <el-form
        class="demo-form-inline"
        :inline="true"
        :model="formInline"
        size="small"
      >
        <el-form-item>
          <el-input
            v-model="formInline.productname"
            clearable
            :placeholder="$translateTitle('product.searchproductname')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="searchProduct(0)">
            {{ $translateTitle('developer.search') }}
          </el-button>
        </el-form-item>
        <el-form-item style="float: right; text-align: right">
          <el-button
            v-show="projectid != ''"
            type="primary"
            @click="addproduct"
          >
            {{ $translateTitle('product.createproduct') }}
          </el-button>

          <el-button type="primary" @click.native="addgroup">
            <!-- 新增 -->
            {{ $translateTitle('product.newlyadded') }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="protable">
        <el-table
          :key="total"
          :cell-style="{ 'text-align': 'center' }"
          :data="groupData"
          :header-cell-style="{ 'text-align': 'center' }"
          style="width: 100%"
        >
          <el-table-column label="ProductID" prop="objectId" />
          <el-table-column :label="$translateTitle('product.productname')">
            <template #default="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('product.productgrouping')">
            <template #default="{ row }">
              <span>{{ row.devType }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('product.nodetype')">
            <template #default="{ row }" style="text-align: center">
              <span v-if="row.nodeType == 1">
                {{ $translateTitle('product.gateway') }}
              </span>
              <span v-if="row.nodeType == 0">
                {{ $translateTitle('product.equipment') }}
              </span>
              <span v-if="row.nodeType == 2">
                <!-- 分组 -->
                {{ $translateTitle('product.grouping') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('product.classification')">
            <template #default="{ row }">
              <span>{{ row.category ? row.category.name : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle('product.addingtime')"
            prop="row.createdAt"
            show-overflow-tooltip
            sortable
            width="100"
          >
            <template #default="{ row }">
              <span>{{ utc2beijing(row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            :label="$translateTitle('developer.operation')"
            width="420"
          >
            <template #default="{ row, $index }">
              <el-button
                size="mini"
                type="primary"
                :underline="false"
                @click="deviceToDetail(row)"
              >
                {{ $translateTitle('product.config') }}
              </el-button>
              <el-button size="mini" @click="goKonva(row.objectId)">
                {{ $translateTitle('concentrator.konva') }}
              </el-button>
              <el-button size="mini" type="info" @click="GoTodevices(row)">
                {{ $translateTitle('product.equipment') }}
              </el-button>
              <el-popover
                :ref="`popover-${$index}`"
                placement="top"
                style="margin-left: 10px"
              >
                <!-- <p>确定删除这个{{ row.name }}产品吗？</p> -->
                <p>
                  {{ $translateTitle('product.qdsczg') }}{{ row.name
                  }}{{ $translateTitle('equipment.cpm') }}
                </p>
                <div style="margin: 0; text-align: right">
                  <el-button
                    size="mini"
                    @click="row._self.$refs[`popover-${$index}`].doClose()"
                  >
                    {{ $translateTitle('developer.cancel') }}
                  </el-button>
                  <el-button size="mini" type="primary" @click="makeSure(row)">
                    {{ $translateTitle('developer.determine') }}
                  </el-button>
                </div>
                <el-button slot="reference" size="mini" type="danger">
                  {{ $translateTitle('developer.delete') }}
                </el-button>
              </el-popover>
            </template>
          </el-table-column>

          <!-- <el-link
                :underline="false"
                icon="el-icon-edit"
                type="success"
                @click="editorProduct(row)"
              >编 辑</el-link> -->
        </el-table>
      </div>
      <div class="elpagination" style="margin-top: 20px">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="length"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          @current-change="productCurrentChange"
          @size-change="productSizeChange"
        />
      </div>
    </div>
    <div class="prodialog">
      <!-- 创建产品对话框 ###-->
      <el-dialog
        :append-to-body="true"
        :before-close="handleClose"
        :close-on-click-modal="false"
        :title="$translateTitle('product.createproduct')"
        top="5vh"
        :visible.sync="dialogFormVisible"
        width="50%"
      >
        <div class="content">
          <!--产品信息-->
          <div class="contentone">
            <div style="display: flex">
              <span>{{ $translateTitle('product.productinformation') }}</span>
              <p
                style="
                  flex-grow: 2;
                  width: auto;
                  height: 1px;
                  margin: 10px;
                  border-top: 1px dashed #dddddd;
                "
              />
            </div>

            <el-form ref="ruleForm" :model="form" :rules="rules">
              <el-form-item
                :label="$translateTitle('product.productname')"
                prop="name"
              >
                <el-input v-model="form.name" autocomplete="off" />
              </el-form-item>
              <!-- <el-form-item label="产品分组" prop="devType"> -->
              <el-form-item
                :label="$translateTitle('product.productgrouping')"
                prop="devType"
              >
                <!-- <el-form-item :label=" $translateTitle('product.productidentification')" prop="devType"> -->
                <el-input v-model="form.devType" autocomplete="off" />
              </el-form-item>

              <!--        <el-form-item :label=" $translateTitle('product.classification')" prop="category">
                <el-cascader v-model="form.category" :options="treeData"></el-cascader>
              </el-form-item>-->

              <el-form-item :label="$translateTitle('product.classification')">
                <el-cascader
                  v-model="form.category"
                  :options="categoryListOptions"
                />
              </el-form-item>

              <!--  :label="item.attributes.desc"
              :value="item.attributes.name"-->

              <!-- <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请选择所属应用',
                    trigger: 'blur',
                  },
                ]"
                label="所属应用"
              > -->
              <el-form-item
                :label="$translateTitle('application.applicationtype')"
                :rules="[
                  {
                    required: true,
                    message: '请选择所属应用',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-select
                  v-model="form.relationApp"
                  disabled
                  @change="selectApp"
                >
                  <el-option
                    v-for="(item, index) in allApps"
                    :key="index"
                    :label="item.title"
                    :value="item.title"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!--节点类型-->
          <div class="contenttwo" style="margin-top: 20px">
            <div style="display: flex">
              <span>{{ $translateTitle('product.nodetype') }}</span>
              <p
                style="
                  flex-grow: 2;
                  width: auto;
                  height: 1px;
                  margin: 10px;
                  border-top: 1px dashed #dddddd;
                "
              />
            </div>

            <el-form ref="ruleForm" :model="form" :rules="rules">
              <el-form-item
                :label="$translateTitle('product.nodetype')"
                prop="nodeType"
              >
                <el-radio-group v-model="form.nodeType" @change="changeNode">
                  <el-radio :label="0">
                    {{ $translateTitle('product.equipment') }}
                  </el-radio>
                  <el-radio :label="1">
                    {{ $translateTitle('product.gateway') }}
                  </el-radio>
                  <el-radio :label="2">
                    <!-- 分组 -->
                    {{ $translateTitle('product.grouping') }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- <el-form-item label="是否接入网关" v-show="form.resource=='网关'">
                   <el-radio-group v-model="form.isshow">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                    </el-radio-group>
              </el-form-item>-->
            </el-form>
          </div>
          <!--连网方式-->
          <div class="contentthird" style="margin-top: 20px">
            <div style="display: flex">
              <span>
                {{ $translateTitle('product.networkinganddescription') }}
              </span>
              <p
                style="
                  flex-grow: 2;
                  width: auto;
                  height: 1px;
                  margin: 10px;
                  border-top: 1px dashed #dddddd;
                "
              />
            </div>
            <el-form ref="ruleForm" :model="form" :rules="rules">
              <el-form-item
                :label="
                  $translateTitle('product.networking') +
                  '(共' +
                  channel.length +
                  '项)'
                "
                prop="netType"
              >
                <el-select
                  v-model="form.netType"
                  :placeholder="$translateTitle('product.selectgateway')"
                >
                  <el-option
                    v-for="(item, index) in channel"
                    :key="index"
                    :label="index + 1 + ':' + item.label"
                    :title="'当前第' + (index + 1) + '项'"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="产品模型"> -->
              <el-form-item :label="$translateTitle('product.productmodel')">
                <img v-if="imageUrl" class="avatar" :src="imageUrl" />
                <i
                  v-else
                  v-loading="loading"
                  class="el-icon-plus avatar-uploader-icon"
                />
                <form
                  ref="uploadform"
                  enctype="multipart/form-data"
                  method="POST"
                  style="position: absolute"
                >
                  <input
                    style="
                      position: relative;
                      top: -100px;
                      z-index: 5;
                      width: 100px;
                      height: 100px;
                      cursor: pointer;
                      opacity: 0;
                    "
                    type="file"
                    @change="upload($event)"
                  />
                </form>
                <el-button
                  v-if="imageUrl"
                  size="mini"
                  style="vertical-align: text-bottom"
                  type="danger"
                  @click="deleteImgsrc"
                >
                  <!-- 删除 -->
                  {{ $translateTitle('developer.delete') }}
                </el-button>
              </el-form-item>
              <el-form-item
                :label="$translateTitle('developer.describe')"
                prop="desc"
              >
                <el-input v-model="form.desc" type="textarea" />
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click.native="submitForm('ruleForm')">
            {{ $translateTitle('developer.determine') }}
          </el-button>
          <el-button @click="dialogFormVisible = false">
            {{ $translateTitle('developer.cancel') }}
          </el-button>
        </div>
      </el-dialog>
    </div>

    <div class="add-group">
      <!-- <el-dialog
  :append-to-body="true" :visible.sync="groupform" title="新增虚拟分组" width="25%"> -->
      <el-dialog
        :append-to-body="true"
        :title="$translateTitle('developer.newvirtualgroup')"
        :visible.sync="groupform"
        width="30%"
      >
        <el-form
          ref="addGroup"
          class="demo-ruleForm"
          label-width="80px"
          :model="addGroup"
        >
          <el-row>
            <!-- <el-col :span="6">
              <el-form-item
                :rules="[{ required: true, message: '分组名不能为空' }]"
                label="分组名"
                prop="name"
              /> -->
            <el-col :span="6">
              <el-form-item
                :label="$translateTitle('developer.groupname')"
                prop="name"
                :rules="[
                  {
                    required: true,
                    message: $translateTitle('developer.cannotbeempty'),
                  },
                ]"
              />
            </el-col>
            <el-col :span="18">
              <el-input
                v-model="addGroup.name"
                autocomplete="off"
                type="text"
              />
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click.native="addDeviceGroup()">
            <!-- 新增 -->
            {{ $translateTitle('product.newlyadded') }}
          </el-button>
          <el-button @click="resetForm()">
            <!-- 重置 -->
            {{ $translateTitle('zetadevices.reset') }}
          </el-button>
        </div>
      </el-dialog>
    </div>

    <div class="import-dialog">
      <!-- <el-dialog
  :append-to-body="true" :visible.sync="importDialogShow" title="导入产品" width="25%"> -->
      <el-dialog
        :append-to-body="true"
        :title="$translateTitle('product.importpro')"
        :visible.sync="importDialogShow"
        width="25%"
      >
        <el-form ref="uploadProForm" :model="formPro">
          <!--   <el-row :gutter="20">
  <el-col :span="12">
     <el-input  placeholder=" " size="small" v-model="formPro.name" :disabled="true"> </el-input>
     </el-col>
  <el-col :span="12">

  </el-col>
          -->
          <el-upload
            ref="fileUpload"
            accept=".xls, .xlsx, .zip"
            :action="uploadAction"
            :auto-upload="false"
            class="upload-demo"
            :data="uploadData"
            :file-list="fileList"
            :headers="uploadHeaders"
            :on-change="handleChange"
            :on-error="handleUploadError"
            :on-success="handleUploadSuccess"
            :with-credentials="true"
          >
            <el-button slot="trigger" size="small" type="primary">
              <!-- 选择文件 -->
              {{ $translateTitle('application.selectfiles') }}
            </el-button>
          </el-upload>

          <!-- </el-row> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            class="btn-left"
            size="small"
            type="primary"
            @click="submitUpload"
          >
            <!-- 上传 -->
            {{ $translateTitle('application.upload') }}
          </el-button>

          <el-button
            class="btn-right"
            size="small"
            @click="importDialogShow = false"
          >
            <!-- 取消 -->
            {{ $translateTitle('developer.cancel') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {
    delProduct,
    getProduct,
    putProduct,
    queryProduct,
  } from '@/api/Product/index'
  import { getRole, queryRole } from '@/api/Role/index'
  import { queryDevice } from '@/api/Device/index'
  import { getHashClass } from '@/api/Hash/index'
  import { postDict, queryDict } from '@/api/Dict/index'
  // const Base64 = require('js-base64').Base64
  import { export_txt_to_zip } from '@/utils/file/export2zip.js'
  import Cookies from 'js-cookie'
  import { addGroup } from '@/api/Group/index'
  export default {
    data() {
      return {
        category: [],
        hashkey: '',
        addGroup: {
          name: '',
        },
        groupform: false,
        length: 10,
        total: 0,
        start: 0,
        activeName: 'first',
        formInline: {
          productname: '',
        },
        uploadHeaders: {
          sessionToken: Cookies.get('access_token'),
        },
        uploadAction: '',
        uploadData: {},
        fileList: [],
        productIdentifier: '',
        groupData: [],
        formLabelWidth: '80px',
        dialogFormVisible: false,
        importDialogShow: false,
        form: {
          name: '',
          category: [],
          nodeType: 0,
          desc: '',
          netType: '',
          devType: '',
          productSecret: '',
          roles: [],
          relationApp: '',
        },
        formPro: {
          name: '',
          url: '',
        },
        rules: {
          roles: [
            {
              required: true,
              message: '请选择所属应用',
              trigger: 'blur',
            },
          ],
          name: [
            {
              required: true,
              message: '请输入产品',
              trigger: 'blur',
            },
          ],
          devType: [
            {
              required: true,
              message: '请输入产品标识，用于区分不同设备',
              trigger: 'blur',
            },
          ],
          category: [
            {
              required: true,
              message: '请选择所属分类',
              trigger: 'change',
            },
          ],
          nodeType: [
            {
              required: true,
              message: '请选择节点类型',
              trigger: 'change',
            },
          ],
          netType: [
            {
              required: true,
              message: '请选择联网方式',
              trigger: 'change',
            },
          ],
          relationApp: [
            {
              required: true,
              message: '请选择产品可见角色',
              trigger: 'change',
            },
          ],
        },
        option: [],
        ruleoptions: [],
        channel: [
          {
            label: '蜂窝(2G/3G/4G)(直连)',
            value: 'CELLULAR',
          },
          {
            label: 'NB-IOT通道',
            value: 'NB-IOT',
          },
          {
            label: 'BLE(低功耗蓝牙)',
            value: 'Bluetooth',
          },
          {
            label: '5G通道(直连)',
            value: '5G',
          },
          {
            label: 'WIFI通道(直连)',
            value: 'WIFI',
          },
          {
            label: 'ZigBee通道',
            value: 'ZigBee',
          },
          {
            label: 'Modbus',
            value: 'Modbus',
          },
          {
            label: 'LoRa(WAN)(直连)',
            value: 'LoRaWAN',
          },
          {
            label: 'OPC UA',
            value: ' OPC UA',
          },
          {
            label: 'ZETA通道',
            value: 'ZETA',
          },
          {
            label: '网线连接(直连)',
            value: '网线连接',
          },
          {
            label: '自定义',
            value: 'OTHER',
          },
        ],
        imageUrl: '',
        productid: '',
        loading: false,
        allApps: [],
        categoryList: [],
        categoryListOptions: [],
        fileServer: '',
        access_token: '',
        projectid: '',
        projectName: '',
        allTableDate: [],
      }
    },
    computed: {},
    mounted() {
      this.Industry()
      this.searchProduct(0)
    },
    beforeDestroy() {
      this.projectName = ''
    },
    methods: {
      // 新增虚拟设备
      addDeviceGroup() {
        this.$refs['addGroup'].validate((valid) => {
          if (valid) {
            addGroup(this.addGroup.name)
              .then((res) => {
                this.$message({
                  message: '新建设备分组成功',

                  type: 'success',
                })
                this.searchProduct()
                this.groupform = false
              })
              .catch((e) => {
                this.$message({
                  message: '新建设备分组失败' + e.computed,
                  type: 'error',
                })
                this.groupform = false
              })
          } else {
            return false
          }
        })
        // for (let i = 1; i <= 1000; i++) {
        //   const groupname = "Repository_" + ("0000" + i).slice(-4)
        //
        //   // dgiotlog.log('sss',groupname)
        //   addGroup(groupname)
        // }
      },
      resetForm() {
        this.$refs['addGroup'].resetFields()
      },
      changeNode(val, first) {
        if (first != 0) {
          this.form.netType = ''
        }

        if (val == 0) {
          this.channel = [
            {
              label: '蜂窝(2G/3G/4G)',
              value: 'CELLULAR',
            },
            {
              label: 'NB-IOT通道',
              value: 'NB-IOT',
            },
            {
              label: 'BLE(低功耗蓝牙)',
              value: 'Bluetooth',
            },
            {
              label: '5G通道',
              value: '5G',
            },
            {
              label: 'WIFI通道',
              value: 'WIFI',
            },
            {
              label: 'ZigBee通道',
              value: 'ZigBee',
            },
            {
              label: 'LoRa(WAN)',
              value: 'LoRaWAN',
            },
            {
              label: 'Modbus',
              value: 'Modbus',
            },
            {
              label: 'OPC UA',
              value: ' OPC UA',
            },
            {
              label: 'ZETA通道',
              value: 'ZETA',
            },
            {
              label: '网线连接',
              value: '网线连接',
            },

            {
              label: '自定义',
              value: 'OTHER',
            },
          ]
        } else {
          this.channel = [
            {
              label: '蜂窝(2G/3G/4G)',
              value: 'CELLULAR',
            },
            {
              label: '5G通道',
              value: '5G',
            },
            {
              label: 'WIFI通道',
              value: 'WIFI',
            },
            {
              label: 'NB-IOT通道',
              value: 'NB-IOT',
            },
            {
              label: 'LoRaWAN',
              value: 'LoRaWAN',
            },
            {
              label: '网线连接',
              value: '网线连接',
            },
            {
              label: '自定义',
              value: 'OTHER',
            },
          ]
        }
      },
      selectApp(val) {
        if (!val) {
          return
        }
        getRole(val).then((resultes) => {
          if (resultes) {
            this.fileServer = resultes.file
            this.access_token = resultes.access_token
          }
        })
      },
      treeData(paramData) {
        const cloneData = JSON.parse(JSON.stringify(paramData)) // 对源数据深度克隆
        return cloneData.filter((father) => {
          const branchArr = cloneData.filter(
            (child) => father.id == child.parentid
          ) // 返回每一项的子级数组
          branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
          return father.parentid == 0 // 返回第一层
        })
      },
      deleteImgsrc() {
        event.stopPropagation()
        this.imageUrl = ''
      },
      upload(event) {
        this.loading = true
        if (event) {
          var file = event.target.files[0] // name: "dangqi1.png" || type: "image/png"
          var name = file.name
          var testmsg = event.target.files[0].type
          var type = file.type.split('/')[0]
          var extension =
            testmsg === 'image/jpeg' ||
            testmsg === 'image/JPEG' ||
            testmsg === 'image/png' ||
            testmsg === 'image/PNG' ||
            testmsg === 'image/bpm' ||
            testmsg === 'image/BPM'
          if (!extension) {
            // 将图片img转化为base64
            this.$message({
              message: '请上传图片',
              type: 'error',
            })
            return false // 必须加上return false; 才能阻止
          } else {
            var reader = new FileReader()
            reader.readAsDataURL(file)
            var that = this
            reader.onloadend = function () {
              var dataURL = reader.result
              var blob = that.dataURItoBlob(dataURL)
              that.uploadFile(blob, name) // 执行上传接口
            }
          }
        }
      },
      dataURItoBlob(dataURI) {
        // base64 解码
        var byteString = atob(dataURI.split(',')[1])
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length)
        var ia = new Uint8Array(ab)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ab], { type: mimeString })
      },
      uploadFile(imgUrl, name) {
        var formdata = new FormData()
        formdata.append('file', imgUrl, name)
        formdata.append('output', 'json')
        formdata.append('path', this.form.relationApp)
        // formdata.append("path", Cookies.get("appids"));
        formdata.append('auth_token', this.access_token) // 下面是要传递的参数
        // 此处必须设置为  multipart/form-data
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data', // 之前说的以表单传数据的格式来传递fromdata
          },
        }
        this.$http
          .post(this.fileServer, formdata)
          .then((res) => {
            if (res) {
              this.imageUrl = res.body.url
              this.loading = false
            }
          })
          .catch((error) => {
            this.loading = false
            this.$message(error.bodyText)
          })
      },
      submitUpload() {
        // this.uploadAction = Cookies.get('apiserver') + '/product?appid=' + Cookies.get("appids");

        this.uploadAction = '/product'
        // this.uploadAction = 'http://cad.iotn2n.com:5080/product?appid=' + Cookies.get("appids");

        this.$nextTick(() => {
          // dgiotlog.log('uploadHeaders',this.uploadHeaders);

          this.uploadData.appid = Cookies.get('appids')
          // this.uploadData.key = "key";
          this.$refs.fileUpload.submit()
        })
      },
      handleUploadSuccess(response, file, fileList) {
        this.$message({
          type: 'success',
          message: '产品导入成功',
        })
        this.importDialogShow = false
        this.$refs['uploadProForm'].resetFields()
        this.searchProduct()
      },
      handleUploadError(err, file, fileList) {
        this.$message({
          showClose: true,
          message: err,
        })
      },
      handleChange(file, fileList) {
        if (fileList.length > 0) {
          this.fileList = [fileList[fileList.length - 1]] // 展示最后一次选择的文件
        }
      },
      utc2beijing(utc_datetime) {
        // 转为正常的时间格式 年-月-日 时:分:秒
        var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '')
        return date // 2017-03-31 16:02:06
      },
      async getDict(resultes, category) {
        const parsms = {
          limit: 1000,
          where: {
            'data.key': 'category',
          },
        }
        const { results } = await queryDict(parsms)
        // this.groupData = results
      },

      async searchProduct(start) {
        if (start == 0) {
          this.start = 0
        }
        const params = {
          order: '-updatedAt',
          skip: this.start,
          limit: this.length,
          include: 'category',
          where: {
            nodeType: '2',
          },
        }
        this.formInline.productname
          ? (params.where.name = { $regex: this.formInline.productname })
          : ''
        const { results } = await queryProduct(params)
        dgiotlogger.log('results', results)
        this.groupData = results
        this.total = this.groupData.length
        // dgiotlog.log(this.groupData)

        const resApps = await queryRole({
          limit: 100,
        })

        this.allApps = resApps.results
      },
      handleClose() {
        this.dialogFormVisible = false
      },
      // 添加产品弹窗
      addproduct() {
        this.dialogFormVisible = true
      },
      // 新增弹窗
      addgroup() {
        this.groupform = true
      },
      getParent(id, origin, returnarr) {
        origin.map((item) => {
          if (id == item.id) {
            returnarr.unshift(item.value)
            this.getParent(item.parentid, origin, returnarr)
          } else if (item.parentid == 0 && item.id == id) {
            returnarr.unshift(item.value)
          }
        })
        this.form.category = returnarr
        return returnarr
      },
      // 查找Industry父级
      getIndustryParent(type, originarr) {
        originarr.map((item) => {
          if (item.value == type) {
            this.getParent(item.id, originarr, [])
          }
        })
      },
      editorProduct(row) {
        // this.form.roles = [];
        this.form.relationApp = ''
        this.dialogFormVisible = true
        this.productid = row.id
        this.getIndustryParent(row.attributes.category, this.categoryList)
        this.form.desc = row.attributes.desc
        this.form.name = row.attributes.name
        this.form.nodeType = row.attributes.nodeType
        this.form.netType = row.attributes.netType
        this.form.devType = row.attributes.devType
        this.form.productSecret = row.attributes.productSecret
        this.changeNode(row.attributes.nodeType, 0)
        if (row.attributes.icon) {
          this.imageUrl = row.attributes.icon
        }
        for (var key in row.attributes.ACL.permissionsById) {
          this.form.relationApp = key ? key.substr(5) : ''
        }
        this.selectApp(this.form.relationApp)
      },
      async Industry() {
        this.categoryList = []
        const parsms = {
          limit: 1000,
          where: {
            'data.key': 'category',
          },
        }
        const { results } = await queryDict(parsms)
        results.map((items) => {
          var obj = {}
          obj.value = items.type
          obj.label = items.data.CategoryName
          obj.id = items.data.Id
          obj.parentid = items.data.SuperId
          this.categoryList.push(obj)
        })
        this.categoryListOptions = this.treeData(this.categoryList)
      },

      submitForm(formName) {},

      resetProductForm() {
        this.form = {
          name: '',
          category: [],
          nodeType: 0,
          desc: '',
          netType: '',
          devType: '',
          productSecret: '',
          roles: [],
          relationApp: '',
        }
        this.imageUrl = ''
      },
      deviceToDetail(row) {
        this.$router.push({
          path: '/roles/detailproduct',
          query: {
            id: row.objectId,
          },
        })
      },
      goKonva(id) {
        this.$router.push({
          path: '/Topo?productid',
          query: {
            productid: id,
          },
        })
      },
      GoTodevices(row) {
        this.$router.push({
          path: '/roles/thing',
          query: {
            productid: row.objectId,
          },
        })
      },
      /* el-popover点击关闭*/
      makeSure(row) {
        const params = {
          count: 'objectId',
          skip: 0,
          limit: 1,
          where: {
            product: row.objectId,
          },
        }
        queryDevice(params)
          .then((results) => {
            // dgiotlog.log(results, "jkjjjj")
            if (results.count > 0) {
              this.$message('请先删除该产品下设备')
              return
            } else {
              getProduct(row.objectId)
                .then((results) => {
                  delProduct(row.objectId)
                    .then((response) => {
                      if (response) {
                        this.$message({
                          type: 'success',
                          message: '删除成功',
                        })
                        this.searchProduct()
                      }
                    })
                    .catch((e) => {
                      dgiotlog.log('delProduct ', e.error)
                    })
                })
                .catch((e) => {
                  dgiotlog.log('getProduct ', e.error)
                })
            }
          })
          .catch((e) => {
            dgiotlog.log('queryDevice ', e.error)
          })
      },
      productSizeChange(val) {
        this.length = val
        this.searchProduct()
      },
      productCurrentChange(val) {
        this.start = (val - 1) * this.length
        this.searchProduct()
      },
      async blackDict(hashkey, data) {
        const params = {
          data: data,
          key: hashkey,
          type: 'Product',
        }
        const res = await postDict(params)
        if (res) {
          this.$message({
            type: 'success',
            message: '备份成功',
          })
        } else {
          this.$message({
            type: 'error',
            message: `备份失败`,
          })
        }
      },
      async CloneData(row) {
        const data = {
          category: row.attributes.category,
          devType: row.attributes.devType,
          name: row.attributes.name,
          thing: row.attributes.thing,
        }
        const { objectId, code } = await getHashClass('Product', data)
        if (code == 200) {
          this.blackDict(objectId, data)
        }
      },
      // 克隆组态
      async proudctClone(row) {
        row.attributes.config.cloneState = true
        const config = row
        const res = putProduct(row.id, config)
        if (res) {
          this.CloneData(row)
        }
      },
      // 编辑组态
      proudctEdit(row) {
        var topoUrl = window.location.origin + '/spa'
        const { NODE_ENV } = process.env
        if (NODE_ENV == 'development') {
          topoUrl = this.$globalConfig.localTopoUrl
        } else {
          topoUrl = window.location.origin + '/spa'
        }
        // 为了兼容性,暂时传两个相同的值
        var url = `${topoUrl}/#?drawProudctid=${row.objectId}&proudctid=${row.objectId}`
        localStorage.setItem('rowId', row.objectId)
        window.open(url, '__blank')
      },
      // 运行组态
      proudctView(row) {
        var topoUrl = window.location.origin + '/spa'
        const { NODE_ENV } = process.env
        if (NODE_ENV == 'development') {
          topoUrl = this.$globalConfig.localTopoUrl
        } else {
          topoUrl = window.location.origin + '/spa'
        }
        var url = `${topoUrl}/#/views/${row.objectId}`
        window.open(url, '__blank')
      },
      // 导出
      exportpro() {
        if (this.allTableDate) {
          export_txt_to_zip(JSON.stringify(this.allTableDate), 'Dict', 'Dict')
        } else {
          this.$message({
            type: 'warning',
            message: '数据为空,无法导出',
          })
        }
      },
    },
  }
</script>
<style scoped>
  .devproduct {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
  }
</style>
<style>
  .devproduct .el-tabs__header {
    margin: 0;
  }

  .devproduct .el-tabs__item {
    height: 50px;
    margin: 0;
    margin-top: 20px;
    font-family: auto;
    font-size: 16px;
    line-height: 50px;
  }

  .devproduct .el-tabs__content {
    box-sizing: border-box;
    padding: 20px;
    background: #f4f4f4;
  }

  .devproduct .el-tab-pane {
    background: #ffffff;
  }

  .devproduct .procontent,
  .devproduct .prosecond {
    box-sizing: border-box;
    width: 100%;
    /*padding: 20px 10px;*/
  }

  .devproduct .el-dialog {
    margin-top: 5vh;
  }

  .devproduct .el-dialog .el-dialog__header {
    border-bottom: 1px solid #cccccc;
  }

  .devproduct .el-dialog .el-cascader,
  .devproduct .el-dialog .el-select {
    width: 100%;
  }

  .devproduct .el-dialog .el-form {
    box-sizing: border-box;
    padding: 0 10px;
  }

  .devproduct .el-dialog .el-form .el-form-item {
    margin-bottom: 5px;
  }

  .devproduct .el-dialog .el-form .el-form-item__content {
    margin-left: 10px;
    clear: both;
  }

  .devproduct .avatar-uploader {
    display: inline-block;
  }

  .avatar-uploader .el-upload {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    width: 150px;
    height: 150px;
    font-size: 28px;
    line-height: 150px;
    color: #8c939d;
    text-align: center;
    border: 1px dashed #cccccc;
  }

  .avatar {
    display: block;
    width: 150px;
    height: 150px;
  }

  /* .devproduct .el-icon-close{
      position:absolute;
      right:0;
    } */
</style>
