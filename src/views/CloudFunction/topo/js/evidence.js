import { mapActions, mapGetters } from 'vuex'
import { queryView } from '@/api/View'
import { getDevice, delDevice, postDevice, queryDevice } from '@/api/Device'
export default {
  name: 'Index',
  components: {},
  data() {
    return {
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
      productid: this.$route.query.productid || '',
      tsakid: this.$route.query.tsakid || '',
      suite:
        this.$route.query.suite && this.$route.query.suite > 0
          ? this.$route.query.suite - 1
          : 0,
      evidence: [],
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
      return $('.evidence_container_aside').height() - 60 + 'px'
    },
    ...mapGetters({
      role: 'acl/role',
    }),
  },
  created() {
    this.setTreeFlag(false)
  },
  mounted() {
    this.fetchData()
    if (this.productid) this.queryEvidence(this.productid)
    if (this.tsakid) this.queryTask(this.tsakid)
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
      initKonva: 'topo/initKonva',
      setTreeFlag: 'settings/setTreeFlag',
    }),
    async paginationQuery(queryPayload) {
      this.queryPayload = queryPayload
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
    async queryEvidence(productid) {
      try {
        const loading = this.$baseColorfullLoading()
        const params = {
          where: { type: 'topo', class: 'Product', key: productid },
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
     * @Date: 2021-11-25 16:13:43
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description: queryTask
     */
    async queryTask(taskid) {
      try {
        const task = await getDevice(taskid)
        this.task = task
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
        window.location.href
      }, 1000)
    },
  }, //如果页面有keep-alive缓存功能，这个函数会触发
}
