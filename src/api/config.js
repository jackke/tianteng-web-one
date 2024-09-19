
import Vue from "vue";
let NODE_ENV = process.env.NODE_ENV;
let server, api = ''

// 登录地址
// http://192.168.1.253:18019/ 城市预报地址

if (NODE_ENV == 'development'){
    server = '/server'
} else {
    server = 'http://192.168.1.253:8004'
}

Vue.prototype.$api = {server}

