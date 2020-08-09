<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level == '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {getRequest, putRequest, postRequest, deleteRequest} from "../../network/request";

  export default {
    name: "Rights",
    data() {
      return {
        rightsList: []
      }
    },
    created() {
      this.getRightsList()
    },
    methods: {
      getRightsList() {
        getRequest('rights/list')
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('获取权限列表失败')
            }
            console.log(res.data.data);
            this.rightsList = res.data.data
            this.$message.success('获取权限列表成功')
          })
          .catch(err => {

          })
      }
    }
  }
</script>

<style scoped>

</style>
