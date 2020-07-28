<template>
  <div class="l-content">
    <el-button plain icon="el-icon-menu" size="mini"></el-button>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :top="{path:'/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item :top="current.path" v-if="current">

      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: "CommonHeader",
    computed:{
      ...mapState({

      })
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

  .l-content {
    display: flex;
    align-items: center;

    .el-button {
      margin-right: 20px;
    }
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
