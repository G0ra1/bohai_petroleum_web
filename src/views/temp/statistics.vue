<template>
  <div class="content_container" style="width: 100%">
    <div class="content_title">
      <h3>统计报表</h3>
    </div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
        <m-echarts-f :echartObj="echartObj2" ></m-echarts-f>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
        <m-echarts :echartsSttyle="s" :echartObj="echartObj" :id="id1"
        ></m-echarts>
      </el-col>
    </el-row>
    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" style="width: 50%;margin: 0 auto" center>
      <el-form :label-position="labelPosition" :inline="true" :model="dayForm" class="demo-form-inline" size="mini">
        <el-form-item label="项目部" prop="departmentId">
          <selectTree
            ref="selectTree"
            :props="props"
            :options="data"
            :value="dayForm.departmentId"
            :clearable="isClearable"
            :accordion="isAccordion"
            @getValue="getValue4($event)"/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="dayForm.name" placeholder="姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="vacationDate1" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                          style="width: 250px">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="getPresentStatistice">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible1" @close="" style="width: 50%;margin: 0 auto" center>
      <el-form :label-position="labelPosition" :inline="true" :model="presentForm" class="demo-form-inline" size="mini">
        <el-form-item label="日期" prop="startDate">
          <el-date-picker v-model="presentForm.startDate" type="date" placeholder="选择日"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="getDayStatistice">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import mEcharts from './components/echarts'
import mEchartsF from './components/echarts1'
import selectTree from '@/components/treeSelect/el-tree-select'
import {getDepartments} from '@/api/department'
import {getDayStatistice, getPresentStatistice, getDayStatisticeDetail} from '@/api/epidemic'
import {listToTree} from '@/utils'
import {getDay} from '@/utils/DateUtil'
import {Message} from 'element-ui'
import {formatDate} from '@/utils/DateUtil'

