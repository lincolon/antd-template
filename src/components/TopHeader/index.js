import React, { useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import Cookie from 'js-cookie';
import {
  LogoutOutlined,
} from '@ant-design/icons';
import storage from 'localforage';

import projectConfig from '../../../project.config.json';

import './style.css';

function uglyPhone(str) {
  return str && str.replace(/^(\d{3})\d{4}(\d+)/, `$1****$2`)
}

export default function TopHeader() {

  const [ userInfo, updateUserInfo ] = useState({})

  const logout = () => {
    Cookie.remove(projectConfig.token_name);
    window.location.href = '/login';
  }

  useEffect(() => {
    (async () => {
      const info = await storage.getItem('userInfo');
      console.log(info)
      updateUserInfo(info);
    })();
  }, [])
  
  return (
    <section className="topHeaderWrapper">
      <div className="mgtBlock mgt-block" style={{color: '#2F80ED', marginLeft: 40}}>
        <div style={{marginBottom: 4}}>管理员</div>
        <div>{uglyPhone(userInfo?.phone)}</div>
      </div>
      <Tooltip placement="bottomRight" title="退出系统">
        <a className={`mgt-block logoutBtn`} style={{height: '100%', lineHeight: '54px'}} onClick={logout} >
          <LogoutOutlined />
        </a>
      </Tooltip>
    </section>
  )
}