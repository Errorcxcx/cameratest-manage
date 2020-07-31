<template>
  <el-menu
    router
    unique-opened
    default-active="route.path"
    :collapse="ccollapse"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <!--    <el-menu-item :index="item.path" v-for="item in noChildren" :key="item.path">-->
    <!--      <i :class="'el-icon-s-'+item.icon"></i>-->
    <!--      <span slot="title">{{item.label}}</span>-->
    <!--    </el-menu-item>-->
    <el-submenu :index="'/'+item.path" v-for="(item, key) in menuList" :key="item.id">
      <template slot="title">
        <i :class="iconList[item.id+'']"></i>
        <span>{{ item.authName }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item :index="'/'+subItem.path" v-for="(subItem,subIndex) in item.children" :key="subItem.id">
          <i :class="'el-icon-menu'"></i>
          <span slot="title">{{ subItem.authName }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
  import {request} from '../network/request'

  export default {
    name: "CommonAside",
    created() {
      this.getMenuList();
    },
    computed: {
      noChildren() {
        return this.menu.filter(item => item.children == null)
      },
      hasChildren() {
        return this.menu.filter(item => item.children != null)
      }
    },
    props: {
      ccollapse:{
        default(){
          return false
        }
      }
    }
    ,
    data() {
      return {
        iconList:{'125':'el-icon-user-solid',
        '103':'el-icon-s-tools',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-order',
        '145':'el-icon-s-marketing'
      },
        // menu: [
        //   {
        //     path: '/home',
        //     name: 'home',
        //     label: '首页',
        //     icon: 'home',
        //     url: 'Home/Home'
        //   },
        //   {
        //     path: '/testmanage',
        //     name: 'testmanage',
        //     label: '测试管理',
        //     icon: 'promotion',
        //
        //     url: 'TestManage/TestManage'
        //   },
        //   {
        //     path: '/usermanage',
        //     name: 'usermanage',
        //     label: '人员管理',
        //     icon: 'management',
        //
        //     url: 'UserManage/UserManage'
        //   },
        //   {
        //     label: '其他',
        //     icon: 'more',
        //     children: [
        //       {
        //         path: '/pageone',
        //         name: 'pageone',
        //         label: '页面1',
        //         icon: 'question',
        //         url: 'Other/PageOne'
        //       },
        //       {
        //         path: '/pagetwo',
        //         name: 'pagetwo',
        //         label: '页面2',
        //         icon: 'info',
        //         url: 'Other/PageTwo'
        //       },
        //     ]
        //   }
        // ],
        //左侧菜单啦
        menuList: [],

      }
    }
    ,
    methods: {
      send(){
      },
      //跳转路由 根据名称跳转
      clickMenu(item) {
        // this.$store.commit('selectMenu', item)
        this.$router.push({name: item.name})
      }
      ,
      //获取所有菜单
      async getMenuList() {
        await request({
          url: 'menus'
        }).then(res => {
          console.log('nnnnnnn'+this.ccollapse);
          console.log(res.data.data);
          if (res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg)
          }
          this.menuList = res.data.data
        }).catch(err => {

        })
      }

    }
  }
</script>

<style lang="scss" scoped>
  .el-menu {
    height: 100%;
    border: none;


  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
