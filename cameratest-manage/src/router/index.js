import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const main = r => require.ensure([], () => r(require('../views/main')), 'main');
const login = r => require.ensure([], () => r(require('../views/Login/Login')), 'login');
const testmanage = r => require.ensure([], () => r(require('../views/Manage/testmanage')), 'testmanage');
const usermanage = r => require.ensure([], () => r(require('../views/Manage/testmanage')), 'usermanage');
const pageone = r => require.ensure([], () => r(require('../views/Others/PageOne')), 'pageone');
const pagetwo = r => require.ensure([], () => r(require('../views/Others/PageTwo')), 'pagetwo');
const routes = [
  {
    path: '/',
    redirect: '/login',
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/main',
    component: main,
    name: 'main',
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '/testmanage',
        component: testmanage,
        meta: []
      },
      {
        path: '/usermanage',
        component: usermanage,
        meta: []
      },
      {
        path: '/pageone',
        component: pageone,
        meta: []
      }, {
        path: '/pagetwo',
        component: pagetwo,
        meta: []
      }
    ]
  }
]
export default new Router({
  routes
})
