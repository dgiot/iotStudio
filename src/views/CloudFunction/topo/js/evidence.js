import { mapActions, mapGetters } from 'vuex'
import { getDevice, putDevice, postDevice, queryDevice } from '@/api/Device'
import {
  getEvidence,
  queryEvidence,
  postEvidence,
  putEvidence,
  delEvidence,
  generatereport,
} from '@/api/Evidence'
import { queryView } from '@/api/View'
import { uppyUpload } from '@/api/Upload'
import canvas from '@/utils/konva/core/canvas'
import { queryProduct } from '@/api/Product'
import { queryMenu, Roletree } from '@/api/Menu'
import { Permission } from '@/api/Permission'
const VueAliplayerV2 = window['vue-aliplayer-v2'].default
export default {
  name: 'Index',
  components: { 'vue-aliplayer-v2': VueAliplayerV2 },
  data() {
    return {
      badgePath: canvas.info.Path ?? [],
      options: {
        autoplay: false,
        width: '220px',
        height: '180px',
        margin: '0 auto',
      },
      badge: {
        Unreviewed: [],
        Approved: [],
        notapproved: [],
      },
      taskType: 'review',
      nowItem: {},
      types: {
        video: ['video', 'videocam_black'],
        audio: ['audio', 'volume_mute'],
        image: ['image', 'image'],
        file: ['file', 'archive'],
      },
      evidences: [],
      timer: new Date(),
      evidenceid: '',
      ukey: '',
      auditDialog: false,
      auditList: [],
      timeout: null,
      queryPayload: {
        excludeKeys: 'data,basedata,content',
        include: '',
        order: '-createdAt',
        limit: 10,
        skip: 0,
        count: 'objectId',
      },
      paginations: {
        layout: 'total, sizes',
      },
      taskid: this.$route.query.taskid || '',
      suite:
        this.$route.query.suite && this.$route.query.suite >= 0
          ? this.$route.query.suite
          : 0,
      evidence: [],
      evidenceList: [],
      evidenceDialog: false,
      task: {
        name: '',
        profile: { message: '' },
      },
      asideShow: true,
      loading: false,
    }
  },
  computed: {
    scrollerHeight: function () {
      return 280 + 'px'
    },
    ...mapGetters({
      role: 'acl/role',
    }),
  },
  created() {
    this.setTreeFlag(false)
  },
  mounted() {
    this.$baseEventBus.$off(
      this.$dgiotBus.topicKey('dgiot_evidence', 'dgiotEvidence')
    )
    this.$baseEventBus.$on(
      this.$dgiotBus.topicKey('dgiot_evidence', 'dgiotEvidence'),
      (msg) => {
        this.evidenceList = msg
        this.queryevidences()
      }
    )
    if (this.taskid) {
      this.queryTask(this.taskid)
      this.queryEvidence(this.taskid)
      this.auditQuery(0, 'init')
    }
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {},
  watch: {
    badgePath: {
      handler(badge) {
        if (badge && badge.length) this.getNumberEvidence(badge)
      },
    },
  },
  methods: {
    ...mapActions({
      deleteTopo: 'topo/deleteTopo',
      initKonva: 'topo/initKonva',
      setTreeFlag: 'settings/setTreeFlag',
      createdEvidence: 'topo/createdEvidence',
    }),
    /**
     * @Author:
     * @Date: 2021-12-23 11:51:33
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description: 删除创建的text 图元
     */
    async clearbadgePath(params) {
      console.error(params, 'clearbadgePath')
      try {
        await canvas.layer.find('Text').forEach((Text) => {
          console.log(Text)
          Text.remove()
          Text.destroy()
          canvas.layer.batchDraw()
          canvas.stage.batchDraw()
        })
        // const res = await getProduct(params.objectId)
        // console.log(res)
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    /**
     * @Author: dext7r
     * @Date: 2021-12-22 15:53:39
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async getNumberEvidence(params) {
      canvas.info.badge = []
      /**
       * @description 图元数据 请求数据
       * @type {{path: *[], batch: *[]}}
       */
      let evidence = { path: [], batch: [] }
      params.forEach((item) => {
        evidence.batch.push({
          body: {
            order: '-createdAt',
            skip: 0,
            count: 'objectId',
            where: {
              reportId: this.nowItem.objectId,
              'original.controlid': item.attrs.id,
            },
          },
          method: 'GET',
          evidence: item.attrs.icon,
          path: `/classes/Evidence`,
        })
        evidence.path.push(item)
      })
      try {
        const batchNum = await this.$shuwa_batch({
          requests: evidence.batch,
        })
        evidence.path.forEach((i, index) => {
          const simpleText = new Konva.Text({
            id: `${evidence.path[index].attrs.x}_text`,
            x: evidence.path[index].attrs.x,
            y:
              evidence.path[index].attrs.icon === 'volume_mute'
                ? evidence.path[index].attrs.y
                : evidence.path[index].attrs.y - 13,
            text: batchNum[index].success.count ?? 0,
            fontSize: 24,
            fontFamily: 'Calibri',
            fill: 'orange',
          })
          canvas.info.badge.push(simpleText)
          canvas.layer.add(simpleText)
        })
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    async paginationQuery(queryPayload) {
      this.queryPayload = queryPayload
    },
    /**
     * @Author: dext7r
     * @Date: 2021-12-20 11:22:30
     * @LastEditors: dext7r
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    clouseDraw() {
      try {
        this.evidenceDialog = false
        this.auditDialog = false
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    /**
     * @Author: dext7r
     * @Date: 2021-12-16 21:13:11
     * @LastEditors: dext7r
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async saveEvidences(objectId, index, row) {
      console.log(objectId, index, row)
      try {
        const loading = this.$baseColorfullLoading()
        const params = {
          original: row.original,
        }
        const res = await putEvidence(objectId, params)
        console.log(res)
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'vab-hey-message-success'
        )
        loading.close()
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-29 21:22:54
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async deleteFile(objectId, index, evidences) {
      evidences.splice(index, 1)
      try {
        const loading = this.$baseColorfullLoading()
        const res = await delEvidence(objectId)
        this.getNumberEvidence(this.badgePath)
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'vab-hey-message-success'
        )
        loading.close()
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-29 21:10:50
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async changeItem(row) {
      try {
        const loading = this.$baseColorfullLoading()
        const params = {
          original: _.merge(row.original, {
            status: row.original.status,
            message: row.original.message,
          }),
        }
        const res = await putEvidence(row.objectId, params)
        console.log(res)
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'vab-hey-message-success'
        )
        loading.close()
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-26 15:14:34
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async doUpload(event, type) {
      this.timer = new Date()
      this.evidenceid = md5(
        'Evidence' + this.ukey + Math.round(this.timer) + ''
      ).substring(0, 10)
      const file = event.target.files[0]
      const fileType = file.name.substring(file.name.lastIndexOf('.'))
      try {
        const Evidence = {
          auth_token: Cookies.get('dgiot_auth_token'),
          scene: 'evidence',
          code: '',
          path: `dgiot_file/evidence/${type}`,
          output: 'json',
          submit: 'upload',
          file: file,
          filename: `${this.evidenceid}${fileType}`,
        }
        console.warn('Evidence', Evidence)
        var formData = new FormData()
        for (let key in Evidence) {
          formData.append(key, Evidence[key])
        }
        const { NODE_ENV = 'development' } = process.env
        const url =
          NODE_ENV == 'development'
            ? `${process.env.VUE_APP_URL}/upload`
            : 'upload'
        const { data } = await uppyUpload(url, formData)
        if (data?.md5) {
          this.depositEvidence(data)
        }
        const loading = this.$baseColorfullLoading()
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'vab-hey-message-success'
        )
        loading.close()
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    utc2beijing(utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
      return date // 2017-03-31 16:02:06
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-26 16:01:56
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async depositEvidence(params) {
      try {
        const loading = this.$baseColorfullLoading()
        const Evidence = {
          objectId: this.evidenceid,
          ukey: this.ukey,
          timestamp: Math.round(this.timer),
          md5: params.md5,
          original: {
            taskid: this.taskid,
            controlid: this.evidenceList.node.attrs.id,
            path: params.path,
            type: this.evidenceList.node.attrs.type,
          },
        }
        loading.close()
        const res = await postEvidence(this.nowItem.objectId, Evidence)
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'vab-hey-message-success'
        )
        this.getNumberEvidence(this.badgePath)
        loading.close()
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
      this.queryevidences()
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-26 14:40:55
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async getUkey(parentId) {
      this.ukey = ''
      try {
        const params = {
          limit: 1,
          order: '-createdAt',
          skip: 0,
          keys: 'devaddr',
          where: {
            parentId: parentId,
            product: '3f95880e09',
          },
        }
        const loading = this.$baseColorfullLoading()
        const { results = [] } = await queryDevice(params)
        if (results?.[0]?.devaddr) {
          this.ukey = results[0].devaddr
          console.info('-----------------this.ukey', this.ukey)
        } else {
          this.$message.error(
            this.$translateTitle(
              'cloudTest.There is no uKey for this product, please contact the administrator'
            )
          )
        }
        loading.close()
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-30 21:54:24
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async evidenceClick(params) {
      this.evidences = []
      try {
        const loading = this.$baseColorfullLoading()
        if (params?.length)
          params.forEach((item) => {
            item.original.path =
              '/dgiot_file' + item.original.path.split('/dgiot_file')[1]
          })
        this.evidences = params
        this.evidenceDialog = true
        loading.close()
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-26 16:55:01
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async queryevidences() {
      this.evidences = []
      try {
        // /**
        //  * @description 防抖
        //  */
        // if (this.timeout) {
        //   clearTimeout(this.timeout)
        // }
        // this.timeout = setTimeout(() => {
        //   this.queryevidences()
        // }, 500)
        const loading = this.$baseColorfullLoading()
        const _params = {
          order: '-createdAt',
          skip: 0,
          where: {
            reportId: this.nowItem.objectId,
            'original.controlid': this.evidenceList.node.attrs.id,
          },
        }
        const { results = [] } = await queryEvidence(_params)
        if (results?.length)
          results.forEach((item) => {
            _.filter(item, function (item) {
              item.original.path =
                '/dgiot_file' + item.original.path.split('/dgiot_file')[1]
              return item.original.type !== 'avgs'
            })
          })

        this.evidences = results
        this.evidenceDialog = true
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'vab-hey-message-success'
        )
        loading.close()
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-25 21:22:14
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async headerTask(item, index) {
      try {
        const loading = this.$baseColorfullLoading()
        console.log(item, index)
        const query = JSON.parse(JSON.stringify(this.$route.query))
        query.taskid = item.objectId
        query.suite = 1
        query.state = 'preview'
        query.message = item?.profile?.message ?? ''
        query.back = item?.profile?.step ?? ''
        query.step = item.profile.step == -1 ? 1 : item.profile.step
        this.$router.push({ path: this.$route.path, query })
        loading.close()
        this.queryTask(query.taskid)
        this.queryEvidence(query.taskid)
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-30 20:18:51
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async auditQuery(num, type) {
      this.taskType = type
      this.badge = {
        Unreviewed: [],
        Approved: [],
        notapproved: [],
      }
      try {
        const params = {
          order: '-createdAt',
          skip: 0,
          where: {
            'original.taskid': this.taskid,
          },
        }
        const loading = this.$baseColorfullLoading()
        if (num == 1) this.auditDialog = true
        const { results } = await queryEvidence(params)
        this.auditList = _.filter(results, function (item) {
          return item.original.type !== 'avgs'
          if (item.original.status == '未审核') this.badge.Unreviewed.push(item)
          else if (item.original.status == '通过审核')
            this.badge.Approved.push(item)
          else this.badge.notapproved.push(item)
        })
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'vab-hey-message-success'
        )
        loading.close()
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-25 14:55:17
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description: 查询取证列表
     */
    async queryEvidence(taskid) {
      try {
        const loading = this.$baseColorfullLoading()
        const params = {
          order: 'title',
          skip: 0,
          where: {
            type: 'topo',
            class: 'Device',
            key: taskid,
          },
        }
        const { results = [] } = await queryView(params)
        results.forEach((i) => {
          i.type = 'info'
        })
        this.evidence = results
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'vab-hey-message-success'
        )
        loading.close()
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
      if (this.evidence?.length) {
        if (this.suite < this.evidence.length) {
          this.activeBtn(this.evidence[this.suite], this.suite)
        } else {
          this.suite = 0
          this.activeBtn(this.evidence[this.suite], this.suite)
        }
      }
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-30 19:28:06
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async notapproved(params, step) {
      try {
        const loading = this.$baseColorfullLoading()
        const finish = {
          profile: _.merge(params.profile, {
            message: params.profile.message,
            step: step,
            endtime: moment(new Date()).format('x'),
          }),
        }
        const res = await putDevice(params.objectId, finish)
        this.auditDialog = false
        this.$router.push({
          path: '/cloudTest/review',
        })
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'vab-hey-message-success'
        )
        loading.close()
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-26 19:06:10
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async finishEvidence(params, step) {
      this.$baseConfirm(
        this.$translateTitle(
          'cloudTest.Please confirm that all review items have been completed'
        ),
        null,
        async () => {
          try {
            const loading = this.$baseColorfullLoading()
            const finish = {
              profile: _.merge(params.profile, {
                step: step,
              }),
            }
            await generatereport(params.objectId)
            const res = await putDevice(params.objectId, finish)
            this.$router.push({
              path: '/cloudTest/Task',
            })
            loading.close()
          } catch (error) {
            console.log(error)
            this.$baseMessage(
              this.$translateTitle('alert.Data request error') + `${error}`,
              'error',
              'vab-hey-message-error'
            )
          }
        }
      )
    },
    /**
     * @Author: h7ml
     * @Date: 2021-11-25 16:13:43
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description: queryTask
     */
    async queryTask(taskid) {
      try {
        const task = await getDevice(taskid)
        if (task) {
          this.task = _.merge({ profile: { message: '' } }, task)
          if (task?.parentId?.objectId)
            await this.getUkey(task.parentId.objectId)
        } else this.task = { name: '111', profile: { message: '' } }
      } catch (error) {
        console.log(error)
        this.$baseMessage(
          this.$translateTitle('alert.Data request error') + `${error}`,
          'error',
          'vab-hey-message-error'
        )
      }
    },
    async activeBtn(item, index) {
      if (!_.isEmpty(canvas.info.badge))
        await this.clearbadgePath(canvas.info.badge)
      this.nowItem = item
      const query = JSON.parse(JSON.stringify(this.$route.query))
      query.suite = index
      this.$router.push({ path: this.$route.path, query })
      this.loading = true
      this.evidence.forEach((el) => {
        el.type = 'info'
      })
      item.type = 'success'
      const { konva } = item.data
      await this.initKonva({
        data: konva.Stage,
        id: 'konva',
      })
      setTimeout(() => {
        this.badgePath = []
        canvas.info.Path = []
        this.loading = false
        const icon = {
          icon: 'timeline',
          type: 'delete',
          path: 'M23,8c0,1.1-0.9,2-2,2c-0.18,0-0.35-0.02-0.51-0.07l-3.56,3.55C16.98,13.64,17,13.82,17,14c0,1.1-0.9,2-2,2s-2-0.9-2-2 c0-0.18,0.02-0.36,0.07-0.52l-2.55-2.55C10.36,10.98,10.18,11,10,11s-0.36-0.02-0.52-0.07l-4.55,4.56C4.98,15.65,5,15.82,5,16 c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2c0.18,0,0.35,0.02,0.51,0.07l4.56-4.55C8.02,9.36,8,9.18,8,9c0-1.1,0.9-2,2-2s2,0.9,2,2 c0,0.18-0.02,0.36-0.07,0.52l2.55,2.55C14.64,12.02,14.82,12,15,12s0.36,0.02,0.52,0.07l3.55-3.56C19.02,8.35,19,8.18,19,8 c0-1.1,0.9-2,2-2S23,6.9,23,8z',
        }
        this.createdEvidence(
          _.merge(icon, {
            index: 7,
            // 灰色表示取证阶段，黄色表示审核阶段，绿色标识审核通过，红色标识审核不过
            fill: 'orange',
            productid: this.$route.query.taskid,
          })
        )
        this.deleteTopo(window.deletePath)
      }, 1000)
      this.badgePath =
        _.filter(canvas.info.Path, function (item) {
          return item.attrs.icon !== 'timeline'
        }) ?? []
      canvas.info.badge = []
    },
  }, //如果页面有keep-alive缓存功能，这个函数会触发
}
