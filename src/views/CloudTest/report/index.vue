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
    :class="{ 'vab-fullscreen': isFullscreen }"
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
                <vab-query-form>
                  <vab-query-form-top-panel>
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
                  </vab-query-form-top-panel>
                </vab-query-form>
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
                  <el-button
                    size="mini"
                    type="text"
                    @click="chooseTemplate(row)"
                  >
                    {{ $translateTitle('product.choose') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-drawer>
      </el-dialog>
      <vab-dialog :show.sync="tempPopShow">
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
              <template #default="{ row }">
                <el-button size="mini" type="success" @click="handlekonva(row)">
                  {{ $translateTitle(`developer.mapping`) }}
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(row, 1)"
                >
                  {{ $translateTitle(`cloudTest.delete`) }}
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-image
                class="vab-data-empty"
                :src="
                  require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                "
              />
            </template>
          </el-table>
        </div>
      </vab-dialog>
    </div>
    <vab-query-form>
      <vab-query-form-left-panel>
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
              {{ $translateTitle('cloudTest.add') }}
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <!--        <div class="stripe-panel">-->
        <!--          <el-checkbox v-model="stripe">-->
        <!--            {{ $translateTitle('cloudTest.Zebra pattern') }}-->
        <!--          </el-checkbox>-->
        <!--        </div>-->
        <!--        <div class="border-panel">-->
        <!--          <el-checkbox v-model="border">-->
        <!--            {{ $translateTitle('cloudTest.frame') }}-->
        <!--          </el-checkbox>-->
        <!--        </div>-->
        <el-button
          style="margin: 0 10px 10px 0 !important"
          type="primary"
          @click="clickFullScreen"
        >
          <dgiot-icon
            :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
          />
          {{ $translateTitle('cloudTest.full screen') }}
        </el-button>
        <el-popover
          ref="popover"
          popper-class="custom-table-checkbox"
          trigger="hover"
        >
          <el-radio-group v-model="lineHeight">
            <el-radio label="medium">
              {{ $translateTitle('cloudTest.medium') }}
            </el-radio>
            <el-radio label="small">
              {{ $translateTitle('cloudTest.small') }}
            </el-radio>
            <el-radio label="mini">
              {{ $translateTitle('cloudTest.mini') }}
            </el-radio>
          </el-radio-group>
          <template #reference>
            <el-button style="margin: 0 10px 10px 0 !important" type="primary">
              <dgiot-icon icon="line-height" />
              {{ $translateTitle('cloudTest.size') }}
            </el-button>
          </template>
        </el-popover>
        <el-popover popper-class="custom-table-checkbox" trigger="hover">
          <el-checkbox-group v-model="checkList">
            <vab-draggable :list="columns" v-bind="dragOptions">
              <div v-for="(item, index) in columns" :key="item + index">
                <dgiot-icon icon="drag-drop-line" />
                <el-checkbox
                  :disabled="item.disableCheck === true"
                  :label="item.label"
                >
                  {{ $translateTitle(`cloudTest.${item.label}`) }}
                </el-checkbox>
              </div>
            </vab-draggable>
          </el-checkbox-group>
          <template #reference>
            <el-button
              icon="el-icon-setting"
              style="margin: 0 0 10px 0 !important"
              type="primary"
            >
              {{ $translateTitle('cloudTest.Draggable column') }}
            </el-button>
          </template>
        </el-popover>
      </vab-query-form-right-panel>
    </vab-query-form>
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
        width="95"
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
        :label="$translateTitle(`cloudTest.operate`)"
        show-overflow-tooltip
        width="185"
      >
        <template #default="{ row }">
          <el-button size="mini" type="success" @click="handleManagement(row)">
            {{ $translateTitle(`product.Template management`) }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row, 0)">
            {{ $translateTitle(`cloudTest.delete`) }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-image
          class="vab-data-empty"
          :src="
            require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
          "
        />
      </template>
    </el-table>
    <vab-parser-pagination
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
