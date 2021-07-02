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
              v-model.trim="queryForm.account"
              clearable
              :placeholder="$translateTitle('Maintenance.Ticket number')"
            />
          </el-form-item>
          <el-form-item :label="$translateTitle('Maintenance.project')">
            <el-input
              v-model.trim="queryForm.account"
              clearable
              :placeholder="$translateTitle('Maintenance.project')"
            />
          </el-form-item>

          <el-form-item :label="$translateTitle('Maintenance.Ticket type')">
            <el-input
              v-model.trim="queryForm.account"
              clearable
              :placeholder="$translateTitle('Maintenance.Ticket type')"
            />
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
            <el-button icon="el-icon-search" type="primary" @click="queryData">
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
              @click="queryData"
            >
              {{ $translateTitle('Maintenance.Export') }}
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list">
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Ticket number')"
        prop="name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Ticket type')"
        prop="name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Ticket status')"
        prop="name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.project')"
        prop="name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Equipment name')"
        prop="name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Initiator')"
        prop="name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.the starting time')"
        prop="name"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.operating')"
        prop="name"
        show-overflow-tooltip
      />
      <template #empty>
        <vab-empty />
      </template>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
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
  import { aclObj } from '@/utils/acl'
  export default {
    name: 'MyWork',
    data() {
      return {
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
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        queryForm: {
          account: '',
          searchDate: '',
          pageNo: 1,
          pageSize: 20,
        },
      }
    },
    computed: {
      ...mapGetters({
        _Product: 'user/_Product',
        objectId: 'user/objectId',
      }),
    },
    created() {
      console.log(this._Product, '_Product')
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        this.listLoading = false
        const loading = this.$baseColorfullLoading()
        // const { results = [] } = await query_object('Maintenance', {})
        // setTimeout(() => {
        //   this.list = results
        //   loading.close()
        // }, 1000)
        await query_object('Maintenance', {
          limit: 10,
          order: '-createdAt',
          skip: 0,
          keys: 'count(*)',
          where: {},
        })
          .then((res) => {
            this.list = res.results
            this.total = total
            loading.close()
          })
          .catch((e) => {
            this.$message.error(`${e}`)
            loading.close()
          })
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
          status: '1',
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
          ACL: aclObj,
          device: {
            objectId: from.name,
            __type: 'Pointer',
            className: 'Device',
          },
        }

        const res = await create_object('Maintenance', params)
        console.log('res', res)
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
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
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
