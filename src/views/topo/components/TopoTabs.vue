<!-- 组件说明 -->
<template>
  <div class="icon-selector-popper">
    <div class="dialog">
      <vab-input
        ref="uploadFinish"
        :params="inputParams"
        @fileInfo="fileInfo"
        @files="files"
      />
    </div>
    <Thing />
    <a-collapse accordion>
      <a-collapse-panel key="1" :header="$translateTitle('topo.background')">
        <el-button size="mini" type="primary" @click.native="uploadCkick('bg')">
          {{ $translateTitle('topo.Upload background') }}
        </el-button>
        <Background />
      </a-collapse-panel>
      <a-collapse-panel
        key="2"
        :header="$translateTitle('product.physicalmodel')"
      >
        <el-button
          size="mini"
          type="primary"
          @click.native="
            createThing({
              productid: $route.query.productid,
              hidden: false,
            })
          "
        >
          {{ $translateTitle('topo.Add text content') }}
        </el-button>
      </a-collapse-panel>
      <a-collapse-panel key="3" :header="$translateTitle('topo.evidence')">
        <!--        <el-button-->
        <!--          size="mini"-->
        <!--          type="primary"-->
        <!--        >-->
        <!--          {{ $translateTitle('topo.Add configuration tag') }}-->
        <!--        </el-button>-->
        <Evidence />
      </a-collapse-panel>
      <a-collapse-panel key="4" :header="$translateTitle('topo.image')">
        <div>
          <el-collapse v-model="activeNames" accordion>
            <el-collapse-item name="icon" title="iconfont">
              <el-row :gutter="20">
                <el-col
                  v-for="(item, index) in iconfont.glyphs"
                  v-show="index <= 11"
                  :key="item.icon_id"
                  :span="24"
                >
                  <i
                    v-svg-drag="{ callback: coordinate }"
                    @mousedown="moveSvg(item)"
                  >
                    <VabIconfont
                      :name="item.font_class"
                      :title="item.name"
                      type="svg"
                    />
                  </i>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item name="image" title="图标">
              <el-row :gutter="20">
                <el-col :span="24">
                  <vab-query-form>
                    <vab-query-form-top-panel>
                      <el-form
                        :inline="true"
                        label-width="0"
                        @submit.native.prevent
                      >
                        <el-form-item label="">
                          <el-input v-model="queryForm.title" size="mini">
                            <el-button
                              slot="append"
                              icon="el-icon-search"
                              native-type="submit"
                              type="primary"
                              @click="queryData"
                            />
                            <el-button
                              slot="prepend"
                              icon="el-icon-upload"
                              type="success"
                              @click="uploadCkick('img')"
                            />
                          </el-input>
                        </el-form-item>
                      </el-form>
                    </vab-query-form-top-panel>
                  </vab-query-form>
                </el-col>

                <el-col
                  v-for="(item, index) in queryIcon"
                  v-show="index <= 11"
                  :key="index"
                  :span="24"
                >
                  <i>
                    <el-image
                      :src="imgHost + item"
                      style="width: 100%; height: 40px; cursor: pointer"
                      @click.native="handleIcon(imgHost + item)"
                    />
                  </i>
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
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
  import createThing from '@/utils/konva/createThing'
  import { getMaterial } from '@/api/Material'
  import { mapMutations } from 'vuex'
  import { getSvgPath } from '@/utils/konva'
  import Thing from '@/views/topo/components/Thing'
  // import TopoThing from '@/views/topo/components/TopoThing'
  import Background from '@/views/topo/components/Background'
  import Evidence from '@/views/topo/components/TopoEvidence'

  const regUrl =
    /(\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
  // const { cdn } = require('../../../config')
  const cdn = process.env.CDN_URL
  const path = require('path')
  const imgHost = regUrl.test(cdn)
    ? `${cdn}/assets/images/dgiot_release/topo/`
    : path.join(
        __dirname,
        `${process.env.BASE_URL}/assets/images/dgiot_release/topo/`
      )
  // https://blog.csdn.net/u010007013/article/details/102674042
  // console.log(imgHost, process.env.BASE_URL, process.env)
  //   20210821112723
  //   https://at.alicdn.com/t/font_2759556_r8d9wroaw8.json
  // const iconfont = require('https://at.alicdn.com/t/font_2759556_r8d9wroaw8.json')
  const iconfont = require('./iconfont.json')
  export default {
    name: 'TopoTabs',
    components: {
      Thing,
      Background,
      Evidence,
    },
    data() {
      return {
        inputParams: {},
        upImgType: 'bg',
        tabPosition: 'left',
        iconfont,
        busData: {
          coordinate: {},
          paths: [],
        },
        accept: '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF',
        imgHost: imgHost,
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
        activeNames: 'icon',
      }
    },
    computed: {},
    created() {
      this.fetchData()
      // this.$dgiotBus.$off(location.hash)
      // this.$dgiotBus.$on(location.hash, (args) => {
      //   console.log(args, 'args')
      // })
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
      coordinate(e) {
        const _coordinate = {
          x: e.pageX,
          y: e.pageY,
        }
        this.busData.coordinate = _coordinate
      },

      moveSvg(item) {
        let el = getSvgPath(item, 'path')
        const paths = JSON.stringify(el.topo)
        console.info(`getSvgPath function return ${paths}`)
        this.busData.paths = paths
        this.$baseEventBus.$emit('busTopo', 'path', this.busData)
      },
      /**
       *
       * @param type
       */
      createdText(type) {
        //  调用vuex的新增文本控件
        const res = createThing({
          productid: 'productid',
          thingid: 'thingid',
        })
        console.log(res)
      },
      uploadCkick(type) {
        this.upImgType = type
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
        this.inputParams = {
          file: '',
          scene: 'app',
          path: 'product/topo/',
          filename: `${this.$route.query.productid}_bg`,
        }
      },
      files(file, type) {
        this.inputParams.filename = `${this.$route.query.productid}_bg`
        this.inputParams.file = file
      },
      ...mapMutations({
        setFlag: 'konva/setFlag',
        setDrawParams: 'konva/setDrawParams',
        createThing: 'topo/createThing',
        setKonvaBg: 'topo/setKonvaBg',
      }),
      // mousedown(item) {
      //   this.$emit('fatherMousedown', item)
      // },
      // mousemove(item) {
      //   this.$emit('fatherMousemove', item)
      //   // console.log(item)
      // },
      // mouseup(item) {
      //   this.$emit('fatherMouseup', item)
      // },

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
      async fileInfo(res) {
        console.log(res)
        if (this.upImgType === 'img') {
          await this.handleIcon(res.url)
        } else {
          //  直接设置背景图的地址
          localStorage.setItem('konvaBg', res.path)
          await this.setKonvaBg(res.path)
          console.error('set konva bg \n', Cookies.get('fileServer') + res.path)
          //  然后重新绘制一下 使用vuex topo
        }
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
<style>
  .ant-collapse-content-box {
    text-align: center;
  }
</style>
<style lang="scss" scope>
  .icon-selector-popper {
    height: calc(100vh - #{$base-top-bar-height} * 3.5);
    margin-left: 0px;
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
