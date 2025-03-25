<template>
  <div class="content_container">
    <div id="div1" v-show="userInfo.isTemp">
      <div class="div2">
        <div class="container-title">企业入驻总人数</div>
        <div class="container-text" style="color:#4599f1">{{sumUserNumber}}</div>
      </div>
      <div class="div2">
        <div class="container-title">今日通行总人数</div>
        <div class="container-text" style="color: #67c23ac7">{{sumAccessNumber}}</div>
      </div>
      <div class="div2">
        <div class="container-title">今日访客总人次</div>
        <div class="container-text" style="color: #e905058f">{{sumVisitorNumber}}</div>
      </div>
      <div class="div2">
        <div class="container-title">今日体温异常人数</div>
        <div class="container-text" style="color: red">{{sumTempNumber}}</div>
      </div>
      <div class="div21">
        <div class="container-title">今日行程码异常人数</div>
        <div class="container-text" style="color: red">{{sumTourNumber}}</div>
      </div>
    </div>
    <div id="div2" v-show="userInfo.isTemp == false">
      <div class="div2">
        <div class="container-title">企业入驻总人数</div>
        <div class="container-text" style="color:#4599f1">{{sumUserNumber}}</div>
      </div>
      <div class="div2">
        <div class="container-title">今日通行总人数</div>
        <div class="container-text" style="color: #67c23ac7">{{sumAccessNumber}}</div>
      </div>
      <div class="div2">
        <div class="container-title">今日陌生人总人次</div>
        <div class="container-text" style="color: #e905058f">{{sumStrangerNumber}}</div>
      </div>
      <div class="div2">
        <div class="container-title">今日进门总人次</div>
        <div class="container-text" style="color: red">{{sumInNumber}}</div>
      </div>
      <div class="div21">
        <div class="container-title">今日出门总人次</div>
        <div class="container-text" style="color: red">{{sumOutNumber}}</div>
      </div>
    </div>
    <!--<panel-group @handleSetLineChartData="handleSetLineChartData"/>-->
    <div style="position: absolute;z-index: 2;margin-left: 67.6%;margin-top: 0.7%">
      <el-form :label-position="labelPosition" :inline="true" :model="userParam" class="demo-form-inline" size="mini">
        <el-form-item label="">
          <el-date-picker :clearable="false" @change="selectTime" v-model="userDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                          style="width: 220px;border-radius: 12px;height: 30px">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div id="throngStatistics" style="height: 350px;background: rgb(255, 255, 255); border-radius: 10px;margin-bottom: 20px"></div>
    <div style="position: absolute;z-index: 2;margin-left: 67.6%;margin-top: 0.7%">
      <el-form :label-position="labelPosition" :inline="true" :model="accessParam" class="demo-form-inline" size="mini">
        <el-form-item label="">
          <el-date-picker :clearable="false" @change="selectTime1" v-model="accessDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                          style="width: 220px;border-radius: 12px;height: 30px">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div id="timeFrameStatistics" style="height: 350px;background: rgb(255, 255, 255); border-radius: 10px;"></div>
    <div >
    </div>

  </div>

</template>

