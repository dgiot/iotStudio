<template>
  <perfect-scrollbar class="vab-render-scrollarea main-content">
    <ele-form
      ref="ele-form"
      v-model="formData"
      :form-desc="VabRender.formDesc"
      :order="Object.keys(VabRender.formDesc)"
      v-bind="VabRender.formBindProps"
    >
      <template #form-content="{ props, formDesc, formErrorObj }">
        <vue-draggable
          v-if="isRenderFinish"
          :animation="200"
          :disabled="false"
          group="form"
          :list="VabRender.formItemList"
          style="padding-bottom: 80px"
          tag="el-row"
          @add="handleAdd"
          @end="handleMoveEnd"
          @start="handleMoveStart"
        >
          <!-- 当为空时 -->
          <div
            v-if="VabRender.formItemList.length === 0"
            class="form-area-placeholder"
          >
            从左侧拖拽来添加表单项
          </div>
          <template v-else>
            <template v-for="(formItem, field, index) of formDesc">
              <el-col
                v-if="formItem._vif"
                :key="field"
                class="form-item"
                :class="{
                  'ele-form-col--break': formItem.break,
                  'form-item-active': VabRender.currentIndex === index,
                }"
                v-bind="formItem._colAttrs"
                @click.native="handleFormItemClick(index)"
              >
                <el-form-item
                  :error="formErrorObj ? formErrorObj[field] : null"
                  :label="
                    props.isShowLabel && formItem.isShowLabel !== false
                      ? formItem.label
                      : null
                  "
                  :label-width="formItem.labelWidth || undefined"
                  :prop="field"
                >
                  <component
                    :is="formItem._type"
                    :ref="field"
                    v-model="formItem.default"
                    :desc="formItem"
                    :disabled="props.disabled || formItem._disabled"
                    :field="field"
                    :options="formItem._options"
                  />
                  <div
                    v-if="formItem.tip"
                    class="ele-form-tip"
                    v-html="formItem.tip"
                  ></div>
                </el-form-item>

                <!-- 删除按钮 -->
                <i
                  v-if="VabRender.currentIndex === index"
                  class="el-icon-delete form-item-delete-btn"
                  @click.stop="handleDelete(index)"
                ></i>
              </el-col>
            </template>
          </template>
        </vue-draggable>
      </template>
    </ele-form>
  </perfect-scrollbar>
</template>

<script>
  export default {
    name: 'VabRenderMainContent',
    inject: ['VabRender'],
    data() {
      return {
        formData: {},
        isRenderFinish: false,
      }
    },
    mounted() {
      // 确保渲染结束
      this.$nextTick(() => {
        this.isRenderFinish = true
      })
    },
    methods: {
      // 通过index删除
      deleteItemByIndex(index) {
        this.VabRender.formItemList.splice(index, 1)
      },
      // 通过index更新
      updateSelectIndex(index) {
        this.VabRender.currentIndex = index
      },

      // 删除
      handleDelete(index) {
        this.deleteItemByIndex(index)

        // 因为如果删除最后一个, 界面则无选中效果
        // 所以这里删除最后一个后, 重新选择最后一个
        if (index >= this.VabRender.formItemList.length) {
          this.updateSelectIndex(this.VabRender.formItemList.length - 1)
        }
      },

      // 新增
      handleAdd(res) {
        this.updateSelectIndex(res.newIndex)
      },

      // 移动开始
      handleMoveStart(res) {
        this.updateSelectIndex(res.oldIndex)
      },

      // 移动结束
      handleMoveEnd(res) {
        this.updateSelectIndex(res.newIndex)
      },

      // 点击选中
      handleFormItemClick(index) {
        this.updateSelectIndex(index)
      },
    },
  }
</script>

<style lang="css">
  /* 中间区域 */
  .main-content {
    padding: 20px;
  }

  /* 表单样式 */
  .main-content .el-form {
    box-sizing: border-box;
    padding: 20px;
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
  }

  /* 当无表单时的占位 */
  .main-content .form-area-placeholder {
    width: 100%;
    height: 300px;
    line-height: 300px;
    color: #909399;
    text-align: center;
    background-color: white;
  }

  /* 表单项 */
  .main-content .form-item {
    position: relative;
    z-index: 1;
    padding: 0 20px;
    cursor: move;
    background: white;
    border: 1px dashed rgba(0, 0, 0, 0);
  }

  /* 表单项激活时 */
  .main-content .form-item-active {
    border: 1px dashed #409eff;
  }

  /* 遮挡区(遮挡住，不允许直接输入等操作) */
  .main-content .form-item::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    display: block;
    content: ' ';
  }

  /* 删除按钮 */
  .main-content .form-item .form-item-delete-btn {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 3;
    padding: 7px 15px;
    color: white;
    cursor: pointer;
    background: #409eff;
  }
</style>
