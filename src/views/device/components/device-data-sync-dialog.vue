<template>
  <div class="container-sync-data" v-loading="loading">
    <div style="width: 100%; background-color: cornflowerblue">
      <el-table :data="tableData" stripe :header-cell-style="{background:'#e7e7e7'}" style="width: 100%; max-height: 500px; overflow-y: scroll" row-style="height:50px">
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="工号" prop="number"></el-table-column>
        <el-table-column label="项目部" prop="unit"></el-table-column>
        <el-table-column label="人员类型" prop="userType" :formatter="formatUserType"></el-table-column>
        <el-table-column label="状态" prop="dataType" :formatter="formatDataType"></el-table-column>
      </el-table>
    </div>

    <div style="width: 100%; height: 72px; position: relative; display: flex; flex-direction: row; align-items: center;">
      <el-button class="operation-button" @click="dataSync" style="background-color: #009ae0; position: absolute; left: 150px">同步数据</el-button>
      <el-button class="operation-button" @click="cancel" style="background-color: #b8b8b8; position: absolute; right: 150px">取消</el-button>
    </div>

  </div>
</template>

<script>
  import {unsyncData,dataSync} from '@/api/device'
  import { Message } from 'element-ui'
  export default {
    mounted(){
      this.getUnsyncData(this.deviceid);
    },

    props: {
      deviceid: {
        type: Number,
        required: true
      },
    },
    data(){
      return{
        loading:false,
        tableData:[],
        addList:[],
        deleteList:[],
        updateList:[]
      }
    },
    methods:{
      getUnsyncData(deviceid){
        this.deviceid = deviceid;
        this.tableData = [];
        this.addList = [];
        this.deleteList = [];
        this.updateList = [];

        this.loading = true;
        unsyncData({deviceId:this.deviceid}).then(response => {
          this.loading = false;
          if (response.data.errorCode == 200) {
            let result = response.data.data;
            this.addList = result.addList;
            this.deleteList = result.deleteList;
            this.updateList = result.updateList;

            for (var i = 0; i < result.addList.length; i++) {
              this.tableData.push(result.addList[i]);
            }

            for (var i = 0; i < result.deleteList.length; i++) {
              this.tableData.push(result.deleteList[i]);
            }

            for (var i = 0; i < result.updateList.length; i++) {
              this.tableData.push(result.updateList[i]);
            }
          }else {
            Message.error(response.data.errorMsg);
          }
        })
      },

      formatUserType: function (row) {
        return row.userType == 1  ? '员工' : '访客'
      },

      formatDataType: function (row) {
        if (row.dataType == 1) {
          return '未添加';
        } else if (row.dataType == 2) {
          return '未删除'
        } else if (row.dataType == 3) {
          return '未更新'
        }
        return ''
      },

      dataSync(){
        if (this.tableData.length < 1) {
          Message.error('暂无同步数据');
          return;
        }

        let param = {
          deviceId:this.deviceid,
          addData:this.addList,
          deleteData:this.deleteList,
          updateData:this.updateList
        }

        this.loading = true;
        dataSync(param).then(response => {
          this.loading = false;
          if (response.data.errorCode == 200) {
            Message.success("操作成功");
            this.$parent.$parent.dataSyncDialogCancel();
            this.$parent.$parent.onSelect();
          }else {
            Message.error(response.data.errorMsg);
          }
        })
      },

      cancel(){
        this.$parent.$parent.dataSyncDialogCancel();
      },
    }
  }
</script>


<style scoped>

  .container-sync-data {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    min-height: 300px;
    max-height: 700px;
  }


  .operation-button {
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 120px;
    height: 32px;
    border-radius: 3px;
    font-size: 14px;
    color: white;
    border-width: 0px;
  }

</style>

