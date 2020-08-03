<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    搜索添加-->
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

      <!--     用户列表区 table显示数据-->

      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话号码"></el-table-column>
        <el-table-column prop="email" label="电子邮箱"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStatChanged(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!--           修改按钮-->
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <!--            删除按钮-->
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
            <!--            分配角色按钮-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">

              <el-button type="warning" icon="el-icon-setting" circle></el-button>
            </el-tooltip>

          </template>

        </el-table-column>
      </el-table>

      <!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize">
      </el-pagination>


    </el-card>


  </div>
</template>

<script>
  import {getRequest, putRequest} from "../../network/request";

  export default {
    name: "User",
    data() {
      return {
        userList: [],
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 1
        },
        totalSize: 0

      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        await getRequest('/users', {params: this.queryInfo}).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('获取失败')
          this.userList = res.data.data.users
          this.totalSize = res.data.data.total
        }).catch(err => {
        })
      },
      //监听 pagesize 改变事件
      handleSizeChange(newSize) {
        console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.queryInfo.pagenum = 1

        this.getUserList()
      },
      //监听 页码值 改变事件
      handleCurrentChange(mewPage) {
        this.queryInfo.pagenum = mewPage
        this.getUserList()

      },
      //监听 switch 开关状态
      userStatChanged(userinfo) {
        console.log(userinfo);
        putRequest(`users/${userinfo.id}/state/${userinfo.mg_state}`)
          .then(res =>{
            console.log(res.data.meta);
            if(res.data.meta.status !== 200) {
              userinfo.mg_state = !userinfo.mg_state
              return this.$message.error('设置状态失败！')
            }
            this.$message.success('设置状态成功！')
          })
          .catch(err=>{
          })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
