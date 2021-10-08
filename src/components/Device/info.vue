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
          {{ $translateTitle('equipment.devicenumber') + ':' }}
        </td>
        <td>{{ devicedetail.devaddr }}</td>
        <td class="cloumn">
          {{ $translateTitle('equipment.installationlocation') }}
        </td>
        <td>
          {{ devicedetail.detail ? devicedetail.detail.address : '' }}
        </td>
        <td class="cloumn">
          {{ $translateTitle('equipment.state') + ':' }}
        </td>
        <!-- <td  :class="devicedetail.status"  v-if="devicedetail.status=='ACTIVE'">{{$t('product.active')}}</td>
         <td  :class="devicedetail.status" v-else-if="devicedetail.status=='UNACTIVE'">{{$t('product.unactive')}}</td>
         <td  :class="devicedetail.status" v-else-if="devicedetail.status=='ONLINE'">{{$t('product.online')}}</td>
        <td  :class="devicedetail.status"  v-else>{{$t('product.offline')}}</td>-->
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
      </tr>
      <tr>
        <!-- <td class="cloumn">{{$t('equipment.subordinatenode')+':'}}</td>
        <td>{{devicedetail.node}}</td>-->
        <td class="cloumn">
          {{ $translateTitle('equipment.nodetype') + ':' }}
        </td>
        <td v-if="devicedetail.nodeType == 0">
          {{ $translateTitle('product.equipment') }}
        </td>
        <td v-else>{{ $translateTitle('product.gateway') }}</td>
        <td class="cloumn">
          {{ $translateTitle('developer.describe') + ':' }}
        </td>
        <td>{{ devicedetail.desc }}</td>
        <td class="cloumn">
          {{ $translateTitle('equipment.Failure analysis') + ':' }}
        </td>
        <td>{{ devicedetail.lastOnlineTime || '-' }}</td>
      </tr>
    </table>
    <el-table
      :data="devicedetail.topicData"
      style="width: 100%; text-align: center"
    >
      <el-table-column align="left" label="Topic">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.topic.replace(
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
        <template slot-scope="scope">
          <span v-if="scope.row.type == 'pub'">
            {{ $translateTitle('product.pub') }}
          </span>
          <span v-if="scope.row.type == 'sub'">
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
