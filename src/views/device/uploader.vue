<template>
  <div class="vue-uploader">
    <div class="file-list">
      <section v-for="(file, index) of imgSrc" class="file-item draggable-item">
        <img :src="file">
      </section>
      <section v-if="imgSrc.length <9" class="file-item">
        <div @click="add" class="add">
          <span>+</span>
        </div>
      </section>
    </div>

    <input type="file" accept="image/*" @change="fileChanged" ref="file" multiple="multiple">
  </div>
</template>

<script>
  import EXIF from 'exif-js'
    export default {
        props: {
          imgSrc: {
            type: Array,
            required: false,
            default:[]
          },
        },
        data() {
            return {
                status: 'ready',
                files: [],
                point: {},
                uploading: false,
                percent: 0,
                imagePath:[],
            }
        },
        methods: {
            add() {
                this.$refs.file.click()
            },

            finished() {
                this.files = []
                this.status = 'ready'
            },
            remove(index) {
                this.imagePath = []
                this.files.splice(index, 1)
            },
            cleanFiles(){
              this.files = [];
              this.imgSrc = [];
            },
            fileChanged() {
              let that = this;
              let inputDOM = this.$refs.file;
              // 通过DOM取文件数据
              for(let i in inputDOM.files){
                var file = inputDOM.files[i];

                this.imgPreview(file);
                EXIF.getData(file, function() {
                  that.Orientation = EXIF.getTag(this, 'Orientation');
                });
              }

              this.$refs.file.value = null;
            },


          imgPreview (file) {   //base64 格式
            this.imgType=1;
            this.img_loading=true;
            let self = this;
            let imgContent={};
            imgContent.name=file.name;
            // 看支持不支持FileReader
            if (!file || !window.FileReader) return;

            if (/^image/.test(file.type)) {
              // 创建一个reader
              var reader = new FileReader();
              // 将图片将转成 base64 格式
              reader.readAsDataURL(file);
              // 读取成功后的回调
              reader.onloadend = function () {
                let IMG = new Image();
                IMG.src = this.result;
                IMG.onload = function(){
                  let w = this.naturalWidth,
                    h = this.naturalHeight,
                    resizeW = 0,
                    resizeH = 0;
                  //压缩设置
                  let maxSize = {
                    width:1280,      //图片最大宽度
                    height:1280,     //图片最大高度
                    level:0.6       //图片保存质量
                  };
                  //计算缩放比例
                  if(w > maxSize.width || h > maxSize.height){
                    let multiple = Math.max(w / maxSize.width , h / maxSize.height);
                    resizeW = w / multiple;
                    resizeH = h / multiple;
                  }else{
                    resizeW = w;
                    resizeH = h;
                  }
                  let canvas = document.createElement("canvas"),
                    cxt = canvas.getContext('2d');
                  //根据拍摄的角度进行图片旋转调整
                  if (self.Orientation == 3) {
                    canvas.width = resizeW;
                    canvas.height = resizeH;
                    cxt.rotate(Math.PI);
                    cxt.drawImage(IMG, 0, 0, -resizeW, -resizeH)
                  } else if (self.Orientation == 8) {
                    canvas.width = resizeH;
                    canvas.height = resizeW;
                    cxt.rotate(Math.PI * 3 / 2);
                    cxt.drawImage(IMG, 0, 0, -resizeW, resizeH)
                  } else if (self.Orientation == 6) {
                    canvas.width = resizeH;
                    canvas.height = resizeW;
                    cxt.rotate(Math.PI / 2);
                    cxt.drawImage(IMG, 0, 0, resizeW, -resizeH)
                  } else {
                    canvas.width = resizeW;
                    canvas.height = resizeH;
                    cxt.drawImage(IMG, 0, 0, resizeW, resizeH)
                  }
                  //base64,最终输出的压缩文件
                  var base64 = canvas.toDataURL('image/jpeg',maxSize.level);
                  self.num+=1;
                  self.imgType=0;
                  self.img_loading=false;
                  self.imgSrc.push(base64);
                  self.files.push({base64:base64,fileName:file.name});
                }
              };
            }
          },
        },
    }
</script>
<style>
  .vue-uploader {
    border: 1px solid #e5e5e5;
  }
  .vue-uploader .file-list {
    padding: 10px 0px;
  }
  .vue-uploader .file-list:after {
    content: '';
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
    font-size: 0;
  }
  .vue-uploader .file-list .file-item {
    float: left;
    position: relative;
    width: 200px;
    text-align: center;
  }
  .vue-uploader .file-list .file-item img{
    width: 180px;
    height: 180px;
    border: 1px solid #ececec;
  }
  /*.vue-uploader .file-list .file-item .file-remove {*/
    /*position: absolute;*/
    /*right: 12px;*/
    /*display: none;*/
    /*top: 4px;*/
    /*width: 14px;*/
    /*height: 14px;*/
    /*color: white;*/
    /*cursor: pointer;*/
    /*line-height: 12px;*/
    /*border-radius: 100%;*/
    /*transform: rotate(45deg);*/
    /*background: rgba(0, 0, 0, 0.5);*/
  /*}*/
  /*.vue-uploader .file-list .file-item:hover .file-remove {*/
    /*display: inline;*/
  /*}*/
  /*.vue-uploader .file-list .file-item .file-name {*/
    /*margin: 0;*/
    /*height: 40px;*/
    /*word-break: break-all;*/
    /*font-size: 14px;*/
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    /*display: -webkit-box;*/
    /*-webkit-line-clamp: 2;*/
    /*-webkit-box-orient: vertical;*/
  /*}*/
  .vue-uploader .add {
    width: 180px;
    height: 180px;
    margin-left: 10px;
    float: left;
    text-align: center;
    line-height: 180px;
    border: 1px dashed #ececec;
    font-size: 30px;
    cursor: pointer;
  }
  /*.vue-uploader .upload-func {*/
    /*display: flex;*/
    /*padding: 10px;*/
    /*margin: 0px;*/
    /*background: #f8f8f8;*/
    /*border-top: 1px solid #ececec;*/
  /*}*/
  /*.vue-uploader .upload-func .progress-bar {*/
    /*flex-grow: 1;*/
  /*}*/
  /*.vue-uploader .upload-func .progress-bar section {*/
    /*margin-top: 5px;*/
    /*background: #00b4aa;*/
    /*border-radius: 3px;*/
    /*text-align: center;*/
    /*color: #fff;*/
    /*font-size: 12px;*/
    /*transition: all .5s ease;*/
  /*}*/
  /*.vue-uploader .upload-func .operation-box {*/
    /*flex-grow: 0;*/
    /*padding-left: 10px;*/
  /*}*/
  /*.vue-uploader .upload-func .operation-box button {*/
    /*padding: 4px 12px;*/
    /*color: #fff;*/
    /*background: #007ACC;*/
    /*border: none;*/
    /*border-radius: 2px;*/
    /*cursor: pointer;*/
  /*}*/
  .vue-uploader > input[type="file"] {
    display: none;
  }
</style>
