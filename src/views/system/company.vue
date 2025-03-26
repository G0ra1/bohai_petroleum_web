<template>
  <div class="content_container">
  <div class="operate">
    <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
               @click="handleMethod(item.methodd)">{{ item.name }}
    </el-button>
  </div>
    <div>
      <el-table :data="tableData" stripe border @sort-change="onSortChange" @selection-change="handleSelectionChange"
                cell-style="padding: 5px 0;"
                :header-cell-style="{background:'#e6e6e6'}"
                style="width: 100%"
                row-style="height:30px;">
        <el-table-column type="selection" header-align="center" align="center" width="55"></el-table-column>
        <el-table-column sortable="custom"  prop="code" label="公司编码" header-align="center" align="center"></el-table-column>
        <el-table-column  prop="name" label="名称" header-align="center" align="center"></el-table-column>
        <el-table-column  prop="userNumber" label="总人数" header-align="center" align="center"></el-table-column>
        <el-table-column  prop="authNumber" label="小程序人数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="deviceNumber" label="设备最大数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="adminNumber" label="管理员最大数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="visitor"  label="访客" :formatter="handleVisitor" header-align="center" align="center"></el-table-column>
        <el-table-column prop="thermometry"  label="测温" :formatter="handleThermometry" header-align="center" align="center"></el-table-column>
        <el-table-column prop="tourcode"  label="行程码" :formatter="handleTourcode" header-align="center" align="center"></el-table-column>
        <el-table-column prop="expireDate"  label="有效期" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="openUpdateDialog(scope.row)">修改</el-button>
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
          <el-form-item label="编码" prop="code">
            <el-input :disabled="isUpdate" v-model.trim="form.code"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="总人数" prop="userNumber">
            <el-input  v-model.trim="form.userNumber"></el-input>
          </el-form-item>
          <el-form-item label="小程序人数" prop="authNumber">
            <el-input v-model.trim="form.authNumber"></el-input>
          </el-form-item>
          <el-form-item label="设备数量" prop="deviceNumber">
            <el-input v-model.trim="form.deviceNumber"></el-input>
          </el-form-item>
          <el-form-item label="管理员数量" prop="adminNumber">
            <el-input v-model.trim="form.adminNumber"></el-input>
          </el-form-item>
          <el-form-item label="有效期" prop="expireDate">
            <el-input v-model.trim="form.expireDate"></el-input>
          </el-form-item>
          <el-form-item label="访客">
            <el-radio-group v-model="form.visitor">
              <el-radio label="true">有</el-radio>
              <el-radio label="false">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="测温">
            <el-radio-group v-model="form.thermometry">
              <el-radio label="true">有</el-radio>
              <el-radio label="false">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="行程码">
            <el-radio-group v-model="form.tourcode">
              <el-radio label="true">有</el-radio>
              <el-radio label="false">无</el-radio>
            </el-radio-group>
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
import Dialog from '../../components/Dialog/index';
import {add,search,update,deleteById} from '../../api/company'
export default {
  name: "company",
  components: {
    Dialog
  },
  data(){
    return{
      isUpdate:false,
      bttns:[],
      labelPosition: 'left',
      showDialog: false,
      dialogName:'添加',
      tableData: [],
      currentPage: 0,
      pageSize: 10,
      totalElements: 0,
      multipleSelection:[],
      param:{
        sort:'',
        order:'',
        pageNum:'',
        pageSize: '10'
      },
      form:{
        id:null,
        code:'',
        name:'',
        userNumber:'',
        deviceNumber:'',
        adminNumber:'',
        authNumber:'',
        visitor:null,
        thermometry:null,
        tourcode:null,
        expireDate:'all',
      },
      formRules: {
        code: [{required: true, trigger: 'blur', message: "请输入编码"}],
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        userNumber: [{required: true, trigger: 'blur', message: "请输入人员最大数"}],
        authNumber: [{required: true, trigger: 'blur', message: "请输入姓名"}],
        deviceNumber: [{required: true, trigger: 'blur', message: "请输入设备最大数"}],
        adminNumber: [{required: true, trigger: 'blur', message: "请输入管理员数量"}],
        expireDate: [{required: true, trigger: 'blur', message: "请输入日期"}],
      },
    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.search(1);
  },
  methods:{
    handleMethod(ms) {
      this[ms]();
    },
    handleVisitor(row){
      if (row.visitor === true){
          return "有"
      }else{
        return "无"
      }
    },
    handleThermometry(row){
      if (row.thermometry === true){
        return "有"
      }else{
        return "无"
      }
    },
    handleTourcode(row){
      if (row.tourcode === true){
        return "有"
      }else{
        return "无"
      }
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
      this.search(this.param.pageNum);
    },
    openAddDialog(){
      this.form = {
          id:null,
          code:'',
          name:'',
          userNumber:'',
          deviceNumber:'',
          adminNumber:'',
          authNumber:'',
          visitor:'true',
          thermometry:'true',
          tourcode:'true',
          expireDate:'all',
      };
      this.isUpdate = false;
      this.dialogName = '添加';
      this.showDialog = true;
      this.$refs.dialogForm.clearValidate();//清除校验结果
    },
    openUpdateDialog(row){
      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.form.visitor = row.visitor + "";
      this.form.thermometry = row.thermometry + "";
      this.form.tourcode = row.tourcode + "";
      this.isUpdate = true;
      this.dialogName = '修改';
      this.showDialog = true;
      this.$refs.dialogForm.clearValidate();//清除校验结果
    },
    submitForm() {
      this.$refs.dialogForm.validate(valid => {
        {
          if (!valid) {
            return;
          }
          if (this.dialogName.indexOf("添加") != -1) {//添加操作
           add(this.form).then(res=>{
             if (res.data.errorCode == 200){
               this.showDialog = false;
               this.$message.success("添加成功")
               this.search(1);
             }else{
               this.$message.error(res.data.errorMsg)
             }
           })
          } else {//修改操作
            update(this.form).then(res=>{
              if (res.data.errorCode == 200){
                this.showDialog = false;
                this.$message.success("修改成功")
                this.search(this.param.pageNum);
              }else{
                this.$message.error(res.data.errorMsg)
              }
            })
          }
        }
      })
    },
    deleteById(row) {
      this.$confirm('即将删除' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(row.id).then(res => {
          if (res.data.errorCode == 200) {
            this.search(1);
          }
          this.$message.success(res.data.errorMsg);
        });
      });
    },
    search(pageNum){
      this.param.pageNum = pageNum;
      this.currentPage = pageNum + 1;
      search(this.param).then(res=>{
        if (res.data.errorCode == 200){
          let result = res.data.data;
          this.tableData = result.list;
          this.totalElements = result.total
        }
      })
    }
  }
}
</script>

<style scoped>
.flex_container {
  min-height: calc(100vh - 84px);
  display: flex;
  display: -webkit-flex;
}


.tree_container {
  /*padding-top: 15px;*/
  width: 200px;
  border-right: 1px solid #dad8d8;
  /*position: fixed;*/

}

.content_container {
  /*width: calc(100% - 200px);*/
}


.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 36px;
  line-height: 36px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.table_image {
  height: 150px;
  max-height: 200px;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
