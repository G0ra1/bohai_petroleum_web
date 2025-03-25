<template>
  <div class="content_container">
    <div class="operate " >
      <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                 @click="handleMethod(item.methodd)">{{ item.name }}
      </el-button>
    </div>
    <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
      <el-form-item label="姓名">
        <el-input v-model="param.name" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="职工类型" prop="userType">
        <el-select v-model="param.userType"  placeholder="职工类型" :clearable="false" style="width: 150px">
          <el-option label="职工" value="1"></el-option>
          <el-option label="劳务工" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="vacationDate">
        <el-date-picker
          v-model="vacationDate"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 220px">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="tableData" stripe border @sort-change="onSortChange" @selection-change="handleSelectionChange"
                cell-style="padding: 5px 0;"
                :header-cell-style="{background:'#e6e6e6'}"
                style="width: 100%"
                row-style="height:30px;"
                ref="itemDataTable">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" fixed label="人员姓名" header-align="center" align="center" min-width="145px"></el-table-column>
        <el-table-column prop="departmentName" fixed label="项目部" header-align="center" align="center" min-width="145px"></el-table-column>
        <el-table-column v-for="(item, index) in  leaveTypes" :key="index" :label="item" min-width="145px" header-align="center" align="center">
          <template slot-scope="scope">
              <span>{{leaveHandel(scope.row,index)}}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in  locationList" :key="'a'+index" :label="item.location" min-width="145px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{locationHandel(scope.row,index)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage"
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
import {getDepartments} from '@/api/department'
import {searchPage} from "@/api/attendanceStats";
import {formatDate} from '@/utils/DateUtil'
import {listToTree} from '@/utils'
import {getLocationList} from '@/api/location'
import {getBaseUrl} from "@/api/url";
export default {
  name: "statistics",
  data(){
    const validateDate = (rule, value, callback) => {
      if (value == null || value.length == 0) {
        callback(new Error('请选择日期'))
      } else {
        callback()
      }
    }
    return{
      param:{
        departmentId:null,
        name:'',
        userType:'',
        startDate:'',
        endDate:'',
        pageNum: '',
        sort: '',
        order: '',
        pageSize: '10'
      },
      leaveTypes:["出勤天数","上井天数","上岛天数","大夜班","小夜班","加班","旷工","带薪年休假","探亲假","婚假","丧假","产假","护理假","节育假","病假","事假","哺乳假","工伤停工留薪期","女员工育儿假","轮休（倒休）"],
      vacationDate:[],
      tableData: [],
      bttns:[],
      levaeTypes:[],
      locationList:[],
      departments:[],
      showDialog:false,
      totalElements: 0,
      currentPage: 0,
      pageSize: 10,
      labelPosition:'center',
      ormLabelWidth: '10%',
    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    let end = formatDate(new Date(),'yyyy-MM-dd')
    let start = formatDate(new Date(),'yyyy-MM')+'-01'
    this.vacationDate = [start,end]
    this.getLocationList();
    this.getDepartments();
  },
  methods:{
    leaveHandel(row,index){
      return row.levaeTypes[index].count;
    },
    locationHandel(row,index){
      return row.locations[index].count;
    },
    searchPage(pageNum){
      if (pageNum == undefined){
        pageNum = 1;
      }
      if (this.vacationDate == null || this.vacationDate.length == 0){
        this.$message.error("请选择日期")
        return ;
      }
      const loading = this.$loading({
        lock: true,
        text: '请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.param.startDate = this.vacationDate[0];
      this.param.endDate = this.vacationDate[1];
      this.param.pageNum = pageNum;
      this.currentPage = pageNum;
      searchPage(this.param).then(response=>{
        loading.close();
        let result = response.data.data;
        this.tableData = result.list;
        this.totalElements = result.total
      });
    },
    exportStats(){

      this.$confirm('确定批量导出数据吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let departmentId = this.param.departmentId;
        let userType = this.param.userType;
        let name = this.param.name;
        let startDate = this.param.startDate;
        let endDate = this.param.endDate;
        let href = getBaseUrl()+'statistics/exportStats?name='+name+'&startDate='+startDate+'&endDate='+endDate+'&departmentId='+departmentId+'&userType='+userType;
        window.location.href = href
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    getLocationList(){
      getLocationList().then(res=>{
        this.locationList = res.data.data;
      })
    },
    getDepartments() {
      getDepartments().then(response => {
        let result = response.data.data;
        this.departments = listToTree(result);;
        this.param.departmentId = this.departments[0].id
        this.searchPage(1);
      })
    },
    handleMethod(ms) {
      this[ms]();
    },
    handleCurrentChange(val) {
      this.param.pageNum = val;
      this.searchPage(this.param.pageNum);
    },
    onSortChange(param) {
      this.param.sort = param.prop;
      this.param.order = param.order == "ascending" ? "ASC" : "DESC";
      this.searchPage(this.param.pageNum);
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection.push(val[i].id);
      }
    },
  }
}
</script>

<style scoped>

</style>
