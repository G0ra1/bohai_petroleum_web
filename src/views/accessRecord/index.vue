<template>
  <div class="content_container">
    <div class="content_title">
      <h3>出入记录</h3>
    </div>
    <div>
      <el-form label-position="left" :inline="true" :model="queryParam" class="demo-form-inline" size="mini">

        <el-form-item label="位置">
          <el-select v-model="queryParam.locationId" placeholder="请选择" clearable style="width: 150px">
            <el-option :label="item.location" :value="item.id" :key="item.id" v-for="item in locationList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员类型">
          <el-select v-model="queryParam.userType" placeholder="人员类型" clearable style="width: 150px">
            <el-option label="员工" value="1"></el-option>
            <el-option label="访客" value="2"></el-option>
            <el-option label="重要人物" value="4"></el-option>
            <el-option label="陌生人" value="-1"></el-option>
            <el-option label="黑名单" value="-2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="queryParam.name" placeholder="姓名" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="项目部" prop="departmentId">
          <selectTree
            ref="selectTree"
            :props="props"
            :options="data"
            :value="queryParam.departmentId"
            :clearable="true"
            accordion="true"
            :disabled="isClearable==false"
            @getValue="getValue4($event)"/>
        </el-form-item>
        <el-form-item label="健康码">
          <el-select v-model="queryParam.healthStatus" placeholder="健康码状态" clearable style="width: 150px">
            <el-option label="绿码" value="0"></el-option>
            <el-option label="橙码-密切接触" value="1"></el-option>
            <el-option label="黄码-国外" value="2"></el-option>
            <el-option label="红码-确诊" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
        <el-col :span="11">
        <el-date-picker type="date" placeholder="选择时间" v-model="queryParam.startTime" format="yyyy-MM-dd"
        value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line text-center" :span="2">-</el-col>
        <el-col :span="11">
        <el-date-picker type="date" placeholder="选择时间" v-model="queryParam.endTime" format="yyyy-MM-dd"
        value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getAccessRecord(1)" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-button style="margin-bottom: 20px" v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                   @click="handleMethod(item.methodd)">{{ item.name }}
        </el-button>
      </el-form>
    </div>

    <div>
      <el-table
        :data="tableData"
        stripe
        border
        @sort-change="onSortChange"
        :header-cell-style="{background:'#e6e6e6'}"
        row-style="height:30px;"
        cell-style="padding: 5px 0;"
        style="width: 100%"
      >

        <el-table-column prop="locationName" label="出入位置"  header-align="center" align="center" min-width="145px"></el-table-column>
        <el-table-column
          prop="userTypeValue"
          label="人员类型"
        >
        </el-table-column>

        <el-table-column
          prop="name"
          label="姓名"
        >
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="certificateNumber"-->
          <!--label="身份证号"-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <el-table-column prop="temperature" label="体温" > </el-table-column>
        <el-table-column prop="healthStatus" label="健康码" :formatter="handelStatus">
          <template slot-scope="scope">
            <div
              :style="handelStyle(scope.row)">
              {{handelStatus(scope.row)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="recordType" label="记录类型" > </el-table-column>
        <el-table-column
          prop="createTime"
          sortable="custom"
          label="时间"
        >
        </el-table-column>


        <el-table-column label="操作">
          <template  slot-scope="props">
            <el-popover
              placement="right"
              trigger="click">
              <!--<el-table :data="gridData">-->
                <!--<el-table-column width="150" property="date" label="日期"></el-table-column>-->
                <!--<el-table-column width="100" property="name" label="姓名"></el-table-column>-->
                <!--<el-table-column width="300" property="address" label="地址"></el-table-column>-->
              <!--</el-table>-->
              <img :src="getImagePath(props.row.imagePath)" style="width: 100px; height: 75px;"/>
              <el-button slot="reference" size="mini">查看图片</el-button>
            </el-popover>
          </template>

        </el-table-column>

      </el-table>
      <div>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, prev, pager, next"
          :total="totalElements">
        </el-pagination>
      </div>
    </div>


  </div>
</template>

<script>
  import {getDeviceList} from '@/api/device'
  import {getAccessRecord} from '@/api/accessRecord'
  import {dateFormat} from '@/utils/DateUtil'
  import selectTree from '@/components/treeSelect/el-tree-select'
  import {getDepartments} from '@/api/department'
  import {listToTree} from '@/utils'
  import {getBaseUrl} from "@/api/url";
  import {getLocationList} from '@/api/location'
  import { Message } from 'element-ui'
  import store from "../../store";
  export default {
    name: "index",
    components: {
      selectTree
    },
    created() {
      this.bttns = this.$route.meta.btnPermission;
      this.getLocationList();
      this.getDeviceList();
      this.getDepartments();
    },
    data() {
      return {
        btts:[],
        isClearable:true,
        data:[],
        locationList:[],
        deviceList: [],//设备列表
        queryParam: {
          healthStatus:null,
          userType: '1',
          locationId:'',
          deviceId: '',
          name: '',
          departmentId:'',
          certificateNumber: '',
          pageNum: 1,
          pageSize: 10,
          sort: '',
          order: '',
          startTime:'',
          endTime:'',

        },
        logDate:[],
        tableData: [],
        currentPage: 0,
        pageSize: 10,
        totalElements: 0,
      }
    },
    methods: {
      dateFormat,
      handleMethod(ms) {
        this[ms]();
      },
      handelStatus(row){
        if (row.healthStatus == null || row.healthStatus === ''){
          return "无"
        }
        if (row.healthStatus == 0){
          return "绿码"
        }else if(row.healthStatus == 1){
          return "橙码-密切接触"
        }else if(row.healthStatus == 2){
          return "黄码-境外输入"
        }else if(row.healthStatus == 3){
          return "红码-确诊疑似"
        }else{
          return "无"
        }
      },
      handelStyle(row){
        if (row.healthStatus == null || row.healthStatus === ''){
          return ""
        }
        if (row.healthStatus == 0){
          return "color: #4EFEB3;"
        }else if(row.healthStatus == 1){
          return "color: #FFA042;"
        }else if(row.healthStatus == 2){
          return "color: #FFD306;"
        }else if(row.healthStatus == 3){
          return "color: #FF2D2D;"
        }
      },
      handleCurrentChange(val) {
        this.queryParam.pageNum = val;
        this.getAccessRecord(this.queryParam.pageNum);
      },
      getValue4(value) {
        this.queryParam.departmentId = value
      },
      getLocationList(){
        getLocationList().then(response => {
          this.locationList = response.data.data;
        })
      },
      getDepartments() {
        getDepartments().then(response => {
          let result = response.data.data;
          this.departments = result;
          this.data = listToTree(result)
          //如果没有这句代码，select中初始化会是空白的，默认选中就无法实现
          if (store.getters.userInfo.departmentId == 0){
            this.queryParam.departmentId = '';
            this.isClearable = true;
          }else{
            this.queryParam.departmentId = store.getters.userInfo.departmentId;
            this.isClearable = false;
          }
          this.getAccessRecord(1);
        })

      },
      getAccessRecord(start) {
          this.queryParam.pageNum = start;
          this.currentPage = start + 1;
        getAccessRecord(this.queryParam).then(response => {
          let result = response.data.data;
          this.tableData = result.list;
          this.totalElements = result.total;
        });
      },
      onSortChange(param) {
        this.queryParam.sort = param.prop;
        this.queryParam.order = param.order == "ascending" ? "ASC" : "DESC";
        this.getAccessRecord(this.queryParam.pageNum);
      },
      getImagePath(imagePath) {
        return process.env.BASE_API + imagePath.slice(1);
      },
      getDeviceList() {
        getDeviceList().then(response => {
          this.deviceList = response.data.data;
        })
      },
      exportStatistics(){
        if (this.tableData < 1) {
          Message.error('无数据可导出')
          return;
        }

        this.$confirm('确定批量导出数据吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let locationId = this.queryParam.locationId;
          let departmentId = this.queryParam.departmentId;
          let startTime = this.queryParam.startTime;
          let endTime = this.queryParam.endTime;
          let name = this.queryParam.name;
          let userType = this.queryParam.userType;
          let href = getBaseUrl()+'access/export?departmentId='+departmentId+'&name='+name+'&startDate='+startTime+'&endDate='+endTime+'&locationId=' + locationId+'&userType='+userType;
          window.location.href = href
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
    }


  }
</script>

<style scoped>

</style>
