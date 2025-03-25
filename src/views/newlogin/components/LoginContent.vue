<template>
  <di>
    <div class="login_main">
      <el-col :span="14" class="login_pic_container">
        <div class="login_text">考勤管理系统</div>
        <img class="logo_img"  src="@/assets/login3.png"/>
      </el-col>
      <el-col :span="10" class="login_form_container ">
        <LoginForm></LoginForm>
      </el-col>

    </div>
    <div class="login_main1">
      <div style="color: white;font-size: 16px;text-align: center">技术支持：阳光暖果（北京）科技发展有限公司</div>
    </div>
  </di>


</template>

<script>
import LoginForm  from './LoginForm'
export default {
  name: "LoginContent",
  components: {
    LoginForm
  },
}
</script>

<style scoped>
.login_main{
  display: flex;
  justify-content:center;
  align-items:Center;
  height:calc(100% - 100px);
  min-height: 597px;
  min-width: 1000px;
  max-width: 1200px;
  width: 80%;
  margin: 0 auto;
  position: relative;
}
.login_main1{
  justify-content:center;
  align-items:Center;
  min-width: 1000px;
  max-width: 1200px;
  width: 80%;
  margin: 0 auto;
  position: relative;
}
.logo_img{
  width:auto;
  max-width: 100%;
  height: 70%;
  position: absolute;
}
.login_pic_container{
  max-height: 100%;
  height: calc(100% - 70px);
  float: left;
}
.login_form_container{
  /*margin-top: 80px;*/
  float: right;
}
.login_text{
  position: absolute;
  font-size: 30px;
  color: white;
  margin: 12% 0 0 7%;
  z-index: 99;
}
</style>
