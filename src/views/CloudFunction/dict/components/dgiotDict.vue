<!--
* @Author: h7ml
* @Date: 2021-11-17 10:40:36
* @LastEditors: h7ml
* @LastEditTime: 2021-11-17 10:40:36
* @Description:
* @FilePath: src\views\Lowcode\components\dgiotDict.vue
* @DocumentLink:
-->
<template>
  <div style="margin-left: 30px; margin-right: 30px">
    <el-button
      class="mt-3"
      icon="el-icon-plus"
      size="small"
      type="primary"
      @click.native="addparam"
    >
      <!-- 新增 -->
      {{ $translateTitle('product.newlyadded') }}
    </el-button>
    <h1></h1>
    <el-table
      border
      :cell-style="{ 'text-align': 'center' }"
      :data="dataform.params"
      :header-cell-style="{ 'text-align': 'center' }"
      style="width: 100%"
    >
      <el-table-column
        :label="$translateTitle('equipment.serialnumber')"
        prop="order"
      />
      <el-table-column
        :label="$translateTitle('deviceLog.identifier')"
        prop="identifier"
      />
      <el-table-column :label="$translateTitle('equipment.name')" prop="name" />
      <el-table-column :label="$translateTitle('rule.Type')" prop="type" />
      <el-table-column
        align="center"
        :label="$translateTitle('task.Operation')"
        width="160"
      >
        <template #default="{ row, $index }">
          <el-button
            plain
            size="mini"
            :title="$translateTitle('task.Edit')"
            type="info"
            @click.native="editRow($index, row)"
          >
            <!-- 编辑 -->
            {{ $translateTitle('task.Edit') }}
          </el-button>
          <el-button
            plain
            size="mini"
            :title="$translateTitle('task.Delete')"
            type="danger"
            @click.native="delRow($index)"
          >
            <!-- 删除 -->
            {{ $translateTitle('task.Delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      ref="param"
      v-drawerDrag
      append-to-body
      size="30%"
      :title="title_param_dialog"
      :visible.sync="edit_param_dialog"
    >
      <div>
        <el-form
          ref="param"
          class="demo-ruleForm"
          label-width="100px"
          :model="param"
          :rules="rules"
          size="mini"
          status-icon
        >
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item
                :label="$translateTitle('equipment.serialnumber')"
                prop="order"
              >
                <el-input-number
                  v-model="param.order"
                  :min="1"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="20">
              <el-form-item
                :label="$translateTitle('product.identifier')"
                prop="identifier"
              >
                <el-input v-model="param.identifier" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="20">
              <el-form-item
                :label="$translateTitle('product.name')"
                prop="name"
              >
                <el-input v-model="param.name" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="20">
              <el-form-item :label="$translateTitle('rule.Type')" prop="type">
                <el-select
                  v-model="param.type"
                  :placeholder="$translateTitle('task.Select')"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in dictOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click.native="submitparam('param')">
              <!-- 确定 -->
              {{ $translateTitle('button.determine') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  export default {
    name: 'DgiotDict',
    components: {},
    props: {
      objectId: {
        default: '',
        required: true,
        type: String,
      },
      data: {
        default: function () {
          return {
            params: [],
          }
        },
        required: true,
        type: Object,
      },
    },
    data() {
      return {
        dataform: this.data,
        param: {},
        rules: {
          name: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur',
            },
          ],
          identifier: [
            {
              required: true,
              message: '请输入标识符',
              trigger: 'blur',
            },
          ],
          type: [
            {
              required: true,
              message: '请选择类型',
              trigger: 'change',
            },
          ],
        },
        title_param_dialog: '',
        edit_param_dialog: false,
        height: this.$baseTableHeight(0) - 50,
        activeName: '字典管理',
        infoData: 'DgiotDict',
        dictOptions: [
          'text',
          'table',
          'dynamicTable',
          'image',
          'string',
          'boolean',
          'number',
        ],
        editIndexId: '',
      }
    },
    computed: {},
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      opendialog(name) {
        this.$nextTick(() => {
          this.$refs[name].clearValidate()
        })
      },
      delRow(index) {
        this.dataform.params.splice(index, 1)
        this.saveDict()
      },
      editRow(index, row) {
        this.editIndexId = index
        this.title_param_dialog = '修改字典数据'
        this.edit_param_dialog = true
        this.param = row
      },
      addparam() {
        this.editIndexId = undefined
        this.title_param_dialog = '新增字典数据'
        this.edit_param_dialog = true
        this.param = {
          order: this.data.params.length + 1,
          identifier: '',
          name: '',
          type: '',
        }
      },
      submitparam(param) {
        this.$refs[param].validate(async (valid) => {
          if (valid) {
            if (this.editIndexId != undefined) {
              this.dataform.params[this.editIndexId] = this.param
              this.$message({
                showClose: true,
                duration: 2000,
                message: '编辑成功',
                type: 'success',
              })
            } else {
              this.dataform.params.push(this.param)
              this.$message({
                showClose: true,
                duration: 2000,
                message: '新增成功',
                type: 'success',
              })
            }
            this.saveDict()
          }
        })
      },
      saveDict() {
        this.$dgiotBus.$emit('saveDict', {
          id: this.objectId,
          data: { data: this.dataform },
        })
        this.edit_param_dialog = false
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .dgiotAmis-container {
    width: 100%;
    height: 100%;
    &-container {
      width: 100%;
      height: 100%;
    }
  }
</style>
