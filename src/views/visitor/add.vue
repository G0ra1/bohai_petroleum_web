<template>
  <div class="content_container">
    <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
      <el-form-item label="关键字">
        <el-input v-model="param.keyword" placeholder="请输入关键字" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="param.itemStatus" placeholder="状态" clearable style="width: 150px">
          <el-option label="全部" value="0"></el-option>
          <el-option label="已访问" value="1"></el-option>
          <el-option label="待访问" value="3"></el-option>
          <el-option label="未访问" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="vacationDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        style="width: 250px">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                   @click="handleMethod(item.methodd)">{{ item.name }}
        </el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="tableData" stripe border @sort-change="onSortChange" @selection-change="handleSelectionChange"
                cell-style="padding: 5px 0;"
                :header-cell-style="{background:'#e6e6e6'}"
                style="width: 100%"
                row-style="height:30px;">
        <el-table-column type="selection" width="55" header-align="center" align="center"></el-table-column>
        <el-table-column type="expand" header-align="center" align="center">
          <template slot-scope="props">
            <el-row>
              <el-col  style="width: auto;margin-right: 20px">
                <img :src="getImagePath(props.row.imagePath)" class="table_image">
              </el-col>
              <el-col :span="4">
                <el-form label-position="right" class="demo-table-expand">
                  <el-form-item label="证件类型">
                    <span>{{ props.row.certificateType }}</span>
                  </el-form-item>
                  <el-form-item label="预约来访时间">
                    <span>{{ props.row.intentVisitTime }}</span>
                  </el-form-item>
                  <el-form-item label="来访事由">
                    <span>{{ props.row.remark }}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="4">
                <el-form label-position="right" class="demo-table-expand">
                  <el-form-item label="证件号">
                    <span>{{ props.row.certificateNumber }}</span>
                  </el-form-item>
                  <el-form-item label="预约离开时间">
                    <span>{{ props.row.intentLeaveTime }}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="4">
                <el-form label-position="right" class="demo-table-expand">
                  <el-form-item label="手机号码">
                    <span>{{ props.row.phone }}</span>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="访客姓名" header-align="center" align="center"></el-table-column>
        <el-table-column sortable="custom" prop="unit" label="访客单位" header-align="center"
                         align="center"></el-table-column>
        <el-table-column sortable="custom" prop="interviewedName" label="被访人" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="actualVisitTime" label="访问时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="actualLeaveTime" label="离开时间" header-align="center" align="center"></el-table-column>
        <el-table-column sortable="custom" prop="itemStatusName" label="状态" :formatter="handeStatus"
                         header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" v-if="isupdate" @click="openUpdateDialog(scope.row)">修改预约</el-button>
            <el-button size="mini"  type="text"  v-if="isupdate" style="color: red"
                       @click="deleteUserOption(scope.row)">取消预约
            </el-button>
            <span v-if="!isupdate">——————</span>
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
    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center>
      <el-form ref="form" label-position="left" :rules="formRules" :model="form" label-width="110px" size="mini">
        <el-form-item label="访客姓名" prop="name">
          <el-input v-model.trim="form.name"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="certificateType">
          <el-select v-model.trim="form.certificateType" placeholder="请选择证件类型" style="width: 100%;">
            <el-option label="身份证" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="certificateNumber">
          <el-input v-model.trim="form.certificateNumber"></el-input>
        </el-form-item>
        <el-form-item label="访客单位" prop="unit">
          <el-input v-model.trim="form.unit"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model.trim="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="预约访问时间" prop="intentVisitTime" v-if="isDate">
          <el-date-picker v-model="form.intentVisitTime" type="datetime" style="width: 100%;"
                          @change="startTimeOnChange" value-format="yyyy-MM-dd HH:mm:ss" default-time="09:00:00"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预约离开时间" prop="intentLeaveTime" v-if="isDate">
          <el-date-picker
            v-model="form.intentLeaveTime"
            type="datetime"
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="照片">
          <el-upload
            class="avatar-uploader"
            action=""
            :on-change='changeUpload'
            :auto-upload='false'
            :show-file-list="false">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2Mb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {Message} from "element-ui";
import {add, getOneselfVisitor,update,deleteById} from "@/api/visitor"

