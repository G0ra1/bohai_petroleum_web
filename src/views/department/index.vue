<template>
  <div class="content_container">
    <div class="content_title">
      <h3>项目部管理</h3>
    </div>
    <div class="operate" >
      <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
        <el-form-item label="项目部名称">
          <el-input v-model="param.name" placeholder="请输入项目部名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDepartments" icon="el-icon-search">查询</el-button>
          <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                     @click="handleMethod(item.methodd)">{{ item.name }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="flex-direction: row">
      <tree-table :data="data" :columns="columns" :options="tableOption"  border/>
    </div>
    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center >
      <el-form :label-position="'left'" :model="form" :rules="formRules"  ref="form" :label-width="formLabelWidth">
        <el-form-item label="项目部名称" prop="name">
          <el-input v-model.trim="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="自动生成机构编码">-->
          <!--<el-switch v-model="form.autoSN" @change="autoSNChange"></el-switch>-->
        <!--</el-form-item>-->
        <el-form-item label="联系人" prop="linkman"  >
          <el-input v-model.trim="form.linkman" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone"  >
          <el-input v-model.trim="form.phone" autocomplete="off" ></el-input>
        </el-form-item>
        <!--<el-form-item label="机构编码" prop="seriesNumber"  >-->
          <!--<el-input v-model.trim="form.seriesNumber" autocomplete="off" :disabled="form.autoSN"></el-input>-->
        <!--</el-form-item>-->
<!--        <el-form-item label="是否根机构">-->
<!--          <el-switch active-value="1" inactive-value="0" v-model="form.isRoot"></el-switch>-->
<!--        </el-form-item>-->
        <el-form-item label="父节点" :label-width="formLabelWidth" >
          <el-cascader
            :options="data"
            :props="defaultProps"
            v-model="form.parents"
            :disabled="isCascader"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="departmentConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


  import treeTable from '@/components/TreeTable'
  import {getDepartments,addDepartment,deleteDepartment,updateDepartment} from '@/api/department'
  import { listToTree,copyProperties } from '@/utils'
  import { Message } from 'element-ui'
  import store from '../../store'

  export default {
    name: "index",
    components: { treeTable },
    created(){
      this.userInfo = store.getters.userInfo;
      if (this.userInfo.departmentId == 0){
        this.isa = false
      }else{
        this.isa = true
      }
      this.bttns = this.$route.meta.btnPermission;
      this.getDepartments();
    },
    data() {
      //添加机构方法
      const addDepartmentOpen = (row)=>{
        this.dialogName = "添加项目部";
        this.dialogFormVisible = true;

        this.form = {
            id:'',
            name:'',
            parent:'',
            linkman:'',
             phone:'',
            parents:[],
            seriesNumber:'',
            isRoot:'0'
        }
        this.isCascader = true;
        let tempArr = row.level.split(".");
        tempArr.splice(0,1);
        tempArr.push(row.id);
        this.form.parents = tempArr.map(Number);
        this.$refs.form.clearValidate();//清除校验结果
      }
      //打开修改机构弹窗
      let updateDepartmentOpen = (row)=>{
        let tempForm = {
          id:'',
          name:'',
          parent:'',
          linkman:'',
          phone:'',
          parents:[],
          seriesNumber:'',
          isRoot:'0',
          createTime:''
        }
        this.dialogName = "修改机构";
        this.dialogFormVisible = true;
        this.isCascader = true;
        this.form = copyProperties(row,tempForm);
        let tempArr = row.level.split(".");
        tempArr.splice(0,1);
        tempArr.pop()
        // tempArr.push(row.id);
        this.form.parents = tempArr.map(Number);
        //this.form.parent = '';
        this.$refs.form.clearValidate();//清除校验结果
      }
      const deleteDepartmentOption = (row)=>{

        this.$confirm('即将删除'+row.name+', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          deleteDepartment(row.id).then(response=>{
            if(response.data.errorCode == 200){
              Message.success("操作成功");
              this.getDepartments();
            }else{
              Message.error(response.data.errorMsg)
            }
          });
        });
      }

      const deleteIsShow = (row)=>{

       let flag =  !row.children || row.children.length == 0;
       return flag;
      }
      const alwaysShow = (row)=>{
        return true;
      }
      return {
        bttns:[],
        param:{
          name:''
        },
        isCascader:false,
        isa:false,
        userInfo:null,
        autoSN:false,
        dialogFormVisible:false,
        formLabelWidth:'130px',
        dialogName:'添加项目部',
        form:{
          id:'',
          name:'',
          parent:'',
          linkman:'',
          phone:'',
          parents:[],
          seriesNumber:'',
          isRoot:'0',
        },
        columns: [
          {
            text: '机构名称',
            value: 'name',
            width: 250
          },
          // {
          //   text: '编码',
          //   value: 'seriesNumber'
          // },
          {
            text: '联系人',
            value: 'linkman'
          },
          {
            text: '联系电话',
            value: 'phone'
          },
          // {
          //   text: '创建时间',
          //   value: 'createTime'
          // },

        ],
        departments:[],
        data: [],
        tableOption:[{
          text:'添加',
          onclick:addDepartmentOpen,
          isShow:alwaysShow,
        },
          {
            text:'修改',
            onclick:updateDepartmentOpen,
            isShow:alwaysShow,
          },
          {
            text:'删除',
            onclick:deleteDepartmentOption,
            isShow:deleteIsShow,
          }
        ],
        formRules: {
          name: [{required: true, trigger: 'blur', message: "请输入机构名称"}],
          // seriesNumber:[{required: true,trigger: 'blur', validator: validateSeriesNumber}],

        },
        defaultProps: {
          value: 'id',
          label: 'name'
        },

      }

    },
    methods:{
      handleMethod(ms) {
        this[ms]();
      },
      getDepartments(){
        getDepartments(this.param).then(response => {
            let result = response.data.data;
            this.departments = result;
            this.data = listToTree(result);

        })
      },
        //添加机构方法
        addDepartmentOpen (){
            this.dialogName = "添加项目部";
            this.dialogFormVisible = true;
            this.form = {
                id:'',
                name:'',
                parent:'',
                linkman:'',
                phone:'',
                parents:[],
                seriesNumber:'',
                isRoot:'0'
            }
            if(this.data.length == 0){
                this.form.isRoot = '1';
            }
        },
      departmentConfirm(){
        if (this.form.parents == null || this.form.parents.length ==0){
          Message.info("请选择父节点")
          return;
        }
        this.$refs.form.validate(valid => {
          if(valid){
            if(this.dialogName.indexOf("添加") != -1){//添加机构
              addDepartment( this.form).then(response=>{
                if(response.data.errorCode == 200){
                  Message.success("操作成功");
                  this.dialogFormVisible = false,
                    this.getDepartments();
                }else{
                  Message.error(response.data.errorMsg);
                }
              });
            }else{//修改机构
              // let $qs = require('querystring') //nodejs自带querystring模块
              // let data = $qs.stringify(this.form);
              updateDepartment( this.form).then(response=>{
                if(response.data.errorCode == 200){
                  Message.success("操作成功");
                  this.dialogFormVisible = false,
                    this.getDepartments();
                }else{
                  Message.error(response.data.errorMsg);
                }
              });
            }
          }
        });
      },
      autoSNChange(value){//是否自动生成编码的开关变化事件
       if(value){//如果是自动生成编码
         this.form.seriesNumber = '';
         this.$refs.form.clearValidate("seriesNumber");//清除校验结果
       }

      },


    }
  }
</script>

<style scoped>

  .el-pagination{
    float: right;
  }
</style>
