<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-alert
      title="注意：只允许为第三季分类设置相关的参数"
      show-icon
      type="warning">
    </el-alert>

    <el-row class="cat_opt">
      <el-col>
        <span>选择商品分类：</span>
        <el-cascader
          expand-trigger="hover" :options="cateList" :props="cateProps" v-model="selectedCateKeys"
          @change="handleChange"
        >
        </el-cascader>
      </el-col>

    </el-row>

    <!--    tab 页签区-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
        <!--        添加参数按钮-->
        <el-button type="primary" :disabled="isBtnDisable" @click="addDialogVisible=true">添加参数</el-button>
        <el-table :data="manyTableData" border stripe>
          <el-table-column type="expand">
            <template v-slot="scope">
              <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
              <el-input
                class=".input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">
                编辑
              </el-button>
              <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">
                删除
              </el-button>
            </template>

          </el-table-column>

        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <!--        添加参数按钮-->
        <el-button type="primary" :disabled="isBtnDisable" @click="addDialogVisible=true">添加属性</el-button>
        <el-table :data="onlyTableData" border stripe>
          <el-table-column type="expand"></el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">
                编辑
              </el-button>
              <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">
                删除
              </el-button>
            </template>

          </el-table-column>

        </el-table>

      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      @close="addDialogClosed"
      width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
      width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {getRequest, putRequest, postRequest, deleteRequest} from "../../network/request";

  export default {
    name: "Params",
    data() {
      return {
        //
        cateList: [],
        cateProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'

        },
        //级联选择框双向绑定到的数组
        selectedCateKeys: [],
        //被激活的页签的名称
        activeName: 'many',

        //动态属性的数据
        manyTableData: [],
        //静态属性的数据
        onlyTableData: [],
        //控制添加对话框的显示隐藏
        addDialogVisible: false,

        //控制修改对话框的显示隐藏
        editDialogVisible: false,

        addForm: {
          attr_name: ''
        },
        addFormRules: {
          attr_name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ]
        },
        editForm: {},
        editFormRules: {
          attr_name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ]
        }
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      getCateList() {
        getRequest('categories')
          .then(res => {

            if (res.data.meta.status !== 200) {
              return this.$message.error('获取商品分类失败')
            }
            this.cateList = res.data.data
          })
          .catch(err => {

          })
      }
      , //级联选择框选中项变化会触发该函数
      handleChange() {
        this.getParamsData()
      },
      handleClick() {
        this.getParamsData()
      },
      getParamsData() {
        //选中的不是三级分类
        if (this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = []
          return
        }
        //选中的是三级分类

        //根据所选分类的id，和当前所处的面板，获取对应的参数
        getRequest(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}})
          .then(res => {
            if (res.data.meta.status !== 200) return this.$message.error('获取属性参数失败！！！！')
            console.log(res.data);
            res.data.data.forEach(item => {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
              item.inputVisible = false
              item.inputValue = ''
            })
            if (this.activeName === 'many') {
              this.manyTableData = res.data.data
            } else {
              this.onlyTableData = res.data.data
            }
          })
          .catch()
      },
      //监听对话框的重置
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //点击按钮添加验证
      addParams() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return
          postRequest(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }).then(res => {
            if (res.data.meta.status !== 201) return this.$message.error('添加失败')

            this.$message.success('添加成功')
            this.addDialogVisible = false
            this.getParamsData()
          })
            .catch()
        })
      },
      showEditDialog(attr_id) {
        this.editDialogVisible = true
        getRequest(`categories/${this.cateId}/attributes/${attr_id}`, {
          params: {
            attr_sel: this.activeName
          }
        })
          .then(res => {
            if (res.data.meta.status !== 200) return this.$message.error('获取数据失败')
            this.editForm = res.data.data

          })
          .catch()
      },
      //重置
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      editParams() {
        this.$refs.editFormRef.validate(valid => {
          if (!valid) return
          putRequest(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }).then(res => {
            if (res.data.meta.status !== 200) this.$message.error('修改参数失败')
            this.$message.success('修改数据成功')
            this.editDialogVisible = false
            this.getParamsData()
          })
            .catch()

        })
      },
      async removeParams(attr_id) {
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        console.log(confirmResult);

        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        await deleteRequest(`categories/${this.cateId}/attributes/${attr_id}`)
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('删除失败！！')
            }
            this.$message.success('删除成功')
            this.getParamsData()
          })
          .catch(err => {

          })
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      showInput(item) {
        item.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      //添加动态属性下的tag标签
      handleInputConfirm(item) {
        let inputValue = item.inputValue
        if (item.inputValue.trim().length === 0) {
          item.inputVisible = false
          item.inputValue = ''
          return
        }
        item.attr_vals.push(inputValue.trim())
        console.log(item.attr_vals);
        item.inputVisible = false
        item.inputValue = ''
        putRequest()

      }
    }, computed: {
      isBtnDisable() {
        return this.selectedCateKeys.length !== 3
      },
      cateId() {
        if (this.selectedCateKeys.length === 3) {

          return this.selectedCateKeys[2]
        }
        return null
      },
      titleText() {
        if (this.activeName === 'many') {
          return '动态参数'
        }

        return '静态属性'
      }
    }

  }
</script>

<style lang="less" scoped>

  .cat_opt {
    margin: 15px 0px;
  }

  .el-tag {
    margin: 8px;
  }

  .input-new-tag {
    width: 120px;
  }
</style>
