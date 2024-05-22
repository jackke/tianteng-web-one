import Vue from "vue";
import Vuex from "vuex";
import index from "./modules/index";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token: sessionStorage.getItem('token') || '',
    userName: sessionStorage.getItem('userName') || '',
    userId: sessionStorage.getItem('userId') || '',
    userAccount: sessionStorage.getItem('userAccount') || '',
    menuList:[]
  },
  getters: {
    
  },
  mutations: {
    setUser(state, user){
      let {username, id, account} = user
      sessionStorage.setItem('userName', username)
      sessionStorage.setItem('userId', id)
      sessionStorage.setItem('userAccount', account)
      state.userName = username
      state.userId = id
      state.userAccount = account
    },
    setToken(state,token){
      state.token = token
      sessionStorage.setItem('token', token)
    },
    delToken(state){
      state.token = ''
      sessionStorage.removeItem('token')
    },
    setMenu(state, menuList){
      state.menuList = menuList
      sessionStorage.setItem('menuList', JSON.stringify(menuList))
    }
  },
  actions: {
    getToken(){
      return this.state.token
    }
  },
  modules: {
    index
  }
});

export default store;
