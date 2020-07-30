<template>
  <el-container class="main-container">
    <el-header>
      <common-header></common-header>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <common-aside></common-aside>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>
          <common-tab></common-tab>
        </el-footer>
      </el-container>


    </el-container>
  </el-container>
</template>

<script>
  import CommonAside from "../components/CommonAside";
  import CommonTab from "../components/CommonTab";
  import CommonHeader from "../components/CommonHeader";

  export default {
    name: "Main",
    components: {CommonTab, CommonHeader, CommonAside}
  }
</script>

<style lang="scss" scoped>
  .el-header {
    background-color: #333;

  }

  .el-main {
    padding-top: 0;
    background-color: #eaeaea;
  }

  .el-footer {
  background-color: #999999;
  }
  .main-container{
    height: 100%;
  }
</style>
