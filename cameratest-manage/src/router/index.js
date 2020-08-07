import Vue from 'vue'
import Router from 'vue-router'
import store from "../store";

Vue.use(Router)

const main = r => require.ensure([], () => r(require('../views/main')), 'main');
const login = r => require.ensure([], () => r(require('../views/Login/Login')), 'login');

const home = r => require.ensure([], () => r(require('../views/Home/home')), 'home');
const users = r => require.ensure([], () => r(require('../views/user/User')), 'users');
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
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: '',
        name:'home',
        component:home,
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

  if (!token && to.name !== 'login'  ) {
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
