<template>
  <div class="content_container">
    <h3>
      角色管理
    </h3>
    <div class="operate" >
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
          <el-button type="primary" @click="getRoleList(1)" icon="el-icon-search">查询</el-button>
          <el-button style="margin-bottom: 20px" v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                     @click="handleMethod(item.methodd)">{{ item.name }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="tableData"
        stripe
        border
        :header-cell-style="{background:'#e6e6e6'}"
        style="width: 100%"
        cell-style="padding: 5px 0;"
        row-style="height:30px">
        <el-table-column
          prop="name"
          label="角色名"
          width="150px"
        >
        </el-table-column>
        <el-table-column
          prop="permissionName"
          width="550px"
          label="权限">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="checkRole(scope.row)">查看权限</el-button>
            <el-button
              type="text"

              @click="openUpdateRole(scope.row)">修改</el-button>
            <el-button
              type="text"

              @click="deleteOption(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage"
                       :page-size="param.pageSize"
                       :pager-count="5"
                       layout="total, prev, pager, next"
                       :total="totalElements">
        </el-pagination>
      </div>
    </div>

    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="resetForm" center>
      <el-form :model="form"   ref="roleForm" :rules="roleRules" >
        <el-form-item label="角色名" :label-width="formLabelWidth"  prop="name">
          <el-input v-model.trim="form.name" autocomplete="off"></el-input>
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
        <el-form-item label="父节点" :label-width="formLabelWidth" >
          <el-cascader
            :options="roleTree"
            :props="defaultProps1"
            v-model="form.parent"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item label="角色类型" :label-width="formLabelWidth">
          <el-select v-model.trim="form.code" placeholder="请选择角色类型" style="width: 100%;">
            <el-option label="超级管理员" value="sysRole"></el-option>
            <el-option label="管理员" value="role"></el-option>
            <el-option label="普通账号" value="account"></el-option>
            <el-option label="员工" value="employee"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth"  prop="description">
          <el-input   type="textarea" v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth"  prop="permission">
          <div style="max-height: 100px;overflow: hidden;overflow-y:scroll;">
            <el-tree
              :data="permissionList"
              show-checkbox
              :check-strictly="checkStrictly"
              node-key="id"
              ref="tree"
              :default-checked-keys="form.permissionIds"
              :props="defaultProps">
            </el-tree>
          </div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" v-if="isConfrim" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import  { getRoleList,getPermissionList,addRole,deleteRole,selectByCid,deleteById} from '@/api/role';
import {formatDate} from '@/utils/DateUtil';
import {selectAll} from '@/api/company'
import { listToTree } from '@/utils'
import { Message } from 'element-ui'
export default {
  name: "administrator",
  created(){
    this.bttns = this.$route.meta.btnPermission;
    this.getRoleList();
    this.getPermissionList();
    this.selectCompany();
  },
  mounted() {
    this.$refs.dialog.open();
    setTimeout(() => {
      this.$refs.dialog.close();
    }, 2000);
  },
  data(){
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的角色名'))
      } else {
        callback()
      }
    }

    return{
      currentPage:0,
      roleTree:[],
      checkStrictly:false,
      isConfrim:true,
      companys:[],
      bttns:[],
      dialogName:"添加角色",
      formLabelWidth: '120px',
      dialogFormVisible:false,
      totalElements: 0,
      tableData:[],
      defaultProps1: {
        value: 'id',
        label: 'name'
      },
      form:{
        id:'',
        cid:'',
        parent:'',
        code:'',
        name:'',
        description:'',
        permissionIds:[],
      },
      param:{
        cid:null,
        pageNum: 1,
        pageSize: 10,
        sort: '',
        order: '',
      },
      dialog:{
        param:{
          cid:null,
        }
      },
      options:[],
      roleRules: {
        name: [{required: true, trigger: 'blur', validator: validateUsername}],
        cid: [{required: true, trigger: 'blur', validator: "请选择公司"}],

      },

      permissionList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  methods:{
    selectCompany(){
      selectAll().then(res=>{
        if (res.data.errorCode ==200){
          this.companys = res.data.data;
        }
      })
    },
    selectChanged(id){
      this.dialog.param.cid = id;
      selectByCid(this.dialog.param).then(res=>{
        let result = res.data.data;
        this.roleTree = listToTree(result);
      })
    },
    handleCurrentChange(val) {
      this.param.pageNum = val;
      this.getRoleList(this.param.pageNum);
    },
    dateFormat(row, column){
      const time = formatDate(new Date(row.lastLoginTime),"yyyy-MM-dd hh:mm:ss");
      return time;
    },
    getRoleList(pageNum){
      this.param.pageNum = pageNum;
      this.currentPage = pageNum + 1;
      getRoleList(this.param).then(response=>{
        let result = response.data.data;
        this.tableData = result.list;
        this.totalElements = result.total
      });
    },
    getPermissionList(){
      getPermissionList().then(response=>{
        let permissions = response.data.data;
        this.permissionList = listToTree(permissions);
      });
    },
    addRole(){
      let treeNode =  this.$refs.tree.getCheckedNodes();
      if(treeNode == null || treeNode.length == 0){
        this.$message.error("请选择权限");
        return;
      }
      if (this.form.cid == null || this.form.cid == ''){
        this.$message.error("请选择所属公司");
        return ;
      }
      if (this.form.code == null || this.form.code == ''){
        this.$message.error("请选择角色类型");
        return ;
      }
      if (this.form.parent == null || this.form.parent == ''){
        this.form.parent = 0;
      }else{
        this.form.parent = this.form.parent[0];
      }
      this.form.permissionIds=[];
      for(let i = 0 ;i< treeNode.length;i++){
        this.form.permissionIds.push(treeNode[i].id);
      }
      // this.form.permission = treeNode;
      let $qs = require('querystring') //nodejs自带querystring模块
      let data = $qs.stringify(this.form);
      this.$refs.roleForm.validate(valid => {{
        if(valid){
          addRole(this.form).then(response=>{
            if(response.data.errorCode == 200){
              Message.success("操作成功");
              this.dialogFormVisible = false
              this.getRoleList();
            }else{
              Message.error(response.data.errorMsg);
            }
          });
        }
      }})
    },
    openUpdateRole(row){
      this.isConfrim = true;
      this.dialogName = "修改角色";
      this.dialogFormVisible = true;
      this.checkStrictly = true,  //给树节点赋值之前，先设置为true
        this.$nextTick(() => {
          this.form =  JSON.parse(JSON.stringify(row)) ;//解除数据绑定;
          this.$refs.tree.setCheckedNodes(this.form.permissionIds) //给树节点赋值
          this.checkStrictly = false //重点： 赋值完成后 设置为false
        })

    },
    checkRole(row){
      this.form = {};
      this.isConfrim = false;
      this.dialogName = "查询权限";
      this.dialogFormVisible = true;
      this.checkStrictly = true,  //给树节点赋值之前，先设置为true
      this.$nextTick(() => {
        this.form =  JSON.parse(JSON.stringify(row)) ;//解除数据绑定;
        this.$refs.tree.setCheckedNodes(this.form.permissionIds) //给树节点赋值
        this.checkStrictly = false //重点： 赋值完成后 设置为false
      })
      // this.$refs.tree.setCheckedKeys(this.form.permissionIds);
      // this.checkStrictly = false;    //赋值完成后设置为false
    },
    openAddRole(){
      this.isConfrim = true;
      this.dialogName = "添加角色";
      this.dialogFormVisible = true;
      this.form = {
        id:'',
        cid:'',
        parent:'',
        code:'',
        name:'',
        description:'',
        permissionIds:[],
      }
    },
    handleMethod(ms) {
      this[ms]();
    },
    resetForm(){
      this.$refs.tree.setCheckedKeys([]);
    },
    deleteOption(row){
      this.$confirm('即将删除'+row.name+', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        // Message.success("操作成功");
        deleteRole(row.id).then(response=>{
          if(response.data.errorCode == 200){
            Message.success("操作成功");
            this.getRoleList();
          }else{
            Message.error(response.data.errorMsg);
          }
        });
      });
    },


  }
}
</script>

<style scoped>
.el-dialog .el-input, .el-dialog .el-select, .el-dialog .el-textarea  {
  width: 300px;
}
</style>



