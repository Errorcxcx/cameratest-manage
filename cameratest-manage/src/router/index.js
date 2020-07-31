import Vue from 'vue'
import Router from 'vue-router'
import store from "../store";

Vue.use(Router)

const main = r => require.ensure([], () => r(require('../views/main')), 'main');
const login = r => require.ensure([], () => r(require('../views/Login/Login')), 'login');

const home = r => require.ensure([], () => r(require('../views/Home/home')), 'home');
const user = r => require.ensure([], () => r(require('../views/user/User')), 'user');
const routes = [
  {
    path: '/',
    redirect: '/home',
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
    path: '/home',
    component: main,
    name: 'main',
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '',
        redirect:'home',
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
    ]
  }
]
const router = new Router({
  routes
})
router.beforeEach((to, from, next) => {
  store.commit('getToken')
  let token = store.state.user.token
  if (to.name !== 'login' && !token) {
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
