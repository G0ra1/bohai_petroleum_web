<template>
  <div class="flex_container">
    <div class="tree_container ">
      <div class="location_content">
        <el-row style="    background: #e6e6e6;    padding: 10px 20px; font-size: 15px;   font-weight: bold;">位置列表
        </el-row>
        <!--<div class="padding_left_20">位置列表</div>-->
        <el-tree
          show-checkbox
          ref="locationTree"
          node-key="id"
          :data="location"
          :props="locationProps"
          :default-checked-keys="defaultCheckedKeys"
          @check-change="locationOnCheck"></el-tree>
      </div>
    </div>
    <div class="content_container">
      <div class="operate">
        <div style="margin-bottom: 20px">
          <el-button
            v-show="currentDiv=='view'"
            size="mini"
            type="primary"
            @click="currentDiv='auth'"
            icon="el-icon-circle-plus-outline"
          >添加授权
          </el-button>
          <el-button
            size="mini"
            type="info"
            v-show="currentDiv=='view'"
            icon="el-icon-upload"
            @click="addExcel"
          >导入excel</el-button>
          <el-button
            v-show="currentDiv=='auth'"
            size="mini"
            type="success"
            @click="authConfirm"
          >确认授权
          </el-button>
          <el-button
            v-show="currentDiv=='auth'"
            size="mini"
            @click="currentDiv='view'"
          >取消
          </el-button>

          <el-switch
            v-show="currentDiv=='auth' && authType == 0"
            v-model="authType"
            @change="authTypeChange"
            active-value="0"
            inactive-value="1"
            active-text="按机构"
            inactive-text="按人员">
          </el-switch>
          <el-button v-show="currentDiv=='view'" type="danger" icon="el-icon-delete" size="mini"
                     @click="batchDeleteUserOption">批量撤销
          </el-button>
        </div>
        <div v-show="currentDiv=='view'">
          <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
            <el-form-item label="机构" prop="departmentId">
              <selectTree  @select="getValue1" noOptionsText="暂无可选机构" placeholder="请选择" v-model="departmentId" style="width: 150px" :normalizer="normalizer"  :multiple="false" :options="departments"  />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="param.name" placeholder="请输入姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="工号">
              <el-input v-model="param.jobNumber" placeholder="请输入工号" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getUserList(1)" icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

      </div>

      <div class="auth_view_content" v-show="currentDiv=='view'">
        <el-table
          :data="tableData"
          stripe
          border
          @selection-change="handleSelectionChange"
          :header-cell-style="{background:'#e6e6e6'}"
          row-style="height:30px;"
          cell-style="padding: 5px 0;"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="departmentName"
            label="机构">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
          >
          </el-table-column>
          <el-table-column
            prop="jobNumber"
            label="工号"
          >
          </el-table-column>
          <el-table-column
            prop="position"
            label="职位"
          >
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号">
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
      <div class="auth_content" v-show="currentDiv=='auth'">
        <el-row>
          <el-col :span="8" v-show="authType==1">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>组织机构</span>
              </div>
              <el-tree ref="departmentTree" node-key="id" default-expand-all :data="departments" :props="defaultProps"
                       show-checkbox @check-change="handleNodeChecked"></el-tree>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-transfer
              :titles="transferTitle"
              :props="transferProps"
              v-model="transferedData"
              :data="transferData">
              <!--<el-button class="transfer-footer text-right" slot="right-footer" size="small">确认</el-button>-->
            </el-transfer>
            <el-pagination
              background
              @current-change="handleCurrentChange1"
              :current-page.sync="currentPage1"
              :page-size="pageSize1"
              :pager-count="5"
              style="float: left"
              layout="total, prev, pager, next, jumper"
              :total="totalElements1">
            </el-pagination>
          </el-col>
        </el-row>
      </div>

    </div>
    <el-dialog :title="excelDialogName" :visible.sync="dialogFormVisible1" @close="" center>
      <el-form :model="batchForm1"   ref="batchForm" >
        <el-form-item label="选择文件"  :label-width="formLabelWidth" >
          <el-upload
            class="upload-demo"
            ref="upload"
            drag = 'true'
            action=""
            :on-change="handlePreview1"
            :file-list="fileList1"
            limit="1"
            :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">请<em>选择文件</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item  :label-width="formLabelWidth" >
          <el-button  size="small" icon="el-icon-download" @click="downloadTemplates">模板下载</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="addUserBatch1">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { auth,addExcelAuth} from '@/api/device'
import {getLocationList} from '@/api/location'

import {validateIp} from '@/utils/validate'
import {getDepartments} from '@/api/department'
import {listToTree} from '@/utils'
import {validatePhone} from '@/utils/validate'
import selectTree from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  getAuthUserInfoList,
  getUserInfoListByDepartments,
  batchdeleteAuthUser
} from '@/api/user'
import Dialog from '@/components/dialog/index';
import {Message} from 'element-ui'

