<!--
* @Author: vivi
* @Date: 2021-07-02 10:29:31
* @LastEditors: vivi
* @LastEditTime: 2021-07-02 10:29:31
* @Description:
* @FilePath: src\views\Maintenance\myticket.vue
-->
<template>
  <div class="mycontainer">
    <div class="ticker-dialog">
      <el-dialog
        :title="$translateTitle('Maintenance.create Ticket')"
        :visible.sync="dialogFormVisible"
        width="90vh"
      >
        <el-form
          ref="form"
          class="create-ticker"
          :model="form"
          size="medium "
          :rules="rules"
          label-width="auto"
        >
          <el-form-item
            prop="product"
            :label="$translateTitle('Maintenance.project')"
          >
            <el-select
              v-model="form.product"
              :placeholder="
                $translateTitle('Maintenance.Please choose the product')
              "
              @change="prodChange"
            >
              <el-option
                v-for="(item, index) in _Product"
                v-show="item.objectId != 0"
                :key="index"
                :label="item.name"
                :value="item.objectId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="name"
            :label="$translateTitle('Maintenance.Equipment name')"
          >
            <el-select
              v-model="form.name"
              :disabled="!Device.length"
              :placeholder="
                Device.length == 0
                  ? $translateTitle('Maintenance.Please choose the product')
                  : $translateTitle('Maintenance.Please select a device')
              "
            >
              <el-option
                v-for="(item, index) in Device"
                v-show="item.objectId"
                :key="index"
                :label="item.name"
                :value="item.objectId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="type"
            :label="$translateTitle('Maintenance.Ticket type')"
          >
            <el-radio-group v-model="form.type">
              <el-radio
                v-for="item in types"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-radio-group>
          </el-form-item>

          <el-form-item
            :label="$translateTitle('Maintenance.Ticket description')"
          >
            <el-input v-model="form.description" type="textarea" />
          </el-form-item>
          <el-form-item :label="$translateTitle('Maintenance.photo')">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="true"
              :http-request="myUpload"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{ file }">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <i class="el-icon-download"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('form')">
            {{ $translateTitle('Maintenance.Create now') }}
          </el-button>
          <el-button @click="resetForm('form')">
            {{ $translateTitle('Maintenance.Reset') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
    <vab-query-form class="query-form">
      <vab-query-form-top-panel>
        <el-form
          :inline="true"
          label-width="auto"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item :label="$translateTitle('Maintenance.Ticket number')">
            <el-input
              v-model.trim="queryForm.number"
              clearable
              :placeholder="$translateTitle('Maintenance.Ticket number')"
            />
          </el-form-item>
          <el-form-item :label="$translateTitle('Maintenance.project')">
            <el-select
              v-model="queryForm.product"
              :placeholder="
                $translateTitle('Maintenance.Please choose the product')
              "
            >
              <el-option
                v-for="(item, index) in _Product"
                v-show="item.objectId != 0"
                :key="index"
                :label="item.name"
                :value="item.objectId"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="$translateTitle('Maintenance.Ticket type')">
            <el-select
              v-model="queryForm.type"
              :placeholder="
                $translateTitle('Maintenance.Please choose the product')
              "
            >
              <el-option
                v-for="item in types"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="账号">-->
          <!--            <el-input-->
          <!--              v-model.trim="queryForm.account"-->
          <!--              clearable-->
          <!--              placeholder="请输入账号"-->
          <!--            />-->
          <!--          </el-form-item>-->
          <el-form-item
            :label="$translateTitle('Maintenance.the starting time')"
          >
            <el-date-picker
              v-model="queryForm.searchDate"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              start-placeholder="开始日期"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="fetchData">
              {{ $translateTitle('Maintenance.search') }}
            </el-button>
            <el-button
              icon="el-icon-circle-plus-outline"
              type="primary"
              @click="dialogFormVisible = true"
            >
              {{ $translateTitle('Maintenance.create Ticket') }}
            </el-button>
            <el-button
              icon="el-icon-folder-checked"
              type="primary"
              @click="fetchData"
            >
              {{ $translateTitle('Maintenance.Export') }}
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list" :height="height">
      <el-table-column
        sortablesortable
        align="center"
        label="objectId"
        prop="objectId"
        show-overflow-tooltip
      />
      <el-table-column
        sortablesortable
        align="center"
        :label="$translateTitle('Maintenance.Ticket number')"
        prop="number"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.Ticket type')"
        prop="type"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.Ticket status')"
        prop="status"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.project')"
        prop="product.objectId"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.Equipment name')"
        prop="device.objectId"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.Initiator')"
        prop="user"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.the starting time')"
        prop="createdAt"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.operating')"
        prop="name"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleDetail(row)">
            {{ $translateTitle('Maintenance.View') }}
          </el-button>
          <el-button type="text" @click="handleEdit(row)">
            {{ $translateTitle('Maintenance.Dispatch') }}
          </el-button>
          <el-button type="text" @click="handleDelete(row)">
            {{ $translateTitle('Maintenance.Evaluation') }}
          </el-button>
          <el-button type="text" @click="handleEdit(row)">
            {{ $translateTitle('Maintenance.deal with') }}
          </el-button>
          <el-button type="text" @click="handleDelete(row)">
            {{ $translateTitle('Maintenance.delete') }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <vab-empty />
      </template>
    </el-table>
    <el-pagination
      background
      :page-sizes="[10, 20, 30, 50]"
      :current-page="queryForm.skip"
      :layout="layout"
      :page-size="queryForm.limit"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
  import {
    query_object,
    get_object,
    del_object,
    update_object,
    create_object,
  } from '@/api/shuwa_parse'
  import { queryDevice } from '@/api/Device'
  import { mapGetters, mapMutations } from 'vuex'
  import { UploadImg } from '@/api/File'
  export default {
    name: 'MyWork',
    data() {
      return {
        height: this.$baseTableHeight(0),
        dialogFormVisible: false,
        form: {
          name: '',
          product: '',
          type: [],
          description: '',
          photo: [],
          objectId: '',
        },
        types: ['故障维修'],
        Device: [],
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        formLabelWidth: '140px',
        rules: {
          product: [
            { required: true, message: '请选择活动区域', trigger: 'change' },
          ],
          name: [
            { required: true, message: '请选择活动区域', trigger: 'change' },
          ],
          type: [
            { required: true, message: '请选择活动资源', trigger: 'change' },
          ],
        },
        list: [],
        // aclObj: {},
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        queryForm: {
          number: '',
          product: '',
          type: '',
          searchDate: [],
          limit: 20,
          skip: 0,
          order: '-createdAt',
          keys: 'count(*)',
        },
      }
    },
    computed: {
      ...mapGetters({
        _Product: 'user/_Product',
        objectId: 'user/objectId',
        role: 'acl/role',
      }),
      aclObj() {
        let aclObj = {}
        this.role.map((e) => {
          console.log(e.name, '')
          aclObj[`${'role' + ':' + e.name}`] = {
            read: true,
            write: true,
          }
        })
        return aclObj
      },
    },

    created() {
      console.log(this._Product, '_Product')
      console.log('role', this.role)

      console.log('this.height', this.height)
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        console.log(this.queryForm, 'queryForm')
        this.listLoading = false
        const loading = this.$baseColorfullLoading()
        await query_object('Maintenance', {
          limit: this.queryForm.limit,
          order: this.queryForm.order,
          skip: this.queryForm.skip,
          keys: this.queryForm.keys,
          // where: {
          //   number: '',
          //   product: '',
          //   type: '',
          // },
        })
          .then((res) => {
            console.log(res, 'res')
            const { results = [], count = 0 } = res
            this.list = results
            this.list.forEach((e) => {
              for (var key in e.ACL) {
                e.user = console.log(key.substr(5))
              }
            })
            this.total = count
            loading.close()
          })
          .catch((e) => {
            this.$message.error(`${e}`)
            loading.close()
          })
        console.log(this.list, 'this.list')
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createdTicket(this.form)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async createdTicket(from) {
        const params = {
          number: from.name,
          type: from.type,
          status: 0,
          product: {
            objectId: from.product,
            __type: 'Pointer',
            className: 'Product',
          },

          user: {
            objectId: this.objectId,
            __type: 'Pointer',
            className: '_User',
          },
          ACL: this.aclObj,
          device: {
            objectId: from.name,
            __type: 'Pointer',
            className: 'Device',
          },
        }
        const loading = this.$baseColorfullLoading()
        const res = await create_object('Maintenance', params)
        loading.close()
        console.log('res', res)
        this.fetchData()
        this.dialogFormVisible = false
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      myUpload(content) {
        console.log('e', content.file)
        let config = {
          headers: {
            proxy: true, // 是否开启代理
            url: '/dgiotproxy/shuwa_file/', // 开启代理后的真实上传路径
            'Content-Type': 'multipart/form-data',
          },
        }
        UploadImg(content.file, config)
          .then((res) => {
            this.form.photo.push({
              url: res.url,
              name: res.path.split('/group1/group1/')[1],
            })
            console.log('上传成功的回调', res.url, this.form.photo)
          })
          .catch((e) => {
            console.log('出错了', e)
          })
      },
      async prodChange(e) {
        this.Device = []
        const params = {
          where: { product: e },
        }
        const { results } = await queryDevice(params)
        console.log(results, '设备')
        this.Device = results
      },
      handleRemove(file) {
        this.form.photo.forEach((i, index) => {
          if (i.name == file.name) {
            // delete this.form.photo[index]
            // console.log(this.form.photo, index)
          }
        })
        console.log(this.form.photo)
      },
      handlePictureCardPreview(file) {
        console.log('file', file)
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleDownload(file) {
        console.log(file)
      },
      handleSizeChange(val) {
        this.queryForm.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.skip = (val - 1) * this.queryForm.limit
        this.fetchData()
      },
    },
  }
</script>
<style scoped lang="scss">
  .mycontainer {
    .ticker-dialog {
      .create-ticker {
        ::v-deep .el-select {
          width: 100%;
        }
      }
    }
    .query-form {
      margin-top: 10px;
      ::v-deep {
        .el-form-item__label-wrap {
          margin-left: 10px;
        }
        .dialog-footer {
          text-align: center;
        }
      }
    }
  }
</style>
