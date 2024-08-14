
import Vue from "vue";
let NODE_ENV = process.env.NODE_ENV;
let server, api = ''

if (NODE_ENV == 'development'){
    server = '/server'
} else {
    server = 'http://192.168.1.253:8099'
    // api = 'http://192.168.1.42:8003'
    console.log(NODE_ENV, server);
}

Vue.prototype.$api = {server}

