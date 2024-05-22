import Vue from 'vue'


Vue.prototype.$changeTime = {
    createTimeFn
  }
// 时间类型转换
function createTimeFn(row, column, value){
    if (value){
        let date = new Date(value).toLocaleString()
        return date.replace(/\//g,'-')
    } else {
        return ''
    }
}