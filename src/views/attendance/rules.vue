<template>
  <div class="content_container">
    <div class="operate " >
      <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                 @click="handleMethod(item.methodd)">{{ item.name }}
      </el-button>
    </div>
    <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
      <el-form-item label="名称">
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
        <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
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
               label-width="105px" size="mini">
        <el-form-item label="名称" prop="name">
          <el-input :disabled="isUpdate" style="width: 220px" v-model="form.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="上班时间"  prop="startTime">
          <el-time-picker
            v-model="form.startTime"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="选择时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="下班时间" style="margin-right: 100px" prop="startTime">
          <el-time-picker
            v-model="form.endTime"
            format="HH:mm"
            value-format="HH:mm"
            @change="endTime"
            placeholder="选择时间">
          </el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRules">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addRules,searchRulesPage,updateRules,batchDelete} from '@/api/attendanceRules'
import {formatDate} from '@/utils/DateUtil'
export default {
  name: "index",
  components: {
  },

  data(){
    const validateStartTime = (rule, value, callback) => {
      if (value == null || value.length == 0) {
        callback(new Error('请选择上班时间'))
      } else {
        callback()
      }
    }
    const validateEndTime = (rule, value, callback) => {
      if (value == null || value.length == 0) {
        callback(new Error('请选择下班时间'))
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
        name:'',
        startTime:'',
        endTime:'',
      },
      formRules:{
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        startTime: [{required: true, trigger: 'blur', validator: validateStartTime}],
        endTime: [{required: true, trigger: 'blur', validator: validateEndTime}],
      },
      tableData: [],
      multipleSelection:[],
      bttns:[],
      showDialog:false,
      totalElements: 0,
      currentPage: 0,
      pageSize: 10,
      labelPosition:'center',
      dialogName:'新增规则',
      isUpdate:false,
    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.searchPage(1)
  },
  methods:{
    openAddDialog(){
      this.form = {
        name:'',
          startTime:'',
          endTime:'',
      }
      this.dialogName ='新增规则';
      this.isUpdate = false;
      this.showDialog = true;
      this.$refs.dialogForm.clearValidate();//清除校验结果
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
      this.$refs.dialogForm.clearValidate();//清除校验结果
      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.dialogName ='修改规则',
      this.isUpdate = true;
      this.showDialog = true;
    },
    addRules(){
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;
        }
        let date = new Date();
        let sdf = formatDate(date,"yyyy-MM-dd")
        let startTime = new Date(sdf + " " + this.form.startTime);
        let endTime = new Date(sdf + " " + this.form.endTime);
        if (endTime.getTime() <= startTime.getTime()){
          this.$message.error("下班时间不可小于等于上班时间")
          return ;
        }
        if (this.dialogName.indexOf("新增") != -1){
          addRules(this.form).then(res=>{
            if (res.data.errorCode == 200){
              this.$message.success("操作成功")
              this.showDialog = false;
              this.searchPage(1)
            }else{
              this.$message.error(res.data.errorMsg);
            }
          })
        }else{
          updateRules(this.form).then(res=>{
            if (res.data.errorCode == 200){
              this.$message.success("操作成功")
              this.showDialog = false;
              this.searchPage(1)
            }else{
              this.$message.error(res.data.errorMsg);
            }
          })
        }
      })
    },
    batchDelete(){
      if (this.multipleSelection.length == 0){
        this.$message.error("请选择数据");
        return;
      }
      this.$confirm('共选中' + this.multipleSelection.length + "数据", '是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDelete(this.multipleSelection + "").then(res=>{
          if (res.data.errorCode == 200){
            this.$message.success("操作成功");
            this.searchPage(1);
          }else{
            this.$message.error(res.data.errorMsg)
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
      searchRulesPage(this.param).then(response=>{
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
