import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import {request} from "./network/request";
import store from './store/index'
import './assets/scss/reset.scss'
Vue.use(ElementUI);
Vue.config.productionTip = false
router.beforeEach((to,from,next)=>{
  store.commit('getToken')

  let token = store.state.user.token
  if(to.matched.some(record=>record.meta.requireAuth)){
    if(token == ''&& to.name!=='login'){
      console.log('ssss');
      next({path:'/login'})
    }else {
      console.log('bbbb');
      next()
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
