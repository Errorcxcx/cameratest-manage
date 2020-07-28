import Vuex from 'vuex'
import tab from "./tab";
import user from "./user";
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    tab,
    user
  }

})
