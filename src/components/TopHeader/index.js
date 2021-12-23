import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import {
  LogoutOutlined,
} from '@ant-design/icons';

import './style.css';

export default class TopHeader extends PureComponent {

  requestQueen = [];

  state = {
    downloadListVisible: false,
    downloadCount: 0,
  }

  uglyPhone(str) {
    return str && str.replace(/^(\d{3})\d{4}(\d+)/, `$1****$2`)
  }

  render() {
    // const { userInfo, logout, defaultStore } = this.props;
    return (
      <section className="topHeaderWrapper">
        <div className="mgtBlock mgt-block" style={{color: '#56CCF2', marginLeft: 40}}>
          <div style={{marginBottom: 4}}>管理员</div>
          <div>{this.uglyPhone('13925487487')}</div>
        </div>
        <Tooltip placement="bottomRight" title="退出系统">
          <a className={`mgt-block logoutBtn`} style={{height: '100%', lineHeight: '54px'}} >
            <LogoutOutlined />
          </a>
        </Tooltip>
      </section>
    )
  }
}