<template>
  <div class="l-content">
    <div class="b-content">
      <img src="../assets/ke6.png" alt="">
      <span>米果NT系统</span>
    </div>
    <el-button type="info" @click="loginOut" size="mini">退出</el-button>
<!--    <el-breadcrumb separator="/">-->
<!--      <el-breadcrumb-item :top="{path:'/'}">首页</el-breadcrumb-item>-->
<!--&lt;!&ndash;      <el-breadcrumb-item :top="current.path" v-if="current">&ndash;&gt;-->

<!--      </el-breadcrumb-item>-->
<!--    </el-breadcrumb>-->
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: "CommonHeader",
    computed:{
      ...mapState({

      })
    },
    methods:{
      loginOut(){
        this.$store.commit('clearToken')
        this.$router.push({path:'/login'})
      }
    }
  }
</script>

<style lang="scss" scoped>
  header {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: space-between;
  }
.b-content{
  display: flex;
  align-items: center;
  color: #eaeaea;
  height: 100%;
  font-size: 20px;
  justify-content:center;
  img{
    width: 60px;
    height: 100%;
  }
  span{
    margin-left: 15px;
  }

}
  .l-content {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .r-content {
    .user {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
</style>
<style lang="scss">
  .el-breadcrumb__item {
    .el-breadcrumb__inner {
      color: #666666;
      font-weight: normal;
    }

    &:last-child {
      .el-breadcrumb__inner {
        color: #ffffff;
      }
    }
  }
</style>