export default {
  name: "add",
  data() {
    //校验预约访问时间
    const validateIntentVisitTime = (rule, value, callback) => {//校验编号
      let selectedDate = new Date(value);
      let now = new Date();
      if (selectedDate <= now) {
        callback(new Error('访问时间不能早于当前时间'))
      } else {
        callback()
      }
    }
    //校验预约离开时间
    const validateIntentLeaveTime = (rule, value, callback) => {//校验编号
      let selectedDate = new Date(value);
      let now = new Date();

      if (selectedDate <= now) {
        callback(new Error('离开时间不能早于当前时间'))
      } else if (selectedDate < new Date(this.form.intentVisitTime)) {
        callback(new Error('离开时间不能早于访问时间'))
      } else {
        let limitTime = this.form.intentVisitTime.split(" ")[0] + " 23:59:59";
        if (value > limitTime) {
          callback(new Error('离开时间不能超过当天'))
        } else {
          callback()
        }
      }
    }
    return {
      imageUrl: null,
      dialogFormVisible: false,
      dialogName: '新增预约',
      bttns: [],
      isDate:false,
      tableData: null,
      multipleSelection: [],
      vacationDate: [],
      currentPage: 0,
      pageSize: 10,
      totalElements: 0,
      isupdate:true,
      param: {
        keyword: '',
        status: '0',
        startDate: '',
        endDate: '',
        pageNum: 1,
        pageSize: 10,
        sort: '',
        order: '',
      },
      form: {
        id: '',
        name: '',
        certificateType: '1',
        certificateNumber: '',
        phone: '',
        unit: '',
        verifyMode: '1',
        intentVisitTime: '',
        intentLeaveTime: '',
        imageFile: '',
      },
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入姓名"}],
        verifyMode: [{required: true, trigger: 'blur', message: "请选择访问方式"}],
        certificateNumber: [{required: true, trigger: 'blur', message: "请输入姓名"}],
        certificateType: [{required: true, trigger: 'blur', message: "请输入姓名"}],
        intentVisitTime: [{required: true, trigger: 'blur', message: "请选择预约访问时间"},
          {trigger: 'blur', validator: validateIntentVisitTime}],
        intentLeaveTime: [
          {required: true, trigger: 'blur', message: "请选择预约离开时间"},
          {trigger: 'blur', validator: validateIntentLeaveTime}
        ],
      },

    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.getOneselfVisitor(1);
  },
  methods: {
    handleMethod(ms) {
      this[ms]();
    },
    handeStatus(row){

      if (row.actualVisitTime != null){
        this.isupdate = false;
        return "已访问";
      }
      let reg = new RegExp('-', 'g')
      let intentLeaveTime = new Date(row.intentLeaveTime.replace(reg, '/'));
      let date = new Date();
      if (row.actualVisitTime == null && intentLeaveTime.getTime() > date.getTime()){
        this.isupdate = true;
        return '待访问';
      }
      if (row.actualVisitTime == null && intentLeaveTime.getTime() < date.getTime()){
        this.isupdate = false;
        return '未访问';
      }
    },
    getOneselfVisitor(pageNum) {
      this.param.pageNum = pageNum;
      this.currentPage = pageNum + 1;
      getOneselfVisitor(this.param).then(res=>{
        if (res.data.errorCode == 200){
          let result = res.data.data;
          this.tableData = result.list;
          this.totalElements = result.total
        }
      })
    },
    handleCurrentChange(val) {
      this.param.pageNum = val;
      this.getOneselfVisitor(this.param.pageNum);
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
    openDialog(row) {
      this.dialogFormVisible = true;
      this.dialogName = "新增";
      this.isDate = true;
      this.form = {
        id: '',
          name: '',
          certificateType: '1',
          certificateNumber: '',
          phone: '',
          unit: '',
          verifyMode: '1',
          intentVisitTime: '',
          intentLeaveTime: '',
          imageFile: '',
      }
    },
    openUpdateDialog(row) {
      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.isDate = false;
      this.form.imageFile = null;
      this.imageUrl = this.getImagePath(row.imagePath);
      this.dialogName = "修改";
      this.dialogFormVisible = true;
      this.$refs.form.clearValidate();//清除校验结果
    },
    deleteUserOption(row) {
      deleteById(row.id).then(res=>{
        if (res.data.errorCode == 200){
          this.$message.success("操作成功");
          this.getOneselfVisitor(1);
        }else{
          this.$message.error(res.data.errorMsg);
        }
      })
    },
    getImagePath(imagePath) {
      return process.env.BASE_API + imagePath;
    },

    confirm() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        let fd = new FormData();
        let tempObj = this.form;
        for (let o in tempObj) {
          if (tempObj[o] != null) {
            fd.append(o, tempObj[o])
          }
        }
        if (this.imageFile != null) {
          fd.append("imageFile", this.imageFile, this.imageFile.name);
        }
        if (this.dialogName.indexOf("新增") != -1) {
          add(fd).then(response => {
            if (response.data.errorCode == 200) {
              Message.success("操作成功");
              this.dialogFormVisible = false;
              this.getOneselfVisitor(1);
            } else {
              Message.error(response.data.errorMsg);
            }
          });
        } else { //修改
          update(fd).then(response => {
            if (response.data.errorCode == 200) {
              Message.success("操作成功");
              this.dialogFormVisible = false;
              this.getOneselfVisitor(1);
            } else {
              Message.error(response.data.errorMsg);
            }
          });
        }

      })
    },
    startTimeOnChange(val) {
      let time = val.split(" ");
      let defaultEndTime = time[0] + " 23:59:59";
      if (!this.form.intentLeaveTime) {
        this.form.intentLeaveTime = defaultEndTime;
      }
    },
    changeUpload: function (file, fileList) {
      // this.fileList = fileList;
      this.imageFile = file.raw;
      this.$nextTick(
        () => {
          this.imageUrl = file.url;
        });
    },
  }
}
</script>

<style scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
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
</style>
