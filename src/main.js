import Vue from 'vue';
import "./api/config"
import App from './App.vue';
import ElementUI from "element-ui";
import router from "./router";
import store from "./store";
import zhLang from 'element-ui/lib/locale/lang/zh-CN';
import locale from './assets/elementUi/cn';

// 将所有组件为全局组件
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

Vue.use(ElementUI, {
  locale: { el: {...zhLang.el, ...locale.el}}
});


import 'element-ui/lib/theme-chalk/index.css';
import "./style/style.css";
import "./api/main.js";
import "./utils/reg.js";

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
