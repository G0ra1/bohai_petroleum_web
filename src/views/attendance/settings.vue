<template>
  <div class="content_container">
    <div class="operate " >
      <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                 @click="handleMethod(item.methodd)">{{ item.name }}
      </el-button>
    </div>
    <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
      <el-form-item label="地区名称">
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
        <el-table-column prop="locationName" label="地区" header-align="center" align="center"></el-table-column>
        <el-table-column prop="startTime" label="上班时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="endTime" label="下班时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createName" label="创建人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateName" label="最后修改人" header-align="center" align="center"></el-table-column>
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
        <el-form-item label="选择考勤规则" prop="rulesId">
          <el-select v-model="form.rulesId" clearable placeholder="请选择" >
            <el-option v-for="(item,index) in rulesList" :key="item.id" :label="item.name + ' ' + item.startTime + '-' + item.endTime" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择地区" prop="locationIds">
          <el-select v-model="form.locationIds"  placeholder="请选择" multiple clearable>
            <el-option v-for="(item,index) in locationList" :key="item.id" :label="item.location" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSettings">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {searchRulesAll} from '@/api/attendanceRules'
import {getLocationList} from '@/api/location'
import {addSetting,searchSettingPage,batchDelete} from "@/api/attendanceSetting";

export default {
  name: "setting",
  components: {
  },

  data(){
    const validateRulesId = (rule, value, callback) => {
      if (value == null || value.length == 0) {
        callback(new Error('请选择考勤规则'))
      } else {
        callback()
      }
    }
    const validateLocationIds = (rule, value, callback) => {
      if (value == null || value.length == 0) {
        callback(new Error('请选择地区'))
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
        rulesId:null,
        locationIds:[],
      },
      formRules:{
        rulesId: [{required: true, trigger: 'blur', validator: validateRulesId}],
        locationIds: [{required: true, trigger: 'blur', validator: validateLocationIds}],
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
      dialogName:'新增',
    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.searchPage(1);
  },
  methods:{
    openAddDialog(){
      this.form = {
        rulesId:null,
        locationIds:[],
      }
      this.dialogName ='新增',
      this.showDialog = true;
      this.searchRulesAll();
      this.getLocationList();
    },
    openUpdateDialog(){
      let rows = this.$refs.itemDataTable.selection
      if (rows.length > 1){
        this.$message.error("修改时最多只能选择一条数据")
        return
      }
      if (rows.length == 0){
        this.$message.error("请选择要修改的数据")
        return
      }
      let row = rows[0];
      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.dialogName ='修改规则',
        this.isUpdate = true;
      this.showDialog = true;
    },
    addSettings(){
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.form.locationIds = this.form.locationIds + ""
          addSetting(this.form).then(res=>{
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
    searchPage(pageNum){
      if (pageNum == undefined){
        pageNum = 1;
      }
      this.param.pageNum = pageNum;
      this.currentPage = pageNum + 1;
      searchSettingPage(this.param).then(response=>{
        let result = response.data.data;
        this.tableData = result.list;
        this.totalElements = result.total
      });
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
    searchRulesAll(){
      searchRulesAll().then(response=>{
        if (response.data.errorCode == 200){
          this.rulesList = response.data.data;
        }
      });
    },
    getLocationList(){
      getLocationList().then(response=>{
        if (response.data.errorCode == 200){
          this.locationList = response.data.data;
        }
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

<style>
.el-select__tags {
  white-space: nowrap;
  overflow: hidden;
}
</style>
