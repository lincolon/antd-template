import {isPlainObject, isString } from 'lodash-es';
import moment from 'moment';

export function isEmptyObject(obj){
  return isPlainObject(obj) && Object.keys(obj).length === 0;
}

export function formatPostData(data){
  if(!data)return {};
  const postData = Object.assign({}, data);
  for(let k in postData){
    if(isString(postData[k]) && /true|false/.test(postData[k])){
      postData[k] = postData[k] === 'true';
    }
  }
  return postData;
}

export function sleep(duration){
  return new Promise((resolve) => {
    let timer;
    timer = setTimeout(() => {
      resolve();
      clearTimeout(timer);
      timer = null;
    }, duration);
  })
}

export function paramsToUrl(params){
  if(!params)return '';
  if(!isPlainObject(params)){
    throw new Error('路径参数必须是一个纯对象')                                                
  }
  return Object.keys(params).reduce((res, item, idx, arr) => {
    let andOprator = idx === arr.length - 1 ? '' : '&';
    if(Array.isArray(params[item])){
      if(params[item].length > 1){
        params[item] = params[item].join('\u200b');
      }else{
        params[item] = params[item][0] + '\u200b';
      }
    }
    res+=`${item}=${params[item]}${andOprator}`;
    return res;
  }, '')
}

export function initialDatePickerValue(startTime, endTime){
  if(!startTime || startTime === '' || startTime === undefined || startTime === 'undefined')return null;
  const st = moment(parseInt(startTime*1000, 10)).format('YYYY-MM-DD HH:mm:ss');
  const et = moment(parseInt(endTime*1000, 10)).format('YYYY-MM-DD HH:mm:ss')
  return [
    moment(st),
    moment(et)
  ]
}

export function createDownload(url){
  let a = document.createElement('a');
  a.download = url;
  a.href = url;
  a.target = '_blank';
  if(a.click) {
    a.click();
  }else{
    try{
      var evt = document.createEvent('Event');
      evt.initEvent('click', true, true);
      a.dispatchEvent(evt);
    }catch(e){alert(e)};       
  }
  a = null;
}

export function isSmallMedia(){
  return window.innerWidth < 1400;
}

export function isMobile() {
  const userAgentInfo = navigator.userAgent.toLowerCase();
  const agents = ["android", "Adr", "iphone",
      "symbianos", "windows phone",
      "ipad", "ipod"];
  const target = agents.filter(item => (
    userAgentInfo.indexOf(item) >= 0
  ))
  return (target.length > 0);
}

//数组差集
export function diffArray(arr1, arr2){
  if(!Array.isArray(arr1) || !Array.isArray(arr2)){
    throw new Error('需要都是数组')
  }
  if(arr1.length === 0)return arr2;
  if(arr2.length === 0)return arr1;
  let l = arr1, s = arr2;
  if(arr1.length < arr2.length){
    l = arr2;
    s = arr1;
  }
  return l.filter(item => s.indexOf(item) == -1);
}

//数组交集
export function sameArray(arr1, arr2){
  if(!Array.isArray(arr1) || !Array.isArray(arr2)){
    throw new Error('需要都是数组')
  }
  if(arr1.length === 0 || arr2.length === 0 )return [];
  return arr1.filter(item => arr2.indexOf(item) > -1);
}

export function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

export function numberFormat(value, exp = -1){
  return decimalAdjust('round', value, exp);
}

function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

function splitPath(pathstr, seprator = '.'){
  const path = [];
  if(pathstr.indexOf(seprator)){
    pathstr.split(seprator).reduce((acc, item, idx) => {
      let res = '';
      res +=  idx === 0 ? `${item}` : `${acc}.${item}`;
      path.push(res);
      return res;
    }, '')
  }else{
    path.push(path);
  }
  return path;
}

export function filterAuth(authList, authPath, flag) {
  if(!isString(authPath) || !Array.isArray(authList))throw new Error("函数参数不正确");
  
  const path = splitPath(authPath, '.');

  let getPermission = (authList) => {
    const name = path.shift();
    const res = authList.filter(item => item.route === name);

    if(res.length === 0)throw new Error("不在权限树，请核查！");

    const data = res[0];
    if(path.length === 0){
      return data.sub;
    }else{
      return getPermission(data.sub)
    }
  }

  const permissions =  getPermission(authList);

  const [details] = permissions.filter(item => item.route === flag);

  return details && details.flag === 1 || false;

}

export function  arrayMove(arr, oldIndex, newIndex) {
  const arrCp = arr.slice();
  const moveItem = arrCp.splice(oldIndex, 1);
  arrCp.splice(newIndex, 0, ...moveItem);
  return arrCp;
}
