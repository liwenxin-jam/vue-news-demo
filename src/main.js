import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'

import App from './App.vue'
import routeConfig from './routeConfig.js' //import routes 
import filters from './filters'
import Loading from './components/Loading'
import stores from './store/store'

Vue.use(VueRouter);
Vue.use(Loading);

require('./assets/css/base.css'); //引入全局的base文件

const router = new VueRouter({
    mode: 'history', //切换路径模式，变成history模式 ,默认是hash模式，也就是url后面加#
    scrollBehavior: () => ({ y: 0 }), // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
    routes: routeConfig // 注意框架指定需要给routes赋值 所以import的时候也可以直接命名routes传
});

Object.keys(filters).forEach(key => Vue.filter(key, filters[key])) //es6语法  循环遍历所有的过滤器

//axios.defaults.baseURL='http://localhost:8082/';  //设置接口默认基础路径
//可以通过判断环境动态配置接口基础地址
//axios.defaults.baseURL = (process.env.NODE_ENV !=='production' ? config.dev.httpUrl:config.build.httpUrl); 
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';  //设置post请求参数头
Vue.prototype.$http = axios //其他页面在使用axios的时候直接  this.$http就可以了

//axios的一些配置，比如发送请求显示loading，请求回来loading消失之类的
axios.interceptors.request.use(function(config) { //配置发送请求的信息
    stores.dispatch('showLoading')
    return config;
}, function(error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function(response) { //配置请求回来的信息
    stores.dispatch('hideLoading')
    return response;
}, function(error) {
    return Promise.reject(error);
});

new Vue({
    el: '#app', //挂载
    router,
    store: stores, //需要用到vuex，需要这里把store引进来
    //components: { App }  vue1.0的写法
    render: h => h(App) //vue2.0的写法， h 的实参是 createElement 函数
}) //.$mount('#app') 也可以这样挂载