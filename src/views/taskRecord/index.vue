<template>
  <div class="content_container">
    <div class="operate " >
      <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                 @click="handleMethod(item.methodd)">{{ item.name }}
      </el-button>
    </div>
    <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
      <el-form-item label="人员名称">
        <el-input v-model="param.name" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="任务名称">
        <el-input v-model="param.taskName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select  v-model="param.status" clearable size="small">
          <el-option label="未开始" value="0" ></el-option>
          <el-option label="进行中" value="1" ></el-option>
          <el-option label="已完成" value="2" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建日期">
          <el-date-picker type="date" placeholder="请选择" v-model="param.createDate" format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="tableData" stripe border @sort-change="onSortChange" @selection-change="handleSelectionChange"
                cell-style="padding: 5px 0;"
                :header-cell-style="{background:'#e6e6e6'}"
                style="width: 100%"
                row-style="height:30px;"
                ref="itemDataTable"
                :row-key="getId">
        <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column prop="userName" label="姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="taskName" label="任务名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="status" :formatter="handleStatus" label="状态" header-align="center" align="center"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" :formatter="handleDate" label="创建日期" header-align="center" align="center"></el-table-column>
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
               label-width="80px" size="mini">
        <el-form-item label="选择任务" prop="taskId">
          <el-select v-model="form.taskId" placeholder="请选择" >
            <el-option v-for="(item,index) in taskList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="openUserDialog">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改打卡时间" :visible.sync="updateDialog" @close="" center>
      <el-form :label-position="labelPosition" ref="dialogForm" :rules="formRules" :model="form"
               label-width="80px" size="mini">
        <el-form-item label="开始时间" prop="intentVisitTime">
          <el-date-picker
            v-model="form1.startTime"
            type="datetime"
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="09:00:00"
            placeholder="选择日期时间"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="intentLeaveTime">
          <el-date-picker
            v-model="form1.endTime"
            type="datetime"
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择地区" prop="locationIds">
          <el-select v-model="form1.locationId"  placeholder="请选择" clearable>
            <el-option v-for="(item,index) in locationList" :key="item.id" :label="item.location" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取 消</el-button>
        <el-button type="primary" :loading="updateLoading" @click="updateRecord">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择人员" :visible.sync="dialogFormVisible" @close="" center style="margin: 0 auto">
      <el-form label-position=left inline=true :model="form" class="demo-form-inline" size="mini">
        <el-form-item label="项目部">
          <selectTree  @select="getValue1" noOptionsText="暂无可选机构" placeholder="请选择" v-model="departmentId1" style="width: 150px" :normalizer="normalizer"  :multiple="false" :options="departments"  />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="param1.name" placeholder="员工姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserList(1)" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table :data="userData" stripe :header-cell-style="{background:'#e7e7e7'}" style="width: 100%"
                  row-style="height:30px"
                  cell-style="padding: 5px 0;" v-loading="loading" ref="userTable"
                  @selection-change="handleSelectionChange2"
                  :row-key="getId">
          <el-table-column type="selection" :reserve-selection="true" header-align="center" align="center"></el-table-column>
          <el-table-column type="index" label="序号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
          <el-table-column prop="certificateNumber" label="证件号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="jobNumber" label="职工编号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="departmentName" label="项目部" header-align="center" align="center"></el-table-column>
        </el-table>
        <div>
          <div>
            <el-pagination
              background
              @current-change="handleCurrentChange2"
              :current-page.sync="currentPage2"
              :page-size="pageSize2"
              :pager-count="5"
              layout="total, prev, pager, next"
              :total="totalElements2">
            </el-pagination>
          </div>
        </div>
      </div>
      <div  style="float: right;margin-top: 20px">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="addTask">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {searchAll} from '@/api/taskMgt'
