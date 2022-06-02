import React from 'react';
import { Form, Input, Button, Layout } from 'antd';
import {
  LockOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import Cookie from 'js-cookie';
import './login.less';
import CFooter from '../../components/CFooter';
import rules from '../../utils/rules';
// import {isProduction, cookieAllowDomain} from '../../config/host';

import projectConfig from '../../../project.config.json';

import { login } from './service/login';

import storage from 'localforage'

const { Content } = Layout;

const { passReg } = rules;

// function CheckService(){
//   // const isDev = process.env.NODE_ENV === "development";
//   const defaultService = cookie.getItem('hostApi') || 'https://luoxiao-api.smart-store.2bao.org/api';

//   const handleChange = async (e) => {
//     const val = e.target.value;
//     cookie.set('hostApi', val, Infinity, '/', cookieAllowDomain);
//     window.location.reload();
//   }

//   if(!isProduction){
//     return (
//       <section style={{textAlign: 'center', marginBottom: 20}}>
//         <Radio.Group defaultValue={defaultService} buttonStyle="solid" onChange={handleChange}>
//           <Radio.Button value="https://sapi.2bao.org/api">线上测试服务</Radio.Button>
//           <Radio.Button value="https://luoxiao-api.smart-store.2bao.org/api">本地测试服务</Radio.Button>
//           <Radio.Button value="https://feiqiang-api.smart-store.2bao.org/api">本地费强测试服务</Radio.Button>
//         </Radio.Group>
//       </section>
//     )
//   }
//   return null;
// }

function LoginPage(props) {

  const [ form ] = Form.useForm();
  const navgiate = useNavigate()

  const handleSubmit = async (values) => {
    const { data: { access_token, menu, user } } = await login({phone: values.userName, password: values.password})
    Cookie.set(projectConfig.token_name, access_token);
    await storage.setItem('userInfo', user);
    await storage.setItem('permission', menu);
    navgiate('/disaster-areas');
  }

  return (
    <Layout className="loginLayeroutContainer">
      <Content className="loginLayeroutContent">
        {/* <CheckService /> */}
        <section>
          <div className="pageTitle">
            <span className="logo img-cover no-bg"></span>
            <h1 className="pageTitleH1">{projectConfig.name}</h1>
          </div>
          <summary></summary>
        </section>
        <section className="loginFormContainer">
          <Form 
            form={form}
            onFinish={handleSubmit} 
            className="login-form"
          >
            <Form.Item
              name="userName"
              rules={[
                { required: true, message: '请输入登录账号' },
              ]}
            >
              <Input 
                size="large" 
                prefix={<PhoneOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} 
                placeholder="登录手机" 
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { pattern: passReg, message: '密码不能少于6位' }
              ]}
            >
              <Input.Password 
                size="large" 
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} 
                type="password" 
                placeholder="密码" 
              />
            </Form.Item>
            <Form.Item>
              <Button size="large" type="primary" htmlType="submit" className="loginFormButton">
                登&nbsp;&nbsp;录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </Content>
      <CFooter />
    </Layout>
  )
}

export default LoginPage;