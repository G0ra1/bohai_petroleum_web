<template>
  <div class="content_container">
    <div class="operate " >
      <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                 @click="handleMethod(item.methodd)">{{ item.name }}
      </el-button>
    </div>
    <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
      <el-form-item label="任务名称">
        <el-input v-model="param.name" placeholder="请输入" clearable></el-input>
      </el-form-item>
    </el-form>
    <div>
    <el-table :data="tableData" stripe border @sort-change="onSortChange" @selection-change="handleSelectionChange"
              cell-style="padding: 5px 0;"
              :header-cell-style="{background:'#e6e6e6'}"
              style="width: 100%"
              row-style="height:30px;"
              ref="itsmDataTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="任务名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="type" label="任务类型" header-align="center" align="center" :formatter="handleType"></el-table-column>
      <el-table-column prop="createName" label="创建人" header-align="center" align="center"></el-table-column>
      <el-table-column prop="updateNmae" label="最后修改人" header-align="center" align="center"></el-table-column>
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
        <el-form-item label="名称" prop="name">
          <el-input  v-model.trim="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" prop="type">
          <el-select v-model="form.type"  placeholder="请选择" clearable style="width: 200px">
            <el-option label="上井" value="3"></el-option>
            <el-option label="上岛" value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addTask,searchPage,updateTask,deleteTask} from '@/api/taskMgt'
import {Message} from "element-ui";
export default {
name: "index",
  data(){
    return{
      param:{
        name:'',
        pageNum: '',
        sort: '',
        order: '',
        pageSize: '10'
      },
      form:{
        id:null,
        name:'',
        type:null,
      },
      formRules:{
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        type: [{required: true, trigger: 'blur', message: "请选择任务类型"}],
      },
      tableData: [],
      multipleSelection:[],
      bttns:[],
      showDialog:false,
      totalElements: 0,
      currentPage: 0,
      pageSize: 10,
      labelPosition:'left',
      dialogName:'新增任务',
    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.searchPage(1);
  },
  methods:{
    handleType(row){
      if(row.type == 3){
        return "上井";
      }else if(row.type == 4){
        return "上岛";
      }
    },
    openAddDialog(){
      this.form = {
        id:null,
        name:'',
      };
      this.dialogName = "新增";
      this.showDialog = true;
    },
    openUpdateDialog() {
      let rows = this.$refs.itsmDataTable.selection
      if (rows.length > 1){
        this.$message.error("修改时最多只能选择一条数据")
        return
      }
      if (rows.length == 0){
        this.$message.error("请选择要修改的数据")
        return
      }
      let row = rows[0];
      this.dialogName = '修改';
      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.form.type = this.form.type + "";
      this.showDialog = true;
      this.form.status = true;
      this.$refs.dialogForm.clearValidate();//清除校验结果

    },
    submitForm(){
      this.$refs.dialogForm.validate(valid => {
          if (!valid) {
            return;
          }
          if (this.dialogName.indexOf("新增") != -1) {//添加操作
            addTask(this.form).then(res=>{
              if (res.data.errorCode == 200){
                this.showDialog = false;
                this.$message.success("操作成功");
                this.searchPage(1);
              }else{
                this.$message.error(res.data.errorMsg)
              }
            })
          } else {//修改操作
            updateTask(this.form).then(res=>{
              if (res.data.errorCode == 200){
                this.showDialog = false;
                this.$message.success("操作成功");
                this.searchPage(1);
              }else{
                this.$message.error(res.data.errorMsg)
              }
            })
          }
      })
    },
    deleteBatch(){
      if (this.multipleSelection.length == 0) {
        Message.error("请先选择要删除的数据");
        return;
      }
      this.$confirm('即将删除' + this.multipleSelection.length + '条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTask(this.multipleSelection + "").then(response => {
          if (response.data.errorCode == 200) {
            Message.success("操作成功");
            this.searchPage(1);
          } else {
            Message.error(response.data.errorMsg);
          }
        });
      });
    },
    searchPage(pageNum){
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
