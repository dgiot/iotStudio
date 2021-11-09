<template>
  <div class="RoleTree">
    <div class="infinite-list-wrapper infinite">
      <!--       <ul class="factory-list">
        <transition-group name="fade" mode="out-in">
          <li
            v-for="(item, index) in factorySearch"
            :key="item.objectId"
            :data-title="item.objectId  + currentFactoryId"
            :class="{ selected: item.objectId == currentFactoryId}"
            @click="switchItem(item, index)"
          >
            {{ item.depname }}
          </li>
        </transition-group>
      </ul>-->
      <!-- 指定节点标签为节点对象的某个属性值  -->
      <el-tree
        ref="tree"
        :data="deptTreeData"
        default-expand-all
        :expand-on-click-node="false"
        highlight-current
        node-key="id"
        :props="elTreedefaultProps"
      >
        <div
          slot-scope="{ node, data }"
          class="custom-tree-node"
          title="L1"
        >
          <!-- :class="{ selected: data.objectId == currentFactoryId }" -->
          <div
            class="factory-item"
            title="L2"
            @click="handleNodeClick(data, node)"
          >
            {{ data.name }}
          </div>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getToken } from '@/api/Menu'
  export default {
    name: 'RoleTree',
    components: {},
    filters: {},
    data() {
      return {
        inputVal: '',
        factoryName: '',
        currentCompanyIndex: -1,
        treeList: [],
        elTreedefaultProps: {
          children: 'children',
          label: 'name',
        },
        deptTreeData: [],
      }
    },
    computed: {
      ...mapGetters({
        roleTree: 'user/roleTree',
      }),
    },
    watch: {
      inputVal(val) {
        this.$refs.tree.filter(val)
      },
    },
    mounted() {
      this.getRoletree()

      this.$baseEventBus.$on('addCustomerEvent', () => {
        console.log('addCustomerEvent ###')
        this.getRoletree()
      })
    },
    methods: {
      addItemUser(item) {
        console.log(item)
      },
      handleNodeClick(data, node) {
        console.log('data ##', data)
        console.log('node ##', node)

        /*       this.$store.commit('SET_searchFactory', data)
      this.$store.commit('SET_factoryLevel', data.level - 1)
      this.switchCompany(data) */

        const parent = this.$refs.tree.getNode(node.parent)
        /*      if (parent.id == 0 || parent.id == 1) {
        const parent0 = this.$refs.tree.getNode(node)
        this.factoryName = parent0.data.depname
      } else {
        this.factoryName = parent.data.depname

      }
      this.$store.commit('SET_factoryName', this.factoryName) */
      },
      async getFatherToken(name) {
        const { access_token = '' } = await getToken(name)
      },
      switchCompany(item) {
        this.$axiosWen
          .get('/token?name=' + item.name)
          .then((res) => {
            if (res) {
              this.$store.commit('set_userdata_req', {
                type: 'currentFactoryData',
                datas: {
                  // access_token_father_factory: access_token_father_factory,
                  access_token_factory: res.access_token,
                  desc: res.desc,
                  name: item.name,
                  objectId: item.objectId,
                },
              })

              this.$baseEventBus.$emit('switchCompany')

              this.$store.commit('SET_FactoryId', item.objectId)
            }
          })
          .catch((err) => {
            console.log('err ###', err)
          })
      },
      getRoletree() {
        this.deptTreeData = this.roleTree
        this.getFatherToken(this.deptTreeData[0].name)
      },
      formatList(responseArr) {
        const tempArr = []
        responseArr.forEach((item) => {
          if (item.org_type !== 'liou_device') {
            let obj = {
              name: item.name,
              objectId: item.objectId,
              order: item.order,
              org_type: item.org_type,
              parent: item.parent,
              depname: item.name,
            }
            if (item.children) {
              obj.children = this.formatList(item.children)
            }
            tempArr.push(obj)
          }
        })
        return tempArr
      },
      addList() {
        this.$router.push({ name: 'addcUstomer' })
      },
    },
  }
</script>

<style lang="scss" scoped>
  div.RoleTree {
    padding: 15px 10px;

    // border: 1px solid #ccc;
    ul.factory-list {
      padding: 0;
      margin: 0;
      list-style: none;

      li {
        height: 40px;
        padding: 10px 0 10px 10px;
        margin: 5px 0;
        color: #555;
        cursor: pointer;
        border-radius: 3px;
        transition: all 0.5s;
      }
      li.selected {
        color: #fff;
        // background: #ccc;
        background: #409eff;
      }
      li:hover {
        background: #ccc;
      }
    }

    .custom-tree-node {
      width: 100%;
    }
    .factory-item {
      float: left;
    }
    .factory-item.selected {
      font-weight: bold;
      color: #409eff;
    }
  }
</style>
<style lang="scss">
  div.factoryList {
    .el-tree-node__content {
      margin: 3px 0;
    }
  }
</style>
