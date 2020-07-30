import Vue from 'vue'
import Router from 'vue-router'
import store from "../store";
import home from "../views/Home/home";

Vue.use(Router)

const main = r => require.ensure([], () => r(require('../views/main')), 'main');
const login = r => require.ensure([], () => r(require('../views/Login/Login')), 'login');
const testmanage = r => require.ensure([], () => r(require('../views/Manage/testmanage')), 'testmanage');
const usermanage = r => require.ensure([], () => r(require('../views/Manage/usermanage')), 'usermanage');
const pageone = r => require.ensure([], () => r(require('../views/Others/PageOne')), 'pageone');
const pagetwo = r => require.ensure([], () => r(require('../views/Others/PageTwo')), 'pagetwo');
const routes = [
  {
    path: '/',
    redirect: '/main',
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
    redirect:'/main/home',

    meta: {
      requireAuth: true
    },
    children: [
      {
        path:'',
        redirect:'/home',
        meta: {
          requireAuth: true
        },
      },
      {
        path:'/home',
        component:home,
        meta: {
          requireAuth: true
        }
      },
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
 const router =new Router({
  routes
})
router.beforeEach((to, from, next) => {
  store.commit('getToken')
  let token = store.state.user.token
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (to.name !== 'login' && !token) {
      next({path: '/login'})
    } else {
      console.log('bbbb');
      next()
    }
  }
  //
  // if(to.path === '/login') return next();
  // if(!token) return next({path: '/login'});
  // next()
})
export default router
