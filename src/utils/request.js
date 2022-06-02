import axios from 'axios';
import { notification } from 'antd'
import NProgress from 'nprogress';
import Cookie from 'js-cookie';
// import qs from 'qs';

import projectConfig from '../../project.config.json';

import { refreshToken } from '../service/common';

const env = process.env.NODE_ENV === "development" ? "development" : "production"
const hostApi = projectConfig[env].host;

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

function dataFormatter(data) {
  if(!data)return {};
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
    const authorization = {
      Authorization: config.headers?.authorization
    };

    if(config.url.indexOf('/login') === -1){
      authorization["Authorization"] = `Bearer ${Cookie.get(projectConfig.token_name)}`;
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
          'Content-Type': (!config.data || !config.data.withFile) ? 'application/json; charset=utf-8' : 'multipart/form-data; charset=utf-8'
        }
      }
    };
  });

  axios.interceptors.response.use(async function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么

    const {code, msg} = response.data;
    const { config } = response;
   
    requestQueen.remove(config.url);
    NProgress.done();
    
    if(+code === 403){
      location.replace('/login');
    } else if(+code === 402) {
      console.log(config)
      const {data: { access_token }} =  await refreshToken();
      Cookie.set(projectConfig.token_name, access_token);
      axios.post(config.url, config.data, {
        headers: {
          Authorization: access_token
        }
      });
    }else if(+code !== 0) {
      notification.error({
        message: msg
      })
      return Promise.reject({code, message: msg, url: config.url});
    }

    return {
      success: true,
      data: response.data.data,
      total: response.data.page.total,
      extra: response.data.extra
    };
  }, function (error) {
    
    NProgress.done();
    if(error.url){
      requestQueen.remove(config.url);
    }
    return Promise.reject(error);
  });
}