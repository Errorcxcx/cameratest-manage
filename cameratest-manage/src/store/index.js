import Vuex from 'vuex'
import tab from "./tab";
import user from "./user";
import Vue from 'vue'

Vue.use(Vuex)

 const store = new Vuex.Store({

  modules:{
    tab,
    user
  }

})
export default store
