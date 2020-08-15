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
            <el-button type="primary" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
            <el-button type="danger" @click="deleteCate(scope.row.cat_id)">删除</el-button>

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
      @close="addCateDialofClosed"
      width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            clearable
            change-on-select
            v-model="selectedKeys"
            :props="cascaderProps"
            :options="parentCateList"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
      <el-button @click="addCateDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!--    修改商品分类-->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      @close=""
      width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
      <el-button @click="editCateDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editCate">确 定</el-button>
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
        editCateDialogVisible: false,
        addForm: {
          cat_name: '',
          cat_pid: 0,
          cat_level: 0


        },
        editForm: {},
        //选中的父级分类数组
        selectedKeys: [],

        //指定级联选择器的配置对象
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'

        },
        addFormRules: {
          cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}]

        },
        editFormRules: {
          cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}]

        },
        parentCateList: []
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
            console.log(this.queryInfo);
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
        console.log(this.addForm)
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return
          postRequest('categories', this.addForm)
            .then(res => {
              if (res.data.meta.status !== 201) return this.$message.error('添加商品分类失败!!!')
              this.$message.success('添加商品分类成功')
              this.getCateList()
              this.addCateDialogVisible = false
            })
            .catch(err => {

            })
        })
      },
      showAddCateDialog() {
        this.getParentCateList()
        this.addCateDialogVisible = true
      },
      //获取父级分类的数据列表
      getParentCateList() {
        getRequest('categories', {params: {type: 2}})
          .then(res => {
            if (res.data.meta.status !== 200) return this.$message.error('获取父级分类失败')

            this.parentCateList = res.data.data


          })
          .catch()

      },
      //选择项发生变化触发这个函数
      parentCateChange() {
        console.log(this.selectedKeys);

        if (this.selectedKeys.length > 0) {
          this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          this.addForm.cat_level = this.selectedKeys.length
          return
        } else {
          console.log('--------------');
          this.addForm.cat_pid = 0
          this.addForm.cat_level = 0
        }
      },
      addCateDialofClosed() {
        this.$refs.addFormRef.resetFields()
        this.selectedKeys = []
        this.addForm.cat_level = 0
        this.addForm.cat_pid = 0
      },

      showEditCateDialog(id) {
        getRequest('categories/' + id)
          .then(res => {
            this.editForm = res.data.data
            console.log(this.editForm);
          })
          .catch(err => {

          })
        this.editCateDialogVisible = true

      },
      editCate(){
        this.$refs.editFormRef.validate(valid=>{
          if(!valid) return
          putRequest('categories/' + this.editForm.cat_id,{'cat_name':this.editForm.cat_name})
            .then(res => {
              console.log(res.data);
              console.log(this.editForm.cat_id);
              if(res.data.meta.status!==200) return this.$message.error('修改失败')
              this.$message.success('修改成功')
              this.getCateList()
              this.editCateDialogVisible = false
            })
            .catch(err => {

            })

        })

      },
      async deleteCate(id){
        //弹框询问
        const confirmResult = await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        console.log(confirmResult);

        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        await deleteRequest('categories/' + id)
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('删除失败！！')
            }
            this.$message.success('删除成功')
            console.log(this.total % this.queryInfo.pagesize);
            if(this.total % this.queryInfo.pagesize === 1){
              if(this.queryInfo.pagenum ===(Math.ceil(this.total / this.queryInfo.pagesize))){
                this.queryInfo.pagenum = this.queryInfo.pagenum-1
              }
            }
            this.getCateList()
          })
          .catch(err => {

          })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
