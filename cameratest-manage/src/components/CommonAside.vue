<template>
  <el-menu
    router
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <h3>大米NT</h3>
    <el-menu-item :index="item.path" v-for="item in noChildren" :key="item.path">
      <i :class="'el-icon-s-'+item.icon"></i>
      <span slot="title">{{item.label}}</span>
    </el-menu-item>
    <el-submenu :index="item.label" v-for="(item, index) in hasChildren" :key="index">
      <template slot="title">
        <i :class="'el-icon-' + item.icon"></i>
        <span slot="title">{{ item.label }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item :index="subItem.path" v-for="(subItem,subIndex) in item.children" :key="subIndex">
          <i :class="'el-icon-' + subItem.icon"></i>
          <span slot="title">{{ subItem.label }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
  export default {
    name: "CommonAside",
    computed: {
      noChildren() {
        return this.menu.filter(item => item.children == null)
      },
      hasChildren() {
        return this.menu.filter(item => item.children != null)
      }


    },
    data() {
      return {
        menu: [
          {
            path: '/main',
            name: 'main',
            label: '首页',
            icon: 'home',
            url: 'Home/Home'
          },
          {
            path: 'testmanage',
            name: 'testmanage',
            label: '测试管理',
            icon: 'promotion',

            url: 'TestManage/TestManage'
          },
          {
            path: 'usermanage',
            name: 'usermanage',
            label: '人员管理',
            icon: 'management',

            url: 'UserManage/UserManage'
          },
          {
            label: '其他',
            icon:'more',
            children: [
              {
                path: '/pageone',
                name: 'pageone',
                label: '页面1',
                icon: 'question',
                url: 'Other/PageOne'
              },
              {
                path: '/pagetwo',
                name: 'pagetwo',
                label: '页面2',
                icon: 'info',
                url: 'Other/PageTwo'
              },
            ]
          }
        ]
      }
    }
    ,
    methods: {
      //跳转路由 根据名称跳转
      clickMenu(item) {
        // this.$store.commit('selectMenu', item)
        this.$router.push({name: item.name})
      }

    }
  }
</script>

<style lang="scss" scoped>
  .el-menu {
    height: 100%;
    border: none;
  h3 {
    color: #ffffff;
    text-align: center;
    line-height: 48px;
  }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
