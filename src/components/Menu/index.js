import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import {
  isSmallMedia
} from '../../utils/helper';
import routes from '../../config/routes';

const SubMenu = Menu.SubMenu;

function getMenuConfig(routes, key) {
  let res = [];
  if(!Array.isArray(routes)){
     return []; 
  }

  for(let i = 0; i < routes.length; i++){
    const el = routes[i];
    const path = el.path;
    let childrenRoutes = el.children;

    if(el.hideInNav)continue;

    if(childrenRoutes){
      childrenRoutes = childrenRoutes.map(item => ({...item, path: `${path}/${item.path}`}))
    }

    const k = !key ? `${i}` : `${key}-${i}`;

    res.push({
      key: k,
      label: el.label,
      icon: el.icon,
      path: path,
      children: getMenuConfig(childrenRoutes, k)
    })
  };

  return res;  
}

function getSelectedKey(pathname, config) {
  let activeKeys = [];
  for(let i = 0; i < config.length; i++){
    const item = config[i];
    if(item.children && item.children.length > 0){
      const res = getSelectedKey(pathname, item.children);
      if(res.length > 0){
        activeKeys = res;
        break;
      }
    }else if(pathname === `/${item.path}`){
      activeKeys.push(item.key);
      break;
    }
  }

  return activeKeys;
}

const routesConfig = getMenuConfig(routes);

export default function NavMenu({menuCollapsed}) {

  const { pathname } = useLocation();
  console.log(pathname);

  const defaultSelectedKeys = getSelectedKey(pathname, routesConfig);

  const defaultOpenKeys = !menuCollapsed ? routesConfig.map(item => item.key) : [];

  // const appendProps = isSmallMedia() ? {} : {expandIcon: () => null};
  console.log(defaultSelectedKeys)

  return (
    <Menu
      theme="light"
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys} 
      defaultOpenKeys={defaultOpenKeys} 
      onClick={() => false}
      // inlineIndent={10}
      // {...appendProps}
    >
      {
        routesConfig.map((item) => {

          if(item.hideInNav)return null;
          
          return (item.children && item.children.length > 0) ? (
            <SubMenu 
              key={item.key}
              title={<span>{item.icon}<span>{item.label}</span></span>}
            >
              {
                item.children.map((item) => {
                  return (
                    <Menu.Item 
                      key={item.key} 
                    >
                      <Link to={item.path}>
                        <span>{item.label}</span>
                      </Link>
                    </Menu.Item>
                  )
                })
              }
            </SubMenu>
          ) : (
            <Menu.Item key={item.key}>
              <Link to={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </Menu.Item>
          )

        })
      }
    </Menu>
  )
}

