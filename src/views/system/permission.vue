<template>
  <div class="content_container">
    <div>
      <el-form :label-position="labelPosition" :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model="param.keyword" placeholder="请输入关键字" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                     @click="handleMethod(item.methodd)">{{ item.name }}
          </el-button>
        </el-form-item>
      </el-form>

    </div>
    <div>
      <tree-table :data="data" :columns="columns" :options="tableOption" border/>
    </div>
    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center>
      <el-form :model="form" ref="dialogForm" :rules="formRules" :label-position="labelPosition" label-width="100px"
               size="mini">
        <el-form-item label="菜单类型" prop="type">
          <el-select v-model="form.type" @change="selectChanged">
            <el-option v-for="item in dicts" :label="item.name" :key="item.id" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="路径" prop="path" v-show="!isButton">-->
        <el-form-item label="路径" prop="path">
          <el-input v-model="form.path" placeholder="路径" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="顺序" prop="sortOrder">
          <el-input type="number" min="1" v-model="form.sortOrder" placeholder="顺序" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="控件" prop="component" v-show="!isButton">
          <el-input v-model="form.component" placeholder="控件" style="width: auto"></el-input>
        </el-form-item>
<!--        <el-form-item label="名称" prop="name" v-show="!isButton">-->
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="名称" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="标题" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="事件"  v-show="isButton">
          <el-input v-model="form.method" placeholder="事件" style="width: auto"></el-input>
           填入: add / delete / search , 分别表示"新增", "删除", "查找"
        </el-form-item>
        <el-form-item label="图标" >
          <el-input v-model="form.icon" placeholder="图标" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="重定向"  v-show="!isButton">
          <el-input v-model="form.redirect" placeholder="重定向路径" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="父节点" v-show="isParentShow">
          <selectTree
            style="width: 79%"
            placeholder="请选择"
            ref="selectTree"
            :options="data"
            v-model="form.parent"
            clearable
            accordion="true"
            :normalizer="normalizer"
          />
        </el-form-item>
        <el-form-item label="是否在菜单隐藏" v-show="!isButton">
          <el-radio-group v-model="form.hidden">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import dictType from '@/components/type'