export default {
  name: "auth",
  components: {
    Dialog,
    selectTree
  },
  created() {
    this.onSelect();
    this.getDepartments();
    this.getLocationList();
  },
  mounted() {
    // const timer = setInterval(
    //   this.getBatchinfo
    //   ,2000);
    // this.$once('hook:beforeDestroy', () => {//销毁清除定时任务
    //
    //   clearInterval(timer);
    // })
  },
  data() {
    const validateDepartmentIds = (rule, value, callback) => {
      if (value == null || value.length == 0) {
        callback(new Error('请选择所属机构'))
      } else {
        callback()
      }
    }
    return {
      batchParam1:{},
      batchForm1:{

      },
      formLabelWidth:'30%',
      excelDialogName:'导入授权',
      fileList1:[],
      departmentId:null,
      centerDialogVisible: false,
      timerTask: {},
      batchTask: [],
      multipleSelection: [],
      location: [],
      defaultCheckedKeys: [],//默认选中的设备
      lastCheckedId: '',//上次被选中的id
      transferTitle: ['可选人员', '已选人员'],
      transferData: [],
      transferedData: [],
      transferProps: {
        key: 'id',
        label: 'name',
      },
      checkEventLock: true,
      authType: '',
      currentDiv: 'view',
      treeData: [],
      departments: [],
      locationProps: {
        children: 'children',
        label: 'location'
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      param: {
        deviceId: '',
        locationId: '',
        name:'',
        jobNumber:'',
        departmentIds:'',
        pageNum: '',
        pageSize: '10'
      },

      autoParam: {
        departmentIds:[],
        deviceId: '',
        locationId: '',
        pageNum: '',
        pageSize: '10'
      },
      tableData: [],
      currentPage: 5,
      pageSize: 10,
      totalElements: 0,
      currentPage1: 5,
      pageSize1: 10,
      totalElements1: 0,
      dialogFormVisible1 : false,
      isFile1:false,
      dialog1: {
        showDialog: false,
        dialogOption: {
          title: '添加人员',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        },
        form: {
          id: '',
          name: '',
          phone: '',
          email: '',
          jobNumber: '',
          position: '',
          departmentIds: [],
        }
      },
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入姓名"}],
        jobNumber: [{required: true, trigger: 'blur', message: "请输入工号"}],
        position: [{required: true, trigger: 'blur', message: "请输入职位"}],
        phone: [
          {required: true, trigger: 'blur', message: "请输入电话"},
          {validator: validatePhone, trigger: "blur"}
        ],
        departmentIds: [{required: true, trigger: 'blur', validator: validateDepartmentIds}],
      },
    };
  },
  watch: {
    'centerDialogVisible': function (newVal) {
      if (newVal) {
        this.timerTask = this.timer()
      } else {
        clearInterval(this.timerTask);
      }
    },
  },

  methods: {
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
    addExcel(){
      this.dialogFormVisible1 = true;
      this.isFile1 = false;
    },
    //文件选中
    handlePreview1(file){
      let fileName = file.name;
      if (!/\.(xls|xlsx)$/.test(fileName.toLowerCase())){
        Message.error("上传格式不正确，请上传xls或者xlsx格式")
        this.isFile1 = false;
        return false;
      }
      this.isFile1 = true;
      this.batchParam1 = new FormData();
      this.batchParam1.append('file', file.raw, file.name);
      return false;
    },
    //下载模板
    downloadTemplates(){
      window.location.href=process.env.BASE_API+"temp/上传模板.xlsx";
    },
    //批量添加用户
    addUserBatch1(){
      if (!this.isFile1){
        Message.error("请选择正确的文件")
        return;
      }
      // debugger
      if(typeof this.batchParam1 == "FormData" && this.batchParam1.get(file) != null){
        Message.warning("请先选择文件");
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: '上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      addExcelAuth(this.batchParam1).then(response=>{
        if(response.data.errorCode == 200){
          Message.success(response.data.errorMsg);
          this.getUserList(1);
          loading.close();
          this.dialogFormVisible1=false;
        }else{
          loading.close();
          Message.error(response.data.errorMsg);
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection.push(val[i].id);
      }
    },

    locationOnCheck(item, checked) {
      if (checked) {
        this.param.locationId = item.id;
        this.$refs.locationTree.setCheckedKeys([item.id]);
        if( this.currentDiv == 'view') {//预览视图
          this.param.pageNum = 1;
          this.getUserList(1);
        }else if( this.currentDiv =='auth'){//授权视图
          this.handleNodeChecked();
        }
      } else {
        if (this.param.locationId == item.id) {
          this.$refs.locationTree.setCheckedKeys([item.id]);
        }
      }


    },
    authTypeChange(type) {//授权类型修改时触发
      if (type == 0) {//按部门授权
        this.transferTitle = ['可选机构', '已选机构'];
        this.transferData = this.departments;

      } else {
        this.transferTitle = ['可选人员', '已选人员'];
      }

    },
    onSelect() {
      getLocationList().then(response => {
        this.location = response.data.data;
        this.defaultCheckedKeys = [this.location[0].id];
        this.param.locationId = this.location[0].id;
        this.param.pageNum = 1;
        this.getUserList(1);
      })

    },

    handleCurrentChange(val) {
      this.param.pageNum = val;
      this.getUserList(this.param.pageNum);
    },
    handleCurrentChange1(val) {
      this.autoParam.pageNum = val;
      this.handleNodeChecked(this.autoParam.pageNum);
    },
    getDepartments() {
      getDepartments().then(response => {
        let result = response.data.data;
        this.departments = listToTree(result);
      })
    },
    getUserList(start) {
      this.param.pageNum = start;
      this.currentPage = start + 1;
      if (this.departmentId == null){
        this.param.departmentIds = [];
        this.param.departmentIds = this.getIds(this.param.departmentIds,this.departments)
      }
      this.param.departmentIds = this.param.departmentIds + "";
      getAuthUserInfoList(this.param).then(response => {
        let result = response.data.data;
        this.tableData = result.list;
        this.pageSize = result.pageSize;
        this.totalElements = result.total
      })
    },

    handleNodeChecked(start) {//部门选中时的触发事件
      if (this.authType == 1 && this.checkEventLock) {
        this.checkEventLock = false;
        let nodes = this.$refs.departmentTree.getCheckedKeys();
        if(nodes.length == 0){
          this.transferData = [];
          this.checkEventLock = true;
          return;
        }
        this.autoParam.departmentIds = nodes;
        this.autoParam.locationId = this.param.locationId;
        getUserInfoListByDepartments(this.autoParam).then(response => {
          let result = response.data.data;
          this.pageSize1 = result.pageSize;
          this.totalElements1 = result.total
          this.transferData = result.list;
          this.checkEventLock = true;
        });
      }
    },
    batchDeleteUserOption() {
      if (this.multipleSelection.length == 0) {
        Message.error("请先选择人员");
        return;
      }
      this.$confirm('即将撤销' + this.multipleSelection.length + '个人员的授权, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          locationId: this.param.locationId,
          userId: this.multipleSelection + "",
        }
        batchdeleteAuthUser(param).then(response => {
          if (response.data.errorCode == 200) {
            Message.success("操作成功");
            this.param.pageNum = 1;
            this.getUserList(1);
          } else {
            Message.error(response.data.errorMsg)
          }
        });
      });
    },
    openAddDialog() {
      this.dialog1.form = {
        id: '',
        name: '',
        phone: '',
        email: '',
        jobNumber: '',
        position: '',
        departmentIds: [],
      }
      this.dialog1.showDialog = true;
      this.dialog1.dialogOption.title = '添加人员';
      this.$refs.dialogForm.clearValidate();//清除校验结果
    },
    openUpdateDialog(row) {
      this.dialog1.showDialog = true;
      this.dialog1.dialogOption.title = '修改人员';
      this.dialog1.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      if (row.departmentIds != null && row.departmentIds != "") {
        this.dialog1.form.departmentIds = row.departmentIds.split(",").map(Number);
      } else {
        this.dialog1.form.departmentIds = [];
      }

      this.$refs.dialogForm.clearValidate();//清除校验结果

    },
    cancelOperate() {
    },
    //提交授权信息
    authConfirm() {
      // let devices = this.$refs.deviceTree.getCheckedKeys();//获取已选择的设备
      // if (devices == null || devices.length == 0) {
      //   Message.warning("请先选择设备");
      //   return;
      // }

      let locations = this.$refs.locationTree.getCheckedKeys();//获取已选择的设备
      if (locations == null || locations.length == 0) {
        Message.warning("请先选择位置");
        return;
      }

      if (this.transferedData.length == 0) {
        Message.warning("请选择授权人员");
        return;
      }

      const param = {
        // devices: devices,
        locationIds: locations,
        userIds: this.transferedData
      }
      auth(param).then(response => {

        if (response.data.errorCode == 200) {
          this.transferedData = [];
          // Message.success("操作成功");
          this.currentDiv = 'view';
          this.centerDialogVisible = true;
          this.param.pageNum = 1;
          this.getUserList(1);
          this.handleNodeChecked();
        } else {
          Message.error(response.data.errorMsg)
        }

      });


    },

  }

}
</script>
<style>
.el-transfer-panel__body, .el-transfer-panel__list {
  height: 400px;
}
</style>

<style scoped>

.box-card {
  width: 220px;
  height: 442px;
  max-width: 300px;
  overflow-x: auto;
  overflow-y: auto;

}

.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}

.flex_container {
  min-height: calc(100vh - 84px);
  display: flex;
  display: -webkit-flex;
}

.padding_left_20 {
  padding-left: 22px;
  margin-bottom: 5px;
}

.tree_container {
  width: 200px;
  border-right: 1px solid #dad8d8;
  /*position: fixed;*/

}

.content_container {
  width: calc(100% - 200px);
}

</style>
