import React from 'react';
import ReactDOM from 'react-dom';

import App from './pages/index';
import '@modules/nprogress/nprogress.css'; 
import '@modules/antd/dist/antd.less';
import './global.css'

import initRequest from './utils/request';

initRequest();

ReactDOM.render(<App />, document.getElementById('root'))
