import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const home = r => require.ensure([], () => r(require('../views/Home/home')), 'home');
const main = r => require.ensure([], () => r(require('../views/main')), 'main');
const routes =[
  {
    path: '/',
    component:main,
    name:'',
    children:[
      {
        path:'',
        component: home,
        meta:[]
      }
    ]
  }
]
export default new Router({
  routes
})
