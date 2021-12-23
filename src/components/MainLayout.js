import React from 'react';
import { Layout } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';

import NavBar from './Menu';
import TopHeader from './TopHeader'
import { Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;


class MainLayout extends React.PureComponent {

  ref = React.createRef();
  searchRef = React.createRef();
  stores = [];

  state = {
    showStoreChanger: false,
    showStoreSearch: false,
    dropdownVisible: false,
    stores: [],
  }

  toggle = () => {
    
  }

  componentDidMount(){
    
  }

  async logout() {
   
  }

  

  render() {
    const menuWidth = 254;
    const { menuCollapsed } = this.props;

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
            <a onClick={() => {window.g_app._history.replace('/app/dashboard')}}>
              <span className={`logo img-cover mgt-block`}></span>
            </a>
          </section>
          {/* <div id={menuCollapsed ? '' : 'side_menu'}> */}
          <div id='side_menu'>
            <NavBar />
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
              <span className="trigger">
                {
                  this.props.menuCollapsed ? <MenuUnfoldOutlined style={{color: '#ffffffb8'}} /> : <MenuFoldOutlined style={{color: '#ffffffb8'}} />
                }
              </span>
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
}

export default MainLayout;
