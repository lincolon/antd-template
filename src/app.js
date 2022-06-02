import React from 'react';
import ReactDOM from 'react-dom';
import storage from 'localforage';
import App from './pages/index';
import '@modules/nprogress/nprogress.css'; 
import '@modules/antd/dist/antd.less';
import './global.less'

import projectConfig from '../project.config.json'

import initRequest from './utils/request';

storage.config({
    name: projectConfig.token_name
});

initRequest();

ReactDOM.render(<App />, document.getElementById('root'))
