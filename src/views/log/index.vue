<template>
  <div class="content_container">
  <div class="operate " >
    <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
               @click="handleMethod(item.methodd)">{{ item.name }}
    </el-button>
  </div>
  <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
    <el-form :label-position="labelPosition" :inline="true" :model="form" class="demo-form-inline" size="mini">
      <el-form-item label="日志类型">
        <el-select v-model="param.logType" placeholder="请选择日志类型">
          <el-option label="登录日志" value="登录日志"></el-option>
          <el-option label="退出日志" value="退出日志"></el-option>
          <el-option label="业务日志" value="业务日志"></el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="日志名称">
        <el-input v-model="param.name" placeholder="日志名称"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="dateArray"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 250px">
        </el-date-picker>
      </el-form-item>
    </el-form>
  </el-form>
    <el-table :data="tableData" stripe border @sort-change="onSortChange" @selection-change="handleSelectionChange"
              cell-style="padding: 5px 0;"
              :header-cell-style="{background:'#e6e6e6'}"
              style="width: 100%"
              row-style="height:30px;"
              ref="itemDataTable">
      <el-table-column type="index" label="序号" width="55" header-align="center" align="center"> </el-table-column>
      <el-table-column prop="logType" label="日志类型" header-align="center" align="center"> </el-table-column>
      <el-table-column prop="logName" label="日志名称" header-align="center" align="center"> </el-table-column>
      <el-table-column prop="userName" label="操作人员" header-align="center" align="center"></el-table-column>
      <el-table-column prop="succeed" label="是否成功" header-align="center" align="center"></el-table-column>
      <el-table-column prop="ip" label="IP地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createTime" label="操作时间" sortable="custom" header-align="center" align="center"></el-table-column>
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
</template>

<script>
import {formatDate} from '@/utils/DateUtil'
import {searchPage} from '@/api/log'
export default {
  name: "index",
  data(){
    return{
      param:{
        name:'',
        logType:'',
        startDate:'',
        endDate:'',
        pageNum: '',
        sort: '',
        order: '',
        pageSize: '10'
      },
      tableData: [],
      multipleSelection:[],
      bttns:[],
      dateArray:[],
      totalElements: 0,
      currentPage: 0,
      pageSize: 10,
      labelPosition:'center',
    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    let end = formatDate(new Date(),'yyyy-MM-dd')
    let start = formatDate(new Date(),'yyyy-MM')+'-01'
    this.dateArray = [start,end]
    this.searchPage(1)
  },
  methods:{
    searchPage(pageNum){
      if (pageNum == undefined){
        pageNum = 1;
      }
      if (this.dateArray == null || this.dateArray.length == 0){
        this.$message.error("请选择日期")
        return ;
      }
      this.param.startDate = this.dateArray[0];
      this.param.endDate = this.dateArray[1];
      this.param.pageNum = pageNum;
      this.currentPage = pageNum;
      searchPage(this.param).then(response=>{
        let result = response.data.data;
        this.tableData = result.list;
        this.totalElements = result.total
      });
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
