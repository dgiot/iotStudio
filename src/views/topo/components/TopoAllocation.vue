<!-- 组件说明 -->
<template>
  <div class="icon-selector-popper">
    <div class="dialog">
      <vab-input ref="uploadFinish" @fileInfo="fileInfo" />
    </div>
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item title="图标" name="1">
        <el-row :gutter="20">
          <el-col :span="24">
            <vab-query-form>
              <vab-query-form-top-panel>
                <el-form :inline="true" label-width="0" @submit.native.prevent>
                  <el-form-item label="">
                    <el-input v-model="queryForm.title" size="mini">
                      <el-button
                        slot="append"
                        native-type="submit"
                        type="primary"
                        icon="el-icon-search"
                        @click="queryData"
                      />
                      <el-button
                        slot="prepend"
                        type="success"
                        icon="el-icon-upload"
                        @click="uploadCkick()"
                      />
                    </el-input>
                  </el-form-item>
                </el-form>
              </vab-query-form-top-panel>
            </vab-query-form>
          </el-col>

          <el-col v-for="(item, index) in queryIcon" :key="index" :span="8">
            <el-image
              style="width: 100%; height: 40px; cursor: pointer"
              :src="imgHost + item"
              @click.native="handleIcon(imgHost + item)"
            />
          </el-col>
          <el-col :span="24">
            <el-pagination
              :background="background"
              :current-page="queryForm.pageNo"
              :layout="layout"
              :page-size="queryForm.pageSize"
              :total="total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import { getMaterial } from '@/api/material'
  import { mapMutations } from 'vuex'
  export default {
    name: 'Allocation',
    data() {
      return {
        accept: '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF',
        imgHost:
          'https://dgiot-1253666439.file.myqcloud.com/dgiot_release/topo/',
        icon: '24-hours-fill',
        layout: 'total, prev, next',
        total: 0,
        background: true,
        height: 0,
        selectRows: '',
        queryIcon: [],
        queryForm: {
          pageNo: 1,
          pageSize: 30,
          title: '',
        },
        images: [],
        imgParams: {},
        activeNames: '1',
      }
    },
    computed: {},
    created() {
      this.fetchData()
    },
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      uploadCkick() {
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
      },
      ...mapMutations({
        setFlag: 'konva/setFlag',
        setDrawParams: 'konva/setDrawParams',
      }),
      mousedown(item) {
        this.$emit('fatherMousedown', item)
      },
      mousemove(item) {
        this.$emit('fatherMousemove', item)
        // console.log(item)
      },
      mouseup(item) {
        this.$emit('fatherMouseup', item)
      },

      async fetchData() {
        const { data, totalCount } = await getMaterial(this.queryForm)
        this.queryIcon = data
        this.total = totalCount
      },
      handleChange(val) {
        console.log(val)
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
      fileInfo(res) {
        console.log(res)
        this.dialogVisible = !this.dialogVisible
        this.handleIcon(res.url)
      },
      handleIcon(url) {
        var img = new Image()
        let _this = this
        img.src = url + '?' + new Date().getTime()
        img.onload = function () {
          _this.$set(_this.imgParams, 'width', img.width)
          _this.$set(_this.imgParams, 'height', img.height)
          _this.$set(_this.imgParams, 'src', img.src)
          console.log('图片加载完成', _this.imgParams)
          _this.$baseMessage(
            _this.$translateTitle('图片加载完成,可双击画图区域填充'),
            'success',
            false,
            'vab-hey-message-success'
          )
        }
        _this.setFlag('image')
        _this.setDrawParams(_this.imgParams)
        // this.icon = item
        // this.queryForm.title = item
        // _this.$emit('handle-icon', item)
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scope>
  .icon-selector-popper {
    height: calc(100vh - #{$base-top-bar-height}* 4 - 25px);
    margin-left: 10px;
    overflow-x: hidden;
    overflow-y: scroll;
    .el—card {
      height: 40px !important;
      padding: 10px;
    }
    .el-collapse-item__header {
      display: block;
      margin: 0 auto;
      text-align: center;
    }
    .el-card__body {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 20px;
      cursor: pointer;

      i {
        font-size: 28px;
        color: $base-color-gray;
        text-align: center;
        vertical-align: middle;
        pointer-events: none;
        cursor: pointer;
      }
    }

    .el-pagination {
      margin: 0;
    }
  }
</style>
