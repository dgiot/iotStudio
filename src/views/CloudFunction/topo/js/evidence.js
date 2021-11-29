import { mapActions, mapGetters } from 'vuex'
import { getDevice, putDevice, postDevice, queryDevice } from '@/api/Device'
import { getEvidence, queryEvidence, postEvidence } from '@/api/Evidence'
import { queryView } from '@/api/View'
import { uppyUpload } from '@/api/Upload'
const VueAliplayerV2 = window['vue-aliplayer-v2'].default
export default {
  name: 'Index',
  components: { VueAliplayerV2 },
  data() {
    return {
      typs: {
        video: ['video', 'personal_video'],
        audio: ['audio', 'volume_up'],
        image: ['image'],
        file: ['file', 'archive'],
      },
      evidences: [],
      timer: new Date(),
      evidenceid: '',
      ukey: '',
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
        this.$route.query.suite && this.$route.query.suite > 0
          ? this.$route.query.suite
          : 0,
      evidence: [],
      evidenceList: [],
      evidenceDialog: false,
      task: {
        name: '',
      },
      taskList: [],
      taskFlag: false,
      asideShow: true,
      loading: false,
    }
  },
  computed: {
    scrollerHeight: function () {
      return 260 + 'px'
    },
    ...mapGetters({
      role: 'acl/role',
    }),
  },
  created() {
    this.setTreeFlag(false)
    if (this.$route.query.suite == 1) this.$route.query.suite = 0
  },
  mounted() {
    this.$dgiotBus.$off(
      this.$dgiotBus.topicKey('dgiot_evidence', 'dgiotEvidence')
    )
    this.$baseEventBus.$on(
      this.$dgiotBus.topicKey('dgiot_evidence', 'dgiotEvidence'),
      (msg) => {
        /**
         * @description 防抖
         */
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.dgiotEvidence(msg)
        }, 500)
      }
    )
    this.fetchData()
    if (this.taskid) {
      this.queryTask(this.taskid)
      this.queryEvidence(this.taskid)
    }
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {},
  methods: {
    ...mapActions({
      deleteTopo: 'topo/deleteTopo',
      initKonva: 'topo/initKonva',
      setTreeFlag: 'settings/setTreeFlag',
      createdEvidence: 'topo/createdEvidence',
    }),
    async paginationQuery(queryPayload) {
      this.queryPayload = queryPayload
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
      )
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
        console.error('Evidence', Evidence)
        var formData = new FormData()
        for (let key in Evidence) {
          formData.append(key, Evidence[key])
        }
        console.error(formData, 'formData')
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
    /**
     * @Author: h7ml
     * @Date: 2021-11-26 16:01:56
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async depositEvidence(params) {
      console.error(params)
      try {
        const loading = this.$baseColorfullLoading()
        const Evidence = {
          objetcId: this.evidenceid,
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
        const res = await postEvidence(this.taskid, Evidence)
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
      console.error()
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
        console.error(results, 'getUkey')
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
     * @Date: 2021-11-26 16:55:01
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async queryevidences() {
      try {
        const loading = this.$baseColorfullLoading()
        const _params = {
          order: '-createdAt',
          skip: 0,
          where: {
            reportId: this.taskid,
            'original.controlid': this.evidenceList.node.attrs.id,
          },
        }
        const { results = [] } = await queryEvidence(_params)
        console.error(results)
        this.evidences = results
        console.log(results)
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
     * @Date: 2021-11-26 14:21:24
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async dgiotEvidence(params) {
      try {
        const loading = this.$baseColorfullLoading()
        this.evidenceList = params
        this.queryevidences()
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
     * @Date: 2021-11-25 20:44:31
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async fetchData() {
      try {
        const loading = this.$baseColorfullLoading()
        this.queryPayload.include = 'product,parentId'
        this.queryPayload.where = {
          'profile.identifier': 'inspectionReportTemp',
        }
        const { count = 0, results = [] } = await queryDevice(this.queryPayload)
        this.$refs['pagination'].ination.total = count
        this.taskList = results
        // this.$baseMessage(
        //   this.$translateTitle('alert.Data request successfully'),
        //   'success',
        //   'vab-hey-message-success'
        // )
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
          order: 'createdAt',
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
     * @Date: 2021-11-26 19:06:10
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description:
     */
    async finishEvidence(params) {
      try {
        const loading = this.$baseColorfullLoading()
        const finish = {
          profile: _.merge(params.profile, {
            step: 2,
          }),
        }
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
          this.task = task
          if (task?.parentId?.objectId)
            await this.getUkey(task.parentId.objectId)
        } else this.task = { name: '111' }
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
      const query = JSON.parse(JSON.stringify(this.$route.query))
      query.suite = index
      this.$router.push({ path: this.$route.path, query })
      this.loading = true
      this.evidence.forEach((el) => {
        el.type = 'info'
      })
      item.type = 'success'
      console.log(item)
      const { konva } = item.data
      await this.initKonva({
        data: konva.Stage,
        id: 'konva',
      })
      setTimeout(() => {
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
            fill: 'grey',
            productid: this.$route.query.taskid,
          })
        )
        this.deleteTopo(window.deletePath)
      }, 1000)
    },
  }, //如果页面有keep-alive缓存功能，这个函数会触发
}
