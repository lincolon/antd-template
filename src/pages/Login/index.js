import React from 'react';
import { Form, Input, Button, Layout } from 'antd';
import {
  LockOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'

import './login.less';
import CFooter from '../../components/CFooter';
import rules from '../../utils/rules';
// import {isProduction, cookieAllowDomain} from '../../config/host';

import projectConfig from '../../../project.config.json';

import { login } from '@service/login';

const { Content } = Layout;

const { passReg } = rules;


function LoginPage(props) {

  const [ form ] = Form.useForm();
  const navgiate = useNavigate()

  const handleSubmit = async (values) => {
    const res = await login({username: values.userName, password: btoa(values.password), a: [1,2,3]})
    navgiate('/dashboard');
  }

  return (
    <Layout className="loginLayeroutContainer">
      <Content className="loginLayeroutContent">
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