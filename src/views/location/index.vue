<template>
  <div class="content_container">
    <div class="content_title">
      <h3>位置管理</h3>
    </div>
    <div class="operate " >
      <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                 @click="handleMethod(item.methodd)">{{ item.name }}
      </el-button>
    </div>
    <div class="">
      <el-table
        :data="tableData"
        stripe
        border
        row-style="height:30px;"
        cell-style="padding: 5px 0;"
        :header-cell-style="{background:'#e6e6e6'}"
        style="width: 100%">
        <el-table-column
          prop="location"
          label="位置"
        >
        </el-table-column>

        <el-table-column
          prop="description"
          label="详细描述">
        </el-table-column>
        <el-table-column
          prop="deviceNum"
          label="设备数量"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>

        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="openUpdateDialog(scope.row)">修改
            </el-button>
            <el-button
              type="text"
              @click="onDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <div>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, prev, pager, next"
          :total="totalElements">
        </el-pagination>
      </div>
    </div>
    <Dialog v-show="dialog1.showDialog" :dialog-option="dialog1.dialogOption" @cancel="dialog1.showDialog = false" @submit="onSubmit()" ref="dialog">
      <div slot="name1">

        <el-form :label-position="dialog1.labelPosition"  ref="dialogForm" :rules="formRules" :model="dialog1.form" label-width="100px" size="mini">
          <el-form-item label="位置" prop="location">
            <el-input v-model.trim="dialog1.form.location" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="详细描述" prop="description"  >
            <el-input v-model.trim="dialog1.form.description" autocomplete="off" ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Dialog>


  </div>
</template>

<script>
import {getLocationListPage,addOrUpdateLocation,deleteLocation} from '@/api/location'
import Dialog from '@/components/dialog/index';
import { Message } from 'element-ui'
import {dateFormat} from '@/utils/DateUtil'
export default {
  name: "index",
  components: {
    Dialog,
  },
  created(){
    this.bttns = this.$route.meta.btnPermission;
    this.onSelect();
  },
  data() {
    return {
      bttns:[],
      dialogFormVisible:false,
      formLabelWidth:'130px',
      form: {
        pageNum: 1,
        pageSize: '10'
      },
      dialog1:{
        // labelPosition:'left',
        showDialog:false,
        dialogOption:{
          title: '添加位置',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        },
        form:{
          location:'',
          description:'',
        }
      },
      formRules: {
        location: [{required: true, trigger: 'blur', message: "请输入位置"}],

      },

      tableData: [],
      currentPage: 5,
      pageSize: 10,
      totalElements: 0
    }
  },
  methods:{
    dateFormat,
    handleMethod(ms) {
      this[ms]();
    },
    openAddDialog(){
      this.dialog1.showDialog = true;
      this.dialog1.dialogOption.title =  '添加位置';

      this.dialog1.form = {

      },
        this.$refs.dialogForm.clearValidate();//清除校验结果
    },
    openUpdateDialog(row){
      this.dialog1.showDialog = true;
      this.dialog1.dialogOption.title =  '修改位置';

      this.dialog1.form =JSON.parse(JSON.stringify(row)) ;//解除数据绑定
      this.$refs.dialogForm.clearValidate();//清除校验结果
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.onSelect();
    },
    onSelect(){
      getLocationListPage(this.form).then(response => {
        let result = response.data.data;
        this.tableData = result.list;
        this.pageSize = result.pageSize;
        this.totalElements = result.total
      })
    },

    onDelete (row){
      this.$confirm('即将删除'+row.location+', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteLocation(row.id).then(response=>{
          if(response.data.errorCode == 200){
            Message.success("操作成功");
            this.onSelect();
          }else{
            Message.error(response.data.errorMsg);
          }
        });
      });
    },

    onSubmit(){
      this.$refs.dialogForm.validate(valid => {
        if(valid){

          addOrUpdateLocation( this.dialog1.form).then(response=>{
            if(response.data.errorCode == 200){
              Message.success("操作成功");
              this.dialog1.showDialog  = false,
                this.onSelect();
            }else{
              Message.error(response.data.errorMsg);
            }
          });

        }
      });
    },
  }
}
</script>

<style scoped>

</style>
