import axios from "axios";
import store from "@/store";
import ElementUI from 'element-ui';
import router from "@/router";


let pathArr = ['login', 'index', 'meteorologicalDataSystem']
// 路由守卫拦截
router.beforeEach((to,from,next)=>{
    let pathName = to.name;
    if (pathArr.indexOf(pathName) == -1){
      next({path:'/404'})
      // next({path:'/meteorologicalDataSystem'})
    }  
    next()
})

// 创建axios实例
const server = axios.create({
  headers: {},
});
// 添加请求拦截器
server.interceptors.request.use(
  function (config) {
    // console.log(config, '请求拦截器');
    if (store.state.token) {
      config.headers['Authorization'] = store.state.token
      config.headers['Content-Type'] = "application/json"
    }
    if (config.method == "post" && config.data instanceof FormData) {
      config.headers['Content-Type'] = "multipart/form-data"
    }
  
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    console.log("调用接口错误", error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
server.interceptors.response.use(
  function (response) {
    // console.log(response, '响应拦截器');
    if (response.status != 200) {
      console.log("与服务器连接失败，错误码", response.status);
      return response;
    }
    // 未登录
    if (response.data.code == 100) { 
      ElementUI.Message({
        message: response.data.message,
        type: 'error'
      });
      // 清除本地缓存
      localStorage.clear()
      sessionStorage.clear()
      setTimeout(() => {
        router.push('/login')
      }, 1000);
    }
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    console.log("服务器响应错误", error);
    return Promise.reject(error);
  }
);
export default server;
