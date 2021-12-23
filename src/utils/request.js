import axios from 'axios';
import { notification } from 'antd'
import NProgress from 'nprogress';
import Cookie from 'js-cookie';
// import qs from 'qs';

import projectConfig from '../../project.config.json';

const hostApi = projectConfig.development.host;

// const genPostOptions = (function(){
//   return function(options){

//     let contentType = 'application/json; charset=utf-8';
//     const { store: {defaultStore} } = getState();
//     const storeId = defaultStore && defaultStore.id || 0;
//     // console.log('body', options.body || {});
//     if (!(options.body instanceof FormData)) {
//       //普通请求
//       // console.log(options.body, 'params');
//       options.body = formatPostData(options.body);
//       // console.log(options.body);
//       if(options.body.store_id === undefined || !options.body.hasOwnProperty('store_id')){
//         options.body.store_id = storeId;
//         if(!options.body.hasOwnProperty("all")){
//           options.body.all = storeId === 0;
//         }
//       }
//     } else {
//       //带文件请求
//       if(!options.body.has('store_id')){
//         options.body.append('store_id', storeId);
//       }
//       contentType = 'multipart/form-data; charset=utf-8';
//     }

//     options.headers = {
//       Accept: 'application/json',
//       'Content-Type': contentType,
//       ...options.headers,
//     };

//   }
// })()

const requestQueen = {
  data: [],
  isLoading: function(url) {
    return this.data.indexOf(url) > -1;
  },
  push: function(url) {
    this.data.push(url)
  },
  remove: function(url){
    const idx = this.data.indexOf(url);
    if(idx > -1){
      this.data.splice(idx, 1);
    }
  }
}

function createPostData(data, method){
  let _data = data;
  if(method.toUpperCase() === 'POST'){
    _data = qs.stringify(_data);
  }
  return _data;
}

function dataFormatter(data) {
  let res = data;
  if(data['withFile']){
    res = new FormData();
    for(const k in data){
      res.append(k, data[k])
    }
  }else if(data.pageSize){
    res.page = data.current;
    res.page_size = data.pageSize;
    delete res.current;
    delete res.pageSize;
  }
  return res
}

export default function initRequest(){

  axios.defaults.baseURL = hostApi;
  axios.defaults.timeout = 60000;

  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const authorization = {};

    if(config.url.indexOf('/login') === -1){
      authorization["Authorization"] = Cookie.get(projectConfig.token_name)
    }

    if(requestQueen.isLoading(config.url))return;

    requestQueen.push(config.url);
    NProgress.start();

    return {
      ...config,
      data: dataFormatter(config.data),
      headers: {
        common: {
          ...config.headers.common,
          ...authorization
        },
        post: {
          'Content-Type': !config.data.withFile ? 'application/json; charset=utf-8' : 'multipart/form-data; charset=utf-8'
        }
      }
    };
  });

  axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么

    const {code, msg} = response.data;
    const { config, headers } = response;

    if(headers['authorization']){
      Cookie.set(projectConfig.token_name, headers['authorization'])
    }
   
    requestQueen.remove(config.url);
    NProgress.done();
    
    if(code === 402){
      location.replace('/login');
    } else if(code !== 0) {
      notification.error({
        message: msg
      })
      return Promise.reject({code, message: msg});
    }

    return {
      success: true,
      data: response.data.data,
      total: response.data.page.total,
      extra: response.data.extra
    };
  }, function (error) {
    
    requestQueen.remove(config.url);
    NProgress.done();

    return Promise.reject(error);
  });
}