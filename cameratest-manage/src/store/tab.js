import Cookie from 'js-cookie'

export default {
  state: {
    isCollapse: false,
    currentMenu: null,
    menu: [],
    tabsList: [
      {
        path: '/',
        name: 'home',
        label: '首页',
        icon: 'home'
      }
    ],
    oldActivePath:'',
    newActivePath:''
  },
  mutations:{
    setMenu(state,val){
      //vuex添加
    },
    saveActivePath(state,activePath){
      state.oldActivePath = state.newActivePath
        state.newActivePath = activePath
    }
  }

}