<script>
import Echarts from 'echarts'
import {mapGetters} from 'vuex'
import {formatDate} from '@/utils/DateUtil'
import PanelGroup from '../dashboard/components/PanelGroup'
import store from '../../store'
import {sumUserStatistics,userAccessStatistics,AccessTypeStatistics} from '@/api/home'
export default {
  name: 'Dashboard',
  components: {
    PanelGroup
  },
  data() {
    return {
      labelPosition: 'left',
      accessParam: {
        startDate: '',
        endDate:'',
        times: ['00:00-02:00', '02:00-04:00', '04:00-06:00', '06:00-08:00', '08:00-10:00', '10:00-12:00','12:00-14:00','14:00-16:00','16:00-18:00','18:00-20:00','20:00-22:00','22:00-24:00']
      },
      userParam: {
        startDate: '',
        endDate:'',
        times: ['00:00-02:00', '02:00-04:00', '04:00-06:00', '06:00-08:00', '8:00-10:00', '10:00-12:00','12:00-14:00','14:00-16:00','16:00-18:00','18:00-20:00','20:00-22:00','22:00-24:00']
      },
      times: ['00:00-02:00', '02:00-04:00', '04:00-06:00', '06:00-08:00', '8:00-10:00', '10:00-12:00','12:00-14:00','14:00-16:00','16:00-18:00','18:00-20:00','20:00-22:00','22:00-24:00'],
      accessDate: [],
      userDate:[],
      sumUserNumber:0,
      sumAccessNumber:0,
      sumVisitorNumber:0,
      sumTempNumber:0,
      sumTourNumber:0,
      sumStrangerNumber:0,
      sumInNumber:0,
      sumOutNumber:0,
      userList:[0,0,0,0,0,0,0,0,0,0,0,0],
      visitorList:[0,0,0,0,0,0,0,0,0,0,0,0],
      strangerList:[0,0,0,0,0,0,0,0,0,0,0,0],
      inList:[0,0,0,0,0,0,0,0,0,0,0,0],
      outList:[0,0,0,0,0,0,0,0,0,0,0,0],
      userInfo:null,
      myChart:null,
      series: [],
      legend: [],
      throngMin:0,
      throngMax:0,
      throngMin1:0,
      throngMax1:0,
    }
  },
  computed: {
  },
  //调用
  mounted() {
    this.sumUserStatistics();
    this.userAccessStatistics();
    this.AccessTypeStatistics();
    this.throngStatistics();
    this.timeFrameStatistics();
  },
  created() {
    this.userInfo = store.getters.userInfo;
    this.accessDate = this.getDate();
    this.userDate = this.getDate();
  },
  methods: {
    getDate() {
      let dates = [];
      let date1 = new Date();
      date1.setDate(date1.getDate())
      let newTime1 = formatDate(date1, 'yyyy-MM-dd')
      let date = new Date();
      date.setDate(date.getDate())
      let newTime = formatDate(date, 'yyyy-MM-dd')
      dates.push(newTime1)
      dates.push(newTime);
      return dates;
    },
    sumUserStatistics(){
      sumUserStatistics().then(res=>{
        if (res.data.errorCode == 200){
          let data = res.data.data;
          if (data.sumUserNumber != null){
            this.sumUserNumber = data.sumUserNumber;
          }
          if (data.sumAccessNumber != null){
            this.sumAccessNumber = data.sumAccessNumber;
          }
          if (data.sumVisitorNumber != null){
            this.sumVisitorNumber = data.sumVisitorNumber;
          }
          if (data.sumTourNumber != null){
            this.sumTourNumber = data.sumTourNumber;
          }
          if (data.sumStrangerNumber != null){
            this.sumStrangerNumber = data.sumStrangerNumber;
          }
          if (data.sumInNumber != null){
            this.sumInNumber = data.sumInNumber;
          }
          if (data.sumOutNumber != null){
            this.sumOutNumber = data.sumOutNumber;
          }
        }
      })
    },
    selectTime(value){
      this.userAccessStatistics();
    },

    selectTime1(value){
      this.AccessTypeStatistics();
    },
    userAccessStatistics(){
      this.userParam.startDate = this.userDate[0];
      this.userParam.endDate = this.userDate[1];
      this.userParam.times = this.userParam.times + ""
      userAccessStatistics(this.userParam).then(res=>{
        if(res.data.errorCode == 200){
          let data = res.data.data;
          this.userList = data.userStatistics;
          this.visitorList = data.visitorStatistics;
          this.strangerList = data.strangerStatistics;
          let aa = [];
          aa = aa.concat(this.userList);
          aa = aa.concat(this.visitorList);
          aa = aa.concat(this.strangerList);
          aa.sort(this.sortNumber);
          this.throngMin = aa[0];
          this.throngMax = aa[aa.length - 1] + 10
          this.throngStatistics();
        }
      })
    },
    AccessTypeStatistics(){
      this.accessParam.startDate = this.accessDate[0];
      this.accessParam.endDate = this.accessDate[1];
      this.accessParam.times = this.accessParam.times + ""
      AccessTypeStatistics(this.userParam).then(res=>{
        if(res.data.errorCode == 200){
          let data = res.data.data;
          this.inList = data.inStatistics;
          this.outList = data.outStatistics;
          let aa = [];
          aa = aa.concat(this.inList);
          aa = aa.concat(this.outList);
          aa.sort(this.sortNumber);
          this.throngMin1 = aa[0];
          this.throngMax1 = aa[aa.length - 1] + 10
          this.timeFrameStatistics();
        }
      })
    },
    sortNumber(a,b){
      return a-b
    },
    throngStatistics() {
      this.myChart = Echarts.init(document.getElementById('throngStatistics'));
      this.myChart.on("click", this.eConsole);
      let _this = this;
      this.myChart.setOption({
        //图表的标题
        title: {
          text: '通行人群统计',
          x: '2%',
          top:'5%'
        },
        //图表展示的类别，这里的data和series中得name对应
        legend: {
          data:["企业员工","访客","陌生人"],
          x: 'center',            //水平方向的位置'left'，'center'，'right'
          y:'top',             //垂直方向的位置’bottom‘，’top‘
          top:'5%',
          width:10,               //组件的宽和高
          height:10,
          orient:'vertical',    //组件与文字的排列方式，默认横向，纵向为'vertical'
          itemGap: 12,            //每个图例之间的间隔
          textStyle: {            //图例文字属性设置
            // color: '#ffffff',
            fontFamily: 'Microsoft YaHei',
            fontSize: '16'
          },
          tooltip: {              //在legend里的tooltip，在鼠标滑到图例上时，展示自定义的内容
            show: false
          },
        },
        //这里的是采用什么方式触发数据，这里显示的竖轴，跟随鼠标移动到节点上会显示内容
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '5%',
          right: '4%',
        },
        //代表x轴，这里type类型代表字符
        xAxis: [{
          type: 'category',
          boundaryGap: false,//这里表示是否补齐空白
          data: _this.times
        }],
        //代表y轴，这里type类型代表num类型
        yAxis: [{
          type: 'value',
          // name:'通行人数',
          min:_this.throngMin,
          max:_this.throngMax,
          // interval: this.max / 5
          axisLabel:{
            formatter:"{value}人"
          }

        }],
        //图表类型，type表示按照什么类型图表显示，line代表折线，下面的内容与
        //legend一一对应
        series: [{
          name:'企业员工',
          smooth:true,
          data: _this.userList,
          type: 'line',
          // areaStyle : {
          //   normal: {
          //     color: "#4599f1"
          //   }
          // },
          itemStyle: {
            normal: {
              color: "#66b1ff", //折线点的颜色
              lineStyle: {
                color: "#66b1ff"
              }
            }
          }
        },
          {
            name:'访客',
            smooth:true,
            data: _this.visitorList,
            type: 'line',
            // areaStyle : {
            //   normal: {
            //     color: "#ffff008c"
            //   }
            // },
            itemStyle: {
              normal: {
                color: "#e6a23c", //折线点的颜色
                lineStyle: {
                  color: "#e6a23c"
                }
              }
            }
          },
          {
            name:'陌生人',
            smooth:true,
            data: this.strangerList,
            type: 'line',
            // areaStyle : {
            //   normal: {
            //     color: "#f56c6c8c"
            //   }
            // },
            itemStyle: {
              normal: {
                color: "#ce3d3d", //折线点的颜色
                lineStyle: {
                  color: "#ce3d3d"
                }
              }
            }
          }
        ]
      })
    },
    timeFrameStatistics() {
      this.myChart = Echarts.init(document.getElementById('timeFrameStatistics'));
      this.myChart.on("click", this.eConsole);
      this.myChart.setOption({
        //图表的标题
        title: {
          text: '通行时段统计',
          x: '2%',
          top:'5%'
        },
        //图表展示的类别，这里的data和series中得name对应
        legend: {
          data:["进","出"],
          x: 'center',            //水平方向的位置'left'，'center'，'right'
          y:'top',             //垂直方向的位置’bottom‘，’top‘
          top:'5%',
          width:10,               //组件的宽和高
          height:10,
          orient:'vertical',    //组件与文字的排列方式，默认横向，纵向为'vertical'
          itemGap: 12,            //每个图例之间的间隔
          textStyle: {            //图例文字属性设置
            // color: '#ffffff',
            fontFamily: 'Microsoft YaHei',
            fontSize: '16'
          },
          tooltip: {              //在legend里的tooltip，在鼠标滑到图例上时，展示自定义的内容
            show: false
          },
        },
        //这里的是采用什么方式触发数据，这里显示的竖轴，跟随鼠标移动到节点上会显示内容
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '5%',
          right: '4%',
        },
        //代表x轴，这里type类型代表字符
        xAxis: [{
          type: 'category',
          boundaryGap: false,//这里表示是否补齐空白
          data: this.times
        }],
        //代表y轴，这里type类型代表num类型
        yAxis: [{
          type: 'value',
          // name:'通行人数',
          min:this.throngMin1,
          max:this.throngMax1,
          // interval: this.max / 5
          axisLabel:{
            formatter:"{value}人"
          }

        }],
        //图表类型，type表示按照什么类型图表显示，line代表折线，下面的内容与
        //legend一一对应
        series: [{
          name:'进',
          smooth:true,
          data: this.inList,
          type: 'line',
          // areaStyle : {
          //   normal: {
          //     color: "#4599f1"
          //   }
          // },
          itemStyle: {
            normal: {
              color: "#66b1ff", //折线点的颜色
              lineStyle: {
                color: "#66b1ff"
              }
            }
          }
        },
          {
            name:'出',
            smooth:true,
            data: this.outList,
            type: 'line',
            // areaStyle : {
            //   normal: {
            //     color: "#67c23a9e"
            //   }
            // },
            itemStyle: {
              normal: {
                color: "#67c23a", //折线点的颜色
                lineStyle: {
                  color: "#67c23a"
                }
              }
            }
          }
        ]
      })
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
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
  /*box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);*/
  min-height: 100px;
  border-radius: 10px;

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
  border-radius: 50%;
  vertical-align: middle;
  background-color: #5e6d82;
  margin-right: 5px;
}