import {getDepartments} from '@/api/department'
import {getUserInfoPage,} from '@/api/user'
import {listToTree} from '@/utils'
import {addTask,searchRecordPage,updateRecord,batchDelete} from "@/api/taskRecord"
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getLocationList} from '@/api/location'
export default {
  name: "index",
  components: {
    selectTree,
  },
  data(){
    const validateTaskId = (rule, value, callback) => {
      if (value == null || value.length == 0) {
        callback(new Error('请选择任务'))
      } else {
        callback()
      }
    }
    return{
      param:{
        name:'',
        taskName:'',
        departmentId:null,
        createDate:null,
        status:null,
        pageNum: '',
        sort: '',
        order: '',
        pageSize: '10'
      },
      param1:{
        name:'',
        departmentId:null,
        pageNum: '',
        sort: '',
        order: '',
        pageSize: '10'
      },
      form1:{
        startTime:null,
        endTime:null,
        locationId:null
      },
      form:{
        taskId:'',
        userIds:[],
      },
      formRules:{
        taskId: [{required: true, trigger: 'blur', validator: validateTaskId}],
      },
      pickerOptions: {
        disabledDate(v) {
          let flag = false;
          let now = new Date() //当前日期
          if (v.getTime() > new Date().getTime()) {
            flag = true;
          }
          return flag;
        }
      },
      updateLoading:false,
      addLoading:false,
      tableData: [],
      multipleSelection:[],
      multipleSelection1:[],
      bttns:[],
      locationList:[],
      taskList:[],
      userData:[],
      departments:[],
      showDialog:false,
      dialogFormVisible:false,
      updateDialog:false,
      totalElements: 0,
      currentPage: 0,
      pageSize: 10,
      totalElements2: 0,
      currentPage2: 0,
      pageSize2: 10,
      departmentId1:null,
      departmentId:null,
      labelPosition:'left',
      dialogName:'选择任务',

    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.getDepartments();

  },
  methods:{
    getId(row) {
      return row.id //这个id需要换成自己所绑定的Key
    },
    openAddDialog(){
      this.showDialog = true;
      searchAll().then(res=>{
        if (res.data.errorCode == 200){
          this.taskList = res.data.data;
        }
      })
    },
    getLocationList(){
      getLocationList().then(response=>{
        if (response.data.errorCode == 200){
          this.locationList = response.data.data;
        }
      });
    },
    openUpdateDialog(){
        let rows = this.$refs.itemDataTable.selection
        if (rows.length == 0){
          this.$message.error("请选择要修改的数据")
          return
        }
        this.getLocationList();
     this.form1 ={
       startTime:null,
       endTime:null,
       locationId:null
      },
      this.updateDialog = true;
    },
    openUserDialog(){
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.param1 = {
          name:'',
          departmentId:this.departments[0].id,
          pageNum: '',
          sort: '',
          order: '',
          pageSize: '10'
        },
          this.getUserList(1);
          this.dialogFormVisible = true;
        this.$refs.userTable.clearSelection()
      })
    },
    addTask(){
      if (this.multipleSelection1.length == 0){
        this.$message.error("请选择人员");
        return;
      }
      this.addLoading = true;
      this.form.userIds = this.multipleSelection1 + "";
      addTask(this.form).then(res=>{
        this.addLoading = false;
        if (res.data.errorCode == 200){
          this.dialogFormVisible = false;
          this.showDialog = false;
          this.$message.success("操作成功")
          this.searchPage(1)
        }else{
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err=>{
        this.addLoading = false;
      })
    },
    updateRecord(){
      if (this.form1.endTime != null && this.form1.startTime == null){
        this.$message.error("请选择开始时间");
        return ;
      }
      if (this.form1.startTime != null && this.form1.endTime != null){
        let startTime = new Date(this.form1.startTime);
        let endTime = new Date(this.form1.endTime);
        if (endTime <= startTime){
          this.$message.error("结束时间不能小于等于开始时间")
          return ;
        }
      }
      if (this.form1.startTime != null && this.form1.locationId == null ){
        this.$message.error("请选择打卡地区")
        return ;
      }
      this.updateLoading = true;
      let rows = this.$refs.itemDataTable.selection;
      let _this = this;
      rows.forEach(function (val,index,arr){
        val.startTime = _this.form1.startTime;
        val.endTime = _this.form1.endTime;
        val.locationId = _this.form1.locationId;
      })
      updateRecord(rows).then(res=>{
        this.updateLoading = false;
        if (res.data.errorCode == 200){
          this.updateDialog = false;
          this.$refs.itemDataTable.clearSelection();
          this.$message.success("操作成功")
          this.searchPage(1);
        }else{
          this.$message.error(res.data.errorMsg)
        }
      }).catch(err=>{
        this.updateLoading = false;
      })
    },
    deleteBatch(){
      if (this.multipleSelection.length == 0){
        this.$message.error("请选择数据");
        return;
      }
      let rows = this.$refs.itemDataTable.selection;
      let is = false;
      rows.forEach(function (val) {
        if (val.status == 1 || val.status == 2){
          is = true;
          return ;
        }
      })
      if (is){
        this.$message.error("只能删除未开始的任务")
        return ;
      }
      batchDelete(this.multipleSelection + "").then(res=>{
        if (res.data.errorCode == 200){
          this.$message.success("操作成功");
          this.searchPage(1);
        }else{
          this.$message.error(this.data.errorMsg)
        }
      })
    },
    searchPage(pageNum){
      if (pageNum == undefined){
        pageNum = 1;
      }
      this.param.pageNum = pageNum;
      this.currentPage = pageNum;
      searchRecordPage(this.param).then(response=>{
        let result = response.data.data;
        this.tableData = result.list;
        this.totalElements = result.total
      });
    },
    getDepartments() {
      getDepartments().then(response => {
        let result = response.data.data;
        this.departments = listToTree(result);;
        this.param.departmentId = this.departments[0].id
        this.param1.departmentId = this.departments[0].id
        this.searchPage(1);
        this.getUserList(1);
      })
    },
    getUserList(start) {
      this.param1.pageNum = start;
      this.currentPage2 = start;
      getUserInfoPage(this.param1).then(response => {
        let result = response.data.data;
        this.userData = result.list;
        this.pageSize2 = result.pageSize;
        this.totalElements2 = result.total
      })
    },
    getValue1(value,id) {
      this.param1.departmentId = value.id;
      this.getUserList(1)
    },
    handleMethod(ms) {
      this[ms]();
    },
    handleStatus(val){
      if (val.status == 0){
        return "未开始"
      }else if (val.status == 1){
        return "进行中"
      }else if (val.status == 2){
        return "已完成"
      }
    },
    handleDate(row){
      if (row.createDate != null){
        return row.createDate.substring(0,10)
      }
    },
    normalizer(node){
      //去掉children=[]的children属性
      if(node.children && !node.children.length){
        delete node.children;
      }
      return {
        id: node.id,
        label:node.name,
        children:node.children
      }
    },
    handleCurrentChange(val) {
      this.param.pageNum = val;
      this.searchPage(this.param.pageNum);
    },
    handleCurrentChange2(val) {
      this.param1.pageNum = val;
       this.getUserList(this.param1.pageNum);
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
    handleSelectionChange2(val) {
      this.multipleSelection1 = [];
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection1.push(val[i].id);
      }
    },
  }
}
</script>

<style scoped>

</style>
