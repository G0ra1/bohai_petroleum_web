<template>
  <div class="echarts">
    <div :id="id" :style="echartsSttyle"></div>
  </div>
</template>

<script>
    import Echarts from 'echarts'
    export default {
        data() {
            return{
                myChart: {}
            }
        },
        props: {
            echartObj: {
                type: Object,
                default: {}
            },
            id:{type:String,default: ''},
            echartsSttyle:{type:Array,default(){return []}},
            legend: {
                type: Array, default() {
                    return []
                }
            },
        },

        mounted(){

            this.$nextTick(()=> {
                this.loadEchart(this.id)
            })
          window.onresize = this.myChart.resize;
            let _this = this;
            window.onresize = function() {
                _this.myChart.resize()
            }
        },
        methods: {
            eConsole(param) {

                // 向父组件传值
                this.$emit("currentEchartData",param);

            },

            loadEchart(id) {
                this.myChart = Echarts.init(document.getElementById(id));
                this.myChart.on("click", this.eConsole);
                this.myChart.setOption({
                    title: this.echartObj.title,
                    tooltip: {},
                    legend:this.echartObj.legend ,
                    xAxis: {
                        data: this.echartObj.xAxis.data
                    },
                    yAxis: {},
                    series: this.echartObj.series
                })
            }
        },
        watch: {
            //观察option的变化
            echartObj: {
                handler(newVal, oldVal) {
                    if (this.myChart) {
                        if (newVal) {
                            this.myChart.setOption(newVal);
                        } else {
                            this.myChart.setOption(oldVal);
                        }
                    } else {
                        this.loadEchart(this.id);
                    }
                },
                deep: true //对象内部属性的监听，关键。
            }
        },
    }
</script>

<style>
  #echart {
    width: 50%;
    height: 300px;
  }
</style>
