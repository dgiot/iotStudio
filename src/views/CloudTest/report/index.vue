<!--
* @Author: h7ml
* @Date: 2021-11-08 17:17:08
* @LastEditors: h7ml
* @LastEditTime: 2021-11-08 17:17:08
* @Description: 报告模板
* @FilePath: src\views\CloudTest\report\index.vue
* @DocumentLink:
-->
<template>
  <div
    ref="custom-table"
    class="custom-table-container"
    :class="{ 'dgiot-fullscreen': isFullscreen }"
  >
    <div>
      <el-dialog append-to-body :visible.sync="activePopShow">
        <h3 slot="title">
          {{ $translateTitle('cloudTest.add')
          }}{{ $translateTitle('cloudTest.report template') }}
        </h3>
        <div class="content">
          <el-form
            ref="ruleForm"
            class="demo-ruleForm"
            label-width="100px"
            :model="ruleForm"
            :rules="rules"
          >
            <el-form-item
              :label="$translateTitle('cloudTest.Template name')"
              prop="name"
            >
              <el-input v-model="ruleForm.name" />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('cloudTest.category')"
              prop="categoryname"
            >
              <!--              <el-input v-model="ruleForm.category" />-->
              <el-input v-model="ruleForm.categoryname" readonly>
                <el-icon
                  slot="append"
                  class="el-icon-edit el-input__icon"
                  size="mini"
                  @click.native="handlecateClick"
                />
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$translateTitle('cloudTest.Trade Names')"
              prop="factory"
              required
            >
              <el-input v-model="ruleForm.factory" />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('cloudTest.Template file')"
              prop="file"
              required
            >
              <!--              <el-input v-model="ruleForm.name" />-->
              <el-upload
                :key="momentKey"
                ref="upload"
                v-model="ruleForm.file"
                accept=".doc,.docx"
                action="string"
                :before-upload="onBeforeUploadImage"
                class="upload-demo"
                :file-list="fileList"
                :http-request="UploadImage"
                :limit="1"
                list-type="text"
                :on-change="fileChange"
              >
                <el-button slot="trigger" size="small" type="primary">
                  {{ $translateTitle('application.selectfile') }}
                </el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button type="primary" @click="submitForm('ruleForm')">
            {{ $translateTitle('product.createnow') }}
          </el-button>
          <el-button @click="resetForm('ruleForm')">
            {{ $translateTitle('zetadevices.reset') }}
          </el-button>
        </div>
        <el-drawer append-to-body size="40%" :visible.sync="cascaderDrawer">
          <div>
            <el-row :gutter="20">
              <el-col :span="24">
                <dgiot-query-form>
                  <dgiot-query-form-top-panel>
                    <el-form
                      :inline="true"
                      label-width="100px"
                      @submit.native.prevent
                    >
                      <el-form-item
                        :label="$translateTitle('product.classification')"
                      >
                        <el-select
                          v-model="queryForm.category"
                          :placeholder="$translateTitle('task.Select')"
                          style="width: 100%"
                          @change="handleCateSearch"
                        >
                          <el-option
                            v-for="(item, index) in categoryTreeData"
                            :key="index"
                            :label="item.name"
                            :value="item.objectId"
                          />
                        </el-select>
                      </el-form-item>

                      <el-form-item
                        :label="$translateTitle('developer.Templatename')"
                      >
                        <el-input
                          v-model="queryForm.name"
                          clearable
                          placeholder="请输入模板名称"
                        />
                      </el-form-item>
                      <el-form-item label-width="0">
                        <el-button
                          class="el-icon-search"
                          native-type="submit"
                          type="primary"
                          @click="queryProdut({})"
                        />
                      </el-form-item>
                    </el-form>
                  </dgiot-query-form-top-panel>
                </dgiot-query-form>
              </el-col>
            </el-row>
            <el-table
              border
              :cell-style="{ 'text-align': 'center' }"
              :data="tableData"
              :header-cell-style="{ 'text-align': 'center' }"
              size="mini"
              style="width: 100%"
            >
              <el-table-column
                align="center"
                :label="$translateTitle('developer.Templatename')"
              >
                <template #default="{ row }">
                  {{ row.name }}
                  <el-popover placement="left" trigger="click" width="800">
                    <i
                      slot="reference"
                      class="el-icon-info"
                      @click="referenceHandle(row)"
                    ></i>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('department.category')"
                prop="categoryname"
              >
                <template #default="{ row }">
                  {{ row.category.name }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('developer.operation')"
              >
                <template #default="{ row }">
                  <el-button type="text" @click="chooseTemplate(row)">
                    {{ $translateTitle('product.choose') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-drawer>
      </el-dialog>
      <dgiot-dialog :show.sync="tempPopShow">
        <h3 slot="title">
          {{ $translateTitle('cloudTest.report template') }}
        </h3>
        <div class="content">
          <el-table
            ref="tableSort"
            v-loading="listLoading"
            :border="border"
            :data="tempList"
            :size="lineHeight"
            :stripe="stripe"
          >
            <el-table-column
              align="center"
              :label="$translateTitle('cloudTest.number')"
              prop="title"
              show-overflow-tooltip
              width="80"
            />
            <!--            <el-table-column-->
            <!--              align="center"-->
            <!--              :label="$translateTitle('cloudTest.Template name')"-->
            <!--              prop="name"-->
            <!--              show-overflow-tooltip-->
            <!--              width="auto"-->
            <!--            />-->
            <el-table-column
              align="center"
              :label="$translateTitle('cloudTest.Template content')"
              width="auto"
            >
              <template #default="{ row }">
                <el-image
                  :preview-src-list="[$FileServe + row.data.icon]"
                  :src="$FileServe + row.data.icon"
                  style="width: 40px; height: 40px"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              flex="right"
              :label="$translateTitle(`product.Template management`)"
              show-overflow-tooltip
              width="auto"
            >
              <template #default="{ row, $index }">
                <el-button type="success" @click="handlekonva(row, $index)">
                  {{ $translateTitle(`developer.task mapping`) }}
                </el-button>
                <el-button type="danger" @click="handleDelete(row, 1)">
                  {{ $translateTitle(`cloudTest.delete`) }}
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-image
                class="dgiot-data-empty"
                :src="
                  require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                "
              />
            </template>
          </el-table>
        </div>
      </dgiot-dialog>
    </div>
    <dgiot-query-form>
      <dgiot-query-form-left-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="0"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              v-model="queryForm.name"
              :placeholder="
                $translateTitle('cloudTest.Please enter the query content')
              "
            />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="fetchData"
            >
              {{ $translateTitle('cloudTest.search') }}
            </el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
              {{ $translateTitle('cloudTest.template') }}
            </el-button>
          </el-form-item>
        </el-form>
      </dgiot-query-form-left-panel>
    </dgiot-query-form>
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :border="border"
      :data="list"
      :size="lineHeight"
      :stripe="stripe"
    >
      <el-table-column
        align="center"
        :label="$translateTitle('cloudTest.number')"
        show-overflow-tooltip
        width="60"
      >
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in finallyColumns"
        :key="index"
        align="center"
        :label="$translateTitle(`cloudTest.${item.label}`)"
        :prop="item.prop"
        show-overflow-tooltip
        :sortable="item.sortable"
        :width="item.width"
      />

      <el-table-column
        align="center"
        fixed="right"
        :label="$translateTitle(`cloudTest.operate`)"
        show-overflow-tooltip
        width="auto"
      >
        <template #default="{ row }">
          <el-button size="mini" type="text" @click="handleManagement(row)">
            {{ $translateTitle(`product.task management`) }}
          </el-button>
          <el-button
            size="mini"
            style="color: red"
            type="text"
            @click="handleDelete(row, 0)"
          >
            {{ $translateTitle(`cloudTest.delete`) }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-image
          class="dgiot-data-empty"
          :src="
            require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
          "
        />
      </template>
    </el-table>
    <dgiot-parser-pagination
      ref="paginations"
      :pagination="paginations"
      :query-payload="queryPayload"
      @pagination="fetchData"
      @paginationQuery="paginationQuery"
    />
  </div>
</template>
<script src="../js/report.js"></script>
<style>
  .el-dialog__wrapper {
    transition-duration: 0.3s;
  }
</style>
