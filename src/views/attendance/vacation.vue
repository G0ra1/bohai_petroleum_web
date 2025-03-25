<template>
  <div class="content_container">
    <div class="operate " >
      <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                 @click="handleMethod(item.methodd)">{{ item.name }}
      </el-button>
    </div>
    <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
      <el-form-item label="假期名称">
        <el-input v-model="param.name" placeholder="请输入" clearable></el-input>
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
        <el-table-column prop="name" label="假期名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="date" sortable="custom" label="日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createTime" sortable="custom" label="创建时间" header-align="center" align="center"></el-table-column>
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
    <el-dialog :title="dialogName" :visible.sync="showDialog" @close="" center>
      <el-form :label-position="labelPosition" ref="dialogForm" :rules="formRules" :model="form"
               label-width="120px" size="mini">
        <el-form-item label="假期名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="rulesId">
          <el-input v-model="form.remark" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="vacationDate">
            <el-date-picker
              v-model="form.vacationDate"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 250px">
            </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="addVacation">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addVacation,searchPage,batchDelete} from "@/api/vacation";

export default {
  name: "vacation",
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
        name:'',
        pageNum: '',
        sort: '',
        order: '',
        pageSize: '10'
      },
      form:{
        name:null,
        remark:null,
        startDate:'',
        endDate:'',
        vacationDate:[],
      },
      formRules:{
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        vacationDate: [{required: true, trigger: 'blur', validator: validateDate}],
      },
      tableData: [],
      multipleSelection:[],
      bttns:[],
      rulesList:[],
      locationList:[],
      showDialog:false,
      totalElements: 0,
      currentPage: 0,
      pageSize: 10,
      labelPosition:'center',
      dialogName:'新增假期',
      ormLabelWidth: '10%',
    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.searchPage(1);
  },
  methods:{
    openAddDialog(){
      this.form = {
        name:null,
        remark:null,
        startDate:'',
        endDate:'',
        vacationDate:[],
      };
      this.form.vacationDate = [];
      this.showDialog = true;
    },
    addVacation(){
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.form.startDate = this.form.vacationDate[0];
        this.form.endDate = this.form.vacationDate[1];
        this.form.vacationDate = [];
        addVacation(this.form).then(res=>{
            if (res.data.errorCode == 200){
              this.$message.success("操作成功")
              this.showDialog = false;
              this.searchPage(1)
            }else{
              this.$message.error(res.data.errorMsg);
            }
          })
      })
    },
    batchDelete(){
      if (this.multipleSelection.length == 0){
        this.$message.error("请选择数据");
        return;
      }
      batchDelete(this.multipleSelection + "").then(res=>{
        if (res.data.errorCode == 200){
          this.$message.success("操作成功");
          this.searchPage(1);
        }else{
          this.$message.error(res.data.errorMsg)
        }
      })
    },
    searchPage(pageNum){
      if (pageNum == undefined){
        pageNum = 1;
      }
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
