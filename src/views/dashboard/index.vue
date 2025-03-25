<template>
  <div class="content_container"  >
    <div id="div1" >
      <div class="div2">
<!--        <img src="@/assets/user.png" @click="router_jump('/user/index')" alt="Norway">-->
        <div class="container-title">总人数</div>
        <div class="container-text" style="color:#4599f1">{{userSum}}</div>
      </div>
      <div class="div2">
        <div class="container-title">在执行总任务数</div>
        <div class="container-text" style="color: #4599f1">{{taskSum}}</div>
      </div>
      <div class="div2">
        <div class="container-title">昨日考勤异常人数</div>
        <div class="container-text" style="color: #e905058f">{{workSum}}</div>
      </div>

      <div class="div21">
        <div class="container-title">设备异常数</div>
        <div class="container-text" style="color: red">{{deviceSum}}</div>
      </div>
    </div>
    <div>
        <div class="el-row information_container " style="margin-top:20px;margin-right: 1.5%">
          <div class="title">
            <div style="height: 60px;padding: 12px 0 0 10px;font-size: 28px">所在项目部昨日考勤统计:</div>
          </div>
          <el-row class="">
            <el-col  class="">
              <div id="timeFrameStatistics" style="height: 350px;width: 100%;"></div>
            </el-col>
          </el-row>
        </div>
        <div class="el-row information_container " style="margin-top:20px">
          <div class="title">
            <div style="height: 60px;padding: 12px 0 0 10px;font-size: 28px">常用功能导航:</div>
          </div>
          <el-row class="page-guide">
            <el-col  class="container" >
              <img src="@/assets/user.png" @click="router_jump('/user/index')" alt="Norway">
              <div class="center" >员工管理</div>
            </el-col>
            <el-col  class="container" >
              <img src="@/assets/designate.png" @click="router_jump('/task/record/index')" alt="Norway">
              <div class="center" >指派任务</div>
            </el-col>
            <el-col  class="container" >
              <img src="@/assets/record.png" @click="router_jump('/attendance/record')" alt="Norway">
              <div class="center" >打卡记录</div>
            </el-col>
            <el-col  class="container" >
              <img src="@/assets/stats.png" @click="router_jump('/statistics')" alt="Norway">
              <div class="center" >考勤统计</div>
            </el-col>
          </el-row>
        </div>
    </div>
  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {formatDate} from '@/utils/DateUtil'
  import {hasPermission} from '@/utils/permission' // 权限判断函数
  import PanelGroup from './components/PanelGroup'
    import Echarts from "echarts";
  import {getDepartments} from "../../api/department";
  import {search} from "../../api/home";
  import {listToTree} from '@/utils'
  export default {
    name: 'Dashboard',
    components: {
      PanelGroup
    },
    data() {
      return {
        charts: '',
        //总人数
        userSum: 0,
        //正在执行总任务数
        taskSum: 0,
        //考勤异常人数
        workSum: 0,
        //设备异常人数
        deviceSum: 0,
        //昨日考勤正常人数
        normalSum: 0,
        //昨日出任务人数
        outStaskSum: 0,
        //昨日大夜班人数
        gtNigthSum: 0,
        //昨日小夜班人数
        ltNigthSum: 0,
        //昨日请假人数
        leaveSum: 0,
        departments:[],
        param:{
          departmentIds:[]
        }
      }
    },
    computed: {
      ...mapGetters([
        'roles',
        'userInfo'
      ])
    },
    //调用
      mounted() {
          this.$nextTick(function() {
              this.timeFrameStatistics();
          })
      },
    created() {
      this.getDepartments();
    },
    methods: {
      getOption(){
        let _this = this;
        let option = {
          tooltip : {
            trigger: 'item',
            // formatter: "{a} <br/>{b} : {c} 人"
          },
          legend: {
            orient : 'vertical',
            x : '10%',
            top:'17%',
            itemWidth:70,
            itemHeight:30,
            formatter: '{name}',
            // textStyle:{
            //   color: 'black'
            // },
            // icon:'rect',
            // data:['正常','出任务','大夜班','小夜班','请假']
            data:[
              {name:'正常' + ' ' + _this.normalSum + '人',icon:'rect', textStyle:{color:'#02B0ED',fontSize:'18'}},
              {name:'出任务' + ' ' + _this.outStaskSum + '人',icon:'rect', textStyle:{color:'#55E87D',fontSize:'18'}},
              {name:'大夜班' + ' ' + _this.gtNigthSum + '人',icon:'rect', textStyle:{color:'#FFE200',fontSize:'18'}},
              {name:'小夜班' + ' ' + _this.ltNigthSum + '人',icon:'rect', textStyle:{color:'#F29700',fontSize:'18'}},
              {name:'请假' + ' ' + _this.leaveSum + '人',icon:'rect', textStyle:{color:'#FE0000',fontSize:'18'}}
            ]
          },
          calculable : true,
          series : [
            {
              name:'统计',
              type:'pie',
              radius : '70%',//饼图的半径大小
              center: ['70%', '50%'],//饼图的位置
              label:{            //饼图图形上的文本标签
                normal:{
                  show:false,
                  position:'inner', //标签的位置
                  textStyle : {
                    fontWeight : 300 ,
                    fontSize : 16    //文字的字体大小
                  },
                  // formatter:'{b} {c}'
                }
              },
              data:[
                {value:_this.normalSum,name:'正常' + ' ' +_this.normalSum + '人',itemStyle:{normal:{color:'#02B0ED'}}},
                {value:_this.outStaskSum,name:'出任务'+ ' ' +_this.outStaskSum + '人',itemStyle:{normal:{color:'#55E87D'}}},
                {value:_this.gtNigthSum,name:'大夜班'+ ' ' +_this.gtNigthSum + '人',itemStyle:{normal:{color:'#FFE200'}}},
                {value:_this.ltNigthSum,name:'小夜班'+ ' ' +_this.ltNigthSum + '人',itemStyle:{normal:{color:'#F29700'}}},
                {value:_this.leaveSum,name:'请假'+ ' ' +_this.leaveSum + '人',itemStyle:{normal:{color:'#FE0000'}}},
              ]
            }
          ]
        }
        return option;
      },
      timeFrameStatistics() {
        this.myChart = Echarts.init(document.getElementById('timeFrameStatistics'));
        this.myChart.on("click", this.eConsole);
        let _this = this;
        this.myChart.setOption(this.getOption(),true)
      },
      router_jump(path){
        this.$router.push({path:  path})
      },
      searchPage(){
        const loading = this.$loading({
          lock: true,
          text: '请稍后...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        search(this.param).then(response=>{
          loading.close();
          let result = response.data.data;
          this.userSum= result.userSum;
          this.taskSum= result.taskSum;
          this.workSum= result.workSum;
          this.deviceSum= result.deviceSum;
          this.normalSum= result.normalSum;
          this.outStaskSum= result.outStaskSum;
          this.gtNigthSum= result.gtNigthSum;
          this.ltNigthSum= result.ltNigthSum;
          this.leaveSum= result.leaveSum;
          this.myChart.setOption(this.getOption(),true)
        }).catch(error => {
          loading.close();
        });
      },
      getDepartments() {
        getDepartments().then(response => {
          let result = response.data.data;
          this.departments = listToTree(result);;
          this.param.departmentIds = this.getIds(this.param.departmentIds,this.departments)
          this.param.departmentIds = this.param.departmentIds + "";
          this.searchPage();
        })
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
    },

  }
</script>
<style scoped>
  .dashboard-container {
    margin: 20px;

  }

  .information_container {
    background: rgb(255, 255, 255);
    /*padding: 0px 16px 0px;*/
    margin-bottom: 32px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    min-height: 440px;
    width: 49%;
    border-radius: 10px;
    display: inline-block;
  }

  .page-guide .content li {
    font-size: 14px;
    margin-bottom: 10px;
    color: #99a9bf;
    list-style: none;
  }

  .page-guide .content li:before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 40%;
    vertical-align: middle;
    background-color: #5e6d82;
    margin-right: 5px;
  }
  .container {
    position: relative;
    width: 100px;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom:20px;
    height:100px;
    border-radius:5px;
  }
  .title{
    margin-bottom:20px;
    height:60px;
    font-weight:bold;
    background: #4d424c21;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .department{
    position: relative;
    width: 5%;
    border-radius:5px;
  }
  .department:hover {
    border:2px solid #887a7a;
  }
  .topleft {
    position: absolute;
    top: 8px;
    left: 16px;
    font-size: 18px;
  }
  .department {
    text-align: center;
    font-size: 18px;
    cursor: pointer;
    font-weight: bold;
    color:#3836de;
  }
  .center {
    position: absolute;
    left: -25px;
    top: 70%;
    width: 100%;
    text-align: center;
    font-size: 18px;
    margin-top:-9px;
    line-height: 18px;
    font-weight: bold;
    color:#3836de;
  }

  img {
    border-radius:5px;
    width: 50px;
    height: 50px;
    opacity: 0.8;
    border:2px solid #887a7a;
    cursor: pointer;
  }
  .div2 {
    display: inline-block;
    margin-right: 0.7%;
    width: 24%;
    height: 140px;
    background: #545c64;
    border-radius: 10px;
  }
  .div21 {
    display: inline-block;
    width: 24%;
    height: 140px;
    background: #545c64;
    border-radius: 10px;
  }
  .container-title{
    margin-top: 25px;
    font-size: 24px;
    color: white;
    /*font-family: NSimSun;*/
  }
  .container-text{
    /*font-family: NSimSun;*/
    font-weight: bold;
    margin-top: 20px;
    font-size: 40px;
    color: white;
  }
  #div1 {
    text-align: center;
    width: 100%;
    /*margin-bottom: 20px;*/
    padding: 10px 10px 10px 10px;
    background: rgb(255, 255, 255);
    padding: 10px;
    border: 1px solid #ebeef5;
    /*box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);*/
    min-height: 100px;
    border-radius: 10px;
  }
</style>
