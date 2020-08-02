<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    //搜索框  添加按钮
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>


    //table展示数据
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getRequest} from "../../network/request";

  export default {
    name: "User",
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userlist: [],
        totalsize: 0
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        await getRequest('/users', {
          params: this.queryInfo
        }).then(res => {
            console.log('--------');
            console.log(res.data);
            if (res.data.meta.status !== 200) {
              return this.$message.error('获取用户列表失败!')
            }
            this.userlist = res.data.data.users
            this.totalsize = res.data.data.users.length
          }
        ).catch(err => {
          return this.$message.error('发起请求失败')


        })
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