export default {
  name: "settingNewa",
  components: {
    mEcharts,
    mEchartsF,
    selectTree
  },

  data() {
    const validateJobNumber = (rule, value, callback) => {
      this.dialogFormVisible = true;
    }
    const validateJobNumber1 = (rule, value, callback) => {
      this.dialogFormVisible1 = true;
    }
    return {
      dialogName: '高级搜索',
      vacationDate: [],
      vacationDate1: [],
      dateArray: [],
      inData: [],
      outData: [],
      dialogFormVisible: false,
      dialogFormVisible1:false,
      day: 14,
      present: null,
      dayStatistics: null,
      props: {                // 配置项（必选）
        value: 'id',
        label: 'name',
        children: 'children',
        // disabled:true
      },
      data: [],
      data1: [],
      presentForm: {
        startDate: '',
      },
      severalDaysForm: {
        clbumId: '',
        departmentId: '',
        startDate: '',
        endDate: '',
        day: '',
        name: ''
      },
      dayForm: {
        departmentId: '',
        startDate: '',
        endDate: '',
        name: ''
      },
      isClearable: true,      // 可清空（可选）
      isAccordion: true,      // 可收起（可选）
      labelPosition: 'left',

      xAxis: [],
      id: 'aa',
      id1: 'bb',
      s: {
        height: '380px',
        width: '100%',
        margin: '50px 0 0 0',

      },
      echartObj: {
        title: {
          text: '员工/陌生人体温不正常人数',
          x: '5%',
          y: 'top',//垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
          textStyle: {
            fontSize: '18px'
          }
        },
        tooltip: {},
        toolbox: {
          padding: 30,
          show: true,
          feature: {
            myTool2: {//自定义按钮 danielinbiti,这里增加，selfbuttons可以随便取名字
              show: true,//是否显示
              title: '高级搜索', //鼠标移动上去显示的文字
              icon: 'path://M3,17.25V21h3.75L17.811,9.94l-3.75-3.75L3,17.25z M20.71,7.04c0.39-0.39,0.39-1.02,0-1.41l-2.34-2.34  c-0.39-0.39-1.021-0.39-1.41,0l-1.83,1.83l3.75,3.75L20.71,7.04z', //图标
              onclick: function () {//点击事件,这里的option1是chart的option信息
                validateJobNumber1();
              }
            },
          }
        },
        xAxis: {
          data: [],
          textStyle: {
            fontSize: '18px'
          }
        },
        legend: {
          y: 'top',
          x: '75%',
          data: ['员工', '陌生人'],
          icon: 'rect',
          textStyle: {
            fontSize: '18px'
          }

        },
        yAxis: {},
        series: [{
          name: '员工',
          type: 'bar',
          data: [],
          barWidth: 100,
          textStyle: {
            fontSize: '18px'
          }
        }, {
          name: '陌生人',
          type: 'bar',
          data: [],
          barWidth: 100,
          textStyle: {
            fontSize: '18px'
          }
        }]
      },
      echartObj2: {
        title: {
          text: '员工体温正常/不正常人数统计',
          x: '5%',//水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
          y: 'top',//垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
          link: "",
          textStyle: {
            fontSize: '18px'
          }
        },
        tooltip: {              //设置tip提示
          trigger: 'axis'
        },
        toolbox: {
          padding: 30,
          show: true,
          feature: {
            myTool2: {//自定义按钮 danielinbiti,这里增加，selfbuttons可以随便取名字
              show: true,//是否显示
              title: '高级搜索', //鼠标移动上去显示的文字
              icon: 'path://M3,17.25V21h3.75L17.811,9.94l-3.75-3.75L3,17.25z M20.71,7.04c0.39-0.39,0.39-1.02,0-1.41l-2.34-2.34  c-0.39-0.39-1.021-0.39-1.41,0l-1.83,1.83l3.75,3.75L20.71,7.04z', //图标
              onclick: function () {//点击事件,这里的option1是chart的option信息
                validateJobNumber();
              }
            },
          }
        },
        legend: {
          y: 'top',
          x: 'center',
          data: ['正常', '异常'],
          icon: 'rect',
          textStyle: {
            fontSize: '18px'
          }

        },
        xAxis: {                //设置x轴
          type: 'category',
          boundaryGap: false,     //坐标轴两边不留白
          data: [],
          textStyle: {
            fontSize: '18px'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          nameTextStyle: {
            fontSize: 16,
            padding: [0, 0, 10, 0]
          },
          axisLine: {
            lineStyle: {}
          },
          type: 'value'
        },
        series: [
          {
            name: '正常',
            data: [0],
            type: 'line',               // 类型为折线图
            // 显示数值
            itemStyle: {
              normal: {
                label: {
                  show: true
                }
              }
            },
            textStyle: {
              fontSize: '18px'
            }
          },
          {
            name: '异常',
            data: [0],
            type: 'line',
            // 显示数值
            itemStyle: {
              normal: {
                label: {
                  show: true
                }
              },
              textStyle: {
                fontSize: '18px'
              }
            }
          }
        ]
      }
    }
  },
  mounted() {
    let width = document.documentElement.clientWidth;
    let fontSize = (width / 1082 * 9);
    this.echartObj.title.textStyle.fontSize = fontSize;
    this.echartObj.xAxis.textStyle.fontSize = fontSize;
    this.echartObj.legend.textStyle.fontSize = fontSize;
    this.echartObj.series[0].textStyle.fontSize = fontSize;
    this.echartObj.series[1].textStyle.fontSize = fontSize;

    this.echartObj2.title.textStyle.fontSize = fontSize;
    this.echartObj2.xAxis.textStyle.fontSize = fontSize;
    this.echartObj2.legend.textStyle.fontSize = fontSize;
    this.echartObj2.series[0].textStyle.fontSize = fontSize;
    this.echartObj2.series[1].textStyle.fontSize = fontSize;
  },
  created() {
    // 获取屏幕高度


    this.setDate1();
    this.setDate2();
    this.getDepartments();
    this.getDayStatistice();
    this.getPresentStatistice();
  },

  methods: {
    setDate1() {
      let date = new Date();
      this.presentForm.startDate = formatDate(date, 'yyyy-MM-dd')
    },
    setDate2() {
      this.vacationDate1 = this.getDate();
      let day = getDay(this.vacationDate[0], this.vacationDate[1])
      this.severalDaysForm.day = day;
    },
    getDate() {
      let dates = [];
      let date1 = new Date();
      date1.setDate(date1.getDate() - 3)
      let newTime1 = formatDate(date1, 'yyyy-MM-dd')
      let date = new Date();
      date.setDate(date.getDate())
      let newTime = formatDate(date, 'yyyy-MM-dd')
      dates.push(newTime1)
      dates.push(newTime);
      return dates;
    },
    getDepartments() {
      getDepartments().then(response => {
        let result = response.data.data;
        this.departments = result;
        this.data = listToTree(result)
      })
    },
    getDayStatistice() {
      if (this.presentForm.startDate == null || this.presentForm.startDate == '') {
        Message.error("请选择日期");
        return;
      }
      this.echartObj.series[0].data=[];
      this.echartObj.series[1].data=[];
      this.echartObj.title.text = this.presentForm.startDate + "员工/陌生人体温不正常人数";
      getDayStatistice(this.presentForm).then(response => {
        if (response.data.errorCode == 200) {
          this.dialogFormVisible1 = false;
          this.present = response.data.data;
          this.echartObj.title.text = this.presentForm.startDate + "员工/陌生人体温不正常人数";
          this.echartObj.series[0].data.push(this.present.employee);
          this.echartObj.series[1].data.push(this.present.stranger);
        } else {
          Message.error(response.data.errorMsg);
        }
      })
    },
    getPresentStatistice() {
      if (this.vacationDate1 == null || this.vacationDate1.length < 1) {
        Message.error("请选择日期");
        return;
      }
      this.dayForm.startDate = this.vacationDate1[0];
      this.dayForm.endDate = this.vacationDate1[1];
      this.echartObj2.series[0].data = [];
      this.echartObj2.series[1].data = [];
      let day = getDay(this.vacationDate1[0], this.vacationDate1[1])
      this.echartObj2.title.text = '近' + day + '天员工体温正常/不正常人数统计'
      this.echartObj2.xAxis.data = ["2020-04-04", "2020-04-05", "2020-04-06", "2020-04-07"];
      // this.echartObj2.series[0].data = result.normalDatas;
      // this.echartObj2.series[1].data = result.anomalyDatas;
      this.echartObj2.series[0].data = [10, 60, 70, 50];
      this.echartObj2.series[1].data = [5, 2, 3, 8];
      getPresentStatistice(this.dayForm).then(response => {
        if (response.data.errorCode == 200) {
          this.dialogFormVisible = false;
          let result = response.data.data;
          this.dayStatistics = result;
          this.echartObj2.xAxis.data = result.dates;
          // this.echartObj2.series[0].data = result.normalDatas;
          // this.echartObj2.series[1].data = result.anomalyDatas;
          this.echartObj2.series[0].data = result.normalDatas;
          this.echartObj2.series[1].data = result.anomalyDatas;
        } else {
          Message.error(response.data.errorMsg)
        }
      })
    },
    getValue(value) {
      this.presentForm.departmentId = value
    },
    getValue4(value) {
      this.dayForm.departmentId = value
    },

    getEchartData1(val) {
      let userIds = [];
      let userType;
      if (val.seriesName == '员工') {
        this.present.trEmpList.forEach(function (value, index, array) {
          userIds.push(value.userId);
        })
        userType = 1;
        // this.$router.push({
        //   path: '/attendance1/presentDetails1',
        //   query: {
        //     mallCode: preSent
        //   }
        // })
      } else {
        userIds = [];
        // this.present.trStrList.forEach(function (value,index,array) {
        //   userIds.push(value.userId);
        // })
        userType = -1;
        // this.$router.push({
        //   path: '/attendance2/presentDetails2',
        //   query: {
        //     mallCode: preSent
        //   }
        // })
      }
      const loading = this.$loading({
        lock: true,
        text: '数据加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      getDayStatisticeDetail(userIds + "", userType, this.dayForm.startDate).then(response => {
        loading.close();
        if (response.data.errorCode == 200) {
          if (userType == 1) {
            this.$router.push({
              path: '/attendance1/presentDetails1',
              query: {
                mallCode: response.data.data
              }
            });
          } else {
            this.$router.push({
              path: '/attendance2/presentDetails2',
              query: {
                mallCode: response.data.data
              }
            })
          }
        } else {
          Message.error()
        }
      })
    },
    getEchartData3(val) {
      let data = [];
      if (val.seriesName == '正常') {
        for (let i = 0; i < this.dayStatistics.normalList.length; i++) {
          if (this.dayStatistics.normalList[i].date.substring(0, 10) == val.name) {
            data.push(this.dayStatistics.normalList[i]);
          }
        }
      } else {
        for (let i = 0; i < this.dayStatistics.anomalyList.length; i++) {
          if (this.dayStatistics.anomalyList[i].date.substring(0, 10) == val.name) {
            data.push(this.dayStatistics.anomalyList[i]);
          }
        }
      }
      this.$router.push({
        path: '/epidemic1/index',
        query: {
          mallCode: data
        }
      })
    }

  }

}
</script>

<style scoped>

</style>
