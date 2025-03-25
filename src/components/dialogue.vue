<template id="aaa">
  <div class="aaa" v-if="showDialog">
    <div class="dialog_mask"></div>
    <div class="dialog_container">
      <div class="dialog_content">
        <div class="dialog_content_top" v-text="msg">提示内容</div>
        <div class="dialog_btn">
          <el-button type="primary" @click="onOk">确认修改</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {

  props: {
    msg: String,
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hidden () { /* 关闭对话框 */
      this.showDialog = false
    },
    onOk () { /* 点击确认 */
      this.$emit('onOk');
      this.hidden()
    }
  }
}
</script>
<style>
/*对话框style*/
.aaa{
  z-index: 3000;
}
.dialog_mask{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
}
.dialog_container{
  background: #fff;
  width: 500px;
  /*height: 400px;*/
  position: relative;
  border-radius: 10px;
  margin: 0 auto;
}
.dialog_content{
  text-align: center;
  padding-top: 30px;
}
.dialog_btn{
  margin-top: 20px;
}
.dialog_btn a{
  background: yellow;
  padding: 2px 30px;
  border-radius: 5px;
  color: #fff;
  text-decoration: none;
  width: 50px;
  display: inline-block;
}
.dialog_btn a:nth-child(2){
  margin-left: 20px;
}


</style>

