import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const home = r => require.ensure([], () => r(require('../views/Home/home')), 'home');
const main = r => require.ensure([], () => r(require('../views/main')), 'main');
const login = r => require.ensure([], () => r(require('../views/Login/Login')), 'login');
const routes = [
  {
    path: '/',
    name:'login',
    component:login,
    meta:{
      requireAuth:true
    }
  },
  {
    path: '/main',
    component: main,
    name: 'main',
    meta:{
      requireAuth:true
    }
    // children:[
    //   {
    //     path:'',
    //     component: home,
    //     meta:[]
    //   }
    // ]
  }
]
export default new Router({
  routes
})
