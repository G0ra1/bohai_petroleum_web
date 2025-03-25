<!--访客授权-->
<template>
  <div class="content_container">
    <div class="content_title">
      <h3>访客授权</h3>
    </div>

    <div>
      <el-form label-position="left" ref="form" :model="form" label-width="100px" :rules="formRules">
        <el-form-item label="访客权限">
          <el-radio v-model="form.type" label="1">与被访者同权</el-radio>
          <el-radio v-model="form.type" label="2">自定义设备</el-radio>
        </el-form-item>
        <el-form-item label="位置选择"  prop="locations">
          <el-checkbox-group v-model="form.locations" :disabled="form.type==1">
            <el-checkbox v-for="item in locations" :label="item.id" :key="item.id" border>
              {{item.location}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!--<el-form-item label="设备选择">-->
          <!--<el-checkbox-group v-model="form.devices" :disabled="form.type==1">-->
            <!--<el-checkbox v-for="item in deviceList" :label="item.id" :key="item.id" border>-->
              <!--{{item.location}}-{{item.type}}-{{ item.name }}-->
            <!--</el-checkbox>-->
          <!--</el-checkbox-group>-->
        <!--</el-form-item>-->
        <el-form-item >
          <el-button @click="authVisitor" class="ygng_btn_confirm">确认</el-button>
          <el-button @click="cancelOperate">取消</el-button>
        </el-form-item>
      </el-form>
    </div>



  </div>
</template>

<script>
  import {getDeviceList,getAuthVisitor,authVisitor} from '@/api/device'
  import {Message} from 'element-ui'
  import {getLocationList} from '@/api/location'

  export default {
    name: "visitorAuth",
    created() {
      // this.getDeviceList();
      this.getLocationList();
      this.getAuthVisitor();

    },
    data() {
      const validateLocations = (rule, value, callback) => {//校验编号

        if (this.form.type == 2 && (value == null || value.length == 0)) {
          callback(new Error('请选择位置'))
        } else {
          callback()
        }
      }
      return {
        locations:[],
        deviceList: [],//设备列表
        form:{
          type: '1',//访客的授权方式
          devices: [],
          locations:[],
        },
        formRules: {

          locations: [ { trigger: 'blur',validator: validateLocations}],

        },
      };
    },
    methods: {
      getDeviceList() {
        getDeviceList().then(response => {
          this.deviceList = response.data.data;
        })
      },
      getLocationList() {
        getLocationList().then(response => {
          this.locations = response.data.data;
        })
      },
      getAuthVisitor(){
        getAuthVisitor().then(response=>{
          let result  = response.data.data;
          if(result){
            this.form.type = result.type+"";
            this.form.devices = result.devices==""?[]:result.devices;
            this.form.locations = result.locations==""?[]:result.locations;
          }
        });
      },
      authVisitor(){

        this.$refs.form.validate(valid => {
          if (valid) {
            authVisitor(this.form).then(response=>{
              if (response.data.errorCode == 200) {
                Message.success("操作成功");
              }else{
                Message.error(response.data.errorMsg);
              }
            });
          }
        });


      },
      cancelOperate(){
        this.$router.go(-1);//返回上一层
      },

    },
  }
</script>

<style scoped>

</style>
