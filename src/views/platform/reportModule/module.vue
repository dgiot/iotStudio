<template>
  <div class="module">
    <div id="editor_holder" />
    <el-button type="primary" style="margin-top: 20px" @click="addmodule">
      保 存
    </el-button>
  </div>
</template>

<script>
  const schema = {
    type: 'object',
    title: '水泵检测模板配置',
    properties: {
      sample: {
        type: 'string',
        description: '产品名称',
        minLength: 10,
      },
      category: {
        type: 'string',
        description: '检验类别',
      },
      inspection_standard: {
        type: 'string',
        description: '检验标准',
      },
      inspecting: {
        type: 'array',
        title: '检测名称',
        items: {
          type: 'object',
          properties: {
            inspecting_item: {
              type: 'string',
              description: '检验项目',
            },
            guarantee_value: {
              type: 'array',
              title: '保证值',
              format: 'table',
              uniqueItems: true,
              items: {
                type: 'object',
                title: '保证值',
                properties: {
                  title: {
                    type: 'string',
                    description: '保证值',
                  },
                  value: {
                    type: 'string',
                    description: '测试值',
                  },
                  assess: {
                    type: 'string',
                    description: '评定',
                  },
                  evidenceway: {
                    type: 'string',
                    description: '取证方式',
                  },
                  evidence: {
                    type: 'string',
                    description: '证据链',
                  },
                },
              },
            },
          },
        },
      },
    },
    default: {},
  }
  //   import { Parse } from 'parse'
  import { addReport } from '@/api/reportmodule/reportmodule'
  import Vue from 'vue'
  var editor
  JSONEditor.defaults.options.theme = 'foundation4'
  // JSONEditor.defaults.options.iconlib = 'foundation2';

  export default {
    data() {
      return {
        default: '',
        reportId: '',
        editor: '',
      }
    },
    mounted() {
      this.getSchema()
    },
    methods: {
      getSchema() {
        this.reportId = this.$route.query.id
        JSONEditor.defaults.options.show_errors = 'change'
        if (this.reportId) {
          var report = Parse.Object.extend('Datas')
          var query = new Parse.Query(report)
          query.get(this.reportId).then((resultes) => {
            schema.default = resultes.attributes.data
            schema.default.inspecting.map((children) => {
              children.guarantee_value.map((deleteid) => {
                delete deleteid.id
              })
            })
            editor = new JSONEditor(document.getElementById('editor_holder'), {
              schema,
              theme: 'foundation4',
            })
          }),
            (error) => {
              console.log(error)
            }
        } else {
          schema.default = {}
          editor = new JSONEditor(document.getElementById('editor_holder'), {
            schema: schema,
          })
        }
      },
      addmodule() {
        var errors = editor.validate({})
        console.log(errors)
        if (errors.length) {
        } else {
          addReport(editor.getValue(), this.reportId)
            .then((resultes) => {
              if (resultes) {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                })
                this.$router.push({
                  path: '/reportmodule/index',
                })
              }
            })
            .catch((error) => {
              this.$message({
                type: 'error',
                message: error.error,
              })
            })
        }
      },
    },
  }
</script>

<style scoped>
  .module {
    box-sizing: border-box;
    width: 100%;
    min-height: 875px;
    padding: 20px;
    background: #ffffff;
  }
</style>
<style>
  /* .form-control {
  margin: 10px 0;
}
.module button {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  border: 0;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  border-radius: 4px;
  padding: 12px 20px;
  margin-left: 10px;
}
.module input,
select {
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 200px;
}
.module label {
  display: inline-block !important;
  text-align: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
.module label::after {
  content: ":";
}
.module p {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}
.module .json-editor-btn-delete,
.delete,
.json-editor-btntype-delete {
  margin-left: 10px;
}
.module .json-editor-btn-movedown,
.movedown,
.json-editor-btntype-move {
  margin-top: 10px;
}
.module .json-editor-btn-moveup,
.moveup,
.json-editor-btntype-move {
  margin-top: 10px;
}
.module .je-header-button-holder{
  display:inline-block;
  margin-left:20px;
}
.module .je-indented-panel button{
  margin-top:10px;
} */
  .module p {
    margin-top: 0 !important;
  }
  .module td .button-group {
    margin-top: -25px !important;
  }
</style>
