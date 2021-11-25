import { mapActions, mapGetters } from 'vuex'
import { queryView } from '@/api/View'
import { getDevice, delDevice, postDevice } from '@/api/Device'
export default {
  name: 'Index',
  components: {},
  data() {
    return {
      productid: this.$route.query.productid || '',
      tsakid: this.$route.query.tsakid || '',
      evidence: [],
      task: {
        name: '',
      },
      asideShow: true,
      loading: false,
    }
  },
  computed: {},
  created() {
    this.setTreeFlag(false)
  },
  mounted() {
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
        this.evidence = results
        if (results.length) this.activeBtn(results[0])
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
    async activeBtn(item) {
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
      }, 1000)
    },
  }, //如果页面有keep-alive缓存功能，这个函数会触发
}
