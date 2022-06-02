import {
  DashboardOutlined,
  AppstoreOutlined,
  CrownOutlined,
  ProfileOutlined,
  BranchesOutlined,
  PayCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons'; 
import { Spin } from 'antd';

import React from 'react';

function Loading(){
  return <div
          style={{
            textAlign: 'center',
            padding: '100px 0',
          }}
        ><Spin /></div>
}

function AsyncComponent({src}){

  const Comp = React.lazy(() => import(`@/pages/${src}`))

  return <React.Suspense fallback={<Loading />}>
    <Comp />
  </React.Suspense>
}

const routes = [
  {
    label: '灾害点',
    path: 'disaster-areas',
    icon: <DashboardOutlined />,
    element: <AsyncComponent src="Disaster/areas" />,
  },
  {
    label: '数据分析',
    path: 'dashboard',
    icon: <AppstoreOutlined />,
    element: <AsyncComponent src="Dashboard" />,
  },
  {
    label: '灾害预测',
    path: 'disaster-predict',
    icon: <ProfileOutlined />,
    element: <AsyncComponent src="Disaster/predict" />,
  },
  {
    label: '灾害预警',
    path: 'disaster-warning',
    icon: <ProfileOutlined />,
    element: <AsyncComponent src="Disaster/warning" />,
  },
  {
    label: '系统管理',
    path: 'system',
    icon: <SettingOutlined />,
    children: [
      {
        label: '账号管理',
        path: 'users',
        element: <AsyncComponent src="System/employees" />,
      },
      {
        label: '角色管理',
        path: 'roles',
        element: <AsyncComponent src="System/roles" />,
      },
      {
        label: '单位管理',
        path: 'department',
        element: <AsyncComponent src="System/department" />,
      },
      {
        label: '项目管理',
        path: 'projects',
        element: <AsyncComponent src="System/projects" />,
      },
      {
        label: '项目数据',
        path: 'projects-data',
        element: <AsyncComponent src="System/projects-data" />,
      },
    ]
  },
]

export default routes;