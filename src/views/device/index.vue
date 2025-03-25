<template>
  <div class="content_container">
    <div class="content_title">
      <h3>设备信息</h3>
    </div>
    <div class="operate " >
      <el-button   type="primary" @click="openAddDialog" size="mini"  icon="el-icon-circle-plus-outline">添加设备</el-button>
    </div>
    <div class="">
      <el-table
        :data="tableData"
        stripe
        border
        cell-style="padding: 5px 0;"
        row-style="height:30px;"
        :header-cell-style="{background:'#e6e6e6'}"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row>
              <el-col :span="8">
                <el-form label-position="right"  class="demo-table-expand" size="mini">
                  <el-form-item label="开机自启">
                    <el-switch
                      v-model="props.row.autoStart"
                      disabled="true"
                      style="margin-left: 28px">
                    </el-switch>
                  </el-form-item>
                  <el-form-item label="守护进程">
                    <el-switch
                      v-model="props.row.daemon"
                      disabled="true"
                      style="margin-left: 28px">
                    </el-switch>
                  </el-form-item>
                  <el-form-item label="设备每日重启">
                    <el-switch
                      v-model="props.row.autoReboot"
                      disabled="true"
                    >
                    </el-switch>
                  </el-form-item>
                  <el-form-item label="设备每日重启时间">
                    <span>{{ props.row.rebootTime }}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8">
                <el-form label-position="right"  class="demo-table-expand" size="mini">
                  <el-form-item label="关门延迟">
                    <span style="margin-left: 13px">{{ props.row.delayClose }}s</span>
                  </el-form-item>
                  <el-form-item label="识别时间窗">
                    <span>{{ props.row.timeWindow }}s</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8">
                <el-form label-position="right"  class="demo-table-expand" size="mini">
                  <el-form-item label="识别阈值">
                    <span>{{ props.row.checkThreshold }}</span>
                  </el-form-item>

                  <el-form-item label="近红外活检阈值">
                    <span>{{ props.row.livenessThreshold }}</span>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="设备名称" header-align="center" align="center"> </el-table-column>
        <el-table-column prop="deviceSerial" width="280px" label="设备编号" header-align="center" align="center"> </el-table-column>
        <el-table-column  prop="locationName" label="安装位置" header-align="center" align="center"> </el-table-column>
        <el-table-column prop="connectStatus" label="状态" header-align="center" align="center">
          <template scope="scope">
            <span v-if="scope.row.connectStatus == '链接正常'" style="color:#2cea14">{{ scope.row.connectStatus }}</span>
            <span v-else style="color: red">{{ scope.row.connectStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column width="140px" label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-dropdown size="small"  @command="handleCommand" v-if="scope.row.type != '访客机'">
              <span class="el-dropdown-link el-button--text el-button--mini">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="composeValue('update',scope.row)">修改配置</el-dropdown-item>
                <el-dropdown-item :command="composeValue('delete',scope.row)">删除设备</el-dropdown-item>
                <el-dropdown-item :command="composeValue('updatePwd',scope.row)">修改密码</el-dropdown-item>
                <el-dropdown-item :command="composeValue('camera',scope.row)">摄像头设置</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button v-if="scope.row.type =='访客机'" size="mini" type="text" @click="openUpdateDialog1(scope.row)">修改配置</el-button>
            <el-button v-if="scope.row.type =='访客机'" size="mini" type="text" @click="onDelete(scope.row)">删除设备</el-button>
          </template>
        </el-table-column>

      </el-table>
      <div>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, prev, pager, next"
          :total="totalElements">
        </el-pagination>
      </div>
    </div>
    <Dialog v-show="dialog1.showDialog" :dialog-option="dialog1.dialogOption" @cancel="dialog1.showDialog = false" @submit="onSubmit()" :loading="loading" ref="dialog">
      <div slot="name1">
        <el-form :label-position="dialog1.labelPosition"  ref="dialogForm" :rules="formRules" :model="dialog1.form" label-width="100px" size="mini">

          <el-form-item label="设备名称" prop="name">
            <el-input v-model.trim="dialog1.form.name" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="设备编号" prop="deviceSerial">
            <el-input v-model.trim="dialog1.form.deviceSerial" :disabled="updateDialog" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="安装地区" prop="locationId">
            <el-select v-model="dialog1.form.locationId" placeholder="请选择">
              <el-option
                v-for="item in location"
                :label="item.location"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="开机自启" v-if="addOption === false">
            <el-switch v-model="dialog1.form.autoStart"></el-switch>
          </el-form-item>

          <el-form-item label="守护进程" v-if="addOption === false">
            <el-switch v-model="dialog1.form.daemon"></el-switch>
          </el-form-item>


          <el-form-item label="设备每日重启" v-if="addOption === false">
            <el-switch v-model="dialog1.form.autoReboot"></el-switch>
          </el-form-item>

          <el-form-item label="设备每日重启时间" prop="rebootTime" v-if="addOption === false">
            <el-time-picker
              :disabled="!dialog1.form.autoReboot"
              format="HH:mm"
              value-format="HH:mm"
              v-model="dialog1.form.rebootTime"
              placeholder="设备每日重启时间">
            </el-time-picker>
          </el-form-item>

          <el-form-item label="近红外活检阈值" prop="livenessThreshold" v-if="addOption === false">
            <el-input v-model.trim="dialog1.form.livenessThreshold" autocomplete="off"></el-input>
          </el-form-item>


          <el-form-item label="识别阈值" prop="checkThreshold" v-if="addOption === false">
            <el-input v-model.trim="dialog1.form.checkThreshold" autocomplete="off"></el-input>
          </el-form-item>




          <el-form-item label="识别时间窗" prop="timeWindow" v-if="addOption === false">
            <el-input v-model.trim="dialog1.form.timeWindow" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="开锁密码" prop="doorPwd" v-if="addOption === false">
            <el-input v-model.trim="dialog1.form.doorPwd" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="描述" prop="remark">
            <el-input v-model.trim="dialog1.form.remark" autocomplete="off" ></el-input>
          </el-form-item>

        </el-form>
      </div>
    </Dialog>



    <Dialog v-show="dialog2.showDialog" :dialog-option="dialog2.dialogOption" @cancel="dialog2.showDialog = false" @submit="onChangePwdSubmit()" ref="changePwdDialog">
      <div slot="name1">
        <el-form :label-position="dialog2.labelPosition"  ref="dialogForm2" :rules="formRules2" :model="dialog2.form" label-width="100px" size="mini">
          <el-form-item label="账户" prop="newUsername">
            <el-input v-model.trim="dialog2.form.newUsername" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="newPwd">
            <!--type="password"-->
            <el-input v-model.trim="dialog2.form.newPwd" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Dialog>
    <Dialog v-show="dialog4.showDialog" :dialog-option="dialog4.dialogOption" @cancel="dialog4.showDialog = false" @submit="onCallbackUrlSubmit()" ref="changeCallbackDialog">
      <div slot="name1">
        <el-form :label-position="dialog4.labelPosition"  ref="dialogForm4" :model="dialog4.form" label-width="100px" size="mini">
          <el-form-item label="记录上传接口">
            <el-input v-model.trim="dialog4.form.url" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Dialog>

    <Dialog v-show="dialog6.showDialog" :dialog-option="dialog6.dialogOption" @cancel="dialog6.showDialog = false" @submit="onCameraSubmit()" ref="changeCallbackDialog">
      <div slot="name1">
        <el-form :label-position="dialog6.labelPosition"  ref="dialogForm6" :model="dialog6.form" label-width="100px" size="mini">
          <el-form-item label="摄像头每日开关">
            <el-switch v-model="dialog6.form.isResetCamera"></el-switch>
          </el-form-item>

          <el-form-item label="开启时间" prop="rebootTime">
            <el-time-picker
              :disabled="!dialog6.form.isResetCamera"
              format="HH:mm"
              value-format="HH:mm"
              v-model="dialog6.form.openTime"
              placeholder="开启时间">
            </el-time-picker>
          </el-form-item>

          <el-form-item label="关闭时间" prop="rebootTime">
            <el-time-picker
              :disabled="!dialog6.form.isResetCamera"
              format="HH:mm"
              value-format="HH:mm"
              v-model="dialog6.form.closeTime"
              placeholder="关闭时间">
            </el-time-picker>
          </el-form-item>

        </el-form>
      </div>
    </Dialog>
    <Dialog v-show="dialog7.showDialog" :dialog-option="dialog7.dialogOption" @cancel="dialog7.showDialog = false" @submit="onSubmit1()" ref="changeCallbackDialog">
      <div slot="name1">
        <el-form :label-position="dialog7.labelPosition"  ref="dialogForm7" :model="dialog7.form" label-width="100px" size="mini">
          <el-form-item label="是否刷身份证">
            <el-radio-group style="display: flex; flex-direction: column" v-model="dialog7.form.isCart">
              <el-radio class="emergency-radio" :label="0">否</el-radio>
              <el-radio class="emergency-radio" :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </Dialog>
  </div>
</template>

<script>
import {getStatus,getDeviceList,addDevice,updateDevice,deleteDevice,openDoor,updatePwd,callbackURL,setAdv,cleanAdv,emergency,cameraSet,clearData} from '@/api/device'
import {getLocationList} from '@/api/location'
import Dialog from '@/components/dialog/index';
import { Message } from 'element-ui'
import {validateIp} from '@/utils/validate'
import {dateFormat} from '@/utils/DateUtil'
import uploader from './uploader'
import data_sync from './components/device-data-sync-dialog'

export default {
  name: "deviceInfo",
  components: {
    Dialog,
    uploader,
    data_sync
  },
  created(){
    this.onSelect(1);
    this.getLocationList();
  },
  mounted() {
    const timer = setInterval(
      this.getStatus
      ,2000);
    this.$once('hook:beforeDestroy', () => {//销毁清除定时任务
      clearInterval(timer);
    })
  },
  data() {
    return {
      locations:[],
      loading:false,
      updateDialog:0,
      syncDeviceId:'',
      dialogFormVisible:false,
      advSrc:[],
      location:[],
      formLabelWidth:'130px',
      addOption:false,
      form: {
        pageNum: 0,
        pageSize: '10'
      },
      dialog1:{
        showDialog:false,
        dialogOption:{
          title: '添加设备',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        },
        form:{}
      },

      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入设备名称"}],
        deviceSerial: [{required: true, trigger: 'blur', message: "请输入设备名称"}],
        type: [{required: true, trigger: 'blur', message: "请输入设备类型"}],
        locationId: [{required: true, trigger: 'blur', message: "请选择安装位置"}],
        accessType: [{required: true, trigger: 'blur', message: "请选择出入类型"}],
        property: [{required: true, trigger: 'blur', message: "请选设备属性"}],
        ip: [{required: true, trigger: 'blur', message: "请输入IP"},
          { trigger: 'blur',validator: validateIp}],
        port: [{required: true, trigger: 'blur', message: "请输入端口号"}],

        checkType: [{required: true, trigger: 'blur', message: "请选择对比模式"}],
        checkThreshold: [{required: true, trigger: 'blur', message: "请输入人脸识别阈值"}],
        cardCheckThreshold: [{required: true, trigger: 'blur', message: "请输入人证识别阈值"}],
        livenessThreshold: [{required: true, trigger: 'blur', message: "请输入近红外活体检测阈值"}],
        // colorLivenessThreshold: [{required: true, trigger: 'blur', message: "请输入可见光活体检测阈值"}],
        delayClose: [{required: true, trigger: 'blur', message: "请输入关门延迟时间"}],
        username: [{required: true, trigger: 'blur', message: "请输入默认激活账户"}],
        pwd: [{required: true, trigger: 'blur', message: "请输入默认激活密码"}],
        doorPwd:[{required: true, trigger: 'blur', message: "请输入开锁密码"}],
      },


      dialog2:{
        showDialog:false,
        dialogOption:{
          title: '更改密码',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        },

        form:{}
      },

      formRules2: {
        newUsername: [{required: true, trigger: 'blur', message: "请输入新账户"}],
        newPwd:      [{required: true, trigger: 'blur', message: "请输入新密码"}],
      },

      dialog3:{
        showDialog:false,
        dialogOption:{
          title: '广告设置',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        },
        form:{}
      },

      dialog4:{
        showDialog:false,
        dialogOption:{
          title: '回调接口设置',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        },
        form:{}
      },

      dialog5:{
        showDialog:false,
        dialogOption:{
          title: '系统设置',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        },
        form:{}
      },

      dialog6:{
        showDialog:false,
        dialogOption:{
          title: '摄像头设置',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        },
        form:{}
      },
      dialog7:{
        showDialog:false,
        dialogOption:{
          title: '设备配置',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        },
        form:{}
      },

      tableData: [],
      currentPage: 5,
      pageSize: 10,
      totalElements: 0
    }
  },
  methods:{
    getStatus() {
      let param = {
        devices:this.tableData,
      }
      getStatus(param).then(response => {
        this.tableData = response.data.data;
      })
    },
    dateFormat,
    accessHandel(row){
      if (row.accessType === 'ENTRANCE'){
        return '入口';
      }else if (row.accessType === 'EXIT'){
        return '出口';
      }else{
        return "";
      }
    },
    openAddDialog(){
      this.updateDialog = 0;
      this.dialog1.showDialog = true;
      this.dialog1.dialogOption.title = '添加设备';
      this.addOption = true;
      this.dialog1.form = {
        id:'',
        name:'',
        deviceSerial:'',
        property:'',
        locationId:'',
        attendanceLocationId:'',
        accessType:'ENTRANCE',
        ip:'192.168.1.104',
        port:'8809',
        checkType:'0',
        doorPwd:'1394',
        checkThreshold:'0.615',
        cardCheckThreshold:'0.34',
        livenessDetect:true,
        livenessThreshold:'0.5',
        colorLivenessDetect:true,
        colorLivenessThreshold:'0.1',
        autoStart:true,
        daemon:true,
        strangerDetect:false,
        saveStrangerIamge:false,
        strangerTimes:3,
        autoReboot:true,
        type:'门禁',
        rebootTime:'00:00',
        delayClose:'1',
        timeWindow:'0',
        remark:'',
        username:'admin',
        pwd:'000000',
      },
        this.$refs.dialogForm.clearValidate();//清除校验结果
    },
    openUpdateDialog(row){
      this.updateDialog = 1;
      this.dialog1.showDialog = true;
      this.dialog1.dialogOption.title = '修改配置';
      this.addOption = false;

      this.dialog1.form =JSON.parse(JSON.stringify(row)) ;//解除数据绑定
      this.$refs.dialogForm.clearValidate();//清除校验结果
    },

    openUpdateDialog1(row){
      this.dialog7.showDialog = true;
      this.dialog7.dialogOption.title = '修改配置';
      this.dialog7.form =JSON.parse(JSON.stringify(row)) ;//解除数据绑定
      this.$refs.dialogForm.clearValidate();//清除校验结果
    },

    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.onSelect(this.form.pageNum);
    },
    onSelect(start){
      this.form.pageNum = start;
      this.currentPage = start;
      this.loading = true;
      getDeviceList(this.form).then(response => {
        this.loading = false;
        let result = response.data.data;
        this.tableData = result.list;
        this.pageSize = result.pageSize;
        this.totalElements = result.total;
      }).catch(err=>{
        this.loading = false;
      })
    },
    getLocationList(){
      getLocationList().then(response => {
        this.location = response.data.data;
      })
    },

    onDelete (row){
      this.$confirm('即将删除'+row.name+', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.loading = true;
        deleteDevice(row.id).then(response=>{
          this.loading = false;
          if(response.data.errorCode == 200){
            Message.success("操作成功");
            this.onSelect(1);
          }else{
            Message.error(response.data.errorMsg);
          }
        }).catch(err=>{
          this.loading = false;
        });
      });
    },

    onUpdatePwd(row) {
      this.dialog2.showDialog = true;
      this.dialog2.form={
        deviceId:row.id,
        newUsername:'',
        newPwd:'',
      };
      this.$refs.dialogForm2.clearValidate();//清除校验结果
    },

    onCallback(row){
      this.dialog4.showDialog = true;
      this.dialog4.form = {
        deviceId:row.id,
        url:row.callbackUrl,
      };
      this.$refs.dialogForm4.clearValidate();//清除校验结果
    },

    onAdvSetting(row) {
      this.dialog3.showDialog = true;
      if (row.advUrl != null && row.advUrl.length > 0){
        this.advSrc = [];
        for (let i = 0; i < row.advUrl.length;i++){
          this.advSrc.push(this.getImagePath(row.advUrl[i]))
        }

       // this.advSrc = row.advUrl;
      }else{
        this.advSrc = [];
      }

      this.dialog3.form = {
        deviceId:row.id,
        advOpen:row.advOpen,
        rotationTime:row.rotationTime,
        orgAdvOpen:row.advOpen,
      };

      this.$refs.dialogForm3.clearValidate();//清除校验结果
    },
    getImagePath(imagePath) {
      return process.env.BASE_API + imagePath;
    },
    cleanAllAdv(deviceId){
      if (this.advSrc.length == 0) {
        Message.error('暂无广告清空')
        return;
      }

      let title = '确定清除广告?'
      this.$confirm(title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.loading = true;
        cleanAdv(this.dialog3.form).then(response=>{
          this.loading = false;
          if(response.data.errorCode == 200){
            this.dialog3.showDialog  = false;
            this.onSelect(1);
            this.$refs.uploader.cleanFiles();
            this.$message({
              type: 'success',
              message: '操作成功'
            });
          }else{
            Message.error(response.data.errorMsg);
          }
        }).catch(err=>{
          this.loading = false;
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },


    onDataSync(row) {
      this.syncDeviceId = row.id;
      this.dialogFormVisible = true;
      this.$refs.dataSyncDialog.getUnsyncData(this.syncDeviceId);
    },

    dataSyncDialogCancel(){
      this.dialogFormVisible = false;
    },


    // 紧急设置
    onEmergency(row) {
      this.dialog5.showDialog = true;
      this.dialog5.form={
        deviceId:row.id,
        emergencyType:row.emergencyType,
      };
      this.$refs.dialog5.clearValidate();
    },

    onEmergencySubmit() {
      this.loading = true;
      emergency(this.dialog5.form).then(response=>{
        this.loading = false;
        if(response.data.errorCode == 200){
          Message.success("操作成功");
          this.dialog5.showDialog = false;
          this.onSelect(1);
        }else{
          Message.error(response.data.errorMsg);
        }
      }).catch(err=>{
        this.loading = false;
      });
    },


    updateEmergency(deviceId,emergencyType) {
      let param = {
        deviceId:deviceId,
        emergencyType:emergencyType,
      };

      emergency(param).then(response=>{
        if(response.data.errorCode == 200){
          Message.success("操作成功");
          this.dialog5.showDialog = false;
          this.onSelect(1);
        }else{
          Message.error(response.data.errorMsg);
        }
      });
    },



    // 摄像头开关设置
    onCamera(row) {
      this.dialog6.showDialog = true;
      this.dialog6.form={
        deviceId:row.id,
        isResetCamera:row.resetCamera,
        openTime:row.openCameraTime,
        closeTime:row.closeCameraTime,
      };
      this.$refs.dialogForm6.clearValidate();//清除校验结果
    },


    onCameraSubmit() {
      this.loading = true;
      cameraSet(this.dialog6.form).then(response=>{
        this.loading = false;
        if(response.data.errorCode == 200){
          Message.success("操作成功");
          this.dialog6.showDialog = false;
          this.onSelect(1);
        }else{
          Message.error(response.data.errorMsg);
        }
      }).catch(err=>{
        this.loading = false;
      });
    },

    handleCommand(command) {
      if(command.button == "update"){
        this.openUpdateDialog(command.row);
      }
      else if(command.button == "delete"){
        this.onDelete(command.row);
      }
      else if(command.button == "open"){
        openDoor(command.row.id).then(response=>{
          if(response.data.errorCode == 200){
            Message.success("操作成功");
            this.onSelect(1);
          }else{
            Message.error(response.data.errorMsg);
          }
        });
      }
      else if(command.button == "send"){

      }

      else if(command.button == "updatePwd"){
        this.onUpdatePwd(command.row);
      }

      else if(command.button == "advSetting"){
        this.onAdvSetting(command.row);
      }

      else if(command.button == "callback"){
        this.onCallback(command.row);
      }

      else if(command.button == "emergency"){
        this.onEmergency(command.row);
      }

      else if(command.button == "camera"){
        this.onCamera(command.row);
      }

      else if(command.button == "emergency0"){
        this.updateEmergency(command.row.id,0);
      }
      else if(command.button == "emergency1"){
        this.updateEmergency(command.row.id,1);
      }
      else if(command.button == "emergency2"){
        this.updateEmergency(command.row.id,2);
      }else if(command.button == "clearData"){
        this.clearData(command.row);
      }
    },
    composeValue(item, row) {
      return {
        'button': item,
        'row': row
      }
    },
    onSubmit1(){
            this.loading = true;
            updateDevice( this.dialog7.form).then(response=>{
              this.loading = false;
              if(response.data.errorCode == 200){
                Message.success("操作成功");
                this.dialog1.showDialog = false,
                  this.onSelect(1);
              }else{
                Message.error(response.data.errorMsg);
              }
            }).catch(err=>{
              this.loading = false;
            });
    },
    onSubmit(){
      this.$refs.dialogForm.validate(valid => {
        if(valid){
          if (this.dialog1.form.delayClose < 1) {
            Message.error('关门延迟不得小于1s');
            return;
          }

          if (this.dialog1.form.strangerTimes < 1 || this.dialog1.form.strangerTimes > 99) {
            Message.error('陌生人识别次数应在1至99之间');
            return;
          }


          if(this.dialog1.dialogOption.title.indexOf("添加") != -1){//设备
            this.loading = true;
            addDevice(this.dialog1.form).then(response=>{
              this.loading = false;
              if(response.data.errorCode == 200){
                Message.success("操作成功");
                this.dialog1.showDialog  = false,
                  this.onSelect(1);
              }else{
                Message.error(response.data.errorMsg);
              }
            }).catch(err=>{
              this.loading = false;
            })
          }else{//修改机构
            this.loading = true;
            updateDevice( this.dialog1.form).then(response=>{
              this.loading = false;
              if(response.data.errorCode == 200){
                Message.success("操作成功");
                this.dialog1.showDialog = false,
                  this.onSelect(1);
              }else{
                Message.error(response.data.errorMsg);
              }
            }).catch(err=>{
              this.loading = false;
            });
          }
        }
      });
    },

    onChangePwdSubmit(){
      this.loading = true;
      updatePwd(this.dialog2.form).then(response=>{
        this.loading = false;
        if(response.data.errorCode == 200){
          Message.success("操作成功");
          this.dialog2.showDialog  = false;
          this.onSelect(1);
        }else{
          Message.error(response.data.errorMsg);
        }
      }).catch(err=>{
        this.loading = false;
      });
    },


    onAdvsettingSubmit(){
      // if (this.$refs.uploader.files.length == 0 && this.dialog3.form.advOpen == this.dialog3.form.orgAdvOpen) {
      //   Message.error('暂无信息可修改');
      //   return;
      // }

      let formData = new FormData();
      formData.append('deviceId',this.dialog3.form.deviceId);
      formData.append('open',this.dialog3.form.advOpen);
      formData.append('rotationTime',this.dialog3.form.rotationTime);
      if (this.$refs.uploader.files.length > 0) {
        for (var i = 0; i < this.$refs.uploader.files.length; i++) {

          // self.files.push({base64:base64,fileName:file.name});
          var bolb = this.convertBase64UrlToBlob(this.$refs.uploader.files[i].base64);
          formData.append('images',bolb,this.$refs.uploader.files[i].fileName);
        }
      }

      this.loading = true;
      setAdv(formData).then(response=>{
        this.loading = false;
        if(response.data.errorCode == 200){
          Message.success("操作成功");
          this.dialog3.showDialog  = false;
          this.onSelect(1);
          this.$refs.uploader.cleanFiles();
        }else{
          Message.error(response.data.errorMsg);
        }
      }).catch(err=>{
        this.loading = false;
      });
    },

    convertBase64UrlToBlob(urlData){
      var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime,name:'faceFile.jpeg'});
    },

    onCallbackUrlSubmit(){
      this.loading = true;
      callbackURL(this.dialog4.form).then(response=>{
        this.loading = false;
        if(response.data.errorCode == 200){
          Message.success("操作成功");
          this.dialog4.showDialog  = false;
          this.onSelect(1);
        }else{
          Message.error(response.data.errorMsg);
        }
      }).catch(err=>{
        this.loading = false;
      });
    },
    clearData(row){
      this.$confirm('即将清除'+row.name+'数据,不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        clearData(row.id).then(response=>{
          if(response.data.errorCode == 200){
            Message.success("操作成功");
          }else{
            Message.error(response.data.errorMsg);
          }
        });
      });


    }

  }
}
</script>

<style>
.el-pagination{
  float: right;
}

.el-dialog__header {
  background-color: #e5e5e5;
}
/*.el-dialog__body {*/
/*padding: 0 !important;*/
/*}*/

.el-dialog__title {
  font-size: 16px;
  color: #666666;
}

.el-dialog__wrapper {
  align-items: center;
  justify-content: center;
  flex-direction: column;
  display: flex;
}

.emergency-radio {
  margin-left: 30px;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
