import {
  notification,
} from 'antd';

import isFunction from 'lodash-es/isFunction';
import isEmpty from 'lodash-es/isEmpty';
import { sleep } from "./helper";

const RECONNECTCOUNT = 10;
const OVERTIME       = 6000;

function executeFns(events, args){
  events.map(function(fn){fn(args)});
}

const noticeType = {
  'export': {
    0: 'export',
    1: 'export',
    2: 'export',
    3: 'export',
    4: 'export',
    5: 'export',
    6: 'export',
    9: 'export',
    12: 'export',
    14: 'export',
    15: 'export',
    16: 'export',
    17: 'export',
    18: 'export',
    19: 'export',
    20: 'export',
    21: 'export',
    22: 'export',
    23: 'export',
    24: 'export',
    25: 'export',
    26: 'export',
    27: 'export',
    28: 'export',
    29: 'export',
    30: 'export',
    31: 'export',
    32: 'export',
    33: 'export',
    34: 'export',
    35: 'export',
  },
  'import': {
    0: 'productsImport', //货品导入
    1: 'productsComfirm', //完成导入
    2: 'transferImport', //调拨导入
    3: 'transferConfirm', //调拨完成
    4: 'transferAccept', //调拨确认
    5: 'transferCancel', //调拨取消
    6: 'vipImport', //会员导入
    7: 'inventoryImport', //盘点导入
    8: 'inventoryImportComplete', //完成盘点
    9: 'productsUpdate', //货品批量更新
    10: 'productsInvertory', //货品新增盘点
    11: 'vipImportUpdate', //会员更新
    12: 'attachmentItemImport', //配件条目新增导入
    13: 'attachmentItemUpdate', //配件条目更新导入
    14: 'attachmentStorageImport', //配件入库单导入
    15: 'attachmentStorageConfirm', //配件入库单完成
    16: 'attachmentTransferImport', //配件调拨单导入
    17: 'attachmentTransferConfirm', //配件调拨单完成
    18: 'attachmentTransferCancel', // 配件调拨单撤销
    19: 'attachmentTransferAccept', //配件调拨单接收
    20: 'products2damaged', //成品批量报损
    21: 'damaged2old', //报损批量转旧料
  }
}

class Socket {

  websocket = null;
  connectCount = RECONNECTCOUNT;
  connectStatus = false;
  events = Object.create(null);

  init(url, config){
    if(window.WebSocket){
      this.connectServer(url, config)
    }
  }

  get socketHandler(){
    return this.websocket;
  }

  get isReady(){
    return this.websocket && this.connectStatus;
  }

  connectServer(url, config){

    try{
      this.websocket = new WebSocket(url);

      this.reConnect = () => {
        if(this.connectCount === 0){return;}
        --this.connectCount;
        this.connectServer(url, config);
      }

      this.websocket.onopen = () => {
        console.log("socket opened");
        this.connectStatus = true;
        this.connectCount = RECONNECTCOUNT;
      }

      this.websocket.onclose = async () => {
        //断开重连
        console.log("socket closed");
        this.connectStatus = false;
        this.websocket.close();

        //执行断开回调
        this.callbackDisconnect();

        await sleep(OVERTIME);
        this.reConnect();
      }

      this.websocket.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        if(isEmpty(this.events) || data.type === 'heart')return;
        const name = noticeType[data.type][data.type_code];
        executeFns(this.events[name], data);
      }
    }catch(e){
      throw new Error(e.name + ':' + e.message);
    }

  }

  callbackDisconnect(){
    const cbs = this.events['disconnect'];
    if(cbs && cbs.length > 0){
      executeFns(cbs);
      this.events['disconnect'] = null;
    }
  }

  close(){
    if(this.isReady){
      this.websocket.close();
    }
  }

  sendMessage(msg){
    if(this.isReady){
      notification.info({
        duration: 2,
        message: '正在后台处理，请稍后…'
      })
      this.websocket.send(JSON.stringify(msg), (res) => {
        console.log('hello');
      });
    }else{
      notification.warning({message: '后台正在处理，稍后请刷新页面看看', duration: 10});
    }
  }

  onMessage(name, fn){
    if(isFunction(fn)){
      if(!this.events[name]){
        this.events[name] = [];
      }
      this.events[name].push(fn)
    }else{
      throw new Error("请注册一个监听函数")
    }
  }

  unListen(name, handle){
    const handles = this.events[name];
    if (handles) {
      for (let i = 0, j = handles.length; i < j; i++) {
        if (handles[i] === handle) {
          handles.splice(i, 1)
        }
      }
    }
  }

}

export default new Socket();