<template>
    <el-container style="height: 100%">
      <el-aside width="auto">
        <common-aside></common-aside>
      </el-aside>
      <el-container>
        <el-header>
          <common-header></common-header>
        </el-header>
          <common-tab></common-tab>
        <el-main>
          <router-view></router-view>
        </el-main>
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

<style scoped>

</style>
