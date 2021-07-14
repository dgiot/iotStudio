<template>
  <div class="verify">
    <!--     <el-row style="padding:10px 0" :gutter="20" type="flex" align="middle">
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/inspection/index' }">检测任务</el-breadcrumb-item>
          <el-breadcrumb-item>取证</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="6">
        <el-select v-model="childPageIndex" @change="pageSelect" placeholder="请选择">
          <el-option
            v-for="(item,index) in childPages"
            :key="index"
            :label="item.name"
            :value="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>-->

    <PerformanceCurve />

    <div class="pageSelect-box">
      <el-select
        v-model="childPageIndex"
        placeholder="选择"
        @change="pageSelect"
      >
        <el-option
          v-for="(item, index) in childPages"
          :key="index"
          :label="index + 1"
          :value="index"
        />
      </el-select>
    </div>

    <!-- type="flex"  -->
    <div :style="evidenceCSS" class="evidence-box">
      <el-row :gutter="20" class="info-box-item" type="flex" align="middle">
        <!-- 音频 -->
        <el-col :span="2">
          <i class="el-icon-microphone" />
        </el-col>

        <el-col :span="20">
          <div class="media-box-audio">
            <!--        <audio
              v-if="currentAudioUrl"
              :src="currentAudioUrl"
              controls="controls"
              autoplay="autoplay"
            ></audio>-->
            <div id="waveform" />
          </div>
        </el-col>

        <el-col :span="2">
          <div class="m-list">
            <el-button size="small" @click="showCurve">曲线</el-button>

            <el-select v-model="mediaIndex.audio" placeholder="请选择">
              <el-option
                v-for="(item, index) in categories.audio"
                :key="index"
                :label="index + 1"
                :value="index"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="info-box-item large" align="middle">
        <!-- 视频 -->
        <el-col :span="10">
          <div
            :style="mediaBoxCss"
            :class="{ isplay: currentVideoUrl }"
            class="media-box"
          >
            <video
              v-if="currentVideoUrl"
              :style="mediaBoxCss"
              :src="fileDomain + currentVideoUrl"
              controls="controls"
              type="video/mp4"
              autoplay="autoplay"
            />
            <p>&nbsp;</p>
          </div>
        </el-col>

        <el-col :span="2">
          <div class="m-list">
            <p>
              <i class="el-icon-back" />
              视频
              <i class="el-icon-film" />
            </p>
            <el-select v-model="mediaIndex.video" placeholder="请选择">
              <el-option
                v-for="(item, index) in categories.video"
                :key="index"
                :label="index + 1"
                :value="index"
              />
            </el-select>
          </div>

          <div class="m-list">
            <p style="text-align: right">
              <i class="el-icon-picture" />
              图片
              <i class="el-icon-right" />
            </p>
            <el-select v-model="mediaIndex.image" placeholder="请选择">
              <el-option
                v-for="(item, index) in categories.image"
                :key="index"
                :label="index + 1"
                :value="index"
              />
            </el-select>
          </div>
        </el-col>

        <!-- 图片和文件 -->
        <el-col :span="10">
          <!-- <el-col :span="18"> -->
          <div
            :style="mediaBoxCss"
            :class="{ isplay: currentImageUrl }"
            class="media-box"
          >
            <!-- style="width: 100%; height: 100%" -->
            <img
              v-if="currentImageUrl"
              :style="mediaBoxCss"
              :src="fileDomain + currentImageUrl"
            />
          </div>
          <!--        </el-col>
          <el-col :span="4">

          </el-col>-->
        </el-col>

        <!-- 文件 -->

        <el-col :span="2">
          <div class="content" />
          <div class="m-list">
            <p style="font-size: 32px; text-align: center">
              <el-tooltip
                class="item"
                effect="dark"
                content="点击查看文件"
                placement="top-start"
              >
                <el-button @click="pdfDialogVisible = true">
                  <!-- icon="el-icon-document"  {{mediaIndex.file + 1}} -->
                  <span style="font-size: 32px">
                    <i class="el-icon-document" />
                  </span>
                </el-button>
              </el-tooltip>
            </p>
            <el-select v-model="mediaIndex.file" placeholder="请选择">
              <el-option
                v-for="(item, index) in categories.file"
                :key="index"
                :label="index + 1"
                :value="index"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      :visible.sync="pdfDialogVisible"
      title="取证文件查看"
      width="60%"
    >
      <div class="pdf-box">
        <iframe
          v-if="currentFileUrl"
          :src="fileDomain + currentFileUrl"
          style="width: 100%; min-height: 500px"
          frameborder="0"
        />

        <p v-show="!currentFileUrl" style="font-size: 20px; text-align: center">
          当前没有选定文件
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pdfDialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="curveDialogVisible"
      :close-on-click-modal="false"
      title="性能曲线"
      width="70%"
    >
      <PerformanceCurveNew ref="PerformanceCurveNew" />

      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="curveDialogVisible = false"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  // smooth

  import { mapGetters, mapState } from 'vuex'

  import PerformanceCurve from '@/views/platform/testpumplist/PerformanceCurve'
  import PerformanceCurveNew from '@/views/platform/testpumplist/PerformanceCurveNew'

  export default {
    name: 'Verify',
    components: { PerformanceCurve, PerformanceCurveNew },
    data() {
      return {
        evidenceCSS: {},
        mediaBoxCss: {},
        currentPageId: '',
        childPages: [],
        childPageIndex: null,
        categories: {
          video: [],
          audio: [],
          image: [],
          file: [],
          // performanceCurve:[]
        },
        mediaIndex: {
          video: null,
          audio: null,
          image: null,
          file: null,
        },
        wavesurfer: null,
        pdfDialogVisible: false,
        pdfurl: '',
        curveDialogVisible: false,
      }
    },
    /*   watch: {
      currentAudioUrl(old,newval) {

            console.log('currentAudioUrl',currentAudioUrl);

      }
  }, */
    computed: {
      taskid: function () {
        return this.$route.query.taskid
      },
      fileDomain: function () {
        return this.$getUrlPrefix(this.$Cookies.get('fileserver'))
      },
      currentImageUrl: function () {
        var tempVal = ''

        if (this.categories.image.length > 0) {
          tempVal =
            this.categories.image[this.mediaIndex.image]['original']['data'][
              'src'
            ]
        }
        return tempVal
      },
      currentVideoUrl: function () {
        var tempVal = ''
        if (this.categories.video.length > 0) {
          tempVal =
            this.categories.video[this.mediaIndex.video]['original']['data'][
              'src'
            ]
        }
        return tempVal
      },
      currentAudioUrl: function () {
        var tempVal = ''

        if (this.categories.audio.length > 0) {
          tempVal =
            this.categories.audio[this.mediaIndex.audio]['original']['data'][
              'src'
            ]
        }

        return tempVal
      },
      currentFileUrl: function () {
        var tempVal = ''

        if (this.categories.file.length > 0) {
          tempVal =
            this.categories.file[this.mediaIndex.file]['original']['data'][
              'src'
            ]
        }
        return tempVal
      },
      currentChildPageData: function () {
        if (this.childPageIndex != null && this.childPageIndex >= 0) {
          return this.childPages[this.childPageIndex]
        } else {
          return null
        }
      },
      ...mapState({
        currentTask: (state) => state.deviceData.currentTask,
      }),
    },
    created() {
      // 页面创建时执行一次getHeight进行赋值，顺道绑定resize事件
      window.addEventListener('resize', this.getHeight)
      this.getHeight()
    },
    mounted() {
      this.$baseEventBus.$on('chartClick', this.chartClickHnadle)

      this.getChildDevice(this.taskid)

      this.wavesurfer = WaveSurfer.create({
        container: '#waveform',
        height: '128',
        mediaControls: true,
        cursorColor: '#409EFF',
        // waveColor: 'violet',
        // progressColor: 'purple'
      })
      this.wavesurfer.on('ready', () => {
        this.wavesurfer.play()
      })
    },
    beforeDestroy() {
      this.wavesurfer.empty()
      this.$baseEventBus.$off('chartClick', this.chartClickHnadle)
    },
    methods: {
      showCurve() {
        this.curveDialogVisible = true

        this.$nextTick(() => {
          this.$refs['PerformanceCurveNew'].initData()
        })
      },
      getHeight() {
        // 540 是  顶栏+ 底部栏 + 面包屑 + 曲线区域

        const tempHeight = window.innerHeight - 440

        this.evidenceCSS.height = Math.ceil(tempHeight) + 'px'

        this.mediaBoxCss.height = Math.ceil(tempHeight * 0.75) + 'px'
      },
      submitVerify() {
        console.log('submitVerify')
      },
      mediaSwitch(type, index) {
        /*       if (type && index >= 0) {
        this.mediaIndex[type] = index;

        if(type == 'audio' ){

          this.$nextTick(()=>{

            this.wavesurfer.load('https://wavesurfer-js.org/example/media/demo.wav');

          })

        }
      } else {
      } */
      },
      chartClickHnadle(data) {
        console.log('chartClic', data)

        this.resetOptionData(0)

        const startTimeStamp = data.timestamp - 100
        const endTimeStamp = data.timestamp + 100

        // this.currentChildPageData

        this.getEvidence(
          // this.currentChildPageData.objectId,
          this.currentPageId,
          startTimeStamp,
          endTimeStamp
        ).then((res) => {
          // 先清空数据
          this.categories = { video: [], audio: [], image: [], file: [] }

          const categoryArray = ['video', 'audio', 'image', 'file']

          if (res && res.results && res.results.length > 0) {
            const evidenceList = res.results

            console.log('evidenceList ###', evidenceList)

            // 遍历 注意 type与 datatype
            evidenceList.forEach((item) => {
              if (item['original'] && item['original'].datatype) {
                // let datatype = item["original"].datatype ? item["original"].datatype : item["original"].type
                const datatype = item['original'].datatype

                // 组态的查询条件里面,没有加 reportId
                // console.log('datatype ##',datatype);
                if (categoryArray.includes(datatype)) {
                  this.categories[datatype].push(item)
                }
              }
            })

            // 加载音频
            this.wavesurfer.load(this.fileDomain + this.currentAudioUrl)
          }
        })
      },
      pageSelect(val) {
        this.childPageIndex = val

        this.resetOptionData(null)

        this.categories = {
          video: [],
          audio: [],
          image: [],
          file: [],
          // performanceCurve:[]
        }

        this.currentPageId = this.currentChildPageData['objectId']

        this.$store.commit(
          'updateCurrentChildPageData',
          this.currentChildPageData
        )

        this.$baseEventBus.$emit('childPageChange', this.currentPageId)
      },
      resetOptionData(val) {
        // 重置数据
        this.mediaIndex = {
          video: val,
          audio: val,
          image: val,
          file: val,
        }

        this.wavesurfer.empty()
      },
      getEvidence(reportId, startTime, endTime) {
        const where = {}

        var taskTimestamp = this.$dateTostamp(this.currentTask.createdAt)

        // where["reportId"] = reportId;

        // where["original.type"] = { $regex: ".+" };
        // where["original.datatype"] =  {'$regex':'.+'} ;
        where['original.sourceType'] = 'iPad'

        /*     where["timestamp"] = {
        $gt: startTime,
        $lt: endTime
      };
 */
        return this.$axiosWen.get('/classes/Evidence', {
          params: {
            order: '-timestamp',
            limit: '500',
            where: JSON.stringify(where),
            keys: 'scene,original,timestamp,count(*)',
          },
        })
      },
      getChildDevice(taskid) {
        if (!taskid) {
          return
        }
        const where = {
          parentId: {
            __type: 'Pointer',
            className: 'Device',
            objectId: taskid,
          },
        }

        this.$axiosWen
          .get('/classes/Device/', {
            params: {
              keys: 'count(*)',
              where: JSON.stringify(where),
              order: 'createdAt', // -createdAt
              // order: "basedata.index"
            },
          })
          .then((response) => {
            if (response) {
              this.maxtotal = response.count
              this.childPages = response.results
            }
          })
          .catch((error) => {
            // this.$q.loading.hide();
            console.log('Device ##3 ', error)
          })
      },
    },
  }
</script>
<style lang="scss">
  .view-chart-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    // height: 380px;
    height: 280px;
    text-align: center;
  }
  .info-box-item {
    height: 25%;
    margin-top: 0.5%;
    background: #f2f6fc;
    .media-box {
      // position: relative;
      width: 100%;
      /*    display: flex;
    justify-content: center;
    align-items: center; */
      overflow: hidden;
      // background: #000;
      text-align: center;
    }
    .m-list {
      display: block;
      width: 100%;
      padding-top: 30px;
    }
    .el-button + .el-button {
      margin-left: 0;
    }
  }
  .info-box-item.large {
    height: 73%;
    overflow: hidden;
  }
  .media-box.isplay {
    background: #000;
  }
  .media-box video {
    width: auto;
    //  object-fit:fill;
  }
  .media-box img {
    // position: relative;
    width: auto;
    //  object-fit:fill;
  }
  #waveform {
    width: 95%;
    margin: 0 auto;
  }
  .pageSelect-box {
    position: fixed;
    top: 150px;
    right: 40px;
    z-index: 10000;
    max-width: 80px;
  }
</style>