import {getList, add,updateById,deleteById} from '@/api/permission'
import {getUser} from '@/utils/auth'
import {getRolePermissionList, add as addRolePermission, deleteById as deleteRolePermissionById} from '@/api/rolePermission'
import {selectByParentCode} from '@/api/dict'
import {listToTree, copyProperties} from '@/utils'
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: "permission",
  components: {
    treeTable,
    selectTree
  },
  data() {
    let updateOpen = (row) => {
      //this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.form = copyProperties(row,this.form);
      this.form.parent = null;
      this.form.id = row.id;
      this.form.hidden = row.hidden == true ? 1 : 0;
      this.isParentShow = false;
      this.dialogName = "修改";
      if (row.type == 'button'){
        this.isButton = true;
      }
      this.dialogFormVisible = true;
      this.$refs.dialogForm.clearValidate();//清除校验结果
    }
    let deleteOption = (row) => {
      this.deleteById(row);
    }
    let isUpdateShow = (row) => {
      return true;
    }
    let isDeleteShow = (row) => {
      return !row.children || row.children.length == 0;
    }
    return {
      bttns: [],
      dicts: [],
      data: [],
      // 当前登录用户的角色id
      currentRoleId: null,
      isButton: false,
      isParentShow: true,
      dialogName: '新增',
      labelPosition: 'left',
      dialogFormVisible: false,
      param: {
        keyword: ''
      },
      form: {
        id:null,
        type: '',
        parent: null,
        path: '/',
        sortOrder: 1,
        component: 'Layout',// layout is 主菜单，system/xxx is 页面, '' is button
        redirect: '',
        name: '',
        title: '',
        method: '',
        icon: '',
        hidden: 0,
      },
      formRules: {
        // parent: [{required: true, trigger: 'blur', message: "请选择父节点"}],
        // name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        // type: [{required: true, trigger: 'blur', message: "请选择菜单类型"}],
        // sortOrder: [{required: true, trigger: 'blur', message: "请输入顺序"}],
        // component: [{required: true, trigger: 'blur', message: "请输入控件路径或者名称"}],
        // title: [{required: true, trigger: 'blur', message: "请输入标题"}],
        // method: [{required: true, trigger: 'blur', message: "请输入绑定事件"}],
        // path: [{required: true, trigger: 'blur', message: "请输入调用路径"}],
      },

      columns: [
        {
          text: '路径',
          value: 'path',
        },
        {
          text: '类型',
          value: 'type'
        },
        {
          text: '顺序',
          value: 'sortOrder'
        },
        {
          text: '页面路径',
          value: 'component'
        },
        {
          text: '重定向',
          value: 'redirect'
        },
        {
          text: '是否隐藏',
          value: 'hidden'
        },
        {
          text: '显示父节点',
          value: 'alwaysshow'
        },
        {
          text: '可点击',
          value: 'clickable'
        },
        {
          text: '名称',
          value: 'name'
        },
        {
          text: '标题',
          value: 'title'
        },
        {
          text: '是否缓存',
          value: 'nocache'
        },
        {
          text: '图标',
          value: 'icon'
        }, {
          text: '绑定事件',
          value: 'method'
        },

      ],
      tableOption: [
        {
          text: '修改',
          onclick: updateOpen,
          isShow: isUpdateShow,
        },
        {
          text: '删除',
          onclick: deleteOption,
          isShow: isDeleteShow,
        }
      ],
    }
  },
  methods: {
    // 后台返回的数据和VueTreeselect要求的数据结构不同，需要进行转换
    normalizer(node) {
      //去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children
      }
    },
    selectChanged(value) {
      this.form = {
        id:null,
        type: value,
        path: '/',
        sortOrder: 1,
        component: 'Layout',
        redirect: '',
        name: '',
        title: '',
        method: '',
        icon: '',
        hidden: 0,
      };

      if (value == dictType.button) {
        this.isButton = true;
        this.formRules.component = false;
        this.form.component = '';
        // this.form.path = '/' + '在此处填入父节点对应路径' + '/add';
      } else if (value == dictType.page) {
        this.isButton = false;

      } else if (value == dictType.menu) {
        this.isButton = false;
      } else {
        this.isButton = false;
      }

    },
    handleMethod(ms) {
      this[ms]();
    },
    search() {
      this.getDictList();
    },
    add() {
      this.form = {
        // roleId: this.currentRoleId, // 创建者ID
        type: this.dicts[0].code,
        path: '/',
        sortOrder: 1,
        component: 'Layout',
        redirect: '',
        name: '',
        title: '',
        method: '',
        icon: '',
        hidden: 0,
      };
      this.isParentShow = true;
      this.isButton = false;
      this.dialogName = "新增";
      this.dialogFormVisible = true;
      this.$refs.dialogForm.clearValidate();//清除校验结果
    },
    getList() {
      getList(this.param).then(res => {
        if (res.data.errorCode == 200) {
          let a = res.data.data;
          this.data = listToTree(a);
          //this.options = re.data.data;
        }
      })
    },
    selectByParentCode(code) {
      selectByParentCode(code).then(res => {
        if (res.data.errorCode == 200) {
          this.dicts = res.data.data;
          this.form.type = this.dicts[0].code;
        }
      })
    },
    submitForm() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.form.hidden = this.form.hidden == 1 ? true : false;
        if (this.dialogName.indexOf("新增") != -1) {//添加操作
          add(this.form).then(res => {
            if (res.data.errorCode == 200){
              this.getList();
              this.dialogFormVisible = false;
              this.$message.success(res.data.errorMsg)
            }else{
              this.$message.error(res.data.errorMsg);
            }
          })
          // 为创建者赋予被创建对象的权限
          // 考虑与上述add()合并为原子操作
          // addRolePermission(
          //   {roleId:this.currentRoleId, permissionId: }
          // )

        }else{
          updateById(this.form).then(res=>{
            if (res.data.errorCode == 200){
              this.getList();
              this.dialogFormVisible = false;
              this.$message.success(res.data.errorMsg)
            }else{
              this.$message.error(res.data.errorMsg);
            }
          })
        }
      })
    },
    deleteById(row){
      deleteById(row.id).then(res=>{
        if (res.data.errorCode == 200){
          this.getList();
          this.$message.success(res.data.errorMsg)
        }else{
          this.$message.error(res.data.errorMsg);
        }
      })
    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.selectByParentCode(dictType.menuType);
    this.getList();
    this.currentRoleId = JSON.parse(getUser()).roleId;
  },
  watch: {

  }
}
</script>

<style scoped>

</style>
