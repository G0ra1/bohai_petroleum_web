<template>
  <div class="content_container">
    <div class="operate ">
      <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                 @click="handleMethod(item.methodd)">{{ item.name }}
      </el-button>
    </div>
    <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
      <el-form-item label="人员姓名">
        <el-input v-model="param.name" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="paramDate"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 250px">
        </el-date-picker>
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
        <el-table-column prop="recordDate" min-width="90" :formatter="handelDate" sortable="custom" label="日期" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="userName" label="人员姓名" min-width="90" header-align="center" align="center"></el-table-column>
        <el-table-column prop="startTime" label="上班时间" min-width="170" header-align="center" align="center"></el-table-column>
        <el-table-column prop="endTime" label="下班时间" min-width="170" header-align="center" align="center"></el-table-column>
        <el-table-column prop="clockInTime" label="上班打卡时间" min-width="170" header-align="center" align="center"></el-table-column>
        <el-table-column prop="clockOutTime" label="下班打卡时间" min-width="170" header-align="center" align="center"></el-table-column>
        <el-table-column prop="type" label="是否上井" min-width="80" header-align="center" align="center"></el-table-column>
        <el-table-column prop="taskType" label="是否上岛" min-width="80" header-align="center" align="center"></el-table-column>
        <el-table-column prop="night" label="夜班" min-width="70" header-align="center" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" header-align="center" align="center"></el-table-column>
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
        <el-form-item label="人员" >
          <el-input  v-model="userName"  placeholder="请选择" disabled  @click.native="selectUser"></el-input>
        </el-form-item>
        <el-form-item label="假别" prop="status">
          <el-select v-model="form.status" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in leaveList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="vacationDate">
          <el-date-picker
            v-model="form.vacationDate"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 190px">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="addLeave">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加大小夜班" :visible.sync="showDialog1" @close="" center>
      <el-form :label-position="labelPosition" ref="dialogForm1" :rules="formRules1" :model="form1"
               label-width="120px" size="mini">
        <el-form-item label="请选择" prop="night">
          <el-select v-model="form1.night" placeholder="请选择" clearable>
            <el-option label="大夜班" value="大夜班"></el-option>
            <el-option label="小夜班" value="小夜班"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog1 = false">取 消</el-button>
        <el-button type="primary" @click="addNight">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择人员" :visible.sync="showUserDialog" @close="" center>
      <el-form label-position="left" :inline="true" :model="param1" class="demo-form-inline" size="mini">
        <el-form-item label="姓名">
          <el-input v-model="param1.name" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="机构" prop="departmentId">
          <selectTree :clearable="false" @select="getValue1" noOptionsText="暂无可选机构" placeholder="请选择" v-model="param1.departmentId"
                      style="width: 150px" :normalizer="normalizer" :multiple="false" :options="departments"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getUserList(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="userList" stripe border :header-cell-style="{background:'#e7e7e7'}" style="width: 100%"
                row-style="height:30px"
                cell-style="padding: 5px 0;" v-loading="loading" ref="userTable"
                @selection-change="handleSelectionUser">
        <el-table-column type="selection"  header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
        <el-table-column sortable="custom" prop="jobNumber" label="工号" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="departmentName" sortable="custom" label="机构" header-align="center"
                         align="center"></el-table-column>
      </el-table>
      <div>
        <el-pagination background @current-change="handleCurrentChange1" :current-page.sync="currentPage1"
                       :page-size="pageSize1"
                       :pager-count="5"
                       layout="total, prev, pager, next"
                       :total="totalElements1">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-left: 9%">
        <el-button @click="showUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {searchPage, addLeave, addNight, batchDelete} from "@/api/record";
import {getUserInfoPage} from "@/api/user";
import {getDepartments} from '@/api/department'
import {listToTree} from '@/utils'
import {getBaseUrl} from "@/api/url";
import {formatDate} from '@/utils/DateUtil'
import selectTree from "@riophae/vue-treeselect";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: "record",
  components:{selectTree},
  data() {
    const validateDate = (rule, value, callback) => {
      if (value == null || value.length == 0) {
        callback(new Error('请选择日期'))
      } else {
        callback()
      }
    }
    return {
      userName:null,
      param: {
        departmentIds: [],
        name: '',
        startDate: '',
        endDate: '',
        pageNum: '',
        sort: 'recordDate',
        order: '',
        pageSize: '10'
      },
      paramDate: [],
      form: {
        userId: null,
        status: '',
        startDate: '',
        endDate: '',
        vacationDate: [],
      },
      form1: {
        ids: [],
        night: null
      },
      param1: {
        departmentId: null,
        name: null,
        pageNum: 1,
        itemStatus:true,
        pageSize: 10,
        sort: '',
        order: '',
      },
      formRules: {
        userId: [{required: true, trigger: 'blur', message: "请选择人员"}],
        status: [{required: true, trigger: 'blur', message: "请选择假别"}],
        vacationDate: [{required: true, trigger: 'blur', validator: validateDate}],
      },
      formRules1: {
        night: [{required: true, trigger: 'blur', message: "请选择大小夜班"}],
      },

      leaveList: ["带薪年休假", "探亲假", "婚假", "丧假", "产假", "护理假", "节育假", "病假", "事假", "哺乳假", "工伤停工留薪期", "女员工育儿假", "轮休（倒休）"],
      tableData: [],
      searchLodding:false,
      Lodding:false,
      multipleSelection: [],
      multipleSelection1:[],
      bttns: [],
      showUserDialog:false,
      rulesList: [],
      locationList: [],
      userList: [],
      departments: [],
      showDialog: false,
      showDialog1: false,
      totalElements: 0,
      currentPage: 0,
      pageSize: 10,
      totalElements1: 0,
      currentPage1: 0,
      pageSize1: 10,
      labelPosition: 'center',
      dialogName: '新增假期',
      ormLabelWidth: '10%',
    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    let end = formatDate(new Date(), 'yyyy-MM-dd')
    let start = formatDate(new Date(), 'yyyy-MM') + '-01'
    this.paramDate = [start, end]
    this.getDepartments();
  },
  methods: {
    confirmUser(){
      if (this.multipleSelection1 == null){
        this.$message.error("请选择人员")
        return ;
      }
      this.form.userId = this.multipleSelection1[0].id;
      this.userName = this.multipleSelection1[0].name + "[" + this.multipleSelection1[0].jobNumber + "]";
      this.showUserDialog = false;
    },
    selectUser(){
      this.multipleSelection1 = null
      this.showUserDialog = true;
      this.getUserList(1)
      this.$refs.userTable.clearSelection()
    },
    searchPage(pageNum) {
      if (pageNum == undefined) {
        pageNum = 1;
      }
      if (this.paramDate == null || this.paramDate.length == 0) {
        this.$message.error("请选择日期")
        return;
      }
      this.param.pageNum = pageNum;
      this.currentPage = pageNum;
      this.param.departmentIds = [];
      this.param.departmentIds = this.getIds(this.param.departmentIds, this.departments)
      this.param.departmentIds = this.param.departmentIds + "";
      this.param.startDate = this.paramDate[0];
      this.param.endDate = this.paramDate[1];
      searchPage(this.param).then(response => {
        let result = response.data.data;
        this.tableData = result.list;
        this.totalElements = result.total
      });
    },
    apenAddleaveDialog() {
      this.form = {
        userId: null,
        status: '',
        startDate: '',
        endDate: '',
        vacationDate: [],
      };
      this.userName = null,
      this.showDialog = true;
    },
    openNightDialog() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择数据");
        return;
      }
      this.form1 = {
        ids: [],
        night: null
      };
      this.showDialog1 = true;
    },
    addLeave() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;expro
        }
        this.form.startDate = this.form.vacationDate[0];
        this.form.endDate = this.form.vacationDate[1];
        this.form.vacationDate = [];
        addLeave(this.form).then(res => {
          if (res.data.errorCode == 200) {
            this.$message.success("操作成功")
            this.showDialog = false;
            this.searchPage(1)
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
      })
    },
    handelDate(row) {
      if (row.recordDate != null) {
        return row.recordDate.substring(0, 10)
      }
    },
    addNight() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择数据");
        return;
      }
      this.$refs.dialogForm1.validate(valid => {
        if (!valid) {
          return;
        }
        this.form1.ids = this.multipleSelection + ""
        addNight(this.form1).then(res => {
          if (res.data.errorCode == 200) {
            this.$message.success("操作成功")
            this.showDialog1 = false;
            this.searchPage(1)
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
      })
    },
    batchDelete() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择数据");
        return;
      }
      this.$confirm('即将删除' + this.multipleSelection.length + '条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDelete(this.multipleSelection + "").then(res => {
          if (res.data.errorCode == 200) {
            this.$message.success("操作成功");
            this.searchPage(1);
          } else {
            this.$message.error(res.data.errorMsg)
          }
        })
      })
    },
    getDepartments() {
      getDepartments().then(response => {
        let result = response.data.data;
        this.departments = listToTree(result);
        this.param1.departmentId = this.departments[0].id
        // this.$refs.departmentTree.setCurrentKey(this.data[0].id);
        this.searchPage(1);
        this.getUserList(1);
      })
    },
    getUserList(start) {
      this.param1.pageNum = start;
      this.currentPage1 = start;
      getUserInfoPage(this.param1).then(response => {
        let result = response.data.data;
        this.userList = result.list;
        this.pageSize1 = result.pageSize;
        this.totalElements1 = result.total
      })
    },
    getIds(ids, data) {
      for (let i = 0; i < data.length; i++) {
        ids.push(data[i].id);
        if (data[i].children) {
          ids = this.getIds(ids, data[i].children);
        }
      }
      return ids;
    },
    exportRecord() {

      this.$confirm('确定批量导出数据吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let href = getBaseUrl() + 'record/export?departmentId=' + 1 + '&name=' + this.param.name;
        window.location.href = href
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    handleSelectionUser(val) {
      if (val.length > 1) {
        this.$refs.userTable.clearSelection()
        this.$refs.userTable.toggleRowSelection(val.pop())
      }
      this.multipleSelection1 = val;
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
    handleCurrentChange1(val) {
      this.param1.pageNum = val;
      this.getUserList(this.param1.pageNum);
    },
    getValue1(value, id) {
      this.param1.departmentId = value.id;
      this.getUserList(1);
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
  }
}
</script>

<style>
.el-input.is-disabled .el-input__inner {
  background-color: #fff;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: pointer;
}
</style>
