<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--      卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>


        </el-col>
      </el-row>

      <!--        表格区域-->
      <el-table :data="cateList" border stripe style="width: 100%" row-key="cat_id"
                :tree-props="{children:'children'}">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="400"></el-table-column>
        <el-table-column label="是否有效">
          <template v-slot="scope">
            <i style="color: green" v-if="scope.row.cat_deleted === false" class="el-icon-success"></i>
            <i style="color: red" v-else class="el-icon-error"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary">编辑</el-button>
            <el-button type="danger">删除</el-button>

          </template>
        </el-table-column>
      </el-table>

      <!--        分页区域-->
      <el-pagination
        style="margin-top: 15px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo. pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--    添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :props="cascaderProps"
            :options="parentCateList"
            @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>
      <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
      <el-button @click="addCateDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getRequest, putRequest, postRequest, deleteRequest} from "../../network/request";

  export default {
    name: "Cate",
    data() {
      return {
        cateList: [],

        //分页查询条件
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        total: 0,

        addCateDialogVisible: false,
        addForm: {
          cat_name: '',
          cat_pid:0,
          cat_level:0


        },
        //选中的父级分类数组
        selectedKeys:[],

        //指定级联选择器的配置对象
        cascaderProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children'

        },
        addFormRules: {
          cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}]

        },
        parentCateList:[]
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      getCateList() {
        getRequest('categories', {params: this.queryInfo})
          .then(res => {
            if (res.data.meta.status !== 200) return this.$message.error('获取商品列表失败')
            this.cateList = res.data.data.result

            //为总数据条数赋值
            this.total = res.data.data.total


          })
          .catch(err => {

          })
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagenum = 1
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      addCate() {
      },
      addDialogClosed() {
      },
      showAddCateDialog() {
        this.getParentCateList()
        this.addCateDialogVisible = true
      },
      //获取父级分类的数据列表
      getParentCateList(){
        getRequest('categories',{params:{type:2}})
        .then(res=>{
          if(res.data.meta.status!==200) return this.$message.error('获取父级分类失败')

          this.parentCateList    = res.data.data

          console.log(this.parentCateList);

        })
        .catch()

      },
      //选择项发生变化触发这个函数
      parentCateChange(){
        console.log(this.selectedKeys);
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
