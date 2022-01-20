import React, { useState } from 'react';
import { Layout } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';

import NavBar from './Menu';
import TopHeader from './TopHeader'
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const menuWidth = 254;
function MainLayout() {

  const [ menuCollapsed, setMenuCollapsed ] = useState(false);
  const navigate = useNavigate();

  const offsetLeft = menuCollapsed ? 80 : menuWidth;
  
  return (
    <Layout style={{height: "100%"}}>
      <Sider
        trigger={null}
        collapsible
        width={menuWidth}
        collapsed={menuCollapsed}
        style={{
          height: '100%',
          position: 'fixed', 
          left: 0, 
          zIndex: 110,
          boxShadow: '3px 0px 10px 0px rgba(0,0,0,0.3)'
        }}
      >
        <section className="logoContainer">
          <a onClick={() => {navigate('/dashboard', { replace: true })}}>
            <span className={`logo img-cover mgt-block`}></span>
          </a>
        </section>
        <div id='side_menu'>
          <NavBar menuCollapsed={menuCollapsed}/>
        </div>
        <div className="trigger-wrapper" onClick={() => setMenuCollapsed(!menuCollapsed)}>
            <span className="trigger">
              {
                menuCollapsed ? <MenuUnfoldOutlined style={{color: '#ffffffb8'}} /> : <MenuFoldOutlined style={{color: '#ffffffb8'}} />
              }
            </span>
        </div>
      </Sider>
      <Layout style={{ 
        marginLeft: offsetLeft, 
        minHeight: '100vh', 
        transition: 'margin-left 0.2s'
      }}>
        <Header style={{
          position: 'fixed', 
          background: '#3A434F', 
          padding: 0, 
          zIndex: 100, 
          width: '100%', 
          boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.13)', 
          left: 0, 
          paddingLeft: offsetLeft, 
          height: 54,
          linHeight: 54,
          transition: 'padding-left 0.2s' 
        }}  
        >
          <section style={{position: 'relative', height: '100%', lineHeight: 1}}>
            <TopHeader />
          </section>
        </Header>
        <Content style={{ minHeight: 'auto', paddingTop: 54}} id="mainContainer">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
