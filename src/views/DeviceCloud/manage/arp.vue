<template>
  <div>
    <el-tab-pane label="物解析" name="fourth">
      <div class="protolheader">
        <el-form
          ref="formInline"
          class="demo-form-inline"
          :inline="true"
          :model="formInline"
          :rules="addRules"
        >
          <el-form-item
            :label="$translateTitle('product.protocolname')"
            prop="name"
          >
            <el-input
              v-model="formInline.name"
              :placeholder="$translateTitle('product.protocolname')"
            />
          </el-form-item>
          <el-form-item :label="$translateTitle('plugins.version')">
            <el-input
              v-model="formInline.version"
              :placeholder="$translateTitle('plugins.version')"
            />
          </el-form-item>
          <el-form-item :label="$translateTitle('developer.describe')">
            <el-input
              v-model="formInline.desc"
              :placeholder="$translateTitle('developer.describe')"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              size="small"
              type="primary"
              @click="subAce('formInline', true)"
            >
              {{ $translateTitle('product.preservation') }}
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="subAce1('formInline')"
            >
              设为公共
            </el-button>
            <el-button size="small" type="primary" @click="chaxun">
              {{ $translateTitle('product.publicagreementlibrary') }}
            </el-button>
          </el-form-item>
          <el-form-item style="display: block">
            <el-button size="small" type="primary" @click="protol">
              {{ $translateTitle('product.compile') }}
            </el-button>
            <el-button size="small" type="success" @click="updatesubdialog">
              热加载
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--通道热加载-->
      <el-dialog
        :append-to-body="true"
        :close-on-click-modal="false"
        title="通道热加载"
        :visible.sync="protoldialog"
        width="50%"
      >
        <el-table
          ref="multipleTable"
          :data="protolchannel"
          :row-class-name="getChannelEnable"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column :label="$translateTitle('developer.channelnumber')">
            <template #default="{ row }">
              <span>{{ row.objectId }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.channelname')">
            <template #default="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.channeladdr')">
            <template #default="{ row }">
              <span>{{ 'channel/' + row.objectId }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.channeltype')">
            <template #default="{ row }">
              <span v-if="row.type == 1">
                {{ $translateTitle('developer.collectionchannel') }}
              </span>
              <span v-else>
                {{ $translateTitle('developer.resourcechannel') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('developer.servicetype')">
            <template #default="{ row }">
              <span>{{ row.cType }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click.native="updateAllChannel">
            确定
          </el-button>
        </div>
      </el-dialog>
      <!--公共协议库弹窗-->
      <el-dialog
        :append-to-body="true"
        :close-on-click-modal="false"
        :title="$translateTitle('product.publicagreementlibrary')"
        :visible.sync="dialogTableVisible"
        width="50%"
      >
        <el-table
          :data="gridData"
          style="width: 100%; margin-top: 20px; text-align: center"
        >
          <el-table-column
            align="center"
            :label="$translateTitle('product.protocolname')"
          >
            <template #default="{ row }">
              <span>{{ row.data.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle('plugins.version')"
          >
            <template #default="{ row }">
              <span>{{ row.data.version }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle('developer.describe')"
          >
            <template #default="{ row }">
              <span>{{ row.data.desc }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间">
            <template #default="{ row }">
              <span>{{ utc2beijing(row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle('developer.operation')"
            width="200"
          >
            <template #default="{ row }">
              <el-button size="mini" type="primary" @click="editordata(row)">
                {{ $translateTitle('product.clone') }}
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deletedata(row.objectId)"
              >
                {{ $translateTitle('developer.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="elpagination" style="padding: 20px 0">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :page-size="decoderlength"
            :page-sizes="[10, 20, 30, 50]"
            :total="decodertotal"
            @current-change="devicerCurrentChange"
            @size-change="decoderSizeChange"
          />
        </div>
      </el-dialog>
      <div>
        <div style="background: #ffffff">
          <label id="plug-name" />
        </div>
        <pre
          id="editor"
          class="ace_editor"
          style="min-height: 600px; margin-bottom: 0"
        ><textarea class="ace_text-input" /></pre>
        <div style="background: #ffffff">
          <label id="plug-name" />
        </div>
        <div
          style="
            padding: 5px;
            color: #c2be9e;
            background: #272822;
            border-top: 1px solid #dddddd;
          "
        >
          <span>{{ $translateTitle('product.controloutput') }}</span>
        </div>
        <pre
          id="editor2"
          class="ace_editor"
          style="min-height: 300px; margin-top: 0; margin-bottom: 0"
        ><textarea class="ace_text-input" /></pre>
      </div>
    </el-tab-pane>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        formInline: {
          name: '',
          version: '',
          desc: '',
          resource: false,
        },
      }
    },
    computed: {},
    methods: {},
  }
</script>

<style lang="scss" scoped>
  //@import url()
</style>
