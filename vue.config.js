const { defineConfig } = require('@vue/cli-service');

const path = require('path');
const webpack = require('webpack');
function resolve (dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  publicPath: './',
  devServer: {
    host: "localhost",
    port: 8081, // 端口号
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    proxy: {
      '/api' : {
        target: 'http://192.168.1.253:8004',
        pathRewrite: { '^/api': '' },
        changeOrigin: true, // target 是域名的话，需要这个参数
        secure: false // 设置支持https协议的代理
      },
    }
  },
  transpileDependencies: true,
  lintOnSave: false,// 关闭ESLINT校验工具
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '天腾气象影视管理系统'; //网站标题
      return args;
    });
  },
  configureWebpack: {
    output: {
      sourcePrefix: ''
    },
    resolve: {
      fallback: { "https": false, "zlib": false, "http": false, "url": false },
      mainFiles: ['index'],
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      
    ]
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/styles/main.scss";`
      },
      sass: {
        prependData: `@import "@/styles/main.scss";`
      }
    }
  }
});
