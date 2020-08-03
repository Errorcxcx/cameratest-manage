<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>

          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>

      </el-row>
    </el-card>



  </div>
</template>

<script>
  import {getRequest} from "../../network/request";
  export default {
    name: "User",
    data(){
      return{
        userList:[],
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:20
        },
        totalSize:0

      }
    },
    created() {
      this.getUserList()
    },
    methods:{
      async getUserList(){
          await getRequest('/users',{params:this.queryInfo}).then(res=>{
            console.log('-------');
            console.log(res.data.data.users);
            if(res.data.meta.status !== 200) return this.$message.error('获取失败')
            this.userList = res.data.data.users
            this.totalSize = res.data.data.users.length
          }).catch(err=>{

          })

      }
    }
  }
</script>

<style lang="less" scoped>

</style>
