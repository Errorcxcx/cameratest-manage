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
          <el-input clearable placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query"
                    @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
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
              @change="userStateChanged(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!--           修改按钮-->
            <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row.id)"></el-button>
            <!--            删除按钮-->
            <el-button type="danger" icon="el-icon-delete" circle @click="removeUserById(scope.row.id)"></el-button>
            <!--            分配角色按钮-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle @click="setRole(scope.row)"></el-button>
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

    <!--    添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%">
      <!--      内容主体区-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">

        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
      <el-button type="danger" @click="addDialogClosed">重置</el-button>

      </span>
    </el-dialog>

    <!--    修改用户的对话框-->
    <el-dialog
      width="50%"
      title="修改用户信息"
      :visible.sync="editDialogVisible">
      <el-form :rules="editFormRules" ref="editFormRef" :model="editForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
      <div>
        <p>当前用户:{{userInfo.username}}</p>
        <p>当前用户:{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getRequest, putRequest, postRequest, deleteRequest} from "../../network/request";

  export default {
    name: "User",
    data() {
      //邮箱验证规则
      var checkEmail = (rule, value, cb) => {
        const regMail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (regMail.test(value)) {
          //
          return cb()

        }
        cb(new Error('请输入合法邮箱'))
      }
      //验证手机号规则
      var checkMobile = (rule, value, cb) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
        if (regMobile.test(value)) {
          return cb()

        }
        return cb(new Error('请输入合法手机号码'))
      }
      return {
        userList: [],
        //所有角色的数据列表
        rolesList:[],
        //已选中的角色id
        selectedRoleId:'',
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 1
        },
        userInfo: '',
        totalSize: 0,
        addDialogVisible: false,
        editDialogVisible: false,
        setRoleDialogVisible: false,
        addForm: {

          username: '吴彦祖',
          password: '123456',
          email: '1661217770@qq.com',
          mobile: '18843109256'

        },
        editForm: {},
        editFormRules: {
          email: [
            {required: true, message: '请输入用户邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}],
          mobile: [
            {required: true, message: '请输入电话号码', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ]

        },
        addFormRules: {
          username: [
            {required: true, message: '请输入用户姓名', trigger: 'blur'},
            {min: 3, max: 10, message: '用户名在3~10个字符之间', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入用户密码', trigger: 'blur'},
            {min: 3, max: 10, message: '用户密码在3~10个字符之间', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入用户邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入电话号码', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        await getRequest('/users', {params: this.queryInfo}).then(res => {
          console.log(res.data.data);
          console.log(res.data.data.total);
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
      userStateChanged(userinfo) {
        console.log(userinfo);
        putRequest(`users/${userinfo.id}/state/${userinfo.mg_state}`)
          .then(res => {
            console.log(res.data.meta);
            if (res.data.meta.status !== 200) {
              userinfo.mg_state = !userinfo.mg_state
              return this.$message.error('设置状态失败！')
            }
            this.$message.success('设置状态成功！')
          })
          .catch(err => {
          })
      },
      //监听添加用户对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
        this.addDialogVisible = false
      },
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          console.log('-----' + valid);
          if (valid) {
            //发起添加用户的网络请求
            await postRequest('users', this.addForm).then(res => {
              console.log(res.data);
              if (res.data.meta.status !== 201) {
                return this.$message.error('添加用户失败')
              }
              this.$message.success('添加用户成功')

              //隐藏添加用户对话框
              this.addDialogVisible = false

              //重新获取用户列表
              this.getUserList()
            }).catch(err => {

            })

          }

        })
      },
      //展示编辑用户对话框
      async showEditDialog(id) {
        console.log('-------' + id);
        await getRequest('users/' + id).then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('查询用户信息失败！！！')
          }
          this.editForm = res.data.data
          this.editDialogVisible = true
        }).catch(err => {

        })

      },
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (valid) {
            //发送网络请求修改用户
            await putRequest('users/' + this.editForm.id, {email: this.editForm.email, mobile: this.editForm.mobile})
              .then(res => {
                if (res.data.meta.status !== 200) return this.$message.error('修改用户信息失败')
                //关闭修改对话框
                this.editDialogVisible = false
                //刷新数据
                this.getUserList()
                //提示修改成功
                this.$message.success('修改用户信息成功')

              })
              .catch(err => {

              })

          }
        })
      },
      //根据id删除对应用户信息
      async removeUserById(id) {
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
        await deleteRequest('users/' + id)
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('删除失败！！')
            }
            this.$message.success('删除成功')
            console.log(this.queryInfo.pagesize+'********'+this.totalSize+'-----'+this.queryInfo.pagesize);

            if(this.totalSize % this.queryInfo.pagesize === 1 || this.queryInfo.pagesize === 1){
              if(this.queryInfo.pagenum ===(Math.ceil(this.totalSize / this.queryInfo.pagesize))){
                this.queryInfo.pagenum = this.queryInfo.pagenum-1
                }
            }
            console.log(this.queryInfo);
            this.getUserList()
          })
          .catch(err => {

          })
      },
      setRole(userInfo) {

        this.setRoleDialogVisible = true
        this.userInfo = userInfo
        getRequest('roles')
        .then(res=>{
          if(res.data.meta.status!==200) return this.$message.error('获取角色列表失败')
          this.rolesList = res.data.data
          this.selectedRoleId = ''
        })
        .catch(err=>{

        })

      },
      //点击按钮，分配角色
      saveRoleInfo(){

        if(!this.selectedRoleId){
          return this.$message.error('请选择要分配的角色')
        }
        putRequest(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
        .then(res=>{
          if(res.data.meta.status!==200) return this.$message.error('更新用户角色失败')

          this.$message.success('更新用户角色成功')
          this.getUserList()
          this.setRoleDialogVisible = false
        })
        .catch()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
