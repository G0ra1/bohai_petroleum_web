<template>
  <div class="content_container">
    <div class="operate">
      <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
          <el-form-item label="项目部" >
            <selectTree  @select="getValue1" noOptionsText="暂无可选项目部" placeholder="请选择" v-model="departmentId" style="width: 150px" :normalizer="normalizer"  :multiple="false" :options="departments"  />
          </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchAccount(1)" icon="el-icon-search">查询</el-button>
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
        <el-table-column  prop="departmentName" label="所属项目部" header-align="center" align="center"></el-table-column>
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
        <el-form-item label="项目部" :label-width="formLabelWidth" prop="departmentId">
          <selectTree  noOptionsText="暂无可选项目部" placeholder="请选择" v-model="form.departmentId" style="width: 186px" :normalizer="normalizer"  :multiple="false" :options="departments"  />
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="roleId">
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
    <dialogue :show-dialog="showMsg" :msg="msg" @onOk="showMsg = false"></dialogue>
  </div>
</template>

<script>
import  { getRoleListByAdmin} from '@/api/role';
import {listToTree, copyProperties} from '@/utils'
import {getDepartments} from '@/api/department'
import  {addAccount,searchAccount,deleteById} from '@/api/admin';
import selectTree from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {Message} from "element-ui";
import {passwordValid }from '@/utils/passwordValid'
import dialogue from '../../components/dialogue'
import store from "../../store";
export default {
  components: {
    selectTree,
    dialogue,

  },
  name: "admin",
  data(){
    const validateDepartmentIds = (rule, value, callback) => {
      if (value == null || value.length == 0) {
        callback(new Error('请选择所属项目部'))
      } else {
        callback()
      }
    }
    const validateRoleId = (rule, value, callback) => {
      if (value == null || value.length == 0) {
        callback(new Error('请选择角色'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      let flag = passwordValid(this.form.jobNumber,value);
      if (flag != 'correct'){
        callback(new Error(flag))
      }else{
        callback();
      }
    }
    return{
      roleTree:[],
      showMsg:false,
      msg:'',
      departmentId: null,
      departments:[],
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
        departmentIds:[],
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
        departmentId:null,
        cid:'',
        roleId:'',
      },
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        jobNumber: [{required: true, trigger: 'blur', message: "请输入账号"}],
        password: [{required: true, trigger: 'blur', message: "请输入密码"}],
        departmentId: [{required: true, trigger: 'blur', validator: validateDepartmentIds}],
        roleId: [{required: true, trigger: 'blur', validator: validateRoleId}],
      },
    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.getDepartments();
    this.getRoleListByAdmin();
  },
  methods:{
    getValue1(value,id) {
      this.param.departmentIds = [];
      let data = [];
      data.push(value)
      this.param.departmentIds = this.getIds(this.param.departmentIds,data);
    },
    getIds(ids,data){
      for (let i = 0 ; i < data.length; i++){
        ids.push(data[i].id);
        if(data[i].children){
          ids = this.getIds(ids,data[i].children);
        }
      }
      return ids;
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
    openAddDialog(){
      this.dialogName = "添加";
      this.form = {
        id:null,
        name:'',
        jobNumber:'',
        password:'',
        departmentId:null,
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
            this.searchAccount(1);
          }
          this.$message.success(res.data.errorMsg);
        });
      });
    },
    submitForm(){
      this.$refs.dialogForm.validate(valid => {{
        if(valid){
          let flag = passwordValid(this.form.jobNumber,this.form.password);
          if (flag != 'correct'){
            this.$alert(flag);
          }else{
            addAccount(this.form).then(response=>{
              if(response.data.errorCode == 200){
                Message.success("操作成功");
                this.showDialog = false
                this.searchAccount(1);
              }else{
                Message.error(response.data.errorMsg);
              }
            });
          }
        }
      }})
    },
    handleMethod(ms) {
      this[ms]();
    },
    getDepartments(){
      getDepartments().then(res=>{
        if (res.data.errorCode ==200){
          this.departments = listToTree(res.data.data);
          this.searchAccount(1)
        }
      })
    },
    searchAccount(pageNum){
      this.param.pageNum = pageNum;
      this.currentPage = pageNum + 1;
      if (this.departmentId == null){
        this.param.departmentIds = [];
        this.param.departmentIds = this.getIds(this.param.departmentIds,this.departments)
      }
      // this.param.departmentIds = this.param.departmentIds + "";
      searchAccount(this.param).then(response=>{
        let result = response.data.data;
        this.tableData = result.list;
        this.totalElements = result.total
      });
    },
    getRoleListByAdmin(){
        getRoleListByAdmin().then(res=>{
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
      this.searchAccount(this.param.pageNum);
    },
  }
}
</script>

<style scoped>

</style>
