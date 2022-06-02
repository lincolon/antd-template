import React, { useRef, useState } from 'react';
import { Button, Checkbox, DatePicker, Form } from 'antd';
import MyTree from '../../components/MyTree';

import moment from 'moment';

import './style/predict.less';

export default function Predict(){
    
    const [ state, setState ] = useState({visible: false, data: null})
    const [ form ] = Form.useForm();

    const handleSubmit = async (values) => {
        
    }
    
    return <div className="flexbox" style={{height: '100%'}}>
        <div style={{height: '100%', width: 200, background: '#fff', overflowX: 'auto'}}>
            <MyTree data={[]} onClick={(data) => console.log(data)} width={300} />
        </div>
        <div className="flex1" style={{height: '100%', backgroundColor: '#fff', borderLeft: '1px solid #ececec', overflowY: 'auto'}}>
            <Form 
                form={form} 
                layout="inline"
                className="form-wrapper"
                initialValues={{gnss: true}}
            >
                <Form.Item name="gnss" valuePropName="checked">
                   <Checkbox disabled>GNSS</Checkbox>
                </Form.Item>
                <Form.Item name="yuliang" valuePropName="checked">
                   <Checkbox>雨量计</Checkbox>
                </Form.Item>
                <Form.Item name="shuiwei" valuePropName="checked">
                   <Checkbox>水位计</Checkbox>
                </Form.Item>
                <Form.Item name="dates" label="查询时段">
                   <DatePicker.RangePicker 
                        showTime={{
                         defaultValue: [moment('00:00:00', 'hh:mm:ss'), moment('23:59:59', 'hh:mm:ss')],
                        }}
                   />
                </Form.Item> 
                <Form.Item>
                    <Button type="primary">查询</Button>
                </Form.Item>    
            </Form>
            <div className='res-wrapper box-center-hoz box-center-ver'>
                <img src="" className="res-img" />
            </div>
        </div>
    </div>
}