.container {
  position: relative;
  width: 19%;
  margin-right: 10px;
  text-align: center;
  padding-top: 33px;
  /*margin-bottom:20px;*/
  height: 100px;
  border-radius: 5px;
}

/*.container:hover {*/
/*  border:2px solid #887a7a;*/
/*}*/
.title {
  position: relative;
  width: 10%;
  margin-right: 20px;
  margin-bottom: 20px;
  height: 100px;
  border-radius: 5px;
}

.department {
  position: relative;
  width: 5%;
  border-radius: 5px;
}

.department:hover {
  border: 2px solid #887a7a;
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
  color: #3836de;
}

.center {
  position: absolute;
  left: 0;
  top: 30%;
  width: 100%;
  text-align: center;
  font-size: 18px;
  margin-top: -9px;
  line-height: 18px;
  /*cursor: pointer;*/
  font-weight: bold;
  color: #3836de;
}

.center1 {
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  text-align: center;
  font-size: 18px;
  margin-top: -9px;
  /*line-height: 72px;*/
  /*cursor: pointer;*/
  font-weight: bold;
  color: #3836de;
}

img {
  border-radius: 5px;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

#div1 {
  text-align: center;
  width: 100%;
  margin-bottom: 20px;
  padding: 10px 10px 10px 10px;
  background: rgb(255, 255, 255);
  padding: 10px;
  border: 1px solid #ebeef5;
  /*box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);*/
  min-height: 100px;
  border-radius: 10px;
}
#div2 {
  text-align: center;
  width: 100%;
  margin-bottom: 20px;
  padding: 10px 10px 10px 10px;
  background: rgb(255, 255, 255);
  padding: 10px;
  border: 1px solid #ebeef5;
  /*box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);*/
  min-height: 100px;
  border-radius: 10px;
}

.div2 {
  display: inline-block;
  margin-right: 0.7%;
  width: 19%;
  height: 140px;
  background: #66b1ff1c;
  border-radius: 10px;
}
.div21 {
  display: inline-block;
  width: 19%;
  height: 140px;
  background: #66b1ff1c;
  border-radius: 10px;
}
.container-title{
  margin-top: 25px;
  font-size: 24px;
  color: #2e2e2ebf;
  /*font-family: NSimSun;*/
}
.container-text{
  /*font-family: NSimSun;*/
  font-weight: bold;
  margin-top: 20px;
  font-size: 40px;
}
</style>
