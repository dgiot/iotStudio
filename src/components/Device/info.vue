<template>
  <div>
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="mailtable"
      style="width: 100%"
    >
      <!-- 设备编号: 所属产品: 安装位置 -->
      <tr>
        <td class="cloumn">
          {{ $translateTitle('konva.id') + ':' }}
        </td>
        <td>{{ devicedetail.objectId }}</td>
        <td class="cloumn">
          {{ $translateTitle('equipment.devicenumber') + ':' }}
        </td>
        <td>{{ devicedetail.devaddr }}</td>
        <td class="cloumn">
          {{ $translateTitle('equipment.installationlocation') + ':' }}
        </td>
        <td>
          {{ devicedetail.detail ? devicedetail.detail.address : '' }}
        </td>
        <td class="cloumn">
          {{ $translateTitle('equipment.state') + ':' }}
        </td>
        <!-- <td  :class="devicedetail.status"  v-if="devicedetail.status=='ACTIVE'">{{$translateTitle('product.active')}}</td>
         <td  :class="devicedetail.status" v-else-if="devicedetail.status=='UNACTIVE'">{{$translateTitle('product.unactive')}}</td>
         <td  :class="devicedetail.status" v-else-if="devicedetail.status=='ONLINE'">{{$translateTitle('product.online')}}</td>
        <td  :class="devicedetail.status"  v-else>{{$translateTitle('product.offline')}}</td>-->
        <td class="ACTIVE">
          {{ $translateTitle('product.active') }}
        </td>
      </tr>

      <tr>
        <td class="cloumn">
          {{ $translateTitle('equipment.ipaddress') + ':' }}
        </td>
        <td>{{ devicedetail.ip || '-' }}</td>
        <td class="cloumn">
          {{ $translateTitle('equipment.createdAt') + ':' }}
        </td>
        <td>
          {{ $moment(devicedetail.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </td>
        <td class="cloumn">
          {{ $translateTitle('equipment.lastonlinetime') + ':' }}
        </td>
        <td>
          {{ $moment(devicedetail.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
        </td>
        <td class="cloumn">
          {{ $translateTitle('equipment.nodetype') + ':' }}
        </td>
        <td v-if="devicedetail.nodeType == 0">
          {{ $translateTitle('product.equipment') }}
        </td>
        <td v-else>
          {{ $translateTitle('product.gateway') }}
        </td>
      </tr>
      <tr>
        <!-- <td class="cloumn">{{$translateTitle('equipment.subordinatenode')+':'}}</td>
        <td>{{devicedetail.node}}</td>-->

        <td class="cloumn">
          {{ $translateTitle('developer.describe') + ':' }}
        </td>
        <td>{{ devicedetail.desc }}</td>
        <td class="cloumn">
          {{ $translateTitle('equipment.Failure analysis') + ':' }}
        </td>
        <td>{{ devicedetail.lastOnlineTime || '-' }}</td>
        <td class="cloumn">
          {{ $translateTitle('application.secretkey') + ':' }}
        </td>
        <td>{{ devicedetail.deviceSecret || '-' }}</td>
        <!--        <td class="cloumn">-->
        <!--          {{ $translateTitle('node.operation') + ':' }}-->
        <!--        </td>-->
        <!--        <td>-->
        <!--          <el-link plain size="mini" @click="handleDelete(devicedetail)">-->
        <!--            {{ $translateTitle('konva.delete') }}-->
        <!--          </el-link>-->
        <!--        </td>-->
      </tr>
    </table>
    <el-table
      :data="devicedetail.topicData"
      style="width: 100%; text-align: center"
    >
      <el-table-column label="Topic">
        <template #default="{ row }">
          <span>
            {{
              row.topic.replace(
                '\${ProductId}\/${DevAddr\}',
                devicedetail.productid + '/' + devicedetail.devaddr
              )
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('equipment.operationauthority')"
      >
        <template #default="{ row }">
          <span v-if="row.type == 'pub'">
            {{ $translateTitle('product.pub') }}
          </span>
          <span v-if="row.type == 'sub'">
            {{ $translateTitle('product.sub') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('developer.describe')"
        prop="desc"
      />
    </el-table>
    <!--    <h4>-->
    <!--      {{ $translateTitle('equipment.deviceextensioninformation') }}-->
    <!--    </h4>-->
    <!--    <el-input-->
    <!--      v-if="devicedetail.shadow"-->
    <!--      v-model="devicedetail.shadow"-->
    <!--      :row="10"-->
    <!--      :cols="5"-->
    <!--      type="textarea"-->
    <!--      readonly-->
    <!--    />-->
  </div>
</template>
<script>
  import { delDevice } from '@/api/Device'

  export default {
    name: 'CardInfo',
    props: {
      devicedetail: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {}
    },
    created() {},
    methods: {
      handleDelete(row) {
        console.log(row)
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          await delDevice(row.objectId)
          this.$baseMessage(
            this.$translateTitle('Maintenance.successfully deleted'),
            'success',
            'dgiot-hey-message-success'
          )
          this.$router.go(-1)
        })
      },
    },
  }
</script>
<style>
  .mailtable .cloumn {
    font-weight: bold;
    color: #74777a;
    text-align: left;
    background: #fafafc;
    border-right: 1px solid #ebecec;
    border-bottom: 1px solid #ebecec;
  }

  .mailtable td {
    box-sizing: border-box;
    padding: 15px;
    font-size: 14px;
    color: #74777a;
    text-align: left;
    border: 1px solid #ebecec;
  }
</style>
