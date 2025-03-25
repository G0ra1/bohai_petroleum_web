<template>
  <div class="content_container">
    <div class="operate">
      <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
          <el-form-item>
            <el-form-item label="公司" >
              <el-select v-model="param.cid" placeholder="请选择">
                <el-option
                  v-for="item in companys"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchAdmin(1)" icon="el-icon-search">查询</el-button>
            <el-button style="margin-bottom: 20px" v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                       @click="handleMethod(item.methodd)">{{ item.name }}
            </el-button>
          </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="tableData" stripe border @sort-change="onSortChange" @selection-change="handleSelectionChange"
                cell-style="padding: 5px 0;"
                :header-cell-style="{background:'#e6e6e6'}"
                style="width: 100%"
                row-style="height:30px;">
        <el-table-column type="selection" header-align="center" align="center" width="55"></el-table-column>
        <el-table-column  prop="name" label="名称" header-align="center" align="center"></el-table-column>
        <el-table-column sortable="custom"  prop="jobNumber" label="账号" header-align="center" align="center"></el-table-column>
        <el-table-column  prop="roleName" label="角色" header-align="center" align="center"></el-table-column>
        <el-table-column  prop="companyName" label="所属公司" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="deleteById(scope.row)">删除</el-button>
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
    <el-dialog :title="dialogName" :visible.sync="showDialog" @close="" center>
      <el-form :label-position="labelPosition" ref="dialogForm" :rules="formRules" :model="form"
               label-width="120px" size="mini">
        <el-form-item label="名称" prop="name">
          <el-input  v-model.trim="form.name"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="jobNumber">
          <el-input  v-model.trim="form.jobNumber"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="form.password"></el-input>
        </el-form-item>
        <el-form-item label="所属公司" :label-width="formLabelWidth">
          <el-select v-model="form.cid" placeholder="请选择" @change="selectChanged">
            <el-option
              v-for="item in companys"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="form.roleId" placeholder="请选择">
            <el-option
              v-for="item in roleTree"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
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
import  { selectByCid} from '@/api/role';
import {selectAll} from '@/api/company'
import  {addAdmin,searchAdmin,deleteById} from '@/api/admin';
import {Message} from "element-ui";
export default {
name: "admin",
  data(){
  return{
    roleTree:[],
    companys:[],
    currentPage: 0,
    pageSize: 10,
    totalElements: 0,
    showDialog:false,
    labelPosition:'left',
    formLabelWidth: '120px',
    dialogName:'添加',
    bttns:[],
    tableData: [],
    multipleSelection:[],
    param:{
      cid:'',
      sort:'',
      order:'',
      pageNum:'',
      pageSize: '10'
    },
    dialog:{
      param:{
        cid:null,
      }
    },
    form:{
      id:null,
      name:'',
      jobNumber:'',
      password:'',
      cid:'',
      roleId:'',
    },
    formRules: {
      name: [{required: true, trigger: 'blur', validator: "请输入名称"}],
      jobNumber: [{required: true, trigger: 'blur', validator: "请输入账号"}],
      password: [{required: true, trigger: 'blur', validator: "请输入密码"}],

    },
    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.selectCompany();
    this.searchAdmin(1);
  },
  methods:{
  openAdddialog(){
    this.dialogName = "添加";
    this.form = {
      id:null,
      name:'',
      jobNumber:'',
      password:'',
      cid:'',
      roleId:'',
    }
    this.showDialog = true;
  },
    deleteById(row){
      this.$confirm('即将删除' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(row.id).then(res => {
          if (res.data.errorCode == 200) {
            this.searchAdmin(1);
          }
          this.$message.success(res.data.errorMsg);
        });
      });
    },
    submitForm(){
      if (this.form.cid == null || this.form.cid == ''){
        this.$message.error("请选择所属公司");
        return;
      }
      if (this.form.roleId == null || this.form.roleId == ''){
        this.$message.error("请选择角色");
        return;
      }
      this.$refs.dialogForm.validate(valid => {{
        if(valid){
          addAdmin(this.form).then(response=>{
            if(response.data.errorCode == 200){
              Message.success("操作成功");
              this.showDialog = false
             this.searchAdmin(1);
            }else{
              Message.error(response.data.errorMsg);
            }
          });
        }
      }})
    },
    handleMethod(ms) {
      this[ms]();
    },
    selectCompany(){
      selectAll().then(res=>{
        if (res.data.errorCode ==200){
          this.companys = res.data.data;
        }
      })
    },
    searchAdmin(pageNum){
      this.param.pageNum = pageNum;
      this.currentPage = pageNum + 1;
      searchAdmin(this.param).then(response=>{
        let result = response.data.data;
        this.tableData = result.list;
        this.totalElements = result.total
      });
    },
    selectChanged(id){
      this.dialog.param.cid = id;
      selectByCid(this.dialog.param).then(res=>{
        this.roleTree = res.data.data;
      })
    },
    onSortChange(param) {
      this.param.sort = param.prop;
      this.param.order = param.order == "ascending" ? "ASC" : "DESC";
      this.getUserList(this.param.pageNum);
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection.push(val[i].id);
      }
    },
    handleCurrentChange(val) {
      this.param.pageNum = val;
      this.searchAdmin(this.param.pageNum);
    },
  }
}
</script>

<style scoped>

</style>
