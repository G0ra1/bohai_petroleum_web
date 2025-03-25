<template>
  <div id="main" style="width: 100%;height: 350px;margin: 50px 0 0 0;"></div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        name: "echarts1",
        props: {
            title: {type: String, default: ''},
            legend: {
                type: Array, default() {
                    return []
                }
            },
            dateArray: {
                type: Array, default() {
                    return []
                }
            },
            dataArray: {
                type: Array, default() {
                    return []
                }
            },
            dataArray1: {
                type: Array, default() {
                    return []
                }
            },
            echartObj: {
                type: Object,
                default: {}
            },
        },
        mounted() {
            this.$nextTick(function () {
                this.drawLine('main')
            })

        },
        methods: {
            eConsole(param) {

                // 向父组件传值

                this.$emit("currentEchartData", param);

            },
            drawLine(id) {
                this.charts = echarts.init(document.getElementById(id))
                this.charts.on("click", this.eConsole);
                this.charts.setOption({title:this.echartObj.title,
                    tooltip:this.echartObj.tooltip,
                    legend:this.echartObj.legend,
                    xAxis:this.echartObj.xAxis,
                    grid:this.echartObj.grid,
                    yAxis:this.echartObj.yAxis,
                    series:this.echartObj.series})
            },
        },
        watch: {
            //观察option的变化
            echartObj: {
                handler(newVal, oldVal) {
                    if (this.charts) {
                        if (newVal) {
                            this.charts.setOption(newVal);
                        } else {
                            this.charts.setOption(oldVal);
                        }
                    } else {
                        this.drawLine('main');
                    }
                },
                deep: true, //对象内部属性的监听，关键。

            }
        },
    }
</script>

<style scoped>

</style>
