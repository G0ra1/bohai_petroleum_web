<template>
    <div class="form_container">
      <div class="login-form" v-show="currentPage == 'login'">
        <div class="title-container">
          <h3 class="title">登录系统</h3>
        </div>
        <hr class="split_line">
        <div class="form_content">
        <el-form ref="loginForm" :rules="loginRules" :model="loginForm" size="mini">
          <el-form-item prop="raw_username">
            <el-input
              v-model.trim="loginForm.raw_username"
              :placeholder="jobName"
              name="username"
              type="text"
              auto-complete="on"
            />
          </el-form-item>
          <el-form-item >
            <el-input
              :type="passwordType"
              v-model.trim="loginForm.password"
              :placeholder="$t('login.password')"
              name="password"
              auto-complete="on"
              @keyup.enter.native="handleLogin"/>
          </el-form-item>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;background: #f5856d;border:none" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
        </el-form>
      </div>
      </div>
    </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate'
  import { Message,MessageBox } from 'element-ui'
  import {checkCode,checkPhone} from '@/api/login';
  import store from '@/store'
  import Cookies from 'js-cookie'
  export default {
    name: 'LoginForm',
    // components: {LangSelect},
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      const validatePhone = (rule, value, callback) => {
        if (value.length == 0) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      const validatePhoneRegister = (rule, value, callback) => {
        if (value.length != 11) {
          callback(new Error('请输入正确的手机号'))
        } else {
          let phoneParam = {
            phone:value
          }
          checkPhone(phoneParam).then(response=>{
            if(response.data.errorCode != 200){
              callback(new Error(response.data.errorMsg))
            }else{
              callback()
            }
          })
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码长度不能低于6位'))
        } else {
          callback()
        }
      }
      const validateCheckCode = (rule, value, callback) => {
        if (value.length < 4) {
          callback(new Error('验证码格式错误'))
        } else {
          callback()
        }
      }
      const validateCname = (rule, value, callback) => {
        if (value == null || value =="") {
          callback(new Error('请输入公司编码'))
        } else {
          callback()
        }
      }
      return {
        jobName:'账号',
        loginForm: {
          raw_username:'',
          username: '',
          userType:'3',
          password: '',
          imageCode:''
        },
        registerForm:{
          cname:"",
          phone:'',
          password:'',
          smsCode:''
        },
        loginRules: {
          raw_username: [{required: true, trigger: 'blur', validator: validatePhone}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}],
          imageCode: [{required: true, trigger: 'blur', validator: validateCheckCode}],
        },
        registerRules:{
          cname: [{required: true, trigger: 'blur', validator: validateCname}],
          phone: [{required: true, trigger: 'blur', validator: validatePhoneRegister}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}],
          smsCode: [{required: true, trigger: 'blur', validator: validateCheckCode}]
        },
        passwordType: 'password',
        loading: false,
        showDialog: false,
        redirect: undefined,
        currentPage:'login',
        codeButtonValue:'获取验证码',
        totalTime:60,
        canClick: true //添加canClick
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }

    },
    methods: {
      checkPhone,
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.loginForm.username = this.loginForm.raw_username ;
            this.$store.dispatch('LoginByUsername', this.loginForm).then((response) => {
              this.loading = false
              let user = JSON.parse(Cookies.get("Admin-Token"));
              if (user.day < 30){
                this.$alert('您的账号有效期剩余 ' + user.day + ' 天，请联系管理员续费', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push({path:  '/'})
                  }
                });
              }else{
                this.$router.push({path:  '/'})
              }
              //this.$router.push({path:  '/'})
            }).catch((err) => {
              this.loading = false
              this.$message.error("账号或密码错误")
            })
          } else {
            return false
          }
        })
      },
    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #fff;
  $dark_gray: #889aa4;
  $light_gray: #eee;


  .form_container{
    float: right;
    width: 338px;
   // height:350px;
    background: #fff;
    padding-bottom: 15px;
    margin-right: 60px;
  }


  .form_content{
    margin-top: 20px;
    margin-left: 40px;
    margin-right: 40px;
  }


  .title-container {
    position: relative;
    .title {
      font-size: 18px;
      color: #444444;
      margin: 0px auto;
      padding-top: 40px;
      text-align: center;
      font-weight: bold;
    }

  }



</style>
