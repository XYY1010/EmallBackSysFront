// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import store from './vuex';
import echarts from 'echarts';
import axios from './axios_config.js'

Vue.config.productionTip = false

Vue.prototype.$echarts = echarts;

import 'iview/dist/styles/iview.css';
Vue.use(iView);

Object.defineProperty(Vue.prototype, '$axios', { value: axios });

// 全局导航钩子
 router.beforeEach((to, from, next) => {
     iView.LoadingBar.start();
     // 判断该路由是否需要登录权限
     if (to.meta.requireAuth) {
         // 通过vuex state获取当前的token是否存在
         // console.log(isEmptyObject(store.state.user))
         if(!isEmptyObject(store.state.user)) {
             next();
         }
         else {
             next({
                 path: '/',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
         }
     }
     else {
         next();
     }
 })

 function isEmptyObject(obj) {
     for (var key in obj.user) {
         return false;
     }
     return true;
 }

router.afterEach(route => {
  iView.LoadingBar.finish();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
