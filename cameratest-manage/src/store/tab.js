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
    ]
  },
  mutations:{
    setMenu(state,val){
      //vuex添加
    }
  }

}
