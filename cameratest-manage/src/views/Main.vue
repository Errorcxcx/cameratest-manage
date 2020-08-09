<template>
  <el-container class="main-container">
    <el-header>
      <common-header></common-header>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <div class="toggle-button" @click="toggleCollapase">|||</div>
        <common-aside :ccollapse="collapse"></common-aside>
      </el-aside>
      <el-container>
        <el-main>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
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
    components: {CommonTab, CommonHeader, CommonAside},



    data() {
      return {
        collapse: true

      }
    },
    methods: {
      //菜单折叠
      toggleCollapase() {
        this.collapse = !this.collapse
      }
    }
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

  .main-container {
    height: 100%;
  }

  .toggle-button {
    background-color: #505458;
    font-size: 10px;
    line-height: 24px;
    color: #eaeaea;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
