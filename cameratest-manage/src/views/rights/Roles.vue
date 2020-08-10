<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!--          角色列表区域-->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row closable @close="removeRightById(scope.row,item1.id)"
                    :class="['vcenter','bdbottom',i1===0?'bdtop':'']" v-for="(item1,i1) in scope.row.children"
                    :key="item1.id">
              <!--              渲染一级权限-->
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--              渲染二级  三级权限-->
              <el-col :span="19">
                <!--                for循环 嵌套渲染二级权限-->
                <el-row closable @close="removeRightById(scope.row,item2.id)" :class="['vcenter',i2===0 ? '':'bdtop']"
                        v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success ">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable @close="removeRightById(scope.row,item3.id)" type="warning"
                            v-for="(item3,i3) in item2.children" :key="item3.id">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>

            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column type="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加角色-->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%">
      <el-form :model="addForm" ref="addFormRef" :rules="addFormRoles" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--    编辑角色-->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" ref="editFormRef" :rules="editFormRoles">
        <el-form-item disabled label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--    分配权限-->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
      <el-tree :data="rightsList" :props="treeProps" show-checkbox
               node-key="id" default-expand-all
               :default-checked-keys="defaultKeys"
               ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {getRequest, putRequest, postRequest, deleteRequest} from "../../network/request";

  export default {
    name: "Roles",
    data() {
      return {
        roleList: [],
        //所有权限的数据
        rightsList: [],
        //默认选中的权限的id值数组
        defaultKeys: [],
        //当前角色id
        roleId: '',
        //树形控件的属性绑定对象
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        addForm: {
          roleName: '老板',
          roleDesc: '老板描述'
        },
        addDialogVisible: false,
        editDialogVisible: false,
        setRightDialogVisible: false,
        addFormRoles: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
          ],
          roleDesc: [
            {required: false, message: '请输入角色描述', trigger: 'blur'}
          ]

        },
        editFormRoles: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
          ],
          roleDesc: [
            {required: false, message: '请输入角色描述', trigger: 'blur'}
          ]
        },
        editForm: {}
      }
    },
    created() {
      this.getRoleList()
    },
    methods: {
      //获取所有角色列表
      getRoleList() {
        getRequest('roles')
          .then(res => {
            if (res.data.meta.status !== 200) return this.$message.error('获取角色列表失败')
            this.roleList = res.data.data
          })
          .catch(err => {
          })
      },
      async showEditDialog(id) {
        await getRequest('roles/' + id)
          .then(res => {
            if (res.data.meta.status !== 200) return this.$message.error('获取角色信息失败')
            this.editForm = res.data.data
            this.editDialogVisible = true

          })
          .catch(err => {

          })
      },
      editRoleInfo(id) {
        this.$refs.editFormRef.validate(async valid => {
          if (valid) {
            await putRequest('roles/' + this.editForm.roleId, {
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc
            })
              .then(res => {
                console.log(this.editForm);
                console.log(res.data);
                if (res.data.meta.status !== 200) return this.$message.error('修改角色信息失败！！！')
                this.getRoleList()
                this.editDialogVisible = false
                this.$message.success('修改角色信息成功')
              })
              .catch(err => {

              })
          }
        })
      },
      addRoleInfo() {
        this.$refs.addFormRef.validate(async valid => {
          if (valid) {
            await postRequest('roles', this.addForm)
              .then(res => {
                if (res.data.meta.status !== 201) return this.$message.error('创建角色失败')
                this.$message.success('创建角色成功')
                this.getRoleList()
                this.addDialogVisible = false
              })
              .catch()
          }

        })
      },
      //根据id删除对应用户信息
      async removeRoleById(id) {
        //弹框询问
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        console.log(confirmResult);

        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        await deleteRequest('roles/' + id)
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('删除失败！！')
            }
            this.$message.success('删除成功')
            this.getRoleList()
          })
          .catch(err => {

          })
      },
      //根据id删除对应的权限
      async removeRightById(role, rightId) {
        //弹框询问
        const confirmResult = await this.$confirm('此操作将永久删除该用户的权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('取消删除')
        }
        console.log('确认删除');
        deleteRequest(`roles/${role.id}/rights/${rightId}`)
          .then(res => {
            if (res.data.meta.status !== 200) return this.$message.error('删除角色权限失败')
            this.$message.success('删除角色权限成功')
            role.children = res.data.data
          })
          .catch(err => {
          })
      },
      //展示分配权限对话框
      showSetRightDialog(role) {
        this.roleId = role.id
        getRequest('rights/tree')
          .then(res => {
            if (res.data.meta.status !== 200) return this.$message.error('获取权限失败')
            //获取到的权限数据绑定到data中
            this.rightsList = res.data.data
            this.defaultKeys = []
            this.getRights(role)
            console.log(this.defaultKeys);
          })
          .catch()
        this.setRightDialogVisible = true
      },
      //
      getRights(node) {
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            this.getRights(node.children[i])
          }
        } else {
          this.defaultKeys.push(node.id)
        }
        // if(!node.children){
        //   return this.defaultKeys.push(node.id)
        // }
        // node.children.forEach(item=>{
        //   this.getRights(item)
        // })
      },
      //分配权限函数
      allotRights(role) {
        const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
        console.log(keys);
        const idStr = keys.join(',')
        postRequest(`roles/${this.roleId}/rights`, {rids: idStr})
        .then(res=>{
          if(res.data.meta.status!==200) return this.$message.error('分配权限失败')

          this.$message.success('分配权限成功')
          this.getRoleList()
          this.setRightDialogVisible = false
        })
        .catch()
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;

  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
