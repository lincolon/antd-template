import React from 'react'
import { useRoutes, Navigate, BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import Cookie from 'js-cookie';
import zhCN from 'antd/lib/locale/zh_CN'; 

import projectConfig from '../../project.config.json'
import routes from '../config/routes'

import LoginPage from './Login'
import Page403 from './Errors/403';
import NotFound from './Errors/404';
import Page500 from './Errors/500';
import MainLayout from '../components/MainLayout'

const baseRoutes = [
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/*',
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <EntryPoint />,
            }
        ].concat(routes)
    },
    { path: '403', element: <Page403 /> },
    { path: '404', element: <NotFound /> },
    { path: '500', element: <Page500 /> },
    { path: '*', element: <NotFound /> },
]

function EntryPoint(){
    const isLogined = Cookie.get(projectConfig.token_name);
    return !isLogined ? <Navigate to="login" replace /> : <Navigate to="dashboard" />
}

function RoutesWrapper({routes}){
    return useRoutes(routes);
}



export default function App(){ 

    return (
        <ConfigProvider locale={zhCN}>
            <BrowserRouter>
                <RoutesWrapper routes={baseRoutes}/>
            </BrowserRouter>
        </ConfigProvider>
    )
}