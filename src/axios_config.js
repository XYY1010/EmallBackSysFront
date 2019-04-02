import axios from 'axios';

// axios.defaults.baseURL = 'http://139.198.15.172:8080';
axios.defaults.baseURL = 'http://139.199.125.60:8090';
axios.defaults.headers = {

  // 'Content-Type': 'application/json;charset=utf-8',
  'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8',
  'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
  'Access-Control-Allow-Origin': '*'
  // 'Access-Control-Allow-Headers':'Content-Type,Accept,Content-Length, Authorization, Accept,X-Requested-With'
};

axios.interceptors.response.use(function (config) {
  // 在发送请求之前做什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

export default axios;
