<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片视图区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getGoodsList" clearable
                    class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="handleCurrentChange(1)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!--      table显示区域-->
      <el-table
        :data="goodsList"
        border
        stripe
        style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="90px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
        <el-table-column label="创建时间" width="130px">
          <template v-slot="scope">
            {{scope.row.add_time|dateFormat}}
          </template>

        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editById(scope.row.goods_id)">编辑</el-button>
            <el-button type="warning" icon="el-icon-delete" @click="removeById(scope.row.goods_id)">删除</el-button>

          </template>
        </el-table-column>

      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import {getRequest, putRequest, postRequest, deleteRequest} from "../../network/request";

  export default {

    name: "List",
    data() {
      return {
        queryInfo: {
          query: '',
          pagesize: 10,
          pagenum: 1
        },
        goodsList: [],
        totalSize: 0

      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      //根据分页获取对应得商品列表
      getGoodsList() {
        // if(this.queryInfo.query){
        //   this.queryInfo.pagenum =1
        // }
        getRequest('goods', {
          params:
          this.queryInfo
        }).then(res => {
          console.log(res.data);
          if (res.data.meta.status !== 200) return this.$message.error('获取商品列表失败')
          this.$message.success('获取商品列表成功')
          this.goodsList = res.data.data.goods
          this.totalSize = res.data.data.total
        })
          .catch()
      },
      handleSizeChange(pagesize) {
        this.queryInfo.pagenum = 1
        this.queryInfo.pagesize = pagesize
        console.log(this.queryInfo);
        this.getGoodsList()
      },
      handleCurrentChange(pagenum) {
        this.queryInfo.pagenum = pagenum
        console.log(this.queryInfo);
        this.getGoodsList()

      },

      //根据id删除
      async removeById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        console.log(confirmResult);

        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        await deleteRequest('goods/' + id)
          .then(res => {
            console.log(res.data);
            if (res.data.meta.status !== 200) {
              return this.$message.error('删除失败！！')
            }
            this.$message.success('删除成功')
            this.getGoodsList()
          })
          .catch(err => {

          })
      },
      goAddpage(){
        this.$router.push('/goods/add')
      }
    },
    computed: {}
  }
</script>

<style scoped>

</style>
