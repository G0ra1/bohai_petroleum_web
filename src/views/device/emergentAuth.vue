<template>
  <div class="content_container">
    <div class="content_title">
      <h3>紧急设置</h3>
    </div>
    <div>
      <el-form label-position="left" ref="form" :model="form" label-width="100px" :rules="formRules">
        <!--        <el-form-item label="开启紧急设置">-->
        <!--          <el-tooltip class="item" effect="dark" content="开启后授权门禁将启动常开模式" placement="right">-->
        <!--          <el-switch v-model="form.status"-->
        <!--                     active-value="1"-->
        <!--                     inactive-value="0"></el-switch>-->
        <!--          </el-tooltip>-->
        <!--        </el-form-item>-->
        <el-form-item label="位置选择"  prop="locations">
          <el-checkbox-group v-model="form.locations" >
            <el-checkbox v-for="item in locations" :label="item.id" :key="item.id" border>
              {{item.location}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择模式">
          <el-radio-group v-model="form.status">
            <el-radio label="0">正常模式</el-radio>
            <el-radio label="1">常开模式</el-radio>
            <el-radio label="2">常闭模式</el-radio>
          </el-radio-group>

        </el-form-item>
        <!--<el-form-item label="设备选择">-->
        <!--<el-checkbox-group v-model="form.devices" :disabled="form.status==0">-->
        <!--<el-checkbox v-for="item in deviceList" :label="item.id" :key="item.id" border>-->
        <!--{{item.location}}-{{item.type}}-{{ item.name }}-->
        <!--</el-checkbox>-->
        <!--</el-checkbox-group>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button  @click="authSetting" class="ygng_btn_confirm" >确定</el-button>
<!--          <el-button @click="cancelOperate">取消</el-button>-->
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
  import {getDeviceList,getAuthSetting,authSetting} from '@/api/device'
  import {getLocationList} from '@/api/location'
  import {Message} from 'element-ui'
  export default {
    name: "emergentAuth",
    created() {
      // this.getDeviceList();
      this.getLocationList();
      // this.getAuthSetting();

    },
    data() {
      const validateLocations = (rule, value, callback) => {//校验编号

        if (this.form.status == 1 && (value == null || value.length == 0)) {
          callback(new Error('请选择位置'))
        } else {
          callback()
        }
      }
      return {
        form:{
          status: '',
          devices:[],
          locations:[],
        },
        formRules: {

          locations: [ { trigger: 'blur',validator: validateLocations}],

        },
        deviceList: [],//设备列表
        locations:[],
      }
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
      getAuthSetting(){
        getAuthSetting().then(response=>{
          let result  = response.data.data;
          if(result){
            this.form.status = result.status+"";
            this.form.devices = result.devices==""?[]:result.devices;
            this.form.locations = result.locations==""?[]:result.locations;
          }
        });
      },
      authSetting(){
        if(this.form.status == null || this.form.status == ''){
          Message.error("请选择模式")
          return;
        }
        if(this.form.locations == null || this.form.locations.length < 1){
          Message.error("请选择位置")
          return;
        }
        this.$refs.form.validate(valid => {
          if (valid) {
            authSetting(this.form).then(response=>{
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
