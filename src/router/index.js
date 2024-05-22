import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err);
};
const originalReplace = Router.prototype.replace;
Router.prototype.replace = function push (location) {
  return originalReplace.call(this, location).catch(err => err);
};

let routes = [
  {
    path: "/",
    redirect: '/index'
  },
  {
    path: "/index",
    name: 'home',
    meta: {
      name: "首页",
    },
    component: () => import("@/views/home"),
    children: [
      { // 气象影视系统
        path: '/meteorologicalDataSystem',
        name: 'meteorologicalDataSystem',
        component: () => import('@/views/meteorologicalDataSystem/index.vue'),
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    children: []
  },

];
var router = new Router({
  mode: 'hash',
  routes: routes
});

export default router;
