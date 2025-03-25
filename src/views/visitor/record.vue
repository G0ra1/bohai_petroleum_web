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
        <el-button type="primary" @click="getAllVisitor(1)" icon="el-icon-search">查询</el-button>
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
  </div>
</template>

<script>
import {Message} from "element-ui";
import {getAllVisitor} from "@/api/visitor"

export default {
  name: "add",
  data() {
    return {
      imageUrl: null,
      bttns: [],
      tableData: null,
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

    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.getAllVisitor(1);
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
    getAllVisitor(pageNum) {
      this.param.pageNum = pageNum;
      this.currentPage = pageNum + 1;
      getAllVisitor(this.param).then(res=>{
        if (res.data.errorCode == 200){
          let result = res.data.data;
          this.tableData = result.list;
          this.totalElements = result.total
        }
      })
    },
    handleCurrentChange(val) {
      this.param.pageNum = val;
      this.getAllVisitor(this.param.pageNum);
    },
    onSortChange(param) {
      this.param.sort = param.prop;
      this.param.order = param.order == "ascending" ? "ASC" : "DESC";
      this.getAllVisitor(this.param.pageNum);
    },
    getImagePath(imagePath) {
      return process.env.BASE_API + imagePath;
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
