<template>

  <div class="content_container">

    <div class="operate " >
      <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                 @click="handleMethod(item.methodd)">{{ item.name }}
      </el-button>
    </div>
    <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
      <el-form-item label="姓名">
        <el-input v-model="param.name" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="证件号">
        <el-input v-model="param.certificateNumber" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="项目部" prop="departmentId">
        <selectTree  @select="getValue1" noOptionsText="暂无可选项目部" :clearable="false" placeholder="请选择" v-model="param.departmentId" style="width: 150px" :normalizer="normalizer"  :multiple="false" :options="data"  />
      </el-form-item>
      <el-form-item label="职工类型">
        <el-select v-model="param.userType"  placeholder="职工类型" :clearable="false" style="width: 150px">
          <el-option label="职工" value="1"></el-option>
          <el-option label="劳务工" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>

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
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row>
              <el-col style="width: auto;margin-right: 20px" >
                <img :src="getImagePath(props.row.imagePath)" class="table_image">
              </el-col>
              <el-col :span="8">
                <el-form label-position="right" class="demo-table-expand">
                  <el-form-item label="入职日期">
                    <span>{{ props.row.workTime }}</span>
                  </el-form-item>
                  <el-form-item label="工作年限">
                    <span>{{ yearHandle(props.row.workTime)}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8">
                <el-form label-position="right" class="demo-table-expand">
                  <el-form-item label="使用方式">
                    <span>{{ props.row.operationMethod }}</span>
                  </el-form-item>
                  <el-form-item label="派遣单位">
                    <span>{{ props.row.dispatchUint }}</span>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="genderd" label="性别"  header-align="center" align="center"></el-table-column>
        <el-table-column prop="certificateNumber" label="证件号" min-width="200" header-align="center" align="center"></el-table-column>
        <el-table-column prop="jobNumber" label="职工编号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="departmentName" label="项目部" header-align="center" align="center"></el-table-column>
        <el-table-column prop="empGroup" label="员工组" header-align="center" align="center"></el-table-column>
        <el-table-column prop="empSonGroup" label="员工子组" header-align="center" align="center"></el-table-column>
        <el-table-column prop="position" label="岗位/职位" header-align="center" align="center"></el-table-column>
<!--        <el-table-column label="操作">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button size="mini" type="text" @click="openUpdateDialog(scope.row)">修改</el-button>-->
<!--            <el-button size="mini" v-if="scope.row.itemStatus" type="text" style="color: red" @click="deleteUserOption(scope.row)">SHANC</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->

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

    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center>
      <el-form :model="batchForm" ref="batchForm">
        <el-form-item label="选择文件" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            ref="upload"
            drag='true'
            action=""
            list-type="text"
            :on-change="handlePreview"
            :file-list="fileList"
            limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">请<em>选择文件</em></div>
          </el-upload>
          <span style="color: red">
            注：
            <span style="color: #2e2e2e">
              模板命名格式为”
              <span style="color: #2ac06d">
                人员身份证号码，例如（312401112812182519.png）
                <span style="color: #2e2e2e">
                  ”，并将需要导入的模板放置一个文件夹内，并压缩成
                </span>
                  <span style="color: red">
                    ZIP格式的文件
                    <span style="color: #2e2e2e">
                      后进行上传
                    </span>
                  </span>
              </span>
            </span>
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserBatch">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="excelDialogName" :visible.sync="dialogFormVisible1" @close="" center>
      <el-form :model="batchForm1" ref="batchForm">
        <el-form-item label="选择文件" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            ref="upload"
            drag='true'
            action=""
            :on-change="handlePreview1"
            :file-list="fileList1"
            limit="1"
            :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">请<em>选择文件</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button size="small" icon="el-icon-download" @click="downloadTemplates">模板下载</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="addUserBatch1">确 定</el-button>
      </div>
    </el-dialog>
    <Dialog v-show="dialog1.showDialog" :dialog-option="dialog1.dialogOption" @cancel="dialog1.showDialog = false"
            @submit="submitForm()" ref="dialog">
      <div slot="name1">
        <el-form :label-position="dialog1.labelPosition" ref="dialogForm" :rules="formRules" :model="dialog1.form"
                 label-width="100px" size="mini">
          <el-form-item label="姓名" prop="name">
            <el-input v-model.trim="dialog1.form.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="genderd">
            <el-input v-model.trim="dialog1.form.genderd"></el-input>
          </el-form-item>
          <el-form-item label="工号" prop="jobNumber">
            <el-input v-model.trim="dialog1.form.jobNumber"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="certificateNumber">
            <el-input v-model.trim="dialog1.form.certificateNumber"></el-input>
          </el-form-item>
          <el-form-item label="职工类型" prop="userType">
            <el-select v-model="dialog1.form.userType"  placeholder="职工类型" clearable style="width: 150px">
              <el-option label="职工" value="1"></el-option>
              <el-option label="劳务工" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="参加工作时间" prop="workTime">
              <el-date-picker type="date" placeholder="选择时间" v-model="dialog1.form.workTime" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="项目部" prop="departmentId">
            <selectTree @select="getValue" noOptionsText="暂无可选项目部" v-model="dialog1.form.departmentId" placeholder="请选择" style="width: 200px" :normalizer="normalizer" :multiple="false" :options="data"  />
          </el-form-item>
          <el-form-item label="岗位/职位" prop="position">
            <el-input v-model.trim="dialog1.form.position"></el-input>
          </el-form-item>
          <el-form-item label="是否关键岗位" prop="keyPosotion">
            <el-input v-model.trim="dialog1.form.keyPosotion"></el-input>
          </el-form-item>
          <el-form-item label="员工组" prop="empGroup">
            <el-input v-model.trim="dialog1.form.empGroup"></el-input>
          </el-form-item>
          <el-form-item label="员工子组" prop="empSonGroup">
            <el-input v-model.trim="dialog1.form.empSonGroup"></el-input>
          </el-form-item>
          <el-form-item label="使用方式" prop="operationMethod">
            <el-input v-model.trim="dialog1.form.operationMethod"></el-input>
          </el-form-item>
          <el-form-item label="派遣单位" prop="dispatchUint">
            <el-input v-model.trim="dialog1.form.dispatchUint"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Dialog>
    <Dialog v-show="dialog2.showDialog" :dialog-option="dialog2.dialogOption" @cancel="dialog2.showDialog = false"
            @submit="confrim1()" ref="dialog">
      <div slot="name1">
        <el-form :label-position="dialog2.labelPosition" ref="imageDialogForm" :rules="formImages" :model="dialog2.form"
                 label-width="80px" size="mini">
          <el-form-item label="正脸" prop="imageFile1">
            <el-upload
              class="avatar-uploader"
              action=""
              :on-change='changeUpload1'
              :auto-upload='false'
              :show-file-list="false">
              <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </Dialog>
    <el-dialog width="500px" title="导入模板进度" center :visible.sync="progress"  :close-on-click-modal="false">
      <div style="width: 100%;text-align: center">
        <div>{{titleMsg}}</div>
        <el-progress style="width: 450px;margin-top: 20px" :text-inside="true" stroke-width="20" :percentage="percentage"></el-progress>
      </div>
    </el-dialog>
  </div>


</template>

<script>
import {getDepartments} from '@/api/department'
import {listToTree, copyProperties} from '@/utils'
import {validatePhone} from '@/utils/validate'
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  getUserInfoPage,
  addUser,
  updateUser,
  deleteUser,
  batchDelete,
  addUserBatch,
  getUserImages,
  addExcelAuth,
  fileCheck,
  addImage,
  imageMerge,
  getIp
} from '@/api/user'
import Dialog from '@/components/dialog/index';
import {Message} from 'element-ui'
import {formatDate} from '@/utils/DateUtil'
import store from '../../store'
import {hex_md5} from "@/utils/md5";
export default {
  name: "UserList",
  components: {
    Dialog,
    selectTree,

  },
  created() {
     this.userInfo = store.getters.userInfo;
    if (this.userInfo.departmentId == 0){
      this.isPermisson = false
    }else{
      this.isPermisson = true
    }
    this.bttns = this.$route.meta.btnPermission;
    this.getDepartments();

  },
  filters: {
    dateFormat(date) {
      const createTime = formatDate(new Date(date), "yyyy-MM-dd hh:mm:ss");
      return createTime;
    }
  },

  data() {
    const validateDepartmentIds = (rule, value, callback) => {
      if (value == null || value.length == 0) {
        callback(new Error('请选择所属机构'))
      } else {
        callback()
      }
    }
    const validateJobNumber = (rule, value, callback) => {
      if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
        callback(new Error('不能包含汉字'))
      } else if (value.indexOf(" ") != -1) {
          callback(new Error('不能包含空格'))
      } else if (value.length > 18){
        callback(new Error('不能超过18位'))
      }else if (value == null || value.length == 0){
        callback(new Error('请输入身份证号'))
      }else{
        callback()
      }
    }
    const validateFaceImages = (rule, value, callback) => {
      if (this.imageFile1 == null && this.dialog2.dialogOption.title.indexOf("上传") != -1) {
        callback(new Error('请选择一张正脸图片'))
      } else {
        callback()
      }
    }
    return {
      isFile2:false,
      progress:false,
      percentage:false,
      departmentId:null,
      titleMsg:'',
      userInfo:null,
      isPermisson:false,
      props: {                // 配置项（必选）
        value: 'id',
        label: 'name',
        children: 'children',
        // disabled:true
      },
      bttns:[],
      defaultProps: {
        value: 'id',             // ID字段名
        label: 'name',         // 显示名称
        children: 'children'    // 子级字段名
      },
      isSelect:false,
      roleList: [],
      imageFile1: null,
      imageFile2: null,
      imageFile3: null,
      imageUrl1: '',
      imageUrl2: '',
      imageUrl3: '',
      data: [],
      departments: [],
      imageList: [],
      multipleSelection: [],
      // defaultProps: {
      //   children: 'children',
      //   label: 'name'
      // },
      param: {
        certificateNumber:'',
        departmentId:null,
        userType: '',
        name:'',
        jobNumber:'',
        pageNum: '',
        sort: '',
        order: '',
        pageSize: '10'
      },
      userIp : "127.0.0.1",
      tableData: [],
      currentPage: 0,
      pageSize: 10,
      isFile: false,
      isFile1: false,
      totalElements: 0,
      fileList: [],
      dialogName: '批量导入',
      dialogFormVisible: false,
      fileList1: [],
      excelDialogName: '批量导入',
      dialogFormVisible1: false,
      formLabelWidth: '30%',
      batchParam: {},
      batchForm: {},
      batchParam1: {},
      batchForm1: {},
      fileZIP:null,
      dialog1: {
        showDialog: false,
        dialogOption: {
          title: '添加人员',
          cancelButtonText: '取消',
          confirmButtonText: '下一步',
        },
        form: {
          id: '',
          name: '',
          certificateNumber: '',
          userType: "1",
          jobNumber: '',
          position: '',
          departmentId: null,
          genderd:'',
          dispatchUint:'',
          operationMethod:'',
          empSonGroup:'',
          empGroup:'',
          workTime:'',
          keyPosotion:'',
        }
      },
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入姓名"}],
        certificateNumber: [{required: true, trigger: 'blur', validator: validateJobNumber}],
        departmentId: [{required: true, trigger: 'blur', validator: validateDepartmentIds}],
      },
      dialog2: {
        showDialog: false,
        dialogOption: {
          title: '上传照片',
          cancelButtonText: '取消',
          confirmButtonText: '提交',
        },
        form: {
          imageFile1: null,
          imageFile2: null,
          imageFile3: null,
        }
      },
      formImages: {
        imageFile1: [{required: true, trigger: 'blur', validator: validateFaceImages}],
      },
    };
  },
  methods: {
    getIp(){
      getIp().then(res=>{
        if (res.data.errorCode == 200 && res.data.data){
          this.userIp = res.data.data;
        }
      })
    },
    yearHandle(date){
     let year = '';
      if(date != null){
        let newDate = formatDate(new Date(),"yyyy-MM-dd");
        let newYear = newDate.split("-")[0] ;
        let lodYear = date.split("-")[0];
        year = newYear - lodYear;
      }
      return year;
    },
    getValue1(value,id) {
      this.param.departmentId = value.id;
      this.getUserList(1)
    },
    handleMethod(ms) {
      this[ms]();
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
    getValue(value,id) {
      this.dialog1.form.departmentId = value.id
    },
    addExcel() {
      this.fileList1 = []
      this.dialogFormVisible1 = true;
      this.isFile1 = false;
      this.batchParam1 = null;

    },
    addImage() {
      this.fileList = []
      this.dialogFormVisible = true;
      this.isFile = false;
      this.batchParam = null;
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
    async zydescription(data) {
      //getUserImages
      getUserImages(data.id).then(response => {
        this.imageList = response.data.data;
        // for (let i = 0; i < response.data.data.length; i++){
        //     this.imageList.push(response.data.data[i].imagePath);
        // }
      })
    },
    handleCurrentChange(val) {
      this.param.pageNum = val;
      this.getUserList(this.param.pageNum);
    },
    getDepartments() {
      getDepartments().then(response => {
        let result = response.data.data;
        this.departments = result;
        this.data = listToTree(result);
        this.param.isRoot = this.data[0].isRoot;
        this.param.departmentId = this.data[0].id
        // this.$refs.departmentTree.setCurrentKey(this.data[0].id);
        this.getUserList(1);
      })
    },
    getUserList(start) {
      console.log(this.param)
      this.param.pageNum = start;
      this.currentPage = start;
      getUserInfoPage(this.param).then(response => {
        let result = response.data.data;
        this.tableData = result.list;
        this.pageSize = result.pageSize;
        this.totalElements = result.total
      })
    },
    deleteUserOption(row) {
      this.$confirm('即将把”' + row.name + '“设为离职状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // Message.success("操作成功");
        row.itemStatus = false;
        deleteUser(row).then(response => {
          if (response.data.errorCode == 200) {
            Message.success("操作成功");
            this.getUserList(1);
          } else {
            Message.error(response.data.errorMsg);
          }
        });
      });
    },
    addUserOption(row) {
      this.$confirm('即将把”' + row.name + '“设为在职状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // Message.success("操作成功");
        row.itemStatus = true;
        deleteUser(row).then(response => {
          if (response.data.errorCode == 200) {
            Message.success("操作成功");
            this.getUserList(1);
          } else {
            Message.error(response.data.errorMsg);
          }
        });
      });
    },
    openAddDialog() {
      this.dialog1.form = {
        id: '',
        name: '',
        certificateNumber: '',
        userType: "1",
        jobNumber: '',
        position: '',
        departmentId: null,
        genderd:'',
        dispatchUint:'',
        operationMethod:'',
        empSonGroup:'',
        empGroup:'',
        workTime:'',
        keyPosotion:'',
      }
      this.dialog1.dialogOption.title = '添加人员';
      this.imageFile = null;
      // this.imageUrl= '';
      this.fileList = [];
      this.imageList = [];
      this.dialog1.showDialog = true;
      // this.$refs.dialogForm.clearValidate();//清除校验结果
    },
    openAddImageDialog() {
      this.dialog2.form = {
        imageFile1: null,
        imageFile2: null,
        imageFile3: null,
      }
      this.dialog2.showDialog = true;
      this.dialog2.dialogOption.title = '上传照片';
      this.imageFile1 = null;
      this.imageFile2 = null;
      this.imageFile3 = null;
      this.imageList = [];
      this.imageUrl1 = '';
      this.imageUrl2 = '';
      this.imageUrl3 = '';
      // this.imageUrl= '';
      this.fileList = [];
      this.$refs.imageDialogForm.clearValidate();//清除校验结果
    },
    openUpdateImageDialog() {
      this.dialog2.form = {
        imageFile1: null,
        imageFile2: null,
        imageFile3: null,
      }
      this.dialog2.showDialog = true;
      this.dialog2.dialogOption.title = '修改照片';
      this.imageFile1 = null;
      this.imageUrl1 = this.getImagePath(this.imageList[0])
      this.fileList = [];
      this.$refs.imageDialogForm.clearValidate();//清除校验结果
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
      this.isSelect = true;
      this.dialog1.dialogOption.title = '修改人员';
      this.dialog1.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.imageList = [];
      this.imageList.push(row.imagePath);
      this.imageFile1 = null; // 清空图片数据
      this.imageUrl1 = '';
      if (this.dialog1.form.userType != null){
        this.dialog1.form.userType = this.dialog1.form.userType+"";
      }
      this.dialog1.showDialog = true;
      this.dialog1.form.departmentId = row.departmentId;
      this.$refs.dialogForm.clearValidate();//清除校验结果

    },
    cancelOperate() {
    },
    handeIds(data){
      let ids = [];
      for (let i = 0;i < data.length;i++){

      }
    },
    confrim1() {
      this.$refs.imageDialogForm.validate(valid => {
        {
          if (!valid) {
            return;
          }
          let fd = new FormData();
          console.log(this.dialog1.form);
          let tempObj = this.dialog1.form;
          for (let o in tempObj) {

            if (tempObj[o] != null){

              fd.append(o, tempObj[o])
            }

          }

          if (this.imageFile1 != null) {
            fd.append("imageFile", this.imageFile1, this.imageFile1.name);
          }
          if (this.dialog2.dialogOption.title.indexOf("上传") != -1) {
            addUser(fd).then(response => {
              if (response.data.errorCode == 200) {
                Message.success("操作成功");
                this.dialog2.showDialog = false;
                this.dialog1.showDialog = false;
                this.getUserList(1);
              } else {
                Message.error(response.data.errorMsg);
              }
            });
          } else { //修改
            updateUser(fd).then(response => {
              if (response.data.errorCode == 200) {
                Message.success("操作成功");
                this.dialog2.showDialog = false;
                this.dialog1.showDialog = false;
                this.getUserList(1);
              } else {
                Message.error(response.data.errorMsg);
              }
            });
          }
        }
      })
    },
    submitForm() {
      this.$refs.dialogForm.validate(valid => {
        {
          if (!valid) {
            return;
          }
          if (this.dialog1.dialogOption.title.indexOf("添加") != -1) {//添加操作
            this.openAddImageDialog();
          } else {//修改操作
            this.openUpdateImageDialog();
          }
        }
      })

    },
    changeUpload1: function (file, fileList) {
      // this.fileList = fileList;
      this.imageFile1 = file.raw;
      this.$nextTick(
        () => {
          this.imageUrl1 = file.url;
          callback();
        });
    },
    changeUpload2: function (file, fileList) {
      // this.fileList = fileList;
      this.imageFile2 = file.raw;
      this.$nextTick(
        () => {
          this.imageUrl2 = file.url;
        });
    },
    changeUpload3: function (file, fileList) {
      // this.fileList = fileList;
      this.imageFile3 = file.raw;
      this.$nextTick(
        () => {
          this.imageUrl3 = file.url;
        });
    },
    getImagePath(imagePath) {
      return process.env.BASE_API + imagePath;
    },

    //文件选中
    handlePreview(file) {
      let fileName = file.name;
      let fileSize = Math.pow(file.size / 1024 / 1024, 1) + "";
      //let size = fileSize.substring(0, fileSize.indexOf(".") + 2);
      if (fileName.split(".")[1] != 'zip') {
        Message.error("请选择ZIP格式的文件包")
        this.isFile = false;
        this.fileList = [];
        return false;
      }
      if (fileName.split(".")[1] == 'zip') {
        this.isFile = true;
      }
      this.fileZIP = file.raw;
      this.batchParam = new FormData();
      this.batchParam.append('file', file.raw, file.name);
      return false;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    //自定义上传文件钩子，发送上传文件请求
    addUserBatch() {
      this.getIp();
      let file = this.fileZIP;
      let key = hex_md5(file.name + file.size + file.type + this.userIp);
      let suffix = file.name.substr(file.name.lastIndexOf(".") + 1).toLowerCase();
      // 文件分片
      let shardSize = 20 * 1024 * 1024; // 以20M为一个分片
      let shardIndex = 1; //分片索引, 1表示第一个分片
      let size = file.size;
      let shardTotal = Math.ceil(size / shardSize);
      let param = {
        "shardIndex": shardIndex,
        "shardSize": shardSize,
        "shardTotal": shardTotal,
        "fileUse": "C",
        "fileName": file.name,
        "suffix": suffix,
        "fileSize": size,
        "fileKey": key
      }
      this.check(param);
    },
    /**
     * 检查文件状态，是否已上传过？传到第几个分片？
     */
    check(param) {
      fileCheck(param).then(resp => {
        if (resp && resp.data.errorCode == 200) {
          let obj = resp.data.data;
          if (!obj) {
            param.shardIndex = 1;
            console.log("没有找到文件记录，从分片1开始上传");
            this.upload(param);
          } else if (obj.shardIndex === obj.shardTotal) {
            // 已上传分片 = 分片总数，说明已全部上传完，不需要再上传
            this.$message.success("文件极速秒传成功！");
          } else {
            param.shardIndex = obj.shardIndex + 1;
            console.log("找到文件记录，从分片" + param.shardIndex + "开始上传");
            this.percentage = 0;
            this.upload(param);
          }
        } else {
          this.$message.error("文件上传失败");
        }
      })
    },
    upload(param) {
      let shardIndex = param.shardIndex;
      let shardTotal = param.shardTotal;
      let shardSize = param.shardSize;
      let fileShard = this.getFileShard(shardIndex, shardSize);
      let fd = new FormData();
      for (let o in param) {
        if (param[o] == null || param[o].length == 0){
          continue;
        }
        fd.append(o, param[o])
      }
      fd.append("imageFile", fileShard);
      this.progress = true;
      this.titleMsg = "文件上传中，请稍后..."
      addImage(fd).then(resp => {
          if (resp && resp.data.errorCode == 200) {
            this.fileName = "";
          } else {
            this.$message.error(resp.data.errorMsg)
            this.progress = false;
            return ;
          }
          if (shardIndex < shardTotal) {
            //计算进度
            this.percentage = Math.floor(100 / shardTotal * shardIndex);
            // 上传下一个分片
            param.shardIndex = param.shardIndex + 1;
            this.upload(param);
          } else {
            this.percentage = 100;
            this.imageMerge(resp.data.data);
          }
        }).catch(err=>{
        this.progress = false;
      })
    },
    imageMerge(param){
      this.titleMsg = "文件合并中，请稍后..."
      imageMerge(param).then(res=>{
        if (res.data && res.data.errorCode == 200){
          this.handleImage(param);
        }else {
          this.$message.error(resp.data.errorMsg)
          this.progress = false;
        }
      }).catch(err=>{
        this.progress = false;
      })
    },
    handleImage(param){
      this.titleMsg = "图片处理中，请稍后..."
      addUserBatch(param).then(res=>{
        this.progress = false;
        if (res.data && res.data.errorCode == 200){
          this.dialogFormVisible = false;
          this.getUserList(1);
          this.$message.success("上传成功")
        }else{
          this.$message.success(res.data.errorMsg);
        }
      }).catch(err=>{
        this.progress = false;
      })
    },
    getFileShard(shardIndex, shardSize) {
      let file = this.fileZIP;
      // 当前分片起始位置
      let start = (shardIndex - 1) * shardSize;
      //当前分片结束位置
      let end = Math.min(file.size, start + shardSize);
      let fileShard = file.slice(start, end);
      return fileShard;
    },
    //文件选中
    handlePreview1(file) {
      let fileName = file.name;
      if (!/\.(xls|xlsx)$/.test(fileName.toLowerCase())) {
        Message.error("上传格式不正确，请上传xls或者xlsx格式")
        this.isFile1 = false;
        this.fileList1 = [];
        return false;
      }
      this.isFile1 = true;
      this.batchParam1 = new FormData();
      this.batchParam1.append('file', file.raw, file.name);
      return false;
    },
    //下载模板
    downloadTemplates() {
      window.location.href = process.env.BASE_API + "temp/人员信息.xlsx";
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
          loading.close();
          console.log(response)
          if(response.data.errorCode == 200){
            Message.success(response.data.errorMsg);
            this.getUserList(0);
            this.dialogFormVisible1=false;
          }else{
            Message.error(response.data.errorMsg);
          }
        })
      },
    //批量添加用户
    // addUserBatch() {
    //   if (!this.isFile) {
    //     Message.error("请选择正确的文件")
    //     return;
    //   }
    //   // debugger
    //   if (typeof this.batchParam == "FormData" && this.batchParam.get(file) != null) {
    //     Message.warning("请先选择文件");
    //     return;
    //   }
    //   const loading = this.$loading({
    //     lock: true,
    //     text: '上传中...',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   });
    //
    //   addUserBatch(this.batchParam).then(response => {
    //     if (response.data.errorCode == 200) {
    //       loading.close();
    //       Message.success(response.data.errorMsg);
    //       this.dialogFormVisible = false;
    //       this.getUserList(1);
    //     } else {
    //       loading.close();
    //       Message.error(response.data.errorMsg);
    //     }
    //   })
    // },
    batchDelete() {
      if (this.multipleSelection.length == 0) {
        Message.error("请先选择人员");
        return;
      }
      this.$confirm('即将删除' + this.multipleSelection.length + '条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDelete(this.multipleSelection + "").then(response => {
          if (response.data.errorCode == 200) {
            Message.success("操作成功");
            this.getUserList(1);
          } else {
            Message.error(response.data.errorMsg);
          }
        });
      });
    },

  },


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
