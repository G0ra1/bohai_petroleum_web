<template>
  <div class="content_container">
    <div class="content_title">
      <h3>安全体温设置</h3>
    </div>
    <el-form :label-position="labelPosition" :inline="true" :model="form" class="demo-form-inline" size="mini">

      <el-form-item label="安全体温">
        <el-input v-model="form.temperature" placeholder="安全体温" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="setTemperature" icon="el-icon-search">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getTemperature,setTemperature} from '@/api/epidemic'
  import {Message} from 'element-ui'
    export default {
        name: "temperature",
      data(){
          return{
            labelPosition: 'left',
            form:{
              id:'',
              cId:'',
              temperature:'',
              updateDate:'',
            }
          }
      },
      created() {
        this.getTemperature();
      },
      methods:{
        getTemperature(){
          getTemperature().then(response=>{
            if (response.data.errorCode == 200){
              this.form = response.data.data;
              if (this.form == null){
                this.form = {
                  id:null,
                  cId:null,
                  temperature:'',
                  updateDate:null,
                }
              }
            }else{
              Message.error("系统错误");
            }
          })
        },
        setTemperature(){
          this.form.temperature = this.form.temperature + ""
          setTemperature(this.form).then(response=>{
            if (response.data.errorCode == 200){
              this.getTemperature();
              Message.success("保存成功")
            }else{
              Message.error("保存失败")
            }
          })
        }
      },
    }
</script>

<style scoped>

</style>
