import Vue from 'vue'
import Router from 'vue-router'
import store from "../store";

Vue.use(Router)

const main = r => require.ensure([], () => r(require('../views/main')), 'main');
const login = r => require.ensure([], () => r(require('../views/Login/Login')), 'login');
const rights = r => require.ensure([], () => r(require('../views/rights/Rights')), 'rights');
const home = r => require.ensure([], () => r(require('../views/Home/home')), 'home');
const users = r => require.ensure([], () => r(require('../views/user/User')), 'users');
const roles = r => require.ensure([], () => r(require('../views/rights/Roles')), 'roles');
const cate = r => require.ensure([], () => r(require('../views/goods/Cate')), 'cate');
const params = r => require.ensure([], () => r(require('../views/goods/Params')), 'params');
const list = r => require.ensure([], () => r(require('../views/goods/List')), 'list');
const add = r => require.ensure([], () => r(require('../views/goods/Add')), 'add');
const order = r => require.ensure([], () => r(require('../views/order/Order')), 'order');

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
    name:'main',
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: '',
        name: 'home',
        component: home,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/home',
        component: home,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/users',
        component: users,

        meta: {
          requireAuth: true
        }

      },
      {
        path: '/rights',
        component: rights,

        meta: {
          requireAuth: true
        }
      },
      {
        path: '/roles',
        component: roles,

        meta: {
          requireAuth: true
        }
      },
      {
        path: '/categories',
        component: cate,

        meta: {
          requireAuth: true
        }
      },
      {
        path: '/params',
        component: params,

        meta: {
          requireAuth: true
        }
      },
      {
        path: '/goods',
        component: list,

        meta: {
          requireAuth: true
        }
      },
      {
        path: '/goods/add',
        component: add,

        meta: {
          requireAuth: true
        }
      },
      {
        path: '/orders',
        component: order,

        meta: {
          requireAuth: true
        }
      }

    ]
  }
]
const router = new Router({
  routes
})
router.beforeEach((to, from, next) => {
  store.commit('getToken')
  let token = store.state.user.token
  console.log(token);

  if (!token && to.name !== 'login') {
    next({path: '/login'})
  } else {
    console.log('bbbb');
    next()
  }
  //
  // if(to.path === '/login') return next();
  // if(!token) return next({path: '/login'});
  // next()
})
export default router
