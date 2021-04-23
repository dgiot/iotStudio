<template>
  <div
    class="resource1"
    style="padding-left: 10px; border-left: 38px solid #1579bf"
  >
    <div>
      <el-input v-model="search" style="width: 150px" />
      <el-button type="primary" size="mini">搜索</el-button>
      <el-button type="primary" size="mini" @click="reset">重置</el-button>
      <el-tree
        ref="tree"
        :props="defaultProps"
        :expand-on-click-node="false"
        :highlight-current="true"
        :load="getOrgList"
        lazy
        node-key="objectId"
        style="margin-top: 20px"
        @node-click="handleNodeClick"
      >
        <span slot-scope="{ n, d }">
          <!-- <img :src='imgsrc' style="width:20px;height:20px;" v-if="data.icon=='集中器'"> -->
          <svg-icon
            v-if="d.icon == '质检中心'"
            icon-class="质检中心"
            style="width: 20px; height: 20px"
          />
          <svg-icon
            v-else-if="d.icon == '泵单位'"
            icon-class="水泵企业"
            style="width: 20px; height: 20px"
          />
          <svg-icon
            v-else-if="d.icon == '实验室'"
            icon-class="实验室"
            style="width: 20px; height: 20px"
          />
          <!-- <img :src='imgsrc4' style="width:20px;height:20px;" v-else-if="data.icon=='线路'">
              <img :src='imgsrc5' style="width:20px;height:20px;" v-else-if="data.icon=='电表'"> -->
          <span style="padding-left: 4px">{{ n.label }}</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
  // import Parse from 'parse'
  import { regionData } from 'element-china-area-data'
  export default {
    name: 'Pumpdepartment',
    props: {
      regiondata: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        search: '',
        defaultProps: {
          isLeaf: 'leaf',
          children: 'children',
          label: 'name',
        },
        data: [],
        node: [],
        treeData1: [],

        data1: [],
        resolve: [],
      }
    },
    computed: {
      treeData() {
        const cloneData = JSON.parse(JSON.stringify(this.data1)) // 对源数据深度克隆
        return cloneData.filter((father) => {
          const branchArr = cloneData.filter(
            (child) => father.objectId == child.ParentId
          ) // 返回每一项的子级数组
          branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
          return father.ParentId == 0 // 返回第一层
        })
      },
    },
    watch: {},
    mounted() {
      console.log(this.data1)
    },
    methods: {
      // 得到所有父节点
      reset() {
        this.search = ''
      },
      handleNodeClick(row) {
        this.$emit('pumpDetail', row)
      },
      getOrgList(node, resolve) {
        if (node.level === 0) {
          this.data = []
          var Department = Parse.Object.extend('PumpDepartment')
          var department = new Parse.Query(Department)
          department.equalTo('ParentId', '0')
          department.find().then(
            (resultes) => {
              resultes.map((items) => {
                var obj = {}
                items.createtime = new Date(
                  items.attributes.createdAt
                ).toLocaleDateString()
                ;(obj.name = items.attributes.name),
                  (obj.ParentId = items.attributes.ParentId)
                obj.objectId = items.id
                obj.level = items.attributes.level
                obj.createtime = items.createtime
                obj.leaf = items.attributes.leafnode
                obj.icon = items.attributes.org_type
                obj.isvcon = false
                this.data.push(obj)
                this.data1.push(obj)
              })
              return resolve(this.data)
            },
            (error) => {
              resolve([])
              if (error.code == '209') {
                this.$message({
                  type: 'warning',
                  message: '登陆权限过期，请重新登录',
                })
                this.$router.push({
                  path: '/login',
                })
              } else if (error.code == 119) {
                this.$message({
                  type: 'error',
                  message: '没有操作权限',
                })
              }
            }
          )
        } else if (
          node.level !== 0 &&
          node.data.icon !== '实验台' &&
          node.data.isvcon == false
        ) {
          this.data = []
          var Department = Parse.Object.extend('PumpDepartment')
          var department = new Parse.Query(Department)
          department.equalTo('ParentId', node.data.objectId)
          department.ascending('org_type')
          department.limit(10000)
          department.find().then(
            (resultes) => {
              resultes.map((items) => {
                var obj = {}
                items.createtime = new Date(
                  items.attributes.createdAt
                ).toLocaleDateString()
                obj.name = items.attributes.name
                obj.ParentId = items.attributes.ParentId
                obj.objectId = items.id
                obj.level = items.attributes.level
                obj.createtime = items.createtime
                if (items.attributes.leafnode == true) {
                  obj.isvcon = true
                  // obj.leaf = false;
                } else {
                  obj.isvcon = false
                  // obj.leaf =true;
                }
                obj.leaf = items.attributes.leafnode
                obj.icon = items.attributes.org_type
                this.data.push(obj)
                this.data1.push(obj)
              })
              return resolve(this.data)
            },
            (error) => {
              resolve([])
              if (error.code == '209') {
                this.$message({
                  type: 'warning',
                  message: '登陆权限过期，请重新登录',
                })
                this.$router.push({
                  path: '/login',
                })
              } else if (error.code == 119) {
                this.$message({
                  type: 'error',
                  message: '没有操作权限',
                })
              }
            }
          )
        }
        // else if(node.level !== 0&&node.data.icon=='实验台'&&node.data.isvcon==true){
        //   this.data=[]
        //   var Vcon = Parse.Object.extend('testbed')
        //   var vcon = new Parse.Query(Vcon)
        //  var Department = Parse.Object.extend("Department");
        //     var department = new Department();
        //     department.id = node.data.objectId
        //   var devobjectId = [];
        //     devobjectId.push(node.data.objectId);
        //     vcon.equalTo("organization", department)
        //     vcon.limit(10000)
        //     vcon.find().then(resultes=>{
        //       resultes.map(items=>{
        //         var obj={}
        //           items.createtime = new Date(
        //             items.attributes.createdAt
        //           ).toLocaleDateString();
        //           obj.objectId = items.id;
        //           obj.createtime = items.createtime;
        //           obj.level = items.attributes.level;
        //           obj.alias = items.attributes.vcaddr;
        //           obj.leaf = true;
        //           obj.icon = '集中器';
        //           obj.isvcon=true
        //           obj.name = items.attributes.vcaddr
        //           this.data.push(obj);
        //           if (items.attributes.jsondata.cur_status) {
        //             obj.cur_status = items.attributes.jsondata.cur_status;
        //           } else {
        //             obj.cur_status = 0;
        //           }
        //       })
        //       return resolve(this.data);
        //     })
        //  }
        // },
      },
      // getOrigindata(){
      //         var Department = Parse.Object.extend("Department");
      //         var department = new Parse.Query(Department);
      //         department.equalTo('ParentId','0')
      //         department.find().then(
      //           resultes => {
      //             resultes.map(items => {
      //               var obj = {};
      //               items.createtime = new Date(
      //                 items.attributes.createdAt
      //               ).toLocaleDateString();
      //               (obj.name = items.attributes.name),
      //                 (obj.ParentId = items.attributes.ParentId);
      //               obj.objectId = items.id;
      //               obj.level = items.attributes.level;
      //               obj.createtime = items.createtime;
      //               obj.alias = items.attributes.alias;
      //               obj.leaf = items.attributes.leafnode;
      //               obj.icon = items.attributes.org_type;
      //               obj.isvcon =false
      //               this.data.push(obj);
      //             });
      //           })

      // },
      //   getdata(data,node){
      //    if(node.level !== 0&&node.data.icon!=='集中器'&&node.data.isvcon==false){
      //           var Department = Parse.Object.extend("Department");
      //           var department = new Parse.Query(Department);
      //           department.equalTo('ParentId',node.data.objectId)
      //           department.ascending('org_type')
      //           department.limit(10000)
      //           department.find().then(
      //             resultes => {
      //               this.data.map(father=>{
      //                 if(resultes[0].id==father.objectId){
      //                   return false
      //                 }
      //               })
      //               resultes.map(items => {
      //                 var obj = {};
      //                 items.createtime = new Date(
      //                   items.attributes.createdAt
      //                 ).toLocaleDateString();
      //                 (obj.name = items.attributes.name),
      //                   (obj.ParentId = items.attributes.ParentId);
      //                 obj.objectId = items.id;
      //                 obj.level = items.attributes.level;
      //                 obj.createtime = items.createtime;
      //                 obj.alias = items.attributes.alias;
      //                 if(items.attributes.leafnode==true){
      //                   obj.isvcon =true
      //                 }else{
      //                   obj.isvcon =false
      //                 }
      //                 obj.leaf = false;
      //                 obj.icon = items.attributes.org_type;
      //                 this.data.push(obj);
      //               });
      //               // this.treeData1 =JSON.parse(JSON.stringify(this.treeData));
      //           })
      //    }
      // }
    },
  }
</script>
<style>
  .resource1 .el-input__inner {
    width: 150px;
    height: 26px;
    line-height: 26px;
    border-radius: 0;
  }
</style>
