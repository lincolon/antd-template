import {
  DashboardOutlined,
  AppstoreOutlined,
  TableOutlined,
  ContactsOutlined,
  GiftOutlined,
  TeamOutlined,
  PropertySafetyOutlined,
  RadarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons'; 
import { Spin } from 'antd';

import React from 'react';

import Dashboard from '@/pages/Dashboard'

const lazy = React.lazy;

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
    label: '控制面板',
    path: 'dashboard',
    icon: <DashboardOutlined />,
    element: <AsyncComponent src="Dashboard" />,
    hideInNav: true
  },
  {
    label: '商品管理',
    path: 'products',
    icon: <AppstoreOutlined />,
    children: [
      {
        label: '商品详情',
        path: 'details',
        hideInNav: true,
        element: <AsyncComponent src="Products/details" />,
      },
      {
        label: '商品列表',
        path: 'list',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: 'SKU列表',
        path: 'sku',
        element: <AsyncComponent src="Products/sku" />,
      }
    ]
  },
  {
    label: '订单管理',
    path: 'order',
    icon: <AppstoreOutlined />,
    children: [
      {
        label: '订单列表',
        path: 'list',
        element: <AsyncComponent src="Products/list" />,
      },
    ]
  },
  {
    label: '会员管理',
    path: 'member',
    icon: <AppstoreOutlined />,
    children: [
      {
        label: '会员列表',
        path: 'list',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '份数记录',
        path: 'record',
        element: <AsyncComponent src="Products/list" />,
      },
    ]
  },
  {
    label: '会员配送',
    path: 'express',
    icon: <AppstoreOutlined />,
    children: [
      {
        label: '配送计划',
        path: 'list',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '计划明细',
        path: 'details',
        element: <AsyncComponent src="Products/list" />,
      },
    ]
  },
  {
    label: '营销管理',
    path: 'activity',
    icon: <AppstoreOutlined />,
    children: [
      {
        label: '卡劵列表',
        path: 'tickets',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '卡券派发',
        path: 'list',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '货品派发',
        path: 'list',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '分享有礼',
        path: 'share',
        element: <AsyncComponent src="Products/list" />,
      },
    ]
  },
  {
    label: '小区管理',
    path: 'express',
    icon: <AppstoreOutlined />,
    children: [
      {
        label: '网点管理',
        path: 'list',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '设备管理',
        path: 'devices',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '合伙人管理',
        path: 'list',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '设备事件',
        path: 'device-events',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '网络记录',
        path: 'list',
        element: <AsyncComponent src="Products/list" />,
      },
    ]
  },
  {
    label: '生产配货',
    path: 'factory',
    icon: <AppstoreOutlined />,
    children: [
      {
        label: '生产计划',
        path: 'plan',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '配送员管理',
        path: 'express-man',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '配货记录',
        path: 'express-record',
        element: <AsyncComponent src="Products/list" />,
      },
    ]
  },
  {
    label: '财务管理',
    path: 'factory',
    icon: <AppstoreOutlined />,
    children: [
      {
        label: '合伙人结算',
        path: 'list',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '订户返佣',
        path: 'list',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '提现申请',
        path: 'withdraw',
        element: <AsyncComponent src="Products/list" />,
      },
    ]
  },
  {
    label: '系统管理',
    path: 'system',
    icon: <AppstoreOutlined />,
    children: [
      {
        label: '平台账号',
        path: 'account',
        element: <AsyncComponent src="Products/list" />,
      },
      {
        label: '角色管理',
        path: 'roles',
        element: <AsyncComponent src="Products/list" />,
      },
    ]
  },
]

export default routes;