<template>
  <div class="login-background" style="height: 100%">
    <div class="login-box">
      <!-- 头像     -->
      <div class="avatar_box">
        <img src="../../assets/images.jpg" alt="">
      </div>
      <!--      表单区-->
      <el-form :model="form" status-icon :rules="rules" ref="formRef" label-width="100px" class="login-container">

        <h3 class="login_title">大米NT系统登录</h3>
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input prefix-icon="el-icon-user" type="input" v-model="form.username" autocomplete="off"
                    placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px" prop="password">
          <el-input prefix-icon="el-icon-lock" type="password" show-password v-model="form.password" autocomplete="off"
                    placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="longin_submit">
          <el-button type="primary" @click="login" class="longin_submit">登陆</el-button>
          <el-button type="info" @click="resetLoginForm" class="longin_submit">重置</el-button>

        </el-form-item>
      </el-form>
    </div>

  </div>

</template>

<script>
  import {postRequest} from "../../network/request";

  export default {
    name: "Login",
    data() {
      return {
        //登录表单数据
        form: {
          username: 'admin',
          password: '123456'
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {
              min: 3,
              max: 10,
              message: '用户名长度不能小于3位',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true, message: '请输入密码', trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      login() {
        this.$refs.formRef.validate(async valid => {
          if (!valid) {
            return
          }
          await postRequest('login', this.form).then(res => {
            console.log(res.data.data.token)
            if (res.data.meta.status !== 200) return this.$message.error('登陆失败')
            this.$message.success('登陆成功')
            this.$store.commit('setToken',res.data.data.token)
            this.$router.push({name: 'main'})
            this.$store.commit('setToken', 'admin')
          }).catch()

        })
      },
      //重置
      resetLoginForm() {
        console.log(this)
        this.$refs.formRef.resetFields()
      }
    }
  }
</script>

<style lang="less" scoped>
  .login-container {
    border-radius: 15px; /*圆角*/
    background-clip: padding-box; /*背景被裁剪到内边距框*/
    /*margin: 180px auto; !*边界 距上180px 左右居中*!*/
    margin: 25px auto;
    width: 400px;
    padding: 35px 35px 15px 35px; /*填充*/
    background: #fff;
    border: 1px solid #eaeaea; /*边框*/
    box-shadow: 0 0 25px #cac6c6; /*隐形*/
  }

  .login_title {
    margin: 0px auto 40px auto; /*上边界0 下边边界40 左右居中*/
    text-align: center; /*上面仅是标签居中 这里是文字居中*/
    color: #505458;
  }

  .longin_submit {
    margin: 10px auto 10px auto; /*上边界10 下边边界40 左右居中*/

  }

  .login-background {
    background-color: #2b4b6b;
  }

  .login-box {
    height: 350px;
    width: 450px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

  }

  .avatar_box {
    border: 1px solid #eee;
    border-radius: 50%;
    height: 100px;
    width: 100px;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    background-color: #fff;
    transform: translate(-50%, -50%);

    img {
      border-radius: 50%;
      background-color: #999999;
      width: 100%;
      height: 100%;
    }
  }
</style>
